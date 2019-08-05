<!-- TEMPLATE BEGIN -->
<template>
  <div class="c-user-properties-modal">
    <b-modal v-model="isModalVisible">
      <template slot="modal-title">Параметры пользователя</template>
      <div v-for="userProperty in modalData" :key="userProperty.id">
        <b-input-group size="sm" :prepend="userProperty.title" class="mt-3">
          <b-form-input type="text" v-model.trim="userProperty.value"></b-form-input>
          <b-input-group-append>
            <b-button
              variant="outline-success"
              @click="saveUserProperty(userProperty.value, userProperty.id)"
            >Сохранить</b-button>
          </b-input-group-append>
        </b-input-group>
      </div>

      <template slot="modal-footer">
        <button type="button" class="btn btn-secondary" @click="isModalVisible = false">Закрыть</button>
      </template>
    </b-modal>
  </div>
</template>
<!-- TEMPALTE END -->

<!-- SCRIPT BEGIN -->
<script lang='ts'>
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

import { validationMixin } from 'vuelidate';
import { required, minLength } from 'vuelidate/lib/validators';

import {
  IUser,
  IUsersState,
  IUserPropertyType,
  IUserProperty,
  USER_PROPERTY_TYPES_GET_ALL,
  USER_PROPERTY_TYPES_FETCH_ALL,
  USER_PROPERTIES_FETCH_ALL,
  USER_PROPERTY_COMMIT,
  USERS_FETCH_ONE,
  USER_PROPERTY_DELETE,
  UserPropertyDefault
} from '@/modules/users';
import { setInterval } from 'timers';

@Component
export default class CUserPropertiesModal extends Vue {
  @Prop({
    default: false
  })
  public value!: boolean;

  @Prop()
  public user!: IUser;

  public isModalInProcess: boolean = false;

  public modalData: any[] = [];

  private visibilityStuff: boolean = false;

  // Component methods //
  //////////////////////

  public async mounted() {
    await this.$store
      .dispatch(USER_PROPERTIES_FETCH_ALL)
      .then((responseProperties) => {
        this.user.properties = responseProperties;
      });
    this.$store.dispatch(USER_PROPERTY_TYPES_FETCH_ALL).then((testI) => {
      this.modalData = testI.map((i: any) => {
        if (this.user.properties) {
          const tmp = this.user.properties.find((userProperty: IUserProperty) => {
            return userProperty.userPropertyType.id === i.id;
          });
          if (tmp) {
            return {
              id: i.id,
              title: i.title,
              value: tmp.value
            };
          } else {
            return {
              id: i.id,
              title: i.title,
              value: ''
            };
          }
        }
      });
    });
    this.$watch('value', (value: boolean) => {
      this.visibilityStuff = value;
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

  public saveUserProperty(userPropertyValue: string, userPropertyId: string) {
    userPropertyValue
      ? this.setProperty(userPropertyValue, userPropertyId)
      : this.deleteProperty(userPropertyId);
  }

  public setProperty(userPropertyValue: string, userPropertyId: string) {
    this.$store
      .dispatch(USER_PROPERTY_COMMIT, { userPropertyValue, userPropertyId })
      .then((property) => {
        this.$notify({
          title: 'Изменения успешно сохранены',
          duration: 500
        });
      })
      .then(() => {
        this.$store
          .dispatch(USER_PROPERTIES_FETCH_ALL)
          .then((responseProperties) => {
            this.user.properties = responseProperties;
          });
      })
      .catch((error) => {
        this.$notify({
          title: 'Невозможно сохранить изменения',
          duration: 1500,
          type: 'error'
        });
      });
  }

  public deleteProperty(userPropertyId: string) {
    this.$store
      .dispatch(USER_PROPERTY_DELETE, { userPropertyId })
      .then((property) => {
        this.$notify({
          title: 'Изменения успешно сохранены',
          duration: 500
        });
      })
      .then(() => {
        this.$store
          .dispatch(USER_PROPERTIES_FETCH_ALL)
          .then((responseProperties) => {
            this.user.properties = responseProperties;
          });
      })
      .catch((error) => {
        this.$notify({
          title: 'Невозможно сохранить изменения',
          duration: 1500,
          type: 'error'
        });
      });
  }

  get userPropertyTypes(): IUserPropertyType[] {
    console.log('TEST');
    return this.$store.getters[USER_PROPERTY_TYPES_GET_ALL];
  }
}
</script>
<!-- SCRIPT END -->