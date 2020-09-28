import generateWarnings, { instantWarnings } from './warnings';

const testData = require('../test/bobData_test.json');
const instantRef = require('../test/instantWarnings_reference.json');

const testHistoryData = require('../test/historyData_test.json');
const scoreRef = require('../test/warningSums_reference.json');

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
