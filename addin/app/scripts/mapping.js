var transform = (typeof exports === 'object') ? require('../lib/jsonpath-object-transform') : window.jsonpathObjectTransform;

var path = {
  foo: ['$.some.crazy', {
    bar: '$.example'
  }]
};

var data = {
  some: {
    crazy: [
      {
        example: 'A'
      },
      {
        example: 'B'
      }
    ]
  }
};

var result = transform(data, path);

console.log(JSON.stringify(data, null, 2));
console.log(JSON.stringify(result, null, 2));
