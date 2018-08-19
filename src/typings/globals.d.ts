declare module 'globals' {
  import { Globals } from '@/globals';

  module 'vue/types/vue' {
    interface Vue {
      $g: Globals;
    }
  }
}
