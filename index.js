'use strict';

var raf = (typeof requestAnimationFrame !== 'undefined' && requestAnimationFrame) || setTimeout;

function addOrRemoveClass(el, className, add) {
  el.classList[add ? 'add' : 'remove'](className);
}

function nextFrame(fn) {
  raf(function() {
    raf(fn);
  });
}

function changeClassNextFrame(el, className, add) {
  nextFrame(function() {
    addOrRemoveClass(el, className, add);
  });
}

function updateClass(oldVnode, newVnode) {
  var el = newVnode.elm;
  var oldClass = oldVnode.data.class;
  var newClass = newVnode.data.class;

  if (!oldClass && !newClass) {
    return;
  }
  oldClass = oldClass || {};
  newClass = newClass || {};

  // remove classes which are no longer in vnode class obj
  for (var name in oldClass) {
    if (!(name in newClass)) {
      el.classList.remove(name);
    }
  }

  // handle new classes, taking into account special delayed classes
  var oldHasDelay = 'delayed' in oldClass;
  for (var name in newClass) {
    var val = newClass[name];

    if (typeof val === 'object') {

      // special 'delayed'/'remove' class objects
      if (name === 'delayed') {
        for (var delayedName in val) {
          var delayedVal = val[delayedName];
          if (!oldHasDelay || delayedVal !== oldClass.delayed[delayedName]) {
            changeClassNextFrame(el, delayedName, delayedVal);
          }
        }
      }

    } else if (val !== oldClass[name]) {

      // normal class string, handle immediately
      addOrRemoveClass(el, name, val);

    }
  }
}

function applyDestroyClass(vnode) {
  var classObj = vnode.data.class;
  var onDestroy = classObj && classObj.destroy;
  if (typeof onDestroy !== 'object') {
    return;
  }

  var el = vnode.elm;
  for (var name in onDestroy) {
    addOrRemoveClass(el, name, onDestroy[name]);
  }
}

function applyRemoveClass(vnode, rmFunc) {
  var classObj = vnode.data.class;
  var onRemove = classObj && classObj.remove;
  if (typeof onRemove !== 'object') {
    rmFunc();
    return;
  }

  var el = vnode.elm;
  var delayRemove = 0;
  for (var name in onRemove) {
    var val = onRemove[name];
    if (name === 'delayRemove') {
      delayRemove = val;
    } else {
      addOrRemoveClass(el, name, val);
    }
  }

  setTimeout(rmFunc, delayRemove);
}

module.exports = {
  create:  updateClass,
  update:  updateClass,
  destroy: applyDestroyClass,
  remove:  applyRemoveClass,
};
