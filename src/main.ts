import Vue from "vue";
import router from "./router";

// Importing VueMoment
import VueMoment from "vue-moment"
import "moment/locale/ru"

// Importing VueSession
import VueSession from "vue-session"

// Importing Bootstrap and its styles
import BootstrapVue from "bootstrap-vue"
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import App from "./App.vue";

Vue.use(VueMoment)
Vue.use(VueSession)
Vue.use(BootstrapVue)

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.secure === true)) {
    if (router.app.$session.exists()) {
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

new Vue({
  el: "#app",
  router,
  template: "<App/>",
  components: { App },
});
