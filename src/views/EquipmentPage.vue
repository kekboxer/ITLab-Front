<!-- TEMPLATE BEGIN -->
<template>
  <div class="equipment-page">
    <b-container class="content">
      <b-row>
        <b-col>
          <h1 class="page-title">Оборудование
            <b-button variant="success" to="equipment/new">Добавить</b-button>
          </h1>
        </b-col>
      </b-row>
      <br>

      <loading-stub-component v-if="loadingInProcess"></loading-stub-component>
      <div v-else>
        <b-row class="d-lg-none">
          <b-col></b-col>
          <b-col cols="12" md="6 mr-auto">
            <b-input-group class="mb-2 pr-3">
              <b-form-input v-model="equipmentFilterString" placeholder="Поиск" />
              <b-input-group-append>
                <b-btn :disabled="!equipmentFilterString" @click="equipmentFilterString=''">
                  <icon name="times" style="position: relative; bottom: -3px;"></icon>
                </b-btn>
              </b-input-group-append>
            </b-input-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-table class="equipment-table" :hover="true" :fixed="true" :items="items" :fields="fields" :filter="onEquipmentTableFilter" :sort-compare="onEquipmentTableSort" @row-clicked="onEquipmentTableRowClicked">
              <template slot="HEAD_actions" slot-scope="data">
                <b-input-group class="actions-head">
                  <b-form-input v-model="equipmentFilterString" placeholder="Поиск" />
                  <b-input-group-append>
                    <b-btn :disabled="!equipmentFilterString" @click="equipmentFilterString=''">
                      <icon name="times" style="position: relative; bottom: -3px;"></icon>
                    </b-btn>
                  </b-input-group-append>
                </b-input-group>
              </template>

              <template slot="type" slot-scope="data">
                {{ data.item.equipmentType.title }}
              </template>
              <template slot="serialNumber" slot-scope="data">
                <span style="font-family: monospace">{{ data.item.serialNumber }}</span>
              </template>
              <template slot="actions" slot-scope="data" style="overflow: auto">
                <span class="actions-cell">
                  <b-button variant="warning" size="sm" :to="'equipment/' + data.item.id" class="mr-2" style="float: right">
                    Изменить
                  </b-button>
                  <b-button size="sm" @click.stop="data.toggleDetails" class="mr-2" style="float: right">
                    {{ data.detailsShowing ? "Свернуть" : "Подробнее" }}
                  </b-button>
                </span>
              </template>

              <template slot="row-details" slot-scope="data">
                <b-card>
                  <b-row class="mb-2">
                    <b-col sm="3" class="text-sm-right">
                      <b style="font-family: monospace">//TODO: add more information</b>
                    </b-col>
                  </b-row>
                </b-card>
              </template>
            </b-table>
          </b-col>
        </b-row>
      </div>
    </b-container>
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { RouteConfig } from "vue-router";
import axios from "axios";

import LoadingStubComponent from "@/components/LoadingStubComponent.vue";

import Icon from "vue-awesome/components/Icon";
import "vue-awesome/icons/times";

import { Equipment, EquipmentType } from "@/store/modules/equipment/types";
import {
  EQUIPMENT_FETCH_ALL,
  EQUIPMENT_GET_ALL
} from "@/store/actions/equipment";

@Component({
  components: {
    "loading-stub-component": LoadingStubComponent,
    Icon
  }
})
export default class EquipmentPage extends Vue {
  loadingInProcess: boolean = true;

  equipmentTypes: EquipmentType[] = [];
  equipmentFilterString: string = "";

  beforeMount() {
    this.loadingInProcess = this.$store.getters[EQUIPMENT_GET_ALL].length == 0;

    axios
      .get("EquipmentType")
      .then(result => {
        const body = result && result.data;
        this.equipmentTypes = body.data;
        return this.$store.dispatch(EQUIPMENT_FETCH_ALL);
      })
      .then(result => {
        this.loadingInProcess = false;
      })
      .catch(result => {});
  }

  onEquipmentTableFilter(v: any) {
    const filterString = this.equipmentFilterString.toLocaleLowerCase();
    return (
      this.equipmentFilterString == "" ||
      v.equipmentType.title.toLocaleLowerCase().indexOf(filterString) > -1 ||
      v.serialNumber.toLocaleLowerCase().indexOf(filterString) > -1
    );
  }

  onEquipmentTableSort(a: any, b: any, key: string) {
    if (key == "type") {
      return a.equipmentType.title.localeCompare(
        b.equipmentType.title,
        undefined,
        {
          numeric: true
        }
      );
    } else {
      return 0;
    }
  }

  onEquipmentTableRowClicked(data: Equipment) {
    if (window.innerWidth < 1170) {
      this.$router.push("/equipment/" + data.id);
    }
  }

  get fields() {
    return [
      {
        key: "type",
        label: "Тип",
        sortable: true
      },
      {
        key: "serialNumber",
        label: "Серийный номер"
      },
      {
        key: "actions",
        label: ""
      }
    ];
  }

  get items() {
    return this.$store.getters[EQUIPMENT_GET_ALL].map((value: Equipment) => {
      const equipmentType = this.equipmentTypes.find(
        v => v.id == value.equipmentTypeId
      );

      return {
        id: value.id,
        equipmentType: equipmentType
          ? equipmentType
          : <EquipmentType>{ id: "", title: "unknown" },
        serialNumber: value.serialNumber,
        _showDetails: false
      };
    });
  }
}

export const equipmentPageRoute = <RouteConfig>{
  path: "/equipment",
  name: "EquipmentPage",
  component: EquipmentPage
};
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
@import "@/styles/general.scss";

.equipment-page {
  .equipment-table {
    @include media-breakpoint-down(md) {
      .actions-head {
        display: none;
      }

      th[aria-colindex="3"],
      td[aria-colindex="3"] {
        display: none;
      }
    }
  }
}
</style>
<!-- STYLE END -->