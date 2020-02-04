<!-- TEMPLATE BEGIN -->
<template>
  <div class="profile-page">
    <page-content :loading="loadingInProcess">
      <template slot="header">Профиль</template>

      <b-row>
        <b-col cols="12" md="6">
          <h4>
            <mail-link :email="profileData.email" />
          </h4>
          <hr />
          <b-form @submit.prevent="onSubmitProfile" v-if="isCurrentUser">
            <b-form-group label="Фамилия">
              <b-form-input
                type="text"
                v-model.trim="profileData.lastName"
                :state="isCurrentUser ? !$v.profileData.lastName.$invalid : null"
              ></b-form-input>
            </b-form-group>

            <b-form-group label="Имя">
              <b-form-input
                type="text"
                v-model.trim="profileData.firstName"
                :state="isCurrentUser ? !$v.profileData.firstName.$invalid : null"
              ></b-form-input>
            </b-form-group>

            <b-form-group label="Отчество">
              <b-form-input type="text" v-model.trim="profileData.middleName"></b-form-input>
            </b-form-group>

            <b-form-group label="Номер телефона">
              <b-form-input
                type="tel"
                v-model.trim="profileData.phoneNumber"
                :state="isCurrentUser ? !$v.profileData.phoneNumber.$invalid : null"
              ></b-form-input>
            </b-form-group>

            <b-form-group label="Параметры пользователя">
              <template v-if="profileData.properties && profileData.properties.length !== 0">
                <div
                  v-for="property in profileData.properties"
                  v-bind:key="property.id"
                >{{property.userPropertyType.title}} : {{property.value}}</div>
              </template>
              <template v-else>
                <h6>Параметры не указаны</h6>
              </template>
            </b-form-group>

            <b-form-row>
              <b-col cols="12">
                <b-button
                  type="submit"
                  variant="primary"
                  class="w-100"
                  :disabled="$v.profileData.$invalid || isProfileFormInProcess"
                  v-if="isCurrentUser"
                >Сохранить</b-button>
              </b-col>

              <b-col cols="12" class="mt-3">
                <b-button
                  variant="success"
                  class="w-100"
                  @click="userPropertiesModalVisible = true"
                >Добавить параметры пользователя</b-button>
              </b-col>
              <b-col cols="12" class="mt-3">
                <b-button
                  variant="secondary"
                  class="w-100"
                  @click.prevent="onSubmitVk"
                >Привязать VK аккаунт</b-button>
              </b-col>
            </b-form-row>
          </b-form>

          <h4 v-else>
            {{ profileData.lastName }} {{ profileData.firstName }} {{ profileData.middleName }}
            <br />
            <template v-if="profileData.phoneNumber">
              Телефон:
              <phone-link :phone="profileData.phoneNumber" />
            </template>
          </h4>

          <b-button
            variant="secondary"
            class="w-100 mt-2"
            @click="isRolesModalVisible = true"
            v-if="canEditRoles"
          >Изменить права</b-button>
        </b-col>
        <b-col cols="12" md="6" class="mt-5 mt-md-0">
          <h4>Оборудование</h4>
          <hr />

          <template v-if="equipment.length === 0">Оборудования на руках нет</template>
          <template v-else>
            <div class="equipment-card" v-for="equipment in equipment" :key="equipment.id">
              <b-row>
                <b-col cols="auto">
                  <a :href="`/equipment/${equipment.id}`">
                    <b>{{ equipment.equipmentType.title }}</b>
                  </a>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <span style="font-family: monospace">{{ equipment.serialNumber }}</span>
                </b-col>
              </b-row>
            </div>
          </template>

          <hr />
          <h4>Участие в событиях</h4>
          <hr />
          <b-form-group label="Выберите период:">
            <b-row>
              <b-col cols="12" sm="6" md="12" lg="6" class="mt-3">
                <date-picker class="w-100" v-model="startDate" lang="ru" type="date" format="DD.MM.YYYY"></date-picker>
              </b-col>
              <b-col cols="12" sm="6" md="12" lg="6" class="mt-3">
                <date-picker class="w-100" v-model="endDate" lang="ru" type="date" format="DD.MM.YYYY"></date-picker>
              </b-col>
              <b-col  class="mt-3">
                <b-button
                  type="submit"
                  variant="primary"
                  class="w-100"
                  :disabled="!isDateChanged || startDate == null || endDate == null"
                  @click="changeUserEvents"
                >
                <template v-if="isDatePickerInProcess">
                  <icon name="spinner" pulse/>
                </template>
                <template v-else>
                  Показать события
                </template>
                </b-button>
                
              </b-col>
            </b-row>
          </b-form-group>
              
          <template v-if="userEvents.length !== 0">
            <div class="equipment-card" v-for="event in userEvents" :key="event.key">
              <b-row>
                <b-col cols="12" sm="8" md="7" lg="8">
                  <a :href="`/events/${event.data.id}`">
                    <b>{{event.data.title}}</b>
                  </a>
                </b-col>
                <b-col cols="12" sm="4" md="5" lg="4">
                  <b-button
                    v-if="!event.isShown"
                    variant="secondary"
                    class="w-100 mt-2"
                    size="sm"
                    @click="event.isShown = true"
                  >Подробнее</b-button>
                  <b-button
                    v-else
                    variant="warning"
                    class="w-100 mt-2"
                    size="sm"
                    @click="event.isShown = false"
                  >Свернуть</b-button>
                </b-col>
              </b-row>
              <template v-if="event.isShown">
                <br />
                Дата: {{event.beginDate}}
                <br />
                Время начала: {{event.beginTime}}
                <br />
                Тип события: {{event.data.eventType.title}}
                <br />
                Адрес: {{event.data.address}}
                <br />
                Роль: {{event.data.role.title}}
              </template>
            </div>
          </template>
          <template v-else>
            <div>Нет событий за данный период</div>
          </template>
        </b-col>
      </b-row>
    </page-content>

    <user-roles-modal v-model="isRolesModalVisible" :user="profileData" v-if="canEditRoles" />
    <user-properties-modal v-model="userPropertiesModalVisible" :user="profileData" />

    <b-modal v-model="bindVkModalVisible">
      <template slot="modal-title">Привязать VK аккаунт</template>
      <p>
        Чтобы привязать свой аккаунт, отправьте текст ниже в
        <b-link :href="vkGroupDialogUrl" target="_blank">сообщество VK</b-link>
      </p>

      <b-input-group>
        <b-input readonly v-model="profileData.vkData"></b-input>
        <b-input-group-append>
          <b-button variant="outline-primary" @click="copyVkData">
            <icon name="copy" />
          </b-button>
        </b-input-group-append>
      </b-input-group>

      <template slot="modal-footer">
        <button type="button" class="btn btn-secondary" @click="bindVkModalVisible = false">Закрыть</button>
      </template>
    </b-modal>
  </div>
</template>
<!-- TEMPALTE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { RouteConfig } from 'vue-router';
import moment, { isMoment } from 'moment-timezone';
import axios from 'axios';

import DatePicker from 'vue2-datepicker';

import CMailLink from '@/components/stuff/MailLink.vue';
import CPhoneLink from '@/components/stuff/PhoneLink.vue';

import Icon from 'vue-awesome/components/Icon';
import CPageContent from '@/components/layout/PageContent.vue';
import CUserRolesModal from '@/components/modals/UserRolesModal.vue';
import CUserPropertiesModal from '@/components/modals/UserPropertiesModal.vue';

import 'vue-awesome/icons/times';
import 'vue-awesome/icons/copy';
import 'vue-awesome/icons/spinner';

import { validationMixin } from 'vuelidate';
import { required, minLength } from 'vuelidate/lib/validators';

import {
  PROFILE_COMMIT,
  PROFILE_ROLES_GET,
  PROFILE_VK_ACCOUNT,
  PROFILE_EVENTS_FETCH
} from '@/modules/profile';
import {
  USERS_FETCH_ONE,
  IUser,
  UserDefault,
  USER_ROLES_FETCH,
  IUserRole,
  IUserProperty,
  USER_PROPERTIES_FETCH_ALL
} from '@/modules/users';
import { IEquipment, EQUIPMENT_FETCH_ASSIGNED_TO } from '@/modules/equipment';
import { copyToClipboard } from '../../stuff';
import configuration from '../../stuff/configuration';
import { IEvent, EventDefault } from '../../modules/events';

enum FormState {
  Default,
  InProcess,
  Error
}

@Component({
  components: {
    Icon,
    'mail-link': CMailLink,
    'phone-link': CPhoneLink,
    'page-content': CPageContent,
    'user-roles-modal': CUserRolesModal,
    'user-properties-modal': CUserPropertiesModal,
    'date-picker': DatePicker
  },
  mixins: [validationMixin],
  validations() {
    return {
      profileData: {
        firstName: {
          required,
          minLength: minLength(1)
        },
        lastName: {
          required,
          minLength: minLength(1)
        },
        phoneNumber: {
          required,
          phoneValid: (value: string) =>
            /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/.test(value)
        }
      }
    };
  }
})
export default class ProfilePage extends Vue {
  // Properties //
  ///////////////

  public loadingInProcess: boolean = true;
  public isCurrentUser: boolean = false;
  public userId: string = '';

  public profileData: IUser = new UserDefault();
  public profileFormState: FormState = FormState.Default;

  public equipment: IEquipment[] = [];

  public isRolesModalVisible: boolean = false;

  public bindVkModalVisible: boolean = false;

  public userPropertiesModalVisible: boolean = false;

  public dateRange: any[] = [];

  public allUserEvents: IEvent[] = [];
  public userEvents: any[] = [];

  public startDate: string = '';
  public endDate: string = '';

  public isDateChanged: boolean = false;
  public isDatePickerInProcess: boolean = true;

  public canEditRoles: boolean | null = false;

  // Component methods //
  //////////////////////

  public async mounted() {

    this.startDate = moment()
      .subtract(7, 'day')
      .startOf('day')
      .format();
    this.endDate = moment()
      .subtract(0, 'day')
      .format();
    this.dateRange.push(
      this.startDate,
      this.endDate
    );

    this.isCurrentUser = this.$route.params.id == null;
    if (this.isCurrentUser) {
      this.userId = (await this.$userManager.getUserId()) || '';
    } else {
      this.userId = this.$route.params.id;
    }

    Promise.all([
      this.$store.dispatch(USERS_FETCH_ONE, this.userId),
      this.$store.dispatch(EQUIPMENT_FETCH_ASSIGNED_TO, this.userId),
      this.$store.dispatch(PROFILE_EVENTS_FETCH, {
        login: this.userId,
        begin: this.startDate,
        end: this.endDate
      })
    ]).then(([profile, equipment, events]: [IUser, IEquipment[], []]) => {
      this.profileData = profile;
      this.equipment = equipment;
      this.userEvents = this.mapEventsToEventsRange(events);
      this.isDateChanged = false;
      this.isDatePickerInProcess = false;
      this.loadingInProcess = false;
    });

    // this.presets = [
    //   {
    //     label: 'За последнюю неделю',
    //     range: [
    //       moment()
    //         .subtract(7, 'day')
    //         .startOf('day'),
    //       moment().endOf('day')
    //     ]
    //   },
    //   {
    //     label: 'За последние 30 дней',
    //     range: [
    //       moment()
    //         .subtract(29, 'day')
    //         .startOf('day'),
    //       moment().endOf('day')
    //     ]
    //   },
    //   {
    //     label:
    //       'За ' +
    //       moment()
    //         .subtract(1, 'month')
    //         .startOf('month')
    //         .format('MMMM'),
    //     range: [
    //       moment()
    //         .subtract(1, 'month')
    //         .startOf('month'),
    //       moment()
    //         .subtract(1, 'month')
    //         .endOf('month')
    //     ]
    //   }
    // ];

    this.canEditRoles = await this.$userManager.userHasRole('CanEditRoles');
  }

  // Methods //
  ////////////

  public onSubmitProfile() {
    this.profileFormState = FormState.InProcess;
    this.$store
      .dispatch(PROFILE_COMMIT, this.profileData)
      .then((profile) => {
        this.$notify({
          title: 'Изменения успешно сохранены',
          duration: 500
        });
        this.profileData = profile;
        this.profileFormState = FormState.Default;
      })
      .catch((error) => {
        this.$notify({
          title: 'Невозможно сохранить изменения',
          duration: 1500,
          type: 'error'
        });
        this.profileFormState = FormState.Default;
      });
  }

  public onSubmitVk() {
    this.profileFormState = FormState.InProcess;
    this.$store
      .dispatch(PROFILE_VK_ACCOUNT, this.profileData)
      .then((profile) => {
        this.profileData = profile;
        this.profileFormState = FormState.Default;

        this.copyVkData();

        this.bindVkModalVisible = true;
      })
      .catch((error) => {
        this.$notify({
          title: 'Невозможно привязать',
          duration: 1500,
          type: 'error'
        });
        this.profileFormState = FormState.Default;
      });
  }

  public copyVkData() {
    this.$notify({
      title: 'Код скопирован в буффер обмена',
      duration: 1500,
      type: 'info'
    });
    copyToClipboard(this.profileData.vkData);
  }

  public changeDateRange(dateRange: []) {
    this.dateRange = dateRange;
    this.changeUserEvents();
  }

  public mapEventsToEventsRange(events: IEvent[]) {
    let key: number = 0;
    return events.map((event) => {
      return {
        key: key++,
        isShown: false,
        data: event,
        beginDate: moment(event.beginTime)
          .local()
          .format('DD.MM.YYYY'),
        beginTime: moment(event.beginTime)
          .local()
          .format('HH:mm:ss')
      };
    });
  }

  public changeUserEvents() {
    this.isDatePickerInProcess = true;
    this.$store
      .dispatch(PROFILE_EVENTS_FETCH, {
        login: this.userId,
        begin: this.startDate,
        end: this.endDate
      })
      .then((events) => {
        this.userEvents = this.mapEventsToEventsRange(events);
        this.isDateChanged = false;
        this.isDatePickerInProcess = false;
      });
  }

  @Watch('startDate')
  @Watch('endDate')
  public onDateChange() {
    this.isDateChanged = true;
  }

  // Computed data //
  //////////////////

  get isProfileFormInProcess(): boolean {
    return this.profileFormState === FormState.InProcess;
  }

  get vkGroupDialogUrl(): string {
    return configuration.VUE_APP_VK_GROUP_DIALOG_URL || '';
  }
}

export const profilePageRoute = {
  path: '/profile/:id?',
  name: 'ProfilePage',
  component: ProfilePage
} as RouteConfig;
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
@import '@/styles/general.scss';

.profile-page {
  .equipment-card {
    @extend .form-control;

    height: auto;

    &:not(:last-child) {
      margin-bottom: 5px;
    }
  }
}
</style>
<!-- STYLE END -->