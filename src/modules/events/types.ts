import { Equipment } from '@/modules/equipment';
import { User, UserDefault } from '@/modules/users';
import moment from 'moment-timezone';

// actions
export const EVENT_TYPE_SEARCH = 'EVENT_TYPE_SEARCH';
export const EVENTS_FETCH_ALL = 'EVENTS_FETCH_ALL';
export const EVENTS_FETCH_ONE = 'EVENTS_FETCH_ONE';
export const EVENT_COMMIT = 'EVENT_COMMIT';
export const EVENT_TYPE_COMMIT = 'EVENT_TYPE_COMMIT';
export const EVENT_DELETE = 'EVENT_DELETE';

// setters
export const EVENTS_SET_ALL = 'EVENTS_SET_ALL';
export const EVENTS_SET_ONE = 'EVENTS_SET_ONE';
export const EVENTS_REMOVE_ONE = 'EVENTS_REMOVE_ONE';

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
  role: EventUserRole;

  delete?: boolean;
  new?: boolean;
}

export class EventParticipantDefault implements EventParticipant {
  public user: User = new UserDefault();
  public role: EventUserRole = new EventUserRoleDefault();
}

// EventEquipment //
///////////////////

export interface EventEquipment extends Equipment {
  delete?: boolean;
  new?: boolean;
}

// EventPlace //
///////////////

export interface EventPlace {
  id: string;
  targetParticipantsCount: number;
  description: string;

  equipment: EventEquipment[];

  participants: EventParticipant[];
  invited: EventParticipant[];
  wishers: EventParticipant[];

  delete?: boolean;
  new?: boolean;
}

export class EventPlaceDefault implements EventPlace {
  public id: string = '';
  public targetParticipantsCount: number = 0;
  public description: string = '';

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
  description: string;
  places: EventPlace[];

  delete?: boolean;
  new?: boolean;
}

const getDefaultDate = () => {
  return moment(moment.now())
    .startOf('hour')
    .toDate();
};

export class EventShiftDefault implements EventShift {
  public id: string = '';
  public beginTime: Date = getDefaultDate();
  public endTime: Date = getDefaultDate();
  public description: string = '';
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
