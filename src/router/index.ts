import Vue from "vue"
import axios from "axios"
import Router, { Route, RawLocation } from "vue-router"

import { routes } from "./PagesInformation"

import "@/views/AuthPage.vue";

import "@/views/EventsPage.vue";
import "@/views/EquipmentPage.vue";
import "@/views/ProjectsPage.vue";

import "@/views/ProfileSettingsPage.vue";

import store from "@/store"
import { AUTH_LOGOUT } from "@/store/actions/authorization";

Vue.use(Router);

axios.defaults.baseURL = "http://labworkback.azurewebsites.net/api/"
axios.defaults.headers.post['Content-Type'] = "application/x-www-form-urlencoded"
axios.defaults.headers['Access-Control-Allow-Origin'] = "*"
axios.defaults.withCredentials = true

const token = localStorage.getItem("user-token")
if (token) { // load token on start
  axios.defaults.headers.common["Authorization"] = token
}

axios.interceptors.response.use(undefined, function (err) {
  return new Promise(function (resolve, reject) {
    if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
    // if you ever get an unauthorized, logout the user
      store.dispatch(AUTH_LOGOUT)
    // you can also redirect to /login if needed !
    }
    throw err;
  });
});

const router: Router = new Router({
  mode: "history",
  routes: routes.concat([
    {
      path: "*",
      redirect: {
        name: "EventsPage" // TODO: redirect to NotFoundPage
      }
    }
  ])
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.secure === true)) {
    if (store.getters.isAuthenticated) {
      next()
    } else {
      next({
        name: 'LoginPage'
      })
    }
  } else {
    next()
  }
})

export default router