"use strict";

var DocUtils = require("../doc-utils");
var dashInnerRegex = /^-([^\s]+)\s(.+)$/;
var wrapper = require("../module-wrapper");

var moduleName = "loop";

var loopModule = {
	name: "LoopModule",
	parse: function parse(placeHolderContent) {
		var module = moduleName;
		var type = "placeholder";
		if (placeHolderContent[0] === "#") {
			return { type: type, value: placeHolderContent.substr(1), expandTo: "auto", module: module, location: "start", inverted: false };
		}
		if (placeHolderContent[0] === "^") {
			return { type: type, value: placeHolderContent.substr(1), expandTo: "auto", module: module, location: "start", inverted: true };
		}
		if (placeHolderContent[0] === "/") {
			return { type: type, value: placeHolderContent.substr(1), module: module, location: "end" };
		}
		if (placeHolderContent[0] === "-") {
			var value = placeHolderContent.replace(dashInnerRegex, "$2");
			var expandTo = placeHolderContent.replace(dashInnerRegex, "$1");
			return { type: type, value: value, expandTo: expandTo, module: module, location: "start", inverted: false };
		}
		return null;
	},
	getTraits: function getTraits(traitName, parsed) {
		if (traitName !== "expandPair") {
			return;
		}

		return parsed.reduce(function (tags, part, offset) {
			if (part.type === "placeholder" && part.module === moduleName) {
				tags.push({ part: part, offset: offset });
			}
			return tags;
		}, []);
	},
	render: function render(part, options) {
		if (!part.type === "placeholder" || part.module !== moduleName) {
			return null;
		}
		var totalValue = [];
		var errors = [];
		function loopOver(scope) {
			var scopeManager = options.scopeManager.createSubScopeManager(scope, part.value);
			var subRendered = options.render(DocUtils.mergeObjects({}, options, {
				compiled: part.subparsed,
				tags: {},
				scopeManager: scopeManager
			}));
			totalValue = totalValue.concat(subRendered.parts);
			errors = errors.concat(subRendered.errors || []);
		}
		options.scopeManager.loopOver(part.value, loopOver, part.inverted);
		return { value: totalValue.join(""), errors: errors };
	}
};

module.exports = function () {
	return wrapper(loopModule);
};