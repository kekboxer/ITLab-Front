import { MutationTree } from 'vuex';

import { decodeJWT } from '@/stuff';

import {
  IProfileState,
  LOCAL_STORAGE_PROFILE_ID,
  LOCAL_STORAGE_ACCESS_TOKEN,
  LOCAL_STORAGE_REFRESH_TOKEN,
  LOCAL_STORAGE_SETTINGS_THEME,
  PROFILE_SET,
  PROFILE_ACCESS_TOKEN_SET,
  PROFILE_REFRESH_TOKEN_SET,
  PROFILE_SETTINGS_THEME_SET,
  PROFILE_ROLES_SET,
  LOCAL_STORAGE_ROLES
} from './types';

import { IUser, UserRoleName } from '@/modules/users';

export const mutations: MutationTree<IProfileState> = {
  [PROFILE_SET]: (state, data?: string | IUser) => {
    state.profileId = data == null || typeof data === 'string' ? data : data.id;

    if (state.profileId) {
      localStorage.setItem(LOCAL_STORAGE_PROFILE_ID, state.profileId);
    } else {
      localStorage.removeItem(LOCAL_STORAGE_PROFILE_ID);
    }
  },

  [PROFILE_ACCESS_TOKEN_SET]: (state, token?: string) => {
    state.accessToken = decodeJWT(token) || undefined;

    if (token) {
      localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN, token);
    } else {
      localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN);
    }
  },

  [PROFILE_REFRESH_TOKEN_SET]: (state, token: string) => {
    state.refreshToken = token;

    if (token) {
      localStorage.setItem(LOCAL_STORAGE_REFRESH_TOKEN, token);
    } else {
      localStorage.removeItem(LOCAL_STORAGE_REFRESH_TOKEN);
    }
  },

  [PROFILE_SETTINGS_THEME_SET]: (state, theme: string = 'light') => {
    state.settings.theme = theme;
    localStorage.setItem(LOCAL_STORAGE_SETTINGS_THEME, state.settings.theme);
  },

  [PROFILE_ROLES_SET]: (state, roles: UserRoleName[]) => {
    state.roles = roles;
    localStorage.setItem(LOCAL_STORAGE_ROLES, btoa(JSON.stringify(roles)));
  }
};
