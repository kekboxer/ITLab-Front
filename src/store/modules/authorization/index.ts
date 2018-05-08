import { Module } from "vuex"
import { getters } from "./getters"
import { actions } from "./actions"
import { mutations } from "./mutations"
import { AuthorizationState } from "./types"
import { RootState } from "@/store/types"

export const state: AuthorizationState = {
  token: localStorage.getItem("user-token") || undefined,
  status: undefined
}

export const authorization: Module<AuthorizationState, RootState> = {
  state,
  getters,
  actions,
  mutations
}