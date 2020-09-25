import { instantWarnings } from './warnings';

const testData = require('../test/bobData_test.json');

it('instantaneous warnings', () => {
  instantWarnings(testData);
});
