import { createDecorator } from 'vue-class-component';

export const Meta = createDecorator((options: any, key) => {
  options.metaInfo = options.methods[key];
});
