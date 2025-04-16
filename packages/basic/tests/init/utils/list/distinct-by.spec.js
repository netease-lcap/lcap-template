const utils = global.sdkUtils;

describe('列表去重', () => {
  const obj1 = { name: 'Zhang San', gender: 'M', salary: '10000' };
  const obj2 = { name: 'Zhang San', gender: 'F', salary: '20000' };
  const obj3 = { name: 'Zhang San', gender: 'M', salary: '30000' };

  const objs = [obj3, obj2, obj1];

  test('ListDistinctBy', () => {
    expect(utils.ListDistinctBy(objs, [(i) => i.name, (i) => i.gender])).toEqual([obj3, obj2]);
  });

  test('ASYNC ListDistinctByAsync', async () => {
    const res = await utils.ListDistinctByAsync(objs, [(i) => i.name, (i) => i.gender]);
    expect(res).toEqual([obj3, obj2]);
  });

  test('Async 一致性', async () => {
    const res = await utils.ListDistinctByAsync(objs, [(i) => i.name, (i) => i.gender]);
    expect(res).toEqual(utils.ListDistinctBy(objs, [(i) => i.name, (i) => i.gender]));
  });
});
