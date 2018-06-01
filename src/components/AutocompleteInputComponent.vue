<!-- TEMPALTE BEGIN -->
<template>
  <div class="autocomplete-input-component" v-bind:class="{ 'hide-results': resultsHidden }">
    <input type="text" v-model="searchString" @input="onChange" @blur="onBlur" class="form-control">
    <ul class="results" v-show="!resultsHidden && (searchString.length > 1 || results.length > 0)">
      <li v-for="(result, index) in results" :key="'result-' + index" class="result-item" @mousedown.prevent="onSelect(result)">
        <slot v-bind:result="result">{{ stringify(result) }}</slot>
      </li>
      <li class="add-item" v-show="searchString.length > 1">
        <slot v-bind:search="searchString">Добавить {{ searchString }}</slot>
      </li>
    </ul>
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Prop, Model, Vue } from "vue-property-decorator";

@Component
export default class AutocompleteInputComponent extends Vue {
  resultsHidden: boolean = true;
  searchString: string = "";
  results: Object[] = [];

  @Model() selectedElement: Object | undefined;

  @Prop()
  stringify: Function = (v: Object) => {
    return v.toString();
  };

  @Prop()
  fetch: Function = (s: string, cb: Function) => {
    cb([]);
  };

  onBlur() {
    this.resultsHidden = true;
    if (this.selectedElement != undefined) {
      this.searchString = this.stringify(this.selectedElement);
    } else {
      this.searchString = "";
    }
  }

  onChange() {
    this.resultsHidden = false;
    this.fetch(this.searchString, (results: Object[]) => {
      this.results = results;
    });
  }

  onSelect(selected: Object) {
    this.searchString = this.stringify(this.selectedElement);
    this.selectedElement = selected;
    this.resultsHidden = true;
  }
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