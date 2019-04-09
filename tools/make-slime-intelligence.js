var { Tablenest } = require('../index');
var slimeDef = require('../tests/fixtures/slime-def');

var tablenest = Tablenest();

var slimeTable = tablenest(slimeDef);
for (var i = 0; i < 10; ++i) {
  console.log(slimeTable.roll());
}
