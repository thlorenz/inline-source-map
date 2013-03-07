'use strict';
var SourceMapGenerator = require('source-map').SourceMapGenerator;

function offsetMapping(mapping, offset) {
  return { line: offset.line + mapping.line, column: offset.column + mapping.column };
}

function linesIn(src) {
  if (!src) return 0;
  var newLines = src.match(/\n/g);

  return newLines ? newLines.length + 1 : 1;
}
 
function Generator(opts) {
  opts = opts || {};
  this.generator = new SourceMapGenerator({ file: opts.file || '', sourceRoot: opts.sourceRoot || '' });
}

Generator.prototype.addMappings = function (sourceFile, mappings, offset) { 
  var generator = this.generator; 

  offset = offset || {};
  offset.line = offset.hasOwnProperty('line') ? offset.line : 0;
  offset.column = offset.hasOwnProperty('column') ? offset.column : 0;

  mappings.forEach(function (m) {
    generator.addMapping({
        source    :  sourceFile
      , original  :  m.original
      , generated :  offsetMapping(m.generated, offset)
    });
  });
  return this;
};

Generator.prototype.addGeneratedMappings = function (sourceFile, source, offset) {
  var mappings = [];

  for (var line = 1; line <= linesIn(source); line++) {
    var location = { line: line, column: 0 };
    mappings.push({ original: location, generated: location });
  }

  return this.addMappings(sourceFile, mappings, offset);
};

Generator.prototype.base64Encode = function () {
  var map = this.generator.toString();
  return new Buffer(map).toString('base64');
};

Generator.prototype.inlineMappingUrl = function () {
  return '//@ sourceMappingURL=data:application/json;base64,' + this.base64Encode();
};

module.exports = Generator;
