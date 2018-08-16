<!-- TEMPALTE BEGIN -->
<template>
  <div class="registration-page fullscreen-height">
    <b-container class="fullscreen-height">
      <b-row align-v="center" align-h="center" class="fullscreen-height">
        <b-col class="form-card" cols="10" md="5" lg="4">

          <b-form @submit.prevent="onSubmit">
            <b-row>
              <b-col align="center">
                <h2>Регистрация</h2>
              </b-col>
            </b-row>

            {{ registrationData.email }}

            <b-form-group id="first-name-input-group" label="Имя" label-for="first-name-input">
              <b-form-input id="first-name-input" type="text" v-model.trim="registrationData.firstName" :state="!$v.registrationData.firstName.$invalid" required>
              </b-form-input>
            </b-form-group>

            <b-form-group id="last-name-input-group" label="Фамилия" label-for="last-name-input">
              <b-form-input id="last-name-input" type="text" v-model.trim="registrationData.lastName" :state="!$v.registrationData.lastName.$invalid" required>
              </b-form-input>
            </b-form-group>

            <b-form-group id="password-input-group" label="Пароль" label-for="password-input">
              <b-form-input id="password-input" type="password" v-model="registrationData.password" :state="!$v.registrationData.password.$invalid" required>
              </b-form-input>
            </b-form-group>

            <b-form-row>
              <b-col>
                <span class="text-secondary">
                  <small>
                    Подтверждая регистрацию вы даёте своё
                    <router-link to="/processing_agreement" class="text-secondary">
                      <u>согласие на обработку персональных данных</u>
                    </router-link>.
                  </small>
                </span>
              </b-col>
            </b-form-row>

            <b-form-row>
              <b-col>
                <b-button class="submit-button w-100 mt-2" type="submit" :disabled="$v.registrationData.$invalid || isInProcess" variant="primary">Подтвердить</b-button>
              </b-col>
            </b-form-row>

            <b-form-row>
              <router-link to="/login" class="btn btn-link text-secondary w-100 mt-2">У меня уже есть аккаунт</router-link>
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
import { Component, Prop, Vue } from "vue-property-decorator";
import { RouteConfig } from "vue-router";

import { validationMixin } from "vuelidate";
import {
  required,
  minLength,
  maxLength,
  email,
  numeric
} from "vuelidate/lib/validators";

import {
  RegistrationData,
  RegistrationDataDefault,
  PROFILE_CREATE
} from "@/store/modules/profile";

enum State {
  Default,
  InProcess,
  Error
}

const baseValidations = {
  firstName: { required, maxLength: maxLength(32) },
  lastName: { required, maxLength: maxLength(32) },
  email: { required, email },
  password: { required, minLength: minLength(6), maxLength: maxLength(32) }
};

@Component({
  mixins: [validationMixin],
  validations() {
    return { registrationData: baseValidations };
  }
})
export default class RegistrationPage extends Vue {
  // Page properties //
  ////////////////////

  pageState: State = State.Default;
  registrationData: RegistrationData = new RegistrationDataDefault();

  // Methods //
  ////////////

  onSubmit() {
    this.pageState = State.InProcess;
    this.$store
      .dispatch(PROFILE_CREATE, this.registrationData)
      .then(result => {
        this.registrationData = new RegistrationDataDefault();
        this.$router.push({ name: "EventsPage" });

        this.pageState = State.Default;
      })
      .catch(error => {
        console.log(error);
        this.pageState = State.Error;
      });
  }

  get isInProcess(): boolean {
    return this.pageState == State.InProcess;
  }
}

export const registrationPageRoute = <RouteConfig>{
  path: "/register",
  name: "RegistrationPage",
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
@import "@/styles/general.scss";

.registration-page {
  @include media-breakpoint-down(sm) {
    @include theme-specific() {
      background-color: getstyle(form-card-background-color);
    }
  }
}
</style>
<!-- STYLE END -->