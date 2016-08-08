var
  pathHelpers = require('path'),
  debug = require('debug')('cnfg'),
  fs = require('fs');

function isDirectory(path) {
  try {
    var info = fs.lstatSync(path);
    return info.isDirectory();
  } catch (ignore) {
    return false;
  }
}

module.exports = function walkDirSync(path) {
  try {
    debug('read contents of dir: ', path);
    var
      contents = fs.readdirSync(path),
      result = []
    contents.forEach(function (item) {
      var fullPath = pathHelpers.join(path, item);
      if (isDirectory(fullPath)) {
        var subContents = walkDirSync(fullPath);
        result.push.apply(result, subContents);
      } else {
        result.push(fullPath);
      }
    })
    debug('found ', result.length, ' items under ', path);
    return result;
  } catch (ignore) {
    return []
  }
}
