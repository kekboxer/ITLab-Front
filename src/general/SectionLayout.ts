import { RawLocation, } from "vue-router"

export class Section {
  title: string
  page: RawLocation

  constructor(title: string, page: RawLocation) {
    this.title = title
    this.page = page
  }
}

export enum Group {
  General,
  Profile
}

export class SectionGroup {
  title: string
  sections: Section[]
  
  constructor(title: string, sections: Section[] = []) {
    this.title = title
    this.sections = sections
  }
}

export const sectionGroups: Map<Group, SectionGroup> = new Map<Group, SectionGroup>()
sectionGroups.set(Group.General, new SectionGroup("Общее"))
sectionGroups.set(Group.Profile, new SectionGroup("Профиль"))

const sections: Map<string, boolean> = new Map<string, boolean>()
export const registerSection = (group: Group, section: Section) => {
  if (sections.has(section.title)) return

  const sectionGroup = sectionGroups.get(group)
  if (sectionGroup != null) {
    sectionGroup.sections.push(section)
    sections.set(section.title, true)
  }
}
