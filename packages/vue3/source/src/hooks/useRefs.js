export function useRefs(refs) {
  const $refs = {};
  const values = new WeakMap();

  refs.forEach((item) => {
    const { key, ref } = item;
    Object.defineProperty($refs, key, {
      get() {
        return values.has(ref) ? values.get(ref) : ref.value;
      },
      set(newValue) {
        values.set(ref, newValue);
      }
    });
  })

  return $refs;
}