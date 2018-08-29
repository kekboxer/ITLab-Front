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
  const profileId = localStorage.getItem(LOCAL_STORAGE_PROFILE_ID) || undefined;
  const accessToken =
    localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN) || undefined;
  const refreshToken =
    localStorage.getItem(LOCAL_STORAGE_REFRESH_TOKEN) || undefined;

  let accessTokenDecoded: AccessToken | undefined;
  if (accessToken) {
    try {
      accessTokenDecoded = decodeJWT(accessToken) as AccessToken;
    } catch (e) {
      console.error('Stored access token is invalid');
    }
  }

  setAxiosAuthHeader(accessToken || undefined);

  return {
    profileId,
    accessToken: accessTokenDecoded != null ? accessToken : undefined,
    accessTokenDecoded,
    refreshToken
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
