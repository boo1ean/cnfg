var walk = require('walkdir')
  , resolve = require('path').resolve
  , fs = require('fs')
  , _ = require('lodash');

module.exports = function(path, env) {
	var length = path.length,
	    config = {};

	env = env || process.ENV;

	var relativePathTokens = function(filepath) {
		return filepath.substr(length + 1).split('/');
	}

	var onlyFiles = function(filepath) {
		return filepath.match(/\..+$/);
	}

	var grouper = function(tokens) {
		return tokens.length;
	}

	var extract = function(pivot) {
		return function(file) {
			var tokens = file[pivot].split('.');
			config[tokens[0]] = require(path + '/' + file.join('/'));
		}
	}

	var findEnv = function(files, env) {
		return files.filter(function(file) {
			return env === file[0];
		});
	}

	var files = walk.sync(path)
		.filter(onlyFiles)
		.map(relativePathTokens);

	files = _.groupBy(path, grouper);

	files['1'].forEach(extract(0));
	findEnv(files['2'], env).forEach(extract(1));

	return config;
}
