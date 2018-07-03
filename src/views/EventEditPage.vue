<!-- TEMPALTE BEGIN -->
<template>
  <div class="event-edit-page">
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
                <event-type-selection-component v-model="eventTypeSelected"></event-type-selection-component>
              </b-form-group>

              <b-form-group id="event-title-group" label="Название" label-for="title-input">
                <b-form-input id="title-input" type="text" v-model.trim="event.title">
                </b-form-input>
              </b-form-group>

              <b-form-group id="event-description-group" label="Описание" label-for="description-input">
                <b-form-textarea id="description-input" :rows="3" :max-rows="6" v-model="event.description">
                </b-form-textarea>
              </b-form-group>

              <b-form-row class="range-selection">
                <b-col cols="12" sm="6">
                  <b-form-group id="event-begin-time-group" label="Начало" label-for="begin-time-input">
                    <date-picker id="begin-time-input" :first-day-of-week="1" input-class="form-control" v-model="eventBeginTimeInput" :format="DATETIME_FORMAT" lang="ru" type="datetime" :minute-step="1"></date-picker>
                  </b-form-group>
                </b-col>
                <b-col cols="12" sm="6">
                  <b-form-group id="event-end-time-group" label="Конец" label-for="end-time-input">
                    <date-picker id="end-time-input" :first-day-of-week="1" input-class="form-control" v-model="eventEndTimeInput" :format="DATETIME_FORMAT" lang="ru" type="datetime" :minute-step="1"></date-picker>
                  </b-form-group>
                </b-col>
              </b-form-row>

              <b-form-group id="event-address-group" label="Адрес" label-for="address-input">
                <b-form-textarea id="address-input" :rows="2" :max-rows="3" v-model="event.address">
                </b-form-textarea>
              </b-form-group>

              <b-form-group id="event-address-group" label="Кол-во участников" label-for="participants-count-input">
                <b-form-input id="participants-count-input" type="number" v-model.trim="event.neededParticipantsCount">
                </b-form-input>
              </b-form-group>

              <b-form-row>
                <b-col>
                  <b-button class="submit-button" type="submit" variant="primary" :disabled="isPageInProcess">Подтвердить</b-button>
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
import { RouteConfig } from "vue-router";
import moment from "moment-timezone";
import axios from "axios";

import DatePicker from "vue2-datepicker";
import LoadingStubComponent from "@/components/LoadingStubComponent.vue";
import EventTypeSelectionComponent from "@/components/EventTypeSelectionComponent.vue";

import { EVENTS_FETCH_ONE, EVENTS_COMMIT_ONE } from "@/store/actions/events";
import {
  Event,
  EventDefault,
  EventType,
  EventTypeDefault
} from "@/store/modules/events/types";

enum State {
  Default,
  InProcess,
  Error
}

@Component({
  components: {
    "date-picker": DatePicker,
    "loading-stub-component": LoadingStubComponent,
    "event-type-selection-component": EventTypeSelectionComponent
  }
})
export default class EventEditPage extends Vue {
  DATETIME_FORMAT = "DD.MM.YYYY HH:mm";

  // Page properties //
  ////////////////////

  pageState: State = State.Default;
  isNewEvent: boolean = false;
  loadingInProcess: boolean = false;

  // Event properties //
  /////////////////////

  event: Event = new EventDefault();
  eventBeginTimeInput: Date = new Date(0);
  eventEndTimeInput: Date = new Date(0);
  eventTypeSelected: EventType = new EventTypeDefault();

  // Component methods //
  //////////////////////

  mounted() {
    this.loadingInProcess = true;

    const eventId = this.$route.params.id;
    if (eventId && eventId != "new") {
      this.$store.dispatch(EVENTS_FETCH_ONE, eventId).then(event => {
        this.setEvent(event);

        this.loadingInProcess = false;
      });
    } else {
      this.isNewEvent = true;
      this.loadingInProcess = false;
    }
  }

  // Event methods //
  //////////////////

  onSubmitEvent() {
    if (
      this.eventTypeSelected &&
      this.eventBeginTimeInput != null &&
      this.eventEndTimeInput != null
    ) {
      this.pageState = State.InProcess;
      this.event.eventTypeId = this.eventTypeSelected.id;
      this.event.beginTime = moment(this.eventBeginTimeInput).toDate();
      this.event.endTime = moment(this.eventEndTimeInput).toDate();

      this.$store
        .dispatch(EVENTS_COMMIT_ONE, this.event)
        .then(event => {
          this.setEvent(event);

          this.pageState = State.Default;
          if (this.isNewEvent) {
            this.isNewEvent = false;
            this.$router.push({ path: "/events/edit/" + event.id });
          } else {
            this.$notify({
              title: "Изменения успешно сохранены",
              duration: 500
            });
          }
        })
        .catch(error => {
          this.pageState = State.Error;
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

  setEvent(event: Event) {
    this.event = event;
    this.eventBeginTimeInput = moment(this.event.beginTime).toDate();
    this.eventEndTimeInput = moment(this.event.endTime).toDate();
    this.eventTypeSelected = event.eventType
      ? event.eventType
      : new EventTypeDefault();
  }

  get isPageInProcess(): boolean {
    return this.pageState == State.InProcess;
  }
}

export const eventEditPageRoute = <RouteConfig>{
  path: "/events/edit/:id",
  name: "EventEditPage",
  component: EventEditPage
};
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
@import "@/styles/general.scss";

.event-edit-page {
  .mx-input-append {
    @include theme-specific() {
      background-color: getstyle(form-control-background-color);
    }
  }
}
</style>
<!-- STYLE END -->