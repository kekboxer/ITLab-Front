<!-- TEMPLATE BEGIN -->
<template>
  <div class="c-summary-modal">
    <b-modal v-model="isModalVisible">
      <template slot="modal-title">
        Итоговый отчёт
      </template>

      <b-form-group>
        <h5 v-if="options.length === 0">Нет событий.</h5>
        <b-form-checkbox-group
          stacked
          v-model="selected"
          :options="options"
        >
        </b-form-checkbox-group>
      </b-form-group>
      <b-form>
        
      </b-form>
      <template slot="modal-footer">
        <button
          type="button"
          class="btn btn-secondary"
          @click="isModalVisible = false"
        >Закрыть</button>
        <button
          type="button"
          class="btn btn-primary"
          :disabled="selected.length == 0 || isModalInProcess"
          @click="onSubmitModal"
        >Скачать</button>
      </template>
    </b-modal>
  </div>
</template>
<!-- TEMPALTE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import axios from 'axios';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { IEventType, EVENT_TYPES_FETCH_ALL } from '@/modules/events';

@Component
export default class CSummaryModal extends Vue {
  // v-modal //
  ////////////

  @Prop({
    default: false
  })
  public value!: boolean;

  // Properties //
  ///////////////

  public isModalInProcess: boolean = false;

  public options: Array<{ text: string; value: string }> = [];
  public selected: string[] = [];

  private visibilityStuff: boolean = false;

  // Component methods //
  //////////////////////

  public mounted() {
    this.$watch('value', (value: boolean) => {
      this.visibilityStuff = value;
    });

    this.$store
      .dispatch(EVENT_TYPES_FETCH_ALL)
      .then((eventTypes: IEventType[]) => {
        this.options = eventTypes.map((eventType) => ({
          text: eventType.title,
          value: eventType.id
        }));
      });
  }

  // Methods //
  ////////////

  public async onSubmitModal() {
    this.isModalInProcess = true;

    let data: any = null;

      const response = await axios.post(
        'bad',
        {
          targetEventTypes: this.selected
        },
        {
          responseType: 'blob'
        }
      );

      if(Math.floor(response.status / 100) === 5){
        alert("Произошла ошибка, попробуйте позже. Error " + response.status)
      }else{
        data = response.data;
        const url = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'summary.xlsx');
        document.body.appendChild(link);
        link.click();
      }

    this.isModalInProcess = false;
    this.isModalVisible = false;
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