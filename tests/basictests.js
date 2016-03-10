var test = require('tape');
var Tablenest = require('../index');
var seedrandom = require('seedrandom');

var bogGrammar = {
  root: {
    '0-49': '{activeScene}',
    '50-74': '{inactiveScene}'
  },
  activeScene: {
    '0-9': '{animalScene}',
    '10-14': '{animalScene} {animalScene}',
    '15-24': 'Bubbles blurble through the mud.'
  },
  inactiveScene: {
    '0': '{plants} {locationVerb} {location}.',
    '1': '{naturalEntity} {naturalEntityAction} {naturalEntityFieldOfInfluence}.'
  },
  animalScene: {
    '0': 'A {animal} {animalAction} {animalAdverb}.'
  },
  plants: {
    '0': 'Vines',
    '1-3': 'Lily pads',
    '4-5': 'Wilted willows',
    '6-9': 'Reeds'
  },
  locationVerb: {
    '0': 'sprawl',
    '1': 'rest',
    '2-3': 'lie',
    '4': 'sit'
  },
  location: {
    '0-1': 'on the murky water',
    '1-3': 'all around',
    '4': 'everywhere',
    '5': 'under the mud'
  },
  naturalEntity: {
    '0': 'The wind',
    '1-2': 'A foul stench',
    '3': 'Humidity',
    '4-5': 'Warmth'
  },
  naturalEntityAction: {
    '0': 'rises',
    '1-2': 'blows',
    '3': 'hangs',
    '4-5': 'permeates'
  },
  naturalEntityFieldOfInfluence: {
    '0': 'above the muddy surface',
    '1-2': 'about',
    '3': 'in the air',
    '4-5': 'under the oppressive sun'
  },
  animal: {
    '0-3': 'frog',
    '4': 'toad',
    '5': 'lizard',
    '6-7': 'snake',
    '8': 'swarm of leeches',
    '9': 'cluster of flies',
    '10': 'muskrat',
    '11': 'alligator',
    '12': 'komodo dragon'
  },
  animalAction: {
    '0-1': 'stretches',
    '2': 'feasts on a carcass',
    '3': 'turns toward you',
    '4-5': 'lies',
    '6': 'dances',
    '7-8': 'rises from the muck',
    '9-10': 'sleeps'
  },
  animalAdverb: {
    '0-2': 'languidly',
    '3': 'frantically',
    '4': 'sloppily',
    '5-6': 'lazily',
    '7': 'aggressively',
    '8': 'erratically',
    '9': 'quickly',
    '10-11': 'casually',
    '12': 'formally'
  }
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
