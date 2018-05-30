<!-- TEMPLATE BEGIN -->
<template>
  <div class="profile-settings-page">
    <b-container class="content">
      <b-row>
        <b-col>
          <h1 class="page-title">Настройки профиля</h1>
        </b-col>
      </b-row>
      <br>

      <b-row>
        <b-col>
          <b-form @submit.prevent="onSubmitEvent">
            <b-form-group horizontal label="Тема интерфейса:" abel-for="theme-input" class="noselect">
              <b-form-radio-group id="theme-input" v-model="theme" class="pt-2" :options="themes" />
            </b-form-group>
          </b-form>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { RouteConfig } from "vue-router";

import {
  SETTINGS_DARK_THEME_SET,
  SETTINGS_DARK_THEME_GET
} from "@/store/actions/profile";

@Component
export default class ProfileSettingsPage extends Vue {
  set theme(themeName: string) {
    this.$store.commit(SETTINGS_DARK_THEME_SET, themeName);
  }

  get theme(): string {
    return this.$store.getters[SETTINGS_DARK_THEME_GET];
  }

  get themes() {
    return {
      light: "Светлая",
      dark: "Тёмная"
    };
  }
}

export const profileSettingsPageRoute = <RouteConfig>{
  path: "/settings",
  name: "ProfileSettings",
  component: ProfileSettingsPage
};
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
</style>
<!-- STYLE END -->