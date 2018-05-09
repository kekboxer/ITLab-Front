import { MutationTree } from "vuex"
import { EventsState, Event } from "./types"
import { EVENTS_SET } from "@/store/actions/events";

export const mutations: MutationTree<EventsState> = {
  [EVENTS_SET]: (state, events: Event[]) => {
    state.events = events.sort((a, b) => {
      if (a.beginTime < b.beginTime) {
        return 1
      }
      else if (a.beginTime > b.beginTime) {
        return -1
      }
      else {
        return 0
      }
    })
  }
}