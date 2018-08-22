import { ActionTree } from 'vuex';
import { RootState } from '@/store';
import axios from 'axios';

import { getResponseData } from '@/stuff';

import {
  ProfileState,
  AuthorizationData,
  RegistrationData,
  PROFILE_LOGIN,
  PROFILE_LOGOUT,
  PROFILE_CREATE,
  PROFILE_AUTH_TOKEN_SET,
  PROFILE_WISH
} from './types';

import { EventPlace, EventUserRole } from '@/modules/events';

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
        .then((response) => getResponseData<LoginResponse>(response))
        .then((loginResponse) => {
          localStorage.setItem('user-token', loginResponse.token);
          axios.defaults.headers.common.Authorization = `Bearer ${
            loginResponse.token
          }`;

          commit(PROFILE_AUTH_TOKEN_SET, loginResponse.token);
          resolve(loginResponse);
        })
        .catch((error) => {
          localStorage.removeItem('user-token');
          reject(error);
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
          // TODO: get some profile information from response
          resolve();
        })
        .catch((error) => {
          console.log(PROFILE_CREATE, error);
          reject(error);
        });
    });
  },

  [PROFILE_WISH]: (
    {},
    {
      place,
      role
    }: { place: EventPlace | string; role: EventUserRole | string }
  ) => {
    return new Promise((resolve, reject) => {
      const placeId = typeof place === 'string' ? place : place.id;
      const roleId = typeof role === 'string' ? role : role.id;

      axios
        .post(`event/wish/${placeId}/${roleId}`)
        .then((response) => {
          const body = response.data;

          if (body.statusCode && body.statusCode === 1) {
            resolve();
          } else {
            reject();
          }
        })
        .catch((error) => {
          console.log(PROFILE_WISH, error);
          reject(error);
        });
    });
  }
};
