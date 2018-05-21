import Vue from "vue"
import axios from "axios"
import Router, { Route, RawLocation } from "vue-router"

import { routes } from "./PagesInformation"

import "@/views/AuthPage.vue";
import "@/views/EventPage.vue";
import "@/views/EventsPage.vue";
import "@/views/ProjectsPage.vue";
import "@/views/EquipmentPage.vue";
import "@/views/ProfileSettingsPage.vue";
import "@/views/ProcessingAgreementPage.vue"

import store from "@/store"
import { AUTH_LOGOUT } from "@/store/actions/authorization";

Vue.use(Router);

axios.defaults.baseURL = "https://labworkback.azurewebsites.net/api/"
axios.defaults.headers.post['Content-Type'] = "application/json"

const token = localStorage.getItem("user-token")
if (token) { // load token on start
  axios.defaults.headers.common["Authorization"] = token
}

axios.interceptors.response.use((response) => {
  const body = response.data
  if (body.statusCode != 1) {
    store.dispatch(AUTH_LOGOUT)
  }
  return response
}, (err) => {
  return Promise.reject(err)
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
  console.log("auth check", store.getters.isAuthenticated)
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