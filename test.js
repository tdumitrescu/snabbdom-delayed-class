require('html-element/global-shim');

var delayedClass = require('.');
var expect = require('expect.js');
var h = require('snabbdom/h');
var snabbdom = require('snabbdom');

var patch = snabbdom.init([
  delayedClass,
]);

describe('delayed-class module', function() {
  var el;

  beforeEach(function() {
    el = document.createElement('div');
  });

  it('adds classes on create', function() {
    el = patch(el, h('div', {class: {'foo': true}})).elm;
    expect(el.classList.contains('foo')).to.be.ok();
    expect(el.outerHTML).to.contain('<div class="foo">');
  });
});
