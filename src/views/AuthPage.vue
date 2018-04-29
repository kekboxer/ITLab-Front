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

              <b-form-group id="email-input-group" label="Enter email:" label-for="email-input">
                <b-form-input id="email-input" type="email" v-model="loginData.email" required>
                </b-form-input>
              </b-form-group>

              <b-form-group id="password-input-group" label="Enter password" label-for="password-input">
                <b-form-input id="password-input" type="password" v-model="loginData.password" required>
                </b-form-input>
              </b-form-group>

              <b-form-row>
                <b-col sm="12" lg="6" class="checkbox-centered-wrapper">
                  <b-form-group id="remember-input-group">
                    <b-form-checkbox id="remember-input" class="noselect" v-model="loginData.remember" :value="true" :unchecked-value="false">
                      Remember me
                    </b-form-checkbox>
                  </b-form-group>
                </b-col>
                <b-col sm="12" lg="6">
                  <b-button class="submit-button w-100" type="submit" variant="primary">Login</b-button>
                </b-col>
              </b-form-row>

              <b-form-row>
                <router-link to="/register" class="btn btn-link text-secondary w-100 mt-2">I don't have account</router-link>
              </b-form-row>
            </b-form>
          </template>
          <!-- LOGIN TEMPLATE END -->

          <!-- REGISTER TEMPLATE BEGIN -->
          <template v-if="authType == 'register'">
            <b-form @submit="onSubmitRegister">
              <b-form-group id="first-name-input-group" label="Enter first name:" label-for="first-name-input">
                <b-form-input id="first-name-input" type="text" v-model="registerData.firstName" :state="!$v.registerData.firstName.$invalid" required>
                </b-form-input>
              </b-form-group>

              <b-form-group id="last-name-input-group" label="Enter last name:" label-for="last-name-input">
                <b-form-input id="last-name-input" type="text" v-model="registerData.lastName" :state="!$v.registerData.lastName.$invalid" required>
                </b-form-input>
              </b-form-group>

              <b-form-group id="student-id-input-group" label="Enter student id:" label-for="student-id-name-input">
                <b-form-input id="student-id-name-input" type="text" v-model="registerData.studentId" :state="!$v.registerData.studentId.$invalid" required>
                </b-form-input>
              </b-form-group>

              <b-form-group id="email-input-group" label="Enter email:" label-for="email-input">
                <b-form-input id="email-input" type="email" v-model="registerData.email" :state="!$v.registerData.email.$invalid" required>
                </b-form-input>
              </b-form-group>

              <b-form-group id="password-input-group" label="Enter password" label-for="password-input">
                <b-form-input id="password-input" type="password" v-model="registerData.password" :state="!$v.registerData.password.$invalid" required>
                </b-form-input>
              </b-form-group>

              <b-form-row>
                <b-button class="submit-button w-100" type="submit" variant="primary">Register</b-button>
              </b-form-row>

              <b-form-row>
                <router-link to="/login" class="btn btn-link text-secondary w-100 mt-2">I have an account</router-link>
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
import { Component, Prop, Vue } from "vue-property-decorator"
import { validationMixin } from "vuelidate"
import { required, minLength, maxLength, email } from "vuelidate/lib/validators"

import { PageMeta } from "@/stuff/pagemeta"

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
  mixins: [ validationMixin ],
  validations: {
    registerData: {
      firstName: { required, maxLength: maxLength(32) },
      lastName: { required, maxLength: maxLength(32) },
      studentId: { required, minLength: minLength(6), maxLength: maxLength(8) },
      email: { required, email },
      password: { required, minLength: minLength(8), maxLength: maxLength(32) }
    }
  },
})
export default class AuthPage extends Vue {
  // props
  @Prop({ validator: value => ["login", "register"].indexOf(value) !== -1 })
  authType?: String;

  // data
  loginData = new LoginData
  registerData = new RegisterData

  // methods
  onSubmitLogin() {    
    //on success
    this.$session.start()
    
    this.$router.replace({name: "HomePage"})
  }
  onSubmitRegister() {
    // Submit register data
  }
}

export const authPageMeta: PageMeta = new PageMeta({
  secure: false,
  hideNavbar: true
})
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style>
.auth-page .card {
  padding-top: 10px;
  padding-bottom: 10px;
}

.auth-page .checkbox-centered-wrapper .noselect {
  margin-right: 0;
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
