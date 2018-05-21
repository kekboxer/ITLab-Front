import { ActionTree } from "vuex"
import axios from "axios"
import { AuthorizationState, AuthorizationData } from "./types"
import { RootState } from "@/store/types"
import { AUTH_LOGIN, AUTH_LOGOUT } from "@/store/actions/authorization";

interface LoginResponse {
  id: string
  token: string
  firstName: string
  lastName: string
  studentID?: string
}

export const actions: ActionTree<AuthorizationState, RootState> = {
  [AUTH_LOGIN]: ({commit, dispatch}, authorizationData: AuthorizationData) => {
    return new Promise((resolve, reject) => {
      axios.post("Authentication/login", authorizationData).then(response => {
        const body = response && response.data
        const data: LoginResponse = body && body.data

        if (body.statusCode == 1 && data.token) {
          localStorage.setItem("user-token", data.token)
          console.log("TOKEN", data.token)
          axios.defaults.headers.common['Authorization'] = "Bearer " + data.token

          commit(AUTH_LOGIN, data.token)
          resolve(body)
        }
        else {
          reject({
            err: "Login failed"
          })
        }
      }).catch(err => {
        localStorage.removeItem("user-token")
        reject(err)
      })
    })
  },
  
  [AUTH_LOGOUT]: ({commit, dispatch}) => {
    return new Promise((resolve, reject) => {
      commit(AUTH_LOGOUT)
      localStorage.removeItem("user-token")
      axios.defaults.headers.common['Authorization'] = undefined
      resolve()
    })
  }
}
