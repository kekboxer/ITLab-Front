import Vue from "vue"
import Vuex, { StoreOptions } from "vuex"
import { RootState } from "./types"

import { authorization } from "./modules/authorization"
import { profile } from "./modules/profile"
import { events } from "./modules/events"
import { layout } from "./modules/layout"
import { equipment } from "./modules/equipment"

import { SYSTEM_NAME } from "./actions/global"

Vue.use(Vuex)

const state: RootState = {
  name: "ITlab"
}

const store: StoreOptions<RootState> = {
  modules: {
    authorization,
    profile,
    events,
    equipment,
    layout
  },
  state,

  getters: {
    [SYSTEM_NAME]: (state) => {
      return state.name
    }
  }
}

export default new Vuex.Store<RootState>(store)