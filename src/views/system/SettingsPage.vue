<!-- TEMPLATE BEGIN -->
<template>
  <div class="settings-page">
    <page-content-component>
      <template slot="header">
        Настройки
      </template>

      <b-row>
        <b-col cols="12" md="6">
          <h4>Интерфейс</h4>
          <hr>

          <b-form @submit.prevent="onSubmitEvent">
            <b-form-group horizontal label="Тема:" class="noselect">
              <b-form-radio-group v-model="theme" class="pt-2" :options="themes" />
            </b-form-group>
          </b-form>

          <template v-if="environment === 'development'">
            <a href="/backend_selection" v-if="environment === 'development'" target="blank">Смена API URL</a><br>
          </template>
          <a href="/about" target="blank">О системе</a>
        </b-col>

        <b-col cols="12" md="6" class="mt-3 mt-md-0">
          <h4>Сессии</h4>
          <hr>
          <div class="session-card" v-for="(session, sectionIndex) in sessions" :key="session.id">
            <b-row>
              <b-col cols="auto">
                <b>{{ formatSessionDate(session) }}</b>
              </b-col>
              <b-col cols="auto" class="ml-auto">
                <div class="remove-button" @click="removeSession(sectionIndex)">
                  <icon name="times"></icon>
                </div>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <span style="font-family: monospace">{{ session.userAgent }}</span>
              </b-col>
            </b-row>
          </div>
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
import moment from 'moment-timezone';

import Icon from 'vue-awesome/components/Icon';
import PageContentComponent from '@/components/PageContentComponent.vue';

import 'vue-awesome/icons/times';

import {
  UserSession,
  PROFILE_SESSIONS_FETCH,
  PROFILE_SESSIONS_DELETE,
  PROFILE_SETTINGS_THEME_SET,
  PROFILE_SETTINGS_THEME_GET
} from '@/modules/profile';

@Component({
  components: {
    Icon,
    'page-content-component': PageContentComponent
  }
})
export default class SettingsPage extends Vue {
  // Properties //
  ///////////////

  public sessions: UserSession[] = [];

  // Component methods //
  //////////////////////

  public mounted() {
    this.$store
      .dispatch(PROFILE_SESSIONS_FETCH)
      .then((sessions) => (this.sessions = sessions));
  }

  // Methods //
  ////////////

  public removeSession(sessionIndex: number) {
    const session = this.sessions[sessionIndex];

    this.$store
      .dispatch(PROFILE_SESSIONS_DELETE, [session.id])
      .then((response) => Vue.delete(this.sessions, sessionIndex))
      .catch();
  }

  public formatSessionDate(session: UserSession): string {
    return moment(session.createTime).format('DD.MM.YYYY HH:mm:ss');
  }

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
@import '@/styles/general.scss';

.settings-page {
  .session-card {
    @extend .form-control;

    height: auto;

    &:not(:last-child) {
      margin-bottom: 5px;
    }

    .remove-button {
      @extend .noselect;
      cursor: pointer;

      transition: color 0.15s ease-in-out;

      svg {
        position: relative;
        top: -2px;
      }

      &:hover {
        color: var(--danger);
      }
    }
  }
}
</style>
<!-- STYLE END -->