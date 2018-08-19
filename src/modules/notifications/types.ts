import {
  EventType,
  EventUserRole,
  EventTypeDefault,
  EventUserRoleDefault
} from '@/modules/events';

// actions
export const NOTIFICATION_ACCEPT = 'NOTIFICATION_ACCEPT';
export const NOTIFICATION_REJECT = 'NOTIFICATION_REJECT';
export const NOTIFICATIONS_FETCH = 'NOTIFICATIONS_FETCH';

// setters
export const NOTIFICATIONS_SET_ALL = 'NOTIFICATIONS_SET_ALL';
export const NOTIFICATION_REMOVE_ONE = 'NOTIFICATION_REMOVE_ONE';

// getters
export const NOTIFICATIONS_GET_ALL = 'NOTIFICATIONS_GET_ALL';
export const NOTIFICATIONS_GET_COUNT = 'NOTIFICATIONS_GET_COUNT';

// EventNotification //
//////////////////////

export interface EventNotification {
  id: string;
  title: string;
  eventType: EventType;
  beginTime: Date;
  placeId: string;
  shiftDurationInMinutes: number;
  role: EventUserRole;
}

export class EventNotificationDefault implements EventNotification {
  public id: string = '';
  public title: string = '';
  public eventType: EventType = new EventTypeDefault();
  public beginTime = new Date(0);
  public placeId: string = '';
  public shiftDurationInMinutes: number = 0;
  public role: EventUserRole = new EventUserRoleDefault();
}

// State //
//////////

export interface NotificationsState {
  eventNotifications: EventNotification[];
}
