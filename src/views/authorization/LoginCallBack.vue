<!-- TEMPALTE BEGIN -->
<template>
  <div class="auth-page fullscreen-height">
    <p>Logging in...</p>
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RouteConfig } from 'vue-router';
import Oidc from 'oidc-client';

@Component
export default class LoginCallBack extends Vue {
  public async mounted() {
    const manager = new Oidc.UserManager({ response_mode: 'query' });
    manager
      .signinRedirectCallback()
      .then(() => {
        window.location.href = '/events';
      })
      .catch((e) => {
        console.error(e);
      });
  }
}

export const loginCallBackPageRoute: RouteConfig = {
  path: '/logincallback',
  name: 'LoginCallBack',
  component: LoginCallBack,
  meta: {
    layout: 'no-sidebar',
    secure: false,
    hideNavigation: true
  }
};
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
</style>
<!-- STYLE END -->