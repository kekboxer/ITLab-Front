<!-- TEMPLATE BEGIN -->
<template>
  <div class="event-item-component">
    <div class="title-row">
      <b-row>
        <b-col cols="10">
          <strong>
            <icon name="clock" style="position: relative; bottom: -2px"></icon> {{ eventParams.date | moment("calendar") }}</strong>
        </b-col>
      </b-row>
      <hr>
      <b-row>
        <b-col cols="8">
          <h3>{{ eventParams.title }}</h3>
          <p>{{ eventParams.description }}</p>
        </b-col>
        <b-col cols="4">
          <b-row>
            <b-col>
              Участники
              <b-progress class="w-100 mb-2" height="2rem" :max="eventParams.participantsNeeded" show-value>
                <b-progress-bar :value="eventParams.participantCount" :label="eventParams.participantCount + ' из ' + eventParams.participantsNeeded">
                </b-progress-bar>
              </b-progress>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              
            </b-col>
          </b-row>
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

import "vue-awesome/icons/clock";

import { IUserParams } from "@/general/User";
import { IEventParams } from "@/general/Event";

@Component({
  components: {
    icon: Icon
  }
})
export default class EventItemComponent extends Vue {
  @Prop() eventParams?: IEventParams;
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
}
</style>
<!-- STYLE END -->