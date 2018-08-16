import { ActionTree } from "vuex"
import { RootState } from "@/store/types"
import axios from "axios"

import {
  UsersState,
  User,
  USER_SEARCH,
  USERS_FETCH_ALL,
  USERS_FETCH_ONE,
  USER_ASSIGN_EQUIPMENT,
  USER_REMOVE_EQUIPMENT
} from "./types"

import { Equipment } from "@/store/modules/equipment";

export const actions: ActionTree<UsersState, RootState> = {
  [USER_SEARCH]: ({ }, { match = "", all = false }: { match?: string, all?: boolean }) => {
    return new Promise((resolve, reject) => {
      axios.get(`user?match=${encodeURIComponent(match)}&count=${all ? 0 : 5}`).then(response => {
        const body = response.data;
        const data: User[] = body.data;

        resolve(data);
      }).catch(error => {
        console.log(USER_SEARCH, error);
        reject(error);
      });
    });
  },
/*
  [USERS_FETCH_ALL]: ({ commit }) => {
    return new Promise((resolve, reject) => {
      axios.get("user").then((response) => {
        const body = response && response.data
        const data: Equipment[] = body.data

        commit(EQUIPMENT_SET_ALL, data);
        resolve(data);
      }).catch(error => {
        console.log(EQUIPMENT_FETCH_ALL, error);
        reject(error);
      })
    })
  },

  [USERS_FETCH_ONE]: ({ commit }) => {

  },
  */

  [USER_ASSIGN_EQUIPMENT]: ({ }, { equipment, user }: { equipment: Equipment, user: User | string | null }) => {
    return new Promise((resolve, reject) => {
      let url: string = "equipment/user";
      if (user) {
        if (typeof user === "string") {
          url += `/${user as string}`;
        }
        else if ("id" in (user as any)) {
          url += `/${(user as any).id}`;
        }
      }

      axios.post(url, { id: equipment.id }).then(result => {
        const body = result && result.data;
        const equipment: Equipment = body && body.data;

        resolve(equipment);
      }).catch(error => {
        console.log(USER_ASSIGN_EQUIPMENT, error);
        reject(error);
      });
    });
  },

  [USER_REMOVE_EQUIPMENT]: ({ }, { equipment, owner }: { equipment: Equipment, owner: User | string | null }) => {
    return new Promise((resolve, reject) => {
      let url: string = "equipment/user";
      if (owner) {
        if (typeof owner === "string") {
          url += `/${owner as string}`;
        }
        else if ("id" in (owner as any)) {
          url += `/${(owner as any).id}`;
        }
      }

      axios.delete(url, { data: { id: equipment.id } }).then(result => {
        const body = result && result.data;
        const equipment: Equipment = body && body.data;

        resolve(equipment);
      }).catch(error => {
        console.log(error);
        reject(error);
      });
    })
  }
}