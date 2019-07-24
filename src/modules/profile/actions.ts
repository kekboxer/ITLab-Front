import { ActionTree } from 'vuex';
import { RootState } from '@/store';
import axios from 'axios';

import {
  getResponseData,
  createResponseCheckHandler,
  createErrorDataHandler
} from '@/stuff';

import {
  IProfileState,
  LoginEvent,
  IRegistrationData,
  IPasswordChangeData,
  IPasswordRestoreData,
  IUserSession,
  PROFILE_FILL,
  PROFILE_CREATE,
  PROFILE_WISH,
  PROFILE_CHANGE_PASSWORD,
  PROFILE_REQUEST_PASSWORD,
  PROFILE_RESTORE_PASSWORD,
  PROFILE_SESSIONS_FETCH,
  PROFILE_SESSIONS_DELETE,
  PROFILE_SET,
  PROFILE_COMMIT,
  IPasswordRequestData,
  PROFILE_ROLES_SET,
  PROFILE_VK_ACCOUNT
} from './types';

import { IUser, UserRoleName } from '@/modules/users';

import { IEventPlace, IEventRole } from '@/modules/events';

export const actions: ActionTree<IProfileState, RootState> = {
  [PROFILE_FILL]: ({ commit }, loginResponse: LoginEvent) => {
    return new Promise((resolve, reject) => {
      commit(PROFILE_SET, loginResponse.userId);
      commit(PROFILE_ROLES_SET, loginResponse.roles);
      resolve();
    });
  },

  [PROFILE_CREATE]: ({ }, registrationData: IRegistrationData) => {
    return new Promise((resolve, reject) => {
      axios
        .post('account', registrationData)
        .then(createResponseCheckHandler(resolve))
        .catch(createErrorDataHandler(PROFILE_CREATE, reject));
    });
  },

  [PROFILE_WISH]: (
    { },
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
        .then(createResponseCheckHandler(resolve))
        .catch(createErrorDataHandler(PROFILE_WISH, reject));
    });
  },

  [PROFILE_COMMIT]: ({ commit }, user: IUser) => {
    return new Promise((resolve, reject) => {
      axios
        .put('account', {
          firstName: user.firstName,
          lastName: user.lastName,
          middleName: user.middleName || '',
          phoneNumber: user.phoneNumber
        })
        .then((response) => getResponseData<IUser>(response))
        .then((user) => {
          commit(PROFILE_SET, user);
          resolve(user);
        })
        .catch(createErrorDataHandler(PROFILE_COMMIT, reject));
    });
  },

  [PROFILE_VK_ACCOUNT]: ({ }, user: IUser) => {
    return new Promise((resolve, reject) => {
      axios
        .get('account/property/vk')
        .then((response) => {
          user.vkData = response.data;
          resolve(user);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  },

  [PROFILE_CHANGE_PASSWORD]: ({ }, data: IPasswordChangeData) => {
    return new Promise((resolve, reject) => {
      axios
        .put('account/password', {
          ...data,
          newPasswordRepeat: undefined
        })
        .then(createResponseCheckHandler(resolve))
        .catch(createErrorDataHandler(PROFILE_CHANGE_PASSWORD, reject));
    });
  },

  [PROFILE_REQUEST_PASSWORD]: ({ }, data: IPasswordRequestData) => {
    return new Promise((resolve, reject) => {
      axios
        .post('account/password/requestreset', data)
        .then(createResponseCheckHandler(resolve))
        .catch(createErrorDataHandler(PROFILE_REQUEST_PASSWORD, reject));
    });
  },

  [PROFILE_RESTORE_PASSWORD]: ({ }, data: IPasswordRestoreData) => {
    return new Promise((resolve, reject) => {
      axios
        .post('account/password/reset', {
          ...data,
          newPasswordRepeat: undefined
        })
        .then(createResponseCheckHandler(resolve))
        .catch(createErrorDataHandler(PROFILE_RESTORE_PASSWORD, reject));
    });
  },

  [PROFILE_SESSIONS_FETCH]: ({ }) => {
    return new Promise((resolve, reject) => {
      axios
        .get('authentication/refresh')
        .then((response) => getResponseData<IUserSession[]>(response))
        .then(resolve)
        .catch(createErrorDataHandler(PROFILE_SESSIONS_FETCH, reject));
    });
  },

  [PROFILE_SESSIONS_DELETE]: ({ }, sessions: string[] | IUserSession[]) => {
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
        .then(createResponseCheckHandler(resolve))
        .catch(createErrorDataHandler(PROFILE_SESSIONS_DELETE, reject));
    });
  }
};
