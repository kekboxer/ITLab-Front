<!-- TEMPLATE BEGIN -->
<template>
  <div class="c-equipment-selection">
    <autocomplete-input :stringify="onStringify" :fetch="onFetch" v-model="equipmentSelected" @input="onInput" :state="state" :filter="filter" :without-adding="true" :can-clear="true">
      <div slot="result-item" slot-scope="data">
        <b>{{ data.item.equipmentType.title }}</b><br>{{ data.item.serialNumber }}
      </div>
    </autocomplete-input>
  </div>
</template>
<!-- TEMPALTE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import axios from 'axios';

import CAutocompleteInput from '@/components/stuff/AutocompleteInput.vue';

import {
  IEquipment,
  EquipmentDefault,
  EQUIPMENT_SEARCH
} from '@/modules/equipment';

@Component({
  components: {
    'autocomplete-input': CAutocompleteInput
  }
})
export default class CEquipmentSelection extends Vue {
  // v-model //
  ////////////

  @Prop()
  public value?: IEquipment;

  @Prop()
  public state?: boolean;

  @Prop()
  public filter?: (equipment: IEquipment) => boolean;

  // Properties //
  ///////////////

  public equipmentSelected: IEquipment = new EquipmentDefault();

  // Component methods //
  //////////////////////

  public mounted() {
    this.$watch('value', (value?: IEquipment) => {
      this.equipmentSelected = value ? value : new EquipmentDefault();
    });

    this.equipmentSelected = this.value ? this.value : new EquipmentDefault();
  }

  public onInput() {
    this.$emit('input', this.equipmentSelected);
  }

  // Autocomplete input methods //
  ///////////////////////////////

  public onStringify(equipment: IEquipment): string {
    if (equipment.equipmentType) {
      return `${equipment.equipmentType.title} ${equipment.serialNumber}`;
    } else {
      return `${equipment.serialNumber}`;
    }
  }

  public onFetch(input: string, cb: (result: object[]) => void) {
    this.$store.dispatch(EQUIPMENT_SEARCH, input).then((equipment) => {
      cb(equipment as IEquipment[]);
    });
  }
}
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
@import '@/styles/general.scss';

.c-equipment-selection {
  .result-item {
    border-bottom: 1px solid rgba(0, 0, 0, 0.125);

    &:last-child {
      border-bottom: none;
    }
  }
}
</style>
<!-- STYLE END -->