'use strict';
/*jshint asi: true*/

var test = require('trap').test
var Generator = require('..');

var src = '' + function foo () {
  var hello = 'hello';
  var world = 'world';
  console.log('%s %s', hello, world);
}

test('no mappings given', function (t) {
  var gen = new Generator()
    .addGene
});
