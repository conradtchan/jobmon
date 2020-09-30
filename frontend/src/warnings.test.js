import generateWarnings, { instantWarnings } from './warnings';

const testData = require('../test/test_data.json');
const instantRef = require('../test/reference_instantWarnings.json');

const testHistoryData = require('../test/test_historyData.json');
const scoreRef = require('../test/reference_warningSums.json');

it('instantaneous warnings', () => {
  const w = instantWarnings(testData);

  // Check that objects are the same
  expect(w).toEqual(instantRef);
});

it('warning scores', () => {
  const snapshotTime = new Date(testHistoryData[testHistoryData.length - 1].timestamp);
  const w = generateWarnings(snapshotTime, testHistoryData);

  expect(w).toEqual(scoreRef);
});
