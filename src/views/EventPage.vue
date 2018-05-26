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
        <b-row v-if="!isNewEvent">
          <b-col v-bind:title="'Это временно'">
            ID: <span style="font-family: monospace">{{ event.id }}</span>
            <hr>
          </b-col>
        </b-row>

        <b-row>
          <b-col>
            <b-form @submit.prevent="onSubmitEvent">
              <b-form-group id="event-title-group" label="Название" label-for="title-input">
                <b-form-input id="title-input" type="text" v-model.trim="event.title">
                </b-form-input>
              </b-form-group>

              <b-form-group id="event-description-group" label="Описание" label-for="description-input">
                <b-form-textarea id="description-input" :rows="3" :max-rows="6" v-model="event.description">
                </b-form-textarea>
              </b-form-group>

              <b-form-row>
                <b-col>
                  <b-button class="submit-button" type="submit" variant="primary">Подтвердить</b-button>
                </b-col>
              </b-form-row>
            </b-form>
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
import { eventsSection } from "./EventsPage.vue";
import LoadingStubComponent from "@/components/LoadingStubComponent.vue";

import { EVENT_FETCH, EVENT_COMMIT, EVENTS_GET } from "@/store/actions/events";
import { Event, createDefaultEvent } from "@/store/modules/events/types";

export const eventPageName: string = "EventPageName";

enum State {
  None,
  InProcess,
  Error
}

@Component({
  name: eventPageName,
  baseSection: eventsSection,
  components: {
    "loading-stub-component": LoadingStubComponent
  }
})
class EventPage extends Vue {
  loadingInProcess: boolean = false;
  event: Event = createDefaultEvent();

  pageState: State = State.None;
  isNewEvent: boolean = false;

  mounted() {
    const eventId = this.$route.params.id;
    if (eventId && eventId != "new") {
      this.loadingInProcess = true;
      this.$store
        .dispatch(EVENT_FETCH, eventId)
        .then(event => {
          this.event = event;
          this.loadingInProcess = false;
        })
        .catch(error => {});
    } else {
      this.isNewEvent = true;
    }
  }

  onSubmitEvent() {
    this.$store.dispatch(EVENT_COMMIT, this.event).then(event => {
      if (this.isNewEvent) {
        this.$router.replace("event/" + event.id);
      }
    }).catch(error => {})
  }

  get isInProcess(): boolean {
    return this.pageState == State.InProcess;
  }

  /*
  get event(): Event {
    return this.$store.getters[EVENTS_GET].find(
      (value: any, index: any, obj: any) => {
        return value.id == this.eventId;
      }
    );
  }
  */
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