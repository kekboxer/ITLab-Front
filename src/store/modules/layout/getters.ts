import { GetterTree } from "vuex"
import { LayoutState } from "./types"
import { RootState } from "@/store/types"
import { LAYOUT_PAGES_GET, LAYOUT_GROUPS_GET } from "@/store/actions/layout"

export const getters: GetterTree<LayoutState, RootState> = {
  [LAYOUT_PAGES_GET]: (state) => {
    let result = state.stuff.concat()
    state.groups.forEach((group) => {
      group.sections.forEach((section) => {
        section.pages.map((page) => {
          if (page.meta == undefined) {
            page.meta = {}
          }
          page.meta.parentSection = section.name;
        })
        result = result.concat(section.pages);
      })
    })

    return result.concat([
      {
        path: "*",
        redirect: {
          name: "EventsPage" // TODO: redirect to NotFoundPage
        }
      }
    ]);
  },

  [LAYOUT_GROUPS_GET]: (state) => {
    return state.groups;
  }
}