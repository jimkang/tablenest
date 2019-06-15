// Note: Also tests dice notation.

var test = require('tape');
var { Tablenest, r, f } = require('../index');
var seedrandom = require('seedrandom');

var testCases = [
  {
    name: 'Abbreviation at root',
    tableDef: {
      root: r({
        image: r`literalSpinnerImages`,
        r: f((result, p) => 5 + p.roll(20)),
        duration: f((result, p) => `${0.2 + p.roll(10)}s`)
      }),
      literalSpinnerImages: [
        [2, 'redFidgetSpinner'],
        [1, 'yellowFidgetSpinner']
      ]
    },
    expected: { image: 'redFidgetSpinner', r: 24, duration: '3.2s' }
  },
  {
    name: 'Abbreviation in child',
    tableDef: {
      root: [
        [
          1,
          r({
            name: 'spinner',
            image: r`literalSpinnerImages`
          })
        ],
        [
          2,
          r({
            name: 'bigspinner',
            image: r`literalSpinnerImages`
          })
        ]
      ],
      literalSpinnerImages: 'yellowFidgetSpinner'
    },
    expected: { name: 'bigspinner', image: 'yellowFidgetSpinner' }
  }
];

var random = seedrandom('test');

testCases.forEach(runTest);

function runTest(testCase) {
  test(testCases.name, abbreviationTest);

  function abbreviationTest(t) {
    var tablenest = Tablenest({
      random
    });
    var table = tablenest(testCase.tableDef);
    t.deepEqual(
      table.roll(),
      testCase.expected,
      'Interprets abbreviated entry correctly.'
    );
    t.end();
  }
}
