import { expect } from "chai";
import { callAriaApi } from "../../src/callAria";

describe("Test callAriaApi Function", () => {
  it("Found", () => {

    return callAriaApi("PROD-CD1")
    .then((result: any) => {
          console.log("myResult: ", result.data);
    });
  });
});
