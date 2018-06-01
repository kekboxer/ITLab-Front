<!-- TEMPALTE BEGIN -->
<template>
  <div class="autocomplete-input-component">

  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="typescript">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class AutocompleteInputComponent extends Vue {

}
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
@import "@/styles/general.scss";

.autocomplete-input-component {
  position: relative;

  .results {
    position: absolute;
    width: 100%;
    z-index: 1;
    padding: 0;
    margin: 0;

    .result-item {
      list-style: none;
      text-align: left;
      padding: 4px 10px;
      cursor: pointer;
    }

    .result-item:hover {
      background-color: $primary;
      color: white;
    }

    .add-item {
      list-style: none;
      text-align: left;
      padding: 4px 10px;
      cursor: pointer;
      border-top: 1px solid getcolor(white, base);
      
      border-bottom-left-radius: 0.25rem;
      border-bottom-right-radius: 0.25rem;
    }

    .add-item:hover {
      @include theme-specific() {
        background-color: darken(getstyle(form-control-background-color), 10%);
      }
    }

    border: 1px solid;
    border-bottom-left-radius: 0.25rem;
    border-bottom-right-radius: 0.25rem;

    @include theme-specific() {
      border-color: darken(getstyle(form-control-background-color), 10%);
      background-color: white;
      color: #495057;
    }
  }

  &.hide-results {
    .autocomplete-results {
      display: none;
    }
  }
}
</style>
<!-- STYLE END -->