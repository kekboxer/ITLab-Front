<!-- TEMPLATE BEGIN -->
<template>
  <div class="sidebar-component">
    <div class="nav-sidebar">
      <div class="inner-scroll">
        <b-navbar-brand href="/">
          <b-row>
            <b-col align="center"><img class="rounded-circle" :src="require('@/assets/logo_dog.png')" :center="true" height="40" /> {{ systemName }}</b-col>
          </b-row>
        </b-navbar-brand>

        <div v-for="group in sectionGroups" :key="group.title">
          <hr>
          <div class="group-name">{{group.title}}</div>
          <b-nav vertical>
            <b-nav-item v-for="section in group.sections" :key="section.title" :to="section.page" exact v-bind:class="{'active': section == $route.meta.baseSection}">
              {{section.title}}
              <!--<b-badge variant="primary" pill v-if="section.title == 'События'" style="margin-right: 0">1</b-badge>-->
            </b-nav-item>
          </b-nav>
        </div>
        <hr>

        <div class="exit-button" @click="logout()" style="margin-top: auto">Выход</div>

        <div class="with-love text-muted" v-if="Math.random() < 0.001">
          <small>From Ivan with</small>
          <icon name="heart" style="color: rgba(255, 0, 0, 0.6)" scale="0.6"></icon>
        </div>
      </div>
    </div>
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Icon from "vue-awesome/components/Icon";

import "vue-awesome/icons/heart";

import {
  sectionGroups,
  Section,
  SectionGroup,
  Group
} from "@/general/SectionLayout";
import { AUTH_LOGOUT } from "@/store/actions/authorization";
import { SYSTEM_NAME } from "@/store/actions/global";

@Component({
  components: {
    icon: Icon
  }
})
export default class SidebarComponent extends Vue {
  sectionGroups: SectionGroup[] = Array.from(sectionGroups).map(
    value => value[1]
  );

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
.sidebar-component .nav-sidebar {
  transition: width 0.3s, left 0.3s;
  position: fixed;
  z-index: 400;
  width: 220px;
  top: 0;
  bottom: 0;
  left: 0;
  margin: 0;
  background-color: #ffffff;
  box-shadow: inset -2px 0 0 #e5e5e5;
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

.sidebar-component .navbar-brand {
  height: 40px;
  line-height: 40px;
  display: inline-block;
  margin-left: 1rem;
  font-size: 1.25rem;
  white-space: nowrap;
  color: #292929;
  font-weight: 600;
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

.sidebar-component .with-love {
  width: 100%;
  bottom: 0;
  left: 0;
  padding: 2px 0px 2px 10px;
  background-color: #333;
  box-shadow: inset 0 2px 0 #222;
}

.sidebar-component .with-love small {
  color: #aaa;
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
}

.sidebar-component .exit-button:hover {
  background-color: #e5e5e5;
  color: #2e2e2e;
  cursor: pointer;
}
</style>
<!-- STYLE END -->