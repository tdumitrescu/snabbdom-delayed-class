# snabbdom-delayed-class

Replacement module for [Snabbdom's core `class` module](https://github.com/snabbdom/snabbdom#the-class-module). It is backwards-compatible with the existing module, but adds functionality for delaying class updates and updating classes before removing elements, similar to [the core `style` module](https://github.com/snabbdom/snabbdom#delayed-properties). These capabilities are useful for constructing animations using CSS classes/stylesheets, instead of inline styles.

## Usage

Import/require `snabbdom-delayed-class` and pass it to `snabbdom.init()` instead of the core `class` module:
```js
import snabbdom from 'snabbdom';
import snabbDelayedClass from 'snabbdom-delayed-class';

const patch = snabbdom.init([
  snabbDelayedClass,
  // other modules
]);
```

### Delayed classes

Classes under `delayed` are not changed until the next frame:
```js
h('div', {class: {
  fadedout: true,
  delayed: {fadedout: false},
}, 'Fading in');
```

### Set classes on remove/destroy

Class changes under `remove` are applied when the element is about to be removed from the DOM. The `delayRemove` property specifies the number of milliseconds to wait before removing the element (to permit any CSS transitions or animations to finish):
```js
h('div', {class: {
  fadedout: false,
  remove: {fadedout: true, delayRemove: 300},
}, 'Fading out');
```

The `destroy` property works similarly but has no `delayRemove` property; it is assumed that removal delay will be managed by the ancestor node whose removal caused the `destroy` call on descendents.

## Local development

- `npm install`
- `npm test`

## License

MIT
