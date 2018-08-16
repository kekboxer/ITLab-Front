<!-- TEMPLATE BEGIN -->
<template>
  <div class="users-page">
    <b-container class="content">
      <b-row>
        <b-col>
          <h1 class="page-title">Пользователи</h1>
        </b-col>
      </b-row>
      <br>
      <loading-stub-component v-if="loadingInProcess"></loading-stub-component>
      <div v-else>
        <!--<b-table :hover="true" :fixed="true" :items="items" :fields="fields">
        </b-table>-->
      </div>
    </b-container>
  </div>
</template>
<!-- TEMPALTE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { RouteConfig } from "vue-router";

import LoadingStubComponent from "@/components/LoadingStubComponent.vue";

@Component({
  components: {
    "loading-stub-component": LoadingStubComponent
  }
})
export default class UsersPage extends Vue {
  loadingInProcess: boolean = true;

  mounted() {
    this.loadingInProcess = false;
  }

  get items() {
    return []
    //return this.$store.getters[USERS_GET_ALL];
  }
}

export const usersPage = <RouteConfig>{
  path: "/users",
  name: "UsersPage",
  component: UsersPage
};
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
@import "@/styles/general.scss";

.users-page {
}
</style>
<!-- STYLE END -->
