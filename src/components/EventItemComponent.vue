<!-- TEMPLATE BEGIN -->
<template>
  <div class="event-item-component" v-bind:class="currentState">
    <div class="title-row">
      <b-row>
        <b-col cols="auto" @mouseover="dateHovered=true" @mouseleave="dateHovered=false" style="min-width: 300px">
          <strong>
            <icon name="clock" style="position: relative; bottom: -2px"></icon> 
            <span v-if="dateHovered" >{{ eventParams.beginTime | moment("DD.MM.YYYY, HH:mm")}}</span>
            <span v-else>{{ eventParams.beginTime | moment("calendar") }}</span>
          </strong>
        </b-col>
        <b-col></b-col>
        <b-col cols="auto">
          <!--<strong>Иванов Иван</strong>-->
          <b-button variant="outline-secondary" :to="'event/' + eventParams.id">Изменить</b-button>
        </b-col>
      </b-row>
      <hr>
      <b-row>
        <b-col md="8">
          <h3 style="margin-bottom: 0">{{ eventParams.title || "Template title" }}</h3>
          <small style="position: relative; top: -5px">event type</small>
          <p>{{ eventParams.description || "Template description" }}</p>
        </b-col>
        <b-col md="4">
          <b-row>
            <b-col>
              Участники:
              <b-progress class="w-100 mb-2" height="2rem" :max="eventParams.neededParticipantsCount" show-value>
                <b-progress-bar :value="eventParams.participantCount" :label="eventParams.participantCount + ' из ' + eventParams.neededParticipantsCount">
                </b-progress-bar>
              </b-progress>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              Длительность: <b>{{ duration }}</b>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="mt-2">
          <b-button variant="outline-primary">Хочу пойти</b-button>
          <b-button variant="link" class="text-danger">Не могу пойти</b-button>
        </b-col>
        <b-col cols="auto">
          <b-button variant="primary" :to="'/event/' + eventParams.id">Подробнее</b-button>
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
import * as moment from "moment"

import "vue-awesome/icons/clock";
import "vue-awesome/icons/edit";
import "vue-awesome/icons/eye-slash";

import { Event } from "@/store/modules/events/types"

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
  @Prop() eventParams?: Event

  dateHovered: boolean = false

  get currentState(): any {
    if (this.eventParams) {
      this.eventParams.neededParticipantsCount = 10
      this.eventParams.participantCount = Math.floor(Math.random() * this.eventParams.neededParticipantsCount)
    }

    const state: State = State.Default // TODO: delete this

    switch(+state) {
      case State.Default: return { "default": true }
      case State.Waiting: return { "waiting": true }
      case State.Success: return { "success": true }
    }
  }

  get duration(): string {
    const beginTime = this.eventParams && this.eventParams.beginTime
    const endTime = this.eventParams && this.eventParams.endTime
    return moment.duration(moment(beginTime).diff(endTime)).humanize()
  }
}
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style>
.event-item-component {
  padding: 20px;
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.125);
  margin: 10px;
}

.event-item-component.default {
  box-shadow: -4px 0 0 #007bff;
}

.event-item-component.waiting {
  box-shadow: -4px 0 0 #ffc107;
}

.event-item-component.success {
  box-shadow: -4px 0 0 #28a745;
}
</style>
<!-- STYLE END -->