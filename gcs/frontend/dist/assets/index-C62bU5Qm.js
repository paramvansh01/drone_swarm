var Iv=Object.defineProperty;var Uv=(t,e,n)=>e in t?Iv(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n;var Bf=(t,e,n)=>Uv(t,typeof e!="symbol"?e+"":e,n);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function n(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=n(r);fetch(r.href,s)}})();function kv(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var vg={exports:{}},ac={},xg={exports:{}},$e={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var ro=Symbol.for("react.element"),Fv=Symbol.for("react.portal"),Ov=Symbol.for("react.fragment"),zv=Symbol.for("react.strict_mode"),Bv=Symbol.for("react.profiler"),Hv=Symbol.for("react.provider"),Gv=Symbol.for("react.context"),Vv=Symbol.for("react.forward_ref"),jv=Symbol.for("react.suspense"),Wv=Symbol.for("react.memo"),Xv=Symbol.for("react.lazy"),Hf=Symbol.iterator;function $v(t){return t===null||typeof t!="object"?null:(t=Hf&&t[Hf]||t["@@iterator"],typeof t=="function"?t:null)}var yg={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},Sg=Object.assign,Mg={};function Ks(t,e,n){this.props=t,this.context=e,this.refs=Mg,this.updater=n||yg}Ks.prototype.isReactComponent={};Ks.prototype.setState=function(t,e){if(typeof t!="object"&&typeof t!="function"&&t!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,t,e,"setState")};Ks.prototype.forceUpdate=function(t){this.updater.enqueueForceUpdate(this,t,"forceUpdate")};function Eg(){}Eg.prototype=Ks.prototype;function Mh(t,e,n){this.props=t,this.context=e,this.refs=Mg,this.updater=n||yg}var Eh=Mh.prototype=new Eg;Eh.constructor=Mh;Sg(Eh,Ks.prototype);Eh.isPureReactComponent=!0;var Gf=Array.isArray,wg=Object.prototype.hasOwnProperty,wh={current:null},Tg={key:!0,ref:!0,__self:!0,__source:!0};function Ag(t,e,n){var i,r={},s=null,a=null;if(e!=null)for(i in e.ref!==void 0&&(a=e.ref),e.key!==void 0&&(s=""+e.key),e)wg.call(e,i)&&!Tg.hasOwnProperty(i)&&(r[i]=e[i]);var o=arguments.length-2;if(o===1)r.children=n;else if(1<o){for(var l=Array(o),c=0;c<o;c++)l[c]=arguments[c+2];r.children=l}if(t&&t.defaultProps)for(i in o=t.defaultProps,o)r[i]===void 0&&(r[i]=o[i]);return{$$typeof:ro,type:t,key:s,ref:a,props:r,_owner:wh.current}}function Yv(t,e){return{$$typeof:ro,type:t.type,key:e,ref:t.ref,props:t.props,_owner:t._owner}}function Th(t){return typeof t=="object"&&t!==null&&t.$$typeof===ro}function qv(t){var e={"=":"=0",":":"=2"};return"$"+t.replace(/[=:]/g,function(n){return e[n]})}var Vf=/\/+/g;function Pc(t,e){return typeof t=="object"&&t!==null&&t.key!=null?qv(""+t.key):e.toString(36)}function ul(t,e,n,i,r){var s=typeof t;(s==="undefined"||s==="boolean")&&(t=null);var a=!1;if(t===null)a=!0;else switch(s){case"string":case"number":a=!0;break;case"object":switch(t.$$typeof){case ro:case Fv:a=!0}}if(a)return a=t,r=r(a),t=i===""?"."+Pc(a,0):i,Gf(r)?(n="",t!=null&&(n=t.replace(Vf,"$&/")+"/"),ul(r,e,n,"",function(c){return c})):r!=null&&(Th(r)&&(r=Yv(r,n+(!r.key||a&&a.key===r.key?"":(""+r.key).replace(Vf,"$&/")+"/")+t)),e.push(r)),1;if(a=0,i=i===""?".":i+":",Gf(t))for(var o=0;o<t.length;o++){s=t[o];var l=i+Pc(s,o);a+=ul(s,e,n,l,r)}else if(l=$v(t),typeof l=="function")for(t=l.call(t),o=0;!(s=t.next()).done;)s=s.value,l=i+Pc(s,o++),a+=ul(s,e,n,l,r);else if(s==="object")throw e=String(t),Error("Objects are not valid as a React child (found: "+(e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)+"). If you meant to render a collection of children, use an array instead.");return a}function _o(t,e,n){if(t==null)return t;var i=[],r=0;return ul(t,i,"","",function(s){return e.call(n,s,r++)}),i}function Kv(t){if(t._status===-1){var e=t._result;e=e(),e.then(function(n){(t._status===0||t._status===-1)&&(t._status=1,t._result=n)},function(n){(t._status===0||t._status===-1)&&(t._status=2,t._result=n)}),t._status===-1&&(t._status=0,t._result=e)}if(t._status===1)return t._result.default;throw t._result}var hn={current:null},dl={transition:null},Zv={ReactCurrentDispatcher:hn,ReactCurrentBatchConfig:dl,ReactCurrentOwner:wh};function bg(){throw Error("act(...) is not supported in production builds of React.")}$e.Children={map:_o,forEach:function(t,e,n){_o(t,function(){e.apply(this,arguments)},n)},count:function(t){var e=0;return _o(t,function(){e++}),e},toArray:function(t){return _o(t,function(e){return e})||[]},only:function(t){if(!Th(t))throw Error("React.Children.only expected to receive a single React element child.");return t}};$e.Component=Ks;$e.Fragment=Ov;$e.Profiler=Bv;$e.PureComponent=Mh;$e.StrictMode=zv;$e.Suspense=jv;$e.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Zv;$e.act=bg;$e.cloneElement=function(t,e,n){if(t==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+t+".");var i=Sg({},t.props),r=t.key,s=t.ref,a=t._owner;if(e!=null){if(e.ref!==void 0&&(s=e.ref,a=wh.current),e.key!==void 0&&(r=""+e.key),t.type&&t.type.defaultProps)var o=t.type.defaultProps;for(l in e)wg.call(e,l)&&!Tg.hasOwnProperty(l)&&(i[l]=e[l]===void 0&&o!==void 0?o[l]:e[l])}var l=arguments.length-2;if(l===1)i.children=n;else if(1<l){o=Array(l);for(var c=0;c<l;c++)o[c]=arguments[c+2];i.children=o}return{$$typeof:ro,type:t.type,key:r,ref:s,props:i,_owner:a}};$e.createContext=function(t){return t={$$typeof:Gv,_currentValue:t,_currentValue2:t,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},t.Provider={$$typeof:Hv,_context:t},t.Consumer=t};$e.createElement=Ag;$e.createFactory=function(t){var e=Ag.bind(null,t);return e.type=t,e};$e.createRef=function(){return{current:null}};$e.forwardRef=function(t){return{$$typeof:Vv,render:t}};$e.isValidElement=Th;$e.lazy=function(t){return{$$typeof:Xv,_payload:{_status:-1,_result:t},_init:Kv}};$e.memo=function(t,e){return{$$typeof:Wv,type:t,compare:e===void 0?null:e}};$e.startTransition=function(t){var e=dl.transition;dl.transition={};try{t()}finally{dl.transition=e}};$e.unstable_act=bg;$e.useCallback=function(t,e){return hn.current.useCallback(t,e)};$e.useContext=function(t){return hn.current.useContext(t)};$e.useDebugValue=function(){};$e.useDeferredValue=function(t){return hn.current.useDeferredValue(t)};$e.useEffect=function(t,e){return hn.current.useEffect(t,e)};$e.useId=function(){return hn.current.useId()};$e.useImperativeHandle=function(t,e,n){return hn.current.useImperativeHandle(t,e,n)};$e.useInsertionEffect=function(t,e){return hn.current.useInsertionEffect(t,e)};$e.useLayoutEffect=function(t,e){return hn.current.useLayoutEffect(t,e)};$e.useMemo=function(t,e){return hn.current.useMemo(t,e)};$e.useReducer=function(t,e,n){return hn.current.useReducer(t,e,n)};$e.useRef=function(t){return hn.current.useRef(t)};$e.useState=function(t){return hn.current.useState(t)};$e.useSyncExternalStore=function(t,e,n){return hn.current.useSyncExternalStore(t,e,n)};$e.useTransition=function(){return hn.current.useTransition()};$e.version="18.3.1";xg.exports=$e;var ye=xg.exports;const Jv=kv(ye);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Qv=ye,ex=Symbol.for("react.element"),tx=Symbol.for("react.fragment"),nx=Object.prototype.hasOwnProperty,ix=Qv.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,rx={key:!0,ref:!0,__self:!0,__source:!0};function Cg(t,e,n){var i,r={},s=null,a=null;n!==void 0&&(s=""+n),e.key!==void 0&&(s=""+e.key),e.ref!==void 0&&(a=e.ref);for(i in e)nx.call(e,i)&&!rx.hasOwnProperty(i)&&(r[i]=e[i]);if(t&&t.defaultProps)for(i in e=t.defaultProps,e)r[i]===void 0&&(r[i]=e[i]);return{$$typeof:ex,type:t,key:s,ref:a,props:r,_owner:ix.current}}ac.Fragment=tx;ac.jsx=Cg;ac.jsxs=Cg;vg.exports=ac;var g=vg.exports,Bu={},Rg={exports:{}},Pn={},Pg={exports:{}},Ng={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(t){function e(D,ee){var ne=D.length;D.push(ee);e:for(;0<ne;){var ce=ne-1>>>1,Te=D[ce];if(0<r(Te,ee))D[ce]=ee,D[ne]=Te,ne=ce;else break e}}function n(D){return D.length===0?null:D[0]}function i(D){if(D.length===0)return null;var ee=D[0],ne=D.pop();if(ne!==ee){D[0]=ne;e:for(var ce=0,Te=D.length,ze=Te>>>1;ce<ze;){var W=2*(ce+1)-1,se=D[W],Y=W+1,de=D[Y];if(0>r(se,ne))Y<Te&&0>r(de,se)?(D[ce]=de,D[Y]=ne,ce=Y):(D[ce]=se,D[W]=ne,ce=W);else if(Y<Te&&0>r(de,ne))D[ce]=de,D[Y]=ne,ce=Y;else break e}}return ee}function r(D,ee){var ne=D.sortIndex-ee.sortIndex;return ne!==0?ne:D.id-ee.id}if(typeof performance=="object"&&typeof performance.now=="function"){var s=performance;t.unstable_now=function(){return s.now()}}else{var a=Date,o=a.now();t.unstable_now=function(){return a.now()-o}}var l=[],c=[],u=1,d=null,f=3,p=!1,_=!1,v=!1,m=typeof setTimeout=="function"?setTimeout:null,h=typeof clearTimeout=="function"?clearTimeout:null,x=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function S(D){for(var ee=n(c);ee!==null;){if(ee.callback===null)i(c);else if(ee.startTime<=D)i(c),ee.sortIndex=ee.expirationTime,e(l,ee);else break;ee=n(c)}}function M(D){if(v=!1,S(D),!_)if(n(l)!==null)_=!0,V(P);else{var ee=n(c);ee!==null&&ie(M,ee.startTime-D)}}function P(D,ee){_=!1,v&&(v=!1,h(b),b=-1),p=!0;var ne=f;try{for(S(ee),d=n(l);d!==null&&(!(d.expirationTime>ee)||D&&!E());){var ce=d.callback;if(typeof ce=="function"){d.callback=null,f=d.priorityLevel;var Te=ce(d.expirationTime<=ee);ee=t.unstable_now(),typeof Te=="function"?d.callback=Te:d===n(l)&&i(l),S(ee)}else i(l);d=n(l)}if(d!==null)var ze=!0;else{var W=n(c);W!==null&&ie(M,W.startTime-ee),ze=!1}return ze}finally{d=null,f=ne,p=!1}}var C=!1,A=null,b=-1,z=5,y=-1;function E(){return!(t.unstable_now()-y<z)}function U(){if(A!==null){var D=t.unstable_now();y=D;var ee=!0;try{ee=A(!0,D)}finally{ee?F():(C=!1,A=null)}}else C=!1}var F;if(typeof x=="function")F=function(){x(U)};else if(typeof MessageChannel<"u"){var X=new MessageChannel,K=X.port2;X.port1.onmessage=U,F=function(){K.postMessage(null)}}else F=function(){m(U,0)};function V(D){A=D,C||(C=!0,F())}function ie(D,ee){b=m(function(){D(t.unstable_now())},ee)}t.unstable_IdlePriority=5,t.unstable_ImmediatePriority=1,t.unstable_LowPriority=4,t.unstable_NormalPriority=3,t.unstable_Profiling=null,t.unstable_UserBlockingPriority=2,t.unstable_cancelCallback=function(D){D.callback=null},t.unstable_continueExecution=function(){_||p||(_=!0,V(P))},t.unstable_forceFrameRate=function(D){0>D||125<D?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):z=0<D?Math.floor(1e3/D):5},t.unstable_getCurrentPriorityLevel=function(){return f},t.unstable_getFirstCallbackNode=function(){return n(l)},t.unstable_next=function(D){switch(f){case 1:case 2:case 3:var ee=3;break;default:ee=f}var ne=f;f=ee;try{return D()}finally{f=ne}},t.unstable_pauseExecution=function(){},t.unstable_requestPaint=function(){},t.unstable_runWithPriority=function(D,ee){switch(D){case 1:case 2:case 3:case 4:case 5:break;default:D=3}var ne=f;f=D;try{return ee()}finally{f=ne}},t.unstable_scheduleCallback=function(D,ee,ne){var ce=t.unstable_now();switch(typeof ne=="object"&&ne!==null?(ne=ne.delay,ne=typeof ne=="number"&&0<ne?ce+ne:ce):ne=ce,D){case 1:var Te=-1;break;case 2:Te=250;break;case 5:Te=1073741823;break;case 4:Te=1e4;break;default:Te=5e3}return Te=ne+Te,D={id:u++,callback:ee,priorityLevel:D,startTime:ne,expirationTime:Te,sortIndex:-1},ne>ce?(D.sortIndex=ne,e(c,D),n(l)===null&&D===n(c)&&(v?(h(b),b=-1):v=!0,ie(M,ne-ce))):(D.sortIndex=Te,e(l,D),_||p||(_=!0,V(P))),D},t.unstable_shouldYield=E,t.unstable_wrapCallback=function(D){var ee=f;return function(){var ne=f;f=ee;try{return D.apply(this,arguments)}finally{f=ne}}}})(Ng);Pg.exports=Ng;var sx=Pg.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var ax=ye,Rn=sx;function oe(t){for(var e="https://reactjs.org/docs/error-decoder.html?invariant="+t,n=1;n<arguments.length;n++)e+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+t+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var Lg=new Set,Fa={};function jr(t,e){ks(t,e),ks(t+"Capture",e)}function ks(t,e){for(Fa[t]=e,t=0;t<e.length;t++)Lg.add(e[t])}var Ri=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Hu=Object.prototype.hasOwnProperty,ox=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,jf={},Wf={};function lx(t){return Hu.call(Wf,t)?!0:Hu.call(jf,t)?!1:ox.test(t)?Wf[t]=!0:(jf[t]=!0,!1)}function cx(t,e,n,i){if(n!==null&&n.type===0)return!1;switch(typeof e){case"function":case"symbol":return!0;case"boolean":return i?!1:n!==null?!n.acceptsBooleans:(t=t.toLowerCase().slice(0,5),t!=="data-"&&t!=="aria-");default:return!1}}function ux(t,e,n,i){if(e===null||typeof e>"u"||cx(t,e,n,i))return!0;if(i)return!1;if(n!==null)switch(n.type){case 3:return!e;case 4:return e===!1;case 5:return isNaN(e);case 6:return isNaN(e)||1>e}return!1}function fn(t,e,n,i,r,s,a){this.acceptsBooleans=e===2||e===3||e===4,this.attributeName=i,this.attributeNamespace=r,this.mustUseProperty=n,this.propertyName=t,this.type=e,this.sanitizeURL=s,this.removeEmptyString=a}var qt={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(t){qt[t]=new fn(t,0,!1,t,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(t){var e=t[0];qt[e]=new fn(e,1,!1,t[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(t){qt[t]=new fn(t,2,!1,t.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(t){qt[t]=new fn(t,2,!1,t,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(t){qt[t]=new fn(t,3,!1,t.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(t){qt[t]=new fn(t,3,!0,t,null,!1,!1)});["capture","download"].forEach(function(t){qt[t]=new fn(t,4,!1,t,null,!1,!1)});["cols","rows","size","span"].forEach(function(t){qt[t]=new fn(t,6,!1,t,null,!1,!1)});["rowSpan","start"].forEach(function(t){qt[t]=new fn(t,5,!1,t.toLowerCase(),null,!1,!1)});var Ah=/[\-:]([a-z])/g;function bh(t){return t[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(t){var e=t.replace(Ah,bh);qt[e]=new fn(e,1,!1,t,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(t){var e=t.replace(Ah,bh);qt[e]=new fn(e,1,!1,t,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(t){var e=t.replace(Ah,bh);qt[e]=new fn(e,1,!1,t,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(t){qt[t]=new fn(t,1,!1,t.toLowerCase(),null,!1,!1)});qt.xlinkHref=new fn("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(t){qt[t]=new fn(t,1,!1,t.toLowerCase(),null,!0,!0)});function Ch(t,e,n,i){var r=qt.hasOwnProperty(e)?qt[e]:null;(r!==null?r.type!==0:i||!(2<e.length)||e[0]!=="o"&&e[0]!=="O"||e[1]!=="n"&&e[1]!=="N")&&(ux(e,n,r,i)&&(n=null),i||r===null?lx(e)&&(n===null?t.removeAttribute(e):t.setAttribute(e,""+n)):r.mustUseProperty?t[r.propertyName]=n===null?r.type===3?!1:"":n:(e=r.attributeName,i=r.attributeNamespace,n===null?t.removeAttribute(e):(r=r.type,n=r===3||r===4&&n===!0?"":""+n,i?t.setAttributeNS(i,e,n):t.setAttribute(e,n))))}var Ii=ax.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,vo=Symbol.for("react.element"),fs=Symbol.for("react.portal"),ps=Symbol.for("react.fragment"),Rh=Symbol.for("react.strict_mode"),Gu=Symbol.for("react.profiler"),Dg=Symbol.for("react.provider"),Ig=Symbol.for("react.context"),Ph=Symbol.for("react.forward_ref"),Vu=Symbol.for("react.suspense"),ju=Symbol.for("react.suspense_list"),Nh=Symbol.for("react.memo"),Vi=Symbol.for("react.lazy"),Ug=Symbol.for("react.offscreen"),Xf=Symbol.iterator;function ta(t){return t===null||typeof t!="object"?null:(t=Xf&&t[Xf]||t["@@iterator"],typeof t=="function"?t:null)}var wt=Object.assign,Nc;function ya(t){if(Nc===void 0)try{throw Error()}catch(n){var e=n.stack.trim().match(/\n( *(at )?)/);Nc=e&&e[1]||""}return`
`+Nc+t}var Lc=!1;function Dc(t,e){if(!t||Lc)return"";Lc=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(e)if(e=function(){throw Error()},Object.defineProperty(e.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(e,[])}catch(c){var i=c}Reflect.construct(t,[],e)}else{try{e.call()}catch(c){i=c}t.call(e.prototype)}else{try{throw Error()}catch(c){i=c}t()}}catch(c){if(c&&i&&typeof c.stack=="string"){for(var r=c.stack.split(`
`),s=i.stack.split(`
`),a=r.length-1,o=s.length-1;1<=a&&0<=o&&r[a]!==s[o];)o--;for(;1<=a&&0<=o;a--,o--)if(r[a]!==s[o]){if(a!==1||o!==1)do if(a--,o--,0>o||r[a]!==s[o]){var l=`
`+r[a].replace(" at new "," at ");return t.displayName&&l.includes("<anonymous>")&&(l=l.replace("<anonymous>",t.displayName)),l}while(1<=a&&0<=o);break}}}finally{Lc=!1,Error.prepareStackTrace=n}return(t=t?t.displayName||t.name:"")?ya(t):""}function dx(t){switch(t.tag){case 5:return ya(t.type);case 16:return ya("Lazy");case 13:return ya("Suspense");case 19:return ya("SuspenseList");case 0:case 2:case 15:return t=Dc(t.type,!1),t;case 11:return t=Dc(t.type.render,!1),t;case 1:return t=Dc(t.type,!0),t;default:return""}}function Wu(t){if(t==null)return null;if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case ps:return"Fragment";case fs:return"Portal";case Gu:return"Profiler";case Rh:return"StrictMode";case Vu:return"Suspense";case ju:return"SuspenseList"}if(typeof t=="object")switch(t.$$typeof){case Ig:return(t.displayName||"Context")+".Consumer";case Dg:return(t._context.displayName||"Context")+".Provider";case Ph:var e=t.render;return t=t.displayName,t||(t=e.displayName||e.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case Nh:return e=t.displayName||null,e!==null?e:Wu(t.type)||"Memo";case Vi:e=t._payload,t=t._init;try{return Wu(t(e))}catch{}}return null}function hx(t){var e=t.type;switch(t.tag){case 24:return"Cache";case 9:return(e.displayName||"Context")+".Consumer";case 10:return(e._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return t=e.render,t=t.displayName||t.name||"",e.displayName||(t!==""?"ForwardRef("+t+")":"ForwardRef");case 7:return"Fragment";case 5:return e;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return Wu(e);case 8:return e===Rh?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e}return null}function dr(t){switch(typeof t){case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function kg(t){var e=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(e==="checkbox"||e==="radio")}function fx(t){var e=kg(t)?"checked":"value",n=Object.getOwnPropertyDescriptor(t.constructor.prototype,e),i=""+t[e];if(!t.hasOwnProperty(e)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var r=n.get,s=n.set;return Object.defineProperty(t,e,{configurable:!0,get:function(){return r.call(this)},set:function(a){i=""+a,s.call(this,a)}}),Object.defineProperty(t,e,{enumerable:n.enumerable}),{getValue:function(){return i},setValue:function(a){i=""+a},stopTracking:function(){t._valueTracker=null,delete t[e]}}}}function xo(t){t._valueTracker||(t._valueTracker=fx(t))}function Fg(t){if(!t)return!1;var e=t._valueTracker;if(!e)return!0;var n=e.getValue(),i="";return t&&(i=kg(t)?t.checked?"true":"false":t.value),t=i,t!==n?(e.setValue(t),!0):!1}function Rl(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}function Xu(t,e){var n=e.checked;return wt({},e,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??t._wrapperState.initialChecked})}function $f(t,e){var n=e.defaultValue==null?"":e.defaultValue,i=e.checked!=null?e.checked:e.defaultChecked;n=dr(e.value!=null?e.value:n),t._wrapperState={initialChecked:i,initialValue:n,controlled:e.type==="checkbox"||e.type==="radio"?e.checked!=null:e.value!=null}}function Og(t,e){e=e.checked,e!=null&&Ch(t,"checked",e,!1)}function $u(t,e){Og(t,e);var n=dr(e.value),i=e.type;if(n!=null)i==="number"?(n===0&&t.value===""||t.value!=n)&&(t.value=""+n):t.value!==""+n&&(t.value=""+n);else if(i==="submit"||i==="reset"){t.removeAttribute("value");return}e.hasOwnProperty("value")?Yu(t,e.type,n):e.hasOwnProperty("defaultValue")&&Yu(t,e.type,dr(e.defaultValue)),e.checked==null&&e.defaultChecked!=null&&(t.defaultChecked=!!e.defaultChecked)}function Yf(t,e,n){if(e.hasOwnProperty("value")||e.hasOwnProperty("defaultValue")){var i=e.type;if(!(i!=="submit"&&i!=="reset"||e.value!==void 0&&e.value!==null))return;e=""+t._wrapperState.initialValue,n||e===t.value||(t.value=e),t.defaultValue=e}n=t.name,n!==""&&(t.name=""),t.defaultChecked=!!t._wrapperState.initialChecked,n!==""&&(t.name=n)}function Yu(t,e,n){(e!=="number"||Rl(t.ownerDocument)!==t)&&(n==null?t.defaultValue=""+t._wrapperState.initialValue:t.defaultValue!==""+n&&(t.defaultValue=""+n))}var Sa=Array.isArray;function bs(t,e,n,i){if(t=t.options,e){e={};for(var r=0;r<n.length;r++)e["$"+n[r]]=!0;for(n=0;n<t.length;n++)r=e.hasOwnProperty("$"+t[n].value),t[n].selected!==r&&(t[n].selected=r),r&&i&&(t[n].defaultSelected=!0)}else{for(n=""+dr(n),e=null,r=0;r<t.length;r++){if(t[r].value===n){t[r].selected=!0,i&&(t[r].defaultSelected=!0);return}e!==null||t[r].disabled||(e=t[r])}e!==null&&(e.selected=!0)}}function qu(t,e){if(e.dangerouslySetInnerHTML!=null)throw Error(oe(91));return wt({},e,{value:void 0,defaultValue:void 0,children:""+t._wrapperState.initialValue})}function qf(t,e){var n=e.value;if(n==null){if(n=e.children,e=e.defaultValue,n!=null){if(e!=null)throw Error(oe(92));if(Sa(n)){if(1<n.length)throw Error(oe(93));n=n[0]}e=n}e==null&&(e=""),n=e}t._wrapperState={initialValue:dr(n)}}function zg(t,e){var n=dr(e.value),i=dr(e.defaultValue);n!=null&&(n=""+n,n!==t.value&&(t.value=n),e.defaultValue==null&&t.defaultValue!==n&&(t.defaultValue=n)),i!=null&&(t.defaultValue=""+i)}function Kf(t){var e=t.textContent;e===t._wrapperState.initialValue&&e!==""&&e!==null&&(t.value=e)}function Bg(t){switch(t){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Ku(t,e){return t==null||t==="http://www.w3.org/1999/xhtml"?Bg(e):t==="http://www.w3.org/2000/svg"&&e==="foreignObject"?"http://www.w3.org/1999/xhtml":t}var yo,Hg=function(t){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(e,n,i,r){MSApp.execUnsafeLocalFunction(function(){return t(e,n,i,r)})}:t}(function(t,e){if(t.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in t)t.innerHTML=e;else{for(yo=yo||document.createElement("div"),yo.innerHTML="<svg>"+e.valueOf().toString()+"</svg>",e=yo.firstChild;t.firstChild;)t.removeChild(t.firstChild);for(;e.firstChild;)t.appendChild(e.firstChild)}});function Oa(t,e){if(e){var n=t.firstChild;if(n&&n===t.lastChild&&n.nodeType===3){n.nodeValue=e;return}}t.textContent=e}var Ta={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},px=["Webkit","ms","Moz","O"];Object.keys(Ta).forEach(function(t){px.forEach(function(e){e=e+t.charAt(0).toUpperCase()+t.substring(1),Ta[e]=Ta[t]})});function Gg(t,e,n){return e==null||typeof e=="boolean"||e===""?"":n||typeof e!="number"||e===0||Ta.hasOwnProperty(t)&&Ta[t]?(""+e).trim():e+"px"}function Vg(t,e){t=t.style;for(var n in e)if(e.hasOwnProperty(n)){var i=n.indexOf("--")===0,r=Gg(n,e[n],i);n==="float"&&(n="cssFloat"),i?t.setProperty(n,r):t[n]=r}}var mx=wt({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Zu(t,e){if(e){if(mx[t]&&(e.children!=null||e.dangerouslySetInnerHTML!=null))throw Error(oe(137,t));if(e.dangerouslySetInnerHTML!=null){if(e.children!=null)throw Error(oe(60));if(typeof e.dangerouslySetInnerHTML!="object"||!("__html"in e.dangerouslySetInnerHTML))throw Error(oe(61))}if(e.style!=null&&typeof e.style!="object")throw Error(oe(62))}}function Ju(t,e){if(t.indexOf("-")===-1)return typeof e.is=="string";switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Qu=null;function Lh(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var ed=null,Cs=null,Rs=null;function Zf(t){if(t=oo(t)){if(typeof ed!="function")throw Error(oe(280));var e=t.stateNode;e&&(e=dc(e),ed(t.stateNode,t.type,e))}}function jg(t){Cs?Rs?Rs.push(t):Rs=[t]:Cs=t}function Wg(){if(Cs){var t=Cs,e=Rs;if(Rs=Cs=null,Zf(t),e)for(t=0;t<e.length;t++)Zf(e[t])}}function Xg(t,e){return t(e)}function $g(){}var Ic=!1;function Yg(t,e,n){if(Ic)return t(e,n);Ic=!0;try{return Xg(t,e,n)}finally{Ic=!1,(Cs!==null||Rs!==null)&&($g(),Wg())}}function za(t,e){var n=t.stateNode;if(n===null)return null;var i=dc(n);if(i===null)return null;n=i[e];e:switch(e){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(i=!i.disabled)||(t=t.type,i=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!i;break e;default:t=!1}if(t)return null;if(n&&typeof n!="function")throw Error(oe(231,e,typeof n));return n}var td=!1;if(Ri)try{var na={};Object.defineProperty(na,"passive",{get:function(){td=!0}}),window.addEventListener("test",na,na),window.removeEventListener("test",na,na)}catch{td=!1}function gx(t,e,n,i,r,s,a,o,l){var c=Array.prototype.slice.call(arguments,3);try{e.apply(n,c)}catch(u){this.onError(u)}}var Aa=!1,Pl=null,Nl=!1,nd=null,_x={onError:function(t){Aa=!0,Pl=t}};function vx(t,e,n,i,r,s,a,o,l){Aa=!1,Pl=null,gx.apply(_x,arguments)}function xx(t,e,n,i,r,s,a,o,l){if(vx.apply(this,arguments),Aa){if(Aa){var c=Pl;Aa=!1,Pl=null}else throw Error(oe(198));Nl||(Nl=!0,nd=c)}}function Wr(t){var e=t,n=t;if(t.alternate)for(;e.return;)e=e.return;else{t=e;do e=t,e.flags&4098&&(n=e.return),t=e.return;while(t)}return e.tag===3?n:null}function qg(t){if(t.tag===13){var e=t.memoizedState;if(e===null&&(t=t.alternate,t!==null&&(e=t.memoizedState)),e!==null)return e.dehydrated}return null}function Jf(t){if(Wr(t)!==t)throw Error(oe(188))}function yx(t){var e=t.alternate;if(!e){if(e=Wr(t),e===null)throw Error(oe(188));return e!==t?null:t}for(var n=t,i=e;;){var r=n.return;if(r===null)break;var s=r.alternate;if(s===null){if(i=r.return,i!==null){n=i;continue}break}if(r.child===s.child){for(s=r.child;s;){if(s===n)return Jf(r),t;if(s===i)return Jf(r),e;s=s.sibling}throw Error(oe(188))}if(n.return!==i.return)n=r,i=s;else{for(var a=!1,o=r.child;o;){if(o===n){a=!0,n=r,i=s;break}if(o===i){a=!0,i=r,n=s;break}o=o.sibling}if(!a){for(o=s.child;o;){if(o===n){a=!0,n=s,i=r;break}if(o===i){a=!0,i=s,n=r;break}o=o.sibling}if(!a)throw Error(oe(189))}}if(n.alternate!==i)throw Error(oe(190))}if(n.tag!==3)throw Error(oe(188));return n.stateNode.current===n?t:e}function Kg(t){return t=yx(t),t!==null?Zg(t):null}function Zg(t){if(t.tag===5||t.tag===6)return t;for(t=t.child;t!==null;){var e=Zg(t);if(e!==null)return e;t=t.sibling}return null}var Jg=Rn.unstable_scheduleCallback,Qf=Rn.unstable_cancelCallback,Sx=Rn.unstable_shouldYield,Mx=Rn.unstable_requestPaint,Pt=Rn.unstable_now,Ex=Rn.unstable_getCurrentPriorityLevel,Dh=Rn.unstable_ImmediatePriority,Qg=Rn.unstable_UserBlockingPriority,Ll=Rn.unstable_NormalPriority,wx=Rn.unstable_LowPriority,e_=Rn.unstable_IdlePriority,oc=null,di=null;function Tx(t){if(di&&typeof di.onCommitFiberRoot=="function")try{di.onCommitFiberRoot(oc,t,void 0,(t.current.flags&128)===128)}catch{}}var ii=Math.clz32?Math.clz32:Cx,Ax=Math.log,bx=Math.LN2;function Cx(t){return t>>>=0,t===0?32:31-(Ax(t)/bx|0)|0}var So=64,Mo=4194304;function Ma(t){switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return t&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return t}}function Dl(t,e){var n=t.pendingLanes;if(n===0)return 0;var i=0,r=t.suspendedLanes,s=t.pingedLanes,a=n&268435455;if(a!==0){var o=a&~r;o!==0?i=Ma(o):(s&=a,s!==0&&(i=Ma(s)))}else a=n&~r,a!==0?i=Ma(a):s!==0&&(i=Ma(s));if(i===0)return 0;if(e!==0&&e!==i&&!(e&r)&&(r=i&-i,s=e&-e,r>=s||r===16&&(s&4194240)!==0))return e;if(i&4&&(i|=n&16),e=t.entangledLanes,e!==0)for(t=t.entanglements,e&=i;0<e;)n=31-ii(e),r=1<<n,i|=t[n],e&=~r;return i}function Rx(t,e){switch(t){case 1:case 2:case 4:return e+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Px(t,e){for(var n=t.suspendedLanes,i=t.pingedLanes,r=t.expirationTimes,s=t.pendingLanes;0<s;){var a=31-ii(s),o=1<<a,l=r[a];l===-1?(!(o&n)||o&i)&&(r[a]=Rx(o,e)):l<=e&&(t.expiredLanes|=o),s&=~o}}function id(t){return t=t.pendingLanes&-1073741825,t!==0?t:t&1073741824?1073741824:0}function t_(){var t=So;return So<<=1,!(So&4194240)&&(So=64),t}function Uc(t){for(var e=[],n=0;31>n;n++)e.push(t);return e}function so(t,e,n){t.pendingLanes|=e,e!==536870912&&(t.suspendedLanes=0,t.pingedLanes=0),t=t.eventTimes,e=31-ii(e),t[e]=n}function Nx(t,e){var n=t.pendingLanes&~e;t.pendingLanes=e,t.suspendedLanes=0,t.pingedLanes=0,t.expiredLanes&=e,t.mutableReadLanes&=e,t.entangledLanes&=e,e=t.entanglements;var i=t.eventTimes;for(t=t.expirationTimes;0<n;){var r=31-ii(n),s=1<<r;e[r]=0,i[r]=-1,t[r]=-1,n&=~s}}function Ih(t,e){var n=t.entangledLanes|=e;for(t=t.entanglements;n;){var i=31-ii(n),r=1<<i;r&e|t[i]&e&&(t[i]|=e),n&=~r}}var ot=0;function n_(t){return t&=-t,1<t?4<t?t&268435455?16:536870912:4:1}var i_,Uh,r_,s_,a_,rd=!1,Eo=[],tr=null,nr=null,ir=null,Ba=new Map,Ha=new Map,Wi=[],Lx="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function ep(t,e){switch(t){case"focusin":case"focusout":tr=null;break;case"dragenter":case"dragleave":nr=null;break;case"mouseover":case"mouseout":ir=null;break;case"pointerover":case"pointerout":Ba.delete(e.pointerId);break;case"gotpointercapture":case"lostpointercapture":Ha.delete(e.pointerId)}}function ia(t,e,n,i,r,s){return t===null||t.nativeEvent!==s?(t={blockedOn:e,domEventName:n,eventSystemFlags:i,nativeEvent:s,targetContainers:[r]},e!==null&&(e=oo(e),e!==null&&Uh(e)),t):(t.eventSystemFlags|=i,e=t.targetContainers,r!==null&&e.indexOf(r)===-1&&e.push(r),t)}function Dx(t,e,n,i,r){switch(e){case"focusin":return tr=ia(tr,t,e,n,i,r),!0;case"dragenter":return nr=ia(nr,t,e,n,i,r),!0;case"mouseover":return ir=ia(ir,t,e,n,i,r),!0;case"pointerover":var s=r.pointerId;return Ba.set(s,ia(Ba.get(s)||null,t,e,n,i,r)),!0;case"gotpointercapture":return s=r.pointerId,Ha.set(s,ia(Ha.get(s)||null,t,e,n,i,r)),!0}return!1}function o_(t){var e=Lr(t.target);if(e!==null){var n=Wr(e);if(n!==null){if(e=n.tag,e===13){if(e=qg(n),e!==null){t.blockedOn=e,a_(t.priority,function(){r_(n)});return}}else if(e===3&&n.stateNode.current.memoizedState.isDehydrated){t.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}t.blockedOn=null}function hl(t){if(t.blockedOn!==null)return!1;for(var e=t.targetContainers;0<e.length;){var n=sd(t.domEventName,t.eventSystemFlags,e[0],t.nativeEvent);if(n===null){n=t.nativeEvent;var i=new n.constructor(n.type,n);Qu=i,n.target.dispatchEvent(i),Qu=null}else return e=oo(n),e!==null&&Uh(e),t.blockedOn=n,!1;e.shift()}return!0}function tp(t,e,n){hl(t)&&n.delete(e)}function Ix(){rd=!1,tr!==null&&hl(tr)&&(tr=null),nr!==null&&hl(nr)&&(nr=null),ir!==null&&hl(ir)&&(ir=null),Ba.forEach(tp),Ha.forEach(tp)}function ra(t,e){t.blockedOn===e&&(t.blockedOn=null,rd||(rd=!0,Rn.unstable_scheduleCallback(Rn.unstable_NormalPriority,Ix)))}function Ga(t){function e(r){return ra(r,t)}if(0<Eo.length){ra(Eo[0],t);for(var n=1;n<Eo.length;n++){var i=Eo[n];i.blockedOn===t&&(i.blockedOn=null)}}for(tr!==null&&ra(tr,t),nr!==null&&ra(nr,t),ir!==null&&ra(ir,t),Ba.forEach(e),Ha.forEach(e),n=0;n<Wi.length;n++)i=Wi[n],i.blockedOn===t&&(i.blockedOn=null);for(;0<Wi.length&&(n=Wi[0],n.blockedOn===null);)o_(n),n.blockedOn===null&&Wi.shift()}var Ps=Ii.ReactCurrentBatchConfig,Il=!0;function Ux(t,e,n,i){var r=ot,s=Ps.transition;Ps.transition=null;try{ot=1,kh(t,e,n,i)}finally{ot=r,Ps.transition=s}}function kx(t,e,n,i){var r=ot,s=Ps.transition;Ps.transition=null;try{ot=4,kh(t,e,n,i)}finally{ot=r,Ps.transition=s}}function kh(t,e,n,i){if(Il){var r=sd(t,e,n,i);if(r===null)Wc(t,e,i,Ul,n),ep(t,i);else if(Dx(r,t,e,n,i))i.stopPropagation();else if(ep(t,i),e&4&&-1<Lx.indexOf(t)){for(;r!==null;){var s=oo(r);if(s!==null&&i_(s),s=sd(t,e,n,i),s===null&&Wc(t,e,i,Ul,n),s===r)break;r=s}r!==null&&i.stopPropagation()}else Wc(t,e,i,null,n)}}var Ul=null;function sd(t,e,n,i){if(Ul=null,t=Lh(i),t=Lr(t),t!==null)if(e=Wr(t),e===null)t=null;else if(n=e.tag,n===13){if(t=qg(e),t!==null)return t;t=null}else if(n===3){if(e.stateNode.current.memoizedState.isDehydrated)return e.tag===3?e.stateNode.containerInfo:null;t=null}else e!==t&&(t=null);return Ul=t,null}function l_(t){switch(t){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(Ex()){case Dh:return 1;case Qg:return 4;case Ll:case wx:return 16;case e_:return 536870912;default:return 16}default:return 16}}var qi=null,Fh=null,fl=null;function c_(){if(fl)return fl;var t,e=Fh,n=e.length,i,r="value"in qi?qi.value:qi.textContent,s=r.length;for(t=0;t<n&&e[t]===r[t];t++);var a=n-t;for(i=1;i<=a&&e[n-i]===r[s-i];i++);return fl=r.slice(t,1<i?1-i:void 0)}function pl(t){var e=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&e===13&&(t=13)):t=e,t===10&&(t=13),32<=t||t===13?t:0}function wo(){return!0}function np(){return!1}function Nn(t){function e(n,i,r,s,a){this._reactName=n,this._targetInst=r,this.type=i,this.nativeEvent=s,this.target=a,this.currentTarget=null;for(var o in t)t.hasOwnProperty(o)&&(n=t[o],this[o]=n?n(s):s[o]);return this.isDefaultPrevented=(s.defaultPrevented!=null?s.defaultPrevented:s.returnValue===!1)?wo:np,this.isPropagationStopped=np,this}return wt(e.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=wo)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=wo)},persist:function(){},isPersistent:wo}),e}var Zs={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Oh=Nn(Zs),ao=wt({},Zs,{view:0,detail:0}),Fx=Nn(ao),kc,Fc,sa,lc=wt({},ao,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:zh,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==sa&&(sa&&t.type==="mousemove"?(kc=t.screenX-sa.screenX,Fc=t.screenY-sa.screenY):Fc=kc=0,sa=t),kc)},movementY:function(t){return"movementY"in t?t.movementY:Fc}}),ip=Nn(lc),Ox=wt({},lc,{dataTransfer:0}),zx=Nn(Ox),Bx=wt({},ao,{relatedTarget:0}),Oc=Nn(Bx),Hx=wt({},Zs,{animationName:0,elapsedTime:0,pseudoElement:0}),Gx=Nn(Hx),Vx=wt({},Zs,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),jx=Nn(Vx),Wx=wt({},Zs,{data:0}),rp=Nn(Wx),Xx={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},$x={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Yx={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function qx(t){var e=this.nativeEvent;return e.getModifierState?e.getModifierState(t):(t=Yx[t])?!!e[t]:!1}function zh(){return qx}var Kx=wt({},ao,{key:function(t){if(t.key){var e=Xx[t.key]||t.key;if(e!=="Unidentified")return e}return t.type==="keypress"?(t=pl(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?$x[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:zh,charCode:function(t){return t.type==="keypress"?pl(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?pl(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),Zx=Nn(Kx),Jx=wt({},lc,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),sp=Nn(Jx),Qx=wt({},ao,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:zh}),ey=Nn(Qx),ty=wt({},Zs,{propertyName:0,elapsedTime:0,pseudoElement:0}),ny=Nn(ty),iy=wt({},lc,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),ry=Nn(iy),sy=[9,13,27,32],Bh=Ri&&"CompositionEvent"in window,ba=null;Ri&&"documentMode"in document&&(ba=document.documentMode);var ay=Ri&&"TextEvent"in window&&!ba,u_=Ri&&(!Bh||ba&&8<ba&&11>=ba),ap=" ",op=!1;function d_(t,e){switch(t){case"keyup":return sy.indexOf(e.keyCode)!==-1;case"keydown":return e.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function h_(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var ms=!1;function oy(t,e){switch(t){case"compositionend":return h_(e);case"keypress":return e.which!==32?null:(op=!0,ap);case"textInput":return t=e.data,t===ap&&op?null:t;default:return null}}function ly(t,e){if(ms)return t==="compositionend"||!Bh&&d_(t,e)?(t=c_(),fl=Fh=qi=null,ms=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(e.ctrlKey||e.altKey||e.metaKey)||e.ctrlKey&&e.altKey){if(e.char&&1<e.char.length)return e.char;if(e.which)return String.fromCharCode(e.which)}return null;case"compositionend":return u_&&e.locale!=="ko"?null:e.data;default:return null}}var cy={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function lp(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e==="input"?!!cy[t.type]:e==="textarea"}function f_(t,e,n,i){jg(i),e=kl(e,"onChange"),0<e.length&&(n=new Oh("onChange","change",null,n,i),t.push({event:n,listeners:e}))}var Ca=null,Va=null;function uy(t){w_(t,0)}function cc(t){var e=vs(t);if(Fg(e))return t}function dy(t,e){if(t==="change")return e}var p_=!1;if(Ri){var zc;if(Ri){var Bc="oninput"in document;if(!Bc){var cp=document.createElement("div");cp.setAttribute("oninput","return;"),Bc=typeof cp.oninput=="function"}zc=Bc}else zc=!1;p_=zc&&(!document.documentMode||9<document.documentMode)}function up(){Ca&&(Ca.detachEvent("onpropertychange",m_),Va=Ca=null)}function m_(t){if(t.propertyName==="value"&&cc(Va)){var e=[];f_(e,Va,t,Lh(t)),Yg(uy,e)}}function hy(t,e,n){t==="focusin"?(up(),Ca=e,Va=n,Ca.attachEvent("onpropertychange",m_)):t==="focusout"&&up()}function fy(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return cc(Va)}function py(t,e){if(t==="click")return cc(e)}function my(t,e){if(t==="input"||t==="change")return cc(e)}function gy(t,e){return t===e&&(t!==0||1/t===1/e)||t!==t&&e!==e}var ai=typeof Object.is=="function"?Object.is:gy;function ja(t,e){if(ai(t,e))return!0;if(typeof t!="object"||t===null||typeof e!="object"||e===null)return!1;var n=Object.keys(t),i=Object.keys(e);if(n.length!==i.length)return!1;for(i=0;i<n.length;i++){var r=n[i];if(!Hu.call(e,r)||!ai(t[r],e[r]))return!1}return!0}function dp(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function hp(t,e){var n=dp(t);t=0;for(var i;n;){if(n.nodeType===3){if(i=t+n.textContent.length,t<=e&&i>=e)return{node:n,offset:e-t};t=i}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=dp(n)}}function g_(t,e){return t&&e?t===e?!0:t&&t.nodeType===3?!1:e&&e.nodeType===3?g_(t,e.parentNode):"contains"in t?t.contains(e):t.compareDocumentPosition?!!(t.compareDocumentPosition(e)&16):!1:!1}function __(){for(var t=window,e=Rl();e instanceof t.HTMLIFrameElement;){try{var n=typeof e.contentWindow.location.href=="string"}catch{n=!1}if(n)t=e.contentWindow;else break;e=Rl(t.document)}return e}function Hh(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e&&(e==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||e==="textarea"||t.contentEditable==="true")}function _y(t){var e=__(),n=t.focusedElem,i=t.selectionRange;if(e!==n&&n&&n.ownerDocument&&g_(n.ownerDocument.documentElement,n)){if(i!==null&&Hh(n)){if(e=i.start,t=i.end,t===void 0&&(t=e),"selectionStart"in n)n.selectionStart=e,n.selectionEnd=Math.min(t,n.value.length);else if(t=(e=n.ownerDocument||document)&&e.defaultView||window,t.getSelection){t=t.getSelection();var r=n.textContent.length,s=Math.min(i.start,r);i=i.end===void 0?s:Math.min(i.end,r),!t.extend&&s>i&&(r=i,i=s,s=r),r=hp(n,s);var a=hp(n,i);r&&a&&(t.rangeCount!==1||t.anchorNode!==r.node||t.anchorOffset!==r.offset||t.focusNode!==a.node||t.focusOffset!==a.offset)&&(e=e.createRange(),e.setStart(r.node,r.offset),t.removeAllRanges(),s>i?(t.addRange(e),t.extend(a.node,a.offset)):(e.setEnd(a.node,a.offset),t.addRange(e)))}}for(e=[],t=n;t=t.parentNode;)t.nodeType===1&&e.push({element:t,left:t.scrollLeft,top:t.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<e.length;n++)t=e[n],t.element.scrollLeft=t.left,t.element.scrollTop=t.top}}var vy=Ri&&"documentMode"in document&&11>=document.documentMode,gs=null,ad=null,Ra=null,od=!1;function fp(t,e,n){var i=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;od||gs==null||gs!==Rl(i)||(i=gs,"selectionStart"in i&&Hh(i)?i={start:i.selectionStart,end:i.selectionEnd}:(i=(i.ownerDocument&&i.ownerDocument.defaultView||window).getSelection(),i={anchorNode:i.anchorNode,anchorOffset:i.anchorOffset,focusNode:i.focusNode,focusOffset:i.focusOffset}),Ra&&ja(Ra,i)||(Ra=i,i=kl(ad,"onSelect"),0<i.length&&(e=new Oh("onSelect","select",null,e,n),t.push({event:e,listeners:i}),e.target=gs)))}function To(t,e){var n={};return n[t.toLowerCase()]=e.toLowerCase(),n["Webkit"+t]="webkit"+e,n["Moz"+t]="moz"+e,n}var _s={animationend:To("Animation","AnimationEnd"),animationiteration:To("Animation","AnimationIteration"),animationstart:To("Animation","AnimationStart"),transitionend:To("Transition","TransitionEnd")},Hc={},v_={};Ri&&(v_=document.createElement("div").style,"AnimationEvent"in window||(delete _s.animationend.animation,delete _s.animationiteration.animation,delete _s.animationstart.animation),"TransitionEvent"in window||delete _s.transitionend.transition);function uc(t){if(Hc[t])return Hc[t];if(!_s[t])return t;var e=_s[t],n;for(n in e)if(e.hasOwnProperty(n)&&n in v_)return Hc[t]=e[n];return t}var x_=uc("animationend"),y_=uc("animationiteration"),S_=uc("animationstart"),M_=uc("transitionend"),E_=new Map,pp="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function pr(t,e){E_.set(t,e),jr(e,[t])}for(var Gc=0;Gc<pp.length;Gc++){var Vc=pp[Gc],xy=Vc.toLowerCase(),yy=Vc[0].toUpperCase()+Vc.slice(1);pr(xy,"on"+yy)}pr(x_,"onAnimationEnd");pr(y_,"onAnimationIteration");pr(S_,"onAnimationStart");pr("dblclick","onDoubleClick");pr("focusin","onFocus");pr("focusout","onBlur");pr(M_,"onTransitionEnd");ks("onMouseEnter",["mouseout","mouseover"]);ks("onMouseLeave",["mouseout","mouseover"]);ks("onPointerEnter",["pointerout","pointerover"]);ks("onPointerLeave",["pointerout","pointerover"]);jr("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));jr("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));jr("onBeforeInput",["compositionend","keypress","textInput","paste"]);jr("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));jr("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));jr("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Ea="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Sy=new Set("cancel close invalid load scroll toggle".split(" ").concat(Ea));function mp(t,e,n){var i=t.type||"unknown-event";t.currentTarget=n,xx(i,e,void 0,t),t.currentTarget=null}function w_(t,e){e=(e&4)!==0;for(var n=0;n<t.length;n++){var i=t[n],r=i.event;i=i.listeners;e:{var s=void 0;if(e)for(var a=i.length-1;0<=a;a--){var o=i[a],l=o.instance,c=o.currentTarget;if(o=o.listener,l!==s&&r.isPropagationStopped())break e;mp(r,o,c),s=l}else for(a=0;a<i.length;a++){if(o=i[a],l=o.instance,c=o.currentTarget,o=o.listener,l!==s&&r.isPropagationStopped())break e;mp(r,o,c),s=l}}}if(Nl)throw t=nd,Nl=!1,nd=null,t}function mt(t,e){var n=e[hd];n===void 0&&(n=e[hd]=new Set);var i=t+"__bubble";n.has(i)||(T_(e,t,2,!1),n.add(i))}function jc(t,e,n){var i=0;e&&(i|=4),T_(n,t,i,e)}var Ao="_reactListening"+Math.random().toString(36).slice(2);function Wa(t){if(!t[Ao]){t[Ao]=!0,Lg.forEach(function(n){n!=="selectionchange"&&(Sy.has(n)||jc(n,!1,t),jc(n,!0,t))});var e=t.nodeType===9?t:t.ownerDocument;e===null||e[Ao]||(e[Ao]=!0,jc("selectionchange",!1,e))}}function T_(t,e,n,i){switch(l_(e)){case 1:var r=Ux;break;case 4:r=kx;break;default:r=kh}n=r.bind(null,e,n,t),r=void 0,!td||e!=="touchstart"&&e!=="touchmove"&&e!=="wheel"||(r=!0),i?r!==void 0?t.addEventListener(e,n,{capture:!0,passive:r}):t.addEventListener(e,n,!0):r!==void 0?t.addEventListener(e,n,{passive:r}):t.addEventListener(e,n,!1)}function Wc(t,e,n,i,r){var s=i;if(!(e&1)&&!(e&2)&&i!==null)e:for(;;){if(i===null)return;var a=i.tag;if(a===3||a===4){var o=i.stateNode.containerInfo;if(o===r||o.nodeType===8&&o.parentNode===r)break;if(a===4)for(a=i.return;a!==null;){var l=a.tag;if((l===3||l===4)&&(l=a.stateNode.containerInfo,l===r||l.nodeType===8&&l.parentNode===r))return;a=a.return}for(;o!==null;){if(a=Lr(o),a===null)return;if(l=a.tag,l===5||l===6){i=s=a;continue e}o=o.parentNode}}i=i.return}Yg(function(){var c=s,u=Lh(n),d=[];e:{var f=E_.get(t);if(f!==void 0){var p=Oh,_=t;switch(t){case"keypress":if(pl(n)===0)break e;case"keydown":case"keyup":p=Zx;break;case"focusin":_="focus",p=Oc;break;case"focusout":_="blur",p=Oc;break;case"beforeblur":case"afterblur":p=Oc;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":p=ip;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":p=zx;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":p=ey;break;case x_:case y_:case S_:p=Gx;break;case M_:p=ny;break;case"scroll":p=Fx;break;case"wheel":p=ry;break;case"copy":case"cut":case"paste":p=jx;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":p=sp}var v=(e&4)!==0,m=!v&&t==="scroll",h=v?f!==null?f+"Capture":null:f;v=[];for(var x=c,S;x!==null;){S=x;var M=S.stateNode;if(S.tag===5&&M!==null&&(S=M,h!==null&&(M=za(x,h),M!=null&&v.push(Xa(x,M,S)))),m)break;x=x.return}0<v.length&&(f=new p(f,_,null,n,u),d.push({event:f,listeners:v}))}}if(!(e&7)){e:{if(f=t==="mouseover"||t==="pointerover",p=t==="mouseout"||t==="pointerout",f&&n!==Qu&&(_=n.relatedTarget||n.fromElement)&&(Lr(_)||_[Pi]))break e;if((p||f)&&(f=u.window===u?u:(f=u.ownerDocument)?f.defaultView||f.parentWindow:window,p?(_=n.relatedTarget||n.toElement,p=c,_=_?Lr(_):null,_!==null&&(m=Wr(_),_!==m||_.tag!==5&&_.tag!==6)&&(_=null)):(p=null,_=c),p!==_)){if(v=ip,M="onMouseLeave",h="onMouseEnter",x="mouse",(t==="pointerout"||t==="pointerover")&&(v=sp,M="onPointerLeave",h="onPointerEnter",x="pointer"),m=p==null?f:vs(p),S=_==null?f:vs(_),f=new v(M,x+"leave",p,n,u),f.target=m,f.relatedTarget=S,M=null,Lr(u)===c&&(v=new v(h,x+"enter",_,n,u),v.target=S,v.relatedTarget=m,M=v),m=M,p&&_)t:{for(v=p,h=_,x=0,S=v;S;S=Yr(S))x++;for(S=0,M=h;M;M=Yr(M))S++;for(;0<x-S;)v=Yr(v),x--;for(;0<S-x;)h=Yr(h),S--;for(;x--;){if(v===h||h!==null&&v===h.alternate)break t;v=Yr(v),h=Yr(h)}v=null}else v=null;p!==null&&gp(d,f,p,v,!1),_!==null&&m!==null&&gp(d,m,_,v,!0)}}e:{if(f=c?vs(c):window,p=f.nodeName&&f.nodeName.toLowerCase(),p==="select"||p==="input"&&f.type==="file")var P=dy;else if(lp(f))if(p_)P=my;else{P=fy;var C=hy}else(p=f.nodeName)&&p.toLowerCase()==="input"&&(f.type==="checkbox"||f.type==="radio")&&(P=py);if(P&&(P=P(t,c))){f_(d,P,n,u);break e}C&&C(t,f,c),t==="focusout"&&(C=f._wrapperState)&&C.controlled&&f.type==="number"&&Yu(f,"number",f.value)}switch(C=c?vs(c):window,t){case"focusin":(lp(C)||C.contentEditable==="true")&&(gs=C,ad=c,Ra=null);break;case"focusout":Ra=ad=gs=null;break;case"mousedown":od=!0;break;case"contextmenu":case"mouseup":case"dragend":od=!1,fp(d,n,u);break;case"selectionchange":if(vy)break;case"keydown":case"keyup":fp(d,n,u)}var A;if(Bh)e:{switch(t){case"compositionstart":var b="onCompositionStart";break e;case"compositionend":b="onCompositionEnd";break e;case"compositionupdate":b="onCompositionUpdate";break e}b=void 0}else ms?d_(t,n)&&(b="onCompositionEnd"):t==="keydown"&&n.keyCode===229&&(b="onCompositionStart");b&&(u_&&n.locale!=="ko"&&(ms||b!=="onCompositionStart"?b==="onCompositionEnd"&&ms&&(A=c_()):(qi=u,Fh="value"in qi?qi.value:qi.textContent,ms=!0)),C=kl(c,b),0<C.length&&(b=new rp(b,t,null,n,u),d.push({event:b,listeners:C}),A?b.data=A:(A=h_(n),A!==null&&(b.data=A)))),(A=ay?oy(t,n):ly(t,n))&&(c=kl(c,"onBeforeInput"),0<c.length&&(u=new rp("onBeforeInput","beforeinput",null,n,u),d.push({event:u,listeners:c}),u.data=A))}w_(d,e)})}function Xa(t,e,n){return{instance:t,listener:e,currentTarget:n}}function kl(t,e){for(var n=e+"Capture",i=[];t!==null;){var r=t,s=r.stateNode;r.tag===5&&s!==null&&(r=s,s=za(t,n),s!=null&&i.unshift(Xa(t,s,r)),s=za(t,e),s!=null&&i.push(Xa(t,s,r))),t=t.return}return i}function Yr(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5);return t||null}function gp(t,e,n,i,r){for(var s=e._reactName,a=[];n!==null&&n!==i;){var o=n,l=o.alternate,c=o.stateNode;if(l!==null&&l===i)break;o.tag===5&&c!==null&&(o=c,r?(l=za(n,s),l!=null&&a.unshift(Xa(n,l,o))):r||(l=za(n,s),l!=null&&a.push(Xa(n,l,o)))),n=n.return}a.length!==0&&t.push({event:e,listeners:a})}var My=/\r\n?/g,Ey=/\u0000|\uFFFD/g;function _p(t){return(typeof t=="string"?t:""+t).replace(My,`
`).replace(Ey,"")}function bo(t,e,n){if(e=_p(e),_p(t)!==e&&n)throw Error(oe(425))}function Fl(){}var ld=null,cd=null;function ud(t,e){return t==="textarea"||t==="noscript"||typeof e.children=="string"||typeof e.children=="number"||typeof e.dangerouslySetInnerHTML=="object"&&e.dangerouslySetInnerHTML!==null&&e.dangerouslySetInnerHTML.__html!=null}var dd=typeof setTimeout=="function"?setTimeout:void 0,wy=typeof clearTimeout=="function"?clearTimeout:void 0,vp=typeof Promise=="function"?Promise:void 0,Ty=typeof queueMicrotask=="function"?queueMicrotask:typeof vp<"u"?function(t){return vp.resolve(null).then(t).catch(Ay)}:dd;function Ay(t){setTimeout(function(){throw t})}function Xc(t,e){var n=e,i=0;do{var r=n.nextSibling;if(t.removeChild(n),r&&r.nodeType===8)if(n=r.data,n==="/$"){if(i===0){t.removeChild(r),Ga(e);return}i--}else n!=="$"&&n!=="$?"&&n!=="$!"||i++;n=r}while(n);Ga(e)}function rr(t){for(;t!=null;t=t.nextSibling){var e=t.nodeType;if(e===1||e===3)break;if(e===8){if(e=t.data,e==="$"||e==="$!"||e==="$?")break;if(e==="/$")return null}}return t}function xp(t){t=t.previousSibling;for(var e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="$"||n==="$!"||n==="$?"){if(e===0)return t;e--}else n==="/$"&&e++}t=t.previousSibling}return null}var Js=Math.random().toString(36).slice(2),ui="__reactFiber$"+Js,$a="__reactProps$"+Js,Pi="__reactContainer$"+Js,hd="__reactEvents$"+Js,by="__reactListeners$"+Js,Cy="__reactHandles$"+Js;function Lr(t){var e=t[ui];if(e)return e;for(var n=t.parentNode;n;){if(e=n[Pi]||n[ui]){if(n=e.alternate,e.child!==null||n!==null&&n.child!==null)for(t=xp(t);t!==null;){if(n=t[ui])return n;t=xp(t)}return e}t=n,n=t.parentNode}return null}function oo(t){return t=t[ui]||t[Pi],!t||t.tag!==5&&t.tag!==6&&t.tag!==13&&t.tag!==3?null:t}function vs(t){if(t.tag===5||t.tag===6)return t.stateNode;throw Error(oe(33))}function dc(t){return t[$a]||null}var fd=[],xs=-1;function mr(t){return{current:t}}function xt(t){0>xs||(t.current=fd[xs],fd[xs]=null,xs--)}function ht(t,e){xs++,fd[xs]=t.current,t.current=e}var hr={},sn=mr(hr),vn=mr(!1),Fr=hr;function Fs(t,e){var n=t.type.contextTypes;if(!n)return hr;var i=t.stateNode;if(i&&i.__reactInternalMemoizedUnmaskedChildContext===e)return i.__reactInternalMemoizedMaskedChildContext;var r={},s;for(s in n)r[s]=e[s];return i&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=e,t.__reactInternalMemoizedMaskedChildContext=r),r}function xn(t){return t=t.childContextTypes,t!=null}function Ol(){xt(vn),xt(sn)}function yp(t,e,n){if(sn.current!==hr)throw Error(oe(168));ht(sn,e),ht(vn,n)}function A_(t,e,n){var i=t.stateNode;if(e=e.childContextTypes,typeof i.getChildContext!="function")return n;i=i.getChildContext();for(var r in i)if(!(r in e))throw Error(oe(108,hx(t)||"Unknown",r));return wt({},n,i)}function zl(t){return t=(t=t.stateNode)&&t.__reactInternalMemoizedMergedChildContext||hr,Fr=sn.current,ht(sn,t),ht(vn,vn.current),!0}function Sp(t,e,n){var i=t.stateNode;if(!i)throw Error(oe(169));n?(t=A_(t,e,Fr),i.__reactInternalMemoizedMergedChildContext=t,xt(vn),xt(sn),ht(sn,t)):xt(vn),ht(vn,n)}var Si=null,hc=!1,$c=!1;function b_(t){Si===null?Si=[t]:Si.push(t)}function Ry(t){hc=!0,b_(t)}function gr(){if(!$c&&Si!==null){$c=!0;var t=0,e=ot;try{var n=Si;for(ot=1;t<n.length;t++){var i=n[t];do i=i(!0);while(i!==null)}Si=null,hc=!1}catch(r){throw Si!==null&&(Si=Si.slice(t+1)),Jg(Dh,gr),r}finally{ot=e,$c=!1}}return null}var ys=[],Ss=0,Bl=null,Hl=0,Un=[],kn=0,Or=null,Ei=1,wi="";function Ar(t,e){ys[Ss++]=Hl,ys[Ss++]=Bl,Bl=t,Hl=e}function C_(t,e,n){Un[kn++]=Ei,Un[kn++]=wi,Un[kn++]=Or,Or=t;var i=Ei;t=wi;var r=32-ii(i)-1;i&=~(1<<r),n+=1;var s=32-ii(e)+r;if(30<s){var a=r-r%5;s=(i&(1<<a)-1).toString(32),i>>=a,r-=a,Ei=1<<32-ii(e)+r|n<<r|i,wi=s+t}else Ei=1<<s|n<<r|i,wi=t}function Gh(t){t.return!==null&&(Ar(t,1),C_(t,1,0))}function Vh(t){for(;t===Bl;)Bl=ys[--Ss],ys[Ss]=null,Hl=ys[--Ss],ys[Ss]=null;for(;t===Or;)Or=Un[--kn],Un[kn]=null,wi=Un[--kn],Un[kn]=null,Ei=Un[--kn],Un[kn]=null}var Cn=null,bn=null,St=!1,Qn=null;function R_(t,e){var n=zn(5,null,null,0);n.elementType="DELETED",n.stateNode=e,n.return=t,e=t.deletions,e===null?(t.deletions=[n],t.flags|=16):e.push(n)}function Mp(t,e){switch(t.tag){case 5:var n=t.type;return e=e.nodeType!==1||n.toLowerCase()!==e.nodeName.toLowerCase()?null:e,e!==null?(t.stateNode=e,Cn=t,bn=rr(e.firstChild),!0):!1;case 6:return e=t.pendingProps===""||e.nodeType!==3?null:e,e!==null?(t.stateNode=e,Cn=t,bn=null,!0):!1;case 13:return e=e.nodeType!==8?null:e,e!==null?(n=Or!==null?{id:Ei,overflow:wi}:null,t.memoizedState={dehydrated:e,treeContext:n,retryLane:1073741824},n=zn(18,null,null,0),n.stateNode=e,n.return=t,t.child=n,Cn=t,bn=null,!0):!1;default:return!1}}function pd(t){return(t.mode&1)!==0&&(t.flags&128)===0}function md(t){if(St){var e=bn;if(e){var n=e;if(!Mp(t,e)){if(pd(t))throw Error(oe(418));e=rr(n.nextSibling);var i=Cn;e&&Mp(t,e)?R_(i,n):(t.flags=t.flags&-4097|2,St=!1,Cn=t)}}else{if(pd(t))throw Error(oe(418));t.flags=t.flags&-4097|2,St=!1,Cn=t}}}function Ep(t){for(t=t.return;t!==null&&t.tag!==5&&t.tag!==3&&t.tag!==13;)t=t.return;Cn=t}function Co(t){if(t!==Cn)return!1;if(!St)return Ep(t),St=!0,!1;var e;if((e=t.tag!==3)&&!(e=t.tag!==5)&&(e=t.type,e=e!=="head"&&e!=="body"&&!ud(t.type,t.memoizedProps)),e&&(e=bn)){if(pd(t))throw P_(),Error(oe(418));for(;e;)R_(t,e),e=rr(e.nextSibling)}if(Ep(t),t.tag===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(oe(317));e:{for(t=t.nextSibling,e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="/$"){if(e===0){bn=rr(t.nextSibling);break e}e--}else n!=="$"&&n!=="$!"&&n!=="$?"||e++}t=t.nextSibling}bn=null}}else bn=Cn?rr(t.stateNode.nextSibling):null;return!0}function P_(){for(var t=bn;t;)t=rr(t.nextSibling)}function Os(){bn=Cn=null,St=!1}function jh(t){Qn===null?Qn=[t]:Qn.push(t)}var Py=Ii.ReactCurrentBatchConfig;function aa(t,e,n){if(t=n.ref,t!==null&&typeof t!="function"&&typeof t!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(oe(309));var i=n.stateNode}if(!i)throw Error(oe(147,t));var r=i,s=""+t;return e!==null&&e.ref!==null&&typeof e.ref=="function"&&e.ref._stringRef===s?e.ref:(e=function(a){var o=r.refs;a===null?delete o[s]:o[s]=a},e._stringRef=s,e)}if(typeof t!="string")throw Error(oe(284));if(!n._owner)throw Error(oe(290,t))}return t}function Ro(t,e){throw t=Object.prototype.toString.call(e),Error(oe(31,t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t))}function wp(t){var e=t._init;return e(t._payload)}function N_(t){function e(h,x){if(t){var S=h.deletions;S===null?(h.deletions=[x],h.flags|=16):S.push(x)}}function n(h,x){if(!t)return null;for(;x!==null;)e(h,x),x=x.sibling;return null}function i(h,x){for(h=new Map;x!==null;)x.key!==null?h.set(x.key,x):h.set(x.index,x),x=x.sibling;return h}function r(h,x){return h=lr(h,x),h.index=0,h.sibling=null,h}function s(h,x,S){return h.index=S,t?(S=h.alternate,S!==null?(S=S.index,S<x?(h.flags|=2,x):S):(h.flags|=2,x)):(h.flags|=1048576,x)}function a(h){return t&&h.alternate===null&&(h.flags|=2),h}function o(h,x,S,M){return x===null||x.tag!==6?(x=eu(S,h.mode,M),x.return=h,x):(x=r(x,S),x.return=h,x)}function l(h,x,S,M){var P=S.type;return P===ps?u(h,x,S.props.children,M,S.key):x!==null&&(x.elementType===P||typeof P=="object"&&P!==null&&P.$$typeof===Vi&&wp(P)===x.type)?(M=r(x,S.props),M.ref=aa(h,x,S),M.return=h,M):(M=Sl(S.type,S.key,S.props,null,h.mode,M),M.ref=aa(h,x,S),M.return=h,M)}function c(h,x,S,M){return x===null||x.tag!==4||x.stateNode.containerInfo!==S.containerInfo||x.stateNode.implementation!==S.implementation?(x=tu(S,h.mode,M),x.return=h,x):(x=r(x,S.children||[]),x.return=h,x)}function u(h,x,S,M,P){return x===null||x.tag!==7?(x=kr(S,h.mode,M,P),x.return=h,x):(x=r(x,S),x.return=h,x)}function d(h,x,S){if(typeof x=="string"&&x!==""||typeof x=="number")return x=eu(""+x,h.mode,S),x.return=h,x;if(typeof x=="object"&&x!==null){switch(x.$$typeof){case vo:return S=Sl(x.type,x.key,x.props,null,h.mode,S),S.ref=aa(h,null,x),S.return=h,S;case fs:return x=tu(x,h.mode,S),x.return=h,x;case Vi:var M=x._init;return d(h,M(x._payload),S)}if(Sa(x)||ta(x))return x=kr(x,h.mode,S,null),x.return=h,x;Ro(h,x)}return null}function f(h,x,S,M){var P=x!==null?x.key:null;if(typeof S=="string"&&S!==""||typeof S=="number")return P!==null?null:o(h,x,""+S,M);if(typeof S=="object"&&S!==null){switch(S.$$typeof){case vo:return S.key===P?l(h,x,S,M):null;case fs:return S.key===P?c(h,x,S,M):null;case Vi:return P=S._init,f(h,x,P(S._payload),M)}if(Sa(S)||ta(S))return P!==null?null:u(h,x,S,M,null);Ro(h,S)}return null}function p(h,x,S,M,P){if(typeof M=="string"&&M!==""||typeof M=="number")return h=h.get(S)||null,o(x,h,""+M,P);if(typeof M=="object"&&M!==null){switch(M.$$typeof){case vo:return h=h.get(M.key===null?S:M.key)||null,l(x,h,M,P);case fs:return h=h.get(M.key===null?S:M.key)||null,c(x,h,M,P);case Vi:var C=M._init;return p(h,x,S,C(M._payload),P)}if(Sa(M)||ta(M))return h=h.get(S)||null,u(x,h,M,P,null);Ro(x,M)}return null}function _(h,x,S,M){for(var P=null,C=null,A=x,b=x=0,z=null;A!==null&&b<S.length;b++){A.index>b?(z=A,A=null):z=A.sibling;var y=f(h,A,S[b],M);if(y===null){A===null&&(A=z);break}t&&A&&y.alternate===null&&e(h,A),x=s(y,x,b),C===null?P=y:C.sibling=y,C=y,A=z}if(b===S.length)return n(h,A),St&&Ar(h,b),P;if(A===null){for(;b<S.length;b++)A=d(h,S[b],M),A!==null&&(x=s(A,x,b),C===null?P=A:C.sibling=A,C=A);return St&&Ar(h,b),P}for(A=i(h,A);b<S.length;b++)z=p(A,h,b,S[b],M),z!==null&&(t&&z.alternate!==null&&A.delete(z.key===null?b:z.key),x=s(z,x,b),C===null?P=z:C.sibling=z,C=z);return t&&A.forEach(function(E){return e(h,E)}),St&&Ar(h,b),P}function v(h,x,S,M){var P=ta(S);if(typeof P!="function")throw Error(oe(150));if(S=P.call(S),S==null)throw Error(oe(151));for(var C=P=null,A=x,b=x=0,z=null,y=S.next();A!==null&&!y.done;b++,y=S.next()){A.index>b?(z=A,A=null):z=A.sibling;var E=f(h,A,y.value,M);if(E===null){A===null&&(A=z);break}t&&A&&E.alternate===null&&e(h,A),x=s(E,x,b),C===null?P=E:C.sibling=E,C=E,A=z}if(y.done)return n(h,A),St&&Ar(h,b),P;if(A===null){for(;!y.done;b++,y=S.next())y=d(h,y.value,M),y!==null&&(x=s(y,x,b),C===null?P=y:C.sibling=y,C=y);return St&&Ar(h,b),P}for(A=i(h,A);!y.done;b++,y=S.next())y=p(A,h,b,y.value,M),y!==null&&(t&&y.alternate!==null&&A.delete(y.key===null?b:y.key),x=s(y,x,b),C===null?P=y:C.sibling=y,C=y);return t&&A.forEach(function(U){return e(h,U)}),St&&Ar(h,b),P}function m(h,x,S,M){if(typeof S=="object"&&S!==null&&S.type===ps&&S.key===null&&(S=S.props.children),typeof S=="object"&&S!==null){switch(S.$$typeof){case vo:e:{for(var P=S.key,C=x;C!==null;){if(C.key===P){if(P=S.type,P===ps){if(C.tag===7){n(h,C.sibling),x=r(C,S.props.children),x.return=h,h=x;break e}}else if(C.elementType===P||typeof P=="object"&&P!==null&&P.$$typeof===Vi&&wp(P)===C.type){n(h,C.sibling),x=r(C,S.props),x.ref=aa(h,C,S),x.return=h,h=x;break e}n(h,C);break}else e(h,C);C=C.sibling}S.type===ps?(x=kr(S.props.children,h.mode,M,S.key),x.return=h,h=x):(M=Sl(S.type,S.key,S.props,null,h.mode,M),M.ref=aa(h,x,S),M.return=h,h=M)}return a(h);case fs:e:{for(C=S.key;x!==null;){if(x.key===C)if(x.tag===4&&x.stateNode.containerInfo===S.containerInfo&&x.stateNode.implementation===S.implementation){n(h,x.sibling),x=r(x,S.children||[]),x.return=h,h=x;break e}else{n(h,x);break}else e(h,x);x=x.sibling}x=tu(S,h.mode,M),x.return=h,h=x}return a(h);case Vi:return C=S._init,m(h,x,C(S._payload),M)}if(Sa(S))return _(h,x,S,M);if(ta(S))return v(h,x,S,M);Ro(h,S)}return typeof S=="string"&&S!==""||typeof S=="number"?(S=""+S,x!==null&&x.tag===6?(n(h,x.sibling),x=r(x,S),x.return=h,h=x):(n(h,x),x=eu(S,h.mode,M),x.return=h,h=x),a(h)):n(h,x)}return m}var zs=N_(!0),L_=N_(!1),Gl=mr(null),Vl=null,Ms=null,Wh=null;function Xh(){Wh=Ms=Vl=null}function $h(t){var e=Gl.current;xt(Gl),t._currentValue=e}function gd(t,e,n){for(;t!==null;){var i=t.alternate;if((t.childLanes&e)!==e?(t.childLanes|=e,i!==null&&(i.childLanes|=e)):i!==null&&(i.childLanes&e)!==e&&(i.childLanes|=e),t===n)break;t=t.return}}function Ns(t,e){Vl=t,Wh=Ms=null,t=t.dependencies,t!==null&&t.firstContext!==null&&(t.lanes&e&&(_n=!0),t.firstContext=null)}function Gn(t){var e=t._currentValue;if(Wh!==t)if(t={context:t,memoizedValue:e,next:null},Ms===null){if(Vl===null)throw Error(oe(308));Ms=t,Vl.dependencies={lanes:0,firstContext:t}}else Ms=Ms.next=t;return e}var Dr=null;function Yh(t){Dr===null?Dr=[t]:Dr.push(t)}function D_(t,e,n,i){var r=e.interleaved;return r===null?(n.next=n,Yh(e)):(n.next=r.next,r.next=n),e.interleaved=n,Ni(t,i)}function Ni(t,e){t.lanes|=e;var n=t.alternate;for(n!==null&&(n.lanes|=e),n=t,t=t.return;t!==null;)t.childLanes|=e,n=t.alternate,n!==null&&(n.childLanes|=e),n=t,t=t.return;return n.tag===3?n.stateNode:null}var ji=!1;function qh(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function I_(t,e){t=t.updateQueue,e.updateQueue===t&&(e.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,effects:t.effects})}function bi(t,e){return{eventTime:t,lane:e,tag:0,payload:null,callback:null,next:null}}function sr(t,e,n){var i=t.updateQueue;if(i===null)return null;if(i=i.shared,Je&2){var r=i.pending;return r===null?e.next=e:(e.next=r.next,r.next=e),i.pending=e,Ni(t,n)}return r=i.interleaved,r===null?(e.next=e,Yh(i)):(e.next=r.next,r.next=e),i.interleaved=e,Ni(t,n)}function ml(t,e,n){if(e=e.updateQueue,e!==null&&(e=e.shared,(n&4194240)!==0)){var i=e.lanes;i&=t.pendingLanes,n|=i,e.lanes=n,Ih(t,n)}}function Tp(t,e){var n=t.updateQueue,i=t.alternate;if(i!==null&&(i=i.updateQueue,n===i)){var r=null,s=null;if(n=n.firstBaseUpdate,n!==null){do{var a={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};s===null?r=s=a:s=s.next=a,n=n.next}while(n!==null);s===null?r=s=e:s=s.next=e}else r=s=e;n={baseState:i.baseState,firstBaseUpdate:r,lastBaseUpdate:s,shared:i.shared,effects:i.effects},t.updateQueue=n;return}t=n.lastBaseUpdate,t===null?n.firstBaseUpdate=e:t.next=e,n.lastBaseUpdate=e}function jl(t,e,n,i){var r=t.updateQueue;ji=!1;var s=r.firstBaseUpdate,a=r.lastBaseUpdate,o=r.shared.pending;if(o!==null){r.shared.pending=null;var l=o,c=l.next;l.next=null,a===null?s=c:a.next=c,a=l;var u=t.alternate;u!==null&&(u=u.updateQueue,o=u.lastBaseUpdate,o!==a&&(o===null?u.firstBaseUpdate=c:o.next=c,u.lastBaseUpdate=l))}if(s!==null){var d=r.baseState;a=0,u=c=l=null,o=s;do{var f=o.lane,p=o.eventTime;if((i&f)===f){u!==null&&(u=u.next={eventTime:p,lane:0,tag:o.tag,payload:o.payload,callback:o.callback,next:null});e:{var _=t,v=o;switch(f=e,p=n,v.tag){case 1:if(_=v.payload,typeof _=="function"){d=_.call(p,d,f);break e}d=_;break e;case 3:_.flags=_.flags&-65537|128;case 0:if(_=v.payload,f=typeof _=="function"?_.call(p,d,f):_,f==null)break e;d=wt({},d,f);break e;case 2:ji=!0}}o.callback!==null&&o.lane!==0&&(t.flags|=64,f=r.effects,f===null?r.effects=[o]:f.push(o))}else p={eventTime:p,lane:f,tag:o.tag,payload:o.payload,callback:o.callback,next:null},u===null?(c=u=p,l=d):u=u.next=p,a|=f;if(o=o.next,o===null){if(o=r.shared.pending,o===null)break;f=o,o=f.next,f.next=null,r.lastBaseUpdate=f,r.shared.pending=null}}while(!0);if(u===null&&(l=d),r.baseState=l,r.firstBaseUpdate=c,r.lastBaseUpdate=u,e=r.shared.interleaved,e!==null){r=e;do a|=r.lane,r=r.next;while(r!==e)}else s===null&&(r.shared.lanes=0);Br|=a,t.lanes=a,t.memoizedState=d}}function Ap(t,e,n){if(t=e.effects,e.effects=null,t!==null)for(e=0;e<t.length;e++){var i=t[e],r=i.callback;if(r!==null){if(i.callback=null,i=n,typeof r!="function")throw Error(oe(191,r));r.call(i)}}}var lo={},hi=mr(lo),Ya=mr(lo),qa=mr(lo);function Ir(t){if(t===lo)throw Error(oe(174));return t}function Kh(t,e){switch(ht(qa,e),ht(Ya,t),ht(hi,lo),t=e.nodeType,t){case 9:case 11:e=(e=e.documentElement)?e.namespaceURI:Ku(null,"");break;default:t=t===8?e.parentNode:e,e=t.namespaceURI||null,t=t.tagName,e=Ku(e,t)}xt(hi),ht(hi,e)}function Bs(){xt(hi),xt(Ya),xt(qa)}function U_(t){Ir(qa.current);var e=Ir(hi.current),n=Ku(e,t.type);e!==n&&(ht(Ya,t),ht(hi,n))}function Zh(t){Ya.current===t&&(xt(hi),xt(Ya))}var Mt=mr(0);function Wl(t){for(var e=t;e!==null;){if(e.tag===13){var n=e.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return e}else if(e.tag===19&&e.memoizedProps.revealOrder!==void 0){if(e.flags&128)return e}else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return null;e=e.return}e.sibling.return=e.return,e=e.sibling}return null}var Yc=[];function Jh(){for(var t=0;t<Yc.length;t++)Yc[t]._workInProgressVersionPrimary=null;Yc.length=0}var gl=Ii.ReactCurrentDispatcher,qc=Ii.ReactCurrentBatchConfig,zr=0,Et=null,Ut=null,Vt=null,Xl=!1,Pa=!1,Ka=0,Ny=0;function Kt(){throw Error(oe(321))}function Qh(t,e){if(e===null)return!1;for(var n=0;n<e.length&&n<t.length;n++)if(!ai(t[n],e[n]))return!1;return!0}function ef(t,e,n,i,r,s){if(zr=s,Et=e,e.memoizedState=null,e.updateQueue=null,e.lanes=0,gl.current=t===null||t.memoizedState===null?Uy:ky,t=n(i,r),Pa){s=0;do{if(Pa=!1,Ka=0,25<=s)throw Error(oe(301));s+=1,Vt=Ut=null,e.updateQueue=null,gl.current=Fy,t=n(i,r)}while(Pa)}if(gl.current=$l,e=Ut!==null&&Ut.next!==null,zr=0,Vt=Ut=Et=null,Xl=!1,e)throw Error(oe(300));return t}function tf(){var t=Ka!==0;return Ka=0,t}function li(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Vt===null?Et.memoizedState=Vt=t:Vt=Vt.next=t,Vt}function Vn(){if(Ut===null){var t=Et.alternate;t=t!==null?t.memoizedState:null}else t=Ut.next;var e=Vt===null?Et.memoizedState:Vt.next;if(e!==null)Vt=e,Ut=t;else{if(t===null)throw Error(oe(310));Ut=t,t={memoizedState:Ut.memoizedState,baseState:Ut.baseState,baseQueue:Ut.baseQueue,queue:Ut.queue,next:null},Vt===null?Et.memoizedState=Vt=t:Vt=Vt.next=t}return Vt}function Za(t,e){return typeof e=="function"?e(t):e}function Kc(t){var e=Vn(),n=e.queue;if(n===null)throw Error(oe(311));n.lastRenderedReducer=t;var i=Ut,r=i.baseQueue,s=n.pending;if(s!==null){if(r!==null){var a=r.next;r.next=s.next,s.next=a}i.baseQueue=r=s,n.pending=null}if(r!==null){s=r.next,i=i.baseState;var o=a=null,l=null,c=s;do{var u=c.lane;if((zr&u)===u)l!==null&&(l=l.next={lane:0,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null}),i=c.hasEagerState?c.eagerState:t(i,c.action);else{var d={lane:u,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null};l===null?(o=l=d,a=i):l=l.next=d,Et.lanes|=u,Br|=u}c=c.next}while(c!==null&&c!==s);l===null?a=i:l.next=o,ai(i,e.memoizedState)||(_n=!0),e.memoizedState=i,e.baseState=a,e.baseQueue=l,n.lastRenderedState=i}if(t=n.interleaved,t!==null){r=t;do s=r.lane,Et.lanes|=s,Br|=s,r=r.next;while(r!==t)}else r===null&&(n.lanes=0);return[e.memoizedState,n.dispatch]}function Zc(t){var e=Vn(),n=e.queue;if(n===null)throw Error(oe(311));n.lastRenderedReducer=t;var i=n.dispatch,r=n.pending,s=e.memoizedState;if(r!==null){n.pending=null;var a=r=r.next;do s=t(s,a.action),a=a.next;while(a!==r);ai(s,e.memoizedState)||(_n=!0),e.memoizedState=s,e.baseQueue===null&&(e.baseState=s),n.lastRenderedState=s}return[s,i]}function k_(){}function F_(t,e){var n=Et,i=Vn(),r=e(),s=!ai(i.memoizedState,r);if(s&&(i.memoizedState=r,_n=!0),i=i.queue,nf(B_.bind(null,n,i,t),[t]),i.getSnapshot!==e||s||Vt!==null&&Vt.memoizedState.tag&1){if(n.flags|=2048,Ja(9,z_.bind(null,n,i,r,e),void 0,null),jt===null)throw Error(oe(349));zr&30||O_(n,e,r)}return r}function O_(t,e,n){t.flags|=16384,t={getSnapshot:e,value:n},e=Et.updateQueue,e===null?(e={lastEffect:null,stores:null},Et.updateQueue=e,e.stores=[t]):(n=e.stores,n===null?e.stores=[t]:n.push(t))}function z_(t,e,n,i){e.value=n,e.getSnapshot=i,H_(e)&&G_(t)}function B_(t,e,n){return n(function(){H_(e)&&G_(t)})}function H_(t){var e=t.getSnapshot;t=t.value;try{var n=e();return!ai(t,n)}catch{return!0}}function G_(t){var e=Ni(t,1);e!==null&&ri(e,t,1,-1)}function bp(t){var e=li();return typeof t=="function"&&(t=t()),e.memoizedState=e.baseState=t,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Za,lastRenderedState:t},e.queue=t,t=t.dispatch=Iy.bind(null,Et,t),[e.memoizedState,t]}function Ja(t,e,n,i){return t={tag:t,create:e,destroy:n,deps:i,next:null},e=Et.updateQueue,e===null?(e={lastEffect:null,stores:null},Et.updateQueue=e,e.lastEffect=t.next=t):(n=e.lastEffect,n===null?e.lastEffect=t.next=t:(i=n.next,n.next=t,t.next=i,e.lastEffect=t)),t}function V_(){return Vn().memoizedState}function _l(t,e,n,i){var r=li();Et.flags|=t,r.memoizedState=Ja(1|e,n,void 0,i===void 0?null:i)}function fc(t,e,n,i){var r=Vn();i=i===void 0?null:i;var s=void 0;if(Ut!==null){var a=Ut.memoizedState;if(s=a.destroy,i!==null&&Qh(i,a.deps)){r.memoizedState=Ja(e,n,s,i);return}}Et.flags|=t,r.memoizedState=Ja(1|e,n,s,i)}function Cp(t,e){return _l(8390656,8,t,e)}function nf(t,e){return fc(2048,8,t,e)}function j_(t,e){return fc(4,2,t,e)}function W_(t,e){return fc(4,4,t,e)}function X_(t,e){if(typeof e=="function")return t=t(),e(t),function(){e(null)};if(e!=null)return t=t(),e.current=t,function(){e.current=null}}function $_(t,e,n){return n=n!=null?n.concat([t]):null,fc(4,4,X_.bind(null,e,t),n)}function rf(){}function Y_(t,e){var n=Vn();e=e===void 0?null:e;var i=n.memoizedState;return i!==null&&e!==null&&Qh(e,i[1])?i[0]:(n.memoizedState=[t,e],t)}function q_(t,e){var n=Vn();e=e===void 0?null:e;var i=n.memoizedState;return i!==null&&e!==null&&Qh(e,i[1])?i[0]:(t=t(),n.memoizedState=[t,e],t)}function K_(t,e,n){return zr&21?(ai(n,e)||(n=t_(),Et.lanes|=n,Br|=n,t.baseState=!0),e):(t.baseState&&(t.baseState=!1,_n=!0),t.memoizedState=n)}function Ly(t,e){var n=ot;ot=n!==0&&4>n?n:4,t(!0);var i=qc.transition;qc.transition={};try{t(!1),e()}finally{ot=n,qc.transition=i}}function Z_(){return Vn().memoizedState}function Dy(t,e,n){var i=or(t);if(n={lane:i,action:n,hasEagerState:!1,eagerState:null,next:null},J_(t))Q_(e,n);else if(n=D_(t,e,n,i),n!==null){var r=dn();ri(n,t,i,r),e0(n,e,i)}}function Iy(t,e,n){var i=or(t),r={lane:i,action:n,hasEagerState:!1,eagerState:null,next:null};if(J_(t))Q_(e,r);else{var s=t.alternate;if(t.lanes===0&&(s===null||s.lanes===0)&&(s=e.lastRenderedReducer,s!==null))try{var a=e.lastRenderedState,o=s(a,n);if(r.hasEagerState=!0,r.eagerState=o,ai(o,a)){var l=e.interleaved;l===null?(r.next=r,Yh(e)):(r.next=l.next,l.next=r),e.interleaved=r;return}}catch{}finally{}n=D_(t,e,r,i),n!==null&&(r=dn(),ri(n,t,i,r),e0(n,e,i))}}function J_(t){var e=t.alternate;return t===Et||e!==null&&e===Et}function Q_(t,e){Pa=Xl=!0;var n=t.pending;n===null?e.next=e:(e.next=n.next,n.next=e),t.pending=e}function e0(t,e,n){if(n&4194240){var i=e.lanes;i&=t.pendingLanes,n|=i,e.lanes=n,Ih(t,n)}}var $l={readContext:Gn,useCallback:Kt,useContext:Kt,useEffect:Kt,useImperativeHandle:Kt,useInsertionEffect:Kt,useLayoutEffect:Kt,useMemo:Kt,useReducer:Kt,useRef:Kt,useState:Kt,useDebugValue:Kt,useDeferredValue:Kt,useTransition:Kt,useMutableSource:Kt,useSyncExternalStore:Kt,useId:Kt,unstable_isNewReconciler:!1},Uy={readContext:Gn,useCallback:function(t,e){return li().memoizedState=[t,e===void 0?null:e],t},useContext:Gn,useEffect:Cp,useImperativeHandle:function(t,e,n){return n=n!=null?n.concat([t]):null,_l(4194308,4,X_.bind(null,e,t),n)},useLayoutEffect:function(t,e){return _l(4194308,4,t,e)},useInsertionEffect:function(t,e){return _l(4,2,t,e)},useMemo:function(t,e){var n=li();return e=e===void 0?null:e,t=t(),n.memoizedState=[t,e],t},useReducer:function(t,e,n){var i=li();return e=n!==void 0?n(e):e,i.memoizedState=i.baseState=e,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:e},i.queue=t,t=t.dispatch=Dy.bind(null,Et,t),[i.memoizedState,t]},useRef:function(t){var e=li();return t={current:t},e.memoizedState=t},useState:bp,useDebugValue:rf,useDeferredValue:function(t){return li().memoizedState=t},useTransition:function(){var t=bp(!1),e=t[0];return t=Ly.bind(null,t[1]),li().memoizedState=t,[e,t]},useMutableSource:function(){},useSyncExternalStore:function(t,e,n){var i=Et,r=li();if(St){if(n===void 0)throw Error(oe(407));n=n()}else{if(n=e(),jt===null)throw Error(oe(349));zr&30||O_(i,e,n)}r.memoizedState=n;var s={value:n,getSnapshot:e};return r.queue=s,Cp(B_.bind(null,i,s,t),[t]),i.flags|=2048,Ja(9,z_.bind(null,i,s,n,e),void 0,null),n},useId:function(){var t=li(),e=jt.identifierPrefix;if(St){var n=wi,i=Ei;n=(i&~(1<<32-ii(i)-1)).toString(32)+n,e=":"+e+"R"+n,n=Ka++,0<n&&(e+="H"+n.toString(32)),e+=":"}else n=Ny++,e=":"+e+"r"+n.toString(32)+":";return t.memoizedState=e},unstable_isNewReconciler:!1},ky={readContext:Gn,useCallback:Y_,useContext:Gn,useEffect:nf,useImperativeHandle:$_,useInsertionEffect:j_,useLayoutEffect:W_,useMemo:q_,useReducer:Kc,useRef:V_,useState:function(){return Kc(Za)},useDebugValue:rf,useDeferredValue:function(t){var e=Vn();return K_(e,Ut.memoizedState,t)},useTransition:function(){var t=Kc(Za)[0],e=Vn().memoizedState;return[t,e]},useMutableSource:k_,useSyncExternalStore:F_,useId:Z_,unstable_isNewReconciler:!1},Fy={readContext:Gn,useCallback:Y_,useContext:Gn,useEffect:nf,useImperativeHandle:$_,useInsertionEffect:j_,useLayoutEffect:W_,useMemo:q_,useReducer:Zc,useRef:V_,useState:function(){return Zc(Za)},useDebugValue:rf,useDeferredValue:function(t){var e=Vn();return Ut===null?e.memoizedState=t:K_(e,Ut.memoizedState,t)},useTransition:function(){var t=Zc(Za)[0],e=Vn().memoizedState;return[t,e]},useMutableSource:k_,useSyncExternalStore:F_,useId:Z_,unstable_isNewReconciler:!1};function Zn(t,e){if(t&&t.defaultProps){e=wt({},e),t=t.defaultProps;for(var n in t)e[n]===void 0&&(e[n]=t[n]);return e}return e}function _d(t,e,n,i){e=t.memoizedState,n=n(i,e),n=n==null?e:wt({},e,n),t.memoizedState=n,t.lanes===0&&(t.updateQueue.baseState=n)}var pc={isMounted:function(t){return(t=t._reactInternals)?Wr(t)===t:!1},enqueueSetState:function(t,e,n){t=t._reactInternals;var i=dn(),r=or(t),s=bi(i,r);s.payload=e,n!=null&&(s.callback=n),e=sr(t,s,r),e!==null&&(ri(e,t,r,i),ml(e,t,r))},enqueueReplaceState:function(t,e,n){t=t._reactInternals;var i=dn(),r=or(t),s=bi(i,r);s.tag=1,s.payload=e,n!=null&&(s.callback=n),e=sr(t,s,r),e!==null&&(ri(e,t,r,i),ml(e,t,r))},enqueueForceUpdate:function(t,e){t=t._reactInternals;var n=dn(),i=or(t),r=bi(n,i);r.tag=2,e!=null&&(r.callback=e),e=sr(t,r,i),e!==null&&(ri(e,t,i,n),ml(e,t,i))}};function Rp(t,e,n,i,r,s,a){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(i,s,a):e.prototype&&e.prototype.isPureReactComponent?!ja(n,i)||!ja(r,s):!0}function t0(t,e,n){var i=!1,r=hr,s=e.contextType;return typeof s=="object"&&s!==null?s=Gn(s):(r=xn(e)?Fr:sn.current,i=e.contextTypes,s=(i=i!=null)?Fs(t,r):hr),e=new e(n,s),t.memoizedState=e.state!==null&&e.state!==void 0?e.state:null,e.updater=pc,t.stateNode=e,e._reactInternals=t,i&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=r,t.__reactInternalMemoizedMaskedChildContext=s),e}function Pp(t,e,n,i){t=e.state,typeof e.componentWillReceiveProps=="function"&&e.componentWillReceiveProps(n,i),typeof e.UNSAFE_componentWillReceiveProps=="function"&&e.UNSAFE_componentWillReceiveProps(n,i),e.state!==t&&pc.enqueueReplaceState(e,e.state,null)}function vd(t,e,n,i){var r=t.stateNode;r.props=n,r.state=t.memoizedState,r.refs={},qh(t);var s=e.contextType;typeof s=="object"&&s!==null?r.context=Gn(s):(s=xn(e)?Fr:sn.current,r.context=Fs(t,s)),r.state=t.memoizedState,s=e.getDerivedStateFromProps,typeof s=="function"&&(_d(t,e,s,n),r.state=t.memoizedState),typeof e.getDerivedStateFromProps=="function"||typeof r.getSnapshotBeforeUpdate=="function"||typeof r.UNSAFE_componentWillMount!="function"&&typeof r.componentWillMount!="function"||(e=r.state,typeof r.componentWillMount=="function"&&r.componentWillMount(),typeof r.UNSAFE_componentWillMount=="function"&&r.UNSAFE_componentWillMount(),e!==r.state&&pc.enqueueReplaceState(r,r.state,null),jl(t,n,r,i),r.state=t.memoizedState),typeof r.componentDidMount=="function"&&(t.flags|=4194308)}function Hs(t,e){try{var n="",i=e;do n+=dx(i),i=i.return;while(i);var r=n}catch(s){r=`
Error generating stack: `+s.message+`
`+s.stack}return{value:t,source:e,stack:r,digest:null}}function Jc(t,e,n){return{value:t,source:null,stack:n??null,digest:e??null}}function xd(t,e){try{console.error(e.value)}catch(n){setTimeout(function(){throw n})}}var Oy=typeof WeakMap=="function"?WeakMap:Map;function n0(t,e,n){n=bi(-1,n),n.tag=3,n.payload={element:null};var i=e.value;return n.callback=function(){ql||(ql=!0,Rd=i),xd(t,e)},n}function i0(t,e,n){n=bi(-1,n),n.tag=3;var i=t.type.getDerivedStateFromError;if(typeof i=="function"){var r=e.value;n.payload=function(){return i(r)},n.callback=function(){xd(t,e)}}var s=t.stateNode;return s!==null&&typeof s.componentDidCatch=="function"&&(n.callback=function(){xd(t,e),typeof i!="function"&&(ar===null?ar=new Set([this]):ar.add(this));var a=e.stack;this.componentDidCatch(e.value,{componentStack:a!==null?a:""})}),n}function Np(t,e,n){var i=t.pingCache;if(i===null){i=t.pingCache=new Oy;var r=new Set;i.set(e,r)}else r=i.get(e),r===void 0&&(r=new Set,i.set(e,r));r.has(n)||(r.add(n),t=Jy.bind(null,t,e,n),e.then(t,t))}function Lp(t){do{var e;if((e=t.tag===13)&&(e=t.memoizedState,e=e!==null?e.dehydrated!==null:!0),e)return t;t=t.return}while(t!==null);return null}function Dp(t,e,n,i,r){return t.mode&1?(t.flags|=65536,t.lanes=r,t):(t===e?t.flags|=65536:(t.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(e=bi(-1,1),e.tag=2,sr(n,e,1))),n.lanes|=1),t)}var zy=Ii.ReactCurrentOwner,_n=!1;function ln(t,e,n,i){e.child=t===null?L_(e,null,n,i):zs(e,t.child,n,i)}function Ip(t,e,n,i,r){n=n.render;var s=e.ref;return Ns(e,r),i=ef(t,e,n,i,s,r),n=tf(),t!==null&&!_n?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~r,Li(t,e,r)):(St&&n&&Gh(e),e.flags|=1,ln(t,e,i,r),e.child)}function Up(t,e,n,i,r){if(t===null){var s=n.type;return typeof s=="function"&&!hf(s)&&s.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(e.tag=15,e.type=s,r0(t,e,s,i,r)):(t=Sl(n.type,null,i,e,e.mode,r),t.ref=e.ref,t.return=e,e.child=t)}if(s=t.child,!(t.lanes&r)){var a=s.memoizedProps;if(n=n.compare,n=n!==null?n:ja,n(a,i)&&t.ref===e.ref)return Li(t,e,r)}return e.flags|=1,t=lr(s,i),t.ref=e.ref,t.return=e,e.child=t}function r0(t,e,n,i,r){if(t!==null){var s=t.memoizedProps;if(ja(s,i)&&t.ref===e.ref)if(_n=!1,e.pendingProps=i=s,(t.lanes&r)!==0)t.flags&131072&&(_n=!0);else return e.lanes=t.lanes,Li(t,e,r)}return yd(t,e,n,i,r)}function s0(t,e,n){var i=e.pendingProps,r=i.children,s=t!==null?t.memoizedState:null;if(i.mode==="hidden")if(!(e.mode&1))e.memoizedState={baseLanes:0,cachePool:null,transitions:null},ht(ws,An),An|=n;else{if(!(n&1073741824))return t=s!==null?s.baseLanes|n:n,e.lanes=e.childLanes=1073741824,e.memoizedState={baseLanes:t,cachePool:null,transitions:null},e.updateQueue=null,ht(ws,An),An|=t,null;e.memoizedState={baseLanes:0,cachePool:null,transitions:null},i=s!==null?s.baseLanes:n,ht(ws,An),An|=i}else s!==null?(i=s.baseLanes|n,e.memoizedState=null):i=n,ht(ws,An),An|=i;return ln(t,e,r,n),e.child}function a0(t,e){var n=e.ref;(t===null&&n!==null||t!==null&&t.ref!==n)&&(e.flags|=512,e.flags|=2097152)}function yd(t,e,n,i,r){var s=xn(n)?Fr:sn.current;return s=Fs(e,s),Ns(e,r),n=ef(t,e,n,i,s,r),i=tf(),t!==null&&!_n?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~r,Li(t,e,r)):(St&&i&&Gh(e),e.flags|=1,ln(t,e,n,r),e.child)}function kp(t,e,n,i,r){if(xn(n)){var s=!0;zl(e)}else s=!1;if(Ns(e,r),e.stateNode===null)vl(t,e),t0(e,n,i),vd(e,n,i,r),i=!0;else if(t===null){var a=e.stateNode,o=e.memoizedProps;a.props=o;var l=a.context,c=n.contextType;typeof c=="object"&&c!==null?c=Gn(c):(c=xn(n)?Fr:sn.current,c=Fs(e,c));var u=n.getDerivedStateFromProps,d=typeof u=="function"||typeof a.getSnapshotBeforeUpdate=="function";d||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(o!==i||l!==c)&&Pp(e,a,i,c),ji=!1;var f=e.memoizedState;a.state=f,jl(e,i,a,r),l=e.memoizedState,o!==i||f!==l||vn.current||ji?(typeof u=="function"&&(_d(e,n,u,i),l=e.memoizedState),(o=ji||Rp(e,n,o,i,f,l,c))?(d||typeof a.UNSAFE_componentWillMount!="function"&&typeof a.componentWillMount!="function"||(typeof a.componentWillMount=="function"&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount=="function"&&a.UNSAFE_componentWillMount()),typeof a.componentDidMount=="function"&&(e.flags|=4194308)):(typeof a.componentDidMount=="function"&&(e.flags|=4194308),e.memoizedProps=i,e.memoizedState=l),a.props=i,a.state=l,a.context=c,i=o):(typeof a.componentDidMount=="function"&&(e.flags|=4194308),i=!1)}else{a=e.stateNode,I_(t,e),o=e.memoizedProps,c=e.type===e.elementType?o:Zn(e.type,o),a.props=c,d=e.pendingProps,f=a.context,l=n.contextType,typeof l=="object"&&l!==null?l=Gn(l):(l=xn(n)?Fr:sn.current,l=Fs(e,l));var p=n.getDerivedStateFromProps;(u=typeof p=="function"||typeof a.getSnapshotBeforeUpdate=="function")||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(o!==d||f!==l)&&Pp(e,a,i,l),ji=!1,f=e.memoizedState,a.state=f,jl(e,i,a,r);var _=e.memoizedState;o!==d||f!==_||vn.current||ji?(typeof p=="function"&&(_d(e,n,p,i),_=e.memoizedState),(c=ji||Rp(e,n,c,i,f,_,l)||!1)?(u||typeof a.UNSAFE_componentWillUpdate!="function"&&typeof a.componentWillUpdate!="function"||(typeof a.componentWillUpdate=="function"&&a.componentWillUpdate(i,_,l),typeof a.UNSAFE_componentWillUpdate=="function"&&a.UNSAFE_componentWillUpdate(i,_,l)),typeof a.componentDidUpdate=="function"&&(e.flags|=4),typeof a.getSnapshotBeforeUpdate=="function"&&(e.flags|=1024)):(typeof a.componentDidUpdate!="function"||o===t.memoizedProps&&f===t.memoizedState||(e.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||o===t.memoizedProps&&f===t.memoizedState||(e.flags|=1024),e.memoizedProps=i,e.memoizedState=_),a.props=i,a.state=_,a.context=l,i=c):(typeof a.componentDidUpdate!="function"||o===t.memoizedProps&&f===t.memoizedState||(e.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||o===t.memoizedProps&&f===t.memoizedState||(e.flags|=1024),i=!1)}return Sd(t,e,n,i,s,r)}function Sd(t,e,n,i,r,s){a0(t,e);var a=(e.flags&128)!==0;if(!i&&!a)return r&&Sp(e,n,!1),Li(t,e,s);i=e.stateNode,zy.current=e;var o=a&&typeof n.getDerivedStateFromError!="function"?null:i.render();return e.flags|=1,t!==null&&a?(e.child=zs(e,t.child,null,s),e.child=zs(e,null,o,s)):ln(t,e,o,s),e.memoizedState=i.state,r&&Sp(e,n,!0),e.child}function o0(t){var e=t.stateNode;e.pendingContext?yp(t,e.pendingContext,e.pendingContext!==e.context):e.context&&yp(t,e.context,!1),Kh(t,e.containerInfo)}function Fp(t,e,n,i,r){return Os(),jh(r),e.flags|=256,ln(t,e,n,i),e.child}var Md={dehydrated:null,treeContext:null,retryLane:0};function Ed(t){return{baseLanes:t,cachePool:null,transitions:null}}function l0(t,e,n){var i=e.pendingProps,r=Mt.current,s=!1,a=(e.flags&128)!==0,o;if((o=a)||(o=t!==null&&t.memoizedState===null?!1:(r&2)!==0),o?(s=!0,e.flags&=-129):(t===null||t.memoizedState!==null)&&(r|=1),ht(Mt,r&1),t===null)return md(e),t=e.memoizedState,t!==null&&(t=t.dehydrated,t!==null)?(e.mode&1?t.data==="$!"?e.lanes=8:e.lanes=1073741824:e.lanes=1,null):(a=i.children,t=i.fallback,s?(i=e.mode,s=e.child,a={mode:"hidden",children:a},!(i&1)&&s!==null?(s.childLanes=0,s.pendingProps=a):s=_c(a,i,0,null),t=kr(t,i,n,null),s.return=e,t.return=e,s.sibling=t,e.child=s,e.child.memoizedState=Ed(n),e.memoizedState=Md,t):sf(e,a));if(r=t.memoizedState,r!==null&&(o=r.dehydrated,o!==null))return By(t,e,a,i,o,r,n);if(s){s=i.fallback,a=e.mode,r=t.child,o=r.sibling;var l={mode:"hidden",children:i.children};return!(a&1)&&e.child!==r?(i=e.child,i.childLanes=0,i.pendingProps=l,e.deletions=null):(i=lr(r,l),i.subtreeFlags=r.subtreeFlags&14680064),o!==null?s=lr(o,s):(s=kr(s,a,n,null),s.flags|=2),s.return=e,i.return=e,i.sibling=s,e.child=i,i=s,s=e.child,a=t.child.memoizedState,a=a===null?Ed(n):{baseLanes:a.baseLanes|n,cachePool:null,transitions:a.transitions},s.memoizedState=a,s.childLanes=t.childLanes&~n,e.memoizedState=Md,i}return s=t.child,t=s.sibling,i=lr(s,{mode:"visible",children:i.children}),!(e.mode&1)&&(i.lanes=n),i.return=e,i.sibling=null,t!==null&&(n=e.deletions,n===null?(e.deletions=[t],e.flags|=16):n.push(t)),e.child=i,e.memoizedState=null,i}function sf(t,e){return e=_c({mode:"visible",children:e},t.mode,0,null),e.return=t,t.child=e}function Po(t,e,n,i){return i!==null&&jh(i),zs(e,t.child,null,n),t=sf(e,e.pendingProps.children),t.flags|=2,e.memoizedState=null,t}function By(t,e,n,i,r,s,a){if(n)return e.flags&256?(e.flags&=-257,i=Jc(Error(oe(422))),Po(t,e,a,i)):e.memoizedState!==null?(e.child=t.child,e.flags|=128,null):(s=i.fallback,r=e.mode,i=_c({mode:"visible",children:i.children},r,0,null),s=kr(s,r,a,null),s.flags|=2,i.return=e,s.return=e,i.sibling=s,e.child=i,e.mode&1&&zs(e,t.child,null,a),e.child.memoizedState=Ed(a),e.memoizedState=Md,s);if(!(e.mode&1))return Po(t,e,a,null);if(r.data==="$!"){if(i=r.nextSibling&&r.nextSibling.dataset,i)var o=i.dgst;return i=o,s=Error(oe(419)),i=Jc(s,i,void 0),Po(t,e,a,i)}if(o=(a&t.childLanes)!==0,_n||o){if(i=jt,i!==null){switch(a&-a){case 4:r=2;break;case 16:r=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:r=32;break;case 536870912:r=268435456;break;default:r=0}r=r&(i.suspendedLanes|a)?0:r,r!==0&&r!==s.retryLane&&(s.retryLane=r,Ni(t,r),ri(i,t,r,-1))}return df(),i=Jc(Error(oe(421))),Po(t,e,a,i)}return r.data==="$?"?(e.flags|=128,e.child=t.child,e=Qy.bind(null,t),r._reactRetry=e,null):(t=s.treeContext,bn=rr(r.nextSibling),Cn=e,St=!0,Qn=null,t!==null&&(Un[kn++]=Ei,Un[kn++]=wi,Un[kn++]=Or,Ei=t.id,wi=t.overflow,Or=e),e=sf(e,i.children),e.flags|=4096,e)}function Op(t,e,n){t.lanes|=e;var i=t.alternate;i!==null&&(i.lanes|=e),gd(t.return,e,n)}function Qc(t,e,n,i,r){var s=t.memoizedState;s===null?t.memoizedState={isBackwards:e,rendering:null,renderingStartTime:0,last:i,tail:n,tailMode:r}:(s.isBackwards=e,s.rendering=null,s.renderingStartTime=0,s.last=i,s.tail=n,s.tailMode=r)}function c0(t,e,n){var i=e.pendingProps,r=i.revealOrder,s=i.tail;if(ln(t,e,i.children,n),i=Mt.current,i&2)i=i&1|2,e.flags|=128;else{if(t!==null&&t.flags&128)e:for(t=e.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&Op(t,n,e);else if(t.tag===19)Op(t,n,e);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break e;for(;t.sibling===null;){if(t.return===null||t.return===e)break e;t=t.return}t.sibling.return=t.return,t=t.sibling}i&=1}if(ht(Mt,i),!(e.mode&1))e.memoizedState=null;else switch(r){case"forwards":for(n=e.child,r=null;n!==null;)t=n.alternate,t!==null&&Wl(t)===null&&(r=n),n=n.sibling;n=r,n===null?(r=e.child,e.child=null):(r=n.sibling,n.sibling=null),Qc(e,!1,r,n,s);break;case"backwards":for(n=null,r=e.child,e.child=null;r!==null;){if(t=r.alternate,t!==null&&Wl(t)===null){e.child=r;break}t=r.sibling,r.sibling=n,n=r,r=t}Qc(e,!0,n,null,s);break;case"together":Qc(e,!1,null,null,void 0);break;default:e.memoizedState=null}return e.child}function vl(t,e){!(e.mode&1)&&t!==null&&(t.alternate=null,e.alternate=null,e.flags|=2)}function Li(t,e,n){if(t!==null&&(e.dependencies=t.dependencies),Br|=e.lanes,!(n&e.childLanes))return null;if(t!==null&&e.child!==t.child)throw Error(oe(153));if(e.child!==null){for(t=e.child,n=lr(t,t.pendingProps),e.child=n,n.return=e;t.sibling!==null;)t=t.sibling,n=n.sibling=lr(t,t.pendingProps),n.return=e;n.sibling=null}return e.child}function Hy(t,e,n){switch(e.tag){case 3:o0(e),Os();break;case 5:U_(e);break;case 1:xn(e.type)&&zl(e);break;case 4:Kh(e,e.stateNode.containerInfo);break;case 10:var i=e.type._context,r=e.memoizedProps.value;ht(Gl,i._currentValue),i._currentValue=r;break;case 13:if(i=e.memoizedState,i!==null)return i.dehydrated!==null?(ht(Mt,Mt.current&1),e.flags|=128,null):n&e.child.childLanes?l0(t,e,n):(ht(Mt,Mt.current&1),t=Li(t,e,n),t!==null?t.sibling:null);ht(Mt,Mt.current&1);break;case 19:if(i=(n&e.childLanes)!==0,t.flags&128){if(i)return c0(t,e,n);e.flags|=128}if(r=e.memoizedState,r!==null&&(r.rendering=null,r.tail=null,r.lastEffect=null),ht(Mt,Mt.current),i)break;return null;case 22:case 23:return e.lanes=0,s0(t,e,n)}return Li(t,e,n)}var u0,wd,d0,h0;u0=function(t,e){for(var n=e.child;n!==null;){if(n.tag===5||n.tag===6)t.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};wd=function(){};d0=function(t,e,n,i){var r=t.memoizedProps;if(r!==i){t=e.stateNode,Ir(hi.current);var s=null;switch(n){case"input":r=Xu(t,r),i=Xu(t,i),s=[];break;case"select":r=wt({},r,{value:void 0}),i=wt({},i,{value:void 0}),s=[];break;case"textarea":r=qu(t,r),i=qu(t,i),s=[];break;default:typeof r.onClick!="function"&&typeof i.onClick=="function"&&(t.onclick=Fl)}Zu(n,i);var a;n=null;for(c in r)if(!i.hasOwnProperty(c)&&r.hasOwnProperty(c)&&r[c]!=null)if(c==="style"){var o=r[c];for(a in o)o.hasOwnProperty(a)&&(n||(n={}),n[a]="")}else c!=="dangerouslySetInnerHTML"&&c!=="children"&&c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&c!=="autoFocus"&&(Fa.hasOwnProperty(c)?s||(s=[]):(s=s||[]).push(c,null));for(c in i){var l=i[c];if(o=r!=null?r[c]:void 0,i.hasOwnProperty(c)&&l!==o&&(l!=null||o!=null))if(c==="style")if(o){for(a in o)!o.hasOwnProperty(a)||l&&l.hasOwnProperty(a)||(n||(n={}),n[a]="");for(a in l)l.hasOwnProperty(a)&&o[a]!==l[a]&&(n||(n={}),n[a]=l[a])}else n||(s||(s=[]),s.push(c,n)),n=l;else c==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,o=o?o.__html:void 0,l!=null&&o!==l&&(s=s||[]).push(c,l)):c==="children"?typeof l!="string"&&typeof l!="number"||(s=s||[]).push(c,""+l):c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&(Fa.hasOwnProperty(c)?(l!=null&&c==="onScroll"&&mt("scroll",t),s||o===l||(s=[])):(s=s||[]).push(c,l))}n&&(s=s||[]).push("style",n);var c=s;(e.updateQueue=c)&&(e.flags|=4)}};h0=function(t,e,n,i){n!==i&&(e.flags|=4)};function oa(t,e){if(!St)switch(t.tailMode){case"hidden":e=t.tail;for(var n=null;e!==null;)e.alternate!==null&&(n=e),e=e.sibling;n===null?t.tail=null:n.sibling=null;break;case"collapsed":n=t.tail;for(var i=null;n!==null;)n.alternate!==null&&(i=n),n=n.sibling;i===null?e||t.tail===null?t.tail=null:t.tail.sibling=null:i.sibling=null}}function Zt(t){var e=t.alternate!==null&&t.alternate.child===t.child,n=0,i=0;if(e)for(var r=t.child;r!==null;)n|=r.lanes|r.childLanes,i|=r.subtreeFlags&14680064,i|=r.flags&14680064,r.return=t,r=r.sibling;else for(r=t.child;r!==null;)n|=r.lanes|r.childLanes,i|=r.subtreeFlags,i|=r.flags,r.return=t,r=r.sibling;return t.subtreeFlags|=i,t.childLanes=n,e}function Gy(t,e,n){var i=e.pendingProps;switch(Vh(e),e.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Zt(e),null;case 1:return xn(e.type)&&Ol(),Zt(e),null;case 3:return i=e.stateNode,Bs(),xt(vn),xt(sn),Jh(),i.pendingContext&&(i.context=i.pendingContext,i.pendingContext=null),(t===null||t.child===null)&&(Co(e)?e.flags|=4:t===null||t.memoizedState.isDehydrated&&!(e.flags&256)||(e.flags|=1024,Qn!==null&&(Ld(Qn),Qn=null))),wd(t,e),Zt(e),null;case 5:Zh(e);var r=Ir(qa.current);if(n=e.type,t!==null&&e.stateNode!=null)d0(t,e,n,i,r),t.ref!==e.ref&&(e.flags|=512,e.flags|=2097152);else{if(!i){if(e.stateNode===null)throw Error(oe(166));return Zt(e),null}if(t=Ir(hi.current),Co(e)){i=e.stateNode,n=e.type;var s=e.memoizedProps;switch(i[ui]=e,i[$a]=s,t=(e.mode&1)!==0,n){case"dialog":mt("cancel",i),mt("close",i);break;case"iframe":case"object":case"embed":mt("load",i);break;case"video":case"audio":for(r=0;r<Ea.length;r++)mt(Ea[r],i);break;case"source":mt("error",i);break;case"img":case"image":case"link":mt("error",i),mt("load",i);break;case"details":mt("toggle",i);break;case"input":$f(i,s),mt("invalid",i);break;case"select":i._wrapperState={wasMultiple:!!s.multiple},mt("invalid",i);break;case"textarea":qf(i,s),mt("invalid",i)}Zu(n,s),r=null;for(var a in s)if(s.hasOwnProperty(a)){var o=s[a];a==="children"?typeof o=="string"?i.textContent!==o&&(s.suppressHydrationWarning!==!0&&bo(i.textContent,o,t),r=["children",o]):typeof o=="number"&&i.textContent!==""+o&&(s.suppressHydrationWarning!==!0&&bo(i.textContent,o,t),r=["children",""+o]):Fa.hasOwnProperty(a)&&o!=null&&a==="onScroll"&&mt("scroll",i)}switch(n){case"input":xo(i),Yf(i,s,!0);break;case"textarea":xo(i),Kf(i);break;case"select":case"option":break;default:typeof s.onClick=="function"&&(i.onclick=Fl)}i=r,e.updateQueue=i,i!==null&&(e.flags|=4)}else{a=r.nodeType===9?r:r.ownerDocument,t==="http://www.w3.org/1999/xhtml"&&(t=Bg(n)),t==="http://www.w3.org/1999/xhtml"?n==="script"?(t=a.createElement("div"),t.innerHTML="<script><\/script>",t=t.removeChild(t.firstChild)):typeof i.is=="string"?t=a.createElement(n,{is:i.is}):(t=a.createElement(n),n==="select"&&(a=t,i.multiple?a.multiple=!0:i.size&&(a.size=i.size))):t=a.createElementNS(t,n),t[ui]=e,t[$a]=i,u0(t,e,!1,!1),e.stateNode=t;e:{switch(a=Ju(n,i),n){case"dialog":mt("cancel",t),mt("close",t),r=i;break;case"iframe":case"object":case"embed":mt("load",t),r=i;break;case"video":case"audio":for(r=0;r<Ea.length;r++)mt(Ea[r],t);r=i;break;case"source":mt("error",t),r=i;break;case"img":case"image":case"link":mt("error",t),mt("load",t),r=i;break;case"details":mt("toggle",t),r=i;break;case"input":$f(t,i),r=Xu(t,i),mt("invalid",t);break;case"option":r=i;break;case"select":t._wrapperState={wasMultiple:!!i.multiple},r=wt({},i,{value:void 0}),mt("invalid",t);break;case"textarea":qf(t,i),r=qu(t,i),mt("invalid",t);break;default:r=i}Zu(n,r),o=r;for(s in o)if(o.hasOwnProperty(s)){var l=o[s];s==="style"?Vg(t,l):s==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,l!=null&&Hg(t,l)):s==="children"?typeof l=="string"?(n!=="textarea"||l!=="")&&Oa(t,l):typeof l=="number"&&Oa(t,""+l):s!=="suppressContentEditableWarning"&&s!=="suppressHydrationWarning"&&s!=="autoFocus"&&(Fa.hasOwnProperty(s)?l!=null&&s==="onScroll"&&mt("scroll",t):l!=null&&Ch(t,s,l,a))}switch(n){case"input":xo(t),Yf(t,i,!1);break;case"textarea":xo(t),Kf(t);break;case"option":i.value!=null&&t.setAttribute("value",""+dr(i.value));break;case"select":t.multiple=!!i.multiple,s=i.value,s!=null?bs(t,!!i.multiple,s,!1):i.defaultValue!=null&&bs(t,!!i.multiple,i.defaultValue,!0);break;default:typeof r.onClick=="function"&&(t.onclick=Fl)}switch(n){case"button":case"input":case"select":case"textarea":i=!!i.autoFocus;break e;case"img":i=!0;break e;default:i=!1}}i&&(e.flags|=4)}e.ref!==null&&(e.flags|=512,e.flags|=2097152)}return Zt(e),null;case 6:if(t&&e.stateNode!=null)h0(t,e,t.memoizedProps,i);else{if(typeof i!="string"&&e.stateNode===null)throw Error(oe(166));if(n=Ir(qa.current),Ir(hi.current),Co(e)){if(i=e.stateNode,n=e.memoizedProps,i[ui]=e,(s=i.nodeValue!==n)&&(t=Cn,t!==null))switch(t.tag){case 3:bo(i.nodeValue,n,(t.mode&1)!==0);break;case 5:t.memoizedProps.suppressHydrationWarning!==!0&&bo(i.nodeValue,n,(t.mode&1)!==0)}s&&(e.flags|=4)}else i=(n.nodeType===9?n:n.ownerDocument).createTextNode(i),i[ui]=e,e.stateNode=i}return Zt(e),null;case 13:if(xt(Mt),i=e.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(St&&bn!==null&&e.mode&1&&!(e.flags&128))P_(),Os(),e.flags|=98560,s=!1;else if(s=Co(e),i!==null&&i.dehydrated!==null){if(t===null){if(!s)throw Error(oe(318));if(s=e.memoizedState,s=s!==null?s.dehydrated:null,!s)throw Error(oe(317));s[ui]=e}else Os(),!(e.flags&128)&&(e.memoizedState=null),e.flags|=4;Zt(e),s=!1}else Qn!==null&&(Ld(Qn),Qn=null),s=!0;if(!s)return e.flags&65536?e:null}return e.flags&128?(e.lanes=n,e):(i=i!==null,i!==(t!==null&&t.memoizedState!==null)&&i&&(e.child.flags|=8192,e.mode&1&&(t===null||Mt.current&1?kt===0&&(kt=3):df())),e.updateQueue!==null&&(e.flags|=4),Zt(e),null);case 4:return Bs(),wd(t,e),t===null&&Wa(e.stateNode.containerInfo),Zt(e),null;case 10:return $h(e.type._context),Zt(e),null;case 17:return xn(e.type)&&Ol(),Zt(e),null;case 19:if(xt(Mt),s=e.memoizedState,s===null)return Zt(e),null;if(i=(e.flags&128)!==0,a=s.rendering,a===null)if(i)oa(s,!1);else{if(kt!==0||t!==null&&t.flags&128)for(t=e.child;t!==null;){if(a=Wl(t),a!==null){for(e.flags|=128,oa(s,!1),i=a.updateQueue,i!==null&&(e.updateQueue=i,e.flags|=4),e.subtreeFlags=0,i=n,n=e.child;n!==null;)s=n,t=i,s.flags&=14680066,a=s.alternate,a===null?(s.childLanes=0,s.lanes=t,s.child=null,s.subtreeFlags=0,s.memoizedProps=null,s.memoizedState=null,s.updateQueue=null,s.dependencies=null,s.stateNode=null):(s.childLanes=a.childLanes,s.lanes=a.lanes,s.child=a.child,s.subtreeFlags=0,s.deletions=null,s.memoizedProps=a.memoizedProps,s.memoizedState=a.memoizedState,s.updateQueue=a.updateQueue,s.type=a.type,t=a.dependencies,s.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),n=n.sibling;return ht(Mt,Mt.current&1|2),e.child}t=t.sibling}s.tail!==null&&Pt()>Gs&&(e.flags|=128,i=!0,oa(s,!1),e.lanes=4194304)}else{if(!i)if(t=Wl(a),t!==null){if(e.flags|=128,i=!0,n=t.updateQueue,n!==null&&(e.updateQueue=n,e.flags|=4),oa(s,!0),s.tail===null&&s.tailMode==="hidden"&&!a.alternate&&!St)return Zt(e),null}else 2*Pt()-s.renderingStartTime>Gs&&n!==1073741824&&(e.flags|=128,i=!0,oa(s,!1),e.lanes=4194304);s.isBackwards?(a.sibling=e.child,e.child=a):(n=s.last,n!==null?n.sibling=a:e.child=a,s.last=a)}return s.tail!==null?(e=s.tail,s.rendering=e,s.tail=e.sibling,s.renderingStartTime=Pt(),e.sibling=null,n=Mt.current,ht(Mt,i?n&1|2:n&1),e):(Zt(e),null);case 22:case 23:return uf(),i=e.memoizedState!==null,t!==null&&t.memoizedState!==null!==i&&(e.flags|=8192),i&&e.mode&1?An&1073741824&&(Zt(e),e.subtreeFlags&6&&(e.flags|=8192)):Zt(e),null;case 24:return null;case 25:return null}throw Error(oe(156,e.tag))}function Vy(t,e){switch(Vh(e),e.tag){case 1:return xn(e.type)&&Ol(),t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 3:return Bs(),xt(vn),xt(sn),Jh(),t=e.flags,t&65536&&!(t&128)?(e.flags=t&-65537|128,e):null;case 5:return Zh(e),null;case 13:if(xt(Mt),t=e.memoizedState,t!==null&&t.dehydrated!==null){if(e.alternate===null)throw Error(oe(340));Os()}return t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 19:return xt(Mt),null;case 4:return Bs(),null;case 10:return $h(e.type._context),null;case 22:case 23:return uf(),null;case 24:return null;default:return null}}var No=!1,nn=!1,jy=typeof WeakSet=="function"?WeakSet:Set,xe=null;function Es(t,e){var n=t.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(i){Ct(t,e,i)}else n.current=null}function Td(t,e,n){try{n()}catch(i){Ct(t,e,i)}}var zp=!1;function Wy(t,e){if(ld=Il,t=__(),Hh(t)){if("selectionStart"in t)var n={start:t.selectionStart,end:t.selectionEnd};else e:{n=(n=t.ownerDocument)&&n.defaultView||window;var i=n.getSelection&&n.getSelection();if(i&&i.rangeCount!==0){n=i.anchorNode;var r=i.anchorOffset,s=i.focusNode;i=i.focusOffset;try{n.nodeType,s.nodeType}catch{n=null;break e}var a=0,o=-1,l=-1,c=0,u=0,d=t,f=null;t:for(;;){for(var p;d!==n||r!==0&&d.nodeType!==3||(o=a+r),d!==s||i!==0&&d.nodeType!==3||(l=a+i),d.nodeType===3&&(a+=d.nodeValue.length),(p=d.firstChild)!==null;)f=d,d=p;for(;;){if(d===t)break t;if(f===n&&++c===r&&(o=a),f===s&&++u===i&&(l=a),(p=d.nextSibling)!==null)break;d=f,f=d.parentNode}d=p}n=o===-1||l===-1?null:{start:o,end:l}}else n=null}n=n||{start:0,end:0}}else n=null;for(cd={focusedElem:t,selectionRange:n},Il=!1,xe=e;xe!==null;)if(e=xe,t=e.child,(e.subtreeFlags&1028)!==0&&t!==null)t.return=e,xe=t;else for(;xe!==null;){e=xe;try{var _=e.alternate;if(e.flags&1024)switch(e.tag){case 0:case 11:case 15:break;case 1:if(_!==null){var v=_.memoizedProps,m=_.memoizedState,h=e.stateNode,x=h.getSnapshotBeforeUpdate(e.elementType===e.type?v:Zn(e.type,v),m);h.__reactInternalSnapshotBeforeUpdate=x}break;case 3:var S=e.stateNode.containerInfo;S.nodeType===1?S.textContent="":S.nodeType===9&&S.documentElement&&S.removeChild(S.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(oe(163))}}catch(M){Ct(e,e.return,M)}if(t=e.sibling,t!==null){t.return=e.return,xe=t;break}xe=e.return}return _=zp,zp=!1,_}function Na(t,e,n){var i=e.updateQueue;if(i=i!==null?i.lastEffect:null,i!==null){var r=i=i.next;do{if((r.tag&t)===t){var s=r.destroy;r.destroy=void 0,s!==void 0&&Td(e,n,s)}r=r.next}while(r!==i)}}function mc(t,e){if(e=e.updateQueue,e=e!==null?e.lastEffect:null,e!==null){var n=e=e.next;do{if((n.tag&t)===t){var i=n.create;n.destroy=i()}n=n.next}while(n!==e)}}function Ad(t){var e=t.ref;if(e!==null){var n=t.stateNode;switch(t.tag){case 5:t=n;break;default:t=n}typeof e=="function"?e(t):e.current=t}}function f0(t){var e=t.alternate;e!==null&&(t.alternate=null,f0(e)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(e=t.stateNode,e!==null&&(delete e[ui],delete e[$a],delete e[hd],delete e[by],delete e[Cy])),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}function p0(t){return t.tag===5||t.tag===3||t.tag===4}function Bp(t){e:for(;;){for(;t.sibling===null;){if(t.return===null||p0(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.flags&2||t.child===null||t.tag===4)continue e;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function bd(t,e,n){var i=t.tag;if(i===5||i===6)t=t.stateNode,e?n.nodeType===8?n.parentNode.insertBefore(t,e):n.insertBefore(t,e):(n.nodeType===8?(e=n.parentNode,e.insertBefore(t,n)):(e=n,e.appendChild(t)),n=n._reactRootContainer,n!=null||e.onclick!==null||(e.onclick=Fl));else if(i!==4&&(t=t.child,t!==null))for(bd(t,e,n),t=t.sibling;t!==null;)bd(t,e,n),t=t.sibling}function Cd(t,e,n){var i=t.tag;if(i===5||i===6)t=t.stateNode,e?n.insertBefore(t,e):n.appendChild(t);else if(i!==4&&(t=t.child,t!==null))for(Cd(t,e,n),t=t.sibling;t!==null;)Cd(t,e,n),t=t.sibling}var Xt=null,Jn=!1;function ki(t,e,n){for(n=n.child;n!==null;)m0(t,e,n),n=n.sibling}function m0(t,e,n){if(di&&typeof di.onCommitFiberUnmount=="function")try{di.onCommitFiberUnmount(oc,n)}catch{}switch(n.tag){case 5:nn||Es(n,e);case 6:var i=Xt,r=Jn;Xt=null,ki(t,e,n),Xt=i,Jn=r,Xt!==null&&(Jn?(t=Xt,n=n.stateNode,t.nodeType===8?t.parentNode.removeChild(n):t.removeChild(n)):Xt.removeChild(n.stateNode));break;case 18:Xt!==null&&(Jn?(t=Xt,n=n.stateNode,t.nodeType===8?Xc(t.parentNode,n):t.nodeType===1&&Xc(t,n),Ga(t)):Xc(Xt,n.stateNode));break;case 4:i=Xt,r=Jn,Xt=n.stateNode.containerInfo,Jn=!0,ki(t,e,n),Xt=i,Jn=r;break;case 0:case 11:case 14:case 15:if(!nn&&(i=n.updateQueue,i!==null&&(i=i.lastEffect,i!==null))){r=i=i.next;do{var s=r,a=s.destroy;s=s.tag,a!==void 0&&(s&2||s&4)&&Td(n,e,a),r=r.next}while(r!==i)}ki(t,e,n);break;case 1:if(!nn&&(Es(n,e),i=n.stateNode,typeof i.componentWillUnmount=="function"))try{i.props=n.memoizedProps,i.state=n.memoizedState,i.componentWillUnmount()}catch(o){Ct(n,e,o)}ki(t,e,n);break;case 21:ki(t,e,n);break;case 22:n.mode&1?(nn=(i=nn)||n.memoizedState!==null,ki(t,e,n),nn=i):ki(t,e,n);break;default:ki(t,e,n)}}function Hp(t){var e=t.updateQueue;if(e!==null){t.updateQueue=null;var n=t.stateNode;n===null&&(n=t.stateNode=new jy),e.forEach(function(i){var r=eS.bind(null,t,i);n.has(i)||(n.add(i),i.then(r,r))})}}function $n(t,e){var n=e.deletions;if(n!==null)for(var i=0;i<n.length;i++){var r=n[i];try{var s=t,a=e,o=a;e:for(;o!==null;){switch(o.tag){case 5:Xt=o.stateNode,Jn=!1;break e;case 3:Xt=o.stateNode.containerInfo,Jn=!0;break e;case 4:Xt=o.stateNode.containerInfo,Jn=!0;break e}o=o.return}if(Xt===null)throw Error(oe(160));m0(s,a,r),Xt=null,Jn=!1;var l=r.alternate;l!==null&&(l.return=null),r.return=null}catch(c){Ct(r,e,c)}}if(e.subtreeFlags&12854)for(e=e.child;e!==null;)g0(e,t),e=e.sibling}function g0(t,e){var n=t.alternate,i=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:if($n(e,t),oi(t),i&4){try{Na(3,t,t.return),mc(3,t)}catch(v){Ct(t,t.return,v)}try{Na(5,t,t.return)}catch(v){Ct(t,t.return,v)}}break;case 1:$n(e,t),oi(t),i&512&&n!==null&&Es(n,n.return);break;case 5:if($n(e,t),oi(t),i&512&&n!==null&&Es(n,n.return),t.flags&32){var r=t.stateNode;try{Oa(r,"")}catch(v){Ct(t,t.return,v)}}if(i&4&&(r=t.stateNode,r!=null)){var s=t.memoizedProps,a=n!==null?n.memoizedProps:s,o=t.type,l=t.updateQueue;if(t.updateQueue=null,l!==null)try{o==="input"&&s.type==="radio"&&s.name!=null&&Og(r,s),Ju(o,a);var c=Ju(o,s);for(a=0;a<l.length;a+=2){var u=l[a],d=l[a+1];u==="style"?Vg(r,d):u==="dangerouslySetInnerHTML"?Hg(r,d):u==="children"?Oa(r,d):Ch(r,u,d,c)}switch(o){case"input":$u(r,s);break;case"textarea":zg(r,s);break;case"select":var f=r._wrapperState.wasMultiple;r._wrapperState.wasMultiple=!!s.multiple;var p=s.value;p!=null?bs(r,!!s.multiple,p,!1):f!==!!s.multiple&&(s.defaultValue!=null?bs(r,!!s.multiple,s.defaultValue,!0):bs(r,!!s.multiple,s.multiple?[]:"",!1))}r[$a]=s}catch(v){Ct(t,t.return,v)}}break;case 6:if($n(e,t),oi(t),i&4){if(t.stateNode===null)throw Error(oe(162));r=t.stateNode,s=t.memoizedProps;try{r.nodeValue=s}catch(v){Ct(t,t.return,v)}}break;case 3:if($n(e,t),oi(t),i&4&&n!==null&&n.memoizedState.isDehydrated)try{Ga(e.containerInfo)}catch(v){Ct(t,t.return,v)}break;case 4:$n(e,t),oi(t);break;case 13:$n(e,t),oi(t),r=t.child,r.flags&8192&&(s=r.memoizedState!==null,r.stateNode.isHidden=s,!s||r.alternate!==null&&r.alternate.memoizedState!==null||(lf=Pt())),i&4&&Hp(t);break;case 22:if(u=n!==null&&n.memoizedState!==null,t.mode&1?(nn=(c=nn)||u,$n(e,t),nn=c):$n(e,t),oi(t),i&8192){if(c=t.memoizedState!==null,(t.stateNode.isHidden=c)&&!u&&t.mode&1)for(xe=t,u=t.child;u!==null;){for(d=xe=u;xe!==null;){switch(f=xe,p=f.child,f.tag){case 0:case 11:case 14:case 15:Na(4,f,f.return);break;case 1:Es(f,f.return);var _=f.stateNode;if(typeof _.componentWillUnmount=="function"){i=f,n=f.return;try{e=i,_.props=e.memoizedProps,_.state=e.memoizedState,_.componentWillUnmount()}catch(v){Ct(i,n,v)}}break;case 5:Es(f,f.return);break;case 22:if(f.memoizedState!==null){Vp(d);continue}}p!==null?(p.return=f,xe=p):Vp(d)}u=u.sibling}e:for(u=null,d=t;;){if(d.tag===5){if(u===null){u=d;try{r=d.stateNode,c?(s=r.style,typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none"):(o=d.stateNode,l=d.memoizedProps.style,a=l!=null&&l.hasOwnProperty("display")?l.display:null,o.style.display=Gg("display",a))}catch(v){Ct(t,t.return,v)}}}else if(d.tag===6){if(u===null)try{d.stateNode.nodeValue=c?"":d.memoizedProps}catch(v){Ct(t,t.return,v)}}else if((d.tag!==22&&d.tag!==23||d.memoizedState===null||d===t)&&d.child!==null){d.child.return=d,d=d.child;continue}if(d===t)break e;for(;d.sibling===null;){if(d.return===null||d.return===t)break e;u===d&&(u=null),d=d.return}u===d&&(u=null),d.sibling.return=d.return,d=d.sibling}}break;case 19:$n(e,t),oi(t),i&4&&Hp(t);break;case 21:break;default:$n(e,t),oi(t)}}function oi(t){var e=t.flags;if(e&2){try{e:{for(var n=t.return;n!==null;){if(p0(n)){var i=n;break e}n=n.return}throw Error(oe(160))}switch(i.tag){case 5:var r=i.stateNode;i.flags&32&&(Oa(r,""),i.flags&=-33);var s=Bp(t);Cd(t,s,r);break;case 3:case 4:var a=i.stateNode.containerInfo,o=Bp(t);bd(t,o,a);break;default:throw Error(oe(161))}}catch(l){Ct(t,t.return,l)}t.flags&=-3}e&4096&&(t.flags&=-4097)}function Xy(t,e,n){xe=t,_0(t)}function _0(t,e,n){for(var i=(t.mode&1)!==0;xe!==null;){var r=xe,s=r.child;if(r.tag===22&&i){var a=r.memoizedState!==null||No;if(!a){var o=r.alternate,l=o!==null&&o.memoizedState!==null||nn;o=No;var c=nn;if(No=a,(nn=l)&&!c)for(xe=r;xe!==null;)a=xe,l=a.child,a.tag===22&&a.memoizedState!==null?jp(r):l!==null?(l.return=a,xe=l):jp(r);for(;s!==null;)xe=s,_0(s),s=s.sibling;xe=r,No=o,nn=c}Gp(t)}else r.subtreeFlags&8772&&s!==null?(s.return=r,xe=s):Gp(t)}}function Gp(t){for(;xe!==null;){var e=xe;if(e.flags&8772){var n=e.alternate;try{if(e.flags&8772)switch(e.tag){case 0:case 11:case 15:nn||mc(5,e);break;case 1:var i=e.stateNode;if(e.flags&4&&!nn)if(n===null)i.componentDidMount();else{var r=e.elementType===e.type?n.memoizedProps:Zn(e.type,n.memoizedProps);i.componentDidUpdate(r,n.memoizedState,i.__reactInternalSnapshotBeforeUpdate)}var s=e.updateQueue;s!==null&&Ap(e,s,i);break;case 3:var a=e.updateQueue;if(a!==null){if(n=null,e.child!==null)switch(e.child.tag){case 5:n=e.child.stateNode;break;case 1:n=e.child.stateNode}Ap(e,a,n)}break;case 5:var o=e.stateNode;if(n===null&&e.flags&4){n=o;var l=e.memoizedProps;switch(e.type){case"button":case"input":case"select":case"textarea":l.autoFocus&&n.focus();break;case"img":l.src&&(n.src=l.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(e.memoizedState===null){var c=e.alternate;if(c!==null){var u=c.memoizedState;if(u!==null){var d=u.dehydrated;d!==null&&Ga(d)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(oe(163))}nn||e.flags&512&&Ad(e)}catch(f){Ct(e,e.return,f)}}if(e===t){xe=null;break}if(n=e.sibling,n!==null){n.return=e.return,xe=n;break}xe=e.return}}function Vp(t){for(;xe!==null;){var e=xe;if(e===t){xe=null;break}var n=e.sibling;if(n!==null){n.return=e.return,xe=n;break}xe=e.return}}function jp(t){for(;xe!==null;){var e=xe;try{switch(e.tag){case 0:case 11:case 15:var n=e.return;try{mc(4,e)}catch(l){Ct(e,n,l)}break;case 1:var i=e.stateNode;if(typeof i.componentDidMount=="function"){var r=e.return;try{i.componentDidMount()}catch(l){Ct(e,r,l)}}var s=e.return;try{Ad(e)}catch(l){Ct(e,s,l)}break;case 5:var a=e.return;try{Ad(e)}catch(l){Ct(e,a,l)}}}catch(l){Ct(e,e.return,l)}if(e===t){xe=null;break}var o=e.sibling;if(o!==null){o.return=e.return,xe=o;break}xe=e.return}}var $y=Math.ceil,Yl=Ii.ReactCurrentDispatcher,af=Ii.ReactCurrentOwner,Hn=Ii.ReactCurrentBatchConfig,Je=0,jt=null,Lt=null,$t=0,An=0,ws=mr(0),kt=0,Qa=null,Br=0,gc=0,of=0,La=null,mn=null,lf=0,Gs=1/0,yi=null,ql=!1,Rd=null,ar=null,Lo=!1,Ki=null,Kl=0,Da=0,Pd=null,xl=-1,yl=0;function dn(){return Je&6?Pt():xl!==-1?xl:xl=Pt()}function or(t){return t.mode&1?Je&2&&$t!==0?$t&-$t:Py.transition!==null?(yl===0&&(yl=t_()),yl):(t=ot,t!==0||(t=window.event,t=t===void 0?16:l_(t.type)),t):1}function ri(t,e,n,i){if(50<Da)throw Da=0,Pd=null,Error(oe(185));so(t,n,i),(!(Je&2)||t!==jt)&&(t===jt&&(!(Je&2)&&(gc|=n),kt===4&&Xi(t,$t)),yn(t,i),n===1&&Je===0&&!(e.mode&1)&&(Gs=Pt()+500,hc&&gr()))}function yn(t,e){var n=t.callbackNode;Px(t,e);var i=Dl(t,t===jt?$t:0);if(i===0)n!==null&&Qf(n),t.callbackNode=null,t.callbackPriority=0;else if(e=i&-i,t.callbackPriority!==e){if(n!=null&&Qf(n),e===1)t.tag===0?Ry(Wp.bind(null,t)):b_(Wp.bind(null,t)),Ty(function(){!(Je&6)&&gr()}),n=null;else{switch(n_(i)){case 1:n=Dh;break;case 4:n=Qg;break;case 16:n=Ll;break;case 536870912:n=e_;break;default:n=Ll}n=T0(n,v0.bind(null,t))}t.callbackPriority=e,t.callbackNode=n}}function v0(t,e){if(xl=-1,yl=0,Je&6)throw Error(oe(327));var n=t.callbackNode;if(Ls()&&t.callbackNode!==n)return null;var i=Dl(t,t===jt?$t:0);if(i===0)return null;if(i&30||i&t.expiredLanes||e)e=Zl(t,i);else{e=i;var r=Je;Je|=2;var s=y0();(jt!==t||$t!==e)&&(yi=null,Gs=Pt()+500,Ur(t,e));do try{Ky();break}catch(o){x0(t,o)}while(!0);Xh(),Yl.current=s,Je=r,Lt!==null?e=0:(jt=null,$t=0,e=kt)}if(e!==0){if(e===2&&(r=id(t),r!==0&&(i=r,e=Nd(t,r))),e===1)throw n=Qa,Ur(t,0),Xi(t,i),yn(t,Pt()),n;if(e===6)Xi(t,i);else{if(r=t.current.alternate,!(i&30)&&!Yy(r)&&(e=Zl(t,i),e===2&&(s=id(t),s!==0&&(i=s,e=Nd(t,s))),e===1))throw n=Qa,Ur(t,0),Xi(t,i),yn(t,Pt()),n;switch(t.finishedWork=r,t.finishedLanes=i,e){case 0:case 1:throw Error(oe(345));case 2:br(t,mn,yi);break;case 3:if(Xi(t,i),(i&130023424)===i&&(e=lf+500-Pt(),10<e)){if(Dl(t,0)!==0)break;if(r=t.suspendedLanes,(r&i)!==i){dn(),t.pingedLanes|=t.suspendedLanes&r;break}t.timeoutHandle=dd(br.bind(null,t,mn,yi),e);break}br(t,mn,yi);break;case 4:if(Xi(t,i),(i&4194240)===i)break;for(e=t.eventTimes,r=-1;0<i;){var a=31-ii(i);s=1<<a,a=e[a],a>r&&(r=a),i&=~s}if(i=r,i=Pt()-i,i=(120>i?120:480>i?480:1080>i?1080:1920>i?1920:3e3>i?3e3:4320>i?4320:1960*$y(i/1960))-i,10<i){t.timeoutHandle=dd(br.bind(null,t,mn,yi),i);break}br(t,mn,yi);break;case 5:br(t,mn,yi);break;default:throw Error(oe(329))}}}return yn(t,Pt()),t.callbackNode===n?v0.bind(null,t):null}function Nd(t,e){var n=La;return t.current.memoizedState.isDehydrated&&(Ur(t,e).flags|=256),t=Zl(t,e),t!==2&&(e=mn,mn=n,e!==null&&Ld(e)),t}function Ld(t){mn===null?mn=t:mn.push.apply(mn,t)}function Yy(t){for(var e=t;;){if(e.flags&16384){var n=e.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var i=0;i<n.length;i++){var r=n[i],s=r.getSnapshot;r=r.value;try{if(!ai(s(),r))return!1}catch{return!1}}}if(n=e.child,e.subtreeFlags&16384&&n!==null)n.return=e,e=n;else{if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return!0;e=e.return}e.sibling.return=e.return,e=e.sibling}}return!0}function Xi(t,e){for(e&=~of,e&=~gc,t.suspendedLanes|=e,t.pingedLanes&=~e,t=t.expirationTimes;0<e;){var n=31-ii(e),i=1<<n;t[n]=-1,e&=~i}}function Wp(t){if(Je&6)throw Error(oe(327));Ls();var e=Dl(t,0);if(!(e&1))return yn(t,Pt()),null;var n=Zl(t,e);if(t.tag!==0&&n===2){var i=id(t);i!==0&&(e=i,n=Nd(t,i))}if(n===1)throw n=Qa,Ur(t,0),Xi(t,e),yn(t,Pt()),n;if(n===6)throw Error(oe(345));return t.finishedWork=t.current.alternate,t.finishedLanes=e,br(t,mn,yi),yn(t,Pt()),null}function cf(t,e){var n=Je;Je|=1;try{return t(e)}finally{Je=n,Je===0&&(Gs=Pt()+500,hc&&gr())}}function Hr(t){Ki!==null&&Ki.tag===0&&!(Je&6)&&Ls();var e=Je;Je|=1;var n=Hn.transition,i=ot;try{if(Hn.transition=null,ot=1,t)return t()}finally{ot=i,Hn.transition=n,Je=e,!(Je&6)&&gr()}}function uf(){An=ws.current,xt(ws)}function Ur(t,e){t.finishedWork=null,t.finishedLanes=0;var n=t.timeoutHandle;if(n!==-1&&(t.timeoutHandle=-1,wy(n)),Lt!==null)for(n=Lt.return;n!==null;){var i=n;switch(Vh(i),i.tag){case 1:i=i.type.childContextTypes,i!=null&&Ol();break;case 3:Bs(),xt(vn),xt(sn),Jh();break;case 5:Zh(i);break;case 4:Bs();break;case 13:xt(Mt);break;case 19:xt(Mt);break;case 10:$h(i.type._context);break;case 22:case 23:uf()}n=n.return}if(jt=t,Lt=t=lr(t.current,null),$t=An=e,kt=0,Qa=null,of=gc=Br=0,mn=La=null,Dr!==null){for(e=0;e<Dr.length;e++)if(n=Dr[e],i=n.interleaved,i!==null){n.interleaved=null;var r=i.next,s=n.pending;if(s!==null){var a=s.next;s.next=r,i.next=a}n.pending=i}Dr=null}return t}function x0(t,e){do{var n=Lt;try{if(Xh(),gl.current=$l,Xl){for(var i=Et.memoizedState;i!==null;){var r=i.queue;r!==null&&(r.pending=null),i=i.next}Xl=!1}if(zr=0,Vt=Ut=Et=null,Pa=!1,Ka=0,af.current=null,n===null||n.return===null){kt=1,Qa=e,Lt=null;break}e:{var s=t,a=n.return,o=n,l=e;if(e=$t,o.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){var c=l,u=o,d=u.tag;if(!(u.mode&1)&&(d===0||d===11||d===15)){var f=u.alternate;f?(u.updateQueue=f.updateQueue,u.memoizedState=f.memoizedState,u.lanes=f.lanes):(u.updateQueue=null,u.memoizedState=null)}var p=Lp(a);if(p!==null){p.flags&=-257,Dp(p,a,o,s,e),p.mode&1&&Np(s,c,e),e=p,l=c;var _=e.updateQueue;if(_===null){var v=new Set;v.add(l),e.updateQueue=v}else _.add(l);break e}else{if(!(e&1)){Np(s,c,e),df();break e}l=Error(oe(426))}}else if(St&&o.mode&1){var m=Lp(a);if(m!==null){!(m.flags&65536)&&(m.flags|=256),Dp(m,a,o,s,e),jh(Hs(l,o));break e}}s=l=Hs(l,o),kt!==4&&(kt=2),La===null?La=[s]:La.push(s),s=a;do{switch(s.tag){case 3:s.flags|=65536,e&=-e,s.lanes|=e;var h=n0(s,l,e);Tp(s,h);break e;case 1:o=l;var x=s.type,S=s.stateNode;if(!(s.flags&128)&&(typeof x.getDerivedStateFromError=="function"||S!==null&&typeof S.componentDidCatch=="function"&&(ar===null||!ar.has(S)))){s.flags|=65536,e&=-e,s.lanes|=e;var M=i0(s,o,e);Tp(s,M);break e}}s=s.return}while(s!==null)}M0(n)}catch(P){e=P,Lt===n&&n!==null&&(Lt=n=n.return);continue}break}while(!0)}function y0(){var t=Yl.current;return Yl.current=$l,t===null?$l:t}function df(){(kt===0||kt===3||kt===2)&&(kt=4),jt===null||!(Br&268435455)&&!(gc&268435455)||Xi(jt,$t)}function Zl(t,e){var n=Je;Je|=2;var i=y0();(jt!==t||$t!==e)&&(yi=null,Ur(t,e));do try{qy();break}catch(r){x0(t,r)}while(!0);if(Xh(),Je=n,Yl.current=i,Lt!==null)throw Error(oe(261));return jt=null,$t=0,kt}function qy(){for(;Lt!==null;)S0(Lt)}function Ky(){for(;Lt!==null&&!Sx();)S0(Lt)}function S0(t){var e=w0(t.alternate,t,An);t.memoizedProps=t.pendingProps,e===null?M0(t):Lt=e,af.current=null}function M0(t){var e=t;do{var n=e.alternate;if(t=e.return,e.flags&32768){if(n=Vy(n,e),n!==null){n.flags&=32767,Lt=n;return}if(t!==null)t.flags|=32768,t.subtreeFlags=0,t.deletions=null;else{kt=6,Lt=null;return}}else if(n=Gy(n,e,An),n!==null){Lt=n;return}if(e=e.sibling,e!==null){Lt=e;return}Lt=e=t}while(e!==null);kt===0&&(kt=5)}function br(t,e,n){var i=ot,r=Hn.transition;try{Hn.transition=null,ot=1,Zy(t,e,n,i)}finally{Hn.transition=r,ot=i}return null}function Zy(t,e,n,i){do Ls();while(Ki!==null);if(Je&6)throw Error(oe(327));n=t.finishedWork;var r=t.finishedLanes;if(n===null)return null;if(t.finishedWork=null,t.finishedLanes=0,n===t.current)throw Error(oe(177));t.callbackNode=null,t.callbackPriority=0;var s=n.lanes|n.childLanes;if(Nx(t,s),t===jt&&(Lt=jt=null,$t=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||Lo||(Lo=!0,T0(Ll,function(){return Ls(),null})),s=(n.flags&15990)!==0,n.subtreeFlags&15990||s){s=Hn.transition,Hn.transition=null;var a=ot;ot=1;var o=Je;Je|=4,af.current=null,Wy(t,n),g0(n,t),_y(cd),Il=!!ld,cd=ld=null,t.current=n,Xy(n),Mx(),Je=o,ot=a,Hn.transition=s}else t.current=n;if(Lo&&(Lo=!1,Ki=t,Kl=r),s=t.pendingLanes,s===0&&(ar=null),Tx(n.stateNode),yn(t,Pt()),e!==null)for(i=t.onRecoverableError,n=0;n<e.length;n++)r=e[n],i(r.value,{componentStack:r.stack,digest:r.digest});if(ql)throw ql=!1,t=Rd,Rd=null,t;return Kl&1&&t.tag!==0&&Ls(),s=t.pendingLanes,s&1?t===Pd?Da++:(Da=0,Pd=t):Da=0,gr(),null}function Ls(){if(Ki!==null){var t=n_(Kl),e=Hn.transition,n=ot;try{if(Hn.transition=null,ot=16>t?16:t,Ki===null)var i=!1;else{if(t=Ki,Ki=null,Kl=0,Je&6)throw Error(oe(331));var r=Je;for(Je|=4,xe=t.current;xe!==null;){var s=xe,a=s.child;if(xe.flags&16){var o=s.deletions;if(o!==null){for(var l=0;l<o.length;l++){var c=o[l];for(xe=c;xe!==null;){var u=xe;switch(u.tag){case 0:case 11:case 15:Na(8,u,s)}var d=u.child;if(d!==null)d.return=u,xe=d;else for(;xe!==null;){u=xe;var f=u.sibling,p=u.return;if(f0(u),u===c){xe=null;break}if(f!==null){f.return=p,xe=f;break}xe=p}}}var _=s.alternate;if(_!==null){var v=_.child;if(v!==null){_.child=null;do{var m=v.sibling;v.sibling=null,v=m}while(v!==null)}}xe=s}}if(s.subtreeFlags&2064&&a!==null)a.return=s,xe=a;else e:for(;xe!==null;){if(s=xe,s.flags&2048)switch(s.tag){case 0:case 11:case 15:Na(9,s,s.return)}var h=s.sibling;if(h!==null){h.return=s.return,xe=h;break e}xe=s.return}}var x=t.current;for(xe=x;xe!==null;){a=xe;var S=a.child;if(a.subtreeFlags&2064&&S!==null)S.return=a,xe=S;else e:for(a=x;xe!==null;){if(o=xe,o.flags&2048)try{switch(o.tag){case 0:case 11:case 15:mc(9,o)}}catch(P){Ct(o,o.return,P)}if(o===a){xe=null;break e}var M=o.sibling;if(M!==null){M.return=o.return,xe=M;break e}xe=o.return}}if(Je=r,gr(),di&&typeof di.onPostCommitFiberRoot=="function")try{di.onPostCommitFiberRoot(oc,t)}catch{}i=!0}return i}finally{ot=n,Hn.transition=e}}return!1}function Xp(t,e,n){e=Hs(n,e),e=n0(t,e,1),t=sr(t,e,1),e=dn(),t!==null&&(so(t,1,e),yn(t,e))}function Ct(t,e,n){if(t.tag===3)Xp(t,t,n);else for(;e!==null;){if(e.tag===3){Xp(e,t,n);break}else if(e.tag===1){var i=e.stateNode;if(typeof e.type.getDerivedStateFromError=="function"||typeof i.componentDidCatch=="function"&&(ar===null||!ar.has(i))){t=Hs(n,t),t=i0(e,t,1),e=sr(e,t,1),t=dn(),e!==null&&(so(e,1,t),yn(e,t));break}}e=e.return}}function Jy(t,e,n){var i=t.pingCache;i!==null&&i.delete(e),e=dn(),t.pingedLanes|=t.suspendedLanes&n,jt===t&&($t&n)===n&&(kt===4||kt===3&&($t&130023424)===$t&&500>Pt()-lf?Ur(t,0):of|=n),yn(t,e)}function E0(t,e){e===0&&(t.mode&1?(e=Mo,Mo<<=1,!(Mo&130023424)&&(Mo=4194304)):e=1);var n=dn();t=Ni(t,e),t!==null&&(so(t,e,n),yn(t,n))}function Qy(t){var e=t.memoizedState,n=0;e!==null&&(n=e.retryLane),E0(t,n)}function eS(t,e){var n=0;switch(t.tag){case 13:var i=t.stateNode,r=t.memoizedState;r!==null&&(n=r.retryLane);break;case 19:i=t.stateNode;break;default:throw Error(oe(314))}i!==null&&i.delete(e),E0(t,n)}var w0;w0=function(t,e,n){if(t!==null)if(t.memoizedProps!==e.pendingProps||vn.current)_n=!0;else{if(!(t.lanes&n)&&!(e.flags&128))return _n=!1,Hy(t,e,n);_n=!!(t.flags&131072)}else _n=!1,St&&e.flags&1048576&&C_(e,Hl,e.index);switch(e.lanes=0,e.tag){case 2:var i=e.type;vl(t,e),t=e.pendingProps;var r=Fs(e,sn.current);Ns(e,n),r=ef(null,e,i,t,r,n);var s=tf();return e.flags|=1,typeof r=="object"&&r!==null&&typeof r.render=="function"&&r.$$typeof===void 0?(e.tag=1,e.memoizedState=null,e.updateQueue=null,xn(i)?(s=!0,zl(e)):s=!1,e.memoizedState=r.state!==null&&r.state!==void 0?r.state:null,qh(e),r.updater=pc,e.stateNode=r,r._reactInternals=e,vd(e,i,t,n),e=Sd(null,e,i,!0,s,n)):(e.tag=0,St&&s&&Gh(e),ln(null,e,r,n),e=e.child),e;case 16:i=e.elementType;e:{switch(vl(t,e),t=e.pendingProps,r=i._init,i=r(i._payload),e.type=i,r=e.tag=nS(i),t=Zn(i,t),r){case 0:e=yd(null,e,i,t,n);break e;case 1:e=kp(null,e,i,t,n);break e;case 11:e=Ip(null,e,i,t,n);break e;case 14:e=Up(null,e,i,Zn(i.type,t),n);break e}throw Error(oe(306,i,""))}return e;case 0:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Zn(i,r),yd(t,e,i,r,n);case 1:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Zn(i,r),kp(t,e,i,r,n);case 3:e:{if(o0(e),t===null)throw Error(oe(387));i=e.pendingProps,s=e.memoizedState,r=s.element,I_(t,e),jl(e,i,null,n);var a=e.memoizedState;if(i=a.element,s.isDehydrated)if(s={element:i,isDehydrated:!1,cache:a.cache,pendingSuspenseBoundaries:a.pendingSuspenseBoundaries,transitions:a.transitions},e.updateQueue.baseState=s,e.memoizedState=s,e.flags&256){r=Hs(Error(oe(423)),e),e=Fp(t,e,i,n,r);break e}else if(i!==r){r=Hs(Error(oe(424)),e),e=Fp(t,e,i,n,r);break e}else for(bn=rr(e.stateNode.containerInfo.firstChild),Cn=e,St=!0,Qn=null,n=L_(e,null,i,n),e.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(Os(),i===r){e=Li(t,e,n);break e}ln(t,e,i,n)}e=e.child}return e;case 5:return U_(e),t===null&&md(e),i=e.type,r=e.pendingProps,s=t!==null?t.memoizedProps:null,a=r.children,ud(i,r)?a=null:s!==null&&ud(i,s)&&(e.flags|=32),a0(t,e),ln(t,e,a,n),e.child;case 6:return t===null&&md(e),null;case 13:return l0(t,e,n);case 4:return Kh(e,e.stateNode.containerInfo),i=e.pendingProps,t===null?e.child=zs(e,null,i,n):ln(t,e,i,n),e.child;case 11:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Zn(i,r),Ip(t,e,i,r,n);case 7:return ln(t,e,e.pendingProps,n),e.child;case 8:return ln(t,e,e.pendingProps.children,n),e.child;case 12:return ln(t,e,e.pendingProps.children,n),e.child;case 10:e:{if(i=e.type._context,r=e.pendingProps,s=e.memoizedProps,a=r.value,ht(Gl,i._currentValue),i._currentValue=a,s!==null)if(ai(s.value,a)){if(s.children===r.children&&!vn.current){e=Li(t,e,n);break e}}else for(s=e.child,s!==null&&(s.return=e);s!==null;){var o=s.dependencies;if(o!==null){a=s.child;for(var l=o.firstContext;l!==null;){if(l.context===i){if(s.tag===1){l=bi(-1,n&-n),l.tag=2;var c=s.updateQueue;if(c!==null){c=c.shared;var u=c.pending;u===null?l.next=l:(l.next=u.next,u.next=l),c.pending=l}}s.lanes|=n,l=s.alternate,l!==null&&(l.lanes|=n),gd(s.return,n,e),o.lanes|=n;break}l=l.next}}else if(s.tag===10)a=s.type===e.type?null:s.child;else if(s.tag===18){if(a=s.return,a===null)throw Error(oe(341));a.lanes|=n,o=a.alternate,o!==null&&(o.lanes|=n),gd(a,n,e),a=s.sibling}else a=s.child;if(a!==null)a.return=s;else for(a=s;a!==null;){if(a===e){a=null;break}if(s=a.sibling,s!==null){s.return=a.return,a=s;break}a=a.return}s=a}ln(t,e,r.children,n),e=e.child}return e;case 9:return r=e.type,i=e.pendingProps.children,Ns(e,n),r=Gn(r),i=i(r),e.flags|=1,ln(t,e,i,n),e.child;case 14:return i=e.type,r=Zn(i,e.pendingProps),r=Zn(i.type,r),Up(t,e,i,r,n);case 15:return r0(t,e,e.type,e.pendingProps,n);case 17:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Zn(i,r),vl(t,e),e.tag=1,xn(i)?(t=!0,zl(e)):t=!1,Ns(e,n),t0(e,i,r),vd(e,i,r,n),Sd(null,e,i,!0,t,n);case 19:return c0(t,e,n);case 22:return s0(t,e,n)}throw Error(oe(156,e.tag))};function T0(t,e){return Jg(t,e)}function tS(t,e,n,i){this.tag=t,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=e,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=i,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function zn(t,e,n,i){return new tS(t,e,n,i)}function hf(t){return t=t.prototype,!(!t||!t.isReactComponent)}function nS(t){if(typeof t=="function")return hf(t)?1:0;if(t!=null){if(t=t.$$typeof,t===Ph)return 11;if(t===Nh)return 14}return 2}function lr(t,e){var n=t.alternate;return n===null?(n=zn(t.tag,e,t.key,t.mode),n.elementType=t.elementType,n.type=t.type,n.stateNode=t.stateNode,n.alternate=t,t.alternate=n):(n.pendingProps=e,n.type=t.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=t.flags&14680064,n.childLanes=t.childLanes,n.lanes=t.lanes,n.child=t.child,n.memoizedProps=t.memoizedProps,n.memoizedState=t.memoizedState,n.updateQueue=t.updateQueue,e=t.dependencies,n.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext},n.sibling=t.sibling,n.index=t.index,n.ref=t.ref,n}function Sl(t,e,n,i,r,s){var a=2;if(i=t,typeof t=="function")hf(t)&&(a=1);else if(typeof t=="string")a=5;else e:switch(t){case ps:return kr(n.children,r,s,e);case Rh:a=8,r|=8;break;case Gu:return t=zn(12,n,e,r|2),t.elementType=Gu,t.lanes=s,t;case Vu:return t=zn(13,n,e,r),t.elementType=Vu,t.lanes=s,t;case ju:return t=zn(19,n,e,r),t.elementType=ju,t.lanes=s,t;case Ug:return _c(n,r,s,e);default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case Dg:a=10;break e;case Ig:a=9;break e;case Ph:a=11;break e;case Nh:a=14;break e;case Vi:a=16,i=null;break e}throw Error(oe(130,t==null?t:typeof t,""))}return e=zn(a,n,e,r),e.elementType=t,e.type=i,e.lanes=s,e}function kr(t,e,n,i){return t=zn(7,t,i,e),t.lanes=n,t}function _c(t,e,n,i){return t=zn(22,t,i,e),t.elementType=Ug,t.lanes=n,t.stateNode={isHidden:!1},t}function eu(t,e,n){return t=zn(6,t,null,e),t.lanes=n,t}function tu(t,e,n){return e=zn(4,t.children!==null?t.children:[],t.key,e),e.lanes=n,e.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},e}function iS(t,e,n,i,r){this.tag=e,this.containerInfo=t,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Uc(0),this.expirationTimes=Uc(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Uc(0),this.identifierPrefix=i,this.onRecoverableError=r,this.mutableSourceEagerHydrationData=null}function ff(t,e,n,i,r,s,a,o,l){return t=new iS(t,e,n,o,l),e===1?(e=1,s===!0&&(e|=8)):e=0,s=zn(3,null,null,e),t.current=s,s.stateNode=t,s.memoizedState={element:i,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},qh(s),t}function rS(t,e,n){var i=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:fs,key:i==null?null:""+i,children:t,containerInfo:e,implementation:n}}function A0(t){if(!t)return hr;t=t._reactInternals;e:{if(Wr(t)!==t||t.tag!==1)throw Error(oe(170));var e=t;do{switch(e.tag){case 3:e=e.stateNode.context;break e;case 1:if(xn(e.type)){e=e.stateNode.__reactInternalMemoizedMergedChildContext;break e}}e=e.return}while(e!==null);throw Error(oe(171))}if(t.tag===1){var n=t.type;if(xn(n))return A_(t,n,e)}return e}function b0(t,e,n,i,r,s,a,o,l){return t=ff(n,i,!0,t,r,s,a,o,l),t.context=A0(null),n=t.current,i=dn(),r=or(n),s=bi(i,r),s.callback=e??null,sr(n,s,r),t.current.lanes=r,so(t,r,i),yn(t,i),t}function vc(t,e,n,i){var r=e.current,s=dn(),a=or(r);return n=A0(n),e.context===null?e.context=n:e.pendingContext=n,e=bi(s,a),e.payload={element:t},i=i===void 0?null:i,i!==null&&(e.callback=i),t=sr(r,e,a),t!==null&&(ri(t,r,a,s),ml(t,r,a)),a}function Jl(t){if(t=t.current,!t.child)return null;switch(t.child.tag){case 5:return t.child.stateNode;default:return t.child.stateNode}}function $p(t,e){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var n=t.retryLane;t.retryLane=n!==0&&n<e?n:e}}function pf(t,e){$p(t,e),(t=t.alternate)&&$p(t,e)}function sS(){return null}var C0=typeof reportError=="function"?reportError:function(t){console.error(t)};function mf(t){this._internalRoot=t}xc.prototype.render=mf.prototype.render=function(t){var e=this._internalRoot;if(e===null)throw Error(oe(409));vc(t,e,null,null)};xc.prototype.unmount=mf.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var e=t.containerInfo;Hr(function(){vc(null,t,null,null)}),e[Pi]=null}};function xc(t){this._internalRoot=t}xc.prototype.unstable_scheduleHydration=function(t){if(t){var e=s_();t={blockedOn:null,target:t,priority:e};for(var n=0;n<Wi.length&&e!==0&&e<Wi[n].priority;n++);Wi.splice(n,0,t),n===0&&o_(t)}};function gf(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function yc(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11&&(t.nodeType!==8||t.nodeValue!==" react-mount-point-unstable "))}function Yp(){}function aS(t,e,n,i,r){if(r){if(typeof i=="function"){var s=i;i=function(){var c=Jl(a);s.call(c)}}var a=b0(e,i,t,0,null,!1,!1,"",Yp);return t._reactRootContainer=a,t[Pi]=a.current,Wa(t.nodeType===8?t.parentNode:t),Hr(),a}for(;r=t.lastChild;)t.removeChild(r);if(typeof i=="function"){var o=i;i=function(){var c=Jl(l);o.call(c)}}var l=ff(t,0,!1,null,null,!1,!1,"",Yp);return t._reactRootContainer=l,t[Pi]=l.current,Wa(t.nodeType===8?t.parentNode:t),Hr(function(){vc(e,l,n,i)}),l}function Sc(t,e,n,i,r){var s=n._reactRootContainer;if(s){var a=s;if(typeof r=="function"){var o=r;r=function(){var l=Jl(a);o.call(l)}}vc(e,a,t,r)}else a=aS(n,e,t,r,i);return Jl(a)}i_=function(t){switch(t.tag){case 3:var e=t.stateNode;if(e.current.memoizedState.isDehydrated){var n=Ma(e.pendingLanes);n!==0&&(Ih(e,n|1),yn(e,Pt()),!(Je&6)&&(Gs=Pt()+500,gr()))}break;case 13:Hr(function(){var i=Ni(t,1);if(i!==null){var r=dn();ri(i,t,1,r)}}),pf(t,1)}};Uh=function(t){if(t.tag===13){var e=Ni(t,134217728);if(e!==null){var n=dn();ri(e,t,134217728,n)}pf(t,134217728)}};r_=function(t){if(t.tag===13){var e=or(t),n=Ni(t,e);if(n!==null){var i=dn();ri(n,t,e,i)}pf(t,e)}};s_=function(){return ot};a_=function(t,e){var n=ot;try{return ot=t,e()}finally{ot=n}};ed=function(t,e,n){switch(e){case"input":if($u(t,n),e=n.name,n.type==="radio"&&e!=null){for(n=t;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+e)+'][type="radio"]'),e=0;e<n.length;e++){var i=n[e];if(i!==t&&i.form===t.form){var r=dc(i);if(!r)throw Error(oe(90));Fg(i),$u(i,r)}}}break;case"textarea":zg(t,n);break;case"select":e=n.value,e!=null&&bs(t,!!n.multiple,e,!1)}};Xg=cf;$g=Hr;var oS={usingClientEntryPoint:!1,Events:[oo,vs,dc,jg,Wg,cf]},la={findFiberByHostInstance:Lr,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},lS={bundleType:la.bundleType,version:la.version,rendererPackageName:la.rendererPackageName,rendererConfig:la.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:Ii.ReactCurrentDispatcher,findHostInstanceByFiber:function(t){return t=Kg(t),t===null?null:t.stateNode},findFiberByHostInstance:la.findFiberByHostInstance||sS,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Do=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Do.isDisabled&&Do.supportsFiber)try{oc=Do.inject(lS),di=Do}catch{}}Pn.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=oS;Pn.createPortal=function(t,e){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!gf(e))throw Error(oe(200));return rS(t,e,null,n)};Pn.createRoot=function(t,e){if(!gf(t))throw Error(oe(299));var n=!1,i="",r=C0;return e!=null&&(e.unstable_strictMode===!0&&(n=!0),e.identifierPrefix!==void 0&&(i=e.identifierPrefix),e.onRecoverableError!==void 0&&(r=e.onRecoverableError)),e=ff(t,1,!1,null,null,n,!1,i,r),t[Pi]=e.current,Wa(t.nodeType===8?t.parentNode:t),new mf(e)};Pn.findDOMNode=function(t){if(t==null)return null;if(t.nodeType===1)return t;var e=t._reactInternals;if(e===void 0)throw typeof t.render=="function"?Error(oe(188)):(t=Object.keys(t).join(","),Error(oe(268,t)));return t=Kg(e),t=t===null?null:t.stateNode,t};Pn.flushSync=function(t){return Hr(t)};Pn.hydrate=function(t,e,n){if(!yc(e))throw Error(oe(200));return Sc(null,t,e,!0,n)};Pn.hydrateRoot=function(t,e,n){if(!gf(t))throw Error(oe(405));var i=n!=null&&n.hydratedSources||null,r=!1,s="",a=C0;if(n!=null&&(n.unstable_strictMode===!0&&(r=!0),n.identifierPrefix!==void 0&&(s=n.identifierPrefix),n.onRecoverableError!==void 0&&(a=n.onRecoverableError)),e=b0(e,null,t,1,n??null,r,!1,s,a),t[Pi]=e.current,Wa(t),i)for(t=0;t<i.length;t++)n=i[t],r=n._getVersion,r=r(n._source),e.mutableSourceEagerHydrationData==null?e.mutableSourceEagerHydrationData=[n,r]:e.mutableSourceEagerHydrationData.push(n,r);return new xc(e)};Pn.render=function(t,e,n){if(!yc(e))throw Error(oe(200));return Sc(null,t,e,!1,n)};Pn.unmountComponentAtNode=function(t){if(!yc(t))throw Error(oe(40));return t._reactRootContainer?(Hr(function(){Sc(null,null,t,!1,function(){t._reactRootContainer=null,t[Pi]=null})}),!0):!1};Pn.unstable_batchedUpdates=cf;Pn.unstable_renderSubtreeIntoContainer=function(t,e,n,i){if(!yc(n))throw Error(oe(200));if(t==null||t._reactInternals===void 0)throw Error(oe(38));return Sc(t,e,n,!1,i)};Pn.version="18.3.1-next-f1338f8080-20240426";function R0(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(R0)}catch(t){console.error(t)}}R0(),Rg.exports=Pn;var cS=Rg.exports,qp=cS;Bu.createRoot=qp.createRoot,Bu.hydrateRoot=qp.hydrateRoot;function uS(t=null){const[e,n]=ye.useState(null),[i,r]=ye.useState(!1),[s,a]=ye.useState(null),o=ye.useRef(null),l=ye.useRef(null),c=ye.useRef(!0),u=ye.useRef(1e3),d=t||(()=>{if(typeof window>"u")return"ws://localhost:8080/ws/telemetry";const v=window.location.protocol==="https:"?"wss:":"ws:",m=window.location.host||"localhost:8080";return`${v}//${m}/ws/telemetry`})(),f=ye.useCallback(()=>{if(!c.current)return;let v;try{v=new WebSocket(d)}catch(m){console.error("[ws] construction failed",m),l.current=setTimeout(f,u.current);return}v.onopen=()=>{r(!0),u.current=1e3},v.onmessage=m=>{try{const h=JSON.parse(m.data);h.type==="cmd_result"?a({...h,at:Date.now()}):h.type==="ack"||n(h)}catch(h){console.error("[ws] parse error",h)}},v.onclose=()=>{r(!1),c.current&&(l.current=setTimeout(f,u.current),u.current=Math.min(u.current*1.6,1e4))},v.onerror=()=>v.close(),o.current=v},[d]),p=ye.useCallback((v,m={})=>{const h=o.current;h&&h.readyState===WebSocket.OPEN&&h.send(JSON.stringify({action:v,...m}))},[]),_=ye.useCallback((v,m={})=>{const h=o.current;return h&&h.readyState===WebSocket.OPEN?(h.send(JSON.stringify({action:"cmd",name:v,params:m})),!0):(a({name:v,result:{ok:!1,error:"not connected"},at:Date.now()}),!1)},[]);return ye.useEffect(()=>(c.current=!0,f(),()=>{c.current=!1,clearTimeout(l.current),o.current&&o.current.close()}),[f]),{data:e,connected:i,sendCommand:p,runCommand:_,lastResult:s}}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const _f="169",dS=0,Kp=1,hS=2,P0=1,N0=2,xi=3,fr=0,Yt=1,yt=2,cr=0,Ds=1,eo=2,Zp=3,Jp=4,fS=5,Pr=100,pS=101,mS=102,gS=103,_S=104,vS=200,xS=201,yS=202,SS=203,Dd=204,Id=205,MS=206,ES=207,wS=208,TS=209,AS=210,bS=211,CS=212,RS=213,PS=214,Ud=0,kd=1,Fd=2,Vs=3,Od=4,zd=5,Bd=6,Hd=7,L0=0,NS=1,LS=2,ur=0,DS=1,IS=2,US=3,kS=4,FS=5,OS=6,zS=7,D0=300,js=301,Ws=302,Gd=303,Vd=304,Mc=306,jd=1e3,Zi=1001,Wd=1002,Bn=1003,BS=1004,Io=1005,ei=1006,nu=1007,Ji=1008,Di=1009,I0=1010,U0=1011,to=1012,vf=1013,Gr=1014,Ti=1015,co=1016,xf=1017,yf=1018,Xs=1020,k0=35902,F0=1021,O0=1022,ni=1023,z0=1024,B0=1025,Is=1026,$s=1027,H0=1028,Sf=1029,G0=1030,Mf=1031,Ef=1033,Ml=33776,El=33777,wl=33778,Tl=33779,Xd=35840,$d=35841,Yd=35842,qd=35843,Kd=36196,Zd=37492,Jd=37496,Qd=37808,eh=37809,th=37810,nh=37811,ih=37812,rh=37813,sh=37814,ah=37815,oh=37816,lh=37817,ch=37818,uh=37819,dh=37820,hh=37821,Al=36492,fh=36494,ph=36495,V0=36283,mh=36284,gh=36285,_h=36286,HS=3200,GS=3201,j0=0,VS=1,$i="",tn="srgb",_r="srgb-linear",wf="display-p3",Ec="display-p3-linear",Ql="linear",_t="srgb",ec="rec709",tc="p3",qr=7680,Qp=519,jS=512,WS=513,XS=514,W0=515,$S=516,YS=517,qS=518,KS=519,vh=35044,em="300 es",Ai=2e3,nc=2001;class Qs{addEventListener(e,n){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(n)===-1&&i[e].push(n)}hasEventListener(e,n){if(this._listeners===void 0)return!1;const i=this._listeners;return i[e]!==void 0&&i[e].indexOf(n)!==-1}removeEventListener(e,n){if(this._listeners===void 0)return;const r=this._listeners[e];if(r!==void 0){const s=r.indexOf(n);s!==-1&&r.splice(s,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const i=this._listeners[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,a=r.length;s<a;s++)r[s].call(this,e);e.target=null}}}const Jt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let tm=1234567;const Ia=Math.PI/180,no=180/Math.PI;function Ci(){const t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Jt[t&255]+Jt[t>>8&255]+Jt[t>>16&255]+Jt[t>>24&255]+"-"+Jt[e&255]+Jt[e>>8&255]+"-"+Jt[e>>16&15|64]+Jt[e>>24&255]+"-"+Jt[n&63|128]+Jt[n>>8&255]+"-"+Jt[n>>16&255]+Jt[n>>24&255]+Jt[i&255]+Jt[i>>8&255]+Jt[i>>16&255]+Jt[i>>24&255]).toLowerCase()}function cn(t,e,n){return Math.max(e,Math.min(n,t))}function Tf(t,e){return(t%e+e)%e}function ZS(t,e,n,i,r){return i+(t-e)*(r-i)/(n-e)}function JS(t,e,n){return t!==e?(n-t)/(e-t):0}function Ua(t,e,n){return(1-n)*t+n*e}function QS(t,e,n,i){return Ua(t,e,1-Math.exp(-n*i))}function eM(t,e=1){return e-Math.abs(Tf(t,e*2)-e)}function tM(t,e,n){return t<=e?0:t>=n?1:(t=(t-e)/(n-e),t*t*(3-2*t))}function nM(t,e,n){return t<=e?0:t>=n?1:(t=(t-e)/(n-e),t*t*t*(t*(t*6-15)+10))}function iM(t,e){return t+Math.floor(Math.random()*(e-t+1))}function rM(t,e){return t+Math.random()*(e-t)}function sM(t){return t*(.5-Math.random())}function aM(t){t!==void 0&&(tm=t);let e=tm+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function oM(t){return t*Ia}function lM(t){return t*no}function cM(t){return(t&t-1)===0&&t!==0}function uM(t){return Math.pow(2,Math.ceil(Math.log(t)/Math.LN2))}function dM(t){return Math.pow(2,Math.floor(Math.log(t)/Math.LN2))}function hM(t,e,n,i,r){const s=Math.cos,a=Math.sin,o=s(n/2),l=a(n/2),c=s((e+i)/2),u=a((e+i)/2),d=s((e-i)/2),f=a((e-i)/2),p=s((i-e)/2),_=a((i-e)/2);switch(r){case"XYX":t.set(o*u,l*d,l*f,o*c);break;case"YZY":t.set(l*f,o*u,l*d,o*c);break;case"ZXZ":t.set(l*d,l*f,o*u,o*c);break;case"XZX":t.set(o*u,l*_,l*p,o*c);break;case"YXY":t.set(l*p,o*u,l*_,o*c);break;case"ZYZ":t.set(l*_,l*p,o*u,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function ti(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return t/4294967295;case Uint16Array:return t/65535;case Uint8Array:return t/255;case Int32Array:return Math.max(t/2147483647,-1);case Int16Array:return Math.max(t/32767,-1);case Int8Array:return Math.max(t/127,-1);default:throw new Error("Invalid component type.")}}function at(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return Math.round(t*4294967295);case Uint16Array:return Math.round(t*65535);case Uint8Array:return Math.round(t*255);case Int32Array:return Math.round(t*2147483647);case Int16Array:return Math.round(t*32767);case Int8Array:return Math.round(t*127);default:throw new Error("Invalid component type.")}}const vt={DEG2RAD:Ia,RAD2DEG:no,generateUUID:Ci,clamp:cn,euclideanModulo:Tf,mapLinear:ZS,inverseLerp:JS,lerp:Ua,damp:QS,pingpong:eM,smoothstep:tM,smootherstep:nM,randInt:iM,randFloat:rM,randFloatSpread:sM,seededRandom:aM,degToRad:oM,radToDeg:lM,isPowerOfTwo:cM,ceilPowerOfTwo:uM,floorPowerOfTwo:dM,setQuaternionFromProperEuler:hM,normalize:at,denormalize:ti};class Oe{constructor(e=0,n=0){Oe.prototype.isVector2=!0,this.x=e,this.y=n}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,n){return this.x=e,this.y=n,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const n=this.x,i=this.y,r=e.elements;return this.x=r[0]*n+r[3]*i+r[6],this.y=r[1]*n+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(cn(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y;return n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this}rotateAround(e,n){const i=Math.cos(n),r=Math.sin(n),s=this.x-e.x,a=this.y-e.y;return this.x=s*i-a*r+e.x,this.y=s*r+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ge{constructor(e,n,i,r,s,a,o,l,c){Ge.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,a,o,l,c)}set(e,n,i,r,s,a,o,l,c){const u=this.elements;return u[0]=e,u[1]=r,u[2]=o,u[3]=n,u[4]=s,u[5]=l,u[6]=i,u[7]=a,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],this}extractBasis(e,n,i){return e.setFromMatrix3Column(this,0),n.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const n=e.elements;return this.set(n[0],n[4],n[8],n[1],n[5],n[9],n[2],n[6],n[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,r=n.elements,s=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],u=i[4],d=i[7],f=i[2],p=i[5],_=i[8],v=r[0],m=r[3],h=r[6],x=r[1],S=r[4],M=r[7],P=r[2],C=r[5],A=r[8];return s[0]=a*v+o*x+l*P,s[3]=a*m+o*S+l*C,s[6]=a*h+o*M+l*A,s[1]=c*v+u*x+d*P,s[4]=c*m+u*S+d*C,s[7]=c*h+u*M+d*A,s[2]=f*v+p*x+_*P,s[5]=f*m+p*S+_*C,s[8]=f*h+p*M+_*A,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[3]*=e,n[6]*=e,n[1]*=e,n[4]*=e,n[7]*=e,n[2]*=e,n[5]*=e,n[8]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8];return n*a*u-n*o*c-i*s*u+i*o*l+r*s*c-r*a*l}invert(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],d=u*a-o*c,f=o*l-u*s,p=c*s-a*l,_=n*d+i*f+r*p;if(_===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/_;return e[0]=d*v,e[1]=(r*c-u*i)*v,e[2]=(o*i-r*a)*v,e[3]=f*v,e[4]=(u*n-r*l)*v,e[5]=(r*s-o*n)*v,e[6]=p*v,e[7]=(i*l-c*n)*v,e[8]=(a*n-i*s)*v,this}transpose(){let e;const n=this.elements;return e=n[1],n[1]=n[3],n[3]=e,e=n[2],n[2]=n[6],n[6]=e,e=n[5],n[5]=n[7],n[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const n=this.elements;return e[0]=n[0],e[1]=n[3],e[2]=n[6],e[3]=n[1],e[4]=n[4],e[5]=n[7],e[6]=n[2],e[7]=n[5],e[8]=n[8],this}setUvTransform(e,n,i,r,s,a,o){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*a+c*o)+a+e,-r*c,r*l,-r*(-c*a+l*o)+o+n,0,0,1),this}scale(e,n){return this.premultiply(iu.makeScale(e,n)),this}rotate(e){return this.premultiply(iu.makeRotation(-e)),this}translate(e,n){return this.premultiply(iu.makeTranslation(e,n)),this}makeTranslation(e,n){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,n,0,0,1),this}makeRotation(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,i,n,0,0,0,1),this}makeScale(e,n){return this.set(e,0,0,0,n,0,0,0,1),this}equals(e){const n=this.elements,i=e.elements;for(let r=0;r<9;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<9;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const iu=new Ge;function X0(t){for(let e=t.length-1;e>=0;--e)if(t[e]>=65535)return!0;return!1}function io(t){return document.createElementNS("http://www.w3.org/1999/xhtml",t)}function fM(){const t=io("canvas");return t.style.display="block",t}const nm={};function bl(t){t in nm||(nm[t]=!0,console.warn(t))}function pM(t,e,n){return new Promise(function(i,r){function s(){switch(t.clientWaitSync(e,t.SYNC_FLUSH_COMMANDS_BIT,0)){case t.WAIT_FAILED:r();break;case t.TIMEOUT_EXPIRED:setTimeout(s,n);break;default:i()}}setTimeout(s,n)})}function mM(t){const e=t.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function gM(t){const e=t.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const im=new Ge().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),rm=new Ge().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),ca={[_r]:{transfer:Ql,primaries:ec,luminanceCoefficients:[.2126,.7152,.0722],toReference:t=>t,fromReference:t=>t},[tn]:{transfer:_t,primaries:ec,luminanceCoefficients:[.2126,.7152,.0722],toReference:t=>t.convertSRGBToLinear(),fromReference:t=>t.convertLinearToSRGB()},[Ec]:{transfer:Ql,primaries:tc,luminanceCoefficients:[.2289,.6917,.0793],toReference:t=>t.applyMatrix3(rm),fromReference:t=>t.applyMatrix3(im)},[wf]:{transfer:_t,primaries:tc,luminanceCoefficients:[.2289,.6917,.0793],toReference:t=>t.convertSRGBToLinear().applyMatrix3(rm),fromReference:t=>t.applyMatrix3(im).convertLinearToSRGB()}},_M=new Set([_r,Ec]),it={enabled:!0,_workingColorSpace:_r,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(t){if(!_M.has(t))throw new Error(`Unsupported working color space, "${t}".`);this._workingColorSpace=t},convert:function(t,e,n){if(this.enabled===!1||e===n||!e||!n)return t;const i=ca[e].toReference,r=ca[n].fromReference;return r(i(t))},fromWorkingColorSpace:function(t,e){return this.convert(t,this._workingColorSpace,e)},toWorkingColorSpace:function(t,e){return this.convert(t,e,this._workingColorSpace)},getPrimaries:function(t){return ca[t].primaries},getTransfer:function(t){return t===$i?Ql:ca[t].transfer},getLuminanceCoefficients:function(t,e=this._workingColorSpace){return t.fromArray(ca[e].luminanceCoefficients)}};function Us(t){return t<.04045?t*.0773993808:Math.pow(t*.9478672986+.0521327014,2.4)}function ru(t){return t<.0031308?t*12.92:1.055*Math.pow(t,.41666)-.055}let Kr;class vM{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Kr===void 0&&(Kr=io("canvas")),Kr.width=e.width,Kr.height=e.height;const i=Kr.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=Kr}return n.width>2048||n.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),n.toDataURL("image/jpeg",.6)):n.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const n=io("canvas");n.width=e.width,n.height=e.height;const i=n.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let a=0;a<s.length;a++)s[a]=Us(s[a]/255)*255;return i.putImageData(r,0,0),n}else if(e.data){const n=e.data.slice(0);for(let i=0;i<n.length;i++)n instanceof Uint8Array||n instanceof Uint8ClampedArray?n[i]=Math.floor(Us(n[i]/255)*255):n[i]=Us(n[i]);return{data:n,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let xM=0;class $0{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:xM++}),this.uuid=Ci(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let a=0,o=r.length;a<o;a++)r[a].isDataTexture?s.push(su(r[a].image)):s.push(su(r[a]))}else s=su(r);i.url=s}return n||(e.images[this.uuid]=i),i}}function su(t){return typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap?vM.getDataURL(t):t.data?{data:Array.from(t.data),width:t.width,height:t.height,type:t.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let yM=0;class rn extends Qs{constructor(e=rn.DEFAULT_IMAGE,n=rn.DEFAULT_MAPPING,i=Zi,r=Zi,s=ei,a=Ji,o=ni,l=Di,c=rn.DEFAULT_ANISOTROPY,u=$i){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:yM++}),this.uuid=Ci(),this.name="",this.source=new $0(e),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Oe(0,0),this.repeat=new Oe(1,1),this.center=new Oe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ge,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),n||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==D0)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case jd:e.x=e.x-Math.floor(e.x);break;case Zi:e.x=e.x<0?0:1;break;case Wd:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case jd:e.y=e.y-Math.floor(e.y);break;case Zi:e.y=e.y<0?0:1;break;case Wd:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}rn.DEFAULT_IMAGE=null;rn.DEFAULT_MAPPING=D0;rn.DEFAULT_ANISOTROPY=1;class ct{constructor(e=0,n=0,i=0,r=1){ct.prototype.isVector4=!0,this.x=e,this.y=n,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,n,i,r){return this.x=e,this.y=n,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;case 3:this.w=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this.w=e.w+n.w,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this.w+=e.w*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this.w=e.w-n.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const n=this.x,i=this.y,r=this.z,s=this.w,a=e.elements;return this.x=a[0]*n+a[4]*i+a[8]*r+a[12]*s,this.y=a[1]*n+a[5]*i+a[9]*r+a[13]*s,this.z=a[2]*n+a[6]*i+a[10]*r+a[14]*s,this.w=a[3]*n+a[7]*i+a[11]*r+a[15]*s,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const n=Math.sqrt(1-e.w*e.w);return n<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/n,this.y=e.y/n,this.z=e.z/n),this}setAxisAngleFromRotationMatrix(e){let n,i,r,s;const l=e.elements,c=l[0],u=l[4],d=l[8],f=l[1],p=l[5],_=l[9],v=l[2],m=l[6],h=l[10];if(Math.abs(u-f)<.01&&Math.abs(d-v)<.01&&Math.abs(_-m)<.01){if(Math.abs(u+f)<.1&&Math.abs(d+v)<.1&&Math.abs(_+m)<.1&&Math.abs(c+p+h-3)<.1)return this.set(1,0,0,0),this;n=Math.PI;const S=(c+1)/2,M=(p+1)/2,P=(h+1)/2,C=(u+f)/4,A=(d+v)/4,b=(_+m)/4;return S>M&&S>P?S<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(S),r=C/i,s=A/i):M>P?M<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(M),i=C/r,s=b/r):P<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(P),i=A/s,r=b/s),this.set(i,r,s,n),this}let x=Math.sqrt((m-_)*(m-_)+(d-v)*(d-v)+(f-u)*(f-u));return Math.abs(x)<.001&&(x=1),this.x=(m-_)/x,this.y=(d-v)/x,this.z=(f-u)/x,this.w=Math.acos((c+p+h-1)/2),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this.w=n[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this.z=Math.max(e.z,Math.min(n.z,this.z)),this.w=Math.max(e.w,Math.min(n.w,this.w)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this.z=Math.max(e,Math.min(n,this.z)),this.w=Math.max(e,Math.min(n,this.w)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this.w+=(e.w-this.w)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this.w=e.w+(n.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this.w=e[n+3],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e[n+3]=this.w,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this.w=e.getW(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class SM extends Qs{constructor(e=1,n=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=n,this.depth=1,this.scissor=new ct(0,0,e,n),this.scissorTest=!1,this.viewport=new ct(0,0,e,n);const r={width:e,height:n,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ei,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const s=new rn(r,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);s.flipY=!1,s.generateMipmaps=i.generateMipmaps,s.internalFormat=i.internalFormat,this.textures=[];const a=i.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,n,i=1){if(this.width!==e||this.height!==n||this.depth!==i){this.width=e,this.height=n,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=n,this.textures[r].image.depth=i;this.dispose()}this.viewport.set(0,0,e,n),this.scissor.set(0,0,e,n)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let i=0,r=e.textures.length;i<r;i++)this.textures[i]=e.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const n=Object.assign({},e.texture.image);return this.texture.source=new $0(n),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Vr extends SM{constructor(e=1,n=1,i={}){super(e,n,i),this.isWebGLRenderTarget=!0}}class Y0 extends rn{constructor(e=null,n=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=Bn,this.minFilter=Bn,this.wrapR=Zi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class MM extends rn{constructor(e=null,n=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=Bn,this.minFilter=Bn,this.wrapR=Zi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class uo{constructor(e=0,n=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=n,this._z=i,this._w=r}static slerpFlat(e,n,i,r,s,a,o){let l=i[r+0],c=i[r+1],u=i[r+2],d=i[r+3];const f=s[a+0],p=s[a+1],_=s[a+2],v=s[a+3];if(o===0){e[n+0]=l,e[n+1]=c,e[n+2]=u,e[n+3]=d;return}if(o===1){e[n+0]=f,e[n+1]=p,e[n+2]=_,e[n+3]=v;return}if(d!==v||l!==f||c!==p||u!==_){let m=1-o;const h=l*f+c*p+u*_+d*v,x=h>=0?1:-1,S=1-h*h;if(S>Number.EPSILON){const P=Math.sqrt(S),C=Math.atan2(P,h*x);m=Math.sin(m*C)/P,o=Math.sin(o*C)/P}const M=o*x;if(l=l*m+f*M,c=c*m+p*M,u=u*m+_*M,d=d*m+v*M,m===1-o){const P=1/Math.sqrt(l*l+c*c+u*u+d*d);l*=P,c*=P,u*=P,d*=P}}e[n]=l,e[n+1]=c,e[n+2]=u,e[n+3]=d}static multiplyQuaternionsFlat(e,n,i,r,s,a){const o=i[r],l=i[r+1],c=i[r+2],u=i[r+3],d=s[a],f=s[a+1],p=s[a+2],_=s[a+3];return e[n]=o*_+u*d+l*p-c*f,e[n+1]=l*_+u*f+c*d-o*p,e[n+2]=c*_+u*p+o*f-l*d,e[n+3]=u*_-o*d-l*f-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,n,i,r){return this._x=e,this._y=n,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,n=!0){const i=e._x,r=e._y,s=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(i/2),u=o(r/2),d=o(s/2),f=l(i/2),p=l(r/2),_=l(s/2);switch(a){case"XYZ":this._x=f*u*d+c*p*_,this._y=c*p*d-f*u*_,this._z=c*u*_+f*p*d,this._w=c*u*d-f*p*_;break;case"YXZ":this._x=f*u*d+c*p*_,this._y=c*p*d-f*u*_,this._z=c*u*_-f*p*d,this._w=c*u*d+f*p*_;break;case"ZXY":this._x=f*u*d-c*p*_,this._y=c*p*d+f*u*_,this._z=c*u*_+f*p*d,this._w=c*u*d-f*p*_;break;case"ZYX":this._x=f*u*d-c*p*_,this._y=c*p*d+f*u*_,this._z=c*u*_-f*p*d,this._w=c*u*d+f*p*_;break;case"YZX":this._x=f*u*d+c*p*_,this._y=c*p*d+f*u*_,this._z=c*u*_-f*p*d,this._w=c*u*d-f*p*_;break;case"XZY":this._x=f*u*d-c*p*_,this._y=c*p*d-f*u*_,this._z=c*u*_+f*p*d,this._w=c*u*d+f*p*_;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return n===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,n){const i=n/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const n=e.elements,i=n[0],r=n[4],s=n[8],a=n[1],o=n[5],l=n[9],c=n[2],u=n[6],d=n[10],f=i+o+d;if(f>0){const p=.5/Math.sqrt(f+1);this._w=.25/p,this._x=(u-l)*p,this._y=(s-c)*p,this._z=(a-r)*p}else if(i>o&&i>d){const p=2*Math.sqrt(1+i-o-d);this._w=(u-l)/p,this._x=.25*p,this._y=(r+a)/p,this._z=(s+c)/p}else if(o>d){const p=2*Math.sqrt(1+o-i-d);this._w=(s-c)/p,this._x=(r+a)/p,this._y=.25*p,this._z=(l+u)/p}else{const p=2*Math.sqrt(1+d-i-o);this._w=(a-r)/p,this._x=(s+c)/p,this._y=(l+u)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,n){let i=e.dot(n)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*n.z-e.z*n.y,this._y=e.z*n.x-e.x*n.z,this._z=e.x*n.y-e.y*n.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(cn(this.dot(e),-1,1)))}rotateTowards(e,n){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,n/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,n){const i=e._x,r=e._y,s=e._z,a=e._w,o=n._x,l=n._y,c=n._z,u=n._w;return this._x=i*u+a*o+r*c-s*l,this._y=r*u+a*l+s*o-i*c,this._z=s*u+a*c+i*l-r*o,this._w=a*u-i*o-r*l-s*c,this._onChangeCallback(),this}slerp(e,n){if(n===0)return this;if(n===1)return this.copy(e);const i=this._x,r=this._y,s=this._z,a=this._w;let o=a*e._w+i*e._x+r*e._y+s*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=i,this._y=r,this._z=s,this;const l=1-o*o;if(l<=Number.EPSILON){const p=1-n;return this._w=p*a+n*this._w,this._x=p*i+n*this._x,this._y=p*r+n*this._y,this._z=p*s+n*this._z,this.normalize(),this}const c=Math.sqrt(l),u=Math.atan2(c,o),d=Math.sin((1-n)*u)/c,f=Math.sin(n*u)/c;return this._w=a*d+this._w*f,this._x=i*d+this._x*f,this._y=r*d+this._y*f,this._z=s*d+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,n,i){return this.copy(e).slerp(n,i)}random(){const e=2*Math.PI*Math.random(),n=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(n),s*Math.cos(n))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,n=0){return this._x=e[n],this._y=e[n+1],this._z=e[n+2],this._w=e[n+3],this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._w,e}fromBufferAttribute(e,n){return this._x=e.getX(n),this._y=e.getY(n),this._z=e.getZ(n),this._w=e.getW(n),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class N{constructor(e=0,n=0,i=0){N.prototype.isVector3=!0,this.x=e,this.y=n,this.z=i}set(e,n,i){return i===void 0&&(i=this.z),this.x=e,this.y=n,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,n){return this.x=e.x*n.x,this.y=e.y*n.y,this.z=e.z*n.z,this}applyEuler(e){return this.applyQuaternion(sm.setFromEuler(e))}applyAxisAngle(e,n){return this.applyQuaternion(sm.setFromAxisAngle(e,n))}applyMatrix3(e){const n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[3]*i+s[6]*r,this.y=s[1]*n+s[4]*i+s[7]*r,this.z=s[2]*n+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const n=this.x,i=this.y,r=this.z,s=e.elements,a=1/(s[3]*n+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*n+s[4]*i+s[8]*r+s[12])*a,this.y=(s[1]*n+s[5]*i+s[9]*r+s[13])*a,this.z=(s[2]*n+s[6]*i+s[10]*r+s[14])*a,this}applyQuaternion(e){const n=this.x,i=this.y,r=this.z,s=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*r-o*i),u=2*(o*n-s*r),d=2*(s*i-a*n);return this.x=n+l*c+a*d-o*u,this.y=i+l*u+o*c-s*d,this.z=r+l*d+s*u-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[4]*i+s[8]*r,this.y=s[1]*n+s[5]*i+s[9]*r,this.z=s[2]*n+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this.z=Math.max(e.z,Math.min(n.z,this.z)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this.z=Math.max(e,Math.min(n,this.z)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,n){const i=e.x,r=e.y,s=e.z,a=n.x,o=n.y,l=n.z;return this.x=r*l-s*o,this.y=s*a-i*l,this.z=i*o-r*a,this}projectOnVector(e){const n=e.lengthSq();if(n===0)return this.set(0,0,0);const i=e.dot(this)/n;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return au.copy(this).projectOnVector(e),this.sub(au)}reflect(e){return this.sub(au.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(cn(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return n*n+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,n,i){const r=Math.sin(n)*e;return this.x=r*Math.sin(i),this.y=Math.cos(n)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,n,i){return this.x=e*Math.sin(n),this.y=i,this.z=e*Math.cos(n),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this}setFromMatrixScale(e){const n=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=n,this.y=i,this.z=r,this}setFromMatrixColumn(e,n){return this.fromArray(e.elements,n*4)}setFromMatrix3Column(e,n){return this.fromArray(e.elements,n*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,n=Math.random()*2-1,i=Math.sqrt(1-n*n);return this.x=i*Math.cos(e),this.y=n,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const au=new N,sm=new uo;class ho{constructor(e=new N(1/0,1/0,1/0),n=new N(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=n}set(e,n){return this.min.copy(e),this.max.copy(n),this}setFromArray(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n+=3)this.expandByPoint(Yn.fromArray(e,n));return this}setFromBufferAttribute(e){this.makeEmpty();for(let n=0,i=e.count;n<i;n++)this.expandByPoint(Yn.fromBufferAttribute(e,n));return this}setFromPoints(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n++)this.expandByPoint(e[n]);return this}setFromCenterAndSize(e,n){const i=Yn.copy(n).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,n=!1){return this.makeEmpty(),this.expandByObject(e,n)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,n=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(n===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Yn):Yn.fromBufferAttribute(s,a),Yn.applyMatrix4(e.matrixWorld),this.expandByPoint(Yn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Uo.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Uo.copy(i.boundingBox)),Uo.applyMatrix4(e.matrixWorld),this.union(Uo)}const r=e.children;for(let s=0,a=r.length;s<a;s++)this.expandByObject(r[s],n);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,n){return n.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Yn),Yn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let n,i;return e.normal.x>0?(n=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(n=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(n+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(n+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(n+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(n+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),n<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ua),ko.subVectors(this.max,ua),Zr.subVectors(e.a,ua),Jr.subVectors(e.b,ua),Qr.subVectors(e.c,ua),Fi.subVectors(Jr,Zr),Oi.subVectors(Qr,Jr),yr.subVectors(Zr,Qr);let n=[0,-Fi.z,Fi.y,0,-Oi.z,Oi.y,0,-yr.z,yr.y,Fi.z,0,-Fi.x,Oi.z,0,-Oi.x,yr.z,0,-yr.x,-Fi.y,Fi.x,0,-Oi.y,Oi.x,0,-yr.y,yr.x,0];return!ou(n,Zr,Jr,Qr,ko)||(n=[1,0,0,0,1,0,0,0,1],!ou(n,Zr,Jr,Qr,ko))?!1:(Fo.crossVectors(Fi,Oi),n=[Fo.x,Fo.y,Fo.z],ou(n,Zr,Jr,Qr,ko))}clampPoint(e,n){return n.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Yn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Yn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(pi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),pi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),pi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),pi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),pi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),pi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),pi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),pi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(pi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const pi=[new N,new N,new N,new N,new N,new N,new N,new N],Yn=new N,Uo=new ho,Zr=new N,Jr=new N,Qr=new N,Fi=new N,Oi=new N,yr=new N,ua=new N,ko=new N,Fo=new N,Sr=new N;function ou(t,e,n,i,r){for(let s=0,a=t.length-3;s<=a;s+=3){Sr.fromArray(t,s);const o=r.x*Math.abs(Sr.x)+r.y*Math.abs(Sr.y)+r.z*Math.abs(Sr.z),l=e.dot(Sr),c=n.dot(Sr),u=i.dot(Sr);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>o)return!1}return!0}const EM=new ho,da=new N,lu=new N;class fo{constructor(e=new N,n=-1){this.isSphere=!0,this.center=e,this.radius=n}set(e,n){return this.center.copy(e),this.radius=n,this}setFromPoints(e,n){const i=this.center;n!==void 0?i.copy(n):EM.setFromPoints(e).getCenter(i);let r=0;for(let s=0,a=e.length;s<a;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const n=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=n*n}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,n){const i=this.center.distanceToSquared(e);return n.copy(e),i>this.radius*this.radius&&(n.sub(this.center).normalize(),n.multiplyScalar(this.radius).add(this.center)),n}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;da.subVectors(e,this.center);const n=da.lengthSq();if(n>this.radius*this.radius){const i=Math.sqrt(n),r=(i-this.radius)*.5;this.center.addScaledVector(da,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(lu.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(da.copy(e.center).add(lu)),this.expandByPoint(da.copy(e.center).sub(lu))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const mi=new N,cu=new N,Oo=new N,zi=new N,uu=new N,zo=new N,du=new N;class wc{constructor(e=new N,n=new N(0,0,-1)){this.origin=e,this.direction=n}set(e,n){return this.origin.copy(e),this.direction.copy(n),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,n){return n.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,mi)),this}closestPointToPoint(e,n){n.subVectors(e,this.origin);const i=n.dot(this.direction);return i<0?n.copy(this.origin):n.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const n=mi.subVectors(e,this.origin).dot(this.direction);return n<0?this.origin.distanceToSquared(e):(mi.copy(this.origin).addScaledVector(this.direction,n),mi.distanceToSquared(e))}distanceSqToSegment(e,n,i,r){cu.copy(e).add(n).multiplyScalar(.5),Oo.copy(n).sub(e).normalize(),zi.copy(this.origin).sub(cu);const s=e.distanceTo(n)*.5,a=-this.direction.dot(Oo),o=zi.dot(this.direction),l=-zi.dot(Oo),c=zi.lengthSq(),u=Math.abs(1-a*a);let d,f,p,_;if(u>0)if(d=a*l-o,f=a*o-l,_=s*u,d>=0)if(f>=-_)if(f<=_){const v=1/u;d*=v,f*=v,p=d*(d+a*f+2*o)+f*(a*d+f+2*l)+c}else f=s,d=Math.max(0,-(a*f+o)),p=-d*d+f*(f+2*l)+c;else f=-s,d=Math.max(0,-(a*f+o)),p=-d*d+f*(f+2*l)+c;else f<=-_?(d=Math.max(0,-(-a*s+o)),f=d>0?-s:Math.min(Math.max(-s,-l),s),p=-d*d+f*(f+2*l)+c):f<=_?(d=0,f=Math.min(Math.max(-s,-l),s),p=f*(f+2*l)+c):(d=Math.max(0,-(a*s+o)),f=d>0?s:Math.min(Math.max(-s,-l),s),p=-d*d+f*(f+2*l)+c);else f=a>0?-s:s,d=Math.max(0,-(a*f+o)),p=-d*d+f*(f+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,d),r&&r.copy(cu).addScaledVector(Oo,f),p}intersectSphere(e,n){mi.subVectors(e.center,this.origin);const i=mi.dot(this.direction),r=mi.dot(mi)-i*i,s=e.radius*e.radius;if(r>s)return null;const a=Math.sqrt(s-r),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,n):this.at(o,n)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const n=e.normal.dot(this.direction);if(n===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/n;return i>=0?i:null}intersectPlane(e,n){const i=this.distanceToPlane(e);return i===null?null:this.at(i,n)}intersectsPlane(e){const n=e.distanceToPoint(this.origin);return n===0||e.normal.dot(this.direction)*n<0}intersectBox(e,n){let i,r,s,a,o,l;const c=1/this.direction.x,u=1/this.direction.y,d=1/this.direction.z,f=this.origin;return c>=0?(i=(e.min.x-f.x)*c,r=(e.max.x-f.x)*c):(i=(e.max.x-f.x)*c,r=(e.min.x-f.x)*c),u>=0?(s=(e.min.y-f.y)*u,a=(e.max.y-f.y)*u):(s=(e.max.y-f.y)*u,a=(e.min.y-f.y)*u),i>a||s>r||((s>i||isNaN(i))&&(i=s),(a<r||isNaN(r))&&(r=a),d>=0?(o=(e.min.z-f.z)*d,l=(e.max.z-f.z)*d):(o=(e.max.z-f.z)*d,l=(e.min.z-f.z)*d),i>l||o>r)||((o>i||i!==i)&&(i=o),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,n)}intersectsBox(e){return this.intersectBox(e,mi)!==null}intersectTriangle(e,n,i,r,s){uu.subVectors(n,e),zo.subVectors(i,e),du.crossVectors(uu,zo);let a=this.direction.dot(du),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;zi.subVectors(this.origin,e);const l=o*this.direction.dot(zo.crossVectors(zi,zo));if(l<0)return null;const c=o*this.direction.dot(uu.cross(zi));if(c<0||l+c>a)return null;const u=-o*zi.dot(du);return u<0?null:this.at(u/a,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ut{constructor(e,n,i,r,s,a,o,l,c,u,d,f,p,_,v,m){ut.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,a,o,l,c,u,d,f,p,_,v,m)}set(e,n,i,r,s,a,o,l,c,u,d,f,p,_,v,m){const h=this.elements;return h[0]=e,h[4]=n,h[8]=i,h[12]=r,h[1]=s,h[5]=a,h[9]=o,h[13]=l,h[2]=c,h[6]=u,h[10]=d,h[14]=f,h[3]=p,h[7]=_,h[11]=v,h[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ut().fromArray(this.elements)}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],n[9]=i[9],n[10]=i[10],n[11]=i[11],n[12]=i[12],n[13]=i[13],n[14]=i[14],n[15]=i[15],this}copyPosition(e){const n=this.elements,i=e.elements;return n[12]=i[12],n[13]=i[13],n[14]=i[14],this}setFromMatrix3(e){const n=e.elements;return this.set(n[0],n[3],n[6],0,n[1],n[4],n[7],0,n[2],n[5],n[8],0,0,0,0,1),this}extractBasis(e,n,i){return e.setFromMatrixColumn(this,0),n.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,n,i){return this.set(e.x,n.x,i.x,0,e.y,n.y,i.y,0,e.z,n.z,i.z,0,0,0,0,1),this}extractRotation(e){const n=this.elements,i=e.elements,r=1/es.setFromMatrixColumn(e,0).length(),s=1/es.setFromMatrixColumn(e,1).length(),a=1/es.setFromMatrixColumn(e,2).length();return n[0]=i[0]*r,n[1]=i[1]*r,n[2]=i[2]*r,n[3]=0,n[4]=i[4]*s,n[5]=i[5]*s,n[6]=i[6]*s,n[7]=0,n[8]=i[8]*a,n[9]=i[9]*a,n[10]=i[10]*a,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromEuler(e){const n=this.elements,i=e.x,r=e.y,s=e.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(r),c=Math.sin(r),u=Math.cos(s),d=Math.sin(s);if(e.order==="XYZ"){const f=a*u,p=a*d,_=o*u,v=o*d;n[0]=l*u,n[4]=-l*d,n[8]=c,n[1]=p+_*c,n[5]=f-v*c,n[9]=-o*l,n[2]=v-f*c,n[6]=_+p*c,n[10]=a*l}else if(e.order==="YXZ"){const f=l*u,p=l*d,_=c*u,v=c*d;n[0]=f+v*o,n[4]=_*o-p,n[8]=a*c,n[1]=a*d,n[5]=a*u,n[9]=-o,n[2]=p*o-_,n[6]=v+f*o,n[10]=a*l}else if(e.order==="ZXY"){const f=l*u,p=l*d,_=c*u,v=c*d;n[0]=f-v*o,n[4]=-a*d,n[8]=_+p*o,n[1]=p+_*o,n[5]=a*u,n[9]=v-f*o,n[2]=-a*c,n[6]=o,n[10]=a*l}else if(e.order==="ZYX"){const f=a*u,p=a*d,_=o*u,v=o*d;n[0]=l*u,n[4]=_*c-p,n[8]=f*c+v,n[1]=l*d,n[5]=v*c+f,n[9]=p*c-_,n[2]=-c,n[6]=o*l,n[10]=a*l}else if(e.order==="YZX"){const f=a*l,p=a*c,_=o*l,v=o*c;n[0]=l*u,n[4]=v-f*d,n[8]=_*d+p,n[1]=d,n[5]=a*u,n[9]=-o*u,n[2]=-c*u,n[6]=p*d+_,n[10]=f-v*d}else if(e.order==="XZY"){const f=a*l,p=a*c,_=o*l,v=o*c;n[0]=l*u,n[4]=-d,n[8]=c*u,n[1]=f*d+v,n[5]=a*u,n[9]=p*d-_,n[2]=_*d-p,n[6]=o*u,n[10]=v*d+f}return n[3]=0,n[7]=0,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromQuaternion(e){return this.compose(wM,e,TM)}lookAt(e,n,i){const r=this.elements;return wn.subVectors(e,n),wn.lengthSq()===0&&(wn.z=1),wn.normalize(),Bi.crossVectors(i,wn),Bi.lengthSq()===0&&(Math.abs(i.z)===1?wn.x+=1e-4:wn.z+=1e-4,wn.normalize(),Bi.crossVectors(i,wn)),Bi.normalize(),Bo.crossVectors(wn,Bi),r[0]=Bi.x,r[4]=Bo.x,r[8]=wn.x,r[1]=Bi.y,r[5]=Bo.y,r[9]=wn.y,r[2]=Bi.z,r[6]=Bo.z,r[10]=wn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,r=n.elements,s=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],u=i[1],d=i[5],f=i[9],p=i[13],_=i[2],v=i[6],m=i[10],h=i[14],x=i[3],S=i[7],M=i[11],P=i[15],C=r[0],A=r[4],b=r[8],z=r[12],y=r[1],E=r[5],U=r[9],F=r[13],X=r[2],K=r[6],V=r[10],ie=r[14],D=r[3],ee=r[7],ne=r[11],ce=r[15];return s[0]=a*C+o*y+l*X+c*D,s[4]=a*A+o*E+l*K+c*ee,s[8]=a*b+o*U+l*V+c*ne,s[12]=a*z+o*F+l*ie+c*ce,s[1]=u*C+d*y+f*X+p*D,s[5]=u*A+d*E+f*K+p*ee,s[9]=u*b+d*U+f*V+p*ne,s[13]=u*z+d*F+f*ie+p*ce,s[2]=_*C+v*y+m*X+h*D,s[6]=_*A+v*E+m*K+h*ee,s[10]=_*b+v*U+m*V+h*ne,s[14]=_*z+v*F+m*ie+h*ce,s[3]=x*C+S*y+M*X+P*D,s[7]=x*A+S*E+M*K+P*ee,s[11]=x*b+S*U+M*V+P*ne,s[15]=x*z+S*F+M*ie+P*ce,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[4]*=e,n[8]*=e,n[12]*=e,n[1]*=e,n[5]*=e,n[9]*=e,n[13]*=e,n[2]*=e,n[6]*=e,n[10]*=e,n[14]*=e,n[3]*=e,n[7]*=e,n[11]*=e,n[15]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[4],r=e[8],s=e[12],a=e[1],o=e[5],l=e[9],c=e[13],u=e[2],d=e[6],f=e[10],p=e[14],_=e[3],v=e[7],m=e[11],h=e[15];return _*(+s*l*d-r*c*d-s*o*f+i*c*f+r*o*p-i*l*p)+v*(+n*l*p-n*c*f+s*a*f-r*a*p+r*c*u-s*l*u)+m*(+n*c*d-n*o*p-s*a*d+i*a*p+s*o*u-i*c*u)+h*(-r*o*u-n*l*d+n*o*f+r*a*d-i*a*f+i*l*u)}transpose(){const e=this.elements;let n;return n=e[1],e[1]=e[4],e[4]=n,n=e[2],e[2]=e[8],e[8]=n,n=e[6],e[6]=e[9],e[9]=n,n=e[3],e[3]=e[12],e[12]=n,n=e[7],e[7]=e[13],e[13]=n,n=e[11],e[11]=e[14],e[14]=n,this}setPosition(e,n,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=n,r[14]=i),this}invert(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],d=e[9],f=e[10],p=e[11],_=e[12],v=e[13],m=e[14],h=e[15],x=d*m*c-v*f*c+v*l*p-o*m*p-d*l*h+o*f*h,S=_*f*c-u*m*c-_*l*p+a*m*p+u*l*h-a*f*h,M=u*v*c-_*d*c+_*o*p-a*v*p-u*o*h+a*d*h,P=_*d*l-u*v*l-_*o*f+a*v*f+u*o*m-a*d*m,C=n*x+i*S+r*M+s*P;if(C===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/C;return e[0]=x*A,e[1]=(v*f*s-d*m*s-v*r*p+i*m*p+d*r*h-i*f*h)*A,e[2]=(o*m*s-v*l*s+v*r*c-i*m*c-o*r*h+i*l*h)*A,e[3]=(d*l*s-o*f*s-d*r*c+i*f*c+o*r*p-i*l*p)*A,e[4]=S*A,e[5]=(u*m*s-_*f*s+_*r*p-n*m*p-u*r*h+n*f*h)*A,e[6]=(_*l*s-a*m*s-_*r*c+n*m*c+a*r*h-n*l*h)*A,e[7]=(a*f*s-u*l*s+u*r*c-n*f*c-a*r*p+n*l*p)*A,e[8]=M*A,e[9]=(_*d*s-u*v*s-_*i*p+n*v*p+u*i*h-n*d*h)*A,e[10]=(a*v*s-_*o*s+_*i*c-n*v*c-a*i*h+n*o*h)*A,e[11]=(u*o*s-a*d*s-u*i*c+n*d*c+a*i*p-n*o*p)*A,e[12]=P*A,e[13]=(u*v*r-_*d*r+_*i*f-n*v*f-u*i*m+n*d*m)*A,e[14]=(_*o*r-a*v*r-_*i*l+n*v*l+a*i*m-n*o*m)*A,e[15]=(a*d*r-u*o*r+u*i*l-n*d*l-a*i*f+n*o*f)*A,this}scale(e){const n=this.elements,i=e.x,r=e.y,s=e.z;return n[0]*=i,n[4]*=r,n[8]*=s,n[1]*=i,n[5]*=r,n[9]*=s,n[2]*=i,n[6]*=r,n[10]*=s,n[3]*=i,n[7]*=r,n[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,n=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(n,i,r))}makeTranslation(e,n,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,n,0,0,1,i,0,0,0,1),this}makeRotationX(e){const n=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,n,-i,0,0,i,n,0,0,0,0,1),this}makeRotationY(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,0,i,0,0,1,0,0,-i,0,n,0,0,0,0,1),this}makeRotationZ(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,0,i,n,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,n){const i=Math.cos(n),r=Math.sin(n),s=1-i,a=e.x,o=e.y,l=e.z,c=s*a,u=s*o;return this.set(c*a+i,c*o-r*l,c*l+r*o,0,c*o+r*l,u*o+i,u*l-r*a,0,c*l-r*o,u*l+r*a,s*l*l+i,0,0,0,0,1),this}makeScale(e,n,i){return this.set(e,0,0,0,0,n,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,n,i,r,s,a){return this.set(1,i,s,0,e,1,a,0,n,r,1,0,0,0,0,1),this}compose(e,n,i){const r=this.elements,s=n._x,a=n._y,o=n._z,l=n._w,c=s+s,u=a+a,d=o+o,f=s*c,p=s*u,_=s*d,v=a*u,m=a*d,h=o*d,x=l*c,S=l*u,M=l*d,P=i.x,C=i.y,A=i.z;return r[0]=(1-(v+h))*P,r[1]=(p+M)*P,r[2]=(_-S)*P,r[3]=0,r[4]=(p-M)*C,r[5]=(1-(f+h))*C,r[6]=(m+x)*C,r[7]=0,r[8]=(_+S)*A,r[9]=(m-x)*A,r[10]=(1-(f+v))*A,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,n,i){const r=this.elements;let s=es.set(r[0],r[1],r[2]).length();const a=es.set(r[4],r[5],r[6]).length(),o=es.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],qn.copy(this);const c=1/s,u=1/a,d=1/o;return qn.elements[0]*=c,qn.elements[1]*=c,qn.elements[2]*=c,qn.elements[4]*=u,qn.elements[5]*=u,qn.elements[6]*=u,qn.elements[8]*=d,qn.elements[9]*=d,qn.elements[10]*=d,n.setFromRotationMatrix(qn),i.x=s,i.y=a,i.z=o,this}makePerspective(e,n,i,r,s,a,o=Ai){const l=this.elements,c=2*s/(n-e),u=2*s/(i-r),d=(n+e)/(n-e),f=(i+r)/(i-r);let p,_;if(o===Ai)p=-(a+s)/(a-s),_=-2*a*s/(a-s);else if(o===nc)p=-a/(a-s),_=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=u,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=_,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,n,i,r,s,a,o=Ai){const l=this.elements,c=1/(n-e),u=1/(i-r),d=1/(a-s),f=(n+e)*c,p=(i+r)*u;let _,v;if(o===Ai)_=(a+s)*d,v=-2*d;else if(o===nc)_=s*d,v=-1*d;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-f,l[1]=0,l[5]=2*u,l[9]=0,l[13]=-p,l[2]=0,l[6]=0,l[10]=v,l[14]=-_,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const n=this.elements,i=e.elements;for(let r=0;r<16;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<16;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e[n+9]=i[9],e[n+10]=i[10],e[n+11]=i[11],e[n+12]=i[12],e[n+13]=i[13],e[n+14]=i[14],e[n+15]=i[15],e}}const es=new N,qn=new ut,wM=new N(0,0,0),TM=new N(1,1,1),Bi=new N,Bo=new N,wn=new N,am=new ut,om=new uo;class fi{constructor(e=0,n=0,i=0,r=fi.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=n,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,n,i,r=this._order){return this._x=e,this._y=n,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,n=this._order,i=!0){const r=e.elements,s=r[0],a=r[4],o=r[8],l=r[1],c=r[5],u=r[9],d=r[2],f=r[6],p=r[10];switch(n){case"XYZ":this._y=Math.asin(cn(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,p),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-cn(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,s),this._z=0);break;case"ZXY":this._x=Math.asin(cn(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-d,p),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-cn(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(f,p),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(cn(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-d,s)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-cn(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-u,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+n)}return this._order=n,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,n,i){return am.makeRotationFromQuaternion(e),this.setFromRotationMatrix(am,n,i)}setFromVector3(e,n=this._order){return this.set(e.x,e.y,e.z,n)}reorder(e){return om.setFromEuler(this),this.setFromQuaternion(om,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}fi.DEFAULT_ORDER="XYZ";class Af{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let AM=0;const lm=new N,ts=new uo,gi=new ut,Ho=new N,ha=new N,bM=new N,CM=new uo,cm=new N(1,0,0),um=new N(0,1,0),dm=new N(0,0,1),hm={type:"added"},RM={type:"removed"},ns={type:"childadded",child:null},hu={type:"childremoved",child:null};class Dt extends Qs{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:AM++}),this.uuid=Ci(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Dt.DEFAULT_UP.clone();const e=new N,n=new fi,i=new uo,r=new N(1,1,1);function s(){i.setFromEuler(n,!1)}function a(){n.setFromQuaternion(i,void 0,!1)}n._onChange(s),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new ut},normalMatrix:{value:new Ge}}),this.matrix=new ut,this.matrixWorld=new ut,this.matrixAutoUpdate=Dt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Dt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Af,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,n){this.quaternion.setFromAxisAngle(e,n)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,n){return ts.setFromAxisAngle(e,n),this.quaternion.multiply(ts),this}rotateOnWorldAxis(e,n){return ts.setFromAxisAngle(e,n),this.quaternion.premultiply(ts),this}rotateX(e){return this.rotateOnAxis(cm,e)}rotateY(e){return this.rotateOnAxis(um,e)}rotateZ(e){return this.rotateOnAxis(dm,e)}translateOnAxis(e,n){return lm.copy(e).applyQuaternion(this.quaternion),this.position.add(lm.multiplyScalar(n)),this}translateX(e){return this.translateOnAxis(cm,e)}translateY(e){return this.translateOnAxis(um,e)}translateZ(e){return this.translateOnAxis(dm,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(gi.copy(this.matrixWorld).invert())}lookAt(e,n,i){e.isVector3?Ho.copy(e):Ho.set(e,n,i);const r=this.parent;this.updateWorldMatrix(!0,!1),ha.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?gi.lookAt(ha,Ho,this.up):gi.lookAt(Ho,ha,this.up),this.quaternion.setFromRotationMatrix(gi),r&&(gi.extractRotation(r.matrixWorld),ts.setFromRotationMatrix(gi),this.quaternion.premultiply(ts.invert()))}add(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.add(arguments[n]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(hm),ns.child=e,this.dispatchEvent(ns),ns.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const n=this.children.indexOf(e);return n!==-1&&(e.parent=null,this.children.splice(n,1),e.dispatchEvent(RM),hu.child=e,this.dispatchEvent(hu),hu.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),gi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),gi.multiply(e.parent.matrixWorld)),e.applyMatrix4(gi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(hm),ns.child=e,this.dispatchEvent(ns),ns.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,n){if(this[e]===n)return this;for(let i=0,r=this.children.length;i<r;i++){const a=this.children[i].getObjectByProperty(e,n);if(a!==void 0)return a}}getObjectsByProperty(e,n,i=[]){this[e]===n&&i.push(this);const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].getObjectsByProperty(e,n,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ha,e,bM),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ha,CM,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const n=this.matrixWorld.elements;return e.set(n[8],n[9],n[10]).normalize()}raycast(){}traverse(e){e(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverseVisible(e)}traverseAncestors(e){const n=this.parent;n!==null&&(e(n),n.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].updateMatrixWorld(e)}updateWorldMatrix(e,n){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),n===!0){const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){const n=e===void 0||typeof e=="string",i={};n&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const d=l[c];s(e.shapes,d)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(s(e.materials,this.material[l]));r.material=o}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];r.animations.push(s(e.animations,l))}}if(n){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),u=a(e.images),d=a(e.shapes),f=a(e.skeletons),p=a(e.animations),_=a(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),u.length>0&&(i.images=u),d.length>0&&(i.shapes=d),f.length>0&&(i.skeletons=f),p.length>0&&(i.animations=p),_.length>0&&(i.nodes=_)}return i.object=r,i;function a(o){const l=[];for(const c in o){const u=o[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,n=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),n===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}Dt.DEFAULT_UP=new N(0,1,0);Dt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Dt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Kn=new N,_i=new N,fu=new N,vi=new N,is=new N,rs=new N,fm=new N,pu=new N,mu=new N,gu=new N,_u=new ct,vu=new ct,xu=new ct;class Fn{constructor(e=new N,n=new N,i=new N){this.a=e,this.b=n,this.c=i}static getNormal(e,n,i,r){r.subVectors(i,n),Kn.subVectors(e,n),r.cross(Kn);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,n,i,r,s){Kn.subVectors(r,n),_i.subVectors(i,n),fu.subVectors(e,n);const a=Kn.dot(Kn),o=Kn.dot(_i),l=Kn.dot(fu),c=_i.dot(_i),u=_i.dot(fu),d=a*c-o*o;if(d===0)return s.set(0,0,0),null;const f=1/d,p=(c*l-o*u)*f,_=(a*u-o*l)*f;return s.set(1-p-_,_,p)}static containsPoint(e,n,i,r){return this.getBarycoord(e,n,i,r,vi)===null?!1:vi.x>=0&&vi.y>=0&&vi.x+vi.y<=1}static getInterpolation(e,n,i,r,s,a,o,l){return this.getBarycoord(e,n,i,r,vi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,vi.x),l.addScaledVector(a,vi.y),l.addScaledVector(o,vi.z),l)}static getInterpolatedAttribute(e,n,i,r,s,a){return _u.setScalar(0),vu.setScalar(0),xu.setScalar(0),_u.fromBufferAttribute(e,n),vu.fromBufferAttribute(e,i),xu.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(_u,s.x),a.addScaledVector(vu,s.y),a.addScaledVector(xu,s.z),a}static isFrontFacing(e,n,i,r){return Kn.subVectors(i,n),_i.subVectors(e,n),Kn.cross(_i).dot(r)<0}set(e,n,i){return this.a.copy(e),this.b.copy(n),this.c.copy(i),this}setFromPointsAndIndices(e,n,i,r){return this.a.copy(e[n]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,n,i,r){return this.a.fromBufferAttribute(e,n),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Kn.subVectors(this.c,this.b),_i.subVectors(this.a,this.b),Kn.cross(_i).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Fn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,n){return Fn.getBarycoord(e,this.a,this.b,this.c,n)}getInterpolation(e,n,i,r,s){return Fn.getInterpolation(e,this.a,this.b,this.c,n,i,r,s)}containsPoint(e){return Fn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Fn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,n){const i=this.a,r=this.b,s=this.c;let a,o;is.subVectors(r,i),rs.subVectors(s,i),pu.subVectors(e,i);const l=is.dot(pu),c=rs.dot(pu);if(l<=0&&c<=0)return n.copy(i);mu.subVectors(e,r);const u=is.dot(mu),d=rs.dot(mu);if(u>=0&&d<=u)return n.copy(r);const f=l*d-u*c;if(f<=0&&l>=0&&u<=0)return a=l/(l-u),n.copy(i).addScaledVector(is,a);gu.subVectors(e,s);const p=is.dot(gu),_=rs.dot(gu);if(_>=0&&p<=_)return n.copy(s);const v=p*c-l*_;if(v<=0&&c>=0&&_<=0)return o=c/(c-_),n.copy(i).addScaledVector(rs,o);const m=u*_-p*d;if(m<=0&&d-u>=0&&p-_>=0)return fm.subVectors(s,r),o=(d-u)/(d-u+(p-_)),n.copy(r).addScaledVector(fm,o);const h=1/(m+v+f);return a=v*h,o=f*h,n.copy(i).addScaledVector(is,a).addScaledVector(rs,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const q0={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Hi={h:0,s:0,l:0},Go={h:0,s:0,l:0};function yu(t,e,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?t+(e-t)*6*n:n<1/2?e:n<2/3?t+(e-t)*6*(2/3-n):t}class Ce{constructor(e,n,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,n,i)}set(e,n,i){if(n===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,n,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,n=tn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,it.toWorkingColorSpace(this,n),this}setRGB(e,n,i,r=it.workingColorSpace){return this.r=e,this.g=n,this.b=i,it.toWorkingColorSpace(this,r),this}setHSL(e,n,i,r=it.workingColorSpace){if(e=Tf(e,1),n=cn(n,0,1),i=cn(i,0,1),n===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+n):i+n-i*n,a=2*i-s;this.r=yu(a,s,e+1/3),this.g=yu(a,s,e),this.b=yu(a,s,e-1/3)}return it.toWorkingColorSpace(this,r),this}setStyle(e,n=tn){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const a=r[1],o=r[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,n);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,n);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,n);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,n);if(a===6)return this.setHex(parseInt(s,16),n);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,n);return this}setColorName(e,n=tn){const i=q0[e.toLowerCase()];return i!==void 0?this.setHex(i,n):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Us(e.r),this.g=Us(e.g),this.b=Us(e.b),this}copyLinearToSRGB(e){return this.r=ru(e.r),this.g=ru(e.g),this.b=ru(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=tn){return it.fromWorkingColorSpace(Qt.copy(this),e),Math.round(cn(Qt.r*255,0,255))*65536+Math.round(cn(Qt.g*255,0,255))*256+Math.round(cn(Qt.b*255,0,255))}getHexString(e=tn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,n=it.workingColorSpace){it.fromWorkingColorSpace(Qt.copy(this),n);const i=Qt.r,r=Qt.g,s=Qt.b,a=Math.max(i,r,s),o=Math.min(i,r,s);let l,c;const u=(o+a)/2;if(o===a)l=0,c=0;else{const d=a-o;switch(c=u<=.5?d/(a+o):d/(2-a-o),a){case i:l=(r-s)/d+(r<s?6:0);break;case r:l=(s-i)/d+2;break;case s:l=(i-r)/d+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,n=it.workingColorSpace){return it.fromWorkingColorSpace(Qt.copy(this),n),e.r=Qt.r,e.g=Qt.g,e.b=Qt.b,e}getStyle(e=tn){it.fromWorkingColorSpace(Qt.copy(this),e);const n=Qt.r,i=Qt.g,r=Qt.b;return e!==tn?`color(${e} ${n.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(n*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,n,i){return this.getHSL(Hi),this.setHSL(Hi.h+e,Hi.s+n,Hi.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,n){return this.r=e.r+n.r,this.g=e.g+n.g,this.b=e.b+n.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,n){return this.r+=(e.r-this.r)*n,this.g+=(e.g-this.g)*n,this.b+=(e.b-this.b)*n,this}lerpColors(e,n,i){return this.r=e.r+(n.r-e.r)*i,this.g=e.g+(n.g-e.g)*i,this.b=e.b+(n.b-e.b)*i,this}lerpHSL(e,n){this.getHSL(Hi),e.getHSL(Go);const i=Ua(Hi.h,Go.h,n),r=Ua(Hi.s,Go.s,n),s=Ua(Hi.l,Go.l,n);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const n=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*n+s[3]*i+s[6]*r,this.g=s[1]*n+s[4]*i+s[7]*r,this.b=s[2]*n+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,n=0){return this.r=e[n],this.g=e[n+1],this.b=e[n+2],this}toArray(e=[],n=0){return e[n]=this.r,e[n+1]=this.g,e[n+2]=this.b,e}fromBufferAttribute(e,n){return this.r=e.getX(n),this.g=e.getY(n),this.b=e.getZ(n),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Qt=new Ce;Ce.NAMES=q0;let PM=0;class vr extends Qs{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:PM++}),this.uuid=Ci(),this.name="",this.type="Material",this.blending=Ds,this.side=fr,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Dd,this.blendDst=Id,this.blendEquation=Pr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ce(0,0,0),this.blendAlpha=0,this.depthFunc=Vs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Qp,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=qr,this.stencilZFail=qr,this.stencilZPass=qr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const n in e){const i=e[n];if(i===void 0){console.warn(`THREE.Material: parameter '${n}' has value of undefined.`);continue}const r=this[n];if(r===void 0){console.warn(`THREE.Material: '${n}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[n]=i}}toJSON(e){const n=e===void 0||typeof e=="string";n&&(e={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Ds&&(i.blending=this.blending),this.side!==fr&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Dd&&(i.blendSrc=this.blendSrc),this.blendDst!==Id&&(i.blendDst=this.blendDst),this.blendEquation!==Pr&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Vs&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Qp&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==qr&&(i.stencilFail=this.stencilFail),this.stencilZFail!==qr&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==qr&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const a=[];for(const o in s){const l=s[o];delete l.metadata,a.push(l)}return a}if(n){const s=r(e.textures),a=r(e.images);s.length>0&&(i.textures=s),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const n=e.clippingPlanes;let i=null;if(n!==null){const r=n.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=n[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class bt extends vr{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ce(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new fi,this.combine=L0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Nt=new N,Vo=new Oe;class Sn{constructor(e,n,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=n,this.count=e!==void 0?e.length/n:0,this.normalized=i,this.usage=vh,this.updateRanges=[],this.gpuType=Ti,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,n,i){e*=this.itemSize,i*=n.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=n.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let n=0,i=this.count;n<i;n++)Vo.fromBufferAttribute(this,n),Vo.applyMatrix3(e),this.setXY(n,Vo.x,Vo.y);else if(this.itemSize===3)for(let n=0,i=this.count;n<i;n++)Nt.fromBufferAttribute(this,n),Nt.applyMatrix3(e),this.setXYZ(n,Nt.x,Nt.y,Nt.z);return this}applyMatrix4(e){for(let n=0,i=this.count;n<i;n++)Nt.fromBufferAttribute(this,n),Nt.applyMatrix4(e),this.setXYZ(n,Nt.x,Nt.y,Nt.z);return this}applyNormalMatrix(e){for(let n=0,i=this.count;n<i;n++)Nt.fromBufferAttribute(this,n),Nt.applyNormalMatrix(e),this.setXYZ(n,Nt.x,Nt.y,Nt.z);return this}transformDirection(e){for(let n=0,i=this.count;n<i;n++)Nt.fromBufferAttribute(this,n),Nt.transformDirection(e),this.setXYZ(n,Nt.x,Nt.y,Nt.z);return this}set(e,n=0){return this.array.set(e,n),this}getComponent(e,n){let i=this.array[e*this.itemSize+n];return this.normalized&&(i=ti(i,this.array)),i}setComponent(e,n,i){return this.normalized&&(i=at(i,this.array)),this.array[e*this.itemSize+n]=i,this}getX(e){let n=this.array[e*this.itemSize];return this.normalized&&(n=ti(n,this.array)),n}setX(e,n){return this.normalized&&(n=at(n,this.array)),this.array[e*this.itemSize]=n,this}getY(e){let n=this.array[e*this.itemSize+1];return this.normalized&&(n=ti(n,this.array)),n}setY(e,n){return this.normalized&&(n=at(n,this.array)),this.array[e*this.itemSize+1]=n,this}getZ(e){let n=this.array[e*this.itemSize+2];return this.normalized&&(n=ti(n,this.array)),n}setZ(e,n){return this.normalized&&(n=at(n,this.array)),this.array[e*this.itemSize+2]=n,this}getW(e){let n=this.array[e*this.itemSize+3];return this.normalized&&(n=ti(n,this.array)),n}setW(e,n){return this.normalized&&(n=at(n,this.array)),this.array[e*this.itemSize+3]=n,this}setXY(e,n,i){return e*=this.itemSize,this.normalized&&(n=at(n,this.array),i=at(i,this.array)),this.array[e+0]=n,this.array[e+1]=i,this}setXYZ(e,n,i,r){return e*=this.itemSize,this.normalized&&(n=at(n,this.array),i=at(i,this.array),r=at(r,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,n,i,r,s){return e*=this.itemSize,this.normalized&&(n=at(n,this.array),i=at(i,this.array),r=at(r,this.array),s=at(s,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==vh&&(e.usage=this.usage),e}}class K0 extends Sn{constructor(e,n,i){super(new Uint16Array(e),n,i)}}class Z0 extends Sn{constructor(e,n,i){super(new Uint32Array(e),n,i)}}class ft extends Sn{constructor(e,n,i){super(new Float32Array(e),n,i)}}let NM=0;const In=new ut,Su=new Dt,ss=new N,Tn=new ho,fa=new ho,Bt=new N;class lt extends Qs{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:NM++}),this.uuid=Ci(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(X0(e)?Z0:K0)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,n){return this.attributes[e]=n,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,n,i=0){this.groups.push({start:e,count:n,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,n){this.drawRange.start=e,this.drawRange.count=n}applyMatrix4(e){const n=this.attributes.position;n!==void 0&&(n.applyMatrix4(e),n.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new Ge().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return In.makeRotationFromQuaternion(e),this.applyMatrix4(In),this}rotateX(e){return In.makeRotationX(e),this.applyMatrix4(In),this}rotateY(e){return In.makeRotationY(e),this.applyMatrix4(In),this}rotateZ(e){return In.makeRotationZ(e),this.applyMatrix4(In),this}translate(e,n,i){return In.makeTranslation(e,n,i),this.applyMatrix4(In),this}scale(e,n,i){return In.makeScale(e,n,i),this.applyMatrix4(In),this}lookAt(e){return Su.lookAt(e),Su.updateMatrix(),this.applyMatrix4(Su.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ss).negate(),this.translate(ss.x,ss.y,ss.z),this}setFromPoints(e){const n=[];for(let i=0,r=e.length;i<r;i++){const s=e[i];n.push(s.x,s.y,s.z||0)}return this.setAttribute("position",new ft(n,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ho);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new N(-1/0,-1/0,-1/0),new N(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),n)for(let i=0,r=n.length;i<r;i++){const s=n[i];Tn.setFromBufferAttribute(s),this.morphTargetsRelative?(Bt.addVectors(this.boundingBox.min,Tn.min),this.boundingBox.expandByPoint(Bt),Bt.addVectors(this.boundingBox.max,Tn.max),this.boundingBox.expandByPoint(Bt)):(this.boundingBox.expandByPoint(Tn.min),this.boundingBox.expandByPoint(Tn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new fo);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new N,1/0);return}if(e){const i=this.boundingSphere.center;if(Tn.setFromBufferAttribute(e),n)for(let s=0,a=n.length;s<a;s++){const o=n[s];fa.setFromBufferAttribute(o),this.morphTargetsRelative?(Bt.addVectors(Tn.min,fa.min),Tn.expandByPoint(Bt),Bt.addVectors(Tn.max,fa.max),Tn.expandByPoint(Bt)):(Tn.expandByPoint(fa.min),Tn.expandByPoint(fa.max))}Tn.getCenter(i);let r=0;for(let s=0,a=e.count;s<a;s++)Bt.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(Bt));if(n)for(let s=0,a=n.length;s<a;s++){const o=n[s],l=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)Bt.fromBufferAttribute(o,c),l&&(ss.fromBufferAttribute(e,c),Bt.add(ss)),r=Math.max(r,i.distanceToSquared(Bt))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,n=this.attributes;if(e===null||n.position===void 0||n.normal===void 0||n.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=n.position,r=n.normal,s=n.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Sn(new Float32Array(4*i.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let b=0;b<i.count;b++)o[b]=new N,l[b]=new N;const c=new N,u=new N,d=new N,f=new Oe,p=new Oe,_=new Oe,v=new N,m=new N;function h(b,z,y){c.fromBufferAttribute(i,b),u.fromBufferAttribute(i,z),d.fromBufferAttribute(i,y),f.fromBufferAttribute(s,b),p.fromBufferAttribute(s,z),_.fromBufferAttribute(s,y),u.sub(c),d.sub(c),p.sub(f),_.sub(f);const E=1/(p.x*_.y-_.x*p.y);isFinite(E)&&(v.copy(u).multiplyScalar(_.y).addScaledVector(d,-p.y).multiplyScalar(E),m.copy(d).multiplyScalar(p.x).addScaledVector(u,-_.x).multiplyScalar(E),o[b].add(v),o[z].add(v),o[y].add(v),l[b].add(m),l[z].add(m),l[y].add(m))}let x=this.groups;x.length===0&&(x=[{start:0,count:e.count}]);for(let b=0,z=x.length;b<z;++b){const y=x[b],E=y.start,U=y.count;for(let F=E,X=E+U;F<X;F+=3)h(e.getX(F+0),e.getX(F+1),e.getX(F+2))}const S=new N,M=new N,P=new N,C=new N;function A(b){P.fromBufferAttribute(r,b),C.copy(P);const z=o[b];S.copy(z),S.sub(P.multiplyScalar(P.dot(z))).normalize(),M.crossVectors(C,z);const E=M.dot(l[b])<0?-1:1;a.setXYZW(b,S.x,S.y,S.z,E)}for(let b=0,z=x.length;b<z;++b){const y=x[b],E=y.start,U=y.count;for(let F=E,X=E+U;F<X;F+=3)A(e.getX(F+0)),A(e.getX(F+1)),A(e.getX(F+2))}}computeVertexNormals(){const e=this.index,n=this.getAttribute("position");if(n!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Sn(new Float32Array(n.count*3),3),this.setAttribute("normal",i);else for(let f=0,p=i.count;f<p;f++)i.setXYZ(f,0,0,0);const r=new N,s=new N,a=new N,o=new N,l=new N,c=new N,u=new N,d=new N;if(e)for(let f=0,p=e.count;f<p;f+=3){const _=e.getX(f+0),v=e.getX(f+1),m=e.getX(f+2);r.fromBufferAttribute(n,_),s.fromBufferAttribute(n,v),a.fromBufferAttribute(n,m),u.subVectors(a,s),d.subVectors(r,s),u.cross(d),o.fromBufferAttribute(i,_),l.fromBufferAttribute(i,v),c.fromBufferAttribute(i,m),o.add(u),l.add(u),c.add(u),i.setXYZ(_,o.x,o.y,o.z),i.setXYZ(v,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let f=0,p=n.count;f<p;f+=3)r.fromBufferAttribute(n,f+0),s.fromBufferAttribute(n,f+1),a.fromBufferAttribute(n,f+2),u.subVectors(a,s),d.subVectors(r,s),u.cross(d),i.setXYZ(f+0,u.x,u.y,u.z),i.setXYZ(f+1,u.x,u.y,u.z),i.setXYZ(f+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let n=0,i=e.count;n<i;n++)Bt.fromBufferAttribute(e,n),Bt.normalize(),e.setXYZ(n,Bt.x,Bt.y,Bt.z)}toNonIndexed(){function e(o,l){const c=o.array,u=o.itemSize,d=o.normalized,f=new c.constructor(l.length*u);let p=0,_=0;for(let v=0,m=l.length;v<m;v++){o.isInterleavedBufferAttribute?p=l[v]*o.data.stride+o.offset:p=l[v]*u;for(let h=0;h<u;h++)f[_++]=c[p++]}return new Sn(f,u,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const n=new lt,i=this.index.array,r=this.attributes;for(const o in r){const l=r[o],c=e(l,i);n.setAttribute(o,c)}const s=this.morphAttributes;for(const o in s){const l=[],c=s[o];for(let u=0,d=c.length;u<d;u++){const f=c[u],p=e(f,i);l.push(p)}n.morphAttributes[o]=l}n.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];n.addGroup(c.start,c.count,c.materialIndex)}return n}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const n=this.index;n!==null&&(e.data.index={type:n.array.constructor.name,array:Array.prototype.slice.call(n.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const r={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let d=0,f=c.length;d<f;d++){const p=c[d];u.push(p.toJSON(e.data))}u.length>0&&(r[l]=u,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const n={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone(n));const r=e.attributes;for(const c in r){const u=r[c];this.setAttribute(c,u.clone(n))}const s=e.morphAttributes;for(const c in s){const u=[],d=s[c];for(let f=0,p=d.length;f<p;f++)u.push(d[f].clone(n));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,u=a.length;c<u;c++){const d=a[c];this.addGroup(d.start,d.count,d.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const pm=new ut,Mr=new wc,jo=new fo,mm=new N,Wo=new N,Xo=new N,$o=new N,Mu=new N,Yo=new N,gm=new N,qo=new N;class Ne extends Dt{constructor(e=new lt,n=new bt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=n,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(e,n){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,a=i.morphTargetsRelative;n.fromBufferAttribute(r,e);const o=this.morphTargetInfluences;if(s&&o){Yo.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const u=o[l],d=s[l];u!==0&&(Mu.fromBufferAttribute(d,e),a?Yo.addScaledVector(Mu,u):Yo.addScaledVector(Mu.sub(n),u))}n.add(Yo)}return n}raycast(e,n){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),jo.copy(i.boundingSphere),jo.applyMatrix4(s),Mr.copy(e.ray).recast(e.near),!(jo.containsPoint(Mr.origin)===!1&&(Mr.intersectSphere(jo,mm)===null||Mr.origin.distanceToSquared(mm)>(e.far-e.near)**2))&&(pm.copy(s).invert(),Mr.copy(e.ray).applyMatrix4(pm),!(i.boundingBox!==null&&Mr.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,n,Mr)))}_computeIntersections(e,n,i){let r;const s=this.geometry,a=this.material,o=s.index,l=s.attributes.position,c=s.attributes.uv,u=s.attributes.uv1,d=s.attributes.normal,f=s.groups,p=s.drawRange;if(o!==null)if(Array.isArray(a))for(let _=0,v=f.length;_<v;_++){const m=f[_],h=a[m.materialIndex],x=Math.max(m.start,p.start),S=Math.min(o.count,Math.min(m.start+m.count,p.start+p.count));for(let M=x,P=S;M<P;M+=3){const C=o.getX(M),A=o.getX(M+1),b=o.getX(M+2);r=Ko(this,h,e,i,c,u,d,C,A,b),r&&(r.faceIndex=Math.floor(M/3),r.face.materialIndex=m.materialIndex,n.push(r))}}else{const _=Math.max(0,p.start),v=Math.min(o.count,p.start+p.count);for(let m=_,h=v;m<h;m+=3){const x=o.getX(m),S=o.getX(m+1),M=o.getX(m+2);r=Ko(this,a,e,i,c,u,d,x,S,M),r&&(r.faceIndex=Math.floor(m/3),n.push(r))}}else if(l!==void 0)if(Array.isArray(a))for(let _=0,v=f.length;_<v;_++){const m=f[_],h=a[m.materialIndex],x=Math.max(m.start,p.start),S=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let M=x,P=S;M<P;M+=3){const C=M,A=M+1,b=M+2;r=Ko(this,h,e,i,c,u,d,C,A,b),r&&(r.faceIndex=Math.floor(M/3),r.face.materialIndex=m.materialIndex,n.push(r))}}else{const _=Math.max(0,p.start),v=Math.min(l.count,p.start+p.count);for(let m=_,h=v;m<h;m+=3){const x=m,S=m+1,M=m+2;r=Ko(this,a,e,i,c,u,d,x,S,M),r&&(r.faceIndex=Math.floor(m/3),n.push(r))}}}}function LM(t,e,n,i,r,s,a,o){let l;if(e.side===Yt?l=i.intersectTriangle(a,s,r,!0,o):l=i.intersectTriangle(r,s,a,e.side===fr,o),l===null)return null;qo.copy(o),qo.applyMatrix4(t.matrixWorld);const c=n.ray.origin.distanceTo(qo);return c<n.near||c>n.far?null:{distance:c,point:qo.clone(),object:t}}function Ko(t,e,n,i,r,s,a,o,l,c){t.getVertexPosition(o,Wo),t.getVertexPosition(l,Xo),t.getVertexPosition(c,$o);const u=LM(t,e,n,i,Wo,Xo,$o,gm);if(u){const d=new N;Fn.getBarycoord(gm,Wo,Xo,$o,d),r&&(u.uv=Fn.getInterpolatedAttribute(r,o,l,c,d,new Oe)),s&&(u.uv1=Fn.getInterpolatedAttribute(s,o,l,c,d,new Oe)),a&&(u.normal=Fn.getInterpolatedAttribute(a,o,l,c,d,new N),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));const f={a:o,b:l,c,normal:new N,materialIndex:0};Fn.getNormal(Wo,Xo,$o,f.normal),u.face=f,u.barycoord=d}return u}class si extends lt{constructor(e=1,n=1,i=1,r=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:n,depth:i,widthSegments:r,heightSegments:s,depthSegments:a};const o=this;r=Math.floor(r),s=Math.floor(s),a=Math.floor(a);const l=[],c=[],u=[],d=[];let f=0,p=0;_("z","y","x",-1,-1,i,n,e,a,s,0),_("z","y","x",1,-1,i,n,-e,a,s,1),_("x","z","y",1,1,e,i,n,r,a,2),_("x","z","y",1,-1,e,i,-n,r,a,3),_("x","y","z",1,-1,e,n,i,r,s,4),_("x","y","z",-1,-1,e,n,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new ft(c,3)),this.setAttribute("normal",new ft(u,3)),this.setAttribute("uv",new ft(d,2));function _(v,m,h,x,S,M,P,C,A,b,z){const y=M/A,E=P/b,U=M/2,F=P/2,X=C/2,K=A+1,V=b+1;let ie=0,D=0;const ee=new N;for(let ne=0;ne<V;ne++){const ce=ne*E-F;for(let Te=0;Te<K;Te++){const ze=Te*y-U;ee[v]=ze*x,ee[m]=ce*S,ee[h]=X,c.push(ee.x,ee.y,ee.z),ee[v]=0,ee[m]=0,ee[h]=C>0?1:-1,u.push(ee.x,ee.y,ee.z),d.push(Te/A),d.push(1-ne/b),ie+=1}}for(let ne=0;ne<b;ne++)for(let ce=0;ce<A;ce++){const Te=f+ce+K*ne,ze=f+ce+K*(ne+1),W=f+(ce+1)+K*(ne+1),se=f+(ce+1)+K*ne;l.push(Te,ze,se),l.push(ze,W,se),D+=6}o.addGroup(p,D,z),p+=D,f+=ie}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new si(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Ys(t){const e={};for(const n in t){e[n]={};for(const i in t[n]){const r=t[n][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[n][i]=null):e[n][i]=r.clone():Array.isArray(r)?e[n][i]=r.slice():e[n][i]=r}}return e}function on(t){const e={};for(let n=0;n<t.length;n++){const i=Ys(t[n]);for(const r in i)e[r]=i[r]}return e}function DM(t){const e=[];for(let n=0;n<t.length;n++)e.push(t[n].clone());return e}function J0(t){const e=t.getRenderTarget();return e===null?t.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:it.workingColorSpace}const IM={clone:Ys,merge:on};var UM=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,kM=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class jn extends vr{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=UM,this.fragmentShader=kM,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Ys(e.uniforms),this.uniformsGroups=DM(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const n=super.toJSON(e);n.glslVersion=this.glslVersion,n.uniforms={};for(const r in this.uniforms){const a=this.uniforms[r].value;a&&a.isTexture?n.uniforms[r]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?n.uniforms[r]={type:"c",value:a.getHex()}:a&&a.isVector2?n.uniforms[r]={type:"v2",value:a.toArray()}:a&&a.isVector3?n.uniforms[r]={type:"v3",value:a.toArray()}:a&&a.isVector4?n.uniforms[r]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?n.uniforms[r]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?n.uniforms[r]={type:"m4",value:a.toArray()}:n.uniforms[r]={value:a}}Object.keys(this.defines).length>0&&(n.defines=this.defines),n.vertexShader=this.vertexShader,n.fragmentShader=this.fragmentShader,n.lights=this.lights,n.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(n.extensions=i),n}}class Q0 extends Dt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ut,this.projectionMatrix=new ut,this.projectionMatrixInverse=new ut,this.coordinateSystem=Ai}copy(e,n){return super.copy(e,n),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,n){super.updateWorldMatrix(e,n),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Gi=new N,_m=new Oe,vm=new Oe;class gn extends Q0{constructor(e=50,n=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=n,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const n=.5*this.getFilmHeight()/e;this.fov=no*2*Math.atan(n),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Ia*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return no*2*Math.atan(Math.tan(Ia*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,n,i){Gi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Gi.x,Gi.y).multiplyScalar(-e/Gi.z),Gi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Gi.x,Gi.y).multiplyScalar(-e/Gi.z)}getViewSize(e,n){return this.getViewBounds(e,_m,vm),n.subVectors(vm,_m)}setViewOffset(e,n,i,r,s,a){this.aspect=e/n,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let n=e*Math.tan(Ia*.5*this.fov)/this.zoom,i=2*n,r=this.aspect*i,s=-.5*r;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;s+=a.offsetX*r/l,n-=a.offsetY*i/c,r*=a.width/l,i*=a.height/c}const o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,n,n-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.fov=this.fov,n.object.zoom=this.zoom,n.object.near=this.near,n.object.far=this.far,n.object.focus=this.focus,n.object.aspect=this.aspect,this.view!==null&&(n.object.view=Object.assign({},this.view)),n.object.filmGauge=this.filmGauge,n.object.filmOffset=this.filmOffset,n}}const as=-90,os=1;class FM extends Dt{constructor(e,n,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new gn(as,os,e,n);r.layers=this.layers,this.add(r);const s=new gn(as,os,e,n);s.layers=this.layers,this.add(s);const a=new gn(as,os,e,n);a.layers=this.layers,this.add(a);const o=new gn(as,os,e,n);o.layers=this.layers,this.add(o);const l=new gn(as,os,e,n);l.layers=this.layers,this.add(l);const c=new gn(as,os,e,n);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,n=this.children.concat(),[i,r,s,a,o,l]=n;for(const c of n)this.remove(c);if(e===Ai)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===nc)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of n)this.add(c),c.updateMatrixWorld()}update(e,n){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,l,c,u]=this.children,d=e.getRenderTarget(),f=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),_=e.xr.enabled;e.xr.enabled=!1;const v=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,r),e.render(n,s),e.setRenderTarget(i,1,r),e.render(n,a),e.setRenderTarget(i,2,r),e.render(n,o),e.setRenderTarget(i,3,r),e.render(n,l),e.setRenderTarget(i,4,r),e.render(n,c),i.texture.generateMipmaps=v,e.setRenderTarget(i,5,r),e.render(n,u),e.setRenderTarget(d,f,p),e.xr.enabled=_,i.texture.needsPMREMUpdate=!0}}class ev extends rn{constructor(e,n,i,r,s,a,o,l,c,u){e=e!==void 0?e:[],n=n!==void 0?n:js,super(e,n,i,r,s,a,o,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class OM extends Vr{constructor(e=1,n={}){super(e,e,n),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new ev(r,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=n.generateMipmaps!==void 0?n.generateMipmaps:!1,this.texture.minFilter=n.minFilter!==void 0?n.minFilter:ei}fromEquirectangularTexture(e,n){this.texture.type=n.type,this.texture.colorSpace=n.colorSpace,this.texture.generateMipmaps=n.generateMipmaps,this.texture.minFilter=n.minFilter,this.texture.magFilter=n.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new si(5,5,5),s=new jn({name:"CubemapFromEquirect",uniforms:Ys(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Yt,blending:cr});s.uniforms.tEquirect.value=n;const a=new Ne(r,s),o=n.minFilter;return n.minFilter===Ji&&(n.minFilter=ei),new FM(1,10,this).update(e,a),n.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,n,i,r){const s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(n,i,r);e.setRenderTarget(s)}}const Eu=new N,zM=new N,BM=new Ge;class Cr{constructor(e=new N(1,0,0),n=0){this.isPlane=!0,this.normal=e,this.constant=n}set(e,n){return this.normal.copy(e),this.constant=n,this}setComponents(e,n,i,r){return this.normal.set(e,n,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,n){return this.normal.copy(e),this.constant=-n.dot(this.normal),this}setFromCoplanarPoints(e,n,i){const r=Eu.subVectors(i,n).cross(zM.subVectors(e,n)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,n){return n.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,n){const i=e.delta(Eu),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?n.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:n.copy(e.start).addScaledVector(i,s)}intersectsLine(e){const n=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return n<0&&i>0||i<0&&n>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,n){const i=n||BM.getNormalMatrix(e),r=this.coplanarPoint(Eu).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Er=new fo,Zo=new N;class bf{constructor(e=new Cr,n=new Cr,i=new Cr,r=new Cr,s=new Cr,a=new Cr){this.planes=[e,n,i,r,s,a]}set(e,n,i,r,s,a){const o=this.planes;return o[0].copy(e),o[1].copy(n),o[2].copy(i),o[3].copy(r),o[4].copy(s),o[5].copy(a),this}copy(e){const n=this.planes;for(let i=0;i<6;i++)n[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,n=Ai){const i=this.planes,r=e.elements,s=r[0],a=r[1],o=r[2],l=r[3],c=r[4],u=r[5],d=r[6],f=r[7],p=r[8],_=r[9],v=r[10],m=r[11],h=r[12],x=r[13],S=r[14],M=r[15];if(i[0].setComponents(l-s,f-c,m-p,M-h).normalize(),i[1].setComponents(l+s,f+c,m+p,M+h).normalize(),i[2].setComponents(l+a,f+u,m+_,M+x).normalize(),i[3].setComponents(l-a,f-u,m-_,M-x).normalize(),i[4].setComponents(l-o,f-d,m-v,M-S).normalize(),n===Ai)i[5].setComponents(l+o,f+d,m+v,M+S).normalize();else if(n===nc)i[5].setComponents(o,d,v,S).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+n);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Er.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const n=e.geometry;n.boundingSphere===null&&n.computeBoundingSphere(),Er.copy(n.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Er)}intersectsSprite(e){return Er.center.set(0,0,0),Er.radius=.7071067811865476,Er.applyMatrix4(e.matrixWorld),this.intersectsSphere(Er)}intersectsSphere(e){const n=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(n[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const n=this.planes;for(let i=0;i<6;i++){const r=n[i];if(Zo.x=r.normal.x>0?e.max.x:e.min.x,Zo.y=r.normal.y>0?e.max.y:e.min.y,Zo.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Zo)<0)return!1}return!0}containsPoint(e){const n=this.planes;for(let i=0;i<6;i++)if(n[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function tv(){let t=null,e=!1,n=null,i=null;function r(s,a){n(s,a),i=t.requestAnimationFrame(r)}return{start:function(){e!==!0&&n!==null&&(i=t.requestAnimationFrame(r),e=!0)},stop:function(){t.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){n=s},setContext:function(s){t=s}}}function HM(t){const e=new WeakMap;function n(o,l){const c=o.array,u=o.usage,d=c.byteLength,f=t.createBuffer();t.bindBuffer(l,f),t.bufferData(l,c,u),o.onUploadCallback();let p;if(c instanceof Float32Array)p=t.FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?p=t.HALF_FLOAT:p=t.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=t.SHORT;else if(c instanceof Uint32Array)p=t.UNSIGNED_INT;else if(c instanceof Int32Array)p=t.INT;else if(c instanceof Int8Array)p=t.BYTE;else if(c instanceof Uint8Array)p=t.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=t.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:d}}function i(o,l,c){const u=l.array,d=l.updateRanges;if(t.bindBuffer(c,o),d.length===0)t.bufferSubData(c,0,u);else{d.sort((p,_)=>p.start-_.start);let f=0;for(let p=1;p<d.length;p++){const _=d[f],v=d[p];v.start<=_.start+_.count+1?_.count=Math.max(_.count,v.start+v.count-_.start):(++f,d[f]=v)}d.length=f+1;for(let p=0,_=d.length;p<_;p++){const v=d[p];t.bufferSubData(c,v.start*u.BYTES_PER_ELEMENT,u,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(t.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const u=e.get(o);(!u||u.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,n(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:r,remove:s,update:a}}class Xr extends lt{constructor(e=1,n=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:n,widthSegments:i,heightSegments:r};const s=e/2,a=n/2,o=Math.floor(i),l=Math.floor(r),c=o+1,u=l+1,d=e/o,f=n/l,p=[],_=[],v=[],m=[];for(let h=0;h<u;h++){const x=h*f-a;for(let S=0;S<c;S++){const M=S*d-s;_.push(M,-x,0),v.push(0,0,1),m.push(S/o),m.push(1-h/l)}}for(let h=0;h<l;h++)for(let x=0;x<o;x++){const S=x+c*h,M=x+c*(h+1),P=x+1+c*(h+1),C=x+1+c*h;p.push(S,M,C),p.push(M,P,C)}this.setIndex(p),this.setAttribute("position",new ft(_,3)),this.setAttribute("normal",new ft(v,3)),this.setAttribute("uv",new ft(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Xr(e.width,e.height,e.widthSegments,e.heightSegments)}}var GM=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,VM=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,jM=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,WM=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,XM=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,$M=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,YM=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,qM=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,KM=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,ZM=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,JM=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,QM=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,eE=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,tE=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,nE=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,iE=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,rE=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,sE=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,aE=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,oE=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,lE=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,cE=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,uE=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,dE=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,hE=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,fE=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,pE=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,mE=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,gE=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,_E=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,vE="gl_FragColor = linearToOutputTexel( gl_FragColor );",xE=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,yE=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,SE=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,ME=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,EE=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,wE=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,TE=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,AE=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,bE=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,CE=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,RE=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,PE=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,NE=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,LE=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,DE=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,IE=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,UE=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,kE=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,FE=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,OE=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,zE=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,BE=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,HE=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,GE=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,VE=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,jE=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,WE=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,XE=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,$E=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,YE=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,qE=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,KE=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,ZE=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,JE=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,QE=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,ew=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,tw=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,nw=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,iw=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,rw=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,sw=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,aw=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,ow=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,lw=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,cw=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,uw=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,dw=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,hw=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,fw=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,pw=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,mw=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,gw=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,_w=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,vw=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,xw=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,yw=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Sw=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Mw=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Ew=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,ww=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Tw=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Aw=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,bw=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Cw=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Rw=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Pw=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Nw=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Lw=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Dw=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Iw=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Uw=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,kw=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Fw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Ow=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,zw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Bw=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Hw=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Gw=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Vw=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,jw=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ww=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Xw=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,$w=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Yw=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,qw=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Kw=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Zw=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Jw=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Qw=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,e1=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,t1=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,n1=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,i1=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,r1=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,s1=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,a1=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,o1=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,l1=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,c1=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,u1=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,d1=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,h1=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,f1=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,p1=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,m1=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,g1=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,_1=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,v1=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,x1=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,y1=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,He={alphahash_fragment:GM,alphahash_pars_fragment:VM,alphamap_fragment:jM,alphamap_pars_fragment:WM,alphatest_fragment:XM,alphatest_pars_fragment:$M,aomap_fragment:YM,aomap_pars_fragment:qM,batching_pars_vertex:KM,batching_vertex:ZM,begin_vertex:JM,beginnormal_vertex:QM,bsdfs:eE,iridescence_fragment:tE,bumpmap_pars_fragment:nE,clipping_planes_fragment:iE,clipping_planes_pars_fragment:rE,clipping_planes_pars_vertex:sE,clipping_planes_vertex:aE,color_fragment:oE,color_pars_fragment:lE,color_pars_vertex:cE,color_vertex:uE,common:dE,cube_uv_reflection_fragment:hE,defaultnormal_vertex:fE,displacementmap_pars_vertex:pE,displacementmap_vertex:mE,emissivemap_fragment:gE,emissivemap_pars_fragment:_E,colorspace_fragment:vE,colorspace_pars_fragment:xE,envmap_fragment:yE,envmap_common_pars_fragment:SE,envmap_pars_fragment:ME,envmap_pars_vertex:EE,envmap_physical_pars_fragment:IE,envmap_vertex:wE,fog_vertex:TE,fog_pars_vertex:AE,fog_fragment:bE,fog_pars_fragment:CE,gradientmap_pars_fragment:RE,lightmap_pars_fragment:PE,lights_lambert_fragment:NE,lights_lambert_pars_fragment:LE,lights_pars_begin:DE,lights_toon_fragment:UE,lights_toon_pars_fragment:kE,lights_phong_fragment:FE,lights_phong_pars_fragment:OE,lights_physical_fragment:zE,lights_physical_pars_fragment:BE,lights_fragment_begin:HE,lights_fragment_maps:GE,lights_fragment_end:VE,logdepthbuf_fragment:jE,logdepthbuf_pars_fragment:WE,logdepthbuf_pars_vertex:XE,logdepthbuf_vertex:$E,map_fragment:YE,map_pars_fragment:qE,map_particle_fragment:KE,map_particle_pars_fragment:ZE,metalnessmap_fragment:JE,metalnessmap_pars_fragment:QE,morphinstance_vertex:ew,morphcolor_vertex:tw,morphnormal_vertex:nw,morphtarget_pars_vertex:iw,morphtarget_vertex:rw,normal_fragment_begin:sw,normal_fragment_maps:aw,normal_pars_fragment:ow,normal_pars_vertex:lw,normal_vertex:cw,normalmap_pars_fragment:uw,clearcoat_normal_fragment_begin:dw,clearcoat_normal_fragment_maps:hw,clearcoat_pars_fragment:fw,iridescence_pars_fragment:pw,opaque_fragment:mw,packing:gw,premultiplied_alpha_fragment:_w,project_vertex:vw,dithering_fragment:xw,dithering_pars_fragment:yw,roughnessmap_fragment:Sw,roughnessmap_pars_fragment:Mw,shadowmap_pars_fragment:Ew,shadowmap_pars_vertex:ww,shadowmap_vertex:Tw,shadowmask_pars_fragment:Aw,skinbase_vertex:bw,skinning_pars_vertex:Cw,skinning_vertex:Rw,skinnormal_vertex:Pw,specularmap_fragment:Nw,specularmap_pars_fragment:Lw,tonemapping_fragment:Dw,tonemapping_pars_fragment:Iw,transmission_fragment:Uw,transmission_pars_fragment:kw,uv_pars_fragment:Fw,uv_pars_vertex:Ow,uv_vertex:zw,worldpos_vertex:Bw,background_vert:Hw,background_frag:Gw,backgroundCube_vert:Vw,backgroundCube_frag:jw,cube_vert:Ww,cube_frag:Xw,depth_vert:$w,depth_frag:Yw,distanceRGBA_vert:qw,distanceRGBA_frag:Kw,equirect_vert:Zw,equirect_frag:Jw,linedashed_vert:Qw,linedashed_frag:e1,meshbasic_vert:t1,meshbasic_frag:n1,meshlambert_vert:i1,meshlambert_frag:r1,meshmatcap_vert:s1,meshmatcap_frag:a1,meshnormal_vert:o1,meshnormal_frag:l1,meshphong_vert:c1,meshphong_frag:u1,meshphysical_vert:d1,meshphysical_frag:h1,meshtoon_vert:f1,meshtoon_frag:p1,points_vert:m1,points_frag:g1,shadow_vert:_1,shadow_frag:v1,sprite_vert:x1,sprite_frag:y1},he={common:{diffuse:{value:new Ce(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ge},alphaMap:{value:null},alphaMapTransform:{value:new Ge},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ge}},envmap:{envMap:{value:null},envMapRotation:{value:new Ge},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ge}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ge}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ge},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ge},normalScale:{value:new Oe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ge},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ge}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ge}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ge}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ce(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ce(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ge},alphaTest:{value:0},uvTransform:{value:new Ge}},sprite:{diffuse:{value:new Ce(16777215)},opacity:{value:1},center:{value:new Oe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ge},alphaMap:{value:null},alphaMapTransform:{value:new Ge},alphaTest:{value:0}}},ci={basic:{uniforms:on([he.common,he.specularmap,he.envmap,he.aomap,he.lightmap,he.fog]),vertexShader:He.meshbasic_vert,fragmentShader:He.meshbasic_frag},lambert:{uniforms:on([he.common,he.specularmap,he.envmap,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.fog,he.lights,{emissive:{value:new Ce(0)}}]),vertexShader:He.meshlambert_vert,fragmentShader:He.meshlambert_frag},phong:{uniforms:on([he.common,he.specularmap,he.envmap,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.fog,he.lights,{emissive:{value:new Ce(0)},specular:{value:new Ce(1118481)},shininess:{value:30}}]),vertexShader:He.meshphong_vert,fragmentShader:He.meshphong_frag},standard:{uniforms:on([he.common,he.envmap,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.roughnessmap,he.metalnessmap,he.fog,he.lights,{emissive:{value:new Ce(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:He.meshphysical_vert,fragmentShader:He.meshphysical_frag},toon:{uniforms:on([he.common,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.gradientmap,he.fog,he.lights,{emissive:{value:new Ce(0)}}]),vertexShader:He.meshtoon_vert,fragmentShader:He.meshtoon_frag},matcap:{uniforms:on([he.common,he.bumpmap,he.normalmap,he.displacementmap,he.fog,{matcap:{value:null}}]),vertexShader:He.meshmatcap_vert,fragmentShader:He.meshmatcap_frag},points:{uniforms:on([he.points,he.fog]),vertexShader:He.points_vert,fragmentShader:He.points_frag},dashed:{uniforms:on([he.common,he.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:He.linedashed_vert,fragmentShader:He.linedashed_frag},depth:{uniforms:on([he.common,he.displacementmap]),vertexShader:He.depth_vert,fragmentShader:He.depth_frag},normal:{uniforms:on([he.common,he.bumpmap,he.normalmap,he.displacementmap,{opacity:{value:1}}]),vertexShader:He.meshnormal_vert,fragmentShader:He.meshnormal_frag},sprite:{uniforms:on([he.sprite,he.fog]),vertexShader:He.sprite_vert,fragmentShader:He.sprite_frag},background:{uniforms:{uvTransform:{value:new Ge},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:He.background_vert,fragmentShader:He.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ge}},vertexShader:He.backgroundCube_vert,fragmentShader:He.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:He.cube_vert,fragmentShader:He.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:He.equirect_vert,fragmentShader:He.equirect_frag},distanceRGBA:{uniforms:on([he.common,he.displacementmap,{referencePosition:{value:new N},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:He.distanceRGBA_vert,fragmentShader:He.distanceRGBA_frag},shadow:{uniforms:on([he.lights,he.fog,{color:{value:new Ce(0)},opacity:{value:1}}]),vertexShader:He.shadow_vert,fragmentShader:He.shadow_frag}};ci.physical={uniforms:on([ci.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ge},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ge},clearcoatNormalScale:{value:new Oe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ge},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ge},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ge},sheen:{value:0},sheenColor:{value:new Ce(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ge},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ge},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ge},transmissionSamplerSize:{value:new Oe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ge},attenuationDistance:{value:0},attenuationColor:{value:new Ce(0)},specularColor:{value:new Ce(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ge},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ge},anisotropyVector:{value:new Oe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ge}}]),vertexShader:He.meshphysical_vert,fragmentShader:He.meshphysical_frag};const Jo={r:0,b:0,g:0},wr=new fi,S1=new ut;function M1(t,e,n,i,r,s,a){const o=new Ce(0);let l=s===!0?0:1,c,u,d=null,f=0,p=null;function _(x){let S=x.isScene===!0?x.background:null;return S&&S.isTexture&&(S=(x.backgroundBlurriness>0?n:e).get(S)),S}function v(x){let S=!1;const M=_(x);M===null?h(o,l):M&&M.isColor&&(h(M,1),S=!0);const P=t.xr.getEnvironmentBlendMode();P==="additive"?i.buffers.color.setClear(0,0,0,1,a):P==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(t.autoClear||S)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil))}function m(x,S){const M=_(S);M&&(M.isCubeTexture||M.mapping===Mc)?(u===void 0&&(u=new Ne(new si(1,1,1),new jn({name:"BackgroundCubeMaterial",uniforms:Ys(ci.backgroundCube.uniforms),vertexShader:ci.backgroundCube.vertexShader,fragmentShader:ci.backgroundCube.fragmentShader,side:Yt,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(P,C,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(u)),wr.copy(S.backgroundRotation),wr.x*=-1,wr.y*=-1,wr.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(wr.y*=-1,wr.z*=-1),u.material.uniforms.envMap.value=M,u.material.uniforms.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=S.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(S1.makeRotationFromEuler(wr)),u.material.toneMapped=it.getTransfer(M.colorSpace)!==_t,(d!==M||f!==M.version||p!==t.toneMapping)&&(u.material.needsUpdate=!0,d=M,f=M.version,p=t.toneMapping),u.layers.enableAll(),x.unshift(u,u.geometry,u.material,0,0,null)):M&&M.isTexture&&(c===void 0&&(c=new Ne(new Xr(2,2),new jn({name:"BackgroundMaterial",uniforms:Ys(ci.background.uniforms),vertexShader:ci.background.vertexShader,fragmentShader:ci.background.fragmentShader,side:fr,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=M,c.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,c.material.toneMapped=it.getTransfer(M.colorSpace)!==_t,M.matrixAutoUpdate===!0&&M.updateMatrix(),c.material.uniforms.uvTransform.value.copy(M.matrix),(d!==M||f!==M.version||p!==t.toneMapping)&&(c.material.needsUpdate=!0,d=M,f=M.version,p=t.toneMapping),c.layers.enableAll(),x.unshift(c,c.geometry,c.material,0,0,null))}function h(x,S){x.getRGB(Jo,J0(t)),i.buffers.color.setClear(Jo.r,Jo.g,Jo.b,S,a)}return{getClearColor:function(){return o},setClearColor:function(x,S=1){o.set(x),l=S,h(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(x){l=x,h(o,l)},render:v,addToRenderList:m}}function E1(t,e){const n=t.getParameter(t.MAX_VERTEX_ATTRIBS),i={},r=f(null);let s=r,a=!1;function o(y,E,U,F,X){let K=!1;const V=d(F,U,E);s!==V&&(s=V,c(s.object)),K=p(y,F,U,X),K&&_(y,F,U,X),X!==null&&e.update(X,t.ELEMENT_ARRAY_BUFFER),(K||a)&&(a=!1,M(y,E,U,F),X!==null&&t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,e.get(X).buffer))}function l(){return t.createVertexArray()}function c(y){return t.bindVertexArray(y)}function u(y){return t.deleteVertexArray(y)}function d(y,E,U){const F=U.wireframe===!0;let X=i[y.id];X===void 0&&(X={},i[y.id]=X);let K=X[E.id];K===void 0&&(K={},X[E.id]=K);let V=K[F];return V===void 0&&(V=f(l()),K[F]=V),V}function f(y){const E=[],U=[],F=[];for(let X=0;X<n;X++)E[X]=0,U[X]=0,F[X]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:E,enabledAttributes:U,attributeDivisors:F,object:y,attributes:{},index:null}}function p(y,E,U,F){const X=s.attributes,K=E.attributes;let V=0;const ie=U.getAttributes();for(const D in ie)if(ie[D].location>=0){const ne=X[D];let ce=K[D];if(ce===void 0&&(D==="instanceMatrix"&&y.instanceMatrix&&(ce=y.instanceMatrix),D==="instanceColor"&&y.instanceColor&&(ce=y.instanceColor)),ne===void 0||ne.attribute!==ce||ce&&ne.data!==ce.data)return!0;V++}return s.attributesNum!==V||s.index!==F}function _(y,E,U,F){const X={},K=E.attributes;let V=0;const ie=U.getAttributes();for(const D in ie)if(ie[D].location>=0){let ne=K[D];ne===void 0&&(D==="instanceMatrix"&&y.instanceMatrix&&(ne=y.instanceMatrix),D==="instanceColor"&&y.instanceColor&&(ne=y.instanceColor));const ce={};ce.attribute=ne,ne&&ne.data&&(ce.data=ne.data),X[D]=ce,V++}s.attributes=X,s.attributesNum=V,s.index=F}function v(){const y=s.newAttributes;for(let E=0,U=y.length;E<U;E++)y[E]=0}function m(y){h(y,0)}function h(y,E){const U=s.newAttributes,F=s.enabledAttributes,X=s.attributeDivisors;U[y]=1,F[y]===0&&(t.enableVertexAttribArray(y),F[y]=1),X[y]!==E&&(t.vertexAttribDivisor(y,E),X[y]=E)}function x(){const y=s.newAttributes,E=s.enabledAttributes;for(let U=0,F=E.length;U<F;U++)E[U]!==y[U]&&(t.disableVertexAttribArray(U),E[U]=0)}function S(y,E,U,F,X,K,V){V===!0?t.vertexAttribIPointer(y,E,U,X,K):t.vertexAttribPointer(y,E,U,F,X,K)}function M(y,E,U,F){v();const X=F.attributes,K=U.getAttributes(),V=E.defaultAttributeValues;for(const ie in K){const D=K[ie];if(D.location>=0){let ee=X[ie];if(ee===void 0&&(ie==="instanceMatrix"&&y.instanceMatrix&&(ee=y.instanceMatrix),ie==="instanceColor"&&y.instanceColor&&(ee=y.instanceColor)),ee!==void 0){const ne=ee.normalized,ce=ee.itemSize,Te=e.get(ee);if(Te===void 0)continue;const ze=Te.buffer,W=Te.type,se=Te.bytesPerElement,Y=W===t.INT||W===t.UNSIGNED_INT||ee.gpuType===vf;if(ee.isInterleavedBufferAttribute){const de=ee.data,Ie=de.stride,De=ee.offset;if(de.isInstancedInterleavedBuffer){for(let Ye=0;Ye<D.locationSize;Ye++)h(D.location+Ye,de.meshPerAttribute);y.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=de.meshPerAttribute*de.count)}else for(let Ye=0;Ye<D.locationSize;Ye++)m(D.location+Ye);t.bindBuffer(t.ARRAY_BUFFER,ze);for(let Ye=0;Ye<D.locationSize;Ye++)S(D.location+Ye,ce/D.locationSize,W,ne,Ie*se,(De+ce/D.locationSize*Ye)*se,Y)}else{if(ee.isInstancedBufferAttribute){for(let de=0;de<D.locationSize;de++)h(D.location+de,ee.meshPerAttribute);y.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=ee.meshPerAttribute*ee.count)}else for(let de=0;de<D.locationSize;de++)m(D.location+de);t.bindBuffer(t.ARRAY_BUFFER,ze);for(let de=0;de<D.locationSize;de++)S(D.location+de,ce/D.locationSize,W,ne,ce*se,ce/D.locationSize*de*se,Y)}}else if(V!==void 0){const ne=V[ie];if(ne!==void 0)switch(ne.length){case 2:t.vertexAttrib2fv(D.location,ne);break;case 3:t.vertexAttrib3fv(D.location,ne);break;case 4:t.vertexAttrib4fv(D.location,ne);break;default:t.vertexAttrib1fv(D.location,ne)}}}}x()}function P(){b();for(const y in i){const E=i[y];for(const U in E){const F=E[U];for(const X in F)u(F[X].object),delete F[X];delete E[U]}delete i[y]}}function C(y){if(i[y.id]===void 0)return;const E=i[y.id];for(const U in E){const F=E[U];for(const X in F)u(F[X].object),delete F[X];delete E[U]}delete i[y.id]}function A(y){for(const E in i){const U=i[E];if(U[y.id]===void 0)continue;const F=U[y.id];for(const X in F)u(F[X].object),delete F[X];delete U[y.id]}}function b(){z(),a=!0,s!==r&&(s=r,c(s.object))}function z(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:o,reset:b,resetDefaultState:z,dispose:P,releaseStatesOfGeometry:C,releaseStatesOfProgram:A,initAttributes:v,enableAttribute:m,disableUnusedAttributes:x}}function w1(t,e,n){let i;function r(c){i=c}function s(c,u){t.drawArrays(i,c,u),n.update(u,i,1)}function a(c,u,d){d!==0&&(t.drawArraysInstanced(i,c,u,d),n.update(u,i,d))}function o(c,u,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,u,0,d);let p=0;for(let _=0;_<d;_++)p+=u[_];n.update(p,i,1)}function l(c,u,d,f){if(d===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let _=0;_<c.length;_++)a(c[_],u[_],f[_]);else{p.multiDrawArraysInstancedWEBGL(i,c,0,u,0,f,0,d);let _=0;for(let v=0;v<d;v++)_+=u[v];for(let v=0;v<f.length;v++)n.update(_,i,f[v])}}this.setMode=r,this.render=s,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function T1(t,e,n,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const A=e.get("EXT_texture_filter_anisotropic");r=t.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function a(A){return!(A!==ni&&i.convert(A)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(A){const b=A===co&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(A!==Di&&i.convert(A)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==Ti&&!b)}function l(A){if(A==="highp"){if(t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.HIGH_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.MEDIUM_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=n.precision!==void 0?n.precision:"highp";const u=l(c);u!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const d=n.logarithmicDepthBuffer===!0,f=n.reverseDepthBuffer===!0&&e.has("EXT_clip_control");if(f===!0){const A=e.get("EXT_clip_control");A.clipControlEXT(A.LOWER_LEFT_EXT,A.ZERO_TO_ONE_EXT)}const p=t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS),_=t.getParameter(t.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=t.getParameter(t.MAX_TEXTURE_SIZE),m=t.getParameter(t.MAX_CUBE_MAP_TEXTURE_SIZE),h=t.getParameter(t.MAX_VERTEX_ATTRIBS),x=t.getParameter(t.MAX_VERTEX_UNIFORM_VECTORS),S=t.getParameter(t.MAX_VARYING_VECTORS),M=t.getParameter(t.MAX_FRAGMENT_UNIFORM_VECTORS),P=_>0,C=t.getParameter(t.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:d,reverseDepthBuffer:f,maxTextures:p,maxVertexTextures:_,maxTextureSize:v,maxCubemapSize:m,maxAttributes:h,maxVertexUniforms:x,maxVaryings:S,maxFragmentUniforms:M,vertexTextures:P,maxSamples:C}}function A1(t){const e=this;let n=null,i=0,r=!1,s=!1;const a=new Cr,o=new Ge,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,f){const p=d.length!==0||f||i!==0||r;return r=f,i=d.length,p},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(d,f){n=u(d,f,0)},this.setState=function(d,f,p){const _=d.clippingPlanes,v=d.clipIntersection,m=d.clipShadows,h=t.get(d);if(!r||_===null||_.length===0||s&&!m)s?u(null):c();else{const x=s?0:i,S=x*4;let M=h.clippingState||null;l.value=M,M=u(_,f,S,p);for(let P=0;P!==S;++P)M[P]=n[P];h.clippingState=M,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=x}};function c(){l.value!==n&&(l.value=n,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(d,f,p,_){const v=d!==null?d.length:0;let m=null;if(v!==0){if(m=l.value,_!==!0||m===null){const h=p+v*4,x=f.matrixWorldInverse;o.getNormalMatrix(x),(m===null||m.length<h)&&(m=new Float32Array(h));for(let S=0,M=p;S!==v;++S,M+=4)a.copy(d[S]).applyMatrix4(x,o),a.normal.toArray(m,M),m[M+3]=a.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,m}}function b1(t){let e=new WeakMap;function n(a,o){return o===Gd?a.mapping=js:o===Vd&&(a.mapping=Ws),a}function i(a){if(a&&a.isTexture){const o=a.mapping;if(o===Gd||o===Vd)if(e.has(a)){const l=e.get(a).texture;return n(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new OM(l.height);return c.fromEquirectangularTexture(t,a),e.set(a,c),a.addEventListener("dispose",r),n(c.texture,a.mapping)}else return null}}return a}function r(a){const o=a.target;o.removeEventListener("dispose",r);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function s(){e=new WeakMap}return{get:i,dispose:s}}class nv extends Q0{constructor(e=-1,n=1,i=1,r=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=n,this.top=i,this.bottom=r,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,n,i,r,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),n=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,a=i+e,o=r+n,l=r-n;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,a=s+c*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.zoom=this.zoom,n.object.left=this.left,n.object.right=this.right,n.object.top=this.top,n.object.bottom=this.bottom,n.object.near=this.near,n.object.far=this.far,this.view!==null&&(n.object.view=Object.assign({},this.view)),n}}const Ts=4,xm=[.125,.215,.35,.446,.526,.582],Nr=20,wu=new nv,ym=new Ce;let Tu=null,Au=0,bu=0,Cu=!1;const Rr=(1+Math.sqrt(5))/2,ls=1/Rr,Sm=[new N(-Rr,ls,0),new N(Rr,ls,0),new N(-ls,0,Rr),new N(ls,0,Rr),new N(0,Rr,-ls),new N(0,Rr,ls),new N(-1,1,-1),new N(1,1,-1),new N(-1,1,1),new N(1,1,1)];class Mm{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,n=0,i=.1,r=100){Tu=this._renderer.getRenderTarget(),Au=this._renderer.getActiveCubeFace(),bu=this._renderer.getActiveMipmapLevel(),Cu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,i,r,s),n>0&&this._blur(s,0,0,n),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,n=null){return this._fromTexture(e,n)}fromCubemap(e,n=null){return this._fromTexture(e,n)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Tm(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=wm(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Tu,Au,bu),this._renderer.xr.enabled=Cu,e.scissorTest=!1,Qo(e,0,0,e.width,e.height)}_fromTexture(e,n){e.mapping===js||e.mapping===Ws?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Tu=this._renderer.getRenderTarget(),Au=this._renderer.getActiveCubeFace(),bu=this._renderer.getActiveMipmapLevel(),Cu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=n||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),n=4*this._cubeSize,i={magFilter:ei,minFilter:ei,generateMipmaps:!1,type:co,format:ni,colorSpace:_r,depthBuffer:!1},r=Em(e,n,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==n){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Em(e,n,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=C1(s)),this._blurMaterial=R1(s,e,n)}return r}_compileMaterial(e){const n=new Ne(this._lodPlanes[0],e);this._renderer.compile(n,wu)}_sceneToCubeUV(e,n,i,r){const o=new gn(90,1,n,i),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,f=u.toneMapping;u.getClearColor(ym),u.toneMapping=ur,u.autoClear=!1;const p=new bt({name:"PMREM.Background",side:Yt,depthWrite:!1,depthTest:!1}),_=new Ne(new si,p);let v=!1;const m=e.background;m?m.isColor&&(p.color.copy(m),e.background=null,v=!0):(p.color.copy(ym),v=!0);for(let h=0;h<6;h++){const x=h%3;x===0?(o.up.set(0,l[h],0),o.lookAt(c[h],0,0)):x===1?(o.up.set(0,0,l[h]),o.lookAt(0,c[h],0)):(o.up.set(0,l[h],0),o.lookAt(0,0,c[h]));const S=this._cubeSize;Qo(r,x*S,h>2?S:0,S,S),u.setRenderTarget(r),v&&u.render(_,o),u.render(e,o)}_.geometry.dispose(),_.material.dispose(),u.toneMapping=f,u.autoClear=d,e.background=m}_textureToCubeUV(e,n){const i=this._renderer,r=e.mapping===js||e.mapping===Ws;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Tm()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=wm());const s=r?this._cubemapMaterial:this._equirectMaterial,a=new Ne(this._lodPlanes[0],s),o=s.uniforms;o.envMap.value=e;const l=this._cubeSize;Qo(n,0,0,3*l,2*l),i.setRenderTarget(n),i.render(a,wu)}_applyPMREM(e){const n=this._renderer,i=n.autoClear;n.autoClear=!1;const r=this._lodPlanes.length;for(let s=1;s<r;s++){const a=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=Sm[(r-s-1)%Sm.length];this._blur(e,s-1,s,a,o)}n.autoClear=i}_blur(e,n,i,r,s){const a=this._pingPongRenderTarget;this._halfBlur(e,a,n,i,r,"latitudinal",s),this._halfBlur(a,e,i,i,r,"longitudinal",s)}_halfBlur(e,n,i,r,s,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,d=new Ne(this._lodPlanes[r],c),f=c.uniforms,p=this._sizeLods[i]-1,_=isFinite(s)?Math.PI/(2*p):2*Math.PI/(2*Nr-1),v=s/_,m=isFinite(s)?1+Math.floor(u*v):Nr;m>Nr&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Nr}`);const h=[];let x=0;for(let A=0;A<Nr;++A){const b=A/v,z=Math.exp(-b*b/2);h.push(z),A===0?x+=z:A<m&&(x+=2*z)}for(let A=0;A<h.length;A++)h[A]=h[A]/x;f.envMap.value=e.texture,f.samples.value=m,f.weights.value=h,f.latitudinal.value=a==="latitudinal",o&&(f.poleAxis.value=o);const{_lodMax:S}=this;f.dTheta.value=_,f.mipInt.value=S-i;const M=this._sizeLods[r],P=3*M*(r>S-Ts?r-S+Ts:0),C=4*(this._cubeSize-M);Qo(n,P,C,3*M,2*M),l.setRenderTarget(n),l.render(d,wu)}}function C1(t){const e=[],n=[],i=[];let r=t;const s=t-Ts+1+xm.length;for(let a=0;a<s;a++){const o=Math.pow(2,r);n.push(o);let l=1/o;a>t-Ts?l=xm[a-t+Ts-1]:a===0&&(l=0),i.push(l);const c=1/(o-2),u=-c,d=1+c,f=[u,u,d,u,d,d,u,u,d,d,u,d],p=6,_=6,v=3,m=2,h=1,x=new Float32Array(v*_*p),S=new Float32Array(m*_*p),M=new Float32Array(h*_*p);for(let C=0;C<p;C++){const A=C%3*2/3-1,b=C>2?0:-1,z=[A,b,0,A+2/3,b,0,A+2/3,b+1,0,A,b,0,A+2/3,b+1,0,A,b+1,0];x.set(z,v*_*C),S.set(f,m*_*C);const y=[C,C,C,C,C,C];M.set(y,h*_*C)}const P=new lt;P.setAttribute("position",new Sn(x,v)),P.setAttribute("uv",new Sn(S,m)),P.setAttribute("faceIndex",new Sn(M,h)),e.push(P),r>Ts&&r--}return{lodPlanes:e,sizeLods:n,sigmas:i}}function Em(t,e,n){const i=new Vr(t,e,n);return i.texture.mapping=Mc,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Qo(t,e,n,i,r){t.viewport.set(e,n,i,r),t.scissor.set(e,n,i,r)}function R1(t,e,n){const i=new Float32Array(Nr),r=new N(0,1,0);return new jn({name:"SphericalGaussianBlur",defines:{n:Nr,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${t}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:Cf(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:cr,depthTest:!1,depthWrite:!1})}function wm(){return new jn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Cf(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:cr,depthTest:!1,depthWrite:!1})}function Tm(){return new jn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Cf(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:cr,depthTest:!1,depthWrite:!1})}function Cf(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function P1(t){let e=new WeakMap,n=null;function i(o){if(o&&o.isTexture){const l=o.mapping,c=l===Gd||l===Vd,u=l===js||l===Ws;if(c||u){let d=e.get(o);const f=d!==void 0?d.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==f)return n===null&&(n=new Mm(t)),d=c?n.fromEquirectangular(o,d):n.fromCubemap(o,d),d.texture.pmremVersion=o.pmremVersion,e.set(o,d),d.texture;if(d!==void 0)return d.texture;{const p=o.image;return c&&p&&p.height>0||u&&p&&r(p)?(n===null&&(n=new Mm(t)),d=c?n.fromEquirectangular(o):n.fromCubemap(o),d.texture.pmremVersion=o.pmremVersion,e.set(o,d),o.addEventListener("dispose",s),d.texture):null}}}return o}function r(o){let l=0;const c=6;for(let u=0;u<c;u++)o[u]!==void 0&&l++;return l===c}function s(o){const l=o.target;l.removeEventListener("dispose",s);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:a}}function N1(t){const e={};function n(i){if(e[i]!==void 0)return e[i];let r;switch(i){case"WEBGL_depth_texture":r=t.getExtension("WEBGL_depth_texture")||t.getExtension("MOZ_WEBGL_depth_texture")||t.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=t.getExtension("EXT_texture_filter_anisotropic")||t.getExtension("MOZ_EXT_texture_filter_anisotropic")||t.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=t.getExtension("WEBGL_compressed_texture_s3tc")||t.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||t.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=t.getExtension("WEBGL_compressed_texture_pvrtc")||t.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=t.getExtension(i)}return e[i]=r,r}return{has:function(i){return n(i)!==null},init:function(){n("EXT_color_buffer_float"),n("WEBGL_clip_cull_distance"),n("OES_texture_float_linear"),n("EXT_color_buffer_half_float"),n("WEBGL_multisampled_render_to_texture"),n("WEBGL_render_shared_exponent")},get:function(i){const r=n(i);return r===null&&bl("THREE.WebGLRenderer: "+i+" extension not supported."),r}}}function L1(t,e,n,i){const r={},s=new WeakMap;function a(d){const f=d.target;f.index!==null&&e.remove(f.index);for(const _ in f.attributes)e.remove(f.attributes[_]);for(const _ in f.morphAttributes){const v=f.morphAttributes[_];for(let m=0,h=v.length;m<h;m++)e.remove(v[m])}f.removeEventListener("dispose",a),delete r[f.id];const p=s.get(f);p&&(e.remove(p),s.delete(f)),i.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,n.memory.geometries--}function o(d,f){return r[f.id]===!0||(f.addEventListener("dispose",a),r[f.id]=!0,n.memory.geometries++),f}function l(d){const f=d.attributes;for(const _ in f)e.update(f[_],t.ARRAY_BUFFER);const p=d.morphAttributes;for(const _ in p){const v=p[_];for(let m=0,h=v.length;m<h;m++)e.update(v[m],t.ARRAY_BUFFER)}}function c(d){const f=[],p=d.index,_=d.attributes.position;let v=0;if(p!==null){const x=p.array;v=p.version;for(let S=0,M=x.length;S<M;S+=3){const P=x[S+0],C=x[S+1],A=x[S+2];f.push(P,C,C,A,A,P)}}else if(_!==void 0){const x=_.array;v=_.version;for(let S=0,M=x.length/3-1;S<M;S+=3){const P=S+0,C=S+1,A=S+2;f.push(P,C,C,A,A,P)}}else return;const m=new(X0(f)?Z0:K0)(f,1);m.version=v;const h=s.get(d);h&&e.remove(h),s.set(d,m)}function u(d){const f=s.get(d);if(f){const p=d.index;p!==null&&f.version<p.version&&c(d)}else c(d);return s.get(d)}return{get:o,update:l,getWireframeAttribute:u}}function D1(t,e,n){let i;function r(f){i=f}let s,a;function o(f){s=f.type,a=f.bytesPerElement}function l(f,p){t.drawElements(i,p,s,f*a),n.update(p,i,1)}function c(f,p,_){_!==0&&(t.drawElementsInstanced(i,p,s,f*a,_),n.update(p,i,_))}function u(f,p,_){if(_===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,p,0,s,f,0,_);let m=0;for(let h=0;h<_;h++)m+=p[h];n.update(m,i,1)}function d(f,p,_,v){if(_===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let h=0;h<f.length;h++)c(f[h]/a,p[h],v[h]);else{m.multiDrawElementsInstancedWEBGL(i,p,0,s,f,0,v,0,_);let h=0;for(let x=0;x<_;x++)h+=p[x];for(let x=0;x<v.length;x++)n.update(h,i,v[x])}}this.setMode=r,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=d}function I1(t){const e={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,a,o){switch(n.calls++,a){case t.TRIANGLES:n.triangles+=o*(s/3);break;case t.LINES:n.lines+=o*(s/2);break;case t.LINE_STRIP:n.lines+=o*(s-1);break;case t.LINE_LOOP:n.lines+=o*s;break;case t.POINTS:n.points+=o*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function r(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:e,render:n,programs:null,autoReset:!0,reset:r,update:i}}function U1(t,e,n){const i=new WeakMap,r=new ct;function s(a,o,l){const c=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=u!==void 0?u.length:0;let f=i.get(o);if(f===void 0||f.count!==d){let y=function(){b.dispose(),i.delete(o),o.removeEventListener("dispose",y)};var p=y;f!==void 0&&f.texture.dispose();const _=o.morphAttributes.position!==void 0,v=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,h=o.morphAttributes.position||[],x=o.morphAttributes.normal||[],S=o.morphAttributes.color||[];let M=0;_===!0&&(M=1),v===!0&&(M=2),m===!0&&(M=3);let P=o.attributes.position.count*M,C=1;P>e.maxTextureSize&&(C=Math.ceil(P/e.maxTextureSize),P=e.maxTextureSize);const A=new Float32Array(P*C*4*d),b=new Y0(A,P,C,d);b.type=Ti,b.needsUpdate=!0;const z=M*4;for(let E=0;E<d;E++){const U=h[E],F=x[E],X=S[E],K=P*C*4*E;for(let V=0;V<U.count;V++){const ie=V*z;_===!0&&(r.fromBufferAttribute(U,V),A[K+ie+0]=r.x,A[K+ie+1]=r.y,A[K+ie+2]=r.z,A[K+ie+3]=0),v===!0&&(r.fromBufferAttribute(F,V),A[K+ie+4]=r.x,A[K+ie+5]=r.y,A[K+ie+6]=r.z,A[K+ie+7]=0),m===!0&&(r.fromBufferAttribute(X,V),A[K+ie+8]=r.x,A[K+ie+9]=r.y,A[K+ie+10]=r.z,A[K+ie+11]=X.itemSize===4?r.w:1)}}f={count:d,texture:b,size:new Oe(P,C)},i.set(o,f),o.addEventListener("dispose",y)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(t,"morphTexture",a.morphTexture,n);else{let _=0;for(let m=0;m<c.length;m++)_+=c[m];const v=o.morphTargetsRelative?1:1-_;l.getUniforms().setValue(t,"morphTargetBaseInfluence",v),l.getUniforms().setValue(t,"morphTargetInfluences",c)}l.getUniforms().setValue(t,"morphTargetsTexture",f.texture,n),l.getUniforms().setValue(t,"morphTargetsTextureSize",f.size)}return{update:s}}function k1(t,e,n,i){let r=new WeakMap;function s(l){const c=i.render.frame,u=l.geometry,d=e.get(l,u);if(r.get(d)!==c&&(e.update(d),r.set(d,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),r.get(l)!==c&&(n.update(l.instanceMatrix,t.ARRAY_BUFFER),l.instanceColor!==null&&n.update(l.instanceColor,t.ARRAY_BUFFER),r.set(l,c))),l.isSkinnedMesh){const f=l.skeleton;r.get(f)!==c&&(f.update(),r.set(f,c))}return d}function a(){r=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),n.remove(c.instanceMatrix),c.instanceColor!==null&&n.remove(c.instanceColor)}return{update:s,dispose:a}}class iv extends rn{constructor(e,n,i,r,s,a,o,l,c,u=Is){if(u!==Is&&u!==$s)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&u===Is&&(i=Gr),i===void 0&&u===$s&&(i=Xs),super(null,r,s,a,o,l,u,i,c),this.isDepthTexture=!0,this.image={width:e,height:n},this.magFilter=o!==void 0?o:Bn,this.minFilter=l!==void 0?l:Bn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const n=super.toJSON(e);return this.compareFunction!==null&&(n.compareFunction=this.compareFunction),n}}const rv=new rn,Am=new iv(1,1),sv=new Y0,av=new MM,ov=new ev,bm=[],Cm=[],Rm=new Float32Array(16),Pm=new Float32Array(9),Nm=new Float32Array(4);function ea(t,e,n){const i=t[0];if(i<=0||i>0)return t;const r=e*n;let s=bm[r];if(s===void 0&&(s=new Float32Array(r),bm[r]=s),e!==0){i.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=n,t[a].toArray(s,o)}return s}function Ft(t,e){if(t.length!==e.length)return!1;for(let n=0,i=t.length;n<i;n++)if(t[n]!==e[n])return!1;return!0}function Ot(t,e){for(let n=0,i=e.length;n<i;n++)t[n]=e[n]}function Tc(t,e){let n=Cm[e];n===void 0&&(n=new Int32Array(e),Cm[e]=n);for(let i=0;i!==e;++i)n[i]=t.allocateTextureUnit();return n}function F1(t,e){const n=this.cache;n[0]!==e&&(t.uniform1f(this.addr,e),n[0]=e)}function O1(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2f(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Ft(n,e))return;t.uniform2fv(this.addr,e),Ot(n,e)}}function z1(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3f(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else if(e.r!==void 0)(n[0]!==e.r||n[1]!==e.g||n[2]!==e.b)&&(t.uniform3f(this.addr,e.r,e.g,e.b),n[0]=e.r,n[1]=e.g,n[2]=e.b);else{if(Ft(n,e))return;t.uniform3fv(this.addr,e),Ot(n,e)}}function B1(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4f(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Ft(n,e))return;t.uniform4fv(this.addr,e),Ot(n,e)}}function H1(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Ft(n,e))return;t.uniformMatrix2fv(this.addr,!1,e),Ot(n,e)}else{if(Ft(n,i))return;Nm.set(i),t.uniformMatrix2fv(this.addr,!1,Nm),Ot(n,i)}}function G1(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Ft(n,e))return;t.uniformMatrix3fv(this.addr,!1,e),Ot(n,e)}else{if(Ft(n,i))return;Pm.set(i),t.uniformMatrix3fv(this.addr,!1,Pm),Ot(n,i)}}function V1(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Ft(n,e))return;t.uniformMatrix4fv(this.addr,!1,e),Ot(n,e)}else{if(Ft(n,i))return;Rm.set(i),t.uniformMatrix4fv(this.addr,!1,Rm),Ot(n,i)}}function j1(t,e){const n=this.cache;n[0]!==e&&(t.uniform1i(this.addr,e),n[0]=e)}function W1(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2i(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Ft(n,e))return;t.uniform2iv(this.addr,e),Ot(n,e)}}function X1(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3i(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(Ft(n,e))return;t.uniform3iv(this.addr,e),Ot(n,e)}}function $1(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4i(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Ft(n,e))return;t.uniform4iv(this.addr,e),Ot(n,e)}}function Y1(t,e){const n=this.cache;n[0]!==e&&(t.uniform1ui(this.addr,e),n[0]=e)}function q1(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2ui(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Ft(n,e))return;t.uniform2uiv(this.addr,e),Ot(n,e)}}function K1(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3ui(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(Ft(n,e))return;t.uniform3uiv(this.addr,e),Ot(n,e)}}function Z1(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4ui(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Ft(n,e))return;t.uniform4uiv(this.addr,e),Ot(n,e)}}function J1(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r);let s;this.type===t.SAMPLER_2D_SHADOW?(Am.compareFunction=W0,s=Am):s=rv,n.setTexture2D(e||s,r)}function Q1(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture3D(e||av,r)}function eT(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTextureCube(e||ov,r)}function tT(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture2DArray(e||sv,r)}function nT(t){switch(t){case 5126:return F1;case 35664:return O1;case 35665:return z1;case 35666:return B1;case 35674:return H1;case 35675:return G1;case 35676:return V1;case 5124:case 35670:return j1;case 35667:case 35671:return W1;case 35668:case 35672:return X1;case 35669:case 35673:return $1;case 5125:return Y1;case 36294:return q1;case 36295:return K1;case 36296:return Z1;case 35678:case 36198:case 36298:case 36306:case 35682:return J1;case 35679:case 36299:case 36307:return Q1;case 35680:case 36300:case 36308:case 36293:return eT;case 36289:case 36303:case 36311:case 36292:return tT}}function iT(t,e){t.uniform1fv(this.addr,e)}function rT(t,e){const n=ea(e,this.size,2);t.uniform2fv(this.addr,n)}function sT(t,e){const n=ea(e,this.size,3);t.uniform3fv(this.addr,n)}function aT(t,e){const n=ea(e,this.size,4);t.uniform4fv(this.addr,n)}function oT(t,e){const n=ea(e,this.size,4);t.uniformMatrix2fv(this.addr,!1,n)}function lT(t,e){const n=ea(e,this.size,9);t.uniformMatrix3fv(this.addr,!1,n)}function cT(t,e){const n=ea(e,this.size,16);t.uniformMatrix4fv(this.addr,!1,n)}function uT(t,e){t.uniform1iv(this.addr,e)}function dT(t,e){t.uniform2iv(this.addr,e)}function hT(t,e){t.uniform3iv(this.addr,e)}function fT(t,e){t.uniform4iv(this.addr,e)}function pT(t,e){t.uniform1uiv(this.addr,e)}function mT(t,e){t.uniform2uiv(this.addr,e)}function gT(t,e){t.uniform3uiv(this.addr,e)}function _T(t,e){t.uniform4uiv(this.addr,e)}function vT(t,e,n){const i=this.cache,r=e.length,s=Tc(n,r);Ft(i,s)||(t.uniform1iv(this.addr,s),Ot(i,s));for(let a=0;a!==r;++a)n.setTexture2D(e[a]||rv,s[a])}function xT(t,e,n){const i=this.cache,r=e.length,s=Tc(n,r);Ft(i,s)||(t.uniform1iv(this.addr,s),Ot(i,s));for(let a=0;a!==r;++a)n.setTexture3D(e[a]||av,s[a])}function yT(t,e,n){const i=this.cache,r=e.length,s=Tc(n,r);Ft(i,s)||(t.uniform1iv(this.addr,s),Ot(i,s));for(let a=0;a!==r;++a)n.setTextureCube(e[a]||ov,s[a])}function ST(t,e,n){const i=this.cache,r=e.length,s=Tc(n,r);Ft(i,s)||(t.uniform1iv(this.addr,s),Ot(i,s));for(let a=0;a!==r;++a)n.setTexture2DArray(e[a]||sv,s[a])}function MT(t){switch(t){case 5126:return iT;case 35664:return rT;case 35665:return sT;case 35666:return aT;case 35674:return oT;case 35675:return lT;case 35676:return cT;case 5124:case 35670:return uT;case 35667:case 35671:return dT;case 35668:case 35672:return hT;case 35669:case 35673:return fT;case 5125:return pT;case 36294:return mT;case 36295:return gT;case 36296:return _T;case 35678:case 36198:case 36298:case 36306:case 35682:return vT;case 35679:case 36299:case 36307:return xT;case 35680:case 36300:case 36308:case 36293:return yT;case 36289:case 36303:case 36311:case 36292:return ST}}class ET{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.setValue=nT(n.type)}}class wT{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.size=n.size,this.setValue=MT(n.type)}}class TT{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,n,i){const r=this.seq;for(let s=0,a=r.length;s!==a;++s){const o=r[s];o.setValue(e,n[o.id],i)}}}const Ru=/(\w+)(\])?(\[|\.)?/g;function Lm(t,e){t.seq.push(e),t.map[e.id]=e}function AT(t,e,n){const i=t.name,r=i.length;for(Ru.lastIndex=0;;){const s=Ru.exec(i),a=Ru.lastIndex;let o=s[1];const l=s[2]==="]",c=s[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===r){Lm(n,c===void 0?new ET(o,t,e):new wT(o,t,e));break}else{let d=n.map[o];d===void 0&&(d=new TT(o),Lm(n,d)),n=d}}}class Cl{constructor(e,n){this.seq=[],this.map={};const i=e.getProgramParameter(n,e.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){const s=e.getActiveUniform(n,r),a=e.getUniformLocation(n,s.name);AT(s,a,this)}}setValue(e,n,i,r){const s=this.map[n];s!==void 0&&s.setValue(e,i,r)}setOptional(e,n,i){const r=n[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,n,i,r){for(let s=0,a=n.length;s!==a;++s){const o=n[s],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,r)}}static seqWithValue(e,n){const i=[];for(let r=0,s=e.length;r!==s;++r){const a=e[r];a.id in n&&i.push(a)}return i}}function Dm(t,e,n){const i=t.createShader(e);return t.shaderSource(i,n),t.compileShader(i),i}const bT=37297;let CT=0;function RT(t,e){const n=t.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,n.length);for(let a=r;a<s;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${n[a]}`)}return i.join(`
`)}function PT(t){const e=it.getPrimaries(it.workingColorSpace),n=it.getPrimaries(t);let i;switch(e===n?i="":e===tc&&n===ec?i="LinearDisplayP3ToLinearSRGB":e===ec&&n===tc&&(i="LinearSRGBToLinearDisplayP3"),t){case _r:case Ec:return[i,"LinearTransferOETF"];case tn:case wf:return[i,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",t),[i,"LinearTransferOETF"]}}function Im(t,e,n){const i=t.getShaderParameter(e,t.COMPILE_STATUS),r=t.getShaderInfoLog(e).trim();if(i&&r==="")return"";const s=/ERROR: 0:(\d+)/.exec(r);if(s){const a=parseInt(s[1]);return n.toUpperCase()+`

`+r+`

`+RT(t.getShaderSource(e),a)}else return r}function NT(t,e){const n=PT(e);return`vec4 ${t}( vec4 value ) { return ${n[0]}( ${n[1]}( value ) ); }`}function LT(t,e){let n;switch(e){case DS:n="Linear";break;case IS:n="Reinhard";break;case US:n="Cineon";break;case kS:n="ACESFilmic";break;case OS:n="AgX";break;case zS:n="Neutral";break;case FS:n="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),n="Linear"}return"vec3 "+t+"( vec3 color ) { return "+n+"ToneMapping( color ); }"}const el=new N;function DT(){it.getLuminanceCoefficients(el);const t=el.x.toFixed(4),e=el.y.toFixed(4),n=el.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${t}, ${e}, ${n} );`,"	return dot( weights, rgb );","}"].join(`
`)}function IT(t){return[t.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",t.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(wa).join(`
`)}function UT(t){const e=[];for(const n in t){const i=t[n];i!==!1&&e.push("#define "+n+" "+i)}return e.join(`
`)}function kT(t,e){const n={},i=t.getProgramParameter(e,t.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=t.getActiveAttrib(e,r),a=s.name;let o=1;s.type===t.FLOAT_MAT2&&(o=2),s.type===t.FLOAT_MAT3&&(o=3),s.type===t.FLOAT_MAT4&&(o=4),n[a]={type:s.type,location:t.getAttribLocation(e,a),locationSize:o}}return n}function wa(t){return t!==""}function Um(t,e){const n=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return t.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function km(t,e){return t.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const FT=/^[ \t]*#include +<([\w\d./]+)>/gm;function xh(t){return t.replace(FT,zT)}const OT=new Map;function zT(t,e){let n=He[e];if(n===void 0){const i=OT.get(e);if(i!==void 0)n=He[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return xh(n)}const BT=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Fm(t){return t.replace(BT,HT)}function HT(t,e,n,i){let r="";for(let s=parseInt(e);s<parseInt(n);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function Om(t){let e=`precision ${t.precision} float;
	precision ${t.precision} int;
	precision ${t.precision} sampler2D;
	precision ${t.precision} samplerCube;
	precision ${t.precision} sampler3D;
	precision ${t.precision} sampler2DArray;
	precision ${t.precision} sampler2DShadow;
	precision ${t.precision} samplerCubeShadow;
	precision ${t.precision} sampler2DArrayShadow;
	precision ${t.precision} isampler2D;
	precision ${t.precision} isampler3D;
	precision ${t.precision} isamplerCube;
	precision ${t.precision} isampler2DArray;
	precision ${t.precision} usampler2D;
	precision ${t.precision} usampler3D;
	precision ${t.precision} usamplerCube;
	precision ${t.precision} usampler2DArray;
	`;return t.precision==="highp"?e+=`
#define HIGH_PRECISION`:t.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:t.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function GT(t){let e="SHADOWMAP_TYPE_BASIC";return t.shadowMapType===P0?e="SHADOWMAP_TYPE_PCF":t.shadowMapType===N0?e="SHADOWMAP_TYPE_PCF_SOFT":t.shadowMapType===xi&&(e="SHADOWMAP_TYPE_VSM"),e}function VT(t){let e="ENVMAP_TYPE_CUBE";if(t.envMap)switch(t.envMapMode){case js:case Ws:e="ENVMAP_TYPE_CUBE";break;case Mc:e="ENVMAP_TYPE_CUBE_UV";break}return e}function jT(t){let e="ENVMAP_MODE_REFLECTION";if(t.envMap)switch(t.envMapMode){case Ws:e="ENVMAP_MODE_REFRACTION";break}return e}function WT(t){let e="ENVMAP_BLENDING_NONE";if(t.envMap)switch(t.combine){case L0:e="ENVMAP_BLENDING_MULTIPLY";break;case NS:e="ENVMAP_BLENDING_MIX";break;case LS:e="ENVMAP_BLENDING_ADD";break}return e}function XT(t){const e=t.envMapCubeUVHeight;if(e===null)return null;const n=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,n),7*16)),texelHeight:i,maxMip:n}}function $T(t,e,n,i){const r=t.getContext(),s=n.defines;let a=n.vertexShader,o=n.fragmentShader;const l=GT(n),c=VT(n),u=jT(n),d=WT(n),f=XT(n),p=IT(n),_=UT(s),v=r.createProgram();let m,h,x=n.glslVersion?"#version "+n.glslVersion+`
`:"";n.isRawShaderMaterial?(m=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,_].filter(wa).join(`
`),m.length>0&&(m+=`
`),h=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,_].filter(wa).join(`
`),h.length>0&&(h+=`
`)):(m=[Om(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,_,n.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",n.batching?"#define USE_BATCHING":"",n.batchingColor?"#define USE_BATCHING_COLOR":"",n.instancing?"#define USE_INSTANCING":"",n.instancingColor?"#define USE_INSTANCING_COLOR":"",n.instancingMorph?"#define USE_INSTANCING_MORPH":"",n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+u:"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.displacementMap?"#define USE_DISPLACEMENTMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.mapUv?"#define MAP_UV "+n.mapUv:"",n.alphaMapUv?"#define ALPHAMAP_UV "+n.alphaMapUv:"",n.lightMapUv?"#define LIGHTMAP_UV "+n.lightMapUv:"",n.aoMapUv?"#define AOMAP_UV "+n.aoMapUv:"",n.emissiveMapUv?"#define EMISSIVEMAP_UV "+n.emissiveMapUv:"",n.bumpMapUv?"#define BUMPMAP_UV "+n.bumpMapUv:"",n.normalMapUv?"#define NORMALMAP_UV "+n.normalMapUv:"",n.displacementMapUv?"#define DISPLACEMENTMAP_UV "+n.displacementMapUv:"",n.metalnessMapUv?"#define METALNESSMAP_UV "+n.metalnessMapUv:"",n.roughnessMapUv?"#define ROUGHNESSMAP_UV "+n.roughnessMapUv:"",n.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+n.anisotropyMapUv:"",n.clearcoatMapUv?"#define CLEARCOATMAP_UV "+n.clearcoatMapUv:"",n.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+n.clearcoatNormalMapUv:"",n.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+n.clearcoatRoughnessMapUv:"",n.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+n.iridescenceMapUv:"",n.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+n.iridescenceThicknessMapUv:"",n.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+n.sheenColorMapUv:"",n.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+n.sheenRoughnessMapUv:"",n.specularMapUv?"#define SPECULARMAP_UV "+n.specularMapUv:"",n.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+n.specularColorMapUv:"",n.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+n.specularIntensityMapUv:"",n.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+n.transmissionMapUv:"",n.thicknessMapUv?"#define THICKNESSMAP_UV "+n.thicknessMapUv:"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.flatShading?"#define FLAT_SHADED":"",n.skinning?"#define USE_SKINNING":"",n.morphTargets?"#define USE_MORPHTARGETS":"",n.morphNormals&&n.flatShading===!1?"#define USE_MORPHNORMALS":"",n.morphColors?"#define USE_MORPHCOLORS":"",n.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+n.morphTextureStride:"",n.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+n.morphTargetsCount:"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.sizeAttenuation?"#define USE_SIZEATTENUATION":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",n.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(wa).join(`
`),h=[Om(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,_,n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",n.map?"#define USE_MAP":"",n.matcap?"#define USE_MATCAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+c:"",n.envMap?"#define "+u:"",n.envMap?"#define "+d:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoat?"#define USE_CLEARCOAT":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.dispersion?"#define USE_DISPERSION":"",n.iridescence?"#define USE_IRIDESCENCE":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaTest?"#define USE_ALPHATEST":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.sheen?"#define USE_SHEEN":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors||n.instancingColor||n.batchingColor?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.gradientMap?"#define USE_GRADIENTMAP":"",n.flatShading?"#define FLAT_SHADED":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",n.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",n.toneMapping!==ur?"#define TONE_MAPPING":"",n.toneMapping!==ur?He.tonemapping_pars_fragment:"",n.toneMapping!==ur?LT("toneMapping",n.toneMapping):"",n.dithering?"#define DITHERING":"",n.opaque?"#define OPAQUE":"",He.colorspace_pars_fragment,NT("linearToOutputTexel",n.outputColorSpace),DT(),n.useDepthPacking?"#define DEPTH_PACKING "+n.depthPacking:"",`
`].filter(wa).join(`
`)),a=xh(a),a=Um(a,n),a=km(a,n),o=xh(o),o=Um(o,n),o=km(o,n),a=Fm(a),o=Fm(o),n.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,h=["#define varying in",n.glslVersion===em?"":"layout(location = 0) out highp vec4 pc_fragColor;",n.glslVersion===em?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+h);const S=x+m+a,M=x+h+o,P=Dm(r,r.VERTEX_SHADER,S),C=Dm(r,r.FRAGMENT_SHADER,M);r.attachShader(v,P),r.attachShader(v,C),n.index0AttributeName!==void 0?r.bindAttribLocation(v,0,n.index0AttributeName):n.morphTargets===!0&&r.bindAttribLocation(v,0,"position"),r.linkProgram(v);function A(E){if(t.debug.checkShaderErrors){const U=r.getProgramInfoLog(v).trim(),F=r.getShaderInfoLog(P).trim(),X=r.getShaderInfoLog(C).trim();let K=!0,V=!0;if(r.getProgramParameter(v,r.LINK_STATUS)===!1)if(K=!1,typeof t.debug.onShaderError=="function")t.debug.onShaderError(r,v,P,C);else{const ie=Im(r,P,"vertex"),D=Im(r,C,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(v,r.VALIDATE_STATUS)+`

Material Name: `+E.name+`
Material Type: `+E.type+`

Program Info Log: `+U+`
`+ie+`
`+D)}else U!==""?console.warn("THREE.WebGLProgram: Program Info Log:",U):(F===""||X==="")&&(V=!1);V&&(E.diagnostics={runnable:K,programLog:U,vertexShader:{log:F,prefix:m},fragmentShader:{log:X,prefix:h}})}r.deleteShader(P),r.deleteShader(C),b=new Cl(r,v),z=kT(r,v)}let b;this.getUniforms=function(){return b===void 0&&A(this),b};let z;this.getAttributes=function(){return z===void 0&&A(this),z};let y=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return y===!1&&(y=r.getProgramParameter(v,bT)),y},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(v),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=CT++,this.cacheKey=e,this.usedTimes=1,this.program=v,this.vertexShader=P,this.fragmentShader=C,this}let YT=0;class qT{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const n=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(n),s=this._getShaderStage(i),a=this._getShaderCacheForMaterial(e);return a.has(r)===!1&&(a.add(r),r.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(e){const n=this.materialCache.get(e);for(const i of n)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const n=this.materialCache;let i=n.get(e);return i===void 0&&(i=new Set,n.set(e,i)),i}_getShaderStage(e){const n=this.shaderCache;let i=n.get(e);return i===void 0&&(i=new KT(e),n.set(e,i)),i}}class KT{constructor(e){this.id=YT++,this.code=e,this.usedTimes=0}}function ZT(t,e,n,i,r,s,a){const o=new Af,l=new qT,c=new Set,u=[],d=r.logarithmicDepthBuffer,f=r.reverseDepthBuffer,p=r.vertexTextures;let _=r.precision;const v={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function m(y){return c.add(y),y===0?"uv":`uv${y}`}function h(y,E,U,F,X){const K=F.fog,V=X.geometry,ie=y.isMeshStandardMaterial?F.environment:null,D=(y.isMeshStandardMaterial?n:e).get(y.envMap||ie),ee=D&&D.mapping===Mc?D.image.height:null,ne=v[y.type];y.precision!==null&&(_=r.getMaxPrecision(y.precision),_!==y.precision&&console.warn("THREE.WebGLProgram.getParameters:",y.precision,"not supported, using",_,"instead."));const ce=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,Te=ce!==void 0?ce.length:0;let ze=0;V.morphAttributes.position!==void 0&&(ze=1),V.morphAttributes.normal!==void 0&&(ze=2),V.morphAttributes.color!==void 0&&(ze=3);let W,se,Y,de;if(ne){const dt=ci[ne];W=dt.vertexShader,se=dt.fragmentShader}else W=y.vertexShader,se=y.fragmentShader,l.update(y),Y=l.getVertexShaderID(y),de=l.getFragmentShaderID(y);const Ie=t.getRenderTarget(),De=X.isInstancedMesh===!0,Ye=X.isBatchedMesh===!0,Qe=!!y.map,Ve=!!y.matcap,L=!!D,Re=!!y.aoMap,We=!!y.lightMap,Ze=!!y.bumpMap,Le=!!y.normalMap,et=!!y.displacementMap,Ue=!!y.emissiveMap,R=!!y.metalnessMap,w=!!y.roughnessMap,H=y.anisotropy>0,J=y.clearcoat>0,ae=y.dispersion>0,Z=y.iridescence>0,Me=y.sheen>0,fe=y.transmission>0,ve=H&&!!y.anisotropyMap,qe=J&&!!y.clearcoatMap,le=J&&!!y.clearcoatNormalMap,$=J&&!!y.clearcoatRoughnessMap,Q=Z&&!!y.iridescenceMap,te=Z&&!!y.iridescenceThicknessMap,re=Me&&!!y.sheenColorMap,Pe=Me&&!!y.sheenRoughnessMap,we=!!y.specularMap,Xe=!!y.specularColorMap,I=!!y.specularIntensityMap,pe=fe&&!!y.transmissionMap,B=fe&&!!y.thicknessMap,q=!!y.gradientMap,me=!!y.alphaMap,ge=y.alphaTest>0,Be=!!y.alphaHash,rt=!!y.extensions;let Tt=ur;y.toneMapped&&(Ie===null||Ie.isXRRenderTarget===!0)&&(Tt=t.toneMapping);const je={shaderID:ne,shaderType:y.type,shaderName:y.name,vertexShader:W,fragmentShader:se,defines:y.defines,customVertexShaderID:Y,customFragmentShaderID:de,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:_,batching:Ye,batchingColor:Ye&&X._colorsTexture!==null,instancing:De,instancingColor:De&&X.instanceColor!==null,instancingMorph:De&&X.morphTexture!==null,supportsVertexTextures:p,outputColorSpace:Ie===null?t.outputColorSpace:Ie.isXRRenderTarget===!0?Ie.texture.colorSpace:_r,alphaToCoverage:!!y.alphaToCoverage,map:Qe,matcap:Ve,envMap:L,envMapMode:L&&D.mapping,envMapCubeUVHeight:ee,aoMap:Re,lightMap:We,bumpMap:Ze,normalMap:Le,displacementMap:p&&et,emissiveMap:Ue,normalMapObjectSpace:Le&&y.normalMapType===VS,normalMapTangentSpace:Le&&y.normalMapType===j0,metalnessMap:R,roughnessMap:w,anisotropy:H,anisotropyMap:ve,clearcoat:J,clearcoatMap:qe,clearcoatNormalMap:le,clearcoatRoughnessMap:$,dispersion:ae,iridescence:Z,iridescenceMap:Q,iridescenceThicknessMap:te,sheen:Me,sheenColorMap:re,sheenRoughnessMap:Pe,specularMap:we,specularColorMap:Xe,specularIntensityMap:I,transmission:fe,transmissionMap:pe,thicknessMap:B,gradientMap:q,opaque:y.transparent===!1&&y.blending===Ds&&y.alphaToCoverage===!1,alphaMap:me,alphaTest:ge,alphaHash:Be,combine:y.combine,mapUv:Qe&&m(y.map.channel),aoMapUv:Re&&m(y.aoMap.channel),lightMapUv:We&&m(y.lightMap.channel),bumpMapUv:Ze&&m(y.bumpMap.channel),normalMapUv:Le&&m(y.normalMap.channel),displacementMapUv:et&&m(y.displacementMap.channel),emissiveMapUv:Ue&&m(y.emissiveMap.channel),metalnessMapUv:R&&m(y.metalnessMap.channel),roughnessMapUv:w&&m(y.roughnessMap.channel),anisotropyMapUv:ve&&m(y.anisotropyMap.channel),clearcoatMapUv:qe&&m(y.clearcoatMap.channel),clearcoatNormalMapUv:le&&m(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:$&&m(y.clearcoatRoughnessMap.channel),iridescenceMapUv:Q&&m(y.iridescenceMap.channel),iridescenceThicknessMapUv:te&&m(y.iridescenceThicknessMap.channel),sheenColorMapUv:re&&m(y.sheenColorMap.channel),sheenRoughnessMapUv:Pe&&m(y.sheenRoughnessMap.channel),specularMapUv:we&&m(y.specularMap.channel),specularColorMapUv:Xe&&m(y.specularColorMap.channel),specularIntensityMapUv:I&&m(y.specularIntensityMap.channel),transmissionMapUv:pe&&m(y.transmissionMap.channel),thicknessMapUv:B&&m(y.thicknessMap.channel),alphaMapUv:me&&m(y.alphaMap.channel),vertexTangents:!!V.attributes.tangent&&(Le||H),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,pointsUvs:X.isPoints===!0&&!!V.attributes.uv&&(Qe||me),fog:!!K,useFog:y.fog===!0,fogExp2:!!K&&K.isFogExp2,flatShading:y.flatShading===!0,sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:d,reverseDepthBuffer:f,skinning:X.isSkinnedMesh===!0,morphTargets:V.morphAttributes.position!==void 0,morphNormals:V.morphAttributes.normal!==void 0,morphColors:V.morphAttributes.color!==void 0,morphTargetsCount:Te,morphTextureStride:ze,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:y.dithering,shadowMapEnabled:t.shadowMap.enabled&&U.length>0,shadowMapType:t.shadowMap.type,toneMapping:Tt,decodeVideoTexture:Qe&&y.map.isVideoTexture===!0&&it.getTransfer(y.map.colorSpace)===_t,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===yt,flipSided:y.side===Yt,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:rt&&y.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(rt&&y.extensions.multiDraw===!0||Ye)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return je.vertexUv1s=c.has(1),je.vertexUv2s=c.has(2),je.vertexUv3s=c.has(3),c.clear(),je}function x(y){const E=[];if(y.shaderID?E.push(y.shaderID):(E.push(y.customVertexShaderID),E.push(y.customFragmentShaderID)),y.defines!==void 0)for(const U in y.defines)E.push(U),E.push(y.defines[U]);return y.isRawShaderMaterial===!1&&(S(E,y),M(E,y),E.push(t.outputColorSpace)),E.push(y.customProgramCacheKey),E.join()}function S(y,E){y.push(E.precision),y.push(E.outputColorSpace),y.push(E.envMapMode),y.push(E.envMapCubeUVHeight),y.push(E.mapUv),y.push(E.alphaMapUv),y.push(E.lightMapUv),y.push(E.aoMapUv),y.push(E.bumpMapUv),y.push(E.normalMapUv),y.push(E.displacementMapUv),y.push(E.emissiveMapUv),y.push(E.metalnessMapUv),y.push(E.roughnessMapUv),y.push(E.anisotropyMapUv),y.push(E.clearcoatMapUv),y.push(E.clearcoatNormalMapUv),y.push(E.clearcoatRoughnessMapUv),y.push(E.iridescenceMapUv),y.push(E.iridescenceThicknessMapUv),y.push(E.sheenColorMapUv),y.push(E.sheenRoughnessMapUv),y.push(E.specularMapUv),y.push(E.specularColorMapUv),y.push(E.specularIntensityMapUv),y.push(E.transmissionMapUv),y.push(E.thicknessMapUv),y.push(E.combine),y.push(E.fogExp2),y.push(E.sizeAttenuation),y.push(E.morphTargetsCount),y.push(E.morphAttributeCount),y.push(E.numDirLights),y.push(E.numPointLights),y.push(E.numSpotLights),y.push(E.numSpotLightMaps),y.push(E.numHemiLights),y.push(E.numRectAreaLights),y.push(E.numDirLightShadows),y.push(E.numPointLightShadows),y.push(E.numSpotLightShadows),y.push(E.numSpotLightShadowsWithMaps),y.push(E.numLightProbes),y.push(E.shadowMapType),y.push(E.toneMapping),y.push(E.numClippingPlanes),y.push(E.numClipIntersection),y.push(E.depthPacking)}function M(y,E){o.disableAll(),E.supportsVertexTextures&&o.enable(0),E.instancing&&o.enable(1),E.instancingColor&&o.enable(2),E.instancingMorph&&o.enable(3),E.matcap&&o.enable(4),E.envMap&&o.enable(5),E.normalMapObjectSpace&&o.enable(6),E.normalMapTangentSpace&&o.enable(7),E.clearcoat&&o.enable(8),E.iridescence&&o.enable(9),E.alphaTest&&o.enable(10),E.vertexColors&&o.enable(11),E.vertexAlphas&&o.enable(12),E.vertexUv1s&&o.enable(13),E.vertexUv2s&&o.enable(14),E.vertexUv3s&&o.enable(15),E.vertexTangents&&o.enable(16),E.anisotropy&&o.enable(17),E.alphaHash&&o.enable(18),E.batching&&o.enable(19),E.dispersion&&o.enable(20),E.batchingColor&&o.enable(21),y.push(o.mask),o.disableAll(),E.fog&&o.enable(0),E.useFog&&o.enable(1),E.flatShading&&o.enable(2),E.logarithmicDepthBuffer&&o.enable(3),E.reverseDepthBuffer&&o.enable(4),E.skinning&&o.enable(5),E.morphTargets&&o.enable(6),E.morphNormals&&o.enable(7),E.morphColors&&o.enable(8),E.premultipliedAlpha&&o.enable(9),E.shadowMapEnabled&&o.enable(10),E.doubleSided&&o.enable(11),E.flipSided&&o.enable(12),E.useDepthPacking&&o.enable(13),E.dithering&&o.enable(14),E.transmission&&o.enable(15),E.sheen&&o.enable(16),E.opaque&&o.enable(17),E.pointsUvs&&o.enable(18),E.decodeVideoTexture&&o.enable(19),E.alphaToCoverage&&o.enable(20),y.push(o.mask)}function P(y){const E=v[y.type];let U;if(E){const F=ci[E];U=IM.clone(F.uniforms)}else U=y.uniforms;return U}function C(y,E){let U;for(let F=0,X=u.length;F<X;F++){const K=u[F];if(K.cacheKey===E){U=K,++U.usedTimes;break}}return U===void 0&&(U=new $T(t,E,y,s),u.push(U)),U}function A(y){if(--y.usedTimes===0){const E=u.indexOf(y);u[E]=u[u.length-1],u.pop(),y.destroy()}}function b(y){l.remove(y)}function z(){l.dispose()}return{getParameters:h,getProgramCacheKey:x,getUniforms:P,acquireProgram:C,releaseProgram:A,releaseShaderCache:b,programs:u,dispose:z}}function JT(){let t=new WeakMap;function e(a){return t.has(a)}function n(a){let o=t.get(a);return o===void 0&&(o={},t.set(a,o)),o}function i(a){t.delete(a)}function r(a,o,l){t.get(a)[o]=l}function s(){t=new WeakMap}return{has:e,get:n,remove:i,update:r,dispose:s}}function QT(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.material.id!==e.material.id?t.material.id-e.material.id:t.z!==e.z?t.z-e.z:t.id-e.id}function zm(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.z!==e.z?e.z-t.z:t.id-e.id}function Bm(){const t=[];let e=0;const n=[],i=[],r=[];function s(){e=0,n.length=0,i.length=0,r.length=0}function a(d,f,p,_,v,m){let h=t[e];return h===void 0?(h={id:d.id,object:d,geometry:f,material:p,groupOrder:_,renderOrder:d.renderOrder,z:v,group:m},t[e]=h):(h.id=d.id,h.object=d,h.geometry=f,h.material=p,h.groupOrder=_,h.renderOrder=d.renderOrder,h.z=v,h.group=m),e++,h}function o(d,f,p,_,v,m){const h=a(d,f,p,_,v,m);p.transmission>0?i.push(h):p.transparent===!0?r.push(h):n.push(h)}function l(d,f,p,_,v,m){const h=a(d,f,p,_,v,m);p.transmission>0?i.unshift(h):p.transparent===!0?r.unshift(h):n.unshift(h)}function c(d,f){n.length>1&&n.sort(d||QT),i.length>1&&i.sort(f||zm),r.length>1&&r.sort(f||zm)}function u(){for(let d=e,f=t.length;d<f;d++){const p=t[d];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:n,transmissive:i,transparent:r,init:s,push:o,unshift:l,finish:u,sort:c}}function eA(){let t=new WeakMap;function e(i,r){const s=t.get(i);let a;return s===void 0?(a=new Bm,t.set(i,[a])):r>=s.length?(a=new Bm,s.push(a)):a=s[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}function tA(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={direction:new N,color:new Ce};break;case"SpotLight":n={position:new N,direction:new N,color:new Ce,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":n={position:new N,color:new Ce,distance:0,decay:0};break;case"HemisphereLight":n={direction:new N,skyColor:new Ce,groundColor:new Ce};break;case"RectAreaLight":n={color:new Ce,position:new N,halfWidth:new N,halfHeight:new N};break}return t[e.id]=n,n}}}function nA(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Oe};break;case"SpotLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Oe};break;case"PointLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Oe,shadowCameraNear:1,shadowCameraFar:1e3};break}return t[e.id]=n,n}}}let iA=0;function rA(t,e){return(e.castShadow?2:0)-(t.castShadow?2:0)+(e.map?1:0)-(t.map?1:0)}function sA(t){const e=new tA,n=nA(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new N);const r=new N,s=new ut,a=new ut;function o(c){let u=0,d=0,f=0;for(let z=0;z<9;z++)i.probe[z].set(0,0,0);let p=0,_=0,v=0,m=0,h=0,x=0,S=0,M=0,P=0,C=0,A=0;c.sort(rA);for(let z=0,y=c.length;z<y;z++){const E=c[z],U=E.color,F=E.intensity,X=E.distance,K=E.shadow&&E.shadow.map?E.shadow.map.texture:null;if(E.isAmbientLight)u+=U.r*F,d+=U.g*F,f+=U.b*F;else if(E.isLightProbe){for(let V=0;V<9;V++)i.probe[V].addScaledVector(E.sh.coefficients[V],F);A++}else if(E.isDirectionalLight){const V=e.get(E);if(V.color.copy(E.color).multiplyScalar(E.intensity),E.castShadow){const ie=E.shadow,D=n.get(E);D.shadowIntensity=ie.intensity,D.shadowBias=ie.bias,D.shadowNormalBias=ie.normalBias,D.shadowRadius=ie.radius,D.shadowMapSize=ie.mapSize,i.directionalShadow[p]=D,i.directionalShadowMap[p]=K,i.directionalShadowMatrix[p]=E.shadow.matrix,x++}i.directional[p]=V,p++}else if(E.isSpotLight){const V=e.get(E);V.position.setFromMatrixPosition(E.matrixWorld),V.color.copy(U).multiplyScalar(F),V.distance=X,V.coneCos=Math.cos(E.angle),V.penumbraCos=Math.cos(E.angle*(1-E.penumbra)),V.decay=E.decay,i.spot[v]=V;const ie=E.shadow;if(E.map&&(i.spotLightMap[P]=E.map,P++,ie.updateMatrices(E),E.castShadow&&C++),i.spotLightMatrix[v]=ie.matrix,E.castShadow){const D=n.get(E);D.shadowIntensity=ie.intensity,D.shadowBias=ie.bias,D.shadowNormalBias=ie.normalBias,D.shadowRadius=ie.radius,D.shadowMapSize=ie.mapSize,i.spotShadow[v]=D,i.spotShadowMap[v]=K,M++}v++}else if(E.isRectAreaLight){const V=e.get(E);V.color.copy(U).multiplyScalar(F),V.halfWidth.set(E.width*.5,0,0),V.halfHeight.set(0,E.height*.5,0),i.rectArea[m]=V,m++}else if(E.isPointLight){const V=e.get(E);if(V.color.copy(E.color).multiplyScalar(E.intensity),V.distance=E.distance,V.decay=E.decay,E.castShadow){const ie=E.shadow,D=n.get(E);D.shadowIntensity=ie.intensity,D.shadowBias=ie.bias,D.shadowNormalBias=ie.normalBias,D.shadowRadius=ie.radius,D.shadowMapSize=ie.mapSize,D.shadowCameraNear=ie.camera.near,D.shadowCameraFar=ie.camera.far,i.pointShadow[_]=D,i.pointShadowMap[_]=K,i.pointShadowMatrix[_]=E.shadow.matrix,S++}i.point[_]=V,_++}else if(E.isHemisphereLight){const V=e.get(E);V.skyColor.copy(E.color).multiplyScalar(F),V.groundColor.copy(E.groundColor).multiplyScalar(F),i.hemi[h]=V,h++}}m>0&&(t.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=he.LTC_FLOAT_1,i.rectAreaLTC2=he.LTC_FLOAT_2):(i.rectAreaLTC1=he.LTC_HALF_1,i.rectAreaLTC2=he.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=d,i.ambient[2]=f;const b=i.hash;(b.directionalLength!==p||b.pointLength!==_||b.spotLength!==v||b.rectAreaLength!==m||b.hemiLength!==h||b.numDirectionalShadows!==x||b.numPointShadows!==S||b.numSpotShadows!==M||b.numSpotMaps!==P||b.numLightProbes!==A)&&(i.directional.length=p,i.spot.length=v,i.rectArea.length=m,i.point.length=_,i.hemi.length=h,i.directionalShadow.length=x,i.directionalShadowMap.length=x,i.pointShadow.length=S,i.pointShadowMap.length=S,i.spotShadow.length=M,i.spotShadowMap.length=M,i.directionalShadowMatrix.length=x,i.pointShadowMatrix.length=S,i.spotLightMatrix.length=M+P-C,i.spotLightMap.length=P,i.numSpotLightShadowsWithMaps=C,i.numLightProbes=A,b.directionalLength=p,b.pointLength=_,b.spotLength=v,b.rectAreaLength=m,b.hemiLength=h,b.numDirectionalShadows=x,b.numPointShadows=S,b.numSpotShadows=M,b.numSpotMaps=P,b.numLightProbes=A,i.version=iA++)}function l(c,u){let d=0,f=0,p=0,_=0,v=0;const m=u.matrixWorldInverse;for(let h=0,x=c.length;h<x;h++){const S=c[h];if(S.isDirectionalLight){const M=i.directional[d];M.direction.setFromMatrixPosition(S.matrixWorld),r.setFromMatrixPosition(S.target.matrixWorld),M.direction.sub(r),M.direction.transformDirection(m),d++}else if(S.isSpotLight){const M=i.spot[p];M.position.setFromMatrixPosition(S.matrixWorld),M.position.applyMatrix4(m),M.direction.setFromMatrixPosition(S.matrixWorld),r.setFromMatrixPosition(S.target.matrixWorld),M.direction.sub(r),M.direction.transformDirection(m),p++}else if(S.isRectAreaLight){const M=i.rectArea[_];M.position.setFromMatrixPosition(S.matrixWorld),M.position.applyMatrix4(m),a.identity(),s.copy(S.matrixWorld),s.premultiply(m),a.extractRotation(s),M.halfWidth.set(S.width*.5,0,0),M.halfHeight.set(0,S.height*.5,0),M.halfWidth.applyMatrix4(a),M.halfHeight.applyMatrix4(a),_++}else if(S.isPointLight){const M=i.point[f];M.position.setFromMatrixPosition(S.matrixWorld),M.position.applyMatrix4(m),f++}else if(S.isHemisphereLight){const M=i.hemi[v];M.direction.setFromMatrixPosition(S.matrixWorld),M.direction.transformDirection(m),v++}}}return{setup:o,setupView:l,state:i}}function Hm(t){const e=new sA(t),n=[],i=[];function r(u){c.camera=u,n.length=0,i.length=0}function s(u){n.push(u)}function a(u){i.push(u)}function o(){e.setup(n)}function l(u){e.setupView(n,u)}const c={lightsArray:n,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:c,setupLights:o,setupLightsView:l,pushLight:s,pushShadow:a}}function aA(t){let e=new WeakMap;function n(r,s=0){const a=e.get(r);let o;return a===void 0?(o=new Hm(t),e.set(r,[o])):s>=a.length?(o=new Hm(t),a.push(o)):o=a[s],o}function i(){e=new WeakMap}return{get:n,dispose:i}}class oA extends vr{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=HS,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class lA extends vr{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const cA=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,uA=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function dA(t,e,n){let i=new bf;const r=new Oe,s=new Oe,a=new ct,o=new oA({depthPacking:GS}),l=new lA,c={},u=n.maxTextureSize,d={[fr]:Yt,[Yt]:fr,[yt]:yt},f=new jn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Oe},radius:{value:4}},vertexShader:cA,fragmentShader:uA}),p=f.clone();p.defines.HORIZONTAL_PASS=1;const _=new lt;_.setAttribute("position",new Sn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new Ne(_,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=P0;let h=this.type;this.render=function(C,A,b){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||C.length===0)return;const z=t.getRenderTarget(),y=t.getActiveCubeFace(),E=t.getActiveMipmapLevel(),U=t.state;U.setBlending(cr),U.buffers.color.setClear(1,1,1,1),U.buffers.depth.setTest(!0),U.setScissorTest(!1);const F=h!==xi&&this.type===xi,X=h===xi&&this.type!==xi;for(let K=0,V=C.length;K<V;K++){const ie=C[K],D=ie.shadow;if(D===void 0){console.warn("THREE.WebGLShadowMap:",ie,"has no shadow.");continue}if(D.autoUpdate===!1&&D.needsUpdate===!1)continue;r.copy(D.mapSize);const ee=D.getFrameExtents();if(r.multiply(ee),s.copy(D.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/ee.x),r.x=s.x*ee.x,D.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/ee.y),r.y=s.y*ee.y,D.mapSize.y=s.y)),D.map===null||F===!0||X===!0){const ce=this.type!==xi?{minFilter:Bn,magFilter:Bn}:{};D.map!==null&&D.map.dispose(),D.map=new Vr(r.x,r.y,ce),D.map.texture.name=ie.name+".shadowMap",D.camera.updateProjectionMatrix()}t.setRenderTarget(D.map),t.clear();const ne=D.getViewportCount();for(let ce=0;ce<ne;ce++){const Te=D.getViewport(ce);a.set(s.x*Te.x,s.y*Te.y,s.x*Te.z,s.y*Te.w),U.viewport(a),D.updateMatrices(ie,ce),i=D.getFrustum(),M(A,b,D.camera,ie,this.type)}D.isPointLightShadow!==!0&&this.type===xi&&x(D,b),D.needsUpdate=!1}h=this.type,m.needsUpdate=!1,t.setRenderTarget(z,y,E)};function x(C,A){const b=e.update(v);f.defines.VSM_SAMPLES!==C.blurSamples&&(f.defines.VSM_SAMPLES=C.blurSamples,p.defines.VSM_SAMPLES=C.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),C.mapPass===null&&(C.mapPass=new Vr(r.x,r.y)),f.uniforms.shadow_pass.value=C.map.texture,f.uniforms.resolution.value=C.mapSize,f.uniforms.radius.value=C.radius,t.setRenderTarget(C.mapPass),t.clear(),t.renderBufferDirect(A,null,b,f,v,null),p.uniforms.shadow_pass.value=C.mapPass.texture,p.uniforms.resolution.value=C.mapSize,p.uniforms.radius.value=C.radius,t.setRenderTarget(C.map),t.clear(),t.renderBufferDirect(A,null,b,p,v,null)}function S(C,A,b,z){let y=null;const E=b.isPointLight===!0?C.customDistanceMaterial:C.customDepthMaterial;if(E!==void 0)y=E;else if(y=b.isPointLight===!0?l:o,t.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){const U=y.uuid,F=A.uuid;let X=c[U];X===void 0&&(X={},c[U]=X);let K=X[F];K===void 0&&(K=y.clone(),X[F]=K,A.addEventListener("dispose",P)),y=K}if(y.visible=A.visible,y.wireframe=A.wireframe,z===xi?y.side=A.shadowSide!==null?A.shadowSide:A.side:y.side=A.shadowSide!==null?A.shadowSide:d[A.side],y.alphaMap=A.alphaMap,y.alphaTest=A.alphaTest,y.map=A.map,y.clipShadows=A.clipShadows,y.clippingPlanes=A.clippingPlanes,y.clipIntersection=A.clipIntersection,y.displacementMap=A.displacementMap,y.displacementScale=A.displacementScale,y.displacementBias=A.displacementBias,y.wireframeLinewidth=A.wireframeLinewidth,y.linewidth=A.linewidth,b.isPointLight===!0&&y.isMeshDistanceMaterial===!0){const U=t.properties.get(y);U.light=b}return y}function M(C,A,b,z,y){if(C.visible===!1)return;if(C.layers.test(A.layers)&&(C.isMesh||C.isLine||C.isPoints)&&(C.castShadow||C.receiveShadow&&y===xi)&&(!C.frustumCulled||i.intersectsObject(C))){C.modelViewMatrix.multiplyMatrices(b.matrixWorldInverse,C.matrixWorld);const F=e.update(C),X=C.material;if(Array.isArray(X)){const K=F.groups;for(let V=0,ie=K.length;V<ie;V++){const D=K[V],ee=X[D.materialIndex];if(ee&&ee.visible){const ne=S(C,ee,z,y);C.onBeforeShadow(t,C,A,b,F,ne,D),t.renderBufferDirect(b,null,F,ne,C,D),C.onAfterShadow(t,C,A,b,F,ne,D)}}}else if(X.visible){const K=S(C,X,z,y);C.onBeforeShadow(t,C,A,b,F,K,null),t.renderBufferDirect(b,null,F,K,C,null),C.onAfterShadow(t,C,A,b,F,K,null)}}const U=C.children;for(let F=0,X=U.length;F<X;F++)M(U[F],A,b,z,y)}function P(C){C.target.removeEventListener("dispose",P);for(const b in c){const z=c[b],y=C.target.uuid;y in z&&(z[y].dispose(),delete z[y])}}}const hA={[Ud]:kd,[Fd]:Bd,[Od]:Hd,[Vs]:zd,[kd]:Ud,[Bd]:Fd,[Hd]:Od,[zd]:Vs};function fA(t){function e(){let I=!1;const pe=new ct;let B=null;const q=new ct(0,0,0,0);return{setMask:function(me){B!==me&&!I&&(t.colorMask(me,me,me,me),B=me)},setLocked:function(me){I=me},setClear:function(me,ge,Be,rt,Tt){Tt===!0&&(me*=rt,ge*=rt,Be*=rt),pe.set(me,ge,Be,rt),q.equals(pe)===!1&&(t.clearColor(me,ge,Be,rt),q.copy(pe))},reset:function(){I=!1,B=null,q.set(-1,0,0,0)}}}function n(){let I=!1,pe=!1,B=null,q=null,me=null;return{setReversed:function(ge){pe=ge},setTest:function(ge){ge?Y(t.DEPTH_TEST):de(t.DEPTH_TEST)},setMask:function(ge){B!==ge&&!I&&(t.depthMask(ge),B=ge)},setFunc:function(ge){if(pe&&(ge=hA[ge]),q!==ge){switch(ge){case Ud:t.depthFunc(t.NEVER);break;case kd:t.depthFunc(t.ALWAYS);break;case Fd:t.depthFunc(t.LESS);break;case Vs:t.depthFunc(t.LEQUAL);break;case Od:t.depthFunc(t.EQUAL);break;case zd:t.depthFunc(t.GEQUAL);break;case Bd:t.depthFunc(t.GREATER);break;case Hd:t.depthFunc(t.NOTEQUAL);break;default:t.depthFunc(t.LEQUAL)}q=ge}},setLocked:function(ge){I=ge},setClear:function(ge){me!==ge&&(t.clearDepth(ge),me=ge)},reset:function(){I=!1,B=null,q=null,me=null}}}function i(){let I=!1,pe=null,B=null,q=null,me=null,ge=null,Be=null,rt=null,Tt=null;return{setTest:function(je){I||(je?Y(t.STENCIL_TEST):de(t.STENCIL_TEST))},setMask:function(je){pe!==je&&!I&&(t.stencilMask(je),pe=je)},setFunc:function(je,dt,zt){(B!==je||q!==dt||me!==zt)&&(t.stencilFunc(je,dt,zt),B=je,q=dt,me=zt)},setOp:function(je,dt,zt){(ge!==je||Be!==dt||rt!==zt)&&(t.stencilOp(je,dt,zt),ge=je,Be=dt,rt=zt)},setLocked:function(je){I=je},setClear:function(je){Tt!==je&&(t.clearStencil(je),Tt=je)},reset:function(){I=!1,pe=null,B=null,q=null,me=null,ge=null,Be=null,rt=null,Tt=null}}}const r=new e,s=new n,a=new i,o=new WeakMap,l=new WeakMap;let c={},u={},d=new WeakMap,f=[],p=null,_=!1,v=null,m=null,h=null,x=null,S=null,M=null,P=null,C=new Ce(0,0,0),A=0,b=!1,z=null,y=null,E=null,U=null,F=null;const X=t.getParameter(t.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let K=!1,V=0;const ie=t.getParameter(t.VERSION);ie.indexOf("WebGL")!==-1?(V=parseFloat(/^WebGL (\d)/.exec(ie)[1]),K=V>=1):ie.indexOf("OpenGL ES")!==-1&&(V=parseFloat(/^OpenGL ES (\d)/.exec(ie)[1]),K=V>=2);let D=null,ee={};const ne=t.getParameter(t.SCISSOR_BOX),ce=t.getParameter(t.VIEWPORT),Te=new ct().fromArray(ne),ze=new ct().fromArray(ce);function W(I,pe,B,q){const me=new Uint8Array(4),ge=t.createTexture();t.bindTexture(I,ge),t.texParameteri(I,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(I,t.TEXTURE_MAG_FILTER,t.NEAREST);for(let Be=0;Be<B;Be++)I===t.TEXTURE_3D||I===t.TEXTURE_2D_ARRAY?t.texImage3D(pe,0,t.RGBA,1,1,q,0,t.RGBA,t.UNSIGNED_BYTE,me):t.texImage2D(pe+Be,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,me);return ge}const se={};se[t.TEXTURE_2D]=W(t.TEXTURE_2D,t.TEXTURE_2D,1),se[t.TEXTURE_CUBE_MAP]=W(t.TEXTURE_CUBE_MAP,t.TEXTURE_CUBE_MAP_POSITIVE_X,6),se[t.TEXTURE_2D_ARRAY]=W(t.TEXTURE_2D_ARRAY,t.TEXTURE_2D_ARRAY,1,1),se[t.TEXTURE_3D]=W(t.TEXTURE_3D,t.TEXTURE_3D,1,1),r.setClear(0,0,0,1),s.setClear(1),a.setClear(0),Y(t.DEPTH_TEST),s.setFunc(Vs),We(!1),Ze(Kp),Y(t.CULL_FACE),L(cr);function Y(I){c[I]!==!0&&(t.enable(I),c[I]=!0)}function de(I){c[I]!==!1&&(t.disable(I),c[I]=!1)}function Ie(I,pe){return u[I]!==pe?(t.bindFramebuffer(I,pe),u[I]=pe,I===t.DRAW_FRAMEBUFFER&&(u[t.FRAMEBUFFER]=pe),I===t.FRAMEBUFFER&&(u[t.DRAW_FRAMEBUFFER]=pe),!0):!1}function De(I,pe){let B=f,q=!1;if(I){B=d.get(pe),B===void 0&&(B=[],d.set(pe,B));const me=I.textures;if(B.length!==me.length||B[0]!==t.COLOR_ATTACHMENT0){for(let ge=0,Be=me.length;ge<Be;ge++)B[ge]=t.COLOR_ATTACHMENT0+ge;B.length=me.length,q=!0}}else B[0]!==t.BACK&&(B[0]=t.BACK,q=!0);q&&t.drawBuffers(B)}function Ye(I){return p!==I?(t.useProgram(I),p=I,!0):!1}const Qe={[Pr]:t.FUNC_ADD,[pS]:t.FUNC_SUBTRACT,[mS]:t.FUNC_REVERSE_SUBTRACT};Qe[gS]=t.MIN,Qe[_S]=t.MAX;const Ve={[vS]:t.ZERO,[xS]:t.ONE,[yS]:t.SRC_COLOR,[Dd]:t.SRC_ALPHA,[AS]:t.SRC_ALPHA_SATURATE,[wS]:t.DST_COLOR,[MS]:t.DST_ALPHA,[SS]:t.ONE_MINUS_SRC_COLOR,[Id]:t.ONE_MINUS_SRC_ALPHA,[TS]:t.ONE_MINUS_DST_COLOR,[ES]:t.ONE_MINUS_DST_ALPHA,[bS]:t.CONSTANT_COLOR,[CS]:t.ONE_MINUS_CONSTANT_COLOR,[RS]:t.CONSTANT_ALPHA,[PS]:t.ONE_MINUS_CONSTANT_ALPHA};function L(I,pe,B,q,me,ge,Be,rt,Tt,je){if(I===cr){_===!0&&(de(t.BLEND),_=!1);return}if(_===!1&&(Y(t.BLEND),_=!0),I!==fS){if(I!==v||je!==b){if((m!==Pr||S!==Pr)&&(t.blendEquation(t.FUNC_ADD),m=Pr,S=Pr),je)switch(I){case Ds:t.blendFuncSeparate(t.ONE,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case eo:t.blendFunc(t.ONE,t.ONE);break;case Zp:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case Jp:t.blendFuncSeparate(t.ZERO,t.SRC_COLOR,t.ZERO,t.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}else switch(I){case Ds:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case eo:t.blendFunc(t.SRC_ALPHA,t.ONE);break;case Zp:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case Jp:t.blendFunc(t.ZERO,t.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}h=null,x=null,M=null,P=null,C.set(0,0,0),A=0,v=I,b=je}return}me=me||pe,ge=ge||B,Be=Be||q,(pe!==m||me!==S)&&(t.blendEquationSeparate(Qe[pe],Qe[me]),m=pe,S=me),(B!==h||q!==x||ge!==M||Be!==P)&&(t.blendFuncSeparate(Ve[B],Ve[q],Ve[ge],Ve[Be]),h=B,x=q,M=ge,P=Be),(rt.equals(C)===!1||Tt!==A)&&(t.blendColor(rt.r,rt.g,rt.b,Tt),C.copy(rt),A=Tt),v=I,b=!1}function Re(I,pe){I.side===yt?de(t.CULL_FACE):Y(t.CULL_FACE);let B=I.side===Yt;pe&&(B=!B),We(B),I.blending===Ds&&I.transparent===!1?L(cr):L(I.blending,I.blendEquation,I.blendSrc,I.blendDst,I.blendEquationAlpha,I.blendSrcAlpha,I.blendDstAlpha,I.blendColor,I.blendAlpha,I.premultipliedAlpha),s.setFunc(I.depthFunc),s.setTest(I.depthTest),s.setMask(I.depthWrite),r.setMask(I.colorWrite);const q=I.stencilWrite;a.setTest(q),q&&(a.setMask(I.stencilWriteMask),a.setFunc(I.stencilFunc,I.stencilRef,I.stencilFuncMask),a.setOp(I.stencilFail,I.stencilZFail,I.stencilZPass)),et(I.polygonOffset,I.polygonOffsetFactor,I.polygonOffsetUnits),I.alphaToCoverage===!0?Y(t.SAMPLE_ALPHA_TO_COVERAGE):de(t.SAMPLE_ALPHA_TO_COVERAGE)}function We(I){z!==I&&(I?t.frontFace(t.CW):t.frontFace(t.CCW),z=I)}function Ze(I){I!==dS?(Y(t.CULL_FACE),I!==y&&(I===Kp?t.cullFace(t.BACK):I===hS?t.cullFace(t.FRONT):t.cullFace(t.FRONT_AND_BACK))):de(t.CULL_FACE),y=I}function Le(I){I!==E&&(K&&t.lineWidth(I),E=I)}function et(I,pe,B){I?(Y(t.POLYGON_OFFSET_FILL),(U!==pe||F!==B)&&(t.polygonOffset(pe,B),U=pe,F=B)):de(t.POLYGON_OFFSET_FILL)}function Ue(I){I?Y(t.SCISSOR_TEST):de(t.SCISSOR_TEST)}function R(I){I===void 0&&(I=t.TEXTURE0+X-1),D!==I&&(t.activeTexture(I),D=I)}function w(I,pe,B){B===void 0&&(D===null?B=t.TEXTURE0+X-1:B=D);let q=ee[B];q===void 0&&(q={type:void 0,texture:void 0},ee[B]=q),(q.type!==I||q.texture!==pe)&&(D!==B&&(t.activeTexture(B),D=B),t.bindTexture(I,pe||se[I]),q.type=I,q.texture=pe)}function H(){const I=ee[D];I!==void 0&&I.type!==void 0&&(t.bindTexture(I.type,null),I.type=void 0,I.texture=void 0)}function J(){try{t.compressedTexImage2D.apply(t,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ae(){try{t.compressedTexImage3D.apply(t,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Z(){try{t.texSubImage2D.apply(t,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Me(){try{t.texSubImage3D.apply(t,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function fe(){try{t.compressedTexSubImage2D.apply(t,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ve(){try{t.compressedTexSubImage3D.apply(t,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function qe(){try{t.texStorage2D.apply(t,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function le(){try{t.texStorage3D.apply(t,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function $(){try{t.texImage2D.apply(t,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Q(){try{t.texImage3D.apply(t,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function te(I){Te.equals(I)===!1&&(t.scissor(I.x,I.y,I.z,I.w),Te.copy(I))}function re(I){ze.equals(I)===!1&&(t.viewport(I.x,I.y,I.z,I.w),ze.copy(I))}function Pe(I,pe){let B=l.get(pe);B===void 0&&(B=new WeakMap,l.set(pe,B));let q=B.get(I);q===void 0&&(q=t.getUniformBlockIndex(pe,I.name),B.set(I,q))}function we(I,pe){const q=l.get(pe).get(I);o.get(pe)!==q&&(t.uniformBlockBinding(pe,q,I.__bindingPointIndex),o.set(pe,q))}function Xe(){t.disable(t.BLEND),t.disable(t.CULL_FACE),t.disable(t.DEPTH_TEST),t.disable(t.POLYGON_OFFSET_FILL),t.disable(t.SCISSOR_TEST),t.disable(t.STENCIL_TEST),t.disable(t.SAMPLE_ALPHA_TO_COVERAGE),t.blendEquation(t.FUNC_ADD),t.blendFunc(t.ONE,t.ZERO),t.blendFuncSeparate(t.ONE,t.ZERO,t.ONE,t.ZERO),t.blendColor(0,0,0,0),t.colorMask(!0,!0,!0,!0),t.clearColor(0,0,0,0),t.depthMask(!0),t.depthFunc(t.LESS),t.clearDepth(1),t.stencilMask(4294967295),t.stencilFunc(t.ALWAYS,0,4294967295),t.stencilOp(t.KEEP,t.KEEP,t.KEEP),t.clearStencil(0),t.cullFace(t.BACK),t.frontFace(t.CCW),t.polygonOffset(0,0),t.activeTexture(t.TEXTURE0),t.bindFramebuffer(t.FRAMEBUFFER,null),t.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),t.bindFramebuffer(t.READ_FRAMEBUFFER,null),t.useProgram(null),t.lineWidth(1),t.scissor(0,0,t.canvas.width,t.canvas.height),t.viewport(0,0,t.canvas.width,t.canvas.height),c={},D=null,ee={},u={},d=new WeakMap,f=[],p=null,_=!1,v=null,m=null,h=null,x=null,S=null,M=null,P=null,C=new Ce(0,0,0),A=0,b=!1,z=null,y=null,E=null,U=null,F=null,Te.set(0,0,t.canvas.width,t.canvas.height),ze.set(0,0,t.canvas.width,t.canvas.height),r.reset(),s.reset(),a.reset()}return{buffers:{color:r,depth:s,stencil:a},enable:Y,disable:de,bindFramebuffer:Ie,drawBuffers:De,useProgram:Ye,setBlending:L,setMaterial:Re,setFlipSided:We,setCullFace:Ze,setLineWidth:Le,setPolygonOffset:et,setScissorTest:Ue,activeTexture:R,bindTexture:w,unbindTexture:H,compressedTexImage2D:J,compressedTexImage3D:ae,texImage2D:$,texImage3D:Q,updateUBOMapping:Pe,uniformBlockBinding:we,texStorage2D:qe,texStorage3D:le,texSubImage2D:Z,texSubImage3D:Me,compressedTexSubImage2D:fe,compressedTexSubImage3D:ve,scissor:te,viewport:re,reset:Xe}}function Gm(t,e,n,i){const r=pA(i);switch(n){case F0:return t*e;case z0:return t*e;case B0:return t*e*2;case H0:return t*e/r.components*r.byteLength;case Sf:return t*e/r.components*r.byteLength;case G0:return t*e*2/r.components*r.byteLength;case Mf:return t*e*2/r.components*r.byteLength;case O0:return t*e*3/r.components*r.byteLength;case ni:return t*e*4/r.components*r.byteLength;case Ef:return t*e*4/r.components*r.byteLength;case Ml:case El:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case wl:case Tl:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case $d:case qd:return Math.max(t,16)*Math.max(e,8)/4;case Xd:case Yd:return Math.max(t,8)*Math.max(e,8)/2;case Kd:case Zd:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case Jd:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case Qd:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case eh:return Math.floor((t+4)/5)*Math.floor((e+3)/4)*16;case th:return Math.floor((t+4)/5)*Math.floor((e+4)/5)*16;case nh:return Math.floor((t+5)/6)*Math.floor((e+4)/5)*16;case ih:return Math.floor((t+5)/6)*Math.floor((e+5)/6)*16;case rh:return Math.floor((t+7)/8)*Math.floor((e+4)/5)*16;case sh:return Math.floor((t+7)/8)*Math.floor((e+5)/6)*16;case ah:return Math.floor((t+7)/8)*Math.floor((e+7)/8)*16;case oh:return Math.floor((t+9)/10)*Math.floor((e+4)/5)*16;case lh:return Math.floor((t+9)/10)*Math.floor((e+5)/6)*16;case ch:return Math.floor((t+9)/10)*Math.floor((e+7)/8)*16;case uh:return Math.floor((t+9)/10)*Math.floor((e+9)/10)*16;case dh:return Math.floor((t+11)/12)*Math.floor((e+9)/10)*16;case hh:return Math.floor((t+11)/12)*Math.floor((e+11)/12)*16;case Al:case fh:case ph:return Math.ceil(t/4)*Math.ceil(e/4)*16;case V0:case mh:return Math.ceil(t/4)*Math.ceil(e/4)*8;case gh:case _h:return Math.ceil(t/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${n} format.`)}function pA(t){switch(t){case Di:case I0:return{byteLength:1,components:1};case to:case U0:case co:return{byteLength:2,components:1};case xf:case yf:return{byteLength:2,components:4};case Gr:case vf:case Ti:return{byteLength:4,components:1};case k0:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${t}.`)}function mA(t,e,n,i,r,s,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Oe,u=new WeakMap;let d;const f=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(R,w){return p?new OffscreenCanvas(R,w):io("canvas")}function v(R,w,H){let J=1;const ae=Ue(R);if((ae.width>H||ae.height>H)&&(J=H/Math.max(ae.width,ae.height)),J<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){const Z=Math.floor(J*ae.width),Me=Math.floor(J*ae.height);d===void 0&&(d=_(Z,Me));const fe=w?_(Z,Me):d;return fe.width=Z,fe.height=Me,fe.getContext("2d").drawImage(R,0,0,Z,Me),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ae.width+"x"+ae.height+") to ("+Z+"x"+Me+")."),fe}else return"data"in R&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ae.width+"x"+ae.height+")."),R;return R}function m(R){return R.generateMipmaps&&R.minFilter!==Bn&&R.minFilter!==ei}function h(R){t.generateMipmap(R)}function x(R,w,H,J,ae=!1){if(R!==null){if(t[R]!==void 0)return t[R];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let Z=w;if(w===t.RED&&(H===t.FLOAT&&(Z=t.R32F),H===t.HALF_FLOAT&&(Z=t.R16F),H===t.UNSIGNED_BYTE&&(Z=t.R8)),w===t.RED_INTEGER&&(H===t.UNSIGNED_BYTE&&(Z=t.R8UI),H===t.UNSIGNED_SHORT&&(Z=t.R16UI),H===t.UNSIGNED_INT&&(Z=t.R32UI),H===t.BYTE&&(Z=t.R8I),H===t.SHORT&&(Z=t.R16I),H===t.INT&&(Z=t.R32I)),w===t.RG&&(H===t.FLOAT&&(Z=t.RG32F),H===t.HALF_FLOAT&&(Z=t.RG16F),H===t.UNSIGNED_BYTE&&(Z=t.RG8)),w===t.RG_INTEGER&&(H===t.UNSIGNED_BYTE&&(Z=t.RG8UI),H===t.UNSIGNED_SHORT&&(Z=t.RG16UI),H===t.UNSIGNED_INT&&(Z=t.RG32UI),H===t.BYTE&&(Z=t.RG8I),H===t.SHORT&&(Z=t.RG16I),H===t.INT&&(Z=t.RG32I)),w===t.RGB_INTEGER&&(H===t.UNSIGNED_BYTE&&(Z=t.RGB8UI),H===t.UNSIGNED_SHORT&&(Z=t.RGB16UI),H===t.UNSIGNED_INT&&(Z=t.RGB32UI),H===t.BYTE&&(Z=t.RGB8I),H===t.SHORT&&(Z=t.RGB16I),H===t.INT&&(Z=t.RGB32I)),w===t.RGBA_INTEGER&&(H===t.UNSIGNED_BYTE&&(Z=t.RGBA8UI),H===t.UNSIGNED_SHORT&&(Z=t.RGBA16UI),H===t.UNSIGNED_INT&&(Z=t.RGBA32UI),H===t.BYTE&&(Z=t.RGBA8I),H===t.SHORT&&(Z=t.RGBA16I),H===t.INT&&(Z=t.RGBA32I)),w===t.RGB&&H===t.UNSIGNED_INT_5_9_9_9_REV&&(Z=t.RGB9_E5),w===t.RGBA){const Me=ae?Ql:it.getTransfer(J);H===t.FLOAT&&(Z=t.RGBA32F),H===t.HALF_FLOAT&&(Z=t.RGBA16F),H===t.UNSIGNED_BYTE&&(Z=Me===_t?t.SRGB8_ALPHA8:t.RGBA8),H===t.UNSIGNED_SHORT_4_4_4_4&&(Z=t.RGBA4),H===t.UNSIGNED_SHORT_5_5_5_1&&(Z=t.RGB5_A1)}return(Z===t.R16F||Z===t.R32F||Z===t.RG16F||Z===t.RG32F||Z===t.RGBA16F||Z===t.RGBA32F)&&e.get("EXT_color_buffer_float"),Z}function S(R,w){let H;return R?w===null||w===Gr||w===Xs?H=t.DEPTH24_STENCIL8:w===Ti?H=t.DEPTH32F_STENCIL8:w===to&&(H=t.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):w===null||w===Gr||w===Xs?H=t.DEPTH_COMPONENT24:w===Ti?H=t.DEPTH_COMPONENT32F:w===to&&(H=t.DEPTH_COMPONENT16),H}function M(R,w){return m(R)===!0||R.isFramebufferTexture&&R.minFilter!==Bn&&R.minFilter!==ei?Math.log2(Math.max(w.width,w.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?w.mipmaps.length:1}function P(R){const w=R.target;w.removeEventListener("dispose",P),A(w),w.isVideoTexture&&u.delete(w)}function C(R){const w=R.target;w.removeEventListener("dispose",C),z(w)}function A(R){const w=i.get(R);if(w.__webglInit===void 0)return;const H=R.source,J=f.get(H);if(J){const ae=J[w.__cacheKey];ae.usedTimes--,ae.usedTimes===0&&b(R),Object.keys(J).length===0&&f.delete(H)}i.remove(R)}function b(R){const w=i.get(R);t.deleteTexture(w.__webglTexture);const H=R.source,J=f.get(H);delete J[w.__cacheKey],a.memory.textures--}function z(R){const w=i.get(R);if(R.depthTexture&&R.depthTexture.dispose(),R.isWebGLCubeRenderTarget)for(let J=0;J<6;J++){if(Array.isArray(w.__webglFramebuffer[J]))for(let ae=0;ae<w.__webglFramebuffer[J].length;ae++)t.deleteFramebuffer(w.__webglFramebuffer[J][ae]);else t.deleteFramebuffer(w.__webglFramebuffer[J]);w.__webglDepthbuffer&&t.deleteRenderbuffer(w.__webglDepthbuffer[J])}else{if(Array.isArray(w.__webglFramebuffer))for(let J=0;J<w.__webglFramebuffer.length;J++)t.deleteFramebuffer(w.__webglFramebuffer[J]);else t.deleteFramebuffer(w.__webglFramebuffer);if(w.__webglDepthbuffer&&t.deleteRenderbuffer(w.__webglDepthbuffer),w.__webglMultisampledFramebuffer&&t.deleteFramebuffer(w.__webglMultisampledFramebuffer),w.__webglColorRenderbuffer)for(let J=0;J<w.__webglColorRenderbuffer.length;J++)w.__webglColorRenderbuffer[J]&&t.deleteRenderbuffer(w.__webglColorRenderbuffer[J]);w.__webglDepthRenderbuffer&&t.deleteRenderbuffer(w.__webglDepthRenderbuffer)}const H=R.textures;for(let J=0,ae=H.length;J<ae;J++){const Z=i.get(H[J]);Z.__webglTexture&&(t.deleteTexture(Z.__webglTexture),a.memory.textures--),i.remove(H[J])}i.remove(R)}let y=0;function E(){y=0}function U(){const R=y;return R>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+r.maxTextures),y+=1,R}function F(R){const w=[];return w.push(R.wrapS),w.push(R.wrapT),w.push(R.wrapR||0),w.push(R.magFilter),w.push(R.minFilter),w.push(R.anisotropy),w.push(R.internalFormat),w.push(R.format),w.push(R.type),w.push(R.generateMipmaps),w.push(R.premultiplyAlpha),w.push(R.flipY),w.push(R.unpackAlignment),w.push(R.colorSpace),w.join()}function X(R,w){const H=i.get(R);if(R.isVideoTexture&&Le(R),R.isRenderTargetTexture===!1&&R.version>0&&H.__version!==R.version){const J=R.image;if(J===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(J.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{ze(H,R,w);return}}n.bindTexture(t.TEXTURE_2D,H.__webglTexture,t.TEXTURE0+w)}function K(R,w){const H=i.get(R);if(R.version>0&&H.__version!==R.version){ze(H,R,w);return}n.bindTexture(t.TEXTURE_2D_ARRAY,H.__webglTexture,t.TEXTURE0+w)}function V(R,w){const H=i.get(R);if(R.version>0&&H.__version!==R.version){ze(H,R,w);return}n.bindTexture(t.TEXTURE_3D,H.__webglTexture,t.TEXTURE0+w)}function ie(R,w){const H=i.get(R);if(R.version>0&&H.__version!==R.version){W(H,R,w);return}n.bindTexture(t.TEXTURE_CUBE_MAP,H.__webglTexture,t.TEXTURE0+w)}const D={[jd]:t.REPEAT,[Zi]:t.CLAMP_TO_EDGE,[Wd]:t.MIRRORED_REPEAT},ee={[Bn]:t.NEAREST,[BS]:t.NEAREST_MIPMAP_NEAREST,[Io]:t.NEAREST_MIPMAP_LINEAR,[ei]:t.LINEAR,[nu]:t.LINEAR_MIPMAP_NEAREST,[Ji]:t.LINEAR_MIPMAP_LINEAR},ne={[jS]:t.NEVER,[KS]:t.ALWAYS,[WS]:t.LESS,[W0]:t.LEQUAL,[XS]:t.EQUAL,[qS]:t.GEQUAL,[$S]:t.GREATER,[YS]:t.NOTEQUAL};function ce(R,w){if(w.type===Ti&&e.has("OES_texture_float_linear")===!1&&(w.magFilter===ei||w.magFilter===nu||w.magFilter===Io||w.magFilter===Ji||w.minFilter===ei||w.minFilter===nu||w.minFilter===Io||w.minFilter===Ji)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),t.texParameteri(R,t.TEXTURE_WRAP_S,D[w.wrapS]),t.texParameteri(R,t.TEXTURE_WRAP_T,D[w.wrapT]),(R===t.TEXTURE_3D||R===t.TEXTURE_2D_ARRAY)&&t.texParameteri(R,t.TEXTURE_WRAP_R,D[w.wrapR]),t.texParameteri(R,t.TEXTURE_MAG_FILTER,ee[w.magFilter]),t.texParameteri(R,t.TEXTURE_MIN_FILTER,ee[w.minFilter]),w.compareFunction&&(t.texParameteri(R,t.TEXTURE_COMPARE_MODE,t.COMPARE_REF_TO_TEXTURE),t.texParameteri(R,t.TEXTURE_COMPARE_FUNC,ne[w.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(w.magFilter===Bn||w.minFilter!==Io&&w.minFilter!==Ji||w.type===Ti&&e.has("OES_texture_float_linear")===!1)return;if(w.anisotropy>1||i.get(w).__currentAnisotropy){const H=e.get("EXT_texture_filter_anisotropic");t.texParameterf(R,H.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(w.anisotropy,r.getMaxAnisotropy())),i.get(w).__currentAnisotropy=w.anisotropy}}}function Te(R,w){let H=!1;R.__webglInit===void 0&&(R.__webglInit=!0,w.addEventListener("dispose",P));const J=w.source;let ae=f.get(J);ae===void 0&&(ae={},f.set(J,ae));const Z=F(w);if(Z!==R.__cacheKey){ae[Z]===void 0&&(ae[Z]={texture:t.createTexture(),usedTimes:0},a.memory.textures++,H=!0),ae[Z].usedTimes++;const Me=ae[R.__cacheKey];Me!==void 0&&(ae[R.__cacheKey].usedTimes--,Me.usedTimes===0&&b(w)),R.__cacheKey=Z,R.__webglTexture=ae[Z].texture}return H}function ze(R,w,H){let J=t.TEXTURE_2D;(w.isDataArrayTexture||w.isCompressedArrayTexture)&&(J=t.TEXTURE_2D_ARRAY),w.isData3DTexture&&(J=t.TEXTURE_3D);const ae=Te(R,w),Z=w.source;n.bindTexture(J,R.__webglTexture,t.TEXTURE0+H);const Me=i.get(Z);if(Z.version!==Me.__version||ae===!0){n.activeTexture(t.TEXTURE0+H);const fe=it.getPrimaries(it.workingColorSpace),ve=w.colorSpace===$i?null:it.getPrimaries(w.colorSpace),qe=w.colorSpace===$i||fe===ve?t.NONE:t.BROWSER_DEFAULT_WEBGL;t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,w.flipY),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),t.pixelStorei(t.UNPACK_ALIGNMENT,w.unpackAlignment),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,qe);let le=v(w.image,!1,r.maxTextureSize);le=et(w,le);const $=s.convert(w.format,w.colorSpace),Q=s.convert(w.type);let te=x(w.internalFormat,$,Q,w.colorSpace,w.isVideoTexture);ce(J,w);let re;const Pe=w.mipmaps,we=w.isVideoTexture!==!0,Xe=Me.__version===void 0||ae===!0,I=Z.dataReady,pe=M(w,le);if(w.isDepthTexture)te=S(w.format===$s,w.type),Xe&&(we?n.texStorage2D(t.TEXTURE_2D,1,te,le.width,le.height):n.texImage2D(t.TEXTURE_2D,0,te,le.width,le.height,0,$,Q,null));else if(w.isDataTexture)if(Pe.length>0){we&&Xe&&n.texStorage2D(t.TEXTURE_2D,pe,te,Pe[0].width,Pe[0].height);for(let B=0,q=Pe.length;B<q;B++)re=Pe[B],we?I&&n.texSubImage2D(t.TEXTURE_2D,B,0,0,re.width,re.height,$,Q,re.data):n.texImage2D(t.TEXTURE_2D,B,te,re.width,re.height,0,$,Q,re.data);w.generateMipmaps=!1}else we?(Xe&&n.texStorage2D(t.TEXTURE_2D,pe,te,le.width,le.height),I&&n.texSubImage2D(t.TEXTURE_2D,0,0,0,le.width,le.height,$,Q,le.data)):n.texImage2D(t.TEXTURE_2D,0,te,le.width,le.height,0,$,Q,le.data);else if(w.isCompressedTexture)if(w.isCompressedArrayTexture){we&&Xe&&n.texStorage3D(t.TEXTURE_2D_ARRAY,pe,te,Pe[0].width,Pe[0].height,le.depth);for(let B=0,q=Pe.length;B<q;B++)if(re=Pe[B],w.format!==ni)if($!==null)if(we){if(I)if(w.layerUpdates.size>0){const me=Gm(re.width,re.height,w.format,w.type);for(const ge of w.layerUpdates){const Be=re.data.subarray(ge*me/re.data.BYTES_PER_ELEMENT,(ge+1)*me/re.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,B,0,0,ge,re.width,re.height,1,$,Be,0,0)}w.clearLayerUpdates()}else n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,B,0,0,0,re.width,re.height,le.depth,$,re.data,0,0)}else n.compressedTexImage3D(t.TEXTURE_2D_ARRAY,B,te,re.width,re.height,le.depth,0,re.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else we?I&&n.texSubImage3D(t.TEXTURE_2D_ARRAY,B,0,0,0,re.width,re.height,le.depth,$,Q,re.data):n.texImage3D(t.TEXTURE_2D_ARRAY,B,te,re.width,re.height,le.depth,0,$,Q,re.data)}else{we&&Xe&&n.texStorage2D(t.TEXTURE_2D,pe,te,Pe[0].width,Pe[0].height);for(let B=0,q=Pe.length;B<q;B++)re=Pe[B],w.format!==ni?$!==null?we?I&&n.compressedTexSubImage2D(t.TEXTURE_2D,B,0,0,re.width,re.height,$,re.data):n.compressedTexImage2D(t.TEXTURE_2D,B,te,re.width,re.height,0,re.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):we?I&&n.texSubImage2D(t.TEXTURE_2D,B,0,0,re.width,re.height,$,Q,re.data):n.texImage2D(t.TEXTURE_2D,B,te,re.width,re.height,0,$,Q,re.data)}else if(w.isDataArrayTexture)if(we){if(Xe&&n.texStorage3D(t.TEXTURE_2D_ARRAY,pe,te,le.width,le.height,le.depth),I)if(w.layerUpdates.size>0){const B=Gm(le.width,le.height,w.format,w.type);for(const q of w.layerUpdates){const me=le.data.subarray(q*B/le.data.BYTES_PER_ELEMENT,(q+1)*B/le.data.BYTES_PER_ELEMENT);n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,q,le.width,le.height,1,$,Q,me)}w.clearLayerUpdates()}else n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,0,le.width,le.height,le.depth,$,Q,le.data)}else n.texImage3D(t.TEXTURE_2D_ARRAY,0,te,le.width,le.height,le.depth,0,$,Q,le.data);else if(w.isData3DTexture)we?(Xe&&n.texStorage3D(t.TEXTURE_3D,pe,te,le.width,le.height,le.depth),I&&n.texSubImage3D(t.TEXTURE_3D,0,0,0,0,le.width,le.height,le.depth,$,Q,le.data)):n.texImage3D(t.TEXTURE_3D,0,te,le.width,le.height,le.depth,0,$,Q,le.data);else if(w.isFramebufferTexture){if(Xe)if(we)n.texStorage2D(t.TEXTURE_2D,pe,te,le.width,le.height);else{let B=le.width,q=le.height;for(let me=0;me<pe;me++)n.texImage2D(t.TEXTURE_2D,me,te,B,q,0,$,Q,null),B>>=1,q>>=1}}else if(Pe.length>0){if(we&&Xe){const B=Ue(Pe[0]);n.texStorage2D(t.TEXTURE_2D,pe,te,B.width,B.height)}for(let B=0,q=Pe.length;B<q;B++)re=Pe[B],we?I&&n.texSubImage2D(t.TEXTURE_2D,B,0,0,$,Q,re):n.texImage2D(t.TEXTURE_2D,B,te,$,Q,re);w.generateMipmaps=!1}else if(we){if(Xe){const B=Ue(le);n.texStorage2D(t.TEXTURE_2D,pe,te,B.width,B.height)}I&&n.texSubImage2D(t.TEXTURE_2D,0,0,0,$,Q,le)}else n.texImage2D(t.TEXTURE_2D,0,te,$,Q,le);m(w)&&h(J),Me.__version=Z.version,w.onUpdate&&w.onUpdate(w)}R.__version=w.version}function W(R,w,H){if(w.image.length!==6)return;const J=Te(R,w),ae=w.source;n.bindTexture(t.TEXTURE_CUBE_MAP,R.__webglTexture,t.TEXTURE0+H);const Z=i.get(ae);if(ae.version!==Z.__version||J===!0){n.activeTexture(t.TEXTURE0+H);const Me=it.getPrimaries(it.workingColorSpace),fe=w.colorSpace===$i?null:it.getPrimaries(w.colorSpace),ve=w.colorSpace===$i||Me===fe?t.NONE:t.BROWSER_DEFAULT_WEBGL;t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,w.flipY),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),t.pixelStorei(t.UNPACK_ALIGNMENT,w.unpackAlignment),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,ve);const qe=w.isCompressedTexture||w.image[0].isCompressedTexture,le=w.image[0]&&w.image[0].isDataTexture,$=[];for(let q=0;q<6;q++)!qe&&!le?$[q]=v(w.image[q],!0,r.maxCubemapSize):$[q]=le?w.image[q].image:w.image[q],$[q]=et(w,$[q]);const Q=$[0],te=s.convert(w.format,w.colorSpace),re=s.convert(w.type),Pe=x(w.internalFormat,te,re,w.colorSpace),we=w.isVideoTexture!==!0,Xe=Z.__version===void 0||J===!0,I=ae.dataReady;let pe=M(w,Q);ce(t.TEXTURE_CUBE_MAP,w);let B;if(qe){we&&Xe&&n.texStorage2D(t.TEXTURE_CUBE_MAP,pe,Pe,Q.width,Q.height);for(let q=0;q<6;q++){B=$[q].mipmaps;for(let me=0;me<B.length;me++){const ge=B[me];w.format!==ni?te!==null?we?I&&n.compressedTexSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+q,me,0,0,ge.width,ge.height,te,ge.data):n.compressedTexImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+q,me,Pe,ge.width,ge.height,0,ge.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):we?I&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+q,me,0,0,ge.width,ge.height,te,re,ge.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+q,me,Pe,ge.width,ge.height,0,te,re,ge.data)}}}else{if(B=w.mipmaps,we&&Xe){B.length>0&&pe++;const q=Ue($[0]);n.texStorage2D(t.TEXTURE_CUBE_MAP,pe,Pe,q.width,q.height)}for(let q=0;q<6;q++)if(le){we?I&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+q,0,0,0,$[q].width,$[q].height,te,re,$[q].data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+q,0,Pe,$[q].width,$[q].height,0,te,re,$[q].data);for(let me=0;me<B.length;me++){const Be=B[me].image[q].image;we?I&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+q,me+1,0,0,Be.width,Be.height,te,re,Be.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+q,me+1,Pe,Be.width,Be.height,0,te,re,Be.data)}}else{we?I&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+q,0,0,0,te,re,$[q]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+q,0,Pe,te,re,$[q]);for(let me=0;me<B.length;me++){const ge=B[me];we?I&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+q,me+1,0,0,te,re,ge.image[q]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+q,me+1,Pe,te,re,ge.image[q])}}}m(w)&&h(t.TEXTURE_CUBE_MAP),Z.__version=ae.version,w.onUpdate&&w.onUpdate(w)}R.__version=w.version}function se(R,w,H,J,ae,Z){const Me=s.convert(H.format,H.colorSpace),fe=s.convert(H.type),ve=x(H.internalFormat,Me,fe,H.colorSpace);if(!i.get(w).__hasExternalTextures){const le=Math.max(1,w.width>>Z),$=Math.max(1,w.height>>Z);ae===t.TEXTURE_3D||ae===t.TEXTURE_2D_ARRAY?n.texImage3D(ae,Z,ve,le,$,w.depth,0,Me,fe,null):n.texImage2D(ae,Z,ve,le,$,0,Me,fe,null)}n.bindFramebuffer(t.FRAMEBUFFER,R),Ze(w)?o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,J,ae,i.get(H).__webglTexture,0,We(w)):(ae===t.TEXTURE_2D||ae>=t.TEXTURE_CUBE_MAP_POSITIVE_X&&ae<=t.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&t.framebufferTexture2D(t.FRAMEBUFFER,J,ae,i.get(H).__webglTexture,Z),n.bindFramebuffer(t.FRAMEBUFFER,null)}function Y(R,w,H){if(t.bindRenderbuffer(t.RENDERBUFFER,R),w.depthBuffer){const J=w.depthTexture,ae=J&&J.isDepthTexture?J.type:null,Z=S(w.stencilBuffer,ae),Me=w.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,fe=We(w);Ze(w)?o.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,fe,Z,w.width,w.height):H?t.renderbufferStorageMultisample(t.RENDERBUFFER,fe,Z,w.width,w.height):t.renderbufferStorage(t.RENDERBUFFER,Z,w.width,w.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,Me,t.RENDERBUFFER,R)}else{const J=w.textures;for(let ae=0;ae<J.length;ae++){const Z=J[ae],Me=s.convert(Z.format,Z.colorSpace),fe=s.convert(Z.type),ve=x(Z.internalFormat,Me,fe,Z.colorSpace),qe=We(w);H&&Ze(w)===!1?t.renderbufferStorageMultisample(t.RENDERBUFFER,qe,ve,w.width,w.height):Ze(w)?o.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,qe,ve,w.width,w.height):t.renderbufferStorage(t.RENDERBUFFER,ve,w.width,w.height)}}t.bindRenderbuffer(t.RENDERBUFFER,null)}function de(R,w){if(w&&w.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(n.bindFramebuffer(t.FRAMEBUFFER,R),!(w.depthTexture&&w.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!i.get(w.depthTexture).__webglTexture||w.depthTexture.image.width!==w.width||w.depthTexture.image.height!==w.height)&&(w.depthTexture.image.width=w.width,w.depthTexture.image.height=w.height,w.depthTexture.needsUpdate=!0),X(w.depthTexture,0);const J=i.get(w.depthTexture).__webglTexture,ae=We(w);if(w.depthTexture.format===Is)Ze(w)?o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,J,0,ae):t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,J,0);else if(w.depthTexture.format===$s)Ze(w)?o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.TEXTURE_2D,J,0,ae):t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.TEXTURE_2D,J,0);else throw new Error("Unknown depthTexture format")}function Ie(R){const w=i.get(R),H=R.isWebGLCubeRenderTarget===!0;if(w.__boundDepthTexture!==R.depthTexture){const J=R.depthTexture;if(w.__depthDisposeCallback&&w.__depthDisposeCallback(),J){const ae=()=>{delete w.__boundDepthTexture,delete w.__depthDisposeCallback,J.removeEventListener("dispose",ae)};J.addEventListener("dispose",ae),w.__depthDisposeCallback=ae}w.__boundDepthTexture=J}if(R.depthTexture&&!w.__autoAllocateDepthBuffer){if(H)throw new Error("target.depthTexture not supported in Cube render targets");de(w.__webglFramebuffer,R)}else if(H){w.__webglDepthbuffer=[];for(let J=0;J<6;J++)if(n.bindFramebuffer(t.FRAMEBUFFER,w.__webglFramebuffer[J]),w.__webglDepthbuffer[J]===void 0)w.__webglDepthbuffer[J]=t.createRenderbuffer(),Y(w.__webglDepthbuffer[J],R,!1);else{const ae=R.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,Z=w.__webglDepthbuffer[J];t.bindRenderbuffer(t.RENDERBUFFER,Z),t.framebufferRenderbuffer(t.FRAMEBUFFER,ae,t.RENDERBUFFER,Z)}}else if(n.bindFramebuffer(t.FRAMEBUFFER,w.__webglFramebuffer),w.__webglDepthbuffer===void 0)w.__webglDepthbuffer=t.createRenderbuffer(),Y(w.__webglDepthbuffer,R,!1);else{const J=R.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,ae=w.__webglDepthbuffer;t.bindRenderbuffer(t.RENDERBUFFER,ae),t.framebufferRenderbuffer(t.FRAMEBUFFER,J,t.RENDERBUFFER,ae)}n.bindFramebuffer(t.FRAMEBUFFER,null)}function De(R,w,H){const J=i.get(R);w!==void 0&&se(J.__webglFramebuffer,R,R.texture,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,0),H!==void 0&&Ie(R)}function Ye(R){const w=R.texture,H=i.get(R),J=i.get(w);R.addEventListener("dispose",C);const ae=R.textures,Z=R.isWebGLCubeRenderTarget===!0,Me=ae.length>1;if(Me||(J.__webglTexture===void 0&&(J.__webglTexture=t.createTexture()),J.__version=w.version,a.memory.textures++),Z){H.__webglFramebuffer=[];for(let fe=0;fe<6;fe++)if(w.mipmaps&&w.mipmaps.length>0){H.__webglFramebuffer[fe]=[];for(let ve=0;ve<w.mipmaps.length;ve++)H.__webglFramebuffer[fe][ve]=t.createFramebuffer()}else H.__webglFramebuffer[fe]=t.createFramebuffer()}else{if(w.mipmaps&&w.mipmaps.length>0){H.__webglFramebuffer=[];for(let fe=0;fe<w.mipmaps.length;fe++)H.__webglFramebuffer[fe]=t.createFramebuffer()}else H.__webglFramebuffer=t.createFramebuffer();if(Me)for(let fe=0,ve=ae.length;fe<ve;fe++){const qe=i.get(ae[fe]);qe.__webglTexture===void 0&&(qe.__webglTexture=t.createTexture(),a.memory.textures++)}if(R.samples>0&&Ze(R)===!1){H.__webglMultisampledFramebuffer=t.createFramebuffer(),H.__webglColorRenderbuffer=[],n.bindFramebuffer(t.FRAMEBUFFER,H.__webglMultisampledFramebuffer);for(let fe=0;fe<ae.length;fe++){const ve=ae[fe];H.__webglColorRenderbuffer[fe]=t.createRenderbuffer(),t.bindRenderbuffer(t.RENDERBUFFER,H.__webglColorRenderbuffer[fe]);const qe=s.convert(ve.format,ve.colorSpace),le=s.convert(ve.type),$=x(ve.internalFormat,qe,le,ve.colorSpace,R.isXRRenderTarget===!0),Q=We(R);t.renderbufferStorageMultisample(t.RENDERBUFFER,Q,$,R.width,R.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+fe,t.RENDERBUFFER,H.__webglColorRenderbuffer[fe])}t.bindRenderbuffer(t.RENDERBUFFER,null),R.depthBuffer&&(H.__webglDepthRenderbuffer=t.createRenderbuffer(),Y(H.__webglDepthRenderbuffer,R,!0)),n.bindFramebuffer(t.FRAMEBUFFER,null)}}if(Z){n.bindTexture(t.TEXTURE_CUBE_MAP,J.__webglTexture),ce(t.TEXTURE_CUBE_MAP,w);for(let fe=0;fe<6;fe++)if(w.mipmaps&&w.mipmaps.length>0)for(let ve=0;ve<w.mipmaps.length;ve++)se(H.__webglFramebuffer[fe][ve],R,w,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+fe,ve);else se(H.__webglFramebuffer[fe],R,w,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+fe,0);m(w)&&h(t.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(Me){for(let fe=0,ve=ae.length;fe<ve;fe++){const qe=ae[fe],le=i.get(qe);n.bindTexture(t.TEXTURE_2D,le.__webglTexture),ce(t.TEXTURE_2D,qe),se(H.__webglFramebuffer,R,qe,t.COLOR_ATTACHMENT0+fe,t.TEXTURE_2D,0),m(qe)&&h(t.TEXTURE_2D)}n.unbindTexture()}else{let fe=t.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(fe=R.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY),n.bindTexture(fe,J.__webglTexture),ce(fe,w),w.mipmaps&&w.mipmaps.length>0)for(let ve=0;ve<w.mipmaps.length;ve++)se(H.__webglFramebuffer[ve],R,w,t.COLOR_ATTACHMENT0,fe,ve);else se(H.__webglFramebuffer,R,w,t.COLOR_ATTACHMENT0,fe,0);m(w)&&h(fe),n.unbindTexture()}R.depthBuffer&&Ie(R)}function Qe(R){const w=R.textures;for(let H=0,J=w.length;H<J;H++){const ae=w[H];if(m(ae)){const Z=R.isWebGLCubeRenderTarget?t.TEXTURE_CUBE_MAP:t.TEXTURE_2D,Me=i.get(ae).__webglTexture;n.bindTexture(Z,Me),h(Z),n.unbindTexture()}}}const Ve=[],L=[];function Re(R){if(R.samples>0){if(Ze(R)===!1){const w=R.textures,H=R.width,J=R.height;let ae=t.COLOR_BUFFER_BIT;const Z=R.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,Me=i.get(R),fe=w.length>1;if(fe)for(let ve=0;ve<w.length;ve++)n.bindFramebuffer(t.FRAMEBUFFER,Me.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+ve,t.RENDERBUFFER,null),n.bindFramebuffer(t.FRAMEBUFFER,Me.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+ve,t.TEXTURE_2D,null,0);n.bindFramebuffer(t.READ_FRAMEBUFFER,Me.__webglMultisampledFramebuffer),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,Me.__webglFramebuffer);for(let ve=0;ve<w.length;ve++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(ae|=t.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(ae|=t.STENCIL_BUFFER_BIT)),fe){t.framebufferRenderbuffer(t.READ_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.RENDERBUFFER,Me.__webglColorRenderbuffer[ve]);const qe=i.get(w[ve]).__webglTexture;t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,qe,0)}t.blitFramebuffer(0,0,H,J,0,0,H,J,ae,t.NEAREST),l===!0&&(Ve.length=0,L.length=0,Ve.push(t.COLOR_ATTACHMENT0+ve),R.depthBuffer&&R.resolveDepthBuffer===!1&&(Ve.push(Z),L.push(Z),t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,L)),t.invalidateFramebuffer(t.READ_FRAMEBUFFER,Ve))}if(n.bindFramebuffer(t.READ_FRAMEBUFFER,null),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),fe)for(let ve=0;ve<w.length;ve++){n.bindFramebuffer(t.FRAMEBUFFER,Me.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+ve,t.RENDERBUFFER,Me.__webglColorRenderbuffer[ve]);const qe=i.get(w[ve]).__webglTexture;n.bindFramebuffer(t.FRAMEBUFFER,Me.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+ve,t.TEXTURE_2D,qe,0)}n.bindFramebuffer(t.DRAW_FRAMEBUFFER,Me.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&l){const w=R.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,[w])}}}function We(R){return Math.min(r.maxSamples,R.samples)}function Ze(R){const w=i.get(R);return R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&w.__useRenderToTexture!==!1}function Le(R){const w=a.render.frame;u.get(R)!==w&&(u.set(R,w),R.update())}function et(R,w){const H=R.colorSpace,J=R.format,ae=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||H!==_r&&H!==$i&&(it.getTransfer(H)===_t?(J!==ni||ae!==Di)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",H)),w}function Ue(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(c.width=R.naturalWidth||R.width,c.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(c.width=R.displayWidth,c.height=R.displayHeight):(c.width=R.width,c.height=R.height),c}this.allocateTextureUnit=U,this.resetTextureUnits=E,this.setTexture2D=X,this.setTexture2DArray=K,this.setTexture3D=V,this.setTextureCube=ie,this.rebindTextures=De,this.setupRenderTarget=Ye,this.updateRenderTargetMipmap=Qe,this.updateMultisampleRenderTarget=Re,this.setupDepthRenderbuffer=Ie,this.setupFrameBufferTexture=se,this.useMultisampledRTT=Ze}function gA(t,e){function n(i,r=$i){let s;const a=it.getTransfer(r);if(i===Di)return t.UNSIGNED_BYTE;if(i===xf)return t.UNSIGNED_SHORT_4_4_4_4;if(i===yf)return t.UNSIGNED_SHORT_5_5_5_1;if(i===k0)return t.UNSIGNED_INT_5_9_9_9_REV;if(i===I0)return t.BYTE;if(i===U0)return t.SHORT;if(i===to)return t.UNSIGNED_SHORT;if(i===vf)return t.INT;if(i===Gr)return t.UNSIGNED_INT;if(i===Ti)return t.FLOAT;if(i===co)return t.HALF_FLOAT;if(i===F0)return t.ALPHA;if(i===O0)return t.RGB;if(i===ni)return t.RGBA;if(i===z0)return t.LUMINANCE;if(i===B0)return t.LUMINANCE_ALPHA;if(i===Is)return t.DEPTH_COMPONENT;if(i===$s)return t.DEPTH_STENCIL;if(i===H0)return t.RED;if(i===Sf)return t.RED_INTEGER;if(i===G0)return t.RG;if(i===Mf)return t.RG_INTEGER;if(i===Ef)return t.RGBA_INTEGER;if(i===Ml||i===El||i===wl||i===Tl)if(a===_t)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===Ml)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===El)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===wl)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Tl)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===Ml)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===El)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===wl)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Tl)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Xd||i===$d||i===Yd||i===qd)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===Xd)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===$d)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Yd)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===qd)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Kd||i===Zd||i===Jd)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===Kd||i===Zd)return a===_t?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===Jd)return a===_t?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Qd||i===eh||i===th||i===nh||i===ih||i===rh||i===sh||i===ah||i===oh||i===lh||i===ch||i===uh||i===dh||i===hh)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===Qd)return a===_t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===eh)return a===_t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===th)return a===_t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===nh)return a===_t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===ih)return a===_t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===rh)return a===_t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===sh)return a===_t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===ah)return a===_t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===oh)return a===_t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===lh)return a===_t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===ch)return a===_t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===uh)return a===_t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===dh)return a===_t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===hh)return a===_t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Al||i===fh||i===ph)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===Al)return a===_t?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===fh)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===ph)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===V0||i===mh||i===gh||i===_h)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===Al)return s.COMPRESSED_RED_RGTC1_EXT;if(i===mh)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===gh)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===_h)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Xs?t.UNSIGNED_INT_24_8:t[i]!==void 0?t[i]:null}return{convert:n}}class _A extends gn{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class Gt extends Dt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const vA={type:"move"};class Pu{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Gt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Gt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new N,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new N),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Gt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new N,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new N),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const n=this._hand;if(n)for(const i of e.hand.values())this._getHandJoint(n,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,n,i){let r=null,s=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&n.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const v of e.hand.values()){const m=n.getJointPose(v,i),h=this._getHandJoint(c,v);m!==null&&(h.matrix.fromArray(m.transform.matrix),h.matrix.decompose(h.position,h.rotation,h.scale),h.matrixWorldNeedsUpdate=!0,h.jointRadius=m.radius),h.visible=m!==null}const u=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],f=u.position.distanceTo(d.position),p=.02,_=.005;c.inputState.pinching&&f>p+_?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&f<=p-_&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=n.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(r=n.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(vA)))}return o!==null&&(o.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,n){if(e.joints[n.jointName]===void 0){const i=new Gt;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[n.jointName]=i,e.add(i)}return e.joints[n.jointName]}}const xA=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,yA=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class SA{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,n,i){if(this.texture===null){const r=new rn,s=e.properties.get(r);s.__webglTexture=n.texture,(n.depthNear!=i.depthNear||n.depthFar!=i.depthFar)&&(this.depthNear=n.depthNear,this.depthFar=n.depthFar),this.texture=r}}getMesh(e){if(this.texture!==null&&this.mesh===null){const n=e.cameras[0].viewport,i=new jn({vertexShader:xA,fragmentShader:yA,uniforms:{depthColor:{value:this.texture},depthWidth:{value:n.z},depthHeight:{value:n.w}}});this.mesh=new Ne(new Xr(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class MA extends Qs{constructor(e,n){super();const i=this;let r=null,s=1,a=null,o="local-floor",l=1,c=null,u=null,d=null,f=null,p=null,_=null;const v=new SA,m=n.getContextAttributes();let h=null,x=null;const S=[],M=[],P=new Oe;let C=null;const A=new gn;A.layers.enable(1),A.viewport=new ct;const b=new gn;b.layers.enable(2),b.viewport=new ct;const z=[A,b],y=new _A;y.layers.enable(1),y.layers.enable(2);let E=null,U=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(W){let se=S[W];return se===void 0&&(se=new Pu,S[W]=se),se.getTargetRaySpace()},this.getControllerGrip=function(W){let se=S[W];return se===void 0&&(se=new Pu,S[W]=se),se.getGripSpace()},this.getHand=function(W){let se=S[W];return se===void 0&&(se=new Pu,S[W]=se),se.getHandSpace()};function F(W){const se=M.indexOf(W.inputSource);if(se===-1)return;const Y=S[se];Y!==void 0&&(Y.update(W.inputSource,W.frame,c||a),Y.dispatchEvent({type:W.type,data:W.inputSource}))}function X(){r.removeEventListener("select",F),r.removeEventListener("selectstart",F),r.removeEventListener("selectend",F),r.removeEventListener("squeeze",F),r.removeEventListener("squeezestart",F),r.removeEventListener("squeezeend",F),r.removeEventListener("end",X),r.removeEventListener("inputsourceschange",K);for(let W=0;W<S.length;W++){const se=M[W];se!==null&&(M[W]=null,S[W].disconnect(se))}E=null,U=null,v.reset(),e.setRenderTarget(h),p=null,f=null,d=null,r=null,x=null,ze.stop(),i.isPresenting=!1,e.setPixelRatio(C),e.setSize(P.width,P.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(W){s=W,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(W){o=W,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(W){c=W},this.getBaseLayer=function(){return f!==null?f:p},this.getBinding=function(){return d},this.getFrame=function(){return _},this.getSession=function(){return r},this.setSession=async function(W){if(r=W,r!==null){if(h=e.getRenderTarget(),r.addEventListener("select",F),r.addEventListener("selectstart",F),r.addEventListener("selectend",F),r.addEventListener("squeeze",F),r.addEventListener("squeezestart",F),r.addEventListener("squeezeend",F),r.addEventListener("end",X),r.addEventListener("inputsourceschange",K),m.xrCompatible!==!0&&await n.makeXRCompatible(),C=e.getPixelRatio(),e.getSize(P),r.renderState.layers===void 0){const se={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:s};p=new XRWebGLLayer(r,n,se),r.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),x=new Vr(p.framebufferWidth,p.framebufferHeight,{format:ni,type:Di,colorSpace:e.outputColorSpace,stencilBuffer:m.stencil})}else{let se=null,Y=null,de=null;m.depth&&(de=m.stencil?n.DEPTH24_STENCIL8:n.DEPTH_COMPONENT24,se=m.stencil?$s:Is,Y=m.stencil?Xs:Gr);const Ie={colorFormat:n.RGBA8,depthFormat:de,scaleFactor:s};d=new XRWebGLBinding(r,n),f=d.createProjectionLayer(Ie),r.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),x=new Vr(f.textureWidth,f.textureHeight,{format:ni,type:Di,depthTexture:new iv(f.textureWidth,f.textureHeight,Y,void 0,void 0,void 0,void 0,void 0,void 0,se),stencilBuffer:m.stencil,colorSpace:e.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await r.requestReferenceSpace(o),ze.setContext(r),ze.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return v.getDepthTexture()};function K(W){for(let se=0;se<W.removed.length;se++){const Y=W.removed[se],de=M.indexOf(Y);de>=0&&(M[de]=null,S[de].disconnect(Y))}for(let se=0;se<W.added.length;se++){const Y=W.added[se];let de=M.indexOf(Y);if(de===-1){for(let De=0;De<S.length;De++)if(De>=M.length){M.push(Y),de=De;break}else if(M[De]===null){M[De]=Y,de=De;break}if(de===-1)break}const Ie=S[de];Ie&&Ie.connect(Y)}}const V=new N,ie=new N;function D(W,se,Y){V.setFromMatrixPosition(se.matrixWorld),ie.setFromMatrixPosition(Y.matrixWorld);const de=V.distanceTo(ie),Ie=se.projectionMatrix.elements,De=Y.projectionMatrix.elements,Ye=Ie[14]/(Ie[10]-1),Qe=Ie[14]/(Ie[10]+1),Ve=(Ie[9]+1)/Ie[5],L=(Ie[9]-1)/Ie[5],Re=(Ie[8]-1)/Ie[0],We=(De[8]+1)/De[0],Ze=Ye*Re,Le=Ye*We,et=de/(-Re+We),Ue=et*-Re;if(se.matrixWorld.decompose(W.position,W.quaternion,W.scale),W.translateX(Ue),W.translateZ(et),W.matrixWorld.compose(W.position,W.quaternion,W.scale),W.matrixWorldInverse.copy(W.matrixWorld).invert(),Ie[10]===-1)W.projectionMatrix.copy(se.projectionMatrix),W.projectionMatrixInverse.copy(se.projectionMatrixInverse);else{const R=Ye+et,w=Qe+et,H=Ze-Ue,J=Le+(de-Ue),ae=Ve*Qe/w*R,Z=L*Qe/w*R;W.projectionMatrix.makePerspective(H,J,ae,Z,R,w),W.projectionMatrixInverse.copy(W.projectionMatrix).invert()}}function ee(W,se){se===null?W.matrixWorld.copy(W.matrix):W.matrixWorld.multiplyMatrices(se.matrixWorld,W.matrix),W.matrixWorldInverse.copy(W.matrixWorld).invert()}this.updateCamera=function(W){if(r===null)return;let se=W.near,Y=W.far;v.texture!==null&&(v.depthNear>0&&(se=v.depthNear),v.depthFar>0&&(Y=v.depthFar)),y.near=b.near=A.near=se,y.far=b.far=A.far=Y,(E!==y.near||U!==y.far)&&(r.updateRenderState({depthNear:y.near,depthFar:y.far}),E=y.near,U=y.far);const de=W.parent,Ie=y.cameras;ee(y,de);for(let De=0;De<Ie.length;De++)ee(Ie[De],de);Ie.length===2?D(y,A,b):y.projectionMatrix.copy(A.projectionMatrix),ne(W,y,de)};function ne(W,se,Y){Y===null?W.matrix.copy(se.matrixWorld):(W.matrix.copy(Y.matrixWorld),W.matrix.invert(),W.matrix.multiply(se.matrixWorld)),W.matrix.decompose(W.position,W.quaternion,W.scale),W.updateMatrixWorld(!0),W.projectionMatrix.copy(se.projectionMatrix),W.projectionMatrixInverse.copy(se.projectionMatrixInverse),W.isPerspectiveCamera&&(W.fov=no*2*Math.atan(1/W.projectionMatrix.elements[5]),W.zoom=1)}this.getCamera=function(){return y},this.getFoveation=function(){if(!(f===null&&p===null))return l},this.setFoveation=function(W){l=W,f!==null&&(f.fixedFoveation=W),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=W)},this.hasDepthSensing=function(){return v.texture!==null},this.getDepthSensingMesh=function(){return v.getMesh(y)};let ce=null;function Te(W,se){if(u=se.getViewerPose(c||a),_=se,u!==null){const Y=u.views;p!==null&&(e.setRenderTargetFramebuffer(x,p.framebuffer),e.setRenderTarget(x));let de=!1;Y.length!==y.cameras.length&&(y.cameras.length=0,de=!0);for(let De=0;De<Y.length;De++){const Ye=Y[De];let Qe=null;if(p!==null)Qe=p.getViewport(Ye);else{const L=d.getViewSubImage(f,Ye);Qe=L.viewport,De===0&&(e.setRenderTargetTextures(x,L.colorTexture,f.ignoreDepthValues?void 0:L.depthStencilTexture),e.setRenderTarget(x))}let Ve=z[De];Ve===void 0&&(Ve=new gn,Ve.layers.enable(De),Ve.viewport=new ct,z[De]=Ve),Ve.matrix.fromArray(Ye.transform.matrix),Ve.matrix.decompose(Ve.position,Ve.quaternion,Ve.scale),Ve.projectionMatrix.fromArray(Ye.projectionMatrix),Ve.projectionMatrixInverse.copy(Ve.projectionMatrix).invert(),Ve.viewport.set(Qe.x,Qe.y,Qe.width,Qe.height),De===0&&(y.matrix.copy(Ve.matrix),y.matrix.decompose(y.position,y.quaternion,y.scale)),de===!0&&y.cameras.push(Ve)}const Ie=r.enabledFeatures;if(Ie&&Ie.includes("depth-sensing")){const De=d.getDepthInformation(Y[0]);De&&De.isValid&&De.texture&&v.init(e,De,r.renderState)}}for(let Y=0;Y<S.length;Y++){const de=M[Y],Ie=S[Y];de!==null&&Ie!==void 0&&Ie.update(de,se,c||a)}ce&&ce(W,se),se.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:se}),_=null}const ze=new tv;ze.setAnimationLoop(Te),this.setAnimationLoop=function(W){ce=W},this.dispose=function(){}}}const Tr=new fi,EA=new ut;function wA(t,e){function n(m,h){m.matrixAutoUpdate===!0&&m.updateMatrix(),h.value.copy(m.matrix)}function i(m,h){h.color.getRGB(m.fogColor.value,J0(t)),h.isFog?(m.fogNear.value=h.near,m.fogFar.value=h.far):h.isFogExp2&&(m.fogDensity.value=h.density)}function r(m,h,x,S,M){h.isMeshBasicMaterial||h.isMeshLambertMaterial?s(m,h):h.isMeshToonMaterial?(s(m,h),d(m,h)):h.isMeshPhongMaterial?(s(m,h),u(m,h)):h.isMeshStandardMaterial?(s(m,h),f(m,h),h.isMeshPhysicalMaterial&&p(m,h,M)):h.isMeshMatcapMaterial?(s(m,h),_(m,h)):h.isMeshDepthMaterial?s(m,h):h.isMeshDistanceMaterial?(s(m,h),v(m,h)):h.isMeshNormalMaterial?s(m,h):h.isLineBasicMaterial?(a(m,h),h.isLineDashedMaterial&&o(m,h)):h.isPointsMaterial?l(m,h,x,S):h.isSpriteMaterial?c(m,h):h.isShadowMaterial?(m.color.value.copy(h.color),m.opacity.value=h.opacity):h.isShaderMaterial&&(h.uniformsNeedUpdate=!1)}function s(m,h){m.opacity.value=h.opacity,h.color&&m.diffuse.value.copy(h.color),h.emissive&&m.emissive.value.copy(h.emissive).multiplyScalar(h.emissiveIntensity),h.map&&(m.map.value=h.map,n(h.map,m.mapTransform)),h.alphaMap&&(m.alphaMap.value=h.alphaMap,n(h.alphaMap,m.alphaMapTransform)),h.bumpMap&&(m.bumpMap.value=h.bumpMap,n(h.bumpMap,m.bumpMapTransform),m.bumpScale.value=h.bumpScale,h.side===Yt&&(m.bumpScale.value*=-1)),h.normalMap&&(m.normalMap.value=h.normalMap,n(h.normalMap,m.normalMapTransform),m.normalScale.value.copy(h.normalScale),h.side===Yt&&m.normalScale.value.negate()),h.displacementMap&&(m.displacementMap.value=h.displacementMap,n(h.displacementMap,m.displacementMapTransform),m.displacementScale.value=h.displacementScale,m.displacementBias.value=h.displacementBias),h.emissiveMap&&(m.emissiveMap.value=h.emissiveMap,n(h.emissiveMap,m.emissiveMapTransform)),h.specularMap&&(m.specularMap.value=h.specularMap,n(h.specularMap,m.specularMapTransform)),h.alphaTest>0&&(m.alphaTest.value=h.alphaTest);const x=e.get(h),S=x.envMap,M=x.envMapRotation;S&&(m.envMap.value=S,Tr.copy(M),Tr.x*=-1,Tr.y*=-1,Tr.z*=-1,S.isCubeTexture&&S.isRenderTargetTexture===!1&&(Tr.y*=-1,Tr.z*=-1),m.envMapRotation.value.setFromMatrix4(EA.makeRotationFromEuler(Tr)),m.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=h.reflectivity,m.ior.value=h.ior,m.refractionRatio.value=h.refractionRatio),h.lightMap&&(m.lightMap.value=h.lightMap,m.lightMapIntensity.value=h.lightMapIntensity,n(h.lightMap,m.lightMapTransform)),h.aoMap&&(m.aoMap.value=h.aoMap,m.aoMapIntensity.value=h.aoMapIntensity,n(h.aoMap,m.aoMapTransform))}function a(m,h){m.diffuse.value.copy(h.color),m.opacity.value=h.opacity,h.map&&(m.map.value=h.map,n(h.map,m.mapTransform))}function o(m,h){m.dashSize.value=h.dashSize,m.totalSize.value=h.dashSize+h.gapSize,m.scale.value=h.scale}function l(m,h,x,S){m.diffuse.value.copy(h.color),m.opacity.value=h.opacity,m.size.value=h.size*x,m.scale.value=S*.5,h.map&&(m.map.value=h.map,n(h.map,m.uvTransform)),h.alphaMap&&(m.alphaMap.value=h.alphaMap,n(h.alphaMap,m.alphaMapTransform)),h.alphaTest>0&&(m.alphaTest.value=h.alphaTest)}function c(m,h){m.diffuse.value.copy(h.color),m.opacity.value=h.opacity,m.rotation.value=h.rotation,h.map&&(m.map.value=h.map,n(h.map,m.mapTransform)),h.alphaMap&&(m.alphaMap.value=h.alphaMap,n(h.alphaMap,m.alphaMapTransform)),h.alphaTest>0&&(m.alphaTest.value=h.alphaTest)}function u(m,h){m.specular.value.copy(h.specular),m.shininess.value=Math.max(h.shininess,1e-4)}function d(m,h){h.gradientMap&&(m.gradientMap.value=h.gradientMap)}function f(m,h){m.metalness.value=h.metalness,h.metalnessMap&&(m.metalnessMap.value=h.metalnessMap,n(h.metalnessMap,m.metalnessMapTransform)),m.roughness.value=h.roughness,h.roughnessMap&&(m.roughnessMap.value=h.roughnessMap,n(h.roughnessMap,m.roughnessMapTransform)),h.envMap&&(m.envMapIntensity.value=h.envMapIntensity)}function p(m,h,x){m.ior.value=h.ior,h.sheen>0&&(m.sheenColor.value.copy(h.sheenColor).multiplyScalar(h.sheen),m.sheenRoughness.value=h.sheenRoughness,h.sheenColorMap&&(m.sheenColorMap.value=h.sheenColorMap,n(h.sheenColorMap,m.sheenColorMapTransform)),h.sheenRoughnessMap&&(m.sheenRoughnessMap.value=h.sheenRoughnessMap,n(h.sheenRoughnessMap,m.sheenRoughnessMapTransform))),h.clearcoat>0&&(m.clearcoat.value=h.clearcoat,m.clearcoatRoughness.value=h.clearcoatRoughness,h.clearcoatMap&&(m.clearcoatMap.value=h.clearcoatMap,n(h.clearcoatMap,m.clearcoatMapTransform)),h.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=h.clearcoatRoughnessMap,n(h.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),h.clearcoatNormalMap&&(m.clearcoatNormalMap.value=h.clearcoatNormalMap,n(h.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(h.clearcoatNormalScale),h.side===Yt&&m.clearcoatNormalScale.value.negate())),h.dispersion>0&&(m.dispersion.value=h.dispersion),h.iridescence>0&&(m.iridescence.value=h.iridescence,m.iridescenceIOR.value=h.iridescenceIOR,m.iridescenceThicknessMinimum.value=h.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=h.iridescenceThicknessRange[1],h.iridescenceMap&&(m.iridescenceMap.value=h.iridescenceMap,n(h.iridescenceMap,m.iridescenceMapTransform)),h.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=h.iridescenceThicknessMap,n(h.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),h.transmission>0&&(m.transmission.value=h.transmission,m.transmissionSamplerMap.value=x.texture,m.transmissionSamplerSize.value.set(x.width,x.height),h.transmissionMap&&(m.transmissionMap.value=h.transmissionMap,n(h.transmissionMap,m.transmissionMapTransform)),m.thickness.value=h.thickness,h.thicknessMap&&(m.thicknessMap.value=h.thicknessMap,n(h.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=h.attenuationDistance,m.attenuationColor.value.copy(h.attenuationColor)),h.anisotropy>0&&(m.anisotropyVector.value.set(h.anisotropy*Math.cos(h.anisotropyRotation),h.anisotropy*Math.sin(h.anisotropyRotation)),h.anisotropyMap&&(m.anisotropyMap.value=h.anisotropyMap,n(h.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=h.specularIntensity,m.specularColor.value.copy(h.specularColor),h.specularColorMap&&(m.specularColorMap.value=h.specularColorMap,n(h.specularColorMap,m.specularColorMapTransform)),h.specularIntensityMap&&(m.specularIntensityMap.value=h.specularIntensityMap,n(h.specularIntensityMap,m.specularIntensityMapTransform))}function _(m,h){h.matcap&&(m.matcap.value=h.matcap)}function v(m,h){const x=e.get(h).light;m.referencePosition.value.setFromMatrixPosition(x.matrixWorld),m.nearDistance.value=x.shadow.camera.near,m.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function TA(t,e,n,i){let r={},s={},a=[];const o=t.getParameter(t.MAX_UNIFORM_BUFFER_BINDINGS);function l(x,S){const M=S.program;i.uniformBlockBinding(x,M)}function c(x,S){let M=r[x.id];M===void 0&&(_(x),M=u(x),r[x.id]=M,x.addEventListener("dispose",m));const P=S.program;i.updateUBOMapping(x,P);const C=e.render.frame;s[x.id]!==C&&(f(x),s[x.id]=C)}function u(x){const S=d();x.__bindingPointIndex=S;const M=t.createBuffer(),P=x.__size,C=x.usage;return t.bindBuffer(t.UNIFORM_BUFFER,M),t.bufferData(t.UNIFORM_BUFFER,P,C),t.bindBuffer(t.UNIFORM_BUFFER,null),t.bindBufferBase(t.UNIFORM_BUFFER,S,M),M}function d(){for(let x=0;x<o;x++)if(a.indexOf(x)===-1)return a.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(x){const S=r[x.id],M=x.uniforms,P=x.__cache;t.bindBuffer(t.UNIFORM_BUFFER,S);for(let C=0,A=M.length;C<A;C++){const b=Array.isArray(M[C])?M[C]:[M[C]];for(let z=0,y=b.length;z<y;z++){const E=b[z];if(p(E,C,z,P)===!0){const U=E.__offset,F=Array.isArray(E.value)?E.value:[E.value];let X=0;for(let K=0;K<F.length;K++){const V=F[K],ie=v(V);typeof V=="number"||typeof V=="boolean"?(E.__data[0]=V,t.bufferSubData(t.UNIFORM_BUFFER,U+X,E.__data)):V.isMatrix3?(E.__data[0]=V.elements[0],E.__data[1]=V.elements[1],E.__data[2]=V.elements[2],E.__data[3]=0,E.__data[4]=V.elements[3],E.__data[5]=V.elements[4],E.__data[6]=V.elements[5],E.__data[7]=0,E.__data[8]=V.elements[6],E.__data[9]=V.elements[7],E.__data[10]=V.elements[8],E.__data[11]=0):(V.toArray(E.__data,X),X+=ie.storage/Float32Array.BYTES_PER_ELEMENT)}t.bufferSubData(t.UNIFORM_BUFFER,U,E.__data)}}}t.bindBuffer(t.UNIFORM_BUFFER,null)}function p(x,S,M,P){const C=x.value,A=S+"_"+M;if(P[A]===void 0)return typeof C=="number"||typeof C=="boolean"?P[A]=C:P[A]=C.clone(),!0;{const b=P[A];if(typeof C=="number"||typeof C=="boolean"){if(b!==C)return P[A]=C,!0}else if(b.equals(C)===!1)return b.copy(C),!0}return!1}function _(x){const S=x.uniforms;let M=0;const P=16;for(let A=0,b=S.length;A<b;A++){const z=Array.isArray(S[A])?S[A]:[S[A]];for(let y=0,E=z.length;y<E;y++){const U=z[y],F=Array.isArray(U.value)?U.value:[U.value];for(let X=0,K=F.length;X<K;X++){const V=F[X],ie=v(V),D=M%P,ee=D%ie.boundary,ne=D+ee;M+=ee,ne!==0&&P-ne<ie.storage&&(M+=P-ne),U.__data=new Float32Array(ie.storage/Float32Array.BYTES_PER_ELEMENT),U.__offset=M,M+=ie.storage}}}const C=M%P;return C>0&&(M+=P-C),x.__size=M,x.__cache={},this}function v(x){const S={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(S.boundary=4,S.storage=4):x.isVector2?(S.boundary=8,S.storage=8):x.isVector3||x.isColor?(S.boundary=16,S.storage=12):x.isVector4?(S.boundary=16,S.storage=16):x.isMatrix3?(S.boundary=48,S.storage=48):x.isMatrix4?(S.boundary=64,S.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),S}function m(x){const S=x.target;S.removeEventListener("dispose",m);const M=a.indexOf(S.__bindingPointIndex);a.splice(M,1),t.deleteBuffer(r[S.id]),delete r[S.id],delete s[S.id]}function h(){for(const x in r)t.deleteBuffer(r[x]);a=[],r={},s={}}return{bind:l,update:c,dispose:h}}class lv{constructor(e={}){const{canvas:n=fM(),context:i=null,depth:r=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:d=!1}=e;this.isWebGLRenderer=!0;let f;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=i.getContextAttributes().alpha}else f=a;const p=new Uint32Array(4),_=new Int32Array(4);let v=null,m=null;const h=[],x=[];this.domElement=n,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=tn,this.toneMapping=ur,this.toneMappingExposure=1;const S=this;let M=!1,P=0,C=0,A=null,b=-1,z=null;const y=new ct,E=new ct;let U=null;const F=new Ce(0);let X=0,K=n.width,V=n.height,ie=1,D=null,ee=null;const ne=new ct(0,0,K,V),ce=new ct(0,0,K,V);let Te=!1;const ze=new bf;let W=!1,se=!1;const Y=new ut,de=new ut,Ie=new N,De=new ct,Ye={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Qe=!1;function Ve(){return A===null?ie:1}let L=i;function Re(T,k){return n.getContext(T,k)}try{const T={alpha:!0,depth:r,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:d};if("setAttribute"in n&&n.setAttribute("data-engine",`three.js r${_f}`),n.addEventListener("webglcontextlost",q,!1),n.addEventListener("webglcontextrestored",me,!1),n.addEventListener("webglcontextcreationerror",ge,!1),L===null){const k="webgl2";if(L=Re(k,T),L===null)throw Re(k)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(T){throw console.error("THREE.WebGLRenderer: "+T.message),T}let We,Ze,Le,et,Ue,R,w,H,J,ae,Z,Me,fe,ve,qe,le,$,Q,te,re,Pe,we,Xe,I;function pe(){We=new N1(L),We.init(),we=new gA(L,We),Ze=new T1(L,We,e,we),Le=new fA(L),Ze.reverseDepthBuffer&&Le.buffers.depth.setReversed(!0),et=new I1(L),Ue=new JT,R=new mA(L,We,Le,Ue,Ze,we,et),w=new b1(S),H=new P1(S),J=new HM(L),Xe=new E1(L,J),ae=new L1(L,J,et,Xe),Z=new k1(L,ae,J,et),te=new U1(L,Ze,R),le=new A1(Ue),Me=new ZT(S,w,H,We,Ze,Xe,le),fe=new wA(S,Ue),ve=new eA,qe=new aA(We),Q=new M1(S,w,H,Le,Z,f,l),$=new dA(S,Z,Ze),I=new TA(L,et,Ze,Le),re=new w1(L,We,et),Pe=new D1(L,We,et),et.programs=Me.programs,S.capabilities=Ze,S.extensions=We,S.properties=Ue,S.renderLists=ve,S.shadowMap=$,S.state=Le,S.info=et}pe();const B=new MA(S,L);this.xr=B,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){const T=We.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){const T=We.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return ie},this.setPixelRatio=function(T){T!==void 0&&(ie=T,this.setSize(K,V,!1))},this.getSize=function(T){return T.set(K,V)},this.setSize=function(T,k,G=!0){if(B.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}K=T,V=k,n.width=Math.floor(T*ie),n.height=Math.floor(k*ie),G===!0&&(n.style.width=T+"px",n.style.height=k+"px"),this.setViewport(0,0,T,k)},this.getDrawingBufferSize=function(T){return T.set(K*ie,V*ie).floor()},this.setDrawingBufferSize=function(T,k,G){K=T,V=k,ie=G,n.width=Math.floor(T*G),n.height=Math.floor(k*G),this.setViewport(0,0,T,k)},this.getCurrentViewport=function(T){return T.copy(y)},this.getViewport=function(T){return T.copy(ne)},this.setViewport=function(T,k,G,j){T.isVector4?ne.set(T.x,T.y,T.z,T.w):ne.set(T,k,G,j),Le.viewport(y.copy(ne).multiplyScalar(ie).round())},this.getScissor=function(T){return T.copy(ce)},this.setScissor=function(T,k,G,j){T.isVector4?ce.set(T.x,T.y,T.z,T.w):ce.set(T,k,G,j),Le.scissor(E.copy(ce).multiplyScalar(ie).round())},this.getScissorTest=function(){return Te},this.setScissorTest=function(T){Le.setScissorTest(Te=T)},this.setOpaqueSort=function(T){D=T},this.setTransparentSort=function(T){ee=T},this.getClearColor=function(T){return T.copy(Q.getClearColor())},this.setClearColor=function(){Q.setClearColor.apply(Q,arguments)},this.getClearAlpha=function(){return Q.getClearAlpha()},this.setClearAlpha=function(){Q.setClearAlpha.apply(Q,arguments)},this.clear=function(T=!0,k=!0,G=!0){let j=0;if(T){let O=!1;if(A!==null){const ue=A.texture.format;O=ue===Ef||ue===Mf||ue===Sf}if(O){const ue=A.texture.type,_e=ue===Di||ue===Gr||ue===to||ue===Xs||ue===xf||ue===yf,Se=Q.getClearColor(),Ee=Q.getClearAlpha(),ke=Se.r,Fe=Se.g,Ae=Se.b;_e?(p[0]=ke,p[1]=Fe,p[2]=Ae,p[3]=Ee,L.clearBufferuiv(L.COLOR,0,p)):(_[0]=ke,_[1]=Fe,_[2]=Ae,_[3]=Ee,L.clearBufferiv(L.COLOR,0,_))}else j|=L.COLOR_BUFFER_BIT}k&&(j|=L.DEPTH_BUFFER_BIT,L.clearDepth(this.capabilities.reverseDepthBuffer?0:1)),G&&(j|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),L.clear(j)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){n.removeEventListener("webglcontextlost",q,!1),n.removeEventListener("webglcontextrestored",me,!1),n.removeEventListener("webglcontextcreationerror",ge,!1),ve.dispose(),qe.dispose(),Ue.dispose(),w.dispose(),H.dispose(),Z.dispose(),Xe.dispose(),I.dispose(),Me.dispose(),B.dispose(),B.removeEventListener("sessionstart",xr),B.removeEventListener("sessionend",po),Ln.stop()};function q(T){T.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),M=!0}function me(){console.log("THREE.WebGLRenderer: Context Restored."),M=!1;const T=et.autoReset,k=$.enabled,G=$.autoUpdate,j=$.needsUpdate,O=$.type;pe(),et.autoReset=T,$.enabled=k,$.autoUpdate=G,$.needsUpdate=j,$.type=O}function ge(T){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function Be(T){const k=T.target;k.removeEventListener("dispose",Be),rt(k)}function rt(T){Tt(T),Ue.remove(T)}function Tt(T){const k=Ue.get(T).programs;k!==void 0&&(k.forEach(function(G){Me.releaseProgram(G)}),T.isShaderMaterial&&Me.releaseShaderCache(T))}this.renderBufferDirect=function(T,k,G,j,O,ue){k===null&&(k=Ye);const _e=O.isMesh&&O.matrixWorld.determinant()<0,Se=Pv(T,k,G,j,O);Le.setMaterial(j,_e);let Ee=G.index,ke=1;if(j.wireframe===!0){if(Ee=ae.getWireframeAttribute(G),Ee===void 0)return;ke=2}const Fe=G.drawRange,Ae=G.attributes.position;let st=Fe.start*ke,pt=(Fe.start+Fe.count)*ke;ue!==null&&(st=Math.max(st,ue.start*ke),pt=Math.min(pt,(ue.start+ue.count)*ke)),Ee!==null?(st=Math.max(st,0),pt=Math.min(pt,Ee.count)):Ae!=null&&(st=Math.max(st,0),pt=Math.min(pt,Ae.count));const At=pt-st;if(At<0||At===1/0)return;Xe.setup(O,j,Se,G,Ee);let Mn,tt=re;if(Ee!==null&&(Mn=J.get(Ee),tt=Pe,tt.setIndex(Mn)),O.isMesh)j.wireframe===!0?(Le.setLineWidth(j.wireframeLinewidth*Ve()),tt.setMode(L.LINES)):tt.setMode(L.TRIANGLES);else if(O.isLine){let be=j.linewidth;be===void 0&&(be=1),Le.setLineWidth(be*Ve()),O.isLineSegments?tt.setMode(L.LINES):O.isLineLoop?tt.setMode(L.LINE_LOOP):tt.setMode(L.LINE_STRIP)}else O.isPoints?tt.setMode(L.POINTS):O.isSprite&&tt.setMode(L.TRIANGLES);if(O.isBatchedMesh)if(O._multiDrawInstances!==null)tt.renderMultiDrawInstances(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount,O._multiDrawInstances);else if(We.get("WEBGL_multi_draw"))tt.renderMultiDraw(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount);else{const be=O._multiDrawStarts,Wt=O._multiDrawCounts,nt=O._multiDrawCount,Xn=Ee?J.get(Ee).bytesPerElement:1,$r=Ue.get(j).currentProgram.getUniforms();for(let En=0;En<nt;En++)$r.setValue(L,"_gl_DrawID",En),tt.render(be[En]/Xn,Wt[En])}else if(O.isInstancedMesh)tt.renderInstances(st,At,O.count);else if(G.isInstancedBufferGeometry){const be=G._maxInstanceCount!==void 0?G._maxInstanceCount:1/0,Wt=Math.min(G.instanceCount,be);tt.renderInstances(st,At,Wt)}else tt.render(st,At)};function je(T,k,G){T.transparent===!0&&T.side===yt&&T.forceSinglePass===!1?(T.side=Yt,T.needsUpdate=!0,go(T,k,G),T.side=fr,T.needsUpdate=!0,go(T,k,G),T.side=yt):go(T,k,G)}this.compile=function(T,k,G=null){G===null&&(G=T),m=qe.get(G),m.init(k),x.push(m),G.traverseVisible(function(O){O.isLight&&O.layers.test(k.layers)&&(m.pushLight(O),O.castShadow&&m.pushShadow(O))}),T!==G&&T.traverseVisible(function(O){O.isLight&&O.layers.test(k.layers)&&(m.pushLight(O),O.castShadow&&m.pushShadow(O))}),m.setupLights();const j=new Set;return T.traverse(function(O){if(!(O.isMesh||O.isPoints||O.isLine||O.isSprite))return;const ue=O.material;if(ue)if(Array.isArray(ue))for(let _e=0;_e<ue.length;_e++){const Se=ue[_e];je(Se,G,O),j.add(Se)}else je(ue,G,O),j.add(ue)}),x.pop(),m=null,j},this.compileAsync=function(T,k,G=null){const j=this.compile(T,k,G);return new Promise(O=>{function ue(){if(j.forEach(function(_e){Ue.get(_e).currentProgram.isReady()&&j.delete(_e)}),j.size===0){O(T);return}setTimeout(ue,10)}We.get("KHR_parallel_shader_compile")!==null?ue():setTimeout(ue,10)})};let dt=null;function zt(T){dt&&dt(T)}function xr(){Ln.stop()}function po(){Ln.start()}const Ln=new tv;Ln.setAnimationLoop(zt),typeof self<"u"&&Ln.setContext(self),this.setAnimationLoop=function(T){dt=T,B.setAnimationLoop(T),T===null?Ln.stop():Ln.start()},B.addEventListener("sessionstart",xr),B.addEventListener("sessionend",po),this.render=function(T,k){if(k!==void 0&&k.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(M===!0)return;if(T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),k.parent===null&&k.matrixWorldAutoUpdate===!0&&k.updateMatrixWorld(),B.enabled===!0&&B.isPresenting===!0&&(B.cameraAutoUpdate===!0&&B.updateCamera(k),k=B.getCamera()),T.isScene===!0&&T.onBeforeRender(S,T,k,A),m=qe.get(T,x.length),m.init(k),x.push(m),de.multiplyMatrices(k.projectionMatrix,k.matrixWorldInverse),ze.setFromProjectionMatrix(de),se=this.localClippingEnabled,W=le.init(this.clippingPlanes,se),v=ve.get(T,h.length),v.init(),h.push(v),B.enabled===!0&&B.isPresenting===!0){const ue=S.xr.getDepthSensingMesh();ue!==null&&Wn(ue,k,-1/0,S.sortObjects)}Wn(T,k,0,S.sortObjects),v.finish(),S.sortObjects===!0&&v.sort(D,ee),Qe=B.enabled===!1||B.isPresenting===!1||B.hasDepthSensing()===!1,Qe&&Q.addToRenderList(v,T),this.info.render.frame++,W===!0&&le.beginShadows();const G=m.state.shadowsArray;$.render(G,T,k),W===!0&&le.endShadows(),this.info.autoReset===!0&&this.info.reset();const j=v.opaque,O=v.transmissive;if(m.setupLights(),k.isArrayCamera){const ue=k.cameras;if(O.length>0)for(let _e=0,Se=ue.length;_e<Se;_e++){const Ee=ue[_e];Uf(j,O,T,Ee)}Qe&&Q.render(T);for(let _e=0,Se=ue.length;_e<Se;_e++){const Ee=ue[_e];If(v,T,Ee,Ee.viewport)}}else O.length>0&&Uf(j,O,T,k),Qe&&Q.render(T),If(v,T,k);A!==null&&(R.updateMultisampleRenderTarget(A),R.updateRenderTargetMipmap(A)),T.isScene===!0&&T.onAfterRender(S,T,k),Xe.resetDefaultState(),b=-1,z=null,x.pop(),x.length>0?(m=x[x.length-1],W===!0&&le.setGlobalState(S.clippingPlanes,m.state.camera)):m=null,h.pop(),h.length>0?v=h[h.length-1]:v=null};function Wn(T,k,G,j){if(T.visible===!1)return;if(T.layers.test(k.layers)){if(T.isGroup)G=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(k);else if(T.isLight)m.pushLight(T),T.castShadow&&m.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||ze.intersectsSprite(T)){j&&De.setFromMatrixPosition(T.matrixWorld).applyMatrix4(de);const _e=Z.update(T),Se=T.material;Se.visible&&v.push(T,_e,Se,G,De.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||ze.intersectsObject(T))){const _e=Z.update(T),Se=T.material;if(j&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),De.copy(T.boundingSphere.center)):(_e.boundingSphere===null&&_e.computeBoundingSphere(),De.copy(_e.boundingSphere.center)),De.applyMatrix4(T.matrixWorld).applyMatrix4(de)),Array.isArray(Se)){const Ee=_e.groups;for(let ke=0,Fe=Ee.length;ke<Fe;ke++){const Ae=Ee[ke],st=Se[Ae.materialIndex];st&&st.visible&&v.push(T,_e,st,G,De.z,Ae)}}else Se.visible&&v.push(T,_e,Se,G,De.z,null)}}const ue=T.children;for(let _e=0,Se=ue.length;_e<Se;_e++)Wn(ue[_e],k,G,j)}function If(T,k,G,j){const O=T.opaque,ue=T.transmissive,_e=T.transparent;m.setupLightsView(G),W===!0&&le.setGlobalState(S.clippingPlanes,G),j&&Le.viewport(y.copy(j)),O.length>0&&mo(O,k,G),ue.length>0&&mo(ue,k,G),_e.length>0&&mo(_e,k,G),Le.buffers.depth.setTest(!0),Le.buffers.depth.setMask(!0),Le.buffers.color.setMask(!0),Le.setPolygonOffset(!1)}function Uf(T,k,G,j){if((G.isScene===!0?G.overrideMaterial:null)!==null)return;m.state.transmissionRenderTarget[j.id]===void 0&&(m.state.transmissionRenderTarget[j.id]=new Vr(1,1,{generateMipmaps:!0,type:We.has("EXT_color_buffer_half_float")||We.has("EXT_color_buffer_float")?co:Di,minFilter:Ji,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:it.workingColorSpace}));const ue=m.state.transmissionRenderTarget[j.id],_e=j.viewport||y;ue.setSize(_e.z,_e.w);const Se=S.getRenderTarget();S.setRenderTarget(ue),S.getClearColor(F),X=S.getClearAlpha(),X<1&&S.setClearColor(16777215,.5),S.clear(),Qe&&Q.render(G);const Ee=S.toneMapping;S.toneMapping=ur;const ke=j.viewport;if(j.viewport!==void 0&&(j.viewport=void 0),m.setupLightsView(j),W===!0&&le.setGlobalState(S.clippingPlanes,j),mo(T,G,j),R.updateMultisampleRenderTarget(ue),R.updateRenderTargetMipmap(ue),We.has("WEBGL_multisampled_render_to_texture")===!1){let Fe=!1;for(let Ae=0,st=k.length;Ae<st;Ae++){const pt=k[Ae],At=pt.object,Mn=pt.geometry,tt=pt.material,be=pt.group;if(tt.side===yt&&At.layers.test(j.layers)){const Wt=tt.side;tt.side=Yt,tt.needsUpdate=!0,kf(At,G,j,Mn,tt,be),tt.side=Wt,tt.needsUpdate=!0,Fe=!0}}Fe===!0&&(R.updateMultisampleRenderTarget(ue),R.updateRenderTargetMipmap(ue))}S.setRenderTarget(Se),S.setClearColor(F,X),ke!==void 0&&(j.viewport=ke),S.toneMapping=Ee}function mo(T,k,G){const j=k.isScene===!0?k.overrideMaterial:null;for(let O=0,ue=T.length;O<ue;O++){const _e=T[O],Se=_e.object,Ee=_e.geometry,ke=j===null?_e.material:j,Fe=_e.group;Se.layers.test(G.layers)&&kf(Se,k,G,Ee,ke,Fe)}}function kf(T,k,G,j,O,ue){T.onBeforeRender(S,k,G,j,O,ue),T.modelViewMatrix.multiplyMatrices(G.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),O.onBeforeRender(S,k,G,j,T,ue),O.transparent===!0&&O.side===yt&&O.forceSinglePass===!1?(O.side=Yt,O.needsUpdate=!0,S.renderBufferDirect(G,k,j,O,T,ue),O.side=fr,O.needsUpdate=!0,S.renderBufferDirect(G,k,j,O,T,ue),O.side=yt):S.renderBufferDirect(G,k,j,O,T,ue),T.onAfterRender(S,k,G,j,O,ue)}function go(T,k,G){k.isScene!==!0&&(k=Ye);const j=Ue.get(T),O=m.state.lights,ue=m.state.shadowsArray,_e=O.state.version,Se=Me.getParameters(T,O.state,ue,k,G),Ee=Me.getProgramCacheKey(Se);let ke=j.programs;j.environment=T.isMeshStandardMaterial?k.environment:null,j.fog=k.fog,j.envMap=(T.isMeshStandardMaterial?H:w).get(T.envMap||j.environment),j.envMapRotation=j.environment!==null&&T.envMap===null?k.environmentRotation:T.envMapRotation,ke===void 0&&(T.addEventListener("dispose",Be),ke=new Map,j.programs=ke);let Fe=ke.get(Ee);if(Fe!==void 0){if(j.currentProgram===Fe&&j.lightsStateVersion===_e)return Of(T,Se),Fe}else Se.uniforms=Me.getUniforms(T),T.onBeforeCompile(Se,S),Fe=Me.acquireProgram(Se,Ee),ke.set(Ee,Fe),j.uniforms=Se.uniforms;const Ae=j.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(Ae.clippingPlanes=le.uniform),Of(T,Se),j.needsLights=Lv(T),j.lightsStateVersion=_e,j.needsLights&&(Ae.ambientLightColor.value=O.state.ambient,Ae.lightProbe.value=O.state.probe,Ae.directionalLights.value=O.state.directional,Ae.directionalLightShadows.value=O.state.directionalShadow,Ae.spotLights.value=O.state.spot,Ae.spotLightShadows.value=O.state.spotShadow,Ae.rectAreaLights.value=O.state.rectArea,Ae.ltc_1.value=O.state.rectAreaLTC1,Ae.ltc_2.value=O.state.rectAreaLTC2,Ae.pointLights.value=O.state.point,Ae.pointLightShadows.value=O.state.pointShadow,Ae.hemisphereLights.value=O.state.hemi,Ae.directionalShadowMap.value=O.state.directionalShadowMap,Ae.directionalShadowMatrix.value=O.state.directionalShadowMatrix,Ae.spotShadowMap.value=O.state.spotShadowMap,Ae.spotLightMatrix.value=O.state.spotLightMatrix,Ae.spotLightMap.value=O.state.spotLightMap,Ae.pointShadowMap.value=O.state.pointShadowMap,Ae.pointShadowMatrix.value=O.state.pointShadowMatrix),j.currentProgram=Fe,j.uniformsList=null,Fe}function Ff(T){if(T.uniformsList===null){const k=T.currentProgram.getUniforms();T.uniformsList=Cl.seqWithValue(k.seq,T.uniforms)}return T.uniformsList}function Of(T,k){const G=Ue.get(T);G.outputColorSpace=k.outputColorSpace,G.batching=k.batching,G.batchingColor=k.batchingColor,G.instancing=k.instancing,G.instancingColor=k.instancingColor,G.instancingMorph=k.instancingMorph,G.skinning=k.skinning,G.morphTargets=k.morphTargets,G.morphNormals=k.morphNormals,G.morphColors=k.morphColors,G.morphTargetsCount=k.morphTargetsCount,G.numClippingPlanes=k.numClippingPlanes,G.numIntersection=k.numClipIntersection,G.vertexAlphas=k.vertexAlphas,G.vertexTangents=k.vertexTangents,G.toneMapping=k.toneMapping}function Pv(T,k,G,j,O){k.isScene!==!0&&(k=Ye),R.resetTextureUnits();const ue=k.fog,_e=j.isMeshStandardMaterial?k.environment:null,Se=A===null?S.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:_r,Ee=(j.isMeshStandardMaterial?H:w).get(j.envMap||_e),ke=j.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,Fe=!!G.attributes.tangent&&(!!j.normalMap||j.anisotropy>0),Ae=!!G.morphAttributes.position,st=!!G.morphAttributes.normal,pt=!!G.morphAttributes.color;let At=ur;j.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(At=S.toneMapping);const Mn=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,tt=Mn!==void 0?Mn.length:0,be=Ue.get(j),Wt=m.state.lights;if(W===!0&&(se===!0||T!==z)){const Dn=T===z&&j.id===b;le.setState(j,T,Dn)}let nt=!1;j.version===be.__version?(be.needsLights&&be.lightsStateVersion!==Wt.state.version||be.outputColorSpace!==Se||O.isBatchedMesh&&be.batching===!1||!O.isBatchedMesh&&be.batching===!0||O.isBatchedMesh&&be.batchingColor===!0&&O.colorTexture===null||O.isBatchedMesh&&be.batchingColor===!1&&O.colorTexture!==null||O.isInstancedMesh&&be.instancing===!1||!O.isInstancedMesh&&be.instancing===!0||O.isSkinnedMesh&&be.skinning===!1||!O.isSkinnedMesh&&be.skinning===!0||O.isInstancedMesh&&be.instancingColor===!0&&O.instanceColor===null||O.isInstancedMesh&&be.instancingColor===!1&&O.instanceColor!==null||O.isInstancedMesh&&be.instancingMorph===!0&&O.morphTexture===null||O.isInstancedMesh&&be.instancingMorph===!1&&O.morphTexture!==null||be.envMap!==Ee||j.fog===!0&&be.fog!==ue||be.numClippingPlanes!==void 0&&(be.numClippingPlanes!==le.numPlanes||be.numIntersection!==le.numIntersection)||be.vertexAlphas!==ke||be.vertexTangents!==Fe||be.morphTargets!==Ae||be.morphNormals!==st||be.morphColors!==pt||be.toneMapping!==At||be.morphTargetsCount!==tt)&&(nt=!0):(nt=!0,be.__version=j.version);let Xn=be.currentProgram;nt===!0&&(Xn=go(j,k,O));let $r=!1,En=!1,bc=!1;const Rt=Xn.getUniforms(),Ui=be.uniforms;if(Le.useProgram(Xn.program)&&($r=!0,En=!0,bc=!0),j.id!==b&&(b=j.id,En=!0),$r||z!==T){Ze.reverseDepthBuffer?(Y.copy(T.projectionMatrix),mM(Y),gM(Y),Rt.setValue(L,"projectionMatrix",Y)):Rt.setValue(L,"projectionMatrix",T.projectionMatrix),Rt.setValue(L,"viewMatrix",T.matrixWorldInverse);const Dn=Rt.map.cameraPosition;Dn!==void 0&&Dn.setValue(L,Ie.setFromMatrixPosition(T.matrixWorld)),Ze.logarithmicDepthBuffer&&Rt.setValue(L,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(j.isMeshPhongMaterial||j.isMeshToonMaterial||j.isMeshLambertMaterial||j.isMeshBasicMaterial||j.isMeshStandardMaterial||j.isShaderMaterial)&&Rt.setValue(L,"isOrthographic",T.isOrthographicCamera===!0),z!==T&&(z=T,En=!0,bc=!0)}if(O.isSkinnedMesh){Rt.setOptional(L,O,"bindMatrix"),Rt.setOptional(L,O,"bindMatrixInverse");const Dn=O.skeleton;Dn&&(Dn.boneTexture===null&&Dn.computeBoneTexture(),Rt.setValue(L,"boneTexture",Dn.boneTexture,R))}O.isBatchedMesh&&(Rt.setOptional(L,O,"batchingTexture"),Rt.setValue(L,"batchingTexture",O._matricesTexture,R),Rt.setOptional(L,O,"batchingIdTexture"),Rt.setValue(L,"batchingIdTexture",O._indirectTexture,R),Rt.setOptional(L,O,"batchingColorTexture"),O._colorsTexture!==null&&Rt.setValue(L,"batchingColorTexture",O._colorsTexture,R));const Cc=G.morphAttributes;if((Cc.position!==void 0||Cc.normal!==void 0||Cc.color!==void 0)&&te.update(O,G,Xn),(En||be.receiveShadow!==O.receiveShadow)&&(be.receiveShadow=O.receiveShadow,Rt.setValue(L,"receiveShadow",O.receiveShadow)),j.isMeshGouraudMaterial&&j.envMap!==null&&(Ui.envMap.value=Ee,Ui.flipEnvMap.value=Ee.isCubeTexture&&Ee.isRenderTargetTexture===!1?-1:1),j.isMeshStandardMaterial&&j.envMap===null&&k.environment!==null&&(Ui.envMapIntensity.value=k.environmentIntensity),En&&(Rt.setValue(L,"toneMappingExposure",S.toneMappingExposure),be.needsLights&&Nv(Ui,bc),ue&&j.fog===!0&&fe.refreshFogUniforms(Ui,ue),fe.refreshMaterialUniforms(Ui,j,ie,V,m.state.transmissionRenderTarget[T.id]),Cl.upload(L,Ff(be),Ui,R)),j.isShaderMaterial&&j.uniformsNeedUpdate===!0&&(Cl.upload(L,Ff(be),Ui,R),j.uniformsNeedUpdate=!1),j.isSpriteMaterial&&Rt.setValue(L,"center",O.center),Rt.setValue(L,"modelViewMatrix",O.modelViewMatrix),Rt.setValue(L,"normalMatrix",O.normalMatrix),Rt.setValue(L,"modelMatrix",O.matrixWorld),j.isShaderMaterial||j.isRawShaderMaterial){const Dn=j.uniformsGroups;for(let Rc=0,Dv=Dn.length;Rc<Dv;Rc++){const zf=Dn[Rc];I.update(zf,Xn),I.bind(zf,Xn)}}return Xn}function Nv(T,k){T.ambientLightColor.needsUpdate=k,T.lightProbe.needsUpdate=k,T.directionalLights.needsUpdate=k,T.directionalLightShadows.needsUpdate=k,T.pointLights.needsUpdate=k,T.pointLightShadows.needsUpdate=k,T.spotLights.needsUpdate=k,T.spotLightShadows.needsUpdate=k,T.rectAreaLights.needsUpdate=k,T.hemisphereLights.needsUpdate=k}function Lv(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return P},this.getActiveMipmapLevel=function(){return C},this.getRenderTarget=function(){return A},this.setRenderTargetTextures=function(T,k,G){Ue.get(T.texture).__webglTexture=k,Ue.get(T.depthTexture).__webglTexture=G;const j=Ue.get(T);j.__hasExternalTextures=!0,j.__autoAllocateDepthBuffer=G===void 0,j.__autoAllocateDepthBuffer||We.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),j.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(T,k){const G=Ue.get(T);G.__webglFramebuffer=k,G.__useDefaultFramebuffer=k===void 0},this.setRenderTarget=function(T,k=0,G=0){A=T,P=k,C=G;let j=!0,O=null,ue=!1,_e=!1;if(T){const Ee=Ue.get(T);if(Ee.__useDefaultFramebuffer!==void 0)Le.bindFramebuffer(L.FRAMEBUFFER,null),j=!1;else if(Ee.__webglFramebuffer===void 0)R.setupRenderTarget(T);else if(Ee.__hasExternalTextures)R.rebindTextures(T,Ue.get(T.texture).__webglTexture,Ue.get(T.depthTexture).__webglTexture);else if(T.depthBuffer){const Ae=T.depthTexture;if(Ee.__boundDepthTexture!==Ae){if(Ae!==null&&Ue.has(Ae)&&(T.width!==Ae.image.width||T.height!==Ae.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");R.setupDepthRenderbuffer(T)}}const ke=T.texture;(ke.isData3DTexture||ke.isDataArrayTexture||ke.isCompressedArrayTexture)&&(_e=!0);const Fe=Ue.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(Fe[k])?O=Fe[k][G]:O=Fe[k],ue=!0):T.samples>0&&R.useMultisampledRTT(T)===!1?O=Ue.get(T).__webglMultisampledFramebuffer:Array.isArray(Fe)?O=Fe[G]:O=Fe,y.copy(T.viewport),E.copy(T.scissor),U=T.scissorTest}else y.copy(ne).multiplyScalar(ie).floor(),E.copy(ce).multiplyScalar(ie).floor(),U=Te;if(Le.bindFramebuffer(L.FRAMEBUFFER,O)&&j&&Le.drawBuffers(T,O),Le.viewport(y),Le.scissor(E),Le.setScissorTest(U),ue){const Ee=Ue.get(T.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+k,Ee.__webglTexture,G)}else if(_e){const Ee=Ue.get(T.texture),ke=k||0;L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,Ee.__webglTexture,G||0,ke)}b=-1},this.readRenderTargetPixels=function(T,k,G,j,O,ue,_e){if(!(T&&T.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Se=Ue.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&_e!==void 0&&(Se=Se[_e]),Se){Le.bindFramebuffer(L.FRAMEBUFFER,Se);try{const Ee=T.texture,ke=Ee.format,Fe=Ee.type;if(!Ze.textureFormatReadable(ke)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Ze.textureTypeReadable(Fe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}k>=0&&k<=T.width-j&&G>=0&&G<=T.height-O&&L.readPixels(k,G,j,O,we.convert(ke),we.convert(Fe),ue)}finally{const Ee=A!==null?Ue.get(A).__webglFramebuffer:null;Le.bindFramebuffer(L.FRAMEBUFFER,Ee)}}},this.readRenderTargetPixelsAsync=async function(T,k,G,j,O,ue,_e){if(!(T&&T.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Se=Ue.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&_e!==void 0&&(Se=Se[_e]),Se){const Ee=T.texture,ke=Ee.format,Fe=Ee.type;if(!Ze.textureFormatReadable(ke))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Ze.textureTypeReadable(Fe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(k>=0&&k<=T.width-j&&G>=0&&G<=T.height-O){Le.bindFramebuffer(L.FRAMEBUFFER,Se);const Ae=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,Ae),L.bufferData(L.PIXEL_PACK_BUFFER,ue.byteLength,L.STREAM_READ),L.readPixels(k,G,j,O,we.convert(ke),we.convert(Fe),0);const st=A!==null?Ue.get(A).__webglFramebuffer:null;Le.bindFramebuffer(L.FRAMEBUFFER,st);const pt=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);return L.flush(),await pM(L,pt,4),L.bindBuffer(L.PIXEL_PACK_BUFFER,Ae),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,ue),L.deleteBuffer(Ae),L.deleteSync(pt),ue}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(T,k=null,G=0){T.isTexture!==!0&&(bl("WebGLRenderer: copyFramebufferToTexture function signature has changed."),k=arguments[0]||null,T=arguments[1]);const j=Math.pow(2,-G),O=Math.floor(T.image.width*j),ue=Math.floor(T.image.height*j),_e=k!==null?k.x:0,Se=k!==null?k.y:0;R.setTexture2D(T,0),L.copyTexSubImage2D(L.TEXTURE_2D,G,0,0,_e,Se,O,ue),Le.unbindTexture()},this.copyTextureToTexture=function(T,k,G=null,j=null,O=0){T.isTexture!==!0&&(bl("WebGLRenderer: copyTextureToTexture function signature has changed."),j=arguments[0]||null,T=arguments[1],k=arguments[2],O=arguments[3]||0,G=null);let ue,_e,Se,Ee,ke,Fe;G!==null?(ue=G.max.x-G.min.x,_e=G.max.y-G.min.y,Se=G.min.x,Ee=G.min.y):(ue=T.image.width,_e=T.image.height,Se=0,Ee=0),j!==null?(ke=j.x,Fe=j.y):(ke=0,Fe=0);const Ae=we.convert(k.format),st=we.convert(k.type);R.setTexture2D(k,0),L.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,k.flipY),L.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),L.pixelStorei(L.UNPACK_ALIGNMENT,k.unpackAlignment);const pt=L.getParameter(L.UNPACK_ROW_LENGTH),At=L.getParameter(L.UNPACK_IMAGE_HEIGHT),Mn=L.getParameter(L.UNPACK_SKIP_PIXELS),tt=L.getParameter(L.UNPACK_SKIP_ROWS),be=L.getParameter(L.UNPACK_SKIP_IMAGES),Wt=T.isCompressedTexture?T.mipmaps[O]:T.image;L.pixelStorei(L.UNPACK_ROW_LENGTH,Wt.width),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,Wt.height),L.pixelStorei(L.UNPACK_SKIP_PIXELS,Se),L.pixelStorei(L.UNPACK_SKIP_ROWS,Ee),T.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,O,ke,Fe,ue,_e,Ae,st,Wt.data):T.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,O,ke,Fe,Wt.width,Wt.height,Ae,Wt.data):L.texSubImage2D(L.TEXTURE_2D,O,ke,Fe,ue,_e,Ae,st,Wt),L.pixelStorei(L.UNPACK_ROW_LENGTH,pt),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,At),L.pixelStorei(L.UNPACK_SKIP_PIXELS,Mn),L.pixelStorei(L.UNPACK_SKIP_ROWS,tt),L.pixelStorei(L.UNPACK_SKIP_IMAGES,be),O===0&&k.generateMipmaps&&L.generateMipmap(L.TEXTURE_2D),Le.unbindTexture()},this.copyTextureToTexture3D=function(T,k,G=null,j=null,O=0){T.isTexture!==!0&&(bl("WebGLRenderer: copyTextureToTexture3D function signature has changed."),G=arguments[0]||null,j=arguments[1]||null,T=arguments[2],k=arguments[3],O=arguments[4]||0);let ue,_e,Se,Ee,ke,Fe,Ae,st,pt;const At=T.isCompressedTexture?T.mipmaps[O]:T.image;G!==null?(ue=G.max.x-G.min.x,_e=G.max.y-G.min.y,Se=G.max.z-G.min.z,Ee=G.min.x,ke=G.min.y,Fe=G.min.z):(ue=At.width,_e=At.height,Se=At.depth,Ee=0,ke=0,Fe=0),j!==null?(Ae=j.x,st=j.y,pt=j.z):(Ae=0,st=0,pt=0);const Mn=we.convert(k.format),tt=we.convert(k.type);let be;if(k.isData3DTexture)R.setTexture3D(k,0),be=L.TEXTURE_3D;else if(k.isDataArrayTexture||k.isCompressedArrayTexture)R.setTexture2DArray(k,0),be=L.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}L.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,k.flipY),L.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),L.pixelStorei(L.UNPACK_ALIGNMENT,k.unpackAlignment);const Wt=L.getParameter(L.UNPACK_ROW_LENGTH),nt=L.getParameter(L.UNPACK_IMAGE_HEIGHT),Xn=L.getParameter(L.UNPACK_SKIP_PIXELS),$r=L.getParameter(L.UNPACK_SKIP_ROWS),En=L.getParameter(L.UNPACK_SKIP_IMAGES);L.pixelStorei(L.UNPACK_ROW_LENGTH,At.width),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,At.height),L.pixelStorei(L.UNPACK_SKIP_PIXELS,Ee),L.pixelStorei(L.UNPACK_SKIP_ROWS,ke),L.pixelStorei(L.UNPACK_SKIP_IMAGES,Fe),T.isDataTexture||T.isData3DTexture?L.texSubImage3D(be,O,Ae,st,pt,ue,_e,Se,Mn,tt,At.data):k.isCompressedArrayTexture?L.compressedTexSubImage3D(be,O,Ae,st,pt,ue,_e,Se,Mn,At.data):L.texSubImage3D(be,O,Ae,st,pt,ue,_e,Se,Mn,tt,At),L.pixelStorei(L.UNPACK_ROW_LENGTH,Wt),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,nt),L.pixelStorei(L.UNPACK_SKIP_PIXELS,Xn),L.pixelStorei(L.UNPACK_SKIP_ROWS,$r),L.pixelStorei(L.UNPACK_SKIP_IMAGES,En),O===0&&k.generateMipmaps&&L.generateMipmap(be),Le.unbindTexture()},this.initRenderTarget=function(T){Ue.get(T).__webglFramebuffer===void 0&&R.setupRenderTarget(T)},this.initTexture=function(T){T.isCubeTexture?R.setTextureCube(T,0):T.isData3DTexture?R.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?R.setTexture2DArray(T,0):R.setTexture2D(T,0),Le.unbindTexture()},this.resetState=function(){P=0,C=0,A=null,Le.reset(),Xe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ai}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const n=this.getContext();n.drawingBufferColorSpace=e===wf?"display-p3":"srgb",n.unpackColorSpace=it.workingColorSpace===Ec?"display-p3":"srgb"}}class cv extends Dt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new fi,this.environmentIntensity=1,this.environmentRotation=new fi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,n){return super.copy(e,n),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const n=super.toJSON(e);return this.fog!==null&&(n.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(n.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(n.object.backgroundIntensity=this.backgroundIntensity),n.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(n.object.environmentIntensity=this.environmentIntensity),n.object.environmentRotation=this.environmentRotation.toArray(),n}}class AA{constructor(e,n){this.isInterleavedBuffer=!0,this.array=e,this.stride=n,this.count=e!==void 0?e.length/n:0,this.usage=vh,this.updateRanges=[],this.version=0,this.uuid=Ci()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,n,i){e*=this.stride,i*=n.stride;for(let r=0,s=this.stride;r<s;r++)this.array[e+r]=n.array[i+r];return this}set(e,n=0){return this.array.set(e,n),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Ci()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const n=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(n,this.stride);return i.setUsage(this.usage),i}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Ci()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const an=new N;class ic{constructor(e,n,i,r=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=n,this.offset=i,this.normalized=r}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let n=0,i=this.data.count;n<i;n++)an.fromBufferAttribute(this,n),an.applyMatrix4(e),this.setXYZ(n,an.x,an.y,an.z);return this}applyNormalMatrix(e){for(let n=0,i=this.count;n<i;n++)an.fromBufferAttribute(this,n),an.applyNormalMatrix(e),this.setXYZ(n,an.x,an.y,an.z);return this}transformDirection(e){for(let n=0,i=this.count;n<i;n++)an.fromBufferAttribute(this,n),an.transformDirection(e),this.setXYZ(n,an.x,an.y,an.z);return this}getComponent(e,n){let i=this.array[e*this.data.stride+this.offset+n];return this.normalized&&(i=ti(i,this.array)),i}setComponent(e,n,i){return this.normalized&&(i=at(i,this.array)),this.data.array[e*this.data.stride+this.offset+n]=i,this}setX(e,n){return this.normalized&&(n=at(n,this.array)),this.data.array[e*this.data.stride+this.offset]=n,this}setY(e,n){return this.normalized&&(n=at(n,this.array)),this.data.array[e*this.data.stride+this.offset+1]=n,this}setZ(e,n){return this.normalized&&(n=at(n,this.array)),this.data.array[e*this.data.stride+this.offset+2]=n,this}setW(e,n){return this.normalized&&(n=at(n,this.array)),this.data.array[e*this.data.stride+this.offset+3]=n,this}getX(e){let n=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(n=ti(n,this.array)),n}getY(e){let n=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(n=ti(n,this.array)),n}getZ(e){let n=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(n=ti(n,this.array)),n}getW(e){let n=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(n=ti(n,this.array)),n}setXY(e,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(n=at(n,this.array),i=at(i,this.array)),this.data.array[e+0]=n,this.data.array[e+1]=i,this}setXYZ(e,n,i,r){return e=e*this.data.stride+this.offset,this.normalized&&(n=at(n,this.array),i=at(i,this.array),r=at(r,this.array)),this.data.array[e+0]=n,this.data.array[e+1]=i,this.data.array[e+2]=r,this}setXYZW(e,n,i,r,s){return e=e*this.data.stride+this.offset,this.normalized&&(n=at(n,this.array),i=at(i,this.array),r=at(r,this.array),s=at(s,this.array)),this.data.array[e+0]=n,this.data.array[e+1]=i,this.data.array[e+2]=r,this.data.array[e+3]=s,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const n=[];for(let i=0;i<this.count;i++){const r=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)n.push(this.data.array[r+s])}return new Sn(new this.array.constructor(n),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new ic(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const n=[];for(let i=0;i<this.count;i++){const r=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)n.push(this.data.array[r+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:n,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class uv extends vr{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Ce(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let cs;const pa=new N,us=new N,ds=new N,hs=new Oe,ma=new Oe,dv=new ut,tl=new N,ga=new N,nl=new N,Vm=new Oe,Nu=new Oe,jm=new Oe;class bA extends Dt{constructor(e=new uv){if(super(),this.isSprite=!0,this.type="Sprite",cs===void 0){cs=new lt;const n=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new AA(n,5);cs.setIndex([0,1,2,0,2,3]),cs.setAttribute("position",new ic(i,3,0,!1)),cs.setAttribute("uv",new ic(i,2,3,!1))}this.geometry=cs,this.material=e,this.center=new Oe(.5,.5)}raycast(e,n){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),us.setFromMatrixScale(this.matrixWorld),dv.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),ds.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&us.multiplyScalar(-ds.z);const i=this.material.rotation;let r,s;i!==0&&(s=Math.cos(i),r=Math.sin(i));const a=this.center;il(tl.set(-.5,-.5,0),ds,a,us,r,s),il(ga.set(.5,-.5,0),ds,a,us,r,s),il(nl.set(.5,.5,0),ds,a,us,r,s),Vm.set(0,0),Nu.set(1,0),jm.set(1,1);let o=e.ray.intersectTriangle(tl,ga,nl,!1,pa);if(o===null&&(il(ga.set(-.5,.5,0),ds,a,us,r,s),Nu.set(0,1),o=e.ray.intersectTriangle(tl,nl,ga,!1,pa),o===null))return;const l=e.ray.origin.distanceTo(pa);l<e.near||l>e.far||n.push({distance:l,point:pa.clone(),uv:Fn.getInterpolation(pa,tl,ga,nl,Vm,Nu,jm,new Oe),face:null,object:this})}copy(e,n){return super.copy(e,n),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function il(t,e,n,i,r,s){hs.subVectors(t,n).addScalar(.5).multiply(i),r!==void 0?(ma.x=s*hs.x-r*hs.y,ma.y=r*hs.x+s*hs.y):ma.copy(hs),t.copy(e),t.x+=ma.x,t.y+=ma.y,t.applyMatrix4(dv)}class Mi extends vr{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ce(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const rc=new N,sc=new N,Wm=new ut,_a=new wc,rl=new fo,Lu=new N,Xm=new N;class Yi extends Dt{constructor(e=new lt,n=new Mi){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=n,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const n=e.attributes.position,i=[0];for(let r=1,s=n.count;r<s;r++)rc.fromBufferAttribute(n,r-1),sc.fromBufferAttribute(n,r),i[r]=i[r-1],i[r]+=rc.distanceTo(sc);e.setAttribute("lineDistance",new ft(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,n){const i=this.geometry,r=this.matrixWorld,s=e.params.Line.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),rl.copy(i.boundingSphere),rl.applyMatrix4(r),rl.radius+=s,e.ray.intersectsSphere(rl)===!1)return;Wm.copy(r).invert(),_a.copy(e.ray).applyMatrix4(Wm);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,u=i.index,f=i.attributes.position;if(u!==null){const p=Math.max(0,a.start),_=Math.min(u.count,a.start+a.count);for(let v=p,m=_-1;v<m;v+=c){const h=u.getX(v),x=u.getX(v+1),S=sl(this,e,_a,l,h,x);S&&n.push(S)}if(this.isLineLoop){const v=u.getX(_-1),m=u.getX(p),h=sl(this,e,_a,l,v,m);h&&n.push(h)}}else{const p=Math.max(0,a.start),_=Math.min(f.count,a.start+a.count);for(let v=p,m=_-1;v<m;v+=c){const h=sl(this,e,_a,l,v,v+1);h&&n.push(h)}if(this.isLineLoop){const v=sl(this,e,_a,l,_-1,p);v&&n.push(v)}}}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function sl(t,e,n,i,r,s){const a=t.geometry.attributes.position;if(rc.fromBufferAttribute(a,r),sc.fromBufferAttribute(a,s),n.distanceSqToSegment(rc,sc,Lu,Xm)>i)return;Lu.applyMatrix4(t.matrixWorld);const l=e.ray.origin.distanceTo(Lu);if(!(l<e.near||l>e.far))return{distance:l,point:Xm.clone().applyMatrix4(t.matrixWorld),index:r,face:null,faceIndex:null,barycoord:null,object:t}}const $m=new N,Ym=new N;class Du extends Yi{constructor(e,n){super(e,n),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const n=e.attributes.position,i=[];for(let r=0,s=n.count;r<s;r+=2)$m.fromBufferAttribute(n,r),Ym.fromBufferAttribute(n,r+1),i[r]=r===0?0:i[r-1],i[r+1]=i[r]+$m.distanceTo(Ym);e.setAttribute("lineDistance",new ft(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class qm extends Yi{constructor(e,n){super(e,n),this.isLineLoop=!0,this.type="LineLoop"}}class hv extends vr{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Ce(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Km=new ut,yh=new wc,al=new fo,ol=new N;class CA extends Dt{constructor(e=new lt,n=new hv){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=n,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,n){const i=this.geometry,r=this.matrixWorld,s=e.params.Points.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),al.copy(i.boundingSphere),al.applyMatrix4(r),al.radius+=s,e.ray.intersectsSphere(al)===!1)return;Km.copy(r).invert(),yh.copy(e.ray).applyMatrix4(Km);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=i.index,d=i.attributes.position;if(c!==null){const f=Math.max(0,a.start),p=Math.min(c.count,a.start+a.count);for(let _=f,v=p;_<v;_++){const m=c.getX(_);ol.fromBufferAttribute(d,m),Zm(ol,m,l,r,e,n,this)}}else{const f=Math.max(0,a.start),p=Math.min(d.count,a.start+a.count);for(let _=f,v=p;_<v;_++)ol.fromBufferAttribute(d,_),Zm(ol,_,l,r,e,n,this)}}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function Zm(t,e,n,i,r,s,a){const o=yh.distanceSqToPoint(t);if(o<n){const l=new N;yh.closestPointToPoint(t,l),l.applyMatrix4(i);const c=r.ray.origin.distanceTo(l);if(c<r.near||c>r.far)return;s.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class RA extends rn{constructor(e,n,i,r,s,a,o,l,c){super(e,n,i,r,s,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Rf extends lt{constructor(e=1,n=32,i=0,r=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:n,thetaStart:i,thetaLength:r},n=Math.max(3,n);const s=[],a=[],o=[],l=[],c=new N,u=new Oe;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let d=0,f=3;d<=n;d++,f+=3){const p=i+d/n*r;c.x=e*Math.cos(p),c.y=e*Math.sin(p),a.push(c.x,c.y,c.z),o.push(0,0,1),u.x=(a[f]/e+1)/2,u.y=(a[f+1]/e+1)/2,l.push(u.x,u.y)}for(let d=1;d<=n;d++)s.push(d,d+1,0);this.setIndex(s),this.setAttribute("position",new ft(a,3)),this.setAttribute("normal",new ft(o,3)),this.setAttribute("uv",new ft(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Rf(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class On extends lt{constructor(e=1,n=1,i=1,r=32,s=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:n,height:i,radialSegments:r,heightSegments:s,openEnded:a,thetaStart:o,thetaLength:l};const c=this;r=Math.floor(r),s=Math.floor(s);const u=[],d=[],f=[],p=[];let _=0;const v=[],m=i/2;let h=0;x(),a===!1&&(e>0&&S(!0),n>0&&S(!1)),this.setIndex(u),this.setAttribute("position",new ft(d,3)),this.setAttribute("normal",new ft(f,3)),this.setAttribute("uv",new ft(p,2));function x(){const M=new N,P=new N;let C=0;const A=(n-e)/i;for(let b=0;b<=s;b++){const z=[],y=b/s,E=y*(n-e)+e;for(let U=0;U<=r;U++){const F=U/r,X=F*l+o,K=Math.sin(X),V=Math.cos(X);P.x=E*K,P.y=-y*i+m,P.z=E*V,d.push(P.x,P.y,P.z),M.set(K,A,V).normalize(),f.push(M.x,M.y,M.z),p.push(F,1-y),z.push(_++)}v.push(z)}for(let b=0;b<r;b++)for(let z=0;z<s;z++){const y=v[z][b],E=v[z+1][b],U=v[z+1][b+1],F=v[z][b+1];e>0&&(u.push(y,E,F),C+=3),n>0&&(u.push(E,U,F),C+=3)}c.addGroup(h,C,0),h+=C}function S(M){const P=_,C=new Oe,A=new N;let b=0;const z=M===!0?e:n,y=M===!0?1:-1;for(let U=1;U<=r;U++)d.push(0,m*y,0),f.push(0,y,0),p.push(.5,.5),_++;const E=_;for(let U=0;U<=r;U++){const X=U/r*l+o,K=Math.cos(X),V=Math.sin(X);A.x=z*V,A.y=m*y,A.z=z*K,d.push(A.x,A.y,A.z),f.push(0,y,0),C.x=K*.5+.5,C.y=V*.5*y+.5,p.push(C.x,C.y),_++}for(let U=0;U<r;U++){const F=P+U,X=E+U;M===!0?u.push(X,X+1,F):u.push(X+1,X,F),b+=3}c.addGroup(h,b,M===!0?1:2),h+=b}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new On(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Pf extends On{constructor(e=1,n=1,i=32,r=1,s=!1,a=0,o=Math.PI*2){super(0,e,n,i,r,s,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:n,radialSegments:i,heightSegments:r,openEnded:s,thetaStart:a,thetaLength:o}}static fromJSON(e){return new Pf(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class As extends lt{constructor(e=.5,n=1,i=32,r=1,s=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:n,thetaSegments:i,phiSegments:r,thetaStart:s,thetaLength:a},i=Math.max(3,i),r=Math.max(1,r);const o=[],l=[],c=[],u=[];let d=e;const f=(n-e)/r,p=new N,_=new Oe;for(let v=0;v<=r;v++){for(let m=0;m<=i;m++){const h=s+m/i*a;p.x=d*Math.cos(h),p.y=d*Math.sin(h),l.push(p.x,p.y,p.z),c.push(0,0,1),_.x=(p.x/n+1)/2,_.y=(p.y/n+1)/2,u.push(_.x,_.y)}d+=f}for(let v=0;v<r;v++){const m=v*(i+1);for(let h=0;h<i;h++){const x=h+m,S=x,M=x+i+1,P=x+i+2,C=x+1;o.push(S,M,C),o.push(M,P,C)}}this.setIndex(o),this.setAttribute("position",new ft(l,3)),this.setAttribute("normal",new ft(c,3)),this.setAttribute("uv",new ft(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new As(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class un extends lt{constructor(e=1,n=32,i=16,r=0,s=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:n,heightSegments:i,phiStart:r,phiLength:s,thetaStart:a,thetaLength:o},n=Math.max(3,Math.floor(n)),i=Math.max(2,Math.floor(i));const l=Math.min(a+o,Math.PI);let c=0;const u=[],d=new N,f=new N,p=[],_=[],v=[],m=[];for(let h=0;h<=i;h++){const x=[],S=h/i;let M=0;h===0&&a===0?M=.5/n:h===i&&l===Math.PI&&(M=-.5/n);for(let P=0;P<=n;P++){const C=P/n;d.x=-e*Math.cos(r+C*s)*Math.sin(a+S*o),d.y=e*Math.cos(a+S*o),d.z=e*Math.sin(r+C*s)*Math.sin(a+S*o),_.push(d.x,d.y,d.z),f.copy(d).normalize(),v.push(f.x,f.y,f.z),m.push(C+M,1-S),x.push(c++)}u.push(x)}for(let h=0;h<i;h++)for(let x=0;x<n;x++){const S=u[h][x+1],M=u[h][x],P=u[h+1][x],C=u[h+1][x+1];(h!==0||a>0)&&p.push(S,M,C),(h!==i-1||l<Math.PI)&&p.push(M,P,C)}this.setIndex(p),this.setAttribute("position",new ft(_,3)),this.setAttribute("normal",new ft(v,3)),this.setAttribute("uv",new ft(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new un(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Qi extends vr{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new Ce(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ce(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=j0,this.normalScale=new Oe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new fi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Iu extends Mi{constructor(e){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(e)}copy(e){return super.copy(e),this.scale=e.scale,this.dashSize=e.dashSize,this.gapSize=e.gapSize,this}}const Jm={enabled:!1,files:{},add:function(t,e){this.enabled!==!1&&(this.files[t]=e)},get:function(t){if(this.enabled!==!1)return this.files[t]},remove:function(t){delete this.files[t]},clear:function(){this.files={}}};class PA{constructor(e,n,i){const r=this;let s=!1,a=0,o=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=n,this.onError=i,this.itemStart=function(u){o++,s===!1&&r.onStart!==void 0&&r.onStart(u,a,o),s=!0},this.itemEnd=function(u){a++,r.onProgress!==void 0&&r.onProgress(u,a,o),a===o&&(s=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(u){r.onError!==void 0&&r.onError(u)},this.resolveURL=function(u){return l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,d){return c.push(u,d),this},this.removeHandler=function(u){const d=c.indexOf(u);return d!==-1&&c.splice(d,2),this},this.getHandler=function(u){for(let d=0,f=c.length;d<f;d+=2){const p=c[d],_=c[d+1];if(p.global&&(p.lastIndex=0),p.test(u))return _}return null}}}const NA=new PA;class Nf{constructor(e){this.manager=e!==void 0?e:NA,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,n){const i=this;return new Promise(function(r,s){i.load(e,r,n,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}}Nf.DEFAULT_MATERIAL_NAME="__DEFAULT";class LA extends Nf{constructor(e){super(e)}load(e,n,i,r){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,a=Jm.get(e);if(a!==void 0)return s.manager.itemStart(e),setTimeout(function(){n&&n(a),s.manager.itemEnd(e)},0),a;const o=io("img");function l(){u(),Jm.add(e,this),n&&n(this),s.manager.itemEnd(e)}function c(d){u(),r&&r(d),s.manager.itemError(e),s.manager.itemEnd(e)}function u(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),s.manager.itemStart(e),o.src=e,o}}class fv extends Nf{constructor(e){super(e)}load(e,n,i,r){const s=new rn,a=new LA(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){s.image=o,s.needsUpdate=!0,n!==void 0&&n(s)},i,r),s}}class Ac extends Dt{constructor(e,n=1){super(),this.isLight=!0,this.type="Light",this.color=new Ce(e),this.intensity=n}dispose(){}copy(e,n){return super.copy(e,n),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const n=super.toJSON(e);return n.object.color=this.color.getHex(),n.object.intensity=this.intensity,this.groundColor!==void 0&&(n.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(n.object.distance=this.distance),this.angle!==void 0&&(n.object.angle=this.angle),this.decay!==void 0&&(n.object.decay=this.decay),this.penumbra!==void 0&&(n.object.penumbra=this.penumbra),this.shadow!==void 0&&(n.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(n.object.target=this.target.uuid),n}}class DA extends Ac{constructor(e,n,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Dt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ce(n)}copy(e,n){return super.copy(e,n),this.groundColor.copy(e.groundColor),this}}const Uu=new ut,Qm=new N,eg=new N;class pv{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Oe(512,512),this.map=null,this.mapPass=null,this.matrix=new ut,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new bf,this._frameExtents=new Oe(1,1),this._viewportCount=1,this._viewports=[new ct(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const n=this.camera,i=this.matrix;Qm.setFromMatrixPosition(e.matrixWorld),n.position.copy(Qm),eg.setFromMatrixPosition(e.target.matrixWorld),n.lookAt(eg),n.updateMatrixWorld(),Uu.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Uu),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Uu)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const tg=new ut,va=new N,ku=new N;class IA extends pv{constructor(){super(new gn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Oe(4,2),this._viewportCount=6,this._viewports=[new ct(2,1,1,1),new ct(0,1,1,1),new ct(3,1,1,1),new ct(1,1,1,1),new ct(3,0,1,1),new ct(1,0,1,1)],this._cubeDirections=[new N(1,0,0),new N(-1,0,0),new N(0,0,1),new N(0,0,-1),new N(0,1,0),new N(0,-1,0)],this._cubeUps=[new N(0,1,0),new N(0,1,0),new N(0,1,0),new N(0,1,0),new N(0,0,1),new N(0,0,-1)]}updateMatrices(e,n=0){const i=this.camera,r=this.matrix,s=e.distance||i.far;s!==i.far&&(i.far=s,i.updateProjectionMatrix()),va.setFromMatrixPosition(e.matrixWorld),i.position.copy(va),ku.copy(i.position),ku.add(this._cubeDirections[n]),i.up.copy(this._cubeUps[n]),i.lookAt(ku),i.updateMatrixWorld(),r.makeTranslation(-va.x,-va.y,-va.z),tg.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(tg)}}class UA extends Ac{constructor(e,n,i=0,r=2){super(e,n),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=r,this.shadow=new IA}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,n){return super.copy(e,n),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class kA extends pv{constructor(){super(new nv(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class mv extends Ac{constructor(e,n){super(e,n),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Dt.DEFAULT_UP),this.updateMatrix(),this.target=new Dt,this.shadow=new kA}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class FA extends Ac{constructor(e,n){super(e,n),this.isAmbientLight=!0,this.type="AmbientLight"}}class gv{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=ng(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const n=ng();e=(n-this.oldTime)/1e3,this.oldTime=n,this.elapsedTime+=e}return e}}function ng(){return performance.now()}const ig=new ut;class _v{constructor(e,n,i=0,r=1/0){this.ray=new wc(e,n),this.near=i,this.far=r,this.camera=null,this.layers=new Af,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,n){this.ray.set(e,n)}setFromCamera(e,n){n.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(n.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(n).sub(this.ray.origin).normalize(),this.camera=n):n.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(n.near+n.far)/(n.near-n.far)).unproject(n),this.ray.direction.set(0,0,-1).transformDirection(n.matrixWorld),this.camera=n):console.error("THREE.Raycaster: Unsupported camera type: "+n.type)}setFromXRController(e){return ig.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(ig),this}intersectObject(e,n=!0,i=[]){return Sh(e,this,i,n),i.sort(rg),i}intersectObjects(e,n=!0,i=[]){for(let r=0,s=e.length;r<s;r++)Sh(e[r],this,i,n);return i.sort(rg),i}}function rg(t,e){return t.distance-e.distance}function Sh(t,e,n,i){let r=!0;if(t.layers.test(e.layers)&&t.raycast(e,n)===!1&&(r=!1),r===!0&&i===!0){const s=t.children;for(let a=0,o=s.length;a<o;a++)Sh(s[a],e,n,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:_f}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=_f);function vv(t){const e=atob(t.data),n=new Uint8Array(e.length);for(let c=0;c<e.length;c++)n[c]=e.charCodeAt(c);const i=new Uint16Array(n.buffer),{quantise_min_m:r,quantise_max_m:s,resolution:a}=t,o=(s-r)/65535,l=new Float32Array(i.length);for(let c=0;c<i.length;c++)l[c]=r+i[c]*o;return{heights:l,resolution:a,sizeM:t.size_m,minM:r,maxM:s}}function qs(t,e,n){const{heights:i,resolution:r,sizeM:s}=t,a=s/(r-1),o=Math.min(Math.max(e/a,0),r-1.001),l=Math.min(Math.max(n/a,0),r-1.001),c=Math.floor(o),u=Math.floor(l),d=o-c,f=l-u,p=i[u*r+c],_=i[u*r+c+1],v=i[(u+1)*r+c],m=i[(u+1)*r+c+1];return(p*(1-d)+_*d)*(1-f)+(v*(1-d)+m*d)*f}const OA=`
  varying vec3 vWorldPos;
  varying vec3 vNormal;
  varying float vSlope;

  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;

    vNormal = normalize(normalMatrix * normal);
    // Slope: 0 on flat ground, 1 on a vertical face.
    vSlope = 1.0 - clamp(dot(normalize(normal), vec3(0.0, 1.0, 0.0)), 0.0, 1.0);

    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`,zA=`
  precision highp float;

  varying vec3 vWorldPos;
  varying vec3 vNormal;
  varying float vSlope;

  uniform vec3 uSunDirection;
  uniform vec3 uSunColor;
  uniform vec3 uSkyColor;
  uniform vec3 uGroundColor;
  uniform vec3 uFogColor;
  uniform float uFogDensity;
  uniform float uSnowLine;
  uniform float uValleyFloor;
  uniform float uPeak;
  uniform vec3 uCameraPos;
  uniform sampler2D uImagery;
  uniform float uHasImagery;
  uniform float uSize;
  uniform vec2 uOrigin;      // world XZ of this surface's south-west corner
  uniform float uInner;      // > 0: hide the playable square [0, uInner]^2

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }

  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + 17.1; a *= 0.5; }
    return v;
  }

  // Ridged noise for rock relief: sharp crests read as fractured stone
  // rather than the soft blobs plain fbm gives.
  float ridged(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * (1.0 - abs(noise(p) * 2.0 - 1.0));
      p = p * 2.11 + 9.7; a *= 0.5;
    }
    return v;
  }

  void main() {
    // The surrounding-terrain surface is cut away over the playable map,
    // which is drawn separately at full resolution.
    if (uInner > 0.0 && vWorldPos.x > 0.5 && vWorldPos.x < uInner - 0.5
        && vWorldPos.z > 0.5 && vWorldPos.z < uInner - 0.5) discard;

    float altitude = vWorldPos.y;
    float dist = length(uCameraPos - vWorldPos);
    vec3 baseNormal = normalize(vNormal);

    float relief = max(uPeak - uValleyFloor, 1.0);
    float h = clamp((altitude - uValleyFloor) / relief, 0.0, 1.0);

    // --- procedural bump ------------------------------------------------
    // The mesh is 8-20 m per cell; anything finer has to come from the
    // shader. Perturb the normal with the gradient of a ridged field so close
    // shots show broken rock, and fade it with distance so far ridges do not
    // shimmer.
    float detailFade = 1.0 - smoothstep(350.0, 1600.0, dist);
    vec2 q = vWorldPos.xz * 0.055;
    float e = 0.35;
    float r0 = ridged(q);
    float rx = ridged(q + vec2(e, 0.0));
    float rz = ridged(q + vec2(0.0, e));
    float rockiness = smoothstep(0.18, 0.55, vSlope);
    vec3 bump = vec3(r0 - rx, 0.0, r0 - rz) * (1.6 + 2.4 * rockiness) * detailFade;
    vec3 normal = normalize(baseNormal + bump);

    float largeDetail = fbm(vWorldPos.xz * 0.012);
    float fine = fbm(vWorldPos.xz * 0.35);

    // --- materials --------------------------------------------------------
    vec3 meadow  = vec3(0.30, 0.36, 0.20);   // alpine grass, valley floor
    vec3 moraine = vec3(0.47, 0.43, 0.36);   // glacial debris, lower slopes
    vec3 scree   = vec3(0.56, 0.53, 0.48);   // loose talus below cliffs
    vec3 granite = vec3(0.40, 0.37, 0.35);   // bare rock faces
    vec3 darkRock= vec3(0.24, 0.22, 0.22);   // wet / shadowed rock, lichen
    vec3 snow    = vec3(0.95, 0.96, 0.98);

    float grassToMoraine = smoothstep(0.05, 0.26, h + largeDetail * 0.14 - 0.07);
    vec3 albedo = mix(meadow, moraine, grassToMoraine);
    albedo = mix(albedo, scree, smoothstep(0.22, 0.45, vSlope) * (1.0 - rockiness * 0.6));

    // Rock faces, with sedimentary strata: horizontal banding on steep
    // ground is what makes a cliff read as geology rather than clay.
    float strata = 0.5 + 0.5 * sin(altitude * 0.19 + largeDetail * 9.0);
    strata = smoothstep(0.25, 0.9, strata);
    vec3 rock = mix(darkRock, granite, 0.45 + 0.55 * strata);
    rock = mix(rock, darkRock, smoothstep(0.55, 0.8, fine) * 0.5);   // lichen
    albedo = mix(albedo, rock, rockiness);

    // Snow: holds on gentle slopes above the line, slides off steep faces,
    // and drifts into the lee of ridges (modelled as noise on the band).
    float snowBand = smoothstep(uSnowLine - 140.0, uSnowLine + 180.0,
                                altitude + largeDetail * 160.0 - 80.0);
    float snowHold = 1.0 - smoothstep(0.38, 0.66, vSlope - fine * 0.08);
    float snowAmount = clamp(snowBand * snowHold, 0.0, 1.0);
    albedo = mix(albedo, snow, snowAmount);

    albedo *= 0.86 + 0.28 * fine;

    // Real theatres: drape the Sentinel-2 imagery. It already contains the
    // real snow, scree, vegetation and river beds, so it replaces the
    // procedural classification; the procedural fine detail is kept only as
    // a subtle modulation so close shots are not a smooth blur.
    if (uHasImagery > 0.5) {
      vec3 sat = texture2D(uImagery, (vWorldPos.xz - uOrigin) / uSize).rgb;
      albedo = sat * (0.93 + 0.14 * fine);
      snowAmount = 0.0;
    }

    // --- lighting ---------------------------------------------------------
    float ndl = max(dot(normal, uSunDirection), 0.0);

    // Valley occlusion: deep valley floors receive less sky light than
    // exposed ridges. Cheap stand-in for ambient occlusion.
    float occlusion = mix(0.62, 1.0, pow(h, 0.45));

    float hemi = 0.5 + 0.5 * normal.y;
    vec3 ambient = mix(uGroundColor, uSkyColor, hemi) * 0.42 * occlusion;

    // Slightly wrapped diffuse keeps shadowed faces readable without
    // flattening the terminator.
    float wrapped = (ndl + 0.12) / 1.12;
    vec3 diffuse = uSunColor * wrapped;

    vec3 lighting = ambient + diffuse;
    // Satellite imagery has the sun's shading baked in; applying full
    // lighting on top would darken shadowed slopes twice.
    lighting = mix(lighting, vec3(1.0), uHasImagery * 0.45);
    vec3 color = albedo * lighting;

    // Snow in shade picks up the blue of the sky
    color = mix(color, color * vec3(0.86, 0.92, 1.08), snowAmount * (1.0 - ndl));

    vec3 viewDir = normalize(uCameraPos - vWorldPos);
    vec3 halfVec = normalize(uSunDirection + viewDir);
    float spec = pow(max(dot(normal, halfVec), 0.0), 64.0);
    color += uSunColor * spec * snowAmount * 0.35;

    // --- aerial perspective -------------------------------------------------
    float fogAmount = 1.0 - exp(-pow(dist * uFogDensity, 1.6));
    float heightFalloff = exp(-max(altitude - uValleyFloor, 0.0) * 0.0006);
    fogAmount = clamp(fogAmount * mix(0.7, 1.0, heightFalloff), 0.0, 0.97);
    color = mix(color, uFogColor, fogAmount);

    // Filmic tonemap + gamma
    color = color / (color + vec3(0.78));
    color = pow(color, vec3(1.0 / 2.2));

    gl_FragColor = vec4(color, 1.0);
  }
`;function xv({minM:t,maxM:e,snowLine:n,sizeM:i,originX:r=0,originZ:s=0,inner:a=0}){return new jn({vertexShader:OA,fragmentShader:zA,uniforms:{uSunDirection:{value:Lf.clone()},uSunColor:{value:new Ce(16774112).multiplyScalar(1.15)},uSkyColor:{value:new Ce(12375792)},uGroundColor:{value:new Ce(7037527)},uFogColor:{value:Df.clone()},uFogDensity:{value:1/16e3},uSnowLine:{value:n},uValleyFloor:{value:t},uPeak:{value:e},uCameraPos:{value:new N},uImagery:{value:null},uHasImagery:{value:0},uSize:{value:i},uOrigin:{value:new Oe(r,s)},uInner:{value:a}}})}function sg(t,e,n){e&&new fv().load(`data:image/jpeg;base64,${e}`,i=>{i.colorSpace=tn,i.anisotropy=n.capabilities.getMaxAnisotropy(),i.wrapS=i.wrapT=Zi,i.generateMipmaps=!0,i.minFilter=Ji,t.uniforms.uImagery.value=i,t.uniforms.uHasImagery.value=1})}function BA(t,e,{snowLine:n=1350}={}){const i=vv({data:t.data,quantise_min_m:t.quantise_min_m,quantise_max_m:t.quantise_max_m,resolution:t.resolution,size_m:t.size_m}),r=t.size_m,s=t.origin_m,a=t.resolution-1,o=new Xr(r,r,a,a);o.rotateX(-Math.PI/2);const l=o.attributes.position;for(let d=0;d<l.count;d++){const f=l.getX(d)+r/2,p=l.getZ(d)+r/2;l.setY(d,qs(i,f,p)-1)}o.computeVertexNormals();const c=xv({minM:e.minM,maxM:e.maxM,snowLine:n,sizeM:r,originX:s,originZ:s,inner:e.sizeM}),u=new Ne(o,c);return u.position.set(s+r/2,0,s+r/2),u.frustumCulled=!1,u.name="terrain-context",u.userData.decoded=i,u.userData.origin=s,u}function HA(t,e,n=180,i=512){const{sizeM:r}=t,s=[],a=u=>{for(let d=0;d<i;d++){const[f,p]=u(d/i),[_,v]=u((d+1)/i),m=qs(t,f,p),h=qs(t,_,v);s.push(f,m,p,_,h,v,f,m-n,p,_,h,v,_,h-n,v,f,m-n,p)}};a(u=>[u*r,0]),a(u=>[r,u*r]),a(u=>[r-u*r,r]),a(u=>[0,r-u*r]);const o=new lt;o.setAttribute("position",new ft(s,3)),o.computeVertexNormals();const l=e.clone();l.side=yt,l.uniforms=e.uniforms;const c=new Ne(o,l);return c.frustumCulled=!1,c.name="terrain-skirt",c}function GA(t,{segments:e=640,snowLine:n=1350,imagery:i=null}={}){const{sizeM:r,minM:s,maxM:a}=t,o=new Xr(r,r,e,e);o.rotateX(-Math.PI/2);const l=o.attributes.position;for(let d=0;d<l.count;d++){const f=l.getX(d)+r/2,p=l.getZ(d)+r/2;l.setY(d,qs(t,f,p))}o.computeVertexNormals(),o.computeBoundingSphere();const c=xv({minM:s,maxM:a,snowLine:n,sizeM:r});i&&(c.uniforms.uImagery.value=i,c.uniforms.uHasImagery.value=1);const u=new Ne(o,c);return u.position.set(r/2,0,r/2),u.receiveShadow=!0,u.frustumCulled=!1,u.name="terrain",u}const Lf=new N(.52,.62,.58).normalize(),Df=new Ce(13226973);function VA(t=6e4){const e=new un(t,48,32),n=new jn({side:Yt,depthWrite:!1,uniforms:{uZenith:{value:new Ce(3104150)},uMid:{value:new Ce(8037327)},uHorizon:{value:Df.clone()},uSunDirection:{value:Lf.clone()},uSunColor:{value:new Ce(16774368)}},vertexShader:`
      varying vec3 vDirection;
      void main() {
        vDirection = normalize(position);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,fragmentShader:`
      varying vec3 vDirection;
      uniform vec3 uZenith;
      uniform vec3 uMid;
      uniform vec3 uHorizon;
      uniform vec3 uSunDirection;
      uniform vec3 uSunColor;
      void main() {
        vec3 dir = normalize(vDirection);
        float h = dir.y;
        vec3 color = h > 0.0
          ? mix(mix(uHorizon, uMid, smoothstep(0.0, 0.18, h)), uZenith, smoothstep(0.18, 0.85, h))
          : uHorizon;
        float sun = max(dot(dir, uSunDirection), 0.0);
        color += uSunColor * pow(sun, 6.0) * 0.18;     // broad forward scatter
        color += uSunColor * pow(sun, 900.0) * 1.2;    // sun disc
        // thin band of extra haze sitting right on the horizon
        color = mix(color, uHorizon * 1.04, exp(-abs(h) * 22.0) * 0.55);
        gl_FragColor = vec4(color, 1.0);
      }
    `}),i=new Ne(e,n);return i.frustumCulled=!1,i.name="sky",i}const Fu={SCOUT:748491,RELAY:1018463,GCS_RELAY:8540383,STANDBY:7041664,HOSTILE:14427686,KILLED:12131356};function ll(t,e){return e==="KILLED"?Fu.KILLED:Fu[t]??Fu.STANDBY}const gt={};function jA(){if(gt.glow)return gt.glow;const t=128,e=document.createElement("canvas");e.width=e.height=t;const n=e.getContext("2d"),i=n.createRadialGradient(t/2,t/2,0,t/2,t/2,t/2);return i.addColorStop(0,"rgba(255,255,255,1)"),i.addColorStop(.18,"rgba(255,255,255,0.85)"),i.addColorStop(.42,"rgba(255,255,255,0.22)"),i.addColorStop(1,"rgba(255,255,255,0)"),n.fillStyle=i,n.fillRect(0,0,t,t),gt.glow=new RA(e),gt.glow.colorSpace=tn,gt.glow}function WA(){return gt.initialised||(gt.bodyGeo=new si(1.5,.42,2),gt.canopyGeo=new un(.52,16,12,0,Math.PI*2,0,Math.PI*.55),gt.armGeo=new On(.1,.13,2.5,8),gt.motorGeo=new On(.2,.24,.36,12),gt.hubGeo=new On(.07,.07,.16,8),gt.bladeGeo=new si(2.05,.035,.17),gt.discGeo=new Rf(1.05,28),gt.gimbalGeo=new un(.27,14,12),gt.lensGeo=new On(.11,.13,.12,12),gt.legGeo=new On(.045,.045,.72,6),gt.skidGeo=new si(.09,.07,1.5),gt.navGeo=new un(.1,8,8),gt.carbon=new Qi({color:2303790,roughness:.55,metalness:.35}),gt.darkPlastic=new Qi({color:1316636,roughness:.8,metalness:.1}),gt.metal=new Qi({color:9080985,roughness:.32,metalness:.85}),gt.glass=new Qi({color:1054239,roughness:.12,metalness:.5}),gt.initialised=!0),gt}function ag(t="SCOUT",e=""){const n=WA(),i=new Gt;i.name=`drone-${e}`;const r=new Qi({color:ll(t,"ACTIVE"),roughness:.4,metalness:.25,emissive:new Ce(ll(t,"ACTIVE")),emissiveIntensity:.22}),s=new Ne(n.bodyGeo,n.carbon);s.castShadow=!0,i.add(s);const a=new Ne(n.canopyGeo,r);a.position.set(0,.2,.25),a.castShadow=!0,i.add(a);const o=[];[[1,1],[-1,1],[-1,-1],[1,-1]].forEach(([_,v],m)=>{const h=new Ne(n.armGeo,n.carbon);h.position.set(_*.82,.02,v*.82),h.rotation.set(Math.PI/2,0,_*v>0?-Math.PI/4:Math.PI/4),h.castShadow=!0,i.add(h);const x=new Ne(n.motorGeo,n.metal);x.position.set(_*1.55,.14,v*1.55),x.castShadow=!0,i.add(x);const S=new Ne(n.hubGeo,n.darkPlastic);S.position.set(_*1.55,.38,v*1.55),i.add(S);const M=new Gt;M.position.set(_*1.55,.44,v*1.55);const P=new Ne(n.bladeGeo,n.darkPlastic),C=new Ne(n.bladeGeo,n.darkPlastic);C.rotation.y=Math.PI/2,M.add(P,C);const A=new Ne(n.discGeo,new bt({color:14673646,transparent:!0,opacity:0,side:yt,depthWrite:!1}));A.rotation.x=-Math.PI/2,A.position.y=.01,M.add(A),M.userData.direction=m%2===0?1:-1,M.userData.disc=A,M.userData.blades=[P,C],i.add(M),o.push(M)});const c=new Ne(n.gimbalGeo,n.darkPlastic);c.position.set(0,-.32,.52),i.add(c);const u=new Ne(n.lensGeo,n.glass);u.position.set(0,-.42,.72),u.rotation.x=Math.PI/2.2,i.add(u),[-1,1].forEach(_=>{const v=new Ne(n.legGeo,n.carbon);v.position.set(_*.55,-.5,0),v.rotation.z=_*.22,i.add(v);const m=new Ne(n.skidGeo,n.carbon);m.position.set(_*.68,-.85,0),i.add(m)});const d=[];[{color:16723245,pos:[-1.62,.2,1.62]},{color:2293610,pos:[1.62,.2,1.62]},{color:16777215,pos:[0,.3,-1.05]}].forEach(({color:_,pos:v})=>{const m=new Ne(n.navGeo,new bt({color:_,transparent:!0,opacity:.95}));m.position.set(...v),i.add(m),d.push(m)});const p=new bA(new uv({map:jA(),color:ll(t,"ACTIVE"),transparent:!0,opacity:.9,depthWrite:!1,blending:eo}));return p.scale.set(4,4,1),i.add(p),i.userData={rotors:o,navLights:d,strobe:p,accent:r,role:t,id:e,strobePhase:Math.random()*Math.PI*2,spin:0},i.update=(_,v={},m=1)=>{const h=i.userData,x=v.status==="KILLED",S=1.9*9.81,M=x?0:Math.min((v.thrust??S)/S,2),P=x?0:55+M*45;h.spin+=(P-h.spin)*Math.min(_*3,1),h.rotors.forEach(b=>{b.rotation.y+=b.userData.direction*h.spin*_;const z=Math.min(h.spin/40,1);b.userData.disc.material.opacity=z*.3,b.userData.blades.forEach(y=>{y.material=y.material,y.visible=z<.92})}),h.strobePhase+=_*7.5;const C=x?0:Math.max(0,Math.sin(h.strobePhase))**6;h.strobe.material.opacity=.25+C*.75,h.strobe.scale.setScalar(3+C*3);const A=ll(h.role,v.status);h.strobe.material.color.setHex(A),h.accent.color.setHex(A),h.accent.emissive.setHex(A),h.accent.emissiveIntensity=x?0:.22,h.navLights.forEach(b=>{b.material.opacity=x?.15:.95}),i.scale.setScalar(m)},i}const og=["establishing","chase","low_orbit","ridge_pass","formation","top_down"];function ka(t,e,n,i){return t+(e-t)*(1-Math.exp(-n*i))}function cl(t,e,n,i){return t.x=ka(t.x,e.x,n,i),t.y=ka(t.y,e.y,n,i),t.z=ka(t.z,e.z,n,i),t}class XA{constructor(e,n){this.camera=e,this.terrain=n,this.enabled=!0,this.shotIndex=0,this.shotName="establishing",this.shotElapsed=0,this.shotDuration=12,this.orbitAngle=Math.random()*Math.PI*2,this.position=new N(600,1200,1800),this.lookAt=new N(1200,750,2200),this.targetPosition=this.position.clone(),this.targetLookAt=this.lookAt.clone(),this.fov=55,this.targetFov=55,this.subjectId=null,this._lastSubject=new N(1200,750,2200),this.manual=!1,this.manualOrbit={theta:.7,phi:1,radius:900},this.manualTarget=new N(1200,750,2200)}cutTo(e,n=null,i=null){this.shotName=e,this.subjectId=n,this.shotElapsed=0,this.shotDuration=i??this._defaultDuration(e),this.orbitAngle=Math.random()*Math.PI*2}_defaultDuration(e){return{establishing:13,chase:11,low_orbit:10,ridge_pass:11,formation:9,top_down:8}[e]??10}onEvent(e){var i,r;if(!this.enabled||this.manual)return;const n=e.type||"";n==="KILL_NODE"||n.includes("NODE")?this.cutTo("low_orbit",((i=e.params)==null?void 0:i.drone_id)??null,9):n.includes("JAMMING")?this.cutTo("establishing",null,8):n.includes("INTERVENTION_EXECUTED")?this.cutTo("chase",e.drone_id??null,8):n==="INTERCEPTOR"&&(e.message||"").includes("launched")?this.cutTo("chase",((r=e.params)==null?void 0:r.interceptor_id)??null,60):n==="JAMMER_DESTROYED"?this.cutTo("strike","STRIKE",7):n==="SURVEY_COMPLETE"&&this.cutTo("top_down",e.drone??null,7)}beginManual(e){this.manual=!0,this.enabled=!1,e&&this.manualTarget.copy(e);const n=this.position.clone().sub(this.manualTarget);this.manualOrbit.radius=Math.max(n.length(),60),this.manualOrbit.theta=Math.atan2(n.x,n.z),this.manualOrbit.phi=Math.acos(vt.clamp(n.y/this.manualOrbit.radius,-1,1))}orbit(e,n){this.manualOrbit.theta-=e*.005,this.manualOrbit.phi=vt.clamp(this.manualOrbit.phi-n*.005,.08,Math.PI*.495)}zoom(e){this.manualOrbit.radius=vt.clamp(this.manualOrbit.radius*(1+e*.0012),40,6e3)}resume(){this.manual=!1,this.enabled=!0,this.cutTo("establishing")}update(e,n,i,r){if(this.manual){this._updateManual(e);return}if(!this.enabled)return;this.shotElapsed+=e,this.shotElapsed>this.shotDuration&&(this.shotIndex=(this.shotIndex+1)%og.length,this.cutTo(og[this.shotIndex]));const s=this._resolveSubject(n),a=this._swarmCentroid(n),o=this.shotElapsed;let l=new N,c=s.clone(),u=52;switch(this.shotName){case"establishing":{const v=this.orbitAngle+o*.045,m=1500-o*22;l.set(a.x+Math.cos(v)*m,a.y+620-o*12,a.z+Math.sin(v)*m),c=a.clone(),u=46;break}case"chase":{const v=this._subjectVelocity(n),m=v.lengthSq()>1?v.clone().normalize().multiplyScalar(-46):new N(-46,0,0);l.copy(s).add(m).add(new N(0,17,0)),c=s.clone().add(v.clone().multiplyScalar(1.6)),u=58;break}case"strike":{const v=this.orbitAngle+o*.18;l.set(s.x+Math.cos(v)*280,s.y+110,s.z+Math.sin(v)*280),c=s.clone(),u=50;break}case"low_orbit":{const v=this.orbitAngle+o*.42,m=34;l.set(s.x+Math.cos(v)*m,s.y+7+Math.sin(o*.5)*4,s.z+Math.sin(v)*m),u=50;break}case"ridge_pass":{const v=this._nearbyHighGround(a);l.copy(v),c=a.clone(),u=40;break}case"formation":{const v=this.orbitAngle+o*.12,m=150;l.set(a.x+Math.cos(v)*m,a.y+40,a.z+Math.sin(v)*m),c=a.clone(),u=55;break}case"top_down":{l.set(s.x+18,s.y+145,s.z+18),c=s.clone(),u=48;break}default:l.copy(a).add(new N(200,120,200))}const d=this.terrain?this.terrain.heightAt(l.x,l.z):0;l.y=Math.max(l.y,d+22),this._clearSightLine(l,c),this.targetPosition.copy(l),this.targetLookAt.copy(c),this.targetFov=u;const f=vt.clamp(this.shotElapsed/1.6,0,1),p=vt.lerp(6.5,1.5,f),_=vt.lerp(7.5,2.6,f);cl(this.position,this.targetPosition,p,e),cl(this.lookAt,this.targetLookAt,_,e),this.fov=ka(this.fov,this.targetFov,2,e),this._apply()}_updateManual(e){const{theta:n,phi:i,radius:r}=this.manualOrbit,s=new N(this.manualTarget.x+r*Math.sin(i)*Math.sin(n),this.manualTarget.y+r*Math.cos(i),this.manualTarget.z+r*Math.sin(i)*Math.cos(n));if(s.y=Math.max(s.y,this._floorAt(s.x,s.z)),this.terrain){const a=this.manualTarget.clone();a.y=Math.max(a.y,this.terrain.heightAt(a.x,a.z))+25,this._clearSightLine(s,a,6)}cl(this.position,s,9,e),cl(this.lookAt,this.manualTarget,9,e),this.fov=ka(this.fov,55,5,e),this._apply()}_apply(){this.terrain&&(this.position.y=Math.max(this.position.y,this._floorAt(this.position.x,this.position.z))),this.camera.position.copy(this.position),this.camera.lookAt(this.lookAt),Math.abs(this.camera.fov-this.fov)>.01&&(this.camera.fov=this.fov,this.camera.updateProjectionMatrix())}_floorAt(e,n,i=14){if(!this.terrain)return-1/0;const r=25;return Math.max(this.terrain.heightAt(e,n),this.terrain.heightAt(e+r,n),this.terrain.heightAt(e-r,n),this.terrain.heightAt(e,n+r),this.terrain.heightAt(e,n-r))+i}_clearSightLine(e,n,i=12){if(!this.terrain)return;const r=24;for(let s=0;s<6;s++){let a=0;for(let o=1;o<r;o++){const l=o/r,c=e.x+(n.x-e.x)*l,u=e.z+(n.z-e.z)*l,d=e.y+(n.y-e.y)*l,f=this.terrain.heightAt(c,u)+i-d;f>0&&(a=Math.max(a,f/Math.max(1-l,.08)))}if(a<=0)return;e.y+=Math.min(a,400)}}_resolveSubject(e){var s,a;const n=Object.entries(e||{});if(!n.length)return this._lastSubject.clone();let i=null;this.subjectId&&e[this.subjectId]?i=e[this.subjectId]:i=((s=n.find(([,o])=>o.role==="SCOUT"&&o.status!=="KILLED"))==null?void 0:s[1])??((a=n.find(([,o])=>o.status!=="KILLED"))==null?void 0:a[1])??n[0][1];const r=i.position;return this._lastSubject.set(r[0],r[2],r[1]),this._lastSubject.clone()}_subjectVelocity(e){var s,a;const n=Object.entries(e||{}),i=this.subjectId&&e[this.subjectId]||((s=n.find(([,o])=>o.role==="SCOUT"&&o.status!=="KILLED"))==null?void 0:s[1])||((a=n[0])==null?void 0:a[1]);if(!(i!=null&&i.velocity))return new N;const r=i.velocity;return new N(r[0],r[2],r[1])}_swarmCentroid(e){const n=Object.values(e||{}).filter(r=>r.status!=="KILLED"&&r.role!=="INTERCEPTOR");if(!n.length)return this._lastSubject.clone();const i=n.reduce((r,s)=>(r.x+=s.position[0],r.y+=s.position[2],r.z+=s.position[1],r),{x:0,y:0,z:0});return new N(i.x/n.length,i.y/n.length,i.z/n.length)}_nearbyHighGround(e){if(!this.terrain)return e.clone().add(new N(300,300,300));let n=null,i=-1/0;for(let r=0;r<12;r++){const s=r/12*Math.PI*2,a=420,o=e.x+Math.cos(s)*a,l=e.z+Math.sin(s)*a,c=this.terrain.heightAt(o,l);c>i&&(i=c,n=new N(o,c+45,l))}return n??e.clone().add(new N(300,300,300))}getStatus(){return{shot:this.shotName,manual:this.manual,subject:this.subjectId,remaining:Math.max(0,this.shotDuration-this.shotElapsed)}}}function en(t){return new N(t[0],t[2],t[1])}const $A=new Ce(1018463),YA=new Ce(14251782),qA=new Ce(14427686);class KA{constructor(e){Bf(this,"_animate",()=>{var o,l,c;if(this.disposed)return;this._frame=requestAnimationFrame(this._animate);const e=Math.min(this.clock.getDelta(),.1),n=this.telemetry;for(const[,u]of this.drones){const d=u.model,f=1-Math.exp(-9*e);if(d.position.lerp(u.target,f),u.targetYaw!==void 0){let m=u.targetYaw-d.rotation.y;for(;m>Math.PI;)m-=Math.PI*2;for(;m<-Math.PI;)m+=Math.PI*2;d.rotation.y+=m*f}const p=(o=u.state)==null?void 0:o.velocity;if(p){const m=Math.hypot(p[0],p[1]),h=Math.min(m/22,1)*.34,x=d.rotation.y,S=p[0]*Math.cos(x)-p[1]*Math.sin(x),M=p[0]*Math.sin(x)+p[1]*Math.cos(x),P=Math.max(Math.hypot(S,M),.001);d.rotation.x+=(M/P*h-d.rotation.x)*f,d.rotation.z+=(-S/P*h-d.rotation.z)*f}const _=this.camera.position.distanceTo(d.position),v=vt.clamp(_/220,1,9);d.update(e,u.state||{},v)}const i={...(n==null?void 0:n.drones)||{}},r=performance.now();for(const[u,d]of this.interceptors){if(!d.state||d.state.done)continue;const f=d.state.velocity,p=Math.min((r-d.receivedAt)/1e3,.12),_=d.target.clone().add(new N(f[0],f[2],f[1]).multiplyScalar(p));d.model.position.lerp(_,1-Math.exp(-20*e));const v=new N(f[0],f[2],f[1]);v.lengthSq()>1&&d.model.lookAt(d.model.position.clone().add(v));const m=this.camera.position.distanceTo(d.model.position);d.model.scale.setScalar(vt.clamp(m/120,1,14)*1.6),d.model.userData.strobe.visible=Math.floor(r/250)%2===0;const h=d.model.position;i[u]={position:[h.x,h.z,h.y],velocity:f,role:"INTERCEPTOR",status:"ACTIVE"}}for(const[,u]of this.enemies){if(!u.state)continue;const d=u.state.velocity,f=Math.min((r-u.receivedAt)/1e3,.12),p=u.target.clone().add(new N(d[0],d[2],d[1]).multiplyScalar(f));u.model.position.lerp(p,1-Math.exp(-16*e)),u.model.rotation.y=-(u.state.heading??0);const _=this.camera.position.distanceTo(u.model.position);(c=(l=u.model).update)==null||c.call(l,e,{status:"ACTIVE"},vt.clamp(_/200,1,10))}for(const[,u]of this.stormCells){const d=u.group.userData.streaks;d&&(d.position.y=(d.position.y-e*26+1400)%1400-700)}if(this._updateRain(e),this._setCloudDeck(this._cloudBase),this._updateEffects(e),this._strikePoint&&r<this._strikeUntil){const u=this._strikePoint;i.STRIKE={position:[u.x,u.z,u.y],velocity:[0,0,0],role:"INTERCEPTOR",status:"ACTIVE"}}if(this.director&&this.director.update(e,i,(n==null?void 0:n.pois)||[],null),this.terrainMesh){const u=this.director?this.director.lookAt:this.camera.position;this.sun.position.copy(u).add(this.sunDirection.clone().multiplyScalar(2200)),this.sun.target.position.copy(u),this.sun.target.updateMatrixWorld(),this.terrainMesh.material.uniforms.uCameraPos.value.copy(this.camera.position),this.contextMesh&&this.contextMesh.material.uniforms.uCameraPos.value.copy(this.camera.position)}this.jammingDome.visible&&(this.jammingDome.material.uniforms.uTime.value+=e);for(const[,u]of this.jammers)u.dome.material.uniforms.uTime.value+=e,u.head.scale.setScalar(1+.25*Math.sin(performance.now()/180));const s=this.selectedId&&this.drones.get(this.selectedId);if(this.halo.visible=!!s,s){const u=s.model.scale.x;this.halo.position.copy(s.model.position),this.halo.scale.setScalar(u*(1+.08*Math.sin(performance.now()/220)))}const a=this.scene.getObjectByName("sky");a&&a.position.copy(this.camera.position),this.renderer.render(this.scene,this.camera)});this.container=e,this.ready=!1,this.disposed=!1,this.drones=new Map,this.links=new Map,this.poiMarkers=new Map,this.labels=new Map,this.telemetry=null,this.lastEventCount=0,this.clock=new gv,this._initRenderer(),this._initScene(),this._initInteraction()}_initRenderer(){this.renderer=new lv({antialias:!0,powerPreference:"high-performance"}),this.renderer.setSize(this.container.clientWidth,this.container.clientHeight),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=N0,this.renderer.outputColorSpace=tn,this.container.appendChild(this.renderer.domElement)}_initScene(){this.scene=new cv,this.scene.background=Df.clone(),this.camera=new gn(52,this.container.clientWidth/this.container.clientHeight,2,9e4),this.sunDirection=Lf.clone(),this.sun=new mv(16774112,2.1),this.sun.position.copy(this.sunDirection).multiplyScalar(3e3),this.sun.castShadow=!0,this.sun.shadow.mapSize.set(2048,2048),this.sun.shadow.camera.near=100,this.sun.shadow.camera.far=6e3;const e=900;Object.assign(this.sun.shadow.camera,{left:-e,right:e,top:e,bottom:-e}),this.sun.shadow.bias=-8e-4,this.scene.add(this.sun),this.scene.add(this.sun.target),this.scene.add(new DA(12375792,7037527,.75)),this.scene.add(VA()),this.linkGroup=new Gt,this.poiGroup=new Gt,this.droneGroup=new Gt,this.scene.add(this.linkGroup,this.poiGroup,this.droneGroup),this._initJammingDome(),this.cursor=new Ne(new As(14,19,40),new bt({color:1395145,transparent:!0,opacity:.85,side:yt,depthTest:!1})),this.cursor.rotation.x=-Math.PI/2,this.cursor.renderOrder=10,this.cursor.visible=!1,this.scene.add(this.cursor),this.halo=new Ne(new As(3.2,3.9,40),new bt({color:16096779,transparent:!0,opacity:.95,side:yt,depthTest:!1})),this.halo.rotation.x=-Math.PI/2,this.halo.renderOrder=11,this.halo.visible=!1,this.scene.add(this.halo),this.jammers=new Map,this.interceptors=new Map,this.enemies=new Map,this.stormCells=new Map,this.denialZones=new Map,this.rain=null,this.effects=[],this._seenStrikes=new Set,this.targets=new Map}_initJammingDome(){const e=new un(1,28,20),n=new jn({transparent:!0,depthWrite:!1,side:Yt,blending:eo,uniforms:{uTime:{value:0},uColor:{value:new Ce(14427686)},uOpacity:{value:0}},vertexShader:`
        varying vec3 vNormal;
        varying vec3 vPos;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPos = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,fragmentShader:`
        varying vec3 vNormal;
        varying vec3 vPos;
        uniform float uTime;
        uniform vec3 uColor;
        uniform float uOpacity;

        void main() {
          // Fresnel rim so the shell reads as a volume boundary
          float rim = pow(1.0 - abs(vNormal.z), 2.2);
          // Travelling interference rings
          float rings = 0.5 + 0.5 * sin(vPos.y * 22.0 - uTime * 3.0);
          float alpha = uOpacity * (0.12 + rim * 0.5) * (0.6 + rings * 0.4);
          gl_FragColor = vec4(uColor, alpha);
        }
      `});this.jammingDome=new Ne(e,n),this.jammingDome.visible=!1,this.jammingDome.frustumCulled=!1,this.scene.add(this.jammingDome)}_initInteraction(){const e=this.renderer.domElement;let n=!1,i=!1,r=0,s=0,a=0,o=0;e.addEventListener("pointerdown",c=>{n=!0,i=!1,r=a=c.clientX,s=o=c.clientY,e.setPointerCapture(c.pointerId)}),e.addEventListener("pointermove",c=>{if(n){!i&&Math.hypot(c.clientX-r,c.clientY-s)>5&&(i=!0,this.director&&!this.director.manual&&(this.director.beginManual(this.director.lookAt.clone()),this._notifyCamera())),i&&this.director&&this.director.orbit(c.clientX-a,c.clientY-o),a=c.clientX,o=c.clientY;return}this._updateHover(c)});const l=c=>{n&&!i&&this._handleClick(c),n=!1,i=!1;try{e.releasePointerCapture(c.pointerId)}catch{}};e.addEventListener("pointerup",l),e.addEventListener("pointercancel",()=>{n=!1,i=!1}),e.addEventListener("pointerleave",()=>{this.cursor&&(this.cursor.visible=!1)}),e.addEventListener("wheel",c=>{this.director&&(c.preventDefault(),this.director.manual||(this.director.beginManual(this.director.lookAt.clone()),this._notifyCamera()),this.director.zoom(c.deltaY))},{passive:!1}),this._resizeObserver=new ResizeObserver(()=>this.resize()),this._resizeObserver.observe(this.container)}_ndc(e){const n=this.renderer.domElement.getBoundingClientRect();return{x:(e.clientX-n.left)/n.width*2-1,y:-((e.clientY-n.top)/n.height)*2+1,px:e.clientX-n.left,py:e.clientY-n.top,w:n.width,h:n.height}}_terrainHit(e){if(!this.terrainLookup)return null;const n=this._ndc(e),i=new _v;i.setFromCamera({x:n.x,y:n.y},this.camera);const r=i.ray.origin,s=i.ray.direction,a=this.terrainData.sizeM;let o=0;const l=6;for(let c=l;c<9e3;c+=l){const u=r.x+s.x*c,d=r.z+s.z*c,f=r.y+s.y*c;if(u<0||d<0||u>a||d>a){if(c>200&&(u<-500||d<-500||u>a+500||d>a+500))break;o=c;continue}if(f<=this.terrainLookup.heightAt(u,d)){let p=o,_=c;for(let h=0;h<10;h++){const x=(p+_)/2,S=r.x+s.x*x,M=r.z+s.z*x;r.y+s.y*x<=this.terrainLookup.heightAt(S,M)?_=x:p=x}const v=r.x+s.x*_,m=r.z+s.z*_;return new N(v,this.terrainLookup.heightAt(v,m),m)}o=c}return null}_screenPick(e){const n=this._ndc(e),i=[],r=s=>{const a=s.clone().project(this.camera);return a.z>1?null:{x:(a.x+1)/2*n.w,y:(1-a.y)/2*n.h}};for(const[s,a]of this.drones){const o=r(a.model.position);o&&i.push({kind:"drone",id:s,d:Math.hypot(o.x-n.px,o.y-n.py)})}for(const[s,a]of this.jammers){const o=r(a.mast.position);o&&i.push({kind:"jammer",id:s,d:Math.hypot(o.x-n.px,o.y-n.py)})}for(const[s,a]of this.poiMarkers){const o=r(a.group.position);o&&i.push({kind:"poi",id:s,d:Math.hypot(o.x-n.px,o.y-n.py)})}return i.sort((s,a)=>s.d-a.d),i.length&&i[0].d<28?i[0]:null}_handleClick(e){var s,a;const n=this.tool||"select";if(!(n!=="select")||n==="goto"){const o=this._screenPick(e);if(o&&n==="select"){(s=this.onPick)==null||s.call(this,o);return}}const r=this._terrainHit(e);r&&((a=this.onGroundClick)==null||a.call(this,{x:r.x,y:r.z,z:r.y},n))}_updateHover(e){if(!this.cursor)return;if((this.tool||"select")==="select"){this.cursor.visible=!1,this.renderer.domElement.style.cursor=this._screenPick(e)?"pointer":"grab";return}const i=this._terrainHit(e);if(this.renderer.domElement.style.cursor="crosshair",!i){this.cursor.visible=!1;return}this.cursor.visible=!0,this.cursor.position.set(i.x,i.y+2,i.z)}setTool(e){if(this.tool=e,!this.cursor)return;const n={add_scout:748491,add_relay:1018463,add_poi:11817737,add_jammer:14427686,goto:8141549};this.cursor.material.color.setHex(n[e]??1395145);const i=e==="add_jammer"?3.2:1;this.cursor.scale.setScalar(i),e==="select"&&(this.cursor.visible=!1)}setSelected(e){this.selectedId=e}northScreenAngle(){var s;const n=(((s=this.theatre)==null?void 0:s.rotation_k)??0)===1?new N(1,0,0):new N(0,0,1),i=new N;if(this.camera.getWorldDirection(i),i.y=0,i.lengthSq()<1e-6)return 0;i.normalize();const r=new N(-i.z,0,i.x);return Math.atan2(n.dot(r),n.dot(i))}_notifyCamera(){this.onCameraChange&&this.onCameraChange(this.director.getStatus())}_chooseTerrainDetail(){const e=this.renderer.getContext(),n=e.getExtension("WEBGL_debug_renderer_info"),i=String(n?e.getParameter(n.UNMASKED_RENDERER_WEBGL):e.getParameter(e.RENDERER));return/swiftshader|software|llvmpipe|angle \(software/i.test(i)?(console.warn("[cdawn] software rendering detected — reducing terrain detail"),192):1024}_clearWorld(){var e,n,i,r;for(const s of[this.contextMesh,this.skirtMesh])s&&(this.scene.remove(s),s.geometry.dispose(),s===this.contextMesh&&((n=(e=s.material.uniforms.uImagery.value)==null?void 0:e.dispose)==null||n.call(e),s.material.dispose()));this.contextMesh=null,this.skirtMesh=null,this.terrainMesh&&(this.scene.remove(this.terrainMesh),this.terrainMesh.geometry.dispose(),(r=(i=this.terrainMesh.material.uniforms.uImagery.value)==null?void 0:i.dispose)==null||r.call(i),this.terrainMesh.material.dispose(),this.terrainMesh=null);for(const[,s]of this.drones)this.droneGroup.remove(s.model);this.drones.clear();for(const[,s]of this.links)this.linkGroup.remove(s.line),s.geometry.dispose(),s.material.dispose();this.links.clear();for(const[,s]of this.poiMarkers)this.poiGroup.remove(s.group);this.poiMarkers.clear();for(const[,s]of this.jammers)this.scene.remove(s.dome,s.mast);this.jammers.clear();for(const[,s]of this.ewMarkers||[])this.scene.remove(s.group);this.ewMarkers=new Map,this.ewMarker=null;for(const[,s]of this.interceptors)this.scene.remove(s.model,s.trail);this.cloudDeck&&(this.scene.remove(this.cloudDeck),this.cloudDeck=null);for(const[,s]of this.enemies)this.scene.remove(s.model,s.trail);this.enemies.clear();for(const[,s]of this.stormCells)this.scene.remove(s.group);this.stormCells.clear();for(const[,s]of this.denialZones)this.scene.remove(s.group);this.denialZones.clear(),this.interceptors.clear(),this.effects.forEach(s=>this.scene.remove(s.flash,s.smoke,s.light)),this.effects=[];for(const[,s]of this.targets)this.scene.remove(s.line,s.marker);this.targets.clear()}loadTerrain(e){var l,c;this.ready=!1,this._clearWorld();const n=vv(e);this.terrainData=n,this.terrainChecksum=e.checksum,this.theatre=e.theatre||null;const i=e.snow_line_m??1350;this.terrainMesh=GA(n,{segments:Math.min(this._chooseTerrainDetail(),n.resolution-1),snowLine:i}),this.scene.add(this.terrainMesh),sg(this.terrainMesh.material,e.imagery_jpeg_b64,this.renderer),this.skirtMesh=HA(n,this.terrainMesh.material),this.scene.add(this.skirtMesh),e.context&&(this.contextMesh=BA(e.context,n,{snowLine:i}),this.scene.add(this.contextMesh),sg(this.contextMesh.material,e.context.imagery_jpeg_b64,this.renderer));const r=n.sizeM,s=(l=this.contextMesh)==null?void 0:l.userData.decoded,a=((c=this.contextMesh)==null?void 0:c.userData.origin)??0,o={heightAt:(u,d)=>!s||u>=0&&d>=0&&u<=r&&d<=r?qs(n,u,d):qs(s,u-a,d-a)};this.terrainLookup=o,this.director=new XA(this.camera,o),this.director.position.set(r*.12,n.maxM+500,r*.5),this.director.lookAt.set(r*.5,n.minM,r*.5),this.director.cutTo("establishing"),this.ready=!0,this.start()}setTelemetry(e){this.telemetry=e,!(!this.ready||!e)&&(this._syncDrones(e.drones||{}),this._syncPois(e.pois||[]),this._syncTargets(e.drones||{}),this._syncJamming(e),this._syncInterceptors(e.interceptors||[]),this._syncInjects(e.injects||{}),this._checkStrikes(e.events||[]),this._checkEvents(e.events||[]))}_createInterceptorModel(){const e=new Gt,n=new Qi({color:4015670,roughness:.55,metalness:.3}),i=new Ne(new On(.16,.2,2.2,10),n);i.rotation.x=Math.PI/2;const r=new Ne(new Pf(.16,.5,10),n);r.rotation.x=Math.PI/2,r.position.z=1.35;const s=new Ne(new si(2.6,.04,.34),n);s.position.z=.25;const a=new Ne(new si(.9,.04,.22),n);a.position.z=-.95;const o=new Ne(new si(.04,.45,.25),n);o.position.set(0,.22,-.95);const l=new Ne(new un(.12,8,6),new bt({color:16726832}));l.position.set(0,.28,-.95);const c=new Gt;return c.add(i,r,s,a,o,l),e.add(c),e.userData.strobe=l,e}_syncInterceptors(e){const n=new Set,i=performance.now();e.forEach(r=>{n.add(r.id);let s=this.interceptors.get(r.id);if(!s){const a=this._createInterceptorModel(),o=new Yi(new lt,new Mi({color:11817737,transparent:!0,opacity:.75}));o.frustumCulled=!1,this.scene.add(a,o),s={model:a,trail:o,trailLen:0},this.interceptors.set(r.id,s),a.position.copy(en(r.position))}s.state=r,s.target=en(r.position),s.receivedAt=i,s.model.visible=!r.done,r.trail.length!==s.trailLen&&(s.trailLen=r.trail.length,s.trail.geometry.setFromPoints(r.trail.map(en)))});for(const[r,s]of this.interceptors)n.has(r)||(this.scene.remove(s.model,s.trail),s.trail.geometry.dispose(),this.interceptors.delete(r))}_syncInjects(e){this._setRain(e.rain_mm_h||0),this._cloudBase=e.cloud_base_agl||0,this._syncEnemies(e.enemies||[]),this._syncZones(this.stormCells,e.cells||[],n=>this._makeStormCell(n)),this._syncZones(this.denialZones,e.gps_denial||[],n=>this._makeDenialZone(n))}_syncZones(e,n,i){const r=new Set;n.forEach(s=>{r.add(s.id);let a=e.get(s.id);a||(a=i(s),this.scene.add(a.group),e.set(s.id,a));const o=this.terrainLookup?this.terrainLookup.heightAt(s.x,s.y):0;a.group.position.set(s.x,o,s.y),a.zone=s});for(const[s,a]of e)r.has(s)||(this.scene.remove(a.group),e.delete(s))}_makeStormCell(e){const n=new Gt,i=e.radius_m,r=new Ne(new On(i*1.05,i*.8,1500,32,1,!0),new bt({color:3094852,transparent:!0,opacity:.17,side:yt,depthWrite:!1}));r.position.y=750;const s=[];for(let o=0;o<280;o++){const l=Math.random()*Math.PI*2,c=Math.sqrt(Math.random())*i,u=Math.cos(l)*c,d=Math.sin(l)*c,f=Math.random()*1400;s.push(u,f,d,u,f-90,d)}const a=new Du(new lt().setAttribute("position",new ft(s,3)),new Mi({color:9413560,transparent:!0,opacity:.45}));return n.add(r,a),n.userData.streaks=a,{group:n}}_makeDenialZone(e){const n=new Gt,i=e.radius_m,r=new Ne(new un(i,32,16,0,Math.PI*2,0,Math.PI/2),new bt({color:16096779,transparent:!0,opacity:.05,side:yt,depthWrite:!1})),s=[];for(let o=0;o<=128;o++){const l=o/128*Math.PI*2,c=Math.cos(l)*i,u=Math.sin(l)*i,d=this.terrainLookup?this.terrainLookup.heightAt(e.x+c,e.y+u)-this.terrainLookup.heightAt(e.x,e.y):0;s.push(new N(c,d+5,u))}const a=new qm(new lt().setFromPoints(s),new Iu({color:16096779,dashSize:40,gapSize:26,transparent:!0,opacity:.8,depthTest:!1}));return a.computeLineDistances(),a.renderOrder=8,n.add(r,a),{group:n}}_syncEnemies(e){const n=new Set,i=performance.now();e.forEach(r=>{n.add(r.id);let s=this.enemies.get(r.id);if(!s){const a=ag("HOSTILE",r.id),o=new Yi(new lt,new Mi({color:14427686,transparent:!0,opacity:.6}));o.frustumCulled=!1,this.scene.add(a,o),s={model:a,trail:o,trailLen:0},this.enemies.set(r.id,s),a.position.copy(en(r.position))}s.state=r,s.target=en(r.position),s.receivedAt=i,r.trail.length!==s.trailLen&&(s.trailLen=r.trail.length,s.trail.geometry.setFromPoints(r.trail.map(en)))});for(const[r,s]of this.enemies)n.has(r)||(this._spawnStrike(s.model.position.clone()),this.scene.remove(s.model,s.trail),s.trail.geometry.dispose(),this.enemies.delete(r))}_setCloudDeck(e){if(!e||!this.terrainMesh){this.cloudDeck&&(this.cloudDeck.visible=!1);return}if(!this.cloudDeck){const r=(this.terrainMesh.geometry.boundingBox,26e3),s=new Ne(new Xr(r,r,1,1),new bt({color:10134704,transparent:!0,opacity:.34,side:yt,depthWrite:!1}));s.rotation.x=-Math.PI/2,s.renderOrder=1,s.frustumCulled=!1,this.scene.add(s),this.cloudDeck=s}this.cloudDeck.visible=!0;const n=this.camera.position,i=this.terrainLookup?this.terrainLookup.heightAt(n.x,n.z):0;this.cloudDeck.position.set(n.x,i+e,n.z)}_setRain(e){const n=Math.min(e,60)/60;if(n<=0){this.rain&&(this.rain.points.visible=!1,this.rain.rate=0),this._setWeatherTone(0);return}if(!this.rain){const r=new Float32Array(54e3),s=new lt;s.setAttribute("position",new Sn(r,3));const a=new Du(s,new Mi({color:12570848,transparent:!0,opacity:.42}));a.frustumCulled=!1,this.scene.add(a);const o=420,l=[];for(let c=0;c<9e3;c++)l.push([(Math.random()-.5)*o,Math.random()*o,(Math.random()-.5)*o]);this.rain={points:a,seeds:l,box:o,rate:0}}this.rain.points.visible=!0,this.rain.rate=n,this.rain.points.material.opacity=.25+.4*n,this._setWeatherTone(n)}_setWeatherTone(e){var o;const n=new Ce(13226973),i=new Ce(7041658),r=n.clone().lerp(i,e);for(const l of[this.terrainMesh,this.contextMesh])l&&(l.material.uniforms.uFogColor.value.copy(r),l.material.uniforms.uFogDensity.value=1/16e3*(1+2.6*e));const s=this.scene.getObjectByName("sky"),a=(o=s==null?void 0:s.material)==null?void 0:o.uniforms;a&&(a.uHorizon.value.copy(r),a.uZenith.value.copy(new Ce(3104150).lerp(new Ce(3817801),e)),a.uMid.value.copy(new Ce(8037327).lerp(new Ce(5923436),e)),a.uSunColor&&a.uSunColor.value.copy(new Ce(16774368).lerp(new Ce(10133930),e))),this.sun&&(this.sun.intensity=1.35*(1-.55*e))}_updateRain(e){var u,d;if(!this.rain||!this.rain.rate)return;const{seeds:n,box:i,points:r}=this.rain,s=this.camera.position,a=((d=(u=this.telemetry)==null?void 0:u.wind)==null?void 0:d.velocity)||[0,0,0],o=11+6*this.rain.rate,l=r.geometry.attributes.position.array,c=Math.floor(n.length*(.25+.75*this.rain.rate));for(let f=0;f<n.length;f++){const p=n[f];if(f>=c){l[f*6]=l[f*6+3]=s.x,l[f*6+1]=l[f*6+4]=s.y-4e3,l[f*6+2]=l[f*6+5]=s.z;continue}p[1]-=o*e,p[0]+=a[0]*e*.35,p[2]+=a[1]*e*.35,p[1]<-i/2&&(p[1]=i/2,p[0]=(Math.random()-.5)*i,p[2]=(Math.random()-.5)*i),Math.abs(p[0])>i/2&&(p[0]-=Math.sign(p[0])*i),Math.abs(p[2])>i/2&&(p[2]-=Math.sign(p[2])*i);const _=s.x+p[0],v=s.y+p[1]-i/4,m=s.z+p[2];l[f*6]=_,l[f*6+1]=v,l[f*6+2]=m,l[f*6+3]=_+a[0]*.12,l[f*6+4]=v-3.2-1.6*this.rain.rate,l[f*6+5]=m+a[1]*.12}r.geometry.attributes.position.needsUpdate=!0}_checkStrikes(e){e.forEach(n=>{var r,s;if(n.type!=="JAMMER_DESTROYED")return;const i=`${n.time}-${(r=n.params)==null?void 0:r.jammer_id}`;this._seenStrikes.has(i)||(this._seenStrikes.add(i),(s=n.params)!=null&&s.position&&this._spawnStrike(en(n.params.position)))})}_spawnStrike(e){const n=new Ne(new un(1,24,16),new bt({color:16757575,transparent:!0,opacity:1,depthWrite:!1,blending:eo}));n.position.copy(e);const i=new Ne(new un(1,16,12),new bt({color:2829099,transparent:!0,opacity:.55,depthWrite:!1}));i.position.copy(e);const r=new UA(16752704,40,600,1.2);r.position.copy(e).add(new N(0,10,0)),this.scene.add(n,i,r),this.effects.push({flash:n,smoke:i,light:r,age:0}),this._strikePoint=e.clone(),this._strikeUntil=performance.now()+8e3}_updateEffects(e){this.effects=this.effects.filter(n=>{n.age+=e;const i=n.age;return n.flash.scale.setScalar(4+70*Math.min(i/.6,1)),n.flash.material.opacity=Math.max(1-i/.9,0),n.flash.visible=n.flash.material.opacity>0,n.light.intensity=Math.max(40*(1-i/.7),0),n.smoke.scale.setScalar(10+38*Math.min(i/3,1)),n.smoke.position.y+=e*6,n.smoke.material.opacity=.55*Math.max(1-i/7,0),i>7?(this.scene.remove(n.flash,n.smoke,n.light),n.flash.geometry.dispose(),n.smoke.geometry.dispose(),!1):!0})}_syncDrones(e){const n=new Set;Object.entries(e).forEach(([i,r])=>{n.add(i);let s=this.drones.get(i);if(!s){const a=ag(r.role,i);this.droneGroup.add(a),s={model:a,state:r,target:en(r.position)},this.drones.set(i,s),a.position.copy(s.target)}s.state=r,s.target=en(r.position),s.targetYaw=-(r.heading??0)});for(const[i,r]of this.drones)n.has(i)||(this.droneGroup.remove(r.model),this.drones.delete(i));this._syncLinks(e)}_syncLinks(e){const n=new Set;Object.entries(e).forEach(([i,r])=>{r.status!=="KILLED"&&Object.entries(r.neighbors||{}).forEach(([s,a])=>{if(i>=s)return;const o=e[s];if(!o||o.status==="KILLED"||a<.04)return;const l=`${i}|${s}`;n.add(l);let c=this.links.get(l);if(!c){const _=new lt;_.setAttribute("position",new Sn(new Float32Array(6),3));const v=new Mi({transparent:!0,depthWrite:!1}),m=new Yi(_,v);m.frustumCulled=!1,this.linkGroup.add(m),c={line:m,geometry:_,material:v},this.links.set(l,c)}const u=en(r.position),d=en(o.position),f=c.geometry.attributes.position.array;f[0]=u.x,f[1]=u.y,f[2]=u.z,f[3]=d.x,f[4]=d.y,f[5]=d.z,c.geometry.attributes.position.needsUpdate=!0;const p=a>.85?$A:a>.5?YA:qA;c.material.color.copy(p),c.material.opacity=.22+a*.62})});for(const[i,r]of this.links)n.has(i)||(this.linkGroup.remove(r.line),r.geometry.dispose(),r.material.dispose(),this.links.delete(i))}_syncPois(e){const n=new Set(e.map(i=>i.id));for(const[i,r]of this.poiMarkers)n.has(i)||(this.poiGroup.remove(r.group),this.poiMarkers.delete(i));e.forEach(i=>{let r=this.poiMarkers.get(i.id);if(!r){const a=new Gt,o=new Ne(new As(9,12,32),new bt({color:11817737,transparent:!0,opacity:.85,side:yt,depthWrite:!1}));o.rotation.x=-Math.PI/2,a.add(o);const l=new Ne(new On(1.1,1.1,90,8,1,!0),new bt({color:11817737,transparent:!0,opacity:.28,depthWrite:!1,side:yt}));l.position.y=45,a.add(l),a.position.copy(en(i.position)),this.poiGroup.add(a),r={group:a,ring:o,beam:l},this.poiMarkers.set(i.id,r)}const s=i.surveyed?1018463:11817737;r.ring.material.color.setHex(s),r.beam.material.color.setHex(s),r.beam.material.opacity=i.surveyed?.1:.28})}_syncJamming(e){var s,a,o,l,c,u,d,f;this._syncJammers(((s=e.rf)==null?void 0:s.jammers)||[]),this._syncEwEstimates(((o=(a=e.rf)==null?void 0:a.ew)==null?void 0:o.estimates)||((c=(l=e.rf)==null?void 0:l.ew)!=null&&c.estimate?[e.rf.ew.estimate]:[]));const n=((u=e.rf)==null?void 0:u.global_jamming)??((d=e.rf)==null?void 0:d.jamming_active);if(this.jammingDome.visible=!!n&&!(((f=e.rf)==null?void 0:f.jammers)||[]).length,!this.jammingDome.visible)return;const i=Object.values(e.drones||{}).filter(p=>p.status!=="KILLED");if(!i.length)return;const r=i.reduce((p,_)=>(p[0]+=_.position[0]/i.length,p[1]+=_.position[1]/i.length,p[2]+=_.position[2]/i.length,p),[0,0,0]);this.jammingDome.position.copy(en(r)),this.jammingDome.scale.setScalar(680),this.jammingDome.material.uniforms.uOpacity.value=.9}_syncJammers(e){const n=new Set;e.forEach(i=>{n.add(i.id);let r=this.jammers.get(i.id);if(!r){const a=new Ne(this.jammingDome.geometry,this.jammingDome.material.clone());a.frustumCulled=!1,a.material.uniforms.uOpacity.value=.9;const o=new Gt,l=new Ne(new On(1.4,2.4,34,10),new Qi({color:8330525,roughness:.6}));l.position.y=17;const c=new Ne(new un(4.5,16,12),new bt({color:15680580}));c.position.y=36,o.add(l,c),this.scene.add(a,o),r={dome:a,mast:o,head:c},this.jammers.set(i.id,r)}const s=en(i.position);r.mast.position.copy(s),r.dome.position.copy(s),r.dome.scale.setScalar(Math.max(i.radius_m,60))});for(const[i,r]of this.jammers)n.has(i)||(this.scene.remove(r.dome,r.mast),r.dome.material.dispose(),this.jammers.delete(i))}_syncEwEstimates(e){this.ewMarkers||(this.ewMarkers=new Map);const n=new Set;e.forEach(i=>{n.add(i.id||"EMIT"),this._syncEwEstimate(i,i.id||"EMIT")});for(const[i,r]of this.ewMarkers)n.has(i)||(this.scene.remove(r.group),this.ewMarkers.delete(i))}_syncEwEstimate(e,n){if(this.ewMarkers||(this.ewMarkers=new Map),!e||!this.terrainLookup)return;if(this.ewMarker=this.ewMarkers.get(n),!this.ewMarker){const c=()=>new Iu({color:16096779,dashSize:14,gapSize:9,depthTest:!1,transparent:!0,opacity:.95}),u=new qm(new lt,c()),d=new Du(new lt,new Mi({color:16096779,depthTest:!1})),f=new Yi(new lt,c());[u,d,f].forEach(_=>{_.renderOrder=9,_.frustumCulled=!1});const p=new Gt;p.add(u,d,f),this.scene.add(p),this.ewMarker={group:p,ring:u,cross:d,mast:f,key:""},this.ewMarkers.set(n,this.ewMarker)}const i=this.ewMarker;i.group.visible=!0;const r=`${e.x.toFixed(0)}|${e.y.toFixed(0)}|${e.radius_m.toFixed(0)}`;if(r===i.key)return;i.key=r;const s=(c,u)=>this.terrainLookup.heightAt(c,u)+4,a=[];for(let c=0;c<120;c++){const u=c/120*Math.PI*2,d=e.x+Math.cos(u)*e.radius_m,f=e.y+Math.sin(u)*e.radius_m;a.push(new N(d,s(d,f),f))}i.ring.geometry.setFromPoints(a),i.ring.computeLineDistances();const o=40,l=s(e.x,e.y);i.cross.geometry.setFromPoints([new N(e.x-o,s(e.x-o,e.y),e.y),new N(e.x+o,s(e.x+o,e.y),e.y),new N(e.x,s(e.x,e.y-o),e.y-o),new N(e.x,s(e.x,e.y+o),e.y+o)]),i.mast.geometry.setFromPoints([new N(e.x,l,e.y),new N(e.x,l+160,e.y)]),i.mast.computeLineDistances()}_syncTargets(e){const n=new Set;Object.entries(e).forEach(([i,r])=>{if(!r.manual_target||r.status==="KILLED")return;n.add(i);let s=this.targets.get(i);if(!s){const u=new lt;u.setAttribute("position",new Sn(new Float32Array(6),3));const d=new Yi(u,new Iu({color:8141549,dashSize:14,gapSize:9,transparent:!0,opacity:.9}));d.frustumCulled=!1;const f=new Ne(new As(10,14,32),new bt({color:8141549,transparent:!0,opacity:.9,side:yt,depthTest:!1}));f.rotation.x=-Math.PI/2,this.scene.add(d,f),s={line:d,marker:f},this.targets.set(i,s)}const a=en(r.position),o=en(r.manual_target),l=s.line.geometry.attributes.position.array;l[0]=a.x,l[1]=a.y,l[2]=a.z,l[3]=o.x,l[4]=o.y,l[5]=o.z,s.line.geometry.attributes.position.needsUpdate=!0,s.line.computeLineDistances();const c=this.terrainLookup?this.terrainLookup.heightAt(o.x,o.z):o.y;s.marker.position.set(o.x,c+2,o.z)});for(const[i,r]of this.targets)n.has(i)||(this.scene.remove(r.line,r.marker),this.targets.delete(i))}_checkEvents(e){if(!e.length||!this.director)return;const n=e[e.length-1],i=`${n.time}-${n.type}`;i!==this._lastEventSignature&&(this._lastEventSignature=i,this.director.onEvent(n),this._notifyCamera())}setShot(e,n=null){this.director&&(this.director.manual=!1,this.director.enabled=!0,this.director.cutTo(e,n),this._notifyCamera())}resumeAuto(){this.director&&(this.director.resume(),this._notifyCamera())}focusDrone(e){this.director&&(this.director.manual=!1,this.director.enabled=!0,this.director.cutTo("low_orbit",e,14),this._notifyCamera())}start(){this._running||(this._running=!0,this.clock.start(),this._animate())}resize(){if(!this.container)return;const e=this.container.clientWidth,n=this.container.clientHeight;!e||!n||(this.camera.aspect=e/n,this.camera.updateProjectionMatrix(),this.renderer.setSize(e,n))}dispose(){this.disposed=!0,this._running=!1,this._frame&&cancelAnimationFrame(this._frame),this._resizeObserver&&this._resizeObserver.disconnect(),this.scene.traverse(e=>{e.geometry&&e.geometry.dispose(),e.material&&(Array.isArray(e.material)?e.material:[e.material]).forEach(i=>i.dispose())}),this.renderer.dispose(),this.renderer.domElement.parentNode===this.container&&this.container.removeChild(this.renderer.domElement)}}const ZA=[{id:"establishing",label:"Establishing"},{id:"chase",label:"Chase"},{id:"low_orbit",label:"Close Orbit"},{id:"ridge_pass",label:"Ridge"},{id:"formation",label:"Formation"},{id:"top_down",label:"Overhead"}];function JA({telemetry:t,focusDrone:e,onFocusHandled:n,tool:i="select",selectedId:r=null,onGroundClick:s,onPick:a}){var A,b,z;const o=ye.useRef(null),l=ye.useRef(null),[c,u]=ye.useState("loading"),[d,f]=ye.useState({shot:"establishing",manual:!1}),[p,_]=ye.useState(0);ye.useEffect(()=>{const y=setInterval(()=>{const E=l.current;E&&E.ready&&_(E.northScreenAngle())},100);return()=>clearInterval(y)},[]),ye.useEffect(()=>{if(!o.current)return;const y=new KA(o.current);l.current=y,y.onCameraChange=f,typeof window<"u"&&(window.__cdawnScene=y);let E=!1;return(async()=>{try{const U=await fetch("/api/terrain",{cache:"no-store"});if(!U.ok)throw new Error(`terrain ${U.status}`);const F=await U.json();if(E)return;y.loadTerrain(F),u("ready")}catch(U){console.error("[viewport] terrain load failed",U),E||u("error")}})(),()=>{E=!0,y.dispose(),l.current=null}},[]);const v=ye.useRef(s),m=ye.useRef(a);v.current=s,m.current=a,ye.useEffect(()=>{const y=l.current;y&&(y.onGroundClick=(E,U)=>{var F;return(F=v.current)==null?void 0:F.call(v,E,U)},y.onPick=E=>{var U;return(U=m.current)==null?void 0:U.call(m,E)})},[]),ye.useEffect(()=>{var y;(y=l.current)==null||y.setTool(i)},[i,c]),ye.useEffect(()=>{var y;(y=l.current)==null||y.setSelected(r)},[r]);const h=(A=t==null?void 0:t.demo)==null?void 0:A.terrain_checksum,x=ye.useRef(null);ye.useEffect(()=>{const y=l.current;!y||!h||c==="loading"||y.terrainChecksum&&y.terrainChecksum!==h&&x.current!==h&&(x.current=h,u("loading"),fetch(`/api/terrain?c=${h}`,{cache:"no-store"}).then(E=>E.json()).then(E=>{y.loadTerrain(E),u("ready")}).catch(()=>{x.current=null,u("error")}))},[h,c]),ye.useEffect(()=>{l.current&&t&&l.current.setTelemetry(t)},[t]),ye.useEffect(()=>{e&&l.current&&(l.current.focusDrone(e),n==null||n())},[e,n]);const S=y=>{var E;return(E=l.current)==null?void 0:E.setShot(y)},M=()=>{var y;return(y=l.current)==null?void 0:y.resumeAuto()},C=((t==null?void 0:t.rf)||{}).jamming_active;return g.jsxs("div",{className:"viewport",children:[g.jsx("div",{ref:o,className:"viewport__canvas"}),c!=="ready"&&g.jsx("div",{className:"viewport__loading",children:g.jsx("div",{children:c==="error"?g.jsxs(g.Fragment,{children:[g.jsx("div",{style:{fontWeight:700,marginBottom:6},children:"Terrain unavailable"}),g.jsx("div",{children:"The simulation node is not reachable."})]}):g.jsxs(g.Fragment,{children:[g.jsx("div",{className:"spinner"}),g.jsx("div",{style:{fontWeight:600},children:"Loading terrain model"}),g.jsxs("div",{style:{fontSize:11,color:"var(--ink-3)",marginTop:4},children:[((z=(b=t==null?void 0:t.demo)==null?void 0:b.theatre)==null?void 0:z.name)||"Elevation model"," · 513 × 513 grid"]})]})})}),g.jsx("div",{className:"overlay overlay--compass",title:"True north",children:g.jsx("div",{className:"compass",children:g.jsx("div",{className:"compass__needle",style:{transform:`rotate(${p}rad)`},children:g.jsx("span",{className:"compass__n",children:"N"})})})}),g.jsx("div",{className:"overlay overlay--bl",children:g.jsxs("div",{className:"camstrip",children:[g.jsx("button",{className:`camstrip__btn ${!d.manual&&d.shot?"on":""}`,onClick:M,title:"Hand the camera back to the automatic director",children:"● AUTO"}),ZA.map(y=>g.jsx("button",{className:`camstrip__btn ${!d.manual&&d.shot===y.id?"on":""}`,onClick:()=>S(y.id),children:y.label},y.id)),d.manual&&g.jsx("span",{className:"camstrip__btn on",style:{cursor:"default"},title:"Drag to orbit, scroll to zoom",children:"MANUAL"})]})}),g.jsx("div",{className:"overlay overlay--br",children:g.jsxs("div",{className:"legend",children:[g.jsx("div",{className:"legend__title",children:"Link quality"}),g.jsxs("div",{className:"legend__row",children:[g.jsx("i",{className:"legend__swatch",style:{background:"#0f8a5f"}}),g.jsx("span",{children:"Good > 85%"})]}),g.jsxs("div",{className:"legend__row",children:[g.jsx("i",{className:"legend__swatch",style:{background:"#d97706"}}),g.jsx("span",{children:"Marginal 50–85%"})]}),g.jsxs("div",{className:"legend__row",children:[g.jsx("i",{className:"legend__swatch",style:{background:"#dc2626"}}),g.jsx("span",{children:"Degraded < 50%"})]}),g.jsx("div",{className:"legend__title",style:{marginTop:9},children:"Aircraft"}),g.jsxs("div",{className:"legend__row",children:[g.jsx("i",{className:"legend__dot",style:{background:"#0b6bcb"}}),g.jsx("span",{children:"Scout"})]}),g.jsxs("div",{className:"legend__row",children:[g.jsx("i",{className:"legend__dot",style:{background:"#0f8a5f"}}),g.jsx("span",{children:"Relay"})]}),g.jsxs("div",{className:"legend__row",children:[g.jsx("i",{className:"legend__dot",style:{background:"#8250df"}}),g.jsx("span",{children:"GCS relay"})]}),C&&g.jsxs(g.Fragment,{children:[g.jsx("div",{className:"legend__title",style:{marginTop:9},children:"Threat"}),g.jsxs("div",{className:"legend__row",children:[g.jsx("i",{className:"legend__dot",style:{background:"#dc2626"}}),g.jsx("span",{children:"Jamming envelope"})]}),g.jsxs("div",{className:"legend__row",children:[g.jsx("i",{className:"legend__dot",style:{background:"transparent",border:"1.5px dashed #f59e0b"}}),g.jsx("span",{children:"Jammer position (swarm estimate)"})]})]}),g.jsx("div",{style:{marginTop:9,paddingTop:7,borderTop:"1px solid var(--border)",fontSize:10,color:"var(--ink-3)",lineHeight:1.45},children:"Drag to orbit · scroll to zoom"})]})})]})}const lg=[{id:"select",label:"Select",hint:"Click an aircraft, jammer or target to select it. Drag to orbit."},{id:"add_scout",label:"+ Scout",hint:"Click the terrain to deploy a scout. It will task itself to the nearest survey target."},{id:"add_relay",label:"+ Relay",hint:"Click the terrain to deploy a relay. The GNN will position it to hold the mesh together."},{id:"add_poi",label:"+ Target",hint:"Click the terrain to mark a survey target. An idle scout will be tasked to it."},{id:"add_jammer",label:"+ Jammer",hint:"Click the terrain to emplace a hostile jammer. Ridges between it and a drone block its signal."}],QA=t=>10**((t+3+82-31.53)/20),It=(t,e=0)=>t==null||Number.isNaN(t)?"—":Number(t).toFixed(e);function eb({telemetry:t,tool:e,setTool:n,selected:i,setSelected:r,run:s,jammerPower:a,setJammerPower:o,wind:l,setWind:c,onFrame:u}){var Te,ze,W,se;const d=(t==null?void 0:t.drones)||{},f=(t==null?void 0:t.rf)||{},p=(t==null?void 0:t.pois)||[],_=(t==null?void 0:t.demo)||{},v=(i==null?void 0:i.kind)==="drone"?d[i.id]:null,m=(i==null?void 0:i.kind)==="jammer"?(f.jammers||[]).find(Y=>Y.id===i.id):null,h=(i==null?void 0:i.kind)==="poi"?p.find(Y=>Y.id===i.id):null,x=e==="goto"?{hint:`Click the terrain to send ${i==null?void 0:i.id} there. Esc to cancel.`}:lg.find(Y=>Y.id===e),S=f.ew||{},M=S.estimates||(S.estimate?[S.estimate]:[]),P=M[0],C=_.magazine??0,A=(t==null?void 0:t.interceptors)||[],b=(t==null?void 0:t.mission)||_.mission||{},z=(t==null?void 0:t.injects)||{},y=b.phase==="LIVE",E=(b.requests||[]).filter(Y=>Y.status==="PENDING"),U=[["heavy_rain","Heavy rain","Convective rainfall: turbulence, wet antennas, degraded optics"],["storm_cell","Downdraught","Drifting mountain-wave cell with a 9 m/s sink"],["gps_denial","GNSS denial","Spoofing bubble: the navigation solution drifts"],["equipment_fault","Motor fault","Motor/ESC failure on one aircraft"],["enemy_uav","Hostile UAV","Enemy interceptor drone hunting the swarm"]],F=P?C<=0?"No interceptors remaining.":null:"The swarm has not located the jammer yet — no fix to launch against.",X=Y=>g.jsxs("button",{className:"btn danger",disabled:!!F,title:F||"Operator authorisation: launch a home-on-jam interceptor at the located jammer",onClick:()=>s("launch_interceptor",Y?{emitter_id:Y}:{}),children:["Authorise interceptor · ",C," left"]}),K={LAUNCH:"Climbing out",MIDCOURSE:"Midcourse to fix",TERMINAL:"Terminal — homing on emission",REACQUIRE:"Lock lost — reacquiring",LOITER:"Loitering — no emission",HIT:"TARGET DESTROYED",TERRAIN:"Missed — hit terrain",ABORTED:"Aborted",ENDURANCE:"Self-neutralised"},V=(v==null?void 0:v.status)==="KILLED",ie=_.mode==="scripted",[D,ee]=ye.useState(!1),[ne,ce]=ye.useState(!1);return D?g.jsx("button",{className:"operator operator--min",onClick:()=>ee(!1),children:"▸ Operator Control"}):g.jsxs("div",{className:"operator",children:[g.jsxs("div",{className:"operator__head",children:[g.jsx("span",{className:"operator__title",children:"Operator Control"}),g.jsx("span",{className:`operator__mode ${ie?"scripted":""}`,children:ie?"SCRIPTED":"LIVE"}),g.jsx("button",{className:"operator__x",title:"Minimise",onClick:()=>ee(!0),children:"–"})]}),g.jsx("div",{className:"operator__tools",children:lg.map(Y=>g.jsx("button",{className:`tool tool--${Y.id} ${e===Y.id?"on":""}`,onClick:()=>n(Y.id),children:Y.label},Y.id))}),g.jsx("div",{className:"operator__hint",children:x==null?void 0:x.hint}),(e==="add_jammer"||m)&&g.jsxs("div",{className:"operator__row",children:[g.jsxs("label",{children:["Jammer power ",g.jsxs("b",{children:[It(m?m.power_dbm:a)," dBm"]}),g.jsxs("span",{className:"operator__sub",children:[" ","· reach ≈ ",It(QA(m?m.power_dbm:a))," m in open air"]})]}),g.jsx("input",{type:"range",min:"-10",max:"25",step:"1",value:m?m.power_dbm:a,onChange:Y=>{const de=Number(Y.target.value);m?s("set_jammer_power",{jammer_id:m.id,power_dbm:de}):o(de)}})]}),v&&g.jsxs("div",{className:"operator__card",children:[g.jsxs("div",{className:"operator__card-head",children:[g.jsx("b",{children:v.id}),g.jsx("span",{className:`pill ${V?"bad":"ok"}`,children:V?"DOWN":v.status})]}),g.jsxs("div",{className:"operator__stats",children:[g.jsx("span",{children:v.role.replace("_"," ")}),g.jsxs("span",{children:[It(v.agl)," m AGL"]}),g.jsxs("span",{children:[It(v.battery),"% batt"]}),g.jsx("span",{children:v.ew_hold?"EW WITHDRAWAL":v.manual_target?"OPERATOR ORDER":"AUTONOMOUS"})]}),g.jsxs("div",{className:"operator__actions",children:[!V&&g.jsx("button",{className:"btn",onClick:()=>n("goto"),children:"Send to…"}),!V&&v.manual_target&&g.jsx("button",{className:"btn",onClick:()=>s("release",{drone_id:v.id}),children:"Release to autonomy"}),!V&&v.role!=="GCS_RELAY"&&g.jsxs("button",{className:"btn",onClick:()=>s("set_role",{drone_id:v.id,role:v.role==="SCOUT"?"RELAY":"SCOUT"}),children:["Make ",v.role==="SCOUT"?"relay":"scout"]}),g.jsx("button",{className:"btn",onClick:()=>u(v.id),children:"Frame camera"}),V?g.jsx("button",{className:"btn primary",onClick:()=>s("revive",{drone_id:v.id}),children:"Relaunch"}):g.jsx("button",{className:"btn danger",onClick:()=>s("kill",{drone_id:v.id}),children:"Take down"})]})]}),m&&g.jsxs("div",{className:"operator__card",children:[g.jsxs("div",{className:"operator__card-head",children:[g.jsx("b",{children:m.id}),g.jsx("span",{className:"pill bad",children:"HOSTILE"})]}),((ze=(Te=f.ew)==null?void 0:Te.estimate)==null?void 0:ze.true_id)===m.id&&g.jsxs("div",{className:"operator__stats",children:[g.jsxs("span",{children:["Located by swarm ± ",It(f.ew.estimate.radius_m)," m"]}),g.jsxs("span",{children:["estimate ",It(f.ew.estimate.error_m)," m off"]}),g.jsxs("span",{children:["≈",It(f.ew.estimate.power_dbm)," dBm est."]})]}),g.jsxs("div",{className:"operator__actions",children:[X(null),g.jsx("button",{className:"btn",onClick:()=>{s("remove_jammer",{jammer_id:m.id}),r(null)},children:"Neutralise (ground team)"})]}),F&&g.jsx("div",{className:"operator__hint",children:F})]}),h&&g.jsxs("div",{className:"operator__card",children:[g.jsxs("div",{className:"operator__card-head",children:[g.jsx("b",{children:h.id}),g.jsx("span",{className:`pill ${h.surveyed?"ok":"warn"}`,children:h.surveyed?"SURVEYED":"PENDING"})]}),g.jsxs("div",{className:"operator__stats",children:[g.jsx("span",{children:h.category}),g.jsxs("span",{children:["priority ",h.priority]})]}),g.jsx("div",{className:"operator__actions",children:g.jsx("button",{className:"btn",onClick:()=>{s("remove_poi",{poi_id:h.id}),r(null)},children:"Cancel target"})})]}),g.jsxs("div",{className:`operator__card mission-card ${y?"mission-card--live":""}`,children:[g.jsxs("div",{className:"operator__card-head",children:[g.jsx("b",{children:y?`LIVE MISSION · ${b.mission_id||""}`:"PRE-MISSION REHEARSAL"}),g.jsx("span",{className:`pill ${y?"bad":"ok"}`,children:y?"COMMITTED":"TRAINING"})]}),!y&&g.jsxs(g.Fragment,{children:[g.jsx("div",{className:"operator__sub",children:"The swarm is training against this theatre's terrain, wind and radio conditions. Commit it when the rehearsal looks good."}),g.jsx("div",{className:"operator__actions",children:g.jsx("button",{className:"btn primary",onClick:()=>s("launch_mission"),children:"Launch mission ▸"})})]}),y&&g.jsxs(g.Fragment,{children:[g.jsxs("div",{className:"operator__stats",children:[g.jsxs("span",{children:["T+",Math.floor((b.elapsed||0)/60),":",String(Math.floor((b.elapsed||0)%60)).padStart(2,"0")]}),g.jsxs("span",{children:["rehearsed PDR ",It((((W=b.rehearsal)==null?void 0:W.backhaul_pdr)??0)*100),"%"]}),g.jsxs("span",{children:[((se=b.rehearsal)==null?void 0:se.relay_solves)??0," relay solves"]})]}),g.jsx("div",{className:"operator__section",children:"Inject (exercise control)"}),g.jsx("div",{className:"inject-tools",children:U.map(([Y,de,Ie])=>g.jsx("button",{className:"tool",title:Ie,onClick:()=>s("inject",{kind:Y}),children:de},Y))}),g.jsxs("div",{className:"operator__stats",children:[z.rain_mm_h>0&&g.jsxs("span",{children:["rain ",It(z.rain_mm_h)," mm/h"]}),z.cloud_base_agl&&g.jsxs("span",{children:["cloud base ",It(z.cloud_base_agl)," m AGL"]}),z.nav_fallback&&g.jsx("span",{children:"terrain-relative nav"}),(z.cells||[]).length>0&&g.jsxs("span",{children:[z.cells.length," cell(s)"]}),(z.enemies||[]).length>0&&g.jsxs("span",{className:"bad-text",children:[z.enemies.length," hostile UAV"]}),Object.keys(z.faults||{}).length>0&&g.jsxs("span",{children:[Object.keys(z.faults).join(", ")," degraded"]})]}),g.jsxs("div",{className:"operator__actions",children:[g.jsx("button",{className:"btn",onClick:()=>s("clear_injects"),children:"Clear injects"}),g.jsx("button",{className:"btn",onClick:()=>s("end_mission"),children:"End mission"})]})]})]}),E.length>0&&g.jsxs("div",{className:"operator__card operator__card--alert",children:[g.jsxs("div",{className:"operator__card-head",children:[g.jsx("b",{children:"Awaiting base authority"}),g.jsx("span",{className:"pill bad",children:E.length})]}),E.map(Y=>g.jsxs("div",{className:"operator__sub",style:{marginTop:4},children:[g.jsxs("b",{children:[Y.id," · ",Y.kind.replace(/_/g," ")]})," — ",Y.reason]},Y.id))]}),M.length>0&&!m&&g.jsxs("div",{className:"operator__card operator__card--alert",children:[g.jsxs("div",{className:"operator__card-head",children:[g.jsx("b",{children:M.length>1?`${M.length} hostile emitters located`:"Hostile jammer located"}),g.jsx("span",{className:"pill bad",children:"EW"})]}),M.map(Y=>g.jsxs("div",{className:"interceptor-row",children:[g.jsxs("div",{children:[g.jsx("b",{children:Y.id}),g.jsxs("div",{className:"operator__sub",children:["grid (",It(Y.x),", ",It(Y.y),") · ± ",It(Y.radius_m)," m · ≈",It(Y.power_dbm)," dBm",Y.sensors?` · ${Y.sensors}-aircraft cross-fix`:""]})]}),X(Y.id)]},Y.id))]}),A.length>0&&g.jsxs("div",{className:"operator__card",children:[g.jsxs("div",{className:"operator__card-head",children:[g.jsx("b",{children:"Interceptors"}),g.jsxs("span",{className:"pill warn",children:[C,"/",_.magazine_size??2," in magazine"]})]}),A.map(Y=>g.jsxs("div",{className:"interceptor-row",children:[g.jsxs("div",{children:[g.jsx("b",{children:Y.id})," ",g.jsx("span",{className:`interceptor-row__phase ${Y.outcome==="HIT"?"ok":Y.done?"bad":""}`,children:Y.phase==="TERMINAL"&&Y.locked_on&&!String(Y.locked_on).startsWith("JAM")?`Terminal — closing on ${Y.locked_on}`:K[Y.phase]||Y.phase}),g.jsxs("div",{className:"operator__sub",children:[It(Y.speed)," m/s · ",It(Y.range_m)," m to fix",Y.seeker_dbm!=null&&` · seeker ${It(Y.seeker_dbm)} dBm`]})]}),!Y.done&&g.jsx("button",{className:"btn",onClick:()=>s("abort_interceptor",{interceptor_id:Y.id}),children:"Abort"})]},Y.id))]}),g.jsx("button",{className:"operator__more",onClick:()=>ce(!ne),children:ne?"▾ Hide weather & mission":"▸ Weather & mission"}),ne&&g.jsxs(g.Fragment,{children:[g.jsx("div",{className:"operator__section",children:"Weather"}),g.jsxs("div",{className:"operator__row",children:[g.jsxs("label",{children:["Wind ",g.jsxs("b",{children:[It(l.speed)," m/s"]})," toward ",g.jsxs("b",{children:[It(l.heading),"°"]})]}),g.jsx("input",{type:"range",min:"0",max:"18",step:"1",value:l.speed,onChange:Y=>c({...l,speed:Number(Y.target.value)}),onMouseUp:()=>s("set_wind",{speed:l.speed,heading_deg:l.heading}),onTouchEnd:()=>s("set_wind",{speed:l.speed,heading_deg:l.heading})}),g.jsx("input",{type:"range",min:"0",max:"355",step:"5",value:l.heading,onChange:Y=>c({...l,heading:Number(Y.target.value)}),onMouseUp:()=>s("set_wind",{speed:l.speed,heading_deg:l.heading}),onTouchEnd:()=>s("set_wind",{speed:l.speed,heading_deg:l.heading})})]}),g.jsxs("div",{className:"operator__actions",children:[g.jsx("button",{className:"btn",onClick:()=>s("gust",{magnitude:13}),children:"Trigger gust"}),(f.jammers||[]).length>0&&g.jsx("button",{className:"btn",onClick:()=>s("clear_jammers"),children:"Clear all jammers"})]}),g.jsx("div",{className:"operator__section",children:"Mission"}),g.jsxs("div",{className:"operator__actions",children:[g.jsx("button",{className:"btn",onClick:()=>s("sitrep"),children:"Generate SITREP"}),ie?g.jsx("button",{className:"btn",onClick:()=>s("stop_scenario"),children:"Stop scripted run"}):g.jsx("button",{className:"btn",onClick:()=>s("run_scenario"),children:"Run scripted 4-phase demo"})]})]})]})}const pn=1,tb=.0016,nb=3.2,Ou=.05,ib=.0058;function er(t,e,n=pn){const i=(e+180)/360*Math.PI*2,r=(90-t)/180*Math.PI;return new N(-n*Math.cos(i)*Math.sin(r),n*Math.cos(r),n*Math.sin(i)*Math.sin(r))}const cg=4,rb=14,sb=.9,ug=420,dg=40075016,hg=(t,e)=>vt.radToDeg(Math.atan(Math.sinh(Math.PI*(1-2*t/2**e)))),ab=(t,e,n)=>[hg(n+1,t),hg(n,t),e/2**t*360-180,(e+1)/2**t*360-180];function ob(t,e,n){const i=2**n,r=vt.degToRad(vt.clamp(t,-85,85));return{x:(e+180)/360*i,y:(1-Math.log(Math.tan(r)+1/Math.cos(r))/Math.PI)/2*i}}function lb(t){const e=t.length(),n=90-vt.radToDeg(Math.acos(t.y/e)),i=vt.radToDeg(Math.atan2(t.z,-t.x))-180;return{lat:n,lon:(i+540)%360-180}}const zu=t=>Math.log(Math.tan(Math.PI/4+vt.degToRad(t)/2));function xa(t,e,n=48){const[i,r,s,a]=t,o=[],l=[],c=[],u=zu(i),d=zu(r);for(let p=0;p<=n;p++){const _=i+(r-i)*(p/n);for(let v=0;v<=n;v++){const m=s+(a-s)*(v/n),h=er(_,m,e);o.push(h.x,h.y,h.z),l.push(v/n,(zu(_)-u)/(d-u))}}for(let p=0;p<n;p++)for(let _=0;_<n;_++){const v=p*(n+1)+_,m=v+1,h=v+n+1,x=h+1;c.push(v,m,h,m,x,h)}const f=new lt;return f.setAttribute("position",new ft(o,3)),f.setAttribute("uv",new ft(l,2)),f.setIndex(c),f.computeVertexNormals(),f}function fg(t,e,n,i=1){const[r,s,a,o]=t,l=[],c=24;for(let d=0;d<=c;d++)l.push(er(r,a+(o-a)*d/c,e));for(let d=0;d<=c;d++)l.push(er(r+(s-r)*d/c,o,e));for(let d=0;d<=c;d++)l.push(er(s,o-(o-a)*d/c,e));for(let d=0;d<=c;d++)l.push(er(s-(s-r)*d/c,a,e));const u=new Yi(new lt().setFromPoints(l),new Mi({color:n,transparent:!0,opacity:i,depthTest:!1}));return u.renderOrder=5,u}function pg(t,e){const n=er(t,e);return{spin:-Math.atan2(n.x,n.z),tilt:vt.degToRad(t)}}function cb(t,e=30,n=170){const i=[];return[...t].sort((r,s)=>r.y-s.y).forEach(r=>{let s=r.y;for(const a of i)Math.abs(a.x-r.x)<n&&Math.abs(a.ly-s)<e&&(s=a.ly+e);i.push({...r,ly:s})}),i}const ub=(t,e)=>t==null?"—":`${Math.abs(t).toFixed(3)}°${t>=0?"N":"S"}  ${Math.abs(e).toFixed(3)}°${e>=0?"E":"W"}`;function db({open:t,onClose:e,currentId:n,canClose:i}){const r=ye.useRef(null),s=ye.useRef({}),[a,o]=ye.useState([]),[l,c]=ye.useState(null),[u,d]=ye.useState(null),[f,p]=ye.useState(null),[_,v]=ye.useState(null),[m,h]=ye.useState([]),[x,S]=ye.useState(null);ye.useEffect(()=>{t&&fetch("/api/theatres",{cache:"no-store"}).then(b=>b.json()).then(b=>o(b.theatres||[])).catch(()=>v("Simulation node unreachable"))},[t]),ye.useEffect(()=>{if(!t||!r.current)return;const b=r.current,z=new lv({antialias:!0});z.setPixelRatio(Math.min(window.devicePixelRatio,2)),z.setSize(b.clientWidth,b.clientHeight),z.outputColorSpace=tn,z.setClearColor(329482),b.appendChild(z.domElement);const y=new cv,E=new gn(32,b.clientWidth/b.clientHeight,2e-4,50),U=new Gt,F=new Gt;U.add(F),y.add(U);const X=new fv,K=z.capabilities.getMaxAnisotropy(),V=($,Q)=>X.load($,te=>{te.colorSpace=tn,te.anisotropy=K,Q==null||Q(te)}),ie=new Qi({roughness:.92,metalness:0});V("/earth_hd.jpg",$=>{ie.map=$,ie.needsUpdate=!0});const D=new Ne(new un(pn,256,160),ie);F.add(D);const ee=[];for(let $=0;$<1800;$++){const Q=new N().randomDirection().multiplyScalar(30+Math.random()*10);ee.push(Q.x,Q.y,Q.z)}const ne=new CA(new lt().setAttribute("position",new ft(ee,3)),new hv({color:12109012,size:.05,sizeAttenuation:!0}));y.add(ne);const ce=new Ne(new un(pn*1.035,96,64),new jn({side:Yt,transparent:!0,depthWrite:!1,vertexShader:"varying vec3 vN; void main(){ vN = normalize(normalMatrix*normal); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }",fragmentShader:"varying vec3 vN; void main(){ float i = pow(clamp(0.75 - dot(vN, vec3(0,0,1.0)), 0.0, 1.0), 3.2); gl_FragColor = vec4(0.45,0.66,0.98,1.0) * i * 1.4; }"}));y.add(ce),y.add(new FA(16777215,1.25));const Te=new mv(16777215,1.35);Te.position.set(2.5,1.5,4),y.add(Te);const ze=[];fetch("/himalaya.json").then($=>$.json()).then($=>{const Q=new bt({transparent:!0,opacity:0,depthTest:!1,side:yt});V("/himalaya.jpg",re=>{Q.map=re,Q.needsUpdate=!0});const te=new Ne(xa([$.south,$.north,$.west,$.east],pn,96),Q);te.renderOrder=1,F.add(te),ze.push(te)}).catch(()=>{});const W=new Map,se=[];let Y=0,de=new Set,Ie=0;const De=()=>{for(se.sort(($,Q)=>$.z-Q.z||$.dist-Q.dist);Y<8&&se.length;){const $=se.shift();if(!de.has($.key)){W.delete($.key);continue}Y+=1,$.state="loading",X.load(`/api/tiles/${$.key}.jpg`,Q=>{Y-=1,Q.colorSpace=tn,Q.anisotropy=K,Q.generateMipmaps=!0,$.mat=new bt({map:Q,transparent:!0,opacity:0,depthTest:!1,side:yt});const[te,re,Pe]=$.key.split("/").map(Number);$.mesh=new Ne(xa(ab(te,re,Pe),pn,te<=6?16:6),$.mat),$.mesh.renderOrder=2.2+te*.01,$.mesh.visible=!1,F.add($.mesh),$.state="ready",De()},void 0,()=>{Y-=1,$.state="failed",De()})}},Ye=$=>{var Q;$.mesh&&(F.remove($.mesh),$.mesh.geometry.dispose(),(Q=$.mat.map)==null||Q.dispose(),$.mat.dispose()),W.delete($.key)},Qe=$=>{Ie=(Ie+1)%4;const Q=vt.clamp((sb-Re.alt)/.3,0,1);if(!Ie){const te=new Set;if(Q>0){U.updateMatrixWorld(!0);const{lat:re,lon:Pe}=lb(F.worldToLocal(new N(0,0,pn))),we=2*Re.alt*6371e3*Math.tan(vt.degToRad(E.fov/2)),Xe=we/b.clientHeight/Math.min(window.devicePixelRatio,1.5),I=Math.max(Math.cos(vt.degToRad(re)),.05),pe=vt.clamp(Math.round(Math.log2(dg*I/(256*Xe))),cg,rb);for(let B=pe;B>=Math.max(cg,pe-2);B--){const q=2**B,me=dg*I/q,ge=Math.min(we*E.aspect/2/me*1.15,5),Be=Math.min(we/2/me*1.15,4),rt=ob(re,Pe,B);for(let Tt=Math.floor(rt.y-Be);Tt<=Math.floor(rt.y+Be);Tt++){const je=Tt,dt=Tt-Math.floor(rt.y);if(!(je<0||je>=q))for(let zt=Math.floor(rt.x-ge);zt<=Math.floor(rt.x+ge);zt++){const xr=zt-Math.floor(rt.x),po=(zt%q+q)%q,Ln=`${B}/${po}/${je}`;te.add(Ln);let Wn=W.get(Ln);Wn||(Wn={key:Ln,z:B,state:"queued",opacity:0,used:0,dist:xr*xr+dt*dt},W.set(Ln,Wn),se.push(Wn)),Wn.used=performance.now(),Wn.state==="queued"&&(Wn.dist=xr*xr+dt*dt)}}}}de=te;for(let re=se.length-1;re>=0;re--)te.has(se[re].key)||(W.delete(se[re].key),se.splice(re,1));De(),W.size>ug&&[...W.values()].filter(re=>!te.has(re.key)&&re.state!=="loading").sort((re,Pe)=>re.used-Pe.used).slice(0,W.size-ug).forEach(Ye)}W.forEach(te=>{if(te.state!=="ready")return;const re=de.has(te.key)?Q:0;te.opacity+=(re-te.opacity)*$,te.mat.opacity=te.opacity,te.mesh.visible=te.opacity>.01})},Ve=new Map,L=$=>{$.filter(Q=>Q.lat!=null&&Q.inner_bounds).forEach(Q=>{if(Ve.has(Q.id))return;const te={theatre:Q,loaded:!1,midLoaded:!1};Q.has_mid&&Q.mid_bounds&&(te.midMat=new bt({transparent:!0,opacity:0,depthTest:!1,side:yt}),te.mid=new Ne(xa(Q.mid_bounds,pn,48),te.midMat),te.mid.renderOrder=2,F.add(te.mid)),Q.has_patch&&Q.context_bounds&&(te.patchMat=new bt({transparent:!0,opacity:0,depthTest:!1,side:yt}),te.patch=new Ne(xa(Q.context_bounds,pn,48),te.patchMat),te.patch.renderOrder=3,F.add(te.patch),te.ring=fg(Q.context_bounds,pn,16777215,.25),F.add(te.ring)),te.fill=new Ne(xa(Q.inner_bounds,pn,8),new bt({color:16756768,transparent:!0,opacity:.12,depthTest:!1,side:yt})),te.fill.renderOrder=4,te.fill.userData.id=Q.id,F.add(te.fill),te.box=fg(Q.inner_bounds,pn,16756768,1),F.add(te.box),te.hit=new Ne(new un(.02,10,8),new bt({visible:!1})),te.hit.position.copy(er(Q.lat,Q.lon,pn)),te.hit.userData.id=Q.id,F.add(te.hit),Ve.set(Q.id,te)})},Re={spin:0,tilt:0,alt:2.6,tSpin:0,tTilt:0,tAlt:2.6},We=pg(29,82);Re.spin=Re.tSpin=We.spin,Re.tilt=Re.tTilt=We.tilt;const Ze=($,Q,te)=>{const re=pg($,Q);let Pe=re.spin-Re.tSpin;Pe=((Pe+Math.PI)%(Math.PI*2)+Math.PI*2)%(Math.PI*2)-Math.PI,Re.tSpin+=Pe,Re.tTilt=re.tilt,te!=null&&(Re.tAlt=te)},Le=z.domElement;let et=!1,Ue=!1,R=0,w=0;const H=new _v,J=$=>{const Q=Le.getBoundingClientRect(),te={x:($.clientX-Q.left)/Q.width*2-1,y:-(($.clientY-Q.top)/Q.height)*2+1};H.setFromCamera(te,E);const re=[];Ve.forEach(I=>{re.push(I.fill),Re.alt>Ou&&re.push(I.hit)});const Pe=H.intersectObjects(re,!1),we=H.intersectObject(D,!1)[0],Xe=Pe.find(I=>!we||I.distance<=we.distance+.001);return Xe?Xe.object.userData.id:null};Le.addEventListener("pointerdown",$=>{et=!0,Ue=!1,R=$.clientX,w=$.clientY});const ae=$=>{var Q,te;if(et){const re=$.clientX-R,Pe=$.clientY-w;Math.abs(re)+Math.abs(Pe)>2&&(Ue=!0);const we=.0022*Math.min(Re.alt,2.2)+1e-5;Re.tSpin+=re*we,Re.tTilt=vt.clamp(Re.tTilt+Pe*we,-1.3,1.3),R=$.clientX,w=$.clientY}else{const re=J($);Le.style.cursor=re?"pointer":"grab",(te=(Q=s.current).onHover)==null||te.call(Q,re)}},Z=$=>{var Q,te;if(et&&!Ue){const re=J($);re&&((te=(Q=s.current).onAreaClick)==null||te.call(Q,re,Re.alt))}et=!1};window.addEventListener("pointermove",ae),window.addEventListener("pointerup",Z),Le.addEventListener("wheel",$=>{$.preventDefault(),Re.tAlt=vt.clamp(Re.tAlt*Math.exp($.deltaY*.0016),tb,nb)},{passive:!1});let Me;const fe=new gv;let ve=0;const qe=()=>{var I,pe;Me=requestAnimationFrame(qe);const $=Math.min(fe.getDelta(),.05),Q=1-Math.exp(-4.5*$);Re.spin+=(Re.tSpin-Re.spin)*Q,Re.tilt+=(Re.tTilt-Re.tilt)*Q,Re.alt=Math.exp(Math.log(Re.alt)+(Math.log(Re.tAlt)-Math.log(Re.alt))*Q),F.rotation.y=Re.spin,U.rotation.x=Re.tilt,E.position.set(0,0,pn+Re.alt),E.lookAt(0,0,0),Qe(1-Math.exp(-6*$));const te=vt.clamp((1.4-Re.alt)/.9,0,1);ze.forEach(B=>{B.material.opacity=te,B.visible=te>.01});const re=E.position.clone().normalize(),Pe=b.clientWidth,we=b.clientHeight,Xe=[];Ve.forEach((B,q)=>{const ge=er(B.theatre.lat,B.theatre.lon,pn).clone().applyMatrix4(F.matrixWorld),Be=ge.clone().normalize().dot(re)>.2;if(B.mid){const dt=vt.clamp((.16-Re.alt)/.1,0,1)*(Be?1:0);B.midMat.opacity=dt,B.mid.visible=dt>.01,!B.midLoaded&&Re.alt<.4&&(B.midLoaded=!0,V(`/api/theatre/${q}/patch.jpg?level=mid`,zt=>{B.midMat.map=zt,B.midMat.needsUpdate=!0}))}if(B.patch){const dt=vt.clamp((.03-Re.alt)/.02,0,1)*(Be?1:0);B.patchMat.opacity=dt,B.patch.visible=dt>.01,B.ring.visible=dt>.05,!B.loaded&&Re.alt<.1&&(B.loaded=!0,V(`/api/theatre/${q}/patch.jpg`,zt=>{B.patchMat.map=zt,B.patchMat.needsUpdate=!0}))}const rt=s.current.hoverId===q||s.current.focusId===q,Tt=Be&&Re.alt<.12;B.fill.material.opacity=Tt?rt?.32:.12:0,B.box.visible=Tt,B.box.material.color.setHex(q===s.current.currentId?8315560:16756768);const je=ge.clone().project(E);Xe.push({id:q,x:(je.x+1)/2*Pe,y:(1-je.y)/2*we,visible:Be&&je.z<1})}),ve=(ve+1)%3,ve||(pe=(I=s.current).pushFrame)==null||pe.call(I,Xe,Re.alt),z.render(y,E)};qe();const le=()=>{E.aspect=b.clientWidth/b.clientHeight,E.updateProjectionMatrix(),z.setSize(b.clientWidth,b.clientHeight)};return window.addEventListener("resize",le),s.current={...s.current,flyTo:Ze,buildAreas:L,view:Re},window.__cdawnGlobe={areas:Ve,view:Re,regional:ze,rim:ce,earth:D,stars:ne,camera:E,renderer:z,tiles:W},()=>{cancelAnimationFrame(Me),window.removeEventListener("resize",le),window.removeEventListener("pointermove",ae),window.removeEventListener("pointerup",Z),y.traverse($=>{var Q,te,re,Pe,we,Xe;(te=(Q=$.geometry)==null?void 0:Q.dispose)==null||te.call(Q),$.material&&((Pe=(re=$.material.map)==null?void 0:re.dispose)==null||Pe.call(re),(Xe=(we=$.material).dispose)==null||Xe.call(we))}),z.dispose(),Le.parentNode===b&&b.removeChild(Le)}},[t]),ye.useEffect(()=>{var b,z;(z=(b=s.current).buildAreas)==null||z.call(b,a)},[a,t]),ye.useEffect(()=>{s.current.currentId=n,s.current.hoverId=l,s.current.focusId=u},[n,l,u]);const M=async b=>{if(!(f||!b)){v(null),p(b.id);try{const y=await(await fetch(`/api/theatre/${b.id}`,{method:"POST"})).json();if(!y.ok)throw new Error(y.error||"Could not load theatre");setTimeout(()=>{p(null),e()},600)}catch(z){p(null),v(String(z.message||z))}}},P=b=>{var z,y;d(b.id),b.lat!=null&&((y=(z=s.current).flyTo)==null||y.call(z,b.lat,b.lon,ib))};if(s.current.onHover=b=>c(b),s.current.onAreaClick=(b,z)=>{const y=a.find(E=>E.id===b);y&&(z<=Ou?M(y):P(y))},s.current.pushFrame=(b,z)=>{h(b),S(z*6371)},!t)return null;const C=a.find(b=>b.id===(l||u||n)),A=x!=null&&x/6371<=Ou;return g.jsxs("div",{className:"theatre",children:[g.jsxs("div",{className:"theatre__globe",ref:r,children:[cb(m.filter(b=>b.visible)).map(b=>{const z=a.find(y=>y.id===b.id);return z?g.jsxs("div",{className:`globe-tag ${A?"near":"far"} ${b.id===n?"current":""} ${b.id===l?"hover":""}`,style:{left:b.x,top:b.ly},children:[g.jsx("span",{className:"globe-tag__name",children:z.name}),A&&g.jsx("span",{className:"globe-tag__hint",children:f===z.id?"deploying…":"click area to deploy"})]},b.id):null}),g.jsxs("div",{className:"globe-hud",children:[g.jsxs("span",{children:["ALT ",x==null?"—":x>=1e3?`${(x/1e3).toFixed(1)}k`:x.toFixed(0)," km"]}),g.jsx("span",{children:A?"Click an outlined area to deploy":"Scroll to zoom · drag to rotate · click an area to fly in"})]}),g.jsx("div",{className:"theatre__credit",children:"Globe: NASA Blue Marble · Satellite tiles: Sentinel-2 cloudless 2016 (EOX, CC BY 4.0) · Theatre imagery: Esri World Imagery (local cache) · Terrain: SRTM/Copernicus via AWS Open Data"})]}),g.jsxs("div",{className:"theatre__panel",children:[g.jsxs("div",{className:"theatre__head",children:[g.jsxs("div",{children:[g.jsx("div",{className:"theatre__kicker",children:"C-DAWN · Mission planning"}),g.jsx("div",{className:"theatre__title",children:"Select theatre of operations"})]}),i&&g.jsx("button",{className:"theatre__close",onClick:e,children:"Close ✕"})]}),g.jsx("div",{className:"theatre__list",children:a.map(b=>g.jsxs("button",{className:`theatre__item ${b.id===n?"current":""} ${b.id===(l||u)?"hover":""}`,onMouseEnter:()=>c(b.id),onMouseLeave:()=>c(null),onClick:()=>P(b),disabled:!!f,children:[g.jsxs("div",{className:"theatre__item-top",children:[g.jsx("span",{className:"theatre__name",children:b.name}),g.jsx("span",{className:"theatre__tag",children:f===b.id?"LOADING…":b.id===n?"ACTIVE":b.synthetic?"TRAINING MODEL":"REAL TERRAIN"})]}),g.jsx("div",{className:"theatre__region",children:b.region}),g.jsxs("div",{className:"theatre__coords",children:[ub(b.lat,b.lon),b.min_height_m!=null&&` · ${Math.round(b.min_height_m)}–${Math.round(b.max_height_m)} m`]})]},b.id))}),C&&g.jsxs("div",{className:"theatre__detail",children:[g.jsx("div",{className:"theatre__detail-name",children:C.name}),g.jsx("p",{children:C.description}),C.use_case&&g.jsxs("p",{children:[g.jsx("b",{children:"Use case:"})," ",C.use_case]}),C.size_m&&g.jsxs("p",{children:[g.jsx("b",{children:"Area:"})," ",(C.size_m/1e3).toFixed(1)," × ",(C.size_m/1e3).toFixed(1)," km"]}),g.jsx("button",{className:"btn primary",style:{marginTop:10,width:"100%"},disabled:!!f,onClick:()=>M(C),children:f===C.id?"Deploying…":C.id===n?"Re-deploy here":`Deploy to ${C.name}`})]}),_&&g.jsx("div",{className:"theatre__error",children:_})]})]})}const Ke=(t,e=1,n="—")=>t==null||Number.isNaN(t)?n:Number(t).toFixed(e);function hb({telemetry:t}){var f,p,_;const e=t==null?void 0:t.demo,n=(t==null?void 0:t.metrics)||{},i=t==null?void 0:t.causal,r=(t==null?void 0:t.rf)||{},s=n.current_phase??0,a=r.jamming_active,o=(n.backhaul_pdr??1)*100;let l="info";a||o<60?l="alert":o<90&&(l="caution");let c="All links nominal. Relays holding assigned stations.";const u=(f=i==null?void 0:i.interventions)==null?void 0:f.latest,d=r.ew;if(d!=null&&d.active&&d.summary)c=`EW response — ${d.summary}`;else if(u&&u.phase==="complete")u.confounded?c=`Causal test ${u.id} on ${u.link_id} was inconclusive — the conditions moved during the measurement, so no cause is being claimed.`:u.attribution==="terrain_occlusion"?c=`Diagnosed ${u.link_id} as TERRAIN occlusion by direct test — climbing ${Ke(u.achieved_dz,0)} m cut packet loss ${Ke(u.causal_effect*100,0)} points. Holding the new altitude.`:u.attribution==="not_terrain"?c=`Ruled OUT terrain on ${u.link_id}: altitude made no difference, so the loss is hostile or range-limited. Rerouting instead of climbing.`:u.attribution==="partial_terrain"&&(c=`Terrain is a partial cause on ${u.link_id}. Requesting relay repositioning rather than altitude alone.`);else if(((p=i==null?void 0:i.interventions)==null?void 0:p.active_count)>0){const v=(_=i.interventions.active)==null?void 0:_[0];c=`Running a controlled altitude test on ${(v==null?void 0:v.link_id)??"a degraded link"} to establish whether the cause is terrain or hostile action.`}return g.jsxs("div",{className:`situation ${l}`,children:[g.jsxs("div",{className:"situation__head",children:[g.jsx("span",{className:"situation__tag",children:s>0?`Phase ${s}`:(e==null?void 0:e.mode)==="interactive"?"Live":"Standby"}),g.jsx("span",{className:"situation__title",children:(e==null?void 0:e.phase_name)||"Awaiting mission start"})]}),g.jsx("div",{className:"situation__body",children:(e==null?void 0:e.phase_brief)||"System initialising."}),g.jsxs("div",{className:"situation__action",children:[g.jsx("b",{children:"System action:"})," ",c]})]})}function yv({telemetry:t,onSelect:e,run:n,selectedId:i}){const r=Object.values((t==null?void 0:t.drones)||{}),s=r.filter(l=>l.status!=="KILLED").length,a=l=>l.status==="KILLED"?"dead":l.role==="SCOUT"?"scout":l.role==="GCS_RELAY"?"gcs":"relay",o=l=>({SCOUT:"SCT",RELAY:"RLY",GCS_RELAY:"GCS",STANDBY:"STB"})[l]??"—";return g.jsxs("div",{className:"panel",children:[g.jsxs("div",{className:"panel__head",children:[g.jsx("span",{className:"panel__title",children:"Swarm"}),g.jsxs("span",{className:`panel__badge ${s===r.length?"ok":"bad"}`,children:[s,"/",r.length," AIRBORNE"]})]}),g.jsxs("div",{className:"panel__body tight",children:[r.length===0&&g.jsx("div",{className:"empty",children:"Awaiting telemetry from the simulation node."}),r.map(l=>{const c=l.battery??0,u=c>50?"hi":c>22?"mid":"lo";return g.jsxs("div",{className:`aircraft ${l.status==="KILLED"?"dead":""} ${l.id===i?"selected":""}`,onClick:()=>e==null?void 0:e(l.id),title:"Click to select this aircraft and frame it in the 3D view",children:[g.jsx("div",{className:`aircraft__badge ${a(l)}`,children:o(l.role)}),g.jsxs("div",{children:[g.jsx("div",{className:"aircraft__id",children:l.id}),g.jsx("div",{className:"aircraft__meta",children:l.status==="KILLED"?"NODE DOWN":l.ew_hold?`${Ke(l.speed,1)} m/s · EW withdrawal`:l.manual_target?`${Ke(l.speed,1)} m/s · operator order`:`${Ke(l.speed,1)} m/s · ${l.assigned_poi||"station keeping"}`}),g.jsx("button",{className:`mini ${l.status==="KILLED"?"revive":"kill"}`,onClick:d=>{d.stopPropagation(),n==null||n(l.status==="KILLED"?"revive":"kill",{drone_id:l.id})},children:l.status==="KILLED"?"Relaunch":"Take down"})]}),g.jsxs("div",{className:"aircraft__right",children:[g.jsxs("div",{className:"aircraft__alt",children:[Ke(l.agl,0)," m AGL"]}),g.jsxs("div",{style:{color:"var(--ink-3)",fontSize:10},children:[Ke(c,0),"%"]}),g.jsx("div",{className:"bat",children:g.jsx("div",{className:`bat__fill ${u}`,style:{width:`${Math.max(c,0)}%`}})})]})]},l.id)})]})]})}const mg=[{key:"β_T",symbol:"T",label:"Terrain",color:"#a45a06"},{key:"β_D",symbol:"D",label:"Distance",color:"#1549c9"},{key:"β_J",symbol:"J",label:"Jamming",color:"#c1201b"},{key:"β_W",symbol:"W",label:"Weather",color:"#0e7490"},{key:"β_θ",symbol:"θ",label:"Antenna",color:"#6d28d9"}];function Sv({telemetry:t}){const e=t==null?void 0:t.causal,n=e==null?void 0:e.scm,i=e==null?void 0:e.interventions;if(!(n!=null&&n.dag))return g.jsxs("div",{className:"panel",children:[g.jsx("div",{className:"panel__head",children:g.jsx("span",{className:"panel__title",children:"Causal Diagnostics"})}),g.jsx("div",{className:"panel__body",children:g.jsx("div",{className:"empty",children:"Collecting link observations…"})})]});const r=n.dag.coefficients||{},s=Math.max(...mg.map(p=>Math.abs(r[p.key]??0)),1),a=i==null?void 0:i.latest;let o="unknown",l="No completed test yet",c="The engine runs a controlled altitude change on a degraded link and measures the result, rather than inferring cause from correlation.";a&&a.phase==="complete"&&(a.confounded?(o="unknown",l="Inconclusive — not identified",c=`Test ${a.id} on ${a.link_id} measured ${Ke(a.causal_effect*100,1)} points of change, but the no-confounding assumption failed, so this is descriptive only.`):a.attribution==="terrain_occlusion"?(o="terrain",l="Cause: terrain occlusion",c=`${a.id}: climbing ${Ke(a.achieved_dz,0)} m reduced packet loss by ${Ke(a.causal_effect*100,1)} points (confidence ${Ke(a.confidence*100,0)}%). Altitude retained.`):a.attribution==="not_terrain"?(o="jam",l="Cause: NOT terrain",c=`${a.id}: altitude produced no improvement, so terrain is excluded. Consistent with jamming or range. Handover triggered.`):(o="unknown",l="Cause: partially terrain",c=`${a.id}: altitude helped by ${Ke(a.causal_effect*100,1)} points — contributing but not dominant.`));const u=(i==null?void 0:i.identified_count)??0,d=(i==null?void 0:i.confounded_count)??0,f=(i==null?void 0:i.completed_count)??0;return g.jsxs("div",{className:"panel",children:[g.jsxs("div",{className:"panel__head",children:[g.jsx("span",{className:"panel__title",children:"Causal Diagnostics (SCM)"}),g.jsx("span",{className:`panel__badge ${i!=null&&i.active_count?"warn":""}`,children:i!=null&&i.active_count?"TEST RUNNING":`${f} TESTS`})]}),g.jsxs("div",{className:"panel__body",children:[g.jsx("div",{className:"scm-eq",children:"L = σ(β₀ + β_T·T + β_D·D + β_J·J + β_W·W + β_θ·θ)"}),mg.map(p=>{const _=r[p.key]??0;return g.jsxs("div",{className:"coef",children:[g.jsxs("span",{className:"coef__name",children:[g.jsx("span",{className:"coef__sym",style:{background:`${p.color}1a`,color:p.color},children:p.symbol}),p.label]}),g.jsx("span",{className:"coef__bar",children:g.jsx("span",{className:"coef__fill",style:{width:`${Math.abs(_)/s*100}%`,background:p.color}})}),g.jsx("span",{className:"coef__val",children:Ke(_,2)})]},p.key)}),g.jsxs("div",{style:{fontSize:10,color:"var(--ink-3)",marginTop:8},children:["Coefficients updated online by recursive least squares from"," ",n.total_observations??0," link observations."]}),g.jsxs("div",{className:`verdict ${o}`,children:[g.jsx("div",{className:"verdict__head",children:l}),g.jsx("div",{children:c}),(a==null?void 0:a.confounded)&&(a==null?void 0:a.confound_reason)&&g.jsxs("div",{className:"confound",children:[g.jsx("b",{children:"Why it does not identify:"})," ",a.confound_reason,"."]})]}),g.jsxs("div",{style:{marginTop:9},children:[g.jsxs("div",{className:"kv",children:[g.jsx("span",{className:"kv__k",children:"Tests with a clean identification"}),g.jsx("span",{className:"kv__v",children:u})]}),g.jsxs("div",{className:"kv",children:[g.jsx("span",{className:"kv__k",children:"Tests rejected as confounded"}),g.jsx("span",{className:"kv__v",children:d})]}),g.jsxs("div",{className:"kv",children:[g.jsx("span",{className:"kv__k",children:"Intervention magnitude"}),g.jsxs("span",{className:"kv__v",children:["do(Δz = +",Ke(i==null?void 0:i.delta_z,0)," m)"]})]})]})]})]})}function Mv({telemetry:t}){const e=t==null?void 0:t.gnn;if(!e)return null;const n=e.connectivity_before??0,i=e.connectivity_after??0,r=e.connectivity_gnn_only??0,s=i-n;return g.jsxs("div",{className:"panel",children:[g.jsxs("div",{className:"panel__head",children:[g.jsx("span",{className:"panel__title",children:"Relay Topology — E(3) GNN"}),g.jsx("span",{className:`panel__badge ${e.model_trained?"ok":"bad"}`,children:e.model_trained?"TRAINED":"UNTRAINED"})]}),g.jsxs("div",{className:"panel__body",children:[g.jsxs("div",{className:"kv",children:[g.jsx("span",{className:"kv__k",children:"Backhaul connectivity, before"}),g.jsxs("span",{className:"kv__v",children:[Ke(n*100,1),"%"]})]}),g.jsxs("div",{className:"kv",children:[g.jsx("span",{className:"kv__k",children:"After GNN proposal"}),g.jsxs("span",{className:"kv__v",children:[Ke(r*100,1),"%"]})]}),g.jsxs("div",{className:"kv",children:[g.jsx("span",{className:"kv__k",children:"After gradient refinement"}),g.jsxs("span",{className:"kv__v",style:{color:s>.001?"var(--nominal)":"inherit"},children:[Ke(i*100,1),"%"]})]}),g.jsxs("div",{className:"kv",children:[g.jsx("span",{className:"kv__k",children:"Solve time (propose + refine)"}),g.jsxs("span",{className:"kv__v",children:[Ke(e.propose_ms,1)," + ",Ke(e.refine_ms,1)," ms"]})]}),g.jsxs("div",{className:"kv",children:[g.jsx("span",{className:"kv__k",children:"Optimisations run"}),g.jsx("span",{className:"kv__v",children:e.optimization_count??0})]}),g.jsx("div",{style:{fontSize:10.5,color:"var(--ink-3)",marginTop:9,lineHeight:1.5},children:"The network proposes relay positions in one equivariant forward pass; a short gradient refinement then polishes them against the terrain actually under the swarm. Both figures are shown so the contribution of each is visible."})]})]})}function Ev({telemetry:t}){var a;const e=(t==null?void 0:t.metrics)||{},n=(t==null?void 0:t.demo)||{},i=((a=t==null?void 0:t.charts)==null?void 0:a.control)||[],r=n.controller||"—",s=n.shadow||(/LTC/i.test(r)?"PID":"LTC");return g.jsxs("div",{className:"panel",children:[g.jsxs("div",{className:"panel__head",children:[g.jsx("span",{className:"panel__title",children:"Flight Control"}),g.jsx("span",{className:"panel__badge ok",children:r})]}),g.jsxs("div",{className:"panel__body",children:[g.jsx(wv,{series:i,keys:[{key:"active",color:"#1549c9"},{key:"shadow",color:"#a45a06"}]}),g.jsxs("div",{className:"chart-legend",children:[g.jsxs("span",{children:[g.jsx("i",{style:{background:"#1549c9"}}),r," tracking error (m)"]}),g.jsxs("span",{children:[g.jsx("i",{style:{background:"#a45a06"}}),s," divergence (m/s²)"]})]}),g.jsxs("div",{style:{marginTop:9},children:[g.jsxs("div",{className:"kv",children:[g.jsx("span",{className:"kv__k",children:"Tracking error (live)"}),g.jsxs("span",{className:"kv__v",children:[Ke(e.tracking_error_m,2)," m"]})]}),g.jsxs("div",{className:"kv",children:[g.jsxs("span",{className:"kv__k",children:[s," shadow divergence"]}),g.jsxs("span",{className:"kv__v",children:[Ke(e.shadow_divergence_ms2,2)," m/s²"]})]})]}),g.jsxs("div",{style:{marginTop:10,padding:9,borderRadius:6,background:"var(--caution-bg)",border:"1px solid #f4dcbb",fontSize:10.5,color:"#7d4405",lineHeight:1.5},children:[g.jsx("b",{style:{display:"block",marginBottom:3},children:"Benchmark result: PID selected over LTC"}),"The Liquid Time-Constant controller is implemented and trained (12.8k params), but on paired gust trials the cascaded PID held track closer — 0.18 m vs 0.62 m cross-track RMS in distribution, and 1.55 m vs 1.99 m on gusts beyond the LTC's training envelope — at under half the control effort. The system therefore flies PID by default. Run ",g.jsx("code",{children:"--controller ltc"})," to fly the LTC instead; whichever is not flying runs in shadow on the identical gust."]})]})]})}function wv({series:t,keys:e,height:n=76,yMax:i=null}){if(!t||t.length<2)return g.jsx("div",{className:"empty",style:{height:n},children:"Collecting data…"});const r=360,s=4,a=t.flatMap(c=>e.map(u=>c[u.key]??0)),o=i??Math.max(...a,.001)*1.15,l=c=>t.map((u,d)=>{const f=s+d/(t.length-1)*(r-s*2),p=n-s-(u[c]??0)/o*(n-s*2);return`${d===0?"M":"L"}${f.toFixed(1)},${p.toFixed(1)}`}).join(" ");return g.jsxs("svg",{className:"chart",viewBox:`0 0 ${r} ${n}`,preserveAspectRatio:"none",children:[[.25,.5,.75].map(c=>g.jsx("line",{x1:s,x2:r-s,y1:n*c,y2:n*c,stroke:"var(--border)",strokeWidth:"1"},c)),e.map(c=>g.jsx("path",{d:l(c.key),fill:"none",stroke:c.color,strokeWidth:"1.8",strokeLinejoin:"round",vectorEffect:"non-scaling-stroke"},c.key))]})}function Tv({telemetry:t}){const e=(t==null?void 0:t.charts)||{},i=(((t==null?void 0:t.metrics)||{}).backhaul_pdr??0)*100,r=(e.backhaul||[]).map((s,a)=>{var o,l;return{backhaul:s.value,swarm:((l=(o=e.pdr)==null?void 0:o[a])==null?void 0:l.value)??0}});return g.jsxs("div",{className:"panel",children:[g.jsxs("div",{className:"panel__head",children:[g.jsx("span",{className:"panel__title",children:"Link Health"}),g.jsxs("span",{className:`panel__badge ${i>92?"ok":i>70?"warn":"bad"}`,children:[Ke(i,1),"% BACKHAUL"]})]}),g.jsxs("div",{className:"panel__body",children:[g.jsx(wv,{series:r,keys:[{key:"backhaul",color:"#0b7a52"},{key:"swarm",color:"#7b8aa1"}],yMax:1.05}),g.jsxs("div",{className:"chart-legend",children:[g.jsxs("span",{children:[g.jsx("i",{style:{background:"#0b7a52"}}),"Scout → ground station"]}),g.jsxs("span",{children:[g.jsx("i",{style:{background:"#7b8aa1"}}),"Mean of all links"]})]}),g.jsx("div",{style:{fontSize:10.5,color:"var(--ink-3)",marginTop:8,lineHeight:1.5},children:"Backhaul is the operational number: whether each scout's data can actually reach the ground station over the best multi-hop path. A healthy all-links average can still hide one cut-off scout."})]})]})}function Av({telemetry:t}){var a;const e=t==null?void 0:t.cluster;if(!(e!=null&&e.self))return null;const n=[e.self,...e.peers||[]],i=((a=t==null?void 0:t.served_by)==null?void 0:a.node_id)??e.self.node_id,r=e.ownership||{},s={gnn_topology:"Relay optimisation",scm_causal:"Causal diagnostics",rag_sitrep:"SITREP synthesis"};return g.jsxs("div",{className:"panel",children:[g.jsxs("div",{className:"panel__head",children:[g.jsx("span",{className:"panel__title",children:"Cluster"}),g.jsxs("span",{className:"panel__badge",children:[n.length," NODE",n.length===1?"":"S"]})]}),g.jsxs("div",{className:"panel__body tight",children:[n.map(o=>g.jsxs("div",{className:`node ${o.node_id===i?"self":""} ${o.online?"":"offline"}`,children:[g.jsx("span",{className:"node__dot"}),g.jsxs("div",{children:[g.jsxs("div",{className:"node__call",children:[o.callsign,o.node_id===i&&g.jsx("span",{style:{color:"var(--ink-3)",fontWeight:500},children:" · this screen"})]}),g.jsx("div",{className:"node__desc",children:o.description||o.role})]}),g.jsx("div",{className:"node__addr",children:o.address})]},o.node_id)),g.jsx("div",{style:{marginTop:9},children:Object.entries(r).map(([o,l])=>g.jsxs("div",{className:"kv",children:[g.jsx("span",{className:"kv__k",children:s[o]||o}),g.jsx("span",{className:"kv__v",children:l.callsign})]},o))}),g.jsx("div",{style:{fontSize:10,color:"var(--ink-3)",marginTop:8,lineHeight:1.5},children:"Open any node's address on this network to see the same mission. If an edge node drops, its work returns to the simulation host automatically."})]})]})}const fb=(t="")=>/KILL|JAM|FAULT|DEGRADE|ALERT/i.test(t)?"alert":/COMPLETE|RESTORE|ELECTION|SURVEY|LANDED/i.test(t)?"ok":/INTERVENTION|RTH|REASSIGN/i.test(t)?"warn":"info";function bv({telemetry:t}){const e=[...(t==null?void 0:t.events)||[]].reverse();return g.jsxs("div",{className:"panel",children:[g.jsxs("div",{className:"panel__head",children:[g.jsx("span",{className:"panel__title",children:"Mission Log"}),g.jsx("span",{className:"panel__badge",children:e.length})]}),g.jsx("div",{className:"panel__body tight",children:g.jsxs("div",{className:"log",children:[e.length===0&&g.jsx("div",{className:"empty",children:"No events yet."}),e.map((n,i)=>g.jsxs("div",{className:"log__row",children:[g.jsxs("span",{className:"log__time",children:["T+",Ke(n.time,0)]}),g.jsxs("span",{className:"log__msg",children:[g.jsx("span",{className:`log__type ${fb(n.type)}`,children:(n.type||"info").replace(/_/g," ")}),n.message]})]},`${n.time}-${i}`))]})})]})}function pb(t){const e=(t.citations||[]).map(a=>`  [${a.index}] ${String(a.class).toUpperCase()} — ${(a.confidence*100).toFixed(0)}% confidence, ${a.drone_id}, T+${Number(a.timestamp).toFixed(1)}s`).join(`
`),n=`${t.text}

EVIDENCE LOG
${e||"  (none)"}
`,i=new Blob([n],{type:"text/plain"}),r=URL.createObjectURL(i),s=document.createElement("a");s.href=r,s.download=`${t.sitrep_id||"SITREP"}.txt`,document.body.appendChild(s),s.click(),s.remove(),setTimeout(()=>URL.revokeObjectURL(r),1e3)}function Cv({telemetry:t}){const e=t==null?void 0:t.sitrep,n=e==null?void 0:e.latest;return g.jsxs("div",{className:"panel",children:[g.jsxs("div",{className:"panel__head",children:[g.jsx("span",{className:"panel__title",children:"Situation Report"}),g.jsx("span",{className:"panel__badge",children:n?`${Ke(n.generation_time_ms,0)} ms`:"PENDING"})]}),g.jsx("div",{className:"panel__body",children:n?g.jsxs(g.Fragment,{children:[g.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7,fontSize:11},children:[g.jsx("b",{style:{fontFamily:"var(--mono)"},children:n.sitrep_id}),g.jsx("button",{className:"btn",style:{padding:"4px 10px",fontSize:10.5},onClick:()=>pb(n),children:"Download"})]}),g.jsx("div",{className:"sitrep",children:n.text})]}):g.jsxs("div",{className:"empty",children:["No report yet. Press ",g.jsx("b",{children:"Generate SITREP"})," (Operator Control → Weather & mission) to synthesise one from on-board detections."]})})]})}function mb({run:t,onReset:e}){return g.jsxs("div",{className:"panel",children:[g.jsx("div",{className:"panel__head",children:g.jsx("span",{className:"panel__title",children:"Quick Faults"})}),g.jsxs("div",{className:"panel__body",children:[g.jsxs("div",{className:"controls",children:[g.jsx("button",{className:"btn danger",onClick:()=>t("inject",{fault_type:"rf_degrade"}),children:"Degrade RF (global)"}),g.jsx("button",{className:"btn danger",onClick:()=>t("inject",{fault_type:"jamming"}),children:"Jam everywhere"}),g.jsx("button",{className:"btn",onClick:()=>t("inject",{fault_type:"restore"}),children:"Restore RF"}),g.jsx("button",{className:"btn",onClick:()=>t("gust",{magnitude:14}),children:"Wind gust"}),g.jsx("button",{className:"btn primary wide",onClick:e,children:"Reset mission to start"})]}),g.jsx("div",{style:{fontSize:10.5,color:"var(--ink-3)",marginTop:8,lineHeight:1.5},children:"For targeted actions use the Operator Control panel on the 3D view: place a jammer where you want it, or select any aircraft and take it down."})]})]})}function Rv({telemetry:t}){const e=(t==null?void 0:t.metrics)||{},n=(t==null?void 0:t.election)||{},i=(t==null?void 0:t.gnn)||{},r=(e.backhaul_pdr??0)*100,s=e.avg_battery??0,a=n.last_election_ms??0,o=i.convergence_time_ms??0,l=e.pois_surveyed??0,c=e.total_pois??0,u=e.min_separation_ever_m??e.min_separation_m??0,d=e.collisions??0,f=[{label:"Backhaul PDR",value:Ke(r,1),unit:"%",tone:r>92?"ok":r>70?"warn":"bad",sub:"target > 92%"},{label:"Survey Progress",value:`${l}/${c}`,unit:"",tone:l===c&&c>0?"ok":"info",sub:"points of interest"},{label:"Mean Battery",value:Ke(s,0),unit:"%",tone:s>50?"ok":s>22?"warn":"bad",sub:"RTH reserve 22%"},{label:"Self-Heal",value:Ke(a,1),unit:"ms",tone:a>0&&a<300?"ok":a===0?"neutral":"bad",sub:"target < 300 ms"},{label:"Relay Solve",value:Ke(o,1),unit:"ms",tone:"info",sub:"GNN + refinement"},{label:"Closest Approach",value:u>900?"—":Ke(u,0),unit:"m",tone:u>15?"ok":u>5?"warn":"bad",sub:"mission minimum · spec > 5 m"},{label:"Collisions",value:String(d),unit:"",tone:d===0?"ok":"bad",sub:"terrain + aircraft"}];return g.jsx("div",{className:"metrics",children:f.map(p=>g.jsxs("div",{className:"metric",children:[g.jsx("span",{className:"metric__label",children:p.label}),g.jsxs("span",{className:`metric__value ${p.tone}`,children:[p.value,p.unit&&g.jsx("span",{className:"metric__unit",children:p.unit})]}),g.jsx("span",{className:"metric__sub",children:p.sub})]},p.label))})}function gb(){var c,u;const[t,e]=ye.useState(null);ye.useEffect(()=>{let d=!1;return fetch("/api/benchmarks").then(f=>f.json()).then(f=>{d||e(f)}).catch(()=>{d||e({available:!1})}),()=>{d=!0}},[]);const n=(d,f=1,p=1,_="")=>d&&d.n?`${Ke(d.mean*f,p)} ± ${Ke(d.std*f,p)}${_}`:"—";if(!t)return null;if(!t.available)return g.jsxs("div",{className:"panel",children:[g.jsx("div",{className:"panel__head",children:g.jsx("span",{className:"panel__title",children:"Logged Evidence"})}),g.jsx("div",{className:"panel__body",children:g.jsxs("div",{className:"empty",children:["No benchmark results yet.",g.jsx("br",{}),"Run ",g.jsx("code",{children:"python -m bench.run_benchmarks"}),"."]})})]});const i=t.missions||{},r=t.topology||{},s=t.causal||{},a=t.control||{},o=i.self_heal_latency_ms||i.election_time_ms,l=[["Mission completion",n(i.mission_completion_fraction,100,0,"%"),`${((c=i.mission_completion_fraction)==null?void 0:c.n)??0} valleys`],["Collisions",n(i.collisions,1,1),"per mission"],["Closest approach",n(i.min_separation_m,1,0," m"),"mission minimum · spec > 5 m"],["Backhaul PDR, jammed",n(i.backhaul_pdr_under_jamming,100,1,"%"),"target > 92%"],["Self-heal, end-to-end",n(o,1,0," ms"),"target < 300 ms"],["Relay gain over naive",n(r.improvement_over_naive,100,1," pts"),"held-out terrain"],["Causal: jamming ruled out",s.jamming_recall!=null?`${Ke(s.jamming_recall*100,0)}%`:"—",'no false "terrain"'],["Causal: terrain confirmed",s.terrain_recall!=null?`${Ke(s.terrain_recall*100,0)}%`:"—","single-node probe"]];return g.jsxs("div",{className:"panel",children:[g.jsxs("div",{className:"panel__head",children:[g.jsx("span",{className:"panel__title",children:"Logged Evidence"}),g.jsx("span",{className:"panel__badge",children:t.quick_mode?"QUICK RUN":"FULL RUN"})]}),g.jsxs("div",{className:"panel__body",children:[l.map(([d,f,p])=>g.jsxs("div",{className:"kv",children:[g.jsxs("span",{className:"kv__k",children:[d,g.jsx("span",{style:{display:"block",fontSize:9.5,color:"var(--ink-3)",opacity:.8},children:p})]}),g.jsx("span",{className:"kv__v",style:{alignSelf:"center"},children:f})]},d)),a.LTC&&g.jsxs("div",{className:"kv",children:[g.jsxs("span",{className:"kv__k",children:["Cross-track RMS, LTC vs PID",g.jsxs("span",{style:{display:"block",fontSize:9.5,color:"var(--ink-3)"},children:["paired gusts · LTC better in ",(u=a.paired_improvement)==null?void 0:u.rms_ltc_better_in,"/",a.trials]})]}),g.jsxs("span",{className:"kv__v",style:{alignSelf:"center"},children:[Ke(a.LTC.cross_track_rms_m_mean,2)," / ",Ke(a.PID.cross_track_rms_m_mean,2)," m"]})]}),g.jsxs("div",{style:{fontSize:10,color:"var(--ink-3)",marginTop:8,lineHeight:1.5},children:["Mean ± standard deviation over repeated randomised runs, generated"," ",t.generated_at||"—",". Full protocols and per-trial values in"," ",g.jsx("code",{children:"models/benchmarks.json"}),"."]})]})]})}const Ht=(t,e=0)=>t==null||Number.isNaN(t)?"—":Number(t).toFixed(e),gg=t=>{const e=Math.max(0,Math.floor(t||0));return`${String(Math.floor(e/60)).padStart(2,"0")}:${String(e%60).padStart(2,"0")}`};function _b({telemetry:t,run:e}){var l,c;const n=(t==null?void 0:t.mission)||((l=t==null?void 0:t.demo)==null?void 0:l.mission)||{},i=(t==null?void 0:t.metrics)||{},r=n.phase==="LIVE",s=n.phase==="COMPLETE"||n.phase==="ABORTED",a=n.rehearsal||{},o=(c=t==null?void 0:t.demo)==null?void 0:c.theatre;return g.jsxs("section",{className:`base-card base-mission ${r?"live":""}`,children:[g.jsxs("div",{className:"base-card__head",children:[g.jsxs("div",{children:[g.jsx("div",{className:"base-card__kicker",children:"Mission control"}),g.jsx("div",{className:"base-card__title",children:r?`LIVE · ${n.mission_id||""}`:s?`${n.phase} · ${n.mission_id||""}`:"Pre-mission rehearsal"})]}),g.jsx("span",{className:`base-pill ${r?"bad":s?"":"ok"}`,children:r?`T+${gg(n.elapsed)}`:s?"STOOD DOWN":"TRAINING"})]}),g.jsxs("div",{className:"base-card__body",children:[!r&&!s&&g.jsxs(g.Fragment,{children:[g.jsxs("p",{children:["The swarm is rehearsing over ",g.jsx("b",{children:(o==null?void 0:o.name)||"—"}),": real terrain, valley wind and contested radio. Everything it learns here — relay placement, self-healing, causal diagnosis — is what it carries into the operation. Commit it when the numbers below look right."]}),g.jsxs("div",{className:"base-grid",children:[g.jsxs("div",{children:[g.jsx("span",{children:"Backhaul"}),g.jsxs("b",{children:[Ht((i.backhaul_pdr??0)*100),"%"]})]}),g.jsxs("div",{children:[g.jsx("span",{children:"Targets"}),g.jsxs("b",{children:[i.pois_surveyed??0,"/",i.total_pois??0]})]}),g.jsxs("div",{children:[g.jsx("span",{children:"Self-heal"}),g.jsxs("b",{children:[Ht(i.election_time_ms)," ms"]})]}),g.jsxs("div",{children:[g.jsx("span",{children:"Battery"}),g.jsxs("b",{children:[Ht(i.avg_battery),"%"]})]})]}),g.jsx("button",{className:"base-launch",onClick:()=>e("launch_mission"),children:"Launch mission ▸"}),g.jsx("div",{className:"base-note",children:"The forward node flies the operation. This screen keeps command of it."})]}),r&&g.jsxs(g.Fragment,{children:[g.jsx("p",{children:"The swarm is committed and flying the rehearsed plan at the forward node. Reports stream back here in real time."}),g.jsx("div",{className:"base-card__kicker",children:"Carried in from rehearsal"}),g.jsxs("div",{className:"base-grid",children:[g.jsxs("div",{children:[g.jsx("span",{children:"Rehearsed PDR"}),g.jsxs("b",{children:[Ht((a.backhaul_pdr??0)*100),"%"]})]}),g.jsxs("div",{children:[g.jsx("span",{children:"Relay solves"}),g.jsx("b",{children:a.relay_solves??0})]}),g.jsxs("div",{children:[g.jsx("span",{children:"Self-heal"}),g.jsxs("b",{children:[Ht(a.self_heal_ms)," ms"]})]}),g.jsxs("div",{children:[g.jsx("span",{children:"Trained for"}),g.jsx("b",{children:gg(a.flight_time_s)})]})]}),g.jsx("div",{className:"base-card__kicker",children:"Live now"}),g.jsxs("div",{className:"base-grid",children:[g.jsxs("div",{children:[g.jsx("span",{children:"Backhaul"}),g.jsxs("b",{children:[Ht((i.backhaul_pdr??0)*100),"%"]})]}),g.jsxs("div",{children:[g.jsx("span",{children:"Airborne"}),g.jsx("b",{children:i.active_nodes??0})]}),g.jsxs("div",{children:[g.jsx("span",{children:"Targets"}),g.jsxs("b",{children:[i.pois_surveyed??0,"/",i.total_pois??0]})]}),g.jsxs("div",{children:[g.jsx("span",{children:"Battery"}),g.jsxs("b",{children:[Ht(i.avg_battery),"%"]})]})]}),g.jsx("button",{className:"base-launch base-launch--end",onClick:()=>e("end_mission"),children:"End mission"})]}),s&&g.jsx("button",{className:"base-launch",onClick:()=>e("reset_mission"),children:"Reset for another run"})]})]})}function vb({telemetry:t}){var l;const e=(t==null?void 0:t.injects)||{},n=((l=t==null?void 0:t.rf)==null?void 0:l.ew)||{},i=e.enemies||[],r=e.cells||[],s=e.gps_denial||[],a=Object.keys(e.faults||{}),o=!e.rain_mm_h&&!i.length&&!r.length&&!s.length&&!a.length&&!n.active;return g.jsxs("section",{className:"base-card",children:[g.jsxs("div",{className:"base-card__head",children:[g.jsx("div",{className:"base-card__title",children:"Field conditions"}),g.jsx("span",{className:`base-pill ${o?"ok":"bad"}`,children:o?"NOMINAL":"CONTESTED"})]}),g.jsxs("div",{className:"base-card__body",children:[o&&g.jsx("p",{children:"No weather, jamming or hostile activity reported by the field."}),g.jsxs("ul",{className:"base-list",children:[e.rain_mm_h>0&&g.jsxs("li",{children:[g.jsxs("b",{children:["Rainfall ",Ht(e.rain_mm_h)," mm/h"]})," — cloud base"," ",Ht(e.cloud_base_agl)," m AGL, swarm flying under it · wet-antenna loss"," ",Ht(e.antenna_loss_db,1)," dB/aircraft, power draw"," ","+",Ht((e.power_factor-1)*100),"%"]}),r.map(c=>g.jsxs("li",{children:[g.jsx("b",{children:c.id})," — downdraught cell ",Ht(c.downdraught_ms)," m/s,"," ",Ht(c.radius_m)," m across"]},c.id)),s.map(c=>g.jsxs("li",{children:[g.jsx("b",{children:c.id})," — GNSS denial, ",Ht(c.radius_m)," m radius",e.nav_fallback?" · swarm on terrain-relative navigation":" · solution drifting"]},c.id)),a.map(c=>g.jsxs("li",{children:[g.jsx("b",{children:c})," — equipment fault, degraded thrust"]},c)),i.map(c=>g.jsxs("li",{className:"bad-text",children:[g.jsx("b",{children:c.id})," — hostile UAV",c.detected?` tracked, closing on ${c.target||"—"}`:" inbound, not yet detected"]},c.id)),(n.estimates||[]).map(c=>g.jsxs("li",{children:[g.jsx("b",{children:c.id})," — hostile emitter cross-fixed at"," ","(",Ht(c.x),", ",Ht(c.y),") ± ",Ht(c.radius_m)," m, ≈",Ht(c.power_dbm)," dBm"]},c.id))]})]})]})}function xb({telemetry:t,run:e}){var a;const i=((t==null?void 0:t.mission)||((a=t==null?void 0:t.demo)==null?void 0:a.mission)||{}).requests||[],r=i.filter(o=>o.status==="PENDING"),s=i.filter(o=>o.status!=="PENDING").slice(-4).reverse();return g.jsxs("section",{className:`base-card ${r.length?"base-card--alert":""}`,children:[g.jsxs("div",{className:"base-card__head",children:[g.jsx("div",{className:"base-card__title",children:"Support requests"}),g.jsx("span",{className:`base-pill ${r.length?"bad":""}`,children:r.length?`${r.length} AWAITING AUTHORITY`:"NONE PENDING"})]}),g.jsxs("div",{className:"base-card__body",children:[!i.length&&g.jsx("p",{children:"The field can ask for an interceptor release or a replacement aircraft. Neither happens without authorisation from this console."}),r.map(o=>g.jsxs("div",{className:"base-request",children:[g.jsxs("div",{children:[g.jsxs("div",{className:"base-request__head",children:[g.jsxs("b",{children:[o.id," · ",o.kind.replace(/_/g," ")]}),g.jsx("span",{className:`base-urgency ${o.urgency==="IMMEDIATE"?"bad":""}`,children:o.urgency})]}),g.jsx("div",{className:"base-request__why",children:o.reason})]}),g.jsxs("div",{className:"base-request__actions",children:[g.jsx("button",{className:"base-approve",onClick:()=>e("approve_request",{request_id:o.id}),children:"Authorise"}),g.jsx("button",{className:"base-deny",onClick:()=>e("deny_request",{request_id:o.id}),children:"Deny"})]})]},o.id)),s.map(o=>g.jsxs("div",{className:"base-request base-request--done",children:[g.jsxs("span",{children:[g.jsx("b",{children:o.id})," ",o.kind.replace(/_/g," ")]}),g.jsx("span",{className:o.status==="APPROVED"?"ok-text":"bad-text",children:o.status})]},o.id))]})]})}function yb({telemetry:t,run:e,onReset:n,onSwitch:i}){var a,o,l;const s=((t==null?void 0:t.mission)||((a=t==null?void 0:t.demo)==null?void 0:a.mission)||{}).phase==="LIVE";return g.jsxs("div",{className:"base",children:[g.jsxs("header",{className:"base-bar",children:[g.jsxs("div",{children:[g.jsx("div",{className:"base-bar__title",children:"C-DAWN · GROUND BASE"}),g.jsx("div",{className:"base-bar__sub",children:"Mission control · forward node reporting"})]}),g.jsxs("div",{className:"base-bar__status",children:[g.jsx("span",{className:`base-pill ${s?"bad":"ok"}`,children:s?"OPERATION IN PROGRESS":"REHEARSAL"}),g.jsx("span",{className:"base-bar__theatre",children:((l=(o=t==null?void 0:t.demo)==null?void 0:o.theatre)==null?void 0:l.name)||"—"}),g.jsx("button",{className:"base-reset",onClick:i,title:"Switch this screen to the operations view",children:"Operations view ▸"}),g.jsx("button",{className:"base-reset",onClick:n,children:"Reset"})]})]}),g.jsxs("div",{className:"base-body",children:[g.jsxs("div",{className:"base-col",children:[g.jsx(_b,{telemetry:t,run:e}),g.jsx(xb,{telemetry:t,run:e}),g.jsx(vb,{telemetry:t}),g.jsx(Cv,{telemetry:t})]}),g.jsxs("div",{className:"base-col",children:[g.jsx("div",{className:"base-card base-card--flush",children:g.jsx(bv,{telemetry:t})}),g.jsx(yv,{telemetry:t,run:e,onSelect:()=>{},selectedId:null}),g.jsx(Sv,{telemetry:t}),g.jsx(Tv,{telemetry:t}),g.jsx(Mv,{telemetry:t}),g.jsx(Ev,{telemetry:t}),g.jsx(Av,{telemetry:t})]})]}),g.jsx(Rv,{telemetry:t})]})}const _g=[{id:1,label:"Launch & Survey"},{id:2,label:"Contested RF"},{id:3,label:"Node Loss"},{id:4,label:"SITREP"}];function Sb({connected:t,telemetry:e,onTheatre:n,onSwitch:i}){var u,d,f,p,_;const r=(e==null?void 0:e.sim_time)??0,s=((u=e==null?void 0:e.metrics)==null?void 0:u.current_phase)??0,a=e==null?void 0:e.cluster,o=(e==null?void 0:e.served_by)||(a==null?void 0:a.self),l=String(Math.floor(r/60)).padStart(2,"0"),c=String(Math.floor(r%60)).padStart(2,"0");return g.jsxs("header",{className:"cmdbar",children:[g.jsx("div",{className:"brand",children:g.jsxs("div",{children:[g.jsx("div",{className:"brand__name",children:"C-DAWN"}),g.jsx("div",{className:"brand__sub",children:"Swarm Command · Simulation"})]})}),g.jsx("div",{className:"phases",children:_g.map((v,m)=>g.jsxs("div",{style:{display:"flex",alignItems:"center"},children:[g.jsxs("div",{className:`phase ${s>v.id?"done":s===v.id?"active":""}`,children:[g.jsx("span",{className:"phase__dot"}),v.label]}),m<_g.length-1&&g.jsx("span",{className:"phase__sep"})]},v.id))}),g.jsxs("button",{className:"theatre-btn",onClick:n,title:"Change theatre of operations",children:[g.jsx("span",{className:"theatre-btn__label",children:"Theatre"}),g.jsx("span",{className:"theatre-btn__name",children:((f=(d=e==null?void 0:e.demo)==null?void 0:d.theatre)==null?void 0:f.name)||"—"}),((_=(p=e==null?void 0:e.demo)==null?void 0:p.theatre)==null?void 0:_.lat)!=null&&g.jsxs("span",{className:"theatre-btn__coords",children:[e.demo.theatre.lat.toFixed(3),"°N ",e.demo.theatre.lon.toFixed(3),"°E"]}),g.jsx("span",{className:"theatre-btn__chev",children:"▾"})]}),g.jsxs("div",{className:"cmdbar__right",children:[g.jsx("button",{className:"view-switch",onClick:i,title:"Switch this screen to the ground base console",children:"Ground base ▸"}),o&&g.jsxs("div",{style:{textAlign:"right"},children:[g.jsxs("div",{className:"clock__label",children:["Viewing from",o.upstream?` · sim on ${o.upstream}`:""]}),g.jsxs("div",{style:{fontSize:12,fontWeight:700},children:[o.callsign,g.jsx("span",{style:{color:"var(--ink-3)",fontWeight:500,fontFamily:"var(--mono)",fontSize:11,marginLeft:6},children:o.address})]})]}),g.jsxs("div",{style:{textAlign:"right"},children:[g.jsx("div",{className:"clock__label",children:"Mission time"}),g.jsxs("div",{className:"clock",children:["T+",l,":",c]})]}),g.jsxs("div",{className:`linkstate ${t?"up":"down"}`,children:[g.jsx("span",{className:"linkstate__dot"}),t?"LIVE":"NO LINK"]})]})]})}function Mb(){var z,y,E;const{data:t,connected:e,runCommand:n,lastResult:i}=uS(),[r,s]=ye.useState(null),[a,o]=ye.useState("select"),[l,c]=ye.useState(null),[u,d]=ye.useState(5),[f,p]=ye.useState({speed:7,heading:15}),[_,v]=ye.useState(null),[m,h]=ye.useState(!0),[x,S]=ye.useState(()=>{const U=new URLSearchParams(window.location.search).get("view");return U==="base"||U==="field"?U:localStorage.getItem("cdawn.view")||null});ye.useEffect(()=>{x&&localStorage.setItem("cdawn.view",x)},[x]),ye.useEffect(()=>{var F;if(x)return;const U=(F=t==null?void 0:t.served_by)==null?void 0:F.role;U&&S(U==="gcs"?"base":"field")},[x,(z=t==null?void 0:t.served_by)==null?void 0:z.role]);const M=ye.useCallback(U=>s(U),[]),P=ye.useCallback(()=>s(null),[]);ye.useEffect(()=>{const U=F=>{F.key==="Escape"&&o("select")};return window.addEventListener("keydown",U),()=>window.removeEventListener("keydown",U)},[]),ye.useEffect(()=>{if(!i)return;const U=i.result||{};if(!U.ok)v({bad:!0,text:U.error||"Command failed"});else if(U.drone_id&&i.name==="add_drone")v({text:`${U.drone_id} deployed`});else if(U.jammer_id&&i.name==="add_jammer")v({text:`${U.jammer_id} emplaced`});else if(U.poi_id&&i.name==="add_poi")v({text:`${U.poi_id} marked for survey`});else return;const F=setTimeout(()=>v(null),2600);return()=>clearTimeout(F)},[i]);const C=ye.useCallback((U,F)=>{const{x:X,y:K}=U;switch(F){case"add_scout":n("add_drone",{role:"SCOUT",x:X,y:K});break;case"add_relay":n("add_drone",{role:"RELAY",x:X,y:K});break;case"add_poi":n("add_poi",{x:X,y:K,category:"survivor"});break;case"add_jammer":n("add_jammer",{x:X,y:K,power_dbm:u});break;case"goto":(l==null?void 0:l.kind)==="drone"&&n("goto",{drone_id:l.id,x:X,y:K}),o("select");break;default:c(null)}},[n,u,l]),A=ye.useCallback(U=>c(U),[]),b=ye.useCallback(()=>{c(null),o("select"),n("reset_mission")},[n]);return x==="base"?g.jsx(yb,{telemetry:t,run:n,onReset:b,onSwitch:()=>S("field")}):g.jsxs("div",{className:"app",children:[g.jsx(Sb,{connected:e,telemetry:t,onTheatre:()=>h(!0),onSwitch:()=>S("base")}),g.jsx(db,{open:m,onClose:()=>{h(!1),c(null)},currentId:(E=(y=t==null?void 0:t.demo)==null?void 0:y.theatre)==null?void 0:E.id,canClose:!!t}),g.jsxs("div",{className:"workspace",children:[g.jsxs("div",{className:"stage",children:[g.jsx(JA,{telemetry:t,focusDrone:r,onFocusHandled:P,tool:a,selectedId:(l==null?void 0:l.kind)==="drone"?l.id:null,onGroundClick:C,onPick:A}),g.jsx("div",{className:"overlay overlay--tl",children:g.jsx(hb,{telemetry:t})}),g.jsx("div",{className:"overlay overlay--tr",children:g.jsx(eb,{telemetry:t,tool:a,setTool:o,selected:l,setSelected:c,run:n,jammerPower:u,setJammerPower:d,wind:f,setWind:p,onFrame:M})}),_&&g.jsx("div",{className:`toast ${_.bad?"bad":""}`,children:_.text})]}),g.jsxs("div",{className:"sidebar",children:[g.jsx(yv,{telemetry:t,selectedId:(l==null?void 0:l.kind)==="drone"?l.id:null,onSelect:U=>{c({kind:"drone",id:U}),M(U)},run:n}),g.jsx(Sv,{telemetry:t}),g.jsx(Tv,{telemetry:t}),g.jsx(Mv,{telemetry:t}),g.jsx(Ev,{telemetry:t}),g.jsx(Av,{telemetry:t}),g.jsx(gb,{}),g.jsx(Cv,{telemetry:t}),g.jsx(bv,{telemetry:t}),g.jsx(mb,{run:n,onReset:b})]})]}),g.jsx(Rv,{telemetry:t})]})}Bu.createRoot(document.getElementById("root")).render(g.jsx(Jv.StrictMode,{children:g.jsx(Mb,{})}));
