import extractGpuLayout from './gpuLayout';

const testData = require('../test/bobData_test.json');
const gpuLayoutRef = require('../test/gpuLayout_test.json');

it('gpu layout', () => {
  const layout = extractGpuLayout(testData, null);
  expect(layout).toEqual(gpuLayoutRef);
});
