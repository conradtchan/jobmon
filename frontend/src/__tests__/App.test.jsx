import React from "react";
import ReactDOM from "react-dom";
import fetchMock from "fetch-mock";
import App from "../App";

const testData = require("./test_data.json");
const testHistory = require("./test_history.json");
const testBackfill = require("./test_backfill.json");

fetchMock.get("end:data.py", testData);
fetchMock.get("glob:*data.py?time=*", testData);
fetchMock.get("end:history.py", testHistory);
fetchMock.get("end:backfill.py", testBackfill);

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<App />, div);
});

// sanity check
it("one is one", () => {
  expect(1).toEqual(1);
});

it("data format", () => {
  const keys = Object.keys(testData);
  expect(keys).toEqual(expect.arrayContaining(
    ["api", "timestamp", "nodes", "jobs"],
  ));
});
