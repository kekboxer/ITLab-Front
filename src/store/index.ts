import Vue from "vue"
import Vuex, { StoreOptions } from "vuex"
import { RootState } from "./types"

import { authorization } from "./modules/authorization"
import { profile } from "./modules/profile"
import { events } from "./modules/events"

Vue.use(Vuex)

const store: StoreOptions<RootState> = {
  state: {
  },
  modules: {
    authorization,
    profile,
    events
  }
}

export default new Vuex.Store<RootState>(store)