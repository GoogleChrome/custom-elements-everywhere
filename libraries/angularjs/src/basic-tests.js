import { expect } from "chai";
import prodApp from "./app.module";

describe("basic support", () => {

  beforeEach(angular.mock.module(prodApp));

  let compile;
  let scope;
  let interval;
  beforeEach(
    inject(($compile, $rootScope, $interval) => {
      compile = $compile;
      scope = $rootScope;
      interval = $interval;
    })
  );

  describe("no children", () => {
    it("can display a CE with no children", function() {
      this.weight = 3;
      const comp = compile("<comp-no-children>")(scope);
      const wc = comp[0].querySelector("ce-without-children");
      expect(wc).to.exist;
    });
  });

  describe("with children", () => {
    const prep = el => {
      return compile(el)(scope)[0];
    };
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

    it("can display a Custom Element with children in a Shadow Root", function() {
      this.weight = 3;
      const root = prep("<comp-with-children>");
      let wc = root.querySelector("#wc");
      expectHasChildren(wc);
    });

    it("can display a Custom Element with children in a Shadow Root and pass in Light DOM children", function() {
      this.weight = 3;
      const root = prep("<comp-with-children-rerender>");
      interval.flush(1000);
      let wc = root.querySelector("#wc");
      expectHasChildren(wc);
      expect(wc.textContent.includes("2")).to.be.true;
    });

    it("can display a Custom Element with children in a Shadow Root and handle hiding and showing the element", function() {
      this.weight = 3;
      scope.showWc = true;
      const root = prep(`<comp-with-different-views show-wc="showWc">`);
      scope.$apply();
      let wc = root.querySelector("#wc");
      expectHasChildren(wc);

      scope.showWc = false;
      scope.$apply();

      let dummy = root.querySelector("#dummy");
      expect(dummy).to.exist;
      expect(dummy.textContent).to.eql("Dummy view");

      scope.showWc = true;
      scope.$apply();

      wc = root.querySelector("#wc");
      expectHasChildren(wc);
    });
  });

  describe("attributes and properties", function() {
    let wc;
    beforeEach(() => {
      const comp = compile("<comp-with-props>")(scope);
      scope.$digest();

      wc = comp[0].querySelector("#wc");
    });

    it("will pass boolean data as either an attribute or a property", function() {
      this.weight = 3;
      let data = wc.bool || wc.hasAttribute("bool");
      expect(data).to.be.true;
      // Extra test to see if AngularJS just left its binding syntax on
      // the attribute and didn't actually set anything :P
      if (!wc.bool) {
        data = wc.getAttribute("bool");
        expect(data.includes("{{")).to.be.false;
      }
    });

    it("will pass numeric data as either an attribute or a property", function() {
      this.weight = 3;
      let data = wc.num || wc.getAttribute("num");
      expect(parseInt(data, 10)).to.eql(42);
    });

    it("will pass string data as either an attribute or a property", function() {
      this.weight = 3;
      let data = wc.str || wc.getAttribute("str");
      expect(data).to.eql("Angular");
    });
  });

  describe("without properties", () => {
    it('will not overwrite unwriteable properties', function () {
      this.weight = 3;
      const comp = compile("<comp-without-props>")(scope);
      scope.$digest();
      const wc = comp[0].querySelector("#wc");
      expect(wc.getAttribute('amethod')).to.eql('method');
      expect(wc.getAttribute('agetter')).to.eql('getter');
      expect(wc.getAttribute('areadonly')).to.eql('readonly');
      expect(wc.innerHTML).to.eql('Success');
    });
  });

  describe("events", () => {
    it("can imperatively listen to a DOM event dispatched by a Custom Element", function() {
      this.weight = 3;
      const root = compile("<comp-with-imperative-event>")(scope)[0];
      scope.$digest();
      let wc = root.querySelector("#wc");
      let handled = root.querySelector("#handled");
      expect(handled.textContent).to.eql("false");
      wc.click();
      scope.$digest();
      expect(handled.textContent).to.eql("true");
    });
  });

});
