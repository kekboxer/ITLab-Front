import { Module } from 'vuex';
import { RootState } from '@/store';

import { actions } from './actions';
import { getters } from './getters';
import { mutations } from './mutations';
import { INotificationsState } from './types';

export * from './types';

export const state: INotificationsState = {
  eventInvitations: [],
  eventWishApplications: []
};

export const notifications: Module<INotificationsState, RootState> = {
  state,
  getters,
  actions,
  mutations
};
