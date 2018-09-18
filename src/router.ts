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

axios.defaults.baseURL =
  localStorage.getItem('api-url') || process.env.VUE_APP_API_URL || '/api/';
axios.defaults.headers.post['Content-Type'] = 'application/json';

// Initialize router
const router: Router = new Router({
  mode: 'history',
  routes: store.getters[LAYOUT_PAGES_GET]
});

// Initialize authorization
let refreshingToken: boolean = false;
let subscribers: Array<(accessToken?: string) => void> = [];

const refreshAccessToken = () => {
  if (refreshingToken) {
    return;
  }

  const notifySubscribers = (accessToken?: string) => {
    subscribers = subscribers.filter((cb) => cb(accessToken));
  };

  refreshingToken = true;

  store
    .dispatch(PROFILE_REFRESH_ACCESS, store.getters[PROFILE_REFRESH_TOKEN])
    .then((response) => {
      notifySubscribers(response.accessToken);
      refreshingToken = false;
    })
    .catch(() => {
      notifySubscribers();
      router.push({ name: 'LoginPage', params: { to: router.currentRoute.path } });
      refreshingToken = false;
    });
};

axios.interceptors.response.use(
  (response) => {
    const body = response.data;

    if (body.statusCode === 1) {
      return response;
    }

    if (body.statusCode === 12) {
      refreshAccessToken();

      const originalRequest = response.config;
      return new Promise((resolve, reject) => {
        subscribers.push((accessToken?: string) => {
          if (accessToken) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
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
  const secure: boolean = to.matched.some(
    (record) => record.meta.secure !== false
  );
  const development: boolean = to.matched.some(
    (record) => record.meta.development === true
  );

  if (development) {
    if (process.env.NODE_ENV === 'development') {
      next();
    } else {
      next({ name: 'EventsPage' });
    }
    return;
  }

  if (secure) {
    if (store.getters[PROFILE_AUTHORIZED]) {
      next();
    } else if (store.getters[PROFILE_REFRESH_TOKEN] != null) {
      refreshAccessToken();

      subscribers.push((accessToken?: string) => {
        if (accessToken) {
          next();
        } else {
          next({ name: 'LoginPage', params: { to: to.path } });
        }
      });
    } else {
      next({ name: 'LoginPage', params: { to: to.path } });
    }
  } else {
    next();
  }
});

export default router;
