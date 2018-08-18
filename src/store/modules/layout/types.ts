import { RawLocation, RouteConfig } from 'vue-router';

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
