import Vue from 'vue';
import Router, { RawLocation } from 'vue-router';
import axios from 'axios';

import store from '@/store';
import userManager from '@/UserManager';

import {
  PROFILE_HAS_ROLE,
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
  routes: store.getters[LAYOUT_PAGES_GET],
  scrollBehavior: () => {
    return { x: 0, y: 0 };
  }
});

// Initialize authorization

const getBaseUrl = () => {
  return '/';
};

axios.interceptors.request.use(
  async (request) => {
    const accessToken = await userManager.accessToken();
    if (accessToken == null) {
      // TODO: exit application (?)
      return Promise.reject();
    }
    request.headers['Authorization'] = `Bearer ${accessToken}`;
    return request;
  }
)

axios.interceptors.response.use(
  (response) => {
    const body = response.data;
    if (Math.floor(response.status / 100) === 2) {
      return response;
    } else {
      throw { error: body };
    }

  },
  (error) => {
    if (!error.response) {
      return;
    }
    if (error.response.status === 401) {
      // TODO: request roles
    } else if (Math.floor(error.response.status / 100) === 5) {
      const originalRequest = error.response.config;
      setTimeout(() => {
        originalRequest.baseURL = '';
        axios(originalRequest);
      }, 4000);
    } else {
      console.log(error);
      throw error;
    }
  }
);

router.beforeEach(async (to, from, next) => {
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

    if (await userManager.signedin()) {
      next();
    }
    else {
      // TODO: exit application (?)
      next("/login");
    }
  } else {
    next();
  }
});

export default router;
