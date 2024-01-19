!function(e){function t(t){for(var n,a,c=t[0],s=t[1],l=t[2],d=0,f=[];d<c.length;d++)a=c[d],Object.prototype.hasOwnProperty.call(i,a)&&i[a]&&f.push(i[a][0]),i[a]=0;for(n in s)Object.prototype.hasOwnProperty.call(s,n)&&(e[n]=s[n]);for(u&&u(t);f.length;)f.shift()();return o.push.apply(o,l||[]),r()}function r(){for(var e,t=0;t<o.length;t++){for(var r=o[t],n=!0,c=1;c<r.length;c++){var s=r[c];0!==i[s]&&(n=!1)}n&&(o.splice(t--,1),e=a(a.s=r[0]))}return e}var n={},i={89:0},o=[];function a(t){if(n[t])return n[t].exports;var r=n[t]={i:t,l:!1,exports:{}};return e[t].call(r.exports,r,r.exports,a),r.l=!0,r.exports}a.m=e,a.c=n,a.d=function(e,t,r){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(a.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)a.d(r,n,function(t){return e[t]}.bind(null,n));return r},a.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="";var c=window.webpackJsonp=window.webpackJsonp||[],s=c.push.bind(c);c.push=t,c=c.slice();for(var l=0;l<c.length;l++)t(c[l]);var u=s;o.push(["7nF/",0]),r()}({"7nF/":function(e,t,r){"use strict";r.r(t),r.d(t,"VTextArea",(function(){return T}));var n,i=r("CQbg"),o=r("4qtV"),a=r("ONJ/");var c,s,l,u,d,f,p=Object(i.b)(n||(c=["\n  :host {\n    position: relative;\n  }\n\n  label {\n    color: var(--v-colors__black);\n    display: block;\n    font-family: var(--v-fonts__primary);\n    font-size: 18px;\n    font-weight: normal;\n    margin-bottom: 10px;\n  }\n\n  #-remainingC {\n    color: var(--v-colors__black);\n    display: block;\n    font-family: var(--v-fonts__primary);\n    font-size: 12px;\n    font-weight: normal;\n    margin-bottom: 10px;\n    text-align: right;\n  }\n\n  label:not(.disabled) span {\n    color: var(--v-states__error-color);\n  }\n\n  label.error,\n  label.error span {\n    color: var(--v-states__error-color);\n  }\n\n  textarea {\n    background-color: var(--v-colors__white);\n    border-radius: 5px;\n    border: solid 1px var(--v-input-field__border-color);\n    color: var(--v-colors__black);\n    font-family: var(--v-fonts__primary);\n    font-size: 20px;\n    height: 116px;\n    font-family: var(--v-fonts__primary);\n  }\n\n  textarea:focus {\n    outline: none;\n  }\n\n  textarea:active,\n  textarea:focus {\n    border: solid 2px var(--v-input-field__active-border-color);\n  }\n\n  textarea::-webkit-input-placeholder {\n    color: var(--v-colors__black);\n  }\n\n  textarea:-moz-placeholder {\n    color: var(--v-colors__black);\n    opacity: 1;\n  }\n\n  textarea::-moz-placeholder {\n    color: var(--v-colors__black);\n    opacity: 1;\n  }\n\n  textarea:-ms-input-placeholder {\n    color: var(--v-colors__black);\n  }\n\n  textarea:disabled {\n    border: solid 1px var(--v-states__disabled-color);\n    box-shadow: inset 0 0 0 1px transparent;\n    color: var(--v-states__disabled-color);\n    cursor: not-allowed;\n    background-color: var(--v-states__disabled-background-color);\n  }\n\n  textarea[error] {\n    border: solid 1px var(--v-states__error-color);\n    box-shadow: inset 0 0 0 1px var(--v-states__error-color),\n      1px 7px 7px -9px var(--v-input-field__active-box-shadow);\n    color: var(--v-states__error-color);\n  }\n\n  v-error-text {\n    margin-top: 10px;\n  }\n\n  @media only screen and (max-width: 470px) and (min-width: 319px) {\n    textarea,\n    #remainingC {\n      width: 290px !important;\n    }\n  }\n  @media only screen and (max-width: 800px) and (min-width: 550px) {\n    textarea,\n    #remainingC {\n      width: 350px !important;\n    }\n  }\n  @media only screen and (max-width: 1150px) and (min-width: 800px) {\n    textarea,\n    #remainingC {\n      width: 480px !important;\n    }\n  }\n"],s||(s=c.slice(0)),n=Object.freeze(Object.defineProperties(c,{raw:{value:Object.freeze(s)}}))));function h(e){return(h="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function y(e,t){return t||(t=e.slice(0)),Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(t)}}))}function v(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function m(e,t){return(m=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function b(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=A(e);if(t){var i=A(this).constructor;r=Reflect.construct(n,arguments,i)}else r=n.apply(this,arguments);return k(this,r)}}function k(e,t){if(t&&("object"===h(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return w(e)}function w(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function g(e){var t,r=j(e.key);"method"===e.kind?t={value:e.value,writable:!0,configurable:!0,enumerable:!1}:"get"===e.kind?t={get:e.value,configurable:!0,enumerable:!1}:"set"===e.kind?t={set:e.value,configurable:!0,enumerable:!1}:"field"===e.kind&&(t={configurable:!0,writable:!0,enumerable:!0});var n={kind:"field"===e.kind?"field":"method",key:r,placement:e.static?"static":"field"===e.kind?"own":"prototype",descriptor:t};return e.decorators&&(n.decorators=e.decorators),"field"===e.kind&&(n.initializer=e.value),n}function x(e,t){void 0!==e.descriptor.get?t.descriptor.get=e.descriptor.get:t.descriptor.set=e.descriptor.set}function S(e){return e.decorators&&e.decorators.length}function O(e){return void 0!==e&&!(void 0===e.value&&void 0===e.writable)}function _(e,t){var r=e[t];if(void 0!==r&&"function"!=typeof r)throw new TypeError("Expected '"+t+"' to be a function");return r}function j(e){var t=function(e,t){if("object"!==h(e)||null===e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var n=r.call(e,t||"default");if("object"!==h(n))return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"===h(t)?t:String(t)}function E(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function C(){return(C="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function(e,t,r){var n=P(e,t);if(n){var i=Object.getOwnPropertyDescriptor(n,t);return i.get?i.get.call(arguments.length<3?e:r):i.value}}).apply(this,arguments)}function P(e,t){for(;!Object.prototype.hasOwnProperty.call(e,t)&&null!==(e=A(e)););return e}function A(e){return(A=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var T=function(e,t,r,n){var i=function(){(function(){return e});var e={elementsDefinitionOrder:[["method"],["field"]],initializeInstanceElements:function(e,t){["method","field"].forEach((function(r){t.forEach((function(t){t.kind===r&&"own"===t.placement&&this.defineClassElement(e,t)}),this)}),this)},initializeClassElements:function(e,t){var r=e.prototype;["method","field"].forEach((function(n){t.forEach((function(t){var i=t.placement;if(t.kind===n&&("static"===i||"prototype"===i)){var o="static"===i?e:r;this.defineClassElement(o,t)}}),this)}),this)},defineClassElement:function(e,t){var r=t.descriptor;if("field"===t.kind){var n=t.initializer;r={enumerable:r.enumerable,writable:r.writable,configurable:r.configurable,value:void 0===n?void 0:n.call(e)}}Object.defineProperty(e,t.key,r)},decorateClass:function(e,t){var r=[],n=[],i={static:[],prototype:[],own:[]};if(e.forEach((function(e){this.addElementPlacement(e,i)}),this),e.forEach((function(e){if(!S(e))return r.push(e);var t=this.decorateElement(e,i);r.push(t.element),r.push.apply(r,t.extras),n.push.apply(n,t.finishers)}),this),!t)return{elements:r,finishers:n};var o=this.decorateConstructor(r,t);return n.push.apply(n,o.finishers),o.finishers=n,o},addElementPlacement:function(e,t,r){var n=t[e.placement];if(!r&&-1!==n.indexOf(e.key))throw new TypeError("Duplicated element ("+e.key+")");n.push(e.key)},decorateElement:function(e,t){for(var r=[],n=[],i=e.decorators,o=i.length-1;o>=0;o--){var a=t[e.placement];a.splice(a.indexOf(e.key),1);var c=this.fromElementDescriptor(e),s=this.toElementFinisherExtras((0,i[o])(c)||c);e=s.element,this.addElementPlacement(e,t),s.finisher&&n.push(s.finisher);var l=s.extras;if(l){for(var u=0;u<l.length;u++)this.addElementPlacement(l[u],t);r.push.apply(r,l)}}return{element:e,finishers:n,extras:r}},decorateConstructor:function(e,t){for(var r=[],n=t.length-1;n>=0;n--){var i=this.fromClassDescriptor(e),o=this.toClassDescriptor((0,t[n])(i)||i);if(void 0!==o.finisher&&r.push(o.finisher),void 0!==o.elements){e=o.elements;for(var a=0;a<e.length-1;a++)for(var c=a+1;c<e.length;c++)if(e[a].key===e[c].key&&e[a].placement===e[c].placement)throw new TypeError("Duplicated element ("+e[a].key+")")}}return{elements:e,finishers:r}},fromElementDescriptor:function(e){var t={kind:e.kind,key:e.key,placement:e.placement,descriptor:e.descriptor};return Object.defineProperty(t,Symbol.toStringTag,{value:"Descriptor",configurable:!0}),"field"===e.kind&&(t.initializer=e.initializer),t},toElementDescriptors:function(e){var t;if(void 0!==e)return(t=e,function(e){if(Array.isArray(e))return e}(t)||function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(t)||function(e,t){if(e){if("string"==typeof e)return E(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?E(e,t):void 0}}(t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()).map((function(e){var t=this.toElementDescriptor(e);return this.disallowProperty(e,"finisher","An element descriptor"),this.disallowProperty(e,"extras","An element descriptor"),t}),this)},toElementDescriptor:function(e){var t=String(e.kind);if("method"!==t&&"field"!==t)throw new TypeError('An element descriptor\'s .kind property must be either "method" or "field", but a decorator created an element descriptor with .kind "'+t+'"');var r=j(e.key),n=String(e.placement);if("static"!==n&&"prototype"!==n&&"own"!==n)throw new TypeError('An element descriptor\'s .placement property must be one of "static", "prototype" or "own", but a decorator created an element descriptor with .placement "'+n+'"');var i=e.descriptor;this.disallowProperty(e,"elements","An element descriptor");var o={kind:t,key:r,placement:n,descriptor:Object.assign({},i)};return"field"!==t?this.disallowProperty(e,"initializer","A method descriptor"):(this.disallowProperty(i,"get","The property descriptor of a field descriptor"),this.disallowProperty(i,"set","The property descriptor of a field descriptor"),this.disallowProperty(i,"value","The property descriptor of a field descriptor"),o.initializer=e.initializer),o},toElementFinisherExtras:function(e){return{element:this.toElementDescriptor(e),finisher:_(e,"finisher"),extras:this.toElementDescriptors(e.extras)}},fromClassDescriptor:function(e){var t={kind:"class",elements:e.map(this.fromElementDescriptor,this)};return Object.defineProperty(t,Symbol.toStringTag,{value:"Descriptor",configurable:!0}),t},toClassDescriptor:function(e){var t=String(e.kind);if("class"!==t)throw new TypeError('A class descriptor\'s .kind property must be "class", but a decorator created a class descriptor with .kind "'+t+'"');this.disallowProperty(e,"key","A class descriptor"),this.disallowProperty(e,"placement","A class descriptor"),this.disallowProperty(e,"descriptor","A class descriptor"),this.disallowProperty(e,"initializer","A class descriptor"),this.disallowProperty(e,"extras","A class descriptor");var r=_(e,"finisher");return{elements:this.toElementDescriptors(e.elements),finisher:r}},runClassFinishers:function(e,t){for(var r=0;r<t.length;r++){var n=(0,t[r])(e);if(void 0!==n){if("function"!=typeof n)throw new TypeError("Finishers must return a constructor.");e=n}}return e},disallowProperty:function(e,t,r){if(void 0!==e[t])throw new TypeError(r+" can't have a ."+t+" property.")}};return e}();if(n)for(var o=0;o<n.length;o++)i=n[o](i);var a=t((function(e){i.initializeInstanceElements(e,c.elements)}),r),c=i.decorateClass(function(e){for(var t=[],r=function(e){return"method"===e.kind&&e.key===o.key&&e.placement===o.placement},n=0;n<e.length;n++){var i,o=e[n];if("method"===o.kind&&(i=t.find(r)))if(O(o.descriptor)||O(i.descriptor)){if(S(o)||S(i))throw new ReferenceError("Duplicated methods ("+o.key+") can't be decorated.");i.descriptor=o.descriptor}else{if(S(o)){if(S(i))throw new ReferenceError("Decorators can't be placed on different accessors with for the same property ("+o.key+").");i.decorators=o.decorators}x(o,i)}else t.push(o)}return t}(a.d.map(g)),e);return i.initializeClassElements(a.F,c.elements),i.runClassFinishers(a.F,c.finishers)}([Object(i.c)("v-textarea")],(function(e,t){var r=function(t){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&m(e,t)}(a,t);var r,n,i,o=b(a);function a(){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,a),t=o.call(this),e(w(t)),t.formDataAppend=t.formDataAppend.bind(w(t)),t.impliciteSubmit=t.impliciteSubmit.bind(w(t)),t}return r=a,n&&v(r.prototype,n),i&&v(r,i),Object.defineProperty(r,"prototype",{writable:!1}),r}(t);return{F:r,d:[{kind:"field",decorators:[Object(i.f)({type:String})],key:"inputTabIndex",value:function(){return"0"}},{kind:"field",decorators:[Object(i.f)({type:Boolean,reflect:!0})],key:"error",value:function(){return!1}},{kind:"field",decorators:[Object(i.f)({type:String})],key:"errorText",value:function(){return""}},{kind:"field",decorators:[Object(i.f)({type:String})],key:"labelText",value:function(){return""}},{kind:"field",decorators:[Object(i.f)({type:Boolean,reflect:!0})],key:"valid",value:function(){return!0}},{kind:"field",decorators:[Object(i.f)({type:String})],key:"altLabel",value:function(){return""}},{kind:"field",decorators:[Object(i.f)({type:String})],key:"id",value:function(){return""}},{kind:"field",decorators:[Object(i.f)({type:String,reflect:!0})],key:"value",value:function(){return""}},{kind:"field",decorators:[Object(i.f)({type:String})],key:"autoComplete",value:function(){return""}},{kind:"field",decorators:[Object(i.f)({type:Boolean})],key:"autoFocus",value:function(){return!1}},{kind:"field",decorators:[Object(i.f)({type:Boolean})],key:"disabled",value:function(){return!1}},{kind:"field",decorators:[Object(i.f)({type:String})],key:"form",value:function(){return""}},{kind:"field",decorators:[Object(i.f)({type:Number})],key:"maxLength",value:function(){return"250"}},{kind:"field",decorators:[Object(i.f)({type:String})],key:"minLength",value:function(){return""}},{kind:"field",decorators:[Object(i.f)({type:String})],key:"name",value:function(){return""}},{kind:"field",decorators:[Object(i.f)({type:String})],key:"placeholder",value:function(){return""}},{kind:"field",decorators:[Object(i.f)({type:Boolean})],key:"readOnly",value:function(){return!1}},{kind:"field",decorators:[Object(i.f)({type:Boolean})],key:"required",value:function(){return!1}},{kind:"field",decorators:[Object(i.f)({type:String})],key:"size",value:function(){return""}},{kind:"field",decorators:[Object(i.f)({type:Boolean})],key:"disableSubmit",value:function(){return!1}},{kind:"field",decorators:[Object(i.f)({type:String})],key:"width",value:function(){return"620px"}},{kind:"field",decorators:[Object(i.f)({type:String})],key:"pattern",value:function(){return".*"}},{kind:"get",static:!0,key:"styles",value:function(){return[a.a,p]}},{kind:"method",key:"firstUpdated",value:function(){this.$input=this.hasAttribute("disable-shadow")?this.querySelector("textarea"):this.shadowRoot.querySelector("textarea"),this.$remainingC=this.hasAttribute("disable-shadow")?this.querySelector("#"+this.id+"-remainingC"):this.shadowRoot.querySelector("#"+this.id+"-remainingC")}},{kind:"field",key:"closest",value:function(){return function(e,t){return e&&(t(e)?e:this.closest(e.parentNode,t))}}},{kind:"method",key:"createRenderRoot",value:function(){return this.hasAttribute("disable-shadow")?this:C(A(r.prototype),"createRenderRoot",this).call(this)}},{kind:"method",key:"connectedCallback",value:function(){C(A(r.prototype),"connectedCallback",this).call(this);var e="";(e=this.closest(this,(function(e){return"form"===e.localName})))&&(e.addEventListener("formdata",this.formDataAppend),this.addEventListener("keypress",this.impliciteSubmit))}},{kind:"field",key:"impliciteSubmit",value:function(){var e=this;return function(t){if(13===t.keyCode)if(!1===e.disableSubmit){var r=e.closest(e,(function(e){return"form"===e.localName}));r&&r.submit()}else t.preventDefault()}}},{kind:"method",key:"formDataAppend",value:function(e){e.formData.append(this.name,this.value)}},{kind:"method",key:"disconnectedCallback",value:function(){var e="";(e=this.closest(this,(function(e){return"form"===e.localName})))&&(e.removeEventListener("formdata",this.formDataAppend),this.removeEventListener("keypress",this.impliciteSubmit)),C(A(r.prototype),"disconnectedCallback",this).call(this)}},{kind:"method",key:"render",value:function(){return Object(i.d)(l||(l=y(["\n      ","\n      <textarea\n        ?autofocus=","\n        class=","\n        ?disabled=","\n        ?error=","\n        ?readonly=","\n        ?required=","\n        @input=","\n        autocomplete=","\n        id=","\n        maxlength=","\n        minlength=","\n        name=","\n        placeholder=","\n        size=","\n        tabindex=","\n        value=",'\n        aria-label="','"\n        style="width:','"\n        pattern=','\n      ></textarea>\n      <span id="','-remainingC"\n        >Maximum '," characters</span\n      >\n      ","\n    "])),this._label(),this.autoFocus,Object(o.a)({vtextArea:!0}),this.disabled,this.error,this.readOnly,this.required,this._handleInput,this.autoComplete,this.id,this.maxLength,this.minLength,this.name,this.placeholder,this.size,this.inputTabIndex,this.value,this.altLabel,Object(i.g)(this.width),this.pattern,this.id,this.maxLength,this._errorText())}},{kind:"field",key:"checkValidity",value:function(){var e=this;return function(){return e.$input.checkValidity()}}},{kind:"field",key:"_asterisk",value:function(){var e=this;return function(){return e.required?Object(i.d)(u||(u=y([" <span>*</span> "]))):void 0}}},{kind:"field",key:"_errorText",value:function(){var e=this;return function(){return e.errorText?Object(i.d)(d||(d=y(["\n          <v-error-text\n            text=","\n            class=","\n          >\n          </v-error-text>\n        "])),e.errorText,Object(o.a)({vtextAreaErrorText:"vTextAreaErrorText"})):void 0}}},{kind:"method",key:"_handleInput",value:function(e){this.value=e.target.value,this._updateCharacterMessage(),this._updateValidity()}},{kind:"method",key:"_updateValidity",value:function(){this.valid=this.checkValidity()}},{kind:"method",key:"_updateCharacterMessage",value:function(){var e=this.value.length,t=this.maxLength-e,r="Maximum "+this.maxLength+" characters";t<this.maxLength&&(r="Maximum "+this.maxLength+" characters ("+t+" characters remaining )"),this.$remainingC.innerHTML=r}},{kind:"field",key:"_label",value:function(){var e=this;return function(){return e.labelText?Object(i.d)(f||(f=y(["\n          <label\n            class=","\n            for=","\n            >","","</label\n          >\n        "])),Object(o.a)({disabled:e.disabled,error:e.error,vtextAreaLabel:!0}),e.id,e._asterisk(),e.labelText):void 0}}},{kind:"method",key:"dispatchValidity",value:function(){this.dispatchEvent(new CustomEvent("vtextarea-checkvalidity",{detail:{valid:checkValidity()},bubbles:!0,composed:!0}))}}]}}),i.a)},AaG5:function(e,t,r){"use strict";r.d(t,"e",(function(){return s}));var n=r("0Fh4"),i=r("GMCd"),o=r("eByC");r.d(t,"d",(function(){return o.a}));r("tFPJ"),r("1VLE");var a=r("XI78");r.d(t,"a",(function(){return a.b})),r.d(t,"b",(function(){return a.e})),r.d(t,"c",(function(){return a.g}));var c=r("wmha");r.d(t,"f",(function(){return c.b}));r("PqmH"),r("6unr"),r("4yuk");
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
"undefined"!=typeof window&&(window.litHtmlVersions||(window.litHtmlVersions=[])).push("1.4.1");var s=function(e){for(var t=arguments.length,r=new Array(t>1?t-1:0),o=1;o<t;o++)r[o-1]=arguments[o];return new i.b(e,r,"html",n.a)}},CQbg:function(e,t,r){"use strict";r.d(t,"a",(function(){return b}));var n=r("qcns"),i=r("sivJ"),o=r("1JlL");r.d(t,"c",(function(){return o.a})),r.d(t,"e",(function(){return o.b})),r.d(t,"f",(function(){return o.c}));var a=r("AaG5");r.d(t,"d",(function(){return a.e}));var c=r("a7t/");function s(e){return(s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function l(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function u(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function d(){return(d="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function(e,t,r){var n=f(e,t);if(n){var i=Object.getOwnPropertyDescriptor(n,t);return i.get?i.get.call(arguments.length<3?e:r):i.value}}).apply(this,arguments)}function f(e,t){for(;!Object.prototype.hasOwnProperty.call(e,t)&&null!==(e=v(e)););return e}function p(e,t){return(p=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function h(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=v(e);if(t){var i=v(this).constructor;r=Reflect.construct(n,arguments,i)}else r=n.apply(this,arguments);return y(this,r)}}function y(e,t){if(t&&("object"===s(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e)}function v(e){return(v=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}
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
 */r.d(t,"b",(function(){return c.a})),r.d(t,"g",(function(){return c.c})),(window.litElementVersions||(window.litElementVersions=[])).push("2.4.0");var m={},b=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&p(e,t)}(o,e);var t,r,n,i=h(o);function o(){return l(this,o),i.apply(this,arguments)}return t=o,n=[{key:"getStyles",value:function(){return this.styles}},{key:"_getUniqueStyles",value:function(){if(!this.hasOwnProperty(JSCompiler_renameProperty("_styles",this))){var e=this.getStyles();if(Array.isArray(e)){var t=function e(t,r){return t.reduceRight((function(t,r){return Array.isArray(r)?e(r,t):(t.add(r),t)}),r)}(e,new Set),r=[];t.forEach((function(e){return r.unshift(e)})),this._styles=r}else this._styles=void 0===e?[]:[e];this._styles=this._styles.map((function(e){if(e instanceof CSSStyleSheet&&!c.b){var t=Array.prototype.slice.call(e.cssRules).reduce((function(e,t){return e+t.cssText}),"");return Object(c.c)(t)}return e}))}}}],(r=[{key:"initialize",value:function(){d(v(o.prototype),"initialize",this).call(this),this.constructor._getUniqueStyles(),this.renderRoot=this.createRenderRoot(),window.ShadowRoot&&this.renderRoot instanceof window.ShadowRoot&&this.adoptStyles()}},{key:"createRenderRoot",value:function(){return this.attachShadow({mode:"open"})}},{key:"adoptStyles",value:function(){var e=this.constructor._styles;0!==e.length&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow?c.b?this.renderRoot.adoptedStyleSheets=e.map((function(e){return e instanceof CSSStyleSheet?e:e.styleSheet})):this._needsShimAdoptedStyleSheets=!0:window.ShadyCSS.ScopingShim.prepareAdoptedCssText(e.map((function(e){return e.cssText})),this.localName))}},{key:"connectedCallback",value:function(){d(v(o.prototype),"connectedCallback",this).call(this),this.hasUpdated&&void 0!==window.ShadyCSS&&window.ShadyCSS.styleElement(this)}},{key:"update",value:function(e){var t=this,r=this.render();d(v(o.prototype),"update",this).call(this,e),r!==m&&this.constructor.render(r,this.renderRoot,{scopeName:this.localName,eventContext:this}),this._needsShimAdoptedStyleSheets&&(this._needsShimAdoptedStyleSheets=!1,this.constructor._styles.forEach((function(e){var r=document.createElement("style");r.textContent=e.cssText,t.renderRoot.appendChild(r)})))}},{key:"render",value:function(){return m}}])&&u(t.prototype,r),n&&u(t,n),Object.defineProperty(t,"prototype",{writable:!1}),o}(i.a);b.finalized=!0,b.render=n.a},"ONJ/":function(e,t,r){"use strict";var n,i,o,a=r("CQbg");t.a=Object(a.b)(n||(i=["\n  /* Universal Box Model Fix */\n  *,\n  *:before,\n  *:after {\n    box-sizing: border-box;\n  }\n\n  h1,\n  h2,\n  h3,\n  p {\n    margin: 0;\n  }\n\n  /* Common component styles */\n  :host {\n    display: block;\n  }\n"],o||(o=i.slice(0)),n=Object.freeze(Object.defineProperties(i,{raw:{value:Object.freeze(o)}}))))}});