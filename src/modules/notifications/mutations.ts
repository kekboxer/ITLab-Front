import { MutationTree } from 'vuex';
import Vue from 'vue';

import {
  NotificationsState,
  EventNotification,
  NOTIFICATIONS_SET_ALL,
  NOTIFICATION_REMOVE_ONE
} from './types';

export const mutations: MutationTree<NotificationsState> = {
  [NOTIFICATIONS_SET_ALL]: (state, notifications: EventNotification[]) => {
    state.eventNotifications = notifications;
  },

  [NOTIFICATION_REMOVE_ONE]: (state, notification: EventNotification) => {
    const index = state.eventNotifications.findIndex((v) => v === notification);
    if (index !== -1) {
      Vue.delete(state.eventNotifications, index);
    }
  }
};
