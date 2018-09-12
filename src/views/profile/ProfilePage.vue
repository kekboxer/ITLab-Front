<!-- TEMPLATE BEGIN -->
<template>
  <div class="profile-page">
    <page-content-component :loading="loadingInProcess">
      <template slot="header">
        Профиль
      </template>

      <b-row>
        <b-col cols="12" md="6">
          <h4>Общая информация</h4>
          <hr>
          <b-form @submit.prevent="onSubmitProfile">
            <p>
              <b>{{ profileData.email }}</b>
            </p>

            <b-form-group label="Имя">
              <b-form-input type="text" v-model.trim="profileData.firstName" :state="!$v.profileData.firstName.$invalid">
              </b-form-input>
            </b-form-group>

            <b-form-group label="Фамилия">
              <b-form-input type="text" v-model.trim="profileData.lastName" :state="!$v.profileData.lastName.$invalid">
              </b-form-input>
            </b-form-group>

            <b-form-group label="Номер телефона">
              <b-form-input type="tel" v-model.trim="profileData.phoneNumber" :state="!$v.profileData.phoneNumber.$invalid">
              </b-form-input>
            </b-form-group>

            <b-button type="submit" variant="primary" class="w-100" :disabled="$v.profileData.$invalid || isFormInProcess">Сохранить</b-button>
          </b-form>
        </b-col>

        <b-col cols="12" md="6" class="mt-3 mt-md-0">
          <h4>Оборудование</h4>
          <hr>

          <div class="equipment-card" v-for="equipment in equipment" :key="equipment.id">
            <b-row>
              <b-col cols="auto">
                <a :href="`equipment/${equipment.id}`"><b>{{ equipment.equipmentType.title }}</b></a>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <span style="font-family: monospace">{{ equipment.serialNumber }}</span>
              </b-col>
            </b-row>
          </div>
        </b-col>
      </b-row>
      <hr>
      <b-row>

      </b-row>
    </page-content-component>
  </div>
</template>
<!-- TEMPALTE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RouteConfig } from 'vue-router';
import moment from 'moment-timezone';

import Icon from 'vue-awesome/components/Icon';
import PageContentComponent from '@/components/PageContentComponent.vue';

import 'vue-awesome/icons/times';

import { validationMixin } from 'vuelidate';
import { required, minLength } from 'vuelidate/lib/validators';

import { PROFILE_GET, PROFILE_COMMIT } from '@/modules/profile';
import { USERS_FETCH_ONE, User, UserDefault } from '@/modules/users';
import { Equipment, EQUIPMENT_FETCH_MY } from '@/modules/equipment';

enum FormState {
  Default,
  InProcess,
  Error
}

@Component({
  components: {
    Icon,
    'page-content-component': PageContentComponent
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
  public profileData: User = new UserDefault();
  public formState: FormState = FormState.Default;
  public equipment: Equipment[] = [];

  // Component methods //
  //////////////////////

  public mounted() {
    this.$store
      .dispatch(USERS_FETCH_ONE, this.$store.getters[PROFILE_GET])
      .then((profile) => {
        this.profileData = profile;
        this.loadingInProcess = false;

        return this.$store
          .dispatch(EQUIPMENT_FETCH_MY)
          .then((equipment) => (this.equipment = equipment));
      });
  }

  // Methods //
  ////////////

  public onSubmitProfile() {
    this.formState = FormState.InProcess;
    this.$store
      .dispatch(PROFILE_COMMIT, this.profileData)
      .then((profile) => {
        this.$notify({
          title: 'Изменения успешно сохранены',
          duration: 500
        });
        this.profileData = profile;
        this.formState = FormState.Default;
      })
      .catch((error) => {
        this.$notify({
          title: 'Невозможно сохранить изменения',
          duration: 1500,
          type: 'error'
        });
        this.formState = FormState.Default;
      });
  }

  // Computed data //
  //////////////////

  get isFormInProcess(): boolean {
    return this.formState === FormState.InProcess;
  }
}

export const profilePageRoute = {
  path: '/profile',
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