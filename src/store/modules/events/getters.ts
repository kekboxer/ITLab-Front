import { GetterTree } from "vuex"
import { EventsState } from "./types"
import { RootState } from "@/store/types"
import { EVENTS_GET, EVENT_GET } from "@/store/actions/events";

export const getters: GetterTree<EventsState, RootState> = {
  [EVENTS_GET]: (state) => {
    return state.events.reverse();
  },
  [EVENT_GET]: (state, id) => {
    return state.events.find((value, index, obj) => {
      return value.id == id
    })
  }
}