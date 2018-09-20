import {
  EventParticipant,
  EventType,
  EventTypeDefault,
  EventRole,
  EventRoleDefault
} from '@/modules/events';
import { User } from '@/modules/users';

// actions
export const NOTIFICATION_INVITATION_ACCEPT = 'NOTIFICATION_INVITATION_ACCEPT';
export const NOTIFICATION_INVITATION_REJECT = 'NOTIFICATION_INVITATION_REJECT';
export const NOTIFICATION_INVITATIONS_FETCH = 'NOTIFICATION_INVITATIONS_FETCH';

export const NOTIFICATION_WISH_ACCEPT = 'NOTIFICATION_WISH_ACCEPT';
export const NOTIFICATION_WISH_REJECT = 'NOTIFICATION_WISH_REJECT';
export const NOTIFICATION_WISHES_FETCH = 'NOTIFICATION_WISHES_FETCH';

export const NOTIFICATIONS_FETCH = 'NOTIFICATIONS_FETCH';

// setters
export const NOTIFICATION_INVITATIONS_SET_ALL =
  'NOTIFICATION_INVITATIONS_SET_ALL';
export const NOTIFICATION_INVITATIONS_REMOVE_ONE =
  'NOTIFICATION_INVITATIONS_REMOVE_ONE';

export const NOTIFICATION_WISHES_SET_ALL = 'NOTIFICATION_WISHES_SET_ALL';
export const NOTIFICATION_WISHES_REMOVE_ONE = 'NOTIFICATION_WISHES_REMOVE_ONE';

// getters
export const NOTIFICATION_INVITATIONS_GET_ALL =
  'NOTIFICATION_INVITATIONS_GET_ALL';
export const NOTIFICATION_WISHES_GET_ALL = 'NOTIFICATION_WISHES_GET_ALL';
export const NOTIFICATIONS_GET_COUNT = 'NOTIFICATIONS_GET_COUNT';

// EventNotification //
//////////////////////

export class EventNotification {
  public id: string = '';
  public title: string = '';
  public eventType: EventType = new EventTypeDefault();
  public beginTime: Date = new Date(0);
  public placeId: string = '';
  public creationTime: Date = new Date(0);
  public role: EventRole = new EventRoleDefault();
}

// Invitation //
///////////////

export interface Invitation extends EventNotification {
  shiftDurationInMinutes: number;
}

// Wish //
/////////

export interface Wish extends EventNotification {
  currentParticipantsCount: number;
  targetParticipantsCount: number;
  user: User;
}

// State //
//////////

export interface NotificationsState {
  eventInvitations: Invitation[];
  eventWishApplications: Wish[];
}
