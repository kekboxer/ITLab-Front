import { IEquipment } from '@/modules/equipment';
import { IUser, UserDefault } from '@/modules/users';
import moment from 'moment-timezone';

// actions
export const EVENTS_FETCH_ALL = 'EVENTS_FETCH_ALL';
export const EVENTS_FETCH_ONE = 'EVENTS_FETCH_ONE';
export const EVENT_COMMIT = 'EVENT_COMMIT';
export const EVENT_DELETE = 'EVENT_DELETE';

export const EVENT_TYPE_SEARCH = 'EVENT_TYPE_SEARCH';
export const EVENT_TYPES_FETCH_ALL = 'EVENT_TYPES_FETCH_ALL';
export const EVENT_TYPES_FETCH_ONE = 'EVENT_TYPES_FETCH_ONE';
export const EVENT_TYPE_COMMIT = 'EVENT_TYPE_COMMIT';
export const EVENT_TYPE_DELETE = 'EVENT_TYPE_DELETE';

export const EVENT_ROLES_FETCH_ALL = 'EVENT_ROLES_FETCH_ALL';
export const EVENT_ROLE_COMMIT = 'EVENT_ROLE_COMMIT';
export const EVENT_ROLE_DELETE = 'EVENT_ROLE_DELETE';

// setters
export const EVENTS_SET_ALL = 'EVENTS_SET_ALL';
export const EVENTS_SET_ONE = 'EVENTS_SET_ONE';
export const EVENTS_REMOVE_ONE = 'EVENTS_REMOVE_ONE';

export const EVENT_TYPES_SET_ALL = 'EVENT_TYPES_SET_ALL';
export const EVENT_TYPES_SET_ONE = 'EVENT_TYPES_SET_ONE';
export const EVENT_TYPES_REMOVE_ONE = 'EVENT_TYPES_REMOVE_ONE';

export const EVENT_ROLES_SET_ALL = 'EVENT_ROLES_SET_ALL';
export const EVENT_ROLES_SET_ONE = 'EVENT_ROLES_SET_ONE';
export const EVENT_ROLES_REMOVE_ONE = 'EVENT_ROLES_REMOVE_ONE';

// getters
export const EVENTS_GET_ALL = 'EVENTS_GET_ALL';
export const EVENTS_GET_ONE = 'EVENTS_GET_ONE';

export const EVENT_TYPES_GET_ALL = 'EVENT_TYPES_GET_ALL';
export const EVENT_TYPES_GET_ONE = 'EVENT_TYPES_GET_ONE';

export const EVENT_ROLES_GET_ALL = 'EVENT_ROLES_GET_ALL';
export const EVENT_ROLES_GET_ONE = 'EVENT_ROLES_GET_ONE';

// EventType //
//////////////

export class EventTypeDefault {
  public id: string = '';
  public title: string = '';
  public description: string = '';
}

export interface IEventType extends EventTypeDefault {}

// EventRole //
//////////////

export class EventRoleDefault {
  public id: string = '';
  public title: string = '';
  public description: string = '';
}

export interface IEventRole extends EventRoleDefault {}

// EventParticipant //
/////////////////////

export class EventParticipantDefault {
  public user: IUser = new UserDefault();
  public eventRole: IEventRole = new EventRoleDefault();

  public delete?: boolean;
  public new?: boolean;
}

export interface IEventParticipant extends EventParticipantDefault {}

// EventEquipment //
///////////////////

export interface IEventEquipment extends IEquipment {
  delete?: boolean;
  new?: boolean;
}

// EventPlace //
///////////////

export class EventPlaceDefault {
  public id: string = '';
  public targetParticipantsCount: number = 0;
  public description: string = '';

  public equipment: IEventEquipment[] = [];

  public participants: IEventParticipant[] = [];
  public invited: IEventParticipant[] = [];
  public wishers: IEventParticipant[] = [];

  public delete?: boolean;
  public new?: boolean;

  public collapsed?: boolean;
}

export interface IEventPlace extends EventPlaceDefault {}

// EventShift //
///////////////

const getDefaultDate = () => {
  return moment(moment.now())
    .startOf('hour')
    .toDate();
};

export class EventShiftDefault {
  public id: string = '';
  public beginTime: Date = getDefaultDate();
  public endTime: Date = getDefaultDate();
  public description: string = '';
  public places: IEventPlace[] = [new EventPlaceDefault()];

  public delete?: boolean;
  public new?: boolean;

  public collapsed?: boolean;
}

export interface IEventShift extends EventShiftDefault {}

// Event //
//////////

export class EventDefault {
  public id: string = '';
  public title: string = '';
  public description: string = '';
  public address: string = '';
  public eventType?: IEventType;

  // List data
  public beginTime?: Date;
  public endTime?: Date;

  public targetParticipantsCount?: number;
  public currentParticipantsCount?: number;
  public participating?: boolean;

  // Shifts data
  public shifts: IEventShift[] = [new EventShiftDefault()];
}

export interface IEvent extends EventDefault {}

// State //
//////////

export interface IEventsState {
  events: IEvent[];
  eventTypes: IEventType[];
  eventRoles: IEventRole[];
}

// Usefull stuff //
//////////////////

export const cloneEventPlace = (
  place: IEventPlace,
  {
    cloneEquipment,
    cloneParticipants
  }: {
    cloneEquipment: boolean;
    cloneParticipants: boolean;
  }
): IEventPlace => {
  const result: IEventPlace = new EventPlaceDefault();

  result.new = true;
  result.targetParticipantsCount = place.targetParticipantsCount;
  result.description = place.description;

  if (cloneEquipment) {
    result.equipment = result.equipment.reduce(
      (equipment, currentEquipment) => {
        if (currentEquipment.delete === true) {
          return equipment;
        } else {
          const newEquipment: IEventEquipment = Object.assign(
            {},
            currentEquipment
          );
          newEquipment.new = true;

          return equipment.concat(newEquipment);
        }
      },
      new Array<IEquipment>()
    );
  }

  if (cloneParticipants) {
    const participantsReducer = (
      participants: IEventParticipant[],
      currentParticipant: IEventParticipant
    ) => {
      if (currentParticipant.delete === true) {
        return participants;
      } else {
        const newParticipant: IEventParticipant = Object.assign(
          {},
          currentParticipant
        );
        newParticipant.new = true;

        return participants.concat(newParticipant);
      }
    };

    result.invited = place.participants
      .reduce(participantsReducer, new Array<IEventParticipant>())
      .concat(
        place.invited.reduce(
          participantsReducer,
          new Array<IEventParticipant>()
        )
      );
  }

  return result;
};
