import { MutationTree } from 'vuex';
import { Vue } from 'vue-property-decorator';

import { setOneElement } from '@/stuff';

import {
  EquipmentState,
  Equipment,
  EquipmentType,
  EQUIPMENT_SET_ALL,
  EQUIPMENT_SET_ONE,
  EQUIPMENT_REMOVE_ONE,
  EQUIPMENT_TYPES_SET_ALL,
  EQUIPMENT_TYPES_SET_ONE,
  EQUIPMENT_TYPES_REMOVE_ONE
} from './types';

export const mutations: MutationTree<EquipmentState> = {
  [EQUIPMENT_SET_ALL]: (
    state,
    payload: Equipment[] | { equipment: Equipment[]; merge?: boolean }
  ) => {
    const equipment = payload instanceof Array ? payload : payload.equipment;
    const merge = payload instanceof Array ? false : payload.merge === true;

    if (merge) {
      equipment.forEach((e) => {
        setOneElement(state.equipment, e);
      });
    } else {
      state.equipment = equipment;
    }
  },

  [EQUIPMENT_SET_ONE]: (state, equipment: Equipment) => {
    setOneElement(state.equipment, equipment);
  },

  [EQUIPMENT_REMOVE_ONE]: (state, equipmentId: string) => {
    const equipmentIndex = state.equipment.findIndex(
      (equipment) => equipment.id === equipmentId
    );
    if (equipmentIndex !== -1) {
      Vue.delete(state.equipment, equipmentIndex);
    }
  },

  [EQUIPMENT_TYPES_SET_ALL]: (
    state,
    payload:
      | EquipmentType[]
      | { equipmentTypes: EquipmentType[]; merge?: boolean }
  ) => {
    const equipmentTypes =
      payload instanceof Array ? payload : payload.equipmentTypes;
    const merge = payload instanceof Array ? false : payload.merge === true;

    if (merge) {
      equipmentTypes.forEach((e) => {
        setOneElement(state.equipmentTypes, e);
      });
    } else {
      state.equipmentTypes = equipmentTypes;
    }
  },

  [EQUIPMENT_TYPES_SET_ONE]: (state, equipmentType: EquipmentType) => {
    setOneElement(state.equipmentTypes, equipmentType);
  },

  [EQUIPMENT_TYPES_REMOVE_ONE]: (state, equipmentTypeId: string) => {
    const equipmentTypeIndex = state.equipmentTypes.findIndex(
      (equipmentType) => equipmentType.id === equipmentTypeId
    );
    if (equipmentTypeIndex !== -1) {
      Vue.delete(state.equipment, equipmentTypeIndex);
    }
  }
};
