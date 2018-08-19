import { GetterTree } from 'vuex';
import { RootState } from '@/store';

import { NotificationsState, NOTIFICATIONS_GET_ALL } from './types';

export const getters: GetterTree<NotificationsState, RootState> = {
  [NOTIFICATIONS_GET_ALL]: (state) => {
    return state.eventNotifications;
  }
};
