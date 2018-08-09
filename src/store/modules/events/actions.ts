import { ActionTree } from "vuex"
import axios from "axios"
import { EventsState, Event } from "./types"
import { RootState } from "@/store/types"
import {
  EVENTS_FETCH_ALL, EVENTS_FETCH_ONE, EVENTS_COMMIT_ONE, EVENTS_SET_ALL, EVENTS_SET_ONE
} from "@/store/actions/events";

import moment from "moment-timezone";

const DATETIME_FORMAT = "YYYY-MM-DDTHH:mm:ss";

const fixDates = (event: Event) => {
  if (event.shifts) {
    event.shifts.forEach(shift => {
      shift.beginTime = moment(shift.beginTime, DATETIME_FORMAT + "Z").toDate();
      shift.endTime = moment(shift.endTime, DATETIME_FORMAT + "Z").toDate();
    })
  }
}

export const actions: ActionTree<EventsState, RootState> = {
  [EVENTS_FETCH_ALL]: ({ commit, dispatch }, range: { dateBegin: Date | undefined, dateEnd: Date | undefined } | undefined) => {
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
      }).catch((error) => {
        console.log(error)
        reject(error)
      })
    })
  },

  [EVENTS_FETCH_ONE]: ({ commit, dispatch }, id: string) => {
    return new Promise((resolve, reject) => {
      axios.get("event/" + id).then((response) => {
        const body = response && response.data
        const data: Event = body.data

        fixDates(data);

        commit(EVENTS_SET_ONE, data)
        resolve(data)
      }).catch((error) => {
        console.log(error)
        reject(error)
      })
    })
  },

  [EVENTS_COMMIT_ONE]: ({ commit, dispatch }, event: Event) => {
    return new Promise((resolve, reject) => {
      let request = event.id == "" ? axios.post("event", event) : axios.put("event", event);
      request.then((response) => {
        const body = response && response.data
        const data: Event = body.data

        commit(EVENTS_SET_ONE, data)
        resolve(data)
      }).catch((error) => {
        console.log(error)
        reject(error)
      })
    })
  }
}