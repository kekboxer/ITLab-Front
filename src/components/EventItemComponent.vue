<!-- TEMPLATE BEGIN -->
<template>
  <div class="event-item-component">
    <div class="title-row">
      <b-row>
        <b-col @mouseover="dateHovered=true" @mouseleave="dateHovered=false">
          <strong>
            <icon name="clock" style="position: relative; bottom: -2px"></icon> 
            <span v-if="dateHovered">{{ eventParams.beginTime | moment("DD.MM.YYYY, HH:mm")}}</span>
            <span v-else>{{ eventParams.beginTime | moment("calendar") }}</span>
          </strong>
        </b-col>
        <b-col cols="auto">
          <b-button variant="warning" :to="'event/' + eventParams.id"><icon name="edit"></icon> Изменить</b-button>
        </b-col>
        <b-col cols="auto">
          <b-button variant="outline-secondary"><icon name="eye-slash"></icon> Скрыть</b-button>
        </b-col>
      </b-row>
      <hr>
      <b-row>
        <b-col cols="8">
          <h3>{{ eventParams.title || "Template title" }}</h3>
          <p>{{ eventParams.description || "Template description" }}</p>
        </b-col>
        <b-col cols="4">
          <b-row>
            <b-col>
              Участники:
              <b-progress class="w-100 mb-2" height="2rem" :max="eventParams.participantsNeeded" show-value>
                <b-progress-bar :value="eventParams.participantCount" :label="eventParams.participantCount + ' из ' + eventParams.participantsNeeded">
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
        <b-col>
          <b-button variant="outline-primary">Хочу пойти</b-button>
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

@Component({
  components: {
    icon: Icon
  }
})
export default class EventItemComponent extends Vue {
  @Prop() eventParams?: Event

  dateHovered: boolean = false

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
  box-shadow: -4px 0 0 #007bff;
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.125);
  margin: 10px;
}
</style>
<!-- STYLE END -->