<!-- TEMPLATE BEGIN -->
<template>
  <div class="invitation-notification-component">
    <b-row>
      <b-col cols="12" md="7">
        <h4>Приглашение</h4>
        <a :href="'events/' + data.id">
          {{ data.title }}
        </a>
      </b-col>
      <b-col cols="12" md="5">
        <b-row>
          <b-col cols="5">Начало:</b-col>
          <b-col cols="7">
            <b>{{ data.beginTime | moment($g.DATETIME_FORMAT) }}</b>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="5">Длительность:</b-col>
          <b-col cols="7">
            <b>{{ duration }}</b>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="5">Роль:</b-col>
          <b-col cols="7">
            <b>{{ role }}</b>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-row class="mt-2 buttons">
      <b-col cols="12" md="auto">
        <b-button variant="primary" class="w-100" :disabled="isInProcess" @click="accept">Принять</b-button>
      </b-col>
      <b-col cols="12" md="auto">
        <b-button variant="outline-danger" class="w-100" :disabled="isInProcess" @click="reject">Отказаться</b-button>
      </b-col>
    </b-row>
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Icon from 'vue-awesome/components/Icon';
import moment from 'moment';

import 'vue-awesome/icons/clock';

import {
  EventInvitation,
  NOTIFICATION_INVITATION_ACCEPT,
  NOTIFICATION_INVITATION_REJECT
} from '@/modules/notifications';

enum State {
  Default,
  InProcess
}

@Component
export default class InvitationNotificationComponent extends Vue {
  // Properties //
  ///////////////

  @Prop() public data!: EventInvitation;

  public currentState: State = State.Default;

  // Computed data //
  //////////////////

  get beginTime(): string {
    if (!this.data.beginTime) {
      return '';
    }

    return moment(this.data.beginTime).format();
  }

  get duration(): string {
    if (!this.data.shiftDurationInMinutes) {
      return '';
    }

    return moment
      .duration(this.data.shiftDurationInMinutes, 'minutes')
      .humanize();
  }

  get role(): string {
    return (
      this.$g.ROLE_TRANSLATIONS.get(this.data.role.name) || this.data.role.name
    );
  }

  get isInProcess(): boolean {
    return this.currentState === State.InProcess;
  }

  public accept() {
    this.currentState = State.InProcess;
    this.$store
      .dispatch(NOTIFICATION_INVITATION_ACCEPT, this.data)
      .then((response) => {
        this.$notify({
          title: 'Вы подтвердили своё участие',
          duration: 500
        });
      });
  }

  public reject() {
    this.currentState = State.InProcess;
    this.$store
      .dispatch(NOTIFICATION_INVITATION_REJECT, this.data)
      .then((response) => {
        this.$notify({
          title: 'Вы отказались от участия!',
          duration: 500
        });
      });
  }
}
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
@import '@/styles/general.scss';

.invitation-notification-component {
  padding: 20px;
  border: 1px solid rgba(0, 0, 0, 0.125);
  margin: 10px;

  @include theme-specific() {
    background-color: getstyle(card-list-item-background-color);

    box-shadow: -4px 0 0 $warning;
  }

  @include media-breakpoint-down(sm) {
    .buttons > div {
      margin-bottom: 0.5rem;
    }
    .buttons > div:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
<!-- STYLE END -->