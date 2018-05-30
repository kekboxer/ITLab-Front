<!-- TEMPALTE BEGIN -->
<template>
  <div class="loading-stub-component">
    <svgicon class="spinner" name="loading" height="200"></svgicon>
  </div>
</template>
<!-- TEMPALTE END -->


<!-- SCRIPT BEGTIN -->
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import "@/icons/loading";

@Component
export default class LoadingStubComponent extends Vue {}
</script>

<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
@import "@/styles/general.scss";

.loading-stub-component {
  text-align: center;
  height: 100%;
  
  .spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translateX(-50%) translateY(-50%);
    -moz-transform: translateX(-50%) translateY(-50%);
    -ms-transform: translateX(-50%) translateY(-50%);
    transform: translateX(-50%) translateY(-50%);
    fill: #e2e2e2;
  }
}
</style>
<!-- STYLE END -->