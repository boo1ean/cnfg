cnfg [![Build Status](https://travis-ci.org/boo1ean/cnfg.png?branch=master)](https://travis-ci.org/boo1ean/cnfg)
====

Hierarchical environment configuration for node.js applications

## Basic configuration

Assuming configuration is stored somewhere under `config` directory which contains list of target specific configs:

```
config
|-- api.js
|-- app.js
`-- db.js
```

Each config file should export config object:

```javascript
// config/db.js
module.exports = {
	host: 'localhost',
	name 'root'
}
```

```javascript
// config/api.js
module.exports = {
	secret: 'many secrets'
}
```

And extracting whole config:

```javascript
// cnfg requires absolute path to the base config directory
var path = __dirname + '/config';
var config = require('cnfg')(path);

// All below statements are true
config.db.host == 'localhost';
config.api.secret == 'many secrets';
```

## Environment Configuration

It is often helpful to have different configuration values based on the environment the application is running in. For example, you may wish to use a different cache driver on your local development machine than on the production server. It is easy to accomplish this using environment based configuration.

Simply create a folder within the config directory that matches your environment name, such as local. Next, create the configuration files you wish to override and specify the options for that environment. For example, to override the cache driver for the local environment, you would create a cache.js file in config/local...
