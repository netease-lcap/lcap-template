export default (css) => ({
  mounted() {
    this._addDynamicStyle();
  },
  beforeDestroy() {
    this._removeDynamicStyle();
  },
  methods: {
    _addDynamicStyle() {
      if (!css) {
        return;
      }

      this.styleTag = document.createElement('style');
      this.styleTag.type = 'text/css';
      this.styleTag.textContent = css;
      document.head.appendChild(this.styleTag);
    },
    _removeDynamicStyle() {
      if (this.styleTag) {
        document.head.removeChild(this.styleTag);
      }
    },
  },
});
