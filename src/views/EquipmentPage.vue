<!-- TEMPLATE BEGIN -->
<template>
  <div class="equipment-page">
    <b-container class="content">
      <b-row>
        <b-col>
          <h1 class="page-title">Оборудование</h1>
        </b-col>
      </b-row>
      <br>

      <loading-stub-component v-if="loadingInProcess"></loading-stub-component>
    </b-container>
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import { registerPage } from "@/router/PagesInformation"
import { Section, Group, registerSection } from "@/general/SectionLayout"

import LoadingStubComponent from "@/components/LoadingStubComponent.vue"

export const equipmentPageName: string = "EquipmentPage"

export const equipmentSection: Section = new Section("Оборудование", {
  name: equipmentPageName
})

@Component({
  name: equipmentPageName,
  baseSection: equipmentSection,
  components: {
    "loading-stub-component": LoadingStubComponent
  }
})
class EquipmentPage extends Vue {
  loadingInProcess: boolean = true

  bedoreMount() {
    this.loadingInProcess = true
  }
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
<style lang="scss">

</style>
<!-- STYLE END -->