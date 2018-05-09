declare module "vue-notification" {
  import _Vue, { PluginFunction } from "vue";

  export interface NotificationOptions {
    title?: string;
    text?: string;
    type?: string;
    group?: string;
    duration?: number;
    speed?: number;
    data?: object;
  }

  module 'vue/types/vue' {
    interface Vue {
      $notify: (options: NotificationOptions | string) => void;
    }
  }

  export class VueNotification {
    static install: PluginFunction<never>;
  }

  export default VueNotification;
}