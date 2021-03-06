var createProbable = require('probable').createProbable;
var curry = require('lodash.curry');
var getAtPath = require('get-at-path');
var DiceCup = require('dicecup');

// Key refs are enclosed by {} and can have alphanumeric or / characters within.
var keyRefRegex = /{([\S/]+?)}/g;
const needsToBeResolved = Symbol('resolveTarget');
const needsToBeResolvedFnLater = Symbol('resolveFnLaterTarget');
const readFromFirstPass = Symbol('readFromFirstPass');
const lookUpInMap = Symbol('lookUpInMap');
const literal = Symbol('literal');
const dieRoll = Symbol('dieRoll');

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

  var cup = DiceCup({ probable });

  return tablenest;

  function tablenest(grammar) {
    var tablesForKeys = {};
    for (var key in grammar) {
      let tableDef = grammar[key];
      // Check for use of abbreviated entry.
      // (just <value> to indicate a table def of [[1, <value>]].
      if (
        !Array.isArray(tableDef) ||
        tableDef.length < 1 ||
        !Array.isArray(tableDef[0])
      ) {
        tableDef = [[1, tableDef]];
      }
      tablesForKeys[key] = probable.createTableFromSizes(tableDef);
    }

    // uglify-es (when either compressing or mangling) turns roll
    // into a function that returns the actual roll function when you
    // wrap it in an object this way.
    //return {
    //  roll
    //};
    return roll;

    function roll() {
      var laterFnQueue = [];
      var readFromFirstPassQueue = [];

      var { expatiated } = expatiateToDeath(
        tablesForKeys['root'].roll(),
        null,
        [],
        curry(resolveWithGrammar)(tablesForKeys),
        readFromFirstPassQueue,
        laterFnQueue
      );
      for (var i = 0; i < 10; ++i) {
        //console.log('iteration', i);
        let unresolvedQueue = [];
        readFromFirstPassQueue.forEach(
          curry(resolveUsingFirstPassResult)(
            expatiated,
            unresolvedQueue,
            laterFnQueue
          )
        );

        // TODO: Stop running all the functions on each iteration;
        // They also need to be able to say whether they're resolved.
        laterFnQueue.forEach(curry(resolveFnLater)(expatiated));

        if (unresolvedQueue.length < 1) {
          break;
        } else {
          readFromFirstPassQueue = unresolvedQueue.slice();
        }
      }

      return expatiated;
    }
  }

  function expatiateToDeath(
    thing,
    parent,
    keyPathOnSource,
    resolve,
    readFromFirstPassQueue,
    laterFnQueue
  ) {
    if (thing[needsToBeResolved]) {
      let type = typeof thing.target;
      if (type === 'string') {
        return expatiateString(
          thing.target,
          parent,
          keyPathOnSource,
          resolve,
          readFromFirstPassQueue,
          laterFnQueue
        );
      } else if (type === 'object') {
        //if (Array.isArray(thing.target)) {
        //} else {
        return expatiateObject(
          thing.target,
          keyPathOnSource,
          resolve,
          readFromFirstPassQueue,
          laterFnQueue
        );
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
        if (!readFromFirstPassQueue) {
          throw new Error('Missing readFromFirstPassQueue!');
        }
        readFromFirstPassQueue.push({
          keyPathOnSource,
          thing: { [needsToBeResolved]: true, target: thing.target }
        });
      } else if (thing[lookUpInMap]) {
        if (!readFromFirstPassQueue) {
          throw new Error('Missing readFromFirstPassQueue!');
        }
        readFromFirstPassQueue.push({
          // Here, the source is the map.
          keyPathOnSource: thing.target.split('/'),
          targetParent: parent,
          targetKey: getLast(keyPathOnSource),
          thing: {
            [needsToBeResolved]: true,
            target: thing.target,
            map: thing.map
          }
        });
      } else if (thing[literal]) {
        thing = thing.target;
      } else if (thing[dieRoll]) {
        thing = getCupRollTotal(cup.roll(thing.target));
      }

      return { expatiated: thing, isResolved: true };
    }
  }

  function expatiateString(
    text,
    parent,
    keyPathOnSource,
    resolve,
    readFromFirstPassQueue,
    laterFnQueue
  ) {
    var keys = getKeyRefs(text);
    if (keys.length < 1) {
      // The whole thing, then, is considered a key.
      return expatiateToDeath(
        resolve(concat(keyPathOnSource, text)),
        parent,
        keyPathOnSource,
        resolve,
        readFromFirstPassQueue,
        laterFnQueue
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
      let { expatiated, isResolved } = expatiateKeyRefInString(
        keys[i],
        resolve,
        textWithKeyRefsExpatiated
      );
      if (!isResolved) {
        return { isResolved };
      } else {
        textWithKeyRefsExpatiated = expatiated;
      }
    }

    return expatiateToDeath(
      textWithKeyRefsExpatiated,
      parent,
      keyPathOnSource,
      resolve,
      readFromFirstPassQueue,
      laterFnQueue
    );
  }

  function expatiateKeyRefInString(keyPathString, resolve, text) {
    var keyPathOnSource = getKeyPathFromKeyRef(keyPathString);
    var expatiated = text.slice();

    var value = resolve(keyPathOnSource);
    var isResolved = !hasMarkers(value);
    if (isResolved) {
      expatiated = expatiated.replace(`{${keyPathString}}`, value);
    }

    return { expatiated, isResolved };
  }

  function expatiateObject(
    obj,
    keyPathOnSource,
    resolve,
    readFromFirstPassQueue,
    laterFnQueue
  ) {
    var resolvedObj = {};
    for (var key in obj) {
      let { isResolved, expatiated } = expatiateToDeath(
        obj[key],
        resolvedObj,
        concat(keyPathOnSource, key),
        resolve,
        readFromFirstPassQueue,
        laterFnQueue
      );
      if (!isResolved) {
        return { isResolved };
      } else {
        resolvedObj[key] = expatiated;
      }
    }
    return { expatiated: resolvedObj, isResolved: true };
  }

  function resolveWithGrammar(tablesForKeys, keyPathOnSource) {
    return tablesForKeys[getLast(keyPathOnSource)].roll();
  }

  function resolveUsingFirstPassResult(
    result,
    unresolvedQueue,
    laterFnQueue,
    { thing, keyPathOnSource, targetParent, targetKey }
  ) {
    var parent = result;
    var value;
    keyPathOnSource.slice(0, -1).forEach(walkSegment);
    if (thing.map) {
      value = expatiateToDeath(
        thing,
        parent,
        keyPathOnSource,
        curry(getAtPathThenPutThroughMap)(thing.map, result),
        null,
        laterFnQueue
      );
    } else {
      value = expatiateToDeath(
        thing,
        parent,
        keyPathOnSource,
        curry(getAtPath)(result),
        null,
        laterFnQueue
      );
    }
    var { isResolved, expatiated } = value;
    if (isResolved) {
      if (targetParent && targetKey) {
        // TODO: Should everything use targetParent and targetKey?
        targetParent[targetKey] = expatiated;
      } else {
        parent[getLast(keyPathOnSource)] = expatiated;
      }
    } else {
      // Try again later.
      unresolvedQueue.push({ keyPathOnSource, thing });
    }

    function walkSegment(segment) {
      if (parent) {
        parent = parent[segment];
      }
    }
  }

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

// Every marker that is available in template string
// needs to use this.
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

function markLiteral(n) {
  return {
    [literal]: true,
    target: n
  };
}

function markDieRoll(n) {
  return {
    [dieRoll]: true,
    target: getRawVal(n)
  };
}

function markLookUpInMap({ target, map }) {
  return {
    [lookUpInMap]: true,
    target,
    map
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

function hasMarkers(n) {
  return (
    n[needsToBeResolved] ||
    n[needsToBeResolvedFnLater] ||
    n[readFromFirstPass] ||
    n[lookUpInMap] ||
    n[literal] ||
    n[dieRoll]
  );
}

function getAtPathThenPutThroughMap(map, result, keyPath) {
  var valueAtPath = getAtPath(result, keyPath);
  return map[valueAtPath];
}

function getCupRollTotal(rollsArray) {
  return rollsArray.reduce(addRollsTotal, 0);
}

function addRollsTotal(sum, rollsObject) {
  return sum + isNaN(rollsObject.total) ? 0 : rollsObject.total;
}

module.exports = {
  Tablenest,
  r: markResolvable,
  f: markForFnLater,
  s: markReadFromFirstPass,
  m: markLookUpInMap,
  l: markLiteral,
  d: markDieRoll
};
