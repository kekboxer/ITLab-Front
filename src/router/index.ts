import Vue from "vue"
import Router, { Route } from "vue-router"

Vue.use(Router);

import AuthPage, { authPageMeta } from "@/views/AuthPage.vue"
import HomePage, { homePageMeta } from "@/views/HomePage.vue"

function createRoute<T extends Vue>(path: string, name: string, page: T, 
                     props?: boolean | Object | ((route: Route) => Object) | undefined) {
  return {
    path: path,
    name: name,
    component: page,
    props: props,
  }
}

export default new Router({
  base: "app/",
  routes: [
    {
      path: "/login",
      name: "LoginPage",
      component: AuthPage,
      props: {
        authType: "login",
      },
      meta: authPageMeta
    },
    {
      path: "/register",
      name: "RegisterPage",
      component: AuthPage,
      props: {
        authType: "register",
      },
      meta: authPageMeta
    },
    {
      path: "/",
      name: "HomePage",
      component: HomePage,
      meta: homePageMeta
    }
  ]
});

