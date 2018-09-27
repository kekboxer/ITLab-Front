import { ActionTree } from 'vuex';
import { RootState } from '@/store';
import axios from 'axios';

import { getResponseData } from '@/stuff';

import {
  IProfileState,
  IAuthorizationData,
  IRegistrationData,
  IPasswordChangeData,
  IUserSession,
  PROFILE_LOGIN,
  PROFILE_LOGOUT,
  PROFILE_REFRESH_ACCESS,
  PROFILE_CREATE,
  PROFILE_WISH,
  PROFILE_CHANGE_PASSWORD,
  PROFILE_SESSIONS_FETCH,
  PROFILE_SESSIONS_DELETE,
  PROFILE_SET,
  PROFILE_ACCESS_TOKEN_SET,
  PROFILE_REFRESH_TOKEN_SET,
  PROFILE_COMMIT
} from './types';

import { IUser } from '@/modules/users';

import { IEventPlace, IEventRole } from '@/modules/events';

export const setAxiosAuthHeader = (token?: string) => {
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    axios.defaults.headers.common.Authorization = undefined;
  }
};

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: IUser;
}

const handleLogin = (
  response: LoginResponse,
  commit: any,
  resolve: (value?: {} | PromiseLike<{}>) => void
) => {
  setAxiosAuthHeader(response.accessToken);

  commit(PROFILE_SET, response.user.id);
  commit(PROFILE_ACCESS_TOKEN_SET, response.accessToken);
  commit(PROFILE_REFRESH_TOKEN_SET, response.refreshToken);
  resolve(response);
};

export const actions: ActionTree<IProfileState, RootState> = {
  [PROFILE_LOGIN]: ({ commit }, authorizationData: IAuthorizationData) => {
    return new Promise((resolve, reject) => {
      axios
        .post('authentication/login', authorizationData)
        .then((response) => getResponseData<LoginResponse>(response))
        .then((loginResponse) => handleLogin(loginResponse, commit, resolve))
        .catch((error) => {
          reject(error);
        });
    });
  },

  [PROFILE_LOGOUT]: ({ commit }) => {
    return new Promise((resolve) => {
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
        .then((loginResponse) => handleLogin(loginResponse, commit, resolve))
        .catch((error) => {
          console.log(PROFILE_REFRESH_ACCESS, error);
          reject(error);
        });
    });
  },

  [PROFILE_CREATE]: ({}, registrationData: IRegistrationData) => {
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
      eventRole
    }: { place: IEventPlace | string; eventRole: IEventRole | string }
  ) => {
    return new Promise((resolve, reject) => {
      const placeId = typeof place === 'string' ? place : place.id;
      const eventRoleId =
        typeof eventRole === 'string' ? eventRole : eventRole.id;

      axios
        .post(`event/wish/${placeId}/${eventRoleId}`)
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
  },

  [PROFILE_COMMIT]: ({ commit }, user: IUser) => {
    return new Promise((resolve, reject) => {
      axios
        .put('account', {
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber
        })
        .then((response) => getResponseData<IUser>(response))
        .then((user) => {
          commit(PROFILE_SET, user);
          resolve(user);
        })
        .catch((error) => {
          console.log(PROFILE_COMMIT, error);
          reject(error);
        });
    });
  },

  [PROFILE_CHANGE_PASSWORD]: ({ commit }, data: IPasswordChangeData) => {
    return new Promise((resolve, reject) => {
      axios
        .put('account/password', {
          currentPassword: data.currentPassword,
          newPassword: data.currentPassword
        })
        .then((response) => {
          const body = response.data;

          if (body.statusCode && body.statusCode === 1) {
            resolve();
          } else {
            reject();
          }
        })
        .catch((error) => {
          console.log(PROFILE_CHANGE_PASSWORD, error);
          reject(error);
        });
    });
  },

  [PROFILE_SESSIONS_FETCH]: ({}) => {
    return new Promise((resolve, reject) => {
      axios
        .get('authentication/refresh')
        .then((response) => getResponseData<IUserSession>(response))
        .then((sessions) => resolve(sessions))
        .catch((error) => {
          console.log(PROFILE_SESSIONS_FETCH, error);
          reject(error);
        });
    });
  },

  [PROFILE_SESSIONS_DELETE]: ({}, sessions: string[] | IUserSession[]) => {
    if (sessions.length === 0) {
      return;
    }

    const sessionIds =
      typeof sessions[0] === 'string'
        ? sessions
        : (sessions as IUserSession[]).map((session) => session.id);

    return new Promise((resolve, reject) => {
      axios
        .delete('authentication/refresh', {
          data: sessionIds
        })
        .then((response) => {
          const body = response.data;

          if (body.statusCode && body.statusCode === 1) {
            resolve();
          } else {
            reject();
          }
        })
        .catch((error) => {
          console.log(PROFILE_SESSIONS_DELETE, error);
          reject(error);
        });
    });
  }
};
