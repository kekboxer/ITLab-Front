<!-- TEMPALTE BEGIN -->
<template>
  <div class="password-restore-page fullscreen-height">
    <b-container class="fullscreen-height">
      <b-row align-v="center" align-h="center" class="fullscreen-height">
        <b-col class="form-card" cols="10" md="5" lg="4">

          <b-form @submit.prevent="onSubmit">
            <b-row>
              <b-col align="center">
                <h2>Смена пароля</h2>
              </b-col>
            </b-row>

            <b-form-group label="Пароль">
              <b-form-input autocomplete="new-password" type="password" v-model="passwordRestoreData.password" :state="!$v.passwordRestoreData.password.$invalid" required>
              </b-form-input>
            </b-form-group>

            <b-form-group label="Ещё раз">
              <b-form-input autocomplete="off" type="password" v-model="passwordRestoreData.passwordRepeat" :state="!$v.passwordRestoreData.passwordRepeat.$invalid" required>
              </b-form-input>
            </b-form-group>

            <b-form-row>
              <b-col>
                <b-button class="submit-button w-100 mt-2" type="submit" :disabled="$v.passwordRestoreData.$invalid || isInProcess" variant="primary">Подтвердить</b-button>
              </b-col>
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
import {
  required,
  minLength,
  maxLength,
  sameAs
} from 'vuelidate/lib/validators';
import {
  IPasswordRestoreData,
  PasswordRestoreDataDefault,
  PROFILE_RESTORE_PASSWORD
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
      passwordRestoreData: {
        password: {
          required,
          minLength: minLength(6),
          maxLength: maxLength(32)
        },
        passwordRepeat: {
          required,
          sameAsPassword: sameAs('password')
        }
      }
    };
  }
})
export default class PasswordRestorePage extends Vue {
  // Page properties //
  ////////////////////

  public pageState: State = State.Default;
  public passwordRestoreData: IPasswordRestoreData = new PasswordRestoreDataDefault();

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
    this.passwordRestoreData.email = decodeURIComponent(email);
    this.passwordRestoreData.token = decodeURIComponent(code);
  }

  // Methods //
  ////////////

  public onSubmit() {
    this.pageState = State.InProcess;
    this.$store
      .dispatch(PROFILE_RESTORE_PASSWORD, this.passwordRestoreData)
      .then((result) => {
        this.passwordRestoreData = new PasswordRestoreDataDefault();
        this.$notify({
          title: 'Пароль успешно изменён',
          type: 'error',
          duration: 500
        });
        this.$router.push({ name: 'LoginPage' });

        this.pageState = State.Default;
      })
      .catch((error) => {
        this.$notify({
          title: 'Невозможно изменить пароль',
          type: 'error',
          duration: 1500
        });
        this.pageState = State.Default;
      });
  }

  get isInProcess(): boolean {
    return this.pageState === State.InProcess;
  }
}

export const passwordRestorePageRoute: RouteConfig = {
  path: '/password_restore',
  name: 'PasswordRestorePage',
  component: PasswordRestorePage,
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

.password-restore-page {
  @include media-breakpoint-down(sm) {
    @include theme-specific() {
      background-color: getstyle(form-card-background-color);
    }
  }
}
</style>
<!-- STYLE END -->