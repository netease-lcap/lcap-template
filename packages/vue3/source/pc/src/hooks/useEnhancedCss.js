import { onMounted, onUnmounted } from "vue";

export const useEnhancedCss = (css) => {
  let styleTag = null;

  onMounted(() => {
    if (!css) return;
    styleTag = document.createElement("style");
    styleTag.type = "text/css";
    styleTag.textContent = css;
    document.head.appendChild(styleTag);
  });

  onUnmounted(() => {
    if (styleTag) {
      document.head.removeChild(styleTag);
    }
  });
};
