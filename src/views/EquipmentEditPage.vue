<!-- TEMPLATE BEGIN -->
<template>
  <div class="equipment-edit-page">
    <b-container class="content">
      <b-row>
        <b-col>
          <h3 class="page-title">Оборудование</h3>
        </b-col>
      </b-row>
      <br>

      <loading-stub-component v-if="loadingInProcess"></loading-stub-component>
      <div v-else>
        <b-row v-if="!isNewEquipment">
          <b-col v-bind:title="'Это временно'">
            ID:
            <span style="font-family: monospace">{{ equipment.id }}</span>
            <hr>
          </b-col>
        </b-row>

        <b-row>
          <b-col>
            <b-form @submit.prevent="onSubmit">
              <b-form-group id="equipment-type-group" label="Тип оборудования <b style='font-family: monospace'>(Заработает, когда equipmentType будет возвращаться как объект)</b>">
                <equipment-type-selection-component v-model="equipmentTypeSelected"></equipment-type-selection-component>
              </b-form-group>

              <b-form-group id="serial-number-title-group" label="Серийный номер" label-for="title-input">
                <b-form-input id="serial-number-input" type="text" v-model.trim="equipment.serialNumber">
                </b-form-input>
              </b-form-group>

              <b-form-group id="description-group" label="Описание" label-for="description-input">
                <b-form-textarea id="description-input" :rows="3" :max-rows="6" v-model="equipment.description">
                </b-form-textarea>
              </b-form-group>

              <b-form-row>
                <b-col>
                  <b-button class="submit-button" type="submit" variant="primary" :disabled="isPageInProcess">Подтвердить</b-button>
                </b-col>
              </b-form-row>
            </b-form>
          </b-col>
        </b-row>
      </div>
    </b-container>
  </div>
</template>
<!-- TEMPALTE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { RouteConfig } from "vue-router";
import axios from "axios";

import LoadingStubComponent from "@/components/LoadingStubComponent.vue";
import EquipmentTypeSelectionComponent from "@/components/EquipmentTypeSelectionComponent.vue";

import {
  EQUIPMENT_FETCH_ONE,
  EQUIPMENT_COMMIT_ONE
} from "@/store/actions/equipment";
import {
  Equipment,
  EquipmentDefault,
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
    "loading-stub-component": LoadingStubComponent,
    "equipment-type-selection-component": EquipmentTypeSelectionComponent
  }
})
export default class EquipmentEditPage extends Vue {
  // Page properties //
  ////////////////////

  pageState: State = State.Default;
  isNewEquipment: boolean = false;
  loadingInProcess: boolean = false;

  // Equipment properties //
  /////////////////////////

  equipment: Equipment = new EquipmentDefault();
  equipmentTypeSelected: EquipmentType = new EquipmentTypeDefault();

  mounted() {
    this.loadingInProcess = true;

    const equipmentId = this.$route.params.id;
    if (equipmentId && equipmentId != "new") {
      this.$store.dispatch(EQUIPMENT_FETCH_ONE, equipmentId).then(equipment => {
        this.setEquipment(equipment);

        this.loadingInProcess = false;
      });
    } else {
      this.isNewEquipment = true;
      this.loadingInProcess = false;
    }
  }

  // Equipment methods //
  //////////////////////

  onSubmit() {
    if (this.equipmentTypeSelected) {
      this.pageState = State.InProcess;
      this.equipment.equipmentTypeId = this.equipmentTypeSelected.id;
      this.$store
        .dispatch(EQUIPMENT_COMMIT_ONE, this.equipment)
        .then(equipment => {
          this.setEquipment(equipment);

          this.pageState = State.Default;
          if (this.isNewEquipment) {
            this.isNewEquipment = false;
            this.$router.push({ path: "/equipment/" + equipment.id });
          } else {
            this.$notify({
              title: "Изменения успешно сохранены",
              duration: 500
            });
          }
        })
        .catch(error => {
          this.pageState = State.Error;
        });
    }
  }

  setEquipment(equipment: Equipment) {
    this.equipment = equipment;
    this.equipmentTypeSelected = equipment.equipmentType
      ? equipment.equipmentType
      : new EquipmentTypeDefault();
  }

  get isPageInProcess(): boolean {
    return this.pageState == State.InProcess;
  }
}

export const equipmentEditPageRoute = <RouteConfig>{
  path: "/equipment/:id",
  name: "EquipmentEditPage",
  component: EquipmentEditPage
};
</script>
<!-- SCRIPT END -->


<!-- STYLES BEGIN -->
<style lang="scss">
</style>
<!-- STYLES END -->