import { MutationTree } from "vuex"
import { AuthorizationState } from "./types"
import { AUTH_LOGIN, AUTH_LOGOUT } from "@/store/actions/authorization";

export const mutations: MutationTree<AuthorizationState> = {
  [AUTH_LOGIN]: (state, token: string) => {
    state.token = token
  },

  [AUTH_LOGOUT]: (state) => {
    state.token = undefined
  }
}