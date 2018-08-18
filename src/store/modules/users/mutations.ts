import { MutationTree } from 'vuex';
import { Vue } from 'vue-property-decorator';

import { UsersState, User, USERS_SET_ALL, USERS_SET_ONE } from './types';

const setOneUser = (users: User[], user: User) => {
  const currentUserIndex = users.findIndex((u) => u.id === user.id);

  if (currentUserIndex === -1) {
    users.push(user);
  } else {
    Vue.set(
      users,
      currentUserIndex,
      Object.assign({}, users[currentUserIndex], user)
    );
  }
};

export const mutations: MutationTree<UsersState> = {
  [USERS_SET_ALL]: (
    state,
    payload: User[] | { users: User[]; merge?: boolean }
  ) => {
    const users = payload instanceof Array ? payload : payload.users;
    const merge = payload instanceof Array ? false : payload.merge === true;

    if (merge) {
      users.forEach((user) => {
        setOneUser(state.users, user);
      });
    } else {
      state.users = users;
    }
  },

  [USERS_SET_ONE]: (state, user: User) => {
    setOneUser(state.users, user);
  }
};
