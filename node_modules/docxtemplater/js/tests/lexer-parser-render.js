"use strict";

var Lexer = require("../lexer.js");

var _require = require("./utils"),
    expect = _require.expect,
    makeDocx = _require.makeDocx,
    cleanRecursive = _require.cleanRecursive;

var fixtures = require("./fixtures");

var docxconfig = require("../file-type-config").docx;

var inspectModule = require("../inspect-module.js");

var tagsDocxConfig = {
  text: docxconfig.tagsXmlTextArray,
  other: docxconfig.tagsXmlLexedArray
};
describe("Algorithm", function () {
  Object.keys(fixtures).forEach(function (key) {
    var fixture = fixtures[key];
    (fixture.only ? it.only : it)(fixture.it, function () {
      var doc = makeDocx(key, fixture.content);
      doc.setOptions(fixture.options);
      var iModule = inspectModule();
      doc.attachModule(iModule);
      doc.setData(fixture.scope);
      doc.render();
      cleanRecursive(iModule.inspect.lexed);
      cleanRecursive(iModule.inspect.parsed);
      cleanRecursive(iModule.inspect.postparsed);

      if (iModule.inspect.content && fixture.result !== null) {
        expect(iModule.inspect.content).to.be.deep.equal(fixture.result, "Content incorrect");
      }

      if (fixture.lexed !== null) {
        expect(iModule.inspect.lexed).to.be.deep.equal(fixture.lexed, "Lexed incorrect");
      }

      if (fixture.parsed !== null) {
        expect(iModule.inspect.parsed).to.be.deep.equal(fixture.parsed, "Parsed incorrect");
      }

      if (fixture.postparsed !== null) {
        expect(iModule.inspect.postparsed).to.be.deep.equal(fixture.postparsed, "Postparsed incorrect");
      }
    });
  });
  Object.keys(fixtures).forEach(function (key) {
    var fixture = fixtures[key];
    (fixture.only ? it.only : it)("Async ".concat(fixture.it), function () {
      var doc = makeDocx(key, fixture.content);
      doc.setOptions(fixture.options);
      var iModule = inspectModule();
      doc.attachModule(iModule);
      doc.compile();
      return doc.resolveData(fixture.scope).then(function () {
        doc.render();
        cleanRecursive(iModule.inspect.lexed);
        cleanRecursive(iModule.inspect.parsed);
        cleanRecursive(iModule.inspect.postparsed);

        if (iModule.inspect.content) {
          expect(iModule.inspect.content).to.be.deep.equal(fixture.result, "Content incorrect");
        }

        if (fixture.resolved) {
          expect(iModule.inspect.resolved).to.be.deep.equal(fixture.resolved, "Resolved incorrect");
        }

        if (fixture.lexed !== null) {
          expect(iModule.inspect.lexed).to.be.deep.equal(fixture.lexed, "Lexed incorrect");
        }

        if (fixture.parsed !== null) {
          expect(iModule.inspect.parsed).to.be.deep.equal(fixture.parsed, "Parsed incorrect");
        }

        if (fixture.postparsed !== null) {
          expect(iModule.inspect.postparsed).to.be.deep.equal(fixture.postparsed, "Postparsed incorrect");
        }
      });
    });
  });
  it("should xmlparse strange tags", function () {
    var xmllexed = Lexer.xmlparse(fixtures.strangetags.content, tagsDocxConfig);
    cleanRecursive(xmllexed);
    expect(xmllexed).to.be.deep.equal(fixtures.strangetags.xmllexed);
  });
});