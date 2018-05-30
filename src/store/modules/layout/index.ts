import { Module } from "vuex"
import { getters } from "./getters"
import { actions } from "./actions"
import { mutations } from "./mutations"
import { LayoutState } from "./types"
import { RootState } from "@/store/types"

// used pages
import { loginPageRoute, registerPageRoute } from "@/views/AuthPage.vue";
import { processingAgreementPageRoute } from "@/views/ProcessingAgreementPage.vue";

import { eventsPageRoute } from "@/views/EventsPage.vue";
import { eventPageRoute } from "@/views/EventPage.vue";

import { equipmentPageRoute } from "@/views/EquipmentPage.vue";

import { projectsPageRoute } from "@/views/ProjectsPage.vue";

import { profileSettingsPageRoute } from "@/views/ProfileSettingsPage.vue";


export const state: LayoutState = {
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

export const layout: Module<LayoutState, RootState> = {
  state,
  getters,
  actions,
  mutations
}