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
            ID:
            <span style="font-family: monospace">{{ event.id }}</span>
            <hr>
          </b-col>
        </b-row>

        <b-row>
          <b-col>
            <b-form @submit.prevent="onSubmitEvent">
              <b-form-group id="event-type-group" label="Тип события">
                <div class="autocomplete-input" v-bind:class="{ 'hide-results': eventTypeResultsHidden }">
                  <input type="text" v-model="eventTypeSearchString" @input="onChangeEventType" @blur="onBlurEventType" class="form-control">
                  <ul class="results" v-show="!eventTypeResultsHidden && (eventTypeSearchString.length > 1 || eventTypeResults.length > 0)">
                    <li v-for="result in eventTypeResults" :key="result.id" class="result-item" @mousedown.prevent="selectEventType(result)">
                      {{ result.title}}
                      <small>{{ result.description }}</small>
                    </li>
                    <li class="add-item" v-show="eventTypeSearchString.length > 1">
                      Добавить
                      <b>{{ eventTypeSearchString }}</b> как тип события
                    </li>
                  </ul>
                </div>
              </b-form-group>

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
import axios from "axios";

import { EVENT_FETCH, EVENT_COMMIT, EVENTS_GET } from "@/store/actions/events";
import {
  Event,
  EventType,
  createDefaultEvent
} from "@/store/modules/events/types";

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

  eventTypes: EventType[] = [];
  eventTypeSearchString: string = "";
  eventTypeResults: EventType[] = [];
  eventTypeResultsHidden: boolean = true;
  eventTypeSelected?: EventType;

  pageState: State = State.None;
  isNewEvent: boolean = false;

  mounted() {
    const eventId = this.$route.params.id;
    if (eventId && eventId != "new") {
      this.loadingInProcess = true;

      this.fetchEventTypes("", true)
        .then(eventTypes => {
          this.eventTypes = eventTypes as EventType[];
          return this.$store.dispatch(EVENT_FETCH, eventId);
        })
        .then(event => {
          this.event = event;

          try {
            const eventType: EventType = this.findEventType(
              this.event.eventTypeId
            );

            this.selectEventType(eventType);
          } catch (e) {}

          this.loadingInProcess = false;
        });
    } else {
      this.isNewEvent = true;
    }
  }

  onChangeEventType() {
    this.eventTypeResultsHidden = false;
    this.fetchEventTypes(this.eventTypeSearchString, false).then(eventTypes => {
      this.eventTypeResults = eventTypes as EventType[];
    });
  }

  onBlurEventType() {
    this.eventTypeResultsHidden = true;
    if (this.eventTypeSelected) {
      this.eventTypeSearchString = this.eventTypeSelected.title;
    } else {
      this.eventTypeSearchString = "";
    }
  }

  selectEventType(eventType: EventType) {
    this.eventTypeSearchString = eventType.title;
    this.eventTypeSelected = eventType;
    this.eventTypeResultsHidden = true;
  }

  onSubmitEvent() {
    if (this.eventTypeSelected) {
      this.event.eventTypeId = this.eventTypeSelected.id;
      this.$store.dispatch(EVENT_COMMIT, this.event).then(event => {
        if (this.isNewEvent) {
          this.$router.push("event/" + event.id);
        }
      });
    }
  }

  fetchEventTypes(match: string = "", all: boolean = true) {
    return new Promise((resolve, reject) => {
      axios
        .get(`EventType?all=${all}&match=${match}`)
        .then(response => {
          const body = response.data;
          if (body.statusCode == 1) {
            const eventTypes: EventType[] = body.data;
            resolve(eventTypes);
          } else {
            reject();
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  findEventType(id: string): EventType {
    const index = this.eventTypes.findIndex(e => e.id === id);
    return this.eventTypes[index];
  }

  get isInProcess(): boolean {
    return this.pageState == State.InProcess;
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
<style lang="scss">
</style>
<!-- STYLE END -->