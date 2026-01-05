export function useRefs(refs) {
  const $refs = {};
  const values = {};

  refs.forEach((item) => {
    const { key, ref } = item;
    Object.defineProperty($refs, key, {
      get() {
        return values.hasOwnProperty(key) ? values[key] : ref.value;
      },
      set(newValue) {
        values[key] = newValue;
      }
    });
  })

  return $refs;
}