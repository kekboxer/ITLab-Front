<!-- TEMPLATE BEGIN -->
<template>
  <div class="users-page">
    <page-content :loading="loadingInProcess">
      <template slot="header">Пользователи</template>
      <template slot="header-button">
        <b-button variant="success" @click="showModal" v-if="canInvite">Пригласить</b-button>
      </template>

      <b-row>
        <b-col cols="12" md="12" lg="6" class="order-1 order-md-2">
          <b-input-group class="mb-2 pr-3">
            <input class="form-control" v-model="usersFilterString" placeholder="Поиск" type="text" />
            <b-input-group-append>
              <b-btn :disabled="!usersFilterString" @click="usersFilterString=''">
                <icon name="times"/>
              </b-btn>
            </b-input-group-append>
          </b-input-group>
        </b-col>
      </b-row>

      <b-card-group columns class="mb-3">
        <b-card
          v-for="user in filtredUsers"
          :key="user.id"
          v-bind:class="{ 'border-primary': user.id === profileId }"
          no-body
        >
          <b-card-body>
            <b-link :to="getProfileLink(user)" class="profile-link">
              <h4>
                {{user.lastName}} {{user.firstName}}
                <template
                  v-if="user.middleName && user.middleName.length > 0"
                >
                  <br />
                  {{user.middleName}}
                </template>
              </h4>
            </b-link>Email:
            <mail-link :email="user.email" />
            <br />
            <template v-if="user.phoneNumber">
              Телефон:
              <phone-link :phone="user.phoneNumber" />
              <br />
            </template>
            <div
              v-for="property in user.properties"
              :key="property.id"
            >{{property.userPropertyType.title}} : {{property.value}}</div>
          </b-card-body>
        </b-card>
      </b-card-group>
    </page-content>

    <b-modal v-model="modalVisible">
      <template slot="modal-title">Приглашение пользователя</template>

      <b-form-group id="type-title-group" label="Email" label-for="email-input">
        <b-form-input
          id="email-input"
          type="email"
          v-model="modalData.email"
          :state="!$v.modalData.email.$invalid"
        ></b-form-input>
      </b-form-group>

      <template slot="modal-footer">
        <button type="button" class="btn btn-secondary" @click="modalVisible = false">Отменить</button>
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
import { Vue, Component, Watch } from 'vue-property-decorator';
import { RouteConfig } from 'vue-router';

import CMailLink from '@/components/stuff/MailLink.vue';
import CPhoneLink from '@/components/stuff/PhoneLink.vue';
import CPageContent from '@/components/layout/PageContent.vue';

import { validationMixin } from 'vuelidate';
import { required, email } from 'vuelidate/lib/validators';
import Icon from 'vue-awesome/components/Icon';

import {
  IUser,
  USERS_GET_ALL,
  USERS_FETCH_ALL,
  USER_INVITE
} from '@/modules/users';
import { PROFILE_GET } from '@/modules/profile';

enum ModalState {
  Hidden,
  Editing,
  InProcess
}

@Component({
  components: {
    Icon,
    'mail-link': CMailLink,
    'phone-link': CPhoneLink,
    'page-content': CPageContent
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

  public users: IUser[] = [];
  public filtredUsers: IUser[] = [];

  public usersFilterString: string = '';

  public canInvite: boolean | null = false;

  // Component methods //
  //////////////////////

  public async mounted() {
    this.loadingInProcess = this.$store.getters[USERS_GET_ALL].lenth === 0;

    this.$store.dispatch(USERS_FETCH_ALL).then((users) => {
      this.users = users;
      this.filtredUsers = this.users;
      console.log(this.users);
      this.loadingInProcess = false;
    });
    this.canInvite = await this.$userManager.userHasRole('CanInviteToSystem');
  }

  @Watch('usersFilterString')
  onUsersFilter() {
    let regExp = RegExp('^'+this.usersFilterString, 'i');
    this.filtredUsers = this.users.filter((user) => {
      let firstNameLastName = user.firstName + ' ' + user.lastName;
      let lastNameFirstName = user.lastName + ' ' + user.firstName;
      return firstNameLastName.match(regExp) || lastNameFirstName.match(regExp);
    })
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

  public getProfileLink(user: IUser): string {
    const userId = user.id === this.profileId ? '' : `/${user.id}`;
    return `/profile${userId}`;
  }

  get canSubmitModal(): boolean {
    return this.modalData.email != null && this.modalData.email !== '';
  }

  get isModalInProcess(): boolean {
    return this.modalState === ModalState.InProcess;
  }

  // Computed data //
  //////////////////

  // get users(): IUser[] {
  //   return this.$store.getters[USERS_GET_ALL];
  // }

  get profileId(): string {
    return this.$store.getters[PROFILE_GET];
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
