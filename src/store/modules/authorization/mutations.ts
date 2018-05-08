import { MutationTree } from "vuex"
import { AuthorizationState, AuthorizationStatus } from "./types"
import { AUTH_REQUEST, AUTH_SUCCESS, AUTH_ERROR, AUTH_LOGOUT } from "@/store/actions/authorization";

export const mutations: MutationTree<AuthorizationState> = {
  [AUTH_REQUEST]: (state) => {
    state.status = AuthorizationStatus.Loading
  },

  [AUTH_SUCCESS]: (state, token: string) => {
    state.status = AuthorizationStatus.Success
  },

  [AUTH_ERROR]: (state) => {
    state.status = AuthorizationStatus.Error
  },

  [AUTH_LOGOUT]: (state) => {
    console.log("logout")
  }
}