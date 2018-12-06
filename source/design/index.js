var html = require('choo/html')
var gr8 = require('gr8')
var recsst = require('recsst')
var lilcss = require('lilcss')

var spacing = [0, 0.5, 1, 1.5, 2, 3, 3.5, 4].map(size => {
  return { [size.toString().replace('.', '-')]: size * 0.75 }
})

var gr8css = gr8({
  breakpoints: {
    md: '100px',
    sm: '650px'
  },
  lineHeight: [1, { '1-5': 1.7 }],
  fontSize: [{ 1: 1 }],
  spacing: spacing,
  responsive: true
})

var type = {
  sans: '"Lars Sans", sans-serif',
  mono: '"Lars Mono", menlo, monaco, monospace'
}

var colors = {
  white: '#000',
  black: '#fff',
  grey: '#ccc',
  greylight: '#eee',
  greydark: '#999'
}

// fonts
gr8css.add({
  prop: 'font-family',
  vals: type
})

// backgrounds
gr8css.add({
  prop: 'background-color',
  prefix: 'bg',
  hyphenate: true,
  vals: colors
})

// colors
gr8css.add({
  prop: 'color',
  prefix: 'tc',
  hyphenate: true,
  vals: colors
})

// rag widths
gr8css.add({
  prop: 'width',
  prefix: 'wr',
  unit: 'rem',
  vals: [0, 5, 10, 15, 20]
})

gr8css.add({
  prop: 'width',
  prefix: 'w',
  unit: '%',
  vals: [20]
})

// viewport min heights
gr8css.add({
  prop: 'min-height',
  prefix: 'vhmn',
  unit: 'vh',
  vals: [0, 25, 33, 50, 66, 75]
})


var borderWeights = [0, 1, 2]
var borders = {}
borderWeights.forEach(border => {
  Object.keys(colors).forEach(key => {
    borders[border + '-' + key] = `${border}px solid ${colors[key]}`
  })
})

gr8css.add({
  prop: [
    'border',
    'border-top',
    'border-right',
    'border-bottom',
    'border-left'
  ],
  vals: borders
})

var custom = `
  html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -moz-font-feature-settings:"kern" 1; 
    -ms-font-feature-settings:"kern" 1; 
    -o-font-feature-settings:"kern" 1; 
    -webkit-font-feature-settings:"kern" 1; 
    font-feature-settings:"kern" 1;
    font-kerning: normal;
  }

  html, body {
    width: 100%;
  }

  ::-moz-selection { background: rgba(127, 127, 127, 0.5) }
  ::selection { background: rgba(127, 127, 127, 0.5) }

  @media (max-width: 650px) {
    .excerpt {
      width: 100%;
      max-width: 100%;
      margin-right: -50%;
    }
  }

  .excerpt [data-src*="_56"] {
    background: #eee;
    height: 0;
    padding-bottom: 56%;
  }

  .max-width {
    max-width: 67rem;
  }

  .ti1 {
    padding-left: ${spacing[2]['1']}rem;
    text-indent: -${spacing[2]['1']}rem;
  }

  .copy-links a {
    color: ${colors.white};
    text-decoration: none;
  }

  .anchors a,
  .copy a {
    color: ${colors.white};
    text-decoration: none;
    border-bottom: 1px solid ${colors.white};
    padding-bottom: 0.2rem;
  }

  .footnote-ref a {
    color: inherit;
    border-bottom: 0;
    font-size: 0.8em;
    font-family: 'Lars Mono', monospace;
    padding: 0;
  }

  .footnote-ref a:hover {

  }

  a.footnote-backref { border-bottom: 0 }

  figure { margin: 0; }

  .copy hr,
  .copy .imgs-auto,
  .copy figure,
  .copy img,
  .copy .embed-responsive {
    width: 100%;
    max-width: 50rem;
  }

  .copy .imgs-auto figure,
  .copy .imgs-auto img {
    max-width: 100% !important;
  }

  .copy img { display: block }
  .copy .monoimage { background: #eee }
  .copy .imgs-transparent .monoimage { background: none }

  .copy blockquote {
    border-left: 1px solid #000;
    padding-left: 2rem;
  }

  .embed-responsive { position: relative }
  .embed-responsive > * {
    position: absolute;
    top: 0;
    left: 0; 
    width: 100%;
    height: 100%;
  }

  .embed-responsive-16by9 {
    padding-bottom: 56.25%
  }

  .copy figure a { border: none }

  .copy .imgs-auto {
    display: flex;
    margin: -.375rem;
    max-width: auto;
    width: auto;
  }

  @media (min-width: 650px) {
    .copy .imgs-wide {
      margin: -0.375rem -0.375rem -0.375rem calc(-33.3% - 0.75rem);
      max-width: calc(50.375rem + 33.3%) !important;
    }
  }

  .imgs-auto > * {
    flex: 1;
    margin: 0.375rem;
  }

  figcaption {
    color: #999;
    font-size: 0.75rem;
    padding: 0.5rem 0 0.375rem;
  }

  hr {
    height: 1px;
    width: 100%;
    background: ${colors.white};
    border: 0;
    margin: 0;
  }

  h1, h2, h3 {
    font-weight: normal;
    font-size: 1rem;
  }

  .tch-parent:hover .tch-white {
    color: ${colors.white};
  }

  code, pre {
    font-size: 1rem;
    font-family: 'Lars Mono', menlo, monaco, monospace;
  }

  code {
    background: ${colors.greylight};
    border-radius: 3px;
    padding: 0.2em;
  }

  .copy > pre,
  pre {
    background: ${colors.greylight};
    padding: 1rem 1.5rem;
    border-radius: 3px;
    overflow: scroll;
    max-width: 100%;
    width: auto;
  }

  pre code {
    background: none;
    padding: 0;
  }

  li {
    list-style: none;
    position: relative;
  }

  .ti2 {
    text-indent: -2rem;
    padding-left: 2rem;
  }

  .circle {
    display: inline-block;
    margin-right: 0.75rem;
    height: 0.75rem;
    width: 0.75rem;
    border-radius: 50%;
    background: ${colors.white};
  }

  .inline-children > *:not(.circle) {
    display: inline;
  }

  ul li:before {
    content: '';
    position: absolute;
    top: 0.5rem;
    left: 0;
    height: 0.75rem;
    width: 0.75rem;
    border-radius: 50%;
    background: ${colors.white};
  }

  ul li {
    padding-left: 2rem;
  }

  ol li {
    position: relative;
    padding-left: 2rem;
    list-style: none;
  }

  ol li:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
  }

  ol li:nth-child(1):before { content: '1' }
  ol li:nth-child(2):before { content: '2' }
  ol li:nth-child(3):before { content: '3' }
  ol li:nth-child(4):before { content: '4' }
  ol li:nth-child(5):before { content: '5' }
  ol li:nth-child(6):before { content: '6' }
  ol li:nth-child(7):before { content: '7' }
  ol li:nth-child(8):before { content: '8' }
  ol li:nth-child(9):before { content: '9' }
  ol li:nth-child(10):before { content: '10' }
  ol li:nth-child(11):before { content: '11' }
  ol li:nth-child(12):before { content: '12' }

  .footnotes-list > li + li {
    margin-top: 1.5rem;
  }

  ul.list-horiz {
    padding-top: 1.75rem;
  }

  ul.list-horiz li:before { display: none; }

  ul.list-horiz li {
    padding: 0;
    text-indent: 0;
    transition: transform 0.25s ease;
  }

  @media (min-width: 600px) {
    ul.list-horiz li.selected,
    ul.list-horiz li.entry:not(.active):hover {
      transform: translateY(-1.75rem);
    }
  }

  ul.list-horiz li > a {
    height: 75vh;
    margin-bottom: calc(-75vh + 10rem);
    overflow: hidden;
    background: ${colors.black};
    color: ${colors.white};
    text-indent: 0;
    position: relative;
    /* border-top: 1px solid ${colors.white}; */
  }

  @media (min-width: 600px) {
    ul.list-horiz li > a {
      margin-bottom: calc(-75vh + 10.25rem);
    }
  }

  ul.list-horiz li > a:before {
    content: '';
    display: block;
    border-top: 1px solid ${colors.white}; 
    position: absolute;
    top: 0;
    left: 0.75rem;
    right: 0.75rem;
  }

  ul.list-horiz li.selected > a:before {
    display: none; 
  }

  .entry-thumb {
    height: 5.5rem;
    width: auto;
  }

  @media (max-width: 900px) {
    .entry-thumb { display: none }
  }

  @media (max-width: 600px) {
    .entry-thumb {
      display: block;
      height: 3.25rem;
    }
  }

  .wwbw { word-wrap: break-word }

  input { outline: 0 }

  ::-webkit-input-placeholder { color: #000; }
  ::-moz-placeholder { color: #000; }
  :-ms-input-placeholder { color: #000; }
  :-moz-placeholder { color: #000; opacity: 1; }
  ::-moz-placeholder { color: #000; opacity: 1; }
  :placeholder-shown { color: #000; opacity: 1; }
`

var typography = `
  .copy > * {
    margin-top: 1.65rem;
    margin-bottom: 1.65rem;
  }

  .copy {
    letter-spacing: 0.01rem;
    overflow-wrap: break-word;
    word-wrap: break-word;
  }

  .copy > * {
    width: 100%;
    max-width: 30rem;
  }

  h2 {
    border-bottom: 1px solid #000;
    padding-bottom: 0.5em;
    padding-top: 1.5em;
  }

  h3 {
    color: #999;
  }

  .back {
    display: inline-block;
    position: absolute;
    left: 1.5rem;
  }

  .back a {
    border-bottom: 0;
  }

  .copy > *:first-child { margin-top: 0 }
  .copy > *:last-child { margin-bottom: 0 }

  /*
  .anchors a[href*="//"],
  .copy a[href*="//"] {
    display: inline-block;
    margin-right: 1rem;
    white-space: nowrap;
  }

  .anchors a[href*="//"]:after,
  .copy a[href*="//"]:after {
    content: '→';
    display: inline-block;
    font-family: "Lars Mono";
    margin-right: -0.5rem;
    margin-top: -0.2rem;
    width: 1rem;
    transform: rotate(-45deg);
  }
  */

  @media (min-width: 650px) {
    .navigation {
      transform: translateY(-100%);
      transition: 250ms ease-out opacity, 250ms ease-out transform;
    }

    .nav-active {
      transform: translateY(0);
    }

    .nav-top {
      background: transparent;
    }

    .nav-line {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      height: 2rem;
      opacity: 0;
      transition: 250ms ease-out opacity;
    }

    .nav-line:before {
      background: #000;
      content: '';
      display: block;
      height: 4px;
      top: 0;
      margin-top: 1rem;
      left: 50%;
      margin-left: -2.5rem;
      border-radius: 2px;
      width: 5rem;
      position: absolute;
      pointer-events: none;
    }

    .navigation:not(.nav-active) .nav-line {
      opacity: 0.5;
      pointer-events: auto;
    }
  }

  .nav-link {
    position: relative;
    display: inline-block;
  }

  .nav-link:before {
    content: '';
    display: block;
    top: 100%;
    margin-top: 0.25rem;
    position: absolute;
    left: 0;
    right: 0;
    height: 1px;
    background: #000;
    pointer-events: none;
    opacity: 0;
    transition: opacity 250ms ease;
  }

  .nav-link.nav-link-active:before {
    opacity: 1;
  }

  .medium-zoom--open .navigation .nav-line {
    opacity: 0;
  }

  .medium-zoom--open .navigation {
    transform: translateY(-100%);
  }

  .medium-zoom--open .navigation .pea {
    pointer-events: none;
  }

  @font-face {
    font-family: 'Lars Sans';
    src: url('/assets/Lars-Light.eot');
    src: url('/assets/Lars-Light.eot?#iefix') format('embedded-opentype'),
         url('/assets/Lars-Light.woff2') format('woff2'),
         url('/assets/Lars-Light.woff') format('woff');
  }

  @font-face {
    font-family: 'Lars Sans';
    font-style: italic;
    src: url('/assets/Lars-LightItalic.eot');
    src: url('/assets/Lars-LightItalic.eot?#iefix') format('embedded-opentype'),
         url('/assets/Lars-LightItalic.woff2') format('woff2'),
         url('/assets/Lars-LightItalic.woff') format('woff');
  }

  @font-face {
    font-family: 'Lars Mono';
    src: url('/assets/Lars-Mono.eot');
    src: url('/assets/Lars-Mono.eot?#iefix') format('embedded-opentype'),
         url('/assets/Lars-Mono.woff2') format('woff2'),
         url('/assets/Lars-Mono.woff') format('woff');
  }
`

var lilsrc = [
  'containers/*.js',
  'components/*.js',
  'views/*.js',
  'index.js'
].map(p => 'site/' + p)

var lilopts = {
  ignore: ['psa', 'psr', 't0', 'b0', 'l0', 'r0', 'h100', 'w100', 'curp']
}

var lilgr8 = lilcss(gr8css.toString(), lilsrc, lilopts)

var built = [
  recsst.toString(),
  // lilgr8,
  gr8css.toString(),
  custom,
  typography
].join(' ')

module.exports = built
