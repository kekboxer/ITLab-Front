<!-- TEMPLATE BEGIN -->
<template>
  <div class="type-edit-page">
    <vue-headful title="Типы"></vue-headful>
    <page-content :loading="loadingInProcess">
      <template slot="header">Типы</template>

      <b-tabs>
        <b-tab title="События" active>
          <br />
          <b-row>
            <b-col cols="12" sm="auto" class="ml-auto">
              <b-button
                variant="success"
                class="w-100"
                @click="showEventTypeModal()"
                v-if="canEditEventType"
              >Добавить</b-button>
            </b-col>
          </b-row>
          <br />
          <b-row>
            <b-col>
              <b-card v-for="eventType in eventTypes" :key="eventType.id" class="mb-1">
                <b-row>
                  <b-col>
                    <b-row style="line-height: 31px">
                      <b-col cols="12" md="6">
                        <b>{{ eventType.title }}</b>
                      </b-col>
                      <b-col cols="12" md="6">{{ eventType.description }}</b-col>
                    </b-row>
                  </b-col>
                  <b-col
                    cols="12"
                    md="auto"
                    class="ml-md-auto d-flex align-content-between align-items-start"
                    v-if="canEditEventType"
                  >
                    <b-button
                      variant="warning"
                      class="btn-sm w-100 mr-md-1 order-3 order-md-2"
                      @click="showEventTypeModal(eventType)"
                    >Изменить</b-button>
                    <b-button
                      variant="outline-danger"
                      class="btn-sm w-100 mr-1 mr-md-0 order-1 order-md-3"
                      @click="onRemoveEventType(eventType)"
                    >
                      <icon
                        name="times"
                        class="d-none d-md-inline"
                        style="position: relative; top: -2px;"
                      ></icon>
                      <span class="d-inline d-md-none">Удалить</span>
                    </b-button>
                  </b-col>
                </b-row>
              </b-card>
            </b-col>
          </b-row>
        </b-tab>
        <b-tab title="Роли">
          <br />
          <b-row>
            <b-col cols="12" sm="auto" class="ml-auto">
              <b-button variant="success" class="w-100" @click="showEventRoleModal()">Добавить</b-button>
            </b-col>
          </b-row>
          <br />
          <b-row>
            <b-col>
              <b-card v-for="eventRole in eventRoles" :key="eventRole.id" class="mb-1">
                <b-row>
                  <b-col>
                    <b-row style="line-height: 31px">
                      <b-col cols="12" md="6">
                        <b>{{ eventRole.title }}</b>
                      </b-col>
                      <b-col cols="12" md="6">{{ eventRole.description }}</b-col>
                    </b-row>
                  </b-col>
                  <b-col
                    cols="12"
                    md="auto"
                    class="ml-md-auto d-flex align-content-between align-items-start"
                  >
                    <b-button
                      variant="warning"
                      class="btn-sm w-100 order-3 order-md-2"
                      v-bind:class="{'mr-md-1': canDeleteEventRole }"
                      @click="showEventRoleModal(eventRole)"
                    >Изменить</b-button>
                    <b-button
                      variant="outline-danger"
                      class="btn-sm w-100 mr-1 mr-md-0 order-1 order-md-3"
                      @click="onRemoveEventRole(eventRole)"
                      v-if="canDeleteEventRole"
                    >
                      <icon
                        name="times"
                        class="d-none d-md-inline"
                        style="position: relative; top: -2px;"
                      ></icon>
                      <span class="d-inline d-md-none">Удалить</span>
                    </b-button>
                  </b-col>
                </b-row>
              </b-card>
            </b-col>
          </b-row>
        </b-tab>
        <b-tab title="Оборудование">
          <br />
          <b-row>
            <b-col cols="12" sm="auto" class="ml-auto">
              <b-button
                variant="success"
                class="w-100"
                @click="showEquipmentTypeModal()"
                v-if="canEditEquipmentType"
              >Добавить</b-button>
            </b-col>
          </b-row>
          <br />
          <b-row>
            <b-col>
              <b-card v-for="equipmentType in equipmentTypes" :key="equipmentType.id" class="mb-1">
                <b-row>
                  <b-col>
                    <b-row style="line-height: 31px">
                      <b-col cols="12" md="6">
                        <b>{{ equipmentType.title }}</b>
                      </b-col>
                      <b-col cols="12" md="6">{{ equipmentType.description }}</b-col>
                    </b-row>
                  </b-col>
                  <b-col
                    cols="12"
                    md="auto"
                    class="ml-md-auto d-flex align-content-between align-items-start"
                    v-if="canEditEquipmentType"
                  >
                    <b-button
                      variant="warning"
                      class="btn-sm w-100 mr-md-1 order-3 order-md-2"
                      @click="showEquipmentTypeModal(equipmentType)"
                    >Изменить</b-button>
                    <b-button
                      variant="outline-danger"
                      class="btn-sm w-100 mr-1 mr-md-0 order-1 order-md-3"
                      @click="onRemoveEquipmentType(equipmentType)"
                    >
                      <icon
                        name="times"
                        class="d-none d-md-inline"
                        style="position: relative; top: -2px;"
                      ></icon>
                      <span class="d-inline d-md-none">Удалить</span>
                    </b-button>
                  </b-col>
                </b-row>
              </b-card>
            </b-col>
          </b-row>
        </b-tab>

        <b-tab title="Параметры пользователя">
          <br />
          <b-row>
            <b-col cols="12" sm="auto" class="ml-auto">
              <b-button
                variant="success"
                class="w-100"
                @click="showUserPropertyTypeModal()"
                v-if="canEditUserPropertyTypes"
              >Добавить</b-button>
            </b-col>
          </b-row>
          <br />
          <b-row>
            <b-col>
              <b-card
                v-for="userPropertyType in userPropertyTypes"
                :key="userPropertyType.id"
                class="mb-1"
              >
                <b-row>
                  <b-col>
                    <b-row style="line-height: 31px">
                      <b-col cols="12" md="6">
                        <b>{{ userPropertyType.title }}</b>
                      </b-col>
                      <b-col cols="12" md="6">{{ userPropertyType.description }}</b-col>
                    </b-row>
                  </b-col>
                  <b-col
                    cols="12"
                    md="auto"
                    class="ml-md-auto d-flex align-content-between align-items-start"
                  >
                    <b-button
                      v-if="!userPropertyType.isLocked && canEditUserPropertyTypes"
                      variant="warning"
                      class="btn-sm w-100 mr-md-1 order-3 order-md-2"
                      @click="showUserPropertyTypeModal(userPropertyType)"
                    >Изменить</b-button>
                    <b-button
                      v-if="!userPropertyType.isLocked && canEditUserPropertyTypes"
                      variant="outline-danger"
                      class="btn-sm w-100 mr-1 mr-md-0 order-1 order-md-3"
                      @click="onRemoveUserPropertyType(userPropertyType)"
                    >
                      <icon
                        name="times"
                        class="d-none d-md-inline"
                        style="position: relative; top: -2px;"
                      ></icon>
                      <span class="d-inline d-md-none">Удалить</span>
                    </b-button>
                  </b-col>
                </b-row>
              </b-card>
            </b-col>
          </b-row>
        </b-tab>
      </b-tabs>
    </page-content>

    <event-type-modal
      v-model="eventTypeModalVisible"
      :data="eventTypeModalData"
      :onSubmit="onSubmitEventTypeModal"
    />
    <event-role-modal
      v-model="eventRoleModalVisible"
      :data="eventRoleModalData"
      :onSubmit="onSubmitEventRoleModal"
    />
    <equipment-type-modal
      v-model="equipmentTypeModalVisible"
      :data="equipmentTypeModalData"
      :onSubmit="onSubmitEquipmentTypeModal"
    />
    <user-property-type-modal
      v-model="userPropertyTypeModalVisible"
      :data="userPropertyTypeModalData"
      :onSubmit="onSubmitUserPropertyTypeModal"
    />
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RouteConfig } from 'vue-router';

import Icon from 'vue-awesome/components/Icon';
import CPageContent from '@/components/layout/PageContent.vue';
import CEventTypeModal from '@/components/modals/EventTypeModal.vue';
import CEventRoleModal from '@/components/modals/EventRoleModal.vue';
import CEquipmentTypeModal from '@/components/modals/EquipmentTypeModal.vue';
import CUserPropertyTypeModal from '@/components/modals/UserPropertyTypeModal.vue';

import 'vue-awesome/icons/times';

import {
  IEquipmentType,
  EquipmentTypeDefault,
  EQUIPMENT_TYPES_FETCH_ALL,
  EQUIPMENT_TYPES_GET_ALL,
  EQUIPMENT_TYPE_DELETE
} from '@/modules/equipment';

import {
  IEventType,
  EventTypeDefault,
  IEventRole,
  EventRoleDefault,
  EVENT_TYPES_FETCH_ALL,
  EVENT_TYPES_GET_ALL,
  EVENT_TYPE_DELETE,
  EVENT_ROLES_GET_ALL,
  EVENT_ROLES_FETCH_ALL,
  EVENT_ROLE_DELETE
} from '@/modules/events';

import {
  IUserPropertyType,
  UserPropertyTypeDefault,
  USER_PROPERTY_TYPES_GET_ALL,
  USER_PROPERTY_TYPES_FETCH_ALL,
  USER_PROPERTY_TYPE_DELETE
} from '../../modules/users';

@Component({
  components: {
    Icon,
    'page-content': CPageContent,
    'event-type-modal': CEventTypeModal,
    'event-role-modal': CEventRoleModal,
    'equipment-type-modal': CEquipmentTypeModal,
    'user-property-type-modal': CUserPropertyTypeModal
  }
})
export default class TypeEditPage extends Vue {
  // Properties //
  ///////////////

  public loadingInProcess: boolean = true;

  public eventTypeModalVisible: boolean = false;
  public eventTypeModalData: IEventType = new EventTypeDefault();

  public eventRoleModalVisible: boolean = false;
  public eventRoleModalData: IEventRole = new EventRoleDefault();

  public equipmentTypeModalVisible: boolean = false;
  public equipmentTypeModalData: IEquipmentType = new EquipmentTypeDefault();

  public userPropertyTypeModalVisible: boolean = false;
  public userPropertyTypeModalData: IUserPropertyType = new UserPropertyTypeDefault();

  private canEditEventType: boolean | null = false;
  private canDeleteEventRole: boolean | null = false;
  private canEditEquipmentType: boolean | null = false;
  private canEditUserPropertyTypes: boolean | null = false;

  // Component methods //
  //////////////////////

  public async mounted() {
    Promise.all([
      this.$store.dispatch(EVENT_TYPES_FETCH_ALL),
      this.$store.dispatch(EVENT_ROLES_FETCH_ALL),
      this.$store.dispatch(EQUIPMENT_TYPES_FETCH_ALL),
      this.$store.dispatch(USER_PROPERTY_TYPES_FETCH_ALL)
    ])
      .then((results) => {
        this.loadingInProcess = false;
      })
      .catch();

    this.canEditEventType = await this.$userManager.userHasRole(
      'CanEditEventType'
    );
    this.canDeleteEventRole = await this.$userManager.userHasRole(
      'CanDeleteEventRole'
    );
    this.canEditEquipmentType = await this.$userManager.userHasRole(
      'CanEditEquipmentType'
    );
    this.canEditUserPropertyTypes = await this.$userManager.userHasRole(
      'CanEditUserPropertyTypes'
    );
  }

  // EventType modal methods //
  ////////////////////////////

  public showEventTypeModal(eventType?: IEventType) {
    if (eventType) {
      this.eventTypeModalData = Object.assign({}, eventType);
    } else {
      this.eventTypeModalData = new EventTypeDefault();
    }
    this.eventTypeModalVisible = true;
  }

  public onRemoveEventType(eventType: IEventType) {
    if (!confirm('Вы действительно хотите удалить тип события?')) {
      return;
    }

    this.$store.dispatch(EVENT_TYPE_DELETE, eventType);
  }

  public onSubmitEventTypeModal(eventType: IEventType) {
    this.eventTypeModalVisible = false;
  }

  // EventRole modal methods //
  ////////////////////////////

  public showEventRoleModal(eventRole?: IEventRole) {
    if (eventRole) {
      this.eventRoleModalData = Object.assign({}, eventRole);
    } else {
      this.eventRoleModalData = new EventRoleDefault();
    }
    this.eventRoleModalVisible = true;
  }

  public onRemoveEventRole(eventRole?: IEventRole) {
    if (!confirm('Вы действительно хотите удалить эту роль?')) {
      return;
    }

    this.$store.dispatch(EVENT_ROLE_DELETE, eventRole);
  }

  public onSubmitEventRoleModal(eventRole: IEventRole) {
    this.eventRoleModalVisible = false;
  }

  // EquipmentType modal methods //
  ////////////////////////////////

  public showEquipmentTypeModal(equipmentType?: IEquipmentType) {
    if (equipmentType) {
      this.equipmentTypeModalData = Object.assign({}, equipmentType);
    } else {
      this.equipmentTypeModalData = new EquipmentTypeDefault();
    }
    this.equipmentTypeModalVisible = true;
  }

  public onRemoveEquipmentType(equipmentType: IEquipmentType) {
    if (!confirm('Вы действительно хотите удалить тип оборудования?')) {
      return;
    }

    this.$store.dispatch(EQUIPMENT_TYPE_DELETE, equipmentType);
  }

  public onSubmitEquipmentTypeModal(equipmentType: IEquipmentType) {
    this.equipmentTypeModalVisible = false;
  }

  // UserPropertyType modal methods //
  ////////////////////////////////

  public showUserPropertyTypeModal(userPropertyType?: IUserPropertyType) {
    if (userPropertyType) {
      this.userPropertyTypeModalData = Object.assign({}, userPropertyType);
    } else {
      this.userPropertyTypeModalData = new UserPropertyTypeDefault();
    }
    this.userPropertyTypeModalVisible = true;
  }

  public onSubmitUserPropertyTypeModal(userPropertyType: IUserPropertyType) {
    this.userPropertyTypeModalVisible = false;
  }

  public onRemoveUserPropertyType(userPropertyType: IUserPropertyType) {
    if (!confirm('Вы действительно хотите удалить тип параметров пользователя?')) {
      return;
    }

    this.$store.dispatch(USER_PROPERTY_TYPE_DELETE, userPropertyType);
  }

  // Computed data //
  //////////////////

  get eventTypes(): IEventType[] {
    return this.$store.getters[EVENT_TYPES_GET_ALL];
  }

  get eventRoles(): IEventRole[] {
    return this.$store.getters[EVENT_ROLES_GET_ALL];
  }

  get equipmentTypes(): IEquipmentType[] {
    return this.$store.getters[EQUIPMENT_TYPES_GET_ALL];
  }

  get userPropertyTypes(): IUserPropertyType[] {
    return this.$store.getters[USER_PROPERTY_TYPES_GET_ALL];
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
