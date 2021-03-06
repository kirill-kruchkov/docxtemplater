"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = require("xmldom"),
    DOMParser = _require.DOMParser,
    XMLSerializer = _require.XMLSerializer;

var _require2 = require("./errors"),
    throwXmlTagNotFound = _require2.throwXmlTagNotFound,
    throwDecodeUTF8Error = _require2.throwDecodeUTF8Error;

var DocUtils = {};

function parser(tag) {
	return _defineProperty({}, "get", function get(scope) {
		if (tag === ".") {
			return scope;
		}
		return scope[tag];
	});
}

DocUtils.defaults = {
	nullGetter: function nullGetter(part) {
		if (!part.module) {
			return "undefined";
		}
		if (part.module === "rawxml") {
			return "";
		}
		return "";
	},

	parser: parser,
	delimiters: {
		start: "{",
		end: "}"
	}
};

DocUtils.mergeObjects = function () {
	var resObj = {};
	var obj = void 0,
	    keys = void 0;
	for (var i = 0; i < arguments.length; i += 1) {
		obj = arguments[i];
		keys = Object.keys(obj);
		for (var j = 0; j < keys.length; j += 1) {
			resObj[keys[j]] = obj[keys[j]];
		}
	}
	return resObj;
};

DocUtils.xml2str = function (xmlNode) {
	var a = new XMLSerializer();
	return a.serializeToString(xmlNode);
};

DocUtils.decodeUtf8 = function (s) {
	try {
		if (s === undefined) {
			return undefined;
		}
		// replace Ascii 160 space by the normal space, Ascii 32
		return decodeURIComponent(escape(DocUtils.convertSpaces(s)));
	} catch (e) {
		throwDecodeUTF8Error(s);
	}
};

DocUtils.encodeUtf8 = function (s) {
	return unescape(encodeURIComponent(s));
};

DocUtils.str2xml = function (str, errorHandler) {
	var parser = new DOMParser({ errorHandler: errorHandler });
	return parser.parseFromString(str, "text/xml");
};

DocUtils.charMap = {
	"&": "&amp;",
	"'": "&apos;",
	"<": "&lt;",
	">": "&gt;",
	'"': "&quot;"
};

var regexStripRegexp = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g;
DocUtils.escapeRegExp = function (str) {
	return str.replace(regexStripRegexp, "\\$&");
};

DocUtils.charMapRegexes = Object.keys(DocUtils.charMap).map(function (endChar) {
	var startChar = DocUtils.charMap[endChar];
	return {
		rstart: new RegExp(DocUtils.escapeRegExp(startChar), "g"),
		rend: new RegExp(DocUtils.escapeRegExp(endChar), "g"),
		start: startChar,
		end: endChar
	};
});

DocUtils.wordToUtf8 = function (string) {
	var r = void 0;
	for (var i = 0, l = DocUtils.charMapRegexes.length; i < l; i++) {
		r = DocUtils.charMapRegexes[i];
		string = string.replace(r.rstart, r.end);
	}
	return string;
};

DocUtils.utf8ToWord = function (string) {
	if (typeof string !== "string") {
		string = string.toString();
	}
	var r = void 0;
	for (var i = 0, l = DocUtils.charMapRegexes.length; i < l; i++) {
		r = DocUtils.charMapRegexes[i];
		string = string.replace(r.rend, r.start);
	}
	return string;
};

DocUtils.cloneDeep = function (obj) {
	return JSON.parse(JSON.stringify(obj));
};

// This function is written with for loops for performance
DocUtils.concatArrays = function (arrays) {
	var result = [];
	for (var i = 0; i < arrays.length; i++) {
		var array = arrays[i];
		for (var j = 0, len = array.length; j < len; j++) {
			result.push(array[j]);
		}
	}
	return result;
};

var spaceRegexp = new RegExp(String.fromCharCode(160), "g");
DocUtils.convertSpaces = function (s) {
	return s.replace(spaceRegexp, " ");
};

DocUtils.pregMatchAll = function (regex, content) {
	/* regex is a string, content is the content. It returns an array of all matches with their offset, for example:
 	 regex=la
 	 content=lolalolilala
 returns: [{array: {0: 'la'},offset: 2},{array: {0: 'la'},offset: 8},{array: {0: 'la'} ,offset: 10}]
 */
	var matchArray = [];
	var match = void 0;
	while ((match = regex.exec(content)) != null) {
		matchArray.push({ array: match, offset: match.index });
	}
	return matchArray;
};

DocUtils.sizeOfObject = function (obj) {
	return Object.keys(obj).length;
};

DocUtils.getRight = function (parsed, element, index) {
	for (var i = index, l = parsed.length; i < l; i++) {
		var part = parsed[i];
		if (part.value === "</" + element + ">") {
			return i;
		}
	}
	throwXmlTagNotFound({ position: "right", element: element, parsed: parsed, index: index });
};

DocUtils.getLeft = function (parsed, element, index) {
	for (var i = index; i >= 0; i--) {
		var part = parsed[i];
		if (part.value.indexOf("<" + element) === 0 && [">", " "].indexOf(part.value[element.length + 1]) !== -1) {
			return i;
		}
	}
	throwXmlTagNotFound({ position: "left", element: element, parsed: parsed, index: index });
};

module.exports = DocUtils;