import { Module } from 'vuex';
import { RootState } from '@/store';

import { actions } from './actions';
import { getters } from './getters';
import { mutations } from './mutations';
import { IEquipmentState } from './types';

export * from './types';

export const state: IEquipmentState = {
  equipment: [],
  equipmentTypes: []
};

export const equipment: Module<IEquipmentState, RootState> = {
  state,
  getters,
  actions,
  mutations
};
