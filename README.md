tablenest
==================

Creates probability tables that expand references to other tables. Like [probable](https://www.npmjs.com/package/probable), but with [tracery](https://github.com/galaxykate/tracery)-like expansion.

TODO:

Also, it can generate objects and arrays and handle references within those objects and arrays.

Installation
------------

    npm install tablenest

Usage
-----

    var Tablenest = require('tablenest');
    var tablenest = Tablenest({
      random: Math.random
    });

    var bogTable = {
      root: [[50, '{activeScene}'], [25, '{inactiveScene}']],
      activeScene: [
        [10, '{animalScene}'],
        [5, '{animalScene} {animalScene}'],
        [10, 'Bubbles blurble through the mud.']
      ],
      inactiveScene: [
        [1, '{plants} {locationVerb} {location}.'],
        [
          1,
          '{naturalEntity} {naturalEntityAction} {naturalEntityFieldOfInfluence}.'
        ]
      ],
      animalScene: [[1, 'A {animal} {animalAction} {animalAdverb}.']],
      plants: [[1, 'Vines'], [3, 'Lily pads'], [2, 'Wilted willows'], [4, 'Reeds']],
      locationVerb: [[1, 'sprawl'], [1, 'rest'], [2, 'lie'], [1, 'sit']],
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

    console.log(bogTable.roll());

Output:

    A lizard lies formally. A komodo dragon stretches casually.

TODO:

Another example:

    var thingsTable = tablenest({
      root: [
        [1, '{triangularNumberArray}'],
        [4, [0, 'dog', '{birds}', '{arthropodObject}']]
      ],
      triangularNumberArray: [
        [1, [3, 6, 10, 15, 21, 28, 36]],
        [1, [45, 55, 66, 78]]
      ],
      birds: [
        [7, ['nuthatch', 'chickadee']],
        [2, ['crow', raven']],
        [1, ['owl', 'hawk']]
      ],
      arthropodObject: [
        [1, { name: 'crab', habitat: '{waterHabitat}' }],
        [4, { name: 'spider', habitat: 'land', spiderType: '{spiderType}' }]
      ],
      spiderType: [
        [3, 'banana'],
        [1, 'brown recluse'],
        [1, 'tarantula']
      ],
      waterHabitat: [
        [7, 'ocean'],
        [2, 'lake'],
        [1, 'river]
      ]
    });
 
Tests
-----

Run tests with `make test`.

License
-------

The MIT License (MIT)

Copyright (c) 2016 Jim Kang

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
