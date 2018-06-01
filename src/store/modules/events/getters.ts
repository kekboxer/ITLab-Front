import { GetterTree } from "vuex"
import { EventsState } from "./types"
import { RootState } from "@/store/types"
import { EVENTS_GET_ALL, EVENTS_GET_ONE } from "@/store/actions/events";

export const getters: GetterTree<EventsState, RootState> = {
  [EVENTS_GET_ALL]: (state) => {
    return state.events
  },
  [EVENTS_GET_ONE]: (state, id) => {
    return state.events.find((value) => {
      return value.id == id
    })
  }
}