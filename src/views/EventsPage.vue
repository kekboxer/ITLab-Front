<!-- TEMPLATE BEGIN -->
<template>
  <div class="events-page">
    <b-container class="content">
      <b-row>
        <b-col>
          <h1>События</h1>
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

export const eventsPageName: string = "EventsPage"

export const eventsSection: Section = new Section("События", {
  name: eventsPageName
})

@Component({
  name: eventsPageName,
  baseSection: eventsSection
})
class EventsPage extends Vue {

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