import { Vue } from "vue-property-decorator";
import { MutationTree } from "vuex"
import { EquipmentState, Equipment } from "./types"
import { EQUIPMENT_SET_ALL, EQUIPMENT_SET_ONE } from "@/store/actions/equipment";

export const mutations: MutationTree<EquipmentState> = {
  [EQUIPMENT_SET_ALL]: (state, equipment: Equipment[]) => {
    state.equipment = equipment
  },

  [EQUIPMENT_SET_ONE]: (state, equipment: Equipment) => {
    const currentEquipmentIndex = state.equipment.findIndex((value) => {
      return value.id == equipment.id
    })

    if (currentEquipmentIndex == -1) {
      state.equipment.push(equipment)
    } else {
      Vue.set(state.equipment, currentEquipmentIndex, 
        Object.assign({}, state.equipment[currentEquipmentIndex], equipment));
    }
  }
}