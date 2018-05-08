import { ActionTree } from "vuex"
import axios from "axios"
import { EventsState, Event } from "./types"
import { RootState } from "@/store/types"
import { EVENTS_FETCH, EVENTS_SET } from "@/store/actions/events";

export const actions: ActionTree<EventsState, RootState> = {
  [EVENTS_FETCH]: ({commit, dispatch}) => {
    return new Promise((resolve, reject) => {
      axios.get('events/').then((response) => {
        commit(EVENTS_SET, response.data)
        resolve()
      }).catch((error) => {
        console.log(error)
        reject(error)
      })
    })
  }
}