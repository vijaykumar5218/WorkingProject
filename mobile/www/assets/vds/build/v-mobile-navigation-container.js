!function(e){function t(t){for(var n,a,s=t[0],c=t[1],l=t[2],d=0,f=[];d<s.length;d++)a=s[d],Object.prototype.hasOwnProperty.call(o,a)&&o[a]&&f.push(o[a][0]),o[a]=0;for(n in c)Object.prototype.hasOwnProperty.call(c,n)&&(e[n]=c[n]);for(u&&u(t);f.length;)f.shift()();return i.push.apply(i,l||[]),r()}function r(){for(var e,t=0;t<i.length;t++){for(var r=i[t],n=!0,s=1;s<r.length;s++){var c=r[s];0!==o[c]&&(n=!1)}n&&(i.splice(t--,1),e=a(a.s=r[0]))}return e}var n={},o={57:0},i=[];function a(t){if(n[t])return n[t].exports;var r=n[t]={i:t,l:!1,exports:{}};return e[t].call(r.exports,r,r.exports,a),r.l=!0,r.exports}a.m=e,a.c=n,a.d=function(e,t,r){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(a.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)a.d(r,n,function(t){return e[t]}.bind(null,n));return r},a.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="";var s=window.webpackJsonp=window.webpackJsonp||[],c=s.push.bind(s);s.push=t,s=s.slice();for(var l=0;l<s.length;l++)t(s[l]);var u=c;i.push(["vaZf",0]),r()}({"4XHx":function(e,t,r){"use strict";function n(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var r=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null==r)return;var n,o,i=[],a=!0,s=!1;try{for(r=r.call(e);!(a=(n=r.next()).done)&&(i.push(n.value),!t||i.length!==t);a=!0);}catch(e){s=!0,o=e}finally{try{a||null==r.return||r.return()}finally{if(s)throw o}}return i}(e,t)||function(e,t){if(!e)return;if("string"==typeof e)return o(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);"Object"===r&&e.constructor&&(r=e.constructor.name);if("Map"===r||"Set"===r)return Array.from(e);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return o(e,t)}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function o(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function a(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){s(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}r.d(t,"a",(function(){return c})),r.d(t,"b",(function(){return l})),r.d(t,"d",(function(){return u})),r.d(t,"e",(function(){return d})),r.d(t,"c",(function(){return f})),r.d(t,"f",(function(){return p}));var c="default",l=function(e){return Array.prototype.filter.call(e.assignedNodes(),(function(e){return e.nodeType===Node.ELEMENT_NODE}))},u=function(e){var t=e.shadowRoot.querySelector("slot");return l(t)},d=function(e){var t=function(e){var t=e.shadowRoot.querySelectorAll("slot");return Array.prototype.reduce.call(t,(function(e,t){var r=t.name?t.name:t.getAttribute("name")?t.getAttribute("name"):c;return e=a(a({},e),{},s({},r,t))}),{})}(e);return Object.entries(t).reduce((function(e,t){var r=n(t,2),o=r[0],i=r[1];return e=a(a({},e),{},s({},o,l(i)))}),{})},f=function(e,t){return Array.prototype.slice.call(e,t)[0]},p=function(e){return e.map((function(e){return e.parentNode.removeChild(e)}))}},AaG5:function(e,t,r){"use strict";r.d(t,"e",(function(){return c}));var n=r("0Fh4"),o=r("GMCd"),i=r("eByC");r.d(t,"d",(function(){return i.a}));r("tFPJ"),r("1VLE");var a=r("XI78");r.d(t,"a",(function(){return a.b})),r.d(t,"b",(function(){return a.e})),r.d(t,"c",(function(){return a.g}));var s=r("wmha");r.d(t,"f",(function(){return s.b}));r("PqmH"),r("6unr"),r("4yuk");
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
"undefined"!=typeof window&&(window.litHtmlVersions||(window.litHtmlVersions=[])).push("1.4.1");var c=function(e){for(var t=arguments.length,r=new Array(t>1?t-1:0),i=1;i<t;i++)r[i-1]=arguments[i];return new o.b(e,r,"html",n.a)}},CQbg:function(e,t,r){"use strict";r.d(t,"a",(function(){return b}));var n=r("qcns"),o=r("sivJ"),i=r("1JlL");r.d(t,"c",(function(){return i.a})),r.d(t,"e",(function(){return i.b})),r.d(t,"f",(function(){return i.c}));var a=r("AaG5");r.d(t,"d",(function(){return a.e}));var s=r("a7t/");function c(e){return(c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function l(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function u(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function d(){return(d="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function(e,t,r){var n=f(e,t);if(n){var o=Object.getOwnPropertyDescriptor(n,t);return o.get?o.get.call(arguments.length<3?e:r):o.value}}).apply(this,arguments)}function f(e,t){for(;!Object.prototype.hasOwnProperty.call(e,t)&&null!==(e=v(e)););return e}function p(e,t){return(p=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function h(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=v(e);if(t){var o=v(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return y(this,r)}}function y(e,t){if(t&&("object"===c(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e)}function v(e){return(v=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}
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
 */r.d(t,"b",(function(){return s.a})),r.d(t,"g",(function(){return s.c})),(window.litElementVersions||(window.litElementVersions=[])).push("2.4.0");var m={},b=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&p(e,t)}(i,e);var t,r,n,o=h(i);function i(){return l(this,i),o.apply(this,arguments)}return t=i,n=[{key:"getStyles",value:function(){return this.styles}},{key:"_getUniqueStyles",value:function(){if(!this.hasOwnProperty(JSCompiler_renameProperty("_styles",this))){var e=this.getStyles();if(Array.isArray(e)){var t=function e(t,r){return t.reduceRight((function(t,r){return Array.isArray(r)?e(r,t):(t.add(r),t)}),r)}(e,new Set),r=[];t.forEach((function(e){return r.unshift(e)})),this._styles=r}else this._styles=void 0===e?[]:[e];this._styles=this._styles.map((function(e){if(e instanceof CSSStyleSheet&&!s.b){var t=Array.prototype.slice.call(e.cssRules).reduce((function(e,t){return e+t.cssText}),"");return Object(s.c)(t)}return e}))}}}],(r=[{key:"initialize",value:function(){d(v(i.prototype),"initialize",this).call(this),this.constructor._getUniqueStyles(),this.renderRoot=this.createRenderRoot(),window.ShadowRoot&&this.renderRoot instanceof window.ShadowRoot&&this.adoptStyles()}},{key:"createRenderRoot",value:function(){return this.attachShadow({mode:"open"})}},{key:"adoptStyles",value:function(){var e=this.constructor._styles;0!==e.length&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow?s.b?this.renderRoot.adoptedStyleSheets=e.map((function(e){return e instanceof CSSStyleSheet?e:e.styleSheet})):this._needsShimAdoptedStyleSheets=!0:window.ShadyCSS.ScopingShim.prepareAdoptedCssText(e.map((function(e){return e.cssText})),this.localName))}},{key:"connectedCallback",value:function(){d(v(i.prototype),"connectedCallback",this).call(this),this.hasUpdated&&void 0!==window.ShadyCSS&&window.ShadyCSS.styleElement(this)}},{key:"update",value:function(e){var t=this,r=this.render();d(v(i.prototype),"update",this).call(this,e),r!==m&&this.constructor.render(r,this.renderRoot,{scopeName:this.localName,eventContext:this}),this._needsShimAdoptedStyleSheets&&(this._needsShimAdoptedStyleSheets=!1,this.constructor._styles.forEach((function(e){var r=document.createElement("style");r.textContent=e.cssText,t.renderRoot.appendChild(r)})))}},{key:"render",value:function(){return m}}])&&u(t.prototype,r),n&&u(t,n),Object.defineProperty(t,"prototype",{writable:!1}),i}(o.a);b.finalized=!0,b.render=n.a},IDME:function(e,t,r){"use strict";r.d(t,"a",(function(){return a}));var n=r("4XHx");function o(e,t,r,n,o,i,a){try{var s=e[i](a),c=s.value}catch(e){return void r(e)}s.done?t(c):Promise.resolve(c).then(n,o)}function i(e){return function(){var t=this,r=arguments;return new Promise((function(n,i){var a=e.apply(t,r);function s(e){o(a,n,i,s,c,"next",e)}function c(e){o(a,n,i,s,c,"throw",e)}s(void 0)}))}}var a=function(){var e=i(regeneratorRuntime.mark((function e(t){var r,o,a;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=[],o=t.shadowRoot.querySelectorAll("*"),e.next=4,Array.from(o).map(function(){var e=i(regeneratorRuntime.mark((function e(t){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:0===t.nodeName.toLowerCase().indexOf("v-")&&r.push(t);case 2:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}());case 4:return e.next=6,Object(n.e)(t);case 6:if(a=e.sent,!(Object.keys(a).length>0)){e.next=10;break}return e.next=10,Object.keys(a).map(function(){var e=i(regeneratorRuntime.mark((function e(t){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Array.from(a[t]).map(function(){var e=i(regeneratorRuntime.mark((function e(t){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:0===t.nodeName.toLowerCase().indexOf("v-")&&r.push(t);case 2:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}());case 2:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}());case 10:return e.next=12,Promise.all(Array.from(r).map(function(){var e=i(regeneratorRuntime.mark((function e(t){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.updateComplete;case 2:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()));case 12:return e.abrupt("return",!0);case 13:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()},"ONJ/":function(e,t,r){"use strict";var n,o,i,a=r("CQbg");t.a=Object(a.b)(n||(o=["\n  /* Universal Box Model Fix */\n  *,\n  *:before,\n  *:after {\n    box-sizing: border-box;\n  }\n\n  h1,\n  h2,\n  h3,\n  p {\n    margin: 0;\n  }\n\n  /* Common component styles */\n  :host {\n    display: block;\n  }\n"],i||(i=o.slice(0)),n=Object.freeze(Object.defineProperties(o,{raw:{value:Object.freeze(i)}}))))},vaZf:function(e,t,r){"use strict";r.r(t),r.d(t,"VMobileNavigationContainer",(function(){return L}));var n,o=r("CQbg"),i=r("ONJ/");var a,s,c,l=Object(o.b)(n||(a=["\n  @-webkit-keyframes mobile-nav-container-slide-left {\n    0% {\n      -webkit-transform: translateX(0);\n      transform: translateX(0);\n    }\n    100% {\n      -webkit-transform: translateX(100%);\n      transform: translateX(100%);\n    }\n  }\n\n  @keyframes mobile-nav-container-slide-left {\n    0% {\n      -webkit-transform: translateX(0);\n      transform: translateX(0);\n    }\n\n    100% {\n      -webkit-transform: translateX(100%);\n      transform: translateX(100%);\n    }\n  }\n\n  @-webkit-keyframes mobile-nav-container-slide-right {\n    0% {\n      -webkit-transform: translateX(0);\n      transform: translateX(0);\n    }\n\n    100% {\n      -webkit-transform: translateX(100%);\n      transform: translateX(100%);\n      height: 0px;\n      padding: 0px;\n    }\n  }\n\n  @keyframes mobile-nav-container-slide-right {\n    0% {\n      -webkit-transform: translateX(0);\n      transform: translateX(0);\n    }\n\n    100% {\n      -webkit-transform: translateX(100%);\n      transform: translateX(100%);\n      height: 0px;\n      padding: 0px;\n    }\n  }\n\n  .hide {\n    display: none;\n  }\n"],s||(s=a.slice(0)),n=Object.freeze(Object.defineProperties(a,{raw:{value:Object.freeze(s)}}))));var u,d,f=Object(o.b)(c||(c=function(e,t){return t||(t=e.slice(0)),Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(t)}}))}(["\n  ::slotted(.show) {\n    -webkit-animation: mobile-nav-container-slide-left 0.2s\n      cubic-bezier(0.25, 0.46, 0.45, 0.94) alternate-reverse both;\n    animation: mobile-nav-container-slide-left 0.2s\n      cubic-bezier(0.25, 0.46, 0.45, 0.94) alternate-reverse both;\n  }\n\n  ::slotted(.hide) {\n    -webkit-animation: mobile-nav-container-slide-right 0.2s\n      cubic-bezier(0.25, 0.46, 0.45, 0.94) both;\n    animation: mobile-nav-container-slide-right 0.2s\n      cubic-bezier(0.25, 0.46, 0.45, 0.94) both;\n  }\n\n  .topbar {\n    position: fixed;\n    z-index: 10;\n    width: 100%;\n    top: 0;\n  }\n\n  .inActive {\n    display: none;\n  }\n"]))),p=r("IDME"),h=r("4XHx");function y(e){return(y="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function v(e,t,r,n,o,i,a){try{var s=e[i](a),c=s.value}catch(e){return void r(e)}s.done?t(c):Promise.resolve(c).then(n,o)}function m(e,t){return t||(t=e.slice(0)),Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(t)}}))}function b(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function w(e,t){return(w=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function g(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=D(e);if(t){var o=D(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return S(this,r)}}function S(e,t){if(t&&("object"===y(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return k(e)}function k(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function O(e){var t,r=x(e.key);"method"===e.kind?t={value:e.value,writable:!0,configurable:!0,enumerable:!1}:"get"===e.kind?t={get:e.value,configurable:!0,enumerable:!1}:"set"===e.kind?t={set:e.value,configurable:!0,enumerable:!1}:"field"===e.kind&&(t={configurable:!0,writable:!0,enumerable:!0});var n={kind:"field"===e.kind?"field":"method",key:r,placement:e.static?"static":"field"===e.kind?"own":"prototype",descriptor:t};return e.decorators&&(n.decorators=e.decorators),"field"===e.kind&&(n.initializer=e.value),n}function E(e,t){void 0!==e.descriptor.get?t.descriptor.get=e.descriptor.get:t.descriptor.set=e.descriptor.set}function j(e){return e.decorators&&e.decorators.length}function P(e){return void 0!==e&&!(void 0===e.value&&void 0===e.writable)}function R(e,t){var r=e[t];if(void 0!==r&&"function"!=typeof r)throw new TypeError("Expected '"+t+"' to be a function");return r}function x(e){var t=function(e,t){if("object"!==y(e)||null===e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var n=r.call(e,t||"default");if("object"!==y(n))return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"===y(t)?t:String(t)}function _(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function A(){return(A="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function(e,t,r){var n=C(e,t);if(n){var o=Object.getOwnPropertyDescriptor(n,t);return o.get?o.get.call(arguments.length<3?e:r):o.value}}).apply(this,arguments)}function C(e,t){for(;!Object.prototype.hasOwnProperty.call(e,t)&&null!==(e=D(e)););return e}function D(e){return(D=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var L=function(e,t,r,n){var o=function(){(function(){return e});var e={elementsDefinitionOrder:[["method"],["field"]],initializeInstanceElements:function(e,t){["method","field"].forEach((function(r){t.forEach((function(t){t.kind===r&&"own"===t.placement&&this.defineClassElement(e,t)}),this)}),this)},initializeClassElements:function(e,t){var r=e.prototype;["method","field"].forEach((function(n){t.forEach((function(t){var o=t.placement;if(t.kind===n&&("static"===o||"prototype"===o)){var i="static"===o?e:r;this.defineClassElement(i,t)}}),this)}),this)},defineClassElement:function(e,t){var r=t.descriptor;if("field"===t.kind){var n=t.initializer;r={enumerable:r.enumerable,writable:r.writable,configurable:r.configurable,value:void 0===n?void 0:n.call(e)}}Object.defineProperty(e,t.key,r)},decorateClass:function(e,t){var r=[],n=[],o={static:[],prototype:[],own:[]};if(e.forEach((function(e){this.addElementPlacement(e,o)}),this),e.forEach((function(e){if(!j(e))return r.push(e);var t=this.decorateElement(e,o);r.push(t.element),r.push.apply(r,t.extras),n.push.apply(n,t.finishers)}),this),!t)return{elements:r,finishers:n};var i=this.decorateConstructor(r,t);return n.push.apply(n,i.finishers),i.finishers=n,i},addElementPlacement:function(e,t,r){var n=t[e.placement];if(!r&&-1!==n.indexOf(e.key))throw new TypeError("Duplicated element ("+e.key+")");n.push(e.key)},decorateElement:function(e,t){for(var r=[],n=[],o=e.decorators,i=o.length-1;i>=0;i--){var a=t[e.placement];a.splice(a.indexOf(e.key),1);var s=this.fromElementDescriptor(e),c=this.toElementFinisherExtras((0,o[i])(s)||s);e=c.element,this.addElementPlacement(e,t),c.finisher&&n.push(c.finisher);var l=c.extras;if(l){for(var u=0;u<l.length;u++)this.addElementPlacement(l[u],t);r.push.apply(r,l)}}return{element:e,finishers:n,extras:r}},decorateConstructor:function(e,t){for(var r=[],n=t.length-1;n>=0;n--){var o=this.fromClassDescriptor(e),i=this.toClassDescriptor((0,t[n])(o)||o);if(void 0!==i.finisher&&r.push(i.finisher),void 0!==i.elements){e=i.elements;for(var a=0;a<e.length-1;a++)for(var s=a+1;s<e.length;s++)if(e[a].key===e[s].key&&e[a].placement===e[s].placement)throw new TypeError("Duplicated element ("+e[a].key+")")}}return{elements:e,finishers:r}},fromElementDescriptor:function(e){var t={kind:e.kind,key:e.key,placement:e.placement,descriptor:e.descriptor};return Object.defineProperty(t,Symbol.toStringTag,{value:"Descriptor",configurable:!0}),"field"===e.kind&&(t.initializer=e.initializer),t},toElementDescriptors:function(e){var t;if(void 0!==e)return(t=e,function(e){if(Array.isArray(e))return e}(t)||function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(t)||function(e,t){if(e){if("string"==typeof e)return _(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?_(e,t):void 0}}(t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()).map((function(e){var t=this.toElementDescriptor(e);return this.disallowProperty(e,"finisher","An element descriptor"),this.disallowProperty(e,"extras","An element descriptor"),t}),this)},toElementDescriptor:function(e){var t=String(e.kind);if("method"!==t&&"field"!==t)throw new TypeError('An element descriptor\'s .kind property must be either "method" or "field", but a decorator created an element descriptor with .kind "'+t+'"');var r=x(e.key),n=String(e.placement);if("static"!==n&&"prototype"!==n&&"own"!==n)throw new TypeError('An element descriptor\'s .placement property must be one of "static", "prototype" or "own", but a decorator created an element descriptor with .placement "'+n+'"');var o=e.descriptor;this.disallowProperty(e,"elements","An element descriptor");var i={kind:t,key:r,placement:n,descriptor:Object.assign({},o)};return"field"!==t?this.disallowProperty(e,"initializer","A method descriptor"):(this.disallowProperty(o,"get","The property descriptor of a field descriptor"),this.disallowProperty(o,"set","The property descriptor of a field descriptor"),this.disallowProperty(o,"value","The property descriptor of a field descriptor"),i.initializer=e.initializer),i},toElementFinisherExtras:function(e){return{element:this.toElementDescriptor(e),finisher:R(e,"finisher"),extras:this.toElementDescriptors(e.extras)}},fromClassDescriptor:function(e){var t={kind:"class",elements:e.map(this.fromElementDescriptor,this)};return Object.defineProperty(t,Symbol.toStringTag,{value:"Descriptor",configurable:!0}),t},toClassDescriptor:function(e){var t=String(e.kind);if("class"!==t)throw new TypeError('A class descriptor\'s .kind property must be "class", but a decorator created a class descriptor with .kind "'+t+'"');this.disallowProperty(e,"key","A class descriptor"),this.disallowProperty(e,"placement","A class descriptor"),this.disallowProperty(e,"descriptor","A class descriptor"),this.disallowProperty(e,"initializer","A class descriptor"),this.disallowProperty(e,"extras","A class descriptor");var r=R(e,"finisher");return{elements:this.toElementDescriptors(e.elements),finisher:r}},runClassFinishers:function(e,t){for(var r=0;r<t.length;r++){var n=(0,t[r])(e);if(void 0!==n){if("function"!=typeof n)throw new TypeError("Finishers must return a constructor.");e=n}}return e},disallowProperty:function(e,t,r){if(void 0!==e[t])throw new TypeError(r+" can't have a ."+t+" property.")}};return e}();if(n)for(var i=0;i<n.length;i++)o=n[i](o);var a=t((function(e){o.initializeInstanceElements(e,s.elements)}),r),s=o.decorateClass(function(e){for(var t=[],r=function(e){return"method"===e.kind&&e.key===i.key&&e.placement===i.placement},n=0;n<e.length;n++){var o,i=e[n];if("method"===i.kind&&(o=t.find(r)))if(P(i.descriptor)||P(o.descriptor)){if(j(i)||j(o))throw new ReferenceError("Duplicated methods ("+i.key+") can't be decorated.");o.descriptor=i.descriptor}else{if(j(i)){if(j(o))throw new ReferenceError("Decorators can't be placed on different accessors with for the same property ("+i.key+").");o.decorators=i.decorators}E(i,o)}else t.push(i)}return t}(a.d.map(O)),e);return o.initializeClassElements(a.F,s.elements),o.runClassFinishers(a.F,s.finishers)}([Object(o.c)("v-mobile-navigation-container")],(function(e,t){var r,n,a=function(t){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&w(e,t)}(a,t);var r,n,o,i=g(a);function a(){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,a),t=i.call(this),e(k(t)),t.getCollapseView=t.getCollapseView.bind(k(t)),t}return r=a,n&&b(r.prototype,n),o&&b(r,o),Object.defineProperty(r,"prototype",{writable:!1}),r}(t);return{F:a,d:[{kind:"field",decorators:[Object(o.f)({type:String})],key:"logoSrc",value:function(){return""}},{kind:"field",decorators:[Object(o.f)({type:String})],key:"logoHref",value:function(){return""}},{kind:"field",decorators:[Object(o.f)({type:String})],key:"logoAlt",value:function(){return""}},{kind:"field",decorators:[Object(o.f)({type:Boolean})],key:"issimplenav",value:function(){return!1}},{kind:"field",decorators:[Object(o.f)({type:Boolean})],key:"disableSearch",value:function(){return!1}},{kind:"field",decorators:[Object(o.f)({type:String})],key:"zindex",value:function(){return""}},{kind:"get",static:!0,key:"styles",value:function(){return[i.a,f]}},{kind:"method",key:"firstUpdated",value:function(){var e,t=this,r=this.querySelector("v-drilldown-menu"),n=this.querySelector("v-mobile-navigation-footer");this.shadowRoot.querySelector("v-mobile-navigation-topbar").addEventListener("click",(function(e){return t._handleFooterDisplay(e)})),this.$slottedItems=Object(h.d)(this),r.classList.remove("show"),r.classList.add("hide"),n&&(n.classList.remove("show"),n.classList.add("hide")),r.querySelectorAll('[from="main"]').forEach((function(e){e.addEventListener("click",(function(e){t._handleFooterDisplay(e)}))})),r.querySelectorAll("v-drilldown-menu-button").forEach((function(e){e.addEventListener("click",(function(e){t._handleFooterDisplay(e)}))})),this.addKeyFramesForAnimation(),this._updateSlotForSearch(),this._updateForZindex();var o=null===(e=this.querySelector("v-mobile-navigation-footer"))||void 0===e?void 0:e.querySelectorAll("v-icon");o&&o[o.length-1]&&o[o.length-1].addEventListener("keydown",(function(e){return t._handleKeyDown(e)}))}},{kind:"method",key:"_updateSlotForSearch",value:function(){var e=this.querySelector("v-drilldown-menu").querySelectorAll("v-drilldown-menu-page");e&&e.length>0&&this.disableSearch?e.forEach((function(e){e.setAttribute("disableSearch",!0)})):e&&e.length>0&&!this.disableSearch&&e.forEach((function(e){e.removeAttribute("disableSearch")}))}},{kind:"method",key:"updated",value:function(e){e.has("disableSearch")&&this._updateSlotForSearch(),this._updateForZindex()}},{kind:"method",key:"_updateForZindex",value:function(){""!=this.zindex.trim()?this.shadowRoot.querySelector(".navtopbar").style.zIndex=this.zindex:this.shadowRoot.querySelector(".navtopbar").style.removeProperty("z-index")}},{kind:"method",key:"addKeyFramesForAnimation",value:function(){var e=document.createElement("style");e.innerHTML=l,this.appendChild(e)}},{kind:"method",key:"_addPositionToDrillDownMenu",value:function(){var e=this;this.$slottedItems.forEach((function(t){t&&t.classList.contains("mainMenuMobile")&&(e.issimplenav?t.style.marginTop="110px":t.style.marginTop="95px")}))}},{kind:"method",key:"getCollapseView",value:function(){var e=this,t=this.querySelector("v-drilldown-menu"),r=this.querySelector("v-mobile-navigation-footer");if(!this.disableSearch){var n=t.querySelector("v-drilldown-menu v-drilldown-menu-page").shadowRoot.querySelector("form");n&&n.addEventListener("click",(function(t){return e._handleFooterDisplay(t)}))}var o=this.querySelector("v-drilldown-menu v-drilldown-menu-page").shadowRoot.querySelector("v-search-field");if(this.disableSearch||(o.addEventListener("click",(function(t){return e._handleFooterDisplay(t)})),o.addEventListener("blur",(function(t){return e._showFooter(t)}))),t.classList.contains("hide")){if(t.classList.remove("hide"),t.classList.add("show"),this.shadowRoot.querySelector(".brandStripe")&&this.shadowRoot.querySelector(".brandStripe").classList){this.shadowRoot.querySelector(".brandStripe").classList.remove("inActive");var i=getComputedStyle(document.documentElement).getPropertyValue("--v-colors__secondary").trim();"rgba(215,84,38,1)"!==(i=i.replace(/\s/g,""))&&(this.shadowRoot.querySelector(".brandStripe").setAttribute("colorFrom","var(--v-colors__secondary)"),this.shadowRoot.querySelector(".brandStripe").setAttribute("colorTo","var(--v-colors__secondary)"))}if(this.issimplenav)this.shadowRoot.querySelector(".container").classList.add("topbar"),this._addPositionToDrillDownMenu();else{var a=this.getBoundingClientRect();a&&a.height>0&&(this.shadowRoot.querySelector(".supercontainer").style.height="calc(100vh - "+a.top+"px - 10px)",this.shadowRoot.querySelector(".supercontainer").style.overflowY="auto")}document.getElementsByTagName("BODY")[0].style.overflowY="hidden",(null!=t.querySelector("v-drilldown-menu-page[activated]")?t.querySelector("v-drilldown-menu-page[activated]").querySelectorAll("v-drilldown-menu-button,v-drilldown-menu-link"):t.querySelector("v-drilldown-menu-page").querySelectorAll("v-drilldown-menu-button,v-drilldown-menu-link")).forEach((function(e){e.setAttribute("tab_index","0")}))}else t.classList.remove("show"),t.classList.add("hide"),r&&(r.classList.remove("show"),r.classList.add("hide")),this.shadowRoot.querySelector(".brandStripe")&&this.shadowRoot.querySelector(".brandStripe").classList&&this.shadowRoot.querySelector(".brandStripe").classList.add("inActive"),this.issimplenav?this.shadowRoot.querySelector(".container").classList.remove("topbar"):this.shadowRoot.querySelector(".supercontainer").style.height="auto",document.getElementsByTagName("BODY")[0].style.overflowY=""}},{kind:"method",key:"_handleFooterDisplay",value:function(e){var t=this.querySelector("v-mobile-navigation-footer"),r=this.querySelector("v-drilldown-menu");t&&("V-DRILLDOWN-MENU-BUTTON"===e.target.tagName||"V-SEARCH-FIELD"===e.target.tagName?(t.classList.remove("show"),t.classList.add("hide")):("V-DRILLDOWN-MENU-PAGE"===e.target.tagName||"V-DRILLDOWN-MENU"===e.target.tagName||"FORM"===e.target.tagName||"V-MOBILE-NAVIGATION-TOPBAR"===e.target.tagName&&r.classList.contains("show"))&&(t.classList.remove("hide"),t.classList.add("show")))}},{kind:"method",key:"_showFooter",value:function(){var e=this.querySelector("v-mobile-navigation-footer");e&&(e.classList.remove("hide"),e.classList.add("show"))}},{kind:"method",key:"connectedCallback",value:function(){A(D(a.prototype),"connectedCallback",this).call(this),this.addEventListener("vmobilenavigationtopbar-click",this.getCollapseView),this.addEventListener("vdrilldownmenu-activatepage",this._handlefocus),this.addEventListener("vdrilldownmenu-deactivatepage",this._handlefocus)}},{kind:"method",key:"disconnectedCallback",value:function(){this.removeEventListener("vmobilenavigationtopbar-click",this.getCollapseView),this.removeEventListener("vdrilldownmenu-activatepage",this._handlefocus),this.removeEventListener("vdrilldownmenu-deactivatepage",this._handlefocus),A(D(a.prototype),"disconnectedCallback",this).call(this)}},{kind:"method",key:"render",value:function(){return Object(o.d)(u||(u=m(['\n      <div class="supercontainer">\n        <div class="container">\n          ','\n          <v-mobile-navigation-topbar\n            class="navtopbar"\n            logoHref=',"\n            logoSrc=","\n            alt=","\n          ></v-mobile-navigation-topbar>\n        </div>\n        <div><slot></slot></div>\n      </div>\n    "])),this.issimplenav?this._get_bandStripe():"",this.logoHref,this.logoSrc,this.logoAlt)}},{kind:"method",key:"_get_bandStripe",value:function(){return Object(o.d)(d||(d=m(['<v-brand-stripe class="inActive brandStripe"></v-brand-stripe>'])))}},{kind:"method",key:"_getUpdateComplete",value:(r=regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,A(D(a.prototype),"_getUpdateComplete",this).call(this);case 2:return e.next=4,Object(p.a)(this);case 4:return e.abrupt("return",e.sent);case 5:case"end":return e.stop()}}),e,this)})),n=function(){var e=this,t=arguments;return new Promise((function(n,o){var i=r.apply(e,t);function a(e){v(i,n,o,a,s,"next",e)}function s(e){v(i,n,o,a,s,"throw",e)}a(void 0)}))},function(){return n.apply(this,arguments)})},{kind:"method",key:"_handleKeyDown",value:function(e){"Tab"!==e.key||e.shiftKey||this._handlefocus(e)}},{kind:"field",key:"_handlefocus",value:function(){var e=this;return function(t){var r,n,o;null===(r=e.shadowRoot.querySelector("v-mobile-navigation-topbar").shadowRoot.querySelector("v-hamburger"))||void 0===r||null===(n=r.shadowRoot)||void 0===n||null===(o=n.querySelector("button"))||void 0===o||o.focus(),t.preventDefault()}}}]}}),o.a)}});