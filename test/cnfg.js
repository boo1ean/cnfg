var cnfg = require('../');

describe('Hierarchical environment config extraction', function() {
	it('Should extract single-level config very well', function() {
		var path = __dirname + '/config-single-level';
		var expected = {
			'api': { key: '123' },
			'app': { transport: 'http' },
			'db': { name: 'johny' }
		};

		var config = cnfg(path);

		JSON.stringify(config).should.be.equal(JSON.stringify(expected));
	});

	it('Should extract two-level configuration like a boss', function() {
		var path = __dirname + '/config-two-levels';
		var expected = JSON.stringify({
			'api': { key: '123' },
			'app': { transport: 'http' },
			'db': { name: 'johny' }
		});

		JSON.stringify(cnfg(path)).should.be.equal(expected);

		var expected_prod = JSON.stringify({
			'api': { key: 'prod_123' },
			'app': { transport: 'http' },
			'db': { name: 'prod_johny', port: 5555 }
		});

		JSON.stringify(cnfg(path, 'prod')).should.be.equal(expected_prod);

		var expected_test = JSON.stringify({
			'api': { key: '123', test_secret: 'wow such secret' },
			'app': { transport: 'http' },
			'db': { name: 'johny' }
		});

		JSON.stringify(cnfg(path, 'test')).should.be.equal(expected_test);
	});

	it('Should extract configuration with index.js in base dir', function() {
		var expected = JSON.stringify({
			'api': { key: '123' },
			'app': { transport: 'http' },
			'db': { name: 'johny' }
		});

		JSON.stringify(require('./config-with-index')).should.be.equal(expected);
	});

	it('Should extract two-level configuration with index', function() {
		var path = './config-two-levels-with-index';

		var expected_prod = JSON.stringify({
			'api': { key: 'prod_123' },
			'app': { transport: 'http' },
			'db': { name: 'prod_johny', port: 5555 }
		});

		JSON.stringify(require(path)).should.be.equal(expected_prod);
	});
});
