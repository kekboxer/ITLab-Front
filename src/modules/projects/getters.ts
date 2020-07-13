import { GetterTree } from 'vuex';
import { RootState } from '@/store';

import {
  IProjectState,
  PROJECTS_GET_ALL
} from './types';

export const getters: GetterTree<IProjectState, RootState> = {
  [PROJECTS_GET_ALL]: (state) => {
    return state.projects;
  }
};
