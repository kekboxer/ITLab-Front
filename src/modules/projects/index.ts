import { Module } from 'vuex';
import { RootState } from '@/store';

import { actions } from './actions';
import { getters } from './getters';
import { mutations } from './mutations';
import { IProjectState } from './types';

export * from './types';

export const state: IProjectState = {
  projects: []
};

export const projects: Module<IProjectState, RootState> = {
  state,
  getters,
  actions,
  mutations
};
