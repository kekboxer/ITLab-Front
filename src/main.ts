import Vue from "vue";
import axios from "axios";

// VueMoment
import VueMoment from "vue-moment";
import "moment/locale/ru";

// SvgIcon
import * as svgicon from "vue-svgicon";

// VueHammer
import { VueHammer } from "vue2-hammer";

// Bootstrap
import BootstrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

// Notifications
import VueNotifications from "vue-notification"

// Router
import Router, { Route, RawLocation, RouteConfig } from "vue-router";
import { AUTH_LOGOUT } from "@/store/actions/authorization";
import { LAYOUT_PAGES_GET } from "@/store/actions/layout";

import store from "./store";

import App from "./App.vue";

// Initialize axios
axios.defaults.baseURL = "https://labworkback.azurewebsites.net/api/";
axios.defaults.headers.post['Content-Type'] = "application/json";

axios.interceptors.response.use((response) => {
  const body = response.data;
  if (body.statusCode != 1) {
    if (body.statusCode == 12) {
      store.dispatch(AUTH_LOGOUT);
      router.replace({ name: "LoginPage" });
    }
    else {
      throw { error: body }
    }
  }
  return response;
}, (error) => {
  return Promise.reject(error);
});

// Initialize router
const router: Router = new Router({
  mode: "history",
  routes: store.getters[LAYOUT_PAGES_GET]
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.secure !== false)) {
    if (store.getters.isAuthenticated) {
      next();
    } else {
      next({ name: "LoginPage" });
    }
  } else {
    next();
  }
});

// Vue initialization
Vue.use(Router);
Vue.use(VueMoment);
Vue.use(VueHammer);
Vue.use(BootstrapVue);
Vue.use(VueNotifications);
Vue.use(svgicon, { tagName: "svgicon" });

new Vue({
  el: "#app",
  store,
  router,
  template: "<App/>",
  components: { App },
});
