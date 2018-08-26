<!-- TEMPLATE BEGIN -->
<template>
  <div class="profile-page">
    <page-content-component :loading="loadingInProcess">
      <template slot="header">
        Профиль
      </template>
    </page-content-component>
  </div>
</template>
<!-- TEMPALTE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RouteConfig } from 'vue-router';

import PageContentComponent from '@/components/PageContentComponent.vue';

@Component({
  components: {
    'page-content-component': PageContentComponent
  }
})
export default class ProfilePage extends Vue {
  // Properties //
  ///////////////

  public loadingInProcess: boolean = true;
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
</style>
<!-- STYLE END -->