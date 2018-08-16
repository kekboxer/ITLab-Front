<!-- TEMPLATE BEGIN -->
<template>
  <div class="equipment-type-selection-component">
    <autocomplete-input-component :stringify="onStringify" :fetch="onChange" :add="showModal" v-model="equipmentTypeSelected" @input="onInput">
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
        Новый тип оборудования
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
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import axios from "axios";

import AutocompleteInputComponent from "@/components/AutocompleteInputComponent.vue";

import {
  EquipmentType,
  EquipmentTypeDefault,
  EQUIPMENT_TYPE_SEARCH,
  EQUIPMENT_TYPE_COMMIT
} from "@/store/modules/equipment";

enum ModalState {
  Hidden,
  Edit,
  InProcess,
  Error
}

@Component({
  components: {
    "autocomplete-input-component": AutocompleteInputComponent
  }
})
export default class EquipmentTypeSelectionComponent extends Vue {
  // v-model //
  ////////////

  @Prop() value?: EquipmentType;

  // Properties //
  ///////////////

  equipmentTypeSelected: EquipmentType = new EquipmentTypeDefault();

  modalState: ModalState = ModalState.Hidden;
  modalData: EquipmentType = new EquipmentTypeDefault();

  // Component methods //
  //////////////////////

  mounted() {
    this.$watch("value", (value?: EquipmentType) => {
      this.equipmentTypeSelected = value ? value : new EquipmentTypeDefault();
    });

    this.equipmentTypeSelected = this.value
      ? this.value
      : new EquipmentTypeDefault();
  }

  onInput() {
    this.$emit("input", this.equipmentTypeSelected);
  }

  // Autocomplete input methods //
  ///////////////////////////////

  onStringify(equipmentType: EquipmentType) {
    return equipmentType.title;
  }

  onChange(title: string, cb: Function) {
    this.$store
      .dispatch(EQUIPMENT_TYPE_SEARCH, { match: title })
      .then((equipmentTypes: EquipmentType[]) => {
        cb(equipmentTypes);
      });
  }

  // Modal window methods //
  /////////////////////////

  get modalVisible(): boolean {
    return this.modalState != ModalState.Hidden;
  }
  set modalVisible(show: boolean) {
    if (!show) {
      this.modalState = ModalState.Hidden;
    }
  }

  onSubmitModal() {
    this.modalState = ModalState.InProcess;
    this.$store
      .dispatch(EQUIPMENT_TYPE_COMMIT, this.modalData)
      .then((equipmentType: EquipmentType) => {
        this.equipmentTypeSelected = equipmentType;
        this.onInput();

        this.modalState = ModalState.Hidden;
        this.modalData = new EquipmentTypeDefault();
      });
  }

  showModal(search: string) {
    this.modalData.title = search;
    this.modalState = ModalState.Edit;
  }

  get isModalInProcess(): boolean {
    return this.modalState == ModalState.InProcess;
  }
}
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
</style>
<!-- STYLE END -->