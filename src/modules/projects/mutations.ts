import { MutationTree } from 'vuex';
import { Vue } from 'vue-property-decorator';

import { setOneElement } from '@/stuff';

import {
  IProjectState,
  IProject,
  PROJECTS_SET_ALL,
  PROJECT_REMOVE_ONE
} from './types';

export const mutations: MutationTree<IProjectState> = {
  [PROJECTS_SET_ALL]: (
    state,
    payload: IProject[] | { projects: IProject[]; merge?: boolean }
  ) => {
    const projects = payload instanceof Array ? payload : payload.projects;
    const merge = payload instanceof Array ? false : payload.merge === true;

    if (merge) {
      projects.forEach((e) => {
        setOneElement(state.projects, e);
      });
    } else {
      state.projects = projects;
    }
  },

  [PROJECT_REMOVE_ONE]: (state, projectId: string) => {
    const projectIndex = state.projects.findIndex(
      (project) => project.id === projectId
    );
    if (projectIndex !== -1) {
      Vue.delete(state.projects, projectIndex);
    }
  },
};
