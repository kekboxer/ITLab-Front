import Vue from "vue"
import Vuex, { StoreOptions } from "vuex"
import { RootState } from "./types"

import { authorization } from "./modules/authorization"
import { profile } from "./modules/profile"
import { events } from "./modules/events"

import { SYSTEM_NAME, LAYOUT_STUFF_PAGES, LAYOUT_GROUPS } from "./actions/global"

// used pages
import { loginPageRoute, registerPageRoute } from "@/views/AuthPage.vue";
import { processingAgreementPageRoute } from "@/views/ProcessingAgreementPage.vue";

import { eventsPageRoute } from "@/views/EventsPage.vue";
import { eventPageRoute } from "@/views/EventPage.vue";

import { equipmentPageRoute } from "@/views/EquipmentPage.vue";

import { projectsPageRoute } from "@/views/ProjectsPage.vue";

import { profileSettingsPageRoute } from "@/views/ProfileSettingsPage.vue";

Vue.use(Vuex)

const state: RootState = {
  name: "ITlab",
  layout: {
    stuff: [
      loginPageRoute, registerPageRoute,
      processingAgreementPageRoute
    ],
    groups: [
      {
        name: "general",
        title: "Общее",
        sections: [{
          name: "events",
          title: "События",
          homeURL: "/events",
          pages: [
            eventsPageRoute, eventPageRoute
          ]
        }, {
          name: "equipment",
          title: "Оборудование",
          homeURL: "/equipment",
          pages: [
            equipmentPageRoute
          ]
        }, {
          name: "projects",
          title: "Проекты",
          homeURL: "/projects",
          pages: [
            projectsPageRoute
          ]
        }]
      },
      {
        name: "settings",
        title: "Профиль",
        sections: [{
          name: "profileSettings",
          title: "Настройки",
          homeURL: "/settings",
          pages: [
            profileSettingsPageRoute
          ]
        }]
      }
    ]
  }
}

const store: StoreOptions<RootState> = {
  modules: {
    authorization,
    profile,
    events
  },
  state,

  getters: {
    [SYSTEM_NAME]: (state) => {
      return state.name
    },
    [LAYOUT_STUFF_PAGES]: (state) => {
      return state.layout.stuff
    },
    [LAYOUT_GROUPS]: (state) => {
      return state.layout.groups
    }
  }
}

export default new Vuex.Store<RootState>(store)