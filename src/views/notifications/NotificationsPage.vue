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

@Component({
  components: {
    'loading-stub-component': LoadingStubComponent
  }
})
export default class NotificationsPage extends Vue {
  public loadingInProcess: boolean = true;

  public mounted() {
    this.loadingInProcess = false;
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
</style>
<!-- STYLE END -->
