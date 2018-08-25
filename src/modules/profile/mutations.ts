import { MutationTree } from 'vuex';

import { decodeJWT } from '@/stuff';

import {
  ProfileState,
  LOCAL_STORAGE_ACCESS_TOKEN,
  LOCAL_STORAGE_REFRESH_TOKEN,
  LOCAL_STORAGE_SETTINGS_THEME,
  PROFILE_ACCESS_TOKEN_SET,
  PROFILE_REFRESH_TOKEN_SET,
  PROFILE_SETTINGS_THEME_SET
} from './types';

export const mutations: MutationTree<ProfileState> = {
  [PROFILE_ACCESS_TOKEN_SET]: (state, token?: string) => {
    state.accessToken = token;

    if (token) {
      state.accessTokenDecoded = decodeJWT(state.accessToken);
    } else {
      state.accessTokenDecoded = undefined;
    }

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
  }
};
