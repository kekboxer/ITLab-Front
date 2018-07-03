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
  event.beginTime = moment(event.beginTime, DATETIME_FORMAT + "Z").toDate();
  event.endTime = moment(event.endTime, DATETIME_FORMAT + "Z").toDate();
}

export const actions: ActionTree<EventsState, RootState> = {
  [EVENTS_FETCH_ALL]: ({ commit, dispatch }, dateBegin?: Date, dateEnd?: Date) => {
    return new Promise((resolve, reject) => {
      let url: string = "event/";
      if (dateBegin || dateEnd) {
        url += "?";
        if (dateBegin) url += `begin=${moment(dateBegin).utc().format(DATETIME_FORMAT)}`;
        if (dateBegin && dateEnd) url += "&";
        if (dateEnd) url += `end=${moment(dateEnd).utc().format(DATETIME_FORMAT)}`;
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