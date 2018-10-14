import { ActionTree } from 'vuex';
import { RootState } from '@/store';
import axios from 'axios';

import { getResponseData, UserRole } from '@/stuff';

import {
  IUsersState,
  IUser,
  USER_INVITE,
  USER_SEARCH,
  USERS_FETCH_ALL,
  USERS_FETCH_ONE,
  USER_ASSIGN_EQUIPMENT,
  USER_REMOVE_EQUIPMENT,
  USER_ROLES_FETCH,
  USERS_SET_ALL,
  USERS_SET_ONE
} from './types';

import { IEquipment } from '@/modules/equipment';

export const actions: ActionTree<IUsersState, RootState> = {
  [USER_INVITE]: ({}, { email }: { email: string }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('user', {
          email,
          redirectUrl: window.location.origin
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
          console.log(USER_INVITE, error);
          reject(error);
        });
    });
  },

  [USER_SEARCH]: (
    {},
    { match = '', all = false }: { match?: string; all?: boolean }
  ) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`user?match=${encodeURIComponent(match)}&count=${all ? -1 : 5}`)
        .then((response) => getResponseData<IUser[]>(response))
        .then((users) => resolve(users))
        .catch((error) => {
          console.log(USER_SEARCH, error);
          reject(error);
        });
    });
  },

  [USERS_FETCH_ALL]: ({ commit }) => {
    return new Promise((resolve, reject) => {
      axios
        .get('user?count=-1')
        .then((response) => getResponseData<IUser[]>(response))
        .then((users) => {
          commit(USERS_SET_ALL, users);
          resolve(users);
        })
        .catch((error) => {
          console.log(USERS_FETCH_ALL, error);
          reject(error);
        });
    });
  },

  [USERS_FETCH_ONE]: ({ commit }, id: string) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`user/${id}`)
        .then((response) => getResponseData<IUser>(response))
        .then((user) => {
          commit(USERS_SET_ONE, user);
          resolve(user);
        })
        .catch((error) => {
          console.log(USERS_FETCH_ONE, error);
          reject(error);
        });
    });
  },

  [USER_ASSIGN_EQUIPMENT]: (
    {},
    { equipment, user }: { equipment: IEquipment; user: IUser | string | null }
  ) => {
    return new Promise((resolve, reject) => {
      let url: string = 'equipment/user';
      if (user) {
        if (typeof user === 'string') {
          url += `/${user as string}`;
        } else if ('id' in (user as any)) {
          url += `/${(user as any).id}`;
        }
      }

      axios
        .post(url, { id: equipment.id })
        .then((response) => getResponseData<IEquipment>(response))
        .then((equipment) => resolve(equipment))
        .catch((error) => {
          console.log(USER_ASSIGN_EQUIPMENT, error);
          reject(error);
        });
    });
  },

  [USER_REMOVE_EQUIPMENT]: (
    {},
    {
      equipment,
      owner
    }: { equipment: IEquipment; owner: IUser | string | null }
  ) => {
    return new Promise((resolve, reject) => {
      let url: string = 'equipment/user';
      if (owner) {
        if (typeof owner === 'string') {
          url += `/${owner as string}`;
        } else if ('id' in (owner as any)) {
          url += `/${(owner as any).id}`;
        }
      }

      axios
        .delete(url, { data: { id: equipment.id } })
        .then((response) => getResponseData<IEquipment>(response))
        .then((equipment) => resolve(equipment))
        .catch((error) => {
          console.log(USER_REMOVE_EQUIPMENT, error);
          reject(error);
        });
    });
  },

  [USER_ROLES_FETCH]: ({}, user: IUser | string) => {
    return new Promise((resolve, reject) => {
      const userId = typeof user === 'string' ? user : user.id;

      axios
        .get(`roles/${userId}`)
        .then((response) =>
          getResponseData<Array<{ id: string; name: UserRole }>>(response)
        )
        .then((userRoles) => resolve(userRoles))
        .catch((error) => {
          console.log(USER_ROLES_FETCH, error);
          reject(error);
        });
    });
  }
};
