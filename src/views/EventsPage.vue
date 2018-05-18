<!-- TEMPLATE BEGIN -->
<template>
  <div class="events-page">
    <b-container class="content">
      <b-row>
        <b-col class="page-title">
          <h1 class="page-title">События
            <b-button variant="success" to="event/new">Добавить</b-button>
          </h1>
        </b-col>
      </b-row>
      <br>

      <loading-stub-component v-if="loadingInProcess"></loading-stub-component>
      <div v-else>
        <b-row v-for="event in events" :key="event.title">
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

import { registerPage } from "@/router/PagesInformation";
import { Section, Group, registerSection } from "@/general/SectionLayout";

import EventItemComponent from "@/components/EventItemComponent.vue";
import LoadingStubComponent from "@/components/LoadingStubComponent.vue";

import { Event } from "@/store/modules/events/types";
import { EVENTS_FETCH, EVENTS_GET } from "@/store/actions/events";
import { Getter } from "vuex-class/lib/bindings";

import Icon from "vue-awesome/components/Icon"

import "vue-awesome/icons/plus"

export const eventsPageName: string = "EventsPage";

export const eventsSection: Section = new Section("События", {
  name: eventsPageName
});

@Component({
  name: eventsPageName,
  baseSection: eventsSection,
  components: {
    "icon": Icon,
    "event-item-component": EventItemComponent,
    "loading-stub-component": LoadingStubComponent
  }
})
class EventsPage extends Vue {
  loadingInProcess: boolean = true;

  beforeMount() {
    this.loadingInProcess = this.$store.getters[EVENTS_GET] == 0;
    this.$store
      .dispatch(EVENTS_FETCH)
      .then(result => {
        this.loadingInProcess = false;
      })
      .catch(result => {});
  }

  get events(): Event[] {
    return this.$store.getters[EVENTS_GET];
  }
}

registerSection(Group.General, eventsSection);

registerPage(
  {
    path: "/events",
    name: eventsPageName,
    component: EventsPage
  },
  {
    baseSection: eventsSection
  }
);

export default EventsPage;
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style>
</style>
<!-- STYLE END -->