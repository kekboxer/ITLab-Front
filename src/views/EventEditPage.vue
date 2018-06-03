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
                <autocomplete-input-component :stringify="onStringifyEventType" :fetch="onChangeEventType" :add="showEventTypeModal" v-model="eventTypeSelected">
                  <template slot="result-item" slot-scope="data">
                    {{ data.item.title }}
                  </template>
                  <template slot="add-item" slot-scope="data">
                    Добавить
                    <b>{{ data.search }}</b>
                  </template>
                </autocomplete-input-component>
              </b-form-group>

              <b-form-group id="event-title-group" label="Название" label-for="title-input">
                <b-form-input id="title-input" type="text" v-model.trim="event.title">
                </b-form-input>
              </b-form-group>

              <b-form-group id="event-description-group" label="Описание" label-for="description-input">
                <b-form-textarea id="description-input" :rows="3" :max-rows="6" v-model="event.description">
                </b-form-textarea>
              </b-form-group>

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

    <b-modal v-model="eventTypeModalShow">
      <template slot="modal-title">
        Новый тип события
      </template>

      <b-form-group id="type-title-group" label="Название" label-for="type-title-input">
        <b-form-input id="type-title-input" type="text" v-model.trim="eventTypeModalData.title">
        </b-form-input>
      </b-form-group>

      <b-form-group id="type-description-group" label="Описание" label-for="type-description-input">
        <b-form-input id="type-description-input" type="text" v-model.trim="eventTypeModalData.description">
        </b-form-input>
      </b-form-group>

      <template slot="modal-footer">
        <button type="button" class="btn btn-secondary" @click="eventTypeModalShow = false">Отменить</button>
        <button type="button" class="btn btn-primary" :disabled="isEventTypeModalInProcess" @click="onSubmitEventType">Подтвердить</button>
      </template>
    </b-modal>
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { RouteConfig } from "vue-router";
import axios from "axios";

import LoadingStubComponent from "@/components/LoadingStubComponent.vue";
import AutocompleteInputComponent from "@/components/AutocompleteInputComponent.vue";

import { EVENTS_FETCH_ONE, EVENTS_COMMIT_ONE } from "@/store/actions/events";
import {
  Event,
  EventType,
  createDefaultEvent
} from "@/store/modules/events/types";

enum State {
  None,
  InProcess,
  Error
}

@Component({
  components: {
    "loading-stub-component": LoadingStubComponent,
    "autocomplete-input-component": AutocompleteInputComponent
  }
})
export default class EventEditPage extends Vue {
  loadingInProcess: boolean = false;
  event: Event = createDefaultEvent();

  eventTypes: EventType[] = [];
  eventTypeSelected: EventType = { id: "", title: "", description: "" };

  eventTypeModalShow: boolean = false;
  eventTypeModalData: EventType = { id: "", title: "", description: "" };
  eventTypeModalState: State = State.None;

  pageState: State = State.None;
  isNewEvent: boolean = false;

  mounted() {
    this.loadingInProcess = true;

    this.fetchEventTypes("", true).then(eventTypes => {
      this.eventTypes = eventTypes as EventType[];

      const eventId = this.$route.params.id;
      if (eventId && eventId != "new") {
        this.$store.dispatch(EVENTS_FETCH_ONE, eventId).then(event => {
          this.updateEvent(event);
          this.loadingInProcess = false;
        });
      } else {
        this.isNewEvent = true;
        this.loadingInProcess = false;
      }
    });
  }

  onStringifyEventType(eventType: EventType): string {
    return eventType.title;
  }

  onChangeEventType(title: string, cb: Function) {
    this.fetchEventTypes(title, false).then(eventTypes => {
      cb(eventTypes as EventType[]);
    });
  }

  showEventTypeModal(search: string) {
    this.eventTypeModalData.title = search;
    this.eventTypeModalShow = true;
  }

  onSubmitEventType() {
    this.eventTypeModalState = State.InProcess;
    axios
      .post("EventType", {
        title: this.eventTypeModalData.title,
        description: this.eventTypeModalData.description
      })
      .then(response => {
        const body = response.data;
        this.eventTypeSelected = body.data as EventType;

        this.eventTypeModalState = State.None;
        this.eventTypeModalShow = false;

        this.eventTypeModalData.title = "";
        this.eventTypeModalData.description = "";
      })
      .catch(error => {
        console.log(error);
        this.eventTypeModalState = State.Error;
      });
  }

  onSubmitEvent() {
    if (this.eventTypeSelected) {
      this.pageState = State.InProcess;
      this.event.eventTypeId = this.eventTypeSelected.id;
      this.$store
        .dispatch(EVENTS_COMMIT_ONE, this.event)
        .then(event => {
          this.updateEvent(event);

          this.pageState = State.None;
          if (this.isNewEvent) {
            this.isNewEvent = false;
            this.$router.push({ path: "/events/" + event.id });
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

  findEventType(id: string): EventType {
    const index = this.eventTypes.findIndex(e => e.id === id);
    return this.eventTypes[index];
  }

  updateEvent(event: Event) {
    this.event = event;

    try {
      const eventType: EventType = this.findEventType(this.event.eventTypeId);

      this.eventTypeSelected = eventType;
    } catch (e) {}
  }

  get isPageInProcess(): boolean {
    return this.pageState == State.InProcess;
  }

  get isEventTypeModalInProcess(): boolean {
    return this.eventTypeModalState == State.InProcess;
  }
}

export const eventEditPageRoute = <RouteConfig>{
  path: "/events/:id",
  name: "EventEditPage",
  component: EventEditPage
};
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
</style>
<!-- STYLE END -->