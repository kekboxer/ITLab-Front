import { ActionTree } from 'vuex';
import { RootState } from '@/store';
import moment from 'moment-timezone';
import axios from 'axios';

import { getResponseData } from '@/stuff';

import {
  NotificationsState,
  EventNotification,
  NOTIFICATION_ACCEPT,
  NOTIFICATION_REJECT,
  NOTIFICATIONS_FETCH,
  NOTIFICATIONS_SET_ALL,
  NOTIFICATION_REMOVE_ONE
} from './types';

const DATETIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss';

const fixDates = (event: EventNotification) => {
  if (event.beginTime) {
    event.beginTime = moment(event.beginTime, DATETIME_FORMAT + 'Z').toDate();
  }
};

export const actions: ActionTree<NotificationsState, RootState> = {
  [NOTIFICATION_ACCEPT]: ({ commit }, notification: EventNotification) => {
    return new Promise((resolve, reject) => {
      axios
        .post(`event/acceptinvite/${notification.placeId}`)
        .then((response) => {
          commit(NOTIFICATION_REMOVE_ONE, notification);
          resolve();
        })
        .catch((error) => {
          console.log(NOTIFICATION_ACCEPT, error);
          reject();
        });
    });
  },

  [NOTIFICATION_REJECT]: ({ commit }, notification: EventNotification) => {
    return new Promise((resolve, reject) => {
      commit(NOTIFICATION_REMOVE_ONE, notification);
      resolve();
    });
  },

  [NOTIFICATIONS_FETCH]: ({ commit }) => {
    return new Promise((resolve, reject) => {
      axios
        .get('event/invitations')
        .then((response) => getResponseData<EventNotification[]>(response))
        .then((eventNotifications) => {
          eventNotifications.forEach(fixDates);
          commit(NOTIFICATIONS_SET_ALL, eventNotifications);
          resolve(eventNotifications);
        })
        .catch((error) => {
          console.log(NOTIFICATIONS_FETCH, error);
          reject();
        });
    });
  }
};
