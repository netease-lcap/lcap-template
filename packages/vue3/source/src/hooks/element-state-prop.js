export function useElementStateAndProp(state, list = []) {
  list.forEach((item) => {
    const { element, key, type, defaultValue } = item;
    state[`${element}_${type || ''}_${key}`] = defaultValue;
  });

  return {
    onSyncState(elem, key, val) {
      state[`${elem}_state_${key}`] = val;
    },
    getStateKey(elem, key, type) {
      return `${elem}_${type || ''}_${key}`;
    }
  }
}
