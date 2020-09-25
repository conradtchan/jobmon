import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const testData = require('../test/bobData_test.json')
it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

// sanity check
it('one is one', () => {
  expect(1).toEqual(1);
});

it('test data format', () => {
  const keys = Object.keys(testData)
  expect(keys).toEqual(expect.arrayContaining(
    ['api', 'timestamp', 'nodes', 'jobs']
  ))

});
