import { ActionTree } from 'vuex';
import { RootState } from '@/store';
import axios from 'axios';

import { getResponseData } from '@/stuff';

import {
  UsersState,
  User,
  USER_INVITE,
  USER_SEARCH,
  USERS_FETCH_ALL,
  USERS_FETCH_ONE,
  USER_ASSIGN_EQUIPMENT,
  USER_REMOVE_EQUIPMENT,
  USERS_SET_ALL,
  USERS_SET_ONE
} from './types';

import { Equipment } from '@/modules/equipment';

export const actions: ActionTree<UsersState, RootState> = {
  [USER_INVITE]: ({}, { email }: { email: string }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('user', {
          email,
          redirectUrl: window.location.origin
        })
        .then((response) => getResponseData<string>(response))
        .then((invitationCode) => resolve(invitationCode))
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
        .get(`user?match=${encodeURIComponent(match)}&count=${all ? 0 : 5}`)
        .then((response) => getResponseData<User[]>(response))
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
        .get('user')
        .then((response) => getResponseData<User[]>(response))
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
        .then((response) => getResponseData<User>(response))
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
    { equipment, user }: { equipment: Equipment; user: User | string | null }
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
        .then((response) => getResponseData<Equipment>(response))
        .then((equipment) => resolve(equipment))
        .catch((error) => {
          console.log(USER_ASSIGN_EQUIPMENT, error);
          reject(error);
        });
    });
  },

  [USER_REMOVE_EQUIPMENT]: (
    {},
    { equipment, owner }: { equipment: Equipment; owner: User | string | null }
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
        .then((response) => getResponseData<Equipment>(response))
        .then((equipment) => resolve(equipment))
        .catch((error) => {
          console.log(USER_REMOVE_EQUIPMENT, error);
          reject(error);
        });
    });
  }
};
