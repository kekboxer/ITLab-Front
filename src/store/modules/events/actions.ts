import { ActionTree } from "vuex"
import { RootState } from "@/store/types"
import moment from "moment-timezone";
import axios from "axios"

import {
  EventsState,
  Event,
  EventType,
  EVENT_TYPE_SEARCH,
  EVENTS_FETCH_ALL,
  EVENTS_FETCH_ONE,
  EVENT_COMMIT,
  EVENT_TYPE_COMMIT,
  EVENTS_SET_ALL,
  EVENTS_SET_ONE
} from "./types"


const DATETIME_FORMAT = "YYYY-MM-DDTHH:mm:ss";

const fixDates = (event: Event) => {
  if (event.beginTime) {
    event.beginTime = moment(event.beginTime, DATETIME_FORMAT + "Z").toDate();
  }
  
  if (event.shifts) {
    event.shifts.forEach(shift => {
      shift.beginTime = moment(shift.beginTime, DATETIME_FORMAT + "Z").toDate();
      shift.endTime = moment(shift.endTime, DATETIME_FORMAT + "Z").toDate();
    })
  }
}

const deepCopy = (obj: any): any => {
  let copy: any;

  if (null == obj || "object" != typeof obj) return obj;

  if (obj instanceof Date) {
    copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }

  if (obj instanceof Array) {
    copy = [];
    for (var i = 0, len = obj.length; i < len; i++) {
      copy[i] = deepCopy(obj[i]);
    }
    return copy;
  }

  if (obj instanceof Object) {
    copy = {};
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = deepCopy(obj[attr]);
    }
    return copy;
  }

  throw new Error("Unable to copy object! Its type isn't supported.");
};

export const actions: ActionTree<EventsState, RootState> = {
  [EVENT_TYPE_SEARCH]: ({ }, { match = "", all = false }: { match?: string, all?: boolean }) => {
    return new Promise((resolve, reject) => {
      axios.get(`eventType?match=${encodeURIComponent(match)}&all=${all}`).then(response => {
        const body = response && response.data;
        const data: EventType[] = body.data;

        resolve(data);
      }).catch(error => {
        console.log(EVENT_TYPE_SEARCH, error);
        reject(error);
      });
    });
  },

  [EVENTS_FETCH_ALL]: ({ commit }, range: { dateBegin: Date | undefined, dateEnd: Date | undefined } | undefined) => {
    return new Promise((resolve, reject) => {
      let url: string = "event/";
      if (range && (range.dateBegin || range.dateEnd)) {
        url += "?";
        if (range.dateBegin) url += `begin=${moment(range.dateBegin).utc().format(DATETIME_FORMAT)}`;
        if (range.dateBegin && range.dateEnd) url += "&";
        if (range.dateEnd) url += `end=${moment(range.dateEnd).utc().format(DATETIME_FORMAT)}`;
      }

      axios.get(url).then((response) => {
        const body = response && response.data
        const data: Event[] = body.data

        data.forEach(fixDates);

        commit(EVENTS_SET_ALL, data)
        resolve(data)
      }).catch(error => {
        console.log(EVENTS_FETCH_ALL, error)
        reject(error)
      })
    })
  },

  [EVENTS_FETCH_ONE]: ({ commit }, id: string) => {
    return new Promise((resolve, reject) => {
      axios.get("event/" + id).then((response) => {
        const body = response && response.data
        const data: Event = body.data

        fixDates(data);

        commit(EVENTS_SET_ONE, data)
        resolve(data)
      }).catch(error => {
        console.log(EVENTS_FETCH_ONE, error)
        reject(error)
      })
    })
  },

  [EVENT_COMMIT]: ({ commit }, event: Event) => {
    return new Promise((resolve, reject) => {
      const eventData = deepCopy(event);

      eventData.shifts.forEach((shift: any) => {
        if (shift.id == "") {
          delete shift.id;
        }

        shift.places.forEach((place: any) => {
          if (place.id == "") {
            delete place.id;
          }

          place.equipment.forEach((equipment: any, i: number, arr: any[]) => {
            arr[i] = {
              id: equipment.id,
              delete: equipment.delete
            };
          });

          const prepareParticipantData = (participant: any) => {
            return {
              id: participant.user.id,
              roleId: participant.role.id,
              delete: participant.delete
            };
          }

          place.participants.forEach(
            (participant: any, i: number, arr: any[]) => {
              arr[i] = prepareParticipantData(participant);
            }
          );

          place.invited.forEach(
            (participant: any, i: number, arr: any[]) => {
              arr[i] = prepareParticipantData(participant);
            }
          )
        });
      });

      const url = "event";

      let request = eventData.id == "" ?
        axios.post(url, eventData) : axios.put(url, eventData);

      request.then((response) => {
        const body = response && response.data
        const data: Event = body.data

        commit(EVENTS_SET_ONE, data)
        resolve(data)
      }).catch(error => {
        console.log(EVENT_COMMIT, error)
        reject(error)
      })
    })
  },

  [EVENT_TYPE_COMMIT]: ({ commit }, eventType: EventType) => {
    return new Promise((resolve, reject) => {
      const url = "eventType";

      const request = eventType.id === "" ?
        axios.post(url, eventType) : axios.put(url, eventType);

      request.then(response => {
        const body = response && response.data;
        const data: EventType = body.data;

        resolve(data);
      }).catch(error => {
        console.log(EVENT_TYPE_COMMIT, error);
        reject(error);
      });
    })
  }
}