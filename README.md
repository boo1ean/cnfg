cnfg [![Build Status](https://travis-ci.org/boo1ean/cnfg.png?branch=master)](https://travis-ci.org/boo1ean/cnfg)
====

Hierarchical environment configuration for node.js applications

## Installation

	npm install cnfg

## Basic configuration

Assuming configuration is stored somewhere under `config` directory which contains list of component specific configs:

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

Extracting config:

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

Simply create a folder within the config directory that matches your environment name, such as `development` or `testing`. Next, create the configuration files you wish to override and specify the options for that environment.    

Here is example structure of environment-based config:

```
config
|-- api.js
|-- app.js
|-- db.js
|-- index.js
`-- development
|   |-- api.js
|   `-- db.js
`-- test
|   |-- api.js
|   `-- db.js
`-- production
    |-- api.js
    `-- db.js
```

Imagine we use passworded db connection only in `production` env, but all other stuff (dbname, user, etc.) is the same we can deal with it in the next way:

Common db config:
```javascript
// config/db.js
module.exports = {
	dbname: 'important_database',
	user: 'root'
}
```

`production` db config:
```javascript
// config/production/db.js
module.exports = {
	password: '12345678'
}
```

Put config extractor to `index.js` in `config` folder for convenience
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

You don't need to specify all config values in env-specific config, because it inherits previous level config.

## Specify environment

By default `process.env.NODE_ENV` value will be used as environment if it isn't set, then environment will be set to `development`.   
Also it is possible to specify environment manually passing it as seconf arg to `cnfg`:

```javascript
require('cnfg')(path_to_config, 'staging')
```

## process.env overrides

You can override config using `process.env` using this naming convention:

```
CNFG_DB__HOST=db.example.com
```

It will set `config.db.host` value.

```
CNFG_DB__CONNECTION__MASTER__HOST=master.db.example.com
```

will set `config.db.connection.master.host` value.

```
CNFG_DB__CONNECTION_URI=localhost@localhost
```

will set `config.db.connection_uri` value.

# License

The MIT License (MIT)
Copyright (c) 2014 Egor Gumenyuk <boo1ean0807@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
OR OTHER DEALINGS IN THE SOFTWARE.
