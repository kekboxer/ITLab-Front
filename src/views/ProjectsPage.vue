<!-- TEMPLATE BEGIN -->
<template>
  <div class="projects-page">
    <b-container class="content">
      <b-row>
        <b-col>
          <h1>Проекты</h1>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue } from "vue-property-decorator"

import { registerPage } from "@/router/PagesInformation"
import { Section, Group, registerSection } from "@/general/SectionLayout"

export const projectsPageName: string = "ProjectsPage"

export const projectsSection: Section = new Section("Проекты", {
  name: projectsPageName
})

@Component({
  name: projectsPageName,
  baseSection: projectsSection
})
class ProjectsPage extends Vue {
}

registerSection(Group.General, projectsSection)

registerPage({
  path: "/projects",
  name: projectsPageName,
  component: ProjectsPage
}, {
  baseSection: projectsSection
});

export default ProjectsPage;
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style>

</style>
<!-- STYLE END -->