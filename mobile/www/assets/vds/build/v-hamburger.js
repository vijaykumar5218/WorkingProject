!function(e){function t(t){for(var r,a,s=t[0],c=t[1],l=t[2],f=0,p=[];f<s.length;f++)a=s[f],Object.prototype.hasOwnProperty.call(o,a)&&o[a]&&p.push(o[a][0]),o[a]=0;for(r in c)Object.prototype.hasOwnProperty.call(c,r)&&(e[r]=c[r]);for(u&&u(t);p.length;)p.shift()();return i.push.apply(i,l||[]),n()}function n(){for(var e,t=0;t<i.length;t++){for(var n=i[t],r=!0,s=1;s<n.length;s++){var c=n[s];0!==o[c]&&(r=!1)}r&&(i.splice(t--,1),e=a(a.s=n[0]))}return e}var r={},o={43:0},i=[];function a(t){if(r[t])return r[t].exports;var n=r[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,a),n.l=!0,n.exports}a.m=e,a.c=r,a.d=function(e,t,n){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(a.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)a.d(n,r,function(t){return e[t]}.bind(null,r));return n},a.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="";var s=window.webpackJsonp=window.webpackJsonp||[],c=s.push.bind(s);s.push=t,s=s.slice();for(var l=0;l<s.length;l++)t(s[l]);var u=c;i.push(["AJVb",0]),n()}({AJVb:function(e,t,n){"use strict";n.r(t),n.d(t,"VHamburger",(function(){return j}));var r,o=n("CQbg"),i=n("4qtV"),a=n("ONJ/");var s,c,l,u=Object(o.b)(r||(s=["\n  :host {\n    display: inline-block;\n  }\n\n  button {\n    background-color: transparent;\n    border: 0;\n    cursor: pointer;\n    margin: 0;\n    padding: 0px 0;\n    height: 15px;\n    width: 22px;\n  }\n\n  button:focus {\n    box-shadow: var(--v-states__focus-box-shadow-with-inset);\n    outline: none;\n  }\n\n  .box {\n    display: inline-block;\n    height: 15px;\n    position: relative;\n    width: 22px;\n  }\n\n  .inner {\n    display: block;\n    left: 0;\n    margin-top: -2px;\n    top: 50%;\n  }\n\n  @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {\n    .inner {\n      top: 60%;\n    }\n\n    button {\n      height: 18px;\n    }\n  }\n\n  .inner,\n  .inner::before,\n  .inner::after {\n    background-color: var(--v-colors__primary);\n    border-radius: 2px;\n    height: 3px;\n    position: absolute;\n    width: 22px;\n  }\n\n  .inner::before,\n  .inner::after {\n    content: '';\n    display: block;\n  }\n\n  .inner::before {\n    top: -7px;\n  }\n\n  .inner::after {\n    bottom: -7px;\n  }\n\n  button .inner {\n    transition: transform 0.075s cubic-bezier(0.55, 0.055, 0.675, 0.19);\n  }\n\n  button .inner::before {\n    transition: top 0.075s 0.12s ease, opacity 0.075s ease;\n  }\n\n  button .inner::after {\n    transition: bottom 0.075s 0.12s ease,\n      transform 0.075s cubic-bezier(0.55, 0.055, 0.675, 0.19);\n  }\n\n  button.active .inner {\n    transform: rotate(45deg);\n    transition: transform 0.075s cubic-bezier(0.215, 0.61, 0.355, 1) 0.12s;\n  }\n\n  button.active .inner::before {\n    opacity: 0;\n    top: 0;\n    transition: top 0.075s ease, opacity 0.075s 0.12s ease;\n  }\n\n  button.active .inner::after {\n    bottom: 0;\n    transform: rotate(-90deg);\n    transition: bottom 0.075s ease,\n      transform 0.075s 0.12s cubic-bezier(0.215, 0.61, 0.355, 1);\n  }\n\n  .label {\n    position: absolute !important;\n    height: 1px;\n    width: 1px;\n    overflow: hidden;\n    clip: rect(1px 1px 1px 1px);\n    clip: rect(1px, 1px, 1px, 1px);\n  }\n"],c||(c=s.slice(0)),r=Object.freeze(Object.defineProperties(s,{raw:{value:Object.freeze(c)}}))));function f(e){return(f="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function p(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function d(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function h(e,t){return(h=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function y(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=v(e);if(t){var o=v(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return b(this,n)}}function b(e,t){if(t&&("object"===f(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return m(e)}function m(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function v(e){return(v=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function w(e){var t,n=E(e.key);"method"===e.kind?t={value:e.value,writable:!0,configurable:!0,enumerable:!1}:"get"===e.kind?t={get:e.value,configurable:!0,enumerable:!1}:"set"===e.kind?t={set:e.value,configurable:!0,enumerable:!1}:"field"===e.kind&&(t={configurable:!0,writable:!0,enumerable:!0});var r={kind:"field"===e.kind?"field":"method",key:n,placement:e.static?"static":"field"===e.kind?"own":"prototype",descriptor:t};return e.decorators&&(r.decorators=e.decorators),"field"===e.kind&&(r.initializer=e.value),r}function g(e,t){void 0!==e.descriptor.get?t.descriptor.get=e.descriptor.get:t.descriptor.set=e.descriptor.set}function S(e){return e.decorators&&e.decorators.length}function k(e){return void 0!==e&&!(void 0===e.value&&void 0===e.writable)}function O(e,t){var n=e[t];if(void 0!==n&&"function"!=typeof n)throw new TypeError("Expected '"+t+"' to be a function");return n}function E(e){var t=function(e,t){if("object"!==f(e)||null===e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var r=n.call(e,t||"default");if("object"!==f(r))return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"===f(t)?t:String(t)}function x(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}var j=function(e,t,n,r){var o=function(){(function(){return e});var e={elementsDefinitionOrder:[["method"],["field"]],initializeInstanceElements:function(e,t){["method","field"].forEach((function(n){t.forEach((function(t){t.kind===n&&"own"===t.placement&&this.defineClassElement(e,t)}),this)}),this)},initializeClassElements:function(e,t){var n=e.prototype;["method","field"].forEach((function(r){t.forEach((function(t){var o=t.placement;if(t.kind===r&&("static"===o||"prototype"===o)){var i="static"===o?e:n;this.defineClassElement(i,t)}}),this)}),this)},defineClassElement:function(e,t){var n=t.descriptor;if("field"===t.kind){var r=t.initializer;n={enumerable:n.enumerable,writable:n.writable,configurable:n.configurable,value:void 0===r?void 0:r.call(e)}}Object.defineProperty(e,t.key,n)},decorateClass:function(e,t){var n=[],r=[],o={static:[],prototype:[],own:[]};if(e.forEach((function(e){this.addElementPlacement(e,o)}),this),e.forEach((function(e){if(!S(e))return n.push(e);var t=this.decorateElement(e,o);n.push(t.element),n.push.apply(n,t.extras),r.push.apply(r,t.finishers)}),this),!t)return{elements:n,finishers:r};var i=this.decorateConstructor(n,t);return r.push.apply(r,i.finishers),i.finishers=r,i},addElementPlacement:function(e,t,n){var r=t[e.placement];if(!n&&-1!==r.indexOf(e.key))throw new TypeError("Duplicated element ("+e.key+")");r.push(e.key)},decorateElement:function(e,t){for(var n=[],r=[],o=e.decorators,i=o.length-1;i>=0;i--){var a=t[e.placement];a.splice(a.indexOf(e.key),1);var s=this.fromElementDescriptor(e),c=this.toElementFinisherExtras((0,o[i])(s)||s);e=c.element,this.addElementPlacement(e,t),c.finisher&&r.push(c.finisher);var l=c.extras;if(l){for(var u=0;u<l.length;u++)this.addElementPlacement(l[u],t);n.push.apply(n,l)}}return{element:e,finishers:r,extras:n}},decorateConstructor:function(e,t){for(var n=[],r=t.length-1;r>=0;r--){var o=this.fromClassDescriptor(e),i=this.toClassDescriptor((0,t[r])(o)||o);if(void 0!==i.finisher&&n.push(i.finisher),void 0!==i.elements){e=i.elements;for(var a=0;a<e.length-1;a++)for(var s=a+1;s<e.length;s++)if(e[a].key===e[s].key&&e[a].placement===e[s].placement)throw new TypeError("Duplicated element ("+e[a].key+")")}}return{elements:e,finishers:n}},fromElementDescriptor:function(e){var t={kind:e.kind,key:e.key,placement:e.placement,descriptor:e.descriptor};return Object.defineProperty(t,Symbol.toStringTag,{value:"Descriptor",configurable:!0}),"field"===e.kind&&(t.initializer=e.initializer),t},toElementDescriptors:function(e){var t;if(void 0!==e)return(t=e,function(e){if(Array.isArray(e))return e}(t)||function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(t)||function(e,t){if(e){if("string"==typeof e)return x(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?x(e,t):void 0}}(t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()).map((function(e){var t=this.toElementDescriptor(e);return this.disallowProperty(e,"finisher","An element descriptor"),this.disallowProperty(e,"extras","An element descriptor"),t}),this)},toElementDescriptor:function(e){var t=String(e.kind);if("method"!==t&&"field"!==t)throw new TypeError('An element descriptor\'s .kind property must be either "method" or "field", but a decorator created an element descriptor with .kind "'+t+'"');var n=E(e.key),r=String(e.placement);if("static"!==r&&"prototype"!==r&&"own"!==r)throw new TypeError('An element descriptor\'s .placement property must be one of "static", "prototype" or "own", but a decorator created an element descriptor with .placement "'+r+'"');var o=e.descriptor;this.disallowProperty(e,"elements","An element descriptor");var i={kind:t,key:n,placement:r,descriptor:Object.assign({},o)};return"field"!==t?this.disallowProperty(e,"initializer","A method descriptor"):(this.disallowProperty(o,"get","The property descriptor of a field descriptor"),this.disallowProperty(o,"set","The property descriptor of a field descriptor"),this.disallowProperty(o,"value","The property descriptor of a field descriptor"),i.initializer=e.initializer),i},toElementFinisherExtras:function(e){return{element:this.toElementDescriptor(e),finisher:O(e,"finisher"),extras:this.toElementDescriptors(e.extras)}},fromClassDescriptor:function(e){var t={kind:"class",elements:e.map(this.fromElementDescriptor,this)};return Object.defineProperty(t,Symbol.toStringTag,{value:"Descriptor",configurable:!0}),t},toClassDescriptor:function(e){var t=String(e.kind);if("class"!==t)throw new TypeError('A class descriptor\'s .kind property must be "class", but a decorator created a class descriptor with .kind "'+t+'"');this.disallowProperty(e,"key","A class descriptor"),this.disallowProperty(e,"placement","A class descriptor"),this.disallowProperty(e,"descriptor","A class descriptor"),this.disallowProperty(e,"initializer","A class descriptor"),this.disallowProperty(e,"extras","A class descriptor");var n=O(e,"finisher");return{elements:this.toElementDescriptors(e.elements),finisher:n}},runClassFinishers:function(e,t){for(var n=0;n<t.length;n++){var r=(0,t[n])(e);if(void 0!==r){if("function"!=typeof r)throw new TypeError("Finishers must return a constructor.");e=r}}return e},disallowProperty:function(e,t,n){if(void 0!==e[t])throw new TypeError(n+" can't have a ."+t+" property.")}};return e}();if(r)for(var i=0;i<r.length;i++)o=r[i](o);var a=t((function(e){o.initializeInstanceElements(e,s.elements)}),n),s=o.decorateClass(function(e){for(var t=[],n=function(e){return"method"===e.kind&&e.key===i.key&&e.placement===i.placement},r=0;r<e.length;r++){var o,i=e[r];if("method"===i.kind&&(o=t.find(n)))if(k(i.descriptor)||k(o.descriptor)){if(S(i)||S(o))throw new ReferenceError("Duplicated methods ("+i.key+") can't be decorated.");o.descriptor=i.descriptor}else{if(S(i)){if(S(o))throw new ReferenceError("Decorators can't be placed on different accessors with for the same property ("+i.key+").");o.decorators=i.decorators}g(i,o)}else t.push(i)}return t}(a.d.map(w)),e);return o.initializeClassElements(a.F,s.elements),o.runClassFinishers(a.F,s.finishers)}([Object(o.c)("v-hamburger")],(function(e,t){return{F:function(t){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&h(e,t)}(a,t);var n,r,o,i=y(a);function a(){var t;d(this,a);for(var n=arguments.length,r=new Array(n),o=0;o<n;o++)r[o]=arguments[o];return t=i.call.apply(i,[this].concat(r)),e(m(t)),t}return n=a,r&&p(n.prototype,r),o&&p(n,o),Object.defineProperty(n,"prototype",{writable:!1}),n}(t),d:[{kind:"field",decorators:[Object(o.f)({type:Boolean,reflect:!0})],key:"active",value:function(){return!1}},{kind:"get",static:!0,key:"styles",value:function(){return[a.a,u]}},{kind:"method",key:"updated",value:function(e){e.has("active")&&this._dispatchChangeEvent()}},{kind:"method",key:"render",value:function(){return Object(o.d)(l||(l=function(e,t){return t||(t=e.slice(0)),Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(t)}}))}(["\n      <button\n        @click=","\n        class=",'\n        type="button"\n        aria-label=','\n      >\n        <span class="box">\n          <span class="inner"></span>\n        </span>\n        <span class="label">Hamburger Menu</span>\n      </button>\n    '])),this._handleClick,Object(i.a)({active:this.active}),this.active?"Close":"Menu")}},{kind:"method",key:"_dispatchChangeEvent",value:function(){return this.dispatchEvent(new CustomEvent("vhamburger-change",{bubbles:!0,composed:!0,detail:{active:this.active}}))}},{kind:"method",key:"_handleClick",value:function(){this.active=!this.active}}]}}),o.a)},AaG5:function(e,t,n){"use strict";n.d(t,"e",(function(){return c}));var r=n("0Fh4"),o=n("GMCd"),i=n("eByC");n.d(t,"d",(function(){return i.a}));n("tFPJ"),n("1VLE");var a=n("XI78");n.d(t,"a",(function(){return a.b})),n.d(t,"b",(function(){return a.e})),n.d(t,"c",(function(){return a.g}));var s=n("wmha");n.d(t,"f",(function(){return s.b}));n("PqmH"),n("6unr"),n("4yuk");
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
"undefined"!=typeof window&&(window.litHtmlVersions||(window.litHtmlVersions=[])).push("1.4.1");var c=function(e){for(var t=arguments.length,n=new Array(t>1?t-1:0),i=1;i<t;i++)n[i-1]=arguments[i];return new o.b(e,n,"html",r.a)}},CQbg:function(e,t,n){"use strict";n.d(t,"a",(function(){return v}));var r=n("qcns"),o=n("sivJ"),i=n("1JlL");n.d(t,"c",(function(){return i.a})),n.d(t,"e",(function(){return i.b})),n.d(t,"f",(function(){return i.c}));var a=n("AaG5");n.d(t,"d",(function(){return a.e}));var s=n("a7t/");function c(e){return(c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function l(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function u(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function f(){return(f="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function(e,t,n){var r=p(e,t);if(r){var o=Object.getOwnPropertyDescriptor(r,t);return o.get?o.get.call(arguments.length<3?e:n):o.value}}).apply(this,arguments)}function p(e,t){for(;!Object.prototype.hasOwnProperty.call(e,t)&&null!==(e=b(e)););return e}function d(e,t){return(d=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function h(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=b(e);if(t){var o=b(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return y(this,n)}}function y(e,t){if(t&&("object"===c(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e)}function b(e){return(b=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}
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
 */n.d(t,"b",(function(){return s.a})),n.d(t,"g",(function(){return s.c})),(window.litElementVersions||(window.litElementVersions=[])).push("2.4.0");var m={},v=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&d(e,t)}(i,e);var t,n,r,o=h(i);function i(){return l(this,i),o.apply(this,arguments)}return t=i,r=[{key:"getStyles",value:function(){return this.styles}},{key:"_getUniqueStyles",value:function(){if(!this.hasOwnProperty(JSCompiler_renameProperty("_styles",this))){var e=this.getStyles();if(Array.isArray(e)){var t=function e(t,n){return t.reduceRight((function(t,n){return Array.isArray(n)?e(n,t):(t.add(n),t)}),n)}(e,new Set),n=[];t.forEach((function(e){return n.unshift(e)})),this._styles=n}else this._styles=void 0===e?[]:[e];this._styles=this._styles.map((function(e){if(e instanceof CSSStyleSheet&&!s.b){var t=Array.prototype.slice.call(e.cssRules).reduce((function(e,t){return e+t.cssText}),"");return Object(s.c)(t)}return e}))}}}],(n=[{key:"initialize",value:function(){f(b(i.prototype),"initialize",this).call(this),this.constructor._getUniqueStyles(),this.renderRoot=this.createRenderRoot(),window.ShadowRoot&&this.renderRoot instanceof window.ShadowRoot&&this.adoptStyles()}},{key:"createRenderRoot",value:function(){return this.attachShadow({mode:"open"})}},{key:"adoptStyles",value:function(){var e=this.constructor._styles;0!==e.length&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow?s.b?this.renderRoot.adoptedStyleSheets=e.map((function(e){return e instanceof CSSStyleSheet?e:e.styleSheet})):this._needsShimAdoptedStyleSheets=!0:window.ShadyCSS.ScopingShim.prepareAdoptedCssText(e.map((function(e){return e.cssText})),this.localName))}},{key:"connectedCallback",value:function(){f(b(i.prototype),"connectedCallback",this).call(this),this.hasUpdated&&void 0!==window.ShadyCSS&&window.ShadyCSS.styleElement(this)}},{key:"update",value:function(e){var t=this,n=this.render();f(b(i.prototype),"update",this).call(this,e),n!==m&&this.constructor.render(n,this.renderRoot,{scopeName:this.localName,eventContext:this}),this._needsShimAdoptedStyleSheets&&(this._needsShimAdoptedStyleSheets=!1,this.constructor._styles.forEach((function(e){var n=document.createElement("style");n.textContent=e.cssText,t.renderRoot.appendChild(n)})))}},{key:"render",value:function(){return m}}])&&u(t.prototype,n),r&&u(t,r),Object.defineProperty(t,"prototype",{writable:!1}),i}(o.a);v.finalized=!0,v.render=r.a},"ONJ/":function(e,t,n){"use strict";var r,o,i,a=n("CQbg");t.a=Object(a.b)(r||(o=["\n  /* Universal Box Model Fix */\n  *,\n  *:before,\n  *:after {\n    box-sizing: border-box;\n  }\n\n  h1,\n  h2,\n  h3,\n  p {\n    margin: 0;\n  }\n\n  /* Common component styles */\n  :host {\n    display: block;\n  }\n"],i||(i=o.slice(0)),r=Object.freeze(Object.defineProperties(o,{raw:{value:Object.freeze(i)}}))))}});