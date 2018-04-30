import Vue from "vue"
import Router, { Route, RawLocation } from "vue-router"

Vue.use(Router);

import { routes } from "./PagesInformation"

import "@/views/AuthPage.vue";

import "@/views/EventsPage.vue";
import "@/views/EquipmentPage.vue";
import "@/views/ProjectsPage.vue";

import "@/views/ProfileSettingsPage.vue";

export default new Router({
  mode: "history",
  routes: routes.concat([
    {
      path: "*",
      redirect: {
        name: "EventsPage" // TODO: redirect to NotFoundPage
      }
    }
  ])
  /*
  [
    {
      path: "/login",
      name: "LoginPage",
      component: AuthPage,
      props: {
        authType: "login",
      },
      meta: AuthPage.getPageMeta()
    },
    {
      path: "/register",
      name: "RegisterPage",
      component: AuthPage,
      props: {
        authType: "register",
      },
      meta: AuthPage.getPageMeta()
    },
    {
      path: "/events",
      name: "EventsPage",
      component: EventsPage,
      meta: mainPagesMeta
    },
    {
      path: "*",
      redirect: defaultPath
    }
  ]
  */
});

