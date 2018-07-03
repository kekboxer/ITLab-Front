<!-- TEMPLATE BEGIN -->
<template>
  <div class="equipment-type-selection-component">
    <autocomplete-input-component :stringify="onStringifyEquipmentType" :fetch="onChangeEquipmentType" :add="showEquipmentTypeModal" v-model="equipmentTypeSelected" @input="onInput">
      <template slot="result-item" slot-scope="data">
        {{ data.item.title }}
      </template>
      <template slot="add-item" slot-scope="data">
        Добавить
        <b>{{ data.search }}</b>
      </template>
    </autocomplete-input-component>

    <b-modal v-model="equipmentTypeModalShow">
      <template slot="modal-title">
        Новый тип оборудования
      </template>

      <b-form-group id="type-title-group" label="Название" label-for="type-title-input">
        <b-form-input id="type-title-input" type="text" v-model.trim="equipmentTypeModalData.title">
        </b-form-input>
      </b-form-group>

      <b-form-group id="type-description-group" label="Описание" label-for="type-description-input">
        <b-form-input id="type-description-input" type="text" v-model.trim="equipmentTypeModalData.description">
        </b-form-input>
      </b-form-group>

      <template slot="modal-footer">
        <button type="button" class="btn btn-secondary" @click="equipmentTypeModalShow = false">Отменить</button>
        <button type="button" class="btn btn-primary" :disabled="isModalInProcess" @click="onSubmitEquipmentType">Подтвердить</button>
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
  EquipmentTypeDefault
} from "@/store/modules/equipment/types";

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
export default class EquipmentTypeSelectionComponent extends Vue {
  // v-model //
  ////////////

  @Prop() value?: EquipmentType;

  // Properties //
  ///////////////

  equipmentTypeSelected: EquipmentType = new EquipmentTypeDefault();

  equipmentTypeModalShow: boolean = false;
  equipmentTypeModalData: EquipmentType = new EquipmentTypeDefault();
  equipmentTypeModalState: State = State.Default;

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

  onStringifyEquipmentType(equipmentType: EquipmentType) {
    return equipmentType.title;
  }

  onChangeEquipmentType(title: string, cb: Function) {
    this.fetchEquipmentTypes(title, false).then(equipmentTypes => {
      cb(equipmentTypes as EquipmentType[]);
    });
  }

  fetchEquipmentTypes(match: string = "", all: boolean) {
    return new Promise((resolve, reject) => {
      axios
        .get(`EquipmentType?all=${all}&match=${match}`)
        .then(response => {
          const body = response.data;
          if (body.statusCode == 1) {
            const equipmentTypes: EquipmentType[] = body.data;
            resolve(equipmentTypes);
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

  onSubmitEquipmentType() {
    this.equipmentTypeModalState = State.InProcess;
    axios
      .post("EquipmentType", {
        title: this.equipmentTypeModalData.title,
        description: this.equipmentTypeModalData.description
      })
      .then(response => {
        const body = response.data;
        this.equipmentTypeSelected = body.data as EquipmentType;
        this.onInput();

        this.equipmentTypeModalState = State.Default;
        this.equipmentTypeModalShow = false;

        this.equipmentTypeModalData = new EquipmentTypeDefault();
      })
      .catch(error => {
        console.log(error);
        this.equipmentTypeModalState = State.Error;
      });
  }

  showEquipmentTypeModal(search: string) {
    this.equipmentTypeModalData.title = search;
    this.equipmentTypeModalShow = true;
  }

  get isModalInProcess(): boolean {
    return this.equipmentTypeModalState == State.InProcess;
  }
}
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
</style>
<!-- STYLE END -->