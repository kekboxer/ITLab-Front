<!-- TEMPLATE BEGIN -->
<template>
  <div class="type-edit-page">
    <page-content-component :loading="loadingInProcess">
      <template slot="header">
        Типы
      </template>

      <div class="nav nav-tabs">
        <div class="nav-item">
          <b-table :hover="true" :fixed="true" :items="equipmentTypes" :fields="equipmentTypesFields">
            <template slot="title" slot-scope="data">
              {{ data.item.title }}
            </template>
          </b-table>
        </div>
      </div>
    </page-content-component>
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { EquipmentType, EQUIPMENT_GET_ALL, EQUIPMENT_FETCH_ALL, EQUIPMENT_TYPE_FETCH_ALL, EQUIPMENT_TYPE_GET_ALL } from '@/modules/equipment';
import { RouteConfig } from 'vue-router';

import PageContentComponent from '@/components/PageContentComponent.vue';

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
    this.$store.dispatch(EQUIPMENT_TYPE_FETCH_ALL).then(() => {
      this.loadingInProcess = false;
    });
  }

  // Computed data //
  //////////////////

  get equipmentTypes(): EquipmentType[] {
    return this.$store.getters[EQUIPMENT_TYPE_GET_ALL];
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
</style>
<!-- STYLE END -->
