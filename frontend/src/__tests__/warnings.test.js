import { generateWarnings, instantWarnings } from "../warnings";

const testData = require("./test_data.json");
const instantRef = require("./reference_instantWarnings.json");

const testHistoryData = require("./test_historyData.json");
const scoreRef = require("./reference_warningSums.json");

it("instantaneous warnings", () => {
  const w = instantWarnings(testData);

  // Check that objects are the same
  expect(w).toEqual(instantRef);
});

it("warning scores", () => {
  const snapshotTime = new Date(testHistoryData[testHistoryData.length - 1].timestamp);
  const w = generateWarnings(snapshotTime, testHistoryData);

  expect(w).toEqual(scoreRef);
});
