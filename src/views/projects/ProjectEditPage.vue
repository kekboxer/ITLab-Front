<!-- TEMPLATE BEGIN -->
<template>
  <div class="equipment-edit-page">
    <page-content :loading="loadingInProcess" :not-found="notFound">
      <template slot="header">Оборудование</template>

      <b-row>
        <b-col>
          <b-form>
            <b-form-group id="equipment-type-group" label="Название проекта">
              <b-form-input v-model="project.name"></b-form-input>
            </b-form-group>

            <b-form-group label="Краткое описание">
              <b-form-input v-model="project.shortDescription"></b-form-input>
            </b-form-group>

            <b-form-group label="Описание">
              <b-form-input v-model="project.description"></b-form-input>
            </b-form-group>

            <b-form-group label="Теги">
              <div v-for="tag in project.tags" :key="tag.id" style="display: inline-block">
                <span class="tag-color" :style="{ background: tag.color}"></span>
                <span>
                  <b>{{tag.value}}</b>
                </span>
                &nbsp;
              </div>
              <b-button
                variant="outline-secondary"
                class="w-20"
                @click="isProjectsTagsModalVisible = true"
              >
                <icon name="plus" class="d-md-inline" style="position: relative; top: -2px;"></icon>
              </b-button>
            </b-form-group>

            <b-form-row class="buttons">
              <b-col cols="6" md="auto">
                <b-button
                  class="w-100 submit-button"
                  variant="primary"
                  :disabled="isPageInProcess"
                  @click="onSubmit"
                >Подтвердить</b-button>
              </b-col>
              <b-col cols="6" md="auto">
                <b-button
                  variant="outline-danger"
                  class="w-100"
                  @click="onRemoveProject(project)"
                  v-if="!isNewProject"
                >Удалить</b-button>
              </b-col>
            </b-form-row>
          </b-form>
        </b-col>
      </b-row>
    </page-content>
    <projects-tags-modal v-model="isProjectsTagsModalVisible" :project="project" />
  </div>
</template>
<!-- TEMPALTE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RouteConfig } from 'vue-router';
import axios from 'axios';

import Icon from 'vue-awesome/components/Icon';
import CMailLink from '@/components/stuff/MailLink.vue';
import CPageContent from '@/components/layout/PageContent.vue';
import CUserSelection from '@/components/selectors/UserSelection.vue';
import CProjectsTagsModal from '@/components/modals/ProjectsTagsModal.vue';

import { validationMixin } from 'vuelidate';
import { required, minLength } from 'vuelidate/lib/validators';

import {
  IProject,
  ProjectDefault,
  PROJECT_FETCH_ONE,
  PROJECT_COMMIT,
  PROJECT_DELETE
} from '@/modules/projects';

import { IPageMeta } from '@/modules/layout';

enum State {
  Default,
  InProcess,
  Error
}

@Component({
  components: {
    Icon,
    'mail-link': CMailLink,
    'page-content': CPageContent,
    'user-selection': CUserSelection,
    'projects-tags-modal': CProjectsTagsModal
  }
})
export default class ProjectEditPage extends Vue {
  // Page properties //
  ////////////////////

  public loadingInProcess: boolean = false;
  public notFound: boolean = false;
  public pageState: State = State.Default;
  public isNewProject: boolean = false;
  public isProjectsTagsModalVisible: boolean = false;

  // Equipment properties //
  /////////////////////////

  public project: IProject = new ProjectDefault();

  public mounted() {
    this.loadingInProcess = true;

    const projectId = this.$route.params.id;
    if (projectId && projectId !== 'new') {
      this.$store
        .dispatch(PROJECT_FETCH_ONE, projectId)
        .then((project) => {
          this.project = project;
          this.loadingInProcess = false;
        })
        .catch((error) => {
          this.notFound = true;
          this.loadingInProcess = false;
        });
    } else {
      this.isNewProject = true;
      this.loadingInProcess = false;
    }
  }

  // Equipment methods //
  //////////////////////

  public onSubmit() {
    // if (this.$v.equipment && this.$v.equipment.$invalid) {
    //   return;
    // }

    this.pageState = State.InProcess;

    this.$store
      .dispatch(PROJECT_COMMIT, this.project)
      .then((project) => {
        this.pageState = State.Default;
        if (this.isNewProject) {
          this.isNewProject = false;
          this.$router.push({ path: '/projects' });
        } else {
          this.$notify({
            title: 'Изменения успешно сохранены',
            duration: 500
          });
        }
      })
      .catch((error) => {
        this.pageState = State.Error;
      });
  }

  public onRemoveProject(project: IProject) {
    if (!confirm('Вы действительно хотите удалить проект?')) {
      return;
    }

    this.$store.dispatch(PROJECT_DELETE, project);
    this.$router.push({ path: '/projects' });
  }

  get isPageInProcess(): boolean {
    return this.pageState === State.InProcess;
  }

  // Modal window methods //
  /////////////////////////
}

export const projectEditPageRoute: RouteConfig = {
  path: '/projects/:id',
  name: 'ProjectEditPage',
  component: ProjectEditPage
};
</script>
<!-- SCRIPT END -->

<!-- STYLE BEGIN -->
<style lang="scss">
.tag-color {
  border-radius: 50%;
  display: inline-block;
  height: 15px;
  position: relative;
  top: 3px;
  width: 15px;
  margin-right: 5px;
}
</style>
<!-- STYLE END -->
