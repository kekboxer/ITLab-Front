import { MutationTree } from "vuex"
import { ProfileState } from "./types"
import { SETTINGS_DARK_THEME_SET } from "@/store/actions/profile"

export const mutations: MutationTree<ProfileState> = {
  [SETTINGS_DARK_THEME_SET]: (state, darkTheme : boolean) => {
    state.settings.darkTheme = darkTheme
    if (darkTheme) {
      localStorage.setItem("dark-theme", "theme");
    }
    else {
      localStorage.removeItem("dark-theme");
    }
  }
}