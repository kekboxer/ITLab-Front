import { Module } from "vuex"
import { getters } from "./getters"
import { actions } from "./actions"
import { mutations } from "./mutations"
import { EquipmentState, Equipment } from "./types"
import { RootState } from "@/store/types"

export const state: EquipmentState = {
  equipment: []
}

export const equipment: Module<EquipmentState, RootState> = {
  state,
  getters,
  actions,
  mutations
}