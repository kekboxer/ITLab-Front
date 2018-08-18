import { ActionTree } from 'vuex';
import { RootState } from '@/store/types';
import axios from 'axios';

import {
  ProfileState,
  AuthorizationData,
  RegistrationData,
  PROFILE_LOGIN,
  PROFILE_LOGOUT,
  PROFILE_CREATE,
  PROFILE_AUTH_TOKEN_SET
} from './types';

interface LoginResponse {
  id: string;
  token: string;
  firstName: string;
  lastName: string;
}

export const actions: ActionTree<ProfileState, RootState> = {
  [PROFILE_LOGIN]: ({ commit }, authorizationData: AuthorizationData) => {
    return new Promise((resolve, reject) => {
      axios
        .post('Authentication/login', authorizationData)
        .then((response) => {
          const body = response && response.data;
          const data: LoginResponse = body && body.data;

          if (body.statusCode === 1 && data.token) {
            localStorage.setItem('user-token', data.token);
            axios.defaults.headers.common.Authorization = `Bearer ${
              data.token
            }`;

            commit(PROFILE_AUTH_TOKEN_SET, data.token);
            resolve(body);
          } else {
            reject({
              err: 'Login failed'
            });
          }
        })
        .catch((err) => {
          localStorage.removeItem('user-token');
          reject(err);
        });
    });
  },

  [PROFILE_LOGOUT]: ({ commit }) => {
    return new Promise((resolve, reject) => {
      localStorage.removeItem('user-token');
      axios.defaults.headers.common.Authorization = undefined;

      commit(PROFILE_AUTH_TOKEN_SET, undefined);
      resolve();
    });
  },

  [PROFILE_CREATE]: ({}, registrationData: RegistrationData) => {
    return new Promise((resolve, reject) => {
      axios
        .post('account', registrationData)
        .then((response) => {
          const body = response && response.data;

          resolve(body);
        })
        .catch((error) => {
          console.log(PROFILE_CREATE, error);
          reject(error);
        });
    });
  }
};
