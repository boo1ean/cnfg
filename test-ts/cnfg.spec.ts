/// <reference path="../typings/index.d.ts" />
import { expect } from 'chai';
const actual_cnfg = require('../cnfg');

describe('cnfg under ts-node', () => {
	function cnfg(path: string, env?: any, processEnv?: any) {
		return actual_cnfg(path, env, processEnv, ['.js', '.ts'])
	}
	describe('Heirarchical environment config extraction', () => {
		it('Should extract single-level config very well', () => {
			// Arrange
			const
				path = __dirname + '/config-single-level',
				expected = {
					api: { key: '123' },
					app: { transport: 'http' },
					db: { name: 'johny' }
				};
			// Act
			const result = cnfg(path, null, null);
			// Assert
			expect(result).to.be.deep.equal(expected);
		})
		it('Should extract two-level configuration like a boss', function () {
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

		it('Should extract configuration with index.ts in base dir', function () {
			var expected = {
				'api': { key: '123' },
				'app': { transport: 'http' },
				'db': { name: 'johny' }
			};

			expect(require('./config-with-index')).to.be.deep.equal(expected);
		});

		it('Should extract two-level configuration with index', function () {
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
				'api': { key: 'prod_123', key2: 'env key', underscored_key: 456 },
				'app': { transport: 'http' },
				'db': { name: 'prod_johny', port: 5555 }
			};

			expect(cnfg(path, 'prod', { CNFG_API__KEY2: 'env key', CNFG_API__UNDERSCORED_KEY: 456 })).to.be.deep.equal(expected);
		})
	});
	describe('Configuration', function () {
		it('Properties should not be changed', function () {
			var path = __dirname + '/config-single-level';
			var expected = {
				'api': { key: '123' },
				'app': { transport: 'http' },
				'db': { name: 'johny' }
			};

			var config = cnfg(path);

			expect(config).to.be.deep.equal(expected);

			expect(() => {
				config.api = 1;
			}).to.throw // running under ts-node, when attempting to assign, this will throw
			expect(config).to.be.deep.equal(expected);
		});

		it('May be extended with new properties', function () {
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
});
