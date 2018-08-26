<!-- TEMPLATE BEGIN -->
<template>
  <div class="projects-page">
    <page-content-component :loading="loadingInProcess">
      <template slot="header">
        Проекты
      </template>

      <b-row>
        <b-col v-for="board in boards" :key="board.id" class="mb-3" lg="3" md="4" sm="6" cols="12">
          <a class="board-tile" :href="board.url" v-bind:style="getStyle(board)">
            <span class="board-tile-fade"></span>
            <span class="board-tile-details is-badged">
              <span :title="board.name" dir="auto" class="board-tile-details-name">{{ board.name }}</span>
            </span>
          </a>
        </b-col>
      </b-row>
    </page-content-component>
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RouteConfig } from 'vue-router';
import axios from 'axios';

import PageContentComponent from '@/components/PageContentComponent.vue';

@Component({
  components: {
    'page-content-component': PageContentComponent
  }
})
export default class ProjectsPage extends Vue {
  public APP_ID: string = '5c30d909f3ba9f9e3141a286626f90ea';
  public APP_TOKEN: string = 'd366bf5ed0622c00e27f4532b7be509371a214a471355740e98374bffdf4a92d';

  // Properties //
  ///////////////

  public loadingInProcess: boolean = true;
  public boards: any[] = [];

  // Component methods //
  //////////////////////

  public mounted() {
    this.loadingInProcess = true;

    const ai = axios.create({
      baseURL: 'https://api.trello.com/1/'
    });

    ai
      .get(
        `organizations/mtuitlab/boards?key=${this.APP_ID}&token=${
          this.APP_TOKEN
        }`
      )
      .then((result) => {
        this.boards = result && result.data;

        this.loadingInProcess = false;
      })
      .catch((err) => {
        console.log('ERROR', err);
      });
  }

  // Computed data //
  //////////////////

  public getStyle(board: any) {
    return {
      backgroundColor: board.prefs.backgroundColor,
      backgroundImage: board.prefs.backgroundImageScaled
        ? `url(${board.prefs.backgroundImageScaled[1].url})`
        : undefined
    };
  }
}

export const projectsPageRoute: RouteConfig = {
  path: '/projects',
  name: 'ProjectsPage',
  component: ProjectsPage
};
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
@import '@/styles/general.scss';

.projects-page {
  .board-tile,
  .board-tile-fade {
    border-radius: 3px;
    display: block;
  }

  .board-tile-fade {
    background-color: rgba(0, 0, 0, 0.15);
    bottom: 0;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
  }

  .board-tile {
    width: 100%;
    background-color: #959da1;
    background-size: cover;
    background-position: 50%;
    color: #fff;
    line-height: 20px;
    margin: 0 8px 8px 0;
    padding: 8px;
    position: relative;
    text-decoration: none;

    .board-tile-details {
      display: block;
      min-height: 64px;
      padding-right: 40px;
      position: relative;

      .board-tile-details-name {
        font-size: 16px;
        font-weight: 700;
        display: inline-block;
        overflow: hidden;
        max-height: 40px;
      }

      &.is-badged {
        min-height: 64px;
        padding-bottom: 16px;
      }
    }
  }
}
</style>
<!-- STYLE END -->