import Vue from "vue"
import { Section } from "@/general/SectionLayout"

declare module "vue/types/options" {
  interface ComponentOptions<V extends Vue> {
    baseSection?: Section
  }
}