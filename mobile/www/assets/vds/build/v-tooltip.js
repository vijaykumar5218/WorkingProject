!function(e){function t(t){for(var r,a,s=t[0],c=t[1],l=t[2],d=0,f=[];d<s.length;d++)a=s[d],Object.prototype.hasOwnProperty.call(o,a)&&o[a]&&f.push(o[a][0]),o[a]=0;for(r in c)Object.prototype.hasOwnProperty.call(c,r)&&(e[r]=c[r]);for(u&&u(t);f.length;)f.shift()();return i.push.apply(i,l||[]),n()}function n(){for(var e,t=0;t<i.length;t++){for(var n=i[t],r=!0,s=1;s<n.length;s++){var c=n[s];0!==o[c]&&(r=!1)}r&&(i.splice(t--,1),e=a(a.s=n[0]))}return e}var r={},o={93:0},i=[];function a(t){if(r[t])return r[t].exports;var n=r[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,a),n.l=!0,n.exports}a.m=e,a.c=r,a.d=function(e,t,n){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(a.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)a.d(n,r,function(t){return e[t]}.bind(null,r));return n},a.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="";var s=window.webpackJsonp=window.webpackJsonp||[],c=s.push.bind(s);s.push=t,s=s.slice();for(var l=0;l<s.length;l++)t(s[l]);var u=c;i.push(["xPRE",0]),n()}({"4XHx":function(e,t,n){"use strict";function r(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null==n)return;var r,o,i=[],a=!0,s=!1;try{for(n=n.call(e);!(a=(r=n.next()).done)&&(i.push(r.value),!t||i.length!==t);a=!0);}catch(e){s=!0,o=e}finally{try{a||null==n.return||n.return()}finally{if(s)throw o}}return i}(e,t)||function(e,t){if(!e)return;if("string"==typeof e)return o(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return o(e,t)}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function o(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){s(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}n.d(t,"a",(function(){return c})),n.d(t,"b",(function(){return l})),n.d(t,"d",(function(){return u})),n.d(t,"e",(function(){return d})),n.d(t,"c",(function(){return f})),n.d(t,"f",(function(){return p}));var c="default",l=function(e){return Array.prototype.filter.call(e.assignedNodes(),(function(e){return e.nodeType===Node.ELEMENT_NODE}))},u=function(e){var t=e.shadowRoot.querySelector("slot");return l(t)},d=function(e){var t=function(e){var t=e.shadowRoot.querySelectorAll("slot");return Array.prototype.reduce.call(t,(function(e,t){var n=t.name?t.name:t.getAttribute("name")?t.getAttribute("name"):c;return e=a(a({},e),{},s({},n,t))}),{})}(e);return Object.entries(t).reduce((function(e,t){var n=r(t,2),o=n[0],i=n[1];return e=a(a({},e),{},s({},o,l(i)))}),{})},f=function(e,t){return Array.prototype.slice.call(e,t)[0]},p=function(e){return e.map((function(e){return e.parentNode.removeChild(e)}))}},AaG5:function(e,t,n){"use strict";n.d(t,"e",(function(){return c}));var r=n("0Fh4"),o=n("GMCd"),i=n("eByC");n.d(t,"d",(function(){return i.a}));n("tFPJ"),n("1VLE");var a=n("XI78");n.d(t,"a",(function(){return a.b})),n.d(t,"b",(function(){return a.e})),n.d(t,"c",(function(){return a.g}));var s=n("wmha");n.d(t,"f",(function(){return s.b}));n("PqmH"),n("6unr"),n("4yuk");
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
"undefined"!=typeof window&&(window.litHtmlVersions||(window.litHtmlVersions=[])).push("1.4.1");var c=function(e){for(var t=arguments.length,n=new Array(t>1?t-1:0),i=1;i<t;i++)n[i-1]=arguments[i];return new o.b(e,n,"html",r.a)}},CQbg:function(e,t,n){"use strict";n.d(t,"a",(function(){return m}));var r=n("qcns"),o=n("sivJ"),i=n("1JlL");n.d(t,"c",(function(){return i.a})),n.d(t,"e",(function(){return i.b})),n.d(t,"f",(function(){return i.c}));var a=n("AaG5");n.d(t,"d",(function(){return a.e}));var s=n("a7t/");function c(e){return(c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function l(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function u(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function d(){return(d="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function(e,t,n){var r=f(e,t);if(r){var o=Object.getOwnPropertyDescriptor(r,t);return o.get?o.get.call(arguments.length<3?e:n):o.value}}).apply(this,arguments)}function f(e,t){for(;!Object.prototype.hasOwnProperty.call(e,t)&&null!==(e=b(e)););return e}function p(e,t){return(p=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function h(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=b(e);if(t){var o=b(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return y(this,n)}}function y(e,t){if(t&&("object"===c(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e)}function b(e){return(b=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */n.d(t,"b",(function(){return s.a})),n.d(t,"g",(function(){return s.c})),(window.litElementVersions||(window.litElementVersions=[])).push("2.4.0");var v={},m=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&p(e,t)}(i,e);var t,n,r,o=h(i);function i(){return l(this,i),o.apply(this,arguments)}return t=i,r=[{key:"getStyles",value:function(){return this.styles}},{key:"_getUniqueStyles",value:function(){if(!this.hasOwnProperty(JSCompiler_renameProperty("_styles",this))){var e=this.getStyles();if(Array.isArray(e)){var t=function e(t,n){return t.reduceRight((function(t,n){return Array.isArray(n)?e(n,t):(t.add(n),t)}),n)}(e,new Set),n=[];t.forEach((function(e){return n.unshift(e)})),this._styles=n}else this._styles=void 0===e?[]:[e];this._styles=this._styles.map((function(e){if(e instanceof CSSStyleSheet&&!s.b){var t=Array.prototype.slice.call(e.cssRules).reduce((function(e,t){return e+t.cssText}),"");return Object(s.c)(t)}return e}))}}}],(n=[{key:"initialize",value:function(){d(b(i.prototype),"initialize",this).call(this),this.constructor._getUniqueStyles(),this.renderRoot=this.createRenderRoot(),window.ShadowRoot&&this.renderRoot instanceof window.ShadowRoot&&this.adoptStyles()}},{key:"createRenderRoot",value:function(){return this.attachShadow({mode:"open"})}},{key:"adoptStyles",value:function(){var e=this.constructor._styles;0!==e.length&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow?s.b?this.renderRoot.adoptedStyleSheets=e.map((function(e){return e instanceof CSSStyleSheet?e:e.styleSheet})):this._needsShimAdoptedStyleSheets=!0:window.ShadyCSS.ScopingShim.prepareAdoptedCssText(e.map((function(e){return e.cssText})),this.localName))}},{key:"connectedCallback",value:function(){d(b(i.prototype),"connectedCallback",this).call(this),this.hasUpdated&&void 0!==window.ShadyCSS&&window.ShadyCSS.styleElement(this)}},{key:"update",value:function(e){var t=this,n=this.render();d(b(i.prototype),"update",this).call(this,e),n!==v&&this.constructor.render(n,this.renderRoot,{scopeName:this.localName,eventContext:this}),this._needsShimAdoptedStyleSheets&&(this._needsShimAdoptedStyleSheets=!1,this.constructor._styles.forEach((function(e){var n=document.createElement("style");n.textContent=e.cssText,t.renderRoot.appendChild(n)})))}},{key:"render",value:function(){return v}}])&&u(t.prototype,n),r&&u(t,r),Object.defineProperty(t,"prototype",{writable:!1}),i}(o.a);m.finalized=!0,m.render=r.a},"ONJ/":function(e,t,n){"use strict";var r,o,i,a=n("CQbg");t.a=Object(a.b)(r||(o=["\n  /* Universal Box Model Fix */\n  *,\n  *:before,\n  *:after {\n    box-sizing: border-box;\n  }\n\n  h1,\n  h2,\n  h3,\n  p {\n    margin: 0;\n  }\n\n  /* Common component styles */\n  :host {\n    display: block;\n  }\n"],i||(i=o.slice(0)),r=Object.freeze(Object.defineProperties(o,{raw:{value:Object.freeze(i)}}))))},xPRE:function(e,t,n){"use strict";n.r(t),n.d(t,"VTooltip",(function(){return M}));var r,o=n("CQbg"),i=n("4qtV"),a=n("ONJ/"),s=n("4XHx");var c,l,u,d,f,p,h,y=Object(o.b)(r||(c=["\n  :host {\n    display: inline-block;\n    height: 20px;\n    position: relative;\n  }\n\n  button {\n    background-color: transparent;\n    border: none;\n    display: inline-block;\n    height: 20px;\n    padding: 0;\n  }\n\n  .icon-only {\n    width: 22px;\n    height: 22px;\n  }\n\n  button:focus {\n    border-radius: 50%;\n    box-shadow: var(--v-states__focus-box-shadow);\n    outline: none;\n  }\n\n  button::-moz-focus-inner {\n    border: 0;\n  }\n\n  .wrapper {\n    display: inline-flex;\n    align-items: flex-start;\n    height: auto;\n  }\n\n  .wrapper:focus {\n    border-radius: 0%;\n  }\n\n  .linktext {\n    margin-left: 10px;\n    color: var(--v-colors__primary);\n    text-decoration: underline;\n    font-size: 18px;\n    border-radius: 0%;\n  }\n\n  .linktext:hover {\n    color: var(--v-selectable-hover-color);\n  }\n\n  .linktext:active {\n    color: var(--v-colors__active_color);\n  }\n\n  @media all and (min-width: 1px) and (max-width: 500px) {\n    :host {\n      display: block;\n    }\n  }\n"],l||(l=c.slice(0)),r=Object.freeze(Object.defineProperties(c,{raw:{value:Object.freeze(l)}}))));function b(e){return(b="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function v(e,t){return t||(t=e.slice(0)),Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(t)}}))}function m(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function w(e,t){return(w=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function k(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=S(e);if(t){var o=S(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return g(this,n)}}function g(e,t){if(t&&("object"===b(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return O(e)}function O(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function S(e){return(S=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function x(e){var t,n=P(e.key);"method"===e.kind?t={value:e.value,writable:!0,configurable:!0,enumerable:!1}:"get"===e.kind?t={get:e.value,configurable:!0,enumerable:!1}:"set"===e.kind?t={set:e.value,configurable:!0,enumerable:!1}:"field"===e.kind&&(t={configurable:!0,writable:!0,enumerable:!0});var r={kind:"field"===e.kind?"field":"method",key:n,placement:e.static?"static":"field"===e.kind?"own":"prototype",descriptor:t};return e.decorators&&(r.decorators=e.decorators),"field"===e.kind&&(r.initializer=e.value),r}function j(e,t){void 0!==e.descriptor.get?t.descriptor.get=e.descriptor.get:t.descriptor.set=e.descriptor.set}function E(e){return e.decorators&&e.decorators.length}function _(e){return void 0!==e&&!(void 0===e.value&&void 0===e.writable)}function C(e,t){var n=e[t];if(void 0!==n&&"function"!=typeof n)throw new TypeError("Expected '"+t+"' to be a function");return n}function P(e){var t=function(e,t){if("object"!==b(e)||null===e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var r=n.call(e,t||"default");if("object"!==b(r))return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"===b(t)?t:String(t)}function A(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}var M=function(e,t,n,r){var o=function(){(function(){return e});var e={elementsDefinitionOrder:[["method"],["field"]],initializeInstanceElements:function(e,t){["method","field"].forEach((function(n){t.forEach((function(t){t.kind===n&&"own"===t.placement&&this.defineClassElement(e,t)}),this)}),this)},initializeClassElements:function(e,t){var n=e.prototype;["method","field"].forEach((function(r){t.forEach((function(t){var o=t.placement;if(t.kind===r&&("static"===o||"prototype"===o)){var i="static"===o?e:n;this.defineClassElement(i,t)}}),this)}),this)},defineClassElement:function(e,t){var n=t.descriptor;if("field"===t.kind){var r=t.initializer;n={enumerable:n.enumerable,writable:n.writable,configurable:n.configurable,value:void 0===r?void 0:r.call(e)}}Object.defineProperty(e,t.key,n)},decorateClass:function(e,t){var n=[],r=[],o={static:[],prototype:[],own:[]};if(e.forEach((function(e){this.addElementPlacement(e,o)}),this),e.forEach((function(e){if(!E(e))return n.push(e);var t=this.decorateElement(e,o);n.push(t.element),n.push.apply(n,t.extras),r.push.apply(r,t.finishers)}),this),!t)return{elements:n,finishers:r};var i=this.decorateConstructor(n,t);return r.push.apply(r,i.finishers),i.finishers=r,i},addElementPlacement:function(e,t,n){var r=t[e.placement];if(!n&&-1!==r.indexOf(e.key))throw new TypeError("Duplicated element ("+e.key+")");r.push(e.key)},decorateElement:function(e,t){for(var n=[],r=[],o=e.decorators,i=o.length-1;i>=0;i--){var a=t[e.placement];a.splice(a.indexOf(e.key),1);var s=this.fromElementDescriptor(e),c=this.toElementFinisherExtras((0,o[i])(s)||s);e=c.element,this.addElementPlacement(e,t),c.finisher&&r.push(c.finisher);var l=c.extras;if(l){for(var u=0;u<l.length;u++)this.addElementPlacement(l[u],t);n.push.apply(n,l)}}return{element:e,finishers:r,extras:n}},decorateConstructor:function(e,t){for(var n=[],r=t.length-1;r>=0;r--){var o=this.fromClassDescriptor(e),i=this.toClassDescriptor((0,t[r])(o)||o);if(void 0!==i.finisher&&n.push(i.finisher),void 0!==i.elements){e=i.elements;for(var a=0;a<e.length-1;a++)for(var s=a+1;s<e.length;s++)if(e[a].key===e[s].key&&e[a].placement===e[s].placement)throw new TypeError("Duplicated element ("+e[a].key+")")}}return{elements:e,finishers:n}},fromElementDescriptor:function(e){var t={kind:e.kind,key:e.key,placement:e.placement,descriptor:e.descriptor};return Object.defineProperty(t,Symbol.toStringTag,{value:"Descriptor",configurable:!0}),"field"===e.kind&&(t.initializer=e.initializer),t},toElementDescriptors:function(e){var t;if(void 0!==e)return(t=e,function(e){if(Array.isArray(e))return e}(t)||function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(t)||function(e,t){if(e){if("string"==typeof e)return A(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?A(e,t):void 0}}(t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()).map((function(e){var t=this.toElementDescriptor(e);return this.disallowProperty(e,"finisher","An element descriptor"),this.disallowProperty(e,"extras","An element descriptor"),t}),this)},toElementDescriptor:function(e){var t=String(e.kind);if("method"!==t&&"field"!==t)throw new TypeError('An element descriptor\'s .kind property must be either "method" or "field", but a decorator created an element descriptor with .kind "'+t+'"');var n=P(e.key),r=String(e.placement);if("static"!==r&&"prototype"!==r&&"own"!==r)throw new TypeError('An element descriptor\'s .placement property must be one of "static", "prototype" or "own", but a decorator created an element descriptor with .placement "'+r+'"');var o=e.descriptor;this.disallowProperty(e,"elements","An element descriptor");var i={kind:t,key:n,placement:r,descriptor:Object.assign({},o)};return"field"!==t?this.disallowProperty(e,"initializer","A method descriptor"):(this.disallowProperty(o,"get","The property descriptor of a field descriptor"),this.disallowProperty(o,"set","The property descriptor of a field descriptor"),this.disallowProperty(o,"value","The property descriptor of a field descriptor"),i.initializer=e.initializer),i},toElementFinisherExtras:function(e){return{element:this.toElementDescriptor(e),finisher:C(e,"finisher"),extras:this.toElementDescriptors(e.extras)}},fromClassDescriptor:function(e){var t={kind:"class",elements:e.map(this.fromElementDescriptor,this)};return Object.defineProperty(t,Symbol.toStringTag,{value:"Descriptor",configurable:!0}),t},toClassDescriptor:function(e){var t=String(e.kind);if("class"!==t)throw new TypeError('A class descriptor\'s .kind property must be "class", but a decorator created a class descriptor with .kind "'+t+'"');this.disallowProperty(e,"key","A class descriptor"),this.disallowProperty(e,"placement","A class descriptor"),this.disallowProperty(e,"descriptor","A class descriptor"),this.disallowProperty(e,"initializer","A class descriptor"),this.disallowProperty(e,"extras","A class descriptor");var n=C(e,"finisher");return{elements:this.toElementDescriptors(e.elements),finisher:n}},runClassFinishers:function(e,t){for(var n=0;n<t.length;n++){var r=(0,t[n])(e);if(void 0!==r){if("function"!=typeof r)throw new TypeError("Finishers must return a constructor.");e=r}}return e},disallowProperty:function(e,t,n){if(void 0!==e[t])throw new TypeError(n+" can't have a ."+t+" property.")}};return e}();if(r)for(var i=0;i<r.length;i++)o=r[i](o);var a=t((function(e){o.initializeInstanceElements(e,s.elements)}),n),s=o.decorateClass(function(e){for(var t=[],n=function(e){return"method"===e.kind&&e.key===i.key&&e.placement===i.placement},r=0;r<e.length;r++){var o,i=e[r];if("method"===i.kind&&(o=t.find(n)))if(_(i.descriptor)||_(o.descriptor)){if(E(i)||E(o))throw new ReferenceError("Duplicated methods ("+i.key+") can't be decorated.");o.descriptor=i.descriptor}else{if(E(i)){if(E(o))throw new ReferenceError("Decorators can't be placed on different accessors with for the same property ("+i.key+").");o.decorators=i.decorators}j(i,o)}else t.push(i)}return t}(a.d.map(x)),e);return o.initializeClassElements(a.F,s.elements),o.runClassFinishers(a.F,s.finishers)}([Object(o.c)("v-tooltip")],(function(e,t){return{F:function(t){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&w(e,t)}(a,t);var n,r,o,i=k(a);function a(){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,a),t=i.call(this),e(O(t)),window.addEventListener("outside-tooltip:click",(function(e){return t._handleClickOutside(e)})),window.addEventListener("click",(function(e){return t._handleClickOutside(e)})),window.addEventListener("keyup",(function(e){return t._handleEscapeKey(e)})),t}return n=a,r&&m(n.prototype,r),o&&m(n,o),Object.defineProperty(n,"prototype",{writable:!1}),n}(t),d:[{kind:"field",decorators:[Object(o.f)({type:Boolean})],key:"active",value:function(){return!1}},{kind:"field",decorators:[Object(o.f)({type:Boolean})],key:"hover",value:function(){return!1}},{kind:"field",decorators:[Object(o.f)({type:Boolean})],key:"isComposed",value:function(){return!1}},{kind:"field",decorators:[Object(o.f)({type:Boolean})],key:"showSpeechBubble",value:function(){return!0}},{kind:"field",decorators:[Object(o.f)({type:String})],key:"icon",value:function(){return"questioncircle"}},{kind:"field",decorators:[Object(o.f)({type:String})],key:"linkText",value:void 0},{kind:"field",decorators:[Object(o.f)({type:String})],key:"iconcolor",value:function(){return"--v-colors__primary"}},{kind:"field",decorators:[Object(o.f)({type:String})],key:"altLabel",value:function(){return""}},{kind:"field",decorators:[Object(o.f)({type:Boolean})],key:"isModal",value:function(){return!1}},{kind:"field",decorators:[Object(o.f)({type:Boolean})],key:"showModal",value:function(){return!1}},{kind:"field",decorators:[Object(o.f)({type:String})],key:"zindex",value:function(){return"auto"}},{kind:"field",decorators:[Object(o.f)({type:String})],key:"gaAction",value:function(){return""}},{kind:"field",decorators:[Object(o.f)({type:String})],key:"gaCategory",value:function(){return""}},{kind:"field",decorators:[Object(o.f)({type:String})],key:"gaLabel",value:function(){return""}},{kind:"method",key:"disconnectedCallback",value:function(){this.isComposed||this._removeClickListener(),this.isModal&&(this._removeClickListener(),this._removeEscapeListener())}},{kind:"method",key:"firstUpdated",value:function(){this.isComposed&&this.classList.add("composed"),this.isModal||(this.$speechBubble=Object(s.d)(this)[0],this._styleSpeechBubble(),this.$speechBubble.style.zIndex=this.zindex)}},{kind:"method",key:"updated",value:function(e){this.isModal||!e.has("active")&&!e.has("hover")?this.isModal&&e.has("active")&&(this.showModal=this.active,this.showModal&&this.querySelector("v-modal").openModal()):this.showSpeechBubble=this.active||this.hover,(e.has("showSpeechBubble")&&e.get("showSpeechBubble")!==this.showSpeechBubble||e.has("showModal")&&e.get("showModal")!==this.showModal)&&this._dispatchChangeEvent()}},{kind:"get",static:!0,key:"styles",value:function(){return[a.a,y]}},{kind:"method",key:"render",value:function(){return Object(o.d)(u||(u=v(["","\n    "," "])),this.linkText?Object(o.d)(d||(d=v(['\n          <button\n            class="y','"\n            @click=',"\n            @mouseenter=","\n            @mouseleave=",'\n            type="button"\n            aria-label=',"\n          >\n            <v-icon\n              name=","\n              color=",'\n              tabindex="-1"\n              aria-label=','\n              size="22px"\n            ></v-icon>\n            <p class="linktext">',"</p>\n          </button>\n        "])),Object(i.a)({active:this.active,hover:this.hover,wrapper:!0}),this._toggleActive,this._handleMouseEnter,this._handleMouseLeave,this.altLabel,this.icon,this.iconcolor,this.altLabel,this.linkText):Object(o.d)(f||(f=v(["<button\n          class=","\n          @click=","\n          @mouseenter=","\n          @mouseleave=",'\n          type="button"\n          aria-label=',"\n        >\n          <v-icon\n            color=","\n            name=",'\n            size="22px"\n          ></v-icon>\n        </button>'])),Object(i.a)({active:this.active,hover:this.hover,"icon-only":!0}),this._toggleActive,this._handleMouseEnter,this._handleMouseLeave,this.altLabel,this._iconColor(),this.icon),this.showSpeechBubble&&!this.isModal?Object(o.d)(p||(p=v([" <slot @click=","></slot> "])),this._handleClickSlot):this.isModal&&this.showModal?Object(o.d)(h||(h=v([" <slot></slot> "]))):void 0)}},{kind:"method",key:"callbackOnDisconnect",value:function(){this._removeClickListener(),this._removeEscapeListener()}},{kind:"method",key:"_dispatchChangeEvent",value:function(){var e=this.showSpeechBubble;this.isModal&&(e=this.showModal),this.dispatchEvent(new CustomEvent("vtooltip-change",{detail:{open:e},bubbles:!0,composed:!0}))}},{kind:"method",key:"_iconColor",value:function(){return this.active||this.hover?"--v-colors__secondary":"--v-colors__primary"}},{kind:"method",key:"_toggleActive",value:function(e){e.stopPropagation(),!1===this.active?(this.active=!0,this._handleMouseEnter(),this.isModal&&this.googleAnalytic(e)):(this.active=!1,this._handleMouseLeave())}},{kind:"method",key:"_handleClickOutside",value:function(e){e.target!==this&&(this.active=!1)}},{kind:"method",key:"_handleEscapeKey",value:function(e){27===e.keyCode&&(this.active=!1)}},{kind:"method",key:"_handleClickSlot",value:function(e){e.stopPropagation()}},{kind:"method",key:"_handleMouseEnter",value:function(e){this.isModal||(this.hover=!0,this.googleAnalytic(e))}},{kind:"method",key:"_handleMouseLeave",value:function(){this.isModal||(this.hover=!1)}},{kind:"method",key:"_removeClickListener",value:function(){var e=this;window.removeEventListener("click",(function(t){return e._handleClickOutside(t)})),window.removeEventListener("outside-tooltip:click",(function(t){return e._handleClickOutside(t)}))}},{kind:"method",key:"_removeEscapeListener",value:function(){var e=this;window.removeEventListener("keyup",(function(t){return e._handleEscapeKey(t)}))}},{kind:"method",key:"googleAnalytic",value:function(e){var t=[];null==e||e.composedPath().forEach((function(e){(e.nodeName&&"V-"===e.nodeName.slice(0,2)||"A"===e.nodeName)&&t.push(e)}));var n=t.map((function(e){return e.nodeName+" "})).join(""),r="";r=this.querySelector("v-speech-bubble")?this.querySelector("v-speech-bubble").innerHTML?this.querySelector("v-speech-bubble").innerHTML.replace(/(<([^>]+)>)/gi,""):"":this.querySelector("v-modal").innerHTML?this.querySelector("v-modal").innerHTML.replace(/(<([^>]+)>)/gi,""):"";var o="<hover: open><text: ".concat(r.trim().substring(0,20),">");window.dataLayer.push({event:"GAEvent",eventCategory:"V-TOOLTIP V-ICON",eventAction:"hover",eventLabel:o,eventActionCustom:this.gaAction,eventCategoryCustom:this.gaCategory,eventLabelCustom:this.gaLabel,eventValue:0,eventDetail:"<place: "+n+">",nonInteraction:!1})}},{kind:"method",key:"_styleSpeechBubble",value:function(){var e=document.createElement("style");e.innerHTML="\n    v-speech-bubble {\n      position: absolute;\n    }\n\n    v-speech-bubble[right][bottom] {\n      left: -22.5px;\n      transform: translateY(7px);\n    }\n\n    v-speech-bubble[left][bottom] {\n      transform: translateY(7px) translateX(-100%) translateX(45px);\n    }\n\n    v-speech-bubble[left][top] {\n      transform: translateY(-100%) translateY(-40px) translateX(-100%) translateX(45px);\n    }\n\n    v-speech-bubble[right][top] {\n      left: -22.5px;\n      transform: translateY(-100%) translateY(-40px);\n    }\n\n    v-speech-bubble[center][top]{      \n      transform: translateY(-135%) translateX(-45.7%);\n    }\n    \n    v-speech-bubble[center][bottom]{      \n      transform: translateY(5.1%) translateX(-46.5%);\n    }\n\n    @media all and (min-width: 1px) and (max-width: 500px) {\n      v-speech-bubble[left][top] {\n        left: 20px;\n        max-width: calc(100vw - 60px);\n        transform: translateY(-100%) translateY(-40px);\n      }\n\n      v-speech-bubble[right][top] {\n        left: 0px;\n        max-width: calc(100vw - 60px);\n        transform: translateY(-100%) translateY(-40px);\n      }\n      \n      v-speech-bubble[left][bottom] {\n        left: 154px;\n        max-width: calc(100vw - 60px);\n        transform: translateY(-100%) translateY(76px);\n      }\n\n      v-speech-bubble[right][bottom] {\n        left: 19px;\n        max-width: calc(100vw - 60px);\n        transform: translateY(-100%) translateY(76px);\n      }\n\n      v-speech-bubble[center][top]{      \n        transform: translateY(-131%) translateX(-49.2%); \n        max-width:80%;       \n      }\n      \n      v-speech-bubble[center][bottom]{      \n        transform: translateY(5.1%) translateX(-49.5%);  \n        max-width:80%;     \n      }\n    }",this.appendChild(e)}}]}}),o.a)}});