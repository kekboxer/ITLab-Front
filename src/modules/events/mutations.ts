import { MutationTree } from 'vuex';
import { Vue } from 'vue-property-decorator';

import {
  EventsState,
  Event,
  EVENTS_SET_ALL,
  EVENTS_SET_ONE,
  EVENTS_REMOVE_ONE
} from './types';

const setOneEvent = (events: Event[], event: Event) => {
  const currentEventIndex = events.findIndex((value) => {
    return value.id === event.id;
  });

  if (currentEventIndex === -1) {
    events.push(event);
  } else {
    Vue.set(
      events,
      currentEventIndex,
      Object.assign({}, events[currentEventIndex], event)
    );
  }
};

const sortEvents = (events: Event[]): Event[] => {
  return events.sort((a, b) => {
    if (a.beginTime && b.beginTime && a.beginTime < b.beginTime) {
      return 1;
    } else if (a.beginTime && b.beginTime && a.beginTime > b.beginTime) {
      return -1;
    } else {
      return 0;
    }
  });
};

export const mutations: MutationTree<EventsState> = {
  [EVENTS_SET_ALL]: (
    state,
    payload: Event[] | { events: Event[]; merge?: boolean }
  ) => {
    const events = payload instanceof Array ? payload : payload.events;
    const merge = payload instanceof Array ? false : payload.merge === true;

    if (merge) {
      events.forEach((event) => {
        setOneEvent(state.events, event);
      });
    } else {
      state.events = events;
    }

    state.events = sortEvents(state.events);
  },

  [EVENTS_SET_ONE]: (state, event: Event) => {
    setOneEvent(state.events, event);
  },

  [EVENTS_REMOVE_ONE]: (state, eventId: string) => {
    const eventIndex = state.events.findIndex((event) => event.id === eventId);
    if (eventIndex !== -1) {
      Vue.delete(state.events, eventIndex);
    }
  }
};
