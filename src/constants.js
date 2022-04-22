const assert = require('assert');

module.exports = new Proxy(require('./api'), {
	get (self, prop) {
		assert(typeof Reflect.get(self, 'token') === 'string', new TypeError('property `token` must be defined as a `string`'))
		return Reflect.get(...arguments)
	},
	set (self, key, value) {
		if (String(key) === 'token') Reflect.set(...arguments)
	}
})