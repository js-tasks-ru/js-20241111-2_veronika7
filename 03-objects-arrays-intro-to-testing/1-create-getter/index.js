/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  return function(obj) {
    if (path && Object.keys(obj).length > 0) {
      const splittedPath = path.split('.');
      for (let i = 0; i < splittedPath.length; i++) {
        obj = obj[splittedPath[i]];
      }
      return obj;
    }
    return undefined;
  };
}
