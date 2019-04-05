var createProbable = require('probable').createProbable;
var keyRefRegex = /{(\S+?)}/g;

const needsToBeResolved = Symbol('resolveTarget');

function Tablenest(opts) {
  var probable;

  if (opts) {
    probable = createProbable({
      random: opts.random
    });
  } else {
    probable = createProbable();
  }

  function tablenest(grammar) {
    var tablesForKeys = {};
    for (var key in grammar) {
      tablesForKeys[key] = probable.createTableFromSizes(grammar[key]);
    }

    return {
      roll
    };

    function roll() {
      return expatiateToDeath(tablesForKeys['root'].roll());
    }

    function expatiateToDeath(thing) {
      debugger;
      if (thing[needsToBeResolved]) {
        let type = typeof thing.target;
        if (type === 'string') {
          return expatiateString(thing.target);
        } else if (type === 'object') {
          return expatiateObject(thing.target);
        }
      } else {
        return thing;
      }
    }

    function expatiateString(text) {
      var keys = getKeyRefs(text);
      if (keys.length < 1) {
        // The whole thing, then, is considered a key.
        return expatiateToDeath(tablesForKeys[text].roll());
      }

      // If there are keys marked by {} within the string,
      // we assume the result of this branch is a string,
      // rather than another type entirely.
      return expatiateToDeath(keys.reduce(expatiateKeyRefInString, text));
    }

    function expatiateKeyRefInString(text, key) {
      var expatiated = text.slice();
      if (key in tablesForKeys) {
        var resolved = tablesForKeys[key].roll();
        expatiated = expatiated.replace('{' + key + '}', resolved);
      }
      return expatiated;
    }

    function expatiateObject(obj) {
      var resolvedObj = {};
      for (var key in obj) {
        resolvedObj[key] = expatiateToDeath(obj[key]);
      }
      return resolvedObj;
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

function markResolvable(target) {
  return {
    [needsToBeResolved]: true,
    target
  };
}

module.exports = {
  Tablenest,
  r: markResolvable
};
