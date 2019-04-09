var { r, f, s } = require('../../index');

module.exports = {
  root: [
    [
      1,
      r({
        base: r`base`,
        prefix: r`prefix`,
        suffix: r`suffix`,
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
        }),
        hp: f(res => res.maxHP),
        THAC0: f(res => 21 - res.HD),
        absorbDmg: f(res => `1d${~~(res.Intelligences / 2) * 2}`),
        mist: r({
          form: f(res =>
            ['Water', 'Slime', 'Digestion', 'Enzyme', 'Mud', 'Drip'].indexOf(
              res.base
            ) !== -1
              ? 'spray'
              : 'cloud'
          ),
          damage: f(res => `1d${~~(res.Intelligences / 2) * 2}`),
          effect: f(res => {
            var effectsForBases = {
              Ice: 'become numb and unable to perform fine motor skills',
              Water: 'all fires go out; clothes are soaked',
              Fire: 'lose one random flammable item',
              Earth: 'mild concussion, will vomit if hit this round',
              Mist: 'blinded',
              Void: 'get entranced by a vision of a black hole',
              Slime: 'make DEX check or slip and fall',
              Smoke: 'cough uncontrollably, unable to act',
              Growth: 'body hair grows 1"',
              Digestion: 'one unit of food melts',
              Enzyme: 'saliva becomes extremely thick; unable to speak',
              Decay: 'disease causes 1d3 damage per hour',
              Spread: 'nothing, no damage even',
              Absorb: 'nothing, no damage even',
              Mud: 'make DEX check or slip and fall',
              Mold: 'infected, 1d3 damage per hour',
              Fungus: 'hallucinate, always gets directions wrong',
              Drip: 'make DEX check or slip and fall',
              Mental: 'relive bad memory, -1 to everything',
              Eat: 'feel hunger, must spend the round eating',
              Orb: 'nothing'
            };
            return effectsForBases[res.base];
          }),
          desc: s`{base} {mist/form}: save vs. poison or {mist/damage} and {mist/effect}`
        })
      })
    ]
  ],
  name: [[4, s`{base}{suffix}`], [1, s`{prefix}{base}`]],
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
