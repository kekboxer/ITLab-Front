import Vue from "vue"
import { RouteConfig } from "vue-router"
import { Section } from "@/general/SectionLayout";

export const routes: RouteConfig[] = []

export type PageMeta = {
  secure?: boolean,
  hideNavigation?: boolean,
  baseSection?: Section
}
const templatedPageMeta: PageMeta = {
  secure: true,
  hideNavigation: false
}

const pages: Map<string, boolean> = new Map<string, boolean>()
export const registerPage = (route: RouteConfig, pageMeta?: PageMeta, props?: any) => {
  if (pages.has(route.path)) return

  route.meta = Object.assign({}, route.meta, templatedPageMeta, pageMeta)
  route.props = Object.assign({}, route.props, props)
  routes.push(route)
  pages.set(route.path, true)
}