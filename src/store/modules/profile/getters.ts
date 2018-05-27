import { GetterTree } from "vuex"
import { ProfileState, User } from "./types"
import { RootState } from "@/store/types"
import { SETTINGS_DARK_THEME_GET } from "@/store/actions/profile"

export const getters: GetterTree<ProfileState, RootState> = {
  [SETTINGS_DARK_THEME_GET]: (state) => {
    return state.settings.theme;
  }
}