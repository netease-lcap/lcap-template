import { watch } from 'vue';

export function useWatchProps(props, state, keys = [], $emit) {
  keys.forEach((key) => {
    watch(() => props[key], (value) => {
      state[key] = value;
    });

    watch(() => state[key], (value) => {
      $emit(`update:${key}`, value);
    });
  });
}
