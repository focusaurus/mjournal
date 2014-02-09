var sinon = require("sinon");
var assert = require("assert");
var cli = require("app/cli");

describe("app/cli", function() {
  it("should add a page option", function() {
    var mockStack = {
      command: {
        option: sinon.spy()
      }
    };
    cli.paginate(mockStack);
    assert(mockStack.command.option.calledWith("-p, --page <page>"));
  });
});
