<!-- TEMPLATE BEGIN -->
<template>
  <div class="c-equipment-type-selection">
    <autocomplete-input
      :stringify="onStringify"
      :fetch="onFetch"
      :add="showModal"
      :state="state"
      :filter="filter"
      :without-adding="!canEditEquipmentType"
      v-model="equipmentTypeSelected"
      @input="onInput"
    >
      <template slot="result-item" slot-scope="data">{{ data.item.title }}</template>
    </autocomplete-input>

    <equipment-type-modal v-model="modalVisible" :data="modalData" :onSubmit="onSubmitModal" />
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import axios from 'axios';

import CAutocompleteInput from '@/components/stuff/AutocompleteInput.vue';
import CEquipmentTypeModal from '@/components/modals/EquipmentTypeModal.vue';

import {
  IEquipmentType,
  EquipmentTypeDefault,
  EQUIPMENT_TYPE_SEARCH
} from '@/modules/equipment';

@Component({
  components: {
    'autocomplete-input': CAutocompleteInput,
    'equipment-type-modal': CEquipmentTypeModal
  }
})
export default class CEquipmentTypeSelection extends Vue {
  // v-model //
  ////////////

  @Prop()
  public value?: IEquipmentType;

  @Prop()
  public state?: boolean;

  @Prop()
  public filter?: (equipmentType: IEquipmentType) => boolean;

  // Properties //
  ///////////////

  public equipmentTypeSelected: IEquipmentType = new EquipmentTypeDefault();

  public modalVisible: boolean = false;
  public modalData: IEquipmentType = new EquipmentTypeDefault();

  public canEditEquipmentType: boolean | null = false;

  // Component methods //
  //////////////////////

  public async mounted() {
    this.$watch('value', (value?: IEquipmentType) => {
      this.equipmentTypeSelected = value ? value : new EquipmentTypeDefault();
    });

    this.equipmentTypeSelected = this.value
      ? this.value
      : new EquipmentTypeDefault();
    this.canEditEquipmentType = await this.$userManager.userHasRole(
      'CanEditEquipmentType'
    );
  }

  public onInput() {
    this.$emit('input', this.equipmentTypeSelected);
  }

  // Autocomplete input methods //
  ///////////////////////////////

  public onStringify(equipmentType: IEquipmentType) {
    return equipmentType.title;
  }

  public onFetch(title: string, cb: (result: object[]) => void) {
    this.$store
      .dispatch(EQUIPMENT_TYPE_SEARCH, { match: title })
      .then((equipmentTypes: IEquipmentType[]) => {
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

  public onSubmitModal(equipmentType: IEquipmentType) {
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