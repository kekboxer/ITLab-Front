import { Module } from "vuex"
import { getters } from "./getters"
import { actions } from "./actions"
import { mutations } from "./mutations"
import { AuthorizationState } from "./types"
import { RootState } from "@/store/types"

import axios from "axios"

const initializeToken = (): string | undefined => {
  const token = localStorage.getItem("user-token")
  if (token) {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token
    return token;
  }
}

export const state: AuthorizationState = {
  token: initializeToken()
}

export const authorization: Module<AuthorizationState, RootState> = {
  state,
  getters,
  actions,
  mutations
}