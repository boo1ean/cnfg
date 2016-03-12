var cnfg = require('../'),
    expect = require('chai').expect;

describe('Hierarchical environment config extraction', function() {
	it('Should extract single-level config very well', function() {
		var path = __dirname + '/config-single-level';
		var expected = {
			'api': { key: '123' },
			'app': { transport: 'http' },
			'db': { name: 'johny' }
		};

		var config = cnfg(path);

		expect(config).to.be.deep.equal(expected);
	});

	it('Should extract two-level configuration like a boss', function() {
		var path = __dirname + '/config-two-levels';
		var expected = {
			'api': { key: '123' },
			'app': { transport: 'http' },
			'db': { name: 'johny' }
		};

		expect(cnfg(path)).to.be.deep.equal(expected);

		var expected_prod = {
			'api': { key: 'prod_123' },
			'app': { transport: 'http' },
			'db': { name: 'prod_johny', port: 5555 }
		};

		expect(cnfg(path, 'prod')).to.be.deep.equal(expected_prod);

		var expected_test = {
			'api': { key: '123', test_secret: 'wow such secret' },
			'app': { transport: 'http' },
			'db': { name: 'johny' }
		};

		expect(cnfg(path, 'test')).to.be.deep.equal(expected_test);
	});

	it('Should extract configuration with index.js in base dir', function() {
		var expected = {
			'api': { key: '123' },
			'app': { transport: 'http' },
			'db': { name: 'johny' }
		};

		expect(require('./config-with-index')).to.be.deep.equal(expected);
	});

	it('Should extract two-level configuration with index', function() {
		var path = './config-two-levels-with-index';

		var expected_prod = {
			'api': { key: 'prod_123' },
			'app': { transport: 'http' },
			'db': { name: 'prod_johny', port: 5555 }
		};

		expect(require(path)).to.be.deep.equal(expected_prod);
	});

	it('Should apply overrides env correctly', function () {
		var path = __dirname + '/config-with-env';

		var expected = {
			'api': { key: 'prod_123', key2: 'env key' },
			'app': { transport: 'http' },
			'db': { name: 'prod_johny', port: 5555 }
		};

		expect(cnfg(path, 'prod', { CNFG_API_KEY2: 'env key' })).to.be.deep.equal(expected);
	})
});

describe('Configuration', function(){
	it('Properties should not be changed', function(){
		var path = __dirname + '/config-single-level';
		var expected = {
			'api': { key: '123' },
			'app': { transport: 'http' },
			'db': { name: 'johny' }
		};

		var config = cnfg(path);

		expect(config).to.be.deep.equal(expected);

		config.api = 1;

		expect(config).to.be.deep.equal(expected);
	});

	it('May be extended with new properties', function(){
		var path = __dirname + '/config-single-level';
		var expected = {
			'api': { key: '123' },
			'app': { transport: 'http' },
			'db': { name: 'johny' }
		};

		var config = cnfg(path);

		expect(config).to.be.deep.equal(expected);

		config.newProp = 1;

		expect(config).to.have.property('newProp');
	});
});