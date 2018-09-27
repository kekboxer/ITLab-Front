import { MutationTree } from 'vuex';
import Vue from 'vue';

import {
  INotificationsState,
  IInvitationNotification,
  IWishNotification,
  NOTIFICATION_INVITATIONS_SET_ALL,
  NOTIFICATION_INVITATIONS_REMOVE_ONE,
  NOTIFICATION_WISHES_SET_ALL,
  NOTIFICATION_WISHES_REMOVE_ONE
} from './types';

export const mutations: MutationTree<INotificationsState> = {
  [NOTIFICATION_INVITATIONS_SET_ALL]: (
    state,
    notifications: IInvitationNotification[]
  ) => {
    state.eventInvitations = notifications;
  },

  [NOTIFICATION_INVITATIONS_REMOVE_ONE]: (
    state,
    notification: IInvitationNotification
  ) => {
    const index = state.eventInvitations.findIndex((v) => v === notification);
    if (index !== -1) {
      Vue.delete(state.eventInvitations, index);
    }
  },

  [NOTIFICATION_WISHES_SET_ALL]: (
    state,
    notifications: IWishNotification[]
  ) => {
    state.eventWishApplications = notifications;
  },

  [NOTIFICATION_WISHES_REMOVE_ONE]: (
    state,
    notification: IWishNotification
  ) => {
    const index = state.eventWishApplications.findIndex(
      (v) => v === notification
    );
    if (index !== -1) {
      Vue.delete(state.eventWishApplications, index);
    }
  }
};
