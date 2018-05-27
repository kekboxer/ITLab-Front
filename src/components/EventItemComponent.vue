<!-- TEMPLATE BEGIN -->
<template>
  <div class="event-item-component" v-bind:class="currentState">
    <div class="title-row">
      <b-row>
        <b-col cols="auto mr-auto" @click="dateHovered=!dateHovered">
          <strong style="line-height: 31px">
            <span>
              <icon name="clock" style="position: relative; bottom: -2px"></icon>
            </span>
            <span v-if="dateHovered">{{ eventParams.beginTime | moment("DD.MM.YYYY HH:mm")}}</span>
            <span v-else>{{ eventParams.beginTime | moment("calendar") }}</span>
          </strong>
        </b-col>
        <b-col cols="auto">
          <!--<strong>Иванов Иван</strong>-->
          <b-button variant="outline-warning" class="btn-sm button-edit" :to="'event/' + eventParams.id">Изменить</b-button>
        </b-col>
      </b-row>
      <hr>
      <b-row>
        <b-col md="8">
          <h3 style="margin-bottom: 0">{{ eventParams.title }}</h3>
          <small style="position: relative; top: -5px">event type</small>
          <p>{{ eventParams.description }}</p>
        </b-col>
        <b-col md="4">
          <b-row>
            <b-col>
              Участники:
              <b-progress class="w-100 mb-2" height="2rem" :max="eventParams.neededParticipantsCount" show-value>
                <b-progress-bar :value="eventParams.participantCount || 0" :label="eventParams.participantCount || 0+ ' из ' + eventParams.neededParticipantsCount">
                </b-progress-bar>
              </b-progress>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              Начало:
              <b>{{ eventParams.beginTime | moment("HH:mm")}}</b>
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
        <b-col cols="12" md="auto" class="order-md-3">
          <b-button variant="primary" class="w-100">Подробнее</b-button>
        </b-col>
        <b-col cols="12" md="auto" class="order-md-1">
          <b-button variant="outline-primary" class="w-100">Хочу пойти</b-button>
        </b-col>
        <b-col cols="12" md="auto mr-auto" class="order-md-2">
          <b-button variant="link" class="w-100 text-danger">Не могу пойти</b-button>
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

import { Event } from "@/store/modules/events/types";

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
  @Prop() eventParams?: Event;

  dateHovered: boolean = false;

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

  get duration(): string {
    const beginTime = this.eventParams && this.eventParams.beginTime;
    const endTime = this.eventParams && this.eventParams.endTime;
    return moment.duration(moment(beginTime).diff(endTime)).humanize();
  }
}
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
@import "@/styles/theme.scss";
@import "@/../node_modules/bootstrap/scss/bootstrap.scss";

.event-item-component {
  padding: 20px;
  border: 1px solid rgba(0, 0, 0, 0.125);
  margin: 10px;

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