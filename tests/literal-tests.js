// Note: Also tests dice notation.

var test = require('tape');
var { Tablenest } = require('../index');
var layoutDef = require('./fixtures/layout-def');
var seedrandom = require('seedrandom');

var expectedResults = [
  {
    size: 23,
    types: ['default', 'ammonites'],
    layout: [
      'ammonites',
      'ammonites',
      'default',
      'ammonites',
      'ammonites',
      'ammonites',
      'ammonites',
      'ammonites',
      'default',
      'ammonites',
      'ammonites',
      'ammonites',
      'default',
      'ammonites',
      'ammonites',
      'ammonites',
      'ammonites',
      'ammonites',
      'default',
      'ammonites',
      'ammonites',
      'default',
      'ammonites'
    ]
  },

  {
    size: 17,
    types: ['ammonites', 'default'],
    layout: [
      'default',
      'default',
      'default',
      'default',
      'default',
      'default',
      'default',
      'default',
      'default',
      'default',
      'ammonites',
      'default',
      'default',
      'default',
      'default',
      'default',
      'default'
    ]
  }
];
var random = seedrandom('test');

expectedResults.forEach(runTest);

function runTest(expected) {
  test('Literal test', literalTest);

  function literalTest(t) {
    var tablenest = Tablenest({
      random
    });
    var layoutTable = tablenest(layoutDef);
    t.deepEqual(
      layoutTable.roll(),
      expected,
      'Correctly runs a def that has the literal marker and the die roll marker.'
    );
    t.end();
  }
}
