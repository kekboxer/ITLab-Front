<!-- TEMPLATE BEGIN -->
<template>
  <div class="user-selection-component">
    <autocomplete-input-component :stringify="onStringify" :fetch="onChange" v-model="userSelected" @input="onInput" :without-adding="true" :can-clear="true">
      <div slot="result-item" slot-scope="data">
        <b>{{ data.item.email}}</b><br>{{ data.item.firstName }} {{ data.item.lastName }}
      </div>
    </autocomplete-input-component>
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import axios from "axios";

import AutocompleteInputComponent from "@/components/AutocompleteInputComponent.vue";

import { User, UserDefault, USER_SEARCH } from "@/store/modules/users";

@Component({
  components: {
    "autocomplete-input-component": AutocompleteInputComponent
  }
})
export default class UserSelectionComponent extends Vue {
  // v-model //
  ////////////

  @Prop() value?: User;

  // Properties //
  ///////////////

  userSelected: User = new UserDefault();

  // Component mthods //
  /////////////////////

  mounted() {
    this.$watch("value", (value?: User) => {
      this.userSelected = value ? value : new UserDefault();
    });

    this.userSelected = this.value ? this.value : new UserDefault();
  }

  onInput() {
    this.$emit("input", this.userSelected);
  }

  // Autocomplete input methods //
  ///////////////////////////////

  onStringify(user: User): string {
    return user.email;
  }

  onChange(input: string, cb: Function) {
    this.$store
      .dispatch(USER_SEARCH, { match: input })
      .then((users: User[]) => {
        cb(users);
      });
  }
}
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
@import "@/styles/general.scss";

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