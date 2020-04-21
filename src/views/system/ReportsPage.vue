<!-- TEMPALTE BEGIN -->
<template>
  <div>
    <vue-headful title="Смена API"></vue-headful>
    <div>Redirecting...</div>
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RouteConfig } from 'vue-router';
import axios from 'axios';
import configuration from '../../stuff/configuration';

const LOCAL_STORAGE_API_URL = 'api-url';

@Component
export default class ReportsPage extends Vue {

  public baseAddress: string = location.origin;
  public accessToken?: string | null;
  public filesBaseAddress?: string = configuration.VUE_APP_FILES_BASE_ADDRESS;

  // Component methods //
  //////////////////////

  public async mounted() {
    this.accessToken = await this.$userManager.accessToken();
    location.assign(`${this.baseAddress}/test/?baseaddress=${this.baseAddress}&token=${this.accessToken}&filesBaseAddress=${this.filesBaseAddress}`);
  }

  // Methods //
  ////////////

}

export const reportsPageRoute: RouteConfig = {
  path: '/reports',
  name: 'reports',
  component: ReportsPage,
};
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
</style>
<!-- STYLE END -->