import { GetterTree } from "vuex"
import { EventsState } from "./types"
import { RootState } from "@/store/types"
import { EVENTS_GET_ALL, EVENTS_GET_ONE } from "@/store/actions/events";

export const getters: GetterTree<EventsState, RootState> = {
  [EVENTS_GET_ALL]: (state, getters: any) => {
    return (dateBegin?: Date, dateEnd?: Date, invert: boolean = false) => {
      return state.events.filter((event) => {
        /*
        const condition = (dateBegin == undefined || event.endTime > dateBegin) &&
          (dateEnd == undefined || event.beginTime < dateEnd);
        */

        const condition = (dateBegin == undefined || event.beginTime && event.beginTime > dateBegin) /* &&
          (dateEnd == undefined || event.endTime < dateEnd);*/

        if (invert) {
          return !condition;
        }
        else {
          return condition;
        }
      });
    }
  },
  [EVENTS_GET_ONE]: (state, getters: any) => {
    return (id: string) => {
      return state.events.find(v => v.id == id);
    }
  }
}