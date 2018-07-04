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
                {{ event.description }}
                <br>
                <br>
              </b-col>
              <b-col cols="12" md="4">
                <div style="font-size: 1.2em">
                  <b>Начало:</b> {{ event.beginTime | moment("DD.MM.YYYY HH:mm") }}<br>
                  <b>Конец:&nbsp;&nbsp;</b> {{ event.endTime | moment("DD.MM.YYYY HH:mm") }}<br>
                  <template v-if="showElapsed">
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
                <span style="font-family: monospace; font-size: 1.2em">//NOTE: Здесь будет таблица со сменами и оборудованием</span>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
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

import { EVENTS_FETCH_ONE } from "@/store/actions/events";
import { Event, EventDefault } from "@/store/modules/events/types";

@Component({
  components: {
    "loading-stub-component": LoadingStubComponent
  }
})
export default class EventDetailPage extends Vue {
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
    return (new Date()) < this.event.beginTime;
  }

  get elapsedTime() {
    const ms = moment(new Date()).diff(moment(this.event.beginTime));
    return moment.duration(ms).humanize();
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
