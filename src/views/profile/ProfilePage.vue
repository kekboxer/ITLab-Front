<!-- TEMPLATE BEGIN -->
<template>
  <div class="profile-page">
    <page-content :loading="loadingInProcess">
      <template slot="header">
        Профиль
      </template>

      <b-row>
        <b-col cols="12" md="6">
          <h4>{{ profileData.email }}</h4>
          <hr>
          <b-form @submit.prevent="onSubmitProfile">
            <b-form-group label="Имя">
              <b-form-input type="text" v-model.trim="profileData.firstName" :state="isCurrentUser ? !$v.profileData.firstName.$invalid : null" :readonly="!isCurrentUser">
              </b-form-input>
            </b-form-group>

            <b-form-group label="Фамилия">
              <b-form-input type="text" v-model.trim="profileData.lastName" :state="isCurrentUser ? !$v.profileData.lastName.$invalid : null" :readonly="!isCurrentUser">
              </b-form-input>
            </b-form-group>

            <b-form-group label="Номер телефона">
              <b-form-input type="tel" v-model.trim="profileData.phoneNumber" :state="isCurrentUser ? !$v.profileData.phoneNumber.$invalid : null" :readonly="!isCurrentUser">
              </b-form-input>
            </b-form-group>

            <b-button type="submit" variant="primary" class="w-100" :disabled="$v.profileData.$invalid || isProfileFormInProcess" v-if="isCurrentUser">Сохранить</b-button>
          </b-form>
        </b-col>
        <b-col cols="12" md="6" class="mt-5 mt-md-0">
          <h4>Права в системе</h4>
          <hr>
          <template v-if="userRoles.length === 0">
            <template v-if="userRolesForbidden">
              У вас нет доступа к правам данного пользователя
            </template>
            <template v-else>
              Дополнительных прав нет
            </template>
          </template>
          <template v-else>
            <div class="equipment-card" v-for="userRole in userRoles" :key="`role-${userRole.id}`">
              {{ userRole.name }}
            </div>
          </template>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="12" class="mt-5">
          <h4>Оборудование</h4>
          <hr>

          <template v-if="equipment.length === 0">
            Оборудования на руках нет
          </template>
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
        </b-col>
      </b-row>
    </page-content>
  </div>
</template>
<!-- TEMPALTE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RouteConfig } from 'vue-router';
import moment from 'moment-timezone';

import Icon from 'vue-awesome/components/Icon';
import CPageContent from '@/components/layout/PageContent.vue';

import 'vue-awesome/icons/times';

import { validationMixin } from 'vuelidate';
import { required, minLength } from 'vuelidate/lib/validators';

import {
  PROFILE_GET,
  PROFILE_COMMIT,
  PROFILE_ROLES_GET
} from '@/modules/profile';
import {
  USERS_FETCH_ONE,
  IUser,
  UserDefault,
  USER_ROLES_FETCH
} from '@/modules/users';
import { IEquipment, EQUIPMENT_FETCH_ASSIGNED_TO } from '@/modules/equipment';
import { UserRole } from '@/stuff';

enum FormState {
  Default,
  InProcess,
  Error
}

@Component({
  components: {
    Icon,
    'page-content': CPageContent
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

  public profileData: IUser = new UserDefault();
  public profileFormState: FormState = FormState.Default;

  public equipment: IEquipment[] = [];

  public userRoles: Array<{ id: string; name: UserRole }> = [];
  public userRolesForbidden: boolean = false;

  // Component methods //
  //////////////////////

  public mounted() {
    this.isCurrentUser = this.$route.params.id == null;
    const userId = this.isCurrentUser
      ? this.$store.getters[PROFILE_GET]
      : this.$route.params.id;

    Promise.all([
      this.$store.dispatch(USERS_FETCH_ONE, userId),
      this.$store.dispatch(EQUIPMENT_FETCH_ASSIGNED_TO, userId)
    ]).then(([profile, equipment]: [IUser, IEquipment[]]) => {
      this.profileData = profile;
      this.equipment = equipment;

      this.loadingInProcess = false;
    });

    if (this.isCurrentUser) {
      this.userRoles = this.$store.getters[PROFILE_ROLES_GET].map(
        (role: string, i: number) => {
          return {
            id: `local-${i}`,
            name: role
          };
        }
      );
    } else {
      this.$store
        .dispatch(USER_ROLES_FETCH, userId)
        .then((userRoles: Array<{ id: string; name: UserRole }>) => {
          this.userRoles = userRoles;
        })
        .catch((error) => {
          if (error.error.statusCode === 24) {
            this.userRolesForbidden = true;
          }
        });
    }
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

  // Computed data //
  //////////////////

  get isProfileFormInProcess(): boolean {
    return this.profileFormState === FormState.InProcess;
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