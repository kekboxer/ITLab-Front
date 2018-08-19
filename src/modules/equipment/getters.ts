import { GetterTree } from 'vuex';
import { RootState } from '@/store';

import { EquipmentState, EQUIPMENT_GET_ALL, EQUIPMENT_GET_ONE } from './types';

export const getters: GetterTree<EquipmentState, RootState> = {
  [EQUIPMENT_GET_ALL]: (state) => {
    return state.equipment;
  },

  [EQUIPMENT_GET_ONE]: (state) => {
    return (id: string) => {
      return state.equipment.find((v) => v.id === id);
    };
  }
};
