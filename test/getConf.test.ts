import conf from "../src/config/config";

describe("getConf", () => {
  it("json config", () => {
    expect(JSON.stringify(conf)).toContain(
"{\"server\":{\"port\":3000,\"ipv6\":false},\"logger\":{\"exclude\":\"/health\",\"level\":\"info\",\"operationalTracer\":false},\"datasource\":{\"user\":\"root\",\"port\":5432,\"host\":\"dpg-d04b7n3uibrs73au6ds0-a.oregon-postgres.render.com\",\"database\":\"internaltravel\"},\"amadeusParams\":{\"officeId\":\"1234\",\"dutyCode\":\"pp\"}}");
});}); 