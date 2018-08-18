import { ActionTree } from 'vuex';
import { RootState } from '@/store/types';
import axios from 'axios';

import {
  EquipmentState,
  Equipment,
  EquipmentType,
  EQUIPMENT_SEARCH,
  EQUIPMENT_TYPE_SEARCH,
  EQUIPMENT_FETCH_ALL,
  EQUIPMENT_FETCH_ONE,
  EQUIPMENT_COMMIT,
  EQUIPMENT_TYPE_COMMIT,
  EQUIPMENT_SET_ALL,
  EQUIPMENT_SET_ONE
} from './types';

export const actions: ActionTree<EquipmentState, RootState> = {
  [EQUIPMENT_SEARCH]: ({ commit }, match: string = '') => {
    return new Promise((resolve, reject) => {
      axios
        .get(`equipment?match=${encodeURIComponent(match)}`)
        .then((response) => {
          const body = response && response.data;
          const equipment: Equipment[] = body.data;

          resolve(equipment);
        })
        .catch((error) => {
          console.log(EQUIPMENT_SEARCH, error);
          reject();
        });
    });
  },

  [EQUIPMENT_TYPE_SEARCH]: (
    { commit },
    { match = '', all = false }: { match?: string; all?: boolean }
  ) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`equipmentType?match=${encodeURIComponent(match)}&all=${all}`)
        .then((response) => {
          const body = response && response.data;
          const equipmentTypes: EquipmentType[] = body.data;

          resolve(equipmentTypes);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  [EQUIPMENT_FETCH_ALL]: ({ commit }) => {
    return new Promise((resolve, reject) => {
      axios
        .get('equipment')
        .then((response) => {
          const body = response && response.data;
          const data: Equipment[] = body.data;

          commit(EQUIPMENT_SET_ALL, data);
          resolve(data);
        })
        .catch((error) => {
          console.log(EQUIPMENT_FETCH_ALL, error);
          reject(error);
        });
    });
  },

  [EQUIPMENT_FETCH_ONE]: ({ commit }, id: string) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`equipment/${id}`)
        .then((response) => {
          const body = response && response.data;
          const data: Equipment = body.data;

          commit(EQUIPMENT_SET_ONE, data);
          resolve(data);
        })
        .catch((error) => {
          console.log(EQUIPMENT_FETCH_ONE, error);
          reject(error);
        });
    });
  },

  [EQUIPMENT_COMMIT]: ({ commit }, equipment: Equipment) => {
    return new Promise((resolve, reject) => {
      const url = 'equipment';

      const request =
        equipment.id === ''
          ? axios.post(url, equipment)
          : axios.put(url, equipment);

      request
        .then((response) => {
          const body = response && response.data;
          const data: Equipment = body.data;

          commit(EQUIPMENT_SET_ONE, data);
          resolve(data);
        })
        .catch((error) => {
          console.log(EQUIPMENT_COMMIT, error);
          reject(error);
        });
    });
  },

  [EQUIPMENT_TYPE_COMMIT]: ({ commit }, equipmentType: EquipmentType) => {
    return new Promise((resolve, reject) => {
      const url = 'equipmentType';

      const request =
        equipmentType.id === ''
          ? axios.post(url, equipmentType)
          : axios.put(url, equipmentType);

      request
        .then((response) => {
          const body = response && response.data;
          const data: EquipmentType = body.data;

          resolve(data);
        })
        .catch((error) => {
          console.log(EQUIPMENT_TYPE_COMMIT, error);
          reject(error);
        });
    });
  }
};
