<!-- TEMPLATE BEGIN -->
<template>
  <div class="auth-page fullscreen-height">
    <b-container class="fullscreen-height">
      <b-row align-v="center" align-h="center" class="fullscreen-height">
        <b-col class="form-card" cols="10" md="5" lg="4">

          <b-form @submit.prevent="onSubmit">
            <b-form-row>
              <b-col align="center" class="pt-2">
                <svgicon class="logo" name="logo" height="230"></svgicon>
              </b-col>
            </b-form-row>

            <b-alert :show="isLoginOrPasswordInvalid" variant="danger" dismissible>
              Неправильный логин или пароль
            </b-alert>

            <b-form-group id="username-input-group" label="Логин" label-for="username-input">
              <b-form-input id="username-input" type="email" v-model.trim="authorizationData.username" key="login" required>
              </b-form-input>
            </b-form-group>

            <b-form-group id="password-input-group" label="Пароль" label-for="password-input">
              <b-form-input id="password-input" type="password" v-model="authorizationData.password" key="password" required ref="password-input">
              </b-form-input>
            </b-form-group>

            <b-form-row>
              <b-col>
                <b-button class="submit-button w-100" type="submit" variant="primary" :disabled="isInProcess">Войти</b-button>
              </b-col>
            </b-form-row>

            <b-form-row>
              <router-link to="/register" class="btn btn-link text-secondary w-100 mt-2">У меня ещё нет аккаунта</router-link>
            </b-form-row>
          </b-form>

        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { RouteConfig } from "vue-router";

import {
  AuthorizationData,
  AuthorizationDataDefault,
  PROFILE_LOGIN
} from "@/store/modules/profile";

import "@/icons/logo";

enum State {
  Default,
  InProcess,
  Error
}

@Component
export default class LoginPage extends Vue {
  // Page properties //
  ////////////////////

  pageState: State = State.Default;
  authorizationData: AuthorizationData = new AuthorizationDataDefault();

  // Methods //
  ////////////

  onSubmit() {
    this.pageState = State.InProcess;
    this.$store
      .dispatch(PROFILE_LOGIN, this.authorizationData)
      .then(result => {
        this.authorizationData = new AuthorizationDataDefault();

        if (this.$route.params && this.$route.params.to) {
          this.$router.push(this.$route.params.to);
        } else {
          this.$router.push("events");
        }

        this.pageState = State.Default;
      })
      .catch(error => {
        this.authorizationData.password = "";

        const passwordInput = this.$refs["password-input"] as HTMLElement;
        passwordInput.focus();

        this.pageState = State.Error;
      });
  }

  get isLoginOrPasswordInvalid(): boolean {
    return this.pageState == State.Error;
  }

  get isInProcess(): boolean {
    return this.pageState == State.InProcess;
  }
}

export const loginPageRoute = <RouteConfig>{
  path: "/login",
  name: "LoginPage",
  component: LoginPage,
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

.auth-page {
  @include media-breakpoint-down(sm) {
    @include theme-specific() {
      background-color: getstyle(form-card-background-color);
    }
  }
}
</style>
<!-- STYLE END -->
