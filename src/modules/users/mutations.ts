import { MutationTree } from 'vuex';

import { setOneElement } from '@/stuff';

import {
  IUsersState,
  IUser,
  IUserRole,
  USERS_SET_ALL,
  USERS_SET_ONE,
  USER_ROLES_SET_ALL,
  USER_PROPERTY_TYPES_SET_ONE,
  USER_PROPERTY_TYPES_SET_ALL,
  IUserPropertyType
} from './types';

export const mutations: MutationTree<IUsersState> = {
  [USERS_SET_ALL]: (
    state,
    payload: IUser[] | { users: IUser[]; merge?: boolean }
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

  [USERS_SET_ONE]: (state, user: IUser) => {
    setOneElement(state.users, user);
  },

  [USER_PROPERTY_TYPES_SET_ALL]: (
    state,
    payload:
      | IUserPropertyType[]
      | { userPropertyTypes: IUserPropertyType[]; merge?: boolean }
  ) => {
    const userPropertyTypes =
      payload instanceof Array ? payload : payload.userPropertyTypes;
    const merge = payload instanceof Array ? false : payload.merge === true;

    if (merge) {
      userPropertyTypes.forEach((e) => {
        setOneElement(state.userPropertyTypes, e);
      });
    } else {
      state.userPropertyTypes = userPropertyTypes;
    }
  },

  [USER_PROPERTY_TYPES_SET_ONE]: (state, userPropertyType: IUserPropertyType) => {
    setOneElement(state.userPropertyTypes, userPropertyType);
  },

  [USER_ROLES_SET_ALL]: (
    state,
    payload: IUserRole[] | { userRoles: IUserRole[]; merge?: boolean }
  ) => {
    const roles = payload instanceof Array ? payload : payload.userRoles;
    const merge = payload instanceof Array ? false : payload.merge === true;

    if (merge) {
      roles.forEach((role) => {
        setOneElement(state.userRoles, role);
      });
    } else {
      state.userRoles = roles;
    }
  }
};
