
export interface Event {
  id: string
  title: string,
  description: string,

  beginTime: Date
  endTime: Date
  address: string

  neededParticipantsCount: number,
  participantCount?: number, //TODO: remove it
  
  eventTypeId: string,
  equipmentIds: string[],
  participantsIds: string[]
}

export const createDefaultEvent = (): Event => {
  return {
    id: "",
    title: "",
    description: "",
    beginTime: new Date(),
    endTime: new Date(),
    address: "",
    neededParticipantsCount: 0,
    eventTypeId: "",
    equipmentIds: [],
    participantsIds: []
  }
}

export interface EventsState {
  events: Event[]
}