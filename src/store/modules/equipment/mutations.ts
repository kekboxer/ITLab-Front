import { MutationTree } from 'vuex';
import { Vue } from 'vue-property-decorator';

import {
  EquipmentState,
  Equipment,
  EQUIPMENT_SET_ALL,
  EQUIPMENT_SET_ONE
} from './types';

const setOneEquipment = (equipmentArray: Equipment[], equipment: Equipment) => {
  const currentEquipmentIndex = equipmentArray.findIndex((value) => {
    return value.id === equipment.id;
  });

  if (currentEquipmentIndex === -1) {
    equipmentArray.push(equipment);
  } else {
    Vue.set(
      equipmentArray,
      currentEquipmentIndex,
      Object.assign({}, equipmentArray[currentEquipmentIndex], equipment)
    );
  }
};

export const mutations: MutationTree<EquipmentState> = {
  [EQUIPMENT_SET_ALL]: (
    state,
    payload: Equipment[] | { equipment: Equipment[]; merge?: boolean }
  ) => {
    const equipment = payload instanceof Array ? payload : payload.equipment;
    const merge = payload instanceof Array ? false : payload.merge === true;

    if (merge) {
      equipment.forEach((e) => {
        setOneEquipment(state.equipment, e);
      });
    } else {
      state.equipment = equipment;
    }
  },

  [EQUIPMENT_SET_ONE]: (state, equipment: Equipment) => {
    setOneEquipment(state.equipment, equipment);
  }
};
