import { onMounted, onUnmounted } from 'vue';

export const onKeyUp = (fn) => {
  onMounted(() => {
    document.addEventListener('keyup', fn);
  });

  onUnmounted(() => {
    document.removeEventListener('keyup', fn);
  });
};

export const onKeyDown = (fn) => {
  onMounted(() => {
    document.addEventListener('keydown', fn);
  });

  onUnmounted(() => {
    document.removeEventListener('keydown', fn);
  });
};
