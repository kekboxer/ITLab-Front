<!-- TEMPLATE BEGIN -->
<template>
  <div class="equipment-page">
    <b-container class="content">
      <b-row>
        <b-col>
          <h1 class="page-title">Оборудование</h1>
        </b-col>
      </b-row>
      <br>

      <loading-stub-component v-if="loadingInProcess"></loading-stub-component>
    </b-container>
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { RouteConfig } from "vue-router";

import LoadingStubComponent from "@/components/LoadingStubComponent.vue"

@Component({
  components: {
    "loading-stub-component": LoadingStubComponent
  }
})
export default class EquipmentPage extends Vue {
  loadingInProcess: boolean = true

  bedoreMount() {
    this.loadingInProcess = true
  }
}

export const equipmentPageRoute = <RouteConfig>{
  path: "/equipment",
  name: "EquipmentPage",
  component: EquipmentPage
};
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
</style>
<!-- STYLE END -->