
<template>
  <div class="layout with-sidebar">
    <template v-if="isAuthorized">
      <sidebar />
    </template>

    <div class="content-wrapper">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import CSidebar from '@/components/layout/Sidebar.vue';

@Component({
  components: {
    sidebar: CSidebar
  }
})
export default class Default extends Vue {
  public isAuthorized: boolean = false;

  public async mounted() {
    this.$userManager.signedIn().then((response) => {
      if (response) {
        this.isAuthorized = true;
      } else {
        this.$userManager.signInSilent().then(async () => {
          this.isAuthorized = await this.$userManager.signedIn();
        });
      }
    });
    // await this.$userManager.signInSilent().then(async () => {
    //   this.isAuthorized = await this.$userManager.signedIn();
    //   console.log(await this.$userManager.signedIn());
    // });

    // if (await this.$userManager.signedIn()) {
    //   debugger;
    //   this.isAuthorized = true;
    // } else {
    //   await this.$userManager.signInSilent().then(async () => {
    //     this.isAuthorized = await this.$userManager.signedIn();
    //     console.log(await this.$userManager.signedIn());
    //   });
    // }
  }
}
</script>