"use strict";

var _require = require("./utils"),
    createXmlTemplaterDocx = _require.createXmlTemplaterDocx,
    expect = _require.expect;

describe("speed test", function () {
	it("should be fast for simple tags", function () {
		var content = "<w:t>tag {age}</w:t>";
		var time = new Date();
		for (var i = 1; i <= 100; i++) {
			createXmlTemplaterDocx(content, { tags: { age: 12 } }).render();
		}
		var duration = new Date() - time;
		expect(duration).to.be.below(120);
	});
	it("should be fast for simple tags with huge content", function () {
		var content = "<w:t>tag {age}</w:t>";
		var i = void 0;
		var result = [];
		for (i = 1; i <= 10000; i++) {
			result.push("bla");
		}
		var prepost = result.join("");
		content = prepost + content + prepost;
		var time = new Date();
		for (i = 1; i <= 50; i++) {
			createXmlTemplaterDocx(content, { tags: { age: 12 } }).render();
		}
		var duration = new Date() - time;
		expect(duration).to.be.below(100);
	});
	it("should be fast for loop tags", function () {
		var content = "<w:t>{#users}{name}{/users}</w:t>";
		var users = [];
		for (var i = 1; i <= 1000; i++) {
			users.push({ name: "foo" });
		}
		var time = new Date();
		createXmlTemplaterDocx(content, { tags: { users: users } }).render();
		var duration = new Date() - time;
		expect(duration).to.be.below(100);
	});
	/* eslint-disable no-process-env */
	if (!process.env.FAST) {
		it("should not exceed call stack size for big document with rawxml", function () {
			this.timeout(25000);
			var result = [];
			var normalContent = "<w:p><w:r><w:t>foo</w:t></w:r></w:p>";
			var rawContent = "<w:p><w:r><w:t>{@raw}</w:t></w:r></w:p>";

			for (var i = 1; i <= 30000; i++) {
				if (i % 100 === 1) {
					result.push(rawContent);
				}
				result.push(normalContent);
			}
			var content = result.join("");
			var users = [];
			var time = new Date();
			createXmlTemplaterDocx(content, { tags: { users: users } }).render();
			var duration = new Date() - time;
			expect(duration).to.be.below(25000);
		});
	}
});