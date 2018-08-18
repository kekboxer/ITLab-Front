import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { RootState, SYSTEM_NAME } from './types';

import { equipment } from './modules/equipment';
import { events } from './modules/events';
import { layout } from './modules/layout';
import { profile } from './modules/profile';
import { users } from './modules/users';

export * from './types';

Vue.use(Vuex);

const state: RootState = {
  name: 'ITlab'
};

const store: StoreOptions<RootState> = {
  modules: {
    equipment,
    events,
    layout,
    profile,
    users
  },
  state,

  getters: {
    [SYSTEM_NAME]: (state) => {
      return state.name;
    }
  }
};

export default new Vuex.Store<RootState>(store);
