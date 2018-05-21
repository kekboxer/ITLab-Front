<!-- TEMPALTE BEGIN -->
<template>
  <div class="event-page">
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
          <b-col><h3>{{ eventId }}</h3></b-col>
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
import { eventsSection } from "./EventsPage.vue";
import LoadingStubComponent from "@/components/LoadingStubComponent.vue";

import { EVENT_FETCH, EVENTS_GET } from "@/store/actions/events";
import { Event } from "@/store/modules/events/types";

export const eventPageName: string = "EventPageName";

@Component({
  name: eventPageName,
  baseSection: eventsSection,
  components: {
    "loading-stub-component": LoadingStubComponent
  }
})
class EventPage extends Vue {
  loadingInProcess: boolean = true;

  mounted() {
    if (this.eventId) {
      this.$store
        .dispatch(EVENT_FETCH, this.eventId)
        .then(result => {
          this.loadingInProcess = false;
        })
        .catch(result => {});
    } else {
      console.log("ASD")
    }
  }

  get eventId(): string {
    return this.$route.params.id;
  }

  get titleItems(): any[] {
    return [
      {
        text: "События",
        href: "/events"
      },
      {
        text: this.event.id
      }
    ];
  }

  get event(): Event {
    return this.$store.getters[EVENTS_GET].find(
      (value: any, index: any, obj: any) => {
        return value.id == this.eventId;
      }
    );
  }
}

registerPage(
  {
    path: "/event/:id",
    name: eventPageName,
    component: EventPage
  },
  {
    baseSection: eventsSection
  }
);

export default EventPage;
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style>
</style>
<!-- STYLE END -->