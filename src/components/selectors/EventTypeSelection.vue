<!-- TEMPLATE BEGIN -->
<template>
  <div class="c-event-type-selection">
    <autocomplete-input :stringify="onStringify" :fetch="onChange" :add="showModal" :state="state" :filter="filter" v-model="eventTypeSelected" @input="onInput">
      <template slot="result-item" slot-scope="data">
        {{ data.item.title }}
      </template>
    </autocomplete-input>

    <event-type-modal v-model="modalVisible" :data="modalData" :onSubmit="onSubmitModal" />
  </div>
</template>
<!-- TEMPALTE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import axios from 'axios';

import CEventTypeModal from '@/components/modals/EventTypeModal.vue';
import CAutocompleteInput from '@/components/stuff/AutocompleteInput.vue';

import {
  IEventType,
  EventTypeDefault,
  EVENT_TYPE_SEARCH
} from '@/modules/events';

@Component({
  components: {
    'event-type-modal': CEventTypeModal,
    'autocomplete-input': CAutocompleteInput
  }
})
export default class EventTypeSelectionComponent extends Vue {
  // v-model //
  ////////////

  @Prop()
  public value?: IEventType;

  @Prop()
  public state?: boolean;

  @Prop()
  public filter?: (eventType: IEventType) => boolean;

  // Properties //
  ///////////////

  public eventTypeSelected: IEventType = new EventTypeDefault();

  public modalVisible: boolean = false;
  public modalData: IEventType = new EventTypeDefault();

  // Component methods //
  //////////////////////

  public mounted() {
    this.$watch('value', (value?: IEventType) => {
      this.eventTypeSelected = value ? value : new EventTypeDefault();
    });

    this.eventTypeSelected = this.value ? this.value : new EventTypeDefault();
  }

  public onInput() {
    this.$emit('input', this.eventTypeSelected);
  }

  // Autocomplete input methods //
  ///////////////////////////////

  public onStringify(eventType: IEventType): string {
    return eventType.title;
  }

  public onChange(input: string, cb: (result: object[]) => void) {
    this.$store
      .dispatch(EVENT_TYPE_SEARCH, { match: input })
      .then((eventTypes: IEventType[]) => {
        cb(eventTypes);
      })
      .catch();
  }

  // Modal window methods //
  /////////////////////////

  public onSubmitModal(eventType: IEventType) {
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