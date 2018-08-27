import {
  EventType,
  EventUserRole,
  EventTypeDefault,
  EventUserRoleDefault,
  EventParticipant
} from '@/modules/events';
import { User } from '@/modules/users';

// actions
export const NOTIFICATION_INVITATION_ACCEPT = 'NOTIFICATION_INVITATION_ACCEPT';
export const NOTIFICATION_INVITATION_REJECT = 'NOTIFICATION_INVITATION_REJECT';
export const NOTIFICATION_INVITATIONS_FETCH = 'NOTIFICATION_INVITATIONS_FETCH';

export const NOTIFICATION_WISH_ACCEPT = 'NOTIFICATION_WISH_ACCEPT';
export const NOTIFICATION_WISH_REJECT = 'NOTIFICATION_WISH_REJECT';
export const NOTIFICATION_WISHES_FETCH = 'NOTIFICATION_WISHES_FETCH';

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
  createTime: Date;
}

export class EventInvitationDefault implements EventInvitation {
  public id: string = '';
  public title: string = '';
  public eventType: EventType = new EventTypeDefault();
  public beginTime = new Date(0);
  public placeId: string = '';
  public shiftDurationInMinutes: number = 0;
  public role: EventUserRole = new EventUserRoleDefault();
  public createTime: Date = new Date(0);
}

// Wish //
/////////

export interface WishApplication extends Notification {
  id: string;
  title: string;
  eventType: EventType;
  beginTime: Date;
  placeId: string;
  wish: {
    user: User;
    role: EventUserRole;
    createTime: Date;
  };
}

// State //
//////////

export interface NotificationsState {
  eventInvitations: EventInvitation[];
  eventWishApplications: WishApplication[];
}
