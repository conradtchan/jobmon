import React from 'react';
import ReactDOM from 'react-dom';
import fetchMock from 'fetch-mock';
import App from './App';

const testData = require('../test/bobData_test.json');
const testHistory = require('../test/history.json');
const testBackfill = require('../test/history.json');

fetchMock.get('end:bobdata.py', testData);
fetchMock.get('glob:*bobdata.py?time=*', testData);
fetchMock.get('end:bobhistory.py', testHistory);
fetchMock.get('end:bobbackfill.py', testBackfill);

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  // ReactDOM.unmountComponentAtNode(div);
});

// sanity check
it('one is one', () => {
  expect(1).toEqual(1);
});

it('test data format', () => {
  const keys = Object.keys(testData);
  expect(keys).toEqual(expect.arrayContaining(
    ['api', 'timestamp', 'nodes', 'jobs'],
  ));
});
