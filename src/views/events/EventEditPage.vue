<!-- TEMPALTE BEGIN -->
<template>
  <div class="event-edit-page">
    <vue-headful :title="isNewEvent ? 'Новое событие' : event.title + ' | Редактирование'"></vue-headful>
    <page-content :loading="loadingInProcess" :not-found="notFound">
      <template slot="header">Событие</template>
      <template slot="header-button">
        <b-button variant="primary" :to="'/events/' + event.id" v-if="!isNewEvent">Подробнее</b-button>
      </template>

      <b-row>
        <b-col>
          <b-form>
            <b-form-group label="Тип события">
              <event-type-selection v-model="event.eventType" :state="!$v.event.eventType.$invalid"></event-type-selection>
            </b-form-group>

            <b-form-group label="Название">
              <b-form-input
                type="text"
                v-model.trim="event.title"
                :state="!$v.event.title.$invalid"
              ></b-form-input>
            </b-form-group>

            <b-form-group label="Описание">
              <b-tabs>
                <b-tab title="Markdown" active>
                  <b-form-textarea
                    style="font-family: monospace; resize: none"
                    v-autosize="event.description"
                    v-model="event.description"
                  ></b-form-textarea>
                </b-tab>
                <b-tab title="Просмотр">
                  <div class="markdown markdown-preview">
                    <vue-markdown :breaks="true" :linkify="true" :source="event.description"></vue-markdown>
                  </div>
                </b-tab>
              </b-tabs>
              <div class="w-100" align="right">
                <small>
                  <a
                    target="_blank"
                    href="https://guides.github.com/features/mastering-markdown"
                  >Markdown guide</a>
                </small>
              </div>
            </b-form-group>

            <b-form-group label="Адрес">
              <b-form-textarea
                v-autosize="event.address"
                v-model="event.address"
                @keydown.native="handleAddressInput"
                :state="!$v.event.address.$invalid"
              ></b-form-textarea>
            </b-form-group>

            <b-form-group label="Оплата">
              <salary-item
                :editable="true"
                :id="event.id"
                :salary="getEventSalary()"
                @salaryCommit="eventSalaryCommit"
                @salaryReset="eventSalaryReset"
                @salaryInProcess="salaryInProcess"
              ></salary-item>
            </b-form-group>

            <b-form-group label="Смены">
              <event-shifts-component
                :value="eventShifts"
                :editable="true"
                :eventSalaryCount="event.eventSalary.count"
                @salaryInProcess="salaryInProcess"
              ></event-shifts-component>
            </b-form-group>

            <b-row class="mt-2 buttons">
              <b-col cols="12" md="auto">
                <b-button
                  variant="primary"
                  class="w-100"
                  :disabled="$v.event.$invalid || isPageInProcess || isSalaryInProcess"
                  @click="onSubmitEvent"
                >Подтвердить</b-button>
              </b-col>
              <b-col cols="12" md="auto" v-if="!isNewEvent">
                <b-button
                  variant="outline-danger"
                  class="w-100"
                  @click="onDelete()"
                  :disabled="isPageInProcess"
                >Удалить</b-button>
              </b-col>
            </b-row>
          </b-form>
        </b-col>
      </b-row>
    </page-content>
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RouteConfig } from 'vue-router';
import moment from 'moment-timezone';
import axios from 'axios';

import Icon from 'vue-awesome/components/Icon';
import CPageContent from '@/components/layout/PageContent.vue';
import CEventTypeSelection from '@/components/selectors/EventTypeSelection.vue';
import CSalaryItem from '@/components/SalaryItem.vue';
import EventShiftsComponent from '@/components/EventShiftsComponent.vue'; // TODO: refactor

import { validationMixin } from 'vuelidate';
import { required, minLength, maxLength } from 'vuelidate/lib/validators';

import {
  IEvent,
  EventDefault,
  IEventType,
  EventTypeDefault,
  IEventShift,
  EVENTS_FETCH_ONE,
  EVENT_COMMIT,
  EVENT_DELETE,
  EventShiftDefault
} from '@/modules/events';

import {
  IEventSalary,
  EventSalaryDefault,
  EVENT_SALARY_FETCH_ONE,
  EVENT_SALARY_COMMIT,
  IShiftSalary,
  IPlaceSalary,
  ShiftSalaryDefault,
  PlaceSalaryDefault
} from '@/modules/salary';

import { IPageMeta } from '@/modules/layout';

const ADDRESS_ROWS_MAX = 4;
const ADDRESS_LENGTH_MAX = 250;

enum State {
  Default,
  InProcess,
  Error
}

@Component({
  components: {
    Icon,
    'page-content': CPageContent,
    'event-type-selection': CEventTypeSelection,
    'event-shifts-component': EventShiftsComponent,
    'salary-item': CSalaryItem
  },
  mixins: [validationMixin],
  validations() {
    return {
      event: {
        eventType: {
          required,
          selected: (eventType?: IEventType) => eventType && eventType.id !== ''
        },
        title: {
          required,
          minLength: minLength(1)
        },
        address: {
          required,
          minLength: minLength(1),
          maxLength: maxLength(ADDRESS_LENGTH_MAX),
          rowsLength: (address?: string) =>
            address && address.split(/\n\r|\n|\r/).length <= ADDRESS_ROWS_MAX
        },
        places: {
          validStructure: () => {
            const shifts = (this as EventEditPage).eventShifts;

            let shiftCount = 0;
            for (const shift of shifts) {
              if (shift.delete !== true) {
                shiftCount++;
              }

              if (shift.places.length === 0) {
                return false;
              }
            }
            return shiftCount > 0;
          }
        }
      }
    };
  }
})
export default class EventEditPage extends Vue {
  // Page properties //
  ////////////////////

  public loadingInProcess: boolean = false;
  public notFound: boolean = false;
  public pageState: State = State.Default;
  public isNewEvent: boolean = false;

  public isSalaryInProcess: boolean = false;
  // public salaryDescription: boolean = false;
  // public salaryPlaceholder: string = 'Сумма, \u20BD';

  // Event properties //
  /////////////////////

  public event: IEvent = new EventDefault();
  public eventShifts: IEventShift[] = [];

  // Component methods //
  //////////////////////

  public mounted() {
    this.loadingInProcess = true;
    const eventId = this.$route.params.id;
    if (eventId && eventId !== 'new') {
      this.$store
        .dispatch(EVENTS_FETCH_ONE, eventId)
        .then((event) => {
          this.event = { ...event, eventSalary: new EventSalaryDefault() };
        })
        .then(() => {
          this.$store
            .dispatch(EVENT_SALARY_FETCH_ONE, eventId)
            .then((eventSalary) => {
              this.setEventSalary(eventSalary);
              this.loadingInProcess = false;
            });
        })
        .catch((error) => {
          this.notFound = true;
          this.loadingInProcess = false;
        });
    } else {
      this.isNewEvent = true;
      this.loadingInProcess = false;
    }
  }

  // Event methods //
  //////////////////

  public onSubmitEvent() {
    if ((this.$v.event && this.$v.event.$invalid) || this.isPageInProcess) {
      return;
    }

    this.pageState = State.InProcess;

    // assign all edited data
    this.event.shifts = this.eventShifts;
    this.$store
      .dispatch(EVENT_COMMIT, this.event)
      .then((event) => {
        this.$store.dispatch(EVENT_SALARY_COMMIT, event[1]).then(() => {
          this.pageState = State.Default;
          this.$notify({
            title: 'Изменения успешно сохранены',
            duration: 500
          });
          this.$router.push({ path: '/events/' + event[0].id });
        });
      })
      .catch((error) => {
        this.pageState = State.Error;
        this.$notify({
          title: 'Невозможно сохранить изменения',
          type: 'error',
          duration: 1500
        });
      });
  }

  public onDelete() {
    if (confirm('Вы действительно хотите удалить это событие?')) {
      this.$store
        .dispatch(EVENT_DELETE, this.event.id)
        .then(() => {
          this.$notify({
            title: 'Событие удалено',
            duration: 500
          });
          this.$router.replace({ name: 'EventsPage' });
        })
        .catch();
    }
  }

  public setEvent(event: IEvent) {
    this.event = event;
  }

  public setEventSalary(eventSalary: IEventSalary) {
    if (eventSalary) {
      this.event.eventSalary = Object.assign({}, eventSalary);
      delete this.event.eventSalary.shiftSalaries;
      delete this.event.eventSalary.placeSalaries;
    } else {
      this.event.eventSalary = new EventSalaryDefault();
      eventSalary = Object.assign({}, new EventSalaryDefault());
      eventSalary.shiftSalaries = [];
      eventSalary.placeSalaries = [];
    }
    this.event.shifts.map((shift) => {
      if (eventSalary.shiftSalaries && this.event.eventSalary) {
        const shiftSalary = eventSalary.shiftSalaries.find((salary) => {
          return salary.shiftId === shift.id;
        });
        if (shiftSalary) {
          shift.shiftSalary = shiftSalary;
        } else {
          shift.shiftSalary = new ShiftSalaryDefault();
          shift.shiftSalary.count = this.event.eventSalary.count;
        }
      }

      shift.places.map((place) => {
        if (eventSalary.placeSalaries && shift.shiftSalary) {
          const placeSalary = eventSalary.placeSalaries.find((salary) => {
            return salary.placeId === place.id;
          });
          if (placeSalary) {
            place.placeSalary = placeSalary;
          } else {
            place.placeSalary = new PlaceSalaryDefault();
            place.placeSalary.count = shift.shiftSalary.count;
          }
        }
      });
    });
    this.eventShifts = this.event.shifts || [];
  }

  public handleAddressInput(e: KeyboardEvent) {
    const keyCode = window.event ? e.keyCode : e.which ? e.which : 0;

    if (
      keyCode === 13 &&
      this.event.address.split(/\n\r|\n|\r/).length >= ADDRESS_ROWS_MAX
    ) {
      e.preventDefault();
    }
  }

  public eventSalaryCommit(salary: IEventSalary) {
    this.event.eventSalary = salary;
    this.eventShifts.map((shift) => {
      if (shift.shiftSalary!.isNew === true) {
        shift.shiftSalary!.count = salary.count;
      }
      return shift;
    });
  }

  public eventSalaryReset() {
    this.event.eventSalary = {
      count: null,
      description: '',
      eventId: this.event.id,
      isNew: true
    };
    this.event.shifts.map((shift) => {
      shift.shiftSalary = {
        shiftId: shift.id,
        count: null,
        description: '',
        isNew: true
      };
      shift.places.map((place) => {
        place.placeSalary = {
          placeId: place.id,
          count: null,
          description: '',
          isNew: true
        };
        return place;
      });
      return shift;
    });
    this.$forceUpdate();
  }

  public getEventSalary() {
    return this.event.eventSalary;
  }

  public salaryInProcess(isSalaryInProcess: boolean) {
    this.isSalaryInProcess = isSalaryInProcess;
  }

  // Computed data //
  //////////////////

  get isPageInProcess(): boolean {
    return this.pageState === State.InProcess;
  }
}

export const eventEditPageRoute: RouteConfig = {
  path: '/events/edit/:id',
  name: 'EventEditPage',
  component: EventEditPage,
  meta: {
    allow: 'CanEditEvent'
  } as IPageMeta
};
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
@import '@/styles/general.scss';

.event-edit-page {
  .add-button {
    cursor: pointer;
  }
  .mx-input-append {
    @include theme-specific() {
      background-color: getstyle(form-control-background-color);
    }
  }

  .tabs {
    .nav.nav-tabs {
      border-bottom: 0;

      .nav-item .nav-link {
        border-bottom: 0;

        &:not(.active) {
          @include theme-specific {
            color: getstyle(page-font-color);
          }
        }
      }
    }

    .form-control {
      border-top-left-radius: 0;
    }
  }

  .markdown-preview {
    @extend .form-control;

    height: auto;
  }

  @include media-breakpoint-down(sm) {
    .buttons > div {
      margin-bottom: 0.5rem;
    }
    .buttons > div:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
<!-- STYLE END -->