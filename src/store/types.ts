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

export interface SystemLayout {
  stuff: RouteConfig[],
  groups: Group[]
}

export interface RootState {
  name: string
  layout: SystemLayout
}