import extractGpuLayout from '../gpuLayout';

const testData = require('./test_data.json');
const gpuLayoutRef = require('./reference_gpuLayout.json');

it('gpu layout', () => {
  const layout = extractGpuLayout(testData, null);
  expect(layout).toEqual(gpuLayoutRef);
});
