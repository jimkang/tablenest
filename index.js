var createProbable = require('probable').createProbable;
var curry = require('lodash.curry');

var keyRefRegex = /{(\S+?)}/g;
const needsToBeResolved = Symbol('resolveTarget');
const needsToBeResolvedFnLater = Symbol('resolveFnLaterTarget');
const readFromFirstPass = Symbol('readFromFirstPass');

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
    var laterFnQueue = [];
    for (var key in grammar) {
      tablesForKeys[key] = probable.createTableFromSizes(grammar[key]);
    }

    return {
      roll
    };

    function roll() {
      laterFnQueue.length = 0;
      var result = expatiateToDeath(tablesForKeys['root'].roll(), null, []);
      laterFnQueue.forEach(curry(resolveFnLater)(result));
      return result;
    }

    function expatiateToDeath(thing, parent, keyPath) {
      if (thing[needsToBeResolved]) {
        let type = typeof thing.target;
        if (type === 'string') {
          return expatiateString(thing.target, parent, keyPath);
        } else if (type === 'object') {
          //if (Array.isArray(thing.target)) {
          //} else {
          return expatiateObject(thing.target, keyPath);
          //}
        }
      } else {
        if (thing[needsToBeResolvedFnLater]) {
          laterFnQueue.push({ fn: thing.fn, parent, key: getLast(keyPath) });
        }
        if (thing[readFromFirstPass]) {
          //readFromFirstPassQueue.push({ targetParent: parent, targetKey: key, thing
        }
        return thing;
      }
    }

    function expatiateString(text, parent, keyPath) {
      var keys = getKeyRefs(text);
      if (keys.length < 1) {
        // The whole thing, then, is considered a key.
        return expatiateToDeath(
          resolveWithGrammar(concat(keyPath, text)),
          parent,
          keyPath
        );
      }

      // If there are keys marked by {} within the string,
      // we assume the result of this branch is a string,
      // rather than another type entirely.
      return expatiateToDeath(
        keys.map(curry(concat)(keyPath)).reduce(expatiateKeyRefInString, text),
        parent,
        keyPath
      );
    }

    function expatiateKeyRefInString(text, keyPath) {
      var expatiated = text.slice();
      if (key in tablesForKeys) {
        var resolved = resolveWithGrammar(keyPath);
        expatiated = expatiated.replace(`{${key}}`, resolved);
      }
      return expatiated;
    }

    function expatiateObject(obj, keyPath) {
      var resolvedObj = {};
      for (var key in obj) {
        resolvedObj[key] = expatiateToDeath(
          obj[key],
          resolvedObj,
          concat(keyPath, key)
        );
      }
      return resolvedObj;
    }

    function resolveWithGrammar(keyPath) {
      return tablesForKeys[getLast(keyPath)].roll();
    }
  }

  return tablenest;

  function resolveFnLater(result, { fn, parent, key }) {
    parent[key] = fn(result, probable);
  }
}

function getKeyRefs(text) {
  var matches;
  var refs = [];

  while ((matches = keyRefRegex.exec(text)) !== null) {
    refs.push(matches[1]);
  }

  return refs;
}

function getRawVal(n) {
  if ('raw' in n) {
    return n[0];
  }
  return n;
}

function markResolvable(n) {
  // If this function is used as a template tag
  // the arguments will be wrapped such that we'll
  // have to pull the contents out.
  return {
    [needsToBeResolved]: true,
    target: getRawVal(n)
  };
}

function markReadFromFirstPass(n) {
  return {
    [readFromFirstPass]: true,
    target: getRawVal(n)
  };
}

function markForFnLater(fn) {
  return {
    [needsToBeResolvedFnLater]: true,
    fn
  };
}

function getLast(array) {
  if (array.length > 0) {
    return array[array.length - 1];
  }
}

function concat(array, item) {
  return array.concat([item]);
}

module.exports = {
  Tablenest,
  r: markResolvable,
  f: markForFnLater,
  s: markReadFromFirstPass
};
