import { RawLocation, RouteConfig } from 'vue-router';

// setters
export const LAYOUT_BADGE_TEXT_SET = 'LAYOUT_BADGE_TEXT_SET';

// getters
export const LAYOUT_PAGES_GET = 'LAYOUT_PAGES_GET';
export const LAYOUT_GROUPS_GET = 'LAYOUT_GROUPS_GET';

// Section //
////////////
export interface Section {
  name: string;
  title: string;
  homeURL: RawLocation;
  pages: RouteConfig[];
  badgeText?: string;
}

// Group //
//////////

export interface Group {
  name: string;
  title: string;
  sections: Section[];
}

// State //
////////////////

export interface LayoutState {
  stuff: RouteConfig[];
  groups: Group[];
}
