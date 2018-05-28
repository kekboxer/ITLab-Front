import Vue from "vue"

// VueMoment
import VueMoment from "vue-moment"
import "moment/locale/ru"

// SvgIcon
import * as svgicon from "vue-svgicon"

// Bootstrap
import BootstrapVue from "bootstrap-vue"
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Touch
import Vue2TouchEvents from "vue2-touch-events"

// Notifications
import VueNotifications from "vue-notification"

import store from "./store"
import router from "./router"

import App from "./App.vue";

// Vue initialization
Vue.use(VueMoment)
Vue.use(BootstrapVue)
Vue.use(Vue2TouchEvents)
Vue.use(VueNotifications)

Vue.use(svgicon, {
    tagName: 'svgicon'
})

new Vue({
  el: "#app",
  store,
  router,
  template: "<App/>",
  components: { App },
});
