<!-- TEMPLATE BEGIN -->
<template>
  <div class="equipment-selection-component">
    <autocomplete-input-component :stringify="onStringify" :fetch="onFetch" v-model="equipmentSelected" @input="onInput" :without-adding="true" :can-clear="true">
      <div slot="result-item" slot-scope="data">
        <b>{{ data.item.equipmentType.title }}</b><br>{{ data.item.serialNumber }}
      </div>
    </autocomplete-input-component>
  </div>
</template>
<!-- TEMPALTE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import axios from 'axios';

import AutocompleteInputComponent from '@/components/AutocompleteInputComponent.vue';

import {
  Equipment,
  EquipmentDefault,
  EQUIPMENT_SEARCH
} from '@/store/modules/equipment';

@Component({
  components: {
    'autocomplete-input-component': AutocompleteInputComponent
  }
})
export default class EquipmentSelectionComponent extends Vue {
  // v-model //
  ////////////

  @Prop() public value?: Equipment;

  // Properties //
  ///////////////

  public equipmentSelected: Equipment = new EquipmentDefault();

  // Component methods //
  //////////////////////

  public mounted() {
    this.$watch('value', (value?: Equipment) => {
      this.equipmentSelected = value ? value : new EquipmentDefault();
    });

    this.equipmentSelected = this.value ? this.value : new EquipmentDefault();
  }

  public onInput() {
    this.$emit('input', this.equipmentSelected);
  }

  // Autocomplete input methods //
  ///////////////////////////////

  public onStringify(equipment: Equipment): string {
    if (equipment.equipmentType) {
      return `${equipment.equipmentType.title} ${equipment.serialNumber}`;
    } else {
      return `${equipment.serialNumber}`;
    }
  }

  public onFetch(input: string, cb: (result: object[]) => void) {
    this.$store.dispatch(EQUIPMENT_SEARCH, input).then((equipment) => {
      cb(equipment as Equipment[]);
    });
  }
}
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
@import '@/styles/general.scss';

.equipment-selection-component {
  .result-item {
    border-bottom: 1px solid rgba(0, 0, 0, 0.125);

    &:last-child {
      border-bottom: none;
    }
  }
}
</style>
<!-- STYLE END -->