<!-- TEMPLATE BEGIN -->
<template>
  <div class="equipment-page">
    <page-content-component :loading="loadingInProcess">
      <template slot="header">
        Оборудование&nbsp;
        <b-button variant="success" to="equipment/new">Добавить</b-button>
      </template>

      <b-row class="d-lg-none">
        <b-col cols="12" md="6 mr-auto">
          <b-input-group class="mb-2 pr-3">
            <input class="form-control" v-model="equipmentFilterString" placeholder="Поиск" type="text">
            <b-input-group-append>
              <b-btn :disabled="!equipmentFilterString" @click="equipmentFilterString=''">
                <icon name="times"></icon>
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
                <b-form-input v-model="equipmentFilterString" placeholder="Поиск" type="text"></b-form-input>
                <b-input-group-append>
                  <b-btn :disabled="!equipmentFilterString" @click="equipmentFilterString=''">
                    <icon name="times" style="position: relative; top: -2px;"></icon>
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
              Владелец:
              <template v-if="data.item.owner">
                <b>{{ data.item.owner.firstName }} {{ data.item.owner.lastName }}</b>,
                <mail-link :email="data.item.owner.email" />
              </template>
              <template v-else>
                Лаборатория
              </template>
            </template>
          </b-table>
        </b-col>
      </b-row>
    </page-content-component>
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RouteConfig } from 'vue-router';
import axios from 'axios';

import PageContentComponent from '@/components/PageContentComponent.vue';
import MailLinkComponent from '@/components/MailLinkComponent.vue';

import Icon from 'vue-awesome/components/Icon';
import 'vue-awesome/icons/times';
import 'vue-awesome/icons/plus';

import {
  Equipment,
  EquipmentType,
  EQUIPMENT_FETCH_ALL,
  EQUIPMENT_GET_ALL
} from '@/modules/equipment';

import { User, USERS_FETCH_ALL } from '@/modules/users';

@Component({
  components: {
    Icon,
    'mail-link': MailLinkComponent,
    'page-content-component': PageContentComponent
  }
})
export default class EquipmentPage extends Vue {
  public loadingInProcess: boolean = true;

  public users: User[] = [];
  public equipmentFilterString: string = '';

  public beforeMount() {
    this.loadingInProcess = this.$store.getters[EQUIPMENT_GET_ALL].length === 0;

    this.$store
      .dispatch(USERS_FETCH_ALL)
      .then((users: User[]) => {
        this.users = users;
        return this.$store.dispatch(EQUIPMENT_FETCH_ALL);
      })
      .then((result) => {
        this.loadingInProcess = false;
      });
  }

  public onEquipmentTableFilter(v: any) {
    const filterStrings = this.equipmentFilterString
      .toLocaleLowerCase()
      .split(' ');

    return (
      this.equipmentFilterString === '' ||
      filterStrings.find(
        (filter) =>
          v.equipmentType.title.toLocaleLowerCase().indexOf(filter) > -1
      ) ||
      filterStrings.find(
        (filter) => v.serialNumber.toLocaleLowerCase().indexOf(filter) > -1
      ) ||
      filterStrings.find(
        (filter) =>
          v.owner && v.owner.email.toLocaleLowerCase().indexOf(filter) > -1
      )
    );
  }

  public onEquipmentTableSort(a: any, b: any, key: string) {
    if (key === 'type') {
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

  public onEquipmentTableRowClicked(data: Equipment) {
    if (window.innerWidth < 1170) {
      this.$router.push('/equipment/' + data.id);
    }
  }

  get fields() {
    return [
      {
        key: 'type',
        label: 'Тип',
        sortable: true
      },
      {
        key: 'serialNumber',
        label: 'Серийный номер'
      },
      {
        key: 'actions',
        label: ''
      }
    ];
  }

  get items() {
    return this.$store.getters[EQUIPMENT_GET_ALL].map(
      (equipment: Equipment) => {
        const owner = this.users.find((user) => user.id === equipment.ownerId);

        return {
          ...equipment,
          owner,
          _showDetails: false
        };
      }
    );
  }
}

export const equipmentPageRoute: RouteConfig = {
  path: '/equipment',
  name: 'EquipmentPage',
  component: EquipmentPage
};
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
@import '@/styles/general.scss';

.equipment-page {
  .equipment-table {
    @include media-breakpoint-down(md) {
      .actions-head {
        display: none;
      }

      th[aria-colindex='3'],
      td[aria-colindex='3'] {
        display: none;
      }
    }

    tr td {
      line-height: 31px;
    }

    .b-table-has-details {
      background-color: rgba(0, 0, 0, 0.075);

      td {
        padding-bottom: 0px;
      }
    }

    .b-table-details {
      background-color: rgba(0, 0, 0, 0.075);

      td {
        padding: 12px;
        padding-top: 0px;
      }
    }

    .equipment-details {
      @include theme-specific() {
        background-color: getstyle(page-background-color);
      }
    }
  }
}
</style>
<!-- STYLE END -->