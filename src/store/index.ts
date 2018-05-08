import Vue from "vue"
import Vuex, { StoreOptions } from "vuex"
import { RootState } from "./types"

import { authorization } from "./modules/authorization"
import { events } from "./modules/events"

Vue.use(Vuex)

const store: StoreOptions<RootState> = {
  state: {
    version: "0.0.1"
  },
  modules: {
    authorization,
    events
  }
}

export default new Vuex.Store<RootState>(store)