<!-- TEMPLATE BEGIN -->
<template>
  <div class="sidebar-component" @click="toggleMenu($event)" v-bind:class="{ 'mobile-hidden': isMobileMenuHidden }">
    <img src="/static/bars.svg" class="menu-open bars" @click="isMobileMenuHidden = false">
    <div class="nav-sidebar noselect">
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
      </div>

      <div class="exit-button" @click="logout()">Выход</div>
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
<style lang="scss">
@import "@/styles/general.scss";

.sidebar-component {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 200;
  background-color: #29292949;

  .home {
    width: 100%;
    display: inline-flex;
    padding: 1rem 1rem 0 1rem;

    .text {
      font-size: 1.25rem;
      white-space: nowrap;
      font-weight: 600;
      display: inline-block;
    }

    .menu-toggle {
      margin-left: auto;

      @include media-breakpoint-up(lg) {
        display: none;
      }
    }
  }

  .nav-sidebar {
    z-index: 1;
    position: fixed;
    width: $sidebar-width;
    top: 0;
    bottom: 0;
    right: 0;
    margin: 0;
    transform: translate3d(0, 0, 0);
    display: flex;
    flex-direction: column;
    align-items: stretch;

    .inner-scroll {
      width: 100%;
      height: calc(100% - 50px + 1rem);
      overflow-y: auto;

      .group-name {
        padding: 5px;
        padding-left: 1rem;
        font-weight: bold;

        @include theme-specific() {
          color: getstyle(sidebar-group-font-color);
        }
      }

      .nav-item {
        a {
          padding-left: 2rem;

          @include theme-specific() {
            color: getstyle(sidebar-section-font-color);
          }

          &:hover {
            @include theme-specific() {
              background: getstyle(sidebar-section-background-color);
            }
          }
        }

        &.active {
          @include theme-specific() {
            box-shadow: inset 4px 0 0
              getstyle(sidebar-active-section-highlight-color);
            background: getstyle(sidebar-section-background-color);
          }
        }

        &.active a {
          font-weight: 600;
        }
      }
    }

    .exit-button {
      width: 100%;
      position: fixed;
      bottom: 0;
      padding: 16px;
      border: none;
      line-height: 1;
      font-weight: bold;
      margin-top: auto;
      border-top: 2px solid;
      border-right: 2px solid;
      cursor: pointer;

      @include media-breakpoint-down(md) {
        border-left: 2px solid;
        border-right: 0px;
      }

      @include theme-specific {
        color: getstyle(sidebar-section-font-color);
        border-color: getstyle(sidebar-shadow-color);
        background-color: getstyle(sidebar-background-color);

        &:hover {
          background: getstyle(sidebar-shadow-color);
        }
      }
    }

    @include theme-specific() {
      background-color: getstyle(sidebar-background-color);
      box-shadow: inset 2px 0 0 getstyle(sidebar-shadow-color);
    }
  }

  .menu-open {
    position: fixed;
    right: 1rem;
    top: 1rem;
  }

  &:not(.mobile-hidden) {
    .menu-open {
      display: none;
    }
  }

  &.mobile-hidden {
    width: 0px;

    .nav-sidebar {
      display: none;
    }
  }

  @include media-breakpoint-up(lg) {
    width: 0;

    .menu-open {
      display: none;
    }

    .nav-sidebar {
      left: 0;

      @include theme-specific() {
        box-shadow: inset -2px 0 0 getstyle(sidebar-shadow-color);
      }
    }

    &.mobile-hidden .nav-sidebar {
      display: block;
    }
  }
}
</style>
<!-- STYLE END -->