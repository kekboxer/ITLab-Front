<!-- TEMPLATE BEGIN -->
<template>
  <div class="projects-page">
    <page-content :loading="loadingInProcess">
      <template slot="header">Проекты</template>
      <template slot="header-button">
        <b-button variant="success" to="projects/new">Добавить</b-button>
      </template>

      <b-row>
            <b-col>
              <b-card v-for="project in projects" :key="project.id" class="mb-1">
                <b-row>
                  <b-col>
                    <b-row style="line-height: 31px">
                      <b-col cols="12" md="6">
                        <b>{{ project.name }}</b>
                      </b-col>
                      <b-col cols="12" md="6" v-for="tag in project.projectTags" :key="tag">{{tag}}</b-col>
                    </b-row>
                  </b-col>
                  <b-col
                    cols="12"
                    md="auto"
                    class="ml-md-auto d-flex align-content-between align-items-start"
                  >
                    <b-button
                      variant="warning"
                      class="btn-sm w-100 mr-md-1 order-3 order-md-2"

                      :to="'projects/' + project.id"
                      
                    >Изменить</b-button>
                    <b-button
                      variant="outline-danger"
                      class="btn-sm w-100 mr-1 mr-md-0 order-1 order-md-3"
                      @click="onRemoveProject(project)"
                    >
                      <icon
                        name="times"
                        class="d-none d-md-inline"
                        style="position: relative; top: -2px;"
                      ></icon>
                      <span class="d-inline d-md-none">Удалить</span>
                    </b-button>
                  </b-col>
                </b-row>
              </b-card>
            </b-col>
          </b-row>


      <!-- <b-row>
        <b-col>
          <b-card v-for="project in projects" :key="project.id" class="mb-1">
            <b-col>
              <b-row>
                <b-col cols="12" md="6">
                  <b>{{ project.name }}</b>
                  <span v-for="tag in project.projectTags" :key="tag">{{tag}}</span>
                </b-col>
              </b-row>
            </b-col>
            <b-col
              cols="12"
              md="auto"
              class="ml-md-auto d-flex align-content-between align-items-start"
            >
              <b-button
                variant="warning"
                class="btn-sm w-100 mr-md-1 order-3 order-md-2"
                @click="showEventTypeModal(eventType)"
              >Изменить</b-button>
              <b-button
                variant="outline-danger"
                class="btn-sm w-100 mr-1 mr-md-0 order-1 order-md-3"
                @click="onRemoveEventType(eventType)"
              >
                <icon
                  name="times"
                  class="d-none d-md-inline"
                  style="position: relative; top: -2px;"
                ></icon>
                <span class="d-inline d-md-none">Удалить</span>
              </b-button>
            </b-col>
          </b-card>
        </b-col>
      </b-row> -->
    </page-content>
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RouteConfig } from 'vue-router';
import axios from 'axios';
import Icon from 'vue-awesome/components/Icon';

import { IProject, PROJECTS_FETCH_ALL, PROJECTS_GET_ALL, PROJECT_DELETE } from '@/modules/projects';

import CPageContent from '@/components/layout/PageContent.vue';

@Component({
  components: {
    Icon,
    'page-content': CPageContent
  }
})
export default class ProjectsPage extends Vue {
  public APP_ID: string = '5c30d909f3ba9f9e3141a286626f90ea';
  public APP_TOKEN: string =
    'd366bf5ed0622c00e27f4532b7be509371a214a471355740e98374bffdf4a92d';

  // Properties //
  ///////////////

  public loadingInProcess: boolean = true;
  public projects: any[] = [];

  // Component methods //
  //////////////////////

  public mounted() {
    this.loadingInProcess = true;

    this.$store.dispatch(PROJECTS_FETCH_ALL).then((projects) => {
      this.projects = projects;
      this.loadingInProcess = false;
    });
  }

  public onRemoveProject(project: IProject) {
      if (!confirm('Вы действительно хотите удалить проект?')) {
        return;
      }

      this.$store.dispatch(PROJECT_DELETE, project);
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