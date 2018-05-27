import { MutationTree } from "vuex"
import { ProfileState } from "./types"
import { SETTINGS_DARK_THEME_SET } from "@/store/actions/profile"

export const mutations: MutationTree<ProfileState> = {
  [SETTINGS_DARK_THEME_SET]: (state, theme: string = "light") => {
    state.settings.theme = theme;
    localStorage.setItem("theme", state.settings.theme);
  }
}