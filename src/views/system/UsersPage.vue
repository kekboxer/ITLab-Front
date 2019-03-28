<!-- TEMPLATE BEGIN -->
<template>
  <div class="users-page">
    <page-content :loading="loadingInProcess">
      <template slot="header">Пользователи</template>
      <template slot="header-button">
        <b-button
          variant="success"
          @click="showModal"
          v-if="canInvite"
        >Пригласить</b-button>
      </template>

      <b-card-group
        columns
        class="mb-3"
      >
        <b-card
          v-for="user in users"
          :key="user.id"
          v-bind:class="{ 'border-primary': user.id === profileId }"
          no-body
        >
          <b-card-body>
            <b-link
              :to="getProfileLink(user)"
              class="profile-link"
            >
              <h4>{{user.lastName}} {{user.firstName}}<template v-if="user.middleName && user.middleName.length > 0"><br>{{user.middleName}}</template></h4>
            </b-link>
            Email:
            <mail-link :email="user.email" /><br>
            <template v-if="user.phoneNumber">
              Телефон:
              <phone-link :phone="user.phoneNumber" /><br>
            </template>
          </b-card-body>
        </b-card>
      </b-card-group>
    </page-content>

    <b-modal v-model="modalVisible">
      <template slot="modal-title">
        Приглашение пользователя
      </template>

      <b-form-group
        id="type-title-group"
        label="Email"
        label-for="email-input"
      >
        <b-form-input
          id="email-input"
          type="email"
          v-model="modalData.email"
          :state="!$v.modalData.email.$invalid"
        >
        </b-form-input>
      </b-form-group>

      <template slot="modal-footer">
        <button
          type="button"
          class="btn btn-secondary"
          @click="modalVisible = false"
        >Отменить</button>
        <button
          type="button"
          class="btn btn-primary"
          :disabled="$v.modalData.$invalid || isModalInProcess"
          @click="onSubmitModal"
        >Пригласить</button>
      </template>
    </b-modal>
  </div>
</template>
<!-- TEMPALTE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { RouteConfig } from "vue-router";

import CMailLink from "@/components/stuff/MailLink.vue";
import CPhoneLink from "@/components/stuff/PhoneLink.vue";
import CPageContent from "@/components/layout/PageContent.vue";

import { validationMixin } from "vuelidate";
import { required, email } from "vuelidate/lib/validators";

import {
  IUser,
  USERS_GET_ALL,
  USERS_FETCH_ALL,
  USER_INVITE
} from "@/modules/users";
import { PROFILE_GET } from "@/modules/profile";

enum ModalState {
  Hidden,
  Editing,
  InProcess
}

@Component({
  components: {
    "mail-link": CMailLink,
    "phone-link": CPhoneLink,
    "page-content": CPageContent
  },
  mixins: [validationMixin],
  validations: {
    modalData: {
      email: {
        required,
        email
      }
    }
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

    this.$store.dispatch(USERS_FETCH_ALL).then(result => {
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
    if (this.$v.modalData == null || this.$v.modalData.$invalid) {
      return;
    }

    this.modalState = ModalState.InProcess;
    this.$store.dispatch(USER_INVITE, this.modalData).then(() => {
      this.$notify({
        title: "Приглашение отправлено!",
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

  public getProfileLink(user: IUser): string {
    const userId = user.id === this.profileId ? "" : `/${user.id}`;
    return `/profile${userId}`;
  }

  get canSubmitModal(): boolean {
    return this.modalData.email != null && this.modalData.email !== "";
  }

  get isModalInProcess(): boolean {
    return this.modalState === ModalState.InProcess;
  }

  // Computed data //
  //////////////////

  get users(): IUser[] {
    return this.$store.getters[USERS_GET_ALL];
  }

  get profileId(): string {
    return this.$store.getters[PROFILE_GET];
  }

  get canInvite(): boolean {
    return this.$g.hasRole("CanInviteToSystem");
  }
}

export const usersPageRoute: RouteConfig = {
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
  .card {
    .card-body {
      .profile-link {
        @include theme-specific() {
          color: getstyle(page-font-color);
        }
      }
    }
  }
}
</style>
<!-- STYLE END -->
