<!-- TEMPLATE BEGIN -->
<template>
  <div id="app">
    <div class="h-100" v-bind:class="{ 'layout-with-sidebar': ($route.meta.hideNavigation !== true) }">
      <template v-if="$route.meta.hideNavigation !== true">
        <sidebar-component></sidebar-component>
        <div class="content-spacer"></div>
      </template>

      <div class="content-wrapper">
        <router-view/>
      </div>
    </div>
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import SidebarComponent from "@/components/SidebarComponent.vue";

@Component({
  components: {
    "sidebar-component": SidebarComponent
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

@media (min-width: 992px) {
  .layout-with-sidebar {
    padding-left: 220px;
  }
}

.content-wrapper {
  width: 100%;
  height: 100%;
  transition: padding 0.3s;
}

.content-spacer {
  height: 50px;
}
</style>
<!-- STYLE END -->
