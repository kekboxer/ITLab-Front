import Vue from "vue"
import { Section } from "@/general/SectionLayout"

declare module "vue/types/vue" {
  interface Vue {
    $session: any
  }
}

declare module "vue/types/options" {
  interface ComponentOptions<V extends Vue> {
    baseSection?: Section
  }
}