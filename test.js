var delayedClass = require('.');
var document = require('html-element').document;
var expect = require('expect.js');
var h = require('snabbdom/h');
var raf = require('raf');
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

  it('applies class updates', function() {
    var vnode = patch(el, h('div', {class: {'foo': true}}));
    el = vnode.elm;
    expect(el.classList.contains('foo')).to.be.ok();

    patch(vnode, h('div', {class: {'foo': false}}));
    expect(el.classList.contains('foo')).not.to.be.ok();
    expect(el.outerHTML).to.contain('<div>');
  });

  it('implicitly removes classes', function() {
    var vnode = patch(el, h('div', {class: {'foo': true}}));
    el = vnode.elm;
    expect(el.classList.contains('foo')).to.be.ok();

    patch(vnode, h('div'));
    expect(el.classList.contains('foo')).not.to.be.ok();
    expect(el.outerHTML).to.contain('<div>');
  });

  it('applies delayed class updates in the next frame', function(done) {
    el = patch(el, h('div', {class: {delayed: {'foo': true}}})).elm;
    expect(el.classList.contains('foo')).not.to.be.ok();

    raf(function() {
      raf(function() {
        expect(el.classList.contains('foo')).to.be.ok();
        done();
      });
    });
  });
});
