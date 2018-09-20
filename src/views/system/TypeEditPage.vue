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
          <b-row>
            <b-col cols="12" sm="auto" class="ml-auto">
              <b-button variant="success" class="w-100" @click="showEventTypeModal()">Добавить</b-button>
            </b-col>
          </b-row>
          <br>
          <b-row>
            <b-col>
              <b-card v-for="eventType in eventTypes" :key="eventType.id" class="mb-1">
                <b-row>
                  <b-col>
                    <b-row style="line-height: 31px">
                      <b-col cols="12" md="6">
                        <b>{{ eventType.title }}</b>
                      </b-col>
                      <b-col cols="12" md="6">
                        {{ eventType.description }}
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col cols="12" md="auto" class="ml-md-auto d-flex align-content-between align-items-start">
                    <b-button variant="warning" class="btn-sm w-100 mr-md-1 order-3 order-md-2" @click="showEventTypeModal(eventType)">Изменить</b-button>
                    <b-button variant="outline-danger" class="btn-sm w-100 mr-1 mr-md-0 order-1 order-md-3" @click="removeEventType(eventType)">
                      <icon name="times" class="d-none d-md-inline" style="position: relative; top: -2px;"></icon>
                      <span class="d-inline d-md-none">Удалить</span>
                    </b-button>
                  </b-col>
                </b-row>
              </b-card>
            </b-col>
          </b-row>
        </b-tab>
        <b-tab title="Оборудование">
          <br>
          <b-row>
            <b-col cols="12" sm="auto" class="ml-auto">
              <b-button variant="success" class="w-100" @click="showEquipmentTypeModal()">Добавить</b-button>
            </b-col>
          </b-row>
          <br>
          <b-row>
            <b-col>
              <b-card v-for="equipmentType in equipmentTypes" :key="equipmentType.id" class="mb-1">
                <b-row>
                  <b-col>
                    <b-row style="line-height: 31px">
                      <b-col cols="12" md="6">
                        <b>{{ equipmentType.title }}</b>
                      </b-col>
                      <b-col cols="12" md="6">
                        {{ equipmentType.description }}
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col cols="12" md="auto" class="ml-md-auto d-flex align-content-between align-items-start">
                    <b-button variant="warning" class="btn-sm w-100 mr-md-1 order-3 order-md-2" @click="showEquipmentTypeModal(equipmentType)">Изменить</b-button>
                    <b-button variant="outline-danger" class="btn-sm w-100 mr-1 mr-md-0 order-1 order-md-3" @click="removeEquipmentType(equipmentType)">
                      <icon name="times" class="d-none d-md-inline" style="position: relative; top: -2px;"></icon>
                      <span class="d-inline d-md-none">Удалить</span>
                    </b-button>
                  </b-col>
                </b-row>
              </b-card>
            </b-col>
          </b-row>
        </b-tab>
      </b-tabs>
    </page-content-component>

    <event-type-modal-component v-model="eventTypeModalVisible" :data="eventTypeModalData" :onSubmit="onSubmitEventTypeModal" />
    <equipment-type-modal-component v-model="equipmentTypeModalVisible" :data="equipmentTypeModalData" :onSubmit="onSubmitEquipmentTypeModal" />
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RouteConfig } from 'vue-router';

import Icon from 'vue-awesome/components/Icon';
import PageContentComponent from '@/components/PageContentComponent.vue';
import EventTypeModalComponent from '@/components/EventTypeModalComponent.vue';
import EquipmentTypeModalComponent from '@/components/EquipmentTypeModalComponent.vue';

import 'vue-awesome/icons/times';

import {
  EquipmentType,
  EquipmentTypeDefault,
  EQUIPMENT_TYPES_FETCH_ALL,
  EQUIPMENT_TYPES_GET_ALL,
  EQUIPMENT_TYPE_DELETE
} from '@/modules/equipment';

import {
  EventType,
  EventTypeDefault,
  EVENT_TYPES_FETCH_ALL,
  EVENT_TYPES_GET_ALL,
  EVENT_TYPE_DELETE
} from '@/modules/events';

@Component({
  components: {
    Icon,
    'page-content-component': PageContentComponent,
    'event-type-modal-component': EventTypeModalComponent,
    'equipment-type-modal-component': EquipmentTypeModalComponent
  }
})
export default class TypeEditPage extends Vue {
  // Properties //
  ///////////////

  public loadingInProcess: boolean = true;

  public eventTypeModalVisible: boolean = false;
  public eventTypeModalData: EventType = new EventTypeDefault();

  public equipmentTypeModalVisible: boolean = false;
  public equipmentTypeModalData: EquipmentType = new EquipmentTypeDefault();

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

  // Methods //
  ////////////

  public showEventTypeModal(eventType?: EventType) {
    if (eventType) {
      this.eventTypeModalData = Object.assign({}, eventType);
    } else {
      this.eventTypeModalData = new EventTypeDefault();
    }
    this.eventTypeModalVisible = true;
  }

  public removeEventType(eventType: EventType) {
    this.$store.dispatch(EVENT_TYPE_DELETE, eventType);
  }

  public onSubmitEventTypeModal(eventType: EventType) {
    this.eventTypeModalVisible = false;
  }

  public showEquipmentTypeModal(equipmentType?: EquipmentType) {
    if (equipmentType) {
      this.equipmentTypeModalData = Object.assign({}, equipmentType);
    } else {
      this.equipmentTypeModalData = new EquipmentTypeDefault();
    }
    this.equipmentTypeModalVisible = true;
  }

  public removeEquipmentType(equipmentType: EquipmentType) {
    this.$store.dispatch(EQUIPMENT_TYPE_DELETE, equipmentType);
  }

  public onSubmitEquipmentTypeModal(equipmentType: EquipmentType) {
    this.equipmentTypeModalVisible = false;
  }

  // Computed data //
  //////////////////

  get eventTypes(): EventType[] {
    return this.$store.getters[EVENT_TYPES_GET_ALL];
  }

  get equipmentTypes(): EquipmentType[] {
    return this.$store.getters[EQUIPMENT_TYPES_GET_ALL];
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

  .card-body {
    padding: 10px 15px;
  }
}
</style>
<!-- STYLE END -->
