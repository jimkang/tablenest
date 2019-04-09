var test = require('tape');
var { Tablenest } = require('../index');
var slimeDef = require('./fixtures/slime-def');
var seedrandom = require('seedrandom');

var expectedResults = [
  {
    base: 'Slime',
    prefix: 'Crypto',
    suffix: 'ora',
    name: 'Slimeora',
    Intelligences: 2,
    INT: 4,
    cubicFt: 6,
    AC: 8,
    HD: 1,
    maxHP: 4
  },
  {
    base: 'Mud',
    prefix: 'On',
    suffix: 'Up',
    name: 'OnMud',
    Intelligences: 16,
    INT: 18,
    cubicFt: 48,
    AC: 8,
    HD: 8,
    maxHP: 41
  },
  {
    base: 'Digestion',
    prefix: 'Bio',
    suffix: 'eo',
    name: 'Digestioneo',
    Intelligences: 3,
    INT: 5,
    cubicFt: 9,
    AC: 8,
    HD: 1,
    maxHP: 8
  },
  {
    base: 'Spread',
    prefix: 'Bio',
    suffix: 'alyze',
    name: 'Spreadalyze',
    Intelligences: 5,
    INT: 7,
    cubicFt: 15,
    AC: 8,
    HD: 2,
    maxHP: 7
  },
  {
    base: 'Digestion',
    prefix: 'Jabber',
    suffix: 'ora',
    name: 'Digestionora',
    Intelligences: 2,
    INT: 4,
    cubicFt: 6,
    AC: 8,
    HD: 1,
    maxHP: 2
  }
];

var random = seedrandom('test');

expectedResults.forEach(runTest);

function runTest(expected) {
  test('Resolve later test', resolveLaterTest);

  function resolveLaterTest(t) {
    var tablenest = Tablenest({
      random: random
    });
    var slimeTable = tablenest(slimeDef);
    t.deepEqual(slimeTable.roll(), expected, 'Correct result is rolled.');
    t.end();
  }
}
