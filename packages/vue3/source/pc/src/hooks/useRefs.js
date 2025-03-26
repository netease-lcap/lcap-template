export function useRefs(refs) {
  const $refs = {};

  refs.forEach((item) => {
    const { key, ref } = item;
    Object.defineProperty($refs, key, {
      get() {
        return ref.value
      }
    });
  })

  return $refs;
}
