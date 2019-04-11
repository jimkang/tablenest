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
    maxHP: 1,
    hp: 1,
    THAC0: 20,
    absorbDmg: '1d2',
    mist: {
      form: 'spray',
      damage: '1d2',
      effect: 'make DEX check or slip and fall',
      desc:
        'Slime spray: save vs. poison or 1d2 and make DEX check or slip and fall'
    },
    color: 'green'
  },
  {
    base: 'Slime',
    prefix: 'On',
    suffix: 'vi',
    name: 'OnSlime',
    Intelligences: 2,
    INT: 4,
    cubicFt: 6,
    AC: 8,
    HD: 1,
    maxHP: 8,
    hp: 8,
    THAC0: 20,
    absorbDmg: '1d2',
    mist: {
      form: 'spray',
      damage: '1d2',
      effect: 'make DEX check or slip and fall',
      desc:
        'Slime spray: save vs. poison or 1d2 and make DEX check or slip and fall'
    },
    color: 'green'
  },
  {
    base: 'Ice',
    prefix: 'Bio',
    suffix: 'ate',
    name: 'Iceate',
    Intelligences: 16,
    INT: 18,
    cubicFt: 48,
    AC: 8,
    HD: 8,
    maxHP: 38,
    hp: 38,
    THAC0: 13,
    absorbDmg: '1d16',
    mist: {
      form: 'cloud',
      damage: '1d16',
      effect: 'become numb and unable to perform fine motor skills',
      desc:
        'Ice cloud: save vs. poison or 1d2 and become numb and unable to perform fine motor skills'
    },
    color: 'lightblue'
  },
  {
    base: 'Spread',
    prefix: 'Omni',
    suffix: 'is',
    name: 'Spreadis',
    Intelligences: 4,
    INT: 6,
    cubicFt: 12,
    AC: 8,
    HD: 2,
    maxHP: 5,
    hp: 5,
    THAC0: 19,
    absorbDmg: '1d4',
    mist: {
      form: 'cloud',
      damage: '1d4',
      effect: 'nothing, no damage even',
      desc: 'Spread cloud: save vs. poison or 1d4 and nothing, no damage even'
    },
    color: 'turquiose'
  },
  {
    base: 'Growth',
    prefix: 'Confident',
    suffix: 'vy',
    name: 'Growthvy',
    Intelligences: 9,
    INT: 11,
    cubicFt: 27,
    AC: 8,
    HD: 4,
    maxHP: 13,
    hp: 13,
    THAC0: 17,
    absorbDmg: '1d8',
    mist: {
      form: 'cloud',
      damage: '1d8',
      effect: 'body hair grows 1"',
      desc: 'Growth cloud: save vs. poison or 1d18 and body hair grows 1"'
    },
    color: 'yellow'
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
