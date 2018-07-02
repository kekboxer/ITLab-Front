
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

// Event //
//////////

export interface Event {
  id: string
  title: string,
  description: string,

  beginTime: Date
  endTime: Date
  address: string

  neededParticipantsCount: number,
  participantCount?: number, //TODO: remove it
  
  eventTypeId?: string,
  eventType? : EventType

  equipmentIds: string[],
  participantsIds: string[]
}

export class EventDefault implements Event {
  id: string = ""
  title: string = ""
  description: string = ""
  beginTime: Date = new Date(0)
  endTime: Date = new Date(0)
  address: string = ""

  neededParticipantsCount: number = 0

  equipmentIds: string[] = []
  participantsIds: string[] = []
}

// State //
//////////

export interface EventsState {
  events: Event[]
}