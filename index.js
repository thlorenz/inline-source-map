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

/**
 * Adds the given mappings to the generator and offsets them if offset is given 
 *
 * @name addMappings
 * @function
 * @param sourceFile {String} name of the source file
 * @param mappings {Array{{Object}} each object has the form { original: { line: _, column: _ }, generated: { line: _, column: _ } }
 * @param offset {Object} offset to apply to each mapping. Has the form { line: _, column: _ }
 * @return {Object} the generator to allow chaining
 */
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

/**
 * Generates mappings for the given source, assuming that no translation from original to generated is necessary.
 *
 * @name addGeneratedMappings
 * @function
 * @param sourceFile {String} name of the source file
 * @param source {String} source of the file
 * @param offset {Object} offset to apply to each mapping. Has the form { line: _, column: _ }
 * @return {Object} the generator to allow chaining
 */
Generator.prototype.addGeneratedMappings = function (sourceFile, source, offset) {
  var mappings = [];

  for (var line = 1; line <= linesIn(source); line++) {
    var location = { line: line, column: 0 };
    mappings.push({ original: location, generated: location });
  }

  return this.addMappings(sourceFile, mappings, offset);
};

/**
 * @name base64Encode
 * @function
 * @return {String} bas64 encoded representation of the added mappings
 */
Generator.prototype.base64Encode = function () {
  var map = this.generator.toString();
  return new Buffer(map).toString('base64');
};

/**
 * @name inlineMappingUrl
 * @function
 * @return {String} comment with base64 encoded representation of the added mappings. Can be inlined at the end of the generated file. 
 */
Generator.prototype.inlineMappingUrl = function () {
  return '//@ sourceMappingURL=data:application/json;base64,' + this.base64Encode();
};

module.exports = function (opts) { return new Generator(opts); };
module.exports.Generator = Generator;