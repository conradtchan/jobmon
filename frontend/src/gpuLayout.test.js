import extractGpuLayout from './gpuLayout';

const testData = require('../test/test_data.json');
const gpuLayoutRef = require('../test/reference_gpuLayout.json');

it('gpu layout', () => {
  const layout = extractGpuLayout(testData, null);
  expect(layout).toEqual(gpuLayoutRef);
});
