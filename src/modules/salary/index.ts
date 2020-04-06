import { Module } from 'vuex';
import { RootState } from '@/store';

import { actions } from './actions';
import { getters } from './getters';
import { mutations } from './mutations';
import { IEventSalaryState } from './types';

export * from './types';

export const state: IEventSalaryState = {
    eventSalaries: [],
};

export const salary: Module<IEventSalaryState, RootState> = {
  state,
  actions,
  getters,
};
