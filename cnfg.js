var walk = require('walkdir')
  , resolve = require('path').resolve
  , fs = require('fs')
  , _ = require('lodash');

module.exports = function(path, env) {
	var length = path.length,
	    config = {}, depth, files;

	env = env || process.ENV;

	var relativePathTokens = function(filepath) {
		return filepath.substr(length + 1);
	}

	var onlyFiles = function(filepath) {
		return filepath.match(/\..+$/);
	}

	var grouper = function(path) {
		return path.split('/').length;
	}

	var extract = function(pivot) {
		return function(file) {
			var tokens = file.split('.');
			var key = file.split('/')[pivot].split('.')[0];
			config[key] = require(path + '/' + file);
		}
	}

	var findEnv = function(files, env) {
		return files.filter(function(file) {
			return startsWith(file, env);
		});
	}

	var startsWith = function(str, starts) {
		if (starts === '') return true;
		if (str == null || starts == null) return false;
		str = String(str); starts = String(starts);
		return str.length >= starts.length && str.slice(0, starts.length) === starts;
	}

	files = walk.sync(path)
		.filter(onlyFiles)
		.map(relativePathTokens);

	files = _.groupBy(files, grouper);

	depth = Object.keys(files).length;
	envs = env.split('-');

	if (files[1]) {
		files[1].forEach(extract(0));
	}

	for (var i = 1; i < depth; ++i) {
		findEnv(files[depth], envs.slice(0, i).join('/')).forEach(extract(i));
	}

	return config;
}
