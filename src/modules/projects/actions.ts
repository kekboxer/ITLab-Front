import { ActionTree } from 'vuex';
import { RootState } from '@/store';
import axios from 'axios';

import { getResponseData } from '@/stuff';

import {
    IProjectState,
    IProject,
    PROJECTS_FETCH_ALL,
    PROJECTS_SET_ALL,
    PROJECT_DELETE,
    PROJECT_REMOVE_ONE
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
      }
};
