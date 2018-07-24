<!-- TEMPLATE BEGIN -->
<template>
  <div class="event-shifts-component">
    <div class="shift" v-for="(shift, shiftIndex) in eventShifts" :key="`shift-${shiftIndex}`">
      <b>{{ shift.beginTime | moment(DATE_FORMAT) }}</b> &mdash;
      <b>{{ getShiftEndTime(shift) }}</b> ({{ getShiftDuration(shift) }})
      <hr>
      <draggable :list="shift.places" :options="{handle:'.drag-handle'}">
        <div v-for="(place, placeIndex) in shift.places" :key="`place-${placeIndex}`" class="place">
          <div class="place-title drag-handle">
            <b-row>
              <b-col cols="auto mr-auto" class="text">
                Место #{{ placeIndex + 1}}
              </b-col>
              <b-col cols="auto">
                <b-button variant="danger" class="btn-sm" @click="onRemovePlace(shift, placeIndex)">Удалить</b-button>
              </b-col>
            </b-row>
          </div>
          <div class="place-data">
            <b-row>
              <b-col cols="12" md="6">
                <pre>{{ place.users }}</pre>
              </b-col>
              <b-col cols="12" md="6">
                <pre>{{ place.equipment }}</pre>
              </b-col>
            </b-row>
          </div>
        </div>
      </draggable>
      <b-button variant="outline-success" class="mb-2 w-100" v-bind:class="{ 'mt-2': shift.places.length != 0 }" @click="onAddPlace(shift)">Добавить место</b-button>
    </div>
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import moment from "moment-timezone";

import UserSelectionComponent from "@/components/UserSelectionComponent.vue";
import Draggable from "vuedraggable";

import {
  EventShift,
  EventShiftDefault,
  EventPlaceDefault,
EventPlace
} from "@/store/modules/events/types";

@Component({
  components: {
    draggable: Draggable
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

  mounted() {
    this.$watch("value", (shifts?: EventShift[]) => {
      this.value = shifts ? shifts : [];
    });

    if (!this.value) {
      this.value = [];
    }
  }

  onInput() {
    this.$emit("input", this.value);
  }

  onAddPlace(shift: EventShift) {
    shift.places.push(new EventPlaceDefault());
    this.onInput();
  }

  onRemovePlace(shift: EventShift, placeIndex: number) {
    shift.places.splice(placeIndex, 1);
    this.onInput();
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
    padding: 0.375rem 0.75rem;
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