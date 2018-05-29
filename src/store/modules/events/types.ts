
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

export interface EventType {
  id: string,
  title: string,
  description: string
}

export const createDefaultEvent = (): Event => {
  const date = new Date();
  return {
    id: "",
    title: "",
    description: "",
    beginTime: date,
    endTime: new Date(date.getTime() + 2*60*60*1000),
    address: "пр. Вернадского, 78",
    neededParticipantsCount: 0,
    eventTypeId: "",
    equipmentIds: [],
    participantsIds: []
  }
}

export interface EventsState {
  events: Event[]
}