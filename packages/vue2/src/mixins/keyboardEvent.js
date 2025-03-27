/**
 * fns: { name: string, type: 'keydown' | 'keyup' }[]
 */
export default (fns) => ({
  mounted() {
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.onKeyDown);
    document.removeEventListener('keyup', this.onKeyUp);
  },
  methods: {
    onKeyDown(e) {
      fns.forEach(({ name, type }) => {
        if (type === 'keydown') {
          this[name](e);
        }
      });
    },
    onKeyUp(e) {
      fns.forEach(({ name, type }) => {
        if (type === 'keyup') {
          this[name](e);
        }
      });
    },
  },
});
