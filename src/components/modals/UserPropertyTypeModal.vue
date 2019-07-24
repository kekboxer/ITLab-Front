<!-- TEMPLATE BEGIN -->
<template>
  <div class="c-user-property-type-modal">
    <b-modal v-model="isModalVisible" @keydown.native.enter="onSubmitModal">
      <template slot="modal-title">Тип параметра пользователя</template>

      <b-form-group label="Название">
        <b-form-input
          type="text"
          v-model.trim="modalData.name"
          :state="!$v.modalData.name.$invalid"
        ></b-form-input>
      </b-form-group>

      <b-form-group label="Описание">
        <b-form-input type="text" v-model.trim="modalData.description"></b-form-input>
      </b-form-group>

      <template slot="modal-footer">
        <button type="button" class="btn btn-secondary" @click="isModalVisible = false">Отменить</button>
        <button
          type="button"
          class="btn btn-primary"
          :disabled="$v.modalData.$invalid || isModalInProcess"
          @click="onSubmitModal"
        >Подтвердить</button>
      </template>
    </b-modal>
  </div>
</template>
<!-- TEMPLATE END -->

<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import { validationMixin } from 'vuelidate';
import { required, minLength } from 'vuelidate/lib/validators';

import {
  IUserPropertyType,
  UserPropertyTypeDefault,
  USER_PROPERTY_TYPE_COMMIT,
  USER_PROPERTY_TYPES_FETCH_ALL
} from '@/modules/users';

@Component({
  mixins: [validationMixin],
  validations: {
    modalData: {
      name: {
        required,
        minLength: minLength(1)
      }
    }
  }
})
export default class CUserPropertyTypeModal extends Vue {
  // v-modal //
  ////////////

  @Prop({
    default: false
  })
  public value!: boolean;

  // Properties //
  ///////////////

  @Prop({
    default: new UserPropertyTypeDefault()
  })
  public data!: IUserPropertyType;

  @Prop({
    default: (userPropertyType: IUserPropertyType) => undefined
  })
  public onSubmit!: (userPropertyType: IUserPropertyType) => void;

  @Prop({
    default: (error: any) => undefined
  })
  public onError!: (error: any) => void;

  public isModalInProcess: boolean = false;
  public modalData: IUserPropertyType = new UserPropertyTypeDefault();

  private visibilityStuff: boolean = false;

  // Component methods //
  //////////////////////

  public mounted() {
    this.$watch('value', (value: boolean) => {
      this.visibilityStuff = value;
    });

    this.$watch('data', (data: IUserPropertyType) => {
      this.modalData = data;
    });
  }

  // Methods //
  ////////////

  public onSubmitModal() {
    if (
      (this.$v.modalData && this.$v.modalData.$invalid) ||
      this.isModalInProcess
    ) {
      return;
    }

    this.isModalInProcess = true;
    this.$store
      .dispatch(USER_PROPERTY_TYPE_COMMIT, this.modalData)
      .then((userPropertyType: IUserPropertyType) => {
        this.$notify({
          title: 'Изменения успешно сохранены',
          duration: 500
        });
        this.onSubmit(userPropertyType);
        // Fetch all types, because after the change an empty element is created (temporarily?)
        this.$store.dispatch(USER_PROPERTY_TYPES_FETCH_ALL),
          (this.isModalInProcess = false);
      })
      .catch((error) => {
        this.$notify({
          title: 'Невозможно сохранить изменения',
          type: 'error',
          duration: 1500
        });
        this.onError(error);
        this.isModalInProcess = false;
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
</style>
<!-- STYLE END -->