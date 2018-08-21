import { Module } from 'vuex';
import { RootState } from '@/store';
import axios from 'axios';

import { actions } from './actions';
import { getters } from './getters';
import { mutations } from './mutations';
import { ProfileState } from './types';

import { decodeJWT } from '@/stuff';

export * from './types';

const initializeToken = (): string | undefined => {
  const token = localStorage.getItem('user-token');
  if (token == null) {
    return;
  }

  try {
    const expirationDate: number = decodeJWT(token).exp * 1000;
    const currentDate: number = Date.now();

    if (currentDate < expirationDate) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      return token;
    }
  } catch (error) {
    return;
  }
};

export const state: ProfileState = {
  profile: undefined,
  authToken: initializeToken(),
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
