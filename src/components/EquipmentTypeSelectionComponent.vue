<!-- TEMPLATE BEGIN -->
<template>
  <div class="equipment-type-selection-component">
    <autocomplete-input-component :stringify="onStringify" :fetch="onFetch" :add="showModal" :state="state" :filter="filter" v-model="equipmentTypeSelected" @input="onInput">
      <template slot="result-item" slot-scope="data">
        {{ data.item.title }}
      </template>
    </autocomplete-input-component>

    <equipment-type-modal-component v-model="modalVisible" :data="modalData" :onSubmit="onSubmitModal" />
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import axios from 'axios';

import AutocompleteInputComponent from '@/components/AutocompleteInputComponent.vue';
import EquipmentTypeModalComponent from '@/components/EquipmentTypeModalComponent.vue';

import {
  EquipmentType,
  EquipmentTypeDefault,
  EQUIPMENT_TYPE_SEARCH
} from '@/modules/equipment';

@Component({
  components: {
    'autocomplete-input-component': AutocompleteInputComponent,
    'equipment-type-modal-component': EquipmentTypeModalComponent
  }
})
export default class EquipmentTypeSelectionComponent extends Vue {
  // v-model //
  ////////////

  @Prop() public value?: EquipmentType;

  @Prop() public state?: boolean;

  @Prop() public filter?: (equipmentType: EquipmentType) => boolean;

  // Properties //
  ///////////////

  public equipmentTypeSelected: EquipmentType = new EquipmentTypeDefault();

  public modalVisible: boolean = false;
  public modalData: EquipmentType = new EquipmentTypeDefault();

  // Component methods //
  //////////////////////

  public mounted() {
    this.$watch('value', (value?: EquipmentType) => {
      this.equipmentTypeSelected = value ? value : new EquipmentTypeDefault();
    });

    this.equipmentTypeSelected = this.value
      ? this.value
      : new EquipmentTypeDefault();
  }

  public onInput() {
    this.$emit('input', this.equipmentTypeSelected);
  }

  // Autocomplete input methods //
  ///////////////////////////////

  public onStringify(equipmentType: EquipmentType) {
    return equipmentType.title;
  }

  public onFetch(title: string, cb: (result: object[]) => void) {
    this.$store
      .dispatch(EQUIPMENT_TYPE_SEARCH, { match: title })
      .then((equipmentTypes: EquipmentType[]) => {
        cb(equipmentTypes);
      });
  }

  // Modal window methods //
  /////////////////////////

  public showModal(search: string) {
    this.modalData = new EquipmentTypeDefault();
    this.modalData.title = search;

    this.modalVisible = true;
  }

  public onSubmitModal(equipmentType: EquipmentType) {
    this.equipmentTypeSelected = equipmentType;
    this.onInput();

    this.modalVisible = false;
  }
}
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
</style>
<!-- STYLE END -->