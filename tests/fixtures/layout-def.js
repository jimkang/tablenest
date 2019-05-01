var { r, f } = require('../../index');
var range = require('d3-array').range;

module.exports = {
  root: [
    [
      1,
      r({
        size: f((o, p) => p.rollDie(16) + p.rollDie(16)),
        types: r`typeOrder`,
        layout: r`typeMix`
      })
    ]
  ],
  // TODO: tablenest needs some
  // kind of literal marker so
  // an array result can be used.
  typeOrder: [
    [1, f(() => ['default', 'ammonites'])],
    [1, f(() => ['ammonites', 'default'])]
  ],
  typeMix: [
    [1, f(o => range(o.size).map(() => o.types[0]))], // One type
    // Mostly one type
    [
      2,
      f((o, p) =>
        range(o.size).map(() => (p.roll(5) === 0 ? o.types[0] : o.types[1]))
      )
    ],
    // Even mix
    [
      1,
      f((o, p) =>
        range(o.size).map(() => (p.roll(2) === 0 ? o.types[0] : o.types[1]))
      )
    ]
  ]
};
