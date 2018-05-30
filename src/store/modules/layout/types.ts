import { RawLocation, RouteConfig } from "vue-router";

export interface Section {
  name: string
  title: string
  homeURL: RawLocation
  pages: RouteConfig[]
}

export interface Group {
  name: string
  title: string
  sections: Section[]
}

export interface LayoutState {
  stuff: RouteConfig[],
  groups: Group[]
}