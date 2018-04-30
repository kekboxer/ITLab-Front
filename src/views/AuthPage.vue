<!-- TEMPALTE BEGIN -->
<template>
  <div class="auth-page h-100">
    <b-container class="h-100">
      <b-row align-v="center" align-h="center" class="h-100">
        <b-col class="card" cols="10" md="5" lg="4">

          <!-- LOGIN TEMPLATE BEGIN -->
          <template v-if="authType == 'login'">
            <b-form @submit="onSubmitLogin">
              <b-form-row>
                <b-col align="center">
                  <b-img rounded="circle" width="200" src="static/logo.jpg" :center="true" class="m-1" />
                </b-col>
              </b-form-row>

              <b-form-group id="email-input-group" label="Логин" label-for="email-input">
                <b-form-input id="email-input" type="email" v-model="loginData.email">
                </b-form-input>
              </b-form-group>

              <b-form-group id="password-input-group" label="Пароль" label-for="password-input">
                <b-form-input id="password-input" type="password" v-model="loginData.password">
                </b-form-input>
              </b-form-group>

              <b-form-row>
                <b-col sm="12" lg="6" class="checkbox-centered-wrapper">
                  <b-form-group id="remember-input-group">
                    <b-form-checkbox id="remember-input" class="noselect" v-model="loginData.remember" :value="true" :unchecked-value="false">
                      Запомнить меня
                    </b-form-checkbox>
                  </b-form-group>
                </b-col>
                <b-col sm="12" lg="6">
                  <b-button class="submit-button w-100" type="submit" @click="onSubmitLogin() /* temp solution */" variant="primary">Войти</b-button>
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
            <b-form @submit="onSubmitRegister">
              <b-row>
                <b-col align="center">
                  <h2>Регистрация</h2>
                </b-col>
              </b-row>

              <b-form-group id="first-name-input-group" label="Имя" label-for="first-name-input">
                <b-form-input id="first-name-input" type="text" v-model="registerData.firstName" :state="!$v.registerData.firstName.$invalid" required>
                </b-form-input>
              </b-form-group>

              <b-form-group id="last-name-input-group" label="Фамилия" label-for="last-name-input">
                <b-form-input id="last-name-input" type="text" v-model="registerData.lastName" :state="!$v.registerData.lastName.$invalid" required>
                </b-form-input>
              </b-form-group>

              <b-form-group id="student-id-input-group" label="Номер студенческого билета" label-for="student-id-name-input">
                <b-form-input id="student-id-name-input" type="text" v-model="registerData.studentId" required>
                </b-form-input>
              </b-form-group>

              <b-form-group id="email-input-group" label="Почта" label-for="email-input">
                <b-form-input id="email-input" type="email" v-model="registerData.email" :state="!$v.registerData.email.$invalid" required>
                </b-form-input>
              </b-form-group>

              <b-form-group id="password-input-group" label="Пароль" label-for="password-input">
                <b-form-input id="password-input" type="password" v-model="registerData.password" :state="!$v.registerData.password.$invalid" required>
                </b-form-input>
              </b-form-group>

              <b-form-row>
                <b-button class="submit-button w-100" type="submit" @click="onSubmitLogin() /* temp solution */" variant="primary">Подтвердить</b-button>
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
  email
} from "vuelidate/lib/validators";

import { registerPage } from "@/router/PagesInformation";

class LoginData {
  email: string = "";
  password: string = "";
  remember: boolean = true;
}

class RegisterData {
  firstName: string = "";
  lastName: string = "";
  studentId: string = "";
  email: string = "";
  password: string = "";
}

@Component({
  name: "AuthPage",
  mixins: [validationMixin],
  validations: {
    registerData: {
      firstName: { required, maxLength: maxLength(32) },
      lastName: { required, maxLength: maxLength(32) },
      email: { required, email },
      password: { required, minLength: minLength(8), maxLength: maxLength(32) }
    }
  }
})
class AuthPage extends Vue {
  // props
  @Prop({ validator: value => ["login", "register"].indexOf(value) !== -1 })
  authType?: String;

  // data
  loginData = new LoginData();
  registerData = new RegisterData();

  // methods
  onSubmitLogin() {
    // on success {
      this.$session.start()
      this.$router.replace({ name: "HomePage" });
    // }
  }
  onSubmitRegister() {
    // Submit register data
  }
}

registerPage( {
    path: "/login",
    name: "LoginPage",
    component: AuthPage
  }, {
    secure: false,
    hideNavigation: true
  }, {
    authType: "login"
  }
);

registerPage( {
    path: "/register",
    name: "RegistrationPage",
    component: AuthPage
  }, {
    secure: false,
    hideNavigation: true
  }, {
    authType: "register"
  }
);

export default AuthPage;
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style>
.auth-page .card {
  padding-top: 10px;
  padding-bottom: 10px;
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 0;
}

.auth-page .checkbox-centered-wrapper .noselect {
  margin-right: 0;
}

@media (max-width: 575.98px) {
  .auth-page .card {
    border: none;
  }
}

@media (min-width: 992px) {
  .auth-page .checkbox-centered-wrapper {
    display: flex;
    align-items: center;
  }

  .auth-page #remember-input-group {
    margin-bottom: 0;
  }
}
</style>
<!-- STYLE END -->
