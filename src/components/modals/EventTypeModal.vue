<!-- TEMPLATE BEGIN -->
<template>
  <div class="c-event-type-modal">
    <b-modal v-model="isModalVisible" @keydown.native.enter="onSubmitModal">
      <template slot="modal-title">
        Тип события
      </template>

      <b-form-group label="Название">
        <b-form-input type="text" v-model.trim="modalData.title" :state="!$v.modalData.title.$invalid">
        </b-form-input>
      </b-form-group>

      <b-form-group label="Описание">
        <b-form-input type="text" v-model.trim="modalData.description">
        </b-form-input>
      </b-form-group>

      <template slot="modal-footer">
        <button type="button" class="btn btn-secondary" @click="isModalVisible = false">Отменить</button>
        <button type="button" class="btn btn-primary" :disabled="$v.modalData.$invalid || isModalInProcess" @click="onSubmitModal">Подтвердить</button>
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
  IEventType,
  EventTypeDefault,
  EVENT_TYPE_COMMIT
} from '@/modules/events';

@Component({
  mixins: [validationMixin],
  validations: {
    modalData: {
      title: {
        required,
        minLength: minLength(1)
      }
    }
  }
})
export default class CEventTypeModal extends Vue {
  // v-modal //
  ////////////

  @Prop({
    default: false
  })
  public value!: boolean;

  // Properties //
  ///////////////

  @Prop({
    default: new EventTypeDefault()
  })
  public data!: IEventType;

  @Prop({
    default: (equipmentType: IEventType) => undefined
  })
  public onSubmit!: (equipmentType: IEventType) => void;

  @Prop({
    default: (error: any) => undefined
  })
  public onError!: (error: any) => void;

  public isModalInProcess: boolean = false;
  public modalData: IEventType = new EventTypeDefault();

  private visibilityStuff: boolean = false;

  // Component methods //
  //////////////////////

  public mounted() {
    this.$watch('value', (value: boolean) => {
      this.visibilityStuff = value;
    });

    this.$watch('data', (data: IEventType) => {
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
      .dispatch(EVENT_TYPE_COMMIT, this.modalData)
      .then((equipmentType: IEventType) => {
        this.$notify({
          title: 'Изменения успешно сохранены',
          duration: 500
        });
        this.onSubmit(equipmentType);
        this.isModalInProcess = false;
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