<!-- TEMPALTE BEGIN -->
<template>
  <div class="event-detail-page">
    <b-container class="content">
      <b-row>
        <b-col>
          <h3 class="page-title">Событие</h3>
        </b-col>
      </b-row>
      <br>

      <loading-stub-component v-if="loadingInProcess"></loading-stub-component>
      <div v-else>

      </div>
    </b-container>
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { RouteConfig, Route } from "vue-router";

import LoadingStubComponent from "@/components/LoadingStubComponent.vue";

import { EVENTS_FETCH_ONE } from "@/store/actions/events";
import {
  Event,
  EventDefault
} from "@/store/modules/events/types";

@Component({
  components: {
    "loading-stub-component": LoadingStubComponent
  }
})
export default class EventDetailPage extends Vue {
  loadingInProcess: boolean = false;
  event: Event = new EventDefault();

  mounted() {
    this.loadingInProcess = true;

    const eventId = this.$route.params.id;
    if (eventId) {
      this.$store.dispatch(EVENTS_FETCH_ONE, eventId).then(event => {
        this.event = event;

        this.loadingInProcess = false;
      });
    }
  }
}

export const eventDetailPage = <RouteConfig>{
  path: "/events/:id",
  name: "EventDetailPage",
  component: EventDetailPage
}
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
</style>
<!-- STYLE END -->
