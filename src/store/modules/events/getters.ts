import { GetterTree } from "vuex"
import { EventsState } from "./types"
import { RootState } from "@/store/types"
import { EVENTS_GET_ALL, EVENTS_GET_ONE } from "@/store/actions/events";

export const getters: GetterTree<EventsState, RootState> = {
  [EVENTS_GET_ALL]: (state, getters: any) => {
    return (dateBegin?: Date, dateEnd?: Date) => {
      return state.events.filter((event) => {
        return (dateBegin == undefined || event.endTime > dateBegin) &&
          (dateEnd == undefined || event.beginTime < dateEnd)
      });
    }
  },
  [EVENTS_GET_ONE]: (state, getters: any) => {
    return (id: string) => {
      return state.events.find(v => v.id == id);
    }
  }
}