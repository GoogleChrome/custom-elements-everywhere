import { h, render } from "omi";
import { expect } from "chai";

import "./components";

// Setup the test harness. This will get cleaned out with every test.
let app = document.createElement("div");
app.id = "app";
document.body.appendChild(app);
let scratch; // This will hold the actual element under test.

beforeEach(function () {
  scratch = document.createElement("div");
  scratch.id = "scratch";
  app.appendChild(scratch);
});

afterEach(function () {
  app.innerHTML = "";
  scratch = null;
});

describe("basic support", function () {

  describe("no children", function () {
    it("can display a Custom Element with no children", function () {
      this.weight = 3;
      let root = render(<component-without-children />, scratch);
      let wc = root.shadowRoot.querySelector("#wc");
      expect(wc).to.exist;
    });
  });

  describe("with children", function () {
    function expectHasChildren(wc) {
      expect(wc).to.exist;
      let shadowRoot = wc.shadowRoot;
      let heading = shadowRoot.querySelector("h1");
      expect(heading).to.exist;
      expect(heading.textContent).to.eql("Test h1");
      let paragraph = shadowRoot.querySelector("p");
      expect(paragraph).to.exist;
      expect(paragraph.textContent).to.eql("Test p");
    }

    it("can display a Custom Element with children in a Shadow Root", function () {
      this.weight = 3;
      let root = render(<component-with-children />, scratch);
      let wc = root.shadowRoot.querySelector("#wc");
      expectHasChildren(wc);
    });

    it("can display a Custom Element with children in a Shadow Root and pass in Light DOM children", async function () {
      this.weight = 3;
      let root = render(<component-with-children-rerender />, scratch);

      let wc = root.shadowRoot.querySelector("#wc");
      await Promise.resolve();
      root.update();
      expectHasChildren(wc);
      expect(wc.textContent.includes("2")).to.be.true;
    });

    it("can display a Custom Element with children in the Shadow DOM and handle hiding and showing the element", function () {
      this.weight = 3;
      let root = render(<component-with-different-views />, scratch);

      let wc = root.shadowRoot.querySelector("#wc");
      expectHasChildren(wc);
      root.toggle();
      let dummy = root.shadowRoot.querySelector("#dummy");
      expect(dummy).to.exist;
      expect(dummy.textContent).to.eql("Dummy view");
      root.toggle();
      wc = root.shadowRoot.querySelector("#wc");
      expectHasChildren(wc);
    });
  });

  describe("attributes and properties", function () {
    it("will pass boolean data as either an attribute or a property", function () {
      this.weight = 3;
      let root = render(<component-with-properties />, scratch);
      let wc = root.shadowRoot.querySelector("#wc");
      let data = wc.bool || wc.hasAttribute("bool");
      expect(data).to.be.true;
    });

    it("will pass numeric data as either an attribute or a property", function () {
      this.weight = 3;
      let root = render(<component-with-properties />, scratch);
      let wc = root.shadowRoot.querySelector("#wc");
      let data = wc.num || wc.getAttribute("num");
      expect(parseInt(data, 10)).to.eql(42);
    });

    it("will pass string data as either an attribute or a property", function () {
      this.weight = 3;
      let root = render(<component-with-properties />, scratch);
      let wc = root.shadowRoot.querySelector("#wc");
      let data = wc.str || wc.getAttribute("str");
      expect(data).to.eql("Omi");
    });

    it("will not overwrite unwriteable properties", function () {
      this.weight = 3;
      let root = render(<component-without-properties />, scratch);
      let wc = root.shadowRoot.querySelector("#wc");
      expect(wc.getAttribute('amethod')).to.eql('method');
      expect(wc.getAttribute('agetter')).to.eql('getter');
      expect(wc.getAttribute('areadonly')).to.eql('readonly');
      expect(wc.innerHTML).to.eql('Success');
    });

    // it('will set boolean attributes on a Custom Element that has not already been defined and upgraded', function () {
    //   let root = render(<component-with-unregistered />, scratch);
    //   let wc = root.shadowRoot.querySelector('#wc');
    //   expect(wc.hasAttribute('bool')).to.be.true;
    // });

    // it('will set numeric attributes on a Custom Element that has not already been defined and upgraded', function () {
    //   let root = render(<component-with-unregistered />, scratch);
    //   let wc = root.shadowRoot.querySelector('#wc');
    //   expect(wc.getAttribute('num')).to.eql('42');
    // });

    // it('will set string attributes on a Custom Element that has not already been defined and upgraded', function () {
    //   let root = render(<component-with-unregistered />, scratch);
    //   let wc = root.shadowRoot.querySelector('#wc');
    //   expect(wc.getAttribute('str')).to.eql('Omi');
    // });

    // it('will set array properties on a Custom Element that has not already been defined and upgraded', function() {
    //   let root = render(<component-with-unregistered />, scratch);
    //   let wc = root.shadowRoot.querySelector('#wc');
    //   expect(wc.arr).to.eql(['O', 'm', 'i']);
    // });

    // it('will set object properties on a Custom Element that has not already been defined and upgraded', function() {
    //   let root = render(<component-with-unregistered />, scratch);
    //   let wc = root.shadowRoot.querySelector('#wc');
    //   expect(wc.obj).to.eql({ org: 'tencent', repo: 'omi' });
    // });
  });

  describe("events", function () {
    it("can imperatively listen to a DOM event dispatched by a Custom Element", function () {
      this.weight = 3;
      let root = render(<component-with-imperative-event />, scratch);

      let wc = root.shadowRoot.querySelector("#wc");
      expect(wc).to.exist;
      let handled = root.shadowRoot.querySelector("#handled");
      expect(handled.textContent).to.eql("false");
      wc.click();
      expect(handled.textContent).to.eql("true");
    });
  });

});
