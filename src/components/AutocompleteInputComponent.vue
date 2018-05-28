<!-- TEMPLATE BEGIN -->
<template>
  <div class="autocomplete-input-component" v-bind:class="{ 'hide-results': resultsHidden }">
    <input type="text" v-model="searchString" @input="onChange" @blur="resultsHidden = true" class="form-control">
    <ul class="autocomplete-results" v-show="!resultsHidden && results.length">
      <li v-for="result in results" :key="result.id" class="result-item" @mousedown.prevent="selectResult(result)">
        {{ result.title}} <small>{{ result.description }}</small>
      </li>
    </ul>
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import axios from "axios";

interface EventType {
  id: string;
  title: string;
  description?: string;
}

@Component
export default class AutocompleteInputComponent extends Vue {
  searchString: string = "";
  results: EventType[] = [];
  selected?: EventType;
  resultsHidden: boolean = true;

  onChange() {
    this.resultsHidden = false;
    axios.get("EventType?match=" + this.searchString).then(response => {
      const body = response.data;
      if (body.statusCode == 1) {
        this.results = body.data;
      }
    });
  }

  selectResult(result: EventType) {
    this.resultsHidden = true;
    this.selected = result;
    this.searchString = result.title;
  }
}
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
@import "@/styles/theme.scss";

.autocomplete-input-component {
  position: relative;

  .autocomplete-results {
    position: absolute;
    width: calc(100% - 0.5rem);
    z-index: 1;
    padding: 0;
    margin: 0;
    left: 0.25rem;

    border: 1px solid;

    .result-item {
      list-style: none;
      text-align: left;
      padding: 4px 2px;
      cursor: pointer;
    }

    .result-item:hover {
      background-color: #4aae9b;
      color: white;
    }

    @include theme-specific() {
      background-color: getstyle(form-control-background-color);
    }
  }

  &.hide-results {
    .autocomplete-results {
      display: none;
    }
  }

  &:not(.hide-results) {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
}
</style>
<!-- STYLE END -->
