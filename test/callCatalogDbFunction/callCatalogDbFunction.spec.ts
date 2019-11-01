import { expect } from "chai";
import sinon from "sinon";
import * as callCatalogDb from "../../src/callCatalogDbFunction";
import * as utilities from "../../src/utility";

describe("Test callCatalogDbApi Function", () => {
  let sandbox: any;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });
  afterEach(() => {
    sandbox.restore();
  });
  it("Return 'catalogSkuCodeNotFound' when Catalog Sku Code is NotFound", () => {
    const keyToSearch = "PROD-CDB";
    sandbox.stub(utilities, "getCatalogSkuCode").returns("NotFound");
    return callCatalogDb.callCatalogDbApi(keyToSearch)
      .then((result) => {
        console.log("Code should Not end up here.");
      })
      .catch((error) => {
        console.log("error:", error);
        expect(error).to.be.equal("catalogSkuCodeNotFound");
      });
  });
});
