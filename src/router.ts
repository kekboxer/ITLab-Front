import Vue from 'vue';
import Router from 'vue-router';
import axios from 'axios';

import store from '@/store';

import {
  PROFILE_REFRESH_ACCESS,
  PROFILE_AUTHORIZED,
  PROFILE_REFRESH_TOKEN
} from '@/modules/profile';
import { LAYOUT_PAGES_GET } from '@/modules/layout';

Vue.use(Router);

// Initialize axios
axios.defaults.baseURL = process.env.VUE_APP_API_URL;
axios.defaults.headers.post['Content-Type'] = 'application/json';

// Initialize router
const router: Router = new Router({
  mode: 'history',
  routes: store.getters[LAYOUT_PAGES_GET]
});

// Initialize authorization
let refreshingToken: boolean = false;
let subscribers: Array<(success: boolean) => void> = [];

const refreshAccessToken = (callback: (success: boolean) => void) => {
  if (refreshingToken) {
    return;
  }

  refreshingToken = true;
  store
    .dispatch(PROFILE_REFRESH_ACCESS, store.getters[PROFILE_REFRESH_TOKEN])
    .then(() => {
      refreshingToken = false;
      callback(true);
    })
    .catch(() => {
      refreshingToken = false;
      callback(false);
    });
};

axios.interceptors.response.use(
  (response) => {
    const body = response.data;

    if (body.statusCode === 1) {
      return response;
    }

    if (body.statusCode === 12) {
      refreshAccessToken((success) => {
        subscribers = subscribers.filter((cb) => cb(success));
      });

      const originalRequest = response.config;
      return new Promise((resolve, reject) => {
        subscribers.push((success: boolean) => {
          if (success) {
            resolve(axios(originalRequest));
          } else {
            reject({ error: body });
          }
        });
      });
    } else {
      throw { error: body };
    }
  },
  (error) => {
    console.log(error);
    throw error;
  }
);

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.secure !== false)) {
    if (store.getters[PROFILE_AUTHORIZED]) {
      next();
    } else {
      refreshAccessToken((success) => {
        if (success) {
          next();
        } else {
          next({ name: 'LoginPage', params: { to: to.path } });
        }
      });
    }
  } else {
    next();
  }
});

export default router;
