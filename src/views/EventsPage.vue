<!-- TEMPLATE BEGIN -->
<template>
  <div class="events-page">
    <b-container class="content">
      <b-row>
        <b-col>
          <h1 class="page-title">События
            <b-button variant="success" to="events/new">Добавить</b-button>
          </h1>
        </b-col>
      </b-row>
      <br>
      <loading-stub-component v-if="loadingInProcess"></loading-stub-component>
      <div v-else>
        <b-row v-for="event in events" :key="event.id">
          <b-col>
            <event-item-component :event-params="event"></event-item-component>
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
import { RouteConfig } from "vue-router";
import axios from "axios";

import EventItemComponent from "@/components/EventItemComponent.vue";
import LoadingStubComponent from "@/components/LoadingStubComponent.vue";

import { Event, EventType } from "@/store/modules/events/types";
import { EVENTS_FETCH_ALL, EVENTS_GET_ALL } from "@/store/actions/events";
import { Getter } from "vuex-class/lib/bindings";

@Component({
  components: {
    "event-item-component": EventItemComponent,
    "loading-stub-component": LoadingStubComponent
  }
})
export default class EventsPage extends Vue {
  loadingInProcess: boolean = true;

  eventTypes: EventType[] = [];

  beforeMount() {
    this.loadingInProcess = this.$store.getters[EVENTS_GET_ALL].length == 0;

    axios
      .get("EventType?all=true")
      .then(result => {
        const body = result && result.data;
        this.eventTypes = body.data;
        return this.$store.dispatch(EVENTS_FETCH_ALL);
      })
      .then(result => {
        this.loadingInProcess = false;
      })
      .catch(result => {});
  }

  get events() {
    return this.$store.getters[EVENTS_GET_ALL].map((value: any) => {
      value.eventType = this.eventTypes.find(v => v.id == value.eventTypeId);
      return value;
    })
  }
}

export const eventsPageRoute = <RouteConfig>{
  path: "/events",
  name: "EventsPage",
  component: EventsPage
};
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
</style>
<!-- STYLE END -->