'use strict';
var SourceMapGenerator = require('source-map').SourceMapGenerator;

function offsetMapping(offset, mapping) {
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

Generator.prototype.addMappings = function (sourceFile, offset, mappings) { 
  mappings.forEach(function (m) {
    this.generator.addMapping({
        source    :  sourceFile
      , original  :  m.original
      , generated :  offsetMapping(offset, m.generated)
    });
  });
};

Generator.prototype.addGeneratedMappings = function (sourceFile, offset, source) {
  var mappings = [];

  for (var line = 1; line <= linesIn(source); line++) 
    mappings.push({ line: line, column: 0 });

  return this.addMapping(sourceFile, offset, mappings);
};

Generator.prototype.toString = function () {
  var map = this.generator.toString();
  var encodedMap = new Buffer(map).toString('base64');
  return '//@ sourceMappingURL=data:application/json;base64,' + encodedMap;
};

module.exports = Generator;
