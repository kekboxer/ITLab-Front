<!-- TEMPLATE BEGIN -->
<template>
  <div class="notifications-page">
    <b-container class="content">
      <b-row>
        <b-col>
          <h1 class="page-title">Уведомления</h1>
        </b-col>
      </b-row>
      <br>
      <loading-stub-component v-if="loadingInProcess"></loading-stub-component>
      <div v-else>
        <template v-if="eventInvitations.length > 0">
          <b-row v-for="invitation in eventInvitations" :key="`${invitation.placeId}-${invitation.role.id}`">
            <b-col>
              <invitation-notification-component :data="invitation"></invitation-notification-component>
            </b-col>
          </b-row>
        </template>
        <template v-else>
          <b-row>
            <b-col class="text-center text-lg-left">
              <span class="notifications-empty-text">Новых уведомлений нет</span>
            </b-col>
          </b-row>
        </template>
      </div>
    </b-container>
  </div>
</template>
<!-- TEMPALTE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { RouteConfig } from 'vue-router';
import moment from 'moment-timezone';

import LoadingStubComponent from '@/components/LoadingStubComponent.vue';
import InvitationNotificationComponent from '@/components/InvitationNotificationComponent.vue';

import {
  EventInvitation,
  NOTIFICATION_INVITATIONS_GET_ALL,
  NOTIFICATION_INVITATIONS_FETCH
} from '@/modules/notifications';

@Component({
  components: {
    'loading-stub-component': LoadingStubComponent,
    'invitation-notification-component': InvitationNotificationComponent
  }
})
export default class NotificationsPage extends Vue {
  // Properties //
  ///////////////

  public loadingInProcess: boolean = true;

  // Component methods //
  //////////////////////

  public mounted() {
    this.loadingInProcess = this.eventInvitations.length === 0;

    this.$store.dispatch(NOTIFICATION_INVITATIONS_FETCH).then((result) => {
      this.loadingInProcess = false;
    });
  }

  // Computed data //
  //////////////////

  get eventInvitations(): EventInvitation[] {
    return this.$store.getters[NOTIFICATION_INVITATIONS_GET_ALL];
  }
}

export const notificationsPageRoute: RouteConfig = {
  path: '/notifications',
  name: 'NotificationsPage',
  component: NotificationsPage
};
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
@import '@/styles/general.scss';

.notifications-page {
  .notifications-empty-text {
    font-size: 2em;
  }
}
</style>
<!-- STYLE END -->
