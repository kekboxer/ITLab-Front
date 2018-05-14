
export interface Event {
  id: string
  beginTime: Date
  endTime: Date
  address: string

  title?: string,
  description?: string,
  neededParticipantsCount?: number,
  participantCount?: number
}

export interface EventsState {
  events: Event[]
}