var cnfg = require('../');

describe('Hierarchical environment config extraction', function() {
	it('Should extract single-level config very well', function() {
		var path = __dirname + '/config-single-level';
		var config = cnfg(path, 'prod');
		var expected = {
			'api': { key: '123' },
			'app': { transport: 'http' },
			'db': { name: 'johny' }
		};

		JSON.stringify(config).should.be.equal(JSON.stringify(expected));
	});
});
