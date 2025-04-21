import { check, group } from "k6";
import http from "k6/http";

let url = __ENV.URL_SERVICE;
let jwt = __ENV.JWT;

export let options = {
  maxRedirects: 4,
  stages: [
    { duration: "30s", target: 10 },
    { duration: "30s", target: 20 },
    { duration: "1m", target: 30 },
    { duration: "1m", target: 40 },
  ],
};

export default function () {
  group("Health", function () {
    let res = http.get(url + "/health");

    check(res, {
      "status is 200": (res) => res.status === 200,
      "is key correct": (res) => res.body === '{"status":"UP"}',
    });
  });

  group("Conf", function () {
    let res = http.get(url + "/conf", {
      headers: { Authorization: "Bearer " + jwt },
    });
    check(res, {
      "status is 200": (r) => r.status === 200,
      "is key correct": (r) => r.body.includes("server"),
    });
  });
}
