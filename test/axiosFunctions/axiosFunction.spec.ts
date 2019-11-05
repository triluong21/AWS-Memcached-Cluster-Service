import { fail } from "assert";
import axios from "axios";
import { expect } from "chai";
import sinon = require("sinon");
import { axiosPost } from "../../src/axiosFunctions";

describe("axiosPost()", () => {
  let sandbox: any;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });
  afterEach(() => {
    sandbox.restore();
  });

  it("axiosPost() success", async () => {
    const replyMessage = { data: "It has been POSTED" };
    sandbox.stub(axios, "post").resolves(replyMessage);
    const promise = axiosPost("http://www.myurl.com", "{}");
    return promise.response
      .then((myResult) => {
        expect(myResult.data).to.be.deep.equal("It has been POSTED");
      }).catch((err) => {
        fail("This should have worked" + err);
      });
  });

  it("axiosPost() reject", async () => {
    const replyMessage = { data: "It has been POSTED" };
    sandbox.stub(axios, "post").rejects(replyMessage);
    const promise = axiosPost("http://www.myurl.com", "{}");
    return promise.response
      .then((myResult) => {
        fail("This should have been rejected.");
      }).catch((err) => {
        expect(err.data).to.be.deep.equal("It has been POSTED");
        expect(err.message).to.be.deep.include("Axios error");
      });
  });

  it("axiosPost() reject due to 400 error", async () => {
    const invlalidURL = "https://httpstat.us/400";
    const promise = axiosPost(invlalidURL, "{}");
    return promise.response
      .then((myResult) => {
        fail("This should not have worked as the status returned should be 400");
      }).catch((err) => {
        // tslint:disable-next-line: no-unused-expression
        expect(err.data).to.be.undefined;
        expect(err.message).to.be.deep.include("Axios error");
        expect(err.message).to.be.deep.include(invlalidURL); // includes URL in error
      });
  });

  it("axiosPost() Error with no serviceUrl", (done) => {
    // tslint:disable-next-line: only-arrow-functions
    expect(function () {
      axiosPost("", "{}");
    }).to.throw("The serviceUrl was not set.  Unable to make POST.");
    done();
  });

});