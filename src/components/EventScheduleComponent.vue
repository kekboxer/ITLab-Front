<!-- TEMPALTE BEGIN -->
<template>
  <div class="event-schedule-component">
    <div class="schedule-row">
      <div class="user"></div>

      <div class="timeline">
        <div v-for="(mark, index) in timelineMarks" :key="index" class="mark" v-bind:style="getMarkStyle(mark)">
          <div class="text">{{ mark.format("HH:mm") }}</div>
        </div>
      </div>

      <div style="flex-grow: 1; flex-basis: 0;" v-if="editable"></div>
    </div>
    <div v-for="(row, i) in scheduleRows" :key="row.user.id" class="schedule-row" :ref="'row-' + row.user.id">
      <div class="user">
        {{ row.user.firstName }} {{ row.user.lastName }}
      </div>
      <div class="timeline">
        <div v-for="(range, rangeIndex) in row.ranges" :key="`range-${rangeIndex}`" class="range" v-bind:style="getRangeStyle(row.user, range, i)">
        </div>

        <div v-for="(mark, markIndex) in timelineMarks" :key="`mark-${markIndex}`" class="mark" v-bind:style="getMarkStyle(mark)">
          <div class="text"></div>
        </div>
      </div>

      <div class="edit" v-if="editable" @click="onToggleEdit(row)">
        <icon name="edit"></icon>
      </div>
    </div>
  </div>
</template>
<!-- TEMPALTE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import moment, { Moment } from "moment-timezone";
import axios from "axios";

import { User, UserDefault } from "@/store/modules/profile/types";
import { Event, EventDefault } from "@/store/modules/events/types";

import Icon from "vue-awesome/components/Icon";
import "vue-awesome/icons/edit";

// Models //
///////////

class Range {
  begin: Date;
  end: Date;

  constructor(begin: Date, end: Date) {
    this.begin = begin;
    this.end = end;
  }

  get duration() {
    return this.end.getTime() - this.begin.getTime();
  }
}

class ScheduleItem {
  user: User;
  range: Range;

  constructor(user: User, range: Range) {
    this.user = user;
    this.range = range;
  }
}

class ScheduleRow {
  user: User;
  ranges: Range[];
  editable: boolean = false;

  constructor(user: User, ranges: Range[] = []) {
    this.user = user;
    this.ranges = ranges;
  }
}

@Component({
  components: {
    Icon
  }
})
export default class EventScheduleComponent extends Vue {
  // Constants //
  //////////////

  TIMELINE_COLORS: string[] = [
    "#007bff",
    "#dc3545",
    "#28a745",
    "#fd7e14",
    "#6f42c1",
    "#20c997"
  ];

  // Component properties //
  ///////////////

  @Prop({
    default: new Date(0)
  })
  eventBeginTime!: Date;

  @Prop({
    default: new Date(0)
  })
  eventEndTime!: Date;

  @Prop({
    default: false
  })
  editable!: boolean;

  // Properties //
  ///////////////

  scheduleRows: ScheduleRow[] = [];
  currentEditableRow: ScheduleRow | undefined = undefined;

  // Component methods //
  //////////////////////

  mounted() {
    axios
      .get("user/")
      .then(response => {
        const body = response && response.data;
        const users: User[] = body && body.data;

        this.populateRows(users);
      })
      .catch(err => {
        console.log(err);
      });
  }

  // Row methods //
  ////////////////

  onToggleEdit(row: ScheduleRow) {
    if (this.currentEditableRow) {
      this.currentEditableRow.editable = false;
    }

    row.editable = true;
    this.currentEditableRow = row;
  }

  // Dynamic style methods //
  //////////////////////////

  getRangeStyle(user: User, range: Range, index: number = 0) {
    const eventDuration =
      this.eventEndTime.getTime() - this.eventBeginTime.getTime();

    return {
      backgroundColor: this.TIMELINE_COLORS[
        index % this.TIMELINE_COLORS.length
      ],
      left: `${(range.begin.getTime() - this.eventBeginTime.getTime()) /
        eventDuration *
        100}%`,
      width: `${range.duration / eventDuration * 100}%`
    };
  }

  getMarkStyle(mark: Moment) {
    const eventDuration =
      this.eventEndTime.getTime() - this.eventBeginTime.getTime();

    return {
      left: `${(mark.toDate().getTime() - this.eventBeginTime.getTime()) /
        eventDuration *
        100}%`
    };
  }

  // Timeline methods //
  /////////////////////

  get timelineMarks() {
    const eventDuration =
      this.eventEndTime.getTime() - this.eventBeginTime.getTime();

    const eventBeginTime = moment(this.eventBeginTime);
    let hour = eventBeginTime.hour();
    if (eventBeginTime.minute() != 0) {
      hour += 1;
    }

    const counterEnd = moment(this.eventEndTime);
    let timeCounter = moment(eventBeginTime).startOf("hour");

    const hourCount = eventDuration / 86400000;
    const result: Moment[] = [];

    let index: number = 0;
    while (timeCounter <= counterEnd) {
      result.push(timeCounter.clone());
      timeCounter.add(1, "hour");
    }

    return result;
  }

  // Test methods //
  /////////////////

  populateRows(users: User[]) {
    const generateRandomDate = (from: Date, to: Date): Date => {
      const a = from.getTime();
      const b = to.getTime();
      return new Date(a + Math.random() * (b - a));
    };

    this.scheduleRows = users.map(user => {
      const rangeCount = 2;

      let rangeBegin = generateRandomDate(
        this.eventBeginTime,
        this.eventEndTime
      );
      const ranges: Range[] = Array.from(
        { length: rangeCount },
        () => new Range(new Date(), new Date())
      ).map((v, i) => {
        rangeBegin = generateRandomDate(rangeBegin, this.eventEndTime);
        const rangeEnd: Date = generateRandomDate(
          rangeBegin,
          this.eventEndTime
        );
        const result: Range = new Range(rangeBegin, rangeEnd);
        rangeBegin = rangeEnd;

        return result;
      });

      return new ScheduleRow(user, ranges);
    });
  }
}
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
@import "@/styles/general.scss";

.event-schedule-component {
  @extend .form-control;

  @include theme-specific() {
    background-color: getstyle(form-control-background-color);
  }

  .schedule-row {
    display: flex;
    flex-direction: row;

    height: 2em;
    line-height: 2em;

    &:not(:last-child) {
      border-bottom: 1px solid rgba(0, 0, 0, 0.125);
    }

    .mark {
      background-color: inherit;
      position: absolute;
      height: 100%;

      .text {
        @extend .noselect;
        position: relative;
        height: 100%;
        left: -100%;
        padding-right: 5px;
        border-right: 1px solid rgba(0, 0, 0, 0.125);
      }
    }

    .user {
      flex-basis: 0;
      flex-grow: 6;
      overflow: hidden;
    }

    .timeline {
      flex-basis: 0;
      flex-grow: 22;
      width: 100%;
      height: 2em;
      position: relative;

      margin-right: 1em;

      .range {
        height: 100%;
        display: inline-block;
        position: absolute;
        background-color: #28a745;
        border-left: 1px solid rgba(0, 0, 0, 0.125);
        border-right: 1px solid rgba(0, 0, 0, 0.125);
        box-shadow: inset 0px 0px 0px 1px rgba(0, 0, 0, 0.125);
      }
    }

    .edit {
      flex-grow: 1;
      flex-basis: 0;
      cursor: pointer;
      line-height: 2em;
      text-align: right;

      padding-top: 0.375rem;
      padding-bottom: 0.375rem;

      svg {
        position: relative;
        top: -0.3em;
        left: -25%;
      }

      &:hover {
        background-color: rgba(0, 0, 0, 0.125);
      }
    }
  }
}
</style>
<!-- STYLE END -->