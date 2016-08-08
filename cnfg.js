var pathHelpers = require('path');
var resolve = pathHelpers.resolve;
var _ = require('lodash');
var debug = require('debug')('cnfg');
var walkDirSync = require('./walkDirSync');

function sanitizeExtensions(configuredExtensions) {
	if (!configuredExtensions) {
		return ['.js'];
	}
	return Array.isArray(configuredExtensions) 
					? configuredExtensions
					: [configuredExtensions]; 
}

module.exports = function(path, env, processEnv, configFileExtensions) {
	var length = path.length;
	var config = {};
  var depth, files, envs;

	var extensions = sanitizeExtensions(configFileExtensions); 

	env = env || process.env.NODE_ENV || 'development';

	var relativePathTokens = function(filepath) {
		return filepath.substr(length + 1);
	}

	var onlyFiles = function(filepath) {
		const fileExt = pathHelpers.extname(filepath);
		if (extensions.indexOf(fileExt) === -1) {
			return false;
		}
		var baseName = pathHelpers.basename(filepath);
		var baseNameWithoutExtension = baseName.substr(0, baseName.length - fileExt.length);
		return baseNameWithoutExtension !== 'index';
	}

	var grouper = function(path) {
		return path.split(pathHelpers.sep).length;
	}

	var extract = function(pivot) {
		return function(file) {
			var tokens = file.split('.');
			var key = file.split(pathHelpers.sep)[pivot].split('.')[0];
			var target = config[key] || {};
			config[key] = _.extend(target, require(path + pathHelpers.sep + file));
		}
	}

	var findEnv = function(files, env) {
		return files.filter(function(file) {
			return startsWith(file, env);
		});
	}

	var endsWith = function(string, suffix) {
		var l	= string.length - suffix.length;
		return l >= 0 && string.indexOf(suffix, l) === l;
	}

	var generateDefinePropertiesOptions = function(){
		var options = {};
		for (var opt in config){
			options[opt] = {
				writable: false,
				configurable: false
			};
		}
		return options;
	};

	debug('walk path %s', path);
	files = walkDirSync(path)
		.filter(onlyFiles)
		.map(relativePathTokens);


	files = _.groupBy(files, grouper);

	depth = Object.keys(files).length;
	envs = env.split('-');

	if (files[1]) {
		files[1].forEach(extract(0));
	}

	for (var i = 1; i < depth; ++i) {
		findEnv(files[depth], envs.slice(0, i).join(pathHelpers.sep)).forEach(extract(i));
	}

	return Object.defineProperties(applyEnvOverrides(config, processEnv || process.env), generateDefinePropertiesOptions());
}

function startsWith (str, starts) {
	if (starts === '') return true;
	if (str == null || starts == null) return false;
	str = String(str); starts = String(starts);
	return str.length >= starts.length && str.slice(0, starts.length) === starts;
}

function applyEnvOverrides (config, processEnv) {
	Object.keys(processEnv).filter(function (name) {
		return startsWith(name, 'CNFG');
	}).forEach(function (override) {
		// Remove CNFG prefix
		var path = override.toLowerCase().slice(5).split('__');
		debug('apply env override %s', path);
		_.set(config, path, processEnv[override]);
	});

	return config;
}
