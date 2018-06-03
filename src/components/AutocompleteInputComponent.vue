<!-- TEMPALTE BEGIN -->
<template>
  <div class="autocomplete-input-component" v-bind:class="{ 'hide-results': resultsHidden }">
    <input type="text" v-model="searchString" @input="onChange" @blur="onBlur" class="form-control">
    <ul class="results" v-show="!resultsHidden && (searchString.length > 1 || results.length > 0)">
      <li v-for="(result, index) in results" :key="'result-' + index" class="result-item" @mousedown.prevent="onSelect(result)">
        <slot name="result-item" v-bind:search="searchString" v-bind:item="result" v-bind:results="results">{{ stringify && stringify(result) }}</slot>
      </li>
      <li class="add-item" v-show="searchString.length > 1" v-if="!checkExistence" @mousedown="onAdd()">
        <slot name="add-item" v-bind:search="searchString" v-bind:results="results">Добавить
          <b>{{ searchString }}</b>
        </slot>
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

  @Prop() value?: Object;

  @Prop({
    default: (v: Object) => {
      return v ? v.toString() : "";
    }
  })
  stringify?: Function;

  @Prop({
    default: (s: string, cb: Function) => {
      if (cb) {
        console.log(cb);
        cb([]);
      }
    }
  })
  fetch?: Function;

  @Prop({
    default: (title: string) => {}
  })
  add?: Function;

  mounted() {
    this.$watch("value", (value?: Object) => {
      this.searchString = value ? this.stringify && this.stringify(value) : "";
    });

    this.searchString = this.value
      ? this.stringify && this.stringify(this.value)
      : "";
  }

  onBlur() {
    this.resultsHidden = true;
    if (this.value != undefined) {
      this.searchString = this.stringify && this.stringify(this.value);
    } else {
      this.searchString = "";
    }
  }

  onChange() {
    this.resultsHidden = false;
    if (this.fetch) {
      this.fetch(this.searchString, (results: Object[]) => {
        this.results = results;
      });
    }
  }

  onSelect(selected: Object) {
    this.searchString = this.stringify && this.stringify(selected);
    this.resultsHidden = true;
    this.$emit("input", selected);
  }

  onAdd() {
    this.add && this.add(this.searchString);
  }

  get checkExistence(): boolean {
    if (!this.stringify || this.searchString.length == 0) {
      return false;
    }

    const search = this.searchString.trim().toLocaleLowerCase();
    for (let result of this.results) {
      const title = (this.stringify(result) as string)
        .trim()
        .toLocaleLowerCase();

      if (title.localeCompare(search) == 0) {
        return true;
      }
    }

    return false;
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