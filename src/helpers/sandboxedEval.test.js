import React from 'react';
import { IFRAME_SRC_DOC, evalParseObject } from './sandboxedEval'
import { mount } from 'enzyme';

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

function createIframe() {
  let ref = null;

  mount(
    <div>
      <iframe
        className='hidden-iframe'
        sandbox='allow-scripts'
        srcDoc={IFRAME_SRC_DOC}
        ref={(el) => ref = el}
      >
      </iframe>
    </div>
  );

  return ref;
}

test('parses a null object', async () => {
  let result = await(evalParseObject('', createIframe()));
  expect(result).toEqual({
    json: null,
    errorMessage: null,
  });
});

test('parses an empty object', async () => {
  let result = await(evalParseObject('{}', createIframe()));
  expect(result).toEqual({
    json: {},
    errorMessage: null,
  });
});

test('parses a minimal object string', async () => {
  let result = await(evalParseObject('{ a: 5 }', createIframe()));
  expect(result).toEqual({
    json: {
      a: 5
    },
    errorMessage: null,
  });
});

test('parses a minimal json string', async () => {
  let result = await(evalParseObject('{ "a": 5 }', createIframe()));
  expect(result).toEqual({
    json: {
      a: 5
    },
    errorMessage: null,
  });
});
