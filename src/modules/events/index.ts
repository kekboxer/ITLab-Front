import { Module } from 'vuex';
import { RootState } from '@/store';

import { actions } from './actions';
import { getters } from './getters';
import { mutations } from './mutations';
import { EventsState } from './types';

export * from './types';

export const state: EventsState = {
  events: [],
  eventTypes: []
};

export const events: Module<EventsState, RootState> = {
  state,
  getters,
  actions,
  mutations
};
