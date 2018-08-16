import { Module } from "vuex"
import { RootState } from "@/store/types"
import axios from "axios"

import { actions } from "./actions"
import { getters } from "./getters"
import { mutations } from "./mutations"
import { ProfileState } from "./types"

export * from "./types"

const initializeToken = (): string | undefined => {
  const token = localStorage.getItem("user-token")
  if (token) {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token
    return token;
  }
}

export const state: ProfileState = {
  profile: undefined,
  authToken: initializeToken(),
  settings: {
    theme: localStorage.getItem("theme") || "light"
  }
}

export const profile: Module<ProfileState, RootState> = {
  state,
  getters,
  actions,
  mutations
}