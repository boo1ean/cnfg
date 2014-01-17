var walk = require('walkdir')
  , resolve = require('path').resolve
  , _ = require('lodash');

module.exports = function(path, env) {
	var length = path.length,
	    config = {}, depth, files;

	env = env || process.env.NODE_ENV || 'development';

	var relativePathTokens = function(filepath) {
		return filepath.substr(length + 1);
	}

	var onlyFiles = function(filepath) {
		return endsWith(filepath, '.js') && !endsWith(filepath, 'index.js');
	}

	var grouper = function(path) {
		return path.split('/').length;
	}

	var extract = function(pivot) {
		return function(file) {
			var tokens = file.split('.');
			var key = file.split('/')[pivot].split('.')[0];
			var target = config[key] || {};
			config[key] = _.extend(target, require(path + '/' + file));
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

	var endsWith = function(string, suffix) {
		var l  = string.length - suffix.length;
		return l >= 0 && string.indexOf(suffix, l) === l;
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
