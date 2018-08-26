import { Module } from 'vuex';
import { RootState } from '@/store';
import axios from 'axios';

import { actions, setAxiosAuthHeader } from './actions';
import { getters } from './getters';
import { mutations } from './mutations';
import {
  ProfileState,
  AccessToken,
  LOCAL_STORAGE_ACCESS_TOKEN,
  LOCAL_STORAGE_REFRESH_TOKEN
} from './types';

import { decodeJWT } from '@/stuff';

export * from './types';

const getStoredTokens = (): {
  accessToken?: string;
  accessTokenDecoded?: AccessToken;
  refreshToken?: string;
} => {
  const accessToken = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN);
  const refreshToken = localStorage.getItem(LOCAL_STORAGE_REFRESH_TOKEN);

  setAxiosAuthHeader(accessToken || undefined);

  return {
    accessToken: accessToken || undefined,
    accessTokenDecoded: accessToken ? decodeJWT(accessToken) : undefined,
    refreshToken: refreshToken || undefined
  };
};

export const state: ProfileState = {
  profile: undefined,
  ...getStoredTokens(),
  settings: {
    theme: localStorage.getItem('theme') || 'light'
  }
};

export const profile: Module<ProfileState, RootState> = {
  state,
  getters,
  actions,
  mutations
};
