<!-- TEMPLATE BEGIN -->
<template>
  <div class="c-projects-tags-modal">
    <b-modal v-model="isModalVisible">
      <template slot="modal-title">Теги</template>

      <template>
        <div v-for="state in tagsState" :key="state.tag.id">
          <b-form-checkbox class="noselect" v-model="state.checked">
            <b-row class="justify-content-between" style="margin:5px">
              <span>
                <span class="tag-color" :style="{ background: state.tag.color}"></span>
                <span>
                  <b>{{state.tag.value}}</b>
                </span>
              </span>
              <b-button-group>
                <b-button variant="outline-secondary" size="sm">
                  <icon name="edit" size="2px"></icon>
                </b-button>
                <b-button variant="outline-danger" size="sm" @click="onDeleteTag(state)">
                  <icon name="times" size="2px"></icon>
                </b-button>
              </b-button-group>
            </b-row>
          </b-form-checkbox>
          <template v-if="isChangeTag">
            <div>
              <b-input-group prepend="Название:" class="mt-3">
                <b-form-input type="text" v-model="tag.value"></b-form-input>
              </b-input-group>
              <b-input-group prepend="Цвет:" class="mt-3">
                <b-form-input type="text" v-model="tag.color"></b-form-input>
              </b-input-group>
            </div>
            <b-button variant="outline-success" class="w-50 mt-3" @click="onSubmitNewTag">Сохранить</b-button>
            <b-button
              variant="outline-danger"
              class="w-50 mt-3"
              @click="isChangeTag = false"
            >Отменить</b-button>
          </template>
        </div>
      </template>

      <template v-if="isNewTag">
        <div>
          <b-input-group prepend="Название:" class="mt-3">
            <b-form-input type="text" v-model="newTag.value"></b-form-input>
          </b-input-group>
          <b-input-group prepend="Цвет:" class="mt-3">
            <b-form-input type="text" v-model="newTag.color"></b-form-input>
          </b-input-group>
        </div>
        <b-button variant="outline-success" class="w-50 mt-3" @click="onSubmitNewTag">Сохранить</b-button>
        <b-button variant="outline-danger" class="w-50 mt-3" @click="isNewTag = false">Отменить</b-button>
      </template>

      <br />
      <b-button
        v-if="!isNewTag"
        variant="outline-secondary"
        class="w-100"
        @click="isNewTag = true"
      >Добавить тег</b-button>

      <template slot="modal-footer">
        <button
          type="button"
          class="btn btn-secondary"
          @click="isModalVisible = false, isNewTag=false"
        >Закрыть</button>
      </template>
    </b-modal>
  </div>
</template>
<!-- TEMPALTE END -->

<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import axios from 'axios';
import {
  ITag,
  TagDefalult,
  IProject,
  TAGS_FETCH,
  PROJECT_TAGS_FETCH
} from '../../modules/projects';
import Icon from 'vue-awesome/components/Icon';

class TagState {
  public checked: boolean = false;
  public inProcess: boolean = false;
  public tag: ITag = new TagDefalult();
}

@Component({
  components: {
    Icon
  }
})
export default class CProjectsTagsModal extends Vue {
  // Properties //
  ///////////////
  @Prop({
    default: false
  })
  public value!: boolean;

  @Prop({
    default: (error: any) => undefined
  })
  public onError!: (error: any) => void;

  @Prop()
  public project!: IProject;

  public isModalInProcess: boolean = false;
  public newTag: ITag = new TagDefalult();
  public isNewTag: boolean = false;
  public isChangeTag: boolean = false;
  public tagsState: TagState[] = [];
  private visibilityStuff: boolean = false;

  // Component methods //
  //////////////////////
  public mounted() {
    this.$watch('value', (value: boolean) => {
      this.visibilityStuff = value;
    });
    console.log(this.$route.params.id);
  }

  @Watch('project', {
    deep: true
  })
  public onProjectChanged(tag: ITag) {
    const tagsOfProject = this.project.tags;
    this.$store.dispatch(TAGS_FETCH).then((tags: ITag[]) => {
      this.tagsState = tags.map((tag: ITag) => {
        const state = new TagState();
        state.tag = tag;
        state.checked =
          tagsOfProject === undefined
            ? false
            : tagsOfProject.some((r) => r.id === tag.id);
        return state;
      });
    });
  }

  // Methods //
  ////////////

  public onDeleteTag(tag: TagState) {
    if (tag.tag.useCount === 0) {
      const tagIndex = this.tagsState.indexOf(tag);
      axios
        .delete(`projects/tags/${tag.tag.id}`)
        .then(() => {
          this.tagsState.splice(tagIndex, 1);
          this.$notify({
            title: 'Тег успешно удален.',
            duration: 500
          });
        })
        .catch((error) => {
          this.$notify({
            type: 'error',
            title: 'Невозможно сохранить изменения.',
            duration: 500
          });
        });
    } else {
      this.$notify({
        type: 'error',
        title:
          'Перед удалением тега необходимо исключить его из всех проектов.',
        duration: 2000
      });
    }
  }

  public addTagToProject(tag: ITag) {
    axios.post(`projects/${this.project.id}/tags/${tag.id}`).then(() => {
      this.$notify({
        title: 'Тег успешно добавлен.',
        duration: 500
      });
    });
  }

  public onSubmitNewTag() {
    axios
      .post('projects/tags', this.newTag)
      .then((response) => {
        this.isNewTag = false;
        const tagState = new TagState();
        tagState.tag = this.newTag;
        tagState.checked = false;
        tagState.inProcess = false;
        this.tagsState.push(tagState);
        this.newTag = new TagDefalult();
        this.$notify({
          title: 'Тег успешно добавлен.',
          duration: 500
        });
      })
      .catch((error) => {
        this.$notify({
          type: 'error',
          title: 'Невозможно сохранить изменения.',
          duration: 500
        });
      });
  }

  set isModalVisible(value: boolean) {
    this.$emit('input', value);
  }

  // Computed data //
  //////////////////

  get isModalVisible(): boolean {
    return this.visibilityStuff;
  }
}
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
