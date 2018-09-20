<!-- TEMPLATE BEGIN -->
<template>
  <div class="event-type-selection-component">
    <autocomplete-input-component :stringify="onStringify" :fetch="onChange" :add="showModal" :state="state" v-model="eventTypeSelected" @input="onInput">
      <template slot="result-item" slot-scope="data">
        {{ data.item.title }}
      </template>
    </autocomplete-input-component>

    <event-type-modal-component v-model="modalVisible" :data="modalData" :onSubmit="onSubmitModal" />
  </div>
</template>
<!-- TEMPALTE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import axios from 'axios';

import EventTypeModalComponent from '@/components/EventTypeModalComponent.vue';
import AutocompleteInputComponent from '@/components/AutocompleteInputComponent.vue';

import {
  EventType,
  EventTypeDefault,
  EVENT_TYPE_SEARCH
} from '@/modules/events';

@Component({
  components: {
    'event-type-modal-component': EventTypeModalComponent,
    'autocomplete-input-component': AutocompleteInputComponent
  }
})
export default class EventTypeSelectionComponent extends Vue {
  // v-model //
  ////////////

  @Prop() public value?: EventType;

  @Prop() public state?: boolean;

  // Properties //
  ///////////////

  public eventTypeSelected: EventType = new EventTypeDefault();

  public modalVisible: boolean = false;
  public modalData: EventType = new EventTypeDefault();

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
      })
      .catch();
  }

  // Modal window methods //
  /////////////////////////

  public onSubmitModal(eventType: EventType) {
    this.eventTypeSelected = eventType;
    this.onInput();

    this.modalVisible = false;
  }

  public showModal(search: string) {
    this.modalData = new EventTypeDefault();
    this.modalData.title = search;

    this.modalVisible = true;
  }
}
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
</style>
<!-- STYLE END -->