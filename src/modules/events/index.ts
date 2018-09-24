import { Module } from 'vuex';
import { RootState } from '@/store';

import { actions } from './actions';
import { getters } from './getters';
import { mutations } from './mutations';
import { IEventsState } from './types';

export * from './types';

export const state: IEventsState = {
  events: [],
  eventTypes: [],
  eventRoles: []
};

export const events: Module<IEventsState, RootState> = {
  state,
  getters,
  actions,
  mutations
};
