<!-- TEMPLATE BEGIN -->
<template>
  <div class="type-edit-page">
    <page-content-component :loading="loadingInProcess">
      <template slot="header">
        Типы
      </template>

      <b-tabs>
        <b-tab title="События" active>
          <br>
          <b-table :hover="true" :fixed="true" :items="eventTypes" :fields="eventTypesFields">
            <template slot="title" slot-scope="data">
              {{ data.item.title }}
            </template>
          </b-table>
        </b-tab>
        <b-tab title="Оборудование">
          <br>
          <b-table :hover="true" :fixed="true" :items="equipmentTypes" :fields="equipmentTypesFields">
            <template slot="title" slot-scope="data">
              {{ data.item.title }}
            </template>
          </b-table>
        </b-tab>
      </b-tabs>
    </page-content-component>
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import {
  EquipmentType,
  EQUIPMENT_GET_ALL,
  EQUIPMENT_FETCH_ALL,
  EQUIPMENT_TYPES_FETCH_ALL,
  EQUIPMENT_TYPES_GET_ALL
} from '@/modules/equipment';
import { RouteConfig } from 'vue-router';

import PageContentComponent from '@/components/PageContentComponent.vue';
import {
  EVENT_TYPES_FETCH_ALL,
  EventType,
  EVENT_TYPES_GET_ALL
} from '@/modules/events';

@Component({
  components: {
    'page-content-component': PageContentComponent
  }
})
export default class TypeEditPage extends Vue {
  // Properties //
  ///////////////

  public loadingInProcess: boolean = true;

  // Component methods //
  //////////////////////

  public mounted() {
    Promise.all([
      this.$store.dispatch(EVENT_TYPES_FETCH_ALL),
      this.$store.dispatch(EQUIPMENT_TYPES_FETCH_ALL)
    ])
      .then((results) => {
        this.loadingInProcess = false;
      })
      .catch();
  }

  // Computed data //
  //////////////////

  get eventTypes(): EventType[] {
    return this.$store.getters[EVENT_TYPES_GET_ALL];
  }

  get eventTypesFields() {
    return [
      {
        key: 'title',
        label: 'Название'
      },
      {
        key: 'description',
        label: 'Описание'
      }
    ];
  }

  get equipmentTypes(): EquipmentType[] {
    return this.$store.getters[EQUIPMENT_TYPES_GET_ALL];
  }

  get equipmentTypesFields() {
    return [
      {
        key: 'title',
        label: 'Название'
      },
      {
        key: 'description',
        label: 'Описание'
      }
    ];
  }
}

export const typeEditPageRoute: RouteConfig = {
  path: '/type_edit',
  name: 'TypeEditPage',
  component: TypeEditPage
};
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
.type-edit-page {
  .nav-tabs {
    .nav-item .nav-link {
      border: none;
    }
  }
}
</style>
<!-- STYLE END -->
