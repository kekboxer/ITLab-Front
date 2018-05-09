import { ActionTree } from "vuex"
import axios from "axios"
import { ProfileState, RegistrationData } from "./types"
import { RootState } from "@/store/types"
import { PROFILE_CREATE } from "@/store/actions/profile"

export const actions: ActionTree<ProfileState, RootState> = {
  [PROFILE_CREATE]: ({commit, dispatch}, registrationData: RegistrationData) => {
    return new Promise((resolve, reject) => {
      axios.post("account", registrationData).then(response => {
        const body = response && response.data

        if (body.statusCode == 1) {
          resolve(body)
        }
        else {
          reject({
            err: "Registration failed"
          })
        }
      }).catch(err => {
        console.log("CATCH ERR:", err)
      })
    })
  }
}