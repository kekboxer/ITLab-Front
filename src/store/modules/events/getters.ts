import { GetterTree } from "vuex"
import { EventsState } from "./types"
import { RootState } from "@/store/types"
import { EVENTS_GET } from "@/store/actions/events";

export const getters: GetterTree<EventsState, RootState> = {
  [EVENTS_GET]: (state) => {
    return state.events
  }
}