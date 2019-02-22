var test = require('tape');
var Tablenest = require('../index');
var seedrandom = require('seedrandom');

var bogGrammar = {
  root: [ 
    [50, '{activeScene}'],
    [25, '{inactiveScene}']
  ],
  activeScene: [
    [10, '{animalScene}'],
    [5, '{animalScene} {animalScene}'],
    [10, 'Bubbles blurble through the mud.']
  ],
  inactiveScene: [
    [1, '{plants} {locationVerb} {location}.'],
    [1, '{naturalEntity} {naturalEntityAction} {naturalEntityFieldOfInfluence}.']
  ],
  animalScene: [
    [1, 'A {animal} {animalAction} {animalAdverb}.']
  ],
  plants: [
    [1, 'Vines'],
    [3, 'Lily pads'],
    [2, 'Wilted willows'],
    [4, 'Reeds']
  ],
  locationVerb: [
    [1, 'sprawl'],
    [1, 'rest'],
    [2, 'lie'],
    [1, 'sit']
  ],
  location: [
    [2, 'on the murky water'],
    [3, 'all around'],
    [1, 'everywhere'],
    [1, 'under the mud']
  ],
  naturalEntity: [
    [1, 'The wind'],
    [2, 'A foul stench'],
    [1, 'Humidity'],
    [2, 'Warmth']
  ],
  naturalEntityAction: [
    [1, 'rises'],
    [2, 'blows'],
    [1, 'hangs'],
    [2, 'permeates']
  ],
  naturalEntityFieldOfInfluence: [
    [1, 'above the muddy surface'],
    [2, 'about'],
    [1, 'in the air'],
    [2, 'under the oppressive sun']
  ],
  animal: [
    [4, 'frog'],
    [1, 'toad'],
    [1, 'lizard'],
    [2, 'snake'],
    [1, 'swarm of leeches'],
    [1, 'cluster of flies'],
    [1, 'muskrat'],
    [1, 'alligator'],
    [1, 'komodo dragon']
  ],
  animalAction: [
    [2, 'stretches'],
    [1, 'feasts on a carcass'],
    [1, 'turns toward you'],
    [2, 'lies'],
    [1, 'dances'],
    [2, 'rises from the muck'],
    [2, 'sleeps']
  ],
  animalAdverb: [
    [3, 'languidly'],
    [1, 'frantically'],
    [1, 'sloppily'],
    [2, 'lazily'],
    [1, 'aggressively'],
    [1, 'erratically'],
    [1, 'quickly'],
    [2, 'casually'],
    [1, 'formally']
  ]
};

var expectedResults = [
  'Reeds rest all around.',
  'A lizard lies formally. A komodo dragon stretches casually.',
  'Vines lie all around.',
  'Bubbles blurble through the mud.',
  'A muskrat stretches lazily.'
];

var random = seedrandom('test');

expectedResults.forEach(runTest);

function runTest(expected) {
  test('Basic test', function basicTest(t) { 
    var tablenest = Tablenest({
      random: random
    });
    var bogTable = tablenest(bogGrammar);
    t.equal(bogTable.roll(), expected, 'Correct result is rolled.');
    t.end();
  });
}

