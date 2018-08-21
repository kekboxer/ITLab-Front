import { Module } from 'vuex';
import { RootState } from '@/store';
import axios from 'axios';

import { actions } from './actions';
import { getters } from './getters';
import { mutations } from './mutations';
import { ProfileState } from './types';

export * from './types';

const urlBase64Decode = (str: string) => {
  let output = str.replace(/-/g, '+').replace(/_/g, '/');
  switch (output.length % 4) {
    case 0:
      break;
    case 2:
      output += '==';
      break;
    case 3:
      output += '=';
      break;
    default:
      // tslint:disable-next-line:no-string-throw
      throw 'Illegal base64url string!';
  }
  return decodeURIComponent(escape(atob(output)));
};

const decodeToken = (token: string = '') => {
  if (token === null || token === '') {
    return { upn: '' };
  }
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('JWT must have 3 parts');
  }
  const decoded = urlBase64Decode(parts[1]);
  if (!decoded) {
    throw new Error('Cannot decode the token');
  }
  return JSON.parse(decoded);
};

const initializeToken = (): string | undefined => {
  const token = localStorage.getItem('user-token');
  if (token == null) {
    return;
  }

  try {
    const expirationDate: number = decodeToken(token).exp * 1000;
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
