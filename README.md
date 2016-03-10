tablenest
==================

Creates probability tables that expand references to other tables. Like [probable](https://www.npmjs.com/package/probable), but with [tracery](https://github.com/galaxykate/tracery)-like expansion.

Installation
------------

    npm install tablenest

Usage
-----

    var Tablenest = require('tablenest');
    var tablenest = Tablenest({
      random: Math.random
    });

    var bogDescriptionTable = tablenest({
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
        '1': '{naturalEntity} {naturalEntityAction} {naturalEntityFieldOfInfluence}'
      },
      animalScene: {
        '0': 'A {animal} {animalAction} {animalAdverb}.''
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
        '0': 'the wind',
        '1-2': 'a foul stench',
        '3': 'humidity',
        '4-5': 'warmth'
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
    });

    console.log(bogDescriptionTable.roll());

Output:

    A lizard lies formally. A komodo dragon stretches casually.

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
