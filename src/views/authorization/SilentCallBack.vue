<!-- TEMPALTE BEGIN -->
<template>
  <div class="auth-page fullscreen-height">
    <p>Logging in...</p>
  </div>
</template>
<!-- TEMPLATE END -->

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RouteConfig } from 'vue-router';
import Oidc from 'oidc-client';

@Component
export default class SilentCallBack extends Vue {
  public async mounted() {
    const manager = new Oidc.UserManager({});
    manager
      .signinSilentCallback()
      .catch((e) => {
        console.error(e);
      });
  }
}

export const silentCallBackPageRoute: RouteConfig = {
  path: '/silentcallback',
  name: 'SilentCallBack',
  component: SilentCallBack,
  meta: {
    secure: false,
    hideNavigation: true
  }
};
</script>
