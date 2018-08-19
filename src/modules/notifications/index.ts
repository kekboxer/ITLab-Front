import { Module } from 'vuex';
import { RootState } from '@/store';

import { actions } from './actions';
import { getters } from './getters';
import { mutations } from './mutations';
import { NotificationsState } from './types';

export * from './types';

export const state: NotificationsState = {
  eventNotifications: []
};

export const notifications: Module<NotificationsState, RootState> = {
  state,
  getters,
  actions,
  mutations
};
