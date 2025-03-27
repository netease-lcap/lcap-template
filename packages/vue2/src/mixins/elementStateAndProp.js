export default (list = []) => ({
  data() {
    const obj = {};
    list.forEach((item) => {
      const { element, key, type, defaultValue } = item;
      obj[`${element}_${type || ''}_${key}`] = defaultValue;
    });

    return {
      ...obj,
    };
  },
  methods: {
    onSyncState(elem, key, val) {
      this[`${elem}_state_${key}`] = val;
    },
  },
});
