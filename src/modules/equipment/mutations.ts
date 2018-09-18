import { MutationTree } from 'vuex';
import { Vue } from 'vue-property-decorator';

import {
  EquipmentState,
  Equipment,
  EquipmentType,
  EQUIPMENT_SET_ALL,
  EQUIPMENT_SET_ONE,
  EQUIPMENT_REMOVE_ONE,
  EQUIPMENT_TYPE_SET_ALL
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

const setOneEquipmentType = (equipmentTypesArray: EquipmentType[], equipmentType: EquipmentType) => {
  const currentEquipmentTypeIndex = equipmentTypesArray.findIndex((value) => {
    return value.id === equipmentType.id;
  });

  if (currentEquipmentTypeIndex === -1) {
    equipmentTypesArray.push(equipmentType);
  } else {
    Vue.set(
      equipmentTypesArray,
      currentEquipmentTypeIndex,
      Object.assign({}, equipmentTypesArray[currentEquipmentTypeIndex], equipmentType)
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
  },

  [EQUIPMENT_REMOVE_ONE]: (state, equipmentId: string) => {
    const equipmentIndex = state.equipment.findIndex(
      (equipment) => equipment.id === equipmentId
    );
    if (equipmentIndex !== -1) {
      Vue.delete(state.equipment, equipmentIndex);
    }
  },

  [EQUIPMENT_TYPE_SET_ALL]: (state, payload: EquipmentType[] | { equipmentTypes: EquipmentType[]; merge?: boolean }) => {
    const equipmentTypes = payload instanceof Array ? payload : payload.equipmentTypes;
    const merge = payload instanceof Array ? false : payload.merge === true;

    if (merge) {
      equipmentTypes.forEach((e) => {
        setOneEquipmentType(state.equipmentTypes, e);
      });
    } else {
      state.equipmentTypes = equipmentTypes;
    }
  }
};
