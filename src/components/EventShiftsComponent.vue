<!-- TEMPLATE BEGIN -->
<template>
  <div class="event-shifts-component">
    <div
      class="shift"
      v-for="(shift, shiftIndex) in eventShifts"
      :key="`shift-${shiftIndex}`"
      v-if="!shift.delete"
    >
      <b-row>
        <b-col
          cols="auto"
          class="noselect"
          style="cursor: pointer"
          @click="toggleShift(shiftIndex)"
        >
          <div style="min-width: 31px; text-align: center;">
            <icon
              name="caret-right"
              style="position: relative; top: -2px;"
              v-if="isShiftCollapsed(shift)"
            ></icon>
            <icon name="caret-down" style="position: relative; top: -2px;" v-else></icon>
          </div>
        </b-col>
        <b-col class="text-right text-md-left">
          <b-row>
            <b-col style>
              <b>{{ getShiftBeginTime(shift) }}</b> &mdash;
              <b>{{ getShiftEndTime(shift) }}</b>
              ({{ getShiftDuration(shift) }})
            </b-col>
          </b-row>
          <b-row v-if="shift.description">
            <b-col>{{ shift.description }}</b-col>
          </b-row>
        </b-col>
        <salary-item :id="shift.id" :editable="editable" :salary="getShiftSalary(shift.id)" @salaryCommit="salaryShiftCommit"></salary-item>
        <b-col
          cols="12"
          md="auto"
          class="ml-md-1 mt-2 mt-md-0 d-flex align-content-between align-items-start"
          v-if="editable"
        >
          
          <b-button
            variant="outline-secondary"
            class="btn-sm w-100 mr-1 order-2 order-md-1"
            @click="showShiftModal(shiftIndex, true)"
          >Клонировать</b-button>
          <b-button
            variant="warning"
            class="btn-sm w-100 mr-md-1 order-3 order-md-2"
            @click="showShiftModal(shiftIndex)"
          >Изменить</b-button>
          <b-button
            variant="outline-danger"
            class="btn-sm w-100 mr-1 mr-md-0 order-1 order-md-3"
            @click="onRemoveShift(shiftIndex)"
            v-bind:disabled="!canDeleteShift"
          >
            <icon name="times" class="d-none d-md-inline" style="position: relative; top: -2px;"></icon>
            <span class="d-inline d-md-none">Удалить</span>
          </b-button>
        </b-col>
      </b-row>
      <template v-if="!isShiftCollapsed(shift)">
        <hr />
        <b-row>
          <b-col>
            <div
              v-for="(place, placeIndex) in shift.places"
              :key="place.id"
              class="place"
              v-if="!place.delete"
            >
              <div class="place-title drag-handle">
                <b-row>
                  <b-col
                    cols="auto"
                    class="noselect"
                    style="cursor: pointer"
                    @click="togglePlace(shift, placeIndex)"
                  >
                    <div style="min-width: 31px; text-align: center; line-height: 31px">
                      <icon
                        name="caret-right"
                        style="position: relative; top: -2px;"
                        v-if="isPlaceCollapsed(place)"
                      ></icon>
                      <icon name="caret-down" style="position: relative; top: -2px;" v-else></icon>
                    </div>
                  </b-col>
                  <b-col class="text-right text-md-left mb-2 mb-md-0">
                    <b-row>
                      <b-col
                        style="line-height: 31px"
                      >Место #{{ placeIndex + 1}} | {{ getPlaceTargetParticipantsCount(place) }}</b-col>
                    </b-row>
                    <b-row v-if="place.description">
                      <b-col>{{ place.description }}</b-col>
                    </b-row>
                  </b-col>
                  <b-col
                    cols="12"
                    md="auto"
                    class="ml-md-1 mt-1 mt-md-0 d-flex align-content-between align-items-start"
                  >
                  <salary-item
                        :id="place.id"
                        :editable="editable"
                        :salary="getPlaceSalary(place.id, getShiftSalary(shift.id))"
                        @salaryCommit="salaryPlaceCommit"
                      ></salary-item>
                    <template v-if="editable">
                      <b-button
                        variant="outline-secondary"
                        class="btn-sm w-100 mr-md-1 order-2 order-md-1"
                        @click="showPlaceModal(shift, placeIndex)"
                      >Изменить</b-button>
                      <b-button
                        variant="outline-secondary"
                        class="btn-sm w-100 mr-1 mr-md-0 order-1 order-md-2"
                        @click="removePlace(shift, placeIndex)"
                        v-if="canDeletePlace(shift)"
                      >
                        <icon
                          name="times"
                          class="d-none d-md-inline"
                          style="position: relative; top: -2px;"
                        ></icon>
                        <span class="d-inline d-md-none">Удалить</span>
                      </b-button>
                    </template>
                    <template v-else>
                      <b-button
                        variant="outline-secondary"
                        class="btn-sm w-100 theme-light-only"
                        @click="showApplicationModal(shift, placeIndex)"
                      >Подать заявку</b-button>
                      <b-button
                        variant="secondary"
                        class="btn-sm w-100 theme-dark-only"
                        @click="showApplicationModal(shift, placeIndex)"
                      >Подать заявку</b-button>
                    </template>
                  </b-col>
                </b-row>
              </div>
              <div class="place-data" v-if="!isPlaceCollapsed(place)">
                <b-row>
                  <b-col cols="12" md="6">
                    <div class="list-group">
                      <!-- Accepted participants -->
                      <li
                        class="list-group-item"
                        v-for="(participant, participantIndex) in place.participants"
                        :key="`place-${placeIndex}-participant-${participantIndex}`"
                      >
                        <b-row v-if="!participant.delete">
                          <b-col cols="auto mr-auto">
                            <b-link :to="`/profile/${participant.user.id}`" class="profile-link">
                              <b>{{participant.user.lastName}} {{participant.user.firstName}} {{participant.user.middleName}}</b>
                            </b-link>
                            <span
                              class="badge badge-success badge-pill noselect"
                              v-b-tooltip.hover
                              title="Подтверждённый"
                            >{{ participant.eventRole.title }}</span>
                            <br />
                            <mail-link :email="participant.user.email" />
                          </b-col>
                          <b-col cols="auto" v-if="editable">
                            <div
                              class="remove-button"
                              @click="removePlaceParticipant(place.participants, participantIndex)"
                            >
                              <icon name="times"></icon>
                            </div>
                          </b-col>
                        </b-row>
                      </li>

                      <!-- Invited participants -->
                      <li
                        class="list-group-item"
                        v-for="(participant, participantIndex) in place.invited"
                        :key="`place-${placeIndex}-invited-${participantIndex}`"
                      >
                        <b-row v-if="!participant.delete">
                          <b-col cols="auto mr-auto">
                            <b-link :to="`/profile/${participant.user.id}`" class="profile-link">
                              <b>{{participant.user.lastName}} {{participant.user.firstName}} {{participant.user.middleName}}</b>
                            </b-link>
                            <span
                              class="badge badge-warning badge-pill noselect"
                              v-b-tooltip.hover
                              title="Не подтверждённый"
                            >{{ participant.eventRole.title }}</span>
                            <br />
                            <mail-link :email="participant.user.email" />
                          </b-col>
                          <b-col cols="auto" v-if="editable">
                            <div
                              class="remove-button"
                              @click="removePlaceParticipant(place.invited, participantIndex)"
                            >
                              <icon name="times"></icon>
                            </div>
                          </b-col>
                        </b-row>
                      </li>

                      <!-- Participants, who just applied -->
                      <li
                        class="list-group-item"
                        v-for="(participant, participantIndex) in place.wishers"
                        :key="`place-${placeIndex}-wishers-${participantIndex}`"
                      >
                        <b-row v-if="!participant.delete">
                          <b-col cols="auto mr-auto">
                            <b-link :to="`/profile/${participant.user.id}`" class="profile-link">
                              <b>{{participant.user.lastName}} {{participant.user.firstName}} {{participant.user.middleName}}</b>
                            </b-link>
                            <span
                              class="badge badge-secondary badge-pill noselect"
                              v-b-tooltip.hover
                              title="Подал заявку"
                            >{{ participant.eventRole.title }}</span>
                            <br />
                            <mail-link :email="participant.user.email" />
                          </b-col>
                        </b-row>
                      </li>

                      <li
                        class="list-group-item list-group-item-action group-button"
                        v-if="editable"
                        @click="showPlaceInvitedParticipantModal(place)"
                      >Пригласить участника</li>
                    </div>
                  </b-col>
                  <b-col cols="12" md="6" class="mt-2 mt-md-0">
                    <div class="list-group">
                      <li
                        class="list-group-item"
                        v-for="(equipment, equipmentIndex) in place.equipment"
                        :key="`place-${placeIndex}-equipment-${equipmentIndex}`"
                        v-if="!equipment.delete"
                      >
                        <b-row>
                          <b-col cols="auto mr-auto">
                            <b>{{ equipment.equipmentType.title }}</b>
                            <br />
                            {{ equipment.serialNumber }}
                          </b-col>
                          <b-col cols="auto" v-if="editable">
                            <div
                              class="remove-button"
                              @click="removePlaceEquipment(place, equipmentIndex)"
                            >
                              <icon name="times"></icon>
                            </div>
                          </b-col>
                        </b-row>
                      </li>
                      <li
                        class="list-group-item list-group-item-action group-button"
                        v-if="editable"
                        @click="showPlaceEquipmentModal(shift, place)"
                      >Добавить оборудование</li>
                    </div>
                  </b-col>
                </b-row>
              </div>
            </div>
          </b-col>
        </b-row>
        <b-button
          variant="outline-success"
          class="w-100 mt-2 theme-light-only"
          @click="showPlaceModal(shift)"
          v-if="editable"
        >Добавить место</b-button>
        <b-button
          variant="success"
          class="w-100 mt-2 theme-dark-only"
          @click="showPlaceModal(shift)"
          v-if="editable"
        >Добавить место</b-button>
      </template>
    </div>

    <b-row>
      <b-col>
        <b-button
          variant="success"
          class="w-100"
          @click="showShiftModal()"
          v-if="editable"
        >Добавить смену</b-button>
      </b-col>
    </b-row>

    <event-shift-modal v-model="shiftModalData" @onSubmit="onSubmitShift" />
    <event-place-modal v-model="placeModalData" @onSubmit="onSubmitPlace" />
    <event-equipment-modal v-model="equipmentModalData" @onSubmit="onSubmitEquipment" />
    <event-participant-modal v-model="participantModalData" @onSubmit="onSubmitParticipant" />
    <event-application-modal v-model="applicationModalData" />
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import moment from 'moment-timezone';
import axios from 'axios';

import Icon from 'vue-awesome/components/Icon';
import CMailLink from '@/components/stuff/MailLink.vue';
import CUserSelection from '@/components/selectors/UserSelection.vue';
import CSalaryItem from '@/components/SalaryItem.vue';

import CEventShiftModal, {
  EventShiftModalData
} from '@/components/modals/EventShiftModal.vue';

import CEventPlaceModal, {
  EventPlaceModalData
} from '@/components/modals/EventPlaceModal.vue';

import CEventEquipmentModal, {
  EventEquipmentModalData
} from '@/components/modals/EventEquipmentModal.vue';

import CEventParticipantModalData, {
  EventParticipantModalData
} from '@/components/modals/EventParticipantModal.vue';

import CEventApplicationModal, {
  EventApplicationModalData
} from '@/components/modals/EventApplicationModal.vue';

import 'vue-awesome/icons/times';
import 'vue-awesome/icons/caret-right';
import 'vue-awesome/icons/caret-down';

import {
  IEventShift,
  EventShiftDefault,
  IEventPlace,
  EventPlaceDefault,
  IEventEquipment,
  IEventParticipant,
  cloneEventPlace
} from '@/modules/events';

import { IShiftSalary, IPlaceSalary } from '@/modules/salary';

import { getNounDeclension } from '@/stuff';

//  ⛧             \_/       ⛧            ⛧
//           ⛧ \\/._.\//           ⛧            ⛧
// A te, de l’essere principio immenso, materia e spirito, ragione e senso
// Mentre ne’ calici il vin scintilla si’come l’anima ne la pupilla
// Mentre sorridono la terra e il sole e si ricambiano d’amor parol

@Component({
  components: {
    icon: Icon,
    'mail-link': CMailLink,
    'event-shift-modal': CEventShiftModal,
    'event-place-modal': CEventPlaceModal,
    'event-equipment-modal': CEventEquipmentModal,
    'event-participant-modal': CEventParticipantModalData,
    'event-application-modal': CEventApplicationModal,
    'salary-item': CSalaryItem
  }
})
export default class EventShiftsComponent extends Vue {
  // v-model //
  ////////////

  @Prop()
  public value?: IEventShift[];

  // Properties //
  ///////////////

  @Prop()
  public editable?: boolean;

  @Prop()
  public shiftSalaries?: IShiftSalary[];

  @Prop()
  public placeSalaries?: IPlaceSalary[];

  @Prop()
  public eventSalaryCount?: any;

  // Modal data //
  ///////////////
  public shiftModalData: EventShiftModalData = new EventShiftModalData();
  public placeModalData: EventPlaceModalData = new EventPlaceModalData();
  public equipmentModalData: EventEquipmentModalData = new EventEquipmentModalData();
  public participantModalData: EventParticipantModalData = new EventParticipantModalData();
  public applicationModalData: EventApplicationModalData = new EventApplicationModalData();

  // Component methods //
  //////////////////////

  public mounted() {
    this.$watch('value', (shifts?: IEventShift[]) => {
      this.value = shifts ? shifts : [];
    });
    if (!this.value) {
      this.value = [];
    }
  }

  public onInput() {
    if (!this.editable) {
      return;
    }
    this.$emit('input', this.value);
  }

  // Shift handlers //
  ///////////////////

  public getShiftBeginTime(shift: IEventShift): string {
    return moment(shift.beginTime).format(this.$g.DATETIME_WEEKDAY_FORMAT);
  }

  public getShiftEndTime(shift: IEventShift): string {
    const shiftBeginDay = moment(shift.beginTime).startOf('day');
    const shiftEndDay = moment(shift.endTime).startOf('day');

    if (shiftBeginDay.isSame(shiftEndDay)) {
      return moment(shift.endTime).format(this.$g.TIME_FORMAT);
    } else {
      return moment(shift.endTime).format(this.$g.DATETIME_WEEKDAY_FORMAT);
    }
  }

  public getShiftDuration(shift: IEventShift): string {
    return moment
      .duration(moment(shift.endTime).diff(moment(shift.beginTime)))
      .humanize();
  }

  public onSubmitShift() {
    if (!this.value) {
      this.value = [];
    }

    const shiftIndex = this.shiftModalData.shiftIndex;
    const isNew = shiftIndex == null || this.shiftModalData.clone;

    const shift = isNew ? new EventShiftDefault() : this.value[shiftIndex!];

    shift.beginTime = this.shiftModalData.shift.beginTime;
    shift.endTime = this.shiftModalData.shift.endTime;
    shift.description = this.shiftModalData.shift.description;

    if (this.shiftModalData.clone) {
      shift.places = this.shiftModalData.shift.places.reduce(
        (places, place) => {
          if (place.delete === true) {
            return places;
          } else {
            return places.concat(cloneEventPlace(place, this.shiftModalData));
          }
        },
        new Array<IEventPlace>()
      );
    } else if (shiftIndex == null) {
      const createPlace = () => {
        const place: IEventPlace = new EventPlaceDefault();
        place.targetParticipantsCount =
          this.shiftModalData.placeParticipantCount || 0;
        return place;
      };

      const placeCount = ((x) => (x && x > 0 ? x : 1))(
        this.shiftModalData.placeCount
      );

      shift.places = [];
      for (let i = 0; i < placeCount; ++i) {
        shift.places.push({
          ...createPlace(),
          new: true
        });
      }
    }

    if (isNew) {
      this.value.push({ ...shift, new: true });
    } else {
      Vue.set(this.value, shiftIndex!, shift);
    }

    this.onInput();
    this.shiftModalData.visible = false;
  }

  public onRemoveShift(shiftIndex: number) {
    if (!this.value || !confirm('Вы действительно хотите удалить смену?')) {
      return;
    }

    const shift = this.value[shiftIndex];
    if (shift.new === true) {
      Vue.delete(this.value, shiftIndex);
    } else {
      shift.delete = true;
      Vue.set(this.value, shiftIndex, shift);
    }
    this.onInput();
  }

  public canDeleteShift(): boolean {
    return this.value != null && this.value.filter((v) => !v.delete).length > 1;
  }

  public showShiftModal(shiftIndex: number | null, clone: boolean = false) {
    if (!this.value) {
      return;
    }

    const modalData = new EventShiftModalData();
    modalData.clone = clone;
    modalData.shiftIndex = shiftIndex;

    // edit or clone
    if (shiftIndex != null) {
      const shift = this.value[shiftIndex];

      modalData.shift.beginTime = shift.beginTime;
      modalData.shift.endTime = shift.endTime;
      modalData.shift.description = shift.description;

      if (clone) {
        modalData.shift.places = shift.places;
      } else {
        modalData.shift.new = false;
      }
    }

    if (shiftIndex == null || clone) {
      modalData.shift.new = true;
    }
    modalData.visible = true;
    this.shiftModalData = modalData;
  }

  public toggleShift(shiftIndex: number) {
    if (this.value == null || shiftIndex >= this.value.length) {
      return;
    }

    const shift = this.value[shiftIndex];
    shift.collapsed = !this.isShiftCollapsed(shift);

    Vue.set(this.value, shiftIndex, shift);
  }

  public isShiftCollapsed(shift: IEventShift) {
    return (
      (!this.editable && shift.collapsed == null) || shift.collapsed === true
    );
  }

  // Place handlers //
  ///////////////////

  public getPlaceTargetParticipantsCount(place: IEventPlace): string {
    if (place.targetParticipantsCount === 0) {
      return 'Участники не требуются';
    }
    const countParticipant =
      place.wishers.length + place.invited.length + place.participants.length;

    if (countParticipant === 0) {
      const nounNeed = getNounDeclension(place.targetParticipantsCount, [
        'Нужен',
        'Нужно',
        'Нужно'
      ]);
      const nounParticipant = getNounDeclension(place.targetParticipantsCount, [
        'участник',
        'участника',
        'участников'
      ]);
      return `${nounNeed} ${place.targetParticipantsCount} ${nounParticipant}`;
    }
    return `Участников: ${countParticipant} из ${place.targetParticipantsCount}`;
  }

  public onSubmitPlace() {
    const placeIndex = this.placeModalData.placeIndex;

    const place =
      placeIndex != null
        ? this.placeModalData.shift.places[placeIndex]
        : new EventPlaceDefault();

    place.targetParticipantsCount = this.placeModalData.place.targetParticipantsCount;
    place.description = this.placeModalData.place.description;

    if (placeIndex != null) {
      Vue.set(this.placeModalData.shift.places, placeIndex, place);
    } else {
      this.placeModalData.shift.places.push({ ...place, new: true });
    }

    this.onInput();
    this.placeModalData.visible = false;
  }

  public removePlace(shift: IEventShift, placeIndex: number) {
    if (!confirm('Вы действительно хотите удалить место?')) {
      return;
    }

    const place = shift.places[placeIndex];
    if (place.new === true) {
      Vue.delete(shift.places, placeIndex);
    } else {
      place.delete = true;
      Vue.set(shift.places, placeIndex, place);
    }
    this.onInput();
  }

  public canDeletePlace(shift: IEventShift): boolean {
    return shift.places.filter((v) => !v.delete).length > 1;
  }

  public showPlaceModal(shift: IEventShift, placeIndex: number | null) {
    if (!this.value) {
      return;
    }

    const modalData = new EventPlaceModalData();
    modalData.shift = shift;
    modalData.placeIndex = placeIndex;

    if (placeIndex != null) {
      const place = shift.places[placeIndex];
      modalData.place.targetParticipantsCount = place.targetParticipantsCount;
      modalData.place.description = place.description;
    }

    modalData.visible = true;
    this.placeModalData = modalData;
  }

  public togglePlace(shift: IEventShift, placeIndex: number) {
    if (placeIndex >= shift.places.length) {
      return;
    }

    const place = shift.places[placeIndex];
    place.collapsed = !this.isPlaceCollapsed(place);

    Vue.set(shift.places, placeIndex, place);
  }

  public isPlaceCollapsed(place: IEventPlace) {
    return (
      (!this.editable && place.collapsed == null) || place.collapsed === true
    );
  }

  // Place participant handlers //
  ///////////////////////////////

  public onSubmitParticipant() {
    const { place, participant } = this.participantModalData;

    const existingParticipantIndex = place.invited.findIndex(
      (p) =>
        p.user.id === participant.user.id &&
        (p.eventRole === participant.eventRole ||
          (p.eventRole != null &&
            participant.eventRole != null &&
            p.eventRole.id === participant.eventRole.id))
    );

    if (existingParticipantIndex === -1) {
      place.invited.push({ ...participant, new: true });
    } else {
      Vue.set(place.invited, existingParticipantIndex, participant);
    }

    this.onInput();
    this.participantModalData.visible = false;
  }

  public removePlaceParticipant(
    participantsGroup: IEventParticipant[],
    participantIndex: number
  ) {
    const participant = participantsGroup[participantIndex];
    if (participant.new === true) {
      Vue.delete(participantsGroup, participantIndex);
    } else {
      participant.delete = true;
      Vue.set(participantsGroup, participantIndex, participant);
    }
    this.onInput();
  }

  public showPlaceInvitedParticipantModal(place: IEventPlace) {
    const modalData = new EventParticipantModalData();
    modalData.place = place;
    modalData.visible = true;
    this.participantModalData = modalData;
  }

  // Place equipment handlers //
  /////////////////////////////

  public onSubmitEquipment() {
    const { place, equipment } = this.equipmentModalData;

    const existingEquipmentIndex = place.equipment.findIndex(
      (e) => e.id === equipment.id
    );

    if (existingEquipmentIndex === -1) {
      place.equipment.push({
        ...equipment,
        new: true
      });
    } else {
      Vue.set(place.equipment, existingEquipmentIndex, equipment);
    }

    this.onInput();
    this.equipmentModalData.visible = false;
  }

  public removePlaceEquipment(place: IEventPlace, equipmentIndex: number) {
    const equipment = place.equipment[equipmentIndex];
    if (equipment.new === true) {
      Vue.delete(place.equipment, equipmentIndex);
    } else {
      equipment.delete = true;
      Vue.set(place.equipment, equipmentIndex, equipment);
    }
    this.onInput();
  }

  public showPlaceEquipmentModal(shift: IEventShift, place: IEventPlace) {
    const modalData = new EventEquipmentModalData();
    modalData.shift = shift;
    modalData.place = place;
    modalData.visible = true;
    this.equipmentModalData = modalData;
  }

  // Application handlers

  public showApplicationModal(shift: IEventShift, placeIndex: number) {
    if (placeIndex < 0 || placeIndex >= shift.places.length) {
      return;
    }

    const modalData = new EventApplicationModalData();
    modalData.place = shift.places[placeIndex];
    modalData.visible = true;
    this.applicationModalData = modalData;
  }

  public isAnyTextSelected(): boolean {
    return (
      window.getSelection() != null &&
      window.getSelection()!.toString().length > 0
    );
  }

  public getShiftSalary(id: string) {
    if (this.shiftSalaries) {
      if (this.shiftSalaries.find((salary) => salary.shiftId === id)) {
        return this.shiftSalaries.find((salary) => salary.shiftId === id);
      }
    }
    const newSalary: any = {
      shiftId: id,
      count: this.eventSalaryCount,
      description: '',
      isNew: true
    };

    return newSalary;
    // Object.assign({ shiftId: id, count: 100 }, this.newSalary);
  }

  public getPlaceSalary(id: string, salary: any) {
    if (this.placeSalaries) {
      if (this.placeSalaries.find((salary) => salary.placeId === id)) {
        return this.placeSalaries.find((salary) => salary.placeId === id);
      }
    }
    // const shift = this.shiftSalaries.find((shift) => {
    //   return shift.shiftId === shiftId;
    // })
    //console.log(shift);
    
    const newSalary: any = {
      placeId: id,
      count: salary.count,
      description: '',
      isNew: true
    };

    return newSalary;
    // return Object.assign({ placeId: id }, this.newSalary);
  }

  public salaryShiftCommit(salary: any) {
    this.$emit('salaryShiftCommit', salary);
  }

 public salaryPlaceCommit(salary: any) {
   this.$emit('salaryPlaceCommit', salary);
 }

  // Computed data //
  //////////////////

  get eventShifts(): IEventShift[] {
    return this.value
      ? this.value.sort((a, b) => {
          if (a.beginTime < b.beginTime) {
            return -1;
          } else if (a.beginTime > b.beginTime) {
            return 1;
          } else {
            return 0;
          }
        })
      : [];
  }
}
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
@import '@/styles/general.scss';

.event-shifts-component {
  .shift {
    display: block;
    width: 100%;
    padding: 0.75rem;
    font-size: 1rem;
    line-height: 1.5;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;

    @include theme-specific() {
      background-color: getstyle(card-list-item-background-color);
      border-color: darken(getstyle(card-list-item-background-color), 10%);
    }

    &:not(:last-child) {
      margin-bottom: 5px;
    }

    .place {
      border: 1px solid darken(getcolor(white, base), 10%);
      border-radius: 0.25rem;

      &:not(:last-child) {
        margin-bottom: 10px;
      }

      @include theme-specific() {
        border-color: getstyle(event-shifts-places-title-background);
        background-color: darken(getstyle(card-list-item-background-color), 5%);
      }

      .badge {
        margin-left: 5px;
      }

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
        padding: 0.375rem 0.75rem;

        .text {
          @extend .noselect;
          line-height: 31px;
        }
      }

      .place-data {
        padding: 0.375rem 0.75rem;

        .list-group-item {
          @include theme-specific() {
            background-color: getstyle(card-list-item-background-color);
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