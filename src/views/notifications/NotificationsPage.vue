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
        <template v-if="eventNotifications.length > 0">
          <b-row v-for="notification in eventNotifications" :key="`${notification.placeId}-${notification.role.id}`">
            <b-col>
              <notification-component :data="notification"></notification-component>
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

import NotificationComponent from '@/components/NotificationComponent.vue';
import LoadingStubComponent from '@/components/LoadingStubComponent.vue';

import {
  EventNotification,
  NOTIFICATIONS_GET_ALL,
  NOTIFICATIONS_FETCH
} from '@/modules/notifications';

@Component({
  components: {
    'loading-stub-component': LoadingStubComponent,
    'notification-component': NotificationComponent
  }
})
export default class NotificationsPage extends Vue {
  public loadingInProcess: boolean = true;

  public mounted() {
    this.loadingInProcess = this.eventNotifications.length === 0;

    this.$store.dispatch(NOTIFICATIONS_FETCH).then((result) => {
      this.loadingInProcess = false;
    });
  }

  get eventNotifications(): EventNotification[] {
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
