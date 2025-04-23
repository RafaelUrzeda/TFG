import conf from "../src/config/config";

describe("getConf", () => {
  it("json config", () => {
    expect(JSON.stringify(conf)).toContain(
"{}");
});}); 