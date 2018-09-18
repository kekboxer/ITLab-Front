<!-- TEMPALTE BEGIN -->
<template>
  <div class="event-detail-page">
    <page-content-component :loading="loadingInProcess" :not-found="notFound">
      <template slot="header">
        Событие&nbsp;
        <b-button variant="warning" :to="'/events/edit/' + event.id">Изменить</b-button>
      </template>

      <b-row>
        <b-col>
          <h3>{{ event.title }}
            <small>{{ event.eventType && event.eventType.title }}</small>
          </h3>
          <hr>

          <b-row>
            <b-col cols="12" md="8" class="order-2 order-md-1 markdown">
              <vue-markdown :html="false" :breaks="true" :linkify="true" :source="event.description"></vue-markdown>
            </b-col>
            <b-col cols="12" md="4" class="order-1 order-md-1">
              <b-row>
                <b-col cols="3">
                  <b>Начало:</b>
                </b-col>
                <b-col cols="9">{{ eventRange.beginTime ? formatDate(eventRange.beginTime) : "Неизвестно" }}</b-col>
              </b-row>
              <b-row>
                <b-col cols="3">
                  <b>Конец:</b>
                </b-col>
                <b-col cols="9">{{ eventRange.endTime ? formatDate(eventRange.endTime) : "Неизвестно" }}</b-col>
              </b-row>

              <template v-if="showElapsed && elapsedTime">
                (До события {{ elapsedTime }})<br>
              </template>
              <br>
              <b>Адрес:</b><br>
              <a :href="`https://maps.yandex.ru/?text=${ encodeURIComponent(event.address) }`" target="_blank">{{ event.address }}</a>
              <hr class="d-block d-md-none">
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
    </page-content-component>
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RouteConfig } from 'vue-router';
import moment from 'moment-timezone';

import VueMarkdown from 'vue-markdown';
import PageContentComponent from '@/components/PageContentComponent.vue';
import EventShiftsComponent from '@/components/EventShiftsComponent.vue';

import { Event, EventDefault, EVENTS_FETCH_ONE } from '@/modules/events';

@Component({
  components: {
    'vue-markdown': VueMarkdown,
    'page-content-component': PageContentComponent,
    'event-shifts-component': EventShiftsComponent
  }
})
export default class EventDetailPage extends Vue {
  // Parameters //
  ///////////////

  public loadingInProcess: boolean = false;
  public notFound: boolean = false;
  public event: Event = new EventDefault();

  // Component methods //
  //////////////////////

  public mounted() {
    this.loadingInProcess = true;

    const eventId = this.$route.params.id;
    if (eventId) {
      this.$store
        .dispatch(EVENTS_FETCH_ONE, eventId)
        .then((event) => {
          this.event = event;
          this.loadingInProcess = false;
        })
        .catch((error) => {
          this.notFound = true;
          this.loadingInProcess = false;
        });
    }
  }

  // Methods //
  ////////////

  public formatDate(date: Date): string {
    return moment(date).format(this.$g.DATETIME_FORMAT);
  }

  // Computed data //
  //////////////////

  get showElapsed(): boolean {
    if (!this.eventRange.beginTime) {
      return false;
    }

    return this.eventRange.beginTime && new Date() < this.eventRange.beginTime;
  }

  get elapsedTime(): string | null {
    if (!this.eventRange.beginTime) {
      return null;
    }

    const ms = moment(new Date()).diff(moment(this.eventRange.beginTime));
    return moment.duration(ms).humanize();
  }

  get eventRange(): { beginTime: Date | null; endTime: Date | null } {
    const shifts = this.event.shifts;
    if (!shifts || shifts.length === 0) {
      return { beginTime: null, endTime: null };
    }

    const result: { beginTime: Date; endTime: Date } = {
      beginTime: shifts[0].beginTime,
      endTime: shifts[0].endTime
    };

    if (shifts.length > 1) {
      shifts.map((shift) => {
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
}

export const eventDetailPageRoute = {
  path: '/events/:id',
  name: 'EventDetailPage',
  component: EventDetailPage
} as RouteConfig;
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
</style>
<!-- STYLE END -->
