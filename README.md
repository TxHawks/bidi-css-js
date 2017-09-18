# bidi-css-js

Logical conversion of flow-relative properties and values for CSS in JS objects

[![Build Status][build-badge]][build]
[![Code Coverage][coverage-badge]][coverage]
[![Dependencies][dependencyci-badge]][dependencyci]
[![version][version-badge]][package]
<!-- [![downloads][downloads-badge]][npm-stat] -->
[![MIT License][license-badge]][LICENSE]
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors)
<!-- [![Roadmap][roadmap-badge]][roadmap] -->


## The problem

With properties and value containing a physical direction, e.g., `margin-left` or `float: right`, CSS has traditionally been planned and authored to accommodate for a single-direction flow of content - either from left to right, or from right to left. Reality, however, often requires that we author our styles in a manner that can easily be applied independently of the document or component flow-direction. 

CSS seems to now slowly starting to progress in the right direction, towards allowing the authoring of flow-realtive styles. Flexbox got this right with `justify-content`, `align-items`, etc., and an initial [CSSWG proposal](https://www.w3.org/TR/css-logical-1/) to address the issue is in place. The most basic of features, such as `text-align: start` are already supported in some browsers and others, such as `margin-start`, have some prefixed support. Most of the proposed features, however, are not currently implemented in any browser support.


## This solution

This library aims to provide a way to easily author styles, (mostly) in line with the CSSWG proposal (and expand on it a little bit), while still ensuring backwards compatibility with the way thing were done before.

It is built using the core logic provided by Kent C. Dodds's [rtl-css-js](http://github.com/kentcdodds/rtl-css-js), and is basically just a thin layer around it providing different behavior.

It is a function with accepts two arguments: a CSS-in-JS object, and a string indicating the flow-direction according to which the styles object will be parsed.

It will convert, for instance, `paddingStart` to either `paddingLeft` or `paddingRight`, as well as all other properties where it makes sense to do so, depending on the provided `flowDirection`

## Installation

This module is distributed via [npm][npm] which is bundled with 
[node][node] and should be installed as one of your project's `dependencies`:

```sh
yarn add bidi-css-js
# or
npm install --save bidi-css-js
```

## Usage

This library exposes a [CommonJS](http://wiki.commonjs.org/wiki/CommonJS), as well as an [ES Module](http://2ality.com/2014/09/es6-modules-final.html) and [UMD](https://github.com/umdjs/umd) with a `bidiCSSJS` global.

```javascript
// If using CommonJS
const bidiCSSJS = require('bidi-css-js') 

// If using ES Modules
import bidiCSSJS from 'bidi-css-js/bidi-css-js.esm' 
const styles = bidiCSSJS({paddingStart: 23}, 'rtl')
console.log(styles) // logs {paddingRight: 23}
```

You can also just include a script tag in your browser and use the `bidiCSSJS` variable:

```html
<script src="https://unpkg.com/bidi-css-js"></script>
<script>
  const styles = bidiCSSJS({paddingStart: 23}, 'rtl')
  console.log(styles) // logs {paddingRight: 23}
</script>
```

### Logical properties and values

This library is intended to mimic the implementation suggested in the CSSWG's [Logical Properties and Values Level 1](http://2ality.com/2014/09/es6-modules-final.html) proposal, with some minor additional sugar. It only covers the `inline-flow` (e.g., `left`<->`right`) aspects of the proposal and not its `block-flow` (e.g. `top`<->`bottom`) aspects.

#### Flow-relative properties:
##### Longhand properties
| Property | LTR Value | RTL Value | Notes |
|-|-|-|-|
| `paddingStart` | `paddingLeft` | `paddingRight` |  |
| `paddingEnd` | `paddingRight` | `paddingLeft` |  |
| `marginStart` | `marginLeft` | `marginRight` |  |
| `marginEnd` | `marginRight` | `marginLeft` |  |
| `paddingInlineStart` | `paddingLeft` | `paddingRight` |  |
| `paddingInlineEnd` | `paddingRight` | `paddingLeft` |  |
| `marginInlineStart` | `marginLeft` | `marginRight` |  |
| `marginInlineEnd` | `marginRight` | `marginLeft` |  |
| `insetInlineStart` | `left` | `right` |  |
| `insetInlineEnd` | `right` | `left` |  |
| `start` | `left` | `right` | **This property is not part of the official spec and only included for convinience because `insetInlineStart` is so cumbersome. If you`d like to keep 100% compatibility with the spec, avoid usind this property** |
| `end` | `right` | `left` | **This property is not part of the official spec and only included for convinience because `insetInlineEnd` is so cumbersome. If you`d like to keep 100% compatibility with the spec, avoid usind this property** |
| `borderStart` | `borderLeft` | `borderRight` | -- |
| `borderEnd` | `borderRight` | `borderLeft` | -- |
| `borderStartColor` | `borderLeftColor` | `borderRightColor` | -- |
| `borderEndColor` | `borderRightColor` | `borderLeftColor` | -- |
| `borderStartStyle` | `borderLeftStyle` | `borderRightStyle` | -- |
| `borderEndStyle` | `borderRightStyle` | `borderLeftStyle` | -- |
| `borderStartWidth` | `borderLeftWidth` | `borderRightWidth` | -- |
| `borderEndWidth` | `borderRightWidth` | `borderLeftWidth` | -- |
| `borderInlineStart` | `borderLeft` | `borderRight` | -- |
| `borderInlineEnd` | `borderRight` | `borderLeft` | -- |
| `borderInlineStartColor` | `borderLeftColor` | `borderRightColor` | -- |
| `borderInlineEndColor` | `borderRightColor` | `borderLeftColor` | -- |
| `borderInlineStartStyle` | `borderLeftStyle` | `borderRightStyle` | -- |
| `borderInlineEndStyle` | `borderRightStyle` | `borderLeftStyle` | -- |
| `borderInlineStartWidth` | `borderLeftWidth` | `borderRightWidth` | -- |
| `borderInlineEndWidth` | `borderRightWidth` | `borderLeftWidth` | -- |
| `borderTopStartRadius` | `borderTopLeftRadius` | `borderTopRightRadius` | This property is, at the moment, missing from the spec, but is expected to be defined at a later stage. See [w3c/csswg-drafts#491](https://github.com/w3c/csswg-drafts/issues/491) |
| `borderTopEndRadius` | `borderTopRightRadius` | `borderTopLeftRadius` | This property is, at the moment, missing from the spec, but is expected to be defined at a later stage. See [w3c/csswg-drafts#491](https://github.com/w3c/csswg-drafts/issues/491) |
| `borderBottomStartRadius` | `borderBottomLeftRadius` | `borderBottomRightRadius` | This property is, at the moment, missing from the spec, but is expected to be defined at a later stage. See [w3c/csswg-drafts#491](https://github.com/w3c/csswg-drafts/issues/491) |
| `borderBottomEndRadius` | `borderBottomRightRadius` | `borderBottomLeftRadius` | This property is, at the moment, missing from the spec, but is expected to be defined at a later stage. See [w3c/csswg-drafts#491](https://github.com/w3c/csswg-drafts/issues/491) |
| `borderStartStartRadius` | `borderTopLeftRadius` | `borderTopRightRadius` || This property is, at the moment, missing from the spec, but is expected to be defined at a later stage. See [w3c/csswg-drafts#491](https://github.com/w3c/csswg-drafts/issues/491) | -- |
| `borderStartEndRadius` | `borderTopRightRadius` | `borderTopLeftRadius` | This property is, at the moment, missing from the spec, but is expected to be defined at a later stage. See [w3c/csswg-drafts#491](https://github.com/w3c/csswg-drafts/issues/491) |
| `borderEndStartRadius` | `borderBottomLeftRadius` | `borderBottomRightRadius` | This property is, at the moment, missing from the spec, but is expected to be defined at a later stage. See [w3c/csswg-drafts#491](https://github.com/w3c/csswg-drafts/issues/491) |
| `borderEndEndRadius` | `borderBottomRightRadius` | `borderBottomLeftRadius` | This property is, at the moment, missing from the spec, but is expected to be defined at a later stage. See [w3c/csswg-drafts#491](https://github.com/w3c/csswg-drafts/issues/491) |

##### Shorthand properties
From the spec:
The shorthand properties for margin, padding, and border set values for physical properties by default. But authors can specify the logical keyword at the beginning of the property value to indicate that the values map to the flow-relative properties instead of the physical ones.
The following [[CSS21](https://www.w3.org/TR/css-logical-1/#biblio-css21)] shorthand properties [ ... ] accept the `logical` keyword: `margin`, `padding`, `border-width`, `border-style`, `border-color`.
[ ... ]
When the `logical` keyword is present in the value, the values that follow are assigned to the flow-relative properties as follows:

* If only one value is set, the value applies to all four flow-relative longhands.
* If two values are set, the first is for block-start and block-end, the second is for inline-start and inline-end.
* If three values are set, the first is for block-start, the second is for inline-start and inline-end, and the third is for block-end.
* If four values are set, they apply to the block-start, inline-start, block-end, and inline-end sides in that order.

**Example:**
```js
bidiCSSJS({
  margin: 'logical 0 10px 0 20px'
}, 'rtl'); // => { margin: '0 20px 0 10px' }
bidiCSSJS({
  margin: 'logical 0 10px 0 20px'
}, 'ltr'); // => { margin: '0 10px 0 20px' }
```


For convinience, the library also transforms the following properties in a similar manner, although they are not included in the spec:

| Property | Example | LTR Value | RTL Value | Notes |
|-|-|-|-|-|
| `backgroundImage` | `logical url(/foo/bar-ets.png)` |  `url(/foo/bar-rtl.png)` | `url(/foo/bar-ltr.png)`|  `ets` is short for end-to-start; `ste` is short for start-to-end |
| `backgroundImage` | `logical linear-gradient(to start top, blue, red)` | `logical linear-gradient(to left top, blue, red)` | `logical linear-gradient(to right top, blue, red)` | |
| `backgroundImage` | `logical repeating-linear-gradient(to start, #00ff00 0%, #ff0000 100%)` | `logical repeating-linear-gradient(to left, #00ff00 0%, #ff0000 100%)` | `logical repeating-linear-gradient(to right, #00ff00 0%, #ff0000 100%)` | |
| `backgroundPosition` | `logical start top` | `left top` | `right top` | -- |
| `backgroundPosition` | `logical 77% 40%` | `77% 40%` | `23% 40%` | -- |
| `backgroundPositionX` | See `backgroundPosition` |
| `background` | See `backgroundImage` and `backgroundPosition` |
| `borderRadius` | `logical 1px 2px 3px 4px` | `1px 2px 3px 4px` | `2px 1px 4px 3px` | Will hopefuly be included at a later stage. See [w3c/csswg-drafts#1776](https://github.com/w3c/csswg-drafts/issues/1776) |
| `borderRadius` | `logical 1px 2px 3px 4px / 5px 6px 7px 8px` | `1px 2px 3px 4px / 5px 6px 7px 8px` | `2px 1px 4px 3px / 6px 5px 8px 7px` | Will hopefuly be included at a later stage. See [w3c/csswg-drafts#1776](https://github.com/w3c/csswg-drafts/issues/1776) |
| `boxShadow` | `logical -1px 2px 3px 3px red` | `-1px 2px 3px 3px red` | `1px 2px 3px 3px red` ||
| `boxShadow` | `logical inset 1px 2px 3px 3px red` | `inset 1px 2px 3px 3px red` | `inset -1px 2px 3px 3px red` ||
| `mozBoxShadow` | See `boxShadow` | -- | -- | -- |
| `webkitBoxShadow` | See `boxShadow` | -- | -- | -- |
| `textShadow` | `logical red -2px 0` | `red -2px 0` | `red 2px 0` | -- |
| `textShadow` | `logical -2px 0 red` | `-2px 0 red` | `2px 0 red` | -- |
| `transform` | `logical translate(30%)` | `translate(30%)` | `translate(-30%)` | Currently only operates on `translate[X]` |
| `transform` | `logical translateX(30%)` | `translateX(30%)` | `translateX(-30%)` | Currently only operates on `translate[X]` |
| `transform` | `logical translate(30%, 20%)` | `traslate(30%, 20%)` | `translate(-30%, 20%)` | Currently only operates on `translate[X|3d]` |
| `transform` | `logical translateY(30px) rotate(20deg) translateX(10px)` | `translateY(30px) rotate(20deg) translateX(10px)` | `translateY(30px) rotate(20deg) translateX(-10px)` | Currently only operates on `translate[X|3d]` |
| `transform` | `logical translate3d(30%, 20%, 10%)` | `translate3d(30%, 20%, 10%)` | `translate3d(-30%, 20%, 10%)` | Currently only operates on `translate[X]` |
| `mozTransform` | See `transform` | -- | -- | -- |
| `webkitTransform` | See `transform` | -- | -- | -- |

#### Flow-relative values:

In properties that _do not accept the `logical` keword_ , values containing the following keywords will be automatically transformed. This is not 100% spec complient.

| Value | LTR Value | RTL Value | Notes |
|-|-|-|-|
| 'ste' | 'ltr' | 'rtl' | **Not part of the official spec** |
| 'ets' | 'rtl' | 'ltr' | **Not part of the official spec** |
| 'inline-start' | 'left' | 'right' |
| 'inline-end' | 'right' | 'left' |
| 'start' | 'left' | 'right' | 
| 'end' | 'right' | 'left' |
| 'start-resize' | 'w-resize' | 'e-resize' | **Not part of the spec** |
| 'end-resize' | 'e-resize' | 'w-resize' | **Not part of the spec** |
| 'bottomstart-resize' | 'sw-resize' | 'se-resize' | **Not part of the spec** |
| 'bottomend-resize' | 'se-resize' | 'sw-resize' | **Not part of the spec** |
| 'topstart-resize' | 'nw-resize' | 'ne-resize' | **Not part of the spec** |
| 'topend-resize' | 'ne-resize' | 'nw-resize' | **Not part of the spec** |

## Caveats

Same as `rtl-css-js`:

### `background`

Right now `background` and `backgroundImage` just replace all instances of `ltr` with `rtl` and `right` with `left`.
This is so you can have a different image for your LTR and RTL, and in order to flip linear gradients. Note that
this is case sensitive! Must be lower case. Note also that it *will not* change `bright` to `bleft`.
It's a _little_ smarter than that. But this is definitely something to consider with your URLs.

## Thanks
Kent C. Dodds and all other contributors to `rtl-css-js`. As mentioned above, this library is not much more than a thin wrapper around it's core logic.

## Contributors

Thanks goes to these people ([emoji key][emojis]):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
| [<img src="https://avatars2.githubusercontent.com/u/5658514?v=4" width="100px;"/><br /><sub>Jonathan Pollak</sub>](https://github.com/TxHawks)<br />[💻](https://github.com/TxHawks/bidi-css-js/commits?author=TxHawks "Code") [📖](https://github.com/TxHawks/bidi-css-js/commits?author=TxHawks "Documentation") [⚠️](https://github.com/TxHawks/bidi-css-js/commits?author=TxHawks "Tests") |
| :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors][all-contributors] specification. Contributions of any kind welcome!

## LICENSE

MIT

[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[build-badge]: https://img.shields.io/travis/TxHawks/bidi-css-js.svg?style=flat-square
[build]: https://travis-ci.org/TxHawks/bidi-css-js
[coverage-badge]: https://img.shields.io/codecov/c/github/TxHawks/bidi-css-js.svg?style=flat-square
[coverage]: https://codecov.io/github/TxHawks/bidi-css-js
[dependencyci-badge]: https://dependencyci.com/github/TxHawks/bidi-css-js/badge?style=flat-square
[dependencyci]: https://dependencyci.com/github/TxHawks/bidi-css-js
[version-badge]: https://img.shields.io/npm/v/bidi-css-js.svg?style=flat-square
[package]: https://www.npmjs.com/package/bidi-css-js
[downloads-badge]: https://img.shields.io/npm/dm/bidi-css-js.svg?style=flat-square
[npm-stat]: http://npm-stat.com/charts.html?package=bidi-css-js&from=2016-04-01
[license-badge]: https://img.shields.io/npm/l/bidi-css-js.svg?style=flat-square
[license]: https://github.com/TxHawks/bidi-css-js/blob/master/other/LICENSE
[emojis]: https://github.com/kentcdodds/all-contributors#emoji-key
[all-contributors]: https://github.com/kentcdodds/all-contributors
