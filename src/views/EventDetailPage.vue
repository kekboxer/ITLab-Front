<!-- TEMPALTE BEGIN -->
<template>
  <div class="event-detail-page">
    <b-container class="content">
      <b-row>
        <b-col>
          <h3 class="page-title">Событие</h3>
        </b-col>
      </b-row>
      <br>

      <loading-stub-component v-if="loadingInProcess"></loading-stub-component>
      <div v-else>
        <b-row>
          <b-col>
            <h3>{{ event.title }}
              <small>{{ event.eventType && event.eventType.title }}</small>
            </h3>
            <hr>

            <b-row>
              <b-col cols="12" md="8" style="font-size: 1.1em">
                <vue-markdown :source="event.description"></vue-markdown>
                <br>
                <br>
              </b-col>
              <b-col cols="12" md="4">
                <div style="font-size: 1.2em">
                  <b>Начало:</b> {{ eventRange.beginTime ? formatDate(eventRange.beginTime) : "Неизвестно" }}<br>
                  <b>Конец:&nbsp;&nbsp;</b> {{ eventRange.endTime ? formatDate(eventRange.endTime) : "Неизвестно" }}<br>
                  <template v-if="showElapsed && elapsedTime">
                    (До события {{ elapsedTime }})<br>
                  </template>
                  <br>
                  <b>Адрес:</b><br> {{ event.address }}
                </div>
              </b-col>
            </b-row>
            <hr>
            <b-row>
              <b-col>
                <event-shifts-component v-model="event.shifts" :editable="false">
                </event-shifts-component>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
        <br>
      </div>
    </b-container>
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { RouteConfig, Route } from "vue-router";
import moment from "moment-timezone";

import LoadingStubComponent from "@/components/LoadingStubComponent.vue";
import EventShiftsComponent from "@/components/EventShiftsComponent.vue";
import VueMarkdown from "vue-markdown";

import { Event, EventDefault, EVENTS_FETCH_ONE } from "@/store/modules/events";

@Component({
  components: {
    "loading-stub-component": LoadingStubComponent,
    "event-shifts-component": EventShiftsComponent,
    "vue-markdown": VueMarkdown
  }
})
export default class EventDetailPage extends Vue {
  DATE_FORMAT: string = "DD.MM.YYYY HH:mm";

  loadingInProcess: boolean = false;
  event: Event = new EventDefault();

  mounted() {
    this.loadingInProcess = true;

    const eventId = this.$route.params.id;
    if (eventId) {
      this.$store.dispatch(EVENTS_FETCH_ONE, eventId).then(event => {
        this.event = event;

        this.loadingInProcess = false;
      });
    }
  }

  get showElapsed(): boolean {
    if (!this.eventRange.beginTime) return false;

    return this.eventRange.beginTime && new Date() < this.eventRange.beginTime;
  }

  get elapsedTime(): string | null {
    if (!this.eventRange.beginTime) return null;

    const ms = moment(new Date()).diff(moment(this.eventRange.beginTime));
    return moment.duration(ms).humanize();
  }

  get eventRange(): { beginTime: Date | null; endTime: Date | null } {
    const shifts = this.event.shifts;
    if (!shifts || shifts.length == 0)
      return { beginTime: null, endTime: null };

    const result: { beginTime: Date; endTime: Date } = {
      beginTime: shifts[0].beginTime,
      endTime: shifts[0].endTime
    };

    if (shifts.length > 1) {
      shifts.map(shift => {
        if (shift.beginTime < result.beginTime) {
          result.beginTime = shift.beginTime;
        }
        if (shift.endTime > result.endTime) {
          result.endTime = shift.endTime;
        }
      });
    }

    return result;
  }

  formatDate(date: Date): string {
    return moment(date).format(this.DATE_FORMAT);
  }
}

export const eventDetailPage = <RouteConfig>{
  path: "/events/:id",
  name: "EventDetailPage",
  component: EventDetailPage
};
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
</style>
<!-- STYLE END -->
