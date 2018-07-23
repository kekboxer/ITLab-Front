import { Vue } from "vue-property-decorator";
import { MutationTree } from "vuex"
import { EventsState, Event } from "./types"
import { EVENTS_SET_ALL, EVENTS_SET_ONE } from "@/store/actions/events";

const setOneEvent = (events: Event[], event: Event) =>{
  const currentEventIndex = events.findIndex((value) => {
    return value.id == event.id
  })
 
  if (currentEventIndex == -1) {
    events.push(event);
  } else {
    Vue.set(events, currentEventIndex, Object.assign({}, events[currentEventIndex], event));
  }
}

export const mutations: MutationTree<EventsState> = {
  [EVENTS_SET_ALL]: (state, events: Event[], merge: boolean = true) => {
    if (merge) {
      events.forEach(event => {
        setOneEvent(state.events, event);
      });
    }
    else {
      state.events = events;
    }

    state.events = state.events.sort((a, b) => {
      if (a.beginTime && b.beginTime && a.beginTime < b.beginTime) {
        return 1
      }
      else if (a.beginTime && b.beginTime && a.beginTime > b.beginTime) {
        return -1
      }
      else {
        return 0
      }
    })
  },

  [EVENTS_SET_ONE]: (state, event: Event) => {
    setOneEvent(state.events, event);
  }
}