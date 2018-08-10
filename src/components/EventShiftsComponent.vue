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
          <b-button variant="warning" class="btn-sm" @click="showShiftModal(shiftIndex)">Изменить</b-button>
          <b-button variant="outline-danger" class="btn-sm" @click="onRemoveShift(shiftIndex)" v-bind:disabled="!canDeleteShift">
            <icon name="times" style="position: relative; top: -2px;"></icon>
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
                  <div class="remove-button" @click="onRemovePlace(shift, placeIndex)" v-if="canDeletePlace(shift)">
                    <icon name="times"></icon>
                  </div>
                </b-col>
              </b-row>
            </div>
            <div class="place-data">
              <b-row>
                <b-col cols="12" md="6">
                  <div class="list-group">
                    <li class="list-group-item" v-for="(participant, participantIndex) in place.participants" :key="`place-${placeIndex}-equipment-${participantIndex}`" v-if="!participant.delete">
                      <b-row>
                        <b-col cols="auto mr-auto">
                          <b>{{participant.user.firstName}} {{participant.user.lastName}}</b>
                          <span class="badge badge-primary badge-pill">{{ participant.role.name }}</span><br> {{ participant.user.email}}
                        </b-col>
                        <b-col cols="auto" v-if="editable">
                          <div class="remove-button" @click="onRemovePlaceParticipant(place, participantIndex)">
                            <icon name="times"></icon>
                          </div>
                        </b-col>
                      </b-row>
                    </li>
                    <li class="list-group-item list-group-item-action group-button" v-if="editable" @click="showPlaceParticipantModal(place)">
                      Добавить участника
                    </li>
                  </div>
                </b-col>
                <b-col cols="12" md="6" class="mt-2 mt-md-0">
                  <div class="list-group">
                    <li class="list-group-item" v-for="(equipment, equipmentIndex) in place.equipment" :key="`place-${placeIndex}-equipment-${equipmentIndex}`" v-if="!equipment.delete">
                      <b-row>
                        <b-col cols="auto mr-auto">
                          <b>{{ equipment.equipmentType.title }}</b><br>{{ equipment.serialNumber }}
                        </b-col>
                        <b-col cols="auto" v-if="editable">
                          <div class="remove-button" @click="onRemovePlaceEquipment(place, equipmentIndex)">
                            <icon name="times"></icon>
                          </div>
                        </b-col>
                      </b-row>
                    </li>
                    <li class="list-group-item list-group-item-action group-button" v-if="editable" @click="showPlaceEquipmentModal(place)">
                      Добавить оборудование
                    </li>
                  </div>
                </b-col>
              </b-row>
            </div>
          </div>
          <!--</draggable>-->
        </b-col>
      </b-row>
      <b-button variant="outline-success" class="w-100 mt-2 theme-light-only" @click="onAddPlace(shift)" v-if="editable">Добавить место</b-button>
      <b-button variant="success" class="w-100 mt-2 theme-dark-only" @click="onAddPlace(shift)" v-if="editable">Добавить место</b-button>
    </div>

    <b-row>
      <b-col>
        <b-button variant="success" class="w-100" @click="showShiftModal()" v-if="editable">Добавить смену</b-button>
      </b-col>
    </b-row>

    <!-- MODAL BEGIN -->
    <b-modal v-model="modalShow">
      <template slot="modal-title">
        {{ modalTitle }}
      </template>

      <template v-if="fieldsVisivility.shift">
        <b-form-group label="Начало">
          <date-picker :first-day-of-week="1" input-class="form-control w-100" v-model="shiftModalData.beginTime" :format="DATE_FORMAT" lang="ru" type="datetime" :minute-step="1">
          </date-picker>
        </b-form-group>

        <b-form-group label="Конец">
          <date-picker :first-day-of-week="1" input-class="form-control w-100" v-model="shiftModalData.endTime" :format="DATE_FORMAT" lang="ru" type="datetime" :minute-step="1"></date-picker>
        </b-form-group>
      </template>

      <template v-if="fieldsVisivility.participant">
        <b-form-group label="Участник">
          <user-selection-component v-model="placeParticipantModalData.user"></user-selection-component>
        </b-form-group>

        <b-form-group label="Роль">
          <b-form-select v-model="placeParticipantModalData.role" :options="participantRoleOptions"></b-form-select>
        </b-form-group>
      </template>

      <template v-if="fieldsVisivility.equipment">
        <b-form-group label="Оборудование">
          <equipment-selection-component v-model="placeEquipmentModalData"></equipment-selection-component>
        </b-form-group>
      </template>

      <template slot="modal-footer">
        <b-button variant="secondary" @click="modalShow = false">Отменить</b-button>
        <b-button variant="primary" :disabled="!isModalDataInvalid" @click="modalSubmission(); modalShow = false">Подтвердить</b-button>
      </template>
    </b-modal>
    <!-- TEMPALTE END -->
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import moment from "moment-timezone";
import axios from "axios";

import Draggable from "vuedraggable";
import DatePicker from "vue2-datepicker";
import Icon from "vue-awesome/components/Icon";
import UserSelectionComponent from "@/components/UserSelectionComponent.vue";
import EquipmentSelectionComponent from "@/components/EquipmentSelectionComponent.vue";

import "vue-awesome/icons/times";

import {
  EventShift,
  EventShiftDefault,
  EventPlaceDefault,
  EventPlace,
  EventParticipant,
  EventEquipment,
  EventUserRoleDefault,
  EventUserRole
} from "@/store/modules/events/types";
import { UserDefault, User } from "@/store/modules/profile/types";
import { Equipment } from "@/store/modules/equipment/types";

enum ModalState {
  Hidden,
  ShiftEdit,
  ShiftCreation,
  ParticipantAdding,
  EquipmentAdding
}

@Component({
  components: {
    icon: Icon,
    draggable: Draggable,
    "date-picker": DatePicker,
    "user-selection-component": UserSelectionComponent,
    "equipment-selection-component": EquipmentSelectionComponent
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

  modalTitles: Map<ModalState, string> = new Map<ModalState, string>([
    [ModalState.Hidden, ""],
    [ModalState.ShiftEdit, "Изменение смены"],
    [ModalState.ShiftCreation, "Новая смена"],
    [ModalState.ParticipantAdding, "Добавление участника"],
    [ModalState.EquipmentAdding, "Добавление оборудования"]
  ]);

  modalState: ModalState = ModalState.Hidden;

  modalSubmission: () => void = () => {};

  shiftModalData: {
    id?: string;
    beginTime: Date | null;
    endTime: Date | null;
  } = { beginTime: null, endTime: null };

  placeParticipantModalData: {
    user: User | null;
    role: EventUserRole | null;
  } = { user: null, role: null };

  placeEquipmentModalData: Equipment | null = null;

  participantRoleOptions: { value: EventUserRole; text: string }[] = [];

  // Component methods //
  //////////////////////

  mounted() {
    this.$watch("value", (shifts?: EventShift[]) => {
      this.value = shifts ? shifts : [];
    });

    this.fetchUserRoles().then(result => {
      const participantRoles: EventUserRole[] = result as EventUserRole[];
      this.participantRoleOptions = participantRoles.map(v => {
        return { value: v, text: v.name };
      });
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

  // Modal //
  //////////

  get modalShow(): boolean {
    return this.modalState != ModalState.Hidden;
  }
  set modalShow(show: boolean) {
    if (!show) {
      this.modalState = ModalState.Hidden;
    }
  }

  get fieldsVisivility(): {
    shift: boolean;
    participant: boolean;
    equipment: boolean;
  } {
    return {
      shift: [ModalState.ShiftEdit, ModalState.ShiftCreation].includes(
        this.modalState
      ),
      participant: this.modalState == ModalState.ParticipantAdding,
      equipment: this.modalState == ModalState.EquipmentAdding
    };
  }

  get modalTitle(): string {
    const title = this.modalTitles.get(this.modalState);
    return title ? title : "";
  }

  get isModalDataInvalid(): boolean {
    switch (this.modalState) {
      case ModalState.ShiftEdit:
      case ModalState.ShiftCreation:
        return this.isModalShiftValid;

      case ModalState.ParticipantAdding:
        return this.isModalPlaceParticipantValid;

      case ModalState.EquipmentAdding:
        return this.isModalPlaceEquipmentValid;

      default:
        return false;
    }
  }

  // Shift handlers //
  ///////////////////

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

  onEditShift(shiftIndex?: number) {
    if (
      (shiftIndex && !this.value) ||
      this.shiftModalData.beginTime == null ||
      this.shiftModalData.endTime == null
    ) {
      return;
    }

    if (!this.value) {
      this.value = [];
    }

    const shift = shiftIndex ? this.value[shiftIndex] : new EventShiftDefault();
    shift.beginTime = this.shiftModalData.beginTime;
    shift.endTime = this.shiftModalData.endTime;

    if (shiftIndex) {
      Vue.set(this.value, shiftIndex, shift);
    } else {
      this.value.push(shift);
    }
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

  canDeleteShift(): boolean {
    return this.value != null && this.value.filter(v => !v.delete).length > 1;
  }

  showShiftModal(shiftIndex: number | undefined) {
    let newState: ModalState;

    console.log(shiftIndex);

    if (shiftIndex != null) {
      if (!this.value) return;

      const shift = this.value[shiftIndex];
      this.shiftModalData = {
        beginTime: shift.beginTime,
        endTime: shift.endTime
      };

      newState = ModalState.ShiftEdit;
      this.modalSubmission = () => this.onEditShift(shiftIndex);
    } else {
      this.shiftModalData = {
        beginTime: null,
        endTime: null
      };

      newState = ModalState.ShiftCreation;
      this.modalSubmission = this.onEditShift;
    }

    this.modalState = newState;
  }

  get isModalShiftValid(): boolean {
    return (
      this.shiftModalData.beginTime != null &&
      this.shiftModalData.endTime != null &&
      this.shiftModalData.endTime > this.shiftModalData.beginTime
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

  canDeletePlace(shift: EventShift): boolean {
    return shift.places.filter(v => !v.delete).length > 1;
  }

  // Place participant handlers //
  ///////////////////////////////

  onAddPlaceParticipant(place: EventPlace) {
    if (
      !this.placeParticipantModalData.user ||
      !this.placeParticipantModalData.role
    ) {
      return;
    }

    const participant: EventParticipant = {
      user: this.placeParticipantModalData.user,
      role: this.placeParticipantModalData.role
    };
    place.participants.push(participant);
    this.onInput();
  }

  onRemovePlaceParticipant(place: EventPlace, participantIndex: number) {
    const participant = place.participants[participantIndex];
    participant.delete = true;
    Vue.set(place.participants, participantIndex, participant);
    this.onInput();
  }

  showPlaceParticipantModal(place: EventPlace) {
    this.placeParticipantModalData = { user: null, role: null };
    this.modalSubmission = () => this.onAddPlaceParticipant(place);
    this.modalState = ModalState.ParticipantAdding;
  }

  get isModalPlaceParticipantValid(): boolean {
    // TODO: check existance of selected user in participants
    return (
      this.placeParticipantModalData.user != null &&
      this.placeParticipantModalData.role != null
    );
  }

  // Place equipment handlers //
  /////////////////////////////

  onAddPlaceEquipment(place: EventPlace) {
    if (!this.placeEquipmentModalData) {
      return;
    }

    place.equipment.push(this.placeEquipmentModalData);
    this.onInput();
  }

  onRemovePlaceEquipment(place: EventPlace, equipmentIndex: number) {
    const equipment = place.equipment[equipmentIndex];
    equipment.delete = true;
    Vue.set(place.equipment, equipmentIndex, equipment);
    this.onInput();
  }

  showPlaceEquipmentModal(place: EventPlace) {
    this.placeEquipmentModalData = null;
    this.modalSubmission = () => this.onAddPlaceEquipment(place);
    this.modalState = ModalState.EquipmentAdding;
  }

  get isModalPlaceEquipmentValid(): boolean {
    // TODO: check existance of selected equipment in place equipment
    return this.placeEquipmentModalData != null;
  }

  // Computed data //
  //////////////////

  fetchUserRoles() {
    return new Promise((resolve, reject) => {
      axios
        .get("roles")
        .then(response => {
          const body = response.data;
          if (body.statusCode == 1) {
            const roles: EventUserRole[] = body.data;
            resolve(roles);
          } else {
            reject();
          }
        })
        .catch(err => {
          reject(err);
        });
    });
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

      .remove-button {
        @extend .noselect;
        cursor: pointer;

        transition: color 0.15s ease-in-out;

        svg {
          position: relative;
          top: -2px;
        }

        &:hover {
          color: var(--danger);
        }
      }

      .place-title {
        background-color: getcolor(white, base);
        padding: 0.375rem 0.75rem;

        .text {
          @extend .noselect;
          margin-left: 15px;
        }

        @include theme-specific() {
          background-color: getstyle(event-shifts-card-title-background);
          color: getstyle(event-shifts-card-title-font-color);
        }
      }

      .place-data {
        padding: 0.375rem 0.75rem;

        .list-group-item {
          @include theme-specific() {
            background-color: getstyle(event-shifts-card-items-background);
          }
        }

        .list-group-item:hover,
        .list-group-item:focus {
          z-index: 0;
        }

        .list-group .group-button {
          @extend .noselect;

          cursor: pointer;
          color: var(--primary);
          text-align: center;

          padding: 0.375rem 0.75rem;
          border-color: var(--primary);

          transition: color 0.15s ease-in-out,
            background-color 0.15s ease-in-out, border-color 0.15s ease-in-out,
            box-shadow 0.15s ease-in-out, -webkit-box-shadow 0.15s ease-in-out;

          &:hover {
            color: #fff;
            background-color: var(--primary);
          }
        }
      }
    }
  }
}
</style>
<!-- STYLE END -->