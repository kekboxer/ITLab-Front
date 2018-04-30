<!-- TEMPLATE BEGIN -->
<template>
  <div class="equipment-page">
    <b-container class="content">
      <b-row>
        <b-col>
          <h1>Оборудование</h1>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import { registerPage } from "@/router/PagesInformation"
import { Section, Group, registerSection } from "@/general/SectionLayout"

export const equipmentPageName: string = "EquipmentPage"

export const equipmentSection: Section = new Section("Оборудование", {
  name: equipmentPageName
})

@Component({
  name: equipmentPageName,
  baseSection: equipmentSection
})
class EquipmentPage extends Vue {

}

registerSection(Group.General, equipmentSection)

registerPage({
  path: "/equipment",
  name: equipmentPageName,
  component: EquipmentPage
}, {
  baseSection: equipmentSection
});

export default EquipmentPage;
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style>

</style>
<!-- STYLE END -->