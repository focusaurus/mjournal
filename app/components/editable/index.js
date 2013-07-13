var events = require("event");
var Emitter = require("emitter");

function Editable(element) {
  Emitter(this);
  this.element = element;
  element.setAttribute("contenteditable", true);
  events.bind(element, "focus", this.onfocus.bind(this));
  events.bind(element, "blur", this.onblur.bind(this));
  events.bind(element, "keydown", this.onkeydown.bind(this));
}

Editable.prototype.onfocus = function(event) {
  //@note will need to debate innerText vs innerHTML...
  this.startValue = this.element.innerText;
  this.emit("begin", this.startValue);
};

Editable.prototype.onblur = function(event) {
  var endValue = this.element.innerText;
  if (endValue !== this.startValue) {
    this.emit("end", endValue, this.startValue, this.element)
  }
};

Editable.prototype.onkeydown = function(event) {
  if (event.which === 13 && event.shiftKey) {
    event.preventDefault();
    this.element.blur();
  }
};
module.exports = Editable;
