import { GetterTree } from "vuex"
import { AuthorizationState, AuthorizationStatus } from "./types"
import { RootState } from "@/store/types"

export const getters: GetterTree<AuthorizationState, RootState> = {
  isAuthenticated: (state): boolean => {
    return state.token != undefined
  },
  authStatus: (state): AuthorizationStatus | undefined => {
    return state.status
  }
}