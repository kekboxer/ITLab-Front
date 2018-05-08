
export interface Event {
  id?: string
  beginTime?: Date
  endTime?: Date
  address?: string

  title?: string,
  description?: string,
  participantsNeeded?: number,
  participantCount?: number
}

export interface EventsState {
  events: Event[]
}