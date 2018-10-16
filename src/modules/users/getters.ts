import { GetterTree } from 'vuex';
import { RootState } from '@/store';

import { IUsersState, USERS_GET_ALL, USERS_GET_ONE, USER_ROLES_GET_ALL } from './types';

export const getters: GetterTree<IUsersState, RootState> = {
  [USERS_GET_ALL]: (state) => {
    return state.users;
  },

  [USERS_GET_ONE]: (state) => {
    return (id: string) => {
      return state.users.find((v) => v.id === id);
    };
  },

  [USER_ROLES_GET_ALL]: (state) => {
    return state.userRoles;
  }
};
