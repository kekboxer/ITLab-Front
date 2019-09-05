<!-- TEMPLATE BEGIN -->
<template>
  <div class="auth-page fullscreen-height">
    <b-container class="fullscreen-height">
      <b-row align-v="center" align-h="center" class="fullscreen-height">
        <b-col class="form-card" cols="10" md="5" lg="4">
          <b-form @submit.prevent="onSubmit">
            <b-form-row class="mb-3">
              <b-col align="center" class="pt-2">
                <svgicon class="logo" name="logo" height="230"></svgicon>
              </b-col>
            </b-form-row>

            <template v-if="!forgotPassword"></template>
            <template v-else>
              <template v-if="!wasFinished">
                <b-form-group label="Почта">
                  <b-form-input
                    autocomplete="email"
                    :key="'requset-email'"
                    type="email"
                    v-model.trim="passwordRestoreRequest.email"
                    :state="!$v.passwordRestoreRequest.email.$invalid"
                    required
                  ></b-form-input>
                </b-form-group>
              </template>
              <template v-else>
                <b-form-row>
                  <b-col align="center">Далее следуйте инструкциям в письме</b-col>
                </b-form-row>
              </template>
            </template>

            <b-form-row>
              <b-col>
                <b-button
                  class="submit-button w-100"
                  type="submit"
                  variant="primary"
                  v-if="!(forgotPassword && wasFinished)"
                  :disabled="forgotPassword && $v.passwordRestoreRequest.$invalid || isInProcess"
                >{{ submitButtonText }}</b-button>
              </b-col>
            </b-form-row>

            <b-form-row>
              <span
                class="btn btn-link text-secondary w-100 mt-2"
                @click="forgotPassword = !forgotPassword"
              >{{ forgotPassword? 'Назад' : 'Не помню пароль' }}</span>
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
import { Component, Prop, Vue } from 'vue-property-decorator';
import { RouteConfig } from 'vue-router';
import { validationMixin } from 'vuelidate';
import { email, required } from 'vuelidate/lib/validators';
import {
  IPasswordRequestData,
  PasswordRequestDataDefault,
  PROFILE_REQUEST_PASSWORD
} from '@/modules/profile';
import '@/icons/logo';
enum FormState {
  Default,
  InProcess,
  Error,
  Finished
}
@Component({
  mixins: [validationMixin],
  validations() {
    return {
      passwordRestoreRequest: {
        email: {
          email,
          required
        }
      }
    };
  }
})
export default class LoginPage extends Vue {
  // Page properties //
  ////////////////////
  public formState: FormState = FormState.Default;
  public forgotPassword: boolean = false;
  public passwordRestoreRequest: IPasswordRequestData = new PasswordRequestDataDefault();
  // Component methods //
  //////////////////////
  public mounted() {
    this.formState = FormState.Default;
    this.forgotPassword = false;
    this.passwordRestoreRequest = new PasswordRequestDataDefault();
  }
  // Methods //
  ////////////
  public onSubmit() {
    if (this.forgotPassword && !this.wasFinished) {
      this.onSubmitRestoreForm();
    } else if (!this.forgotPassword) {
      this.onSubmitLoginForm();
    }
  }
  public async onSubmitLoginForm() {
    await this.$userManager.signin();
  }

  public onSubmitRestoreForm() {
    this.formState = FormState.InProcess;
    this.$store
      .dispatch(PROFILE_REQUEST_PASSWORD, this.passwordRestoreRequest)
      .then(() => {
        this.formState = FormState.Finished;
      })
      .catch(() => {
        this.$notify({
          title: 'Невозможно запросить изменение пароля',
          type: 'error',
          duration: 1500
        });
        this.formState = FormState.Default;
      });
  }

  get submitButtonText(): string {
    if (this.isInProcess) {
      return 'Подождите...';
    }
    return this.forgotPassword ? 'Подтвердить' : 'Войти';
  }
  get isInProcess(): boolean {
    return this.formState === FormState.InProcess;
  }
  get wasFinished(): boolean {
    return this.formState === FormState.Finished;
  }
}
export const loginPageRoute: RouteConfig = {
  path: '/login',
  name: 'LoginPage',
  component: LoginPage,
  meta: {
    secure: false,
    hideNavigation: true
  }
} as RouteConfig;
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
@import '@/styles/general.scss';
.auth-page {
  @include media-breakpoint-down(sm) {
    @include theme-specific() {
      background-color: getstyle(form-card-background-color);
    }
  }
}
</style>
<!-- STYLE END -->