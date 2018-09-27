<!-- TEMPLATE BEGIN -->
<template>
  <div class="events-page">
    <page-content-component :loading="loadingInProcess">
      <template slot="header">
        События&nbsp;
        <b-button variant="success" to="events/edit/new" v-if="canEdit">Добавить</b-button>
      </template>

      <b-row v-for="event in eventsCurrent" :key="event.id">
        <b-col>
          <event-item-component :event="event"></event-item-component>
        </b-col>
      </b-row>

      <b-row>
        <b-col>
          <div class="load-more" @click="togglePastEvents">
            <strong>
              {{ eventsShowPast ? "Скрыть" : "Показать" }} прошедшие события
            </strong>
          </div>
        </b-col>
      </b-row>

      <div v-if="eventsShowPast">
        <b-row v-for="event in eventsPast" :key="event.id">
          <b-col>
            <event-item-component :event="event"></event-item-component>
          </b-col>
        </b-row>
      </div>

    </page-content-component>
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RouteConfig } from 'vue-router';
import axios from 'axios';

import EventItemComponent from '@/components/EventItemComponent.vue';
import PageContentComponent from '@/components/PageContentComponent.vue';

import {
  IEvent,
  IEventType,
  EVENTS_FETCH_ALL,
  EVENTS_GET_ALL
} from '@/modules/events';

@Component({
  components: {
    'event-item-component': EventItemComponent,
    'page-content-component': PageContentComponent
  }
})
export default class EventsPage extends Vue {
  // Properties //
  ///////////////

  public loadingInProcess: boolean = true;

  public currentDate: Date = new Date();

  public pastEventsLoaded: boolean = false;
  public eventsShowPast: boolean = false;

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
    return this.$store.getters[EVENTS_GET_ALL]({
      beginTime: this.currentDate
    });
  }

  get eventsPast() {
    return this.$store.getters[EVENTS_GET_ALL]({
      beginTime: this.currentDate,
      invert: true
    });
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