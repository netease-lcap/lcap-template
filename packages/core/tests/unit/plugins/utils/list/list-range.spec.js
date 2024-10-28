import { utils as u } from "@/plugins/utils/index.js";

describe("List range functions", () => {
  test("List range step > 0", () => {
    {
      const expectArr = [1, 3, 5, 7, 9];
      const testArr = u.ListRange(1, 10, 2);
      expect(JSON.stringify(expectArr)).toEqual(JSON.stringify(testArr));
    }
    {
      const expectArr = [-10, -9, -8, -7, -6, -5, -4, -3, -2];
      const testArr = u.ListRange(-10, -1, 1);
      expect(JSON.stringify(expectArr)).toEqual(JSON.stringify(testArr));
    }
    {
      const expectArr = [];
      const testArr = u.ListRange(10, 1, 1);
      expect(JSON.stringify(expectArr)).toEqual(JSON.stringify(testArr));
    }
    {
      const expectArr = [];
      const testArr = u.ListRange(-1, -10, 1);
      expect(JSON.stringify(expectArr)).toEqual(JSON.stringify(testArr));
    }
    {
      const expectArr = [];
      const testArr = u.ListRange(1, 1, 1);
      expect(JSON.stringify(expectArr)).toEqual(JSON.stringify(testArr));
    }
  });
  test("List range step < 0", () => {
    {
      const expectArr = [10, 8, 6, 4, 2];
      const testArr = u.ListRange(10, 1, -2);
      expect(JSON.stringify(expectArr)).toEqual(JSON.stringify(testArr));
    }
    {
      const expectArr = [-1, -3, -5, -7, -9];
      const testArr = u.ListRange(-1, -10, -2);
      expect(JSON.stringify(expectArr)).toEqual(JSON.stringify(testArr));
    }
    {
      const expectArr = [];
      const testArr = u.ListRange(1, 10, -1);
      expect(JSON.stringify(expectArr)).toEqual(JSON.stringify(testArr));
    }
    {
      const expectArr = [];
      const testArr = u.ListRange(-10, -1, -1);
      expect(JSON.stringify(expectArr)).toEqual(JSON.stringify(testArr));
    }
    {
      const expectArr = [];
      const testArr = u.ListRange(1, 1, -1);
      expect(JSON.stringify(expectArr)).toEqual(JSON.stringify(testArr));
    }
  });
  test("List range step == 0", () => {
    {
      const expectArr = [];
      const testArr = u.ListRange(1, 10, 0);
      expect(JSON.stringify(expectArr)).toEqual(JSON.stringify(testArr));
    }
  });
});
