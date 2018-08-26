<!-- TEMPLATE BEGIN -->
<template>
  <div class="users-page">
    <page-content-component :loading="loadingInProcess">
      <template slot="header">
        Пользователи
        <b-button variant="success" @click="showModal">Пригласить</b-button>
      </template>

      <b-table :hover="true" :fixed="true" :items="items" :fields="fields">
        <template slot="email" slot-scope="data">
          <mail-link :email="data.item.email" />
        </template>
      </b-table>
    </page-content-component>

    <b-modal v-model="modalVisible">
      <template slot="modal-title">
        Приглашение пользователя
      </template>

      <b-form-group id="type-title-group" label="Email" label-for="email-input">
        <b-form-input id="email-input" type="email" v-model.trim="modalData.email">
        </b-form-input>
      </b-form-group>

      <template slot="modal-footer">
        <button type="button" class="btn btn-secondary" @click="modalVisible = false">Отменить</button>
        <button type="button" class="btn btn-primary" :disabled="isModalInProcess" @click="onSubmitModal">Пригласить</button>
      </template>
    </b-modal>
  </div>
</template>
<!-- TEMPALTE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { RouteConfig } from 'vue-router';

import MailLinkComponent from '@/components/MailLinkComponent.vue';
import PageContentComponent from '@/components/PageContentComponent.vue';

import {
  User,
  USERS_GET_ALL,
  USERS_FETCH_ALL,
  USER_INVITE
} from '@/modules/users';

enum ModalState {
  Hidden,
  Editing,
  InProcess
}

@Component({
  components: {
    'mail-link': MailLinkComponent,
    'page-content-component': PageContentComponent
  }
})
export default class UsersPage extends Vue {
  // Properties //
  ///////////////

  public loadingInProcess: boolean = true;

  public modalData: {
    email: string | null;
  } = { email: null };
  public modalState: ModalState = ModalState.Hidden;

  // Component methods //
  //////////////////////

  public mounted() {
    this.loadingInProcess = this.$store.getters[USERS_GET_ALL].lenth === 0;

    this.$store.dispatch(USERS_FETCH_ALL).then((result) => {
      this.loadingInProcess = false;
    });
  }

  // Modal window methods //
  /////////////////////////

  get modalVisible(): boolean {
    return this.modalState !== ModalState.Hidden;
  }
  set modalVisible(show: boolean) {
    if (!show) {
      this.modalState = ModalState.Hidden;
    }
  }

  public onSubmitModal() {
    this.modalState = ModalState.InProcess;
    this.$store.dispatch(USER_INVITE, this.modalData).then(() => {
      this.$notify({
        title: 'Приглашение отправлено!',
        duration: 500
      });

      this.modalState = ModalState.Hidden;
      this.modalData = { email: null };
    });
  }

  public showModal() {
    this.modalData = { email: null };
    this.modalState = ModalState.Editing;
  }

  get canSubmitModal(): boolean {
    return this.modalData.email != null && this.modalData.email !== '';
  }

  get isModalInProcess(): boolean {
    return this.modalState === ModalState.InProcess;
  }

  // Computed data //
  //////////////////

  get fields() {
    return [
      {
        key: 'fullName',
        label: 'Ф.И.О.'
      },
      {
        key: 'email',
        label: 'Email'
      }
    ];
  }

  get items(): User[] {
    return this.$store.getters[USERS_GET_ALL].map((user: User) => {
      return {
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.email
      };
    });
  }
}

export const usersPageRoute: RouteConfig = {
  path: '/users',
  name: 'UsersPage',
  component: UsersPage
};
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
@import '@/styles/general.scss';
</style>
<!-- STYLE END -->
