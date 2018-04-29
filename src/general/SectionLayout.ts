import { RawLocation, } from "vue-router"

export class Section {
  name: string
  page: RawLocation

  constructor(name: string, page: RawLocation) {
    this.name = name
    this.page = page
  }
}

export class SectionGroup {
  name: string
  sections: Section[]
  
  constructor(name: string, sections: Section[]) {
    this.name = name
    this.sections = sections
  }
}

export const sectionGroups: SectionGroup[] = [
  new SectionGroup("Общее", [
    new Section("События", {name: "EventsPage"}),
    new Section("Оборудование", {name: "EventsPage"}),
    new Section("Проекты", {name: "EventsPage"}),
  ]),
  new SectionGroup("Профиль", [
    new Section("Настройки", {name: "ProfilePage"})
  ])
]