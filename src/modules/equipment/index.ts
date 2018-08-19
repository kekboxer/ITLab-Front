import { Module } from 'vuex';
import { RootState } from '@/store';

import { actions } from './actions';
import { getters } from './getters';
import { mutations } from './mutations';
import { EquipmentState } from './types';

export * from './types';

export const state: EquipmentState = {
  equipment: []
};

export const equipment: Module<EquipmentState, RootState> = {
  state,
  getters,
  actions,
  mutations
};
