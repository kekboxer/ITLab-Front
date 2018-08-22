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

// Notification //
/////////////////

export class Notification {}

// EventInvitation //
////////////////////////////////

export interface EventInvitation extends Notification {
  id: string;
  title: string;
  eventType: EventType;
  beginTime: Date;
  placeId: string;
  shiftDurationInMinutes: number;
  role: EventUserRole;
}

export class EventInvitationDefault implements EventInvitation {
  public id: string = '';
  public title: string = '';
  public eventType: EventType = new EventTypeDefault();
  public beginTime = new Date(0);
  public placeId: string = '';
  public shiftDurationInMinutes: number = 0;
  public role: EventUserRole = new EventUserRoleDefault();
}

// EventApplication //
/////////////////////////////////

export interface EventApplication extends Notification {
  eventId: string;
  title: string;
}

// State //
//////////

export interface NotificationsState {
  eventInvitations: EventInvitation[];
}
