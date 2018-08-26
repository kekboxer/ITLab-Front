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
  PROFILE_REFRESH_ACCESS,
  PROFILE_ACCESS_TOKEN_SET,
  PROFILE_REFRESH_TOKEN_SET,
  PROFILE_WISH
} from './types';

import { EventPlace, EventUserRole } from '@/modules/events';

export const setAxiosAuthHeader = (token?: string) => {
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    axios.defaults.headers.common.Authorization = undefined;
  }
};

interface LoginResponse {
  id: string;
  accessToken: string;
  refreshToken: string;
  firstName: string;
  lastName: string;
}

export const actions: ActionTree<ProfileState, RootState> = {
  [PROFILE_LOGIN]: ({ commit }, authorizationData: AuthorizationData) => {
    return new Promise((resolve, reject) => {
      axios
        .post('authentication/login', authorizationData)
        .then((response) => getResponseData<LoginResponse>(response))
        .then((loginResponse) => {
          setAxiosAuthHeader(loginResponse.accessToken);

          commit(PROFILE_ACCESS_TOKEN_SET, loginResponse.accessToken);
          commit(PROFILE_REFRESH_TOKEN_SET, loginResponse.refreshToken);
          resolve(loginResponse);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  [PROFILE_LOGOUT]: ({ commit }) => {
    return new Promise((resolve, reject) => {
      setAxiosAuthHeader(undefined);

      commit(PROFILE_ACCESS_TOKEN_SET, undefined);
      commit(PROFILE_REFRESH_TOKEN_SET, undefined);
      resolve();
    });
  },

  [PROFILE_REFRESH_ACCESS]: ({ commit }, token: string) => {
    return new Promise((resolve, reject) => {
      const data: string = `"${token}"`;

      axios
        .post('authentication/refresh', data)
        .then((response) => getResponseData<LoginResponse>(response))
        .then((loginResponse) => {
          setAxiosAuthHeader(loginResponse.accessToken);

          commit(PROFILE_ACCESS_TOKEN_SET, loginResponse.accessToken);
          commit(PROFILE_REFRESH_TOKEN_SET, loginResponse.refreshToken);
          resolve(loginResponse);
        })
        .catch((error) => {
          console.log(PROFILE_REFRESH_ACCESS, error);
          reject(error);
        });
    });
  },

  [PROFILE_CREATE]: ({}, registrationData: RegistrationData) => {
    return new Promise((resolve, reject) => {
      axios
        .post('account', registrationData)
        .then((response) => resolve())
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
