<!-- TEMPLATE BEGIN -->
<template>
  <div class="sidebar-component" @click="toggleMenu($event)" v-bind:class="{ 'mobile-hidden': isMobileMenuHidden }">
    <img src="static/bars.svg" class="menu-open" @click="isMobileMenuHidden = false">
    <div class="nav-sidebar">
      <div class="inner-scroll">
        <div class="home">
          <div class="text">{{ systemName }}</div>
          <img src="static/bars.svg" class="menu-toggle" @click="isMobileMenuHidden = true">
        </div>

        <div v-for="group in sectionGroups" :key="group.title">
          <hr>
          <div class="group-name">{{group.title}}</div>
          <b-nav vertical>
            <b-nav-item v-for="section in group.sections" :key="section.title" :to="section.page" @click="isMobileMenuHidden = true" exact v-bind:class="{'active': section == $route.meta.baseSection}">
              {{section.title}}
              <!--<b-badge variant="primary" pill v-if="section.title == 'События'" style="margin-right: 0">1</b-badge>-->
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
  background-color: #ffffff;
  box-shadow: inset 2px 0 0 #e5e5e5;
  transform: translate3d(0, 0, 0);
  display: flex;
  flex-direction: column;
  align-items: stretch;
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
  color: #292929;
  font-weight: 600;
}

.sidebar-component .home .text {
  font-size: 1.25rem;
  white-space: nowrap;
  color: #292929;
  font-weight: 600;
  display: inline-block;
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
  color: #535353;
  padding-left: 2rem;
}

.sidebar-component .nav-sidebar .nav-item a:hover {
  background: rgba(0, 0, 0, 0.04);
  color: #2e2e2e;
}

.sidebar-component .nav-sidebar .nav-item.active {
  box-shadow: inset 4px 0 0 #0062cc;
  background: rgba(0, 0, 0, 0.04);
}

.sidebar-component .nav-sidebar .nav-item.active a {
  font-weight: 600;
}

.sidebar-component .exit-button {
  width: 218px;
  transition: width 0.3s;
  position: fixed;
  bottom: 0;
  padding: 16px;
  background-color: #ffffff;
  border: 0;
  border-top: 2px solid #e5e5e5;
  color: #707070;
  display: flex;
  align-items: center;
  line-height: 1;
  font-weight: bold;
  box-shadow: inset 2px 0 0 #e5e5e5;
}

.sidebar-component .exit-button:hover {
  background-color: #e5e5e5;
  color: #2e2e2e;
  cursor: pointer;
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
    box-shadow: inset -2px 0 0 #e5e5e5;
    left: 0;
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