<!-- TEMPLATE BEGIN -->
<template>
  <div class="c-event-equipment-modal">
    <b-modal v-model="isModalVisible" @keydown.native.enter="onSubmitModal">
      <template slot="modal-title">
        Оборудование
      </template>

      <b-form-group label="Оборудование">
        <equipment-selection v-model="modalData.equipment" :filter="onFilter" :state="!$v.modalData.equipment.$invalid"></equipment-selection>
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

import CEquipmentSelection from '@/components/selectors/EquipmentSelection.vue';

import { validationMixin } from 'vuelidate';
import { required, minLength } from 'vuelidate/lib/validators';

import {
  IEventShift,
  EventShiftDefault,
  IEventPlace,
  EventPlaceDefault,
  IEventEquipment
} from '@/modules/events';
import { EquipmentDefault, IEquipment } from '@/modules/equipment';
import { clone } from '@/stuff';

export class EventEquipmentModalData {
  public visible: boolean = false;
  public equipment: IEventEquipment = new EquipmentDefault();
  public place: IEventPlace = new EventPlaceDefault();
  public shift: IEventShift = new EventShiftDefault();
}

@Component({
  components: {
    'equipment-selection': CEquipmentSelection
  },
  mixins: [validationMixin],
  validations() {
    return {
      modalData: {
        equipment: {
          required,
          selected: (equipment?: IEventEquipment) =>
            equipment && equipment.id !== ''
        }
      }
    };
  }
})
export default class CEventEquipmentModal extends Vue {
  // v-modal //
  ////////////

  @Prop({
    default: false
  })
  public value!: EventEquipmentModalData;

  // Properties //
  ///////////////

  public modalData: EventEquipmentModalData = new EventEquipmentModalData();

  // Component methods //
  //////////////////////

  @Watch('value', {
    immediate: true
  })
  public onValueChanged(value: EventEquipmentModalData) {
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

  public onFilter(equipment: IEquipment) {
    return !this.modalData.shift.places.some((p) =>
      p.equipment.some((e) => e.delete !== true && e.id === equipment.id)
    );
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