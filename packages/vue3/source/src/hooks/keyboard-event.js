import { onMounted, onUnmounted } from 'vue';

export const useKeyUp = (fn) => {
  onMounted(() => {
    document.addEventListener('keyup', fn);
  });

  onUnmounted(() => {
    document.removeEventListener('keyup', fn);
  });
};

export const useKeyDown = (fn) => {
  onMounted(() => {
    document.addEventListener('keydown', fn);
  });

  onUnmounted(() => {
    document.removeEventListener('keydown', fn);
  });
};
