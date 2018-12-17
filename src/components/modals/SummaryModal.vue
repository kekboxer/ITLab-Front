<!-- TEMPLATE BEGIN -->
<template>
  <div class="c-summary-modal">
    <b-modal v-model="isModalVisible">
      <template slot="modal-title">
        Итоговый отчёт
      </template>

      <b-form-group>
        <b-form-checkbox-group
          v-model="selected"
          :options="options"
        >
        </b-form-checkbox-group>
      </b-form-group>

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
import axios from "axios";
import { Component, Prop, Vue } from "vue-property-decorator";
import { IEventType, EVENT_TYPES_FETCH_ALL } from "@/modules/events";

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
    this.$watch("value", (value: boolean) => {
      this.visibilityStuff = value;
    });

    this.$store
      .dispatch(EVENT_TYPES_FETCH_ALL)
      .then((eventTypes: IEventType[]) => {
        this.options = eventTypes.map(eventType => ({
          text: eventType.title,
          value: eventType.id
        }));
      });
  }

  // Methods //
  ////////////

  public async onSubmitModal() {
    console.log(this.selected);

    let data: string = "";
    try {
      const result = await axios.post("summary", {
        targetEventTypes: this.selected
      });
      data = result.data;
    } catch (body) {
      data = body.error;
    } finally {
      const a = document.createElement("a");
      const blob = new Blob(["\ufeff", data], { type: "test/csv" });
      a.href = window.URL.createObjectURL(blob);
      a.download = "summary.csv";
      a.click();
    }

    this.isModalInProcess = false;
    this.isModalVisible = false;
  }

  set isModalVisible(value: boolean) {
    this.$emit("input", value);
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