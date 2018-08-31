<!-- TEMPLATE BEGIN -->
<template>
  <div class="wish-notification-component">
    <b-row>
      <b-col cols="12" md="7">
        <h4>Заявка</h4>
        <b>{{ userName }}</b><br>
        <mail-link :email="data.user.email" />
      </b-col>
      <b-col cols="12" md="5">
        <b-row>
          <b-col cols="5">Событие:</b-col>
          <b-col cols="7">
            <a :href="'events/' + data.id">
              {{ data.title }}
            </a>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="5">Начало смены:</b-col>
          <b-col cols="7">
            <b>{{ data.beginTime | moment($g.DATETIME_FORMAT) }}</b>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="5">Роль:</b-col>
          <b-col cols="7">
            <b>{{ role }}</b>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            {{ targetParticipantsCount }} (сейчас:
            <span v-bind:class="participantsLabelClass">{{ data.currentParticipantsCount }}</span>)
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-row class="mt-2 buttons">
      <b-col cols="12" md="auto">
        <b-button variant="primary" class="w-100" :disabled="isInProcess" @click="accept">Принять</b-button>
      </b-col>
      <b-col cols="12" md="auto">
        <b-button variant="outline-danger" class="w-100" :disabled="isInProcess" @click="reject">Отказать</b-button>
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

import MailLinkComponent from '@/components/MailLinkComponent.vue';

import 'vue-awesome/icons/clock';

import {
  Wish,
  NOTIFICATION_WISH_ACCEPT,
  NOTIFICATION_WISH_REJECT
} from '@/modules/notifications';
import { getNounDeclension } from '@/stuff';

enum State {
  Default,
  InProcess
}

@Component({
  components: {
    'mail-link': MailLinkComponent
  }
})
export default class WishNotificationComponent extends Vue {
  // Properties //
  ///////////////

  @Prop() public data!: Wish;

  public currentState: State = State.Default;

  // Computed data //
  //////////////////

  get userName(): string {
    const user = this.data.user;
    return `${user.firstName} ${user.lastName}`;
  }

  get beginTime(): string {
    return moment(this.data.beginTime).format();
  }

  get role(): string {
    const roleName = this.data.role.name;

    return this.$g.ROLE_TRANSLATIONS.get(roleName) || roleName;
  }

  get targetParticipantsCount(): string {
    if (this.data.targetParticipantsCount === 0) {
      return 'Участники не требуются';
    }

    const nounNeed = getNounDeclension(this.data.targetParticipantsCount, [
      'Нужен',
      'Нужно',
      'Нужно'
    ]);
    const nounParticipant = getNounDeclension(
      this.data.targetParticipantsCount,
      ['участник', 'участника', 'участников']
    );
    return `${nounNeed} ${
      this.data.targetParticipantsCount
    } ${nounParticipant}`;
  }

  get participantsLabelClass() {
    return {
      'text-primary':
        this.data.currentParticipantsCount ===
        this.data.targetParticipantsCount,
      'text-danger':
        this.data.currentParticipantsCount > this.data.targetParticipantsCount
    };
  }

  get isInProcess(): boolean {
    return this.currentState === State.InProcess;
  }

  public accept() {
    this.currentState = State.InProcess;
    this.$store
      .dispatch(NOTIFICATION_WISH_ACCEPT, this.data)
      .then((response) => {
        this.$notify({
          title: 'Участник подтверждён',
          duration: 500
        });
      });
  }

  public reject() {
    this.currentState = State.InProcess;
    this.$store
      .dispatch(NOTIFICATION_WISH_REJECT, this.data)
      .then((response) => {
        this.$notify({
          title: 'Участник отклонён',
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

.wish-notification-component {
  padding: 20px;
  border: 1px solid rgba(0, 0, 0, 0.125);
  margin: 10px;

  @include theme-specific() {
    background-color: getstyle(card-list-item-background-color);

    box-shadow: -4px 0 0 $primary;
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