<!-- TEMPLATE BEGIN -->
<template>
  <div class="users-page">
    <b-container class="content">
      <b-row>
        <b-col>
          <h1 class="page-title">Пользователи
            <b-button variant="success" @click="showModal">Пригласить</b-button>
          </h1>
        </b-col>
      </b-row>
      <br>
      <loading-stub-component v-if="loadingInProcess"></loading-stub-component>
      <div v-else>
        <b-table :hover="true" :fixed="true" :items="items" :fields="fields">
        </b-table>
      </div>
    </b-container>

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
        <button type="button" class="btn btn-primary" :disabled="isModalInProcess" @click="onSubmitModal">Подтвердить</button>
      </template>
    </b-modal>
  </div>
</template>
<!-- TEMPALTE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { RouteConfig } from "vue-router";

import LoadingStubComponent from "@/components/LoadingStubComponent.vue";

import {
  User,
  USERS_GET_ALL,
  USERS_FETCH_ALL,
  USER_INVITE
} from "@/store/modules/users";

enum ModalState {
  Hidden,
  Editing,
  InProcess
}

@Component({
  components: {
    "loading-stub-component": LoadingStubComponent
  }
})
export default class UsersPage extends Vue {
  // Properties //
  ///////////////

  loadingInProcess: boolean = true;

  modalData: {
    email: string | null;
  } = { email: null };
  modalState: ModalState = ModalState.Hidden;

  // Component methods //
  //////////////////////

  mounted() {
    this.loadingInProcess = this.$store.getters[USERS_GET_ALL].lenth == 0;

    this.$store
      .dispatch(USERS_FETCH_ALL)
      .then(result => {
        this.loadingInProcess = false;
      })
      .catch(result => {});
  }

  // Modal window methods //
  /////////////////////////

  get modalVisible(): boolean {
    return this.modalState != ModalState.Hidden;
  }
  set modalVisible(show: boolean) {
    if (!show) {
      this.modalState = ModalState.Hidden;
    }
  }

  onSubmitModal() {
    this.modalState = ModalState.InProcess;
    this.$store.dispatch(USER_INVITE, this.modalData).then(response => {
      this.$notify({
        title: "Приглашение отправлено!",
        duration: 500
      });

      this.modalState = ModalState.Hidden;
      this.modalData = { email: null };
    });
  }

  showModal() {
    this.modalData = { email: null };
    this.modalState = ModalState.Editing;
  }

  get canSubmitModal(): boolean {
    return this.modalData.email != null && this.modalData.email != "";
  }

  get isModalInProcess(): boolean {
    return this.modalState == ModalState.InProcess;
  }

  // Computed data //
  //////////////////

  get fields() {
    return [
      {
        key: "fullName",
        label: "Ф.И.О."
      },
      {
        key: "email",
        label: "Email"
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

export const usersPage = <RouteConfig>{
  path: "/users",
  name: "UsersPage",
  component: UsersPage
};
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
@import "@/styles/general.scss";

.users-page {
}
</style>
<!-- STYLE END -->
