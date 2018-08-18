import { Module } from 'vuex';
import { RootState } from '@/store/types';

import { actions } from './actions';
import { getters } from './getters';
import { mutations } from './mutations';
import { LayoutState } from './types';

export * from './types';

// used pages

import {
  // @ts-ignore
  loginPageRoute,
  // @ts-ignore
  registrationPageRoute,
  // @ts-ignore
  processingAgreementPageRoute
} from '@/views/authorization';

// @ts-ignore
import { notificationsPageRoute } from '@/views/notifications';

import {
  // @ts-ignore
  eventsPageRoute,
  // @ts-ignore
  eventEditPageRoute,
  // @ts-ignore
  eventDetailPage
} from '@/views/events';

// @ts-ignore
import { equipmentPageRoute, equipmentEditPageRoute } from '@/views/equipment';

// @ts-ignore
import { projectsPageRoute } from '@/views/projects';

// @ts-ignore
import { profileSettingsPageRoute } from '@/views/profile';

// @ts-ignore
import { usersPageRoute } from '@/views/system';

export const state: LayoutState = {
  stuff: [loginPageRoute, registrationPageRoute, processingAgreementPageRoute],
  groups: [
    {
      name: 'general',
      title: 'Общее',
      sections: [
        {
          name: 'notifications',
          title: 'Уведомления',
          homeURL: '/notifications',
          pages: [notificationsPageRoute]
        },
        {
          name: 'events',
          title: 'События',
          homeURL: '/events',
          pages: [eventsPageRoute, eventDetailPage, eventEditPageRoute]
        },
        {
          name: 'equipment',
          title: 'Оборудование',
          homeURL: '/equipment',
          pages: [equipmentPageRoute, equipmentEditPageRoute]
        },
        {
          name: 'projects',
          title: 'Проекты',
          homeURL: '/projects',
          pages: [projectsPageRoute]
        }
      ]
    },
    {
      name: 'system',
      title: 'Система',
      sections: [
        {
          name: 'users',
          title: 'Пользователи',
          homeURL: '/users',
          pages: [usersPageRoute]
        }
      ]
    },
    {
      name: 'settings',
      title: 'Профиль',
      sections: [
        {
          name: 'profileSettings',
          title: 'Настройки',
          homeURL: '/settings',
          pages: [profileSettingsPageRoute]
        }
      ]
    }
  ]
};

export const layout: Module<LayoutState, RootState> = {
  state,
  getters,
  actions,
  mutations
};
