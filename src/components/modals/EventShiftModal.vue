<!-- TEMPLATE BEGIN -->
<template>
  <div class="c-event-shift-modal">
    <b-modal v-model="isModalVisible" @keydown.native.enter="onSubmitModal">
      <template slot="modal-title">
        Смена события
      </template>

      <b-form-group label="Начало">
        <date-picker class="w-100" :first-day-of-week="1" v-model="modalData.shift.beginTime" v-bind:input-class="getShiftModalCalendarClasses()" :format="$g.DATETIME_FORMAT" lang="ru" type="datetime" :minute-step="1">
        </date-picker>
      </b-form-group>

      <b-form-group label="Конец">
        <date-picker class="w-100" :first-day-of-week="1" v-model="modalData.shift.endTime" v-bind:input-class="getShiftModalCalendarClasses()" :format="$g.DATETIME_FORMAT" lang="ru" type="datetime" :minute-step="1"></date-picker>
      </b-form-group>

      <b-form-group label="Описание">
        <b-form-input type="text" v-model="modalData.shift.description">
        </b-form-input>
      </b-form-group>

      <b-row v-if="modalData.shift.new === true && !modalData.clone">
        <b-col cols="12" sm="6">
          <b-form-group label="Кол-во мест">
            <b-form-input type="number" autocomplete="off" v-model.number="modalData.placeCount" :state="!$v.modalData.placeCount.$invalid">
            </b-form-input>
          </b-form-group>
        </b-col>
        <b-col cols="12" sm="6">
          <b-form-group label="Кол-во человек на место">
            <b-form-input type="number" autocomplete="off" v-model.number="modalData.placeParticipantCount" :state="!$v.modalData.placeCount.$invalid">
            </b-form-input>
          </b-form-group>
        </b-col>
      </b-row>

      <b-row v-if="modalData.clone">
        <b-col>
          <b-form-checkbox class="noselect" v-model="modalData.cloneParticipants" :value="true" :unchecked-value="false">
            С участниками
          </b-form-checkbox>
        </b-col>
        <b-col>
          <b-form-checkbox class="noselect" v-model="modalData.cloneEquipment" :value="true" :unchecked-value="false">
            С оборудованием
          </b-form-checkbox>
        </b-col>
      </b-row>

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
import moment from 'moment-timezone';

import DatePicker from 'vue2-datepicker';

import { validationMixin } from 'vuelidate';
import { required, minLength } from 'vuelidate/lib/validators';

import { IEventShift, EventShiftDefault } from '@/modules/events';
import { clone } from '@/stuff';

export class EventShiftModalData {
  public visible: boolean = false;
  public shift: IEventShift = new EventShiftDefault();
  public shiftIndex: number | null = null;
  public clone: boolean = false;
  public cloneParticipants: boolean = false;
  public cloneEquipment: boolean = true;
  public placeCount: number | null = null;
  public placeParticipantCount: number | null = null;
}

const shiftRangeModalValidator = (component: CEventShiftModal) => {
  return () => {
    const shift = component.modalData.shift;
    return moment(shift.beginTime) <= moment(shift.endTime);
  };
};

@Component({
  components: {
    'date-picker': DatePicker
  },
  mixins: [validationMixin],
  validations() {
    return {
      modalData: {
        shift: {
          beginTime: {
            required,
            validRange: shiftRangeModalValidator(this as CEventShiftModal)
          },
          endTime: {
            required,
            validRange: shiftRangeModalValidator(this as CEventShiftModal)
          }
        },
        placeCount: {
          valid: (count: number | null) => count == null || count > 0
        },
        placeParticipantCount: {
          valid: (count: number | null) => count == null || count >= 0
        }
      }
    };
  }
})
export default class CEventShiftModal extends Vue {
  // v-modal //
  ////////////

  @Prop({
    default: false
  })
  public value!: EventShiftModalData;

  // Properties //
  ///////////////

  public modalData: EventShiftModalData = new EventShiftModalData();

  // Component methods //
  //////////////////////

  @Watch('value', {
    immediate: true
  })
  public onValueChanged(value: EventShiftModalData) {
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

  public getShiftModalCalendarClasses() {
    const baseClasses = 'form-control';

    const validationData = this.$v.modalData ? this.$v.modalData.shift : null;
    if (validationData == null) {
      return baseClasses;
    } else {
      return `${baseClasses} ${
        validationData.$invalid ? 'is-invalid' : 'is-valid'
      }`;
    }
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