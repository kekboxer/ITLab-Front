import { MutationTree } from 'vuex';
import Vue from 'vue';

import {
  NotificationsState,
  Invitation,
  Wish,
  NOTIFICATION_INVITATIONS_SET_ALL,
  NOTIFICATION_INVITATIONS_REMOVE_ONE,
  NOTIFICATION_WISHES_SET_ALL,
  NOTIFICATION_WISHES_REMOVE_ONE
} from './types';

export const mutations: MutationTree<NotificationsState> = {
  [NOTIFICATION_INVITATIONS_SET_ALL]: (state, notifications: Invitation[]) => {
    state.eventInvitations = notifications;
  },

  [NOTIFICATION_INVITATIONS_REMOVE_ONE]: (state, notification: Invitation) => {
    const index = state.eventInvitations.findIndex((v) => v === notification);
    if (index !== -1) {
      Vue.delete(state.eventInvitations, index);
    }
  },

  [NOTIFICATION_WISHES_SET_ALL]: (state, wishApplications: Wish[]) => {
    state.eventWishApplications = wishApplications;
  },

  [NOTIFICATION_WISHES_REMOVE_ONE]: (state, wishApplication: Wish) => {
    const index = state.eventWishApplications.findIndex(
      (v) => v === wishApplication
    );
    if (index !== -1) {
      Vue.delete(state.eventWishApplications, index);
    }
  }
};
