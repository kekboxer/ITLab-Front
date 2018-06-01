import { GetterTree } from "vuex"
import { EquipmentState } from "./types"
import { RootState } from "@/store/types"
import { EQUIPMENT_GET_ALL, EQUIPMENT_GET_ONE } from "@/store/actions/equipment"

export const getters: GetterTree<EquipmentState, RootState> = {
  [EQUIPMENT_GET_ALL]: (state) => {
    return state.equipment
  },
  [EQUIPMENT_GET_ONE]: (state, id) => {
    return state.equipment.find((value) => {
      return value.id == id
    })
  }
}