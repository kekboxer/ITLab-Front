import { MutationTree } from 'vuex';
import Vue from 'vue';

import {
  NotificationsState,
  EventInvitation,
  NOTIFICATIONS_SET_ALL,
  NOTIFICATION_REMOVE_ONE
} from './types';

export const mutations: MutationTree<NotificationsState> = {
  [NOTIFICATIONS_SET_ALL]: (state, notifications: EventInvitation[]) => {
    state.eventInvitations = notifications;
  },

  [NOTIFICATION_REMOVE_ONE]: (state, notification: EventInvitation) => {
    const index = state.eventInvitations.findIndex((v) => v === notification);
    if (index !== -1) {
      Vue.delete(state.eventInvitations, index);
    }
  }
};
