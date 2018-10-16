<!-- TEMPLATE BEGIN -->
<template>
  <div class="c-user-roles-modal">
    <b-modal v-model="isModalVisible">
      <template slot="modal-title">
        Права пользователя
      </template>

      <div v-for="(state, stateIndex) in roleStates" :key="`role-${state.role.id}`">
        <b-form-checkbox class="noselect" v-model="state.checked" @click.native.prevent="onChangeRoleState(stateIndex)" :disabled="state.inProcess">
          {{ state.role.name }}
        </b-form-checkbox>
      </div>

      <template slot="modal-footer">
        <button type="button" class="btn btn-secondary" @click="isModalVisible = false">Закрыть</button>
      </template>
    </b-modal>
  </div>
</template>
<!-- TEMPALTE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import {
  IUser,
  IUserRole,
  UserRoleDefault,
  USER_ROLES_FETCH,
  USER_ROLES_GET_ALL,
  USER_ROLE_DISCHARGE,
  USER_ROLE_ASSIGN
} from '@/modules/users';

class RoleState {
  public checked: boolean = false;
  public inProcess: boolean = false;
  public role: IUserRole = new UserRoleDefault();
}

@Component
export default class CUserRolesModal extends Vue {
  // v-modal //
  ////////////

  @Prop({
    default: false
  })
  public value!: boolean;

  // Properties //
  ///////////////

  @Prop()
  public user!: IUser;

  public roleStates: RoleState[] = [];

  private visibilityStuff: boolean = false;

  // Component methods //
  //////////////////////

  public mounted() {
    this.$watch('value', (value: boolean) => {
      this.visibilityStuff = value;
    });
  }

  @Watch('user', {
    deep: true
  })
  public onUserChanged(user: IUser) {
    Promise.all([
      this.$store.dispatch(USER_ROLES_FETCH),
      this.$store.dispatch(USER_ROLES_FETCH, this.user)
    ]).then(([roles, rolesOfUser]: [IUserRole[], IUserRole[]]) => {
      this.roleStates = roles.map((role: IUserRole) => {
        const state = new RoleState();
        state.role = role;
        state.checked = rolesOfUser.some((r) => r.id === role.id);
        return state;
      });
    });
  }

  // Methods //
  ////////////

  public onChangeRoleState(stateIndex: number) {
    const state = this.roleStates[stateIndex];
    if (state == null) {
      return;
    }

    Vue.set(this.roleStates, stateIndex, { ...state, inProcess: true });
    this.$store
      .dispatch(state.checked ? USER_ROLE_DISCHARGE : USER_ROLE_ASSIGN, {
        user: this.user,
        role: state.role
      })
      .then(() => {
        Vue.set(this.roleStates, stateIndex, {
          ...state,
          checked: !state.checked,
          inProcess: false
        });
      })
      .catch((error) => {
        Vue.set(this.roleStates, stateIndex, { ...state, inProcess: false });
        this.$notify({
          title: 'Невозможно сохранить изменения',
          duration: 1500,
          type: 'error'
        });
      });
  }

  set isModalVisible(value: boolean) {
    this.$emit('input', value);
  }

  // Computed data //
  //////////////////

  get isModalVisible(): boolean {
    return this.visibilityStuff;
  }
}
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
</style>
<!-- STYLE END -->