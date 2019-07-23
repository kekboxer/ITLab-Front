import Vue from 'vue';

// Plugins initialization //
///////////////////////////

// VueMoment
import VueMoment from 'vue-moment';
import 'moment/locale/ru';
import moment from 'moment-timezone';

moment.tz.setDefault('Europe/Moscow');
Vue.use(VueMoment, { moment });

// SvgIcon
import * as svgicon from 'vue-svgicon';

Vue.use(svgicon, { tagName: 'svgicon' });

// VueHammer
import { VueHammer } from 'vue2-hammer';

Vue.use(VueHammer);

// Autosize
import VueAutosize from 'vue-autosize';

Vue.use(VueAutosize);

// Bootstrap
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.use(BootstrapVue);

// Notifications
import VueNotifications from 'vue-notification';

Vue.use(VueNotifications);

// VueMarkdown //
////////////////

import VueMarkdown from 'vue-markdown';

VueMarkdown.props.html.default = false;
VueMarkdown.props.anchorAttributes.default = () => ({ target: '_blank' });
Vue.component('vue-markdown', VueMarkdown);

// Initialize Vue //
///////////////////

import globals from '@/globals';
import store from '@/store';
import router from '@/router';
import oidcManager from '@/UserManager';
import App from './App.vue';

Vue.prototype.$g = globals;
  
 new Vue({
    store,
    router,
    render: (h) => h(App)
  }).$mount('#app');