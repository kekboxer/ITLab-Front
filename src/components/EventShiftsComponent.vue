<!-- TEMPLATE BEGIN -->
<template>
  <div class="event-shifts-component">
    <div class="shift" v-for="(shift, shiftIndex) in eventShifts" :key="`shift-${shiftIndex}`" v-if="!shift.delete">
      <b-row>
        <b-col cols="auto mr-auto" style="line-height: 31px;">
          <b>{{ shift.beginTime | moment(DATE_FORMAT) }}</b> &mdash;
          <b>{{ getShiftEndTime(shift) }}</b> ({{ getShiftDuration(shift) }})
        </b-col>
        <b-col cols="auto" v-if="editable">
          <b-button variant="outline-danger" class="btn-sm" @click="onRemoveShift(shiftIndex)" v-bind:disabled="!isShiftDeletionAllowed">Удалить
            <span class="d-none d-sm-inline"> смену</span>
          </b-button>
        </b-col>
      </b-row>
      <hr>
      <b-row>
        <b-col>
          <!--<draggable :list="shift.places" :options="{handle:'.drag-handle'}">-->
          <div v-for="(place, placeIndex) in shift.places" :key="`place-${placeIndex}`" class="place" v-if="!place.delete">
            <div class="place-title drag-handle">
              <b-row>
                <b-col cols="auto mr-auto" class="text">
                  Место #{{ placeIndex + 1}}
                </b-col>
                <b-col cols="auto" v-if="editable">
                  <b-button variant="danger" class="btn-sm" @click="onRemovePlace(shift, placeIndex)" v-bind:disabled="!isPlaceDeletionAllowed(shift)">Удалить место</b-button>
                </b-col>
              </b-row>
            </div>
            <div class="place-data">
              <b-row>
                <b-col cols="12" md="6">
                  <!--<pre>{{ place.users }}</pre>-->
                  <b-row v-if="editable">
                    <b-col>
                      <b-button variant="outline-primary" class="w-100" @click="/*showPlaceParticipantModal(place)*/">Добавить участника</b-button>
                    </b-col>
                  </b-row>
                </b-col>
                <b-col cols="12" md="6" class="mt-2 mt-md-0">
                  <!--<pre>{{ place.equipment }}</pre>-->
                  <b-row v-if="editable">
                    <b-col>
                      <b-button variant="outline-primary" class="w-100" @click="/*showPlaceEquipmentModal(place)*/">Добавить оборудование</b-button>
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>
            </div>
          </div>
          <!--</draggable>-->
        </b-col>
      </b-row>
      <b-button variant="outline-success" class="w-100" v-bind:class="{ 'mt-2': shift.places.filter(p => !p.delete).length != 0 }" @click="onAddPlace(shift)" v-if="editable">Добавить место</b-button>
    </div>

    <b-row>
      <b-col>
        <b-button variant="success" class="w-100" @click="showShiftModal()" v-if="editable">Добавить смену</b-button>
      </b-col>
    </b-row>

    <!-- SHIFT MODAL BEGIN -->
    <b-modal v-model="shiftModalShow">
      <template slot="modal-title">
        Новая смена
      </template>

      <b-form-group label="Начало">
        <date-picker :first-day-of-week="1" input-class="form-control w-100" v-model="shiftModalBeginTime" :format="DATE_FORMAT" lang="ru" type="datetime" :minute-step="1"></date-picker>
      </b-form-group>

      <b-form-group label="Конец">
        <date-picker :first-day-of-week="1" input-class="form-control w-100" v-model="shiftModalEndTime" :format="DATE_FORMAT" lang="ru" type="datetime" :minute-step="1"></date-picker>
      </b-form-group>

      <template slot="modal-footer">
        <b-button variant="secondary" @click="shiftModalShow = false">Отменить</b-button>
        <b-button variant="primary" :disabled="!isShiftCreationAllowed" @click="onAddShift(); shiftModalShow = false;">Подтвердить</b-button>
      </template>
    </b-modal>
    <!-- SHIFT MODAL END -->

    <!-- PARTICIPANT MODAL BEGIN -->
    <b-modal v-model="placeParticipantModalShow">
      <template slot="modal-title">
        Новый участник
      </template>

      <user-selection-component v-model="placeParticipantModalData"></user-selection-component>

      <template slot="modal-footer">
        <b-button variant="secondary" @click="placeParticipantModalShow = false">Отменить</b-button>
        <b-button variant="primary" :disabled="!isParticipantCreationAllowed" @click="onAddShift(); placeParticipantModalShow = false;">Подтвердить</b-button>
      </template>
    </b-modal>
    <!-- PARTICIPANT MODAL END -->

    <!-- EQUIPMENT MODAL BEGIN-->

    <!-- EQUIPMENT MODAL END -->    
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import moment from "moment-timezone";

import Draggable from "vuedraggable";
import DatePicker from "vue2-datepicker";
import UserSelectionComponent from "@/components/UserSelectionComponent.vue";

import {
  EventShift,
  EventShiftDefault,
  EventPlaceDefault,
  EventPlace
} from "@/store/modules/events/types";
import { UserDefault, User } from "@/store/modules/profile/types";

enum State {
  Default,
  InProcess,
  Error
}

@Component({
  components: {
    draggable: Draggable,
    "date-picker": DatePicker,
    "user-selection-component": UserSelectionComponent
  }
})
export default class EventShiftsComponent extends Vue {
  DATE_FORMAT = "DD.MM.YYYY HH:mm";
  TIME_FORMAT = "HH:mm";

  // v-model //
  ////////////

  @Prop() value?: EventShift[];

  // Properties //
  ///////////////

  @Prop() editable?: boolean;

  // Modal properties //
  /////////////////////

  shiftModalShow: boolean = false;
  shiftModalBeginTime: Date = new Date();
  shiftModalEndTime: Date = new Date();

  placeParticipantModalShow: boolean = false;
  placeParticipantModalData: User | null = null;
  
  // Methods //
  ////////////

  mounted() {
    this.$watch("value", (shifts?: EventShift[]) => {
      this.value = shifts ? shifts : [];
    });

    if (!this.value) {
      this.value = [];
    }
  }

  onInput() {
    if (!this.editable) {
      return;
    }
    this.$emit("input", this.value);
  }

  // Shift handlers //
  ///////////////////

  onAddShift() {
    if (!this.value) {
      this.value = [];
    }

    const shift = new EventShiftDefault();
    shift.beginTime = this.shiftModalBeginTime;
    shift.endTime = this.shiftModalEndTime;

    this.value.push(shift);
    this.onInput();
  }

  onRemoveShift(shiftIndex: number) {
    if (!this.value) {
      return;
    }

    const shift = this.value[shiftIndex];
    shift.delete = true;
    Vue.set(this.value, shiftIndex, shift);
    this.onInput();
  }

  showShiftModal() {
    this.shiftModalBeginTime = new Date(0);
    this.shiftModalEndTime = new Date(0);

    this.shiftModalShow = true;
  }

  get isShiftCreationAllowed(): boolean {
    return (
      this.shiftModalBeginTime &&
      this.shiftModalBeginTime != new Date(0) &&
      this.shiftModalEndTime &&
      this.shiftModalEndTime != new Date(0) &&
      this.shiftModalEndTime > this.shiftModalBeginTime
    );
  }

  // Place handlers //
  ///////////////////

  onAddPlace(shift: EventShift) {
    shift.places.push(new EventPlaceDefault());
    this.onInput();
  }

  onRemovePlace(shift: EventShift, placeIndex: number) {
    const place = shift.places[placeIndex];
    place.delete = true;
    Vue.set(shift.places, placeIndex, place);
    this.onInput();
  }

  // Place participant handlers //
  ///////////////////////////////

  showPlaceParticipantModal(place: EventPlace) {
    this.placeParticipantModalData = null;

    this.placeParticipantModalShow = true;
  }

  isParticipantCreationAllowed() {
    return this.placeParticipantModalData != undefined;
  }

  // Computed data //
  //////////////////

  getShiftEndTime(shift: EventShift): string {
    const shiftBeginDay = moment(shift.beginTime).startOf("day");
    const shiftEndDay = moment(shift.endTime).startOf("day");

    if (shiftBeginDay.isSame(shiftEndDay)) {
      return moment(shift.endTime).format(this.TIME_FORMAT);
    } else {
      return moment(shift.endTime).format(this.DATE_FORMAT);
    }
  }

  getShiftDuration(shift: EventShift): string {
    return moment
      .duration(moment(shift.endTime).diff(moment(shift.beginTime)))
      .humanize();
  }

  get isShiftDeletionAllowed(): boolean {
    return this.value != null && this.value.filter(v => !v.delete).length > 1;
  }

  isPlaceDeletionAllowed(shift: EventShift): boolean {
    return shift.places.filter(v => !v.delete).length > 1;
  }

  get eventShifts(): EventShift[] {
    return this.value
      ? this.value.sort((a, b) => {
          if (a.beginTime < b.beginTime) return -1;
          else if (a.beginTime > b.beginTime) return 1;
          else return 0;
        })
      : [];
  }
}
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
@import "@/styles/general.scss";

.event-shifts-component {
  .shift {
    display: block;
    width: 100%;
    padding: 0.75rem;
    font-size: 1rem;
    line-height: 1.5;
    color: #495057;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;

    @include theme-specific() {
      background-color: getstyle(form-control-background-color);
      border-color: darken(getstyle(form-control-background-color), 10%);
    }

    &:not(:last-child) {
      margin-bottom: 5px;
    }

    .place {
      margin-top: 5px;
      border: 1px solid darken(getcolor(white, base), 10%);
      border-radius: 0.25rem;

      .place-title {
        background-color: getcolor(white, base);
        padding: 0.375rem 0.75rem;

        .text {
          @extend .noselect;

          line-height: 31px;
          margin-left: 15px;
        }

        @include theme-specific() {
          background-color: getstyle(event-shifts-card-title-background);
          color: getstyle(event-shifts-card-title-font-color);
        }
      }

      .place-data {
        padding: 0.375rem 0.75rem;
      }
    }
  }
}
</style>
<!-- STYLE END -->