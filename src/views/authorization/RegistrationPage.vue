<!-- TEMPALTE BEGIN -->
<template>
  <div class="registration-page fullscreen-height">
    <b-container class="fullscreen-height">
      <b-row
        align-v="center"
        align-h="center"
        class="fullscreen-height"
      >
        <b-col
          class="form-card"
          cols="10"
          md="5"
          lg="4"
        >

          <b-form @submit.prevent="onSubmit">
            <b-row>
              <b-col align="center">
                <h2>Регистрация</h2>
              </b-col>
            </b-row>

            <b-form-group label="Почта">
              <b-form-input
                autocomplete="email"
                type="email"
                v-model.trim="registrationData.email"
                required
                readonly
              >
              </b-form-input>
            </b-form-group>

            <b-form-group label="Пароль">
              <b-form-input
                autocomplete="new-password"
                type="password"
                v-model="registrationData.password"
                :state="!$v.registrationData.password.$invalid"
                required
              >
              </b-form-input>
            </b-form-group>

            <b-form-group label="Фамилия">
              <b-form-input
                autocomplete="family-name"
                type="text"
                v-model.trim="registrationData.lastName"
                :state="!$v.registrationData.lastName.$invalid"
                required
              >
              </b-form-input>
            </b-form-group>

            <b-form-group label="Имя">
              <b-form-input
                autocomplete="given-name"
                type="text"
                v-model.trim="registrationData.firstName"
                :state="!$v.registrationData.firstName.$invalid"
                required
              >
              </b-form-input>
            </b-form-group>

            <b-form-group label="Отчество">
              <b-form-input
                autocomplete="middle-name"
                type="text"
                v-model.trim="registrationData.middleName"
              >
              </b-form-input>
            </b-form-group>

            <b-form-group label="Телефон">
              <b-form-input
                autocomplete="home-phone"
                type="tel"
                v-model.trim="registrationData.phoneNumber"
                :state="!$v.registrationData.phoneNumber.$invalid"
                required
              >
              </b-form-input>
            </b-form-group>

            <b-form-row>
              <b-col>
                <span class="text-secondary">
                  <small>
                    Подтверждая регистрацию вы даёте своё
                    <router-link
                      to="/processing_agreement"
                      class="text-secondary"
                    >
                      <u>согласие на обработку персональных данных</u>
                    </router-link>.
                  </small>
                </span>
              </b-col>
            </b-form-row>

            <b-form-row>
              <b-col>
                <b-button
                  class="submit-button w-100 mt-2"
                  type="submit"
                  :disabled="$v.registrationData.$invalid || isInProcess"
                  variant="primary"
                >Подтвердить</b-button>
              </b-col>
            </b-form-row>

            <b-form-row>
              <router-link
                to="/login"
                class="btn btn-link text-secondary w-100 mt-2"
              >У меня уже есть аккаунт</router-link>
            </b-form-row>
          </b-form>

        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<!-- TEMPALTE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { RouteConfig } from 'vue-router';

import { validationMixin } from 'vuelidate';
import { required, minLength, maxLength } from 'vuelidate/lib/validators';

import {
  IRegistrationData,
  RegistrationDataDefault,
  PROFILE_CREATE
} from '@/modules/profile';

enum State {
  Default,
  InProcess,
  Error
}

@Component({
  mixins: [validationMixin],
  validations() {
    return {
      registrationData: {
        firstName: { required, minLength: minLength(1) },
        lastName: { required, minLength: minLength(1) },
        password: {
          required,
          minLength: minLength(6),
          maxLength: maxLength(32)
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
export default class RegistrationPage extends Vue {
  // Page properties //
  ////////////////////

  public pageState: State = State.Default;
  public registrationData: IRegistrationData = new RegistrationDataDefault();

  // Component methods //
  //////////////////////

  public mounted() {
    const fallback = () => this.$router.replace({ name: 'LoginPage' });

    const regex = /^#e=(.+)&c=(.+)$/;
    const matchResult = this.$route.hash.match(regex);

    if (matchResult == null || matchResult.length !== 3) {
      fallback();
      return;
    }

    const [, email, code] = matchResult;
    this.registrationData.email = decodeURIComponent(email);
    this.registrationData.accessToken = decodeURIComponent(code);
  }

  // Methods //
  ////////////

  public onSubmit() {
    this.pageState = State.InProcess;
    this.$store
      .dispatch(PROFILE_CREATE, this.registrationData)
      .then((result) => {
        this.registrationData = new RegistrationDataDefault();
        this.$router.push({ name: 'LoginPage' });

        this.pageState = State.Default;
      })
      .catch((error) => {
        console.log(error);
        this.pageState = State.Error;
      });
  }

  get isInProcess(): boolean {
    return this.pageState === State.InProcess;
  }
}

export const registrationPageRoute: RouteConfig = {
  path: '/register',
  name: 'RegistrationPage',
  component: RegistrationPage,
  meta: {
    secure: false,
    hideNavigation: true
  }
};
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
@import '@/styles/general.scss';

.registration-page {
  @include media-breakpoint-down(sm) {
    @include theme-specific() {
      background-color: getstyle(form-card-background-color);
    }
  }
}
</style>
<!-- STYLE END -->