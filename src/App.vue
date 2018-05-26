<!-- TEMPLATE BEGIN -->
<template>
  <div id="app" class="theme-dark">
    <notifications position="top right"></notifications>
    <div class="layout" v-bind:class="{ 'with-sidebar': ($route.meta.hideNavigation !== true) }">
      <template v-if="$route.meta.hideNavigation !== true">
        <sidebar-component></sidebar-component>
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
html, body {
  height: 100%;
  min-height: 100%;
}

#app {
  display: table;
  height: inherit;
  min-height: inherit;
  width: 100%;
  background-color: #f8f9f9;
}

.theme-dark#app {
  background-color: #1e1e1e;
  color: #cccccc;
}

#app .layout {
  display: table-cell;
}

.noselect {
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
  user-select: none;
}

@media (min-width: 992px) {
  .with-sidebar {
    padding-left: 220px;
  }
}

@media (max-width: 991.98px) {
  .page-title {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 100;
    font-size: 20pt;
    height: calc(2rem + 32px);
    line-height: calc(2rem + 32px);
    padding-left: 1rem;
    border-bottom: 2px solid;

    background-color: white;
    border-color: #e5e5e5;
  }

  .theme-dark .page-title {
    background-color: #333333;
    border-color: #252526;
  }

  .page-title .btn {
    position: relative;
    top: -2px;
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
    line-height: 1.5;
    border-radius: 0.2rem;
  }
}

.content-wrapper {
  width: 100%;
  height: 100%;
  padding-top: 50px;
  transition: padding 0.3s;
}

.notifications {
  padding: 10px;
}

.page {
  min-height: 100%;
}
</style>
<!-- STYLE END -->
