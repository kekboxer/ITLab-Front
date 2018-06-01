import { ActionTree, Action } from "vuex"
import axios from "axios"
import { EquipmentState, Equipment } from "./types"
import { RootState } from "@/store/types"
import {
  EQUIPMENT_FETCH_ALL, EQUIPMENT_FETCH_ONE, EQUIPMENT_COMMIT_ONE, EQUIPMENT_SET_ALL, EQUIPMENT_SET_ONE
} from "@/store/actions/equipment"

export const actions: ActionTree<EquipmentState, RootState> = {
  [EQUIPMENT_FETCH_ALL]: ({ commit, dispatch }) => {
    return new Promise((resolve, reject) => {
      axios.get("Equipment").then((response) => {
        const body = response && response.data
        const data: Equipment[] = body.data

        commit(EQUIPMENT_SET_ALL, data);
        resolve(data);
      }).catch((error) => {
        console.log(error);
        reject(error);
      })
    })
  },

  [EQUIPMENT_FETCH_ONE]: ({ commit, dispatch }, id: string) => {
    return new Promise((resolve, reject) => {
      axios.get("Equipment/" + id).then((response) => {
        const body = response && response.data
        const data: Equipment = body.data

        commit(EQUIPMENT_SET_ONE, data);
        resolve(data);
      }).catch((error) => {
        console.log(error);
        reject(error);
      })
    })
  },

  [EQUIPMENT_COMMIT_ONE]: ({ commit, dispatch }, equipment: Equipment) => {
    return new Promise((resolve, reject) => {
      let request = equipment.id == "" ?
        axios.post("Equipment", equipment) : axios.put("Equipment", equipment)

      request.then((response) => {
        const body = response && response.data
        const data: Equipment = body.data

        commit(EQUIPMENT_SET_ONE, data)
        resolve(data)
      }).catch((error) => {
        console.log(error)
        reject(error)
      })
    })
  }
}