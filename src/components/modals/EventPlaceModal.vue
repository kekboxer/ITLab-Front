<!-- TEMPLATE BEGIN -->
<template>
  <div class="c-event-place-modal">
    <b-modal v-model="isModalVisible" @keydown.native.enter="onSubmitModal">
      <template slot="modal-title">
        Место в смене
      </template>

      <b-form-group label="Необходимое кол-во участников">
        <b-form-input type="number" v-model.number="modalData.place.targetParticipantsCount" :state="!$v.modalData.place.targetParticipantsCount.$invalid">
        </b-form-input>
      </b-form-group>

      <b-form-group label="Описание">
        <b-form-input type="text" v-model="modalData.place.description">
        </b-form-input>
      </b-form-group>

      <template slot="modal-footer">
        <button type="button" class="btn btn-secondary" @click="isModalVisible = false">Отменить</button>
        <button type="button" class="btn btn-primary" :disabled="$v.modalData.$invalid" @click="onSubmitModal">Подтвердить</button>
      </template>
    </b-modal>
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

import { validationMixin } from 'vuelidate';
import { required, minLength } from 'vuelidate/lib/validators';

import {
  IEventShift,
  EventShiftDefault,
  IEventPlace,
  EventPlaceDefault
} from '@/modules/events';
import { clone } from '@/stuff';

export class EventPlaceModalData {
  public visible: boolean = false;
  public place: IEventPlace = new EventPlaceDefault();
  public placeIndex: number | null = null;
  public shift: IEventShift = new EventShiftDefault();
}

@Component({
  mixins: [validationMixin],
  validations() {
    return {
      modalData: {
        place: {
          targetParticipantsCount: {
            required,
            valid: (count: number) => count >= 0
          }
        }
      }
    };
  }
})
export default class CEventPlaceModal extends Vue {
  // v-modal //
  ////////////

  @Prop({
    default: false
  })
  public value!: EventPlaceModalData;

  // Properties //
  ///////////////

  public modalData: EventPlaceModalData = new EventPlaceModalData();

  // Component methods //
  //////////////////////

  @Watch('value', {
    immediate: true
  })
  public onValueChanged(value: EventPlaceModalData) {
    this.modalData = clone(value);
  }

  // Methods //
  ////////////
  public onSubmitModal() {
    if (this.$v.modalData && this.$v.modalData.$invalid) {
      return;
    }

    this.$emit('input', this.modalData);
    this.$emit('onSubmit');
  }

  set isModalVisible(visible: boolean) {
    this.modalData.visible = true;
    this.$emit('input', {
      ...this.value,
      visible
    });
  }

  // Computed data //
  //////////////////

  get isModalVisible(): boolean {
    return this.modalData.visible;
  }
}
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
</style>
<!-- STYLE END -->