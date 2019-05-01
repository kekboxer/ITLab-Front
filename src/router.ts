import Vue from 'vue';
import Router, { RawLocation } from 'vue-router';
import axios from 'axios';

import store from '@/store';

import {
  PROFILE_REFRESH_ACCESS,
  PROFILE_AUTHORIZED,
  PROFILE_REFRESH_TOKEN,
  PROFILE_HAS_ROLE,
  PROFILE_ACCESS_TOKEN
} from '@/modules/profile';
import { LAYOUT_PAGES_GET } from '@/modules/layout';
import { createAxiosAuthHeader, AccessToken } from './stuff';

Vue.use(Router);

// Initialize axios
axios.defaults.baseURL =
  localStorage.getItem('api-url') || process.env.VUE_APP_API_URL || '/api/';
axios.defaults.headers.post['Content-Type'] = 'application/json';

// Initialize router
const router: Router = new Router({
  mode: 'history',
  routes: store.getters[LAYOUT_PAGES_GET],
  scrollBehavior: (to, from, savedPosition) => {
    return { x: 0, y: 0 };
  }
});

// Initialize authorization
let refreshingToken: boolean = false;
let subscribers: Array<(accessToken?: AccessToken) => void> = [];

const getBaseUrl = () => {
  return '/';
};

const getRedirectionPage = (originPath?: string) => {
  return {
    name: 'LoginPage',
    params: { to: originPath }
  } as RawLocation;
};

const refreshAccessToken = () => {
  if (refreshingToken) {
    return;
  }

  refreshingToken = true;

  const notifySubscribers = (accessToken?: AccessToken) => {
    subscribers.map((cb) => cb(accessToken));
    subscribers = [];
  };

  store
    .dispatch(PROFILE_REFRESH_ACCESS, store.getters[PROFILE_REFRESH_TOKEN])
    .then(() => {
      notifySubscribers(store.getters[PROFILE_ACCESS_TOKEN]);
      refreshingToken = false;
    })
    .catch(() => {
      notifySubscribers();
      router.push(getRedirectionPage(router.currentRoute.path));
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
      const originalRequest = response.config;
      return new Promise((resolve, reject) => {
        subscribers.push((accessToken?: AccessToken) => {
          if (accessToken) {
            originalRequest.baseURL = ''; // prevent axios from double url concatenation
            originalRequest.headers.Authorization = createAxiosAuthHeader(accessToken.original);
            resolve(axios(originalRequest));
          } else {
            reject({ error: body });
          }
        });

        refreshAccessToken();
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
  const allow: boolean = to.matched.some(
    (record) =>
      record.meta.allow == null ||
      (typeof record.meta.allow === 'string' &&
        store.getters[PROFILE_HAS_ROLE](record.meta.allow)) ||
      (Array.isArray(record.meta.allow) &&
        record.meta.allow.every((role: string) =>
          store.getters[PROFILE_HAS_ROLE](role)
        ))
  );

  if (!allow) {
    next(false);
    return;
  }

  if (development) {
    if (process.env.NODE_ENV === 'development') {
      next();
    } else {
      next(getBaseUrl());
    }
    return;
  }

  if (secure) {
    if (store.getters[PROFILE_AUTHORIZED]) {
      next();
    } else if (store.getters[PROFILE_REFRESH_TOKEN] != null) {
      subscribers.push((accessToken?: AccessToken) => {
        if (accessToken) {
          next();
        } else {
          router.push(getRedirectionPage(to.path));
        }
      });

      refreshAccessToken();
    } else {
      router.push(getRedirectionPage(to.path));
    }
  } else {
    next();
  }
});

export default router;
