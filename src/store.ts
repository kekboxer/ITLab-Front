import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';

import { equipment } from '@/modules/equipment';
import { events } from '@/modules/events';
import { layout } from '@/modules/layout';
import { profile } from '@/modules/profile';
import { users } from '@/modules/users';
import { notifications } from '@/modules/notifications';
import { projects } from '@/modules/projects';
import { salary } from '@/modules/salary';

Vue.use(Vuex);

export class RootState {}

const store: StoreOptions<RootState> = {
  modules: {
    equipment,
    events,
    layout,
    profile,
    users,
    notifications,
    projects,
    salary
  }
};

export default new Vuex.Store<RootState>(store);
