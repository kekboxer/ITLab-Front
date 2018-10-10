<!-- TEMPLATE BEGIN -->
<template>
  <div class="c-event-participant-modal">
    <b-modal v-model="isModalVisible" @keydown.native.enter="onSubmitModal">
      <template slot="modal-title">
        Участник
      </template>

      <b-form-group label="Участник">
        <user-selection v-model="modalData.participant.user" :state="!$v.modalData.participant.user.$invalid"></user-selection>
      </b-form-group>

      <b-form-group label="Роль">
        <b-form-select v-model="modalData.participant.eventRole" :state="!$v.modalData.participant.eventRole.$invalid" :options="eventRoleOptions"></b-form-select>
      </b-form-group>

      <template slot="modal-footer">
        <button type="button" class="btn btn-secondary" @click="isModalVisible = false">Отменить</button>
        <button type="button" class="btn btn-primary" :disabled="$v.modalData.$invalid" @click="onSubmitModal">Подтвердить</button>
      </template>
    </b-modal>
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

import CUserSelection from '@/components/selectors/UserSelection.vue';

import { validationMixin } from 'vuelidate';
import { required, minLength } from 'vuelidate/lib/validators';

import {
  IEventShift,
  EventShiftDefault,
  IEventPlace,
  EventPlaceDefault,
  IEventParticipant,
  EventParticipantDefault,
  IEventRole,
  EVENT_ROLES_FETCH_ALL
} from '@/modules/events';
import { IUser } from '@/modules/users';
import { clone } from '@/stuff';

export class EventParticipantModalData {
  public visible: boolean = false;
  public participant: IEventParticipant = new EventParticipantDefault();
  public place: IEventPlace = new EventPlaceDefault();
}

@Component({
  components: {
    'user-selection': CUserSelection
  },
  mixins: [validationMixin],
  validations() {
    return {
      modalData: {
        participant: {
          user: {
            required,
            selected: (user?: IUser) => user && user.id !== ''
          },
          eventRole: {
            required,
            selected: (eventRole?: IEventRole) =>
              eventRole && eventRole.id !== ''
          }
        }
      }
    };
  }
})
export default class CEventParticipantModal extends Vue {
  // v-modal //
  ////////////

  @Prop({
    default: false
  })
  public value!: EventParticipantModalData;

  // Properties //
  ///////////////

  public eventRoleOptions: Array<{
    value: IEventRole;
    text: string;
  }> = [];

  public modalData: EventParticipantModalData = new EventParticipantModalData();

  // Component methods //
  //////////////////////

  public mounted() {
    this.$store.dispatch(EVENT_ROLES_FETCH_ALL).then((result: IEventRole[]) => {
      const eventRoles: IEventRole[] = result;
      this.eventRoleOptions = eventRoles.map((v) => {
        return {
          value: v,
          text: v.title
        };
      });
    });
  }

  @Watch('value', {
    immediate: true
  })
  public onValueChanged(value: EventParticipantModalData) {
    this.modalData = clone(value);
  }

  // Methods //
  ////////////
  public onSubmitModal() {
    if (this.$v.modalData && this.$v.modalData.$invalid) {
      return;
    }

    this.$emit('input', this.modalData);
    this.$emit('onSubmit');
  }

  set isModalVisible(visible: boolean) {
    this.modalData.visible = true;
    this.$emit('input', {
      ...this.value,
      visible
    });
  }

  // Computed data //
  //////////////////

  get isModalVisible(): boolean {
    return this.modalData.visible;
  }
}
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
</style>
<!-- STYLE END -->