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


export const eventsPageName: string = "EventsPage"

export const eventsSection: Section = new Section("События", {
  name: eventsPageName
})

@Component({
  name: eventsPageName,
  baseSection: eventsSection,
  components: {
    "event-item-component": EventItemComponent
  }
})
class EventsPage extends Vue {
  events: Event[] = [
    {
      id: "test",
      title: "Выезд в школу",
      //date: new Date(),
      description: "Test description as",
      //duration: "2 часа",
      address: "Пролетарский проспект, д.7",

      participantsNeeded: 10,
      participantCount: 4
    }
  ]
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