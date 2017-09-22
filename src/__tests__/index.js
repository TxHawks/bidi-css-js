/**
 * This tests a ton of cases for bidi-css-js and is based on the testing infrastructure created in `rtl-css-js`
 * Because there are so many test cases, there's a bit of an abstraction to make authoring/adding/maintaining tests a
 * little more ergonomic.
 *
 * The main idea is the `tests` object. The other arrays ultimately get added to the tests object.
 *
 * One special thing about all this is the `balrog` modifier. If you add that modifier that basically tells the
 * abstraction to not even register the other tests with Jest. This makes it easier to focus on one or two tests.
 *
 * And we have a coverage threshold which should (hopefully) prevent you from accidentally adding a modifier that's
 * incorrect.
 */

/*eslint max-lines: ['error', 1500]*/

import flowRelative from '../'

// use this object for bigger tests
// the key is the test title
// the objects each have an input (array that's spread on a call to convert),
// an ltrOutput, which is the resulting object in ltr mode
// and an rtlOutput, which is the resulting object in rtl mode
// if you want to run `.only` or `.skip` for one of the tests
// specify `modifier: 'only'` or `modifier: 'skip'` 👍
// Oh, and don't forget the `balrog` modifier you can add as mentioned above
const tests = {
  'handles nested objects because many CSS in JS solutions allow for this': {
    input: [{footer: {':hover': {paddingStart: 23}}}],
    ltrOutput: {footer: {':hover': {paddingLeft: 23}}},
    rtlOutput: {footer: {':hover': {paddingRight: 23}}},
  },
}

// we'll probably have a lot of these :)
// the first item in each array is the input (an array which is spread on a call to convert)
// the second item is the resulting object from the convert call
// the title will JSON.stringify these
// you can specify a modifier as a third item in the array
const shortTests = [
  [[{paddingStart: 23}], {paddingLeft: 23}, {paddingRight: 23}],
  [[{paddingEnd: 23}], {paddingRight: 23}, {paddingLeft: 23}],
  [[{paddingInlineStart: 23}], {paddingLeft: 23}, {paddingRight: 23}],
  [[{paddingInlineEnd: 23}], {paddingRight: 23}, {paddingLeft: 23}],
  [[{direction: 'ste'}], {direction: 'ltr'}, {direction: 'rtl'}],
  [[{direction: 'ets'}], {direction: 'rtl'}, {direction: 'ltr'}],
  [[{start: 10}], {left: 10}, {right: 10}],
  [
    [{start: '10px !important'}],
    {left: '10px !important'},
    {right: '10px !important'},
  ],
  [[{start: '-.75em'}], {left: '-.75em'}, {right: '-.75em'}],
  [[{end: '-1.5em'}], {right: '-1.5em'}, {left: '-1.5em'}],
  [[{end: 10}], {right: 10}, {left: 10}],
  [
    [{end: '10px !important'}],
    {right: '10px !important'},
    {left: '10px !important'},
  ],
  [
    [{insetInlineStart: '10px !important'}],
    {left: '10px !important'},
    {right: '10px !important'},
  ],
  [[{insetInlineStart: '-.75em'}], {left: '-.75em'}, {right: '-.75em'}],
  [[{insetInlineEnd: '-1.5em'}], {right: '-1.5em'}, {left: '-1.5em'}],
  [[{insetInlineEnd: 10}], {right: 10}, {left: 10}],
  [
    [{insetInlineEnd: '10px !important'}],
    {right: '10px !important'},
    {left: '10px !important'},
  ],
  [
    [{padding: 'logical 1px 2px 3px -4px'}],
    {padding: '1px 2px 3px -4px'},
    {padding: '1px -4px 3px 2px'},
  ],
  [
    [{padding: 'logical .25em 0ex 0pt 15px'}],
    {padding: '.25em 0ex 0pt 15px'},
    {padding: '.25em 15px 0pt 0ex'},
  ],
  [
    [{padding: 'logical 1px 2% 3px 4.1grad'}],
    {padding: '1px 2% 3px 4.1grad'},
    {padding: '1px 4.1grad 3px 2%'},
  ],
  [
    [{padding: 'logical 1px auto 3px 2px'}],
    {padding: '1px auto 3px 2px'},
    {padding: '1px 2px 3px auto'},
  ],
  [
    [{padding: 'logical 1.1px 2.2px 3.3px 4.4px'}],
    {padding: '1.1px 2.2px 3.3px 4.4px'},
    {padding: '1.1px 4.4px 3.3px 2.2px'},
  ],
  [
    [{padding: 'logical 1px auto 3px inherit'}],
    {padding: '1px auto 3px inherit'},
    {padding: '1px inherit 3px auto'},
  ],
  [
    [{padding: 'logical 1px 2px 3px 4px !important'}],
    {padding: '1px 2px 3px 4px !important'},
    {padding: '1px 4px 3px 2px !important'},
  ],
  [
    [{padding: 'logical 1px 2px 3px 4px !important'}],
    {padding: '1px 2px 3px 4px !important'},
    {padding: '1px 4px 3px 2px !important'},
  ],
  [
    [{padding: 'logical 1px 2px 3px 4px'}],
    {padding: '1px 2px 3px 4px'},
    {padding: '1px 4px 3px 2px'},
  ],
  [
    [{padding: 'logical 1px  2px   3px    4px'}],
    {padding: '1px  2px   3px    4px'},
    {padding: '1px 4px 3px 2px'},
  ],
  [
    [{padding: 'logical 1px 2px 3px 4px'}],
    {padding: '1px 2px 3px 4px'},
    {padding: '1px 4px 3px 2px'},
  ],
  [
    [{padding: 'logical 1px 2px 3px 4px !important', color: 'red'}],
    {padding: '1px 2px 3px 4px !important', color: 'red'},
    {padding: '1px 4px 3px 2px !important', color: 'red'},
  ],
  [
    [{padding: 10, direction: 'ets'}],
    {padding: 10, direction: 'rtl'},
    {padding: 10, direction: 'ltr'},
  ],
  [
    [{padding: 10, direction: 'ste'}],
    {padding: 10, direction: 'ltr'},
    {padding: 10, direction: 'rtl'},
  ],
  [
    [{margin: 'logical 1px 2px 3px 4px'}],
    {margin: '1px 2px 3px 4px'},
    {margin: '1px 4px 3px 2px'},
  ],
  [[{float: 'start'}], {float: 'left'}, {float: 'right'}],
  [
    [{float: 'start !important'}],
    {float: 'left !important'},
    {float: 'right !important'},
  ],
  [[{float: 'end'}], {float: 'right'}, {float: 'left'}],
  [
    [{float: 'end !important'}],
    {float: 'right !important'},
    {float: 'left !important'},
  ],
  [[{clear: 'start'}], {clear: 'left'}, {clear: 'right'}],
  [[{clear: 'end'}], {clear: 'right'}, {clear: 'left'}],
  [[{marginStart: 0}], {marginLeft: 0}, {marginRight: 0}],
  [[{marginEnd: 0}], {marginRight: 0}, {marginLeft: 0}],
  [[{marginInlineStart: 0}], {marginLeft: 0}, {marginRight: 0}],
  [[{marginInlineEnd: 0}], {marginRight: 0}, {marginLeft: 0}],
  [[{cursor: 'start-resize'}], {cursor: 'w-resize'}, {cursor: 'e-resize'}],
  [[{cursor: 'end-resize'}], {cursor: 'e-resize'}, {cursor: 'w-resize'}],
  [
    [{cursor: 'bottomstart-resize'}],
    {cursor: 'sw-resize'},
    {cursor: 'se-resize'},
  ],
  [
    [{cursor: 'bottomend-resize'}],
    {cursor: 'se-resize'},
    {cursor: 'sw-resize'},
  ],
  [[{cursor: 'topstart-resize'}], {cursor: 'nw-resize'}, {cursor: 'ne-resize'}],
  [[{cursor: 'topend-resize'}], {cursor: 'ne-resize'}, {cursor: 'nw-resize'}],
  [[{textAlign: 'start'}], {textAlign: 'left'}, {textAlign: 'right'}],
  [[{textAlign: 'end'}], {textAlign: 'right'}, {textAlign: 'left'}],
  [
    [{textShadow: 'logical red 2px 0'}],
    {textShadow: 'red 2px 0'},
    {textShadow: 'red -2px 0'},
  ],
  [
    [{textShadow: 'logical red -2px 0'}],
    {textShadow: 'red -2px 0'},
    {textShadow: 'red 2px 0'},
  ],
  [
    [{textShadow: 'logical 2px 0 red'}],
    {textShadow: '2px 0 red'},
    {textShadow: '-2px 0 red'},
  ],
  [
    [{textShadow: 'logical -2px 0 red'}],
    {textShadow: '-2px 0 red'},
    {textShadow: '2px 0 red'},
  ],
  [
    [{boxShadow: 'logical -6px 3px 8px 5px rgba(0, 0, 0, 0.25)'}],
    {boxShadow: '-6px 3px 8px 5px rgba(0, 0, 0, 0.25)'},
    {boxShadow: '6px 3px 8px 5px rgba(0, 0, 0, 0.25)'},
  ],
  [
    [{boxShadow: 'logical inset -6px 3px 8px 5px rgba(0, 0, 0, 0.25)'}],
    {boxShadow: 'inset -6px 3px 8px 5px rgba(0, 0, 0, 0.25)'},
    {boxShadow: 'inset 6px 3px 8px 5px rgba(0, 0, 0, 0.25)'},
  ],
  [
    [{boxShadow: 'logical inset .5em 0 0 white'}],
    {boxShadow: 'inset .5em 0 0 white'},
    {boxShadow: 'inset -.5em 0 0 white'},
  ],
  [
    [{boxShadow: 'logical inset 0.5em 0 0 white'}],
    {boxShadow: 'inset 0.5em 0 0 white'},
    {boxShadow: 'inset -0.5em 0 0 white'},
  ],
  [
    [{boxShadow: 'logical -1px 2px 3px 3px red'}],
    {boxShadow: '-1px 2px 3px 3px red'},
    {boxShadow: '1px 2px 3px 3px red'},
  ],
  [
    [{webkitBoxShadow: 'logical -1px 2px 3px 3px red'}],
    {webkitBoxShadow: '-1px 2px 3px 3px red'},
    {webkitBoxShadow: '1px 2px 3px 3px red'},
  ],
  [
    [{mozBoxShadow: 'logical -1px 2px 3px 3px red'}],
    {mozBoxShadow: '-1px 2px 3px 3px red'},
    {mozBoxShadow: '1px 2px 3px 3px red'},
  ],
  [[{borderStart: 0}], {borderLeft: 0}, {borderRight: 0}],
  [
    [{borderStart: '1px solid red'}],
    {borderLeft: '1px solid red'},
    {borderRight: '1px solid red'},
  ],
  [[{borderEnd: 0}], {borderRight: 0}, {borderLeft: 0}],
  [
    [{borderEnd: '1px solid red'}],
    {borderRight: '1px solid red'},
    {borderLeft: '1px solid red'},
  ],
  [
    [{borderStartColor: 'red'}],
    {borderLeftColor: 'red'},
    {borderRightColor: 'red'},
  ],
  [
    [{borderEndColor: 'red'}],
    {borderRightColor: 'red'},
    {borderLeftColor: 'red'},
  ],
  [
    [{borderStartStyle: 'red'}],
    {borderLeftStyle: 'red'},
    {borderRightStyle: 'red'},
  ],
  [
    [{borderEndStyle: 'red'}],
    {borderRightStyle: 'red'},
    {borderLeftStyle: 'red'},
  ],
  [
    [{borderStartWidth: '2px'}],
    {borderLeftWidth: '2px'},
    {borderRightWidth: '2px'},
  ],
  [
    [{borderEndWidth: '2px'}],
    {borderRightWidth: '2px'},
    {borderLeftWidth: '2px'},
  ],
  [[{borderInlineStart: 0}], {borderLeft: 0}, {borderRight: 0}],
  [
    [{borderInlineStart: '1px solid red'}],
    {borderLeft: '1px solid red'},
    {borderRight: '1px solid red'},
  ],
  [[{borderInlineEnd: 0}], {borderRight: 0}, {borderLeft: 0}],
  [
    [{borderInlineEnd: '1px solid red'}],
    {borderRight: '1px solid red'},
    {borderLeft: '1px solid red'},
  ],
  [
    [{borderInlineStartColor: 'red'}],
    {borderLeftColor: 'red'},
    {borderRightColor: 'red'},
  ],
  [
    [{borderInlineEndColor: 'red'}],
    {borderRightColor: 'red'},
    {borderLeftColor: 'red'},
  ],
  [
    [{borderInlineStartStyle: 'red'}],
    {borderLeftStyle: 'red'},
    {borderRightStyle: 'red'},
  ],
  [
    [{borderInlineEndStyle: 'red'}],
    {borderRightStyle: 'red'},
    {borderLeftStyle: 'red'},
  ],
  [
    [{borderInlineStartWidth: '2px'}],
    {borderLeftWidth: '2px'},
    {borderRightWidth: '2px'},
  ],
  [
    [{borderInlineEndWidth: '2px'}],
    {borderRightWidth: '2px'},
    {borderLeftWidth: '2px'},
  ],
  [
    [{borderColor: 'logical red green blue white'}],
    {borderColor: 'red green blue white'},
    {borderColor: 'red white blue green'},
  ],
  [
    [{borderColor: 'logical red #f00 rgb(255, 0, 0) rgba(255, 0, 0, 0.5)'}],
    {borderColor: 'red #f00 rgb(255, 0, 0) rgba(255, 0, 0, 0.5)'},
    {borderColor: 'red rgba(255, 0, 0, 0.5) rgb(255, 0, 0) #f00'},
  ],
  [
    [
      {
        borderColor:
          'logical red #f00 hsl(0, 100%, 50%) hsla(0, 100%, 50%, 0.5)',
      },
    ],
    {borderColor: 'red #f00 hsl(0, 100%, 50%) hsla(0, 100%, 50%, 0.5)'},
    {borderColor: 'red hsla(0, 100%, 50%, 0.5) hsl(0, 100%, 50%) #f00'},
  ],
  [
    [{borderWidth: 'logical 1px 2px 3px 4px'}],
    {borderWidth: '1px 2px 3px 4px'},
    {borderWidth: '1px 4px 3px 2px'},
  ],
  [
    [{borderStyle: 'logical none dotted dashed solid'}],
    {borderStyle: 'none dotted dashed solid'},
    {borderStyle: 'none solid dashed dotted'},
  ],
  [
    [{borderTopStartRadius: 0}],
    {borderTopLeftRadius: 0},
    {borderTopRightRadius: 0},
  ],
  [
    [{borderTopEndRadius: 0}],
    {borderTopRightRadius: 0},
    {borderTopLeftRadius: 0},
  ],
  [
    [{borderBottomStartRadius: 0}],
    {borderBottomLeftRadius: 0},
    {borderBottomRightRadius: 0},
  ],
  [
    [{borderBottomEndRadius: 0}],
    {borderBottomRightRadius: 0},
    {borderBottomLeftRadius: 0},
  ],
  [
    [{borderRadius: 'logical 1px 2px'}],
    {borderRadius: '1px 2px'},
    {borderRadius: '2px 1px'},
  ],
  [
    [{borderRadius: 'logical 1px 2px 3px 4px'}],
    {borderRadius: '1px 2px 3px 4px'},
    {borderRadius: '2px 1px 4px 3px'},
  ],
  [
    [{borderRadius: 'logical 1px 2px 3px 4px'}],
    {borderRadius: '1px 2px 3px 4px'},
    {borderRadius: '2px 1px 4px 3px'},
  ],
  [
    [{borderRadius: 'logical 15px / 0 20px'}],
    {borderRadius: '15px / 0 20px'},
    {borderRadius: '15px / 20px 0'},
  ],
  [
    [{borderRadius: 'logical 1px 2px 3px 4px / 5px 6px 7px 8px'}],
    {borderRadius: '1px 2px 3px 4px / 5px 6px 7px 8px'},
    {borderRadius: '2px 1px 4px 3px / 6px 5px 8px 7px'},
  ],
  [
    [{borderRadius: 'logical 1px 2px 3px 4px !important'}],
    {borderRadius: '1px 2px 3px 4px !important'},
    {borderRadius: '2px 1px 4px 3px !important'},
  ],
  [
    [{borderRadius: 'logical 1px 2px 3px 4px'}],
    {borderRadius: '1px 2px 3px 4px'},
    {borderRadius: '2px 1px 4px 3px'},
  ],
  [
    [{borderRadius: 'logical 1px 2px 3px calc(calc(2*2) * 3px)'}],
    {borderRadius: '1px 2px 3px calc(calc(2*2) * 3px)'},
    {borderRadius: '2px 1px calc(calc(2*2) * 3px) 3px'},
  ],
  [
    [{background: 'logical url(/foo/bar.png) start top'}],
    {background: 'url(/foo/bar.png) left top'},
    {background: 'url(/foo/bar.png) right top'},
  ],
  [
    [{background: 'logical url(/foo/bar.png) no-repeat end top'}],
    {background: 'url(/foo/bar.png) no-repeat right top'},
    {background: 'url(/foo/bar.png) no-repeat left top'},
  ],
  [
    [{background: 'logical #000 url(/foo/bar.png) no-repeat start top'}],
    {background: '#000 url(/foo/bar.png) no-repeat left top'},
    {background: '#000 url(/foo/bar.png) no-repeat right top'},
  ],
  [
    [{background: 'logical url(/foo/bar-ste.png)'}],
    {background: 'url(/foo/bar-ltr.png)'},
    {background: 'url(/foo/bar-rtl.png)'},
  ],
  [
    [{background: 'logical url(/foo/bar-ets.png)'}],
    {background: 'url(/foo/bar-rtl.png)'},
    {background: 'url(/foo/bar-ltr.png)'},
  ],
  [
    [{backgroundImage: 'logical url(/foo/bar-ets.png)'}],
    {backgroundImage: 'url(/foo/bar-rtl.png)'},
    {backgroundImage: 'url(/foo/bar-ltr.png)'},
  ],
  [
    [{backgroundImage: 'logical linear-gradient(to start top, blue, red)'}],
    {backgroundImage: 'linear-gradient(to left top, blue, red)'},
    {backgroundImage: 'linear-gradient(to right top, blue, red)'},
  ],
  [
    [{backgroundImage: 'logical linear-gradient(to end top, blue, red)'}],
    {backgroundImage: 'linear-gradient(to right top, blue, red)'},
    {backgroundImage: 'linear-gradient(to left top, blue, red)'},
  ],
  [
    [
      {
        backgroundImage:
          'logical linear-gradient(to start, #00ff00 0%, #ff0000 100%)',
      },
    ],
    {backgroundImage: 'linear-gradient(to left, #00ff00 0%, #ff0000 100%)'},
    {backgroundImage: 'linear-gradient(to right, #00ff00 0%, #ff0000 100%)'},
  ],
  [
    [
      {
        backgroundImage:
          'logical repeating-linear-gradient(to start top, blue, red)',
      },
    ],
    {backgroundImage: 'repeating-linear-gradient(to left top, blue, red)'},
    {backgroundImage: 'repeating-linear-gradient(to right top, blue, red)'},
  ],
  [
    [
      {
        backgroundImage:
          'logical repeating-linear-gradient(to end top, blue, red)',
      },
    ],
    {backgroundImage: 'repeating-linear-gradient(to right top, blue, red)'},
    {backgroundImage: 'repeating-linear-gradient(to left top, blue, red)'},
  ],
  [
    [
      {
        backgroundImage:
          'logical repeating-linear-gradient(to start, #00ff00 0%, #ff0000 100%)',
      },
    ],
    {
      backgroundImage:
        'repeating-linear-gradient(to left, #00ff00 0%, #ff0000 100%)',
    },
    {
      backgroundImage:
        'repeating-linear-gradient(to right, #00ff00 0%, #ff0000 100%)',
    },
  ],
  [
    [{background: 'logical #000 linear-gradient(to start top, blue, red)'}],
    {background: '#000 linear-gradient(to left top, blue, red)'},
    {background: '#000 linear-gradient(to right top, blue, red)'},
  ],
  [
    [{backgroundPosition: 'logical start top'}],
    {backgroundPosition: 'left top'},
    {backgroundPosition: 'right top'},
  ],
  [
    [{backgroundPosition: 'logical start -5px'}],
    {backgroundPosition: 'left -5px'},
    {backgroundPosition: 'right -5px'},
  ],
  [
    [{backgroundPosition: 'logical end top'}],
    {backgroundPosition: 'right top'},
    {backgroundPosition: 'left top'},
  ],
  [
    [{backgroundPosition: 'logical end -5px'}],
    {backgroundPosition: 'right -5px'},
    {backgroundPosition: 'left -5px'},
  ],
  [
    [{backgroundPosition: 'logical 77% 40%'}],
    {backgroundPosition: '77% 40%'},
    {backgroundPosition: '23% 40%'},
  ],
  [
    [{backgroundPosition: 'logical 2.3% 40%'}],
    {backgroundPosition: '2.3% 40%'},
    {backgroundPosition: '97.7% 40%'},
  ],
  [
    [{backgroundPosition: 'logical 2.3210% 40%'}],
    {backgroundPosition: '2.3210% 40%'},
    {backgroundPosition: '97.6790% 40%'},
  ],
  [
    [{backgroundPosition: 'logical 0% 100%'}],
    {backgroundPosition: '0% 100%'},
    {backgroundPosition: '100% 100%'},
  ],
  [
    [{backgroundPosition: 'logical 77% -5px'}],
    {backgroundPosition: '77% -5px'},
    {backgroundPosition: '23% -5px'},
  ],
  [
    [{backgroundPosition: 'logical 0% 100% !important'}],
    {backgroundPosition: '0% 100% !important'},
    {backgroundPosition: '100% 100% !important'},
  ],
  [
    [{backgroundPosition: 'logical 0% 100%'}],
    {backgroundPosition: '0% 100%'},
    {backgroundPosition: '100% 100%'},
  ],
  [
    [{backgroundPosition: 'logical 0% 100%'}],
    {backgroundPosition: '0% 100%'},
    {backgroundPosition: '100% 100%'},
  ],
  [
    [{backgroundPositionX: 'logical 77%'}],
    {backgroundPositionX: '77%'},
    {backgroundPositionX: '23%'},
  ],
  [
    [{backgroundPositionX: 'logical 77% !important'}],
    {backgroundPositionX: '77% !important'},
    {backgroundPositionX: '23% !important'},
  ],
  [
    [{background: 'logical url(/foo/bar.png) 77% 40%'}],
    {background: 'url(/foo/bar.png) 77% 40%'},
    {background: 'url(/foo/bar.png) 23% 40%'},
  ],
  [
    [{background: 'logical url(/foo/bar.png) 77%'}],
    {background: 'url(/foo/bar.png) 77%'},
    {background: 'url(/foo/bar.png) 23%'},
  ],
  [
    [{background: 'logical url(/foo/bar.png) no-repeat 77% 40%'}],
    {background: 'url(/foo/bar.png) no-repeat 77% 40%'},
    {background: 'url(/foo/bar.png) no-repeat 23% 40%'},
  ],
  [
    [{background: 'logical #000 url(/foo/bar.png) no-repeat 77% 40%'}],
    {background: '#000 url(/foo/bar.png) no-repeat 77% 40%'},
    {background: '#000 url(/foo/bar.png) no-repeat 23% 40%'},
  ],
  [
    [{background: 'logical url(/foo/bar.png) 77% 40% !important'}],
    {background: 'url(/foo/bar.png) 77% 40% !important'},
    {background: 'url(/foo/bar.png) 23% 40% !important'},
  ],
  [[{marginStart: null}], {marginLeft: null}, {marginRight: null}],
  [[{marginEnd: null}], {marginRight: null}, {marginLeft: null}],
  [[{marginInlineStart: null}], {marginLeft: null}, {marginRight: null}],
  [[{marginInlineEnd: null}], {marginRight: null}, {marginLeft: null}],
  [
    [{paddingStart: undefined}],
    {paddingLeft: undefined},
    {paddingRight: undefined},
  ],
  [
    [{paddingEnd: undefined}],
    {paddingRight: undefined},
    {paddingLeft: undefined},
  ],
  [
    [{paddingInlineStart: undefined}],
    {paddingLeft: undefined},
    {paddingRight: undefined},
  ],
  [
    [{paddingInlineEnd: undefined}],
    {paddingRight: undefined},
    {paddingLeft: undefined},
  ],
  [
    [{':active': {marginStart: null}}],
    {':active': {marginLeft: null}},
    {':active': {marginRight: null}},
  ],
  [
    [{':active': {marginInlineStart: null}}],
    {':active': {marginLeft: null}},
    {':active': {marginRight: null}},
  ],
  [
    [{':active': {paddingStart: undefined}}],
    {':active': {paddingLeft: undefined}},
    {':active': {paddingRight: undefined}},
  ],
  [
    [{':active': {paddingInlineStart: undefined}}],
    {':active': {paddingLeft: undefined}},
    {':active': {paddingRight: undefined}},
  ],
  [
    [{transform: 'logical translate(30px)'}],
    {transform: 'translate(30px)'},
    {transform: 'translate(-30px)'},
  ],
  [
    [{transform: 'logical translate( 30px )'}],
    {transform: 'translate( 30px )'},
    {transform: 'translate( -30px )'},
  ],
  [
    [{transform: 'logical translate(30%)'}],
    {transform: 'translate(30%)'},
    {transform: 'translate(-30%)'},
  ],
  [
    [{transform: 'logical translate(30%, 20%)'}],
    {transform: 'translate(30%, 20%)'},
    {transform: 'translate(-30%, 20%)'},
  ],
  [
    [{transform: 'logical translateX(-30px)'}],
    {transform: 'translateX(-30px)'},
    {transform: 'translateX(30px)'},
  ],
  [
    [{transform: 'logical translateX( 30px )'}],
    {transform: 'translateX( 30px )'},
    {transform: 'translateX( -30px )'},
  ],
  [
    [{transform: 'logical translateX(30%)'}],
    {transform: 'translateX(30%)'},
    {transform: 'translateX(-30%)'},
  ],
  [
    [{transform: 'logical translateY(30px) rotate(20deg) translateX(10px)'}],
    {transform: 'translateY(30px) rotate(20deg) translateX(10px)'},
    {transform: 'translateY(30px) rotate(20deg) translateX(-10px)'},
  ],
  [
    [{transform: 'logical translateX(30px) rotate(20deg) translateY(10px)'}],
    {transform: 'translateX(30px) rotate(20deg) translateY(10px)'},
    {transform: 'translateX(-30px) rotate(20deg) translateY(10px)'},
  ],
  [
    [{transform: 'logical translate3d(30%, 20%, 10%)'}],
    {transform: 'translate3d(30%, 20%, 10%)'},
    {transform: 'translate3d(-30%, 20%, 10%)'},
  ],
  [
    [{transform: 'logical perspective(500px) translate3d(30%, 20%, 10%)'}],
    {transform: 'perspective(500px) translate3d(30%, 20%, 10%)'},
    {transform: 'perspective(500px) translate3d(-30%, 20%, 10%)'},
  ],
  [
    [{webkitTransform: 'logical translateX(30px)'}],
    {webkitTransform: 'translateX(30px)'},
    {webkitTransform: 'translateX(-30px)'},
  ],
  [
    [{mozTransform: 'logical translateX(30px)'}],
    {mozTransform: 'translateX(30px)'},
    {mozTransform: 'translateX(-30px)'},
  ],
]

// put short tests that should be skipped here
// you can specify a modifier as a third item in the array
const shortTestsTodo = []

// put tests here where bidi-css-js should not change the input
// unfortunately no way to add a modifier to this 😿
const unchanged = [
  // Don't manipulate flexbox and grid related properties
  [{justifyContent: 'flex-start'}],
  [{justifyContent: 'flex-end'}],
  [{justifyContent: 'start'}],
  [{justifyContent: 'end'}],
  [{justifyItems: 'start'}],
  [{justifyItems: 'end'}],
  [{justifySelf: 'start'}],
  [{justifySelf: 'end'}],
  [{alignContent: 'flex-start'}],
  [{alignContent: 'flex-end'}],
  [{alignContent: 'start'}],
  [{alignContent: 'end'}],
  [{alignItems: 'flex-start'}],
  [{alignItems: 'flex-end'}],
  [{alignItems: 'start'}],
  [{alignItems: 'end'}],
  [{alignSelf: 'flex-start'}],
  [{alignSelf: 'flex-end'}],
  [{alignSelf: 'start'}],
  [{alignSelf: 'end'}],
  [{grid: '[start] "start start start" 1fr [end] / auto 50px auto'}],
  [{gridColumnStart: 2}],
  [{gridColumnStart: 'row1-start'}],
  [{gridColumnEnd: 2}],
  [{gridColumnEnd: 'row1-start'}],
  [{gridRowStart: 2}],
  [{gridRowStart: 'row1-start'}],
  [{gridRowEnd: 2}],
  [{gridRowEnd: 'end'}],
  [{gridColumn: 'start / 4'}],
  [{gridRow: 'start / 4'}],
  [{gridArea: 'start'}],
  [{gridArea: '1 / col4-start / last-line / 6'}],
  [{gridTemplateColumns: '[start] 40px'}],
  [{gridTemplateColumns: '[end] 40px'}],
  [{gridTemplateRows: '[start] 40px'}],
  [{gridTemplateRows: '[end] 40px'}],
  [{gridTemplate: '[start] "start start start" 25px [end] / auto 50px auto'}],
  [
    {
      gridTemplateAreas: `"start start start"
    "mid mid mid"
    "end . end"`,
    },
  ],

  [{content: 'start'}],
  [{content: 'end'}],
  [{content: 'ste'}],
  [{content: 'ets'}],

  [{paddingLeft: 23}],
  [{paddingRight: 23}],
  [{direction: 'ltr'}],
  [{direction: 'rtl'}],
  [{left: 10}],
  [{left: '10px !important'}],
  [{right: 10}],
  [{right: '10px !important'}],
  [{right: '-1.5em'}],
  [{left: '-.75em'}],
  [{padding: '1px 2px 3px -4px'}],
  [{padding: '.25em 0ex 0pt 15px'}],
  [{padding: '1px 2% 3px 4.1grad'}],
  [{padding: '1px auto 3px 2px'}],
  [{padding: '1.1px 2.2px 3.3px 4.4px'}],
  [{padding: '1px auto 3px inherit'}],
  [{padding: '1px 2px 3px 4px'}],
  [{padding: '1px 2px 3px 4px !important'}],
  [{padding: '1px  2px   3px    4px'}],
  [{padding: '1px 2px 3px 4px !important', color: 'red'}],
  [{padding: 10, direction: 'rtl'}],
  [{padding: 10, direction: 'ltr'}],
  [{margin: '1px 2px 3px 4px'}],
  [{float: 'left'}],
  [{float: 'right'}],
  [{float: 'left !important'}],
  [{clear: 'left'}],
  [{clear: 'right'}],
  [{paddingLeft: 0}],
  [{paddingRight: 0}],
  [{marginLeft: 0}],
  [{marginRight: 0}],
  [{cursor: 'w-resize'}],
  [{cursor: 'e-resize'}],
  [{cursor: 'sw-resize'}],
  [{cursor: 'se-resize'}],
  [{cursor: 'nw-resize'}],
  [{cursor: 'ne-resize'}],
  [{textAlign: 'left'}],
  [{textAlign: 'right'}],
  [{textShadow: 'red 2px 0'}],
  [{textShadow: 'red -2px 0'}],
  [{textShadow: '2px 0 red'}],
  [{textShadow: '-2px 0 red'}],
  [{boxShadow: '-6px 3px 8px 5px rgba(0, 0, 0, 0.25)'}],
  [{boxShadow: '6px 3px 8px 5px rgba(0, 0, 0, 0.25)'}],
  [{boxShadow: 'inset -6px 3px 8px 5px rgba(0, 0, 0, 0.25)'}],
  [{boxShadow: 'inset 6px 3px 8px 5px rgba(0, 0, 0, 0.25)'}],
  [{boxShadow: 'inset .5em 0 0 white'}],
  [{boxShadow: 'inset -.5em 0 0 white'}],
  [{boxShadow: 'inset 0.5em 0 0 white'}],
  [{boxShadow: 'inset -0.5em 0 0 white'}],
  [{boxShadow: '-1px 2px 3px 3px red'}],
  [{boxShadow: '1px 2px 3px 3px red'}],
  [{boxShadow: '-1px 2px 3px 3px red'}],
  [{boxShadow: '1px 2px 3px 3px red'}],
  [{webkitBoxShadow: '-1px 2px 3px 3px red'}],
  [{webkitBoxShadow: '1px 2px 3px 3px red'}],
  [{mozBoxShadow: '-1px 2px 3px 3px red'}],
  [{mozBoxShadow: '1px 2px 3px 3px red'}],
  [{borderLeft: 0}],
  [{borderRight: 0}],
  [{borderLeft: '1px solid red'}],
  [{borderRight: '1px solid red'}],
  [{borderLeftColor: 'red'}],
  [{borderRightColor: 'red'}],
  [{borderLeftStyle: 'red'}],
  [{borderRightStyle: 'red'}],
  [{borderLeftWidth: '2px'}],
  [{borderRightWidth: '2px'}],
  [{borderColor: 'red green blue white'}],
  [{borderColor: 'red white blue green'}],
  [{borderColor: 'red #f00 rgb(255, 0, 0) rgba(255, 0, 0, 0.5)'}],
  [{borderColor: 'red rgba(255, 0, 0, 0.5) rgb(255, 0, 0) #f00'}],
  [{borderColor: 'red #f00 hsl(0, 100%, 50%) hsla(0, 100%, 50%, 0.5)'}],
  [{borderColor: 'red hsla(0, 100%, 50%, 0.5) hsl(0, 100%, 50%) #f00'}],
  [{borderWidth: '1px 2px 3px 4px'}],
  [{borderWidth: '1px 4px 3px 2px'}],
  [{borderStyle: 'none dotted dashed solid'}],
  [{borderStyle: 'none solid dashed dotted'}],
  [{borderTopLeftRadius: 0}],
  [{borderTopRightRadius: 0}],
  [{borderBottomLeftRadius: 0}],
  [{borderBottomRightRadius: 0}],
  [{borderRadius: '1px 2px'}],
  [{borderRadius: '2px 1px'}],
  [{borderRadius: '1px 2px 3px 4px'}],
  [{borderRadius: '2px 1px 4px 3px'}],
  [{borderRadius: '1px 2px 3px 4px'}],
  [{borderRadius: '2px 1px 4px 3px'}],
  [{borderRadius: '15px / 0 20px'}],
  [{borderRadius: '15px / 20px 0'}],
  [{borderRadius: '1px 2px 3px 4px / 5px 6px 7px 8px'}],
  [{borderRadius: '2px 1px 4px 3px / 6px 5px 8px 7px'}],
  [{borderRadius: '1px 2px 3px 4px !important'}],
  [{borderRadius: '2px 1px 4px 3px !important'}],
  [{borderRadius: '1px 2px 3px 4px'}],
  [{borderRadius: '1px 2px 3px calc(calc(2*2) * 3px)'}],
  [{borderRadius: '2px 1px calc(calc(2*2) * 3px) 3px'}],
  [{background: 'url(/foo/bar.png) left top'}],
  [{background: 'url(/foo/bar.png) right top'}],
  [{background: 'url(/foo/bar.png) no-repeat left top'}],
  [{background: 'url(/foo/bar.png) no-repeat right top'}],
  [{background: '#000 url(/foo/bar.png) no-repeat left top'}],
  [{background: '#000 url(/foo/bar.png) no-repeat right top'}],
  [{background: 'url(/foo/bar-ltr.png)'}],
  [{background: 'url(/foo/bar-rtl.png)'}],
  [{background: 'url(/foo/bar-rtl.png)'}],
  [{background: 'url(/foo/bar-ltr.png)'}],
  [{backgroundImage: 'url(/foo/bar-rtl.png)'}],
  [{backgroundImage: 'url(/foo/bar-ltr.png)'}],
  [{backgroundImage: 'linear-gradient(to left top, blue, red)'}],
  [{backgroundImage: 'linear-gradient(to right top, blue, red)'}],
  [{backgroundImage: 'linear-gradient(to right top, blue, red)'}],
  [{backgroundImage: 'linear-gradient(to left top, blue, red)'}],
  [{backgroundImage: 'linear-gradient(to left, #00ff00 0%, #ff0000 100%)'}],
  [{backgroundImage: 'linear-gradient(to right, #00ff00 0%, #ff0000 100%)'}],
  [{backgroundImage: 'repeating-linear-gradient(to left top, blue, red)'}],
  [{backgroundImage: 'repeating-linear-gradient(to right top, blue, red)'}],
  [{backgroundImage: 'repeating-linear-gradient(to right top, blue, red)'}],
  [{backgroundImage: 'repeating-linear-gradient(to left top, blue, red)'}],
  [
    {
      backgroundImage:
        'repeating-linear-gradient(to left, #00ff00 0%, #ff0000 100%)',
    },
  ],
  [
    {
      backgroundImage:
        'repeating-linear-gradient(to right, #00ff00 0%, #ff0000 100%)',
    },
  ],
  [{background: '#000 linear-gradient(to left top, blue, red)'}],
  [{background: '#000 linear-gradient(to right top, blue, red)'}],
  [{backgroundPosition: 'left top'}],
  [{backgroundPosition: 'right top'}],
  [{backgroundPosition: 'left -5px'}],
  [{backgroundPosition: 'right -5px'}],
  [{backgroundPosition: '77% 40%'}],
  [{backgroundPosition: '23% 40%'}],
  [{backgroundPosition: '2.3% 40%'}],
  [{backgroundPosition: '97.7% 40%'}],
  [{backgroundPosition: '2.3210% 40%'}],
  [{backgroundPosition: '97.6790% 40%'}],
  [{backgroundPosition: '0% 100%'}],
  [{backgroundPosition: '100% 100%'}],
  [{backgroundPosition: '77% -5px'}],
  [{backgroundPosition: '23% -5px'}],
  [{backgroundPosition: '0% 100% !important'}],
  [{backgroundPosition: '100% 100% !important'}],
  [{backgroundPosition: '0% 100%'}],
  [{backgroundPosition: '100% 100%'}],
  [{backgroundPosition: '0% 100%'}],
  [{backgroundPosition: '100% 100%'}],
  [{backgroundPositionX: '77%'}],
  [{backgroundPositionX: '23%'}],
  [{backgroundPositionX: '77% !important'}],
  [{backgroundPositionX: '23% !important'}],
  [{background: 'url(/foo/bar.png) 77% 40%'}],
  [{background: 'url(/foo/bar.png) 23% 40%'}],
  [{background: 'url(/foo/bar.png) 77%'}],
  [{background: 'url(/foo/bar.png) 23%'}],
  [{background: 'url(/foo/bar.png) no-repeat 77% 40%'}],
  [{background: 'url(/foo/bar.png) no-repeat 23% 40%'}],
  [{background: '#000 url(/foo/bar.png) no-repeat 77% 40%'}],
  [{background: '#000 url(/foo/bar.png) no-repeat 23% 40%'}],
  [{background: 'url(/foo/bar.png) 77% 40% !important'}],
  [{background: 'url(/foo/bar.png) 23% 40% !important'}],
  [{marginLeft: null}],
  [{marginRight: null}],
  [{paddingLeft: undefined}],
  [{paddingRight: undefined}],
  [{':active': {marginLeft: null}}],
  [{':active': {marginRight: null}}],
  [{':active': {paddingLeft: undefined}}],
  [{':active': {paddingRight: undefined}}],
  [{transform: 'translate(30px)'}],
  [{transform: 'translate(-30px)'}],
  [{transform: 'translate( 30px )'}],
  [{transform: 'translate( -30px )'}],
  [{transform: 'translate(30%)'}],
  [{transform: 'translate(-30%)'}],
  [{transform: 'translate(30%, 20%)'}],
  [{transform: 'translate(-30%, 20%)'}],
  [{transform: 'translateX(-30px)'}],
  [{transform: 'translateX(30px)'}],
  [{transform: 'translateX( 30px )'}],
  [{transform: 'translateX( -30px )'}],
  [{transform: 'translateX(30%)'}],
  [{transform: 'translateX(-30%)'}],
  [{transform: 'translateY(30px) rotate(20deg) translateX(10px)'}],
  [{transform: 'translateY(30px) rotate(20deg) translateX(-10px)'}],
  [{transform: 'translateX(30px) rotate(20deg) translateY(10px)'}],
  [{transform: 'translateX(-30px) rotate(20deg) translateY(10px)'}],
  [{transform: 'translate3d(30%, 20%, 10%)'}],
  [{transform: 'translate3d(-30%, 20%, 10%)'}],
  [{transform: 'perspective(500px) translate3d(30%, 20%, 10%)'}],
  [{transform: 'perspective(500px) translate3d(-30%, 20%, 10%)'}],
  [{webkitTransform: 'translateX(30px)'}],
  [{webkitTransform: 'translateX(-30px)'}],
  [{mozTransform: 'translateX(30px)'}],
  [{mozTransform: 'translateX(-30px)'}],
  [{}],
  [{textAlign: 'center'}],
  [{opacity: 0}],
  [{xUnknown: 'a b c d'}],
  [{xUnknown: '1px 2px 3px 4px'}],
  [{xUnknown: '1px 2px 3px 4px 5px'}],
  [{padding: 1}],
  [{padding: '1px 2px'}],
  [{padding: '1px 2px 3px'}],
  [{padding: '1px 2px 3px 4px !important'}],
  [{padding: '1px 2px 3px 4px 5px'}],
  [{padding: '1px 2px 3px 4px 5px 6px'}],
  [{textShadow: 'red 0 2px'}],
  [{boxShadow: 'none'}],
  [{borderRadius: 1}],
  [{borderRadius: '10px / 20px'}],
  [{borderRadius: '0 !important'}],
  [{borderRadius: '1px 2px 3px 4px 5px'}],
  [{backgroundPosition: '0 5px'}],
  [{backgroundPosition: '10px 20px'}],
  [{backgroundPosition: '10px 40%'}],
  [{backgroundPosition: '10px 2.3%'}],
  [{backgroundPositionX: '10px'}],
  [{backgroundPositionX: 10}],
  [{backgroundPositionY: '40%'}],
  [{backgroundImage: 'linear-gradient(#eb01a5, #d13531)'}],
  [{background: 'url(/foo/bright.png)'}],
  [{background: 'url(/foo/leftovers.png)'}],
  [{background: 'url("http'}],
  [{background: "url('http"}],
  [{background: "url('http"}],
  [{xxLeft: 10}],
  [{xxRight: 10}],
  [{leftxx: 10}],
  [{rightxx: 10}],
  [{backgroundImage: 'mozLinearGradient(#326cc1, #234e8c)'}],
  [
    {
      backgroundImage:
        'webkitGradient(linear, 100% 0%, 0% 0%, from(#666666), to(#ffffff))',
    },
  ],
  [{background: 'url(/foo/bar-ltr.png)'}],
  [{background: 'url(/foo/bar-rtl.png)'}],
  [{backgroundImage: 'url(/foo/bar-rtl.png)'}],
  [{margin: null}],
  [{padding: undefined, lineHeight: 0.2}],
  [{':active': {border: null, color: 'blue'}}],
  [{':active': {border: undefined, color: 'blue'}}],
  [{transform: 'translateX(0px)'}],
  [{transform: 'translateX(30px)'}],
  [{transform: 'translateY(30px)'}],
  [{transform: 'translateZ(30px)'}],
]

shortTests.forEach(shortTest => {
  const [input, ltrOutput, rtlOutput, modifier] = shortTest
  const title = `changes ${JSON.stringify(input[0])} to ${JSON.stringify(
    ltrOutput,
  )} in "ltr" mode, and to ${JSON.stringify(rtlOutput)} in "rtl" mode`
  tests[title] = {input, ltrOutput, rtlOutput, modifier}
})

shortTestsTodo.forEach(shortTest => {
  const [input, ltrOutput, rtlOutput, modifier = 'skip'] = shortTest
  const title = `changes ${JSON.stringify(input[0])} to ${JSON.stringify(
    ltrOutput,
  )} in "ltr" mode, and to ${JSON.stringify(rtlOutput)} in "rtl" mode`
  tests[title] = {input, ltrOutput, rtlOutput, modifier}
})

unchanged.forEach(shortTest => {
  const input = shortTest
  const [ltrOutput] = input
  const rtlOutput = ltrOutput
  const title = `does not change ${JSON.stringify(input[0])}`
  tests[title] = {input, ltrOutput, rtlOutput}
})

const hasBalrog = Object.keys(tests).some(
  title => tests[title].modifier === 'balrog',
)

Object.keys(tests)
  .filter(title => !hasBalrog || tests[title].modifier === 'balrog')
  .forEach(title => {
    const testObj = tests[title]
    const {modifier, input, ltrOutput, rtlOutput} = testObj
    if (modifier && modifier !== 'balrog') {
      test[modifier](title, testFn)
    } else {
      test(title, testFn)
    }

    function testFn() {
      expect([
        flowRelative(...input, 'ltr'),
        flowRelative(...input, 'rtl'),
      ]).toEqual([ltrOutput, rtlOutput])
    }
  })

it('throws if "flowDirection" is "undefined"', () => {
  expect(() => flowRelative({float: 'start'})).toThrow('')
})
it('throws if "flowDirection" is defined but not one of "ltr" or "rtl"', () => {
  expect(() => flowRelative({float: 'start'}, true)).toThrow('')
})
