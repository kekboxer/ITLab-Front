import { MutationTree } from "vuex"
import { EventsState, Event } from "./types"
import { EVENTS_SET, EVENT_SET } from "@/store/actions/events";

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
  },
  [EVENT_SET]: (state, event: Event) => {
    const currentEventIndex = state.events.findIndex((value, index, obj) => {
      return value.id == event.id
    })

    if (currentEventIndex == 1) {
      state.events.push(event)
    }
    else {
      state.events[currentEventIndex] = event
    }
  }
}