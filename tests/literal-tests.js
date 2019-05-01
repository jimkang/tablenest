var test = require('tape');
var { Tablenest } = require('../index');
var layoutDef = require('./fixtures/layout-def');
var seedrandom = require('seedrandom');

var expectedResults = [
  {
    size: 11,
    types: ['default', 'ammonites'],
    layout: [
      'default',
      'default',
      'default',
      'ammonites',
      'default',
      'default',
      'ammonites',
      'ammonites',
      'default',
      'ammonites',
      'ammonites'
    ]
  },
  {
    size: 21,
    types: ['default', 'ammonites'],
    layout: [
      'ammonites',
      'ammonites',
      'default',
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
      'ammonites',
      'ammonites',
      'ammonites',
      'ammonites',
      'ammonites',
      'ammonites'
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
      'Correctly runs a def that has the literal marker.'
    );
    t.end();
  }
}
