"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require("lodash"),
    merge = _require.merge;

var wrapper = require("../module-wrapper");

var InspectModule = function () {
	function InspectModule() {
		_classCallCheck(this, InspectModule);

		this.inspect = {};
		this.fullInspected = {};
		this.filePath = null;
	}

	_createClass(InspectModule, [{
		key: "set",
		value: function set(obj) {
			if (obj.inspect) {
				if (obj.inspect.filePath) {
					this.filePath = obj.inspect.filePath;
				}
				this.inspect = merge({}, this.inspect, obj.inspect);
				this.fullInspected[this.filePath] = this.inspect;
			}
		}
	}]);

	return InspectModule;
}();

module.exports = function () {
	return wrapper(new InspectModule());
};