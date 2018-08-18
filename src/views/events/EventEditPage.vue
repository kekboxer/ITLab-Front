<!-- TEMPALTE BEGIN -->
<template>
  <div class="event-edit-page">
    <b-container class="content">
      <b-row>
        <b-col>
          <h3 class="page-title">Событие</h3>
        </b-col>
      </b-row>
      <br>

      <loading-stub-component v-if="loadingInProcess"></loading-stub-component>
      <div v-else>
        <b-row v-if="!isNewEvent">
          <b-col>
            ID:
            <span style="font-family: monospace">{{ event.id }}</span>
            <hr>
          </b-col>
        </b-row>

        <b-row>
          <b-col>
            <b-form @submit.prevent="onSubmitEvent">
              <b-form-group id="event-type-group" label="Тип события">
                <event-type-selection-component v-model="eventTypeSelected"></event-type-selection-component>
              </b-form-group>

              <b-form-group id="event-title-group" label="Название" label-for="title-input">
                <b-form-input id="title-input" type="text" v-model.trim="event.title">
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
                <b-form-textarea id="address-input" :rows="2" :max-rows="3" v-model="event.address">
                </b-form-textarea>
              </b-form-group>

              <b-form-group id="event-shifts-group" label="Смены" label-for="shifts-input">
                <event-shifts-component v-model="eventShifts" :editable="true">
                </event-shifts-component>
              </b-form-group>

              <b-form-row>
                <b-col>
                  <b-button class="submit-button" type="submit" variant="primary" :disabled="isPageInProcess">Подтвердить</b-button>
                </b-col>
              </b-form-row>
            </b-form>
          </b-col>
        </b-row>
      </div>
      <br>
    </b-container>
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
import LoadingStubComponent from '@/components/LoadingStubComponent.vue';
import EventShiftsComponent from '@/components/EventShiftsComponent.vue';
import EventTypeSelectionComponent from '@/components/EventTypeSelectionComponent.vue';

import {
  Event,
  EventDefault,
  EventType,
  EventTypeDefault,
  EventShift,
  EVENTS_FETCH_ONE,
  EVENT_COMMIT
} from '@/store/modules/events';

enum State {
  Default,
  InProcess,
  Error
}

@Component({
  components: {
    'vue-markdown': VueMarkdown,
    'loading-stub-component': LoadingStubComponent,
    'event-shifts-component': EventShiftsComponent,
    'event-type-selection-component': EventTypeSelectionComponent
  }
})
export default class EventEditPage extends Vue {
  public DATETIME_FORMAT = 'DD.MM.YYYY HH:mm';

  // Page properties //
  ////////////////////

  public pageState: State = State.Default;
  public isNewEvent: boolean = false;
  public loadingInProcess: boolean = false;

  // Event properties //
  /////////////////////

  public event: Event = new EventDefault();
  public eventShifts: EventShift[] = [];
  public eventTypeSelected: EventType = new EventTypeDefault();

  // Component methods //
  //////////////////////

  public mounted() {
    this.loadingInProcess = true;

    const eventId = this.$route.params.id;
    if (eventId && eventId !== 'new') {
      this.$store.dispatch(EVENTS_FETCH_ONE, eventId).then((event) => {
        this.setEvent(event);

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
    if (this.eventTypeSelected) {
      this.pageState = State.InProcess;

      // assign all edited data
      this.event.shifts = this.eventShifts;
      this.event.eventTypeId = this.eventTypeSelected.id;

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
  }

  public setEvent(event: Event) {
    this.event = event;
    this.eventShifts = event.shifts || [];
    this.eventTypeSelected = event.eventType
      ? event.eventType
      : new EventTypeDefault();
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
}
</style>
<!-- STYLE END -->