<!-- TEMPLATE BEGIN -->
<template>
  <div class="c-projects-tags-modal">
    <b-modal v-model="isModalVisible">
      <template slot="modal-title">Теги</template>

      <template>
        <div
          v-for="(state, stateIndex) in tagsState"
          :key="state.tag.id"
          style="display: flex; justify-content: space-between"
        >
          <b-form-checkbox
            class="noselect"
            style="display: inline-block"
            v-model="state.checked"
            @click.native.prevent="onChangeTagState(stateIndex)"
          >
            <b-row class="justify-content-between" style="margin:5px">
              <span>
                <span class="tag-color" :style="{ background: state.tag.color}"></span>
                <span>
                  <b>{{state.tag.value}}</b>
                </span>
              </span>
            </b-row>
          </b-form-checkbox>
          <b-button-group>
            <b-button variant="outline-secondary" size="sm">
              <icon name="edit" size="2px"></icon>
            </b-button>
            <b-button variant="outline-danger" size="sm" @click="onDeleteTag(state)">
              <icon name="times" size="2px"></icon>
            </b-button>
          </b-button-group>
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
            <b-form-input type="text" v-model="newTag.value" :state="!$v.newTag.value.$invalid"></b-form-input>
          </b-input-group>
          <b-input-group prepend="Цвет:" class="mt-3">
            <b-form-input type="text" v-model="newTag.color" :state="!$v.newTag.color.$invalid"></b-form-input>
          </b-input-group>
        </div>
        <b-button
          variant="outline-success"
          class="w-50 mt-3"
          @click="onSubmitNewTag"
          :disabled="$v.newTag.$invalid"
        >Сохранить</b-button>
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
  PROJECT_TAGS_FETCH,
  PROJECT_TAG_DISCHARGE,
  PROJECT_TAG_ASSIGN,
  PROJECT_FETCH_ONE
} from '../../modules/projects';

import Icon from 'vue-awesome/components/Icon';

import { validationMixin } from 'vuelidate';
import { required, minLength } from 'vuelidate/lib/validators';

class TagState {
  public checked: boolean = false;
  public inProcess: boolean = false;
  public tag: ITag = new TagDefalult();
}

@Component({
  components: {
    Icon
  },
  mixins: [validationMixin],
  validations() {
    return {
      newTag: {
        value: {
          required,
          minLength: minLength(1)
        },
        color: {
          required,
          colorValid: (value: string) => /#[a-f0-9]{6}\b/gi.test(value)
        }
      }
    };
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

  public onChangeTagState(stateIndex: number) {
    const state = this.tagsState[stateIndex];
    if (state == null) {
      return;
    }

    Vue.set(this.tagsState, stateIndex, { ...state, inProcess: true });
    this.$store
      .dispatch(state.checked ? PROJECT_TAG_DISCHARGE : PROJECT_TAG_ASSIGN, {
        projectId: this.project.id,
        tagId: state.tag.id
      })
      .then(() => {
        Vue.set(this.tagsState, stateIndex, {
          ...state,
          checked: !state.checked,
          inProcess: false
        });
      })
      .then(() => {
        this.$store
          .dispatch(PROJECT_FETCH_ONE, this.project.id)
          .then((project) => {
            this.project.tags = project.tags;
          });
        this.$notify({
          title: 'Изменения успешно сохранены',
          duration: 500
        });
      })
      .catch((error) => {
        Vue.set(this.tagsState, stateIndex, { ...state, inProcess: false });
        this.$notify({
          title: 'Невозможно сохранить изменения',
          duration: 1500,
          type: 'error'
        });
      });
  }

  public onSubmitNewTag() {
    axios
      .post('projects/tags', this.newTag)
      .then((response) => {
        this.isNewTag = false;
        const tagState = new TagState();
        tagState.tag = response.data;
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
