import { MutationTree } from 'vuex';
import { Vue } from 'vue-property-decorator';

import { setOneElement } from '@/stuff';

import { UsersState, User, USERS_SET_ALL, USERS_SET_ONE } from './types';

export const mutations: MutationTree<UsersState> = {
  [USERS_SET_ALL]: (
    state,
    payload: User[] | { users: User[]; merge?: boolean }
  ) => {
    const users = payload instanceof Array ? payload : payload.users;
    const merge = payload instanceof Array ? false : payload.merge === true;

    if (merge) {
      users.forEach((user) => {
        setOneElement(state.users, user);
      });
    } else {
      state.users = users;
    }
  },

  [USERS_SET_ONE]: (state, user: User) => {
    setOneElement(state.users, user);
  }
};
