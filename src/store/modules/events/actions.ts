import { ActionTree } from "vuex"
import axios from "axios"
import { EventsState, Event } from "./types"
import { RootState } from "@/store/types"
import { EVENTS_FETCH, EVENTS_SET } from "@/store/actions/events";

export const actions: ActionTree<EventsState, RootState> = {
  [EVENTS_FETCH]: ({commit, dispatch}) => {
    return new Promise((resolve, reject) => {
      axios.get('event').then((response) => {
        const body = response && response.data
        const data: Event[] = body.data

        if (body.statusCode == 1) {
          commit(EVENTS_SET, data)
          resolve()
        }
        else {
          reject({
            err: "Unable to fetch events"
          })
        }
      }).catch((error) => {
        console.log(error)
        reject(error)
      })
    })
  }
}