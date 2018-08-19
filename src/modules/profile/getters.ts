import { GetterTree } from 'vuex';
import { RootState } from '@/store';

import {
  ProfileState,
  PROFILE_AUTHORIZED,
  PROFILE_SETTINGS_THEME_GET
} from './types';

export const getters: GetterTree<ProfileState, RootState> = {
  [PROFILE_AUTHORIZED]: (state) => {
    return state.authToken !== undefined;
  },

  [PROFILE_SETTINGS_THEME_GET]: (state) => {
    return state.settings.theme;
  }
};
