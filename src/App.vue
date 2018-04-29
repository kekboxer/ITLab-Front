<!-- TEMPLATE BEGIN -->
<template>
  <div id="app">
    <navbar-component v-if="$route.meta.hideNavbar !== true"></navbar-component>
    <router-view/>
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import NavbarComponent from "@/components/NavbarComponent.vue";

@Component({
  components: {
    "navbar-component": NavbarComponent
  }
})
export default class App extends Vue {}
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style>
html,
body,
#app {
  height: 100%;
}

.noselect {
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
  user-select: none;
}

.content {
  margin-top: 56px;
}
</style>
<!-- STYLE END -->
