<!-- TEMPALTE BEGIN -->
<template>
  <div class="event-schedule-component">
    asd
  </div>
</template>
<!-- TEMPALTE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import axios from "axios";

import { User, UserDefault } from "@/store/modules/profile/types";

class Range {
  begin: Date;
  end: Date;

  constructor(begin: Date, end: Date) {
    this.begin = begin;
    this.end = end;
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

  constructor(user: User, ranges: Range[] = []) {
    this.user = user;
    this.ranges = ranges;
  }
}

@Component
export default class EventScheduleComponent extends Vue {
  @Prop() eventBeginTime?: Date;
  @Prop() eventEndTime?: Date;

  scheduleRows: ScheduleRow[] = [];
  eventRange: Range = new Range(new Date(), new Date());

  mounted() {
    console.log(this.eventBeginTime, this.eventEndTime);
    this.eventRange = new Range(
      this.eventBeginTime ? this.eventBeginTime : new Date(),
      this.eventEndTime ? this.eventEndTime : new Date()
    );

    axios
      .get("user/")
      .then(response => {
        const body = response && response.data;
        const users: User[] = body && body.data;

        this.populateRows(users, this.eventRange);
      })
      .catch(err => {
        console.log(err);
      });
  }

  //test method for population rows
  populateRows(users: User[], eventRange: Range) {
    const generateRandomDate = (from: Date, to: Date): Date => {
      const a = from.getTime();
      const b = to.getTime();
      return new Date(a + Math.random() * (b - a));
    };

    console.log(users. length);

    this.scheduleRows = users.map(user => {
      const rangeCount = 2;

      let rangeBegin = generateRandomDate(eventRange.begin, eventRange.end);
      const ranges: Range[] = Array.from(
        { length: rangeCount },
        () => new Range(new Date(), new Date())
      ).map((v, i) => {
        rangeBegin = generateRandomDate(rangeBegin, eventRange.end);
        const rangeEnd: Date = generateRandomDate(rangeBegin, eventRange.end);
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
.event-schedule-component {
  border: 1px solid rgba(0, 0, 0, 0.125);
}
</style>
<!-- STYLE END -->