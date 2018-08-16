<!-- TEMPLATE BEGIN -->
<template>
  <div class="event-item-component" v-bind:class="currentState">
    <div class="title-row">
      <b-row>
        <b-col cols="auto mr-auto" @mouseup="checkDateHover">
          <strong style="line-height: 31px">
            <span>
              <icon name="clock" style="position: relative; top: -2px"></icon>
            </span>
            <span class="date desktop">
              <span v-if="dateHovered">{{ beginTime }}</span>
              <span v-else>{{ beginTimeCalendar }}</span>
            </span>
            <span class="date mobile">
              <span>{{ beginTime }}</span>
            </span>
          </strong>
        </b-col>
        <b-col cols="auto">
          <!--<strong>Иванов Иван</strong>-->
          <b-button variant="outline-warning" class="btn-sm button-edit" :to="'events/edit/' + event.id">Изменить</b-button>
        </b-col>
      </b-row>
      <hr>
      <b-row>
        <b-col md="8">
          <h3 style="margin-bottom: 0">{{ event.title }}</h3>
          <small style="position: relative; top: -5px" v-if="event.eventType">{{ event.eventType.title }}</small>
          <p>{{ event.description }}</p>
        </b-col>
        <b-col md="4">
          <b-row>
            <b-col>
              Готовность:
              <b-progress class="w-100 mb-2" height="2rem" :max="100">
                <b-progress-bar :value="completeness"></b-progress-bar>
              </b-progress>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              Начало:
              <b>{{ beginTimeShort }}</b>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              Длительность:
              <b>{{ duration }}</b>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row class="mt-2 buttons">
        <b-col cols="12" md="auto">
          <b-button :to="'events/' + event.id" variant="primary" class="w-100">Подробнее</b-button>
        </b-col>
      </b-row>
    </div>
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Icon from "vue-awesome/components/Icon";
import * as moment from "moment";

import "vue-awesome/icons/clock";
import "vue-awesome/icons/edit";
import "vue-awesome/icons/eye-slash";

import { Event } from "@/store/modules/events";

enum State {
  Default,
  Waiting,
  Success
}

@Component({
  components: {
    icon: Icon
  }
})
export default class EventItemComponent extends Vue {
  DATE_FORMAT: string = "DD.MM.YYYY HH:mm";
  TIME_FORMAT: string = "HH:mm";

  @Prop() event!: Event;

  dateHovered: boolean = false;

  checkDateHover() {
    if (
      !window.getSelection() ||
      window.getSelection().toString().length == 0
    ) {
      this.dateHovered = !this.dateHovered;
    }
  }

  get currentState(): any {
    const state: State = State.Default; // TODO: delete this

    switch (+state) {
      case State.Default:
        return { default: true };
      case State.Waiting:
        return { waiting: true };
      case State.Success:
        return { success: true };
    }
  }

  get beginTime(): string {
    if (!this.event.beginTime) {
      return "";
    }

    return moment(this.event.beginTime).format(this.DATE_FORMAT);
  }

  get beginTimeCalendar(): string {
    if (!this.event.beginTime) {
      return "";
    }

    return moment(this.event.beginTime).calendar();
  }

  get beginTimeShort(): string {
    if (!this.event.beginTime) {
      return "";
    }

    return moment(this.event.beginTime).format(this.TIME_FORMAT);
  }

  get completeness(): number {
    if (
      this.event.targetParticipantsCount == null ||
      this.event.currentParticipantsCount == null
    )
      return 0;

    if (
      this.event.currentParticipantsCount > this.event.targetParticipantsCount ||
      this.event.targetParticipantsCount == 0
    ) {
      return 100;
    } else {
      return (
        this.event.currentParticipantsCount / this.event.targetParticipantsCount
      );
    }
  }

  get duration(): string {
    if (!this.event.totalDurationInMinutes) {
      return "";
    }

    return moment
      .duration(this.event.totalDurationInMinutes, "minutes")
      .humanize();
  }
}
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
@import "@/styles/general.scss";

.event-item-component {
  padding: 20px;
  border: 1px solid rgba(0, 0, 0, 0.125);
  margin: 10px;

  .date {
    &.desktop {
      @include media-breakpoint-down(md) {
        display: none;
      }
    }

    &.mobile {
      @include media-breakpoint-up(lg) {
        display: none;
      }
    }
  }

  .progress {
    @include theme-specific() {
      background-color: getstyle(event-list-item-progrss-color);

      span {
        color: getstyle(event-list-item-progrss-font-color);
      }
    }
  }

  .button-edit {
    .theme-light & {
      background-color: $warning;
      border-color: $warning;
      color: getcolor(black, dark);

      &:hover {
        background-color: darken($warning, 7.5%);
        border-color: darken($warning, 10%);
      }
    }
  }

  @include media-breakpoint-down(sm) {
    .buttons > div {
      margin-bottom: 0.5rem;
    }

    .buttons > div:last-child {
      margin-bottom: 0;
    }
  }

  @include theme-specific() {
    background-color: getstyle(event-list-item-background-color);

    &.default {
      box-shadow: -4px 0 0 getstyle(event-list-item-default-state-color);
    }

    &.waiting {
      box-shadow: -4px 0 0 getstyle(event-list-item-waiting-state-color);
    }

    &.success {
      box-shadow: -4px 0 0 getstyle(event-list-item-success-state-color);
    }
  }
}
</style>
<!-- STYLE END -->