import Vue from "vue"
import axios from "axios"
import Router, { Route, RawLocation, RouteConfig } from "vue-router"

import store from "@/store"
import { AUTH_LOGOUT } from "@/store/actions/authorization";

Vue.use(Router);

axios.defaults.baseURL = "https://labworkback.azurewebsites.net/api/"
axios.defaults.headers.post['Content-Type'] = "application/json"

const token = localStorage.getItem("user-token")
if (token) { // load token on start
  axios.defaults.headers.common["Authorization"] = "Bearer " + token
}


const generateRoutes = (): RouteConfig[] => {
  let result = store.state.layout.stuff.concat()
  store.state.layout.groups.forEach((group, i, arr) => {
    group.sections.forEach((section, j, arr) => {
      result = result.concat(section.pages);
    })
  })

  return result
}


const router: Router = new Router({
  mode: "history",
  routes: generateRoutes().concat([
    {
      path: "*",
      redirect: {
        name: "EventsPage" // TODO: redirect to NotFoundPage
      }
    }
  ])
});

axios.interceptors.response.use((response) => {
  const body = response.data
  if (body.statusCode != 1) {
    if (body.statusCode == 12) {
      store.dispatch(AUTH_LOGOUT)
      router.replace({ name: "LoginPage" })
    }
    else {
      throw { err: { statusCode: body.statusCode } }
    }
  }
  return response
}, (err) => {
  return Promise.reject(err)
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