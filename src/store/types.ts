import { RawLocation } from "vue-router";

export enum Group {
  General,
  Profile
}
export const groupTitles: Map<Group, string> = new Map<Group, string>()
groupTitles.set(Group.General, "Общее")
groupTitles.set(Group.Profile, "Профиль")

export interface Section {
  title: string,
  parentGroup: Group
}

export interface RootState {
  systemName: string
  //sectionGroups: Map<Group, SectionGroup>
}