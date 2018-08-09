import { Equipment, EquipmentDefault } from "@/store/modules/equipment/types";
import { User, UserDefault } from "@/store/modules/profile/types";

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
  role: EventUserRole

  delete?: boolean
}

export class EventParticipantDefault implements EventParticipant {
  user: User = new UserDefault
  role: EventUserRole = new EventUserRoleDefault
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

  delete?: boolean
}

export class EventPlaceDefault implements EventPlace {
  id: string = ""
  targetParticipantsCount: number = 0

  equipment: EventEquipment[] = []
  participants: EventParticipant[] = []
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
  сompleteness?: number
  totalDurationInMinutes?: number

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