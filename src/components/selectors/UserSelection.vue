<!-- TEMPLATE BEGIN -->
<template>
  <div class="c-user-selection">
    <autocomplete-input :stringify="onStringify" :fetch="onChange" v-model="userSelected" @input="onInput" :state="state" :filter="filter" :without-adding="true" :can-clear="true">
      <div slot="result-item" slot-scope="data">
        <b>{{ data.item.email}}</b><br>{{ data.item.firstName }} {{ data.item.lastName }}
      </div>
    </autocomplete-input>
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import axios from 'axios';

import CAutocompleteInput from '@/components/stuff/AutocompleteInput.vue';

import { IUser, UserDefault, USER_SEARCH } from '@/modules/users';

@Component({
  components: {
    'autocomplete-input': CAutocompleteInput
  }
})
export default class CUserSelection extends Vue {
  // v-model //
  ////////////

  @Prop()
  public value?: IUser;

  @Prop()
  public state?: boolean;

  @Prop()
  public filter?: (user: IUser) => boolean;

  // Properties //
  ///////////////

  public userSelected: IUser = new UserDefault();

  // Component mthods //
  /////////////////////

  public mounted() {
    this.$watch('value', (value?: IUser) => {
      this.userSelected = value ? value : new UserDefault();
    });

    this.userSelected = this.value ? this.value : new UserDefault();
  }

  public onInput() {
    this.$emit('input', this.userSelected);
  }

  // Autocomplete input methods //
  ///////////////////////////////

  public onStringify(user: IUser): string {
    return user.email;
  }

  public onChange(input: string, cb: (result: object[]) => void) {
    this.$store
      .dispatch(USER_SEARCH, { match: input })
      .then((users: IUser[]) => {
        cb(users);
      });
  }
}
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
@import '@/styles/general.scss';

.user-selection-component {
  .result-item {
    border-bottom: 1px solid rgba(0, 0, 0, 0.125);

    &:last-child {
      border-bottom: none;
    }
  }
}
</style>
<!-- STYLE END -->