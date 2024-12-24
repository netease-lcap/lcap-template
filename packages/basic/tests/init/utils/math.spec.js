import { utils as codewaveUtils } from "@/init/utils";

describe("数学函数", () => {
  test("Ceil", () => {
    expect(codewaveUtils.Ceil(2.5)).toBe(3);
    expect(codewaveUtils.Ceil(-2.5)).toBe(-2);
  });

  test("Floor", () => {
    expect(codewaveUtils.Floor(2.5)).toBe(2);
    expect(codewaveUtils.Floor(-2.5)).toBe(-3);
  });

  test("Trunc", () => {
    expect(codewaveUtils.Trunc(2.5)).toBe(2);
    expect(codewaveUtils.Trunc(-2.5)).toBe(-2);
  });

  test("TruncDivide", () => {
    expect(codewaveUtils.TruncDivide(5, 2)).toBe(2);
    expect(codewaveUtils.TruncDivide(-5, 2)).toBe(-2);
  });
});
