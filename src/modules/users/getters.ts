import { GetterTree } from 'vuex';
import { RootState } from '@/store';

import { UsersState, USERS_GET_ALL, USERS_GET_ONE } from './types';

export const getters: GetterTree<UsersState, RootState> = {
  [USERS_GET_ALL]: (state) => {
    return state.users;
  },

  [USERS_GET_ONE]: (state) => {
    return (id: string) => {
      return state.users.find((v) => v.id === id);
    };
  }
};
