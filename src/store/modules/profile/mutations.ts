import { MutationTree } from 'vuex';

import {
  ProfileState,
  PROFILE_AUTH_TOKEN_SET,
  PROFILE_SETTINGS_THEME_SET
} from './types';

export const mutations: MutationTree<ProfileState> = {
  [PROFILE_AUTH_TOKEN_SET]: (state, token: string) => {
    state.authToken = token;
  },

  [PROFILE_SETTINGS_THEME_SET]: (state, theme: string = 'light') => {
    state.settings.theme = theme;
    localStorage.setItem('theme', state.settings.theme);
  }
};
