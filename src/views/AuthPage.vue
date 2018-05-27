<!-- TEMPLATE BEGIN -->
<template>
  <div class="auth-page fullscreen-height">
    <b-container class="fullscreen-height">
      <b-row align-v="center" align-h="center" class="fullscreen-height">
        <b-col class="card" cols="10" md="5" lg="4">

          <!-- LOGIN TEMPLATE BEGIN -->
          <template v-if="authType == 'login'">
            <b-form @submit.prevent="onSubmitLogin">
              <b-form-row>
                <b-col align="center" style="min-height: 230px">
                  <b-img rounded="circle" height="230" src="static/logo.jpg" :center="true" class="m-1" />
                </b-col>
              </b-form-row>

              <b-alert :show="isLoginOrPasswordInvalid" variant="danger" dismissible>
                Неправильный логин или пароль
              </b-alert>

              <b-form-group id="username-input-group" label="Логин" label-for="username-input">
                <b-form-input id="username-input" type="email" v-model.trim="authData.username" key="login" required>
                </b-form-input>
              </b-form-group>

              <b-form-group id="password-input-group" label="Пароль" label-for="password-input">
                <b-form-input id="password-input" type="password" v-model="authData.password" key="password" required ref="password-input">
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
          </template>
          <!-- LOGIN TEMPLATE END -->

          <!-- REGISTER TEMPLATE BEGIN -->
          <template v-if="authType == 'register'">
            <b-form @submit.prevent="onSubmitRegister">
              <b-row>
                <b-col align="center">
                  <h2>Регистрация</h2>
                </b-col>
              </b-row>

              <b-form-group id="first-name-input-group" label="Имя" label-for="first-name-input">
                <b-form-input id="first-name-input" type="text" v-model.trim="registerData.firstName" :state="!$v.registerData.firstName.$invalid" required>
                </b-form-input>
              </b-form-group>

              <b-form-group id="last-name-input-group" label="Фамилия" label-for="last-name-input">
                <b-form-input id="last-name-input" type="text" v-model.trim="registerData.lastName" :state="!$v.registerData.lastName.$invalid" required>
                </b-form-input>
              </b-form-group>

              <b-form-group id="email-input-group" label="Почта" label-for="email-input">
                <b-form-input id="email-input" type="email" v-model.trim="registerData.email" :state="!$v.registerData.email.$invalid" required>
                </b-form-input>
              </b-form-group>

              <b-form-group id="password-input-group" label="Пароль" label-for="password-input">
                <b-form-input id="password-input" type="password" v-model="registerData.password" :state="!$v.registerData.password.$invalid" required>
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
                  <b-button class="submit-button w-100 mt-2" type="submit" :disabled="$v.registerData.$invalid || isInProcess" variant="primary">Подтвердить</b-button>
                </b-col>
              </b-form-row>

              <b-form-row>
                <router-link to="/login" class="btn btn-link text-secondary w-100 mt-2">У меня уже есть аккаунт</router-link>
              </b-form-row>
            </b-form>
          </template>
          <!-- REGISTER TEMPLATE BEGIN -->
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { validationMixin } from "vuelidate";
import {
  required,
  minLength,
  maxLength,
  email,
  numeric
} from "vuelidate/lib/validators";
import { Action, Getter } from "vuex-class";

import { registerPage } from "@/router/PagesInformation";
import { AUTH_LOGIN } from "@/store/actions/authorization";
import {
  AuthorizationData,
  createDefaultAuthorizationData
} from "@/store/modules/authorization/types";
import { PROFILE_CREATE } from "@/store/actions/profile";
import {
  RegistrationData,
  createDefaultRegistrationData
} from "@/store/modules/profile/types";

enum State {
  None,
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
  name: "AuthPage",
  mixins: [validationMixin],
  validations() {
    const registerData = (this as any).registerData;
    if (registerData.userType == "Student") {
      return {
        registerData: {
          ...baseValidations,
          studentId: { required }
        }
      };
    } else {
      return { registerData: baseValidations };
    }
  }
})
class AuthPage extends Vue {
  // props
  @Prop({ validator: value => ["login", "register"].indexOf(value) !== -1 })
  authType?: String;

  // data
  authData: AuthorizationData = createDefaultAuthorizationData();
  registerData: RegistrationData = createDefaultRegistrationData();

  authState: State = State.None;
  registrationState: State = State.None;

  // computed
  get isLoginOrPasswordInvalid(): boolean {
    return this.authState == State.Error;
  }

  get isInProcess(): boolean {
    return this.authState == State.InProcess;
  }

  // methods
  onSubmitLogin() {
    this.authState = State.InProcess;
    this.$store
      .dispatch(AUTH_LOGIN, this.authData)
      .then(result => {
        this.authState = State.None;
        this.authData = {
          username: "",
          password: ""
        };
        this.$router.push("events");
      })
      .catch(error => {
        this.authState = State.Error;
        this.authData.password = "";

        const passwordInput = this.$refs["password-input"] as HTMLElement;
        passwordInput.focus();
      });
  }
  onSubmitRegister() {
    this.registrationState = State.InProcess;
    this.$store
      .dispatch(PROFILE_CREATE, this.registerData)
      .then(result => {
        this.$router.push({ name: "EventsPage" });
      })
      .catch(error => {
        console.log(error);
      });
  }
}

registerPage(
  {
    path: "/login",
    name: "LoginPage",
    component: AuthPage
  },
  {
    secure: false,
    hideNavigation: true
  },
  {
    authType: "login"
  }
);

registerPage(
  {
    path: "/register",
    name: "RegistrationPage",
    component: AuthPage
  },
  {
    secure: false,
    hideNavigation: true
  },
  {
    authType: "register"
  }
);

export default AuthPage;
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
@import "@/styles/theme.scss";

.auth-page {
  .card {
    padding-top: 10px;
    padding-bottom: 10px;
    border: 1px solid rgba(0, 0, 0, 0.125);
    border-radius: 0;

    @include media-breakpoint-down(sm) {
      border: none;
    }

    @include theme-specific() {
      background-color: getstyle(auth-card-background-color);
    }
  }

  @include media-breakpoint-down(sm) {
    @include theme-specific() {
      background-color: getstyle(auth-card-background-color);
    }
  }
}
</style>
<!-- STYLE END -->
