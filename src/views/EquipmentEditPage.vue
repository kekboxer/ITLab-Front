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
            <b-form @submit.prevent="onSubmitEquipment">

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
                  <b-button class="submit-button" type="submit" variant="primary" :disabled="isInProcess">Подтвердить</b-button>
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

import {
  EQUIPMENT_FETCH_ONE,
  EQUIPMENT_COMMIT_ONE
} from "@/store/actions/equipment";
import {
  Equipment,
  EquipmentType,
  createDefaultEquipment
} from "@/store/modules/equipment/types";

enum State {
  None,
  InProcess,
  Error
}

@Component({
  components: {
    "loading-stub-component": LoadingStubComponent
  }
})
export default class EquipmentEditPage extends Vue {
  loadingInProcess: boolean = false;
  equipment: Equipment = createDefaultEquipment();

  pageState: State = State.None;
  isNewEquipment: boolean = false;

  mounted() {
    const equipmentId = this.$route.params.id;
    if (equipmentId && equipmentId != "new") {
      this.loadingInProcess = true;

      this.$store.dispatch(EQUIPMENT_FETCH_ONE, equipmentId).then(equipment => {
        this.equipment = equipment;
        this.loadingInProcess = false;
      });
    } else {
      this.isNewEquipment = true;
    }
  }

  onSubmitEquipment() {
    this.$store.dispatch(EQUIPMENT_COMMIT_ONE, this.equipment).then(equipment => {
      if (this.isNewEquipment) {
        this.$router.push("/equipment/" + equipment.id);
      } else {
        this.$notify({
          title: "Изменения успешно сохранены",
          duration: 500
        });
        this.pageState = State.None;
      }
    });
  }

  get isInProcess(): boolean {
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