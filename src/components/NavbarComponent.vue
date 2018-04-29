<!-- TEMPLATE BEGIN -->
<template>
  <div class="navbar-component">
    <b-navbar toggleable="md" type="dark" variant="dark" fixed="top" class="py-1" v-if="false">
      <b-navbar-brand href="#">{{ name }}</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse is-nav id="nav-collapse">
        <b-navbar-nav>
          <!--<b-nav-item v-for="link in links" :key="link.name" :to="link.path" exact>\{{link.name}}</b-nav-item>-->
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <div class="content-spacer"></div>
  </div>
</template>
<!-- TEMPALTE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue } from "vue-property-decorator"

class Link {
  name: string
  path: string

  constructor(name: string, path: string) {
    this.name = name
    this.path = path
  }
}

@Component
export default class NavbarComponent extends Vue {
  name: string = "RealityShift"

  links: Link[] = [
    new Link("Test", "/"),
    new Link("Other", "/")
  ]
}
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style>
.navbar-component .content-spacer {
  height: 56px;
}
</style>
<!-- STYLE END -->
