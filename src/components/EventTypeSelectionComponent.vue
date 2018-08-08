<!-- TEMPLATE BEGIN -->
<template>
  <div class="event-type-selection-component">
    <autocomplete-input-component :stringify="onStringify" :fetch="onChange" :add="showModal" v-model="eventTypeSelected" @input="onInput">
      <template slot="result-item" slot-scope="data">
        {{ data.item.title }}
      </template>
      <template slot="add-item" slot-scope="data">
        Добавить
        <b>{{ data.search }}</b>
      </template>
    </autocomplete-input-component>

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
        <button type="button" class="btn btn-primary" :disabled="isModalInProcess" @click="onSubmit">Подтвердить</button>
      </template>
    </b-modal>
  </div>
</template>
<!-- TEMPALTE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import axios from "axios";

import AutocompleteInputComponent from "@/components/AutocompleteInputComponent.vue";

import { EventType, EventTypeDefault } from "@/store/modules/events/types";

enum State {
  Default,
  InProcess,
  Error
}

@Component({
  components: {
    "autocomplete-input-component": AutocompleteInputComponent
  }
})
export default class EventTypeSelectionComponent extends Vue {
  // v-model //
  ////////////

  @Prop() value?: EventType;

  // Properties //
  ///////////////

  eventTypeSelected: EventType = new EventTypeDefault();

  eventTypeModalShow: boolean = false;
  eventTypeModalData: EventType = new EventTypeDefault();
  eventTypeModalState: State = State.Default;

  // Component methods //
  //////////////////////

  mounted() {
    this.$watch("value", (value?: EventType) => {
      this.eventTypeSelected = value ? value : new EventTypeDefault();
    });

    this.eventTypeSelected = this.value ? this.value : new EventTypeDefault();
  }

  onInput() {
    this.$emit("input", this.eventTypeSelected);
  }

  // Autocomplete input methods //
  ///////////////////////////////

  onStringify(eventType: EventType): string {
    return eventType.title;
  }

  onChange(input: string, cb: Function) {
    this.fetchEventTypes(input, false).then(eventTypes => {
      cb(eventTypes as EventType[]);
    });
  }

  fetchEventTypes(match: string = "", all: boolean = true) {
    return new Promise((resolve, reject) => {
      axios
        .get(`EventType?all=${all}&match=${encodeURIComponent(match)}`)
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

  // Modal window methods //
  /////////////////////////

  onSubmit() {
    this.eventTypeModalState = State.InProcess;
    axios
      .post("EventType", {
        title: this.eventTypeModalData.title,
        description: this.eventTypeModalData.description
      })
      .then(response => {
        const body = response.data;
        this.eventTypeSelected = body.data as EventType;
        this.onInput();

        this.eventTypeModalState = State.Default;
        this.eventTypeModalShow = false;

        this.eventTypeModalData = new EventTypeDefault();
      })
      .catch(error => {
        console.log(error);
        this.eventTypeModalState = State.Error;
      });
  }

  showModal(search: string) {
    this.eventTypeModalData.title = search;
    this.eventTypeModalShow = true;
  }

  get isModalInProcess(): boolean {
    return this.eventTypeModalState == State.InProcess;
  }
}
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
</style>
<!-- STYLE END -->