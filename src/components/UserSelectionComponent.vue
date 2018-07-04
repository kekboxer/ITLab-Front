<!-- TEMPLATE BEGIN -->
<template>
  <div class="user-selection-component">
    <autocomplete-input-component :stringify="onStringify" :fetch="onChange" v-model="userSelected" @input="onInput" :without-adding="true" :can-clear="true">
      <div slot="result-item" slot-scope="data">
        <b>{{ data.item.email}}</b><br> {{ data.item.firstName }} {{ data.item.lastName }}
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

import { User, UserDefault } from "@/store/modules/profile/types";

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
  users: User[] = [];

  // Component mthods //
  /////////////////////

  mounted() {
    axios
      .get("user")
      .then(result => {
        const body = result && result.data;
        this.users = body && body.data;
      })
      .catch(err => {
        console.log(err);
      });

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
    this.fetchUsers(input, false).then(users => {
      cb(users as User[]);
    });
  }

  fetchUsers(match: string = "", all: boolean = true) {
    return new Promise((resolve, reject) => {
      let counter = 0;

      resolve(
        this.users.filter(v => {
          const condition =
            v.email.toLowerCase().indexOf(match.toLowerCase()) != -1;
          if (condition && !all) {
            counter++;
          }

          return condition && counter < 5;
        })
      );
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