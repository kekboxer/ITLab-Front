<!-- TEMPLATE BEGIN -->
<template>
  <div class="c-event-application-modal">
    <b-modal v-model="isModalVisible" @keydown.native.enter="onSubmitModal">
      <template slot="modal-title">
        Заявка на участие
      </template>

      <b-form-group label="Роль">
        <b-form-select v-model="modalData.role" :options="eventRoleOptions" :state="!$v.modalData.role.$invalid"></b-form-select>
      </b-form-group>

      <template slot="modal-footer">
        <button type="button" class="btn btn-secondary" @click="isModalVisible = false">Отменить</button>
        <button type="button" class="btn btn-primary" :disabled="$v.modalData.$invalid || inProcess" @click="onSubmitModal">Подтвердить</button>
      </template>
    </b-modal>
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

import { validationMixin } from 'vuelidate';
import { required, minLength } from 'vuelidate/lib/validators';

import {
  IEventRole,
  EventRoleDefault,
  IEventPlace,
  EventPlaceDefault,
  EVENT_ROLES_FETCH_ALL
} from '@/modules/events';

import { PROFILE_WISH } from '@/modules/profile';
import { clone } from '@/stuff';

export class EventApplicationModalData {
  public visible: boolean = false;
  public place: IEventPlace = new EventPlaceDefault();
  public role: IEventRole = new EventRoleDefault();
}

@Component({
  mixins: [validationMixin],
  validations() {
    return {
      modalData: {
        role: {
          required,
          selected: (eventRole?: IEventRole) => eventRole && eventRole.id !== ''
        }
      }
    };
  }
})
export default class CEventApplicationModal extends Vue {
  // v-modal //
  ////////////

  @Prop({
    default: false
  })
  public value!: EventApplicationModalData;

  // Properties //
  ///////////////

  public eventRoleOptions: Array<{
    value: IEventRole;
    text: string;
  }> = [];

  public modalData: EventApplicationModalData = new EventApplicationModalData();

  public inProcess: boolean = false;

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
  public onValueChanged(value: EventApplicationModalData) {
    this.modalData = clone(value);
  }

  // Methods //
  ////////////
  public onSubmitModal() {
    if ((this.$v.modalData && this.$v.modalData.$invalid) || this.inProcess) {
      return;
    }

    this.inProcess = true;

    this.$store
      .dispatch(PROFILE_WISH, {
        place: this.modalData.place,
        eventRole: this.modalData.role
      })
      .then((response) => {
        this.$notify({
          title: 'Заявка отправлена',
          duration: 500
        });

        /*
        const eventParticipant = new EventParticipantDefault();
        eventParticipant.user = this.$store.getters[USERS_GET_ONE](
          this.$store.getters[PROFILE_GET]
        );
        eventParticipant.eventRole = Object.assign(
          {},
          this.applicationModalData
        );
        this.modalData.place.wishers.push(eventParticipant);
        */

        this.$emit('input', this.modalData);
        this.$emit('onSubmit');

        this.inProcess = false;
        this.isModalVisible = false;
      })
      .catch((error) => {
        this.$notify({
          title: 'Невозможно отправить заявку',
          text: 'Возможно вы уже участвуете/подали заявку',
          type: 'error',
          duration: 1500
        });

        this.$emit('onError');

        this.inProcess = false;
        this.isModalVisible = false;
      });
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