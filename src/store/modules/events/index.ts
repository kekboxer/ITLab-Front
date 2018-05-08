import { Module } from "vuex"
import { getters } from "./getters"
import { actions } from "./actions"
import { mutations } from "./mutations"
import { EventsState } from "./types"
import { RootState } from "@/store/types"

export const state: EventsState = {
  events: []
}

export const events: Module<EventsState, RootState> = {
  state,
  getters,
  actions,
  mutations
}