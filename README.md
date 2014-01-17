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

Simply create a folder within the config directory that matches your environment name, such as local. Next, create the configuration files you wish to override and specify the options for that environment. Here is example structure of environment-based config:

```
config
|-- api.js
|-- app.js
|-- db.js
|-- index.js
|-- development
|   |-- api.js
|   `-- db.js
`-- test
    `-- api.js
|   `-- db.js
|-- production
|   |-- api.js
|   `-- db.js
```

Imagine we use passworded connection for db only in production env, but all other stuff (dbname, user, etc.) is the same we can deal with it in the next way:

Common db config:
```javascript
// config/db.js
module.exports = {
	dbname: 'important_database',
	user: 'root'
}
```

Production db config:
```javascript
// config/production/db.js
module.exports = {
	password: '12345678'
}
```

Put config extractor to index.js for convenience
```javascript
// config/index.js
// Put index js in config base directory and whe you require config dir
// it will return neat appropriate env config object
module.exports = require('cnfg')(__dirname);
```

Now use the config:
```javascript
var config = require('./path/to/config');

// Assuming process.env.NODE_ENV is set to production
// config.db will be equal to:
{
	dbname: 'important_database',
	user: 'root',
	password: '12345678'
}
```

## Specify environment

By default `process.env.NODE_ENV` value will be used as environment if it isn't set, then environment will be set to `development`.
ALso it is possible to specify environment manually passing it as seconf arg to `cnfg`:

```javascript
require('cnfg')(path_to_config, 'staging')
```
