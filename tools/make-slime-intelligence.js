var { Tablenest, r, f } = require('../index');

var slimeDef = {
  root: [
    [
      1,
      r({
        name: r`name`,
        Intelligences: r`ints`,
        INT: f(result => result.Intelligences + 2),
        cubicFt: f(result => result.Intelligences * 3),
        AC: 8,
        HD: f(result => ~~(result.Intelligences / 2)),
        maxHP: f((result, p) => {
          var total = 0;
          for (var i = 0; i < result.HD; ++i) {
            total += p.rollDie(8);
          }
          return total;
        })
      })
    ]
  ],
  name: [[4, r`{base}{suffix}`], [1, r`{prefix}{base}`]],
  suffix: [
    [10, 'ly'],
    [3, r` {friendlike}`],
    [8, 'eo'],
    [4, 'ulo'],
    [5, 'sy'],
    [5, 'ora'],
    [2, 'sight'],
    [1, 'bato'],
    [2, 'tra'],
    [1, 'ai'],
    [1, 'IQ'],
    [3, 'Hub'],
    [2, 'uten'],
    [6, 'on'],
    [5, 'Up'],
    [2, 'is'],
    [2, 'ize'],
    [3, 'stack'],
    [3, 'ate'],
    [4, 'urate'],
    [3, 'works'],
    [5, 'vy'],
    [5, 'os'],
    [5, 'ics'],
    [6, 'ful'],
    [5, 'alyze'],
    [2, 'vi'],
    [3, ' Zero'],
    [2, 'mo']
  ],
  prefix: [
    [3, 'Omni'],
    [1, 'Jabber'],
    [2, 'On'],
    [1, 'Confident'],
    [3, 'Bio'],
    [2, 'Crypto']
  ],
  friendlike: [[5, 'Buddy'], [5, 'Pal'], [4, 'Friend'], [3, 'Companion']],
  base: [
    [1, 'Ice'],
    [1, 'Water'],
    [2, 'Fire'],
    [1, 'Earth'],
    [1, 'Mist'],
    [1, 'Void'],
    [2, 'Slime'],
    [1, 'Smoke'],
    [1, 'Growth'],
    [1, 'Digestion'],
    [1, 'Decay'],
    [1, 'Spread'],
    [1, 'Absorb'],
    [1, 'Mud'],
    [1, 'Mold'],
    [1, 'Fungus'],
    [1, 'Drip'],
    [1, 'Mental'],
    [1, 'Eat']
  ],
  ints: [[4, 2], [3, 3], [2, 4], [1, 5], [4, r`bigInts`]],
  bigInts: [
    [
      1,
      f((result, p) => p.rollDie(20)),
      [
        2,
        f((result, p) => [0, 0, 0, 0, 0].reduce(sum => sum + p.rollDie(20), 20))
      ]
    ]
  ]
};

var tablenest = Tablenest();

var slimeTable = tablenest(slimeDef);
for (var i = 0; i < 10; ++i) {
  console.log(slimeTable.roll());
}
