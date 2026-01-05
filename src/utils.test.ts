import { add, isValidEmail } from "./utils";

describe("add", () => {
  it("should add two positive numbers", () => {
    expect(add(2, 3)).toBe(5);
  });

  it("should handle negative numbers", () => {
    expect(add(-1, 1)).toBe(0);
  });
});

describe("isValidEmail", () => {
  it("should return true for valid email", () => {
    expect(isValidEmail("test@example.com")).toBe(true);
  });

  it("should return false for invalid email", () => {
    expect(isValidEmail("invalid-email")).toBe(false);
  });
});
