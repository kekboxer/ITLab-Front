<!-- TEMPLATE BEGIN -->
<template>
  <div class="profile-page">
    <page-content-component :loading="loadingInProcess">
      <template slot="header">
        Профиль
      </template>

      <b-row>
        <b-col cols="12" md="6">
          <h4>Общая информация</h4>
          <hr>
          <b-form @submit.prevent="onSubmitProfile">
            <b-form-group label="Имя">
              <b-form-input type="text" v-model.trim="profile.firstName" readonly>
              </b-form-input>
            </b-form-group>

            <b-form-group label="Фамилия">
              <b-form-input type="text" v-model.trim="profile.lastName" readonly>
              </b-form-input>
            </b-form-group>

            <b-form-group label="Почта">
              <b-form-input type="text" v-model.trim="profile.email" readonly>
              </b-form-input>
            </b-form-group>
          </b-form>
        </b-col>

        <b-col cols="12" md="6">
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
      <hr>
      <b-row>

      </b-row>
    </page-content-component>
  </div>
</template>
<!-- TEMPALTE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RouteConfig } from 'vue-router';
import moment from 'moment-timezone';

import Icon from 'vue-awesome/components/Icon';
import PageContentComponent from '@/components/PageContentComponent.vue';

import 'vue-awesome/icons/times';

import {
  PROFILE_SESSIONS_FETCH,
  PROFILE_SESSIONS_DELETE,
  PROFILE_GET,
  UserSession
} from '@/modules/profile';
import { USERS_FETCH_ONE, User, UserDefault } from '@/modules/users';

@Component({
  components: {
    Icon,
    'page-content-component': PageContentComponent
  }
})
export default class ProfilePage extends Vue {
  // Properties //
  ///////////////

  public loadingInProcess: boolean = true;
  public profile: User = new UserDefault();
  public sessions: UserSession[] = [];

  // Component methods //
  //////////////////////

  public mounted() {
    this.$store
      .dispatch(USERS_FETCH_ONE, this.$store.getters[PROFILE_GET])
      .then((profile) => {
        this.profile = profile;
        this.loadingInProcess = false;

        return this.$store.dispatch(PROFILE_SESSIONS_FETCH);
      })
      .then((sessions) => {
        this.sessions = sessions;
      });
  }

  // Methods //
  ////////////

  public removeSession(sessionIndex: number) {
    const session = this.sessions[sessionIndex];

    this.$store
      .dispatch(PROFILE_SESSIONS_DELETE, [session.id])
      .then((response) => {
        Vue.delete(this.sessions, sessionIndex);
      })
      .catch();
  }

  public formatSessionDate(session: UserSession): string {
    return moment(session.createTime).format('DD.MM.YYYY HH:mm:ss');
  }
}

export const profilePageRoute = {
  path: '/profile',
  name: 'ProfilePage',
  component: ProfilePage
} as RouteConfig;
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
@import '@/styles/general.scss';

.profile-page {
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