import { Module } from "vuex"
import { RootState } from "@/store/types"

import { actions } from "./actions"
import { getters } from "./getters"
import { mutations } from "./mutations"
import { LayoutState } from "./types"

export * from "./types"

// used pages

// @ts-ignore
import { loginPageRoute, registrationPageRoute, processingAgreementPageRoute } from "@/views/authorization";
// @ts-ignore
import { notificationsPage } from "@/views/notifications";
// @ts-ignore
import { eventsPageRoute, eventEditPageRoute, eventDetailPage } from "@/views/events";
// @ts-ignore
import { equipmentPageRoute, equipmentEditPageRoute } from "@/views/equipment";
// @ts-ignore
import { projectsPageRoute } from "@/views/projects";
// @ts-ignore
import { profileSettingsPageRoute } from "@/views/profile";
//@ts-ignore
import { usersPage } from "@/views/system";

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
        name: "notifications",
        title: "Уведомления",
        homeURL: "/notifications",
        pages: [
          notificationsPage
        ]
      }, {
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
      name: "system",
      title: "Система",
      sections: [{
        name: "users",
        title: "Пользователи",
        homeURL: "/users",
        pages: [
          usersPage
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