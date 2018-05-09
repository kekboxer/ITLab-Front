<!-- TEMPLATE BEGIN -->
<template>
  <div class="events-page">
    <b-container class="content">
      <b-row>
        <b-col>
          <h1>События</h1>
        </b-col>
      </b-row>
      <br>

      <b-row v-for="event in events" :key="event.title">
        <b-col>
          <event-item-component :event-params="event"></event-item-component>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue } from "vue-property-decorator"

import { registerPage } from "@/router/PagesInformation"
import { Section, Group, registerSection } from "@/general/SectionLayout"

import EventItemComponent from "@/components/EventItemComponent.vue"

import { Event } from "@/store/modules/events/types"
import { EVENTS_FETCH, EVENTS_GET } from "@/store/actions/events"
import { Getter } from "vuex-class/lib/bindings";


export const eventsPageName: string = "EventsPage"

export const eventsSection: Section = new Section("События", {
  name: eventsPageName
})

@Component({
  name: eventsPageName,
  baseSection: eventsSection,
  components: {
    "event-item-component": EventItemComponent
  },
})
class EventsPage extends Vue {
  beforeMount() {
    this.$store.dispatch(EVENTS_FETCH)
    console.log(this.events)
  }

  @Getter(EVENTS_GET)
  events?: Event[]
}

registerSection(Group.General, eventsSection)

registerPage({
  path: "/events",
  name: eventsPageName,
  component: EventsPage
}, {
  baseSection: eventsSection
});

export default EventsPage;
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style>

</style>
<!-- STYLE END -->