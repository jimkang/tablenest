var createProbable = require('probable').createProbable;
var curry = require('lodash.curry');

var keyRefRegex = /{(\S+?)}/g;
const needsToBeResolved = Symbol('resolveTarget');
const needsToBeResolvedAfterFirstPass = Symbol('resolveAfterFirstPassTarget');

function Tablenest(opts) {
  var probable;

  if (opts) {
    probable = createProbable({
      random: opts.random,
      recurse: false
    });
  } else {
    probable = createProbable();
  }

  function tablenest(grammar) {
    var tablesForKeys = {};
    var afterFirstPassQueue = [];
    for (var key in grammar) {
      tablesForKeys[key] = probable.createTableFromSizes(grammar[key]);
    }

    return {
      roll
    };

    function roll() {
      afterFirstPassQueue.length = 0;
      var result = expatiateToDeath(tablesForKeys['root'].roll());
      afterFirstPassQueue.forEach(curry(resolveAfterFirstPass)(result));
      return result;
    }

    function expatiateToDeath(thing, parent, key) {
      if (thing[needsToBeResolved]) {
        let type = typeof thing.target;
        if (type === 'string') {
          return expatiateString(thing.target, parent, key);
        } else if (type === 'object') {
          //if (Array.isArray(thing.target)) {
          //} else {
          return expatiateObject(thing.target);
          //}
        }
      } else {
        if (thing[needsToBeResolvedAfterFirstPass]) {
          afterFirstPassQueue.push({ fn: thing.fn, parent, key });
        }
        return thing;
      }
    }

    function expatiateString(text, parent, key) {
      var keys = getKeyRefs(text);
      if (keys.length < 1) {
        // The whole thing, then, is considered a key.
        return expatiateToDeath(tablesForKeys[text].roll(), parent, key);
      }

      // If there are keys marked by {} within the string,
      // we assume the result of this branch is a string,
      // rather than another type entirely.
      return expatiateToDeath(
        keys.reduce(expatiateKeyRefInString, text),
        parent,
        key
      );
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
        resolvedObj[key] = expatiateToDeath(obj[key], resolvedObj, key);
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

function resolveAfterFirstPass(result, { fn, parent, key }) {
  parent[key] = fn(result);
}

function markResolvable(n) {
  var target = n;
  // If this function is used as a template tag
  // the arguments will be wrapped such that we'll
  // have to pull the contents out.
  if ('raw' in n) {
    target = n[0];
  }
  return {
    [needsToBeResolved]: true,
    target
  };
}

function markForAfterFirstPass(fn) {
  return {
    [needsToBeResolvedAfterFirstPass]: true,
    fn
  };
}

module.exports = {
  Tablenest,
  r: markResolvable,
  f: markForAfterFirstPass
};
