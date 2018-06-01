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
import { eventEditPageRoute } from "@/views/EventEditPage.vue";

import { equipmentPageRoute } from "@/views/EquipmentPage.vue";
import { equipmentEditPageRoute } from "@/views/EquipmentEditPage.vue";

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
          eventsPageRoute, eventEditPageRoute
        ]
      }, {
        name: "equipment",
        title: "Оборудование",
        homeURL: "/equipment",
        pages: [
          equipmentPageRoute, equipmentEditPageRoute
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