import { Equipment } from '@/modules/equipment';
import { User, UserDefault } from '@/modules/users';

// actions
export const EVENT_TYPE_SEARCH = 'EVENT_TYPE_SEARCH';
export const EVENTS_FETCH_ALL = 'EVENTS_FETCH_ALL';
export const EVENTS_FETCH_ONE = 'EVENTS_FETCH_ONE';
export const EVENT_COMMIT = 'EVENT_COMMIT';
export const EVENT_TYPE_COMMIT = 'EVENT_TYPE_COMMIT';

// setters
export const EVENTS_SET_ALL = 'EVENTS_SET_ALL';
export const EVENTS_SET_ONE = 'EVENTS_SET_ONE';

// getters
export const EVENTS_GET_ALL = 'EVENTS_GET_ALL';
export const EVENTS_GET_ONE = 'EVENTS_GET_ONE';

// EventType //
//////////////

export interface EventType {
  id: string;
  title: string;
  description: string;
}

export class EventTypeDefault implements EventType {
  public id: string = '';
  public title: string = '';
  public description: string = '';
}

// EventUserRole //
//////////////////

export interface EventUserRole {
  id: string;
  name: string;

  normalizedName?: string;
}

export class EventUserRoleDefault implements EventUserRole {
  public id: string = '';
  public name: string = '';
}

// EventParticipant //
/////////////////////

export interface EventParticipant {
  user: User;
  role?: EventUserRole;

  delete?: boolean;
}

export class EventParticipantDefault implements EventParticipant {
  public user: User = new UserDefault();
}

// EventEquipment //
///////////////////

export interface EventEquipment extends Equipment {
  delete?: boolean;
}

// EventPlace //
///////////////

export interface EventPlace {
  id: string;
  targetParticipantsCount: number;

  equipment: EventEquipment[];

  participants: EventParticipant[];
  invited: EventParticipant[];
  wishers: EventParticipant[];

  delete?: boolean;
}

export class EventPlaceDefault implements EventPlace {
  public id: string = '';
  public targetParticipantsCount: number = 0;

  public equipment: EventEquipment[] = [];

  public participants: EventParticipant[] = [];
  public invited: EventParticipant[] = [];
  public wishers: EventParticipant[] = [];
}

// EventShift //
///////////////

export interface EventShift {
  id: string;
  beginTime: Date;
  endTime: Date;
  places: EventPlace[];

  delete?: boolean;
}

export class EventShiftDefault implements EventShift {
  public id: string = '';
  public beginTime: Date = new Date(0);
  public endTime: Date = new Date(0);
  public places: EventPlace[] = [new EventPlaceDefault()];
}

// Event //
//////////

export interface Event {
  id: string;
  title: string;
  description: string;
  address: string;

  eventType?: EventType;
  eventTypeId?: string;

  // List data
  beginTime?: Date;
  totalDurationInMinutes?: number;

  targetParticipantsCount?: number;
  currentParticipantsCount?: number;
  participating?: boolean;

  // Shifts data
  shifts?: EventShift[];
}

export class EventDefault implements Event {
  public id: string = '';
  public title: string = '';
  public description: string = '';
  public address: string = '';

  public shifts: EventShift[] = [new EventShiftDefault()];
}

// State //
//////////

export interface EventsState {
  events: Event[];
}
