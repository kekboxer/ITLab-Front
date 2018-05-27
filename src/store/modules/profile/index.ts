import { Module } from "vuex"
import { getters } from "./getters"
import { actions } from "./actions"
import { mutations } from "./mutations"
import { ProfileState } from "./types"
import { RootState } from "@/store/types"

export const state: ProfileState = {
  profile: undefined,
  settings: {
    darkTheme: localStorage.getItem("dark-theme") != null
  }
}

export const profile: Module<ProfileState, RootState> = {
  state,
  getters,
  actions,
  mutations
}