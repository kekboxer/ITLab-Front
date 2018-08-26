import { Module } from 'vuex';
import { RootState } from '@/store';
import axios from 'axios';

import { actions, setAxiosAuthHeader } from './actions';
import { getters } from './getters';
import { mutations } from './mutations';
import {
  ProfileState,
  AccessToken,
  LOCAL_STORAGE_PROFILE_ID,
  LOCAL_STORAGE_ACCESS_TOKEN,
  LOCAL_STORAGE_REFRESH_TOKEN,
  LOCAL_STORAGE_SETTINGS_THEME
} from './types';

import { decodeJWT } from '@/stuff';

export * from './types';

const getStoredData = (): {
  profileId?: string;
  accessToken?: string;
  accessTokenDecoded?: AccessToken;
  refreshToken?: string;
} => {
  const profileId = localStorage.getItem(LOCAL_STORAGE_PROFILE_ID);
  const accessToken = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN);
  const refreshToken = localStorage.getItem(LOCAL_STORAGE_REFRESH_TOKEN);

  setAxiosAuthHeader(accessToken || undefined);

  return {
    profileId: profileId || undefined,
    accessToken: accessToken || undefined,
    accessTokenDecoded: accessToken ? decodeJWT(accessToken) : undefined,
    refreshToken: refreshToken || undefined
  };
};

export const state: ProfileState = {
  ...getStoredData(),
  settings: {
    theme: localStorage.getItem(LOCAL_STORAGE_SETTINGS_THEME) || 'light'
  }
};

export const profile: Module<ProfileState, RootState> = {
  state,
  getters,
  actions,
  mutations
};
