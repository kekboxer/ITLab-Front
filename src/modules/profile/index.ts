import { Module } from 'vuex';
import { RootState } from '@/store';
import axios from 'axios';

import { actions } from './actions';
import { getters } from './getters';
import { mutations } from './mutations';
import { ProfileState, LOCAL_STORAGE_REFRESH_TOKEN } from './types';

import { decodeJWT } from '@/stuff';

export * from './types';

const initializeToken = (): string | undefined => {
  const accessToken = localStorage.getItem('access-token');
  if (accessToken == null) {
    return;
  }

  try {
    const expirationDate: number = decodeJWT(accessToken).exp * 1000;
    const currentDate: number = Date.now();

    if (currentDate < expirationDate) {
      axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      return accessToken;
    }
  } catch (error) {
    return;
  }
};

export const state: ProfileState = {
  profile: undefined,
  accessToken: initializeToken(),
  refreshToken: localStorage.getItem(LOCAL_STORAGE_REFRESH_TOKEN) || undefined,
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
