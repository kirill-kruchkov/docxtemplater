"use strict";

var _require = require("./utils"),
    createDoc = _require.createDoc,
    shouldBeSame = _require.shouldBeSame,
    expect = _require.expect;

var fs = require("fs");
var path = require("path");

describe("pptx generation", function () {
	it("should work with simple pptx", function () {
		var doc = createDoc("simple-example.pptx");
		var p = doc.setData({ name: "Edgar" }).render();
		expect(p.getFullText()).to.be.equal("Hello Edgar");
	});
	it("should work with table pptx", function () {
		var doc = createDoc("table-example.pptx");
		doc.setData({ users: [{ msg: "hello", name: "mary" }, { msg: "hello", name: "john" }] }).render();
		shouldBeSame({ doc: doc, expectedName: "table-example-expected.pptx" });
	});
	it("should work with loop pptx", function () {
		var doc = createDoc("loop-example.pptx");
		var p = doc.setData({ users: [{ name: "Doe" }, { name: "John" }] }).render();
		expect(p.getFullText()).to.be.equal(" Doe  John ");
		shouldBeSame({ doc: doc, expectedName: "expected-loop-example.pptx" });
	});

	var raw = fs.readFileSync(path.resolve(__dirname, "raw-pptx.xml"), "utf8");

	it("should work with simple raw pptx", function () {
		var doc = createDoc("raw-xml-example.pptx");
		var p = doc.setData({ raw: raw }).render();
		expect(p.getFullText()).to.be.equal("Hello World");
		shouldBeSame({ doc: doc, expectedName: "expected-raw-xml-example.pptx" });
	});
});

describe("Table", function () {
	it("should work with tables", function () {
		var tags = { clients: [{ first_name: "John", last_name: "Doe", phone: "+33647874513" }, { first_name: "Jane", last_name: "Doe", phone: "+33454540124" }, { first_name: "Phil", last_name: "Kiel", phone: "+44578451245" }, { first_name: "Dave", last_name: "Sto", phone: "+44548787984" }] };
		var doc = createDoc("tag-intelligent-loop-table.docx");
		doc.setData(tags);
		doc.render();
		var expectedText = "JohnDoe+33647874513JaneDoe+33454540124PhilKiel+44578451245DaveSto+44548787984";
		var text = doc.getFullText();
		expect(text).to.be.equal(expectedText);
		shouldBeSame({ doc: doc, expectedName: "tag-intelligent-loop-table-expected.docx" });
	});

	it("should work with simple table", function () {
		var doc = createDoc("table-complex2-example.docx");
		doc.setData({
			table1: [{
				t1data1: "t1-1row-data1",
				t1data2: "t1-1row-data2",
				t1data3: "t1-1row-data3",
				t1data4: "t1-1row-data4"
			}, {
				t1data1: "t1-2row-data1",
				t1data2: "t1-2row-data2",
				t1data3: "t1-2row-data3",
				t1data4: "t1-2row-data4"
			}, {
				t1data1: "t1-3row-data1",
				t1data2: "t1-3row-data2",
				t1data3: "t1-3row-data3",
				t1data4: "t1-3row-data4"
			}],
			t1total1: "t1total1-data",
			t1total2: "t1total2-data",
			t1total3: "t1total3-data"
		});
		doc.render();
		var fullText = doc.getFullText();
		expect(fullText).to.be.equal("TABLE1COLUMN1COLUMN2COLUMN3COLUMN4t1-1row-data1t1-1row-data2t1-1row-data3t1-1row-data4t1-2row-data1t1-2row-data2t1-2row-data3t1-2row-data4t1-3row-data1t1-3row-data2t1-3row-data3t1-3row-data4TOTALt1total1-datat1total2-datat1total3-data");
	});
	it("should work with more complex table", function () {
		// set the templateData
		var doc = createDoc("table-complex-example.docx");
		doc.setData({
			table2: [{
				t2data1: "t2-1row-data1",
				t2data2: "t2-1row-data2",
				t2data3: "t2-1row-data3",
				t2data4: "t2-1row-data4"
			}, {
				t2data1: "t2-2row-data1",
				t2data2: "t2-2row-data2",
				t2data3: "t2-2row-data3",
				t2data4: "t2-2row-data4"
			}],
			t1total1: "t1total1-data",
			t1total2: "t1total2-data",
			t1total3: "t1total3-data",
			t2total1: "t2total1-data",
			t2total2: "t2total2-data",
			t2total3: "t2total3-data"
		});
		doc.render();
		var fullText = doc.getFullText();
		expect(fullText).to.be.equal("TABLE1COLUMN1COLUMN2COLUMN3COLUMN4TOTALt1total1-datat1total2-datat1total3-dataTABLE2COLUMN1COLUMN2COLUMN3COLUMN4t2-1row-data1t2-1row-data2t2-1row-data3t2-1row-data4t2-2row-data1t2-2row-data2t2-2row-data3t2-2row-data4TOTALt2total1-datat2total2-datat2total3-data");
	});
});

describe("Dash Loop Testing", function () {
	it("dash loop ok on simple table -> w:tr", function () {
		var tags = { os: [{ type: "linux", price: "0", reference: "Ubuntu10" }, { type: "DOS", price: "500", reference: "Win7" }, { type: "apple", price: "1200", reference: "MACOSX" }] };
		var doc = createDoc("tag-dash-loop.docx");
		doc.setData(tags);
		doc.render();
		var expectedText = "linux0Ubuntu10DOS500Win7apple1200MACOSX";
		var text = doc.getFullText();
		expect(text).to.be.equal(expectedText);
	});
	it("dash loop ok on simple table -> w:table", function () {
		var tags = { os: [{ type: "linux", price: "0", reference: "Ubuntu10" }, { type: "DOS", price: "500", reference: "Win7" }, { type: "apple", price: "1200", reference: "MACOSX" }] };
		var doc = createDoc("tag-dash-loop-table.docx");
		doc.setData(tags);
		doc.render();
		var expectedText = "linux0Ubuntu10DOS500Win7apple1200MACOSX";
		var text = doc.getFullText();
		expect(text).to.be.equal(expectedText);
	});
	it("dash loop ok on simple list -> w:p", function () {
		var tags = { os: [{ type: "linux", price: "0", reference: "Ubuntu10" }, { type: "DOS", price: "500", reference: "Win7" }, { type: "apple", price: "1200", reference: "MACOSX" }] };
		var doc = createDoc("tag-dash-loop-list.docx");
		doc.setData(tags);
		doc.render();
		var expectedText = "linux 0 Ubuntu10 DOS 500 Win7 apple 1200 MACOSX ";
		var text = doc.getFullText();
		expect(text).to.be.equal(expectedText);
	});
});

describe("DocxtemplaterTemplating", function () {
	describe("text templating", function () {
		it("should change values with template data", function () {
			var tags = {
				first_name: "Hipp",
				last_name: "Edgar",
				phone: "0652455478",
				description: "New Website"
			};
			var doc = createDoc("tag-example.docx");
			doc.setData(tags);
			doc.render();
			expect(doc.getFullText()).to.be.equal("Edgar Hipp");
			expect(doc.getFullText("word/header1.xml")).to.be.equal("Edgar Hipp0652455478New Website");
			expect(doc.getFullText("word/footer1.xml")).to.be.equal("EdgarHipp0652455478");
			shouldBeSame({ doc: doc, expectedName: "tag-example-expected.docx" });
		});
	});
});