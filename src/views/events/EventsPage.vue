<!-- TEMPLATE BEGIN -->
<template>
  <div class="events-page">
    <b-container class="content">
      <b-row>
        <b-col>
          <h1 class="page-title">События
            <b-button variant="success" to="events/edit/new">Добавить</b-button>
          </h1>
        </b-col>
      </b-row>
      <br>
      <loading-stub-component v-if="loadingInProcess"></loading-stub-component>
      <div v-else>
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

      </div>
    </b-container>
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RouteConfig } from 'vue-router';
import axios from 'axios';

import EventItemComponent from '@/components/EventItemComponent.vue';
import LoadingStubComponent from '@/components/LoadingStubComponent.vue';

import {
  Event,
  EventType,
  EVENTS_FETCH_ALL,
  EVENTS_GET_ALL
} from '@/modules/events';

@Component({
  components: {
    'event-item-component': EventItemComponent,
    'loading-stub-component': LoadingStubComponent
  }
})
export default class EventsPage extends Vue {
  public loadingInProcess: boolean = true;

  public currentDate: Date = new Date();

  public pastEventsLoaded: boolean = false;
  public eventsShowPast: boolean = false;

  public beforeMount() {
    this.loadingInProcess = this.$store.getters[EVENTS_GET_ALL].length === 0;

    this.$store
      .dispatch(EVENTS_FETCH_ALL, {
        eventBegin: this.eventsShowPast ? undefined : this.currentDate
      })
      .then((result) => {
        this.loadingInProcess = false;
      });
  }

  public togglePastEvents() {
    if (!this.pastEventsLoaded && !this.eventsShowPast) {
      this.$store.dispatch(EVENTS_FETCH_ALL);
      this.pastEventsLoaded = true;
    }

    this.eventsShowPast = !this.eventsShowPast;
  }

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
        background-color: darken(
          getstyle(card-list-item-background-color),
          5%
        );
      }
    }
  }
}
</style>
<!-- STYLE END -->