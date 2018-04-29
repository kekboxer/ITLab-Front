<!-- TEMPLATE BEGIN -->
<template>
  <div class="home-page">
    <b-container class="content">
      <b-row>
        <b-col>
          <h1>Hello world</h1>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue } from "vue-property-decorator"

import { PageMeta } from "@/stuff/pagemeta"

@Component
export default class HomePage extends Vue {
  name: string = "World"
}

export const homePageMeta: PageMeta = new PageMeta
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style scoped>

</style>
<!-- STYLE END -->