var createProbable = require('probable').createProbable;
var curry = require('lodash.curry');
var getAtPath = require('get-at-path');

// Key refs are enclosed by {} and can have alphanumeric or / characters within.
var keyRefRegex = /{([\S/]+?)}/g;
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
    var readFromFirstPassQueue = [];
    for (var key in grammar) {
      tablesForKeys[key] = probable.createTableFromSizes(grammar[key]);
    }

    return {
      roll
    };

    function roll() {
      laterFnQueue.length = 0;
      readFromFirstPassQueue.length = 0;
      var result = expatiateToDeath(
        tablesForKeys['root'].roll(),
        null,
        [],
        resolveWithGrammar
      );
      readFromFirstPassQueue.forEach(
        curry(resolveUsingFirstPassResult)(result)
      );
      laterFnQueue.forEach(curry(resolveFnLater)(result));
      return result;
    }

    function expatiateToDeath(thing, parent, keyPathOnSource, resolve) {
      if (thing[needsToBeResolved]) {
        let type = typeof thing.target;
        if (type === 'string') {
          return expatiateString(
            thing.target,
            parent,
            keyPathOnSource,
            resolve
          );
        } else if (type === 'object') {
          //if (Array.isArray(thing.target)) {
          //} else {
          return expatiateObject(thing.target, keyPathOnSource, resolve);
          //}
        }
      } else {
        if (thing[needsToBeResolvedFnLater]) {
          laterFnQueue.push({
            fn: thing.fn,
            parent,
            key: getLast(keyPathOnSource)
          });
        }
        if (thing[readFromFirstPass]) {
          readFromFirstPassQueue.push({
            keyPathOnSource,
            thing: { [needsToBeResolved]: true, target: thing.target }
          });
        }
        return thing;
      }
    }

    function expatiateString(text, parent, keyPathOnSource, resolve) {
      var keys = getKeyRefs(text);
      if (keys.length < 1) {
        // The whole thing, then, is considered a key.
        return expatiateToDeath(
          resolve(concat(keyPathOnSource, text)),
          parent,
          keyPathOnSource,
          resolve
        );
      }

      // If there are keys marked by {} within the string,
      // we assume the result of this branch is a string,
      // rather than another type entirely.
      var textWithKeyRefsExpatiated = text;
      // keyRefs within text are special: For now we only support
      // refs that refer to keys at the top level of the result.
      // TODO: Support parsing {something/anotherthing/key} into paths.
      for (var i = 0; i < keys.length; ++i) {
        textWithKeyRefsExpatiated = expatiateKeyRefInString(
          getKeyPathFromKeyRef(keys[i]),
          resolve,
          textWithKeyRefsExpatiated
        );
      }

      return expatiateToDeath(
        textWithKeyRefsExpatiated,
        parent,
        keyPathOnSource,
        resolve
      );
    }

    function expatiateKeyRefInString(keyPathOnSource, resolve, text) {
      var key = getLast(keyPathOnSource);
      var expatiated = text.slice();

      var resolved = resolve(keyPathOnSource);
      expatiated = expatiated.replace(`{${key}}`, resolved);

      return expatiated;
    }

    function expatiateObject(obj, keyPathOnSource, resolve) {
      var resolvedObj = {};
      for (var key in obj) {
        resolvedObj[key] = expatiateToDeath(
          obj[key],
          resolvedObj,
          concat(keyPathOnSource, key),
          resolve
        );
      }
      return resolvedObj;
    }

    function resolveWithGrammar(keyPathOnSource) {
      return tablesForKeys[getLast(keyPathOnSource)].roll();
    }

    function resolveUsingFirstPassResult(result, { thing, keyPathOnSource }) {
      var parent = result;
      keyPathOnSource.slice(0, -1).forEach(walkSegment);
      parent[getLast(keyPathOnSource)] = expatiateToDeath(
        thing,
        parent,
        keyPathOnSource,
        curry(getAtPath)(result)
      );

      function walkSegment(segment) {
        if (parent) {
          parent = parent[segment];
        }
      }
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

function getKeyPathFromKeyRef(ref) {
  var parts = ref.split('/');
  if (parts.length > 0) {
    if (parts.length > 1) {
      return parts;
    } else {
      return [ref];
    }
  }
  return [];
}

module.exports = {
  Tablenest,
  r: markResolvable,
  f: markForFnLater,
  s: markReadFromFirstPass
};
