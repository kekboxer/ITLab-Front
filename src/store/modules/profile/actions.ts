import { ActionTree } from "vuex"
import axios from "axios"
import { ProfileState, RegistrationData, User, UserDefault } from "./types"
import { RootState } from "@/store/types"
import { PROFILE_CREATE, PROFILE_ASSIGN_EQUIPMENT, PROFILE_REMOVE_EQUIPMENT } from "@/store/actions/profile"

import { Equipment, EquipmentDefault } from "@/store/modules/equipment/types";
import { equipment } from "@/store/modules/equipment";

export const actions: ActionTree<ProfileState, RootState> = {
  [PROFILE_CREATE]: ({ commit, dispatch }, registrationData: RegistrationData) => {
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
  },

  [PROFILE_ASSIGN_EQUIPMENT]: ({ commit, dispatch }, [equipment, user]: [Equipment, User | string | null]) => {
    return new Promise((resolve, reject) => {
      let url: string = "Equipment/user";
      if (user) {
        if (typeof user === "string") {
          url += `/${user as string}`;
        }
        else if ("id" in (user as any)) {
          url += `/${(user as any).id}`;
        }
      }

      axios
        .post(url, { id: equipment.id })
        .then(result => {
          const body = result && result.data;
          const equipment: Equipment = body && body.data;
          
          resolve(equipment);
        })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });
  },

  [PROFILE_REMOVE_EQUIPMENT]: ({ commit, dispatch }, [equipment, user]: [Equipment, User | string | null]) => {
    return new Promise((resolve, reject) => {
      let url: string = "Equipment/user";
      if (user) {
        if (typeof user === "string") {
          url += `/${user as string}`;
        }
        else if ("id" in (user as any)) {
          url += `/${(user as any).id}`;
        }
      }

      axios
        .delete(url, { data: { id: equipment.id } }).then(result => {
          const body = result && result.data;
          const equipment: Equipment = body && body.data;

          resolve(equipment);
        })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    })
  }
}