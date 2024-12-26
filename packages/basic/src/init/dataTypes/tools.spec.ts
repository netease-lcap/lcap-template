import { judgeStrType } from "./tools";

describe("judgeStrType", () => {
  test("Date", () => {
    expect(judgeStrType("2021-01-01")).toBe("nasl.core.Date");
    // 不检查月份错误
    expect(judgeStrType("2021-13-01")).toBe("nasl.core.Date");
  });

  test("Time", () => {
    expect(judgeStrType("12:30:00")).toBe("nasl.core.Time");
    expect(judgeStrType("11:22")).toBe("nasl.core.Time");
    expect(judgeStrType("25:00:00")).toBe("nasl.core.Time");
  });

  test("DateTime", () => {
    expect(judgeStrType("2021-01-01T05:11:22.010Z")).toBe("nasl.core.DateTime");
    expect(judgeStrType("2021-01-01 05:11:22")).toBe("nasl.core.DateTime");
  });

  test("模式错误的DateTime", () => {
    expect(judgeStrType("2021-01-01T12:30:00")).toBeUndefined();
    expect(judgeStrType("2021-01-01T12:30:00Z")).toBeUndefined();
    expect(judgeStrType("2021-01-01T12:30:00.1Z")).toBeUndefined();
  });
});
