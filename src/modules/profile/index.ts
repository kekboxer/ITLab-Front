import { Module } from 'vuex';
import { RootState } from '@/store';

import { actions } from './actions';
import { getters } from './getters';
import { mutations } from './mutations';
import {
  IProfileState,
  LOCAL_STORAGE_PROFILE_ID,
  LOCAL_STORAGE_ACCESS_TOKEN,
  LOCAL_STORAGE_REFRESH_TOKEN,
  LOCAL_STORAGE_SETTINGS_THEME
} from './types';

import { decodeJWT, AccessToken, setAxiosAuthHeader } from '@/stuff';

export * from './types';

const getStoredData = (): {
  profileId?: string;
  accessToken?: AccessToken;
  refreshToken?: string;
} => {
  const profileId = localStorage.getItem(LOCAL_STORAGE_PROFILE_ID) || undefined;
  const accessToken =
    localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN) || undefined;
  const refreshToken =
    localStorage.getItem(LOCAL_STORAGE_REFRESH_TOKEN) || undefined;

  setAxiosAuthHeader(accessToken || undefined);

  return {
    profileId,
    accessToken: decodeJWT(accessToken) || undefined,
    refreshToken
  };
};

export const state: IProfileState = {
  ...getStoredData(),
  roles: [],
  settings: {
    theme: localStorage.getItem(LOCAL_STORAGE_SETTINGS_THEME) || 'light'
  }
};

export const profile: Module<IProfileState, RootState> = {
  state,
  getters,
  actions,
  mutations
};
