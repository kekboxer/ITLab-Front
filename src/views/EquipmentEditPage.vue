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
              <b-form-group id="equipment-type-group" label="Тип оборудования">
                <autocomplete-input-component :stringify="onStringifyEquipmentType" :fetch="onChangeEquipmentType" :add="showEquipmentTypeModal" v-model="equipmentTypeSelected">
                  <template slot="result-item" slot-scope="data">
                    {{ data.item.title }}
                  </template>
                  <template slot="add-item" slot-scope="data">
                    Добавить
                    <b>{{ data.search }}</b>
                  </template>
                </autocomplete-input-component>
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
        <button type="button" class="btn btn-primary" :disabled="isEquipmentTypeModalInProcess" @click="onSubmitEquipmentType">Подтвердить</button>
      </template>
    </b-modal>
  </div>
</template>
<!-- TEMPALTE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { RouteConfig } from "vue-router";
import axios from "axios";

import LoadingStubComponent from "@/components/LoadingStubComponent.vue";
import AutocompleteInputComponent from "@/components/AutocompleteInputComponent.vue";

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
  None,
  InProcess,
  Error
}

@Component({
  components: {
    "loading-stub-component": LoadingStubComponent,
    "autocomplete-input-component": AutocompleteInputComponent
  }
})
export default class EquipmentEditPage extends Vue {
  loadingInProcess: boolean = false;
  equipment: Equipment = new EquipmentDefault;

  equipmentTypes: EquipmentType[] = [];
  equipmentTypeSelected: EquipmentType = { id: "", title: "", description: "" };

  equipmentTypeModalShow: boolean = false;
  equipmentTypeModalData: EquipmentType = new EquipmentTypeDefault;
  equipmentTypeModalState: State = State.None;

  pageState: State = State.None;
  isNewEquipment: boolean = false;

  mounted() {
    this.loadingInProcess = true;

    axios.get("EquipmentType").then(response => {
      const body = response && response.data;
      this.equipmentTypes = body.data;

      const equipmentId = this.$route.params.id;
      if (equipmentId && equipmentId != "new") {
        this.$store
          .dispatch(EQUIPMENT_FETCH_ONE, equipmentId)
          .then(equipment => {
            this.updateEquipment(equipment);
            this.loadingInProcess = false;
          });
      } else {
        this.isNewEquipment = true;
        this.loadingInProcess = false;
      }
    });
  }

  onStringifyEquipmentType(equipmentType: EquipmentType): string {
    return equipmentType.title;
  }

  onChangeEquipmentType(title: string, cb: Function) {
    const filterString = title.toLocaleLowerCase();

    cb(
      this.equipmentTypes.filter(
        v =>
          filterString == "" ||
          v.title.toLocaleLowerCase().indexOf(filterString) > -1
      )
    );
  }

  showEquipmentTypeModal(search: string) {
    this.equipmentTypeModalData.title = search;
    this.equipmentTypeModalShow = true;
  }

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

        this.equipmentTypeModalState = State.None;
        this.equipmentTypeModalShow = false;

        this.equipmentTypeModalData.title = "";
        this.equipmentTypeModalData.description = "";
      })
      .catch(error => {
        console.log(error);
        this.equipmentTypeModalState = State.Error;
      });
  }

  onSubmitEquipment() {
    if (this.equipmentTypeSelected) {
      this.pageState = State.InProcess;
      this.equipment.equipmentTypeId = this.equipmentTypeSelected.id;
      this.$store
        .dispatch(EQUIPMENT_COMMIT_ONE, this.equipment)
        .then(equipment => {
          this.updateEquipment(equipment);
          
          this.pageState = State.None;
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

  findEquipmentType(id: string): EquipmentType {
    const index = this.equipmentTypes.findIndex(e => e.id === id);
    return this.equipmentTypes[index];
  }

  updateEquipment(equipment: Equipment) {
    this.equipment = equipment;

    try {
      const equipmentType: EquipmentType = this.findEquipmentType(
        this.equipment.equipmentTypeId
      );

      this.equipmentTypeSelected = equipmentType;
    } catch (e) {}
  }

  get isPageInProcess(): boolean {
    return this.pageState == State.InProcess;
  }

  get isEquipmentTypeModalInProcess(): boolean {
    return this.equipmentTypeModalState == State.InProcess;
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