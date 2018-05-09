import { GetterTree } from "vuex"
import { AuthorizationState } from "./types"
import { RootState } from "@/store/types"

export const getters: GetterTree<AuthorizationState, RootState> = {
  isAuthenticated: (state): boolean => {
    return state.token != undefined
  }
}