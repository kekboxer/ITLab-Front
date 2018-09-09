<!-- TEMPLATE BEGIN -->
<template>
  <div class="settings-page">
    <page-content-component>
      <template slot="header">
        Настройки
      </template>

      <b-row>
        <b-col>
          <b-form @submit.prevent="onSubmitEvent">
            <b-form-group horizontal label="Тема интерфейса:" abel-for="theme-input" class="noselect">
              <b-form-radio-group id="theme-input" v-model="theme" class="pt-2" :options="themes" />
            </b-form-group>
          </b-form>

          <a href="/backend_selection" v-if="environment === 'development'" target="blank">Смена API URL</a>
        </b-col>
      </b-row>
    </page-content-component>
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RouteConfig } from 'vue-router';

import PageContentComponent from '@/components/PageContentComponent.vue';

import {
  PROFILE_SETTINGS_THEME_SET,
  PROFILE_SETTINGS_THEME_GET
} from '@/modules/profile';

@Component({
  components: {
    'page-content-component': PageContentComponent
  }
})
export default class SettingsPage extends Vue {
  // Methods //
  ////////////

  set theme(themeName: string) {
    this.$store.commit(PROFILE_SETTINGS_THEME_SET, themeName);
  }

  // Computed data //
  //////////////////

  get theme(): string {
    return this.$store.getters[PROFILE_SETTINGS_THEME_GET];
  }

  get themes() {
    return {
      light: 'Светлая',
      dark: 'Тёмная'
    };
  }

  get environment(): string {
    return process.env.NODE_ENV || '';
  }
}

export const settingsPageRoute: RouteConfig = {
  path: '/settings',
  name: 'Settings',
  component: SettingsPage
};
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
</style>
<!-- STYLE END -->