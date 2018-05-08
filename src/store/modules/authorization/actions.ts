import { ActionTree } from "vuex"
import axios from "axios"
import { AuthorizationState, AuthorizationData } from "./types"
import { RootState } from "@/store/types"
import { AUTH_REQUEST, AUTH_ERROR, AUTH_SUCCESS, AUTH_LOGOUT } from "@/store/actions/authorization";

interface LoginResponse {
  id: string
  token: string
  firstName: string
  lastName: string
  studentId?: string
}

export const actions: ActionTree<AuthorizationState, RootState> = {
  [AUTH_REQUEST]: ({commit, dispatch}, authorizationData: AuthorizationData) => {
    return new Promise((resolve, reject) => {
      commit(AUTH_REQUEST)

      axios.post("Authentication/login", authorizationData).then(response => {
        const data: LoginResponse = response && response.data

        console.log(data)

        if (data.token) {
          localStorage.setItem("user-token", data.token)
          axios.defaults.headers.common['Authorization'] = data.token

          commit(AUTH_SUCCESS)
          resolve(response)
        }
        else {
          reject({
            err: 'No token in response'
          })
        }
      }).catch(err => {
        commit(AUTH_ERROR, err)
        localStorage.removeItem("user-token")
        reject(err)
      })
    })
  },
  
  [AUTH_LOGOUT]: ({commit, dispatch}) => {
    return new Promise((resolve, reject) => {
      commit(AUTH_LOGOUT)
      localStorage.removeItem("user-token")
      delete axios.defaults.headers.common['Authorization']
      resolve()
    })
  }
}
