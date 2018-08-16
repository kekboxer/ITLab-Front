import { Module } from "vuex"
import { RootState } from "@/store/types"

import { actions } from "./actions"
import { getters } from "./getters"
import { mutations } from "./mutations"
import { LayoutState } from "./types"

export * from "./types"

// used pages

// @ts-ignore
import { loginPageRoute } from "@/views/LoginPage.vue";
// @ts-ignore
import { registrationPageRoute } from "@/views/RegistrationPage.vue";
// @ts-ignore
import { processingAgreementPageRoute } from "@/views/ProcessingAgreementPage.vue";
// @ts-ignore
import { eventsPageRoute } from "@/views/EventsPage.vue";
// @ts-ignore
import { eventDetailPage } from "@/views/EventDetailPage.vue";
// @ts-ignore
import { eventEditPageRoute } from "@/views/EventEditPage.vue";
// @ts-ignore
import { equipmentPageRoute } from "@/views/EquipmentPage.vue";
// @ts-ignore
import { equipmentEditPageRoute } from "@/views/EquipmentEditPage.vue";
// @ts-ignore
import { projectsPageRoute } from "@/views/ProjectsPage.vue";
// @ts-ignore
import { profileSettingsPageRoute } from "@/views/ProfileSettingsPage.vue";


export const state: LayoutState = {
  stuff: [
    loginPageRoute, registrationPageRoute,
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
          eventsPageRoute, eventDetailPage, eventEditPageRoute
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