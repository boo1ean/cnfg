var	pathHelpers = require('path');
var debug = require('debug')('cnfg');
var fs = require('fs');

function isDirectory(path) {
	try {
		return fs.lstatSync(path).isDirectory();
	} catch (ignore) {
		return false;
	}
}

module.exports = function walkDirSync (path) {
	try {
		debug('read contents of dir: %s', path);

		var contents = fs.readdirSync(path);
		var result = [];

		contents.forEach(function (item) {
			var fullPath = pathHelpers.join(path, item);

			if (isDirectory(fullPath)) {
				var subContents = walkDirSync(fullPath);
				result.push.apply(result, subContents);
			} else {
				result.push(fullPath);
			}
		})
		debug('found %s items under %s', result.length, path);
		return result;
	} catch (ignore) {
		return []
	}
}
