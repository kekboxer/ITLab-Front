import { GetterTree } from 'vuex';
import { RootState } from '@/store';

import {
  NotificationsState,
  NOTIFICATION_INVITATIONS_GET_ALL,
  NOTIFICATION_WISHES_GET_ALL,
  NOTIFICATIONS_GET_COUNT
} from './types';

export const getters: GetterTree<NotificationsState, RootState> = {
  [NOTIFICATION_INVITATIONS_GET_ALL]: (state) => {
    return state.eventInvitations;
  },

  [NOTIFICATION_WISHES_GET_ALL]: (state) => {
    return state.eventWishApplications;
  },

  [NOTIFICATIONS_GET_COUNT]: (state) => {
    return state.eventInvitations.length + state.eventWishApplications.length;
  }
};
