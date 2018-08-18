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

    <b-modal v-model="modalVisible">
      <template slot="modal-title">
        Новый тип события
      </template>

      <b-form-group id="type-title-group" label="Название" label-for="type-title-input">
        <b-form-input id="type-title-input" type="text" v-model.trim="modalData.title">
        </b-form-input>
      </b-form-group>

      <b-form-group id="type-description-group" label="Описание" label-for="type-description-input">
        <b-form-input id="type-description-input" type="text" v-model.trim="modalData.description">
        </b-form-input>
      </b-form-group>

      <template slot="modal-footer">
        <button type="button" class="btn btn-secondary" @click="modalVisible = false">Отменить</button>
        <button type="button" class="btn btn-primary" :disabled="isModalInProcess" @click="onSubmitModal">Подтвердить</button>
      </template>
    </b-modal>
  </div>
</template>
<!-- TEMPALTE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import axios from 'axios';

import AutocompleteInputComponent from '@/components/AutocompleteInputComponent.vue';

import {
  EventType,
  EventTypeDefault,
  EVENT_TYPE_SEARCH,
  EVENT_TYPE_COMMIT
} from '@/store/modules/events';

enum ModalState {
  Hidden,
  Edit,
  InProcess,
  Error
}

@Component({
  components: {
    'autocomplete-input-component': AutocompleteInputComponent
  }
})
export default class EventTypeSelectionComponent extends Vue {
  // v-model //
  ////////////

  @Prop() public value?: EventType;

  // Properties //
  ///////////////

  public eventTypeSelected: EventType = new EventTypeDefault();

  public modalData: EventType = new EventTypeDefault();
  public modalState: ModalState = ModalState.Hidden;

  // Component methods //
  //////////////////////

  public mounted() {
    this.$watch('value', (value?: EventType) => {
      this.eventTypeSelected = value ? value : new EventTypeDefault();
    });

    this.eventTypeSelected = this.value ? this.value : new EventTypeDefault();
  }

  public onInput() {
    this.$emit('input', this.eventTypeSelected);
  }

  // Autocomplete input methods //
  ///////////////////////////////

  public onStringify(eventType: EventType): string {
    return eventType.title;
  }

  public onChange(input: string, cb: (result: object[]) => void) {
    this.$store
      .dispatch(EVENT_TYPE_SEARCH, { match: input })
      .then((eventTypes: EventType[]) => {
        cb(eventTypes);
      });
  }

  // Modal window methods //
  /////////////////////////

  get modalVisible(): boolean {
    return this.modalState !== ModalState.Hidden;
  }
  set modalVisible(show: boolean) {
    if (!show) {
      this.modalState = ModalState.Hidden;
    }
  }

  public onSubmitModal() {
    this.modalState = ModalState.InProcess;
    this.$store
      .dispatch(EVENT_TYPE_COMMIT, this.modalData)
      .then((eventType: EventType) => {
        this.eventTypeSelected = eventType;
        this.onInput();

        this.modalState = ModalState.Hidden;
        this.modalData = new EventTypeDefault();
      });
  }

  public showModal(search: string) {
    this.modalData.title = search;
    this.modalState = ModalState.Edit;
  }

  get isModalInProcess(): boolean {
    return this.modalState === ModalState.InProcess;
  }
}
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
</style>
<!-- STYLE END -->