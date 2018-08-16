import { Module } from "vuex"
import { RootState } from "@/store/types"

import { actions } from "./actions"
import { getters } from "./getters"
import { mutations } from "./mutations"
import { UsersState } from "./types"

export * from "./types"

export const state: UsersState = {
  users: []
}

export const users: Module<UsersState, RootState> = {
  state,
  getters,
  actions,
  mutations
}