<!-- TEMPALTE BEGIN -->
<template>
  <div class="event-edit-page">
    <page-content-component :loading="loadingInProcess" :not-found="notFound">
      <template slot="header">
        Событие
      </template>

      <b-row v-if="!isNewEvent">
        <b-col>
          ID:
          <span style="font-family: monospace">{{ event.id }}</span>
          <hr>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-form>
            <b-form-group id="event-type-group" label="Тип события">
              <event-type-selection-component v-model="event.eventType" :state="!$v.event.eventType.$invalid"></event-type-selection-component>
            </b-form-group>

            <b-form-group id="event-title-group" label="Название" label-for="title-input">
              <b-form-input id="title-input" type="text" v-model.trim="event.title" :state="!$v.event.title.$invalid">
              </b-form-input>
            </b-form-group>

            <b-form-group id="event-description-group" label="Описание" label-for="description-input">
              <b-tabs>
                <b-tab title="Markdown" active>
                  <b-form-textarea id="description-input" style="font-family: monospace; resize: none" :rows="countRows(event.description, 3)" :max-rows="20" v-model="event.description">
                  </b-form-textarea>
                </b-tab>
                <b-tab title="Просмотр">
                  <div class="markdown markdown-preview">
                    <vue-markdown :html="false" :breaks="true" :linkify="true" :source="event.description"></vue-markdown>
                  </div>
                </b-tab>
              </b-tabs>
              <div class="w-100" align="right">
                <small>
                  <a target="_blank" href="https://guides.github.com/features/mastering-markdown">Markdown guide</a>
                </small>
              </div>
            </b-form-group>

            <b-form-group id="event-address-group" label="Адрес" label-for="address-input">
              <b-form-textarea id="address-input" :rows="2" :max-rows="3" v-model="event.address" :state="!$v.event.address.$invalid">
              </b-form-textarea>
            </b-form-group>

            <b-form-group id="event-shifts-group" label="Смены" label-for="shifts-input">
              <event-shifts-component v-model="eventShifts" :editable="true">
              </event-shifts-component>
            </b-form-group>

            <b-row class="mt-2 buttons">
              <b-col cols="12" md="auto">
                <b-button variant="primary" class="w-100" :disabled="$v.event.$invalid || isPageInProcess" @click="onSubmitEvent">Подтвердить</b-button>
              </b-col>
              <b-col cols="12" md="auto" v-if="!isNewEvent">
                <b-button variant="outline-danger" class="w-100" @click="onDelete()" :disabled="isPageInProcess">Удалить</b-button>
              </b-col>
            </b-row>
          </b-form>
        </b-col>
      </b-row>
    </page-content-component>
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RouteConfig } from 'vue-router';
import moment from 'moment-timezone';
import axios from 'axios';

import VueMarkdown from 'vue-markdown';
import PageContentComponent from '@/components/PageContentComponent.vue';
import EventShiftsComponent from '@/components/EventShiftsComponent.vue';
import EventTypeSelectionComponent from '@/components/EventTypeSelectionComponent.vue';

import { validationMixin } from 'vuelidate';
import { required, minLength } from 'vuelidate/lib/validators';

import {
  Event,
  EventDefault,
  EventType,
  EventTypeDefault,
  EventShift,
  EVENTS_FETCH_ONE,
  EVENT_COMMIT,
  EVENT_DELETE,
  EventShiftDefault
} from '@/modules/events';

enum State {
  Default,
  InProcess,
  Error
}

@Component({
  components: {
    'vue-markdown': VueMarkdown,
    'page-content-component': PageContentComponent,
    'event-shifts-component': EventShiftsComponent,
    'event-type-selection-component': EventTypeSelectionComponent
  },
  mixins: [validationMixin],
  validations() {
    return {
      event: {
        eventType: {
          required,
          selected: (eventType?: EventType) => eventType && eventType.id !== ''
        },
        title: {
          required,
          minLength: minLength(1)
        },
        address: {
          required,
          minLength: minLength(1)
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

  // Event properties //
  /////////////////////

  public event: Event = new EventDefault();
  public eventShifts: EventShift[] = [];

  // Component methods //
  //////////////////////

  public mounted() {
    this.loadingInProcess = true;

    const eventId = this.$route.params.id;
    if (eventId && eventId !== 'new') {
      this.$store
        .dispatch(EVENTS_FETCH_ONE, eventId)
        .then((event) => {
          this.setEvent(event);
          this.loadingInProcess = false;
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

    if (this.eventShifts.length === 0) {
      this.$notify({
        title: 'Добавьте хотя бы одну смену',
        type: 'error',
        duration: 1500
      });
      return;
    }

    this.pageState = State.InProcess;

    // assign all edited data
    this.event.shifts = this.eventShifts;

    this.$store
      .dispatch(EVENT_COMMIT, this.event)
      .then((event) => {
        this.setEvent(event);

        this.pageState = State.Default;
        if (this.isNewEvent) {
          this.isNewEvent = false;
          this.$router.push({ path: '/events/edit/' + event.id });
        } else {
          this.$notify({
            title: 'Изменения успешно сохранены',
            duration: 500
          });
        }
      })
      .catch((error) => {
        this.pageState = State.Error;
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

  public setEvent(event: Event) {
    this.event = event;
    this.eventShifts = event.shifts || [];
  }

  get isPageInProcess(): boolean {
    return this.pageState === State.InProcess;
  }

  public countRows(str: string, minValue: number = 0): number {
    const count = str.split(/\r\n|\r|\n/).length;
    return count < minValue ? minValue : count;
  }
}

export const eventEditPageRoute: RouteConfig = {
  path: '/events/edit/:id',
  name: 'EventEditPage',
  component: EventEditPage
};
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
@import '@/styles/general.scss';

.event-edit-page {
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