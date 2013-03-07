'use strict';
/*jshint asi: true*/

var test = require('trap').test
var Generator = require('..');

var foo = '' + function foo () {
  var hello = 'hello';
  var world = 'world';
  console.log('%s %s', hello, world);
}

var bar = '' + function bar () {
  console.log('yes?');
}

function decode(mapping) {
  return new Buffer(mapping, 'base64').toString();
} 

test('generated mappings', function (t) {
  t.test('no offset', function (t) {
    var gen = new Generator()
      .addGeneratedMappings('foo.js', foo)
      .addGeneratedMappings('bar.js', bar)

    t.equal(
        decode(gen.base64Encode())
      , '{"version":3,"file":"","sources":["foo.js","bar.js"],"names":[],"mappings":"AAAA,ACAA;ADCA,ACAA;ADCA,ACAA;ADCA;AACA"}'
      , 'encodes generated mappings'
    )
    t.equal(
        gen.inlineMappingUrl()
      , '//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlcyI6WyJmb28uanMiLCJiYXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsQUNBQTtBRENBLEFDQUE7QURDQSxBQ0FBO0FEQ0E7QUFDQSJ9'
      , 'returns correct inline mapping url'
    )
  })
  t.test('with offset', function (t) {
    var gen = new Generator()
      .addGeneratedMappings('foo.js', foo, { line: 20 })
      .addGeneratedMappings('bar.js', bar, { line: 23, column: 22 })

    t.equal(
        decode(gen.base64Encode())
      , '{"version":3,"file":"","sources":["foo.js","bar.js"],"names":[],"mappings":";;;;;;;;;;;;;;;;;;;;AAAA;AACA;AACA;AACA,sBCHA;ADIA,sBCHA;sBACA"}'
      , 'encodes generated mappings'
    )
  })
});
