var createProbable = require('probable').createProbable;
var keyRefRegex = /{(.*?)}/g;

function Tablenest(createOpts) {
  var random;

  if (createOpts) {
    random = createOpts.random;
  }

  var probable = createProbable({
    random: random
  });

  function tablenest(grammar) {
    var tablesForKeys = {};
    for (var key in grammar) {
      tablesForKeys[key] = probable.createTableFromDef(grammar[key]);
    }

    return {
      roll: roll
    };

    function roll() {
      return expatiateToDeath('{root}', ['root']);
    }

    function expatiateToDeath(text, keys) {
      var expatiated = keys.reduce(expatiateKeyRef, text);
      var nextKeys = getKeyRefs(expatiated);
      if (nextKeys.length > 0) {
        return expatiateToDeath(expatiated, nextKeys);
      }
      else {
        return expatiated;
      }
    }

    function expatiateKeyRef(text, key) {
      var expatiated = text;
      if (key in tablesForKeys) {
        var resolved = tablesForKeys[key].roll();
        expatiated = expatiated.replace('{' + key + '}', resolved);
      }
      return expatiated;
    }
  }

  return tablenest;
}

function getKeyRefs(text) {
  var matches;
  var refs = [];

  while ((matches = keyRefRegex.exec(text)) !== null) {
    refs.push(matches[1]);
  }

  return refs;
}

module.exports = Tablenest;
