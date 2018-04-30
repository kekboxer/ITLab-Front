<!-- TEMPLATE BEGIN -->
<template>
  <div class="profile-settings-page">
    <b-container class="content">
      <b-row>
        <b-col>
          <h1>Настройки профиля</h1>
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

export const profileSettingsPageName: string = "ProfileSettingsPage"

export const profileSettingsSection: Section = new Section("Настройки", {
  name: profileSettingsPageName
})

@Component({
  name: profileSettingsPageName,
  baseSection: profileSettingsSection
})
class ProfileSettingsPage extends Vue {
}

registerSection(Group.Profile, profileSettingsSection)

registerPage({
  path: "/settings",
  name: profileSettingsPageName,
  component: ProfileSettingsPage
}, {
  baseSection: profileSettingsSection
});

export default ProfileSettingsPage;
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style>

</style>
<!-- STYLE END -->