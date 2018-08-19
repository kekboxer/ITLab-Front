import Vue from 'vue';
import Router from 'vue-router';
import axios from 'axios';

import store from '@/store';

import { PROFILE_LOGOUT, PROFILE_AUTHORIZED } from '@/modules/profile';
import { LAYOUT_PAGES_GET } from '@/modules/layout';

Vue.use(Router);

// Initialize axios
axios.defaults.baseURL = process.env.VUE_APP_API_URL;
axios.defaults.headers.post['Content-Type'] = 'application/json';

axios.interceptors.response.use(
  (response) => {
    const body = response.data;
    if (body.statusCode !== 1) {
      if (body.statusCode === 12) {
        store.dispatch(PROFILE_LOGOUT);
      } else {
        throw { error: body };
      }
    }
    return response;
  },
  (error) => {
    return new Promise((resolve, reject) => {
      if (
        error.status === 401 &&
        error.config &&
        !error.config.__isRetryRequest
      ) {
        store.dispatch(PROFILE_LOGOUT);
      }
      throw error;
    });
  }
);

// Initialize router
const router: Router = new Router({
  mode: 'history',
  routes: store.getters[LAYOUT_PAGES_GET]
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.secure !== false)) {
    if (store.getters[PROFILE_AUTHORIZED]) {
      next();
    } else {
      next({ name: 'LoginPage', params: { to: to.path } });
    }
  } else {
    next();
  }
});

export default router;
