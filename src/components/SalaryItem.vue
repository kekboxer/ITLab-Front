<template>
  <b-col cols="auto">
    <template>

      <template v-if="!salaryToggler">
        <template v-if="salary.count !== null">
          <span v-if="salary.isNew" class="salary__count salary__count_new">{{ salary.count }}&#8381;</span>
          <span v-else class="salary__count">{{ salary.count }}&#8381;</span>
        </template>
        <template v-else>
          <span>Стоимость не указана</span>
        </template>
      </template>

      <template v-else>
        <input type="number" v-model.number="salary.count" class="salary__input" />
        &nbsp;
        <div @click="salaryUpdate()" class="salary__edit_toggler salary__check">
          <icon name="check"></icon>
        </div>
      </template>

      &nbsp;
      <div v-if="salary.count" :id="`tooltip-${id}`" class="salary__info">
        <button type="button">
          <icon name="info-circle" class="salary__info__icon"></icon>
        </button>
      </div>

      <b-tooltip v-if="salary.count" :target="`tooltip-${id}`" custom-class="my-tooltip-class">
        <template v-if="!descriptionToggler">{{salary.description}}</template>
        <template v-else>
          <input type="text" v-model="salary.description" class="salary__input" />
          <!-- &nbsp;
          <div
            @click="salaryUpdate()"
            v-if="canEditEvent"
            class="salary__edit_toggler salary__check"
          >
            <icon name="check"></icon>
          </div>&nbsp; -->
        </template>

        <template v-if="canEditEvent && editable">
          <div @click="salaryDescriptionToggle()" class="salary__edit_toggler">
            &nbsp;
            <icon name="edit"></icon>
          </div>
        </template>
      </b-tooltip>

        
      <template v-if="canEditEvent && editable">
        &nbsp;
        <div @click="salaryToggle()" class="salary__edit_toggler">
          <icon name="edit"></icon>
        </div>
      </template>
    </template>

    
  </b-col>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Icon from 'vue-awesome/components/Icon';

import 'vue-awesome/icons/check';
import 'vue-awesome/icons/edit';
import 'vue-awesome/icons/info-circle';

import { IEvent } from '@/modules/events';

import {
  IEventSalary,
  EVENT_SALARY_COMMIT,
  salary
} from '@/modules/salary';

@Component({
  components: {
    icon: Icon
  }
})
export default class CSalaryItem extends Vue {
  // Properties //
  ///////////////
  @Prop()
  public salary!: IEventSalary | any;

  @Prop()
  public id!: string;

  @Prop()
  public editable?: boolean;

  public canEditEvent: boolean | null = false;

  public salaryToggler: boolean = false;
  public isSalaryCountChanged: boolean = false;

  public isSalaryDescriptionChanged: boolean = false;
  public descriptionToggler: boolean = false;

  //   public newSalary: any = {
  //     eventId: this.id,
  //     count: null,
  //     description: '',
  //     isNew: true
  //   };
  // Methods //
  ////////////

  public async mounted() {
    // if (this.salary === undefined) {
    // }
    this.isSalaryCountChanged = false;
    this.canEditEvent = await this.$userManager.userHasRole('CanEditEvent');
  }

  public salaryToggle() {
    this.salaryToggler = !this.salaryToggler;
  }

  public salaryUpdate() {
    if(this.salary.hasOwnProperty('isNew')){
      delete this.salary.isNew
    }
    this.$emit('salaryCommit', this.salary);
    //   if(this.salary !== undefined) {
    //       console.log('salary');
    //     this.$emit('salaryCommit', this.salary);
    //   } else {
    //       console.log(this.newSalary);

    //     this.$emit('salaryCommit', this.newSalary);
    //   }
    this.descriptionToggler = false;
    this.salaryToggler = false;
    this.isSalaryCountChanged = false;
    this.isSalaryDescriptionChanged = false;
  }

  public salaryDescriptionToggle() {
    this.descriptionToggler = !this.descriptionToggler;
  }

  @Watch('salary.count')
  public onSalaryCountChanged() {
    this.isSalaryCountChanged = true;
  }
  @Watch('salary.description')
  public onSalaryDescriptionChanged() {
    this.isSalaryDescriptionChanged = true;
  }
  @Watch('newSalary.count')
  public onNewSalaryCountChanged() {
    this.isSalaryCountChanged = true;
  }
}
</script>

<style lang="scss">
@import '@/styles/general.scss';
.salary__info {
  display: inline;
  button {
    border: none;
    background: transparent;
  }
}
.salary__info__icon {
  color: #4dabf7;
}
.salary__count {
  font-weight: bolder;
}
.salary__edit_toggler {
  display: inline !important;
  cursor: pointer;
}
.salary__check {
  color: #42f542;
}
.salary__input {
  width: 100px;
}
.salary__count_new {
  color: rgba($color: #000000, $alpha: 0.5);
}
</style>
