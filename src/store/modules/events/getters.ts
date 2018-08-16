import { GetterTree } from "vuex"
import { RootState } from "@/store/types"

import {
  EventsState,
  EVENTS_GET_ALL,
  EVENTS_GET_ONE
} from "./types"

export const getters: GetterTree<EventsState, RootState> = {
  [EVENTS_GET_ALL]: (state) => {
    return ({ beginTime, endTime, invert = false }: { beginTime?: Date, endTime?: Date, invert: boolean }) => {
      return state.events.filter((event) => {

        const condition = (beginTime == undefined || event.beginTime && event.beginTime > beginTime)

        if (invert) {
          return !condition;
        }
        else {
          return condition;
        }
      });
    }
  },
  [EVENTS_GET_ONE]: (state) => {
    return (id: string) => {
      return state.events.find(v => v.id == id);
    }
  }
}