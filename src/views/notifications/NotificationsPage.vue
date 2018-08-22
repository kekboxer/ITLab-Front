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
          <b-row v-for="notification in eventInvitations" :key="`${notification.placeId}-${notification.role.id}`">
            <b-col>
              <event-invitation-notification-component :data="notification"></event-invitation-notification-component>
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

import LoadingStubComponent from '@/components/LoadingStubComponent.vue';
import EventInvitationNotificationComponent from '@/components/EventInvitationNotificationComponent.vue';

import {
  EventInvitation,
  NOTIFICATIONS_GET_ALL,
  NOTIFICATIONS_FETCH
} from '@/modules/notifications';

@Component({
  components: {
    'loading-stub-component': LoadingStubComponent,
    'event-invitation-notification-component': EventInvitationNotificationComponent
  }
})
export default class NotificationsPage extends Vue {
  public loadingInProcess: boolean = true;

  public mounted() {
    this.loadingInProcess = this.eventInvitations.length === 0;

    this.$store.dispatch(NOTIFICATIONS_FETCH).then((result) => {
      this.loadingInProcess = false;
    });
  }

  get eventInvitations(): EventInvitation[] {
    return this.$store.getters[NOTIFICATIONS_GET_ALL];
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
