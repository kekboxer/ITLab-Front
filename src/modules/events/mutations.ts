import { MutationTree } from 'vuex';
import { Vue } from 'vue-property-decorator';

import { setOneElement } from '@/stuff';

import {
  EventsState,
  Event,
  EventType,
  EventRole,
  EVENTS_SET_ALL,
  EVENTS_SET_ONE,
  EVENTS_REMOVE_ONE,
  EVENT_TYPES_SET_ALL,
  EVENT_TYPES_SET_ONE,
  EVENT_TYPES_REMOVE_ONE,
  EVENT_ROLES_SET_ALL,
  EVENT_ROLES_SET_ONE,
  EVENT_ROLES_REMOVE_ONE
} from './types';

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
        setOneElement(state.events, event);
      });
    } else {
      state.events = events;
    }

    state.events = sortEvents(state.events);
  },

  [EVENTS_SET_ONE]: (state, event: Event) => {
    setOneElement(state.events, event);
  },

  [EVENTS_REMOVE_ONE]: (state, event: string | Event) => {
    const id = typeof event === 'string' ? event : event.id;
    const eventIndex = state.events.findIndex((event) => event.id === id);
    if (eventIndex !== -1) {
      Vue.delete(state.events, eventIndex);
    }
  },

  [EVENT_TYPES_SET_ALL]: (
    state,
    payload: EventType[] | { eventTypes: EventType[]; merge?: boolean }
  ) => {
    const eventTypes = payload instanceof Array ? payload : payload.eventTypes;
    const merge = payload instanceof Array ? false : payload.merge === true;

    if (merge) {
      eventTypes.forEach((eventType) => {
        setOneElement(state.eventTypes, eventType);
      });
    } else {
      state.eventTypes = eventTypes;
    }
  },

  [EVENT_TYPES_SET_ONE]: (state, eventType: EventType) => {
    setOneElement(state.eventTypes, eventType);
  },

  [EVENT_TYPES_REMOVE_ONE]: (state, eventType: string | EventType) => {
    const id = typeof eventType === 'string' ? eventType : eventType.id;
    const eventTypeIndex = state.eventTypes.findIndex(
      (eventType) => eventType.id === id
    );
    if (eventTypeIndex !== -1) {
      Vue.delete(state.eventTypes, eventTypeIndex);
    }
  },

  [EVENT_ROLES_SET_ALL]: (
    state,
    payload: EventRole[] | { eventRoles: EventRole[]; merge?: boolean }
  ) => {
    const eventRoles = payload instanceof Array ? payload : payload.eventRoles;
    const merge = payload instanceof Array ? false : payload.merge === true;

    if (merge) {
      eventRoles.forEach((eventRole) => {
        setOneElement(state.eventRoles, eventRole);
      });
    } else {
      state.eventRoles = eventRoles;
    }
  },

  [EVENT_ROLES_SET_ONE]: (state, eventRole: EventRole) => {
    setOneElement(state.eventRoles, eventRole);
  },

  [EVENT_ROLES_REMOVE_ONE]: (state, eventRole: string | EventRole) => {
    const id = typeof eventRole === 'string' ? eventRole : eventRole.id;
    const eventRoleIndex = state.eventRoles.findIndex(
      (eventRole) => eventRole.id === id
    );
    if (eventRoleIndex !== -1) {
      Vue.delete(state.eventRoles, eventRoleIndex);
    }
  }
};
