import { ActionTree } from 'vuex';
import { RootState } from '@/store';
import axios from 'axios';

import { getResponseData } from '@/stuff';

import {
  IProjectState,
  IProject,
  PROJECT_SET_ONE,
  PROJECTS_FETCH_ALL,
  PROJECTS_SET_ALL,
  PROJECT_DELETE,
  PROJECT_REMOVE_ONE,
  PROJECT_FETCH_ONE,
  PROJECT_COMMIT,
  TAGS_FETCH,
  ITag
} from './types';

export const actions: ActionTree<IProjectState, RootState> = {
  [PROJECTS_FETCH_ALL]: ({ commit }) => {
    return new Promise((resolve, reject) => {
      axios
        .get('projects')
        .then((response) => getResponseData<IProject[]>(response))
        .then((projects) => {
          commit(PROJECTS_SET_ALL, projects);
          resolve(projects);
        })
        .catch((error) => {
          console.log(PROJECTS_FETCH_ALL, error);
          reject(error);
        });
    });
  },

  [PROJECT_FETCH_ONE]: ({ commit }, id: string) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`projects/${id}`)
        .then((response) => getResponseData<IProject>(response))
        .then((project) => {
          commit(PROJECT_SET_ONE, project);
          resolve(project);
        })
        .catch((error) => {
          console.log(PROJECT_FETCH_ONE, error);
          reject(error);
        });
    });
  },

  [PROJECT_DELETE]: ({ commit }, eventType: string | IProject) => {
    return new Promise((resolve, reject) => {
      const id = typeof eventType === 'string' ? eventType : eventType.id;
      axios
        .delete(`projects/${id}`)
        .then((response) => {
          if (response.status === 200 || response.status === 201 || response.status === 204) {
            commit(PROJECT_REMOVE_ONE, id);
            resolve();
          } else {
            reject();
          }
        })
        .catch((error) => {
          console.log(PROJECT_DELETE, error);
          reject(error);
        });
    });
  },

  [PROJECT_COMMIT]: ({ commit }, project: IProject) => {
    return new Promise((resolve, reject) => {

      const request =
        project.id === ''
          ? axios.post('projects', project)
          : axios.put(`projects/${project.id}`, project);

      request
        .then((response) => getResponseData<IProject>(response))
        .then((project) => {
          commit(PROJECT_SET_ONE, project);
          resolve(project);
        })
        .catch((error) => {
          console.log(PROJECT_COMMIT, error);
          reject(error);
        });
    });
  },

  [TAGS_FETCH]: ({ }, ) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`projects/tags`)
        .then((response) => getResponseData<ITag[]>(response))
        .then((tags) => {
          resolve(tags);
        })
        .catch((error) => {
          console.log(TAGS_FETCH, error);
          reject(error);
        });
    });
  }
};
