import {
  isNumber,
  isObject,
  isString,
  isNullOrUndefined,
  propertyValueConverters,
} from 'rtl-css-js/core.esm'

// this will be an object of properties that map to their corresponding rtl property (their doppelganger)
const propertiesToConvert = flowRelativeDirectionMapper(
  ['paddingStart', 'paddingLeft', 'paddingRight'],
  ['paddingEnd', 'paddingRight', 'paddingLeft'],
  ['marginStart', 'marginLeft', 'marginRight'],
  ['marginEnd', 'marginRight', 'marginLeft'],
  ['paddingInlineStart', 'paddingLeft', 'paddingRight'],
  ['paddingInlineEnd', 'paddingRight', 'paddingLeft'],
  ['marginInlineStart', 'marginLeft', 'marginRight'],
  ['marginInlineEnd', 'marginRight', 'marginLeft'],
  ['insetInlineStart', 'left', 'right'],
  ['insetInlineEnd', 'right', 'left'],
  ['start', 'left', 'right'],
  ['end', 'right', 'left'],
  ['borderStart', 'borderLeft', 'borderRight'],
  ['borderEnd', 'borderRight', 'borderLeft'],
  ['borderStartColor', 'borderLeftColor', 'borderRightColor'],
  ['borderEndColor', 'borderRightColor', 'borderLeftColor'],
  ['borderStartStyle', 'borderLeftStyle', 'borderRightStyle'],
  ['borderEndStyle', 'borderRightStyle', 'borderLeftStyle'],
  ['borderStartWidth', 'borderLeftWidth', 'borderRightWidth'],
  ['borderEndWidth', 'borderRightWidth', 'borderLeftWidth'],
  ['borderInlineStart', 'borderLeft', 'borderRight'],
  ['borderInlineEnd', 'borderRight', 'borderLeft'],
  ['borderInlineStartColor', 'borderLeftColor', 'borderRightColor'],
  ['borderInlineEndColor', 'borderRightColor', 'borderLeftColor'],
  ['borderInlineStartStyle', 'borderLeftStyle', 'borderRightStyle'],
  ['borderInlineEndStyle', 'borderRightStyle', 'borderLeftStyle'],
  ['borderInlineStartWidth', 'borderLeftWidth', 'borderRightWidth'],
  ['borderInlineEndWidth', 'borderRightWidth', 'borderLeftWidth'],
  ['borderTopStartRadius', 'borderTopLeftRadius', 'borderTopRightRadius'],
  ['borderTopEndRadius', 'borderTopRightRadius', 'borderTopLeftRadius'],
  [
    'borderBottomStartRadius',
    'borderBottomLeftRadius',
    'borderBottomRightRadius',
  ],
  [
    'borderBottomEndRadius',
    'borderBottomRightRadius',
    'borderBottomLeftRadius',
  ],
  ['borderStartStartRadius', 'borderTopLeftRadius', 'borderTopRightRadius'],
  ['borderStartEndRadius', 'borderTopRightRadius', 'borderTopLeftRadius'],
  ['borderEndStartRadius', 'borderBottomLeftRadius', 'borderBottomRightRadius'],
  ['borderEndEndRadius', 'borderBottomRightRadius', 'borderBottomLeftRadius'],
)

// The properties in this list either natively support flow-relative authoring
// or should just not be touched (I'm looking at you `content`)
const propertiesToIgnore = [
  'justifyContent',
  'justifyItems',
  'justifySelf',
  'alignContent',
  'alignItems',
  'alignSelf',
  'grid',
  'gridColumnStart',
  'gridColumnEnd',
  'gridRowStart',
  'gridRowEnd',
  'gridColumn',
  'gridRow',
  'gridArea',
  'gridTemplateColumns',
  'gridTemplateRows',
  'gridTemplate',
  'gridTemplateAreas',
  'content',
]

// this is the same as the propertiesToConvert except for values
const valuesToConvert = flowRelativeDirectionMapper(
  ['ste', 'ltr', 'rtl'],
  ['ets', 'rtl', 'ltr'],
  ['start', 'left', 'right'],
  ['end', 'right', 'left'],
  ['inline-start', 'left', 'right'],
  ['inline-end', 'right', 'left'],
  ['start-resize', 'w-resize', 'e-resize'],
  ['end-resize', 'e-resize', 'w-resize'],
  ['bottomstart-resize', 'sw-resize', 'se-resize'],
  ['bottomend-resize', 'se-resize', 'sw-resize'],
  ['topstart-resize', 'nw-resize', 'ne-resize'],
  ['topend-resize', 'ne-resize', 'nw-resize'],
)

const canHaveLogical = [
  'background',
  'backgroundImage',
  'backgroundPosition',
  'backgroundPositionX',
  'borderColor',
  'borderRadius',
  'borderStyle',
  'borderWidth',
  'boxShadow',
  'mozBoxShadow',
  'webkitBoxShadow',
  'margin',
  'padding',
  'textShadow',
  'transform',
  'mozTransform',
  'webkitTransform',
]

// This regex is used to replace _every_ instance of `ste`, `ets`, `start`,
// and `end` in `backgroundimage` with the corresponding logical value,
// based on the flow direction.
// A situation we're accepting here:
// url('/start/end/ste/ets.png') will be changed to
// url('/left/right/ltr/rtl.png') when in `ltr` mode
const bgImgDirectionRegex = new RegExp(
  '(^|\\W|_)((ste)|(ets)|(start)|(end))(\\W|_|$)',
  'g',
)
const bgPosDirectionRegex = new RegExp('(start)|(end)')

/**
 * Logically converts properties and values in the CSS in JS object
 * based on the flow direction context.
 * @param {Object} object The CSS in JS object
 * @param {'rtl'|'ltr'} flowDirection The logical flow direction
 * @return {Object} The converted CSS in JS object
 */
export default function convert(object, flowDirection) {
  const isRtl =
    typeof flowDirection === 'string' && flowDirection.toLowerCase() === 'rtl'
  const isLtr =
    typeof flowDirection === 'string' && flowDirection.toLowerCase() === 'ltr'

  if (!isRtl && !isLtr) {
    throw new Error(
      `"flowDirection" must either be "rtl" or "ltr", you are trying to pass "${flowDirection}"`,
    )
  }

  return Object.keys(object).reduce((newObj, originalKey) => {
    let originalValue = object[originalKey]

    if (isString(originalValue)) {
      // you're welcome to later code 😺
      originalValue = originalValue.trim()
    }

    // Don't touch values that shouldn't be transformed.
    if (propertiesToIgnore.includes(originalKey)) {
      return {...newObj, ...{[originalKey]: originalValue}}
    }

    // Try to convert otherwise
    const {key, value} = convertProperty(originalKey, originalValue, isRtl)
    newObj[key] = value
    return newObj
  }, {})
}

/**
 * Logically converts a property and its value based on the flow direction context
 * @param {String} originalKey the original property key
 * @param {Number|String|Object} originalValue the original css property value
 * @param {Boolean} isRtl Should conversion happen in RTL context?
 * @return {Object} the new {key, value} pair
 */
function convertProperty(originalKey, originalValue, isRtl) {
  const key = getPropertyDoppelganger(originalKey, isRtl)
  const value = getValueDoppelganger(key, originalValue, isRtl)
  return {key, value}
}

/**
 * Logically gets the direction of the given property based on the flow direction context
 * @param {String} property the name of the property
 * @param {Boolean} isRtl Should conversion happen in RTL context?
 * @return {String} the name of the RTL property
 */
function getPropertyDoppelganger(property, isRtl) {
  const convertedProperty = isRtl
    ? propertiesToConvert.rtl[property]
    : propertiesToConvert.ltr[property]

  return convertedProperty || property
}

/**
 * Logically converts the given value to the correct version based on the key and flow direction context
 * @param {String} key this is the key (note: this should be the RTL version of the originalKey)
 * @param {String|Number|Object} originalValue the original css property value. If it's an object, then we'll convert that as well
 * @param {Boolean} isRtl Should conversion happen in RTL context?
 * @return {String|Number|Object} the converted value
 */
function getValueDoppelganger(key, originalValue, isRtl) {
  /* eslint complexity:[2, 8] */ // let's try to keep the complexity down... If we have to do this much more, let's break this up
  if (isNullOrUndefined(originalValue)) {
    return originalValue
  }

  const flowDirection = isRtl ? 'rtl' : 'ltr'
  if (isObject(originalValue)) {
    return convert(originalValue, flowDirection) // recurssion 🌀
  }

  const {
    isLogical,
    logicallessValue,
    isImportant,
    importantlessValue,
  } = analyzeOriginalValue(originalValue)

  if (canHaveLogical.includes(key) && !isLogical) {
    return originalValue
  }

  if (isLogical && !isRtl && !key.match('background')) {
    return logicallessValue
  }

  const conversionMap = valuesToConvert[flowDirection]
  return convertValues(
    key,
    importantlessValue,
    conversionMap,
    isImportant,
    isRtl,
  )
}

function analyzeOriginalValue(originalValue) {
  const isNum = isNumber(originalValue)
  const logicallessValue = isNum
    ? originalValue
    : originalValue.replace(/^\s*logical\s*/i, '')
  const isLogical = !isNum && logicallessValue.length !== originalValue.length
  const importantlessValue = isNum
    ? logicallessValue
    : logicallessValue.replace(/\s*!important.*?$/, '')
  const isImportant =
    !isNum && importantlessValue.length !== logicallessValue.length

  return {isLogical, logicallessValue, isImportant, importantlessValue}
}

function convertValues(key, value, conversionMap, isImportant, isRtl) {
  const valueConverter = propertyValueConverters[key]
  const newValue = valueConverter
    ? valueConverter({
        value,
        valuesToConvert: conversionMap,
        isRtl,
        bgImgDirectionRegex,
        bgPosDirectionRegex,
      })
    : conversionMap[value] || value

  return isImportant ? `${newValue} !important` : newValue
}

function flowRelativeDirectionMapper(...logicanDirectionsMap) {
  return logicanDirectionsMap.reduce(
    (all, [origValue, ltrValue, rtlValue]) => ({
      ltr: {
        ...all.ltr,
        ...{
          [origValue]: ltrValue,
        },
      },
      rtl: {
        ...all.rtl,
        ...{
          [origValue]: rtlValue,
        },
      },
    }),
    {ltr: {}, rtl: {}},
  )
}
