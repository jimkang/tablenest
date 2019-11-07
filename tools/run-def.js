/* global process, __dirname */

var { Tablenest } = require('../index');

if (process.argv.length < 3) {
  console.error('Usage: node tools/run-def.js <def module location>');
  process.exit();
}

var def = require(__dirname + '/../' + process.argv[2]);

var tablenest = Tablenest();

var roll = tablenest(def);
for (var i = 0; i < 10; ++i) {
  console.log(roll());
}
