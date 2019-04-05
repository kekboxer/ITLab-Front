<!-- TEMPLATE BEGIN -->
<template>
  <div class="events-page">
    <page-content :loading="loadingInProcess">
      <template slot="header">События</template>
      <template slot="header-button">
        <b-button
          variant="success"
          to="events/edit/new"
          v-if="canEdit"
        >Добавить</b-button>
      </template>

      <b-row>
        <b-col
          cols="12"
          md="auto"
          class="ml-md-auto mr-md-3"
        >
          <b-button
            variant="secondary"
            style="width: 100%"
            @click="summaryVisible = true"
          >Итоги для повышки <icon name="table"></icon>
          </b-button>
        </b-col>
      </b-row>

      <b-row
        v-for="event in eventsCurrent"
        :key="event.id"
      >
        <b-col>
          <event-item :event="event"></event-item>
        </b-col>
      </b-row>

      <b-row>
        <b-col>
          <div
            class="load-more"
            @click="togglePastEvents"
          >
            <strong>
              {{ eventsShowPast ? "Скрыть" : "Показать" }} прошедшие события
            </strong>
          </div>
        </b-col>
      </b-row>

      <div v-if="eventsShowPast">
        <b-row
          v-for="event in eventsPast"
          :key="event.id"
        >
          <b-col>
            <event-item :event="event"></event-item>
          </b-col>
        </b-row>
      </div>

    </page-content>

    <summary-modal v-model="summaryVisible" />
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RouteConfig } from 'vue-router';
import axios from 'axios';

import CEventItem from '@/components/EventItem.vue';
import CPageContent from '@/components/layout/PageContent.vue';
import CSummaryModal from '@/components/modals/SummaryModal.vue';

import Icon from 'vue-awesome/components/Icon';

import 'vue-awesome/icons/table';

import {
  IEvent,
  IEventType,
  EVENTS_FETCH_ALL,
  EVENTS_GET_ALL
} from '@/modules/events';

const createEventSortPredicate = (asc: boolean = true) => (
  a: IEvent,
  b: IEvent
): number => {
  if (a.beginTime && b.beginTime && a.beginTime < b.beginTime) {
    return asc ? -1 : 1;
  } else if (a.beginTime && b.beginTime && a.beginTime > b.beginTime) {
    return asc ? 1 : -1;
  } else {
    return 0;
  }
};

@Component({
  components: {
    Icon,
    'event-item': CEventItem,
    'page-content': CPageContent,
    'summary-modal': CSummaryModal
  }
})
export default class EventsPage extends Vue {
  // Properties //
  ///////////////

  public loadingInProcess: boolean = true;

  public currentDate: Date = new Date();

  public pastEventsLoaded: boolean = false;
  public eventsShowPast: boolean = false;

  public summaryVisible: boolean = false;

  // Component methods //
  //////////////////////

  public mounted() {
    this.loadingInProcess = this.$store.getters[EVENTS_GET_ALL].length === 0;

    this.$store
      .dispatch(EVENTS_FETCH_ALL, {
        dateBegin: this.eventsShowPast ? undefined : this.currentDate
      })
      .then((result) => {
        this.loadingInProcess = false;
      });
  }

  // Methods //
  ////////////

  public togglePastEvents() {
    if (!this.pastEventsLoaded && !this.eventsShowPast) {
      this.$store.dispatch(EVENTS_FETCH_ALL);
      this.pastEventsLoaded = true;
    }

    this.eventsShowPast = !this.eventsShowPast;
  }

  // Computed data //
  //////////////////

  get eventsCurrent() {
    return (this.$store.getters[EVENTS_GET_ALL]({
      beginTime: this.currentDate
    }) as IEvent[]).sort(createEventSortPredicate());
  }

  get eventsPast() {
    return this.$store.getters[EVENTS_GET_ALL]({
      beginTime: this.currentDate,
      invert: true
    }).sort(createEventSortPredicate(false));
  }

  get canEdit(): boolean {
    return this.$g.hasRole('CanEditEvent');
  }
}

export const eventsPageRoute: RouteConfig = {
  path: '/events',
  name: 'EventsPage',
  component: EventsPage
};
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
@import '@/styles/general.scss';

.events-page {
  .load-more {
    @extend .noselect;

    cursor: pointer;

    margin: 10px;
    padding: 20px;
    border: 1px solid rgba(0, 0, 0, 0.125);
    box-shadow: -4px 0 0 rgba(0, 0, 0, 0.125);

    text-align: center;

    @include theme-specific() {
      background-color: getstyle(card-list-item-background-color);

      &:hover {
        background-color: darken(getstyle(card-list-item-background-color), 5%);
      }
    }
  }
}
</style>
<!-- STYLE END -->