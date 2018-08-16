import { Equipment } from "@/store/modules/equipment";
import { User, UserDefault } from "@/store/modules/users";

// actions
export const EVENT_TYPE_SEARCH = "EVENT_TYPE_SEARCH"
export const EVENTS_FETCH_ALL = "EVENTS_FETCH_ALL"
export const EVENTS_FETCH_ONE = "EVENTS_FETCH_ONE"
export const EVENT_COMMIT = "EVENT_COMMIT"
export const EVENT_TYPE_COMMIT = "EVENT_TYPE_COMMIT"

// setters
export const EVENTS_SET_ALL = "EVENTS_SET_ALL"
export const EVENTS_SET_ONE = "EVENTS_SET_ONE"

// getters
export const EVENTS_GET_ALL = "EVENTS_GET_ALL"
export const EVENTS_GET_ONE = "EVENTS_GET_ONE"


// EventType //
//////////////

export interface EventType {
  id: string,
  title: string,
  description: string
}

export class EventTypeDefault implements EventType {
  id: string = ""
  title: string = ""
  description: string = ""
}

// EventUserRole //
//////////////////

export interface EventUserRole {
  id: string
  name: string

  normalizedName?: string
}

export class EventUserRoleDefault implements EventUserRole {
  id: string = ""
  name: string = ""
}

// EventParticipant //
/////////////////////

export interface EventParticipant {
  user: User
  role?: EventUserRole

  delete?: boolean
}

export class EventParticipantDefault implements EventParticipant {
  user: User = new UserDefault
}

// EventEquipment //
///////////////////

export interface EventEquipment extends Equipment {
  delete?: boolean
}

// EventPlace //
///////////////

export interface EventPlace {
  id: string
  targetParticipantsCount: number

  equipment: EventEquipment[]

  participants: EventParticipant[]
  invited: EventParticipant[]
  wishers: EventParticipant[]

  delete?: boolean
}

export class EventPlaceDefault implements EventPlace {
  id: string = ""
  targetParticipantsCount: number = 0

  equipment: EventEquipment[] = []

  participants: EventParticipant[] = []
  invited: EventParticipant[] = []
  wishers: EventParticipant[] = []
}

// EventShift //
///////////////

export interface EventShift {
  id: string
  beginTime: Date
  endTime: Date
  places: EventPlace[]

  delete?: boolean
}

export class EventShiftDefault implements EventShift {
  id: string = ""
  beginTime: Date = new Date(0)
  endTime: Date = new Date(0)
  places: EventPlace[] = [new EventPlaceDefault()]
}

// Event //
//////////

export interface Event {
  id: string
  title: string
  description: string
  address: string

  eventType?: EventType
  eventTypeId?: string

  // List data
  beginTime?: Date
  totalDurationInMinutes?: number

  targetParticipantsCount?: number
  currentParticipantsCount?: number

  // Shifts data
  shifts?: EventShift[]
}

export class EventDefault implements Event {
  id: string = ""
  title: string = ""
  description: string = ""
  address: string = ""

  shifts: EventShift[] = [new EventShiftDefault()]
}

// State //
//////////

export interface EventsState {
  events: Event[]
}