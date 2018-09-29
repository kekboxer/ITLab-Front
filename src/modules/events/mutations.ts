import { MutationTree } from 'vuex';
import { Vue } from 'vue-property-decorator';

import { setOneElement } from '@/stuff';

import {
  IEventsState,
  IEvent,
  IEventType,
  IEventRole,
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

export const mutations: MutationTree<IEventsState> = {
  [EVENTS_SET_ALL]: (
    state,
    payload: IEvent[] | { events: IEvent[]; merge?: boolean }
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
  },

  [EVENTS_SET_ONE]: (state, event: IEvent) => {
    setOneElement(state.events, event);
  },

  [EVENTS_REMOVE_ONE]: (state, event: string | IEvent) => {
    const id = typeof event === 'string' ? event : event.id;
    const eventIndex = state.events.findIndex((event) => event.id === id);
    if (eventIndex !== -1) {
      Vue.delete(state.events, eventIndex);
    }
  },

  [EVENT_TYPES_SET_ALL]: (
    state,
    payload: IEventType[] | { eventTypes: IEventType[]; merge?: boolean }
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

  [EVENT_TYPES_SET_ONE]: (state, eventType: IEventType) => {
    setOneElement(state.eventTypes, eventType);
  },

  [EVENT_TYPES_REMOVE_ONE]: (state, eventType: string | IEventType) => {
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
    payload: IEventRole[] | { eventRoles: IEventRole[]; merge?: boolean }
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

  [EVENT_ROLES_SET_ONE]: (state, eventRole: IEventRole) => {
    setOneElement(state.eventRoles, eventRole);
  },

  [EVENT_ROLES_REMOVE_ONE]: (state, eventRole: string | IEventRole) => {
    const id = typeof eventRole === 'string' ? eventRole : eventRole.id;
    const eventRoleIndex = state.eventRoles.findIndex(
      (eventRole) => eventRole.id === id
    );
    if (eventRoleIndex !== -1) {
      Vue.delete(state.eventRoles, eventRoleIndex);
    }
  }
};
