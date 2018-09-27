import { GetterTree } from 'vuex';
import { RootState } from '@/store';

import {
  IProfileState,
  PROFILE_GET,
  PROFILE_AUTHORIZED,
  PROFILE_SETTINGS_THEME_GET,
  PROFILE_REFRESH_TOKEN,
  PROFILE_HAS_ROLE
} from './types';
import { UserRole } from '@/stuff';

export const getters: GetterTree<IProfileState, RootState> = {
  [PROFILE_GET]: (state) => {
    return state.profileId;
  },

  [PROFILE_AUTHORIZED]: (state) => {
    return (
      state.accessToken !== undefined &&
      state.accessToken.expirationDate.getTime() > Date.now()
    );
  },

  [PROFILE_REFRESH_TOKEN]: (state) => {
    return state.refreshToken;
  },

  [PROFILE_SETTINGS_THEME_GET]: (state) => {
    return state.settings.theme;
  },

  [PROFILE_HAS_ROLE]: (state) => {
    return (userRole: UserRole) =>
      state.accessToken !== undefined &&
      state.accessToken.roles.includes(userRole);
  }
};
