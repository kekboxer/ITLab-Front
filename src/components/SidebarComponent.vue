<!-- TEMPLATE BEGIN -->
<template>
  <div class="sidebar-component" @click="toggleMenu($event)" v-bind:class="{ 'mobile-hidden': isMobileMenuHidden }">
    <img src="/static/bars.svg" class="menu-open bars" @click="isMobileMenuHidden = false">
    <div class="nav-sidebar">
      <div class="inner-scroll">
        <div class="home">
          <div class="text">{{ systemName }}</div>
          <img src="/static/bars.svg" class="menu-toggle" @click="isMobileMenuHidden = true">
        </div>

        <div v-for="group in sectionGroups" :key="group.title">
          <hr>
          <div class="group-name">{{group.title}}</div>
          <b-nav vertical>
            <b-nav-item v-for="section in group.sections" :key="section.title" :to="section.page" @click="isMobileMenuHidden = true" exact v-bind:class="{'active': section == $route.meta.baseSection}">
              {{section.title}}
            </b-nav-item>
          </b-nav>
        </div>
        <hr>

        <div class="exit-button" @click="logout()" style="margin-top: auto">Выход</div>
      </div>
    </div>
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import {
  sectionGroups,
  Section,
  SectionGroup,
  Group
} from "@/general/SectionLayout";
import { AUTH_LOGOUT } from "@/store/actions/authorization";
import { SYSTEM_NAME } from "@/store/actions/global";

@Component
export default class SidebarComponent extends Vue {
  sectionGroups: SectionGroup[] = Array.from(sectionGroups).map(
    value => value[1]
  );
  isMobileMenuHidden: boolean = true;

  toggleMenu(event: any) {
    if (event.target.className !== "sidebar-component") {
      return;
    }
    
    this.isMobileMenuHidden = !this.isMobileMenuHidden;
  }

  logout() {
    this.$store.dispatch(AUTH_LOGOUT).then(result => {
      this.$router.push({ name: "LoginPage" });
    });
  }

  get systemName(): string {
    return this.$store.getters[SYSTEM_NAME];
  }
}
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style>
.sidebar-component {
  z-index: 5000;
  position: fixed;
  width: 100%;
  top: 0;
  bottom: 0;
  left: 0;

  background-color: #29292949;
}

.sidebar-component .bars {
  fill: #000000;
}

.theme-dark .sidebar-component .bars {
  fill: #adadad;
}

.sidebar-component.mobile-hidden {
  width: 0px;
}

.sidebar-component.mobile-hidden .nav-sidebar {
  display: none;
}

.sidebar-component .menu-open {
  position: fixed;
  right: 1rem;
  top: 1rem;
}

.sidebar-component:not(.mobile-hidden) .menu-open {
  display: none;
}

.sidebar-component .nav-sidebar {
  z-index: 1;
  position: fixed;
  width: 220px;
  top: 0;
  bottom: 0;
  right: 0;
  margin: 0;
  transform: translate3d(0, 0, 0);
  display: flex;
  flex-direction: column;
  align-items: stretch;

  background-color: #ffffff;
  box-shadow: inset 2px 0 0 #e5e5e5;
}

.theme-dark .sidebar-component .nav-sidebar {
  background-color: #333333;
  box-shadow: inset 2px 0 0 #252526;
}

.sidebar-component .nav-sidebar .inner-scroll {
  height: 100%;
  width: 100%;
  overflow-y: auto;
  margin-bottom: calc(49px - 1rem);
}

.sidebar-component .home {
  width: 100%;
  display: inline-flex;
  padding: 1rem 1rem 0 1rem;
  font-size: 1.25rem;
  white-space: nowrap;
  font-weight: 600;

  color: #292929;
}

.theme-dark .sidebar-component .home {
  color: #cccccc;
}

.sidebar-component .home .text {
  font-size: 1.25rem;
  white-space: nowrap;
  font-weight: 600;
  display: inline-block;

  color: #292929;
}

.theme-dark .sidebar-component .home .text {
  color: #cccccc;
}

.sidebar-component .home .menu-toggle {
  margin-left: auto;
}

.sidebar-component .nav-sidebar .group-name {
  padding: 5px;
  padding-left: 1rem;
  font-weight: bold;
}

.sidebar-component .nav-sidebar .nav-item a {
  padding-left: 2rem;

  color: #535353;
}

.theme-dark .sidebar-component .nav-sidebar .nav-item a {
  color: #adadad;
}

.sidebar-component .nav-sidebar .nav-item a:hover {
  background: rgba(0, 0, 0, 0.04);
  color: #2e2e2e;
}

.theme-dark .sidebar-component .nav-sidebar .nav-item a:hover {
  color: #999999;
}

.sidebar-component .nav-sidebar .nav-item.active {
  box-shadow: inset 4px 0 0 #0062cc;
  background: rgba(0, 0, 0, 0.04);
}

.sidebar-component .nav-sidebar .nav-item.active a {
  font-weight: 600;
}

.sidebar-component .exit-button {
  width: 100%;
  position: fixed;
  bottom: 0;
  padding: 16px;
  border: 0;
  border-top: 2px solid;
  display: flex;
  align-items: center;
  line-height: 1;
  font-weight: bold;
  
  color: #707070;
  background-color: #ffffff;
  border-color: #e5e5e5;
  box-shadow: inset 2px 0 0 #e5e5e5;
}

.theme-dark .sidebar-component .exit-button {
  color: #adadad;
  background-color: #333333;
  border-color: #252526;
  box-shadow: inset 2px 0 0 #252526;
}

.sidebar-component .exit-button:hover {
  cursor: pointer;

  color: #2e2e2e;
  background-color: #e5e5e5;
}

.theme-dark .sidebar-component .exit-button:hover {
  color: #999999;
  background-color: #292929;
}

@media (min-width: 992px) {
  .sidebar-component {
    width: 0px;
  }

  .sidebar-component.mobile-hidden {
    width: 0px;
  }

  .sidebar-component.mobile-hidden .nav-sidebar {
    display: block;
  }

  .sidebar-component .nav-sidebar {
    left: 0;

    box-shadow: inset 2px 0 0 #e5e5e5;
  }

  .theme-dark .sidebar-component .nav-sidebar {
    box-shadow: inset 2px 0 0 #252526;
  }

  .sidebar-component .menu-open {
    display: none;
  }

  .sidebar-component .exit-button {
    box-shadow: none;
  }

  .sidebar-component .home .menu-toggle {
    display: none;
  }
}
</style>
<!-- STYLE END -->