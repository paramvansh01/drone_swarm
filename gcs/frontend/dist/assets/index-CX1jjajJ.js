var P0=Object.defineProperty;var N0=(t,e,n)=>e in t?P0(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n;var Of=(t,e,n)=>N0(t,typeof e!="symbol"?e+"":e,n);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function n(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=n(r);fetch(r.href,s)}})();function L0(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var pg={exports:{}},oc={},mg={exports:{}},Ye={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var no=Symbol.for("react.element"),D0=Symbol.for("react.portal"),I0=Symbol.for("react.fragment"),U0=Symbol.for("react.strict_mode"),k0=Symbol.for("react.profiler"),F0=Symbol.for("react.provider"),O0=Symbol.for("react.context"),z0=Symbol.for("react.forward_ref"),B0=Symbol.for("react.suspense"),H0=Symbol.for("react.memo"),G0=Symbol.for("react.lazy"),zf=Symbol.iterator;function V0(t){return t===null||typeof t!="object"?null:(t=zf&&t[zf]||t["@@iterator"],typeof t=="function"?t:null)}var gg={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},_g=Object.assign,vg={};function Ks(t,e,n){this.props=t,this.context=e,this.refs=vg,this.updater=n||gg}Ks.prototype.isReactComponent={};Ks.prototype.setState=function(t,e){if(typeof t!="object"&&typeof t!="function"&&t!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,t,e,"setState")};Ks.prototype.forceUpdate=function(t){this.updater.enqueueForceUpdate(this,t,"forceUpdate")};function xg(){}xg.prototype=Ks.prototype;function Sh(t,e,n){this.props=t,this.context=e,this.refs=vg,this.updater=n||gg}var Mh=Sh.prototype=new xg;Mh.constructor=Sh;_g(Mh,Ks.prototype);Mh.isPureReactComponent=!0;var Bf=Array.isArray,yg=Object.prototype.hasOwnProperty,Eh={current:null},Sg={key:!0,ref:!0,__self:!0,__source:!0};function Mg(t,e,n){var i,r={},s=null,a=null;if(e!=null)for(i in e.ref!==void 0&&(a=e.ref),e.key!==void 0&&(s=""+e.key),e)yg.call(e,i)&&!Sg.hasOwnProperty(i)&&(r[i]=e[i]);var o=arguments.length-2;if(o===1)r.children=n;else if(1<o){for(var l=Array(o),c=0;c<o;c++)l[c]=arguments[c+2];r.children=l}if(t&&t.defaultProps)for(i in o=t.defaultProps,o)r[i]===void 0&&(r[i]=o[i]);return{$$typeof:no,type:t,key:s,ref:a,props:r,_owner:Eh.current}}function j0(t,e){return{$$typeof:no,type:t.type,key:e,ref:t.ref,props:t.props,_owner:t._owner}}function wh(t){return typeof t=="object"&&t!==null&&t.$$typeof===no}function W0(t){var e={"=":"=0",":":"=2"};return"$"+t.replace(/[=:]/g,function(n){return e[n]})}var Hf=/\/+/g;function Nc(t,e){return typeof t=="object"&&t!==null&&t.key!=null?W0(""+t.key):e.toString(36)}function ul(t,e,n,i,r){var s=typeof t;(s==="undefined"||s==="boolean")&&(t=null);var a=!1;if(t===null)a=!0;else switch(s){case"string":case"number":a=!0;break;case"object":switch(t.$$typeof){case no:case D0:a=!0}}if(a)return a=t,r=r(a),t=i===""?"."+Nc(a,0):i,Bf(r)?(n="",t!=null&&(n=t.replace(Hf,"$&/")+"/"),ul(r,e,n,"",function(c){return c})):r!=null&&(wh(r)&&(r=j0(r,n+(!r.key||a&&a.key===r.key?"":(""+r.key).replace(Hf,"$&/")+"/")+t)),e.push(r)),1;if(a=0,i=i===""?".":i+":",Bf(t))for(var o=0;o<t.length;o++){s=t[o];var l=i+Nc(s,o);a+=ul(s,e,n,l,r)}else if(l=V0(t),typeof l=="function")for(t=l.call(t),o=0;!(s=t.next()).done;)s=s.value,l=i+Nc(s,o++),a+=ul(s,e,n,l,r);else if(s==="object")throw e=String(t),Error("Objects are not valid as a React child (found: "+(e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)+"). If you meant to render a collection of children, use an array instead.");return a}function mo(t,e,n){if(t==null)return t;var i=[],r=0;return ul(t,i,"","",function(s){return e.call(n,s,r++)}),i}function X0(t){if(t._status===-1){var e=t._result;e=e(),e.then(function(n){(t._status===0||t._status===-1)&&(t._status=1,t._result=n)},function(n){(t._status===0||t._status===-1)&&(t._status=2,t._result=n)}),t._status===-1&&(t._status=0,t._result=e)}if(t._status===1)return t._result.default;throw t._result}var un={current:null},dl={transition:null},$0={ReactCurrentDispatcher:un,ReactCurrentBatchConfig:dl,ReactCurrentOwner:Eh};function Eg(){throw Error("act(...) is not supported in production builds of React.")}Ye.Children={map:mo,forEach:function(t,e,n){mo(t,function(){e.apply(this,arguments)},n)},count:function(t){var e=0;return mo(t,function(){e++}),e},toArray:function(t){return mo(t,function(e){return e})||[]},only:function(t){if(!wh(t))throw Error("React.Children.only expected to receive a single React element child.");return t}};Ye.Component=Ks;Ye.Fragment=I0;Ye.Profiler=k0;Ye.PureComponent=Sh;Ye.StrictMode=U0;Ye.Suspense=B0;Ye.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=$0;Ye.act=Eg;Ye.cloneElement=function(t,e,n){if(t==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+t+".");var i=_g({},t.props),r=t.key,s=t.ref,a=t._owner;if(e!=null){if(e.ref!==void 0&&(s=e.ref,a=Eh.current),e.key!==void 0&&(r=""+e.key),t.type&&t.type.defaultProps)var o=t.type.defaultProps;for(l in e)yg.call(e,l)&&!Sg.hasOwnProperty(l)&&(i[l]=e[l]===void 0&&o!==void 0?o[l]:e[l])}var l=arguments.length-2;if(l===1)i.children=n;else if(1<l){o=Array(l);for(var c=0;c<l;c++)o[c]=arguments[c+2];i.children=o}return{$$typeof:no,type:t.type,key:r,ref:s,props:i,_owner:a}};Ye.createContext=function(t){return t={$$typeof:O0,_currentValue:t,_currentValue2:t,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},t.Provider={$$typeof:F0,_context:t},t.Consumer=t};Ye.createElement=Mg;Ye.createFactory=function(t){var e=Mg.bind(null,t);return e.type=t,e};Ye.createRef=function(){return{current:null}};Ye.forwardRef=function(t){return{$$typeof:z0,render:t}};Ye.isValidElement=wh;Ye.lazy=function(t){return{$$typeof:G0,_payload:{_status:-1,_result:t},_init:X0}};Ye.memo=function(t,e){return{$$typeof:H0,type:t,compare:e===void 0?null:e}};Ye.startTransition=function(t){var e=dl.transition;dl.transition={};try{t()}finally{dl.transition=e}};Ye.unstable_act=Eg;Ye.useCallback=function(t,e){return un.current.useCallback(t,e)};Ye.useContext=function(t){return un.current.useContext(t)};Ye.useDebugValue=function(){};Ye.useDeferredValue=function(t){return un.current.useDeferredValue(t)};Ye.useEffect=function(t,e){return un.current.useEffect(t,e)};Ye.useId=function(){return un.current.useId()};Ye.useImperativeHandle=function(t,e,n){return un.current.useImperativeHandle(t,e,n)};Ye.useInsertionEffect=function(t,e){return un.current.useInsertionEffect(t,e)};Ye.useLayoutEffect=function(t,e){return un.current.useLayoutEffect(t,e)};Ye.useMemo=function(t,e){return un.current.useMemo(t,e)};Ye.useReducer=function(t,e,n){return un.current.useReducer(t,e,n)};Ye.useRef=function(t){return un.current.useRef(t)};Ye.useState=function(t){return un.current.useState(t)};Ye.useSyncExternalStore=function(t,e,n){return un.current.useSyncExternalStore(t,e,n)};Ye.useTransition=function(){return un.current.useTransition()};Ye.version="18.3.1";mg.exports=Ye;var ye=mg.exports;const Y0=L0(ye);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var q0=ye,K0=Symbol.for("react.element"),Z0=Symbol.for("react.fragment"),Q0=Object.prototype.hasOwnProperty,J0=q0.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,ex={key:!0,ref:!0,__self:!0,__source:!0};function wg(t,e,n){var i,r={},s=null,a=null;n!==void 0&&(s=""+n),e.key!==void 0&&(s=""+e.key),e.ref!==void 0&&(a=e.ref);for(i in e)Q0.call(e,i)&&!ex.hasOwnProperty(i)&&(r[i]=e[i]);if(t&&t.defaultProps)for(i in e=t.defaultProps,e)r[i]===void 0&&(r[i]=e[i]);return{$$typeof:K0,type:t,key:s,ref:a,props:r,_owner:J0.current}}oc.Fragment=Z0;oc.jsx=wg;oc.jsxs=wg;pg.exports=oc;var g=pg.exports,zu={},Tg={exports:{}},Rn={},Ag={exports:{}},bg={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(t){function e(I,ee){var ne=I.length;I.push(ee);e:for(;0<ne;){var le=ne-1>>>1,Te=I[le];if(0<r(Te,ee))I[le]=ee,I[ne]=Te,ne=le;else break e}}function n(I){return I.length===0?null:I[0]}function i(I){if(I.length===0)return null;var ee=I[0],ne=I.pop();if(ne!==ee){I[0]=ne;e:for(var le=0,Te=I.length,ze=Te>>>1;le<ze;){var X=2*(le+1)-1,Y=I[X],ue=X+1,de=I[ue];if(0>r(Y,ne))ue<Te&&0>r(de,Y)?(I[le]=de,I[ue]=ne,le=ue):(I[le]=Y,I[X]=ne,le=X);else if(ue<Te&&0>r(de,ne))I[le]=de,I[ue]=ne,le=ue;else break e}}return ee}function r(I,ee){var ne=I.sortIndex-ee.sortIndex;return ne!==0?ne:I.id-ee.id}if(typeof performance=="object"&&typeof performance.now=="function"){var s=performance;t.unstable_now=function(){return s.now()}}else{var a=Date,o=a.now();t.unstable_now=function(){return a.now()-o}}var l=[],c=[],u=1,f=null,h=3,p=!1,_=!1,v=!1,m=typeof setTimeout=="function"?setTimeout:null,d=typeof clearTimeout=="function"?clearTimeout:null,x=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function y(I){for(var ee=n(c);ee!==null;){if(ee.callback===null)i(c);else if(ee.startTime<=I)i(c),ee.sortIndex=ee.expirationTime,e(l,ee);else break;ee=n(c)}}function M(I){if(v=!1,y(I),!_)if(n(l)!==null)_=!0,W(P);else{var ee=n(c);ee!==null&&ie(M,ee.startTime-I)}}function P(I,ee){_=!1,v&&(v=!1,d(b),b=-1),p=!0;var ne=h;try{for(y(ee),f=n(l);f!==null&&(!(f.expirationTime>ee)||I&&!w());){var le=f.callback;if(typeof le=="function"){f.callback=null,h=f.priorityLevel;var Te=le(f.expirationTime<=ee);ee=t.unstable_now(),typeof Te=="function"?f.callback=Te:f===n(l)&&i(l),y(ee)}else i(l);f=n(l)}if(f!==null)var ze=!0;else{var X=n(c);X!==null&&ie(M,X.startTime-ee),ze=!1}return ze}finally{f=null,h=ne,p=!1}}var C=!1,A=null,b=-1,z=5,S=-1;function w(){return!(t.unstable_now()-S<z)}function N(){if(A!==null){var I=t.unstable_now();S=I;var ee=!0;try{ee=A(!0,I)}finally{ee?k():(C=!1,A=null)}}else C=!1}var k;if(typeof x=="function")k=function(){x(N)};else if(typeof MessageChannel<"u"){var j=new MessageChannel,q=j.port2;j.port1.onmessage=N,k=function(){q.postMessage(null)}}else k=function(){m(N,0)};function W(I){A=I,C||(C=!0,k())}function ie(I,ee){b=m(function(){I(t.unstable_now())},ee)}t.unstable_IdlePriority=5,t.unstable_ImmediatePriority=1,t.unstable_LowPriority=4,t.unstable_NormalPriority=3,t.unstable_Profiling=null,t.unstable_UserBlockingPriority=2,t.unstable_cancelCallback=function(I){I.callback=null},t.unstable_continueExecution=function(){_||p||(_=!0,W(P))},t.unstable_forceFrameRate=function(I){0>I||125<I?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):z=0<I?Math.floor(1e3/I):5},t.unstable_getCurrentPriorityLevel=function(){return h},t.unstable_getFirstCallbackNode=function(){return n(l)},t.unstable_next=function(I){switch(h){case 1:case 2:case 3:var ee=3;break;default:ee=h}var ne=h;h=ee;try{return I()}finally{h=ne}},t.unstable_pauseExecution=function(){},t.unstable_requestPaint=function(){},t.unstable_runWithPriority=function(I,ee){switch(I){case 1:case 2:case 3:case 4:case 5:break;default:I=3}var ne=h;h=I;try{return ee()}finally{h=ne}},t.unstable_scheduleCallback=function(I,ee,ne){var le=t.unstable_now();switch(typeof ne=="object"&&ne!==null?(ne=ne.delay,ne=typeof ne=="number"&&0<ne?le+ne:le):ne=le,I){case 1:var Te=-1;break;case 2:Te=250;break;case 5:Te=1073741823;break;case 4:Te=1e4;break;default:Te=5e3}return Te=ne+Te,I={id:u++,callback:ee,priorityLevel:I,startTime:ne,expirationTime:Te,sortIndex:-1},ne>le?(I.sortIndex=ne,e(c,I),n(l)===null&&I===n(c)&&(v?(d(b),b=-1):v=!0,ie(M,ne-le))):(I.sortIndex=Te,e(l,I),_||p||(_=!0,W(P))),I},t.unstable_shouldYield=w,t.unstable_wrapCallback=function(I){var ee=h;return function(){var ne=h;h=ee;try{return I.apply(this,arguments)}finally{h=ne}}}})(bg);Ag.exports=bg;var tx=Ag.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var nx=ye,Cn=tx;function ae(t){for(var e="https://reactjs.org/docs/error-decoder.html?invariant="+t,n=1;n<arguments.length;n++)e+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+t+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var Cg=new Set,ka={};function Wr(t,e){ks(t,e),ks(t+"Capture",e)}function ks(t,e){for(ka[t]=e,t=0;t<e.length;t++)Cg.add(e[t])}var Ri=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Bu=Object.prototype.hasOwnProperty,ix=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,Gf={},Vf={};function rx(t){return Bu.call(Vf,t)?!0:Bu.call(Gf,t)?!1:ix.test(t)?Vf[t]=!0:(Gf[t]=!0,!1)}function sx(t,e,n,i){if(n!==null&&n.type===0)return!1;switch(typeof e){case"function":case"symbol":return!0;case"boolean":return i?!1:n!==null?!n.acceptsBooleans:(t=t.toLowerCase().slice(0,5),t!=="data-"&&t!=="aria-");default:return!1}}function ax(t,e,n,i){if(e===null||typeof e>"u"||sx(t,e,n,i))return!0;if(i)return!1;if(n!==null)switch(n.type){case 3:return!e;case 4:return e===!1;case 5:return isNaN(e);case 6:return isNaN(e)||1>e}return!1}function dn(t,e,n,i,r,s,a){this.acceptsBooleans=e===2||e===3||e===4,this.attributeName=i,this.attributeNamespace=r,this.mustUseProperty=n,this.propertyName=t,this.type=e,this.sanitizeURL=s,this.removeEmptyString=a}var qt={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(t){qt[t]=new dn(t,0,!1,t,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(t){var e=t[0];qt[e]=new dn(e,1,!1,t[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(t){qt[t]=new dn(t,2,!1,t.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(t){qt[t]=new dn(t,2,!1,t,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(t){qt[t]=new dn(t,3,!1,t.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(t){qt[t]=new dn(t,3,!0,t,null,!1,!1)});["capture","download"].forEach(function(t){qt[t]=new dn(t,4,!1,t,null,!1,!1)});["cols","rows","size","span"].forEach(function(t){qt[t]=new dn(t,6,!1,t,null,!1,!1)});["rowSpan","start"].forEach(function(t){qt[t]=new dn(t,5,!1,t.toLowerCase(),null,!1,!1)});var Th=/[\-:]([a-z])/g;function Ah(t){return t[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(t){var e=t.replace(Th,Ah);qt[e]=new dn(e,1,!1,t,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(t){var e=t.replace(Th,Ah);qt[e]=new dn(e,1,!1,t,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(t){var e=t.replace(Th,Ah);qt[e]=new dn(e,1,!1,t,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(t){qt[t]=new dn(t,1,!1,t.toLowerCase(),null,!1,!1)});qt.xlinkHref=new dn("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(t){qt[t]=new dn(t,1,!1,t.toLowerCase(),null,!0,!0)});function bh(t,e,n,i){var r=qt.hasOwnProperty(e)?qt[e]:null;(r!==null?r.type!==0:i||!(2<e.length)||e[0]!=="o"&&e[0]!=="O"||e[1]!=="n"&&e[1]!=="N")&&(ax(e,n,r,i)&&(n=null),i||r===null?rx(e)&&(n===null?t.removeAttribute(e):t.setAttribute(e,""+n)):r.mustUseProperty?t[r.propertyName]=n===null?r.type===3?!1:"":n:(e=r.attributeName,i=r.attributeNamespace,n===null?t.removeAttribute(e):(r=r.type,n=r===3||r===4&&n===!0?"":""+n,i?t.setAttributeNS(i,e,n):t.setAttribute(e,n))))}var Ii=nx.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,go=Symbol.for("react.element"),ps=Symbol.for("react.portal"),ms=Symbol.for("react.fragment"),Ch=Symbol.for("react.strict_mode"),Hu=Symbol.for("react.profiler"),Rg=Symbol.for("react.provider"),Pg=Symbol.for("react.context"),Rh=Symbol.for("react.forward_ref"),Gu=Symbol.for("react.suspense"),Vu=Symbol.for("react.suspense_list"),Ph=Symbol.for("react.memo"),Vi=Symbol.for("react.lazy"),Ng=Symbol.for("react.offscreen"),jf=Symbol.iterator;function ta(t){return t===null||typeof t!="object"?null:(t=jf&&t[jf]||t["@@iterator"],typeof t=="function"?t:null)}var wt=Object.assign,Lc;function xa(t){if(Lc===void 0)try{throw Error()}catch(n){var e=n.stack.trim().match(/\n( *(at )?)/);Lc=e&&e[1]||""}return`
`+Lc+t}var Dc=!1;function Ic(t,e){if(!t||Dc)return"";Dc=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(e)if(e=function(){throw Error()},Object.defineProperty(e.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(e,[])}catch(c){var i=c}Reflect.construct(t,[],e)}else{try{e.call()}catch(c){i=c}t.call(e.prototype)}else{try{throw Error()}catch(c){i=c}t()}}catch(c){if(c&&i&&typeof c.stack=="string"){for(var r=c.stack.split(`
`),s=i.stack.split(`
`),a=r.length-1,o=s.length-1;1<=a&&0<=o&&r[a]!==s[o];)o--;for(;1<=a&&0<=o;a--,o--)if(r[a]!==s[o]){if(a!==1||o!==1)do if(a--,o--,0>o||r[a]!==s[o]){var l=`
`+r[a].replace(" at new "," at ");return t.displayName&&l.includes("<anonymous>")&&(l=l.replace("<anonymous>",t.displayName)),l}while(1<=a&&0<=o);break}}}finally{Dc=!1,Error.prepareStackTrace=n}return(t=t?t.displayName||t.name:"")?xa(t):""}function ox(t){switch(t.tag){case 5:return xa(t.type);case 16:return xa("Lazy");case 13:return xa("Suspense");case 19:return xa("SuspenseList");case 0:case 2:case 15:return t=Ic(t.type,!1),t;case 11:return t=Ic(t.type.render,!1),t;case 1:return t=Ic(t.type,!0),t;default:return""}}function ju(t){if(t==null)return null;if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case ms:return"Fragment";case ps:return"Portal";case Hu:return"Profiler";case Ch:return"StrictMode";case Gu:return"Suspense";case Vu:return"SuspenseList"}if(typeof t=="object")switch(t.$$typeof){case Pg:return(t.displayName||"Context")+".Consumer";case Rg:return(t._context.displayName||"Context")+".Provider";case Rh:var e=t.render;return t=t.displayName,t||(t=e.displayName||e.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case Ph:return e=t.displayName||null,e!==null?e:ju(t.type)||"Memo";case Vi:e=t._payload,t=t._init;try{return ju(t(e))}catch{}}return null}function lx(t){var e=t.type;switch(t.tag){case 24:return"Cache";case 9:return(e.displayName||"Context")+".Consumer";case 10:return(e._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return t=e.render,t=t.displayName||t.name||"",e.displayName||(t!==""?"ForwardRef("+t+")":"ForwardRef");case 7:return"Fragment";case 5:return e;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return ju(e);case 8:return e===Ch?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e}return null}function cr(t){switch(typeof t){case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function Lg(t){var e=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(e==="checkbox"||e==="radio")}function cx(t){var e=Lg(t)?"checked":"value",n=Object.getOwnPropertyDescriptor(t.constructor.prototype,e),i=""+t[e];if(!t.hasOwnProperty(e)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var r=n.get,s=n.set;return Object.defineProperty(t,e,{configurable:!0,get:function(){return r.call(this)},set:function(a){i=""+a,s.call(this,a)}}),Object.defineProperty(t,e,{enumerable:n.enumerable}),{getValue:function(){return i},setValue:function(a){i=""+a},stopTracking:function(){t._valueTracker=null,delete t[e]}}}}function _o(t){t._valueTracker||(t._valueTracker=cx(t))}function Dg(t){if(!t)return!1;var e=t._valueTracker;if(!e)return!0;var n=e.getValue(),i="";return t&&(i=Lg(t)?t.checked?"true":"false":t.value),t=i,t!==n?(e.setValue(t),!0):!1}function Rl(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}function Wu(t,e){var n=e.checked;return wt({},e,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??t._wrapperState.initialChecked})}function Wf(t,e){var n=e.defaultValue==null?"":e.defaultValue,i=e.checked!=null?e.checked:e.defaultChecked;n=cr(e.value!=null?e.value:n),t._wrapperState={initialChecked:i,initialValue:n,controlled:e.type==="checkbox"||e.type==="radio"?e.checked!=null:e.value!=null}}function Ig(t,e){e=e.checked,e!=null&&bh(t,"checked",e,!1)}function Xu(t,e){Ig(t,e);var n=cr(e.value),i=e.type;if(n!=null)i==="number"?(n===0&&t.value===""||t.value!=n)&&(t.value=""+n):t.value!==""+n&&(t.value=""+n);else if(i==="submit"||i==="reset"){t.removeAttribute("value");return}e.hasOwnProperty("value")?$u(t,e.type,n):e.hasOwnProperty("defaultValue")&&$u(t,e.type,cr(e.defaultValue)),e.checked==null&&e.defaultChecked!=null&&(t.defaultChecked=!!e.defaultChecked)}function Xf(t,e,n){if(e.hasOwnProperty("value")||e.hasOwnProperty("defaultValue")){var i=e.type;if(!(i!=="submit"&&i!=="reset"||e.value!==void 0&&e.value!==null))return;e=""+t._wrapperState.initialValue,n||e===t.value||(t.value=e),t.defaultValue=e}n=t.name,n!==""&&(t.name=""),t.defaultChecked=!!t._wrapperState.initialChecked,n!==""&&(t.name=n)}function $u(t,e,n){(e!=="number"||Rl(t.ownerDocument)!==t)&&(n==null?t.defaultValue=""+t._wrapperState.initialValue:t.defaultValue!==""+n&&(t.defaultValue=""+n))}var ya=Array.isArray;function bs(t,e,n,i){if(t=t.options,e){e={};for(var r=0;r<n.length;r++)e["$"+n[r]]=!0;for(n=0;n<t.length;n++)r=e.hasOwnProperty("$"+t[n].value),t[n].selected!==r&&(t[n].selected=r),r&&i&&(t[n].defaultSelected=!0)}else{for(n=""+cr(n),e=null,r=0;r<t.length;r++){if(t[r].value===n){t[r].selected=!0,i&&(t[r].defaultSelected=!0);return}e!==null||t[r].disabled||(e=t[r])}e!==null&&(e.selected=!0)}}function Yu(t,e){if(e.dangerouslySetInnerHTML!=null)throw Error(ae(91));return wt({},e,{value:void 0,defaultValue:void 0,children:""+t._wrapperState.initialValue})}function $f(t,e){var n=e.value;if(n==null){if(n=e.children,e=e.defaultValue,n!=null){if(e!=null)throw Error(ae(92));if(ya(n)){if(1<n.length)throw Error(ae(93));n=n[0]}e=n}e==null&&(e=""),n=e}t._wrapperState={initialValue:cr(n)}}function Ug(t,e){var n=cr(e.value),i=cr(e.defaultValue);n!=null&&(n=""+n,n!==t.value&&(t.value=n),e.defaultValue==null&&t.defaultValue!==n&&(t.defaultValue=n)),i!=null&&(t.defaultValue=""+i)}function Yf(t){var e=t.textContent;e===t._wrapperState.initialValue&&e!==""&&e!==null&&(t.value=e)}function kg(t){switch(t){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function qu(t,e){return t==null||t==="http://www.w3.org/1999/xhtml"?kg(e):t==="http://www.w3.org/2000/svg"&&e==="foreignObject"?"http://www.w3.org/1999/xhtml":t}var vo,Fg=function(t){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(e,n,i,r){MSApp.execUnsafeLocalFunction(function(){return t(e,n,i,r)})}:t}(function(t,e){if(t.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in t)t.innerHTML=e;else{for(vo=vo||document.createElement("div"),vo.innerHTML="<svg>"+e.valueOf().toString()+"</svg>",e=vo.firstChild;t.firstChild;)t.removeChild(t.firstChild);for(;e.firstChild;)t.appendChild(e.firstChild)}});function Fa(t,e){if(e){var n=t.firstChild;if(n&&n===t.lastChild&&n.nodeType===3){n.nodeValue=e;return}}t.textContent=e}var wa={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},ux=["Webkit","ms","Moz","O"];Object.keys(wa).forEach(function(t){ux.forEach(function(e){e=e+t.charAt(0).toUpperCase()+t.substring(1),wa[e]=wa[t]})});function Og(t,e,n){return e==null||typeof e=="boolean"||e===""?"":n||typeof e!="number"||e===0||wa.hasOwnProperty(t)&&wa[t]?(""+e).trim():e+"px"}function zg(t,e){t=t.style;for(var n in e)if(e.hasOwnProperty(n)){var i=n.indexOf("--")===0,r=Og(n,e[n],i);n==="float"&&(n="cssFloat"),i?t.setProperty(n,r):t[n]=r}}var dx=wt({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Ku(t,e){if(e){if(dx[t]&&(e.children!=null||e.dangerouslySetInnerHTML!=null))throw Error(ae(137,t));if(e.dangerouslySetInnerHTML!=null){if(e.children!=null)throw Error(ae(60));if(typeof e.dangerouslySetInnerHTML!="object"||!("__html"in e.dangerouslySetInnerHTML))throw Error(ae(61))}if(e.style!=null&&typeof e.style!="object")throw Error(ae(62))}}function Zu(t,e){if(t.indexOf("-")===-1)return typeof e.is=="string";switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Qu=null;function Nh(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var Ju=null,Cs=null,Rs=null;function qf(t){if(t=so(t)){if(typeof Ju!="function")throw Error(ae(280));var e=t.stateNode;e&&(e=hc(e),Ju(t.stateNode,t.type,e))}}function Bg(t){Cs?Rs?Rs.push(t):Rs=[t]:Cs=t}function Hg(){if(Cs){var t=Cs,e=Rs;if(Rs=Cs=null,qf(t),e)for(t=0;t<e.length;t++)qf(e[t])}}function Gg(t,e){return t(e)}function Vg(){}var Uc=!1;function jg(t,e,n){if(Uc)return t(e,n);Uc=!0;try{return Gg(t,e,n)}finally{Uc=!1,(Cs!==null||Rs!==null)&&(Vg(),Hg())}}function Oa(t,e){var n=t.stateNode;if(n===null)return null;var i=hc(n);if(i===null)return null;n=i[e];e:switch(e){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(i=!i.disabled)||(t=t.type,i=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!i;break e;default:t=!1}if(t)return null;if(n&&typeof n!="function")throw Error(ae(231,e,typeof n));return n}var ed=!1;if(Ri)try{var na={};Object.defineProperty(na,"passive",{get:function(){ed=!0}}),window.addEventListener("test",na,na),window.removeEventListener("test",na,na)}catch{ed=!1}function hx(t,e,n,i,r,s,a,o,l){var c=Array.prototype.slice.call(arguments,3);try{e.apply(n,c)}catch(u){this.onError(u)}}var Ta=!1,Pl=null,Nl=!1,td=null,fx={onError:function(t){Ta=!0,Pl=t}};function px(t,e,n,i,r,s,a,o,l){Ta=!1,Pl=null,hx.apply(fx,arguments)}function mx(t,e,n,i,r,s,a,o,l){if(px.apply(this,arguments),Ta){if(Ta){var c=Pl;Ta=!1,Pl=null}else throw Error(ae(198));Nl||(Nl=!0,td=c)}}function Xr(t){var e=t,n=t;if(t.alternate)for(;e.return;)e=e.return;else{t=e;do e=t,e.flags&4098&&(n=e.return),t=e.return;while(t)}return e.tag===3?n:null}function Wg(t){if(t.tag===13){var e=t.memoizedState;if(e===null&&(t=t.alternate,t!==null&&(e=t.memoizedState)),e!==null)return e.dehydrated}return null}function Kf(t){if(Xr(t)!==t)throw Error(ae(188))}function gx(t){var e=t.alternate;if(!e){if(e=Xr(t),e===null)throw Error(ae(188));return e!==t?null:t}for(var n=t,i=e;;){var r=n.return;if(r===null)break;var s=r.alternate;if(s===null){if(i=r.return,i!==null){n=i;continue}break}if(r.child===s.child){for(s=r.child;s;){if(s===n)return Kf(r),t;if(s===i)return Kf(r),e;s=s.sibling}throw Error(ae(188))}if(n.return!==i.return)n=r,i=s;else{for(var a=!1,o=r.child;o;){if(o===n){a=!0,n=r,i=s;break}if(o===i){a=!0,i=r,n=s;break}o=o.sibling}if(!a){for(o=s.child;o;){if(o===n){a=!0,n=s,i=r;break}if(o===i){a=!0,i=s,n=r;break}o=o.sibling}if(!a)throw Error(ae(189))}}if(n.alternate!==i)throw Error(ae(190))}if(n.tag!==3)throw Error(ae(188));return n.stateNode.current===n?t:e}function Xg(t){return t=gx(t),t!==null?$g(t):null}function $g(t){if(t.tag===5||t.tag===6)return t;for(t=t.child;t!==null;){var e=$g(t);if(e!==null)return e;t=t.sibling}return null}var Yg=Cn.unstable_scheduleCallback,Zf=Cn.unstable_cancelCallback,_x=Cn.unstable_shouldYield,vx=Cn.unstable_requestPaint,Pt=Cn.unstable_now,xx=Cn.unstable_getCurrentPriorityLevel,Lh=Cn.unstable_ImmediatePriority,qg=Cn.unstable_UserBlockingPriority,Ll=Cn.unstable_NormalPriority,yx=Cn.unstable_LowPriority,Kg=Cn.unstable_IdlePriority,lc=null,di=null;function Sx(t){if(di&&typeof di.onCommitFiberRoot=="function")try{di.onCommitFiberRoot(lc,t,void 0,(t.current.flags&128)===128)}catch{}}var ii=Math.clz32?Math.clz32:wx,Mx=Math.log,Ex=Math.LN2;function wx(t){return t>>>=0,t===0?32:31-(Mx(t)/Ex|0)|0}var xo=64,yo=4194304;function Sa(t){switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return t&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return t}}function Dl(t,e){var n=t.pendingLanes;if(n===0)return 0;var i=0,r=t.suspendedLanes,s=t.pingedLanes,a=n&268435455;if(a!==0){var o=a&~r;o!==0?i=Sa(o):(s&=a,s!==0&&(i=Sa(s)))}else a=n&~r,a!==0?i=Sa(a):s!==0&&(i=Sa(s));if(i===0)return 0;if(e!==0&&e!==i&&!(e&r)&&(r=i&-i,s=e&-e,r>=s||r===16&&(s&4194240)!==0))return e;if(i&4&&(i|=n&16),e=t.entangledLanes,e!==0)for(t=t.entanglements,e&=i;0<e;)n=31-ii(e),r=1<<n,i|=t[n],e&=~r;return i}function Tx(t,e){switch(t){case 1:case 2:case 4:return e+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Ax(t,e){for(var n=t.suspendedLanes,i=t.pingedLanes,r=t.expirationTimes,s=t.pendingLanes;0<s;){var a=31-ii(s),o=1<<a,l=r[a];l===-1?(!(o&n)||o&i)&&(r[a]=Tx(o,e)):l<=e&&(t.expiredLanes|=o),s&=~o}}function nd(t){return t=t.pendingLanes&-1073741825,t!==0?t:t&1073741824?1073741824:0}function Zg(){var t=xo;return xo<<=1,!(xo&4194240)&&(xo=64),t}function kc(t){for(var e=[],n=0;31>n;n++)e.push(t);return e}function io(t,e,n){t.pendingLanes|=e,e!==536870912&&(t.suspendedLanes=0,t.pingedLanes=0),t=t.eventTimes,e=31-ii(e),t[e]=n}function bx(t,e){var n=t.pendingLanes&~e;t.pendingLanes=e,t.suspendedLanes=0,t.pingedLanes=0,t.expiredLanes&=e,t.mutableReadLanes&=e,t.entangledLanes&=e,e=t.entanglements;var i=t.eventTimes;for(t=t.expirationTimes;0<n;){var r=31-ii(n),s=1<<r;e[r]=0,i[r]=-1,t[r]=-1,n&=~s}}function Dh(t,e){var n=t.entangledLanes|=e;for(t=t.entanglements;n;){var i=31-ii(n),r=1<<i;r&e|t[i]&e&&(t[i]|=e),n&=~r}}var ot=0;function Qg(t){return t&=-t,1<t?4<t?t&268435455?16:536870912:4:1}var Jg,Ih,e_,t_,n_,id=!1,So=[],Ji=null,er=null,tr=null,za=new Map,Ba=new Map,Wi=[],Cx="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Qf(t,e){switch(t){case"focusin":case"focusout":Ji=null;break;case"dragenter":case"dragleave":er=null;break;case"mouseover":case"mouseout":tr=null;break;case"pointerover":case"pointerout":za.delete(e.pointerId);break;case"gotpointercapture":case"lostpointercapture":Ba.delete(e.pointerId)}}function ia(t,e,n,i,r,s){return t===null||t.nativeEvent!==s?(t={blockedOn:e,domEventName:n,eventSystemFlags:i,nativeEvent:s,targetContainers:[r]},e!==null&&(e=so(e),e!==null&&Ih(e)),t):(t.eventSystemFlags|=i,e=t.targetContainers,r!==null&&e.indexOf(r)===-1&&e.push(r),t)}function Rx(t,e,n,i,r){switch(e){case"focusin":return Ji=ia(Ji,t,e,n,i,r),!0;case"dragenter":return er=ia(er,t,e,n,i,r),!0;case"mouseover":return tr=ia(tr,t,e,n,i,r),!0;case"pointerover":var s=r.pointerId;return za.set(s,ia(za.get(s)||null,t,e,n,i,r)),!0;case"gotpointercapture":return s=r.pointerId,Ba.set(s,ia(Ba.get(s)||null,t,e,n,i,r)),!0}return!1}function i_(t){var e=Nr(t.target);if(e!==null){var n=Xr(e);if(n!==null){if(e=n.tag,e===13){if(e=Wg(n),e!==null){t.blockedOn=e,n_(t.priority,function(){e_(n)});return}}else if(e===3&&n.stateNode.current.memoizedState.isDehydrated){t.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}t.blockedOn=null}function hl(t){if(t.blockedOn!==null)return!1;for(var e=t.targetContainers;0<e.length;){var n=rd(t.domEventName,t.eventSystemFlags,e[0],t.nativeEvent);if(n===null){n=t.nativeEvent;var i=new n.constructor(n.type,n);Qu=i,n.target.dispatchEvent(i),Qu=null}else return e=so(n),e!==null&&Ih(e),t.blockedOn=n,!1;e.shift()}return!0}function Jf(t,e,n){hl(t)&&n.delete(e)}function Px(){id=!1,Ji!==null&&hl(Ji)&&(Ji=null),er!==null&&hl(er)&&(er=null),tr!==null&&hl(tr)&&(tr=null),za.forEach(Jf),Ba.forEach(Jf)}function ra(t,e){t.blockedOn===e&&(t.blockedOn=null,id||(id=!0,Cn.unstable_scheduleCallback(Cn.unstable_NormalPriority,Px)))}function Ha(t){function e(r){return ra(r,t)}if(0<So.length){ra(So[0],t);for(var n=1;n<So.length;n++){var i=So[n];i.blockedOn===t&&(i.blockedOn=null)}}for(Ji!==null&&ra(Ji,t),er!==null&&ra(er,t),tr!==null&&ra(tr,t),za.forEach(e),Ba.forEach(e),n=0;n<Wi.length;n++)i=Wi[n],i.blockedOn===t&&(i.blockedOn=null);for(;0<Wi.length&&(n=Wi[0],n.blockedOn===null);)i_(n),n.blockedOn===null&&Wi.shift()}var Ps=Ii.ReactCurrentBatchConfig,Il=!0;function Nx(t,e,n,i){var r=ot,s=Ps.transition;Ps.transition=null;try{ot=1,Uh(t,e,n,i)}finally{ot=r,Ps.transition=s}}function Lx(t,e,n,i){var r=ot,s=Ps.transition;Ps.transition=null;try{ot=4,Uh(t,e,n,i)}finally{ot=r,Ps.transition=s}}function Uh(t,e,n,i){if(Il){var r=rd(t,e,n,i);if(r===null)Xc(t,e,i,Ul,n),Qf(t,i);else if(Rx(r,t,e,n,i))i.stopPropagation();else if(Qf(t,i),e&4&&-1<Cx.indexOf(t)){for(;r!==null;){var s=so(r);if(s!==null&&Jg(s),s=rd(t,e,n,i),s===null&&Xc(t,e,i,Ul,n),s===r)break;r=s}r!==null&&i.stopPropagation()}else Xc(t,e,i,null,n)}}var Ul=null;function rd(t,e,n,i){if(Ul=null,t=Nh(i),t=Nr(t),t!==null)if(e=Xr(t),e===null)t=null;else if(n=e.tag,n===13){if(t=Wg(e),t!==null)return t;t=null}else if(n===3){if(e.stateNode.current.memoizedState.isDehydrated)return e.tag===3?e.stateNode.containerInfo:null;t=null}else e!==t&&(t=null);return Ul=t,null}function r_(t){switch(t){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(xx()){case Lh:return 1;case qg:return 4;case Ll:case yx:return 16;case Kg:return 536870912;default:return 16}default:return 16}}var Yi=null,kh=null,fl=null;function s_(){if(fl)return fl;var t,e=kh,n=e.length,i,r="value"in Yi?Yi.value:Yi.textContent,s=r.length;for(t=0;t<n&&e[t]===r[t];t++);var a=n-t;for(i=1;i<=a&&e[n-i]===r[s-i];i++);return fl=r.slice(t,1<i?1-i:void 0)}function pl(t){var e=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&e===13&&(t=13)):t=e,t===10&&(t=13),32<=t||t===13?t:0}function Mo(){return!0}function ep(){return!1}function Pn(t){function e(n,i,r,s,a){this._reactName=n,this._targetInst=r,this.type=i,this.nativeEvent=s,this.target=a,this.currentTarget=null;for(var o in t)t.hasOwnProperty(o)&&(n=t[o],this[o]=n?n(s):s[o]);return this.isDefaultPrevented=(s.defaultPrevented!=null?s.defaultPrevented:s.returnValue===!1)?Mo:ep,this.isPropagationStopped=ep,this}return wt(e.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=Mo)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=Mo)},persist:function(){},isPersistent:Mo}),e}var Zs={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Fh=Pn(Zs),ro=wt({},Zs,{view:0,detail:0}),Dx=Pn(ro),Fc,Oc,sa,cc=wt({},ro,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Oh,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==sa&&(sa&&t.type==="mousemove"?(Fc=t.screenX-sa.screenX,Oc=t.screenY-sa.screenY):Oc=Fc=0,sa=t),Fc)},movementY:function(t){return"movementY"in t?t.movementY:Oc}}),tp=Pn(cc),Ix=wt({},cc,{dataTransfer:0}),Ux=Pn(Ix),kx=wt({},ro,{relatedTarget:0}),zc=Pn(kx),Fx=wt({},Zs,{animationName:0,elapsedTime:0,pseudoElement:0}),Ox=Pn(Fx),zx=wt({},Zs,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),Bx=Pn(zx),Hx=wt({},Zs,{data:0}),np=Pn(Hx),Gx={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Vx={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},jx={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Wx(t){var e=this.nativeEvent;return e.getModifierState?e.getModifierState(t):(t=jx[t])?!!e[t]:!1}function Oh(){return Wx}var Xx=wt({},ro,{key:function(t){if(t.key){var e=Gx[t.key]||t.key;if(e!=="Unidentified")return e}return t.type==="keypress"?(t=pl(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?Vx[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Oh,charCode:function(t){return t.type==="keypress"?pl(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?pl(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),$x=Pn(Xx),Yx=wt({},cc,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),ip=Pn(Yx),qx=wt({},ro,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Oh}),Kx=Pn(qx),Zx=wt({},Zs,{propertyName:0,elapsedTime:0,pseudoElement:0}),Qx=Pn(Zx),Jx=wt({},cc,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),ey=Pn(Jx),ty=[9,13,27,32],zh=Ri&&"CompositionEvent"in window,Aa=null;Ri&&"documentMode"in document&&(Aa=document.documentMode);var ny=Ri&&"TextEvent"in window&&!Aa,a_=Ri&&(!zh||Aa&&8<Aa&&11>=Aa),rp=" ",sp=!1;function o_(t,e){switch(t){case"keyup":return ty.indexOf(e.keyCode)!==-1;case"keydown":return e.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function l_(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var gs=!1;function iy(t,e){switch(t){case"compositionend":return l_(e);case"keypress":return e.which!==32?null:(sp=!0,rp);case"textInput":return t=e.data,t===rp&&sp?null:t;default:return null}}function ry(t,e){if(gs)return t==="compositionend"||!zh&&o_(t,e)?(t=s_(),fl=kh=Yi=null,gs=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(e.ctrlKey||e.altKey||e.metaKey)||e.ctrlKey&&e.altKey){if(e.char&&1<e.char.length)return e.char;if(e.which)return String.fromCharCode(e.which)}return null;case"compositionend":return a_&&e.locale!=="ko"?null:e.data;default:return null}}var sy={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function ap(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e==="input"?!!sy[t.type]:e==="textarea"}function c_(t,e,n,i){Bg(i),e=kl(e,"onChange"),0<e.length&&(n=new Fh("onChange","change",null,n,i),t.push({event:n,listeners:e}))}var ba=null,Ga=null;function ay(t){y_(t,0)}function uc(t){var e=xs(t);if(Dg(e))return t}function oy(t,e){if(t==="change")return e}var u_=!1;if(Ri){var Bc;if(Ri){var Hc="oninput"in document;if(!Hc){var op=document.createElement("div");op.setAttribute("oninput","return;"),Hc=typeof op.oninput=="function"}Bc=Hc}else Bc=!1;u_=Bc&&(!document.documentMode||9<document.documentMode)}function lp(){ba&&(ba.detachEvent("onpropertychange",d_),Ga=ba=null)}function d_(t){if(t.propertyName==="value"&&uc(Ga)){var e=[];c_(e,Ga,t,Nh(t)),jg(ay,e)}}function ly(t,e,n){t==="focusin"?(lp(),ba=e,Ga=n,ba.attachEvent("onpropertychange",d_)):t==="focusout"&&lp()}function cy(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return uc(Ga)}function uy(t,e){if(t==="click")return uc(e)}function dy(t,e){if(t==="input"||t==="change")return uc(e)}function hy(t,e){return t===e&&(t!==0||1/t===1/e)||t!==t&&e!==e}var si=typeof Object.is=="function"?Object.is:hy;function Va(t,e){if(si(t,e))return!0;if(typeof t!="object"||t===null||typeof e!="object"||e===null)return!1;var n=Object.keys(t),i=Object.keys(e);if(n.length!==i.length)return!1;for(i=0;i<n.length;i++){var r=n[i];if(!Bu.call(e,r)||!si(t[r],e[r]))return!1}return!0}function cp(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function up(t,e){var n=cp(t);t=0;for(var i;n;){if(n.nodeType===3){if(i=t+n.textContent.length,t<=e&&i>=e)return{node:n,offset:e-t};t=i}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=cp(n)}}function h_(t,e){return t&&e?t===e?!0:t&&t.nodeType===3?!1:e&&e.nodeType===3?h_(t,e.parentNode):"contains"in t?t.contains(e):t.compareDocumentPosition?!!(t.compareDocumentPosition(e)&16):!1:!1}function f_(){for(var t=window,e=Rl();e instanceof t.HTMLIFrameElement;){try{var n=typeof e.contentWindow.location.href=="string"}catch{n=!1}if(n)t=e.contentWindow;else break;e=Rl(t.document)}return e}function Bh(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e&&(e==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||e==="textarea"||t.contentEditable==="true")}function fy(t){var e=f_(),n=t.focusedElem,i=t.selectionRange;if(e!==n&&n&&n.ownerDocument&&h_(n.ownerDocument.documentElement,n)){if(i!==null&&Bh(n)){if(e=i.start,t=i.end,t===void 0&&(t=e),"selectionStart"in n)n.selectionStart=e,n.selectionEnd=Math.min(t,n.value.length);else if(t=(e=n.ownerDocument||document)&&e.defaultView||window,t.getSelection){t=t.getSelection();var r=n.textContent.length,s=Math.min(i.start,r);i=i.end===void 0?s:Math.min(i.end,r),!t.extend&&s>i&&(r=i,i=s,s=r),r=up(n,s);var a=up(n,i);r&&a&&(t.rangeCount!==1||t.anchorNode!==r.node||t.anchorOffset!==r.offset||t.focusNode!==a.node||t.focusOffset!==a.offset)&&(e=e.createRange(),e.setStart(r.node,r.offset),t.removeAllRanges(),s>i?(t.addRange(e),t.extend(a.node,a.offset)):(e.setEnd(a.node,a.offset),t.addRange(e)))}}for(e=[],t=n;t=t.parentNode;)t.nodeType===1&&e.push({element:t,left:t.scrollLeft,top:t.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<e.length;n++)t=e[n],t.element.scrollLeft=t.left,t.element.scrollTop=t.top}}var py=Ri&&"documentMode"in document&&11>=document.documentMode,_s=null,sd=null,Ca=null,ad=!1;function dp(t,e,n){var i=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;ad||_s==null||_s!==Rl(i)||(i=_s,"selectionStart"in i&&Bh(i)?i={start:i.selectionStart,end:i.selectionEnd}:(i=(i.ownerDocument&&i.ownerDocument.defaultView||window).getSelection(),i={anchorNode:i.anchorNode,anchorOffset:i.anchorOffset,focusNode:i.focusNode,focusOffset:i.focusOffset}),Ca&&Va(Ca,i)||(Ca=i,i=kl(sd,"onSelect"),0<i.length&&(e=new Fh("onSelect","select",null,e,n),t.push({event:e,listeners:i}),e.target=_s)))}function Eo(t,e){var n={};return n[t.toLowerCase()]=e.toLowerCase(),n["Webkit"+t]="webkit"+e,n["Moz"+t]="moz"+e,n}var vs={animationend:Eo("Animation","AnimationEnd"),animationiteration:Eo("Animation","AnimationIteration"),animationstart:Eo("Animation","AnimationStart"),transitionend:Eo("Transition","TransitionEnd")},Gc={},p_={};Ri&&(p_=document.createElement("div").style,"AnimationEvent"in window||(delete vs.animationend.animation,delete vs.animationiteration.animation,delete vs.animationstart.animation),"TransitionEvent"in window||delete vs.transitionend.transition);function dc(t){if(Gc[t])return Gc[t];if(!vs[t])return t;var e=vs[t],n;for(n in e)if(e.hasOwnProperty(n)&&n in p_)return Gc[t]=e[n];return t}var m_=dc("animationend"),g_=dc("animationiteration"),__=dc("animationstart"),v_=dc("transitionend"),x_=new Map,hp="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function hr(t,e){x_.set(t,e),Wr(e,[t])}for(var Vc=0;Vc<hp.length;Vc++){var jc=hp[Vc],my=jc.toLowerCase(),gy=jc[0].toUpperCase()+jc.slice(1);hr(my,"on"+gy)}hr(m_,"onAnimationEnd");hr(g_,"onAnimationIteration");hr(__,"onAnimationStart");hr("dblclick","onDoubleClick");hr("focusin","onFocus");hr("focusout","onBlur");hr(v_,"onTransitionEnd");ks("onMouseEnter",["mouseout","mouseover"]);ks("onMouseLeave",["mouseout","mouseover"]);ks("onPointerEnter",["pointerout","pointerover"]);ks("onPointerLeave",["pointerout","pointerover"]);Wr("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));Wr("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));Wr("onBeforeInput",["compositionend","keypress","textInput","paste"]);Wr("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));Wr("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));Wr("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Ma="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),_y=new Set("cancel close invalid load scroll toggle".split(" ").concat(Ma));function fp(t,e,n){var i=t.type||"unknown-event";t.currentTarget=n,mx(i,e,void 0,t),t.currentTarget=null}function y_(t,e){e=(e&4)!==0;for(var n=0;n<t.length;n++){var i=t[n],r=i.event;i=i.listeners;e:{var s=void 0;if(e)for(var a=i.length-1;0<=a;a--){var o=i[a],l=o.instance,c=o.currentTarget;if(o=o.listener,l!==s&&r.isPropagationStopped())break e;fp(r,o,c),s=l}else for(a=0;a<i.length;a++){if(o=i[a],l=o.instance,c=o.currentTarget,o=o.listener,l!==s&&r.isPropagationStopped())break e;fp(r,o,c),s=l}}}if(Nl)throw t=td,Nl=!1,td=null,t}function mt(t,e){var n=e[dd];n===void 0&&(n=e[dd]=new Set);var i=t+"__bubble";n.has(i)||(S_(e,t,2,!1),n.add(i))}function Wc(t,e,n){var i=0;e&&(i|=4),S_(n,t,i,e)}var wo="_reactListening"+Math.random().toString(36).slice(2);function ja(t){if(!t[wo]){t[wo]=!0,Cg.forEach(function(n){n!=="selectionchange"&&(_y.has(n)||Wc(n,!1,t),Wc(n,!0,t))});var e=t.nodeType===9?t:t.ownerDocument;e===null||e[wo]||(e[wo]=!0,Wc("selectionchange",!1,e))}}function S_(t,e,n,i){switch(r_(e)){case 1:var r=Nx;break;case 4:r=Lx;break;default:r=Uh}n=r.bind(null,e,n,t),r=void 0,!ed||e!=="touchstart"&&e!=="touchmove"&&e!=="wheel"||(r=!0),i?r!==void 0?t.addEventListener(e,n,{capture:!0,passive:r}):t.addEventListener(e,n,!0):r!==void 0?t.addEventListener(e,n,{passive:r}):t.addEventListener(e,n,!1)}function Xc(t,e,n,i,r){var s=i;if(!(e&1)&&!(e&2)&&i!==null)e:for(;;){if(i===null)return;var a=i.tag;if(a===3||a===4){var o=i.stateNode.containerInfo;if(o===r||o.nodeType===8&&o.parentNode===r)break;if(a===4)for(a=i.return;a!==null;){var l=a.tag;if((l===3||l===4)&&(l=a.stateNode.containerInfo,l===r||l.nodeType===8&&l.parentNode===r))return;a=a.return}for(;o!==null;){if(a=Nr(o),a===null)return;if(l=a.tag,l===5||l===6){i=s=a;continue e}o=o.parentNode}}i=i.return}jg(function(){var c=s,u=Nh(n),f=[];e:{var h=x_.get(t);if(h!==void 0){var p=Fh,_=t;switch(t){case"keypress":if(pl(n)===0)break e;case"keydown":case"keyup":p=$x;break;case"focusin":_="focus",p=zc;break;case"focusout":_="blur",p=zc;break;case"beforeblur":case"afterblur":p=zc;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":p=tp;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":p=Ux;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":p=Kx;break;case m_:case g_:case __:p=Ox;break;case v_:p=Qx;break;case"scroll":p=Dx;break;case"wheel":p=ey;break;case"copy":case"cut":case"paste":p=Bx;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":p=ip}var v=(e&4)!==0,m=!v&&t==="scroll",d=v?h!==null?h+"Capture":null:h;v=[];for(var x=c,y;x!==null;){y=x;var M=y.stateNode;if(y.tag===5&&M!==null&&(y=M,d!==null&&(M=Oa(x,d),M!=null&&v.push(Wa(x,M,y)))),m)break;x=x.return}0<v.length&&(h=new p(h,_,null,n,u),f.push({event:h,listeners:v}))}}if(!(e&7)){e:{if(h=t==="mouseover"||t==="pointerover",p=t==="mouseout"||t==="pointerout",h&&n!==Qu&&(_=n.relatedTarget||n.fromElement)&&(Nr(_)||_[Pi]))break e;if((p||h)&&(h=u.window===u?u:(h=u.ownerDocument)?h.defaultView||h.parentWindow:window,p?(_=n.relatedTarget||n.toElement,p=c,_=_?Nr(_):null,_!==null&&(m=Xr(_),_!==m||_.tag!==5&&_.tag!==6)&&(_=null)):(p=null,_=c),p!==_)){if(v=tp,M="onMouseLeave",d="onMouseEnter",x="mouse",(t==="pointerout"||t==="pointerover")&&(v=ip,M="onPointerLeave",d="onPointerEnter",x="pointer"),m=p==null?h:xs(p),y=_==null?h:xs(_),h=new v(M,x+"leave",p,n,u),h.target=m,h.relatedTarget=y,M=null,Nr(u)===c&&(v=new v(d,x+"enter",_,n,u),v.target=y,v.relatedTarget=m,M=v),m=M,p&&_)t:{for(v=p,d=_,x=0,y=v;y;y=qr(y))x++;for(y=0,M=d;M;M=qr(M))y++;for(;0<x-y;)v=qr(v),x--;for(;0<y-x;)d=qr(d),y--;for(;x--;){if(v===d||d!==null&&v===d.alternate)break t;v=qr(v),d=qr(d)}v=null}else v=null;p!==null&&pp(f,h,p,v,!1),_!==null&&m!==null&&pp(f,m,_,v,!0)}}e:{if(h=c?xs(c):window,p=h.nodeName&&h.nodeName.toLowerCase(),p==="select"||p==="input"&&h.type==="file")var P=oy;else if(ap(h))if(u_)P=dy;else{P=cy;var C=ly}else(p=h.nodeName)&&p.toLowerCase()==="input"&&(h.type==="checkbox"||h.type==="radio")&&(P=uy);if(P&&(P=P(t,c))){c_(f,P,n,u);break e}C&&C(t,h,c),t==="focusout"&&(C=h._wrapperState)&&C.controlled&&h.type==="number"&&$u(h,"number",h.value)}switch(C=c?xs(c):window,t){case"focusin":(ap(C)||C.contentEditable==="true")&&(_s=C,sd=c,Ca=null);break;case"focusout":Ca=sd=_s=null;break;case"mousedown":ad=!0;break;case"contextmenu":case"mouseup":case"dragend":ad=!1,dp(f,n,u);break;case"selectionchange":if(py)break;case"keydown":case"keyup":dp(f,n,u)}var A;if(zh)e:{switch(t){case"compositionstart":var b="onCompositionStart";break e;case"compositionend":b="onCompositionEnd";break e;case"compositionupdate":b="onCompositionUpdate";break e}b=void 0}else gs?o_(t,n)&&(b="onCompositionEnd"):t==="keydown"&&n.keyCode===229&&(b="onCompositionStart");b&&(a_&&n.locale!=="ko"&&(gs||b!=="onCompositionStart"?b==="onCompositionEnd"&&gs&&(A=s_()):(Yi=u,kh="value"in Yi?Yi.value:Yi.textContent,gs=!0)),C=kl(c,b),0<C.length&&(b=new np(b,t,null,n,u),f.push({event:b,listeners:C}),A?b.data=A:(A=l_(n),A!==null&&(b.data=A)))),(A=ny?iy(t,n):ry(t,n))&&(c=kl(c,"onBeforeInput"),0<c.length&&(u=new np("onBeforeInput","beforeinput",null,n,u),f.push({event:u,listeners:c}),u.data=A))}y_(f,e)})}function Wa(t,e,n){return{instance:t,listener:e,currentTarget:n}}function kl(t,e){for(var n=e+"Capture",i=[];t!==null;){var r=t,s=r.stateNode;r.tag===5&&s!==null&&(r=s,s=Oa(t,n),s!=null&&i.unshift(Wa(t,s,r)),s=Oa(t,e),s!=null&&i.push(Wa(t,s,r))),t=t.return}return i}function qr(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5);return t||null}function pp(t,e,n,i,r){for(var s=e._reactName,a=[];n!==null&&n!==i;){var o=n,l=o.alternate,c=o.stateNode;if(l!==null&&l===i)break;o.tag===5&&c!==null&&(o=c,r?(l=Oa(n,s),l!=null&&a.unshift(Wa(n,l,o))):r||(l=Oa(n,s),l!=null&&a.push(Wa(n,l,o)))),n=n.return}a.length!==0&&t.push({event:e,listeners:a})}var vy=/\r\n?/g,xy=/\u0000|\uFFFD/g;function mp(t){return(typeof t=="string"?t:""+t).replace(vy,`
`).replace(xy,"")}function To(t,e,n){if(e=mp(e),mp(t)!==e&&n)throw Error(ae(425))}function Fl(){}var od=null,ld=null;function cd(t,e){return t==="textarea"||t==="noscript"||typeof e.children=="string"||typeof e.children=="number"||typeof e.dangerouslySetInnerHTML=="object"&&e.dangerouslySetInnerHTML!==null&&e.dangerouslySetInnerHTML.__html!=null}var ud=typeof setTimeout=="function"?setTimeout:void 0,yy=typeof clearTimeout=="function"?clearTimeout:void 0,gp=typeof Promise=="function"?Promise:void 0,Sy=typeof queueMicrotask=="function"?queueMicrotask:typeof gp<"u"?function(t){return gp.resolve(null).then(t).catch(My)}:ud;function My(t){setTimeout(function(){throw t})}function $c(t,e){var n=e,i=0;do{var r=n.nextSibling;if(t.removeChild(n),r&&r.nodeType===8)if(n=r.data,n==="/$"){if(i===0){t.removeChild(r),Ha(e);return}i--}else n!=="$"&&n!=="$?"&&n!=="$!"||i++;n=r}while(n);Ha(e)}function nr(t){for(;t!=null;t=t.nextSibling){var e=t.nodeType;if(e===1||e===3)break;if(e===8){if(e=t.data,e==="$"||e==="$!"||e==="$?")break;if(e==="/$")return null}}return t}function _p(t){t=t.previousSibling;for(var e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="$"||n==="$!"||n==="$?"){if(e===0)return t;e--}else n==="/$"&&e++}t=t.previousSibling}return null}var Qs=Math.random().toString(36).slice(2),ci="__reactFiber$"+Qs,Xa="__reactProps$"+Qs,Pi="__reactContainer$"+Qs,dd="__reactEvents$"+Qs,Ey="__reactListeners$"+Qs,wy="__reactHandles$"+Qs;function Nr(t){var e=t[ci];if(e)return e;for(var n=t.parentNode;n;){if(e=n[Pi]||n[ci]){if(n=e.alternate,e.child!==null||n!==null&&n.child!==null)for(t=_p(t);t!==null;){if(n=t[ci])return n;t=_p(t)}return e}t=n,n=t.parentNode}return null}function so(t){return t=t[ci]||t[Pi],!t||t.tag!==5&&t.tag!==6&&t.tag!==13&&t.tag!==3?null:t}function xs(t){if(t.tag===5||t.tag===6)return t.stateNode;throw Error(ae(33))}function hc(t){return t[Xa]||null}var hd=[],ys=-1;function fr(t){return{current:t}}function vt(t){0>ys||(t.current=hd[ys],hd[ys]=null,ys--)}function dt(t,e){ys++,hd[ys]=t.current,t.current=e}var ur={},rn=fr(ur),mn=fr(!1),Or=ur;function Fs(t,e){var n=t.type.contextTypes;if(!n)return ur;var i=t.stateNode;if(i&&i.__reactInternalMemoizedUnmaskedChildContext===e)return i.__reactInternalMemoizedMaskedChildContext;var r={},s;for(s in n)r[s]=e[s];return i&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=e,t.__reactInternalMemoizedMaskedChildContext=r),r}function gn(t){return t=t.childContextTypes,t!=null}function Ol(){vt(mn),vt(rn)}function vp(t,e,n){if(rn.current!==ur)throw Error(ae(168));dt(rn,e),dt(mn,n)}function M_(t,e,n){var i=t.stateNode;if(e=e.childContextTypes,typeof i.getChildContext!="function")return n;i=i.getChildContext();for(var r in i)if(!(r in e))throw Error(ae(108,lx(t)||"Unknown",r));return wt({},n,i)}function zl(t){return t=(t=t.stateNode)&&t.__reactInternalMemoizedMergedChildContext||ur,Or=rn.current,dt(rn,t),dt(mn,mn.current),!0}function xp(t,e,n){var i=t.stateNode;if(!i)throw Error(ae(169));n?(t=M_(t,e,Or),i.__reactInternalMemoizedMergedChildContext=t,vt(mn),vt(rn),dt(rn,t)):vt(mn),dt(mn,n)}var Mi=null,fc=!1,Yc=!1;function E_(t){Mi===null?Mi=[t]:Mi.push(t)}function Ty(t){fc=!0,E_(t)}function pr(){if(!Yc&&Mi!==null){Yc=!0;var t=0,e=ot;try{var n=Mi;for(ot=1;t<n.length;t++){var i=n[t];do i=i(!0);while(i!==null)}Mi=null,fc=!1}catch(r){throw Mi!==null&&(Mi=Mi.slice(t+1)),Yg(Lh,pr),r}finally{ot=e,Yc=!1}}return null}var Ss=[],Ms=0,Bl=null,Hl=0,In=[],Un=0,zr=null,Ei=1,wi="";function wr(t,e){Ss[Ms++]=Hl,Ss[Ms++]=Bl,Bl=t,Hl=e}function w_(t,e,n){In[Un++]=Ei,In[Un++]=wi,In[Un++]=zr,zr=t;var i=Ei;t=wi;var r=32-ii(i)-1;i&=~(1<<r),n+=1;var s=32-ii(e)+r;if(30<s){var a=r-r%5;s=(i&(1<<a)-1).toString(32),i>>=a,r-=a,Ei=1<<32-ii(e)+r|n<<r|i,wi=s+t}else Ei=1<<s|n<<r|i,wi=t}function Hh(t){t.return!==null&&(wr(t,1),w_(t,1,0))}function Gh(t){for(;t===Bl;)Bl=Ss[--Ms],Ss[Ms]=null,Hl=Ss[--Ms],Ss[Ms]=null;for(;t===zr;)zr=In[--Un],In[Un]=null,wi=In[--Un],In[Un]=null,Ei=In[--Un],In[Un]=null}var bn=null,Tn=null,xt=!1,Jn=null;function T_(t,e){var n=On(5,null,null,0);n.elementType="DELETED",n.stateNode=e,n.return=t,e=t.deletions,e===null?(t.deletions=[n],t.flags|=16):e.push(n)}function yp(t,e){switch(t.tag){case 5:var n=t.type;return e=e.nodeType!==1||n.toLowerCase()!==e.nodeName.toLowerCase()?null:e,e!==null?(t.stateNode=e,bn=t,Tn=nr(e.firstChild),!0):!1;case 6:return e=t.pendingProps===""||e.nodeType!==3?null:e,e!==null?(t.stateNode=e,bn=t,Tn=null,!0):!1;case 13:return e=e.nodeType!==8?null:e,e!==null?(n=zr!==null?{id:Ei,overflow:wi}:null,t.memoizedState={dehydrated:e,treeContext:n,retryLane:1073741824},n=On(18,null,null,0),n.stateNode=e,n.return=t,t.child=n,bn=t,Tn=null,!0):!1;default:return!1}}function fd(t){return(t.mode&1)!==0&&(t.flags&128)===0}function pd(t){if(xt){var e=Tn;if(e){var n=e;if(!yp(t,e)){if(fd(t))throw Error(ae(418));e=nr(n.nextSibling);var i=bn;e&&yp(t,e)?T_(i,n):(t.flags=t.flags&-4097|2,xt=!1,bn=t)}}else{if(fd(t))throw Error(ae(418));t.flags=t.flags&-4097|2,xt=!1,bn=t}}}function Sp(t){for(t=t.return;t!==null&&t.tag!==5&&t.tag!==3&&t.tag!==13;)t=t.return;bn=t}function Ao(t){if(t!==bn)return!1;if(!xt)return Sp(t),xt=!0,!1;var e;if((e=t.tag!==3)&&!(e=t.tag!==5)&&(e=t.type,e=e!=="head"&&e!=="body"&&!cd(t.type,t.memoizedProps)),e&&(e=Tn)){if(fd(t))throw A_(),Error(ae(418));for(;e;)T_(t,e),e=nr(e.nextSibling)}if(Sp(t),t.tag===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(ae(317));e:{for(t=t.nextSibling,e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="/$"){if(e===0){Tn=nr(t.nextSibling);break e}e--}else n!=="$"&&n!=="$!"&&n!=="$?"||e++}t=t.nextSibling}Tn=null}}else Tn=bn?nr(t.stateNode.nextSibling):null;return!0}function A_(){for(var t=Tn;t;)t=nr(t.nextSibling)}function Os(){Tn=bn=null,xt=!1}function Vh(t){Jn===null?Jn=[t]:Jn.push(t)}var Ay=Ii.ReactCurrentBatchConfig;function aa(t,e,n){if(t=n.ref,t!==null&&typeof t!="function"&&typeof t!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(ae(309));var i=n.stateNode}if(!i)throw Error(ae(147,t));var r=i,s=""+t;return e!==null&&e.ref!==null&&typeof e.ref=="function"&&e.ref._stringRef===s?e.ref:(e=function(a){var o=r.refs;a===null?delete o[s]:o[s]=a},e._stringRef=s,e)}if(typeof t!="string")throw Error(ae(284));if(!n._owner)throw Error(ae(290,t))}return t}function bo(t,e){throw t=Object.prototype.toString.call(e),Error(ae(31,t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t))}function Mp(t){var e=t._init;return e(t._payload)}function b_(t){function e(d,x){if(t){var y=d.deletions;y===null?(d.deletions=[x],d.flags|=16):y.push(x)}}function n(d,x){if(!t)return null;for(;x!==null;)e(d,x),x=x.sibling;return null}function i(d,x){for(d=new Map;x!==null;)x.key!==null?d.set(x.key,x):d.set(x.index,x),x=x.sibling;return d}function r(d,x){return d=ar(d,x),d.index=0,d.sibling=null,d}function s(d,x,y){return d.index=y,t?(y=d.alternate,y!==null?(y=y.index,y<x?(d.flags|=2,x):y):(d.flags|=2,x)):(d.flags|=1048576,x)}function a(d){return t&&d.alternate===null&&(d.flags|=2),d}function o(d,x,y,M){return x===null||x.tag!==6?(x=tu(y,d.mode,M),x.return=d,x):(x=r(x,y),x.return=d,x)}function l(d,x,y,M){var P=y.type;return P===ms?u(d,x,y.props.children,M,y.key):x!==null&&(x.elementType===P||typeof P=="object"&&P!==null&&P.$$typeof===Vi&&Mp(P)===x.type)?(M=r(x,y.props),M.ref=aa(d,x,y),M.return=d,M):(M=Sl(y.type,y.key,y.props,null,d.mode,M),M.ref=aa(d,x,y),M.return=d,M)}function c(d,x,y,M){return x===null||x.tag!==4||x.stateNode.containerInfo!==y.containerInfo||x.stateNode.implementation!==y.implementation?(x=nu(y,d.mode,M),x.return=d,x):(x=r(x,y.children||[]),x.return=d,x)}function u(d,x,y,M,P){return x===null||x.tag!==7?(x=Fr(y,d.mode,M,P),x.return=d,x):(x=r(x,y),x.return=d,x)}function f(d,x,y){if(typeof x=="string"&&x!==""||typeof x=="number")return x=tu(""+x,d.mode,y),x.return=d,x;if(typeof x=="object"&&x!==null){switch(x.$$typeof){case go:return y=Sl(x.type,x.key,x.props,null,d.mode,y),y.ref=aa(d,null,x),y.return=d,y;case ps:return x=nu(x,d.mode,y),x.return=d,x;case Vi:var M=x._init;return f(d,M(x._payload),y)}if(ya(x)||ta(x))return x=Fr(x,d.mode,y,null),x.return=d,x;bo(d,x)}return null}function h(d,x,y,M){var P=x!==null?x.key:null;if(typeof y=="string"&&y!==""||typeof y=="number")return P!==null?null:o(d,x,""+y,M);if(typeof y=="object"&&y!==null){switch(y.$$typeof){case go:return y.key===P?l(d,x,y,M):null;case ps:return y.key===P?c(d,x,y,M):null;case Vi:return P=y._init,h(d,x,P(y._payload),M)}if(ya(y)||ta(y))return P!==null?null:u(d,x,y,M,null);bo(d,y)}return null}function p(d,x,y,M,P){if(typeof M=="string"&&M!==""||typeof M=="number")return d=d.get(y)||null,o(x,d,""+M,P);if(typeof M=="object"&&M!==null){switch(M.$$typeof){case go:return d=d.get(M.key===null?y:M.key)||null,l(x,d,M,P);case ps:return d=d.get(M.key===null?y:M.key)||null,c(x,d,M,P);case Vi:var C=M._init;return p(d,x,y,C(M._payload),P)}if(ya(M)||ta(M))return d=d.get(y)||null,u(x,d,M,P,null);bo(x,M)}return null}function _(d,x,y,M){for(var P=null,C=null,A=x,b=x=0,z=null;A!==null&&b<y.length;b++){A.index>b?(z=A,A=null):z=A.sibling;var S=h(d,A,y[b],M);if(S===null){A===null&&(A=z);break}t&&A&&S.alternate===null&&e(d,A),x=s(S,x,b),C===null?P=S:C.sibling=S,C=S,A=z}if(b===y.length)return n(d,A),xt&&wr(d,b),P;if(A===null){for(;b<y.length;b++)A=f(d,y[b],M),A!==null&&(x=s(A,x,b),C===null?P=A:C.sibling=A,C=A);return xt&&wr(d,b),P}for(A=i(d,A);b<y.length;b++)z=p(A,d,b,y[b],M),z!==null&&(t&&z.alternate!==null&&A.delete(z.key===null?b:z.key),x=s(z,x,b),C===null?P=z:C.sibling=z,C=z);return t&&A.forEach(function(w){return e(d,w)}),xt&&wr(d,b),P}function v(d,x,y,M){var P=ta(y);if(typeof P!="function")throw Error(ae(150));if(y=P.call(y),y==null)throw Error(ae(151));for(var C=P=null,A=x,b=x=0,z=null,S=y.next();A!==null&&!S.done;b++,S=y.next()){A.index>b?(z=A,A=null):z=A.sibling;var w=h(d,A,S.value,M);if(w===null){A===null&&(A=z);break}t&&A&&w.alternate===null&&e(d,A),x=s(w,x,b),C===null?P=w:C.sibling=w,C=w,A=z}if(S.done)return n(d,A),xt&&wr(d,b),P;if(A===null){for(;!S.done;b++,S=y.next())S=f(d,S.value,M),S!==null&&(x=s(S,x,b),C===null?P=S:C.sibling=S,C=S);return xt&&wr(d,b),P}for(A=i(d,A);!S.done;b++,S=y.next())S=p(A,d,b,S.value,M),S!==null&&(t&&S.alternate!==null&&A.delete(S.key===null?b:S.key),x=s(S,x,b),C===null?P=S:C.sibling=S,C=S);return t&&A.forEach(function(N){return e(d,N)}),xt&&wr(d,b),P}function m(d,x,y,M){if(typeof y=="object"&&y!==null&&y.type===ms&&y.key===null&&(y=y.props.children),typeof y=="object"&&y!==null){switch(y.$$typeof){case go:e:{for(var P=y.key,C=x;C!==null;){if(C.key===P){if(P=y.type,P===ms){if(C.tag===7){n(d,C.sibling),x=r(C,y.props.children),x.return=d,d=x;break e}}else if(C.elementType===P||typeof P=="object"&&P!==null&&P.$$typeof===Vi&&Mp(P)===C.type){n(d,C.sibling),x=r(C,y.props),x.ref=aa(d,C,y),x.return=d,d=x;break e}n(d,C);break}else e(d,C);C=C.sibling}y.type===ms?(x=Fr(y.props.children,d.mode,M,y.key),x.return=d,d=x):(M=Sl(y.type,y.key,y.props,null,d.mode,M),M.ref=aa(d,x,y),M.return=d,d=M)}return a(d);case ps:e:{for(C=y.key;x!==null;){if(x.key===C)if(x.tag===4&&x.stateNode.containerInfo===y.containerInfo&&x.stateNode.implementation===y.implementation){n(d,x.sibling),x=r(x,y.children||[]),x.return=d,d=x;break e}else{n(d,x);break}else e(d,x);x=x.sibling}x=nu(y,d.mode,M),x.return=d,d=x}return a(d);case Vi:return C=y._init,m(d,x,C(y._payload),M)}if(ya(y))return _(d,x,y,M);if(ta(y))return v(d,x,y,M);bo(d,y)}return typeof y=="string"&&y!==""||typeof y=="number"?(y=""+y,x!==null&&x.tag===6?(n(d,x.sibling),x=r(x,y),x.return=d,d=x):(n(d,x),x=tu(y,d.mode,M),x.return=d,d=x),a(d)):n(d,x)}return m}var zs=b_(!0),C_=b_(!1),Gl=fr(null),Vl=null,Es=null,jh=null;function Wh(){jh=Es=Vl=null}function Xh(t){var e=Gl.current;vt(Gl),t._currentValue=e}function md(t,e,n){for(;t!==null;){var i=t.alternate;if((t.childLanes&e)!==e?(t.childLanes|=e,i!==null&&(i.childLanes|=e)):i!==null&&(i.childLanes&e)!==e&&(i.childLanes|=e),t===n)break;t=t.return}}function Ns(t,e){Vl=t,jh=Es=null,t=t.dependencies,t!==null&&t.firstContext!==null&&(t.lanes&e&&(pn=!0),t.firstContext=null)}function Hn(t){var e=t._currentValue;if(jh!==t)if(t={context:t,memoizedValue:e,next:null},Es===null){if(Vl===null)throw Error(ae(308));Es=t,Vl.dependencies={lanes:0,firstContext:t}}else Es=Es.next=t;return e}var Lr=null;function $h(t){Lr===null?Lr=[t]:Lr.push(t)}function R_(t,e,n,i){var r=e.interleaved;return r===null?(n.next=n,$h(e)):(n.next=r.next,r.next=n),e.interleaved=n,Ni(t,i)}function Ni(t,e){t.lanes|=e;var n=t.alternate;for(n!==null&&(n.lanes|=e),n=t,t=t.return;t!==null;)t.childLanes|=e,n=t.alternate,n!==null&&(n.childLanes|=e),n=t,t=t.return;return n.tag===3?n.stateNode:null}var ji=!1;function Yh(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function P_(t,e){t=t.updateQueue,e.updateQueue===t&&(e.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,effects:t.effects})}function bi(t,e){return{eventTime:t,lane:e,tag:0,payload:null,callback:null,next:null}}function ir(t,e,n){var i=t.updateQueue;if(i===null)return null;if(i=i.shared,Qe&2){var r=i.pending;return r===null?e.next=e:(e.next=r.next,r.next=e),i.pending=e,Ni(t,n)}return r=i.interleaved,r===null?(e.next=e,$h(i)):(e.next=r.next,r.next=e),i.interleaved=e,Ni(t,n)}function ml(t,e,n){if(e=e.updateQueue,e!==null&&(e=e.shared,(n&4194240)!==0)){var i=e.lanes;i&=t.pendingLanes,n|=i,e.lanes=n,Dh(t,n)}}function Ep(t,e){var n=t.updateQueue,i=t.alternate;if(i!==null&&(i=i.updateQueue,n===i)){var r=null,s=null;if(n=n.firstBaseUpdate,n!==null){do{var a={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};s===null?r=s=a:s=s.next=a,n=n.next}while(n!==null);s===null?r=s=e:s=s.next=e}else r=s=e;n={baseState:i.baseState,firstBaseUpdate:r,lastBaseUpdate:s,shared:i.shared,effects:i.effects},t.updateQueue=n;return}t=n.lastBaseUpdate,t===null?n.firstBaseUpdate=e:t.next=e,n.lastBaseUpdate=e}function jl(t,e,n,i){var r=t.updateQueue;ji=!1;var s=r.firstBaseUpdate,a=r.lastBaseUpdate,o=r.shared.pending;if(o!==null){r.shared.pending=null;var l=o,c=l.next;l.next=null,a===null?s=c:a.next=c,a=l;var u=t.alternate;u!==null&&(u=u.updateQueue,o=u.lastBaseUpdate,o!==a&&(o===null?u.firstBaseUpdate=c:o.next=c,u.lastBaseUpdate=l))}if(s!==null){var f=r.baseState;a=0,u=c=l=null,o=s;do{var h=o.lane,p=o.eventTime;if((i&h)===h){u!==null&&(u=u.next={eventTime:p,lane:0,tag:o.tag,payload:o.payload,callback:o.callback,next:null});e:{var _=t,v=o;switch(h=e,p=n,v.tag){case 1:if(_=v.payload,typeof _=="function"){f=_.call(p,f,h);break e}f=_;break e;case 3:_.flags=_.flags&-65537|128;case 0:if(_=v.payload,h=typeof _=="function"?_.call(p,f,h):_,h==null)break e;f=wt({},f,h);break e;case 2:ji=!0}}o.callback!==null&&o.lane!==0&&(t.flags|=64,h=r.effects,h===null?r.effects=[o]:h.push(o))}else p={eventTime:p,lane:h,tag:o.tag,payload:o.payload,callback:o.callback,next:null},u===null?(c=u=p,l=f):u=u.next=p,a|=h;if(o=o.next,o===null){if(o=r.shared.pending,o===null)break;h=o,o=h.next,h.next=null,r.lastBaseUpdate=h,r.shared.pending=null}}while(!0);if(u===null&&(l=f),r.baseState=l,r.firstBaseUpdate=c,r.lastBaseUpdate=u,e=r.shared.interleaved,e!==null){r=e;do a|=r.lane,r=r.next;while(r!==e)}else s===null&&(r.shared.lanes=0);Hr|=a,t.lanes=a,t.memoizedState=f}}function wp(t,e,n){if(t=e.effects,e.effects=null,t!==null)for(e=0;e<t.length;e++){var i=t[e],r=i.callback;if(r!==null){if(i.callback=null,i=n,typeof r!="function")throw Error(ae(191,r));r.call(i)}}}var ao={},hi=fr(ao),$a=fr(ao),Ya=fr(ao);function Dr(t){if(t===ao)throw Error(ae(174));return t}function qh(t,e){switch(dt(Ya,e),dt($a,t),dt(hi,ao),t=e.nodeType,t){case 9:case 11:e=(e=e.documentElement)?e.namespaceURI:qu(null,"");break;default:t=t===8?e.parentNode:e,e=t.namespaceURI||null,t=t.tagName,e=qu(e,t)}vt(hi),dt(hi,e)}function Bs(){vt(hi),vt($a),vt(Ya)}function N_(t){Dr(Ya.current);var e=Dr(hi.current),n=qu(e,t.type);e!==n&&(dt($a,t),dt(hi,n))}function Kh(t){$a.current===t&&(vt(hi),vt($a))}var Mt=fr(0);function Wl(t){for(var e=t;e!==null;){if(e.tag===13){var n=e.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return e}else if(e.tag===19&&e.memoizedProps.revealOrder!==void 0){if(e.flags&128)return e}else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return null;e=e.return}e.sibling.return=e.return,e=e.sibling}return null}var qc=[];function Zh(){for(var t=0;t<qc.length;t++)qc[t]._workInProgressVersionPrimary=null;qc.length=0}var gl=Ii.ReactCurrentDispatcher,Kc=Ii.ReactCurrentBatchConfig,Br=0,Et=null,Ut=null,Ht=null,Xl=!1,Ra=!1,qa=0,by=0;function Kt(){throw Error(ae(321))}function Qh(t,e){if(e===null)return!1;for(var n=0;n<e.length&&n<t.length;n++)if(!si(t[n],e[n]))return!1;return!0}function Jh(t,e,n,i,r,s){if(Br=s,Et=e,e.memoizedState=null,e.updateQueue=null,e.lanes=0,gl.current=t===null||t.memoizedState===null?Ny:Ly,t=n(i,r),Ra){s=0;do{if(Ra=!1,qa=0,25<=s)throw Error(ae(301));s+=1,Ht=Ut=null,e.updateQueue=null,gl.current=Dy,t=n(i,r)}while(Ra)}if(gl.current=$l,e=Ut!==null&&Ut.next!==null,Br=0,Ht=Ut=Et=null,Xl=!1,e)throw Error(ae(300));return t}function ef(){var t=qa!==0;return qa=0,t}function oi(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Ht===null?Et.memoizedState=Ht=t:Ht=Ht.next=t,Ht}function Gn(){if(Ut===null){var t=Et.alternate;t=t!==null?t.memoizedState:null}else t=Ut.next;var e=Ht===null?Et.memoizedState:Ht.next;if(e!==null)Ht=e,Ut=t;else{if(t===null)throw Error(ae(310));Ut=t,t={memoizedState:Ut.memoizedState,baseState:Ut.baseState,baseQueue:Ut.baseQueue,queue:Ut.queue,next:null},Ht===null?Et.memoizedState=Ht=t:Ht=Ht.next=t}return Ht}function Ka(t,e){return typeof e=="function"?e(t):e}function Zc(t){var e=Gn(),n=e.queue;if(n===null)throw Error(ae(311));n.lastRenderedReducer=t;var i=Ut,r=i.baseQueue,s=n.pending;if(s!==null){if(r!==null){var a=r.next;r.next=s.next,s.next=a}i.baseQueue=r=s,n.pending=null}if(r!==null){s=r.next,i=i.baseState;var o=a=null,l=null,c=s;do{var u=c.lane;if((Br&u)===u)l!==null&&(l=l.next={lane:0,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null}),i=c.hasEagerState?c.eagerState:t(i,c.action);else{var f={lane:u,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null};l===null?(o=l=f,a=i):l=l.next=f,Et.lanes|=u,Hr|=u}c=c.next}while(c!==null&&c!==s);l===null?a=i:l.next=o,si(i,e.memoizedState)||(pn=!0),e.memoizedState=i,e.baseState=a,e.baseQueue=l,n.lastRenderedState=i}if(t=n.interleaved,t!==null){r=t;do s=r.lane,Et.lanes|=s,Hr|=s,r=r.next;while(r!==t)}else r===null&&(n.lanes=0);return[e.memoizedState,n.dispatch]}function Qc(t){var e=Gn(),n=e.queue;if(n===null)throw Error(ae(311));n.lastRenderedReducer=t;var i=n.dispatch,r=n.pending,s=e.memoizedState;if(r!==null){n.pending=null;var a=r=r.next;do s=t(s,a.action),a=a.next;while(a!==r);si(s,e.memoizedState)||(pn=!0),e.memoizedState=s,e.baseQueue===null&&(e.baseState=s),n.lastRenderedState=s}return[s,i]}function L_(){}function D_(t,e){var n=Et,i=Gn(),r=e(),s=!si(i.memoizedState,r);if(s&&(i.memoizedState=r,pn=!0),i=i.queue,tf(k_.bind(null,n,i,t),[t]),i.getSnapshot!==e||s||Ht!==null&&Ht.memoizedState.tag&1){if(n.flags|=2048,Za(9,U_.bind(null,n,i,r,e),void 0,null),Gt===null)throw Error(ae(349));Br&30||I_(n,e,r)}return r}function I_(t,e,n){t.flags|=16384,t={getSnapshot:e,value:n},e=Et.updateQueue,e===null?(e={lastEffect:null,stores:null},Et.updateQueue=e,e.stores=[t]):(n=e.stores,n===null?e.stores=[t]:n.push(t))}function U_(t,e,n,i){e.value=n,e.getSnapshot=i,F_(e)&&O_(t)}function k_(t,e,n){return n(function(){F_(e)&&O_(t)})}function F_(t){var e=t.getSnapshot;t=t.value;try{var n=e();return!si(t,n)}catch{return!0}}function O_(t){var e=Ni(t,1);e!==null&&ri(e,t,1,-1)}function Tp(t){var e=oi();return typeof t=="function"&&(t=t()),e.memoizedState=e.baseState=t,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Ka,lastRenderedState:t},e.queue=t,t=t.dispatch=Py.bind(null,Et,t),[e.memoizedState,t]}function Za(t,e,n,i){return t={tag:t,create:e,destroy:n,deps:i,next:null},e=Et.updateQueue,e===null?(e={lastEffect:null,stores:null},Et.updateQueue=e,e.lastEffect=t.next=t):(n=e.lastEffect,n===null?e.lastEffect=t.next=t:(i=n.next,n.next=t,t.next=i,e.lastEffect=t)),t}function z_(){return Gn().memoizedState}function _l(t,e,n,i){var r=oi();Et.flags|=t,r.memoizedState=Za(1|e,n,void 0,i===void 0?null:i)}function pc(t,e,n,i){var r=Gn();i=i===void 0?null:i;var s=void 0;if(Ut!==null){var a=Ut.memoizedState;if(s=a.destroy,i!==null&&Qh(i,a.deps)){r.memoizedState=Za(e,n,s,i);return}}Et.flags|=t,r.memoizedState=Za(1|e,n,s,i)}function Ap(t,e){return _l(8390656,8,t,e)}function tf(t,e){return pc(2048,8,t,e)}function B_(t,e){return pc(4,2,t,e)}function H_(t,e){return pc(4,4,t,e)}function G_(t,e){if(typeof e=="function")return t=t(),e(t),function(){e(null)};if(e!=null)return t=t(),e.current=t,function(){e.current=null}}function V_(t,e,n){return n=n!=null?n.concat([t]):null,pc(4,4,G_.bind(null,e,t),n)}function nf(){}function j_(t,e){var n=Gn();e=e===void 0?null:e;var i=n.memoizedState;return i!==null&&e!==null&&Qh(e,i[1])?i[0]:(n.memoizedState=[t,e],t)}function W_(t,e){var n=Gn();e=e===void 0?null:e;var i=n.memoizedState;return i!==null&&e!==null&&Qh(e,i[1])?i[0]:(t=t(),n.memoizedState=[t,e],t)}function X_(t,e,n){return Br&21?(si(n,e)||(n=Zg(),Et.lanes|=n,Hr|=n,t.baseState=!0),e):(t.baseState&&(t.baseState=!1,pn=!0),t.memoizedState=n)}function Cy(t,e){var n=ot;ot=n!==0&&4>n?n:4,t(!0);var i=Kc.transition;Kc.transition={};try{t(!1),e()}finally{ot=n,Kc.transition=i}}function $_(){return Gn().memoizedState}function Ry(t,e,n){var i=sr(t);if(n={lane:i,action:n,hasEagerState:!1,eagerState:null,next:null},Y_(t))q_(e,n);else if(n=R_(t,e,n,i),n!==null){var r=cn();ri(n,t,i,r),K_(n,e,i)}}function Py(t,e,n){var i=sr(t),r={lane:i,action:n,hasEagerState:!1,eagerState:null,next:null};if(Y_(t))q_(e,r);else{var s=t.alternate;if(t.lanes===0&&(s===null||s.lanes===0)&&(s=e.lastRenderedReducer,s!==null))try{var a=e.lastRenderedState,o=s(a,n);if(r.hasEagerState=!0,r.eagerState=o,si(o,a)){var l=e.interleaved;l===null?(r.next=r,$h(e)):(r.next=l.next,l.next=r),e.interleaved=r;return}}catch{}finally{}n=R_(t,e,r,i),n!==null&&(r=cn(),ri(n,t,i,r),K_(n,e,i))}}function Y_(t){var e=t.alternate;return t===Et||e!==null&&e===Et}function q_(t,e){Ra=Xl=!0;var n=t.pending;n===null?e.next=e:(e.next=n.next,n.next=e),t.pending=e}function K_(t,e,n){if(n&4194240){var i=e.lanes;i&=t.pendingLanes,n|=i,e.lanes=n,Dh(t,n)}}var $l={readContext:Hn,useCallback:Kt,useContext:Kt,useEffect:Kt,useImperativeHandle:Kt,useInsertionEffect:Kt,useLayoutEffect:Kt,useMemo:Kt,useReducer:Kt,useRef:Kt,useState:Kt,useDebugValue:Kt,useDeferredValue:Kt,useTransition:Kt,useMutableSource:Kt,useSyncExternalStore:Kt,useId:Kt,unstable_isNewReconciler:!1},Ny={readContext:Hn,useCallback:function(t,e){return oi().memoizedState=[t,e===void 0?null:e],t},useContext:Hn,useEffect:Ap,useImperativeHandle:function(t,e,n){return n=n!=null?n.concat([t]):null,_l(4194308,4,G_.bind(null,e,t),n)},useLayoutEffect:function(t,e){return _l(4194308,4,t,e)},useInsertionEffect:function(t,e){return _l(4,2,t,e)},useMemo:function(t,e){var n=oi();return e=e===void 0?null:e,t=t(),n.memoizedState=[t,e],t},useReducer:function(t,e,n){var i=oi();return e=n!==void 0?n(e):e,i.memoizedState=i.baseState=e,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:e},i.queue=t,t=t.dispatch=Ry.bind(null,Et,t),[i.memoizedState,t]},useRef:function(t){var e=oi();return t={current:t},e.memoizedState=t},useState:Tp,useDebugValue:nf,useDeferredValue:function(t){return oi().memoizedState=t},useTransition:function(){var t=Tp(!1),e=t[0];return t=Cy.bind(null,t[1]),oi().memoizedState=t,[e,t]},useMutableSource:function(){},useSyncExternalStore:function(t,e,n){var i=Et,r=oi();if(xt){if(n===void 0)throw Error(ae(407));n=n()}else{if(n=e(),Gt===null)throw Error(ae(349));Br&30||I_(i,e,n)}r.memoizedState=n;var s={value:n,getSnapshot:e};return r.queue=s,Ap(k_.bind(null,i,s,t),[t]),i.flags|=2048,Za(9,U_.bind(null,i,s,n,e),void 0,null),n},useId:function(){var t=oi(),e=Gt.identifierPrefix;if(xt){var n=wi,i=Ei;n=(i&~(1<<32-ii(i)-1)).toString(32)+n,e=":"+e+"R"+n,n=qa++,0<n&&(e+="H"+n.toString(32)),e+=":"}else n=by++,e=":"+e+"r"+n.toString(32)+":";return t.memoizedState=e},unstable_isNewReconciler:!1},Ly={readContext:Hn,useCallback:j_,useContext:Hn,useEffect:tf,useImperativeHandle:V_,useInsertionEffect:B_,useLayoutEffect:H_,useMemo:W_,useReducer:Zc,useRef:z_,useState:function(){return Zc(Ka)},useDebugValue:nf,useDeferredValue:function(t){var e=Gn();return X_(e,Ut.memoizedState,t)},useTransition:function(){var t=Zc(Ka)[0],e=Gn().memoizedState;return[t,e]},useMutableSource:L_,useSyncExternalStore:D_,useId:$_,unstable_isNewReconciler:!1},Dy={readContext:Hn,useCallback:j_,useContext:Hn,useEffect:tf,useImperativeHandle:V_,useInsertionEffect:B_,useLayoutEffect:H_,useMemo:W_,useReducer:Qc,useRef:z_,useState:function(){return Qc(Ka)},useDebugValue:nf,useDeferredValue:function(t){var e=Gn();return Ut===null?e.memoizedState=t:X_(e,Ut.memoizedState,t)},useTransition:function(){var t=Qc(Ka)[0],e=Gn().memoizedState;return[t,e]},useMutableSource:L_,useSyncExternalStore:D_,useId:$_,unstable_isNewReconciler:!1};function Zn(t,e){if(t&&t.defaultProps){e=wt({},e),t=t.defaultProps;for(var n in t)e[n]===void 0&&(e[n]=t[n]);return e}return e}function gd(t,e,n,i){e=t.memoizedState,n=n(i,e),n=n==null?e:wt({},e,n),t.memoizedState=n,t.lanes===0&&(t.updateQueue.baseState=n)}var mc={isMounted:function(t){return(t=t._reactInternals)?Xr(t)===t:!1},enqueueSetState:function(t,e,n){t=t._reactInternals;var i=cn(),r=sr(t),s=bi(i,r);s.payload=e,n!=null&&(s.callback=n),e=ir(t,s,r),e!==null&&(ri(e,t,r,i),ml(e,t,r))},enqueueReplaceState:function(t,e,n){t=t._reactInternals;var i=cn(),r=sr(t),s=bi(i,r);s.tag=1,s.payload=e,n!=null&&(s.callback=n),e=ir(t,s,r),e!==null&&(ri(e,t,r,i),ml(e,t,r))},enqueueForceUpdate:function(t,e){t=t._reactInternals;var n=cn(),i=sr(t),r=bi(n,i);r.tag=2,e!=null&&(r.callback=e),e=ir(t,r,i),e!==null&&(ri(e,t,i,n),ml(e,t,i))}};function bp(t,e,n,i,r,s,a){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(i,s,a):e.prototype&&e.prototype.isPureReactComponent?!Va(n,i)||!Va(r,s):!0}function Z_(t,e,n){var i=!1,r=ur,s=e.contextType;return typeof s=="object"&&s!==null?s=Hn(s):(r=gn(e)?Or:rn.current,i=e.contextTypes,s=(i=i!=null)?Fs(t,r):ur),e=new e(n,s),t.memoizedState=e.state!==null&&e.state!==void 0?e.state:null,e.updater=mc,t.stateNode=e,e._reactInternals=t,i&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=r,t.__reactInternalMemoizedMaskedChildContext=s),e}function Cp(t,e,n,i){t=e.state,typeof e.componentWillReceiveProps=="function"&&e.componentWillReceiveProps(n,i),typeof e.UNSAFE_componentWillReceiveProps=="function"&&e.UNSAFE_componentWillReceiveProps(n,i),e.state!==t&&mc.enqueueReplaceState(e,e.state,null)}function _d(t,e,n,i){var r=t.stateNode;r.props=n,r.state=t.memoizedState,r.refs={},Yh(t);var s=e.contextType;typeof s=="object"&&s!==null?r.context=Hn(s):(s=gn(e)?Or:rn.current,r.context=Fs(t,s)),r.state=t.memoizedState,s=e.getDerivedStateFromProps,typeof s=="function"&&(gd(t,e,s,n),r.state=t.memoizedState),typeof e.getDerivedStateFromProps=="function"||typeof r.getSnapshotBeforeUpdate=="function"||typeof r.UNSAFE_componentWillMount!="function"&&typeof r.componentWillMount!="function"||(e=r.state,typeof r.componentWillMount=="function"&&r.componentWillMount(),typeof r.UNSAFE_componentWillMount=="function"&&r.UNSAFE_componentWillMount(),e!==r.state&&mc.enqueueReplaceState(r,r.state,null),jl(t,n,r,i),r.state=t.memoizedState),typeof r.componentDidMount=="function"&&(t.flags|=4194308)}function Hs(t,e){try{var n="",i=e;do n+=ox(i),i=i.return;while(i);var r=n}catch(s){r=`
Error generating stack: `+s.message+`
`+s.stack}return{value:t,source:e,stack:r,digest:null}}function Jc(t,e,n){return{value:t,source:null,stack:n??null,digest:e??null}}function vd(t,e){try{console.error(e.value)}catch(n){setTimeout(function(){throw n})}}var Iy=typeof WeakMap=="function"?WeakMap:Map;function Q_(t,e,n){n=bi(-1,n),n.tag=3,n.payload={element:null};var i=e.value;return n.callback=function(){ql||(ql=!0,Cd=i),vd(t,e)},n}function J_(t,e,n){n=bi(-1,n),n.tag=3;var i=t.type.getDerivedStateFromError;if(typeof i=="function"){var r=e.value;n.payload=function(){return i(r)},n.callback=function(){vd(t,e)}}var s=t.stateNode;return s!==null&&typeof s.componentDidCatch=="function"&&(n.callback=function(){vd(t,e),typeof i!="function"&&(rr===null?rr=new Set([this]):rr.add(this));var a=e.stack;this.componentDidCatch(e.value,{componentStack:a!==null?a:""})}),n}function Rp(t,e,n){var i=t.pingCache;if(i===null){i=t.pingCache=new Iy;var r=new Set;i.set(e,r)}else r=i.get(e),r===void 0&&(r=new Set,i.set(e,r));r.has(n)||(r.add(n),t=Yy.bind(null,t,e,n),e.then(t,t))}function Pp(t){do{var e;if((e=t.tag===13)&&(e=t.memoizedState,e=e!==null?e.dehydrated!==null:!0),e)return t;t=t.return}while(t!==null);return null}function Np(t,e,n,i,r){return t.mode&1?(t.flags|=65536,t.lanes=r,t):(t===e?t.flags|=65536:(t.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(e=bi(-1,1),e.tag=2,ir(n,e,1))),n.lanes|=1),t)}var Uy=Ii.ReactCurrentOwner,pn=!1;function on(t,e,n,i){e.child=t===null?C_(e,null,n,i):zs(e,t.child,n,i)}function Lp(t,e,n,i,r){n=n.render;var s=e.ref;return Ns(e,r),i=Jh(t,e,n,i,s,r),n=ef(),t!==null&&!pn?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~r,Li(t,e,r)):(xt&&n&&Hh(e),e.flags|=1,on(t,e,i,r),e.child)}function Dp(t,e,n,i,r){if(t===null){var s=n.type;return typeof s=="function"&&!df(s)&&s.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(e.tag=15,e.type=s,ev(t,e,s,i,r)):(t=Sl(n.type,null,i,e,e.mode,r),t.ref=e.ref,t.return=e,e.child=t)}if(s=t.child,!(t.lanes&r)){var a=s.memoizedProps;if(n=n.compare,n=n!==null?n:Va,n(a,i)&&t.ref===e.ref)return Li(t,e,r)}return e.flags|=1,t=ar(s,i),t.ref=e.ref,t.return=e,e.child=t}function ev(t,e,n,i,r){if(t!==null){var s=t.memoizedProps;if(Va(s,i)&&t.ref===e.ref)if(pn=!1,e.pendingProps=i=s,(t.lanes&r)!==0)t.flags&131072&&(pn=!0);else return e.lanes=t.lanes,Li(t,e,r)}return xd(t,e,n,i,r)}function tv(t,e,n){var i=e.pendingProps,r=i.children,s=t!==null?t.memoizedState:null;if(i.mode==="hidden")if(!(e.mode&1))e.memoizedState={baseLanes:0,cachePool:null,transitions:null},dt(Ts,En),En|=n;else{if(!(n&1073741824))return t=s!==null?s.baseLanes|n:n,e.lanes=e.childLanes=1073741824,e.memoizedState={baseLanes:t,cachePool:null,transitions:null},e.updateQueue=null,dt(Ts,En),En|=t,null;e.memoizedState={baseLanes:0,cachePool:null,transitions:null},i=s!==null?s.baseLanes:n,dt(Ts,En),En|=i}else s!==null?(i=s.baseLanes|n,e.memoizedState=null):i=n,dt(Ts,En),En|=i;return on(t,e,r,n),e.child}function nv(t,e){var n=e.ref;(t===null&&n!==null||t!==null&&t.ref!==n)&&(e.flags|=512,e.flags|=2097152)}function xd(t,e,n,i,r){var s=gn(n)?Or:rn.current;return s=Fs(e,s),Ns(e,r),n=Jh(t,e,n,i,s,r),i=ef(),t!==null&&!pn?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~r,Li(t,e,r)):(xt&&i&&Hh(e),e.flags|=1,on(t,e,n,r),e.child)}function Ip(t,e,n,i,r){if(gn(n)){var s=!0;zl(e)}else s=!1;if(Ns(e,r),e.stateNode===null)vl(t,e),Z_(e,n,i),_d(e,n,i,r),i=!0;else if(t===null){var a=e.stateNode,o=e.memoizedProps;a.props=o;var l=a.context,c=n.contextType;typeof c=="object"&&c!==null?c=Hn(c):(c=gn(n)?Or:rn.current,c=Fs(e,c));var u=n.getDerivedStateFromProps,f=typeof u=="function"||typeof a.getSnapshotBeforeUpdate=="function";f||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(o!==i||l!==c)&&Cp(e,a,i,c),ji=!1;var h=e.memoizedState;a.state=h,jl(e,i,a,r),l=e.memoizedState,o!==i||h!==l||mn.current||ji?(typeof u=="function"&&(gd(e,n,u,i),l=e.memoizedState),(o=ji||bp(e,n,o,i,h,l,c))?(f||typeof a.UNSAFE_componentWillMount!="function"&&typeof a.componentWillMount!="function"||(typeof a.componentWillMount=="function"&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount=="function"&&a.UNSAFE_componentWillMount()),typeof a.componentDidMount=="function"&&(e.flags|=4194308)):(typeof a.componentDidMount=="function"&&(e.flags|=4194308),e.memoizedProps=i,e.memoizedState=l),a.props=i,a.state=l,a.context=c,i=o):(typeof a.componentDidMount=="function"&&(e.flags|=4194308),i=!1)}else{a=e.stateNode,P_(t,e),o=e.memoizedProps,c=e.type===e.elementType?o:Zn(e.type,o),a.props=c,f=e.pendingProps,h=a.context,l=n.contextType,typeof l=="object"&&l!==null?l=Hn(l):(l=gn(n)?Or:rn.current,l=Fs(e,l));var p=n.getDerivedStateFromProps;(u=typeof p=="function"||typeof a.getSnapshotBeforeUpdate=="function")||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(o!==f||h!==l)&&Cp(e,a,i,l),ji=!1,h=e.memoizedState,a.state=h,jl(e,i,a,r);var _=e.memoizedState;o!==f||h!==_||mn.current||ji?(typeof p=="function"&&(gd(e,n,p,i),_=e.memoizedState),(c=ji||bp(e,n,c,i,h,_,l)||!1)?(u||typeof a.UNSAFE_componentWillUpdate!="function"&&typeof a.componentWillUpdate!="function"||(typeof a.componentWillUpdate=="function"&&a.componentWillUpdate(i,_,l),typeof a.UNSAFE_componentWillUpdate=="function"&&a.UNSAFE_componentWillUpdate(i,_,l)),typeof a.componentDidUpdate=="function"&&(e.flags|=4),typeof a.getSnapshotBeforeUpdate=="function"&&(e.flags|=1024)):(typeof a.componentDidUpdate!="function"||o===t.memoizedProps&&h===t.memoizedState||(e.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||o===t.memoizedProps&&h===t.memoizedState||(e.flags|=1024),e.memoizedProps=i,e.memoizedState=_),a.props=i,a.state=_,a.context=l,i=c):(typeof a.componentDidUpdate!="function"||o===t.memoizedProps&&h===t.memoizedState||(e.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||o===t.memoizedProps&&h===t.memoizedState||(e.flags|=1024),i=!1)}return yd(t,e,n,i,s,r)}function yd(t,e,n,i,r,s){nv(t,e);var a=(e.flags&128)!==0;if(!i&&!a)return r&&xp(e,n,!1),Li(t,e,s);i=e.stateNode,Uy.current=e;var o=a&&typeof n.getDerivedStateFromError!="function"?null:i.render();return e.flags|=1,t!==null&&a?(e.child=zs(e,t.child,null,s),e.child=zs(e,null,o,s)):on(t,e,o,s),e.memoizedState=i.state,r&&xp(e,n,!0),e.child}function iv(t){var e=t.stateNode;e.pendingContext?vp(t,e.pendingContext,e.pendingContext!==e.context):e.context&&vp(t,e.context,!1),qh(t,e.containerInfo)}function Up(t,e,n,i,r){return Os(),Vh(r),e.flags|=256,on(t,e,n,i),e.child}var Sd={dehydrated:null,treeContext:null,retryLane:0};function Md(t){return{baseLanes:t,cachePool:null,transitions:null}}function rv(t,e,n){var i=e.pendingProps,r=Mt.current,s=!1,a=(e.flags&128)!==0,o;if((o=a)||(o=t!==null&&t.memoizedState===null?!1:(r&2)!==0),o?(s=!0,e.flags&=-129):(t===null||t.memoizedState!==null)&&(r|=1),dt(Mt,r&1),t===null)return pd(e),t=e.memoizedState,t!==null&&(t=t.dehydrated,t!==null)?(e.mode&1?t.data==="$!"?e.lanes=8:e.lanes=1073741824:e.lanes=1,null):(a=i.children,t=i.fallback,s?(i=e.mode,s=e.child,a={mode:"hidden",children:a},!(i&1)&&s!==null?(s.childLanes=0,s.pendingProps=a):s=vc(a,i,0,null),t=Fr(t,i,n,null),s.return=e,t.return=e,s.sibling=t,e.child=s,e.child.memoizedState=Md(n),e.memoizedState=Sd,t):rf(e,a));if(r=t.memoizedState,r!==null&&(o=r.dehydrated,o!==null))return ky(t,e,a,i,o,r,n);if(s){s=i.fallback,a=e.mode,r=t.child,o=r.sibling;var l={mode:"hidden",children:i.children};return!(a&1)&&e.child!==r?(i=e.child,i.childLanes=0,i.pendingProps=l,e.deletions=null):(i=ar(r,l),i.subtreeFlags=r.subtreeFlags&14680064),o!==null?s=ar(o,s):(s=Fr(s,a,n,null),s.flags|=2),s.return=e,i.return=e,i.sibling=s,e.child=i,i=s,s=e.child,a=t.child.memoizedState,a=a===null?Md(n):{baseLanes:a.baseLanes|n,cachePool:null,transitions:a.transitions},s.memoizedState=a,s.childLanes=t.childLanes&~n,e.memoizedState=Sd,i}return s=t.child,t=s.sibling,i=ar(s,{mode:"visible",children:i.children}),!(e.mode&1)&&(i.lanes=n),i.return=e,i.sibling=null,t!==null&&(n=e.deletions,n===null?(e.deletions=[t],e.flags|=16):n.push(t)),e.child=i,e.memoizedState=null,i}function rf(t,e){return e=vc({mode:"visible",children:e},t.mode,0,null),e.return=t,t.child=e}function Co(t,e,n,i){return i!==null&&Vh(i),zs(e,t.child,null,n),t=rf(e,e.pendingProps.children),t.flags|=2,e.memoizedState=null,t}function ky(t,e,n,i,r,s,a){if(n)return e.flags&256?(e.flags&=-257,i=Jc(Error(ae(422))),Co(t,e,a,i)):e.memoizedState!==null?(e.child=t.child,e.flags|=128,null):(s=i.fallback,r=e.mode,i=vc({mode:"visible",children:i.children},r,0,null),s=Fr(s,r,a,null),s.flags|=2,i.return=e,s.return=e,i.sibling=s,e.child=i,e.mode&1&&zs(e,t.child,null,a),e.child.memoizedState=Md(a),e.memoizedState=Sd,s);if(!(e.mode&1))return Co(t,e,a,null);if(r.data==="$!"){if(i=r.nextSibling&&r.nextSibling.dataset,i)var o=i.dgst;return i=o,s=Error(ae(419)),i=Jc(s,i,void 0),Co(t,e,a,i)}if(o=(a&t.childLanes)!==0,pn||o){if(i=Gt,i!==null){switch(a&-a){case 4:r=2;break;case 16:r=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:r=32;break;case 536870912:r=268435456;break;default:r=0}r=r&(i.suspendedLanes|a)?0:r,r!==0&&r!==s.retryLane&&(s.retryLane=r,Ni(t,r),ri(i,t,r,-1))}return uf(),i=Jc(Error(ae(421))),Co(t,e,a,i)}return r.data==="$?"?(e.flags|=128,e.child=t.child,e=qy.bind(null,t),r._reactRetry=e,null):(t=s.treeContext,Tn=nr(r.nextSibling),bn=e,xt=!0,Jn=null,t!==null&&(In[Un++]=Ei,In[Un++]=wi,In[Un++]=zr,Ei=t.id,wi=t.overflow,zr=e),e=rf(e,i.children),e.flags|=4096,e)}function kp(t,e,n){t.lanes|=e;var i=t.alternate;i!==null&&(i.lanes|=e),md(t.return,e,n)}function eu(t,e,n,i,r){var s=t.memoizedState;s===null?t.memoizedState={isBackwards:e,rendering:null,renderingStartTime:0,last:i,tail:n,tailMode:r}:(s.isBackwards=e,s.rendering=null,s.renderingStartTime=0,s.last=i,s.tail=n,s.tailMode=r)}function sv(t,e,n){var i=e.pendingProps,r=i.revealOrder,s=i.tail;if(on(t,e,i.children,n),i=Mt.current,i&2)i=i&1|2,e.flags|=128;else{if(t!==null&&t.flags&128)e:for(t=e.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&kp(t,n,e);else if(t.tag===19)kp(t,n,e);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break e;for(;t.sibling===null;){if(t.return===null||t.return===e)break e;t=t.return}t.sibling.return=t.return,t=t.sibling}i&=1}if(dt(Mt,i),!(e.mode&1))e.memoizedState=null;else switch(r){case"forwards":for(n=e.child,r=null;n!==null;)t=n.alternate,t!==null&&Wl(t)===null&&(r=n),n=n.sibling;n=r,n===null?(r=e.child,e.child=null):(r=n.sibling,n.sibling=null),eu(e,!1,r,n,s);break;case"backwards":for(n=null,r=e.child,e.child=null;r!==null;){if(t=r.alternate,t!==null&&Wl(t)===null){e.child=r;break}t=r.sibling,r.sibling=n,n=r,r=t}eu(e,!0,n,null,s);break;case"together":eu(e,!1,null,null,void 0);break;default:e.memoizedState=null}return e.child}function vl(t,e){!(e.mode&1)&&t!==null&&(t.alternate=null,e.alternate=null,e.flags|=2)}function Li(t,e,n){if(t!==null&&(e.dependencies=t.dependencies),Hr|=e.lanes,!(n&e.childLanes))return null;if(t!==null&&e.child!==t.child)throw Error(ae(153));if(e.child!==null){for(t=e.child,n=ar(t,t.pendingProps),e.child=n,n.return=e;t.sibling!==null;)t=t.sibling,n=n.sibling=ar(t,t.pendingProps),n.return=e;n.sibling=null}return e.child}function Fy(t,e,n){switch(e.tag){case 3:iv(e),Os();break;case 5:N_(e);break;case 1:gn(e.type)&&zl(e);break;case 4:qh(e,e.stateNode.containerInfo);break;case 10:var i=e.type._context,r=e.memoizedProps.value;dt(Gl,i._currentValue),i._currentValue=r;break;case 13:if(i=e.memoizedState,i!==null)return i.dehydrated!==null?(dt(Mt,Mt.current&1),e.flags|=128,null):n&e.child.childLanes?rv(t,e,n):(dt(Mt,Mt.current&1),t=Li(t,e,n),t!==null?t.sibling:null);dt(Mt,Mt.current&1);break;case 19:if(i=(n&e.childLanes)!==0,t.flags&128){if(i)return sv(t,e,n);e.flags|=128}if(r=e.memoizedState,r!==null&&(r.rendering=null,r.tail=null,r.lastEffect=null),dt(Mt,Mt.current),i)break;return null;case 22:case 23:return e.lanes=0,tv(t,e,n)}return Li(t,e,n)}var av,Ed,ov,lv;av=function(t,e){for(var n=e.child;n!==null;){if(n.tag===5||n.tag===6)t.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};Ed=function(){};ov=function(t,e,n,i){var r=t.memoizedProps;if(r!==i){t=e.stateNode,Dr(hi.current);var s=null;switch(n){case"input":r=Wu(t,r),i=Wu(t,i),s=[];break;case"select":r=wt({},r,{value:void 0}),i=wt({},i,{value:void 0}),s=[];break;case"textarea":r=Yu(t,r),i=Yu(t,i),s=[];break;default:typeof r.onClick!="function"&&typeof i.onClick=="function"&&(t.onclick=Fl)}Ku(n,i);var a;n=null;for(c in r)if(!i.hasOwnProperty(c)&&r.hasOwnProperty(c)&&r[c]!=null)if(c==="style"){var o=r[c];for(a in o)o.hasOwnProperty(a)&&(n||(n={}),n[a]="")}else c!=="dangerouslySetInnerHTML"&&c!=="children"&&c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&c!=="autoFocus"&&(ka.hasOwnProperty(c)?s||(s=[]):(s=s||[]).push(c,null));for(c in i){var l=i[c];if(o=r!=null?r[c]:void 0,i.hasOwnProperty(c)&&l!==o&&(l!=null||o!=null))if(c==="style")if(o){for(a in o)!o.hasOwnProperty(a)||l&&l.hasOwnProperty(a)||(n||(n={}),n[a]="");for(a in l)l.hasOwnProperty(a)&&o[a]!==l[a]&&(n||(n={}),n[a]=l[a])}else n||(s||(s=[]),s.push(c,n)),n=l;else c==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,o=o?o.__html:void 0,l!=null&&o!==l&&(s=s||[]).push(c,l)):c==="children"?typeof l!="string"&&typeof l!="number"||(s=s||[]).push(c,""+l):c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&(ka.hasOwnProperty(c)?(l!=null&&c==="onScroll"&&mt("scroll",t),s||o===l||(s=[])):(s=s||[]).push(c,l))}n&&(s=s||[]).push("style",n);var c=s;(e.updateQueue=c)&&(e.flags|=4)}};lv=function(t,e,n,i){n!==i&&(e.flags|=4)};function oa(t,e){if(!xt)switch(t.tailMode){case"hidden":e=t.tail;for(var n=null;e!==null;)e.alternate!==null&&(n=e),e=e.sibling;n===null?t.tail=null:n.sibling=null;break;case"collapsed":n=t.tail;for(var i=null;n!==null;)n.alternate!==null&&(i=n),n=n.sibling;i===null?e||t.tail===null?t.tail=null:t.tail.sibling=null:i.sibling=null}}function Zt(t){var e=t.alternate!==null&&t.alternate.child===t.child,n=0,i=0;if(e)for(var r=t.child;r!==null;)n|=r.lanes|r.childLanes,i|=r.subtreeFlags&14680064,i|=r.flags&14680064,r.return=t,r=r.sibling;else for(r=t.child;r!==null;)n|=r.lanes|r.childLanes,i|=r.subtreeFlags,i|=r.flags,r.return=t,r=r.sibling;return t.subtreeFlags|=i,t.childLanes=n,e}function Oy(t,e,n){var i=e.pendingProps;switch(Gh(e),e.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Zt(e),null;case 1:return gn(e.type)&&Ol(),Zt(e),null;case 3:return i=e.stateNode,Bs(),vt(mn),vt(rn),Zh(),i.pendingContext&&(i.context=i.pendingContext,i.pendingContext=null),(t===null||t.child===null)&&(Ao(e)?e.flags|=4:t===null||t.memoizedState.isDehydrated&&!(e.flags&256)||(e.flags|=1024,Jn!==null&&(Nd(Jn),Jn=null))),Ed(t,e),Zt(e),null;case 5:Kh(e);var r=Dr(Ya.current);if(n=e.type,t!==null&&e.stateNode!=null)ov(t,e,n,i,r),t.ref!==e.ref&&(e.flags|=512,e.flags|=2097152);else{if(!i){if(e.stateNode===null)throw Error(ae(166));return Zt(e),null}if(t=Dr(hi.current),Ao(e)){i=e.stateNode,n=e.type;var s=e.memoizedProps;switch(i[ci]=e,i[Xa]=s,t=(e.mode&1)!==0,n){case"dialog":mt("cancel",i),mt("close",i);break;case"iframe":case"object":case"embed":mt("load",i);break;case"video":case"audio":for(r=0;r<Ma.length;r++)mt(Ma[r],i);break;case"source":mt("error",i);break;case"img":case"image":case"link":mt("error",i),mt("load",i);break;case"details":mt("toggle",i);break;case"input":Wf(i,s),mt("invalid",i);break;case"select":i._wrapperState={wasMultiple:!!s.multiple},mt("invalid",i);break;case"textarea":$f(i,s),mt("invalid",i)}Ku(n,s),r=null;for(var a in s)if(s.hasOwnProperty(a)){var o=s[a];a==="children"?typeof o=="string"?i.textContent!==o&&(s.suppressHydrationWarning!==!0&&To(i.textContent,o,t),r=["children",o]):typeof o=="number"&&i.textContent!==""+o&&(s.suppressHydrationWarning!==!0&&To(i.textContent,o,t),r=["children",""+o]):ka.hasOwnProperty(a)&&o!=null&&a==="onScroll"&&mt("scroll",i)}switch(n){case"input":_o(i),Xf(i,s,!0);break;case"textarea":_o(i),Yf(i);break;case"select":case"option":break;default:typeof s.onClick=="function"&&(i.onclick=Fl)}i=r,e.updateQueue=i,i!==null&&(e.flags|=4)}else{a=r.nodeType===9?r:r.ownerDocument,t==="http://www.w3.org/1999/xhtml"&&(t=kg(n)),t==="http://www.w3.org/1999/xhtml"?n==="script"?(t=a.createElement("div"),t.innerHTML="<script><\/script>",t=t.removeChild(t.firstChild)):typeof i.is=="string"?t=a.createElement(n,{is:i.is}):(t=a.createElement(n),n==="select"&&(a=t,i.multiple?a.multiple=!0:i.size&&(a.size=i.size))):t=a.createElementNS(t,n),t[ci]=e,t[Xa]=i,av(t,e,!1,!1),e.stateNode=t;e:{switch(a=Zu(n,i),n){case"dialog":mt("cancel",t),mt("close",t),r=i;break;case"iframe":case"object":case"embed":mt("load",t),r=i;break;case"video":case"audio":for(r=0;r<Ma.length;r++)mt(Ma[r],t);r=i;break;case"source":mt("error",t),r=i;break;case"img":case"image":case"link":mt("error",t),mt("load",t),r=i;break;case"details":mt("toggle",t),r=i;break;case"input":Wf(t,i),r=Wu(t,i),mt("invalid",t);break;case"option":r=i;break;case"select":t._wrapperState={wasMultiple:!!i.multiple},r=wt({},i,{value:void 0}),mt("invalid",t);break;case"textarea":$f(t,i),r=Yu(t,i),mt("invalid",t);break;default:r=i}Ku(n,r),o=r;for(s in o)if(o.hasOwnProperty(s)){var l=o[s];s==="style"?zg(t,l):s==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,l!=null&&Fg(t,l)):s==="children"?typeof l=="string"?(n!=="textarea"||l!=="")&&Fa(t,l):typeof l=="number"&&Fa(t,""+l):s!=="suppressContentEditableWarning"&&s!=="suppressHydrationWarning"&&s!=="autoFocus"&&(ka.hasOwnProperty(s)?l!=null&&s==="onScroll"&&mt("scroll",t):l!=null&&bh(t,s,l,a))}switch(n){case"input":_o(t),Xf(t,i,!1);break;case"textarea":_o(t),Yf(t);break;case"option":i.value!=null&&t.setAttribute("value",""+cr(i.value));break;case"select":t.multiple=!!i.multiple,s=i.value,s!=null?bs(t,!!i.multiple,s,!1):i.defaultValue!=null&&bs(t,!!i.multiple,i.defaultValue,!0);break;default:typeof r.onClick=="function"&&(t.onclick=Fl)}switch(n){case"button":case"input":case"select":case"textarea":i=!!i.autoFocus;break e;case"img":i=!0;break e;default:i=!1}}i&&(e.flags|=4)}e.ref!==null&&(e.flags|=512,e.flags|=2097152)}return Zt(e),null;case 6:if(t&&e.stateNode!=null)lv(t,e,t.memoizedProps,i);else{if(typeof i!="string"&&e.stateNode===null)throw Error(ae(166));if(n=Dr(Ya.current),Dr(hi.current),Ao(e)){if(i=e.stateNode,n=e.memoizedProps,i[ci]=e,(s=i.nodeValue!==n)&&(t=bn,t!==null))switch(t.tag){case 3:To(i.nodeValue,n,(t.mode&1)!==0);break;case 5:t.memoizedProps.suppressHydrationWarning!==!0&&To(i.nodeValue,n,(t.mode&1)!==0)}s&&(e.flags|=4)}else i=(n.nodeType===9?n:n.ownerDocument).createTextNode(i),i[ci]=e,e.stateNode=i}return Zt(e),null;case 13:if(vt(Mt),i=e.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(xt&&Tn!==null&&e.mode&1&&!(e.flags&128))A_(),Os(),e.flags|=98560,s=!1;else if(s=Ao(e),i!==null&&i.dehydrated!==null){if(t===null){if(!s)throw Error(ae(318));if(s=e.memoizedState,s=s!==null?s.dehydrated:null,!s)throw Error(ae(317));s[ci]=e}else Os(),!(e.flags&128)&&(e.memoizedState=null),e.flags|=4;Zt(e),s=!1}else Jn!==null&&(Nd(Jn),Jn=null),s=!0;if(!s)return e.flags&65536?e:null}return e.flags&128?(e.lanes=n,e):(i=i!==null,i!==(t!==null&&t.memoizedState!==null)&&i&&(e.child.flags|=8192,e.mode&1&&(t===null||Mt.current&1?kt===0&&(kt=3):uf())),e.updateQueue!==null&&(e.flags|=4),Zt(e),null);case 4:return Bs(),Ed(t,e),t===null&&ja(e.stateNode.containerInfo),Zt(e),null;case 10:return Xh(e.type._context),Zt(e),null;case 17:return gn(e.type)&&Ol(),Zt(e),null;case 19:if(vt(Mt),s=e.memoizedState,s===null)return Zt(e),null;if(i=(e.flags&128)!==0,a=s.rendering,a===null)if(i)oa(s,!1);else{if(kt!==0||t!==null&&t.flags&128)for(t=e.child;t!==null;){if(a=Wl(t),a!==null){for(e.flags|=128,oa(s,!1),i=a.updateQueue,i!==null&&(e.updateQueue=i,e.flags|=4),e.subtreeFlags=0,i=n,n=e.child;n!==null;)s=n,t=i,s.flags&=14680066,a=s.alternate,a===null?(s.childLanes=0,s.lanes=t,s.child=null,s.subtreeFlags=0,s.memoizedProps=null,s.memoizedState=null,s.updateQueue=null,s.dependencies=null,s.stateNode=null):(s.childLanes=a.childLanes,s.lanes=a.lanes,s.child=a.child,s.subtreeFlags=0,s.deletions=null,s.memoizedProps=a.memoizedProps,s.memoizedState=a.memoizedState,s.updateQueue=a.updateQueue,s.type=a.type,t=a.dependencies,s.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),n=n.sibling;return dt(Mt,Mt.current&1|2),e.child}t=t.sibling}s.tail!==null&&Pt()>Gs&&(e.flags|=128,i=!0,oa(s,!1),e.lanes=4194304)}else{if(!i)if(t=Wl(a),t!==null){if(e.flags|=128,i=!0,n=t.updateQueue,n!==null&&(e.updateQueue=n,e.flags|=4),oa(s,!0),s.tail===null&&s.tailMode==="hidden"&&!a.alternate&&!xt)return Zt(e),null}else 2*Pt()-s.renderingStartTime>Gs&&n!==1073741824&&(e.flags|=128,i=!0,oa(s,!1),e.lanes=4194304);s.isBackwards?(a.sibling=e.child,e.child=a):(n=s.last,n!==null?n.sibling=a:e.child=a,s.last=a)}return s.tail!==null?(e=s.tail,s.rendering=e,s.tail=e.sibling,s.renderingStartTime=Pt(),e.sibling=null,n=Mt.current,dt(Mt,i?n&1|2:n&1),e):(Zt(e),null);case 22:case 23:return cf(),i=e.memoizedState!==null,t!==null&&t.memoizedState!==null!==i&&(e.flags|=8192),i&&e.mode&1?En&1073741824&&(Zt(e),e.subtreeFlags&6&&(e.flags|=8192)):Zt(e),null;case 24:return null;case 25:return null}throw Error(ae(156,e.tag))}function zy(t,e){switch(Gh(e),e.tag){case 1:return gn(e.type)&&Ol(),t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 3:return Bs(),vt(mn),vt(rn),Zh(),t=e.flags,t&65536&&!(t&128)?(e.flags=t&-65537|128,e):null;case 5:return Kh(e),null;case 13:if(vt(Mt),t=e.memoizedState,t!==null&&t.dehydrated!==null){if(e.alternate===null)throw Error(ae(340));Os()}return t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 19:return vt(Mt),null;case 4:return Bs(),null;case 10:return Xh(e.type._context),null;case 22:case 23:return cf(),null;case 24:return null;default:return null}}var Ro=!1,tn=!1,By=typeof WeakSet=="function"?WeakSet:Set,xe=null;function ws(t,e){var n=t.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(i){bt(t,e,i)}else n.current=null}function wd(t,e,n){try{n()}catch(i){bt(t,e,i)}}var Fp=!1;function Hy(t,e){if(od=Il,t=f_(),Bh(t)){if("selectionStart"in t)var n={start:t.selectionStart,end:t.selectionEnd};else e:{n=(n=t.ownerDocument)&&n.defaultView||window;var i=n.getSelection&&n.getSelection();if(i&&i.rangeCount!==0){n=i.anchorNode;var r=i.anchorOffset,s=i.focusNode;i=i.focusOffset;try{n.nodeType,s.nodeType}catch{n=null;break e}var a=0,o=-1,l=-1,c=0,u=0,f=t,h=null;t:for(;;){for(var p;f!==n||r!==0&&f.nodeType!==3||(o=a+r),f!==s||i!==0&&f.nodeType!==3||(l=a+i),f.nodeType===3&&(a+=f.nodeValue.length),(p=f.firstChild)!==null;)h=f,f=p;for(;;){if(f===t)break t;if(h===n&&++c===r&&(o=a),h===s&&++u===i&&(l=a),(p=f.nextSibling)!==null)break;f=h,h=f.parentNode}f=p}n=o===-1||l===-1?null:{start:o,end:l}}else n=null}n=n||{start:0,end:0}}else n=null;for(ld={focusedElem:t,selectionRange:n},Il=!1,xe=e;xe!==null;)if(e=xe,t=e.child,(e.subtreeFlags&1028)!==0&&t!==null)t.return=e,xe=t;else for(;xe!==null;){e=xe;try{var _=e.alternate;if(e.flags&1024)switch(e.tag){case 0:case 11:case 15:break;case 1:if(_!==null){var v=_.memoizedProps,m=_.memoizedState,d=e.stateNode,x=d.getSnapshotBeforeUpdate(e.elementType===e.type?v:Zn(e.type,v),m);d.__reactInternalSnapshotBeforeUpdate=x}break;case 3:var y=e.stateNode.containerInfo;y.nodeType===1?y.textContent="":y.nodeType===9&&y.documentElement&&y.removeChild(y.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(ae(163))}}catch(M){bt(e,e.return,M)}if(t=e.sibling,t!==null){t.return=e.return,xe=t;break}xe=e.return}return _=Fp,Fp=!1,_}function Pa(t,e,n){var i=e.updateQueue;if(i=i!==null?i.lastEffect:null,i!==null){var r=i=i.next;do{if((r.tag&t)===t){var s=r.destroy;r.destroy=void 0,s!==void 0&&wd(e,n,s)}r=r.next}while(r!==i)}}function gc(t,e){if(e=e.updateQueue,e=e!==null?e.lastEffect:null,e!==null){var n=e=e.next;do{if((n.tag&t)===t){var i=n.create;n.destroy=i()}n=n.next}while(n!==e)}}function Td(t){var e=t.ref;if(e!==null){var n=t.stateNode;switch(t.tag){case 5:t=n;break;default:t=n}typeof e=="function"?e(t):e.current=t}}function cv(t){var e=t.alternate;e!==null&&(t.alternate=null,cv(e)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(e=t.stateNode,e!==null&&(delete e[ci],delete e[Xa],delete e[dd],delete e[Ey],delete e[wy])),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}function uv(t){return t.tag===5||t.tag===3||t.tag===4}function Op(t){e:for(;;){for(;t.sibling===null;){if(t.return===null||uv(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.flags&2||t.child===null||t.tag===4)continue e;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function Ad(t,e,n){var i=t.tag;if(i===5||i===6)t=t.stateNode,e?n.nodeType===8?n.parentNode.insertBefore(t,e):n.insertBefore(t,e):(n.nodeType===8?(e=n.parentNode,e.insertBefore(t,n)):(e=n,e.appendChild(t)),n=n._reactRootContainer,n!=null||e.onclick!==null||(e.onclick=Fl));else if(i!==4&&(t=t.child,t!==null))for(Ad(t,e,n),t=t.sibling;t!==null;)Ad(t,e,n),t=t.sibling}function bd(t,e,n){var i=t.tag;if(i===5||i===6)t=t.stateNode,e?n.insertBefore(t,e):n.appendChild(t);else if(i!==4&&(t=t.child,t!==null))for(bd(t,e,n),t=t.sibling;t!==null;)bd(t,e,n),t=t.sibling}var Wt=null,Qn=!1;function ki(t,e,n){for(n=n.child;n!==null;)dv(t,e,n),n=n.sibling}function dv(t,e,n){if(di&&typeof di.onCommitFiberUnmount=="function")try{di.onCommitFiberUnmount(lc,n)}catch{}switch(n.tag){case 5:tn||ws(n,e);case 6:var i=Wt,r=Qn;Wt=null,ki(t,e,n),Wt=i,Qn=r,Wt!==null&&(Qn?(t=Wt,n=n.stateNode,t.nodeType===8?t.parentNode.removeChild(n):t.removeChild(n)):Wt.removeChild(n.stateNode));break;case 18:Wt!==null&&(Qn?(t=Wt,n=n.stateNode,t.nodeType===8?$c(t.parentNode,n):t.nodeType===1&&$c(t,n),Ha(t)):$c(Wt,n.stateNode));break;case 4:i=Wt,r=Qn,Wt=n.stateNode.containerInfo,Qn=!0,ki(t,e,n),Wt=i,Qn=r;break;case 0:case 11:case 14:case 15:if(!tn&&(i=n.updateQueue,i!==null&&(i=i.lastEffect,i!==null))){r=i=i.next;do{var s=r,a=s.destroy;s=s.tag,a!==void 0&&(s&2||s&4)&&wd(n,e,a),r=r.next}while(r!==i)}ki(t,e,n);break;case 1:if(!tn&&(ws(n,e),i=n.stateNode,typeof i.componentWillUnmount=="function"))try{i.props=n.memoizedProps,i.state=n.memoizedState,i.componentWillUnmount()}catch(o){bt(n,e,o)}ki(t,e,n);break;case 21:ki(t,e,n);break;case 22:n.mode&1?(tn=(i=tn)||n.memoizedState!==null,ki(t,e,n),tn=i):ki(t,e,n);break;default:ki(t,e,n)}}function zp(t){var e=t.updateQueue;if(e!==null){t.updateQueue=null;var n=t.stateNode;n===null&&(n=t.stateNode=new By),e.forEach(function(i){var r=Ky.bind(null,t,i);n.has(i)||(n.add(i),i.then(r,r))})}}function Xn(t,e){var n=e.deletions;if(n!==null)for(var i=0;i<n.length;i++){var r=n[i];try{var s=t,a=e,o=a;e:for(;o!==null;){switch(o.tag){case 5:Wt=o.stateNode,Qn=!1;break e;case 3:Wt=o.stateNode.containerInfo,Qn=!0;break e;case 4:Wt=o.stateNode.containerInfo,Qn=!0;break e}o=o.return}if(Wt===null)throw Error(ae(160));dv(s,a,r),Wt=null,Qn=!1;var l=r.alternate;l!==null&&(l.return=null),r.return=null}catch(c){bt(r,e,c)}}if(e.subtreeFlags&12854)for(e=e.child;e!==null;)hv(e,t),e=e.sibling}function hv(t,e){var n=t.alternate,i=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:if(Xn(e,t),ai(t),i&4){try{Pa(3,t,t.return),gc(3,t)}catch(v){bt(t,t.return,v)}try{Pa(5,t,t.return)}catch(v){bt(t,t.return,v)}}break;case 1:Xn(e,t),ai(t),i&512&&n!==null&&ws(n,n.return);break;case 5:if(Xn(e,t),ai(t),i&512&&n!==null&&ws(n,n.return),t.flags&32){var r=t.stateNode;try{Fa(r,"")}catch(v){bt(t,t.return,v)}}if(i&4&&(r=t.stateNode,r!=null)){var s=t.memoizedProps,a=n!==null?n.memoizedProps:s,o=t.type,l=t.updateQueue;if(t.updateQueue=null,l!==null)try{o==="input"&&s.type==="radio"&&s.name!=null&&Ig(r,s),Zu(o,a);var c=Zu(o,s);for(a=0;a<l.length;a+=2){var u=l[a],f=l[a+1];u==="style"?zg(r,f):u==="dangerouslySetInnerHTML"?Fg(r,f):u==="children"?Fa(r,f):bh(r,u,f,c)}switch(o){case"input":Xu(r,s);break;case"textarea":Ug(r,s);break;case"select":var h=r._wrapperState.wasMultiple;r._wrapperState.wasMultiple=!!s.multiple;var p=s.value;p!=null?bs(r,!!s.multiple,p,!1):h!==!!s.multiple&&(s.defaultValue!=null?bs(r,!!s.multiple,s.defaultValue,!0):bs(r,!!s.multiple,s.multiple?[]:"",!1))}r[Xa]=s}catch(v){bt(t,t.return,v)}}break;case 6:if(Xn(e,t),ai(t),i&4){if(t.stateNode===null)throw Error(ae(162));r=t.stateNode,s=t.memoizedProps;try{r.nodeValue=s}catch(v){bt(t,t.return,v)}}break;case 3:if(Xn(e,t),ai(t),i&4&&n!==null&&n.memoizedState.isDehydrated)try{Ha(e.containerInfo)}catch(v){bt(t,t.return,v)}break;case 4:Xn(e,t),ai(t);break;case 13:Xn(e,t),ai(t),r=t.child,r.flags&8192&&(s=r.memoizedState!==null,r.stateNode.isHidden=s,!s||r.alternate!==null&&r.alternate.memoizedState!==null||(of=Pt())),i&4&&zp(t);break;case 22:if(u=n!==null&&n.memoizedState!==null,t.mode&1?(tn=(c=tn)||u,Xn(e,t),tn=c):Xn(e,t),ai(t),i&8192){if(c=t.memoizedState!==null,(t.stateNode.isHidden=c)&&!u&&t.mode&1)for(xe=t,u=t.child;u!==null;){for(f=xe=u;xe!==null;){switch(h=xe,p=h.child,h.tag){case 0:case 11:case 14:case 15:Pa(4,h,h.return);break;case 1:ws(h,h.return);var _=h.stateNode;if(typeof _.componentWillUnmount=="function"){i=h,n=h.return;try{e=i,_.props=e.memoizedProps,_.state=e.memoizedState,_.componentWillUnmount()}catch(v){bt(i,n,v)}}break;case 5:ws(h,h.return);break;case 22:if(h.memoizedState!==null){Hp(f);continue}}p!==null?(p.return=h,xe=p):Hp(f)}u=u.sibling}e:for(u=null,f=t;;){if(f.tag===5){if(u===null){u=f;try{r=f.stateNode,c?(s=r.style,typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none"):(o=f.stateNode,l=f.memoizedProps.style,a=l!=null&&l.hasOwnProperty("display")?l.display:null,o.style.display=Og("display",a))}catch(v){bt(t,t.return,v)}}}else if(f.tag===6){if(u===null)try{f.stateNode.nodeValue=c?"":f.memoizedProps}catch(v){bt(t,t.return,v)}}else if((f.tag!==22&&f.tag!==23||f.memoizedState===null||f===t)&&f.child!==null){f.child.return=f,f=f.child;continue}if(f===t)break e;for(;f.sibling===null;){if(f.return===null||f.return===t)break e;u===f&&(u=null),f=f.return}u===f&&(u=null),f.sibling.return=f.return,f=f.sibling}}break;case 19:Xn(e,t),ai(t),i&4&&zp(t);break;case 21:break;default:Xn(e,t),ai(t)}}function ai(t){var e=t.flags;if(e&2){try{e:{for(var n=t.return;n!==null;){if(uv(n)){var i=n;break e}n=n.return}throw Error(ae(160))}switch(i.tag){case 5:var r=i.stateNode;i.flags&32&&(Fa(r,""),i.flags&=-33);var s=Op(t);bd(t,s,r);break;case 3:case 4:var a=i.stateNode.containerInfo,o=Op(t);Ad(t,o,a);break;default:throw Error(ae(161))}}catch(l){bt(t,t.return,l)}t.flags&=-3}e&4096&&(t.flags&=-4097)}function Gy(t,e,n){xe=t,fv(t)}function fv(t,e,n){for(var i=(t.mode&1)!==0;xe!==null;){var r=xe,s=r.child;if(r.tag===22&&i){var a=r.memoizedState!==null||Ro;if(!a){var o=r.alternate,l=o!==null&&o.memoizedState!==null||tn;o=Ro;var c=tn;if(Ro=a,(tn=l)&&!c)for(xe=r;xe!==null;)a=xe,l=a.child,a.tag===22&&a.memoizedState!==null?Gp(r):l!==null?(l.return=a,xe=l):Gp(r);for(;s!==null;)xe=s,fv(s),s=s.sibling;xe=r,Ro=o,tn=c}Bp(t)}else r.subtreeFlags&8772&&s!==null?(s.return=r,xe=s):Bp(t)}}function Bp(t){for(;xe!==null;){var e=xe;if(e.flags&8772){var n=e.alternate;try{if(e.flags&8772)switch(e.tag){case 0:case 11:case 15:tn||gc(5,e);break;case 1:var i=e.stateNode;if(e.flags&4&&!tn)if(n===null)i.componentDidMount();else{var r=e.elementType===e.type?n.memoizedProps:Zn(e.type,n.memoizedProps);i.componentDidUpdate(r,n.memoizedState,i.__reactInternalSnapshotBeforeUpdate)}var s=e.updateQueue;s!==null&&wp(e,s,i);break;case 3:var a=e.updateQueue;if(a!==null){if(n=null,e.child!==null)switch(e.child.tag){case 5:n=e.child.stateNode;break;case 1:n=e.child.stateNode}wp(e,a,n)}break;case 5:var o=e.stateNode;if(n===null&&e.flags&4){n=o;var l=e.memoizedProps;switch(e.type){case"button":case"input":case"select":case"textarea":l.autoFocus&&n.focus();break;case"img":l.src&&(n.src=l.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(e.memoizedState===null){var c=e.alternate;if(c!==null){var u=c.memoizedState;if(u!==null){var f=u.dehydrated;f!==null&&Ha(f)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(ae(163))}tn||e.flags&512&&Td(e)}catch(h){bt(e,e.return,h)}}if(e===t){xe=null;break}if(n=e.sibling,n!==null){n.return=e.return,xe=n;break}xe=e.return}}function Hp(t){for(;xe!==null;){var e=xe;if(e===t){xe=null;break}var n=e.sibling;if(n!==null){n.return=e.return,xe=n;break}xe=e.return}}function Gp(t){for(;xe!==null;){var e=xe;try{switch(e.tag){case 0:case 11:case 15:var n=e.return;try{gc(4,e)}catch(l){bt(e,n,l)}break;case 1:var i=e.stateNode;if(typeof i.componentDidMount=="function"){var r=e.return;try{i.componentDidMount()}catch(l){bt(e,r,l)}}var s=e.return;try{Td(e)}catch(l){bt(e,s,l)}break;case 5:var a=e.return;try{Td(e)}catch(l){bt(e,a,l)}}}catch(l){bt(e,e.return,l)}if(e===t){xe=null;break}var o=e.sibling;if(o!==null){o.return=e.return,xe=o;break}xe=e.return}}var Vy=Math.ceil,Yl=Ii.ReactCurrentDispatcher,sf=Ii.ReactCurrentOwner,Bn=Ii.ReactCurrentBatchConfig,Qe=0,Gt=null,Lt=null,$t=0,En=0,Ts=fr(0),kt=0,Qa=null,Hr=0,_c=0,af=0,Na=null,fn=null,of=0,Gs=1/0,Si=null,ql=!1,Cd=null,rr=null,Po=!1,qi=null,Kl=0,La=0,Rd=null,xl=-1,yl=0;function cn(){return Qe&6?Pt():xl!==-1?xl:xl=Pt()}function sr(t){return t.mode&1?Qe&2&&$t!==0?$t&-$t:Ay.transition!==null?(yl===0&&(yl=Zg()),yl):(t=ot,t!==0||(t=window.event,t=t===void 0?16:r_(t.type)),t):1}function ri(t,e,n,i){if(50<La)throw La=0,Rd=null,Error(ae(185));io(t,n,i),(!(Qe&2)||t!==Gt)&&(t===Gt&&(!(Qe&2)&&(_c|=n),kt===4&&Xi(t,$t)),_n(t,i),n===1&&Qe===0&&!(e.mode&1)&&(Gs=Pt()+500,fc&&pr()))}function _n(t,e){var n=t.callbackNode;Ax(t,e);var i=Dl(t,t===Gt?$t:0);if(i===0)n!==null&&Zf(n),t.callbackNode=null,t.callbackPriority=0;else if(e=i&-i,t.callbackPriority!==e){if(n!=null&&Zf(n),e===1)t.tag===0?Ty(Vp.bind(null,t)):E_(Vp.bind(null,t)),Sy(function(){!(Qe&6)&&pr()}),n=null;else{switch(Qg(i)){case 1:n=Lh;break;case 4:n=qg;break;case 16:n=Ll;break;case 536870912:n=Kg;break;default:n=Ll}n=Sv(n,pv.bind(null,t))}t.callbackPriority=e,t.callbackNode=n}}function pv(t,e){if(xl=-1,yl=0,Qe&6)throw Error(ae(327));var n=t.callbackNode;if(Ls()&&t.callbackNode!==n)return null;var i=Dl(t,t===Gt?$t:0);if(i===0)return null;if(i&30||i&t.expiredLanes||e)e=Zl(t,i);else{e=i;var r=Qe;Qe|=2;var s=gv();(Gt!==t||$t!==e)&&(Si=null,Gs=Pt()+500,kr(t,e));do try{Xy();break}catch(o){mv(t,o)}while(!0);Wh(),Yl.current=s,Qe=r,Lt!==null?e=0:(Gt=null,$t=0,e=kt)}if(e!==0){if(e===2&&(r=nd(t),r!==0&&(i=r,e=Pd(t,r))),e===1)throw n=Qa,kr(t,0),Xi(t,i),_n(t,Pt()),n;if(e===6)Xi(t,i);else{if(r=t.current.alternate,!(i&30)&&!jy(r)&&(e=Zl(t,i),e===2&&(s=nd(t),s!==0&&(i=s,e=Pd(t,s))),e===1))throw n=Qa,kr(t,0),Xi(t,i),_n(t,Pt()),n;switch(t.finishedWork=r,t.finishedLanes=i,e){case 0:case 1:throw Error(ae(345));case 2:Tr(t,fn,Si);break;case 3:if(Xi(t,i),(i&130023424)===i&&(e=of+500-Pt(),10<e)){if(Dl(t,0)!==0)break;if(r=t.suspendedLanes,(r&i)!==i){cn(),t.pingedLanes|=t.suspendedLanes&r;break}t.timeoutHandle=ud(Tr.bind(null,t,fn,Si),e);break}Tr(t,fn,Si);break;case 4:if(Xi(t,i),(i&4194240)===i)break;for(e=t.eventTimes,r=-1;0<i;){var a=31-ii(i);s=1<<a,a=e[a],a>r&&(r=a),i&=~s}if(i=r,i=Pt()-i,i=(120>i?120:480>i?480:1080>i?1080:1920>i?1920:3e3>i?3e3:4320>i?4320:1960*Vy(i/1960))-i,10<i){t.timeoutHandle=ud(Tr.bind(null,t,fn,Si),i);break}Tr(t,fn,Si);break;case 5:Tr(t,fn,Si);break;default:throw Error(ae(329))}}}return _n(t,Pt()),t.callbackNode===n?pv.bind(null,t):null}function Pd(t,e){var n=Na;return t.current.memoizedState.isDehydrated&&(kr(t,e).flags|=256),t=Zl(t,e),t!==2&&(e=fn,fn=n,e!==null&&Nd(e)),t}function Nd(t){fn===null?fn=t:fn.push.apply(fn,t)}function jy(t){for(var e=t;;){if(e.flags&16384){var n=e.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var i=0;i<n.length;i++){var r=n[i],s=r.getSnapshot;r=r.value;try{if(!si(s(),r))return!1}catch{return!1}}}if(n=e.child,e.subtreeFlags&16384&&n!==null)n.return=e,e=n;else{if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return!0;e=e.return}e.sibling.return=e.return,e=e.sibling}}return!0}function Xi(t,e){for(e&=~af,e&=~_c,t.suspendedLanes|=e,t.pingedLanes&=~e,t=t.expirationTimes;0<e;){var n=31-ii(e),i=1<<n;t[n]=-1,e&=~i}}function Vp(t){if(Qe&6)throw Error(ae(327));Ls();var e=Dl(t,0);if(!(e&1))return _n(t,Pt()),null;var n=Zl(t,e);if(t.tag!==0&&n===2){var i=nd(t);i!==0&&(e=i,n=Pd(t,i))}if(n===1)throw n=Qa,kr(t,0),Xi(t,e),_n(t,Pt()),n;if(n===6)throw Error(ae(345));return t.finishedWork=t.current.alternate,t.finishedLanes=e,Tr(t,fn,Si),_n(t,Pt()),null}function lf(t,e){var n=Qe;Qe|=1;try{return t(e)}finally{Qe=n,Qe===0&&(Gs=Pt()+500,fc&&pr())}}function Gr(t){qi!==null&&qi.tag===0&&!(Qe&6)&&Ls();var e=Qe;Qe|=1;var n=Bn.transition,i=ot;try{if(Bn.transition=null,ot=1,t)return t()}finally{ot=i,Bn.transition=n,Qe=e,!(Qe&6)&&pr()}}function cf(){En=Ts.current,vt(Ts)}function kr(t,e){t.finishedWork=null,t.finishedLanes=0;var n=t.timeoutHandle;if(n!==-1&&(t.timeoutHandle=-1,yy(n)),Lt!==null)for(n=Lt.return;n!==null;){var i=n;switch(Gh(i),i.tag){case 1:i=i.type.childContextTypes,i!=null&&Ol();break;case 3:Bs(),vt(mn),vt(rn),Zh();break;case 5:Kh(i);break;case 4:Bs();break;case 13:vt(Mt);break;case 19:vt(Mt);break;case 10:Xh(i.type._context);break;case 22:case 23:cf()}n=n.return}if(Gt=t,Lt=t=ar(t.current,null),$t=En=e,kt=0,Qa=null,af=_c=Hr=0,fn=Na=null,Lr!==null){for(e=0;e<Lr.length;e++)if(n=Lr[e],i=n.interleaved,i!==null){n.interleaved=null;var r=i.next,s=n.pending;if(s!==null){var a=s.next;s.next=r,i.next=a}n.pending=i}Lr=null}return t}function mv(t,e){do{var n=Lt;try{if(Wh(),gl.current=$l,Xl){for(var i=Et.memoizedState;i!==null;){var r=i.queue;r!==null&&(r.pending=null),i=i.next}Xl=!1}if(Br=0,Ht=Ut=Et=null,Ra=!1,qa=0,sf.current=null,n===null||n.return===null){kt=1,Qa=e,Lt=null;break}e:{var s=t,a=n.return,o=n,l=e;if(e=$t,o.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){var c=l,u=o,f=u.tag;if(!(u.mode&1)&&(f===0||f===11||f===15)){var h=u.alternate;h?(u.updateQueue=h.updateQueue,u.memoizedState=h.memoizedState,u.lanes=h.lanes):(u.updateQueue=null,u.memoizedState=null)}var p=Pp(a);if(p!==null){p.flags&=-257,Np(p,a,o,s,e),p.mode&1&&Rp(s,c,e),e=p,l=c;var _=e.updateQueue;if(_===null){var v=new Set;v.add(l),e.updateQueue=v}else _.add(l);break e}else{if(!(e&1)){Rp(s,c,e),uf();break e}l=Error(ae(426))}}else if(xt&&o.mode&1){var m=Pp(a);if(m!==null){!(m.flags&65536)&&(m.flags|=256),Np(m,a,o,s,e),Vh(Hs(l,o));break e}}s=l=Hs(l,o),kt!==4&&(kt=2),Na===null?Na=[s]:Na.push(s),s=a;do{switch(s.tag){case 3:s.flags|=65536,e&=-e,s.lanes|=e;var d=Q_(s,l,e);Ep(s,d);break e;case 1:o=l;var x=s.type,y=s.stateNode;if(!(s.flags&128)&&(typeof x.getDerivedStateFromError=="function"||y!==null&&typeof y.componentDidCatch=="function"&&(rr===null||!rr.has(y)))){s.flags|=65536,e&=-e,s.lanes|=e;var M=J_(s,o,e);Ep(s,M);break e}}s=s.return}while(s!==null)}vv(n)}catch(P){e=P,Lt===n&&n!==null&&(Lt=n=n.return);continue}break}while(!0)}function gv(){var t=Yl.current;return Yl.current=$l,t===null?$l:t}function uf(){(kt===0||kt===3||kt===2)&&(kt=4),Gt===null||!(Hr&268435455)&&!(_c&268435455)||Xi(Gt,$t)}function Zl(t,e){var n=Qe;Qe|=2;var i=gv();(Gt!==t||$t!==e)&&(Si=null,kr(t,e));do try{Wy();break}catch(r){mv(t,r)}while(!0);if(Wh(),Qe=n,Yl.current=i,Lt!==null)throw Error(ae(261));return Gt=null,$t=0,kt}function Wy(){for(;Lt!==null;)_v(Lt)}function Xy(){for(;Lt!==null&&!_x();)_v(Lt)}function _v(t){var e=yv(t.alternate,t,En);t.memoizedProps=t.pendingProps,e===null?vv(t):Lt=e,sf.current=null}function vv(t){var e=t;do{var n=e.alternate;if(t=e.return,e.flags&32768){if(n=zy(n,e),n!==null){n.flags&=32767,Lt=n;return}if(t!==null)t.flags|=32768,t.subtreeFlags=0,t.deletions=null;else{kt=6,Lt=null;return}}else if(n=Oy(n,e,En),n!==null){Lt=n;return}if(e=e.sibling,e!==null){Lt=e;return}Lt=e=t}while(e!==null);kt===0&&(kt=5)}function Tr(t,e,n){var i=ot,r=Bn.transition;try{Bn.transition=null,ot=1,$y(t,e,n,i)}finally{Bn.transition=r,ot=i}return null}function $y(t,e,n,i){do Ls();while(qi!==null);if(Qe&6)throw Error(ae(327));n=t.finishedWork;var r=t.finishedLanes;if(n===null)return null;if(t.finishedWork=null,t.finishedLanes=0,n===t.current)throw Error(ae(177));t.callbackNode=null,t.callbackPriority=0;var s=n.lanes|n.childLanes;if(bx(t,s),t===Gt&&(Lt=Gt=null,$t=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||Po||(Po=!0,Sv(Ll,function(){return Ls(),null})),s=(n.flags&15990)!==0,n.subtreeFlags&15990||s){s=Bn.transition,Bn.transition=null;var a=ot;ot=1;var o=Qe;Qe|=4,sf.current=null,Hy(t,n),hv(n,t),fy(ld),Il=!!od,ld=od=null,t.current=n,Gy(n),vx(),Qe=o,ot=a,Bn.transition=s}else t.current=n;if(Po&&(Po=!1,qi=t,Kl=r),s=t.pendingLanes,s===0&&(rr=null),Sx(n.stateNode),_n(t,Pt()),e!==null)for(i=t.onRecoverableError,n=0;n<e.length;n++)r=e[n],i(r.value,{componentStack:r.stack,digest:r.digest});if(ql)throw ql=!1,t=Cd,Cd=null,t;return Kl&1&&t.tag!==0&&Ls(),s=t.pendingLanes,s&1?t===Rd?La++:(La=0,Rd=t):La=0,pr(),null}function Ls(){if(qi!==null){var t=Qg(Kl),e=Bn.transition,n=ot;try{if(Bn.transition=null,ot=16>t?16:t,qi===null)var i=!1;else{if(t=qi,qi=null,Kl=0,Qe&6)throw Error(ae(331));var r=Qe;for(Qe|=4,xe=t.current;xe!==null;){var s=xe,a=s.child;if(xe.flags&16){var o=s.deletions;if(o!==null){for(var l=0;l<o.length;l++){var c=o[l];for(xe=c;xe!==null;){var u=xe;switch(u.tag){case 0:case 11:case 15:Pa(8,u,s)}var f=u.child;if(f!==null)f.return=u,xe=f;else for(;xe!==null;){u=xe;var h=u.sibling,p=u.return;if(cv(u),u===c){xe=null;break}if(h!==null){h.return=p,xe=h;break}xe=p}}}var _=s.alternate;if(_!==null){var v=_.child;if(v!==null){_.child=null;do{var m=v.sibling;v.sibling=null,v=m}while(v!==null)}}xe=s}}if(s.subtreeFlags&2064&&a!==null)a.return=s,xe=a;else e:for(;xe!==null;){if(s=xe,s.flags&2048)switch(s.tag){case 0:case 11:case 15:Pa(9,s,s.return)}var d=s.sibling;if(d!==null){d.return=s.return,xe=d;break e}xe=s.return}}var x=t.current;for(xe=x;xe!==null;){a=xe;var y=a.child;if(a.subtreeFlags&2064&&y!==null)y.return=a,xe=y;else e:for(a=x;xe!==null;){if(o=xe,o.flags&2048)try{switch(o.tag){case 0:case 11:case 15:gc(9,o)}}catch(P){bt(o,o.return,P)}if(o===a){xe=null;break e}var M=o.sibling;if(M!==null){M.return=o.return,xe=M;break e}xe=o.return}}if(Qe=r,pr(),di&&typeof di.onPostCommitFiberRoot=="function")try{di.onPostCommitFiberRoot(lc,t)}catch{}i=!0}return i}finally{ot=n,Bn.transition=e}}return!1}function jp(t,e,n){e=Hs(n,e),e=Q_(t,e,1),t=ir(t,e,1),e=cn(),t!==null&&(io(t,1,e),_n(t,e))}function bt(t,e,n){if(t.tag===3)jp(t,t,n);else for(;e!==null;){if(e.tag===3){jp(e,t,n);break}else if(e.tag===1){var i=e.stateNode;if(typeof e.type.getDerivedStateFromError=="function"||typeof i.componentDidCatch=="function"&&(rr===null||!rr.has(i))){t=Hs(n,t),t=J_(e,t,1),e=ir(e,t,1),t=cn(),e!==null&&(io(e,1,t),_n(e,t));break}}e=e.return}}function Yy(t,e,n){var i=t.pingCache;i!==null&&i.delete(e),e=cn(),t.pingedLanes|=t.suspendedLanes&n,Gt===t&&($t&n)===n&&(kt===4||kt===3&&($t&130023424)===$t&&500>Pt()-of?kr(t,0):af|=n),_n(t,e)}function xv(t,e){e===0&&(t.mode&1?(e=yo,yo<<=1,!(yo&130023424)&&(yo=4194304)):e=1);var n=cn();t=Ni(t,e),t!==null&&(io(t,e,n),_n(t,n))}function qy(t){var e=t.memoizedState,n=0;e!==null&&(n=e.retryLane),xv(t,n)}function Ky(t,e){var n=0;switch(t.tag){case 13:var i=t.stateNode,r=t.memoizedState;r!==null&&(n=r.retryLane);break;case 19:i=t.stateNode;break;default:throw Error(ae(314))}i!==null&&i.delete(e),xv(t,n)}var yv;yv=function(t,e,n){if(t!==null)if(t.memoizedProps!==e.pendingProps||mn.current)pn=!0;else{if(!(t.lanes&n)&&!(e.flags&128))return pn=!1,Fy(t,e,n);pn=!!(t.flags&131072)}else pn=!1,xt&&e.flags&1048576&&w_(e,Hl,e.index);switch(e.lanes=0,e.tag){case 2:var i=e.type;vl(t,e),t=e.pendingProps;var r=Fs(e,rn.current);Ns(e,n),r=Jh(null,e,i,t,r,n);var s=ef();return e.flags|=1,typeof r=="object"&&r!==null&&typeof r.render=="function"&&r.$$typeof===void 0?(e.tag=1,e.memoizedState=null,e.updateQueue=null,gn(i)?(s=!0,zl(e)):s=!1,e.memoizedState=r.state!==null&&r.state!==void 0?r.state:null,Yh(e),r.updater=mc,e.stateNode=r,r._reactInternals=e,_d(e,i,t,n),e=yd(null,e,i,!0,s,n)):(e.tag=0,xt&&s&&Hh(e),on(null,e,r,n),e=e.child),e;case 16:i=e.elementType;e:{switch(vl(t,e),t=e.pendingProps,r=i._init,i=r(i._payload),e.type=i,r=e.tag=Qy(i),t=Zn(i,t),r){case 0:e=xd(null,e,i,t,n);break e;case 1:e=Ip(null,e,i,t,n);break e;case 11:e=Lp(null,e,i,t,n);break e;case 14:e=Dp(null,e,i,Zn(i.type,t),n);break e}throw Error(ae(306,i,""))}return e;case 0:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Zn(i,r),xd(t,e,i,r,n);case 1:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Zn(i,r),Ip(t,e,i,r,n);case 3:e:{if(iv(e),t===null)throw Error(ae(387));i=e.pendingProps,s=e.memoizedState,r=s.element,P_(t,e),jl(e,i,null,n);var a=e.memoizedState;if(i=a.element,s.isDehydrated)if(s={element:i,isDehydrated:!1,cache:a.cache,pendingSuspenseBoundaries:a.pendingSuspenseBoundaries,transitions:a.transitions},e.updateQueue.baseState=s,e.memoizedState=s,e.flags&256){r=Hs(Error(ae(423)),e),e=Up(t,e,i,n,r);break e}else if(i!==r){r=Hs(Error(ae(424)),e),e=Up(t,e,i,n,r);break e}else for(Tn=nr(e.stateNode.containerInfo.firstChild),bn=e,xt=!0,Jn=null,n=C_(e,null,i,n),e.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(Os(),i===r){e=Li(t,e,n);break e}on(t,e,i,n)}e=e.child}return e;case 5:return N_(e),t===null&&pd(e),i=e.type,r=e.pendingProps,s=t!==null?t.memoizedProps:null,a=r.children,cd(i,r)?a=null:s!==null&&cd(i,s)&&(e.flags|=32),nv(t,e),on(t,e,a,n),e.child;case 6:return t===null&&pd(e),null;case 13:return rv(t,e,n);case 4:return qh(e,e.stateNode.containerInfo),i=e.pendingProps,t===null?e.child=zs(e,null,i,n):on(t,e,i,n),e.child;case 11:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Zn(i,r),Lp(t,e,i,r,n);case 7:return on(t,e,e.pendingProps,n),e.child;case 8:return on(t,e,e.pendingProps.children,n),e.child;case 12:return on(t,e,e.pendingProps.children,n),e.child;case 10:e:{if(i=e.type._context,r=e.pendingProps,s=e.memoizedProps,a=r.value,dt(Gl,i._currentValue),i._currentValue=a,s!==null)if(si(s.value,a)){if(s.children===r.children&&!mn.current){e=Li(t,e,n);break e}}else for(s=e.child,s!==null&&(s.return=e);s!==null;){var o=s.dependencies;if(o!==null){a=s.child;for(var l=o.firstContext;l!==null;){if(l.context===i){if(s.tag===1){l=bi(-1,n&-n),l.tag=2;var c=s.updateQueue;if(c!==null){c=c.shared;var u=c.pending;u===null?l.next=l:(l.next=u.next,u.next=l),c.pending=l}}s.lanes|=n,l=s.alternate,l!==null&&(l.lanes|=n),md(s.return,n,e),o.lanes|=n;break}l=l.next}}else if(s.tag===10)a=s.type===e.type?null:s.child;else if(s.tag===18){if(a=s.return,a===null)throw Error(ae(341));a.lanes|=n,o=a.alternate,o!==null&&(o.lanes|=n),md(a,n,e),a=s.sibling}else a=s.child;if(a!==null)a.return=s;else for(a=s;a!==null;){if(a===e){a=null;break}if(s=a.sibling,s!==null){s.return=a.return,a=s;break}a=a.return}s=a}on(t,e,r.children,n),e=e.child}return e;case 9:return r=e.type,i=e.pendingProps.children,Ns(e,n),r=Hn(r),i=i(r),e.flags|=1,on(t,e,i,n),e.child;case 14:return i=e.type,r=Zn(i,e.pendingProps),r=Zn(i.type,r),Dp(t,e,i,r,n);case 15:return ev(t,e,e.type,e.pendingProps,n);case 17:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Zn(i,r),vl(t,e),e.tag=1,gn(i)?(t=!0,zl(e)):t=!1,Ns(e,n),Z_(e,i,r),_d(e,i,r,n),yd(null,e,i,!0,t,n);case 19:return sv(t,e,n);case 22:return tv(t,e,n)}throw Error(ae(156,e.tag))};function Sv(t,e){return Yg(t,e)}function Zy(t,e,n,i){this.tag=t,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=e,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=i,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function On(t,e,n,i){return new Zy(t,e,n,i)}function df(t){return t=t.prototype,!(!t||!t.isReactComponent)}function Qy(t){if(typeof t=="function")return df(t)?1:0;if(t!=null){if(t=t.$$typeof,t===Rh)return 11;if(t===Ph)return 14}return 2}function ar(t,e){var n=t.alternate;return n===null?(n=On(t.tag,e,t.key,t.mode),n.elementType=t.elementType,n.type=t.type,n.stateNode=t.stateNode,n.alternate=t,t.alternate=n):(n.pendingProps=e,n.type=t.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=t.flags&14680064,n.childLanes=t.childLanes,n.lanes=t.lanes,n.child=t.child,n.memoizedProps=t.memoizedProps,n.memoizedState=t.memoizedState,n.updateQueue=t.updateQueue,e=t.dependencies,n.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext},n.sibling=t.sibling,n.index=t.index,n.ref=t.ref,n}function Sl(t,e,n,i,r,s){var a=2;if(i=t,typeof t=="function")df(t)&&(a=1);else if(typeof t=="string")a=5;else e:switch(t){case ms:return Fr(n.children,r,s,e);case Ch:a=8,r|=8;break;case Hu:return t=On(12,n,e,r|2),t.elementType=Hu,t.lanes=s,t;case Gu:return t=On(13,n,e,r),t.elementType=Gu,t.lanes=s,t;case Vu:return t=On(19,n,e,r),t.elementType=Vu,t.lanes=s,t;case Ng:return vc(n,r,s,e);default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case Rg:a=10;break e;case Pg:a=9;break e;case Rh:a=11;break e;case Ph:a=14;break e;case Vi:a=16,i=null;break e}throw Error(ae(130,t==null?t:typeof t,""))}return e=On(a,n,e,r),e.elementType=t,e.type=i,e.lanes=s,e}function Fr(t,e,n,i){return t=On(7,t,i,e),t.lanes=n,t}function vc(t,e,n,i){return t=On(22,t,i,e),t.elementType=Ng,t.lanes=n,t.stateNode={isHidden:!1},t}function tu(t,e,n){return t=On(6,t,null,e),t.lanes=n,t}function nu(t,e,n){return e=On(4,t.children!==null?t.children:[],t.key,e),e.lanes=n,e.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},e}function Jy(t,e,n,i,r){this.tag=e,this.containerInfo=t,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=kc(0),this.expirationTimes=kc(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=kc(0),this.identifierPrefix=i,this.onRecoverableError=r,this.mutableSourceEagerHydrationData=null}function hf(t,e,n,i,r,s,a,o,l){return t=new Jy(t,e,n,o,l),e===1?(e=1,s===!0&&(e|=8)):e=0,s=On(3,null,null,e),t.current=s,s.stateNode=t,s.memoizedState={element:i,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},Yh(s),t}function eS(t,e,n){var i=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:ps,key:i==null?null:""+i,children:t,containerInfo:e,implementation:n}}function Mv(t){if(!t)return ur;t=t._reactInternals;e:{if(Xr(t)!==t||t.tag!==1)throw Error(ae(170));var e=t;do{switch(e.tag){case 3:e=e.stateNode.context;break e;case 1:if(gn(e.type)){e=e.stateNode.__reactInternalMemoizedMergedChildContext;break e}}e=e.return}while(e!==null);throw Error(ae(171))}if(t.tag===1){var n=t.type;if(gn(n))return M_(t,n,e)}return e}function Ev(t,e,n,i,r,s,a,o,l){return t=hf(n,i,!0,t,r,s,a,o,l),t.context=Mv(null),n=t.current,i=cn(),r=sr(n),s=bi(i,r),s.callback=e??null,ir(n,s,r),t.current.lanes=r,io(t,r,i),_n(t,i),t}function xc(t,e,n,i){var r=e.current,s=cn(),a=sr(r);return n=Mv(n),e.context===null?e.context=n:e.pendingContext=n,e=bi(s,a),e.payload={element:t},i=i===void 0?null:i,i!==null&&(e.callback=i),t=ir(r,e,a),t!==null&&(ri(t,r,a,s),ml(t,r,a)),a}function Ql(t){if(t=t.current,!t.child)return null;switch(t.child.tag){case 5:return t.child.stateNode;default:return t.child.stateNode}}function Wp(t,e){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var n=t.retryLane;t.retryLane=n!==0&&n<e?n:e}}function ff(t,e){Wp(t,e),(t=t.alternate)&&Wp(t,e)}function tS(){return null}var wv=typeof reportError=="function"?reportError:function(t){console.error(t)};function pf(t){this._internalRoot=t}yc.prototype.render=pf.prototype.render=function(t){var e=this._internalRoot;if(e===null)throw Error(ae(409));xc(t,e,null,null)};yc.prototype.unmount=pf.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var e=t.containerInfo;Gr(function(){xc(null,t,null,null)}),e[Pi]=null}};function yc(t){this._internalRoot=t}yc.prototype.unstable_scheduleHydration=function(t){if(t){var e=t_();t={blockedOn:null,target:t,priority:e};for(var n=0;n<Wi.length&&e!==0&&e<Wi[n].priority;n++);Wi.splice(n,0,t),n===0&&i_(t)}};function mf(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function Sc(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11&&(t.nodeType!==8||t.nodeValue!==" react-mount-point-unstable "))}function Xp(){}function nS(t,e,n,i,r){if(r){if(typeof i=="function"){var s=i;i=function(){var c=Ql(a);s.call(c)}}var a=Ev(e,i,t,0,null,!1,!1,"",Xp);return t._reactRootContainer=a,t[Pi]=a.current,ja(t.nodeType===8?t.parentNode:t),Gr(),a}for(;r=t.lastChild;)t.removeChild(r);if(typeof i=="function"){var o=i;i=function(){var c=Ql(l);o.call(c)}}var l=hf(t,0,!1,null,null,!1,!1,"",Xp);return t._reactRootContainer=l,t[Pi]=l.current,ja(t.nodeType===8?t.parentNode:t),Gr(function(){xc(e,l,n,i)}),l}function Mc(t,e,n,i,r){var s=n._reactRootContainer;if(s){var a=s;if(typeof r=="function"){var o=r;r=function(){var l=Ql(a);o.call(l)}}xc(e,a,t,r)}else a=nS(n,e,t,r,i);return Ql(a)}Jg=function(t){switch(t.tag){case 3:var e=t.stateNode;if(e.current.memoizedState.isDehydrated){var n=Sa(e.pendingLanes);n!==0&&(Dh(e,n|1),_n(e,Pt()),!(Qe&6)&&(Gs=Pt()+500,pr()))}break;case 13:Gr(function(){var i=Ni(t,1);if(i!==null){var r=cn();ri(i,t,1,r)}}),ff(t,1)}};Ih=function(t){if(t.tag===13){var e=Ni(t,134217728);if(e!==null){var n=cn();ri(e,t,134217728,n)}ff(t,134217728)}};e_=function(t){if(t.tag===13){var e=sr(t),n=Ni(t,e);if(n!==null){var i=cn();ri(n,t,e,i)}ff(t,e)}};t_=function(){return ot};n_=function(t,e){var n=ot;try{return ot=t,e()}finally{ot=n}};Ju=function(t,e,n){switch(e){case"input":if(Xu(t,n),e=n.name,n.type==="radio"&&e!=null){for(n=t;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+e)+'][type="radio"]'),e=0;e<n.length;e++){var i=n[e];if(i!==t&&i.form===t.form){var r=hc(i);if(!r)throw Error(ae(90));Dg(i),Xu(i,r)}}}break;case"textarea":Ug(t,n);break;case"select":e=n.value,e!=null&&bs(t,!!n.multiple,e,!1)}};Gg=lf;Vg=Gr;var iS={usingClientEntryPoint:!1,Events:[so,xs,hc,Bg,Hg,lf]},la={findFiberByHostInstance:Nr,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},rS={bundleType:la.bundleType,version:la.version,rendererPackageName:la.rendererPackageName,rendererConfig:la.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:Ii.ReactCurrentDispatcher,findHostInstanceByFiber:function(t){return t=Xg(t),t===null?null:t.stateNode},findFiberByHostInstance:la.findFiberByHostInstance||tS,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var No=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!No.isDisabled&&No.supportsFiber)try{lc=No.inject(rS),di=No}catch{}}Rn.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=iS;Rn.createPortal=function(t,e){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!mf(e))throw Error(ae(200));return eS(t,e,null,n)};Rn.createRoot=function(t,e){if(!mf(t))throw Error(ae(299));var n=!1,i="",r=wv;return e!=null&&(e.unstable_strictMode===!0&&(n=!0),e.identifierPrefix!==void 0&&(i=e.identifierPrefix),e.onRecoverableError!==void 0&&(r=e.onRecoverableError)),e=hf(t,1,!1,null,null,n,!1,i,r),t[Pi]=e.current,ja(t.nodeType===8?t.parentNode:t),new pf(e)};Rn.findDOMNode=function(t){if(t==null)return null;if(t.nodeType===1)return t;var e=t._reactInternals;if(e===void 0)throw typeof t.render=="function"?Error(ae(188)):(t=Object.keys(t).join(","),Error(ae(268,t)));return t=Xg(e),t=t===null?null:t.stateNode,t};Rn.flushSync=function(t){return Gr(t)};Rn.hydrate=function(t,e,n){if(!Sc(e))throw Error(ae(200));return Mc(null,t,e,!0,n)};Rn.hydrateRoot=function(t,e,n){if(!mf(t))throw Error(ae(405));var i=n!=null&&n.hydratedSources||null,r=!1,s="",a=wv;if(n!=null&&(n.unstable_strictMode===!0&&(r=!0),n.identifierPrefix!==void 0&&(s=n.identifierPrefix),n.onRecoverableError!==void 0&&(a=n.onRecoverableError)),e=Ev(e,null,t,1,n??null,r,!1,s,a),t[Pi]=e.current,ja(t),i)for(t=0;t<i.length;t++)n=i[t],r=n._getVersion,r=r(n._source),e.mutableSourceEagerHydrationData==null?e.mutableSourceEagerHydrationData=[n,r]:e.mutableSourceEagerHydrationData.push(n,r);return new yc(e)};Rn.render=function(t,e,n){if(!Sc(e))throw Error(ae(200));return Mc(null,t,e,!1,n)};Rn.unmountComponentAtNode=function(t){if(!Sc(t))throw Error(ae(40));return t._reactRootContainer?(Gr(function(){Mc(null,null,t,!1,function(){t._reactRootContainer=null,t[Pi]=null})}),!0):!1};Rn.unstable_batchedUpdates=lf;Rn.unstable_renderSubtreeIntoContainer=function(t,e,n,i){if(!Sc(n))throw Error(ae(200));if(t==null||t._reactInternals===void 0)throw Error(ae(38));return Mc(t,e,n,!1,i)};Rn.version="18.3.1-next-f1338f8080-20240426";function Tv(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Tv)}catch(t){console.error(t)}}Tv(),Tg.exports=Rn;var sS=Tg.exports,$p=sS;zu.createRoot=$p.createRoot,zu.hydrateRoot=$p.hydrateRoot;function aS(t=null){const[e,n]=ye.useState(null),[i,r]=ye.useState(!1),[s,a]=ye.useState(null),o=ye.useRef(null),l=ye.useRef(null),c=ye.useRef(!0),u=ye.useRef(1e3),f=t||(()=>{if(typeof window>"u")return"ws://localhost:8080/ws/telemetry";const v=window.location.protocol==="https:"?"wss:":"ws:",m=window.location.host||"localhost:8080";return`${v}//${m}/ws/telemetry`})(),h=ye.useCallback(()=>{if(!c.current)return;let v;try{v=new WebSocket(f)}catch(m){console.error("[ws] construction failed",m),l.current=setTimeout(h,u.current);return}v.onopen=()=>{r(!0),u.current=1e3},v.onmessage=m=>{try{const d=JSON.parse(m.data);d.type==="cmd_result"?a({...d,at:Date.now()}):d.type==="ack"||n(d)}catch(d){console.error("[ws] parse error",d)}},v.onclose=()=>{r(!1),c.current&&(l.current=setTimeout(h,u.current),u.current=Math.min(u.current*1.6,1e4))},v.onerror=()=>v.close(),o.current=v},[f]),p=ye.useCallback((v,m={})=>{const d=o.current;d&&d.readyState===WebSocket.OPEN&&d.send(JSON.stringify({action:v,...m}))},[]),_=ye.useCallback((v,m={})=>{const d=o.current;return d&&d.readyState===WebSocket.OPEN?(d.send(JSON.stringify({action:"cmd",name:v,params:m})),!0):(a({name:v,result:{ok:!1,error:"not connected"},at:Date.now()}),!1)},[]);return ye.useEffect(()=>(c.current=!0,h(),()=>{c.current=!1,clearTimeout(l.current),o.current&&o.current.close()}),[h]),{data:e,connected:i,sendCommand:p,runCommand:_,lastResult:s}}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const gf="169",oS=0,Yp=1,lS=2,Av=1,bv=2,yi=3,dr=0,Yt=1,lt=2,or=0,Ds=1,Jl=2,qp=3,Kp=4,cS=5,Cr=100,uS=101,dS=102,hS=103,fS=104,pS=200,mS=201,gS=202,_S=203,Ld=204,Dd=205,vS=206,xS=207,yS=208,SS=209,MS=210,ES=211,wS=212,TS=213,AS=214,Id=0,Ud=1,kd=2,Vs=3,Fd=4,Od=5,zd=6,Bd=7,Cv=0,bS=1,CS=2,lr=0,RS=1,PS=2,NS=3,LS=4,DS=5,IS=6,US=7,Rv=300,js=301,Ws=302,Hd=303,Gd=304,Ec=306,Vd=1e3,Ki=1001,jd=1002,zn=1003,kS=1004,Lo=1005,ei=1006,iu=1007,Zi=1008,Di=1009,Pv=1010,Nv=1011,Ja=1012,_f=1013,Vr=1014,Ti=1015,oo=1016,vf=1017,xf=1018,Xs=1020,Lv=35902,Dv=1021,Iv=1022,ni=1023,Uv=1024,kv=1025,Is=1026,$s=1027,Fv=1028,yf=1029,Ov=1030,Sf=1031,Mf=1033,Ml=33776,El=33777,wl=33778,Tl=33779,Wd=35840,Xd=35841,$d=35842,Yd=35843,qd=36196,Kd=37492,Zd=37496,Qd=37808,Jd=37809,eh=37810,th=37811,nh=37812,ih=37813,rh=37814,sh=37815,ah=37816,oh=37817,lh=37818,ch=37819,uh=37820,dh=37821,Al=36492,hh=36494,fh=36495,zv=36283,ph=36284,mh=36285,gh=36286,FS=3200,OS=3201,Bv=0,zS=1,$i="",en="srgb",mr="srgb-linear",Ef="display-p3",wc="display-p3-linear",ec="linear",_t="srgb",tc="rec709",nc="p3",Kr=7680,Zp=519,BS=512,HS=513,GS=514,Hv=515,VS=516,jS=517,WS=518,XS=519,_h=35044,Qp="300 es",Ai=2e3,ic=2001;class Js{addEventListener(e,n){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(n)===-1&&i[e].push(n)}hasEventListener(e,n){if(this._listeners===void 0)return!1;const i=this._listeners;return i[e]!==void 0&&i[e].indexOf(n)!==-1}removeEventListener(e,n){if(this._listeners===void 0)return;const r=this._listeners[e];if(r!==void 0){const s=r.indexOf(n);s!==-1&&r.splice(s,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const i=this._listeners[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,a=r.length;s<a;s++)r[s].call(this,e);e.target=null}}}const Qt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Jp=1234567;const Da=Math.PI/180,eo=180/Math.PI;function Ci(){const t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Qt[t&255]+Qt[t>>8&255]+Qt[t>>16&255]+Qt[t>>24&255]+"-"+Qt[e&255]+Qt[e>>8&255]+"-"+Qt[e>>16&15|64]+Qt[e>>24&255]+"-"+Qt[n&63|128]+Qt[n>>8&255]+"-"+Qt[n>>16&255]+Qt[n>>24&255]+Qt[i&255]+Qt[i>>8&255]+Qt[i>>16&255]+Qt[i>>24&255]).toLowerCase()}function ln(t,e,n){return Math.max(e,Math.min(n,t))}function wf(t,e){return(t%e+e)%e}function $S(t,e,n,i,r){return i+(t-e)*(r-i)/(n-e)}function YS(t,e,n){return t!==e?(n-t)/(e-t):0}function Ia(t,e,n){return(1-n)*t+n*e}function qS(t,e,n,i){return Ia(t,e,1-Math.exp(-n*i))}function KS(t,e=1){return e-Math.abs(wf(t,e*2)-e)}function ZS(t,e,n){return t<=e?0:t>=n?1:(t=(t-e)/(n-e),t*t*(3-2*t))}function QS(t,e,n){return t<=e?0:t>=n?1:(t=(t-e)/(n-e),t*t*t*(t*(t*6-15)+10))}function JS(t,e){return t+Math.floor(Math.random()*(e-t+1))}function eM(t,e){return t+Math.random()*(e-t)}function tM(t){return t*(.5-Math.random())}function nM(t){t!==void 0&&(Jp=t);let e=Jp+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function iM(t){return t*Da}function rM(t){return t*eo}function sM(t){return(t&t-1)===0&&t!==0}function aM(t){return Math.pow(2,Math.ceil(Math.log(t)/Math.LN2))}function oM(t){return Math.pow(2,Math.floor(Math.log(t)/Math.LN2))}function lM(t,e,n,i,r){const s=Math.cos,a=Math.sin,o=s(n/2),l=a(n/2),c=s((e+i)/2),u=a((e+i)/2),f=s((e-i)/2),h=a((e-i)/2),p=s((i-e)/2),_=a((i-e)/2);switch(r){case"XYX":t.set(o*u,l*f,l*h,o*c);break;case"YZY":t.set(l*h,o*u,l*f,o*c);break;case"ZXZ":t.set(l*f,l*h,o*u,o*c);break;case"XZX":t.set(o*u,l*_,l*p,o*c);break;case"YXY":t.set(l*p,o*u,l*_,o*c);break;case"ZYZ":t.set(l*_,l*p,o*u,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function ti(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return t/4294967295;case Uint16Array:return t/65535;case Uint8Array:return t/255;case Int32Array:return Math.max(t/2147483647,-1);case Int16Array:return Math.max(t/32767,-1);case Int8Array:return Math.max(t/127,-1);default:throw new Error("Invalid component type.")}}function at(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return Math.round(t*4294967295);case Uint16Array:return Math.round(t*65535);case Uint8Array:return Math.round(t*255);case Int32Array:return Math.round(t*2147483647);case Int16Array:return Math.round(t*32767);case Int8Array:return Math.round(t*127);default:throw new Error("Invalid component type.")}}const St={DEG2RAD:Da,RAD2DEG:eo,generateUUID:Ci,clamp:ln,euclideanModulo:wf,mapLinear:$S,inverseLerp:YS,lerp:Ia,damp:qS,pingpong:KS,smoothstep:ZS,smootherstep:QS,randInt:JS,randFloat:eM,randFloatSpread:tM,seededRandom:nM,degToRad:iM,radToDeg:rM,isPowerOfTwo:sM,ceilPowerOfTwo:aM,floorPowerOfTwo:oM,setQuaternionFromProperEuler:lM,normalize:at,denormalize:ti};class He{constructor(e=0,n=0){He.prototype.isVector2=!0,this.x=e,this.y=n}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,n){return this.x=e,this.y=n,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const n=this.x,i=this.y,r=e.elements;return this.x=r[0]*n+r[3]*i+r[6],this.y=r[1]*n+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(ln(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y;return n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this}rotateAround(e,n){const i=Math.cos(n),r=Math.sin(n),s=this.x-e.x,a=this.y-e.y;return this.x=s*i-a*r+e.x,this.y=s*r+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ve{constructor(e,n,i,r,s,a,o,l,c){Ve.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,a,o,l,c)}set(e,n,i,r,s,a,o,l,c){const u=this.elements;return u[0]=e,u[1]=r,u[2]=o,u[3]=n,u[4]=s,u[5]=l,u[6]=i,u[7]=a,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],this}extractBasis(e,n,i){return e.setFromMatrix3Column(this,0),n.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const n=e.elements;return this.set(n[0],n[4],n[8],n[1],n[5],n[9],n[2],n[6],n[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,r=n.elements,s=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],u=i[4],f=i[7],h=i[2],p=i[5],_=i[8],v=r[0],m=r[3],d=r[6],x=r[1],y=r[4],M=r[7],P=r[2],C=r[5],A=r[8];return s[0]=a*v+o*x+l*P,s[3]=a*m+o*y+l*C,s[6]=a*d+o*M+l*A,s[1]=c*v+u*x+f*P,s[4]=c*m+u*y+f*C,s[7]=c*d+u*M+f*A,s[2]=h*v+p*x+_*P,s[5]=h*m+p*y+_*C,s[8]=h*d+p*M+_*A,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[3]*=e,n[6]*=e,n[1]*=e,n[4]*=e,n[7]*=e,n[2]*=e,n[5]*=e,n[8]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8];return n*a*u-n*o*c-i*s*u+i*o*l+r*s*c-r*a*l}invert(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],f=u*a-o*c,h=o*l-u*s,p=c*s-a*l,_=n*f+i*h+r*p;if(_===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/_;return e[0]=f*v,e[1]=(r*c-u*i)*v,e[2]=(o*i-r*a)*v,e[3]=h*v,e[4]=(u*n-r*l)*v,e[5]=(r*s-o*n)*v,e[6]=p*v,e[7]=(i*l-c*n)*v,e[8]=(a*n-i*s)*v,this}transpose(){let e;const n=this.elements;return e=n[1],n[1]=n[3],n[3]=e,e=n[2],n[2]=n[6],n[6]=e,e=n[5],n[5]=n[7],n[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const n=this.elements;return e[0]=n[0],e[1]=n[3],e[2]=n[6],e[3]=n[1],e[4]=n[4],e[5]=n[7],e[6]=n[2],e[7]=n[5],e[8]=n[8],this}setUvTransform(e,n,i,r,s,a,o){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*a+c*o)+a+e,-r*c,r*l,-r*(-c*a+l*o)+o+n,0,0,1),this}scale(e,n){return this.premultiply(ru.makeScale(e,n)),this}rotate(e){return this.premultiply(ru.makeRotation(-e)),this}translate(e,n){return this.premultiply(ru.makeTranslation(e,n)),this}makeTranslation(e,n){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,n,0,0,1),this}makeRotation(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,i,n,0,0,0,1),this}makeScale(e,n){return this.set(e,0,0,0,n,0,0,0,1),this}equals(e){const n=this.elements,i=e.elements;for(let r=0;r<9;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<9;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const ru=new Ve;function Gv(t){for(let e=t.length-1;e>=0;--e)if(t[e]>=65535)return!0;return!1}function to(t){return document.createElementNS("http://www.w3.org/1999/xhtml",t)}function cM(){const t=to("canvas");return t.style.display="block",t}const em={};function bl(t){t in em||(em[t]=!0,console.warn(t))}function uM(t,e,n){return new Promise(function(i,r){function s(){switch(t.clientWaitSync(e,t.SYNC_FLUSH_COMMANDS_BIT,0)){case t.WAIT_FAILED:r();break;case t.TIMEOUT_EXPIRED:setTimeout(s,n);break;default:i()}}setTimeout(s,n)})}function dM(t){const e=t.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function hM(t){const e=t.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const tm=new Ve().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),nm=new Ve().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),ca={[mr]:{transfer:ec,primaries:tc,luminanceCoefficients:[.2126,.7152,.0722],toReference:t=>t,fromReference:t=>t},[en]:{transfer:_t,primaries:tc,luminanceCoefficients:[.2126,.7152,.0722],toReference:t=>t.convertSRGBToLinear(),fromReference:t=>t.convertLinearToSRGB()},[wc]:{transfer:ec,primaries:nc,luminanceCoefficients:[.2289,.6917,.0793],toReference:t=>t.applyMatrix3(nm),fromReference:t=>t.applyMatrix3(tm)},[Ef]:{transfer:_t,primaries:nc,luminanceCoefficients:[.2289,.6917,.0793],toReference:t=>t.convertSRGBToLinear().applyMatrix3(nm),fromReference:t=>t.applyMatrix3(tm).convertLinearToSRGB()}},fM=new Set([mr,wc]),it={enabled:!0,_workingColorSpace:mr,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(t){if(!fM.has(t))throw new Error(`Unsupported working color space, "${t}".`);this._workingColorSpace=t},convert:function(t,e,n){if(this.enabled===!1||e===n||!e||!n)return t;const i=ca[e].toReference,r=ca[n].fromReference;return r(i(t))},fromWorkingColorSpace:function(t,e){return this.convert(t,this._workingColorSpace,e)},toWorkingColorSpace:function(t,e){return this.convert(t,e,this._workingColorSpace)},getPrimaries:function(t){return ca[t].primaries},getTransfer:function(t){return t===$i?ec:ca[t].transfer},getLuminanceCoefficients:function(t,e=this._workingColorSpace){return t.fromArray(ca[e].luminanceCoefficients)}};function Us(t){return t<.04045?t*.0773993808:Math.pow(t*.9478672986+.0521327014,2.4)}function su(t){return t<.0031308?t*12.92:1.055*Math.pow(t,.41666)-.055}let Zr;class pM{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Zr===void 0&&(Zr=to("canvas")),Zr.width=e.width,Zr.height=e.height;const i=Zr.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=Zr}return n.width>2048||n.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),n.toDataURL("image/jpeg",.6)):n.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const n=to("canvas");n.width=e.width,n.height=e.height;const i=n.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let a=0;a<s.length;a++)s[a]=Us(s[a]/255)*255;return i.putImageData(r,0,0),n}else if(e.data){const n=e.data.slice(0);for(let i=0;i<n.length;i++)n instanceof Uint8Array||n instanceof Uint8ClampedArray?n[i]=Math.floor(Us(n[i]/255)*255):n[i]=Us(n[i]);return{data:n,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let mM=0;class Vv{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:mM++}),this.uuid=Ci(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let a=0,o=r.length;a<o;a++)r[a].isDataTexture?s.push(au(r[a].image)):s.push(au(r[a]))}else s=au(r);i.url=s}return n||(e.images[this.uuid]=i),i}}function au(t){return typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap?pM.getDataURL(t):t.data?{data:Array.from(t.data),width:t.width,height:t.height,type:t.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let gM=0;class nn extends Js{constructor(e=nn.DEFAULT_IMAGE,n=nn.DEFAULT_MAPPING,i=Ki,r=Ki,s=ei,a=Zi,o=ni,l=Di,c=nn.DEFAULT_ANISOTROPY,u=$i){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:gM++}),this.uuid=Ci(),this.name="",this.source=new Vv(e),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new He(0,0),this.repeat=new He(1,1),this.center=new He(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ve,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),n||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Rv)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Vd:e.x=e.x-Math.floor(e.x);break;case Ki:e.x=e.x<0?0:1;break;case jd:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Vd:e.y=e.y-Math.floor(e.y);break;case Ki:e.y=e.y<0?0:1;break;case jd:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}nn.DEFAULT_IMAGE=null;nn.DEFAULT_MAPPING=Rv;nn.DEFAULT_ANISOTROPY=1;class Ct{constructor(e=0,n=0,i=0,r=1){Ct.prototype.isVector4=!0,this.x=e,this.y=n,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,n,i,r){return this.x=e,this.y=n,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;case 3:this.w=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this.w=e.w+n.w,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this.w+=e.w*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this.w=e.w-n.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const n=this.x,i=this.y,r=this.z,s=this.w,a=e.elements;return this.x=a[0]*n+a[4]*i+a[8]*r+a[12]*s,this.y=a[1]*n+a[5]*i+a[9]*r+a[13]*s,this.z=a[2]*n+a[6]*i+a[10]*r+a[14]*s,this.w=a[3]*n+a[7]*i+a[11]*r+a[15]*s,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const n=Math.sqrt(1-e.w*e.w);return n<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/n,this.y=e.y/n,this.z=e.z/n),this}setAxisAngleFromRotationMatrix(e){let n,i,r,s;const l=e.elements,c=l[0],u=l[4],f=l[8],h=l[1],p=l[5],_=l[9],v=l[2],m=l[6],d=l[10];if(Math.abs(u-h)<.01&&Math.abs(f-v)<.01&&Math.abs(_-m)<.01){if(Math.abs(u+h)<.1&&Math.abs(f+v)<.1&&Math.abs(_+m)<.1&&Math.abs(c+p+d-3)<.1)return this.set(1,0,0,0),this;n=Math.PI;const y=(c+1)/2,M=(p+1)/2,P=(d+1)/2,C=(u+h)/4,A=(f+v)/4,b=(_+m)/4;return y>M&&y>P?y<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(y),r=C/i,s=A/i):M>P?M<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(M),i=C/r,s=b/r):P<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(P),i=A/s,r=b/s),this.set(i,r,s,n),this}let x=Math.sqrt((m-_)*(m-_)+(f-v)*(f-v)+(h-u)*(h-u));return Math.abs(x)<.001&&(x=1),this.x=(m-_)/x,this.y=(f-v)/x,this.z=(h-u)/x,this.w=Math.acos((c+p+d-1)/2),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this.w=n[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this.z=Math.max(e.z,Math.min(n.z,this.z)),this.w=Math.max(e.w,Math.min(n.w,this.w)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this.z=Math.max(e,Math.min(n,this.z)),this.w=Math.max(e,Math.min(n,this.w)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this.w+=(e.w-this.w)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this.w=e.w+(n.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this.w=e[n+3],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e[n+3]=this.w,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this.w=e.getW(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class _M extends Js{constructor(e=1,n=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=n,this.depth=1,this.scissor=new Ct(0,0,e,n),this.scissorTest=!1,this.viewport=new Ct(0,0,e,n);const r={width:e,height:n,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ei,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const s=new nn(r,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);s.flipY=!1,s.generateMipmaps=i.generateMipmaps,s.internalFormat=i.internalFormat,this.textures=[];const a=i.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,n,i=1){if(this.width!==e||this.height!==n||this.depth!==i){this.width=e,this.height=n,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=n,this.textures[r].image.depth=i;this.dispose()}this.viewport.set(0,0,e,n),this.scissor.set(0,0,e,n)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let i=0,r=e.textures.length;i<r;i++)this.textures[i]=e.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const n=Object.assign({},e.texture.image);return this.texture.source=new Vv(n),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class jr extends _M{constructor(e=1,n=1,i={}){super(e,n,i),this.isWebGLRenderTarget=!0}}class jv extends nn{constructor(e=null,n=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=zn,this.minFilter=zn,this.wrapR=Ki,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class vM extends nn{constructor(e=null,n=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=zn,this.minFilter=zn,this.wrapR=Ki,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class lo{constructor(e=0,n=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=n,this._z=i,this._w=r}static slerpFlat(e,n,i,r,s,a,o){let l=i[r+0],c=i[r+1],u=i[r+2],f=i[r+3];const h=s[a+0],p=s[a+1],_=s[a+2],v=s[a+3];if(o===0){e[n+0]=l,e[n+1]=c,e[n+2]=u,e[n+3]=f;return}if(o===1){e[n+0]=h,e[n+1]=p,e[n+2]=_,e[n+3]=v;return}if(f!==v||l!==h||c!==p||u!==_){let m=1-o;const d=l*h+c*p+u*_+f*v,x=d>=0?1:-1,y=1-d*d;if(y>Number.EPSILON){const P=Math.sqrt(y),C=Math.atan2(P,d*x);m=Math.sin(m*C)/P,o=Math.sin(o*C)/P}const M=o*x;if(l=l*m+h*M,c=c*m+p*M,u=u*m+_*M,f=f*m+v*M,m===1-o){const P=1/Math.sqrt(l*l+c*c+u*u+f*f);l*=P,c*=P,u*=P,f*=P}}e[n]=l,e[n+1]=c,e[n+2]=u,e[n+3]=f}static multiplyQuaternionsFlat(e,n,i,r,s,a){const o=i[r],l=i[r+1],c=i[r+2],u=i[r+3],f=s[a],h=s[a+1],p=s[a+2],_=s[a+3];return e[n]=o*_+u*f+l*p-c*h,e[n+1]=l*_+u*h+c*f-o*p,e[n+2]=c*_+u*p+o*h-l*f,e[n+3]=u*_-o*f-l*h-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,n,i,r){return this._x=e,this._y=n,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,n=!0){const i=e._x,r=e._y,s=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(i/2),u=o(r/2),f=o(s/2),h=l(i/2),p=l(r/2),_=l(s/2);switch(a){case"XYZ":this._x=h*u*f+c*p*_,this._y=c*p*f-h*u*_,this._z=c*u*_+h*p*f,this._w=c*u*f-h*p*_;break;case"YXZ":this._x=h*u*f+c*p*_,this._y=c*p*f-h*u*_,this._z=c*u*_-h*p*f,this._w=c*u*f+h*p*_;break;case"ZXY":this._x=h*u*f-c*p*_,this._y=c*p*f+h*u*_,this._z=c*u*_+h*p*f,this._w=c*u*f-h*p*_;break;case"ZYX":this._x=h*u*f-c*p*_,this._y=c*p*f+h*u*_,this._z=c*u*_-h*p*f,this._w=c*u*f+h*p*_;break;case"YZX":this._x=h*u*f+c*p*_,this._y=c*p*f+h*u*_,this._z=c*u*_-h*p*f,this._w=c*u*f-h*p*_;break;case"XZY":this._x=h*u*f-c*p*_,this._y=c*p*f-h*u*_,this._z=c*u*_+h*p*f,this._w=c*u*f+h*p*_;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return n===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,n){const i=n/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const n=e.elements,i=n[0],r=n[4],s=n[8],a=n[1],o=n[5],l=n[9],c=n[2],u=n[6],f=n[10],h=i+o+f;if(h>0){const p=.5/Math.sqrt(h+1);this._w=.25/p,this._x=(u-l)*p,this._y=(s-c)*p,this._z=(a-r)*p}else if(i>o&&i>f){const p=2*Math.sqrt(1+i-o-f);this._w=(u-l)/p,this._x=.25*p,this._y=(r+a)/p,this._z=(s+c)/p}else if(o>f){const p=2*Math.sqrt(1+o-i-f);this._w=(s-c)/p,this._x=(r+a)/p,this._y=.25*p,this._z=(l+u)/p}else{const p=2*Math.sqrt(1+f-i-o);this._w=(a-r)/p,this._x=(s+c)/p,this._y=(l+u)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,n){let i=e.dot(n)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*n.z-e.z*n.y,this._y=e.z*n.x-e.x*n.z,this._z=e.x*n.y-e.y*n.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(ln(this.dot(e),-1,1)))}rotateTowards(e,n){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,n/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,n){const i=e._x,r=e._y,s=e._z,a=e._w,o=n._x,l=n._y,c=n._z,u=n._w;return this._x=i*u+a*o+r*c-s*l,this._y=r*u+a*l+s*o-i*c,this._z=s*u+a*c+i*l-r*o,this._w=a*u-i*o-r*l-s*c,this._onChangeCallback(),this}slerp(e,n){if(n===0)return this;if(n===1)return this.copy(e);const i=this._x,r=this._y,s=this._z,a=this._w;let o=a*e._w+i*e._x+r*e._y+s*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=i,this._y=r,this._z=s,this;const l=1-o*o;if(l<=Number.EPSILON){const p=1-n;return this._w=p*a+n*this._w,this._x=p*i+n*this._x,this._y=p*r+n*this._y,this._z=p*s+n*this._z,this.normalize(),this}const c=Math.sqrt(l),u=Math.atan2(c,o),f=Math.sin((1-n)*u)/c,h=Math.sin(n*u)/c;return this._w=a*f+this._w*h,this._x=i*f+this._x*h,this._y=r*f+this._y*h,this._z=s*f+this._z*h,this._onChangeCallback(),this}slerpQuaternions(e,n,i){return this.copy(e).slerp(n,i)}random(){const e=2*Math.PI*Math.random(),n=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(n),s*Math.cos(n))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,n=0){return this._x=e[n],this._y=e[n+1],this._z=e[n+2],this._w=e[n+3],this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._w,e}fromBufferAttribute(e,n){return this._x=e.getX(n),this._y=e.getY(n),this._z=e.getZ(n),this._w=e.getW(n),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class L{constructor(e=0,n=0,i=0){L.prototype.isVector3=!0,this.x=e,this.y=n,this.z=i}set(e,n,i){return i===void 0&&(i=this.z),this.x=e,this.y=n,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,n){return this.x=e.x*n.x,this.y=e.y*n.y,this.z=e.z*n.z,this}applyEuler(e){return this.applyQuaternion(im.setFromEuler(e))}applyAxisAngle(e,n){return this.applyQuaternion(im.setFromAxisAngle(e,n))}applyMatrix3(e){const n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[3]*i+s[6]*r,this.y=s[1]*n+s[4]*i+s[7]*r,this.z=s[2]*n+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const n=this.x,i=this.y,r=this.z,s=e.elements,a=1/(s[3]*n+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*n+s[4]*i+s[8]*r+s[12])*a,this.y=(s[1]*n+s[5]*i+s[9]*r+s[13])*a,this.z=(s[2]*n+s[6]*i+s[10]*r+s[14])*a,this}applyQuaternion(e){const n=this.x,i=this.y,r=this.z,s=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*r-o*i),u=2*(o*n-s*r),f=2*(s*i-a*n);return this.x=n+l*c+a*f-o*u,this.y=i+l*u+o*c-s*f,this.z=r+l*f+s*u-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[4]*i+s[8]*r,this.y=s[1]*n+s[5]*i+s[9]*r,this.z=s[2]*n+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this.z=Math.max(e.z,Math.min(n.z,this.z)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this.z=Math.max(e,Math.min(n,this.z)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,n){const i=e.x,r=e.y,s=e.z,a=n.x,o=n.y,l=n.z;return this.x=r*l-s*o,this.y=s*a-i*l,this.z=i*o-r*a,this}projectOnVector(e){const n=e.lengthSq();if(n===0)return this.set(0,0,0);const i=e.dot(this)/n;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return ou.copy(this).projectOnVector(e),this.sub(ou)}reflect(e){return this.sub(ou.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(ln(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return n*n+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,n,i){const r=Math.sin(n)*e;return this.x=r*Math.sin(i),this.y=Math.cos(n)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,n,i){return this.x=e*Math.sin(n),this.y=i,this.z=e*Math.cos(n),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this}setFromMatrixScale(e){const n=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=n,this.y=i,this.z=r,this}setFromMatrixColumn(e,n){return this.fromArray(e.elements,n*4)}setFromMatrix3Column(e,n){return this.fromArray(e.elements,n*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,n=Math.random()*2-1,i=Math.sqrt(1-n*n);return this.x=i*Math.cos(e),this.y=n,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const ou=new L,im=new lo;class co{constructor(e=new L(1/0,1/0,1/0),n=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=n}set(e,n){return this.min.copy(e),this.max.copy(n),this}setFromArray(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n+=3)this.expandByPoint($n.fromArray(e,n));return this}setFromBufferAttribute(e){this.makeEmpty();for(let n=0,i=e.count;n<i;n++)this.expandByPoint($n.fromBufferAttribute(e,n));return this}setFromPoints(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n++)this.expandByPoint(e[n]);return this}setFromCenterAndSize(e,n){const i=$n.copy(n).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,n=!1){return this.makeEmpty(),this.expandByObject(e,n)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,n=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(n===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,$n):$n.fromBufferAttribute(s,a),$n.applyMatrix4(e.matrixWorld),this.expandByPoint($n);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Do.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Do.copy(i.boundingBox)),Do.applyMatrix4(e.matrixWorld),this.union(Do)}const r=e.children;for(let s=0,a=r.length;s<a;s++)this.expandByObject(r[s],n);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,n){return n.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,$n),$n.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let n,i;return e.normal.x>0?(n=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(n=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(n+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(n+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(n+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(n+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),n<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ua),Io.subVectors(this.max,ua),Qr.subVectors(e.a,ua),Jr.subVectors(e.b,ua),es.subVectors(e.c,ua),Fi.subVectors(Jr,Qr),Oi.subVectors(es,Jr),vr.subVectors(Qr,es);let n=[0,-Fi.z,Fi.y,0,-Oi.z,Oi.y,0,-vr.z,vr.y,Fi.z,0,-Fi.x,Oi.z,0,-Oi.x,vr.z,0,-vr.x,-Fi.y,Fi.x,0,-Oi.y,Oi.x,0,-vr.y,vr.x,0];return!lu(n,Qr,Jr,es,Io)||(n=[1,0,0,0,1,0,0,0,1],!lu(n,Qr,Jr,es,Io))?!1:(Uo.crossVectors(Fi,Oi),n=[Uo.x,Uo.y,Uo.z],lu(n,Qr,Jr,es,Io))}clampPoint(e,n){return n.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,$n).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize($n).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(mi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),mi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),mi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),mi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),mi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),mi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),mi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),mi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(mi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const mi=[new L,new L,new L,new L,new L,new L,new L,new L],$n=new L,Do=new co,Qr=new L,Jr=new L,es=new L,Fi=new L,Oi=new L,vr=new L,ua=new L,Io=new L,Uo=new L,xr=new L;function lu(t,e,n,i,r){for(let s=0,a=t.length-3;s<=a;s+=3){xr.fromArray(t,s);const o=r.x*Math.abs(xr.x)+r.y*Math.abs(xr.y)+r.z*Math.abs(xr.z),l=e.dot(xr),c=n.dot(xr),u=i.dot(xr);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>o)return!1}return!0}const xM=new co,da=new L,cu=new L;class uo{constructor(e=new L,n=-1){this.isSphere=!0,this.center=e,this.radius=n}set(e,n){return this.center.copy(e),this.radius=n,this}setFromPoints(e,n){const i=this.center;n!==void 0?i.copy(n):xM.setFromPoints(e).getCenter(i);let r=0;for(let s=0,a=e.length;s<a;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const n=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=n*n}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,n){const i=this.center.distanceToSquared(e);return n.copy(e),i>this.radius*this.radius&&(n.sub(this.center).normalize(),n.multiplyScalar(this.radius).add(this.center)),n}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;da.subVectors(e,this.center);const n=da.lengthSq();if(n>this.radius*this.radius){const i=Math.sqrt(n),r=(i-this.radius)*.5;this.center.addScaledVector(da,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(cu.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(da.copy(e.center).add(cu)),this.expandByPoint(da.copy(e.center).sub(cu))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const gi=new L,uu=new L,ko=new L,zi=new L,du=new L,Fo=new L,hu=new L;class Tc{constructor(e=new L,n=new L(0,0,-1)){this.origin=e,this.direction=n}set(e,n){return this.origin.copy(e),this.direction.copy(n),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,n){return n.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,gi)),this}closestPointToPoint(e,n){n.subVectors(e,this.origin);const i=n.dot(this.direction);return i<0?n.copy(this.origin):n.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const n=gi.subVectors(e,this.origin).dot(this.direction);return n<0?this.origin.distanceToSquared(e):(gi.copy(this.origin).addScaledVector(this.direction,n),gi.distanceToSquared(e))}distanceSqToSegment(e,n,i,r){uu.copy(e).add(n).multiplyScalar(.5),ko.copy(n).sub(e).normalize(),zi.copy(this.origin).sub(uu);const s=e.distanceTo(n)*.5,a=-this.direction.dot(ko),o=zi.dot(this.direction),l=-zi.dot(ko),c=zi.lengthSq(),u=Math.abs(1-a*a);let f,h,p,_;if(u>0)if(f=a*l-o,h=a*o-l,_=s*u,f>=0)if(h>=-_)if(h<=_){const v=1/u;f*=v,h*=v,p=f*(f+a*h+2*o)+h*(a*f+h+2*l)+c}else h=s,f=Math.max(0,-(a*h+o)),p=-f*f+h*(h+2*l)+c;else h=-s,f=Math.max(0,-(a*h+o)),p=-f*f+h*(h+2*l)+c;else h<=-_?(f=Math.max(0,-(-a*s+o)),h=f>0?-s:Math.min(Math.max(-s,-l),s),p=-f*f+h*(h+2*l)+c):h<=_?(f=0,h=Math.min(Math.max(-s,-l),s),p=h*(h+2*l)+c):(f=Math.max(0,-(a*s+o)),h=f>0?s:Math.min(Math.max(-s,-l),s),p=-f*f+h*(h+2*l)+c);else h=a>0?-s:s,f=Math.max(0,-(a*h+o)),p=-f*f+h*(h+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,f),r&&r.copy(uu).addScaledVector(ko,h),p}intersectSphere(e,n){gi.subVectors(e.center,this.origin);const i=gi.dot(this.direction),r=gi.dot(gi)-i*i,s=e.radius*e.radius;if(r>s)return null;const a=Math.sqrt(s-r),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,n):this.at(o,n)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const n=e.normal.dot(this.direction);if(n===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/n;return i>=0?i:null}intersectPlane(e,n){const i=this.distanceToPlane(e);return i===null?null:this.at(i,n)}intersectsPlane(e){const n=e.distanceToPoint(this.origin);return n===0||e.normal.dot(this.direction)*n<0}intersectBox(e,n){let i,r,s,a,o,l;const c=1/this.direction.x,u=1/this.direction.y,f=1/this.direction.z,h=this.origin;return c>=0?(i=(e.min.x-h.x)*c,r=(e.max.x-h.x)*c):(i=(e.max.x-h.x)*c,r=(e.min.x-h.x)*c),u>=0?(s=(e.min.y-h.y)*u,a=(e.max.y-h.y)*u):(s=(e.max.y-h.y)*u,a=(e.min.y-h.y)*u),i>a||s>r||((s>i||isNaN(i))&&(i=s),(a<r||isNaN(r))&&(r=a),f>=0?(o=(e.min.z-h.z)*f,l=(e.max.z-h.z)*f):(o=(e.max.z-h.z)*f,l=(e.min.z-h.z)*f),i>l||o>r)||((o>i||i!==i)&&(i=o),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,n)}intersectsBox(e){return this.intersectBox(e,gi)!==null}intersectTriangle(e,n,i,r,s){du.subVectors(n,e),Fo.subVectors(i,e),hu.crossVectors(du,Fo);let a=this.direction.dot(hu),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;zi.subVectors(this.origin,e);const l=o*this.direction.dot(Fo.crossVectors(zi,Fo));if(l<0)return null;const c=o*this.direction.dot(du.cross(zi));if(c<0||l+c>a)return null;const u=-o*zi.dot(hu);return u<0?null:this.at(u/a,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ht{constructor(e,n,i,r,s,a,o,l,c,u,f,h,p,_,v,m){ht.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,a,o,l,c,u,f,h,p,_,v,m)}set(e,n,i,r,s,a,o,l,c,u,f,h,p,_,v,m){const d=this.elements;return d[0]=e,d[4]=n,d[8]=i,d[12]=r,d[1]=s,d[5]=a,d[9]=o,d[13]=l,d[2]=c,d[6]=u,d[10]=f,d[14]=h,d[3]=p,d[7]=_,d[11]=v,d[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ht().fromArray(this.elements)}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],n[9]=i[9],n[10]=i[10],n[11]=i[11],n[12]=i[12],n[13]=i[13],n[14]=i[14],n[15]=i[15],this}copyPosition(e){const n=this.elements,i=e.elements;return n[12]=i[12],n[13]=i[13],n[14]=i[14],this}setFromMatrix3(e){const n=e.elements;return this.set(n[0],n[3],n[6],0,n[1],n[4],n[7],0,n[2],n[5],n[8],0,0,0,0,1),this}extractBasis(e,n,i){return e.setFromMatrixColumn(this,0),n.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,n,i){return this.set(e.x,n.x,i.x,0,e.y,n.y,i.y,0,e.z,n.z,i.z,0,0,0,0,1),this}extractRotation(e){const n=this.elements,i=e.elements,r=1/ts.setFromMatrixColumn(e,0).length(),s=1/ts.setFromMatrixColumn(e,1).length(),a=1/ts.setFromMatrixColumn(e,2).length();return n[0]=i[0]*r,n[1]=i[1]*r,n[2]=i[2]*r,n[3]=0,n[4]=i[4]*s,n[5]=i[5]*s,n[6]=i[6]*s,n[7]=0,n[8]=i[8]*a,n[9]=i[9]*a,n[10]=i[10]*a,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromEuler(e){const n=this.elements,i=e.x,r=e.y,s=e.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(r),c=Math.sin(r),u=Math.cos(s),f=Math.sin(s);if(e.order==="XYZ"){const h=a*u,p=a*f,_=o*u,v=o*f;n[0]=l*u,n[4]=-l*f,n[8]=c,n[1]=p+_*c,n[5]=h-v*c,n[9]=-o*l,n[2]=v-h*c,n[6]=_+p*c,n[10]=a*l}else if(e.order==="YXZ"){const h=l*u,p=l*f,_=c*u,v=c*f;n[0]=h+v*o,n[4]=_*o-p,n[8]=a*c,n[1]=a*f,n[5]=a*u,n[9]=-o,n[2]=p*o-_,n[6]=v+h*o,n[10]=a*l}else if(e.order==="ZXY"){const h=l*u,p=l*f,_=c*u,v=c*f;n[0]=h-v*o,n[4]=-a*f,n[8]=_+p*o,n[1]=p+_*o,n[5]=a*u,n[9]=v-h*o,n[2]=-a*c,n[6]=o,n[10]=a*l}else if(e.order==="ZYX"){const h=a*u,p=a*f,_=o*u,v=o*f;n[0]=l*u,n[4]=_*c-p,n[8]=h*c+v,n[1]=l*f,n[5]=v*c+h,n[9]=p*c-_,n[2]=-c,n[6]=o*l,n[10]=a*l}else if(e.order==="YZX"){const h=a*l,p=a*c,_=o*l,v=o*c;n[0]=l*u,n[4]=v-h*f,n[8]=_*f+p,n[1]=f,n[5]=a*u,n[9]=-o*u,n[2]=-c*u,n[6]=p*f+_,n[10]=h-v*f}else if(e.order==="XZY"){const h=a*l,p=a*c,_=o*l,v=o*c;n[0]=l*u,n[4]=-f,n[8]=c*u,n[1]=h*f+v,n[5]=a*u,n[9]=p*f-_,n[2]=_*f-p,n[6]=o*u,n[10]=v*f+h}return n[3]=0,n[7]=0,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromQuaternion(e){return this.compose(yM,e,SM)}lookAt(e,n,i){const r=this.elements;return Sn.subVectors(e,n),Sn.lengthSq()===0&&(Sn.z=1),Sn.normalize(),Bi.crossVectors(i,Sn),Bi.lengthSq()===0&&(Math.abs(i.z)===1?Sn.x+=1e-4:Sn.z+=1e-4,Sn.normalize(),Bi.crossVectors(i,Sn)),Bi.normalize(),Oo.crossVectors(Sn,Bi),r[0]=Bi.x,r[4]=Oo.x,r[8]=Sn.x,r[1]=Bi.y,r[5]=Oo.y,r[9]=Sn.y,r[2]=Bi.z,r[6]=Oo.z,r[10]=Sn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,r=n.elements,s=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],u=i[1],f=i[5],h=i[9],p=i[13],_=i[2],v=i[6],m=i[10],d=i[14],x=i[3],y=i[7],M=i[11],P=i[15],C=r[0],A=r[4],b=r[8],z=r[12],S=r[1],w=r[5],N=r[9],k=r[13],j=r[2],q=r[6],W=r[10],ie=r[14],I=r[3],ee=r[7],ne=r[11],le=r[15];return s[0]=a*C+o*S+l*j+c*I,s[4]=a*A+o*w+l*q+c*ee,s[8]=a*b+o*N+l*W+c*ne,s[12]=a*z+o*k+l*ie+c*le,s[1]=u*C+f*S+h*j+p*I,s[5]=u*A+f*w+h*q+p*ee,s[9]=u*b+f*N+h*W+p*ne,s[13]=u*z+f*k+h*ie+p*le,s[2]=_*C+v*S+m*j+d*I,s[6]=_*A+v*w+m*q+d*ee,s[10]=_*b+v*N+m*W+d*ne,s[14]=_*z+v*k+m*ie+d*le,s[3]=x*C+y*S+M*j+P*I,s[7]=x*A+y*w+M*q+P*ee,s[11]=x*b+y*N+M*W+P*ne,s[15]=x*z+y*k+M*ie+P*le,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[4]*=e,n[8]*=e,n[12]*=e,n[1]*=e,n[5]*=e,n[9]*=e,n[13]*=e,n[2]*=e,n[6]*=e,n[10]*=e,n[14]*=e,n[3]*=e,n[7]*=e,n[11]*=e,n[15]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[4],r=e[8],s=e[12],a=e[1],o=e[5],l=e[9],c=e[13],u=e[2],f=e[6],h=e[10],p=e[14],_=e[3],v=e[7],m=e[11],d=e[15];return _*(+s*l*f-r*c*f-s*o*h+i*c*h+r*o*p-i*l*p)+v*(+n*l*p-n*c*h+s*a*h-r*a*p+r*c*u-s*l*u)+m*(+n*c*f-n*o*p-s*a*f+i*a*p+s*o*u-i*c*u)+d*(-r*o*u-n*l*f+n*o*h+r*a*f-i*a*h+i*l*u)}transpose(){const e=this.elements;let n;return n=e[1],e[1]=e[4],e[4]=n,n=e[2],e[2]=e[8],e[8]=n,n=e[6],e[6]=e[9],e[9]=n,n=e[3],e[3]=e[12],e[12]=n,n=e[7],e[7]=e[13],e[13]=n,n=e[11],e[11]=e[14],e[14]=n,this}setPosition(e,n,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=n,r[14]=i),this}invert(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],f=e[9],h=e[10],p=e[11],_=e[12],v=e[13],m=e[14],d=e[15],x=f*m*c-v*h*c+v*l*p-o*m*p-f*l*d+o*h*d,y=_*h*c-u*m*c-_*l*p+a*m*p+u*l*d-a*h*d,M=u*v*c-_*f*c+_*o*p-a*v*p-u*o*d+a*f*d,P=_*f*l-u*v*l-_*o*h+a*v*h+u*o*m-a*f*m,C=n*x+i*y+r*M+s*P;if(C===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/C;return e[0]=x*A,e[1]=(v*h*s-f*m*s-v*r*p+i*m*p+f*r*d-i*h*d)*A,e[2]=(o*m*s-v*l*s+v*r*c-i*m*c-o*r*d+i*l*d)*A,e[3]=(f*l*s-o*h*s-f*r*c+i*h*c+o*r*p-i*l*p)*A,e[4]=y*A,e[5]=(u*m*s-_*h*s+_*r*p-n*m*p-u*r*d+n*h*d)*A,e[6]=(_*l*s-a*m*s-_*r*c+n*m*c+a*r*d-n*l*d)*A,e[7]=(a*h*s-u*l*s+u*r*c-n*h*c-a*r*p+n*l*p)*A,e[8]=M*A,e[9]=(_*f*s-u*v*s-_*i*p+n*v*p+u*i*d-n*f*d)*A,e[10]=(a*v*s-_*o*s+_*i*c-n*v*c-a*i*d+n*o*d)*A,e[11]=(u*o*s-a*f*s-u*i*c+n*f*c+a*i*p-n*o*p)*A,e[12]=P*A,e[13]=(u*v*r-_*f*r+_*i*h-n*v*h-u*i*m+n*f*m)*A,e[14]=(_*o*r-a*v*r-_*i*l+n*v*l+a*i*m-n*o*m)*A,e[15]=(a*f*r-u*o*r+u*i*l-n*f*l-a*i*h+n*o*h)*A,this}scale(e){const n=this.elements,i=e.x,r=e.y,s=e.z;return n[0]*=i,n[4]*=r,n[8]*=s,n[1]*=i,n[5]*=r,n[9]*=s,n[2]*=i,n[6]*=r,n[10]*=s,n[3]*=i,n[7]*=r,n[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,n=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(n,i,r))}makeTranslation(e,n,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,n,0,0,1,i,0,0,0,1),this}makeRotationX(e){const n=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,n,-i,0,0,i,n,0,0,0,0,1),this}makeRotationY(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,0,i,0,0,1,0,0,-i,0,n,0,0,0,0,1),this}makeRotationZ(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,0,i,n,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,n){const i=Math.cos(n),r=Math.sin(n),s=1-i,a=e.x,o=e.y,l=e.z,c=s*a,u=s*o;return this.set(c*a+i,c*o-r*l,c*l+r*o,0,c*o+r*l,u*o+i,u*l-r*a,0,c*l-r*o,u*l+r*a,s*l*l+i,0,0,0,0,1),this}makeScale(e,n,i){return this.set(e,0,0,0,0,n,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,n,i,r,s,a){return this.set(1,i,s,0,e,1,a,0,n,r,1,0,0,0,0,1),this}compose(e,n,i){const r=this.elements,s=n._x,a=n._y,o=n._z,l=n._w,c=s+s,u=a+a,f=o+o,h=s*c,p=s*u,_=s*f,v=a*u,m=a*f,d=o*f,x=l*c,y=l*u,M=l*f,P=i.x,C=i.y,A=i.z;return r[0]=(1-(v+d))*P,r[1]=(p+M)*P,r[2]=(_-y)*P,r[3]=0,r[4]=(p-M)*C,r[5]=(1-(h+d))*C,r[6]=(m+x)*C,r[7]=0,r[8]=(_+y)*A,r[9]=(m-x)*A,r[10]=(1-(h+v))*A,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,n,i){const r=this.elements;let s=ts.set(r[0],r[1],r[2]).length();const a=ts.set(r[4],r[5],r[6]).length(),o=ts.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],Yn.copy(this);const c=1/s,u=1/a,f=1/o;return Yn.elements[0]*=c,Yn.elements[1]*=c,Yn.elements[2]*=c,Yn.elements[4]*=u,Yn.elements[5]*=u,Yn.elements[6]*=u,Yn.elements[8]*=f,Yn.elements[9]*=f,Yn.elements[10]*=f,n.setFromRotationMatrix(Yn),i.x=s,i.y=a,i.z=o,this}makePerspective(e,n,i,r,s,a,o=Ai){const l=this.elements,c=2*s/(n-e),u=2*s/(i-r),f=(n+e)/(n-e),h=(i+r)/(i-r);let p,_;if(o===Ai)p=-(a+s)/(a-s),_=-2*a*s/(a-s);else if(o===ic)p=-a/(a-s),_=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=u,l[9]=h,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=_,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,n,i,r,s,a,o=Ai){const l=this.elements,c=1/(n-e),u=1/(i-r),f=1/(a-s),h=(n+e)*c,p=(i+r)*u;let _,v;if(o===Ai)_=(a+s)*f,v=-2*f;else if(o===ic)_=s*f,v=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-h,l[1]=0,l[5]=2*u,l[9]=0,l[13]=-p,l[2]=0,l[6]=0,l[10]=v,l[14]=-_,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const n=this.elements,i=e.elements;for(let r=0;r<16;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<16;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e[n+9]=i[9],e[n+10]=i[10],e[n+11]=i[11],e[n+12]=i[12],e[n+13]=i[13],e[n+14]=i[14],e[n+15]=i[15],e}}const ts=new L,Yn=new ht,yM=new L(0,0,0),SM=new L(1,1,1),Bi=new L,Oo=new L,Sn=new L,rm=new ht,sm=new lo;class pi{constructor(e=0,n=0,i=0,r=pi.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=n,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,n,i,r=this._order){return this._x=e,this._y=n,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,n=this._order,i=!0){const r=e.elements,s=r[0],a=r[4],o=r[8],l=r[1],c=r[5],u=r[9],f=r[2],h=r[6],p=r[10];switch(n){case"XYZ":this._y=Math.asin(ln(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,p),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-ln(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,s),this._z=0);break;case"ZXY":this._x=Math.asin(ln(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-f,p),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-ln(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(h,p),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(ln(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-f,s)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-ln(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-u,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+n)}return this._order=n,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,n,i){return rm.makeRotationFromQuaternion(e),this.setFromRotationMatrix(rm,n,i)}setFromVector3(e,n=this._order){return this.set(e.x,e.y,e.z,n)}reorder(e){return sm.setFromEuler(this),this.setFromQuaternion(sm,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}pi.DEFAULT_ORDER="XYZ";class Tf{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let MM=0;const am=new L,ns=new lo,_i=new ht,zo=new L,ha=new L,EM=new L,wM=new lo,om=new L(1,0,0),lm=new L(0,1,0),cm=new L(0,0,1),um={type:"added"},TM={type:"removed"},is={type:"childadded",child:null},fu={type:"childremoved",child:null};class Dt extends Js{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:MM++}),this.uuid=Ci(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Dt.DEFAULT_UP.clone();const e=new L,n=new pi,i=new lo,r=new L(1,1,1);function s(){i.setFromEuler(n,!1)}function a(){n.setFromQuaternion(i,void 0,!1)}n._onChange(s),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new ht},normalMatrix:{value:new Ve}}),this.matrix=new ht,this.matrixWorld=new ht,this.matrixAutoUpdate=Dt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Dt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Tf,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,n){this.quaternion.setFromAxisAngle(e,n)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,n){return ns.setFromAxisAngle(e,n),this.quaternion.multiply(ns),this}rotateOnWorldAxis(e,n){return ns.setFromAxisAngle(e,n),this.quaternion.premultiply(ns),this}rotateX(e){return this.rotateOnAxis(om,e)}rotateY(e){return this.rotateOnAxis(lm,e)}rotateZ(e){return this.rotateOnAxis(cm,e)}translateOnAxis(e,n){return am.copy(e).applyQuaternion(this.quaternion),this.position.add(am.multiplyScalar(n)),this}translateX(e){return this.translateOnAxis(om,e)}translateY(e){return this.translateOnAxis(lm,e)}translateZ(e){return this.translateOnAxis(cm,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(_i.copy(this.matrixWorld).invert())}lookAt(e,n,i){e.isVector3?zo.copy(e):zo.set(e,n,i);const r=this.parent;this.updateWorldMatrix(!0,!1),ha.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?_i.lookAt(ha,zo,this.up):_i.lookAt(zo,ha,this.up),this.quaternion.setFromRotationMatrix(_i),r&&(_i.extractRotation(r.matrixWorld),ns.setFromRotationMatrix(_i),this.quaternion.premultiply(ns.invert()))}add(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.add(arguments[n]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(um),is.child=e,this.dispatchEvent(is),is.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const n=this.children.indexOf(e);return n!==-1&&(e.parent=null,this.children.splice(n,1),e.dispatchEvent(TM),fu.child=e,this.dispatchEvent(fu),fu.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),_i.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),_i.multiply(e.parent.matrixWorld)),e.applyMatrix4(_i),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(um),is.child=e,this.dispatchEvent(is),is.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,n){if(this[e]===n)return this;for(let i=0,r=this.children.length;i<r;i++){const a=this.children[i].getObjectByProperty(e,n);if(a!==void 0)return a}}getObjectsByProperty(e,n,i=[]){this[e]===n&&i.push(this);const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].getObjectsByProperty(e,n,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ha,e,EM),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ha,wM,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const n=this.matrixWorld.elements;return e.set(n[8],n[9],n[10]).normalize()}raycast(){}traverse(e){e(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverseVisible(e)}traverseAncestors(e){const n=this.parent;n!==null&&(e(n),n.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].updateMatrixWorld(e)}updateWorldMatrix(e,n){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),n===!0){const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){const n=e===void 0||typeof e=="string",i={};n&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const f=l[c];s(e.shapes,f)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(s(e.materials,this.material[l]));r.material=o}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];r.animations.push(s(e.animations,l))}}if(n){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),u=a(e.images),f=a(e.shapes),h=a(e.skeletons),p=a(e.animations),_=a(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),u.length>0&&(i.images=u),f.length>0&&(i.shapes=f),h.length>0&&(i.skeletons=h),p.length>0&&(i.animations=p),_.length>0&&(i.nodes=_)}return i.object=r,i;function a(o){const l=[];for(const c in o){const u=o[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,n=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),n===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}Dt.DEFAULT_UP=new L(0,1,0);Dt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Dt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const qn=new L,vi=new L,pu=new L,xi=new L,rs=new L,ss=new L,dm=new L,mu=new L,gu=new L,_u=new L,vu=new Ct,xu=new Ct,yu=new Ct;class kn{constructor(e=new L,n=new L,i=new L){this.a=e,this.b=n,this.c=i}static getNormal(e,n,i,r){r.subVectors(i,n),qn.subVectors(e,n),r.cross(qn);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,n,i,r,s){qn.subVectors(r,n),vi.subVectors(i,n),pu.subVectors(e,n);const a=qn.dot(qn),o=qn.dot(vi),l=qn.dot(pu),c=vi.dot(vi),u=vi.dot(pu),f=a*c-o*o;if(f===0)return s.set(0,0,0),null;const h=1/f,p=(c*l-o*u)*h,_=(a*u-o*l)*h;return s.set(1-p-_,_,p)}static containsPoint(e,n,i,r){return this.getBarycoord(e,n,i,r,xi)===null?!1:xi.x>=0&&xi.y>=0&&xi.x+xi.y<=1}static getInterpolation(e,n,i,r,s,a,o,l){return this.getBarycoord(e,n,i,r,xi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,xi.x),l.addScaledVector(a,xi.y),l.addScaledVector(o,xi.z),l)}static getInterpolatedAttribute(e,n,i,r,s,a){return vu.setScalar(0),xu.setScalar(0),yu.setScalar(0),vu.fromBufferAttribute(e,n),xu.fromBufferAttribute(e,i),yu.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(vu,s.x),a.addScaledVector(xu,s.y),a.addScaledVector(yu,s.z),a}static isFrontFacing(e,n,i,r){return qn.subVectors(i,n),vi.subVectors(e,n),qn.cross(vi).dot(r)<0}set(e,n,i){return this.a.copy(e),this.b.copy(n),this.c.copy(i),this}setFromPointsAndIndices(e,n,i,r){return this.a.copy(e[n]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,n,i,r){return this.a.fromBufferAttribute(e,n),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return qn.subVectors(this.c,this.b),vi.subVectors(this.a,this.b),qn.cross(vi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return kn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,n){return kn.getBarycoord(e,this.a,this.b,this.c,n)}getInterpolation(e,n,i,r,s){return kn.getInterpolation(e,this.a,this.b,this.c,n,i,r,s)}containsPoint(e){return kn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return kn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,n){const i=this.a,r=this.b,s=this.c;let a,o;rs.subVectors(r,i),ss.subVectors(s,i),mu.subVectors(e,i);const l=rs.dot(mu),c=ss.dot(mu);if(l<=0&&c<=0)return n.copy(i);gu.subVectors(e,r);const u=rs.dot(gu),f=ss.dot(gu);if(u>=0&&f<=u)return n.copy(r);const h=l*f-u*c;if(h<=0&&l>=0&&u<=0)return a=l/(l-u),n.copy(i).addScaledVector(rs,a);_u.subVectors(e,s);const p=rs.dot(_u),_=ss.dot(_u);if(_>=0&&p<=_)return n.copy(s);const v=p*c-l*_;if(v<=0&&c>=0&&_<=0)return o=c/(c-_),n.copy(i).addScaledVector(ss,o);const m=u*_-p*f;if(m<=0&&f-u>=0&&p-_>=0)return dm.subVectors(s,r),o=(f-u)/(f-u+(p-_)),n.copy(r).addScaledVector(dm,o);const d=1/(m+v+h);return a=v*d,o=h*d,n.copy(i).addScaledVector(rs,a).addScaledVector(ss,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Wv={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Hi={h:0,s:0,l:0},Bo={h:0,s:0,l:0};function Su(t,e,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?t+(e-t)*6*n:n<1/2?e:n<2/3?t+(e-t)*6*(2/3-n):t}class Ce{constructor(e,n,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,n,i)}set(e,n,i){if(n===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,n,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,n=en){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,it.toWorkingColorSpace(this,n),this}setRGB(e,n,i,r=it.workingColorSpace){return this.r=e,this.g=n,this.b=i,it.toWorkingColorSpace(this,r),this}setHSL(e,n,i,r=it.workingColorSpace){if(e=wf(e,1),n=ln(n,0,1),i=ln(i,0,1),n===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+n):i+n-i*n,a=2*i-s;this.r=Su(a,s,e+1/3),this.g=Su(a,s,e),this.b=Su(a,s,e-1/3)}return it.toWorkingColorSpace(this,r),this}setStyle(e,n=en){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const a=r[1],o=r[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,n);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,n);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,n);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,n);if(a===6)return this.setHex(parseInt(s,16),n);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,n);return this}setColorName(e,n=en){const i=Wv[e.toLowerCase()];return i!==void 0?this.setHex(i,n):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Us(e.r),this.g=Us(e.g),this.b=Us(e.b),this}copyLinearToSRGB(e){return this.r=su(e.r),this.g=su(e.g),this.b=su(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=en){return it.fromWorkingColorSpace(Jt.copy(this),e),Math.round(ln(Jt.r*255,0,255))*65536+Math.round(ln(Jt.g*255,0,255))*256+Math.round(ln(Jt.b*255,0,255))}getHexString(e=en){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,n=it.workingColorSpace){it.fromWorkingColorSpace(Jt.copy(this),n);const i=Jt.r,r=Jt.g,s=Jt.b,a=Math.max(i,r,s),o=Math.min(i,r,s);let l,c;const u=(o+a)/2;if(o===a)l=0,c=0;else{const f=a-o;switch(c=u<=.5?f/(a+o):f/(2-a-o),a){case i:l=(r-s)/f+(r<s?6:0);break;case r:l=(s-i)/f+2;break;case s:l=(i-r)/f+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,n=it.workingColorSpace){return it.fromWorkingColorSpace(Jt.copy(this),n),e.r=Jt.r,e.g=Jt.g,e.b=Jt.b,e}getStyle(e=en){it.fromWorkingColorSpace(Jt.copy(this),e);const n=Jt.r,i=Jt.g,r=Jt.b;return e!==en?`color(${e} ${n.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(n*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,n,i){return this.getHSL(Hi),this.setHSL(Hi.h+e,Hi.s+n,Hi.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,n){return this.r=e.r+n.r,this.g=e.g+n.g,this.b=e.b+n.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,n){return this.r+=(e.r-this.r)*n,this.g+=(e.g-this.g)*n,this.b+=(e.b-this.b)*n,this}lerpColors(e,n,i){return this.r=e.r+(n.r-e.r)*i,this.g=e.g+(n.g-e.g)*i,this.b=e.b+(n.b-e.b)*i,this}lerpHSL(e,n){this.getHSL(Hi),e.getHSL(Bo);const i=Ia(Hi.h,Bo.h,n),r=Ia(Hi.s,Bo.s,n),s=Ia(Hi.l,Bo.l,n);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const n=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*n+s[3]*i+s[6]*r,this.g=s[1]*n+s[4]*i+s[7]*r,this.b=s[2]*n+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,n=0){return this.r=e[n],this.g=e[n+1],this.b=e[n+2],this}toArray(e=[],n=0){return e[n]=this.r,e[n+1]=this.g,e[n+2]=this.b,e}fromBufferAttribute(e,n){return this.r=e.getX(n),this.g=e.getY(n),this.b=e.getZ(n),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Jt=new Ce;Ce.NAMES=Wv;let AM=0;class gr extends Js{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:AM++}),this.uuid=Ci(),this.name="",this.type="Material",this.blending=Ds,this.side=dr,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ld,this.blendDst=Dd,this.blendEquation=Cr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ce(0,0,0),this.blendAlpha=0,this.depthFunc=Vs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Zp,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Kr,this.stencilZFail=Kr,this.stencilZPass=Kr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const n in e){const i=e[n];if(i===void 0){console.warn(`THREE.Material: parameter '${n}' has value of undefined.`);continue}const r=this[n];if(r===void 0){console.warn(`THREE.Material: '${n}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[n]=i}}toJSON(e){const n=e===void 0||typeof e=="string";n&&(e={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Ds&&(i.blending=this.blending),this.side!==dr&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Ld&&(i.blendSrc=this.blendSrc),this.blendDst!==Dd&&(i.blendDst=this.blendDst),this.blendEquation!==Cr&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Vs&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Zp&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Kr&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Kr&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Kr&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const a=[];for(const o in s){const l=s[o];delete l.metadata,a.push(l)}return a}if(n){const s=r(e.textures),a=r(e.images);s.length>0&&(i.textures=s),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const n=e.clippingPlanes;let i=null;if(n!==null){const r=n.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=n[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class yt extends gr{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ce(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new pi,this.combine=Cv,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Nt=new L,Ho=new He;class vn{constructor(e,n,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=n,this.count=e!==void 0?e.length/n:0,this.normalized=i,this.usage=_h,this.updateRanges=[],this.gpuType=Ti,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,n,i){e*=this.itemSize,i*=n.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=n.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let n=0,i=this.count;n<i;n++)Ho.fromBufferAttribute(this,n),Ho.applyMatrix3(e),this.setXY(n,Ho.x,Ho.y);else if(this.itemSize===3)for(let n=0,i=this.count;n<i;n++)Nt.fromBufferAttribute(this,n),Nt.applyMatrix3(e),this.setXYZ(n,Nt.x,Nt.y,Nt.z);return this}applyMatrix4(e){for(let n=0,i=this.count;n<i;n++)Nt.fromBufferAttribute(this,n),Nt.applyMatrix4(e),this.setXYZ(n,Nt.x,Nt.y,Nt.z);return this}applyNormalMatrix(e){for(let n=0,i=this.count;n<i;n++)Nt.fromBufferAttribute(this,n),Nt.applyNormalMatrix(e),this.setXYZ(n,Nt.x,Nt.y,Nt.z);return this}transformDirection(e){for(let n=0,i=this.count;n<i;n++)Nt.fromBufferAttribute(this,n),Nt.transformDirection(e),this.setXYZ(n,Nt.x,Nt.y,Nt.z);return this}set(e,n=0){return this.array.set(e,n),this}getComponent(e,n){let i=this.array[e*this.itemSize+n];return this.normalized&&(i=ti(i,this.array)),i}setComponent(e,n,i){return this.normalized&&(i=at(i,this.array)),this.array[e*this.itemSize+n]=i,this}getX(e){let n=this.array[e*this.itemSize];return this.normalized&&(n=ti(n,this.array)),n}setX(e,n){return this.normalized&&(n=at(n,this.array)),this.array[e*this.itemSize]=n,this}getY(e){let n=this.array[e*this.itemSize+1];return this.normalized&&(n=ti(n,this.array)),n}setY(e,n){return this.normalized&&(n=at(n,this.array)),this.array[e*this.itemSize+1]=n,this}getZ(e){let n=this.array[e*this.itemSize+2];return this.normalized&&(n=ti(n,this.array)),n}setZ(e,n){return this.normalized&&(n=at(n,this.array)),this.array[e*this.itemSize+2]=n,this}getW(e){let n=this.array[e*this.itemSize+3];return this.normalized&&(n=ti(n,this.array)),n}setW(e,n){return this.normalized&&(n=at(n,this.array)),this.array[e*this.itemSize+3]=n,this}setXY(e,n,i){return e*=this.itemSize,this.normalized&&(n=at(n,this.array),i=at(i,this.array)),this.array[e+0]=n,this.array[e+1]=i,this}setXYZ(e,n,i,r){return e*=this.itemSize,this.normalized&&(n=at(n,this.array),i=at(i,this.array),r=at(r,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,n,i,r,s){return e*=this.itemSize,this.normalized&&(n=at(n,this.array),i=at(i,this.array),r=at(r,this.array),s=at(s,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==_h&&(e.usage=this.usage),e}}class Xv extends vn{constructor(e,n,i){super(new Uint16Array(e),n,i)}}class $v extends vn{constructor(e,n,i){super(new Uint32Array(e),n,i)}}class ft extends vn{constructor(e,n,i){super(new Float32Array(e),n,i)}}let bM=0;const Dn=new ht,Mu=new Dt,as=new L,Mn=new co,fa=new co,Bt=new L;class ct extends Js{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:bM++}),this.uuid=Ci(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Gv(e)?$v:Xv)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,n){return this.attributes[e]=n,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,n,i=0){this.groups.push({start:e,count:n,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,n){this.drawRange.start=e,this.drawRange.count=n}applyMatrix4(e){const n=this.attributes.position;n!==void 0&&(n.applyMatrix4(e),n.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new Ve().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Dn.makeRotationFromQuaternion(e),this.applyMatrix4(Dn),this}rotateX(e){return Dn.makeRotationX(e),this.applyMatrix4(Dn),this}rotateY(e){return Dn.makeRotationY(e),this.applyMatrix4(Dn),this}rotateZ(e){return Dn.makeRotationZ(e),this.applyMatrix4(Dn),this}translate(e,n,i){return Dn.makeTranslation(e,n,i),this.applyMatrix4(Dn),this}scale(e,n,i){return Dn.makeScale(e,n,i),this.applyMatrix4(Dn),this}lookAt(e){return Mu.lookAt(e),Mu.updateMatrix(),this.applyMatrix4(Mu.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(as).negate(),this.translate(as.x,as.y,as.z),this}setFromPoints(e){const n=[];for(let i=0,r=e.length;i<r;i++){const s=e[i];n.push(s.x,s.y,s.z||0)}return this.setAttribute("position",new ft(n,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new co);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),n)for(let i=0,r=n.length;i<r;i++){const s=n[i];Mn.setFromBufferAttribute(s),this.morphTargetsRelative?(Bt.addVectors(this.boundingBox.min,Mn.min),this.boundingBox.expandByPoint(Bt),Bt.addVectors(this.boundingBox.max,Mn.max),this.boundingBox.expandByPoint(Bt)):(this.boundingBox.expandByPoint(Mn.min),this.boundingBox.expandByPoint(Mn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new uo);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new L,1/0);return}if(e){const i=this.boundingSphere.center;if(Mn.setFromBufferAttribute(e),n)for(let s=0,a=n.length;s<a;s++){const o=n[s];fa.setFromBufferAttribute(o),this.morphTargetsRelative?(Bt.addVectors(Mn.min,fa.min),Mn.expandByPoint(Bt),Bt.addVectors(Mn.max,fa.max),Mn.expandByPoint(Bt)):(Mn.expandByPoint(fa.min),Mn.expandByPoint(fa.max))}Mn.getCenter(i);let r=0;for(let s=0,a=e.count;s<a;s++)Bt.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(Bt));if(n)for(let s=0,a=n.length;s<a;s++){const o=n[s],l=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)Bt.fromBufferAttribute(o,c),l&&(as.fromBufferAttribute(e,c),Bt.add(as)),r=Math.max(r,i.distanceToSquared(Bt))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,n=this.attributes;if(e===null||n.position===void 0||n.normal===void 0||n.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=n.position,r=n.normal,s=n.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new vn(new Float32Array(4*i.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let b=0;b<i.count;b++)o[b]=new L,l[b]=new L;const c=new L,u=new L,f=new L,h=new He,p=new He,_=new He,v=new L,m=new L;function d(b,z,S){c.fromBufferAttribute(i,b),u.fromBufferAttribute(i,z),f.fromBufferAttribute(i,S),h.fromBufferAttribute(s,b),p.fromBufferAttribute(s,z),_.fromBufferAttribute(s,S),u.sub(c),f.sub(c),p.sub(h),_.sub(h);const w=1/(p.x*_.y-_.x*p.y);isFinite(w)&&(v.copy(u).multiplyScalar(_.y).addScaledVector(f,-p.y).multiplyScalar(w),m.copy(f).multiplyScalar(p.x).addScaledVector(u,-_.x).multiplyScalar(w),o[b].add(v),o[z].add(v),o[S].add(v),l[b].add(m),l[z].add(m),l[S].add(m))}let x=this.groups;x.length===0&&(x=[{start:0,count:e.count}]);for(let b=0,z=x.length;b<z;++b){const S=x[b],w=S.start,N=S.count;for(let k=w,j=w+N;k<j;k+=3)d(e.getX(k+0),e.getX(k+1),e.getX(k+2))}const y=new L,M=new L,P=new L,C=new L;function A(b){P.fromBufferAttribute(r,b),C.copy(P);const z=o[b];y.copy(z),y.sub(P.multiplyScalar(P.dot(z))).normalize(),M.crossVectors(C,z);const w=M.dot(l[b])<0?-1:1;a.setXYZW(b,y.x,y.y,y.z,w)}for(let b=0,z=x.length;b<z;++b){const S=x[b],w=S.start,N=S.count;for(let k=w,j=w+N;k<j;k+=3)A(e.getX(k+0)),A(e.getX(k+1)),A(e.getX(k+2))}}computeVertexNormals(){const e=this.index,n=this.getAttribute("position");if(n!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new vn(new Float32Array(n.count*3),3),this.setAttribute("normal",i);else for(let h=0,p=i.count;h<p;h++)i.setXYZ(h,0,0,0);const r=new L,s=new L,a=new L,o=new L,l=new L,c=new L,u=new L,f=new L;if(e)for(let h=0,p=e.count;h<p;h+=3){const _=e.getX(h+0),v=e.getX(h+1),m=e.getX(h+2);r.fromBufferAttribute(n,_),s.fromBufferAttribute(n,v),a.fromBufferAttribute(n,m),u.subVectors(a,s),f.subVectors(r,s),u.cross(f),o.fromBufferAttribute(i,_),l.fromBufferAttribute(i,v),c.fromBufferAttribute(i,m),o.add(u),l.add(u),c.add(u),i.setXYZ(_,o.x,o.y,o.z),i.setXYZ(v,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let h=0,p=n.count;h<p;h+=3)r.fromBufferAttribute(n,h+0),s.fromBufferAttribute(n,h+1),a.fromBufferAttribute(n,h+2),u.subVectors(a,s),f.subVectors(r,s),u.cross(f),i.setXYZ(h+0,u.x,u.y,u.z),i.setXYZ(h+1,u.x,u.y,u.z),i.setXYZ(h+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let n=0,i=e.count;n<i;n++)Bt.fromBufferAttribute(e,n),Bt.normalize(),e.setXYZ(n,Bt.x,Bt.y,Bt.z)}toNonIndexed(){function e(o,l){const c=o.array,u=o.itemSize,f=o.normalized,h=new c.constructor(l.length*u);let p=0,_=0;for(let v=0,m=l.length;v<m;v++){o.isInterleavedBufferAttribute?p=l[v]*o.data.stride+o.offset:p=l[v]*u;for(let d=0;d<u;d++)h[_++]=c[p++]}return new vn(h,u,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const n=new ct,i=this.index.array,r=this.attributes;for(const o in r){const l=r[o],c=e(l,i);n.setAttribute(o,c)}const s=this.morphAttributes;for(const o in s){const l=[],c=s[o];for(let u=0,f=c.length;u<f;u++){const h=c[u],p=e(h,i);l.push(p)}n.morphAttributes[o]=l}n.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];n.addGroup(c.start,c.count,c.materialIndex)}return n}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const n=this.index;n!==null&&(e.data.index={type:n.array.constructor.name,array:Array.prototype.slice.call(n.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const r={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let f=0,h=c.length;f<h;f++){const p=c[f];u.push(p.toJSON(e.data))}u.length>0&&(r[l]=u,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const n={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone(n));const r=e.attributes;for(const c in r){const u=r[c];this.setAttribute(c,u.clone(n))}const s=e.morphAttributes;for(const c in s){const u=[],f=s[c];for(let h=0,p=f.length;h<p;h++)u.push(f[h].clone(n));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,u=a.length;c<u;c++){const f=a[c];this.addGroup(f.start,f.count,f.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const hm=new ht,yr=new Tc,Go=new uo,fm=new L,Vo=new L,jo=new L,Wo=new L,Eu=new L,Xo=new L,pm=new L,$o=new L;class Ne extends Dt{constructor(e=new ct,n=new yt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=n,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(e,n){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,a=i.morphTargetsRelative;n.fromBufferAttribute(r,e);const o=this.morphTargetInfluences;if(s&&o){Xo.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const u=o[l],f=s[l];u!==0&&(Eu.fromBufferAttribute(f,e),a?Xo.addScaledVector(Eu,u):Xo.addScaledVector(Eu.sub(n),u))}n.add(Xo)}return n}raycast(e,n){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Go.copy(i.boundingSphere),Go.applyMatrix4(s),yr.copy(e.ray).recast(e.near),!(Go.containsPoint(yr.origin)===!1&&(yr.intersectSphere(Go,fm)===null||yr.origin.distanceToSquared(fm)>(e.far-e.near)**2))&&(hm.copy(s).invert(),yr.copy(e.ray).applyMatrix4(hm),!(i.boundingBox!==null&&yr.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,n,yr)))}_computeIntersections(e,n,i){let r;const s=this.geometry,a=this.material,o=s.index,l=s.attributes.position,c=s.attributes.uv,u=s.attributes.uv1,f=s.attributes.normal,h=s.groups,p=s.drawRange;if(o!==null)if(Array.isArray(a))for(let _=0,v=h.length;_<v;_++){const m=h[_],d=a[m.materialIndex],x=Math.max(m.start,p.start),y=Math.min(o.count,Math.min(m.start+m.count,p.start+p.count));for(let M=x,P=y;M<P;M+=3){const C=o.getX(M),A=o.getX(M+1),b=o.getX(M+2);r=Yo(this,d,e,i,c,u,f,C,A,b),r&&(r.faceIndex=Math.floor(M/3),r.face.materialIndex=m.materialIndex,n.push(r))}}else{const _=Math.max(0,p.start),v=Math.min(o.count,p.start+p.count);for(let m=_,d=v;m<d;m+=3){const x=o.getX(m),y=o.getX(m+1),M=o.getX(m+2);r=Yo(this,a,e,i,c,u,f,x,y,M),r&&(r.faceIndex=Math.floor(m/3),n.push(r))}}else if(l!==void 0)if(Array.isArray(a))for(let _=0,v=h.length;_<v;_++){const m=h[_],d=a[m.materialIndex],x=Math.max(m.start,p.start),y=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let M=x,P=y;M<P;M+=3){const C=M,A=M+1,b=M+2;r=Yo(this,d,e,i,c,u,f,C,A,b),r&&(r.faceIndex=Math.floor(M/3),r.face.materialIndex=m.materialIndex,n.push(r))}}else{const _=Math.max(0,p.start),v=Math.min(l.count,p.start+p.count);for(let m=_,d=v;m<d;m+=3){const x=m,y=m+1,M=m+2;r=Yo(this,a,e,i,c,u,f,x,y,M),r&&(r.faceIndex=Math.floor(m/3),n.push(r))}}}}function CM(t,e,n,i,r,s,a,o){let l;if(e.side===Yt?l=i.intersectTriangle(a,s,r,!0,o):l=i.intersectTriangle(r,s,a,e.side===dr,o),l===null)return null;$o.copy(o),$o.applyMatrix4(t.matrixWorld);const c=n.ray.origin.distanceTo($o);return c<n.near||c>n.far?null:{distance:c,point:$o.clone(),object:t}}function Yo(t,e,n,i,r,s,a,o,l,c){t.getVertexPosition(o,Vo),t.getVertexPosition(l,jo),t.getVertexPosition(c,Wo);const u=CM(t,e,n,i,Vo,jo,Wo,pm);if(u){const f=new L;kn.getBarycoord(pm,Vo,jo,Wo,f),r&&(u.uv=kn.getInterpolatedAttribute(r,o,l,c,f,new He)),s&&(u.uv1=kn.getInterpolatedAttribute(s,o,l,c,f,new He)),a&&(u.normal=kn.getInterpolatedAttribute(a,o,l,c,f,new L),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));const h={a:o,b:l,c,normal:new L,materialIndex:0};kn.getNormal(Vo,jo,Wo,h.normal),u.face=h,u.barycoord=f}return u}class fi extends ct{constructor(e=1,n=1,i=1,r=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:n,depth:i,widthSegments:r,heightSegments:s,depthSegments:a};const o=this;r=Math.floor(r),s=Math.floor(s),a=Math.floor(a);const l=[],c=[],u=[],f=[];let h=0,p=0;_("z","y","x",-1,-1,i,n,e,a,s,0),_("z","y","x",1,-1,i,n,-e,a,s,1),_("x","z","y",1,1,e,i,n,r,a,2),_("x","z","y",1,-1,e,i,-n,r,a,3),_("x","y","z",1,-1,e,n,i,r,s,4),_("x","y","z",-1,-1,e,n,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new ft(c,3)),this.setAttribute("normal",new ft(u,3)),this.setAttribute("uv",new ft(f,2));function _(v,m,d,x,y,M,P,C,A,b,z){const S=M/A,w=P/b,N=M/2,k=P/2,j=C/2,q=A+1,W=b+1;let ie=0,I=0;const ee=new L;for(let ne=0;ne<W;ne++){const le=ne*w-k;for(let Te=0;Te<q;Te++){const ze=Te*S-N;ee[v]=ze*x,ee[m]=le*y,ee[d]=j,c.push(ee.x,ee.y,ee.z),ee[v]=0,ee[m]=0,ee[d]=C>0?1:-1,u.push(ee.x,ee.y,ee.z),f.push(Te/A),f.push(1-ne/b),ie+=1}}for(let ne=0;ne<b;ne++)for(let le=0;le<A;le++){const Te=h+le+q*ne,ze=h+le+q*(ne+1),X=h+(le+1)+q*(ne+1),Y=h+(le+1)+q*ne;l.push(Te,ze,Y),l.push(ze,X,Y),I+=6}o.addGroup(p,I,z),p+=I,h+=ie}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new fi(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Ys(t){const e={};for(const n in t){e[n]={};for(const i in t[n]){const r=t[n][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[n][i]=null):e[n][i]=r.clone():Array.isArray(r)?e[n][i]=r.slice():e[n][i]=r}}return e}function an(t){const e={};for(let n=0;n<t.length;n++){const i=Ys(t[n]);for(const r in i)e[r]=i[r]}return e}function RM(t){const e=[];for(let n=0;n<t.length;n++)e.push(t[n].clone());return e}function Yv(t){const e=t.getRenderTarget();return e===null?t.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:it.workingColorSpace}const PM={clone:Ys,merge:an};var NM=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,LM=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Vn extends gr{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=NM,this.fragmentShader=LM,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Ys(e.uniforms),this.uniformsGroups=RM(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const n=super.toJSON(e);n.glslVersion=this.glslVersion,n.uniforms={};for(const r in this.uniforms){const a=this.uniforms[r].value;a&&a.isTexture?n.uniforms[r]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?n.uniforms[r]={type:"c",value:a.getHex()}:a&&a.isVector2?n.uniforms[r]={type:"v2",value:a.toArray()}:a&&a.isVector3?n.uniforms[r]={type:"v3",value:a.toArray()}:a&&a.isVector4?n.uniforms[r]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?n.uniforms[r]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?n.uniforms[r]={type:"m4",value:a.toArray()}:n.uniforms[r]={value:a}}Object.keys(this.defines).length>0&&(n.defines=this.defines),n.vertexShader=this.vertexShader,n.fragmentShader=this.fragmentShader,n.lights=this.lights,n.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(n.extensions=i),n}}class qv extends Dt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ht,this.projectionMatrix=new ht,this.projectionMatrixInverse=new ht,this.coordinateSystem=Ai}copy(e,n){return super.copy(e,n),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,n){super.updateWorldMatrix(e,n),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Gi=new L,mm=new He,gm=new He;class wn extends qv{constructor(e=50,n=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=n,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const n=.5*this.getFilmHeight()/e;this.fov=eo*2*Math.atan(n),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Da*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return eo*2*Math.atan(Math.tan(Da*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,n,i){Gi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Gi.x,Gi.y).multiplyScalar(-e/Gi.z),Gi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Gi.x,Gi.y).multiplyScalar(-e/Gi.z)}getViewSize(e,n){return this.getViewBounds(e,mm,gm),n.subVectors(gm,mm)}setViewOffset(e,n,i,r,s,a){this.aspect=e/n,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let n=e*Math.tan(Da*.5*this.fov)/this.zoom,i=2*n,r=this.aspect*i,s=-.5*r;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;s+=a.offsetX*r/l,n-=a.offsetY*i/c,r*=a.width/l,i*=a.height/c}const o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,n,n-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.fov=this.fov,n.object.zoom=this.zoom,n.object.near=this.near,n.object.far=this.far,n.object.focus=this.focus,n.object.aspect=this.aspect,this.view!==null&&(n.object.view=Object.assign({},this.view)),n.object.filmGauge=this.filmGauge,n.object.filmOffset=this.filmOffset,n}}const os=-90,ls=1;class DM extends Dt{constructor(e,n,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new wn(os,ls,e,n);r.layers=this.layers,this.add(r);const s=new wn(os,ls,e,n);s.layers=this.layers,this.add(s);const a=new wn(os,ls,e,n);a.layers=this.layers,this.add(a);const o=new wn(os,ls,e,n);o.layers=this.layers,this.add(o);const l=new wn(os,ls,e,n);l.layers=this.layers,this.add(l);const c=new wn(os,ls,e,n);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,n=this.children.concat(),[i,r,s,a,o,l]=n;for(const c of n)this.remove(c);if(e===Ai)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===ic)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of n)this.add(c),c.updateMatrixWorld()}update(e,n){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,l,c,u]=this.children,f=e.getRenderTarget(),h=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),_=e.xr.enabled;e.xr.enabled=!1;const v=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,r),e.render(n,s),e.setRenderTarget(i,1,r),e.render(n,a),e.setRenderTarget(i,2,r),e.render(n,o),e.setRenderTarget(i,3,r),e.render(n,l),e.setRenderTarget(i,4,r),e.render(n,c),i.texture.generateMipmaps=v,e.setRenderTarget(i,5,r),e.render(n,u),e.setRenderTarget(f,h,p),e.xr.enabled=_,i.texture.needsPMREMUpdate=!0}}class Kv extends nn{constructor(e,n,i,r,s,a,o,l,c,u){e=e!==void 0?e:[],n=n!==void 0?n:js,super(e,n,i,r,s,a,o,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class IM extends jr{constructor(e=1,n={}){super(e,e,n),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new Kv(r,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=n.generateMipmaps!==void 0?n.generateMipmaps:!1,this.texture.minFilter=n.minFilter!==void 0?n.minFilter:ei}fromEquirectangularTexture(e,n){this.texture.type=n.type,this.texture.colorSpace=n.colorSpace,this.texture.generateMipmaps=n.generateMipmaps,this.texture.minFilter=n.minFilter,this.texture.magFilter=n.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new fi(5,5,5),s=new Vn({name:"CubemapFromEquirect",uniforms:Ys(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Yt,blending:or});s.uniforms.tEquirect.value=n;const a=new Ne(r,s),o=n.minFilter;return n.minFilter===Zi&&(n.minFilter=ei),new DM(1,10,this).update(e,a),n.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,n,i,r){const s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(n,i,r);e.setRenderTarget(s)}}const wu=new L,UM=new L,kM=new Ve;class Ar{constructor(e=new L(1,0,0),n=0){this.isPlane=!0,this.normal=e,this.constant=n}set(e,n){return this.normal.copy(e),this.constant=n,this}setComponents(e,n,i,r){return this.normal.set(e,n,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,n){return this.normal.copy(e),this.constant=-n.dot(this.normal),this}setFromCoplanarPoints(e,n,i){const r=wu.subVectors(i,n).cross(UM.subVectors(e,n)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,n){return n.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,n){const i=e.delta(wu),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?n.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:n.copy(e.start).addScaledVector(i,s)}intersectsLine(e){const n=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return n<0&&i>0||i<0&&n>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,n){const i=n||kM.getNormalMatrix(e),r=this.coplanarPoint(wu).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Sr=new uo,qo=new L;class Af{constructor(e=new Ar,n=new Ar,i=new Ar,r=new Ar,s=new Ar,a=new Ar){this.planes=[e,n,i,r,s,a]}set(e,n,i,r,s,a){const o=this.planes;return o[0].copy(e),o[1].copy(n),o[2].copy(i),o[3].copy(r),o[4].copy(s),o[5].copy(a),this}copy(e){const n=this.planes;for(let i=0;i<6;i++)n[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,n=Ai){const i=this.planes,r=e.elements,s=r[0],a=r[1],o=r[2],l=r[3],c=r[4],u=r[5],f=r[6],h=r[7],p=r[8],_=r[9],v=r[10],m=r[11],d=r[12],x=r[13],y=r[14],M=r[15];if(i[0].setComponents(l-s,h-c,m-p,M-d).normalize(),i[1].setComponents(l+s,h+c,m+p,M+d).normalize(),i[2].setComponents(l+a,h+u,m+_,M+x).normalize(),i[3].setComponents(l-a,h-u,m-_,M-x).normalize(),i[4].setComponents(l-o,h-f,m-v,M-y).normalize(),n===Ai)i[5].setComponents(l+o,h+f,m+v,M+y).normalize();else if(n===ic)i[5].setComponents(o,f,v,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+n);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Sr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const n=e.geometry;n.boundingSphere===null&&n.computeBoundingSphere(),Sr.copy(n.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Sr)}intersectsSprite(e){return Sr.center.set(0,0,0),Sr.radius=.7071067811865476,Sr.applyMatrix4(e.matrixWorld),this.intersectsSphere(Sr)}intersectsSphere(e){const n=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(n[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const n=this.planes;for(let i=0;i<6;i++){const r=n[i];if(qo.x=r.normal.x>0?e.max.x:e.min.x,qo.y=r.normal.y>0?e.max.y:e.min.y,qo.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(qo)<0)return!1}return!0}containsPoint(e){const n=this.planes;for(let i=0;i<6;i++)if(n[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Zv(){let t=null,e=!1,n=null,i=null;function r(s,a){n(s,a),i=t.requestAnimationFrame(r)}return{start:function(){e!==!0&&n!==null&&(i=t.requestAnimationFrame(r),e=!0)},stop:function(){t.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){n=s},setContext:function(s){t=s}}}function FM(t){const e=new WeakMap;function n(o,l){const c=o.array,u=o.usage,f=c.byteLength,h=t.createBuffer();t.bindBuffer(l,h),t.bufferData(l,c,u),o.onUploadCallback();let p;if(c instanceof Float32Array)p=t.FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?p=t.HALF_FLOAT:p=t.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=t.SHORT;else if(c instanceof Uint32Array)p=t.UNSIGNED_INT;else if(c instanceof Int32Array)p=t.INT;else if(c instanceof Int8Array)p=t.BYTE;else if(c instanceof Uint8Array)p=t.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=t.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:h,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:f}}function i(o,l,c){const u=l.array,f=l.updateRanges;if(t.bindBuffer(c,o),f.length===0)t.bufferSubData(c,0,u);else{f.sort((p,_)=>p.start-_.start);let h=0;for(let p=1;p<f.length;p++){const _=f[h],v=f[p];v.start<=_.start+_.count+1?_.count=Math.max(_.count,v.start+v.count-_.start):(++h,f[h]=v)}f.length=h+1;for(let p=0,_=f.length;p<_;p++){const v=f[p];t.bufferSubData(c,v.start*u.BYTES_PER_ELEMENT,u,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(t.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const u=e.get(o);(!u||u.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,n(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:r,remove:s,update:a}}class $r extends ct{constructor(e=1,n=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:n,widthSegments:i,heightSegments:r};const s=e/2,a=n/2,o=Math.floor(i),l=Math.floor(r),c=o+1,u=l+1,f=e/o,h=n/l,p=[],_=[],v=[],m=[];for(let d=0;d<u;d++){const x=d*h-a;for(let y=0;y<c;y++){const M=y*f-s;_.push(M,-x,0),v.push(0,0,1),m.push(y/o),m.push(1-d/l)}}for(let d=0;d<l;d++)for(let x=0;x<o;x++){const y=x+c*d,M=x+c*(d+1),P=x+1+c*(d+1),C=x+1+c*d;p.push(y,M,C),p.push(M,P,C)}this.setIndex(p),this.setAttribute("position",new ft(_,3)),this.setAttribute("normal",new ft(v,3)),this.setAttribute("uv",new ft(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new $r(e.width,e.height,e.widthSegments,e.heightSegments)}}var OM=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,zM=`#ifdef USE_ALPHAHASH
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
#endif`,BM=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,HM=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,GM=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,VM=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,jM=`#ifdef USE_AOMAP
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
#endif`,WM=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,XM=`#ifdef USE_BATCHING
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
#endif`,$M=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,YM=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,qM=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,KM=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,ZM=`#ifdef USE_IRIDESCENCE
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
#endif`,QM=`#ifdef USE_BUMPMAP
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
#endif`,JM=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,eE=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,tE=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,nE=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,iE=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,rE=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,sE=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,aE=`#if defined( USE_COLOR_ALPHA )
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
#endif`,oE=`#define PI 3.141592653589793
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
} // validated`,lE=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,cE=`vec3 transformedNormal = objectNormal;
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
#endif`,uE=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,dE=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,hE=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,fE=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,pE="gl_FragColor = linearToOutputTexel( gl_FragColor );",mE=`
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
}`,gE=`#ifdef USE_ENVMAP
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
#endif`,_E=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,vE=`#ifdef USE_ENVMAP
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
#endif`,xE=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,yE=`#ifdef USE_ENVMAP
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
#endif`,SE=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,ME=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,EE=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,wE=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,TE=`#ifdef USE_GRADIENTMAP
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
}`,AE=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,bE=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,CE=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,RE=`uniform bool receiveShadow;
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
#endif`,PE=`#ifdef USE_ENVMAP
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
#endif`,NE=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,LE=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,DE=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,IE=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,UE=`PhysicalMaterial material;
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
#endif`,kE=`struct PhysicalMaterial {
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
}`,FE=`
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
#endif`,OE=`#if defined( RE_IndirectDiffuse )
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
#endif`,zE=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,BE=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,HE=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,GE=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,VE=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,jE=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,WE=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,XE=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,$E=`#if defined( USE_POINTS_UV )
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
#endif`,YE=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,qE=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,KE=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,ZE=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,QE=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,JE=`#ifdef USE_MORPHTARGETS
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
#endif`,ew=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,tw=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,nw=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,iw=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,rw=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,sw=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,aw=`#ifdef USE_NORMALMAP
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
#endif`,ow=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,lw=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,cw=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,uw=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,dw=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,hw=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,fw=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,pw=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,mw=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,gw=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,_w=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,vw=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,xw=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,yw=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Sw=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Mw=`float getShadowMask() {
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
}`,Ew=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,ww=`#ifdef USE_SKINNING
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
#endif`,Tw=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Aw=`#ifdef USE_SKINNING
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
#endif`,bw=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Cw=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Rw=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Pw=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Nw=`#ifdef USE_TRANSMISSION
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
#endif`,Lw=`#ifdef USE_TRANSMISSION
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
#endif`,Dw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Iw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Uw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,kw=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Fw=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Ow=`uniform sampler2D t2D;
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
}`,zw=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Bw=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Hw=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Gw=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Vw=`#include <common>
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
}`,jw=`#if DEPTH_PACKING == 3200
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
}`,Ww=`#define DISTANCE
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
}`,Xw=`#define DISTANCE
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
}`,$w=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Yw=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,qw=`uniform float scale;
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
}`,Kw=`uniform vec3 diffuse;
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
}`,Zw=`#include <common>
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
}`,Qw=`uniform vec3 diffuse;
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
}`,Jw=`#define LAMBERT
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
}`,e1=`#define LAMBERT
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
}`,t1=`#define MATCAP
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
}`,n1=`#define MATCAP
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
}`,i1=`#define NORMAL
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
}`,r1=`#define NORMAL
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
}`,s1=`#define PHONG
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
}`,a1=`#define PHONG
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
}`,o1=`#define STANDARD
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
}`,l1=`#define STANDARD
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
}`,c1=`#define TOON
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
}`,u1=`#define TOON
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
}`,d1=`uniform float size;
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
}`,h1=`uniform vec3 diffuse;
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
}`,f1=`#include <common>
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
}`,p1=`uniform vec3 color;
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
}`,m1=`uniform float rotation;
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
}`,g1=`uniform vec3 diffuse;
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
}`,Ge={alphahash_fragment:OM,alphahash_pars_fragment:zM,alphamap_fragment:BM,alphamap_pars_fragment:HM,alphatest_fragment:GM,alphatest_pars_fragment:VM,aomap_fragment:jM,aomap_pars_fragment:WM,batching_pars_vertex:XM,batching_vertex:$M,begin_vertex:YM,beginnormal_vertex:qM,bsdfs:KM,iridescence_fragment:ZM,bumpmap_pars_fragment:QM,clipping_planes_fragment:JM,clipping_planes_pars_fragment:eE,clipping_planes_pars_vertex:tE,clipping_planes_vertex:nE,color_fragment:iE,color_pars_fragment:rE,color_pars_vertex:sE,color_vertex:aE,common:oE,cube_uv_reflection_fragment:lE,defaultnormal_vertex:cE,displacementmap_pars_vertex:uE,displacementmap_vertex:dE,emissivemap_fragment:hE,emissivemap_pars_fragment:fE,colorspace_fragment:pE,colorspace_pars_fragment:mE,envmap_fragment:gE,envmap_common_pars_fragment:_E,envmap_pars_fragment:vE,envmap_pars_vertex:xE,envmap_physical_pars_fragment:PE,envmap_vertex:yE,fog_vertex:SE,fog_pars_vertex:ME,fog_fragment:EE,fog_pars_fragment:wE,gradientmap_pars_fragment:TE,lightmap_pars_fragment:AE,lights_lambert_fragment:bE,lights_lambert_pars_fragment:CE,lights_pars_begin:RE,lights_toon_fragment:NE,lights_toon_pars_fragment:LE,lights_phong_fragment:DE,lights_phong_pars_fragment:IE,lights_physical_fragment:UE,lights_physical_pars_fragment:kE,lights_fragment_begin:FE,lights_fragment_maps:OE,lights_fragment_end:zE,logdepthbuf_fragment:BE,logdepthbuf_pars_fragment:HE,logdepthbuf_pars_vertex:GE,logdepthbuf_vertex:VE,map_fragment:jE,map_pars_fragment:WE,map_particle_fragment:XE,map_particle_pars_fragment:$E,metalnessmap_fragment:YE,metalnessmap_pars_fragment:qE,morphinstance_vertex:KE,morphcolor_vertex:ZE,morphnormal_vertex:QE,morphtarget_pars_vertex:JE,morphtarget_vertex:ew,normal_fragment_begin:tw,normal_fragment_maps:nw,normal_pars_fragment:iw,normal_pars_vertex:rw,normal_vertex:sw,normalmap_pars_fragment:aw,clearcoat_normal_fragment_begin:ow,clearcoat_normal_fragment_maps:lw,clearcoat_pars_fragment:cw,iridescence_pars_fragment:uw,opaque_fragment:dw,packing:hw,premultiplied_alpha_fragment:fw,project_vertex:pw,dithering_fragment:mw,dithering_pars_fragment:gw,roughnessmap_fragment:_w,roughnessmap_pars_fragment:vw,shadowmap_pars_fragment:xw,shadowmap_pars_vertex:yw,shadowmap_vertex:Sw,shadowmask_pars_fragment:Mw,skinbase_vertex:Ew,skinning_pars_vertex:ww,skinning_vertex:Tw,skinnormal_vertex:Aw,specularmap_fragment:bw,specularmap_pars_fragment:Cw,tonemapping_fragment:Rw,tonemapping_pars_fragment:Pw,transmission_fragment:Nw,transmission_pars_fragment:Lw,uv_pars_fragment:Dw,uv_pars_vertex:Iw,uv_vertex:Uw,worldpos_vertex:kw,background_vert:Fw,background_frag:Ow,backgroundCube_vert:zw,backgroundCube_frag:Bw,cube_vert:Hw,cube_frag:Gw,depth_vert:Vw,depth_frag:jw,distanceRGBA_vert:Ww,distanceRGBA_frag:Xw,equirect_vert:$w,equirect_frag:Yw,linedashed_vert:qw,linedashed_frag:Kw,meshbasic_vert:Zw,meshbasic_frag:Qw,meshlambert_vert:Jw,meshlambert_frag:e1,meshmatcap_vert:t1,meshmatcap_frag:n1,meshnormal_vert:i1,meshnormal_frag:r1,meshphong_vert:s1,meshphong_frag:a1,meshphysical_vert:o1,meshphysical_frag:l1,meshtoon_vert:c1,meshtoon_frag:u1,points_vert:d1,points_frag:h1,shadow_vert:f1,shadow_frag:p1,sprite_vert:m1,sprite_frag:g1},he={common:{diffuse:{value:new Ce(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ve},alphaMap:{value:null},alphaMapTransform:{value:new Ve},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ve}},envmap:{envMap:{value:null},envMapRotation:{value:new Ve},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ve}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ve}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ve},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ve},normalScale:{value:new He(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ve},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ve}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ve}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ve}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ce(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ce(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ve},alphaTest:{value:0},uvTransform:{value:new Ve}},sprite:{diffuse:{value:new Ce(16777215)},opacity:{value:1},center:{value:new He(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ve},alphaMap:{value:null},alphaMapTransform:{value:new Ve},alphaTest:{value:0}}},li={basic:{uniforms:an([he.common,he.specularmap,he.envmap,he.aomap,he.lightmap,he.fog]),vertexShader:Ge.meshbasic_vert,fragmentShader:Ge.meshbasic_frag},lambert:{uniforms:an([he.common,he.specularmap,he.envmap,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.fog,he.lights,{emissive:{value:new Ce(0)}}]),vertexShader:Ge.meshlambert_vert,fragmentShader:Ge.meshlambert_frag},phong:{uniforms:an([he.common,he.specularmap,he.envmap,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.fog,he.lights,{emissive:{value:new Ce(0)},specular:{value:new Ce(1118481)},shininess:{value:30}}]),vertexShader:Ge.meshphong_vert,fragmentShader:Ge.meshphong_frag},standard:{uniforms:an([he.common,he.envmap,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.roughnessmap,he.metalnessmap,he.fog,he.lights,{emissive:{value:new Ce(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ge.meshphysical_vert,fragmentShader:Ge.meshphysical_frag},toon:{uniforms:an([he.common,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.gradientmap,he.fog,he.lights,{emissive:{value:new Ce(0)}}]),vertexShader:Ge.meshtoon_vert,fragmentShader:Ge.meshtoon_frag},matcap:{uniforms:an([he.common,he.bumpmap,he.normalmap,he.displacementmap,he.fog,{matcap:{value:null}}]),vertexShader:Ge.meshmatcap_vert,fragmentShader:Ge.meshmatcap_frag},points:{uniforms:an([he.points,he.fog]),vertexShader:Ge.points_vert,fragmentShader:Ge.points_frag},dashed:{uniforms:an([he.common,he.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ge.linedashed_vert,fragmentShader:Ge.linedashed_frag},depth:{uniforms:an([he.common,he.displacementmap]),vertexShader:Ge.depth_vert,fragmentShader:Ge.depth_frag},normal:{uniforms:an([he.common,he.bumpmap,he.normalmap,he.displacementmap,{opacity:{value:1}}]),vertexShader:Ge.meshnormal_vert,fragmentShader:Ge.meshnormal_frag},sprite:{uniforms:an([he.sprite,he.fog]),vertexShader:Ge.sprite_vert,fragmentShader:Ge.sprite_frag},background:{uniforms:{uvTransform:{value:new Ve},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ge.background_vert,fragmentShader:Ge.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ve}},vertexShader:Ge.backgroundCube_vert,fragmentShader:Ge.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ge.cube_vert,fragmentShader:Ge.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ge.equirect_vert,fragmentShader:Ge.equirect_frag},distanceRGBA:{uniforms:an([he.common,he.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ge.distanceRGBA_vert,fragmentShader:Ge.distanceRGBA_frag},shadow:{uniforms:an([he.lights,he.fog,{color:{value:new Ce(0)},opacity:{value:1}}]),vertexShader:Ge.shadow_vert,fragmentShader:Ge.shadow_frag}};li.physical={uniforms:an([li.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ve},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ve},clearcoatNormalScale:{value:new He(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ve},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ve},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ve},sheen:{value:0},sheenColor:{value:new Ce(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ve},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ve},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ve},transmissionSamplerSize:{value:new He},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ve},attenuationDistance:{value:0},attenuationColor:{value:new Ce(0)},specularColor:{value:new Ce(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ve},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ve},anisotropyVector:{value:new He},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ve}}]),vertexShader:Ge.meshphysical_vert,fragmentShader:Ge.meshphysical_frag};const Ko={r:0,b:0,g:0},Mr=new pi,_1=new ht;function v1(t,e,n,i,r,s,a){const o=new Ce(0);let l=s===!0?0:1,c,u,f=null,h=0,p=null;function _(x){let y=x.isScene===!0?x.background:null;return y&&y.isTexture&&(y=(x.backgroundBlurriness>0?n:e).get(y)),y}function v(x){let y=!1;const M=_(x);M===null?d(o,l):M&&M.isColor&&(d(M,1),y=!0);const P=t.xr.getEnvironmentBlendMode();P==="additive"?i.buffers.color.setClear(0,0,0,1,a):P==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(t.autoClear||y)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil))}function m(x,y){const M=_(y);M&&(M.isCubeTexture||M.mapping===Ec)?(u===void 0&&(u=new Ne(new fi(1,1,1),new Vn({name:"BackgroundCubeMaterial",uniforms:Ys(li.backgroundCube.uniforms),vertexShader:li.backgroundCube.vertexShader,fragmentShader:li.backgroundCube.fragmentShader,side:Yt,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(P,C,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(u)),Mr.copy(y.backgroundRotation),Mr.x*=-1,Mr.y*=-1,Mr.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(Mr.y*=-1,Mr.z*=-1),u.material.uniforms.envMap.value=M,u.material.uniforms.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=y.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(_1.makeRotationFromEuler(Mr)),u.material.toneMapped=it.getTransfer(M.colorSpace)!==_t,(f!==M||h!==M.version||p!==t.toneMapping)&&(u.material.needsUpdate=!0,f=M,h=M.version,p=t.toneMapping),u.layers.enableAll(),x.unshift(u,u.geometry,u.material,0,0,null)):M&&M.isTexture&&(c===void 0&&(c=new Ne(new $r(2,2),new Vn({name:"BackgroundMaterial",uniforms:Ys(li.background.uniforms),vertexShader:li.background.vertexShader,fragmentShader:li.background.fragmentShader,side:dr,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=M,c.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,c.material.toneMapped=it.getTransfer(M.colorSpace)!==_t,M.matrixAutoUpdate===!0&&M.updateMatrix(),c.material.uniforms.uvTransform.value.copy(M.matrix),(f!==M||h!==M.version||p!==t.toneMapping)&&(c.material.needsUpdate=!0,f=M,h=M.version,p=t.toneMapping),c.layers.enableAll(),x.unshift(c,c.geometry,c.material,0,0,null))}function d(x,y){x.getRGB(Ko,Yv(t)),i.buffers.color.setClear(Ko.r,Ko.g,Ko.b,y,a)}return{getClearColor:function(){return o},setClearColor:function(x,y=1){o.set(x),l=y,d(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(x){l=x,d(o,l)},render:v,addToRenderList:m}}function x1(t,e){const n=t.getParameter(t.MAX_VERTEX_ATTRIBS),i={},r=h(null);let s=r,a=!1;function o(S,w,N,k,j){let q=!1;const W=f(k,N,w);s!==W&&(s=W,c(s.object)),q=p(S,k,N,j),q&&_(S,k,N,j),j!==null&&e.update(j,t.ELEMENT_ARRAY_BUFFER),(q||a)&&(a=!1,M(S,w,N,k),j!==null&&t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,e.get(j).buffer))}function l(){return t.createVertexArray()}function c(S){return t.bindVertexArray(S)}function u(S){return t.deleteVertexArray(S)}function f(S,w,N){const k=N.wireframe===!0;let j=i[S.id];j===void 0&&(j={},i[S.id]=j);let q=j[w.id];q===void 0&&(q={},j[w.id]=q);let W=q[k];return W===void 0&&(W=h(l()),q[k]=W),W}function h(S){const w=[],N=[],k=[];for(let j=0;j<n;j++)w[j]=0,N[j]=0,k[j]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:w,enabledAttributes:N,attributeDivisors:k,object:S,attributes:{},index:null}}function p(S,w,N,k){const j=s.attributes,q=w.attributes;let W=0;const ie=N.getAttributes();for(const I in ie)if(ie[I].location>=0){const ne=j[I];let le=q[I];if(le===void 0&&(I==="instanceMatrix"&&S.instanceMatrix&&(le=S.instanceMatrix),I==="instanceColor"&&S.instanceColor&&(le=S.instanceColor)),ne===void 0||ne.attribute!==le||le&&ne.data!==le.data)return!0;W++}return s.attributesNum!==W||s.index!==k}function _(S,w,N,k){const j={},q=w.attributes;let W=0;const ie=N.getAttributes();for(const I in ie)if(ie[I].location>=0){let ne=q[I];ne===void 0&&(I==="instanceMatrix"&&S.instanceMatrix&&(ne=S.instanceMatrix),I==="instanceColor"&&S.instanceColor&&(ne=S.instanceColor));const le={};le.attribute=ne,ne&&ne.data&&(le.data=ne.data),j[I]=le,W++}s.attributes=j,s.attributesNum=W,s.index=k}function v(){const S=s.newAttributes;for(let w=0,N=S.length;w<N;w++)S[w]=0}function m(S){d(S,0)}function d(S,w){const N=s.newAttributes,k=s.enabledAttributes,j=s.attributeDivisors;N[S]=1,k[S]===0&&(t.enableVertexAttribArray(S),k[S]=1),j[S]!==w&&(t.vertexAttribDivisor(S,w),j[S]=w)}function x(){const S=s.newAttributes,w=s.enabledAttributes;for(let N=0,k=w.length;N<k;N++)w[N]!==S[N]&&(t.disableVertexAttribArray(N),w[N]=0)}function y(S,w,N,k,j,q,W){W===!0?t.vertexAttribIPointer(S,w,N,j,q):t.vertexAttribPointer(S,w,N,k,j,q)}function M(S,w,N,k){v();const j=k.attributes,q=N.getAttributes(),W=w.defaultAttributeValues;for(const ie in q){const I=q[ie];if(I.location>=0){let ee=j[ie];if(ee===void 0&&(ie==="instanceMatrix"&&S.instanceMatrix&&(ee=S.instanceMatrix),ie==="instanceColor"&&S.instanceColor&&(ee=S.instanceColor)),ee!==void 0){const ne=ee.normalized,le=ee.itemSize,Te=e.get(ee);if(Te===void 0)continue;const ze=Te.buffer,X=Te.type,Y=Te.bytesPerElement,ue=X===t.INT||X===t.UNSIGNED_INT||ee.gpuType===_f;if(ee.isInterleavedBufferAttribute){const de=ee.data,Ie=de.stride,De=ee.offset;if(de.isInstancedInterleavedBuffer){for(let qe=0;qe<I.locationSize;qe++)d(I.location+qe,de.meshPerAttribute);S.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=de.meshPerAttribute*de.count)}else for(let qe=0;qe<I.locationSize;qe++)m(I.location+qe);t.bindBuffer(t.ARRAY_BUFFER,ze);for(let qe=0;qe<I.locationSize;qe++)y(I.location+qe,le/I.locationSize,X,ne,Ie*Y,(De+le/I.locationSize*qe)*Y,ue)}else{if(ee.isInstancedBufferAttribute){for(let de=0;de<I.locationSize;de++)d(I.location+de,ee.meshPerAttribute);S.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=ee.meshPerAttribute*ee.count)}else for(let de=0;de<I.locationSize;de++)m(I.location+de);t.bindBuffer(t.ARRAY_BUFFER,ze);for(let de=0;de<I.locationSize;de++)y(I.location+de,le/I.locationSize,X,ne,le*Y,le/I.locationSize*de*Y,ue)}}else if(W!==void 0){const ne=W[ie];if(ne!==void 0)switch(ne.length){case 2:t.vertexAttrib2fv(I.location,ne);break;case 3:t.vertexAttrib3fv(I.location,ne);break;case 4:t.vertexAttrib4fv(I.location,ne);break;default:t.vertexAttrib1fv(I.location,ne)}}}}x()}function P(){b();for(const S in i){const w=i[S];for(const N in w){const k=w[N];for(const j in k)u(k[j].object),delete k[j];delete w[N]}delete i[S]}}function C(S){if(i[S.id]===void 0)return;const w=i[S.id];for(const N in w){const k=w[N];for(const j in k)u(k[j].object),delete k[j];delete w[N]}delete i[S.id]}function A(S){for(const w in i){const N=i[w];if(N[S.id]===void 0)continue;const k=N[S.id];for(const j in k)u(k[j].object),delete k[j];delete N[S.id]}}function b(){z(),a=!0,s!==r&&(s=r,c(s.object))}function z(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:o,reset:b,resetDefaultState:z,dispose:P,releaseStatesOfGeometry:C,releaseStatesOfProgram:A,initAttributes:v,enableAttribute:m,disableUnusedAttributes:x}}function y1(t,e,n){let i;function r(c){i=c}function s(c,u){t.drawArrays(i,c,u),n.update(u,i,1)}function a(c,u,f){f!==0&&(t.drawArraysInstanced(i,c,u,f),n.update(u,i,f))}function o(c,u,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,u,0,f);let p=0;for(let _=0;_<f;_++)p+=u[_];n.update(p,i,1)}function l(c,u,f,h){if(f===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let _=0;_<c.length;_++)a(c[_],u[_],h[_]);else{p.multiDrawArraysInstancedWEBGL(i,c,0,u,0,h,0,f);let _=0;for(let v=0;v<f;v++)_+=u[v];for(let v=0;v<h.length;v++)n.update(_,i,h[v])}}this.setMode=r,this.render=s,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function S1(t,e,n,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const A=e.get("EXT_texture_filter_anisotropic");r=t.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function a(A){return!(A!==ni&&i.convert(A)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(A){const b=A===oo&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(A!==Di&&i.convert(A)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==Ti&&!b)}function l(A){if(A==="highp"){if(t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.HIGH_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.MEDIUM_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=n.precision!==void 0?n.precision:"highp";const u=l(c);u!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const f=n.logarithmicDepthBuffer===!0,h=n.reverseDepthBuffer===!0&&e.has("EXT_clip_control");if(h===!0){const A=e.get("EXT_clip_control");A.clipControlEXT(A.LOWER_LEFT_EXT,A.ZERO_TO_ONE_EXT)}const p=t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS),_=t.getParameter(t.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=t.getParameter(t.MAX_TEXTURE_SIZE),m=t.getParameter(t.MAX_CUBE_MAP_TEXTURE_SIZE),d=t.getParameter(t.MAX_VERTEX_ATTRIBS),x=t.getParameter(t.MAX_VERTEX_UNIFORM_VECTORS),y=t.getParameter(t.MAX_VARYING_VECTORS),M=t.getParameter(t.MAX_FRAGMENT_UNIFORM_VECTORS),P=_>0,C=t.getParameter(t.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:f,reverseDepthBuffer:h,maxTextures:p,maxVertexTextures:_,maxTextureSize:v,maxCubemapSize:m,maxAttributes:d,maxVertexUniforms:x,maxVaryings:y,maxFragmentUniforms:M,vertexTextures:P,maxSamples:C}}function M1(t){const e=this;let n=null,i=0,r=!1,s=!1;const a=new Ar,o=new Ve,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,h){const p=f.length!==0||h||i!==0||r;return r=h,i=f.length,p},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(f,h){n=u(f,h,0)},this.setState=function(f,h,p){const _=f.clippingPlanes,v=f.clipIntersection,m=f.clipShadows,d=t.get(f);if(!r||_===null||_.length===0||s&&!m)s?u(null):c();else{const x=s?0:i,y=x*4;let M=d.clippingState||null;l.value=M,M=u(_,h,y,p);for(let P=0;P!==y;++P)M[P]=n[P];d.clippingState=M,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=x}};function c(){l.value!==n&&(l.value=n,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(f,h,p,_){const v=f!==null?f.length:0;let m=null;if(v!==0){if(m=l.value,_!==!0||m===null){const d=p+v*4,x=h.matrixWorldInverse;o.getNormalMatrix(x),(m===null||m.length<d)&&(m=new Float32Array(d));for(let y=0,M=p;y!==v;++y,M+=4)a.copy(f[y]).applyMatrix4(x,o),a.normal.toArray(m,M),m[M+3]=a.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,m}}function E1(t){let e=new WeakMap;function n(a,o){return o===Hd?a.mapping=js:o===Gd&&(a.mapping=Ws),a}function i(a){if(a&&a.isTexture){const o=a.mapping;if(o===Hd||o===Gd)if(e.has(a)){const l=e.get(a).texture;return n(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new IM(l.height);return c.fromEquirectangularTexture(t,a),e.set(a,c),a.addEventListener("dispose",r),n(c.texture,a.mapping)}else return null}}return a}function r(a){const o=a.target;o.removeEventListener("dispose",r);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function s(){e=new WeakMap}return{get:i,dispose:s}}class Qv extends qv{constructor(e=-1,n=1,i=1,r=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=n,this.top=i,this.bottom=r,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,n,i,r,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),n=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,a=i+e,o=r+n,l=r-n;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,a=s+c*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.zoom=this.zoom,n.object.left=this.left,n.object.right=this.right,n.object.top=this.top,n.object.bottom=this.bottom,n.object.near=this.near,n.object.far=this.far,this.view!==null&&(n.object.view=Object.assign({},this.view)),n}}const As=4,_m=[.125,.215,.35,.446,.526,.582],Rr=20,Tu=new Qv,vm=new Ce;let Au=null,bu=0,Cu=0,Ru=!1;const br=(1+Math.sqrt(5))/2,cs=1/br,xm=[new L(-br,cs,0),new L(br,cs,0),new L(-cs,0,br),new L(cs,0,br),new L(0,br,-cs),new L(0,br,cs),new L(-1,1,-1),new L(1,1,-1),new L(-1,1,1),new L(1,1,1)];class ym{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,n=0,i=.1,r=100){Au=this._renderer.getRenderTarget(),bu=this._renderer.getActiveCubeFace(),Cu=this._renderer.getActiveMipmapLevel(),Ru=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,i,r,s),n>0&&this._blur(s,0,0,n),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,n=null){return this._fromTexture(e,n)}fromCubemap(e,n=null){return this._fromTexture(e,n)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Em(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Mm(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Au,bu,Cu),this._renderer.xr.enabled=Ru,e.scissorTest=!1,Zo(e,0,0,e.width,e.height)}_fromTexture(e,n){e.mapping===js||e.mapping===Ws?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Au=this._renderer.getRenderTarget(),bu=this._renderer.getActiveCubeFace(),Cu=this._renderer.getActiveMipmapLevel(),Ru=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=n||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),n=4*this._cubeSize,i={magFilter:ei,minFilter:ei,generateMipmaps:!1,type:oo,format:ni,colorSpace:mr,depthBuffer:!1},r=Sm(e,n,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==n){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Sm(e,n,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=w1(s)),this._blurMaterial=T1(s,e,n)}return r}_compileMaterial(e){const n=new Ne(this._lodPlanes[0],e);this._renderer.compile(n,Tu)}_sceneToCubeUV(e,n,i,r){const o=new wn(90,1,n,i),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],u=this._renderer,f=u.autoClear,h=u.toneMapping;u.getClearColor(vm),u.toneMapping=lr,u.autoClear=!1;const p=new yt({name:"PMREM.Background",side:Yt,depthWrite:!1,depthTest:!1}),_=new Ne(new fi,p);let v=!1;const m=e.background;m?m.isColor&&(p.color.copy(m),e.background=null,v=!0):(p.color.copy(vm),v=!0);for(let d=0;d<6;d++){const x=d%3;x===0?(o.up.set(0,l[d],0),o.lookAt(c[d],0,0)):x===1?(o.up.set(0,0,l[d]),o.lookAt(0,c[d],0)):(o.up.set(0,l[d],0),o.lookAt(0,0,c[d]));const y=this._cubeSize;Zo(r,x*y,d>2?y:0,y,y),u.setRenderTarget(r),v&&u.render(_,o),u.render(e,o)}_.geometry.dispose(),_.material.dispose(),u.toneMapping=h,u.autoClear=f,e.background=m}_textureToCubeUV(e,n){const i=this._renderer,r=e.mapping===js||e.mapping===Ws;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Em()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Mm());const s=r?this._cubemapMaterial:this._equirectMaterial,a=new Ne(this._lodPlanes[0],s),o=s.uniforms;o.envMap.value=e;const l=this._cubeSize;Zo(n,0,0,3*l,2*l),i.setRenderTarget(n),i.render(a,Tu)}_applyPMREM(e){const n=this._renderer,i=n.autoClear;n.autoClear=!1;const r=this._lodPlanes.length;for(let s=1;s<r;s++){const a=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=xm[(r-s-1)%xm.length];this._blur(e,s-1,s,a,o)}n.autoClear=i}_blur(e,n,i,r,s){const a=this._pingPongRenderTarget;this._halfBlur(e,a,n,i,r,"latitudinal",s),this._halfBlur(a,e,i,i,r,"longitudinal",s)}_halfBlur(e,n,i,r,s,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,f=new Ne(this._lodPlanes[r],c),h=c.uniforms,p=this._sizeLods[i]-1,_=isFinite(s)?Math.PI/(2*p):2*Math.PI/(2*Rr-1),v=s/_,m=isFinite(s)?1+Math.floor(u*v):Rr;m>Rr&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Rr}`);const d=[];let x=0;for(let A=0;A<Rr;++A){const b=A/v,z=Math.exp(-b*b/2);d.push(z),A===0?x+=z:A<m&&(x+=2*z)}for(let A=0;A<d.length;A++)d[A]=d[A]/x;h.envMap.value=e.texture,h.samples.value=m,h.weights.value=d,h.latitudinal.value=a==="latitudinal",o&&(h.poleAxis.value=o);const{_lodMax:y}=this;h.dTheta.value=_,h.mipInt.value=y-i;const M=this._sizeLods[r],P=3*M*(r>y-As?r-y+As:0),C=4*(this._cubeSize-M);Zo(n,P,C,3*M,2*M),l.setRenderTarget(n),l.render(f,Tu)}}function w1(t){const e=[],n=[],i=[];let r=t;const s=t-As+1+_m.length;for(let a=0;a<s;a++){const o=Math.pow(2,r);n.push(o);let l=1/o;a>t-As?l=_m[a-t+As-1]:a===0&&(l=0),i.push(l);const c=1/(o-2),u=-c,f=1+c,h=[u,u,f,u,f,f,u,u,f,f,u,f],p=6,_=6,v=3,m=2,d=1,x=new Float32Array(v*_*p),y=new Float32Array(m*_*p),M=new Float32Array(d*_*p);for(let C=0;C<p;C++){const A=C%3*2/3-1,b=C>2?0:-1,z=[A,b,0,A+2/3,b,0,A+2/3,b+1,0,A,b,0,A+2/3,b+1,0,A,b+1,0];x.set(z,v*_*C),y.set(h,m*_*C);const S=[C,C,C,C,C,C];M.set(S,d*_*C)}const P=new ct;P.setAttribute("position",new vn(x,v)),P.setAttribute("uv",new vn(y,m)),P.setAttribute("faceIndex",new vn(M,d)),e.push(P),r>As&&r--}return{lodPlanes:e,sizeLods:n,sigmas:i}}function Sm(t,e,n){const i=new jr(t,e,n);return i.texture.mapping=Ec,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Zo(t,e,n,i,r){t.viewport.set(e,n,i,r),t.scissor.set(e,n,i,r)}function T1(t,e,n){const i=new Float32Array(Rr),r=new L(0,1,0);return new Vn({name:"SphericalGaussianBlur",defines:{n:Rr,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${t}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:bf(),fragmentShader:`

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
		`,blending:or,depthTest:!1,depthWrite:!1})}function Mm(){return new Vn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:bf(),fragmentShader:`

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
		`,blending:or,depthTest:!1,depthWrite:!1})}function Em(){return new Vn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:bf(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:or,depthTest:!1,depthWrite:!1})}function bf(){return`

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
	`}function A1(t){let e=new WeakMap,n=null;function i(o){if(o&&o.isTexture){const l=o.mapping,c=l===Hd||l===Gd,u=l===js||l===Ws;if(c||u){let f=e.get(o);const h=f!==void 0?f.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==h)return n===null&&(n=new ym(t)),f=c?n.fromEquirectangular(o,f):n.fromCubemap(o,f),f.texture.pmremVersion=o.pmremVersion,e.set(o,f),f.texture;if(f!==void 0)return f.texture;{const p=o.image;return c&&p&&p.height>0||u&&p&&r(p)?(n===null&&(n=new ym(t)),f=c?n.fromEquirectangular(o):n.fromCubemap(o),f.texture.pmremVersion=o.pmremVersion,e.set(o,f),o.addEventListener("dispose",s),f.texture):null}}}return o}function r(o){let l=0;const c=6;for(let u=0;u<c;u++)o[u]!==void 0&&l++;return l===c}function s(o){const l=o.target;l.removeEventListener("dispose",s);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:a}}function b1(t){const e={};function n(i){if(e[i]!==void 0)return e[i];let r;switch(i){case"WEBGL_depth_texture":r=t.getExtension("WEBGL_depth_texture")||t.getExtension("MOZ_WEBGL_depth_texture")||t.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=t.getExtension("EXT_texture_filter_anisotropic")||t.getExtension("MOZ_EXT_texture_filter_anisotropic")||t.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=t.getExtension("WEBGL_compressed_texture_s3tc")||t.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||t.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=t.getExtension("WEBGL_compressed_texture_pvrtc")||t.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=t.getExtension(i)}return e[i]=r,r}return{has:function(i){return n(i)!==null},init:function(){n("EXT_color_buffer_float"),n("WEBGL_clip_cull_distance"),n("OES_texture_float_linear"),n("EXT_color_buffer_half_float"),n("WEBGL_multisampled_render_to_texture"),n("WEBGL_render_shared_exponent")},get:function(i){const r=n(i);return r===null&&bl("THREE.WebGLRenderer: "+i+" extension not supported."),r}}}function C1(t,e,n,i){const r={},s=new WeakMap;function a(f){const h=f.target;h.index!==null&&e.remove(h.index);for(const _ in h.attributes)e.remove(h.attributes[_]);for(const _ in h.morphAttributes){const v=h.morphAttributes[_];for(let m=0,d=v.length;m<d;m++)e.remove(v[m])}h.removeEventListener("dispose",a),delete r[h.id];const p=s.get(h);p&&(e.remove(p),s.delete(h)),i.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,n.memory.geometries--}function o(f,h){return r[h.id]===!0||(h.addEventListener("dispose",a),r[h.id]=!0,n.memory.geometries++),h}function l(f){const h=f.attributes;for(const _ in h)e.update(h[_],t.ARRAY_BUFFER);const p=f.morphAttributes;for(const _ in p){const v=p[_];for(let m=0,d=v.length;m<d;m++)e.update(v[m],t.ARRAY_BUFFER)}}function c(f){const h=[],p=f.index,_=f.attributes.position;let v=0;if(p!==null){const x=p.array;v=p.version;for(let y=0,M=x.length;y<M;y+=3){const P=x[y+0],C=x[y+1],A=x[y+2];h.push(P,C,C,A,A,P)}}else if(_!==void 0){const x=_.array;v=_.version;for(let y=0,M=x.length/3-1;y<M;y+=3){const P=y+0,C=y+1,A=y+2;h.push(P,C,C,A,A,P)}}else return;const m=new(Gv(h)?$v:Xv)(h,1);m.version=v;const d=s.get(f);d&&e.remove(d),s.set(f,m)}function u(f){const h=s.get(f);if(h){const p=f.index;p!==null&&h.version<p.version&&c(f)}else c(f);return s.get(f)}return{get:o,update:l,getWireframeAttribute:u}}function R1(t,e,n){let i;function r(h){i=h}let s,a;function o(h){s=h.type,a=h.bytesPerElement}function l(h,p){t.drawElements(i,p,s,h*a),n.update(p,i,1)}function c(h,p,_){_!==0&&(t.drawElementsInstanced(i,p,s,h*a,_),n.update(p,i,_))}function u(h,p,_){if(_===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,p,0,s,h,0,_);let m=0;for(let d=0;d<_;d++)m+=p[d];n.update(m,i,1)}function f(h,p,_,v){if(_===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let d=0;d<h.length;d++)c(h[d]/a,p[d],v[d]);else{m.multiDrawElementsInstancedWEBGL(i,p,0,s,h,0,v,0,_);let d=0;for(let x=0;x<_;x++)d+=p[x];for(let x=0;x<v.length;x++)n.update(d,i,v[x])}}this.setMode=r,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=f}function P1(t){const e={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,a,o){switch(n.calls++,a){case t.TRIANGLES:n.triangles+=o*(s/3);break;case t.LINES:n.lines+=o*(s/2);break;case t.LINE_STRIP:n.lines+=o*(s-1);break;case t.LINE_LOOP:n.lines+=o*s;break;case t.POINTS:n.points+=o*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function r(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:e,render:n,programs:null,autoReset:!0,reset:r,update:i}}function N1(t,e,n){const i=new WeakMap,r=new Ct;function s(a,o,l){const c=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=u!==void 0?u.length:0;let h=i.get(o);if(h===void 0||h.count!==f){let S=function(){b.dispose(),i.delete(o),o.removeEventListener("dispose",S)};var p=S;h!==void 0&&h.texture.dispose();const _=o.morphAttributes.position!==void 0,v=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,d=o.morphAttributes.position||[],x=o.morphAttributes.normal||[],y=o.morphAttributes.color||[];let M=0;_===!0&&(M=1),v===!0&&(M=2),m===!0&&(M=3);let P=o.attributes.position.count*M,C=1;P>e.maxTextureSize&&(C=Math.ceil(P/e.maxTextureSize),P=e.maxTextureSize);const A=new Float32Array(P*C*4*f),b=new jv(A,P,C,f);b.type=Ti,b.needsUpdate=!0;const z=M*4;for(let w=0;w<f;w++){const N=d[w],k=x[w],j=y[w],q=P*C*4*w;for(let W=0;W<N.count;W++){const ie=W*z;_===!0&&(r.fromBufferAttribute(N,W),A[q+ie+0]=r.x,A[q+ie+1]=r.y,A[q+ie+2]=r.z,A[q+ie+3]=0),v===!0&&(r.fromBufferAttribute(k,W),A[q+ie+4]=r.x,A[q+ie+5]=r.y,A[q+ie+6]=r.z,A[q+ie+7]=0),m===!0&&(r.fromBufferAttribute(j,W),A[q+ie+8]=r.x,A[q+ie+9]=r.y,A[q+ie+10]=r.z,A[q+ie+11]=j.itemSize===4?r.w:1)}}h={count:f,texture:b,size:new He(P,C)},i.set(o,h),o.addEventListener("dispose",S)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(t,"morphTexture",a.morphTexture,n);else{let _=0;for(let m=0;m<c.length;m++)_+=c[m];const v=o.morphTargetsRelative?1:1-_;l.getUniforms().setValue(t,"morphTargetBaseInfluence",v),l.getUniforms().setValue(t,"morphTargetInfluences",c)}l.getUniforms().setValue(t,"morphTargetsTexture",h.texture,n),l.getUniforms().setValue(t,"morphTargetsTextureSize",h.size)}return{update:s}}function L1(t,e,n,i){let r=new WeakMap;function s(l){const c=i.render.frame,u=l.geometry,f=e.get(l,u);if(r.get(f)!==c&&(e.update(f),r.set(f,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),r.get(l)!==c&&(n.update(l.instanceMatrix,t.ARRAY_BUFFER),l.instanceColor!==null&&n.update(l.instanceColor,t.ARRAY_BUFFER),r.set(l,c))),l.isSkinnedMesh){const h=l.skeleton;r.get(h)!==c&&(h.update(),r.set(h,c))}return f}function a(){r=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),n.remove(c.instanceMatrix),c.instanceColor!==null&&n.remove(c.instanceColor)}return{update:s,dispose:a}}class Jv extends nn{constructor(e,n,i,r,s,a,o,l,c,u=Is){if(u!==Is&&u!==$s)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&u===Is&&(i=Vr),i===void 0&&u===$s&&(i=Xs),super(null,r,s,a,o,l,u,i,c),this.isDepthTexture=!0,this.image={width:e,height:n},this.magFilter=o!==void 0?o:zn,this.minFilter=l!==void 0?l:zn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const n=super.toJSON(e);return this.compareFunction!==null&&(n.compareFunction=this.compareFunction),n}}const e0=new nn,wm=new Jv(1,1),t0=new jv,n0=new vM,i0=new Kv,Tm=[],Am=[],bm=new Float32Array(16),Cm=new Float32Array(9),Rm=new Float32Array(4);function ea(t,e,n){const i=t[0];if(i<=0||i>0)return t;const r=e*n;let s=Tm[r];if(s===void 0&&(s=new Float32Array(r),Tm[r]=s),e!==0){i.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=n,t[a].toArray(s,o)}return s}function Ft(t,e){if(t.length!==e.length)return!1;for(let n=0,i=t.length;n<i;n++)if(t[n]!==e[n])return!1;return!0}function Ot(t,e){for(let n=0,i=e.length;n<i;n++)t[n]=e[n]}function Ac(t,e){let n=Am[e];n===void 0&&(n=new Int32Array(e),Am[e]=n);for(let i=0;i!==e;++i)n[i]=t.allocateTextureUnit();return n}function D1(t,e){const n=this.cache;n[0]!==e&&(t.uniform1f(this.addr,e),n[0]=e)}function I1(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2f(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Ft(n,e))return;t.uniform2fv(this.addr,e),Ot(n,e)}}function U1(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3f(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else if(e.r!==void 0)(n[0]!==e.r||n[1]!==e.g||n[2]!==e.b)&&(t.uniform3f(this.addr,e.r,e.g,e.b),n[0]=e.r,n[1]=e.g,n[2]=e.b);else{if(Ft(n,e))return;t.uniform3fv(this.addr,e),Ot(n,e)}}function k1(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4f(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Ft(n,e))return;t.uniform4fv(this.addr,e),Ot(n,e)}}function F1(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Ft(n,e))return;t.uniformMatrix2fv(this.addr,!1,e),Ot(n,e)}else{if(Ft(n,i))return;Rm.set(i),t.uniformMatrix2fv(this.addr,!1,Rm),Ot(n,i)}}function O1(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Ft(n,e))return;t.uniformMatrix3fv(this.addr,!1,e),Ot(n,e)}else{if(Ft(n,i))return;Cm.set(i),t.uniformMatrix3fv(this.addr,!1,Cm),Ot(n,i)}}function z1(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Ft(n,e))return;t.uniformMatrix4fv(this.addr,!1,e),Ot(n,e)}else{if(Ft(n,i))return;bm.set(i),t.uniformMatrix4fv(this.addr,!1,bm),Ot(n,i)}}function B1(t,e){const n=this.cache;n[0]!==e&&(t.uniform1i(this.addr,e),n[0]=e)}function H1(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2i(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Ft(n,e))return;t.uniform2iv(this.addr,e),Ot(n,e)}}function G1(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3i(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(Ft(n,e))return;t.uniform3iv(this.addr,e),Ot(n,e)}}function V1(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4i(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Ft(n,e))return;t.uniform4iv(this.addr,e),Ot(n,e)}}function j1(t,e){const n=this.cache;n[0]!==e&&(t.uniform1ui(this.addr,e),n[0]=e)}function W1(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2ui(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Ft(n,e))return;t.uniform2uiv(this.addr,e),Ot(n,e)}}function X1(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3ui(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(Ft(n,e))return;t.uniform3uiv(this.addr,e),Ot(n,e)}}function $1(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4ui(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Ft(n,e))return;t.uniform4uiv(this.addr,e),Ot(n,e)}}function Y1(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r);let s;this.type===t.SAMPLER_2D_SHADOW?(wm.compareFunction=Hv,s=wm):s=e0,n.setTexture2D(e||s,r)}function q1(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture3D(e||n0,r)}function K1(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTextureCube(e||i0,r)}function Z1(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture2DArray(e||t0,r)}function Q1(t){switch(t){case 5126:return D1;case 35664:return I1;case 35665:return U1;case 35666:return k1;case 35674:return F1;case 35675:return O1;case 35676:return z1;case 5124:case 35670:return B1;case 35667:case 35671:return H1;case 35668:case 35672:return G1;case 35669:case 35673:return V1;case 5125:return j1;case 36294:return W1;case 36295:return X1;case 36296:return $1;case 35678:case 36198:case 36298:case 36306:case 35682:return Y1;case 35679:case 36299:case 36307:return q1;case 35680:case 36300:case 36308:case 36293:return K1;case 36289:case 36303:case 36311:case 36292:return Z1}}function J1(t,e){t.uniform1fv(this.addr,e)}function eT(t,e){const n=ea(e,this.size,2);t.uniform2fv(this.addr,n)}function tT(t,e){const n=ea(e,this.size,3);t.uniform3fv(this.addr,n)}function nT(t,e){const n=ea(e,this.size,4);t.uniform4fv(this.addr,n)}function iT(t,e){const n=ea(e,this.size,4);t.uniformMatrix2fv(this.addr,!1,n)}function rT(t,e){const n=ea(e,this.size,9);t.uniformMatrix3fv(this.addr,!1,n)}function sT(t,e){const n=ea(e,this.size,16);t.uniformMatrix4fv(this.addr,!1,n)}function aT(t,e){t.uniform1iv(this.addr,e)}function oT(t,e){t.uniform2iv(this.addr,e)}function lT(t,e){t.uniform3iv(this.addr,e)}function cT(t,e){t.uniform4iv(this.addr,e)}function uT(t,e){t.uniform1uiv(this.addr,e)}function dT(t,e){t.uniform2uiv(this.addr,e)}function hT(t,e){t.uniform3uiv(this.addr,e)}function fT(t,e){t.uniform4uiv(this.addr,e)}function pT(t,e,n){const i=this.cache,r=e.length,s=Ac(n,r);Ft(i,s)||(t.uniform1iv(this.addr,s),Ot(i,s));for(let a=0;a!==r;++a)n.setTexture2D(e[a]||e0,s[a])}function mT(t,e,n){const i=this.cache,r=e.length,s=Ac(n,r);Ft(i,s)||(t.uniform1iv(this.addr,s),Ot(i,s));for(let a=0;a!==r;++a)n.setTexture3D(e[a]||n0,s[a])}function gT(t,e,n){const i=this.cache,r=e.length,s=Ac(n,r);Ft(i,s)||(t.uniform1iv(this.addr,s),Ot(i,s));for(let a=0;a!==r;++a)n.setTextureCube(e[a]||i0,s[a])}function _T(t,e,n){const i=this.cache,r=e.length,s=Ac(n,r);Ft(i,s)||(t.uniform1iv(this.addr,s),Ot(i,s));for(let a=0;a!==r;++a)n.setTexture2DArray(e[a]||t0,s[a])}function vT(t){switch(t){case 5126:return J1;case 35664:return eT;case 35665:return tT;case 35666:return nT;case 35674:return iT;case 35675:return rT;case 35676:return sT;case 5124:case 35670:return aT;case 35667:case 35671:return oT;case 35668:case 35672:return lT;case 35669:case 35673:return cT;case 5125:return uT;case 36294:return dT;case 36295:return hT;case 36296:return fT;case 35678:case 36198:case 36298:case 36306:case 35682:return pT;case 35679:case 36299:case 36307:return mT;case 35680:case 36300:case 36308:case 36293:return gT;case 36289:case 36303:case 36311:case 36292:return _T}}class xT{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.setValue=Q1(n.type)}}class yT{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.size=n.size,this.setValue=vT(n.type)}}class ST{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,n,i){const r=this.seq;for(let s=0,a=r.length;s!==a;++s){const o=r[s];o.setValue(e,n[o.id],i)}}}const Pu=/(\w+)(\])?(\[|\.)?/g;function Pm(t,e){t.seq.push(e),t.map[e.id]=e}function MT(t,e,n){const i=t.name,r=i.length;for(Pu.lastIndex=0;;){const s=Pu.exec(i),a=Pu.lastIndex;let o=s[1];const l=s[2]==="]",c=s[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===r){Pm(n,c===void 0?new xT(o,t,e):new yT(o,t,e));break}else{let f=n.map[o];f===void 0&&(f=new ST(o),Pm(n,f)),n=f}}}class Cl{constructor(e,n){this.seq=[],this.map={};const i=e.getProgramParameter(n,e.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){const s=e.getActiveUniform(n,r),a=e.getUniformLocation(n,s.name);MT(s,a,this)}}setValue(e,n,i,r){const s=this.map[n];s!==void 0&&s.setValue(e,i,r)}setOptional(e,n,i){const r=n[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,n,i,r){for(let s=0,a=n.length;s!==a;++s){const o=n[s],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,r)}}static seqWithValue(e,n){const i=[];for(let r=0,s=e.length;r!==s;++r){const a=e[r];a.id in n&&i.push(a)}return i}}function Nm(t,e,n){const i=t.createShader(e);return t.shaderSource(i,n),t.compileShader(i),i}const ET=37297;let wT=0;function TT(t,e){const n=t.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,n.length);for(let a=r;a<s;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${n[a]}`)}return i.join(`
`)}function AT(t){const e=it.getPrimaries(it.workingColorSpace),n=it.getPrimaries(t);let i;switch(e===n?i="":e===nc&&n===tc?i="LinearDisplayP3ToLinearSRGB":e===tc&&n===nc&&(i="LinearSRGBToLinearDisplayP3"),t){case mr:case wc:return[i,"LinearTransferOETF"];case en:case Ef:return[i,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",t),[i,"LinearTransferOETF"]}}function Lm(t,e,n){const i=t.getShaderParameter(e,t.COMPILE_STATUS),r=t.getShaderInfoLog(e).trim();if(i&&r==="")return"";const s=/ERROR: 0:(\d+)/.exec(r);if(s){const a=parseInt(s[1]);return n.toUpperCase()+`

`+r+`

`+TT(t.getShaderSource(e),a)}else return r}function bT(t,e){const n=AT(e);return`vec4 ${t}( vec4 value ) { return ${n[0]}( ${n[1]}( value ) ); }`}function CT(t,e){let n;switch(e){case RS:n="Linear";break;case PS:n="Reinhard";break;case NS:n="Cineon";break;case LS:n="ACESFilmic";break;case IS:n="AgX";break;case US:n="Neutral";break;case DS:n="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),n="Linear"}return"vec3 "+t+"( vec3 color ) { return "+n+"ToneMapping( color ); }"}const Qo=new L;function RT(){it.getLuminanceCoefficients(Qo);const t=Qo.x.toFixed(4),e=Qo.y.toFixed(4),n=Qo.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${t}, ${e}, ${n} );`,"	return dot( weights, rgb );","}"].join(`
`)}function PT(t){return[t.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",t.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ea).join(`
`)}function NT(t){const e=[];for(const n in t){const i=t[n];i!==!1&&e.push("#define "+n+" "+i)}return e.join(`
`)}function LT(t,e){const n={},i=t.getProgramParameter(e,t.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=t.getActiveAttrib(e,r),a=s.name;let o=1;s.type===t.FLOAT_MAT2&&(o=2),s.type===t.FLOAT_MAT3&&(o=3),s.type===t.FLOAT_MAT4&&(o=4),n[a]={type:s.type,location:t.getAttribLocation(e,a),locationSize:o}}return n}function Ea(t){return t!==""}function Dm(t,e){const n=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return t.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Im(t,e){return t.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const DT=/^[ \t]*#include +<([\w\d./]+)>/gm;function vh(t){return t.replace(DT,UT)}const IT=new Map;function UT(t,e){let n=Ge[e];if(n===void 0){const i=IT.get(e);if(i!==void 0)n=Ge[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return vh(n)}const kT=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Um(t){return t.replace(kT,FT)}function FT(t,e,n,i){let r="";for(let s=parseInt(e);s<parseInt(n);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function km(t){let e=`precision ${t.precision} float;
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
#define LOW_PRECISION`),e}function OT(t){let e="SHADOWMAP_TYPE_BASIC";return t.shadowMapType===Av?e="SHADOWMAP_TYPE_PCF":t.shadowMapType===bv?e="SHADOWMAP_TYPE_PCF_SOFT":t.shadowMapType===yi&&(e="SHADOWMAP_TYPE_VSM"),e}function zT(t){let e="ENVMAP_TYPE_CUBE";if(t.envMap)switch(t.envMapMode){case js:case Ws:e="ENVMAP_TYPE_CUBE";break;case Ec:e="ENVMAP_TYPE_CUBE_UV";break}return e}function BT(t){let e="ENVMAP_MODE_REFLECTION";if(t.envMap)switch(t.envMapMode){case Ws:e="ENVMAP_MODE_REFRACTION";break}return e}function HT(t){let e="ENVMAP_BLENDING_NONE";if(t.envMap)switch(t.combine){case Cv:e="ENVMAP_BLENDING_MULTIPLY";break;case bS:e="ENVMAP_BLENDING_MIX";break;case CS:e="ENVMAP_BLENDING_ADD";break}return e}function GT(t){const e=t.envMapCubeUVHeight;if(e===null)return null;const n=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,n),7*16)),texelHeight:i,maxMip:n}}function VT(t,e,n,i){const r=t.getContext(),s=n.defines;let a=n.vertexShader,o=n.fragmentShader;const l=OT(n),c=zT(n),u=BT(n),f=HT(n),h=GT(n),p=PT(n),_=NT(s),v=r.createProgram();let m,d,x=n.glslVersion?"#version "+n.glslVersion+`
`:"";n.isRawShaderMaterial?(m=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,_].filter(Ea).join(`
`),m.length>0&&(m+=`
`),d=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,_].filter(Ea).join(`
`),d.length>0&&(d+=`
`)):(m=[km(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,_,n.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",n.batching?"#define USE_BATCHING":"",n.batchingColor?"#define USE_BATCHING_COLOR":"",n.instancing?"#define USE_INSTANCING":"",n.instancingColor?"#define USE_INSTANCING_COLOR":"",n.instancingMorph?"#define USE_INSTANCING_MORPH":"",n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+u:"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.displacementMap?"#define USE_DISPLACEMENTMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.mapUv?"#define MAP_UV "+n.mapUv:"",n.alphaMapUv?"#define ALPHAMAP_UV "+n.alphaMapUv:"",n.lightMapUv?"#define LIGHTMAP_UV "+n.lightMapUv:"",n.aoMapUv?"#define AOMAP_UV "+n.aoMapUv:"",n.emissiveMapUv?"#define EMISSIVEMAP_UV "+n.emissiveMapUv:"",n.bumpMapUv?"#define BUMPMAP_UV "+n.bumpMapUv:"",n.normalMapUv?"#define NORMALMAP_UV "+n.normalMapUv:"",n.displacementMapUv?"#define DISPLACEMENTMAP_UV "+n.displacementMapUv:"",n.metalnessMapUv?"#define METALNESSMAP_UV "+n.metalnessMapUv:"",n.roughnessMapUv?"#define ROUGHNESSMAP_UV "+n.roughnessMapUv:"",n.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+n.anisotropyMapUv:"",n.clearcoatMapUv?"#define CLEARCOATMAP_UV "+n.clearcoatMapUv:"",n.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+n.clearcoatNormalMapUv:"",n.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+n.clearcoatRoughnessMapUv:"",n.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+n.iridescenceMapUv:"",n.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+n.iridescenceThicknessMapUv:"",n.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+n.sheenColorMapUv:"",n.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+n.sheenRoughnessMapUv:"",n.specularMapUv?"#define SPECULARMAP_UV "+n.specularMapUv:"",n.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+n.specularColorMapUv:"",n.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+n.specularIntensityMapUv:"",n.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+n.transmissionMapUv:"",n.thicknessMapUv?"#define THICKNESSMAP_UV "+n.thicknessMapUv:"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.flatShading?"#define FLAT_SHADED":"",n.skinning?"#define USE_SKINNING":"",n.morphTargets?"#define USE_MORPHTARGETS":"",n.morphNormals&&n.flatShading===!1?"#define USE_MORPHNORMALS":"",n.morphColors?"#define USE_MORPHCOLORS":"",n.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+n.morphTextureStride:"",n.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+n.morphTargetsCount:"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.sizeAttenuation?"#define USE_SIZEATTENUATION":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",n.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ea).join(`
`),d=[km(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,_,n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",n.map?"#define USE_MAP":"",n.matcap?"#define USE_MATCAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+c:"",n.envMap?"#define "+u:"",n.envMap?"#define "+f:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoat?"#define USE_CLEARCOAT":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.dispersion?"#define USE_DISPERSION":"",n.iridescence?"#define USE_IRIDESCENCE":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaTest?"#define USE_ALPHATEST":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.sheen?"#define USE_SHEEN":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors||n.instancingColor||n.batchingColor?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.gradientMap?"#define USE_GRADIENTMAP":"",n.flatShading?"#define FLAT_SHADED":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",n.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",n.toneMapping!==lr?"#define TONE_MAPPING":"",n.toneMapping!==lr?Ge.tonemapping_pars_fragment:"",n.toneMapping!==lr?CT("toneMapping",n.toneMapping):"",n.dithering?"#define DITHERING":"",n.opaque?"#define OPAQUE":"",Ge.colorspace_pars_fragment,bT("linearToOutputTexel",n.outputColorSpace),RT(),n.useDepthPacking?"#define DEPTH_PACKING "+n.depthPacking:"",`
`].filter(Ea).join(`
`)),a=vh(a),a=Dm(a,n),a=Im(a,n),o=vh(o),o=Dm(o,n),o=Im(o,n),a=Um(a),o=Um(o),n.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,d=["#define varying in",n.glslVersion===Qp?"":"layout(location = 0) out highp vec4 pc_fragColor;",n.glslVersion===Qp?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+d);const y=x+m+a,M=x+d+o,P=Nm(r,r.VERTEX_SHADER,y),C=Nm(r,r.FRAGMENT_SHADER,M);r.attachShader(v,P),r.attachShader(v,C),n.index0AttributeName!==void 0?r.bindAttribLocation(v,0,n.index0AttributeName):n.morphTargets===!0&&r.bindAttribLocation(v,0,"position"),r.linkProgram(v);function A(w){if(t.debug.checkShaderErrors){const N=r.getProgramInfoLog(v).trim(),k=r.getShaderInfoLog(P).trim(),j=r.getShaderInfoLog(C).trim();let q=!0,W=!0;if(r.getProgramParameter(v,r.LINK_STATUS)===!1)if(q=!1,typeof t.debug.onShaderError=="function")t.debug.onShaderError(r,v,P,C);else{const ie=Lm(r,P,"vertex"),I=Lm(r,C,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(v,r.VALIDATE_STATUS)+`

Material Name: `+w.name+`
Material Type: `+w.type+`

Program Info Log: `+N+`
`+ie+`
`+I)}else N!==""?console.warn("THREE.WebGLProgram: Program Info Log:",N):(k===""||j==="")&&(W=!1);W&&(w.diagnostics={runnable:q,programLog:N,vertexShader:{log:k,prefix:m},fragmentShader:{log:j,prefix:d}})}r.deleteShader(P),r.deleteShader(C),b=new Cl(r,v),z=LT(r,v)}let b;this.getUniforms=function(){return b===void 0&&A(this),b};let z;this.getAttributes=function(){return z===void 0&&A(this),z};let S=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return S===!1&&(S=r.getProgramParameter(v,ET)),S},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(v),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=wT++,this.cacheKey=e,this.usedTimes=1,this.program=v,this.vertexShader=P,this.fragmentShader=C,this}let jT=0;class WT{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const n=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(n),s=this._getShaderStage(i),a=this._getShaderCacheForMaterial(e);return a.has(r)===!1&&(a.add(r),r.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(e){const n=this.materialCache.get(e);for(const i of n)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const n=this.materialCache;let i=n.get(e);return i===void 0&&(i=new Set,n.set(e,i)),i}_getShaderStage(e){const n=this.shaderCache;let i=n.get(e);return i===void 0&&(i=new XT(e),n.set(e,i)),i}}class XT{constructor(e){this.id=jT++,this.code=e,this.usedTimes=0}}function $T(t,e,n,i,r,s,a){const o=new Tf,l=new WT,c=new Set,u=[],f=r.logarithmicDepthBuffer,h=r.reverseDepthBuffer,p=r.vertexTextures;let _=r.precision;const v={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function m(S){return c.add(S),S===0?"uv":`uv${S}`}function d(S,w,N,k,j){const q=k.fog,W=j.geometry,ie=S.isMeshStandardMaterial?k.environment:null,I=(S.isMeshStandardMaterial?n:e).get(S.envMap||ie),ee=I&&I.mapping===Ec?I.image.height:null,ne=v[S.type];S.precision!==null&&(_=r.getMaxPrecision(S.precision),_!==S.precision&&console.warn("THREE.WebGLProgram.getParameters:",S.precision,"not supported, using",_,"instead."));const le=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,Te=le!==void 0?le.length:0;let ze=0;W.morphAttributes.position!==void 0&&(ze=1),W.morphAttributes.normal!==void 0&&(ze=2),W.morphAttributes.color!==void 0&&(ze=3);let X,Y,ue,de;if(ne){const ut=li[ne];X=ut.vertexShader,Y=ut.fragmentShader}else X=S.vertexShader,Y=S.fragmentShader,l.update(S),ue=l.getVertexShaderID(S),de=l.getFragmentShaderID(S);const Ie=t.getRenderTarget(),De=j.isInstancedMesh===!0,qe=j.isBatchedMesh===!0,Je=!!S.map,je=!!S.matcap,D=!!I,Re=!!S.aoMap,Xe=!!S.lightMap,Ze=!!S.bumpMap,Le=!!S.normalMap,et=!!S.displacementMap,Ue=!!S.emissiveMap,R=!!S.metalnessMap,E=!!S.roughnessMap,H=S.anisotropy>0,Q=S.clearcoat>0,se=S.dispersion>0,Z=S.iridescence>0,Me=S.sheen>0,fe=S.transmission>0,ve=H&&!!S.anisotropyMap,Ke=Q&&!!S.clearcoatMap,oe=Q&&!!S.clearcoatNormalMap,$=Q&&!!S.clearcoatRoughnessMap,J=Z&&!!S.iridescenceMap,te=Z&&!!S.iridescenceThicknessMap,re=Me&&!!S.sheenColorMap,Pe=Me&&!!S.sheenRoughnessMap,we=!!S.specularMap,$e=!!S.specularColorMap,U=!!S.specularIntensityMap,pe=fe&&!!S.transmissionMap,B=fe&&!!S.thicknessMap,K=!!S.gradientMap,me=!!S.alphaMap,ge=S.alphaTest>0,Be=!!S.alphaHash,rt=!!S.extensions;let Tt=lr;S.toneMapped&&(Ie===null||Ie.isXRRenderTarget===!0)&&(Tt=t.toneMapping);const We={shaderID:ne,shaderType:S.type,shaderName:S.name,vertexShader:X,fragmentShader:Y,defines:S.defines,customVertexShaderID:ue,customFragmentShaderID:de,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:_,batching:qe,batchingColor:qe&&j._colorsTexture!==null,instancing:De,instancingColor:De&&j.instanceColor!==null,instancingMorph:De&&j.morphTexture!==null,supportsVertexTextures:p,outputColorSpace:Ie===null?t.outputColorSpace:Ie.isXRRenderTarget===!0?Ie.texture.colorSpace:mr,alphaToCoverage:!!S.alphaToCoverage,map:Je,matcap:je,envMap:D,envMapMode:D&&I.mapping,envMapCubeUVHeight:ee,aoMap:Re,lightMap:Xe,bumpMap:Ze,normalMap:Le,displacementMap:p&&et,emissiveMap:Ue,normalMapObjectSpace:Le&&S.normalMapType===zS,normalMapTangentSpace:Le&&S.normalMapType===Bv,metalnessMap:R,roughnessMap:E,anisotropy:H,anisotropyMap:ve,clearcoat:Q,clearcoatMap:Ke,clearcoatNormalMap:oe,clearcoatRoughnessMap:$,dispersion:se,iridescence:Z,iridescenceMap:J,iridescenceThicknessMap:te,sheen:Me,sheenColorMap:re,sheenRoughnessMap:Pe,specularMap:we,specularColorMap:$e,specularIntensityMap:U,transmission:fe,transmissionMap:pe,thicknessMap:B,gradientMap:K,opaque:S.transparent===!1&&S.blending===Ds&&S.alphaToCoverage===!1,alphaMap:me,alphaTest:ge,alphaHash:Be,combine:S.combine,mapUv:Je&&m(S.map.channel),aoMapUv:Re&&m(S.aoMap.channel),lightMapUv:Xe&&m(S.lightMap.channel),bumpMapUv:Ze&&m(S.bumpMap.channel),normalMapUv:Le&&m(S.normalMap.channel),displacementMapUv:et&&m(S.displacementMap.channel),emissiveMapUv:Ue&&m(S.emissiveMap.channel),metalnessMapUv:R&&m(S.metalnessMap.channel),roughnessMapUv:E&&m(S.roughnessMap.channel),anisotropyMapUv:ve&&m(S.anisotropyMap.channel),clearcoatMapUv:Ke&&m(S.clearcoatMap.channel),clearcoatNormalMapUv:oe&&m(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:$&&m(S.clearcoatRoughnessMap.channel),iridescenceMapUv:J&&m(S.iridescenceMap.channel),iridescenceThicknessMapUv:te&&m(S.iridescenceThicknessMap.channel),sheenColorMapUv:re&&m(S.sheenColorMap.channel),sheenRoughnessMapUv:Pe&&m(S.sheenRoughnessMap.channel),specularMapUv:we&&m(S.specularMap.channel),specularColorMapUv:$e&&m(S.specularColorMap.channel),specularIntensityMapUv:U&&m(S.specularIntensityMap.channel),transmissionMapUv:pe&&m(S.transmissionMap.channel),thicknessMapUv:B&&m(S.thicknessMap.channel),alphaMapUv:me&&m(S.alphaMap.channel),vertexTangents:!!W.attributes.tangent&&(Le||H),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,pointsUvs:j.isPoints===!0&&!!W.attributes.uv&&(Je||me),fog:!!q,useFog:S.fog===!0,fogExp2:!!q&&q.isFogExp2,flatShading:S.flatShading===!0,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:f,reverseDepthBuffer:h,skinning:j.isSkinnedMesh===!0,morphTargets:W.morphAttributes.position!==void 0,morphNormals:W.morphAttributes.normal!==void 0,morphColors:W.morphAttributes.color!==void 0,morphTargetsCount:Te,morphTextureStride:ze,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:S.dithering,shadowMapEnabled:t.shadowMap.enabled&&N.length>0,shadowMapType:t.shadowMap.type,toneMapping:Tt,decodeVideoTexture:Je&&S.map.isVideoTexture===!0&&it.getTransfer(S.map.colorSpace)===_t,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===lt,flipSided:S.side===Yt,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:rt&&S.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(rt&&S.extensions.multiDraw===!0||qe)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return We.vertexUv1s=c.has(1),We.vertexUv2s=c.has(2),We.vertexUv3s=c.has(3),c.clear(),We}function x(S){const w=[];if(S.shaderID?w.push(S.shaderID):(w.push(S.customVertexShaderID),w.push(S.customFragmentShaderID)),S.defines!==void 0)for(const N in S.defines)w.push(N),w.push(S.defines[N]);return S.isRawShaderMaterial===!1&&(y(w,S),M(w,S),w.push(t.outputColorSpace)),w.push(S.customProgramCacheKey),w.join()}function y(S,w){S.push(w.precision),S.push(w.outputColorSpace),S.push(w.envMapMode),S.push(w.envMapCubeUVHeight),S.push(w.mapUv),S.push(w.alphaMapUv),S.push(w.lightMapUv),S.push(w.aoMapUv),S.push(w.bumpMapUv),S.push(w.normalMapUv),S.push(w.displacementMapUv),S.push(w.emissiveMapUv),S.push(w.metalnessMapUv),S.push(w.roughnessMapUv),S.push(w.anisotropyMapUv),S.push(w.clearcoatMapUv),S.push(w.clearcoatNormalMapUv),S.push(w.clearcoatRoughnessMapUv),S.push(w.iridescenceMapUv),S.push(w.iridescenceThicknessMapUv),S.push(w.sheenColorMapUv),S.push(w.sheenRoughnessMapUv),S.push(w.specularMapUv),S.push(w.specularColorMapUv),S.push(w.specularIntensityMapUv),S.push(w.transmissionMapUv),S.push(w.thicknessMapUv),S.push(w.combine),S.push(w.fogExp2),S.push(w.sizeAttenuation),S.push(w.morphTargetsCount),S.push(w.morphAttributeCount),S.push(w.numDirLights),S.push(w.numPointLights),S.push(w.numSpotLights),S.push(w.numSpotLightMaps),S.push(w.numHemiLights),S.push(w.numRectAreaLights),S.push(w.numDirLightShadows),S.push(w.numPointLightShadows),S.push(w.numSpotLightShadows),S.push(w.numSpotLightShadowsWithMaps),S.push(w.numLightProbes),S.push(w.shadowMapType),S.push(w.toneMapping),S.push(w.numClippingPlanes),S.push(w.numClipIntersection),S.push(w.depthPacking)}function M(S,w){o.disableAll(),w.supportsVertexTextures&&o.enable(0),w.instancing&&o.enable(1),w.instancingColor&&o.enable(2),w.instancingMorph&&o.enable(3),w.matcap&&o.enable(4),w.envMap&&o.enable(5),w.normalMapObjectSpace&&o.enable(6),w.normalMapTangentSpace&&o.enable(7),w.clearcoat&&o.enable(8),w.iridescence&&o.enable(9),w.alphaTest&&o.enable(10),w.vertexColors&&o.enable(11),w.vertexAlphas&&o.enable(12),w.vertexUv1s&&o.enable(13),w.vertexUv2s&&o.enable(14),w.vertexUv3s&&o.enable(15),w.vertexTangents&&o.enable(16),w.anisotropy&&o.enable(17),w.alphaHash&&o.enable(18),w.batching&&o.enable(19),w.dispersion&&o.enable(20),w.batchingColor&&o.enable(21),S.push(o.mask),o.disableAll(),w.fog&&o.enable(0),w.useFog&&o.enable(1),w.flatShading&&o.enable(2),w.logarithmicDepthBuffer&&o.enable(3),w.reverseDepthBuffer&&o.enable(4),w.skinning&&o.enable(5),w.morphTargets&&o.enable(6),w.morphNormals&&o.enable(7),w.morphColors&&o.enable(8),w.premultipliedAlpha&&o.enable(9),w.shadowMapEnabled&&o.enable(10),w.doubleSided&&o.enable(11),w.flipSided&&o.enable(12),w.useDepthPacking&&o.enable(13),w.dithering&&o.enable(14),w.transmission&&o.enable(15),w.sheen&&o.enable(16),w.opaque&&o.enable(17),w.pointsUvs&&o.enable(18),w.decodeVideoTexture&&o.enable(19),w.alphaToCoverage&&o.enable(20),S.push(o.mask)}function P(S){const w=v[S.type];let N;if(w){const k=li[w];N=PM.clone(k.uniforms)}else N=S.uniforms;return N}function C(S,w){let N;for(let k=0,j=u.length;k<j;k++){const q=u[k];if(q.cacheKey===w){N=q,++N.usedTimes;break}}return N===void 0&&(N=new VT(t,w,S,s),u.push(N)),N}function A(S){if(--S.usedTimes===0){const w=u.indexOf(S);u[w]=u[u.length-1],u.pop(),S.destroy()}}function b(S){l.remove(S)}function z(){l.dispose()}return{getParameters:d,getProgramCacheKey:x,getUniforms:P,acquireProgram:C,releaseProgram:A,releaseShaderCache:b,programs:u,dispose:z}}function YT(){let t=new WeakMap;function e(a){return t.has(a)}function n(a){let o=t.get(a);return o===void 0&&(o={},t.set(a,o)),o}function i(a){t.delete(a)}function r(a,o,l){t.get(a)[o]=l}function s(){t=new WeakMap}return{has:e,get:n,remove:i,update:r,dispose:s}}function qT(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.material.id!==e.material.id?t.material.id-e.material.id:t.z!==e.z?t.z-e.z:t.id-e.id}function Fm(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.z!==e.z?e.z-t.z:t.id-e.id}function Om(){const t=[];let e=0;const n=[],i=[],r=[];function s(){e=0,n.length=0,i.length=0,r.length=0}function a(f,h,p,_,v,m){let d=t[e];return d===void 0?(d={id:f.id,object:f,geometry:h,material:p,groupOrder:_,renderOrder:f.renderOrder,z:v,group:m},t[e]=d):(d.id=f.id,d.object=f,d.geometry=h,d.material=p,d.groupOrder=_,d.renderOrder=f.renderOrder,d.z=v,d.group=m),e++,d}function o(f,h,p,_,v,m){const d=a(f,h,p,_,v,m);p.transmission>0?i.push(d):p.transparent===!0?r.push(d):n.push(d)}function l(f,h,p,_,v,m){const d=a(f,h,p,_,v,m);p.transmission>0?i.unshift(d):p.transparent===!0?r.unshift(d):n.unshift(d)}function c(f,h){n.length>1&&n.sort(f||qT),i.length>1&&i.sort(h||Fm),r.length>1&&r.sort(h||Fm)}function u(){for(let f=e,h=t.length;f<h;f++){const p=t[f];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:n,transmissive:i,transparent:r,init:s,push:o,unshift:l,finish:u,sort:c}}function KT(){let t=new WeakMap;function e(i,r){const s=t.get(i);let a;return s===void 0?(a=new Om,t.set(i,[a])):r>=s.length?(a=new Om,s.push(a)):a=s[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}function ZT(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={direction:new L,color:new Ce};break;case"SpotLight":n={position:new L,direction:new L,color:new Ce,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":n={position:new L,color:new Ce,distance:0,decay:0};break;case"HemisphereLight":n={direction:new L,skyColor:new Ce,groundColor:new Ce};break;case"RectAreaLight":n={color:new Ce,position:new L,halfWidth:new L,halfHeight:new L};break}return t[e.id]=n,n}}}function QT(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new He};break;case"SpotLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new He};break;case"PointLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new He,shadowCameraNear:1,shadowCameraFar:1e3};break}return t[e.id]=n,n}}}let JT=0;function eA(t,e){return(e.castShadow?2:0)-(t.castShadow?2:0)+(e.map?1:0)-(t.map?1:0)}function tA(t){const e=new ZT,n=QT(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new L);const r=new L,s=new ht,a=new ht;function o(c){let u=0,f=0,h=0;for(let z=0;z<9;z++)i.probe[z].set(0,0,0);let p=0,_=0,v=0,m=0,d=0,x=0,y=0,M=0,P=0,C=0,A=0;c.sort(eA);for(let z=0,S=c.length;z<S;z++){const w=c[z],N=w.color,k=w.intensity,j=w.distance,q=w.shadow&&w.shadow.map?w.shadow.map.texture:null;if(w.isAmbientLight)u+=N.r*k,f+=N.g*k,h+=N.b*k;else if(w.isLightProbe){for(let W=0;W<9;W++)i.probe[W].addScaledVector(w.sh.coefficients[W],k);A++}else if(w.isDirectionalLight){const W=e.get(w);if(W.color.copy(w.color).multiplyScalar(w.intensity),w.castShadow){const ie=w.shadow,I=n.get(w);I.shadowIntensity=ie.intensity,I.shadowBias=ie.bias,I.shadowNormalBias=ie.normalBias,I.shadowRadius=ie.radius,I.shadowMapSize=ie.mapSize,i.directionalShadow[p]=I,i.directionalShadowMap[p]=q,i.directionalShadowMatrix[p]=w.shadow.matrix,x++}i.directional[p]=W,p++}else if(w.isSpotLight){const W=e.get(w);W.position.setFromMatrixPosition(w.matrixWorld),W.color.copy(N).multiplyScalar(k),W.distance=j,W.coneCos=Math.cos(w.angle),W.penumbraCos=Math.cos(w.angle*(1-w.penumbra)),W.decay=w.decay,i.spot[v]=W;const ie=w.shadow;if(w.map&&(i.spotLightMap[P]=w.map,P++,ie.updateMatrices(w),w.castShadow&&C++),i.spotLightMatrix[v]=ie.matrix,w.castShadow){const I=n.get(w);I.shadowIntensity=ie.intensity,I.shadowBias=ie.bias,I.shadowNormalBias=ie.normalBias,I.shadowRadius=ie.radius,I.shadowMapSize=ie.mapSize,i.spotShadow[v]=I,i.spotShadowMap[v]=q,M++}v++}else if(w.isRectAreaLight){const W=e.get(w);W.color.copy(N).multiplyScalar(k),W.halfWidth.set(w.width*.5,0,0),W.halfHeight.set(0,w.height*.5,0),i.rectArea[m]=W,m++}else if(w.isPointLight){const W=e.get(w);if(W.color.copy(w.color).multiplyScalar(w.intensity),W.distance=w.distance,W.decay=w.decay,w.castShadow){const ie=w.shadow,I=n.get(w);I.shadowIntensity=ie.intensity,I.shadowBias=ie.bias,I.shadowNormalBias=ie.normalBias,I.shadowRadius=ie.radius,I.shadowMapSize=ie.mapSize,I.shadowCameraNear=ie.camera.near,I.shadowCameraFar=ie.camera.far,i.pointShadow[_]=I,i.pointShadowMap[_]=q,i.pointShadowMatrix[_]=w.shadow.matrix,y++}i.point[_]=W,_++}else if(w.isHemisphereLight){const W=e.get(w);W.skyColor.copy(w.color).multiplyScalar(k),W.groundColor.copy(w.groundColor).multiplyScalar(k),i.hemi[d]=W,d++}}m>0&&(t.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=he.LTC_FLOAT_1,i.rectAreaLTC2=he.LTC_FLOAT_2):(i.rectAreaLTC1=he.LTC_HALF_1,i.rectAreaLTC2=he.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=f,i.ambient[2]=h;const b=i.hash;(b.directionalLength!==p||b.pointLength!==_||b.spotLength!==v||b.rectAreaLength!==m||b.hemiLength!==d||b.numDirectionalShadows!==x||b.numPointShadows!==y||b.numSpotShadows!==M||b.numSpotMaps!==P||b.numLightProbes!==A)&&(i.directional.length=p,i.spot.length=v,i.rectArea.length=m,i.point.length=_,i.hemi.length=d,i.directionalShadow.length=x,i.directionalShadowMap.length=x,i.pointShadow.length=y,i.pointShadowMap.length=y,i.spotShadow.length=M,i.spotShadowMap.length=M,i.directionalShadowMatrix.length=x,i.pointShadowMatrix.length=y,i.spotLightMatrix.length=M+P-C,i.spotLightMap.length=P,i.numSpotLightShadowsWithMaps=C,i.numLightProbes=A,b.directionalLength=p,b.pointLength=_,b.spotLength=v,b.rectAreaLength=m,b.hemiLength=d,b.numDirectionalShadows=x,b.numPointShadows=y,b.numSpotShadows=M,b.numSpotMaps=P,b.numLightProbes=A,i.version=JT++)}function l(c,u){let f=0,h=0,p=0,_=0,v=0;const m=u.matrixWorldInverse;for(let d=0,x=c.length;d<x;d++){const y=c[d];if(y.isDirectionalLight){const M=i.directional[f];M.direction.setFromMatrixPosition(y.matrixWorld),r.setFromMatrixPosition(y.target.matrixWorld),M.direction.sub(r),M.direction.transformDirection(m),f++}else if(y.isSpotLight){const M=i.spot[p];M.position.setFromMatrixPosition(y.matrixWorld),M.position.applyMatrix4(m),M.direction.setFromMatrixPosition(y.matrixWorld),r.setFromMatrixPosition(y.target.matrixWorld),M.direction.sub(r),M.direction.transformDirection(m),p++}else if(y.isRectAreaLight){const M=i.rectArea[_];M.position.setFromMatrixPosition(y.matrixWorld),M.position.applyMatrix4(m),a.identity(),s.copy(y.matrixWorld),s.premultiply(m),a.extractRotation(s),M.halfWidth.set(y.width*.5,0,0),M.halfHeight.set(0,y.height*.5,0),M.halfWidth.applyMatrix4(a),M.halfHeight.applyMatrix4(a),_++}else if(y.isPointLight){const M=i.point[h];M.position.setFromMatrixPosition(y.matrixWorld),M.position.applyMatrix4(m),h++}else if(y.isHemisphereLight){const M=i.hemi[v];M.direction.setFromMatrixPosition(y.matrixWorld),M.direction.transformDirection(m),v++}}}return{setup:o,setupView:l,state:i}}function zm(t){const e=new tA(t),n=[],i=[];function r(u){c.camera=u,n.length=0,i.length=0}function s(u){n.push(u)}function a(u){i.push(u)}function o(){e.setup(n)}function l(u){e.setupView(n,u)}const c={lightsArray:n,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:c,setupLights:o,setupLightsView:l,pushLight:s,pushShadow:a}}function nA(t){let e=new WeakMap;function n(r,s=0){const a=e.get(r);let o;return a===void 0?(o=new zm(t),e.set(r,[o])):s>=a.length?(o=new zm(t),a.push(o)):o=a[s],o}function i(){e=new WeakMap}return{get:n,dispose:i}}class iA extends gr{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=FS,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class rA extends gr{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const sA=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,aA=`uniform sampler2D shadow_pass;
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
}`;function oA(t,e,n){let i=new Af;const r=new He,s=new He,a=new Ct,o=new iA({depthPacking:OS}),l=new rA,c={},u=n.maxTextureSize,f={[dr]:Yt,[Yt]:dr,[lt]:lt},h=new Vn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new He},radius:{value:4}},vertexShader:sA,fragmentShader:aA}),p=h.clone();p.defines.HORIZONTAL_PASS=1;const _=new ct;_.setAttribute("position",new vn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new Ne(_,h),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Av;let d=this.type;this.render=function(C,A,b){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||C.length===0)return;const z=t.getRenderTarget(),S=t.getActiveCubeFace(),w=t.getActiveMipmapLevel(),N=t.state;N.setBlending(or),N.buffers.color.setClear(1,1,1,1),N.buffers.depth.setTest(!0),N.setScissorTest(!1);const k=d!==yi&&this.type===yi,j=d===yi&&this.type!==yi;for(let q=0,W=C.length;q<W;q++){const ie=C[q],I=ie.shadow;if(I===void 0){console.warn("THREE.WebGLShadowMap:",ie,"has no shadow.");continue}if(I.autoUpdate===!1&&I.needsUpdate===!1)continue;r.copy(I.mapSize);const ee=I.getFrameExtents();if(r.multiply(ee),s.copy(I.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/ee.x),r.x=s.x*ee.x,I.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/ee.y),r.y=s.y*ee.y,I.mapSize.y=s.y)),I.map===null||k===!0||j===!0){const le=this.type!==yi?{minFilter:zn,magFilter:zn}:{};I.map!==null&&I.map.dispose(),I.map=new jr(r.x,r.y,le),I.map.texture.name=ie.name+".shadowMap",I.camera.updateProjectionMatrix()}t.setRenderTarget(I.map),t.clear();const ne=I.getViewportCount();for(let le=0;le<ne;le++){const Te=I.getViewport(le);a.set(s.x*Te.x,s.y*Te.y,s.x*Te.z,s.y*Te.w),N.viewport(a),I.updateMatrices(ie,le),i=I.getFrustum(),M(A,b,I.camera,ie,this.type)}I.isPointLightShadow!==!0&&this.type===yi&&x(I,b),I.needsUpdate=!1}d=this.type,m.needsUpdate=!1,t.setRenderTarget(z,S,w)};function x(C,A){const b=e.update(v);h.defines.VSM_SAMPLES!==C.blurSamples&&(h.defines.VSM_SAMPLES=C.blurSamples,p.defines.VSM_SAMPLES=C.blurSamples,h.needsUpdate=!0,p.needsUpdate=!0),C.mapPass===null&&(C.mapPass=new jr(r.x,r.y)),h.uniforms.shadow_pass.value=C.map.texture,h.uniforms.resolution.value=C.mapSize,h.uniforms.radius.value=C.radius,t.setRenderTarget(C.mapPass),t.clear(),t.renderBufferDirect(A,null,b,h,v,null),p.uniforms.shadow_pass.value=C.mapPass.texture,p.uniforms.resolution.value=C.mapSize,p.uniforms.radius.value=C.radius,t.setRenderTarget(C.map),t.clear(),t.renderBufferDirect(A,null,b,p,v,null)}function y(C,A,b,z){let S=null;const w=b.isPointLight===!0?C.customDistanceMaterial:C.customDepthMaterial;if(w!==void 0)S=w;else if(S=b.isPointLight===!0?l:o,t.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){const N=S.uuid,k=A.uuid;let j=c[N];j===void 0&&(j={},c[N]=j);let q=j[k];q===void 0&&(q=S.clone(),j[k]=q,A.addEventListener("dispose",P)),S=q}if(S.visible=A.visible,S.wireframe=A.wireframe,z===yi?S.side=A.shadowSide!==null?A.shadowSide:A.side:S.side=A.shadowSide!==null?A.shadowSide:f[A.side],S.alphaMap=A.alphaMap,S.alphaTest=A.alphaTest,S.map=A.map,S.clipShadows=A.clipShadows,S.clippingPlanes=A.clippingPlanes,S.clipIntersection=A.clipIntersection,S.displacementMap=A.displacementMap,S.displacementScale=A.displacementScale,S.displacementBias=A.displacementBias,S.wireframeLinewidth=A.wireframeLinewidth,S.linewidth=A.linewidth,b.isPointLight===!0&&S.isMeshDistanceMaterial===!0){const N=t.properties.get(S);N.light=b}return S}function M(C,A,b,z,S){if(C.visible===!1)return;if(C.layers.test(A.layers)&&(C.isMesh||C.isLine||C.isPoints)&&(C.castShadow||C.receiveShadow&&S===yi)&&(!C.frustumCulled||i.intersectsObject(C))){C.modelViewMatrix.multiplyMatrices(b.matrixWorldInverse,C.matrixWorld);const k=e.update(C),j=C.material;if(Array.isArray(j)){const q=k.groups;for(let W=0,ie=q.length;W<ie;W++){const I=q[W],ee=j[I.materialIndex];if(ee&&ee.visible){const ne=y(C,ee,z,S);C.onBeforeShadow(t,C,A,b,k,ne,I),t.renderBufferDirect(b,null,k,ne,C,I),C.onAfterShadow(t,C,A,b,k,ne,I)}}}else if(j.visible){const q=y(C,j,z,S);C.onBeforeShadow(t,C,A,b,k,q,null),t.renderBufferDirect(b,null,k,q,C,null),C.onAfterShadow(t,C,A,b,k,q,null)}}const N=C.children;for(let k=0,j=N.length;k<j;k++)M(N[k],A,b,z,S)}function P(C){C.target.removeEventListener("dispose",P);for(const b in c){const z=c[b],S=C.target.uuid;S in z&&(z[S].dispose(),delete z[S])}}}const lA={[Id]:Ud,[kd]:zd,[Fd]:Bd,[Vs]:Od,[Ud]:Id,[zd]:kd,[Bd]:Fd,[Od]:Vs};function cA(t){function e(){let U=!1;const pe=new Ct;let B=null;const K=new Ct(0,0,0,0);return{setMask:function(me){B!==me&&!U&&(t.colorMask(me,me,me,me),B=me)},setLocked:function(me){U=me},setClear:function(me,ge,Be,rt,Tt){Tt===!0&&(me*=rt,ge*=rt,Be*=rt),pe.set(me,ge,Be,rt),K.equals(pe)===!1&&(t.clearColor(me,ge,Be,rt),K.copy(pe))},reset:function(){U=!1,B=null,K.set(-1,0,0,0)}}}function n(){let U=!1,pe=!1,B=null,K=null,me=null;return{setReversed:function(ge){pe=ge},setTest:function(ge){ge?ue(t.DEPTH_TEST):de(t.DEPTH_TEST)},setMask:function(ge){B!==ge&&!U&&(t.depthMask(ge),B=ge)},setFunc:function(ge){if(pe&&(ge=lA[ge]),K!==ge){switch(ge){case Id:t.depthFunc(t.NEVER);break;case Ud:t.depthFunc(t.ALWAYS);break;case kd:t.depthFunc(t.LESS);break;case Vs:t.depthFunc(t.LEQUAL);break;case Fd:t.depthFunc(t.EQUAL);break;case Od:t.depthFunc(t.GEQUAL);break;case zd:t.depthFunc(t.GREATER);break;case Bd:t.depthFunc(t.NOTEQUAL);break;default:t.depthFunc(t.LEQUAL)}K=ge}},setLocked:function(ge){U=ge},setClear:function(ge){me!==ge&&(t.clearDepth(ge),me=ge)},reset:function(){U=!1,B=null,K=null,me=null}}}function i(){let U=!1,pe=null,B=null,K=null,me=null,ge=null,Be=null,rt=null,Tt=null;return{setTest:function(We){U||(We?ue(t.STENCIL_TEST):de(t.STENCIL_TEST))},setMask:function(We){pe!==We&&!U&&(t.stencilMask(We),pe=We)},setFunc:function(We,ut,zt){(B!==We||K!==ut||me!==zt)&&(t.stencilFunc(We,ut,zt),B=We,K=ut,me=zt)},setOp:function(We,ut,zt){(ge!==We||Be!==ut||rt!==zt)&&(t.stencilOp(We,ut,zt),ge=We,Be=ut,rt=zt)},setLocked:function(We){U=We},setClear:function(We){Tt!==We&&(t.clearStencil(We),Tt=We)},reset:function(){U=!1,pe=null,B=null,K=null,me=null,ge=null,Be=null,rt=null,Tt=null}}}const r=new e,s=new n,a=new i,o=new WeakMap,l=new WeakMap;let c={},u={},f=new WeakMap,h=[],p=null,_=!1,v=null,m=null,d=null,x=null,y=null,M=null,P=null,C=new Ce(0,0,0),A=0,b=!1,z=null,S=null,w=null,N=null,k=null;const j=t.getParameter(t.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let q=!1,W=0;const ie=t.getParameter(t.VERSION);ie.indexOf("WebGL")!==-1?(W=parseFloat(/^WebGL (\d)/.exec(ie)[1]),q=W>=1):ie.indexOf("OpenGL ES")!==-1&&(W=parseFloat(/^OpenGL ES (\d)/.exec(ie)[1]),q=W>=2);let I=null,ee={};const ne=t.getParameter(t.SCISSOR_BOX),le=t.getParameter(t.VIEWPORT),Te=new Ct().fromArray(ne),ze=new Ct().fromArray(le);function X(U,pe,B,K){const me=new Uint8Array(4),ge=t.createTexture();t.bindTexture(U,ge),t.texParameteri(U,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(U,t.TEXTURE_MAG_FILTER,t.NEAREST);for(let Be=0;Be<B;Be++)U===t.TEXTURE_3D||U===t.TEXTURE_2D_ARRAY?t.texImage3D(pe,0,t.RGBA,1,1,K,0,t.RGBA,t.UNSIGNED_BYTE,me):t.texImage2D(pe+Be,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,me);return ge}const Y={};Y[t.TEXTURE_2D]=X(t.TEXTURE_2D,t.TEXTURE_2D,1),Y[t.TEXTURE_CUBE_MAP]=X(t.TEXTURE_CUBE_MAP,t.TEXTURE_CUBE_MAP_POSITIVE_X,6),Y[t.TEXTURE_2D_ARRAY]=X(t.TEXTURE_2D_ARRAY,t.TEXTURE_2D_ARRAY,1,1),Y[t.TEXTURE_3D]=X(t.TEXTURE_3D,t.TEXTURE_3D,1,1),r.setClear(0,0,0,1),s.setClear(1),a.setClear(0),ue(t.DEPTH_TEST),s.setFunc(Vs),Xe(!1),Ze(Yp),ue(t.CULL_FACE),D(or);function ue(U){c[U]!==!0&&(t.enable(U),c[U]=!0)}function de(U){c[U]!==!1&&(t.disable(U),c[U]=!1)}function Ie(U,pe){return u[U]!==pe?(t.bindFramebuffer(U,pe),u[U]=pe,U===t.DRAW_FRAMEBUFFER&&(u[t.FRAMEBUFFER]=pe),U===t.FRAMEBUFFER&&(u[t.DRAW_FRAMEBUFFER]=pe),!0):!1}function De(U,pe){let B=h,K=!1;if(U){B=f.get(pe),B===void 0&&(B=[],f.set(pe,B));const me=U.textures;if(B.length!==me.length||B[0]!==t.COLOR_ATTACHMENT0){for(let ge=0,Be=me.length;ge<Be;ge++)B[ge]=t.COLOR_ATTACHMENT0+ge;B.length=me.length,K=!0}}else B[0]!==t.BACK&&(B[0]=t.BACK,K=!0);K&&t.drawBuffers(B)}function qe(U){return p!==U?(t.useProgram(U),p=U,!0):!1}const Je={[Cr]:t.FUNC_ADD,[uS]:t.FUNC_SUBTRACT,[dS]:t.FUNC_REVERSE_SUBTRACT};Je[hS]=t.MIN,Je[fS]=t.MAX;const je={[pS]:t.ZERO,[mS]:t.ONE,[gS]:t.SRC_COLOR,[Ld]:t.SRC_ALPHA,[MS]:t.SRC_ALPHA_SATURATE,[yS]:t.DST_COLOR,[vS]:t.DST_ALPHA,[_S]:t.ONE_MINUS_SRC_COLOR,[Dd]:t.ONE_MINUS_SRC_ALPHA,[SS]:t.ONE_MINUS_DST_COLOR,[xS]:t.ONE_MINUS_DST_ALPHA,[ES]:t.CONSTANT_COLOR,[wS]:t.ONE_MINUS_CONSTANT_COLOR,[TS]:t.CONSTANT_ALPHA,[AS]:t.ONE_MINUS_CONSTANT_ALPHA};function D(U,pe,B,K,me,ge,Be,rt,Tt,We){if(U===or){_===!0&&(de(t.BLEND),_=!1);return}if(_===!1&&(ue(t.BLEND),_=!0),U!==cS){if(U!==v||We!==b){if((m!==Cr||y!==Cr)&&(t.blendEquation(t.FUNC_ADD),m=Cr,y=Cr),We)switch(U){case Ds:t.blendFuncSeparate(t.ONE,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case Jl:t.blendFunc(t.ONE,t.ONE);break;case qp:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case Kp:t.blendFuncSeparate(t.ZERO,t.SRC_COLOR,t.ZERO,t.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}else switch(U){case Ds:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case Jl:t.blendFunc(t.SRC_ALPHA,t.ONE);break;case qp:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case Kp:t.blendFunc(t.ZERO,t.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}d=null,x=null,M=null,P=null,C.set(0,0,0),A=0,v=U,b=We}return}me=me||pe,ge=ge||B,Be=Be||K,(pe!==m||me!==y)&&(t.blendEquationSeparate(Je[pe],Je[me]),m=pe,y=me),(B!==d||K!==x||ge!==M||Be!==P)&&(t.blendFuncSeparate(je[B],je[K],je[ge],je[Be]),d=B,x=K,M=ge,P=Be),(rt.equals(C)===!1||Tt!==A)&&(t.blendColor(rt.r,rt.g,rt.b,Tt),C.copy(rt),A=Tt),v=U,b=!1}function Re(U,pe){U.side===lt?de(t.CULL_FACE):ue(t.CULL_FACE);let B=U.side===Yt;pe&&(B=!B),Xe(B),U.blending===Ds&&U.transparent===!1?D(or):D(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),s.setFunc(U.depthFunc),s.setTest(U.depthTest),s.setMask(U.depthWrite),r.setMask(U.colorWrite);const K=U.stencilWrite;a.setTest(K),K&&(a.setMask(U.stencilWriteMask),a.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),a.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),et(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?ue(t.SAMPLE_ALPHA_TO_COVERAGE):de(t.SAMPLE_ALPHA_TO_COVERAGE)}function Xe(U){z!==U&&(U?t.frontFace(t.CW):t.frontFace(t.CCW),z=U)}function Ze(U){U!==oS?(ue(t.CULL_FACE),U!==S&&(U===Yp?t.cullFace(t.BACK):U===lS?t.cullFace(t.FRONT):t.cullFace(t.FRONT_AND_BACK))):de(t.CULL_FACE),S=U}function Le(U){U!==w&&(q&&t.lineWidth(U),w=U)}function et(U,pe,B){U?(ue(t.POLYGON_OFFSET_FILL),(N!==pe||k!==B)&&(t.polygonOffset(pe,B),N=pe,k=B)):de(t.POLYGON_OFFSET_FILL)}function Ue(U){U?ue(t.SCISSOR_TEST):de(t.SCISSOR_TEST)}function R(U){U===void 0&&(U=t.TEXTURE0+j-1),I!==U&&(t.activeTexture(U),I=U)}function E(U,pe,B){B===void 0&&(I===null?B=t.TEXTURE0+j-1:B=I);let K=ee[B];K===void 0&&(K={type:void 0,texture:void 0},ee[B]=K),(K.type!==U||K.texture!==pe)&&(I!==B&&(t.activeTexture(B),I=B),t.bindTexture(U,pe||Y[U]),K.type=U,K.texture=pe)}function H(){const U=ee[I];U!==void 0&&U.type!==void 0&&(t.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function Q(){try{t.compressedTexImage2D.apply(t,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function se(){try{t.compressedTexImage3D.apply(t,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Z(){try{t.texSubImage2D.apply(t,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Me(){try{t.texSubImage3D.apply(t,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function fe(){try{t.compressedTexSubImage2D.apply(t,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ve(){try{t.compressedTexSubImage3D.apply(t,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Ke(){try{t.texStorage2D.apply(t,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function oe(){try{t.texStorage3D.apply(t,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function $(){try{t.texImage2D.apply(t,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function J(){try{t.texImage3D.apply(t,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function te(U){Te.equals(U)===!1&&(t.scissor(U.x,U.y,U.z,U.w),Te.copy(U))}function re(U){ze.equals(U)===!1&&(t.viewport(U.x,U.y,U.z,U.w),ze.copy(U))}function Pe(U,pe){let B=l.get(pe);B===void 0&&(B=new WeakMap,l.set(pe,B));let K=B.get(U);K===void 0&&(K=t.getUniformBlockIndex(pe,U.name),B.set(U,K))}function we(U,pe){const K=l.get(pe).get(U);o.get(pe)!==K&&(t.uniformBlockBinding(pe,K,U.__bindingPointIndex),o.set(pe,K))}function $e(){t.disable(t.BLEND),t.disable(t.CULL_FACE),t.disable(t.DEPTH_TEST),t.disable(t.POLYGON_OFFSET_FILL),t.disable(t.SCISSOR_TEST),t.disable(t.STENCIL_TEST),t.disable(t.SAMPLE_ALPHA_TO_COVERAGE),t.blendEquation(t.FUNC_ADD),t.blendFunc(t.ONE,t.ZERO),t.blendFuncSeparate(t.ONE,t.ZERO,t.ONE,t.ZERO),t.blendColor(0,0,0,0),t.colorMask(!0,!0,!0,!0),t.clearColor(0,0,0,0),t.depthMask(!0),t.depthFunc(t.LESS),t.clearDepth(1),t.stencilMask(4294967295),t.stencilFunc(t.ALWAYS,0,4294967295),t.stencilOp(t.KEEP,t.KEEP,t.KEEP),t.clearStencil(0),t.cullFace(t.BACK),t.frontFace(t.CCW),t.polygonOffset(0,0),t.activeTexture(t.TEXTURE0),t.bindFramebuffer(t.FRAMEBUFFER,null),t.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),t.bindFramebuffer(t.READ_FRAMEBUFFER,null),t.useProgram(null),t.lineWidth(1),t.scissor(0,0,t.canvas.width,t.canvas.height),t.viewport(0,0,t.canvas.width,t.canvas.height),c={},I=null,ee={},u={},f=new WeakMap,h=[],p=null,_=!1,v=null,m=null,d=null,x=null,y=null,M=null,P=null,C=new Ce(0,0,0),A=0,b=!1,z=null,S=null,w=null,N=null,k=null,Te.set(0,0,t.canvas.width,t.canvas.height),ze.set(0,0,t.canvas.width,t.canvas.height),r.reset(),s.reset(),a.reset()}return{buffers:{color:r,depth:s,stencil:a},enable:ue,disable:de,bindFramebuffer:Ie,drawBuffers:De,useProgram:qe,setBlending:D,setMaterial:Re,setFlipSided:Xe,setCullFace:Ze,setLineWidth:Le,setPolygonOffset:et,setScissorTest:Ue,activeTexture:R,bindTexture:E,unbindTexture:H,compressedTexImage2D:Q,compressedTexImage3D:se,texImage2D:$,texImage3D:J,updateUBOMapping:Pe,uniformBlockBinding:we,texStorage2D:Ke,texStorage3D:oe,texSubImage2D:Z,texSubImage3D:Me,compressedTexSubImage2D:fe,compressedTexSubImage3D:ve,scissor:te,viewport:re,reset:$e}}function Bm(t,e,n,i){const r=uA(i);switch(n){case Dv:return t*e;case Uv:return t*e;case kv:return t*e*2;case Fv:return t*e/r.components*r.byteLength;case yf:return t*e/r.components*r.byteLength;case Ov:return t*e*2/r.components*r.byteLength;case Sf:return t*e*2/r.components*r.byteLength;case Iv:return t*e*3/r.components*r.byteLength;case ni:return t*e*4/r.components*r.byteLength;case Mf:return t*e*4/r.components*r.byteLength;case Ml:case El:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case wl:case Tl:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case Xd:case Yd:return Math.max(t,16)*Math.max(e,8)/4;case Wd:case $d:return Math.max(t,8)*Math.max(e,8)/2;case qd:case Kd:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case Zd:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case Qd:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case Jd:return Math.floor((t+4)/5)*Math.floor((e+3)/4)*16;case eh:return Math.floor((t+4)/5)*Math.floor((e+4)/5)*16;case th:return Math.floor((t+5)/6)*Math.floor((e+4)/5)*16;case nh:return Math.floor((t+5)/6)*Math.floor((e+5)/6)*16;case ih:return Math.floor((t+7)/8)*Math.floor((e+4)/5)*16;case rh:return Math.floor((t+7)/8)*Math.floor((e+5)/6)*16;case sh:return Math.floor((t+7)/8)*Math.floor((e+7)/8)*16;case ah:return Math.floor((t+9)/10)*Math.floor((e+4)/5)*16;case oh:return Math.floor((t+9)/10)*Math.floor((e+5)/6)*16;case lh:return Math.floor((t+9)/10)*Math.floor((e+7)/8)*16;case ch:return Math.floor((t+9)/10)*Math.floor((e+9)/10)*16;case uh:return Math.floor((t+11)/12)*Math.floor((e+9)/10)*16;case dh:return Math.floor((t+11)/12)*Math.floor((e+11)/12)*16;case Al:case hh:case fh:return Math.ceil(t/4)*Math.ceil(e/4)*16;case zv:case ph:return Math.ceil(t/4)*Math.ceil(e/4)*8;case mh:case gh:return Math.ceil(t/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${n} format.`)}function uA(t){switch(t){case Di:case Pv:return{byteLength:1,components:1};case Ja:case Nv:case oo:return{byteLength:2,components:1};case vf:case xf:return{byteLength:2,components:4};case Vr:case _f:case Ti:return{byteLength:4,components:1};case Lv:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${t}.`)}function dA(t,e,n,i,r,s,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new He,u=new WeakMap;let f;const h=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(R,E){return p?new OffscreenCanvas(R,E):to("canvas")}function v(R,E,H){let Q=1;const se=Ue(R);if((se.width>H||se.height>H)&&(Q=H/Math.max(se.width,se.height)),Q<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){const Z=Math.floor(Q*se.width),Me=Math.floor(Q*se.height);f===void 0&&(f=_(Z,Me));const fe=E?_(Z,Me):f;return fe.width=Z,fe.height=Me,fe.getContext("2d").drawImage(R,0,0,Z,Me),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+se.width+"x"+se.height+") to ("+Z+"x"+Me+")."),fe}else return"data"in R&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+se.width+"x"+se.height+")."),R;return R}function m(R){return R.generateMipmaps&&R.minFilter!==zn&&R.minFilter!==ei}function d(R){t.generateMipmap(R)}function x(R,E,H,Q,se=!1){if(R!==null){if(t[R]!==void 0)return t[R];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let Z=E;if(E===t.RED&&(H===t.FLOAT&&(Z=t.R32F),H===t.HALF_FLOAT&&(Z=t.R16F),H===t.UNSIGNED_BYTE&&(Z=t.R8)),E===t.RED_INTEGER&&(H===t.UNSIGNED_BYTE&&(Z=t.R8UI),H===t.UNSIGNED_SHORT&&(Z=t.R16UI),H===t.UNSIGNED_INT&&(Z=t.R32UI),H===t.BYTE&&(Z=t.R8I),H===t.SHORT&&(Z=t.R16I),H===t.INT&&(Z=t.R32I)),E===t.RG&&(H===t.FLOAT&&(Z=t.RG32F),H===t.HALF_FLOAT&&(Z=t.RG16F),H===t.UNSIGNED_BYTE&&(Z=t.RG8)),E===t.RG_INTEGER&&(H===t.UNSIGNED_BYTE&&(Z=t.RG8UI),H===t.UNSIGNED_SHORT&&(Z=t.RG16UI),H===t.UNSIGNED_INT&&(Z=t.RG32UI),H===t.BYTE&&(Z=t.RG8I),H===t.SHORT&&(Z=t.RG16I),H===t.INT&&(Z=t.RG32I)),E===t.RGB_INTEGER&&(H===t.UNSIGNED_BYTE&&(Z=t.RGB8UI),H===t.UNSIGNED_SHORT&&(Z=t.RGB16UI),H===t.UNSIGNED_INT&&(Z=t.RGB32UI),H===t.BYTE&&(Z=t.RGB8I),H===t.SHORT&&(Z=t.RGB16I),H===t.INT&&(Z=t.RGB32I)),E===t.RGBA_INTEGER&&(H===t.UNSIGNED_BYTE&&(Z=t.RGBA8UI),H===t.UNSIGNED_SHORT&&(Z=t.RGBA16UI),H===t.UNSIGNED_INT&&(Z=t.RGBA32UI),H===t.BYTE&&(Z=t.RGBA8I),H===t.SHORT&&(Z=t.RGBA16I),H===t.INT&&(Z=t.RGBA32I)),E===t.RGB&&H===t.UNSIGNED_INT_5_9_9_9_REV&&(Z=t.RGB9_E5),E===t.RGBA){const Me=se?ec:it.getTransfer(Q);H===t.FLOAT&&(Z=t.RGBA32F),H===t.HALF_FLOAT&&(Z=t.RGBA16F),H===t.UNSIGNED_BYTE&&(Z=Me===_t?t.SRGB8_ALPHA8:t.RGBA8),H===t.UNSIGNED_SHORT_4_4_4_4&&(Z=t.RGBA4),H===t.UNSIGNED_SHORT_5_5_5_1&&(Z=t.RGB5_A1)}return(Z===t.R16F||Z===t.R32F||Z===t.RG16F||Z===t.RG32F||Z===t.RGBA16F||Z===t.RGBA32F)&&e.get("EXT_color_buffer_float"),Z}function y(R,E){let H;return R?E===null||E===Vr||E===Xs?H=t.DEPTH24_STENCIL8:E===Ti?H=t.DEPTH32F_STENCIL8:E===Ja&&(H=t.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):E===null||E===Vr||E===Xs?H=t.DEPTH_COMPONENT24:E===Ti?H=t.DEPTH_COMPONENT32F:E===Ja&&(H=t.DEPTH_COMPONENT16),H}function M(R,E){return m(R)===!0||R.isFramebufferTexture&&R.minFilter!==zn&&R.minFilter!==ei?Math.log2(Math.max(E.width,E.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?E.mipmaps.length:1}function P(R){const E=R.target;E.removeEventListener("dispose",P),A(E),E.isVideoTexture&&u.delete(E)}function C(R){const E=R.target;E.removeEventListener("dispose",C),z(E)}function A(R){const E=i.get(R);if(E.__webglInit===void 0)return;const H=R.source,Q=h.get(H);if(Q){const se=Q[E.__cacheKey];se.usedTimes--,se.usedTimes===0&&b(R),Object.keys(Q).length===0&&h.delete(H)}i.remove(R)}function b(R){const E=i.get(R);t.deleteTexture(E.__webglTexture);const H=R.source,Q=h.get(H);delete Q[E.__cacheKey],a.memory.textures--}function z(R){const E=i.get(R);if(R.depthTexture&&R.depthTexture.dispose(),R.isWebGLCubeRenderTarget)for(let Q=0;Q<6;Q++){if(Array.isArray(E.__webglFramebuffer[Q]))for(let se=0;se<E.__webglFramebuffer[Q].length;se++)t.deleteFramebuffer(E.__webglFramebuffer[Q][se]);else t.deleteFramebuffer(E.__webglFramebuffer[Q]);E.__webglDepthbuffer&&t.deleteRenderbuffer(E.__webglDepthbuffer[Q])}else{if(Array.isArray(E.__webglFramebuffer))for(let Q=0;Q<E.__webglFramebuffer.length;Q++)t.deleteFramebuffer(E.__webglFramebuffer[Q]);else t.deleteFramebuffer(E.__webglFramebuffer);if(E.__webglDepthbuffer&&t.deleteRenderbuffer(E.__webglDepthbuffer),E.__webglMultisampledFramebuffer&&t.deleteFramebuffer(E.__webglMultisampledFramebuffer),E.__webglColorRenderbuffer)for(let Q=0;Q<E.__webglColorRenderbuffer.length;Q++)E.__webglColorRenderbuffer[Q]&&t.deleteRenderbuffer(E.__webglColorRenderbuffer[Q]);E.__webglDepthRenderbuffer&&t.deleteRenderbuffer(E.__webglDepthRenderbuffer)}const H=R.textures;for(let Q=0,se=H.length;Q<se;Q++){const Z=i.get(H[Q]);Z.__webglTexture&&(t.deleteTexture(Z.__webglTexture),a.memory.textures--),i.remove(H[Q])}i.remove(R)}let S=0;function w(){S=0}function N(){const R=S;return R>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+r.maxTextures),S+=1,R}function k(R){const E=[];return E.push(R.wrapS),E.push(R.wrapT),E.push(R.wrapR||0),E.push(R.magFilter),E.push(R.minFilter),E.push(R.anisotropy),E.push(R.internalFormat),E.push(R.format),E.push(R.type),E.push(R.generateMipmaps),E.push(R.premultiplyAlpha),E.push(R.flipY),E.push(R.unpackAlignment),E.push(R.colorSpace),E.join()}function j(R,E){const H=i.get(R);if(R.isVideoTexture&&Le(R),R.isRenderTargetTexture===!1&&R.version>0&&H.__version!==R.version){const Q=R.image;if(Q===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Q.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{ze(H,R,E);return}}n.bindTexture(t.TEXTURE_2D,H.__webglTexture,t.TEXTURE0+E)}function q(R,E){const H=i.get(R);if(R.version>0&&H.__version!==R.version){ze(H,R,E);return}n.bindTexture(t.TEXTURE_2D_ARRAY,H.__webglTexture,t.TEXTURE0+E)}function W(R,E){const H=i.get(R);if(R.version>0&&H.__version!==R.version){ze(H,R,E);return}n.bindTexture(t.TEXTURE_3D,H.__webglTexture,t.TEXTURE0+E)}function ie(R,E){const H=i.get(R);if(R.version>0&&H.__version!==R.version){X(H,R,E);return}n.bindTexture(t.TEXTURE_CUBE_MAP,H.__webglTexture,t.TEXTURE0+E)}const I={[Vd]:t.REPEAT,[Ki]:t.CLAMP_TO_EDGE,[jd]:t.MIRRORED_REPEAT},ee={[zn]:t.NEAREST,[kS]:t.NEAREST_MIPMAP_NEAREST,[Lo]:t.NEAREST_MIPMAP_LINEAR,[ei]:t.LINEAR,[iu]:t.LINEAR_MIPMAP_NEAREST,[Zi]:t.LINEAR_MIPMAP_LINEAR},ne={[BS]:t.NEVER,[XS]:t.ALWAYS,[HS]:t.LESS,[Hv]:t.LEQUAL,[GS]:t.EQUAL,[WS]:t.GEQUAL,[VS]:t.GREATER,[jS]:t.NOTEQUAL};function le(R,E){if(E.type===Ti&&e.has("OES_texture_float_linear")===!1&&(E.magFilter===ei||E.magFilter===iu||E.magFilter===Lo||E.magFilter===Zi||E.minFilter===ei||E.minFilter===iu||E.minFilter===Lo||E.minFilter===Zi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),t.texParameteri(R,t.TEXTURE_WRAP_S,I[E.wrapS]),t.texParameteri(R,t.TEXTURE_WRAP_T,I[E.wrapT]),(R===t.TEXTURE_3D||R===t.TEXTURE_2D_ARRAY)&&t.texParameteri(R,t.TEXTURE_WRAP_R,I[E.wrapR]),t.texParameteri(R,t.TEXTURE_MAG_FILTER,ee[E.magFilter]),t.texParameteri(R,t.TEXTURE_MIN_FILTER,ee[E.minFilter]),E.compareFunction&&(t.texParameteri(R,t.TEXTURE_COMPARE_MODE,t.COMPARE_REF_TO_TEXTURE),t.texParameteri(R,t.TEXTURE_COMPARE_FUNC,ne[E.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(E.magFilter===zn||E.minFilter!==Lo&&E.minFilter!==Zi||E.type===Ti&&e.has("OES_texture_float_linear")===!1)return;if(E.anisotropy>1||i.get(E).__currentAnisotropy){const H=e.get("EXT_texture_filter_anisotropic");t.texParameterf(R,H.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(E.anisotropy,r.getMaxAnisotropy())),i.get(E).__currentAnisotropy=E.anisotropy}}}function Te(R,E){let H=!1;R.__webglInit===void 0&&(R.__webglInit=!0,E.addEventListener("dispose",P));const Q=E.source;let se=h.get(Q);se===void 0&&(se={},h.set(Q,se));const Z=k(E);if(Z!==R.__cacheKey){se[Z]===void 0&&(se[Z]={texture:t.createTexture(),usedTimes:0},a.memory.textures++,H=!0),se[Z].usedTimes++;const Me=se[R.__cacheKey];Me!==void 0&&(se[R.__cacheKey].usedTimes--,Me.usedTimes===0&&b(E)),R.__cacheKey=Z,R.__webglTexture=se[Z].texture}return H}function ze(R,E,H){let Q=t.TEXTURE_2D;(E.isDataArrayTexture||E.isCompressedArrayTexture)&&(Q=t.TEXTURE_2D_ARRAY),E.isData3DTexture&&(Q=t.TEXTURE_3D);const se=Te(R,E),Z=E.source;n.bindTexture(Q,R.__webglTexture,t.TEXTURE0+H);const Me=i.get(Z);if(Z.version!==Me.__version||se===!0){n.activeTexture(t.TEXTURE0+H);const fe=it.getPrimaries(it.workingColorSpace),ve=E.colorSpace===$i?null:it.getPrimaries(E.colorSpace),Ke=E.colorSpace===$i||fe===ve?t.NONE:t.BROWSER_DEFAULT_WEBGL;t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,E.flipY),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),t.pixelStorei(t.UNPACK_ALIGNMENT,E.unpackAlignment),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ke);let oe=v(E.image,!1,r.maxTextureSize);oe=et(E,oe);const $=s.convert(E.format,E.colorSpace),J=s.convert(E.type);let te=x(E.internalFormat,$,J,E.colorSpace,E.isVideoTexture);le(Q,E);let re;const Pe=E.mipmaps,we=E.isVideoTexture!==!0,$e=Me.__version===void 0||se===!0,U=Z.dataReady,pe=M(E,oe);if(E.isDepthTexture)te=y(E.format===$s,E.type),$e&&(we?n.texStorage2D(t.TEXTURE_2D,1,te,oe.width,oe.height):n.texImage2D(t.TEXTURE_2D,0,te,oe.width,oe.height,0,$,J,null));else if(E.isDataTexture)if(Pe.length>0){we&&$e&&n.texStorage2D(t.TEXTURE_2D,pe,te,Pe[0].width,Pe[0].height);for(let B=0,K=Pe.length;B<K;B++)re=Pe[B],we?U&&n.texSubImage2D(t.TEXTURE_2D,B,0,0,re.width,re.height,$,J,re.data):n.texImage2D(t.TEXTURE_2D,B,te,re.width,re.height,0,$,J,re.data);E.generateMipmaps=!1}else we?($e&&n.texStorage2D(t.TEXTURE_2D,pe,te,oe.width,oe.height),U&&n.texSubImage2D(t.TEXTURE_2D,0,0,0,oe.width,oe.height,$,J,oe.data)):n.texImage2D(t.TEXTURE_2D,0,te,oe.width,oe.height,0,$,J,oe.data);else if(E.isCompressedTexture)if(E.isCompressedArrayTexture){we&&$e&&n.texStorage3D(t.TEXTURE_2D_ARRAY,pe,te,Pe[0].width,Pe[0].height,oe.depth);for(let B=0,K=Pe.length;B<K;B++)if(re=Pe[B],E.format!==ni)if($!==null)if(we){if(U)if(E.layerUpdates.size>0){const me=Bm(re.width,re.height,E.format,E.type);for(const ge of E.layerUpdates){const Be=re.data.subarray(ge*me/re.data.BYTES_PER_ELEMENT,(ge+1)*me/re.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,B,0,0,ge,re.width,re.height,1,$,Be,0,0)}E.clearLayerUpdates()}else n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,B,0,0,0,re.width,re.height,oe.depth,$,re.data,0,0)}else n.compressedTexImage3D(t.TEXTURE_2D_ARRAY,B,te,re.width,re.height,oe.depth,0,re.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else we?U&&n.texSubImage3D(t.TEXTURE_2D_ARRAY,B,0,0,0,re.width,re.height,oe.depth,$,J,re.data):n.texImage3D(t.TEXTURE_2D_ARRAY,B,te,re.width,re.height,oe.depth,0,$,J,re.data)}else{we&&$e&&n.texStorage2D(t.TEXTURE_2D,pe,te,Pe[0].width,Pe[0].height);for(let B=0,K=Pe.length;B<K;B++)re=Pe[B],E.format!==ni?$!==null?we?U&&n.compressedTexSubImage2D(t.TEXTURE_2D,B,0,0,re.width,re.height,$,re.data):n.compressedTexImage2D(t.TEXTURE_2D,B,te,re.width,re.height,0,re.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):we?U&&n.texSubImage2D(t.TEXTURE_2D,B,0,0,re.width,re.height,$,J,re.data):n.texImage2D(t.TEXTURE_2D,B,te,re.width,re.height,0,$,J,re.data)}else if(E.isDataArrayTexture)if(we){if($e&&n.texStorage3D(t.TEXTURE_2D_ARRAY,pe,te,oe.width,oe.height,oe.depth),U)if(E.layerUpdates.size>0){const B=Bm(oe.width,oe.height,E.format,E.type);for(const K of E.layerUpdates){const me=oe.data.subarray(K*B/oe.data.BYTES_PER_ELEMENT,(K+1)*B/oe.data.BYTES_PER_ELEMENT);n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,K,oe.width,oe.height,1,$,J,me)}E.clearLayerUpdates()}else n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,0,oe.width,oe.height,oe.depth,$,J,oe.data)}else n.texImage3D(t.TEXTURE_2D_ARRAY,0,te,oe.width,oe.height,oe.depth,0,$,J,oe.data);else if(E.isData3DTexture)we?($e&&n.texStorage3D(t.TEXTURE_3D,pe,te,oe.width,oe.height,oe.depth),U&&n.texSubImage3D(t.TEXTURE_3D,0,0,0,0,oe.width,oe.height,oe.depth,$,J,oe.data)):n.texImage3D(t.TEXTURE_3D,0,te,oe.width,oe.height,oe.depth,0,$,J,oe.data);else if(E.isFramebufferTexture){if($e)if(we)n.texStorage2D(t.TEXTURE_2D,pe,te,oe.width,oe.height);else{let B=oe.width,K=oe.height;for(let me=0;me<pe;me++)n.texImage2D(t.TEXTURE_2D,me,te,B,K,0,$,J,null),B>>=1,K>>=1}}else if(Pe.length>0){if(we&&$e){const B=Ue(Pe[0]);n.texStorage2D(t.TEXTURE_2D,pe,te,B.width,B.height)}for(let B=0,K=Pe.length;B<K;B++)re=Pe[B],we?U&&n.texSubImage2D(t.TEXTURE_2D,B,0,0,$,J,re):n.texImage2D(t.TEXTURE_2D,B,te,$,J,re);E.generateMipmaps=!1}else if(we){if($e){const B=Ue(oe);n.texStorage2D(t.TEXTURE_2D,pe,te,B.width,B.height)}U&&n.texSubImage2D(t.TEXTURE_2D,0,0,0,$,J,oe)}else n.texImage2D(t.TEXTURE_2D,0,te,$,J,oe);m(E)&&d(Q),Me.__version=Z.version,E.onUpdate&&E.onUpdate(E)}R.__version=E.version}function X(R,E,H){if(E.image.length!==6)return;const Q=Te(R,E),se=E.source;n.bindTexture(t.TEXTURE_CUBE_MAP,R.__webglTexture,t.TEXTURE0+H);const Z=i.get(se);if(se.version!==Z.__version||Q===!0){n.activeTexture(t.TEXTURE0+H);const Me=it.getPrimaries(it.workingColorSpace),fe=E.colorSpace===$i?null:it.getPrimaries(E.colorSpace),ve=E.colorSpace===$i||Me===fe?t.NONE:t.BROWSER_DEFAULT_WEBGL;t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,E.flipY),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),t.pixelStorei(t.UNPACK_ALIGNMENT,E.unpackAlignment),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,ve);const Ke=E.isCompressedTexture||E.image[0].isCompressedTexture,oe=E.image[0]&&E.image[0].isDataTexture,$=[];for(let K=0;K<6;K++)!Ke&&!oe?$[K]=v(E.image[K],!0,r.maxCubemapSize):$[K]=oe?E.image[K].image:E.image[K],$[K]=et(E,$[K]);const J=$[0],te=s.convert(E.format,E.colorSpace),re=s.convert(E.type),Pe=x(E.internalFormat,te,re,E.colorSpace),we=E.isVideoTexture!==!0,$e=Z.__version===void 0||Q===!0,U=se.dataReady;let pe=M(E,J);le(t.TEXTURE_CUBE_MAP,E);let B;if(Ke){we&&$e&&n.texStorage2D(t.TEXTURE_CUBE_MAP,pe,Pe,J.width,J.height);for(let K=0;K<6;K++){B=$[K].mipmaps;for(let me=0;me<B.length;me++){const ge=B[me];E.format!==ni?te!==null?we?U&&n.compressedTexSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+K,me,0,0,ge.width,ge.height,te,ge.data):n.compressedTexImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+K,me,Pe,ge.width,ge.height,0,ge.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):we?U&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+K,me,0,0,ge.width,ge.height,te,re,ge.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+K,me,Pe,ge.width,ge.height,0,te,re,ge.data)}}}else{if(B=E.mipmaps,we&&$e){B.length>0&&pe++;const K=Ue($[0]);n.texStorage2D(t.TEXTURE_CUBE_MAP,pe,Pe,K.width,K.height)}for(let K=0;K<6;K++)if(oe){we?U&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,0,0,$[K].width,$[K].height,te,re,$[K].data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,Pe,$[K].width,$[K].height,0,te,re,$[K].data);for(let me=0;me<B.length;me++){const Be=B[me].image[K].image;we?U&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+K,me+1,0,0,Be.width,Be.height,te,re,Be.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+K,me+1,Pe,Be.width,Be.height,0,te,re,Be.data)}}else{we?U&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,0,0,te,re,$[K]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,Pe,te,re,$[K]);for(let me=0;me<B.length;me++){const ge=B[me];we?U&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+K,me+1,0,0,te,re,ge.image[K]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+K,me+1,Pe,te,re,ge.image[K])}}}m(E)&&d(t.TEXTURE_CUBE_MAP),Z.__version=se.version,E.onUpdate&&E.onUpdate(E)}R.__version=E.version}function Y(R,E,H,Q,se,Z){const Me=s.convert(H.format,H.colorSpace),fe=s.convert(H.type),ve=x(H.internalFormat,Me,fe,H.colorSpace);if(!i.get(E).__hasExternalTextures){const oe=Math.max(1,E.width>>Z),$=Math.max(1,E.height>>Z);se===t.TEXTURE_3D||se===t.TEXTURE_2D_ARRAY?n.texImage3D(se,Z,ve,oe,$,E.depth,0,Me,fe,null):n.texImage2D(se,Z,ve,oe,$,0,Me,fe,null)}n.bindFramebuffer(t.FRAMEBUFFER,R),Ze(E)?o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,Q,se,i.get(H).__webglTexture,0,Xe(E)):(se===t.TEXTURE_2D||se>=t.TEXTURE_CUBE_MAP_POSITIVE_X&&se<=t.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&t.framebufferTexture2D(t.FRAMEBUFFER,Q,se,i.get(H).__webglTexture,Z),n.bindFramebuffer(t.FRAMEBUFFER,null)}function ue(R,E,H){if(t.bindRenderbuffer(t.RENDERBUFFER,R),E.depthBuffer){const Q=E.depthTexture,se=Q&&Q.isDepthTexture?Q.type:null,Z=y(E.stencilBuffer,se),Me=E.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,fe=Xe(E);Ze(E)?o.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,fe,Z,E.width,E.height):H?t.renderbufferStorageMultisample(t.RENDERBUFFER,fe,Z,E.width,E.height):t.renderbufferStorage(t.RENDERBUFFER,Z,E.width,E.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,Me,t.RENDERBUFFER,R)}else{const Q=E.textures;for(let se=0;se<Q.length;se++){const Z=Q[se],Me=s.convert(Z.format,Z.colorSpace),fe=s.convert(Z.type),ve=x(Z.internalFormat,Me,fe,Z.colorSpace),Ke=Xe(E);H&&Ze(E)===!1?t.renderbufferStorageMultisample(t.RENDERBUFFER,Ke,ve,E.width,E.height):Ze(E)?o.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,Ke,ve,E.width,E.height):t.renderbufferStorage(t.RENDERBUFFER,ve,E.width,E.height)}}t.bindRenderbuffer(t.RENDERBUFFER,null)}function de(R,E){if(E&&E.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(n.bindFramebuffer(t.FRAMEBUFFER,R),!(E.depthTexture&&E.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!i.get(E.depthTexture).__webglTexture||E.depthTexture.image.width!==E.width||E.depthTexture.image.height!==E.height)&&(E.depthTexture.image.width=E.width,E.depthTexture.image.height=E.height,E.depthTexture.needsUpdate=!0),j(E.depthTexture,0);const Q=i.get(E.depthTexture).__webglTexture,se=Xe(E);if(E.depthTexture.format===Is)Ze(E)?o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,Q,0,se):t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,Q,0);else if(E.depthTexture.format===$s)Ze(E)?o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.TEXTURE_2D,Q,0,se):t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.TEXTURE_2D,Q,0);else throw new Error("Unknown depthTexture format")}function Ie(R){const E=i.get(R),H=R.isWebGLCubeRenderTarget===!0;if(E.__boundDepthTexture!==R.depthTexture){const Q=R.depthTexture;if(E.__depthDisposeCallback&&E.__depthDisposeCallback(),Q){const se=()=>{delete E.__boundDepthTexture,delete E.__depthDisposeCallback,Q.removeEventListener("dispose",se)};Q.addEventListener("dispose",se),E.__depthDisposeCallback=se}E.__boundDepthTexture=Q}if(R.depthTexture&&!E.__autoAllocateDepthBuffer){if(H)throw new Error("target.depthTexture not supported in Cube render targets");de(E.__webglFramebuffer,R)}else if(H){E.__webglDepthbuffer=[];for(let Q=0;Q<6;Q++)if(n.bindFramebuffer(t.FRAMEBUFFER,E.__webglFramebuffer[Q]),E.__webglDepthbuffer[Q]===void 0)E.__webglDepthbuffer[Q]=t.createRenderbuffer(),ue(E.__webglDepthbuffer[Q],R,!1);else{const se=R.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,Z=E.__webglDepthbuffer[Q];t.bindRenderbuffer(t.RENDERBUFFER,Z),t.framebufferRenderbuffer(t.FRAMEBUFFER,se,t.RENDERBUFFER,Z)}}else if(n.bindFramebuffer(t.FRAMEBUFFER,E.__webglFramebuffer),E.__webglDepthbuffer===void 0)E.__webglDepthbuffer=t.createRenderbuffer(),ue(E.__webglDepthbuffer,R,!1);else{const Q=R.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,se=E.__webglDepthbuffer;t.bindRenderbuffer(t.RENDERBUFFER,se),t.framebufferRenderbuffer(t.FRAMEBUFFER,Q,t.RENDERBUFFER,se)}n.bindFramebuffer(t.FRAMEBUFFER,null)}function De(R,E,H){const Q=i.get(R);E!==void 0&&Y(Q.__webglFramebuffer,R,R.texture,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,0),H!==void 0&&Ie(R)}function qe(R){const E=R.texture,H=i.get(R),Q=i.get(E);R.addEventListener("dispose",C);const se=R.textures,Z=R.isWebGLCubeRenderTarget===!0,Me=se.length>1;if(Me||(Q.__webglTexture===void 0&&(Q.__webglTexture=t.createTexture()),Q.__version=E.version,a.memory.textures++),Z){H.__webglFramebuffer=[];for(let fe=0;fe<6;fe++)if(E.mipmaps&&E.mipmaps.length>0){H.__webglFramebuffer[fe]=[];for(let ve=0;ve<E.mipmaps.length;ve++)H.__webglFramebuffer[fe][ve]=t.createFramebuffer()}else H.__webglFramebuffer[fe]=t.createFramebuffer()}else{if(E.mipmaps&&E.mipmaps.length>0){H.__webglFramebuffer=[];for(let fe=0;fe<E.mipmaps.length;fe++)H.__webglFramebuffer[fe]=t.createFramebuffer()}else H.__webglFramebuffer=t.createFramebuffer();if(Me)for(let fe=0,ve=se.length;fe<ve;fe++){const Ke=i.get(se[fe]);Ke.__webglTexture===void 0&&(Ke.__webglTexture=t.createTexture(),a.memory.textures++)}if(R.samples>0&&Ze(R)===!1){H.__webglMultisampledFramebuffer=t.createFramebuffer(),H.__webglColorRenderbuffer=[],n.bindFramebuffer(t.FRAMEBUFFER,H.__webglMultisampledFramebuffer);for(let fe=0;fe<se.length;fe++){const ve=se[fe];H.__webglColorRenderbuffer[fe]=t.createRenderbuffer(),t.bindRenderbuffer(t.RENDERBUFFER,H.__webglColorRenderbuffer[fe]);const Ke=s.convert(ve.format,ve.colorSpace),oe=s.convert(ve.type),$=x(ve.internalFormat,Ke,oe,ve.colorSpace,R.isXRRenderTarget===!0),J=Xe(R);t.renderbufferStorageMultisample(t.RENDERBUFFER,J,$,R.width,R.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+fe,t.RENDERBUFFER,H.__webglColorRenderbuffer[fe])}t.bindRenderbuffer(t.RENDERBUFFER,null),R.depthBuffer&&(H.__webglDepthRenderbuffer=t.createRenderbuffer(),ue(H.__webglDepthRenderbuffer,R,!0)),n.bindFramebuffer(t.FRAMEBUFFER,null)}}if(Z){n.bindTexture(t.TEXTURE_CUBE_MAP,Q.__webglTexture),le(t.TEXTURE_CUBE_MAP,E);for(let fe=0;fe<6;fe++)if(E.mipmaps&&E.mipmaps.length>0)for(let ve=0;ve<E.mipmaps.length;ve++)Y(H.__webglFramebuffer[fe][ve],R,E,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+fe,ve);else Y(H.__webglFramebuffer[fe],R,E,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+fe,0);m(E)&&d(t.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(Me){for(let fe=0,ve=se.length;fe<ve;fe++){const Ke=se[fe],oe=i.get(Ke);n.bindTexture(t.TEXTURE_2D,oe.__webglTexture),le(t.TEXTURE_2D,Ke),Y(H.__webglFramebuffer,R,Ke,t.COLOR_ATTACHMENT0+fe,t.TEXTURE_2D,0),m(Ke)&&d(t.TEXTURE_2D)}n.unbindTexture()}else{let fe=t.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(fe=R.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY),n.bindTexture(fe,Q.__webglTexture),le(fe,E),E.mipmaps&&E.mipmaps.length>0)for(let ve=0;ve<E.mipmaps.length;ve++)Y(H.__webglFramebuffer[ve],R,E,t.COLOR_ATTACHMENT0,fe,ve);else Y(H.__webglFramebuffer,R,E,t.COLOR_ATTACHMENT0,fe,0);m(E)&&d(fe),n.unbindTexture()}R.depthBuffer&&Ie(R)}function Je(R){const E=R.textures;for(let H=0,Q=E.length;H<Q;H++){const se=E[H];if(m(se)){const Z=R.isWebGLCubeRenderTarget?t.TEXTURE_CUBE_MAP:t.TEXTURE_2D,Me=i.get(se).__webglTexture;n.bindTexture(Z,Me),d(Z),n.unbindTexture()}}}const je=[],D=[];function Re(R){if(R.samples>0){if(Ze(R)===!1){const E=R.textures,H=R.width,Q=R.height;let se=t.COLOR_BUFFER_BIT;const Z=R.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,Me=i.get(R),fe=E.length>1;if(fe)for(let ve=0;ve<E.length;ve++)n.bindFramebuffer(t.FRAMEBUFFER,Me.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+ve,t.RENDERBUFFER,null),n.bindFramebuffer(t.FRAMEBUFFER,Me.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+ve,t.TEXTURE_2D,null,0);n.bindFramebuffer(t.READ_FRAMEBUFFER,Me.__webglMultisampledFramebuffer),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,Me.__webglFramebuffer);for(let ve=0;ve<E.length;ve++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(se|=t.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(se|=t.STENCIL_BUFFER_BIT)),fe){t.framebufferRenderbuffer(t.READ_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.RENDERBUFFER,Me.__webglColorRenderbuffer[ve]);const Ke=i.get(E[ve]).__webglTexture;t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,Ke,0)}t.blitFramebuffer(0,0,H,Q,0,0,H,Q,se,t.NEAREST),l===!0&&(je.length=0,D.length=0,je.push(t.COLOR_ATTACHMENT0+ve),R.depthBuffer&&R.resolveDepthBuffer===!1&&(je.push(Z),D.push(Z),t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,D)),t.invalidateFramebuffer(t.READ_FRAMEBUFFER,je))}if(n.bindFramebuffer(t.READ_FRAMEBUFFER,null),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),fe)for(let ve=0;ve<E.length;ve++){n.bindFramebuffer(t.FRAMEBUFFER,Me.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+ve,t.RENDERBUFFER,Me.__webglColorRenderbuffer[ve]);const Ke=i.get(E[ve]).__webglTexture;n.bindFramebuffer(t.FRAMEBUFFER,Me.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+ve,t.TEXTURE_2D,Ke,0)}n.bindFramebuffer(t.DRAW_FRAMEBUFFER,Me.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&l){const E=R.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,[E])}}}function Xe(R){return Math.min(r.maxSamples,R.samples)}function Ze(R){const E=i.get(R);return R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&E.__useRenderToTexture!==!1}function Le(R){const E=a.render.frame;u.get(R)!==E&&(u.set(R,E),R.update())}function et(R,E){const H=R.colorSpace,Q=R.format,se=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||H!==mr&&H!==$i&&(it.getTransfer(H)===_t?(Q!==ni||se!==Di)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",H)),E}function Ue(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(c.width=R.naturalWidth||R.width,c.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(c.width=R.displayWidth,c.height=R.displayHeight):(c.width=R.width,c.height=R.height),c}this.allocateTextureUnit=N,this.resetTextureUnits=w,this.setTexture2D=j,this.setTexture2DArray=q,this.setTexture3D=W,this.setTextureCube=ie,this.rebindTextures=De,this.setupRenderTarget=qe,this.updateRenderTargetMipmap=Je,this.updateMultisampleRenderTarget=Re,this.setupDepthRenderbuffer=Ie,this.setupFrameBufferTexture=Y,this.useMultisampledRTT=Ze}function hA(t,e){function n(i,r=$i){let s;const a=it.getTransfer(r);if(i===Di)return t.UNSIGNED_BYTE;if(i===vf)return t.UNSIGNED_SHORT_4_4_4_4;if(i===xf)return t.UNSIGNED_SHORT_5_5_5_1;if(i===Lv)return t.UNSIGNED_INT_5_9_9_9_REV;if(i===Pv)return t.BYTE;if(i===Nv)return t.SHORT;if(i===Ja)return t.UNSIGNED_SHORT;if(i===_f)return t.INT;if(i===Vr)return t.UNSIGNED_INT;if(i===Ti)return t.FLOAT;if(i===oo)return t.HALF_FLOAT;if(i===Dv)return t.ALPHA;if(i===Iv)return t.RGB;if(i===ni)return t.RGBA;if(i===Uv)return t.LUMINANCE;if(i===kv)return t.LUMINANCE_ALPHA;if(i===Is)return t.DEPTH_COMPONENT;if(i===$s)return t.DEPTH_STENCIL;if(i===Fv)return t.RED;if(i===yf)return t.RED_INTEGER;if(i===Ov)return t.RG;if(i===Sf)return t.RG_INTEGER;if(i===Mf)return t.RGBA_INTEGER;if(i===Ml||i===El||i===wl||i===Tl)if(a===_t)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===Ml)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===El)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===wl)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Tl)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===Ml)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===El)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===wl)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Tl)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Wd||i===Xd||i===$d||i===Yd)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===Wd)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Xd)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===$d)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Yd)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===qd||i===Kd||i===Zd)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===qd||i===Kd)return a===_t?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===Zd)return a===_t?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Qd||i===Jd||i===eh||i===th||i===nh||i===ih||i===rh||i===sh||i===ah||i===oh||i===lh||i===ch||i===uh||i===dh)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===Qd)return a===_t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Jd)return a===_t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===eh)return a===_t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===th)return a===_t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===nh)return a===_t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===ih)return a===_t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===rh)return a===_t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===sh)return a===_t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===ah)return a===_t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===oh)return a===_t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===lh)return a===_t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===ch)return a===_t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===uh)return a===_t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===dh)return a===_t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Al||i===hh||i===fh)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===Al)return a===_t?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===hh)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===fh)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===zv||i===ph||i===mh||i===gh)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===Al)return s.COMPRESSED_RED_RGTC1_EXT;if(i===ph)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===mh)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===gh)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Xs?t.UNSIGNED_INT_24_8:t[i]!==void 0?t[i]:null}return{convert:n}}class fA extends wn{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class Xt extends Dt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const pA={type:"move"};class Nu{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Xt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Xt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Xt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const n=this._hand;if(n)for(const i of e.hand.values())this._getHandJoint(n,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,n,i){let r=null,s=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&n.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const v of e.hand.values()){const m=n.getJointPose(v,i),d=this._getHandJoint(c,v);m!==null&&(d.matrix.fromArray(m.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=m.radius),d.visible=m!==null}const u=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],h=u.position.distanceTo(f.position),p=.02,_=.005;c.inputState.pinching&&h>p+_?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&h<=p-_&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=n.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(r=n.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(pA)))}return o!==null&&(o.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,n){if(e.joints[n.jointName]===void 0){const i=new Xt;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[n.jointName]=i,e.add(i)}return e.joints[n.jointName]}}const mA=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,gA=`
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

}`;class _A{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,n,i){if(this.texture===null){const r=new nn,s=e.properties.get(r);s.__webglTexture=n.texture,(n.depthNear!=i.depthNear||n.depthFar!=i.depthFar)&&(this.depthNear=n.depthNear,this.depthFar=n.depthFar),this.texture=r}}getMesh(e){if(this.texture!==null&&this.mesh===null){const n=e.cameras[0].viewport,i=new Vn({vertexShader:mA,fragmentShader:gA,uniforms:{depthColor:{value:this.texture},depthWidth:{value:n.z},depthHeight:{value:n.w}}});this.mesh=new Ne(new $r(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class vA extends Js{constructor(e,n){super();const i=this;let r=null,s=1,a=null,o="local-floor",l=1,c=null,u=null,f=null,h=null,p=null,_=null;const v=new _A,m=n.getContextAttributes();let d=null,x=null;const y=[],M=[],P=new He;let C=null;const A=new wn;A.layers.enable(1),A.viewport=new Ct;const b=new wn;b.layers.enable(2),b.viewport=new Ct;const z=[A,b],S=new fA;S.layers.enable(1),S.layers.enable(2);let w=null,N=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(X){let Y=y[X];return Y===void 0&&(Y=new Nu,y[X]=Y),Y.getTargetRaySpace()},this.getControllerGrip=function(X){let Y=y[X];return Y===void 0&&(Y=new Nu,y[X]=Y),Y.getGripSpace()},this.getHand=function(X){let Y=y[X];return Y===void 0&&(Y=new Nu,y[X]=Y),Y.getHandSpace()};function k(X){const Y=M.indexOf(X.inputSource);if(Y===-1)return;const ue=y[Y];ue!==void 0&&(ue.update(X.inputSource,X.frame,c||a),ue.dispatchEvent({type:X.type,data:X.inputSource}))}function j(){r.removeEventListener("select",k),r.removeEventListener("selectstart",k),r.removeEventListener("selectend",k),r.removeEventListener("squeeze",k),r.removeEventListener("squeezestart",k),r.removeEventListener("squeezeend",k),r.removeEventListener("end",j),r.removeEventListener("inputsourceschange",q);for(let X=0;X<y.length;X++){const Y=M[X];Y!==null&&(M[X]=null,y[X].disconnect(Y))}w=null,N=null,v.reset(),e.setRenderTarget(d),p=null,h=null,f=null,r=null,x=null,ze.stop(),i.isPresenting=!1,e.setPixelRatio(C),e.setSize(P.width,P.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(X){s=X,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(X){o=X,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(X){c=X},this.getBaseLayer=function(){return h!==null?h:p},this.getBinding=function(){return f},this.getFrame=function(){return _},this.getSession=function(){return r},this.setSession=async function(X){if(r=X,r!==null){if(d=e.getRenderTarget(),r.addEventListener("select",k),r.addEventListener("selectstart",k),r.addEventListener("selectend",k),r.addEventListener("squeeze",k),r.addEventListener("squeezestart",k),r.addEventListener("squeezeend",k),r.addEventListener("end",j),r.addEventListener("inputsourceschange",q),m.xrCompatible!==!0&&await n.makeXRCompatible(),C=e.getPixelRatio(),e.getSize(P),r.renderState.layers===void 0){const Y={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:s};p=new XRWebGLLayer(r,n,Y),r.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),x=new jr(p.framebufferWidth,p.framebufferHeight,{format:ni,type:Di,colorSpace:e.outputColorSpace,stencilBuffer:m.stencil})}else{let Y=null,ue=null,de=null;m.depth&&(de=m.stencil?n.DEPTH24_STENCIL8:n.DEPTH_COMPONENT24,Y=m.stencil?$s:Is,ue=m.stencil?Xs:Vr);const Ie={colorFormat:n.RGBA8,depthFormat:de,scaleFactor:s};f=new XRWebGLBinding(r,n),h=f.createProjectionLayer(Ie),r.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),x=new jr(h.textureWidth,h.textureHeight,{format:ni,type:Di,depthTexture:new Jv(h.textureWidth,h.textureHeight,ue,void 0,void 0,void 0,void 0,void 0,void 0,Y),stencilBuffer:m.stencil,colorSpace:e.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await r.requestReferenceSpace(o),ze.setContext(r),ze.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return v.getDepthTexture()};function q(X){for(let Y=0;Y<X.removed.length;Y++){const ue=X.removed[Y],de=M.indexOf(ue);de>=0&&(M[de]=null,y[de].disconnect(ue))}for(let Y=0;Y<X.added.length;Y++){const ue=X.added[Y];let de=M.indexOf(ue);if(de===-1){for(let De=0;De<y.length;De++)if(De>=M.length){M.push(ue),de=De;break}else if(M[De]===null){M[De]=ue,de=De;break}if(de===-1)break}const Ie=y[de];Ie&&Ie.connect(ue)}}const W=new L,ie=new L;function I(X,Y,ue){W.setFromMatrixPosition(Y.matrixWorld),ie.setFromMatrixPosition(ue.matrixWorld);const de=W.distanceTo(ie),Ie=Y.projectionMatrix.elements,De=ue.projectionMatrix.elements,qe=Ie[14]/(Ie[10]-1),Je=Ie[14]/(Ie[10]+1),je=(Ie[9]+1)/Ie[5],D=(Ie[9]-1)/Ie[5],Re=(Ie[8]-1)/Ie[0],Xe=(De[8]+1)/De[0],Ze=qe*Re,Le=qe*Xe,et=de/(-Re+Xe),Ue=et*-Re;if(Y.matrixWorld.decompose(X.position,X.quaternion,X.scale),X.translateX(Ue),X.translateZ(et),X.matrixWorld.compose(X.position,X.quaternion,X.scale),X.matrixWorldInverse.copy(X.matrixWorld).invert(),Ie[10]===-1)X.projectionMatrix.copy(Y.projectionMatrix),X.projectionMatrixInverse.copy(Y.projectionMatrixInverse);else{const R=qe+et,E=Je+et,H=Ze-Ue,Q=Le+(de-Ue),se=je*Je/E*R,Z=D*Je/E*R;X.projectionMatrix.makePerspective(H,Q,se,Z,R,E),X.projectionMatrixInverse.copy(X.projectionMatrix).invert()}}function ee(X,Y){Y===null?X.matrixWorld.copy(X.matrix):X.matrixWorld.multiplyMatrices(Y.matrixWorld,X.matrix),X.matrixWorldInverse.copy(X.matrixWorld).invert()}this.updateCamera=function(X){if(r===null)return;let Y=X.near,ue=X.far;v.texture!==null&&(v.depthNear>0&&(Y=v.depthNear),v.depthFar>0&&(ue=v.depthFar)),S.near=b.near=A.near=Y,S.far=b.far=A.far=ue,(w!==S.near||N!==S.far)&&(r.updateRenderState({depthNear:S.near,depthFar:S.far}),w=S.near,N=S.far);const de=X.parent,Ie=S.cameras;ee(S,de);for(let De=0;De<Ie.length;De++)ee(Ie[De],de);Ie.length===2?I(S,A,b):S.projectionMatrix.copy(A.projectionMatrix),ne(X,S,de)};function ne(X,Y,ue){ue===null?X.matrix.copy(Y.matrixWorld):(X.matrix.copy(ue.matrixWorld),X.matrix.invert(),X.matrix.multiply(Y.matrixWorld)),X.matrix.decompose(X.position,X.quaternion,X.scale),X.updateMatrixWorld(!0),X.projectionMatrix.copy(Y.projectionMatrix),X.projectionMatrixInverse.copy(Y.projectionMatrixInverse),X.isPerspectiveCamera&&(X.fov=eo*2*Math.atan(1/X.projectionMatrix.elements[5]),X.zoom=1)}this.getCamera=function(){return S},this.getFoveation=function(){if(!(h===null&&p===null))return l},this.setFoveation=function(X){l=X,h!==null&&(h.fixedFoveation=X),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=X)},this.hasDepthSensing=function(){return v.texture!==null},this.getDepthSensingMesh=function(){return v.getMesh(S)};let le=null;function Te(X,Y){if(u=Y.getViewerPose(c||a),_=Y,u!==null){const ue=u.views;p!==null&&(e.setRenderTargetFramebuffer(x,p.framebuffer),e.setRenderTarget(x));let de=!1;ue.length!==S.cameras.length&&(S.cameras.length=0,de=!0);for(let De=0;De<ue.length;De++){const qe=ue[De];let Je=null;if(p!==null)Je=p.getViewport(qe);else{const D=f.getViewSubImage(h,qe);Je=D.viewport,De===0&&(e.setRenderTargetTextures(x,D.colorTexture,h.ignoreDepthValues?void 0:D.depthStencilTexture),e.setRenderTarget(x))}let je=z[De];je===void 0&&(je=new wn,je.layers.enable(De),je.viewport=new Ct,z[De]=je),je.matrix.fromArray(qe.transform.matrix),je.matrix.decompose(je.position,je.quaternion,je.scale),je.projectionMatrix.fromArray(qe.projectionMatrix),je.projectionMatrixInverse.copy(je.projectionMatrix).invert(),je.viewport.set(Je.x,Je.y,Je.width,Je.height),De===0&&(S.matrix.copy(je.matrix),S.matrix.decompose(S.position,S.quaternion,S.scale)),de===!0&&S.cameras.push(je)}const Ie=r.enabledFeatures;if(Ie&&Ie.includes("depth-sensing")){const De=f.getDepthInformation(ue[0]);De&&De.isValid&&De.texture&&v.init(e,De,r.renderState)}}for(let ue=0;ue<y.length;ue++){const de=M[ue],Ie=y[ue];de!==null&&Ie!==void 0&&Ie.update(de,Y,c||a)}le&&le(X,Y),Y.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:Y}),_=null}const ze=new Zv;ze.setAnimationLoop(Te),this.setAnimationLoop=function(X){le=X},this.dispose=function(){}}}const Er=new pi,xA=new ht;function yA(t,e){function n(m,d){m.matrixAutoUpdate===!0&&m.updateMatrix(),d.value.copy(m.matrix)}function i(m,d){d.color.getRGB(m.fogColor.value,Yv(t)),d.isFog?(m.fogNear.value=d.near,m.fogFar.value=d.far):d.isFogExp2&&(m.fogDensity.value=d.density)}function r(m,d,x,y,M){d.isMeshBasicMaterial||d.isMeshLambertMaterial?s(m,d):d.isMeshToonMaterial?(s(m,d),f(m,d)):d.isMeshPhongMaterial?(s(m,d),u(m,d)):d.isMeshStandardMaterial?(s(m,d),h(m,d),d.isMeshPhysicalMaterial&&p(m,d,M)):d.isMeshMatcapMaterial?(s(m,d),_(m,d)):d.isMeshDepthMaterial?s(m,d):d.isMeshDistanceMaterial?(s(m,d),v(m,d)):d.isMeshNormalMaterial?s(m,d):d.isLineBasicMaterial?(a(m,d),d.isLineDashedMaterial&&o(m,d)):d.isPointsMaterial?l(m,d,x,y):d.isSpriteMaterial?c(m,d):d.isShadowMaterial?(m.color.value.copy(d.color),m.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function s(m,d){m.opacity.value=d.opacity,d.color&&m.diffuse.value.copy(d.color),d.emissive&&m.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(m.map.value=d.map,n(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,n(d.alphaMap,m.alphaMapTransform)),d.bumpMap&&(m.bumpMap.value=d.bumpMap,n(d.bumpMap,m.bumpMapTransform),m.bumpScale.value=d.bumpScale,d.side===Yt&&(m.bumpScale.value*=-1)),d.normalMap&&(m.normalMap.value=d.normalMap,n(d.normalMap,m.normalMapTransform),m.normalScale.value.copy(d.normalScale),d.side===Yt&&m.normalScale.value.negate()),d.displacementMap&&(m.displacementMap.value=d.displacementMap,n(d.displacementMap,m.displacementMapTransform),m.displacementScale.value=d.displacementScale,m.displacementBias.value=d.displacementBias),d.emissiveMap&&(m.emissiveMap.value=d.emissiveMap,n(d.emissiveMap,m.emissiveMapTransform)),d.specularMap&&(m.specularMap.value=d.specularMap,n(d.specularMap,m.specularMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest);const x=e.get(d),y=x.envMap,M=x.envMapRotation;y&&(m.envMap.value=y,Er.copy(M),Er.x*=-1,Er.y*=-1,Er.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(Er.y*=-1,Er.z*=-1),m.envMapRotation.value.setFromMatrix4(xA.makeRotationFromEuler(Er)),m.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=d.reflectivity,m.ior.value=d.ior,m.refractionRatio.value=d.refractionRatio),d.lightMap&&(m.lightMap.value=d.lightMap,m.lightMapIntensity.value=d.lightMapIntensity,n(d.lightMap,m.lightMapTransform)),d.aoMap&&(m.aoMap.value=d.aoMap,m.aoMapIntensity.value=d.aoMapIntensity,n(d.aoMap,m.aoMapTransform))}function a(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,d.map&&(m.map.value=d.map,n(d.map,m.mapTransform))}function o(m,d){m.dashSize.value=d.dashSize,m.totalSize.value=d.dashSize+d.gapSize,m.scale.value=d.scale}function l(m,d,x,y){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.size.value=d.size*x,m.scale.value=y*.5,d.map&&(m.map.value=d.map,n(d.map,m.uvTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,n(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function c(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.rotation.value=d.rotation,d.map&&(m.map.value=d.map,n(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,n(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function u(m,d){m.specular.value.copy(d.specular),m.shininess.value=Math.max(d.shininess,1e-4)}function f(m,d){d.gradientMap&&(m.gradientMap.value=d.gradientMap)}function h(m,d){m.metalness.value=d.metalness,d.metalnessMap&&(m.metalnessMap.value=d.metalnessMap,n(d.metalnessMap,m.metalnessMapTransform)),m.roughness.value=d.roughness,d.roughnessMap&&(m.roughnessMap.value=d.roughnessMap,n(d.roughnessMap,m.roughnessMapTransform)),d.envMap&&(m.envMapIntensity.value=d.envMapIntensity)}function p(m,d,x){m.ior.value=d.ior,d.sheen>0&&(m.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),m.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(m.sheenColorMap.value=d.sheenColorMap,n(d.sheenColorMap,m.sheenColorMapTransform)),d.sheenRoughnessMap&&(m.sheenRoughnessMap.value=d.sheenRoughnessMap,n(d.sheenRoughnessMap,m.sheenRoughnessMapTransform))),d.clearcoat>0&&(m.clearcoat.value=d.clearcoat,m.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(m.clearcoatMap.value=d.clearcoatMap,n(d.clearcoatMap,m.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,n(d.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(m.clearcoatNormalMap.value=d.clearcoatNormalMap,n(d.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===Yt&&m.clearcoatNormalScale.value.negate())),d.dispersion>0&&(m.dispersion.value=d.dispersion),d.iridescence>0&&(m.iridescence.value=d.iridescence,m.iridescenceIOR.value=d.iridescenceIOR,m.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(m.iridescenceMap.value=d.iridescenceMap,n(d.iridescenceMap,m.iridescenceMapTransform)),d.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=d.iridescenceThicknessMap,n(d.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),d.transmission>0&&(m.transmission.value=d.transmission,m.transmissionSamplerMap.value=x.texture,m.transmissionSamplerSize.value.set(x.width,x.height),d.transmissionMap&&(m.transmissionMap.value=d.transmissionMap,n(d.transmissionMap,m.transmissionMapTransform)),m.thickness.value=d.thickness,d.thicknessMap&&(m.thicknessMap.value=d.thicknessMap,n(d.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=d.attenuationDistance,m.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(m.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(m.anisotropyMap.value=d.anisotropyMap,n(d.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=d.specularIntensity,m.specularColor.value.copy(d.specularColor),d.specularColorMap&&(m.specularColorMap.value=d.specularColorMap,n(d.specularColorMap,m.specularColorMapTransform)),d.specularIntensityMap&&(m.specularIntensityMap.value=d.specularIntensityMap,n(d.specularIntensityMap,m.specularIntensityMapTransform))}function _(m,d){d.matcap&&(m.matcap.value=d.matcap)}function v(m,d){const x=e.get(d).light;m.referencePosition.value.setFromMatrixPosition(x.matrixWorld),m.nearDistance.value=x.shadow.camera.near,m.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function SA(t,e,n,i){let r={},s={},a=[];const o=t.getParameter(t.MAX_UNIFORM_BUFFER_BINDINGS);function l(x,y){const M=y.program;i.uniformBlockBinding(x,M)}function c(x,y){let M=r[x.id];M===void 0&&(_(x),M=u(x),r[x.id]=M,x.addEventListener("dispose",m));const P=y.program;i.updateUBOMapping(x,P);const C=e.render.frame;s[x.id]!==C&&(h(x),s[x.id]=C)}function u(x){const y=f();x.__bindingPointIndex=y;const M=t.createBuffer(),P=x.__size,C=x.usage;return t.bindBuffer(t.UNIFORM_BUFFER,M),t.bufferData(t.UNIFORM_BUFFER,P,C),t.bindBuffer(t.UNIFORM_BUFFER,null),t.bindBufferBase(t.UNIFORM_BUFFER,y,M),M}function f(){for(let x=0;x<o;x++)if(a.indexOf(x)===-1)return a.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(x){const y=r[x.id],M=x.uniforms,P=x.__cache;t.bindBuffer(t.UNIFORM_BUFFER,y);for(let C=0,A=M.length;C<A;C++){const b=Array.isArray(M[C])?M[C]:[M[C]];for(let z=0,S=b.length;z<S;z++){const w=b[z];if(p(w,C,z,P)===!0){const N=w.__offset,k=Array.isArray(w.value)?w.value:[w.value];let j=0;for(let q=0;q<k.length;q++){const W=k[q],ie=v(W);typeof W=="number"||typeof W=="boolean"?(w.__data[0]=W,t.bufferSubData(t.UNIFORM_BUFFER,N+j,w.__data)):W.isMatrix3?(w.__data[0]=W.elements[0],w.__data[1]=W.elements[1],w.__data[2]=W.elements[2],w.__data[3]=0,w.__data[4]=W.elements[3],w.__data[5]=W.elements[4],w.__data[6]=W.elements[5],w.__data[7]=0,w.__data[8]=W.elements[6],w.__data[9]=W.elements[7],w.__data[10]=W.elements[8],w.__data[11]=0):(W.toArray(w.__data,j),j+=ie.storage/Float32Array.BYTES_PER_ELEMENT)}t.bufferSubData(t.UNIFORM_BUFFER,N,w.__data)}}}t.bindBuffer(t.UNIFORM_BUFFER,null)}function p(x,y,M,P){const C=x.value,A=y+"_"+M;if(P[A]===void 0)return typeof C=="number"||typeof C=="boolean"?P[A]=C:P[A]=C.clone(),!0;{const b=P[A];if(typeof C=="number"||typeof C=="boolean"){if(b!==C)return P[A]=C,!0}else if(b.equals(C)===!1)return b.copy(C),!0}return!1}function _(x){const y=x.uniforms;let M=0;const P=16;for(let A=0,b=y.length;A<b;A++){const z=Array.isArray(y[A])?y[A]:[y[A]];for(let S=0,w=z.length;S<w;S++){const N=z[S],k=Array.isArray(N.value)?N.value:[N.value];for(let j=0,q=k.length;j<q;j++){const W=k[j],ie=v(W),I=M%P,ee=I%ie.boundary,ne=I+ee;M+=ee,ne!==0&&P-ne<ie.storage&&(M+=P-ne),N.__data=new Float32Array(ie.storage/Float32Array.BYTES_PER_ELEMENT),N.__offset=M,M+=ie.storage}}}const C=M%P;return C>0&&(M+=P-C),x.__size=M,x.__cache={},this}function v(x){const y={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(y.boundary=4,y.storage=4):x.isVector2?(y.boundary=8,y.storage=8):x.isVector3||x.isColor?(y.boundary=16,y.storage=12):x.isVector4?(y.boundary=16,y.storage=16):x.isMatrix3?(y.boundary=48,y.storage=48):x.isMatrix4?(y.boundary=64,y.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),y}function m(x){const y=x.target;y.removeEventListener("dispose",m);const M=a.indexOf(y.__bindingPointIndex);a.splice(M,1),t.deleteBuffer(r[y.id]),delete r[y.id],delete s[y.id]}function d(){for(const x in r)t.deleteBuffer(r[x]);a=[],r={},s={}}return{bind:l,update:c,dispose:d}}class r0{constructor(e={}){const{canvas:n=cM(),context:i=null,depth:r=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:f=!1}=e;this.isWebGLRenderer=!0;let h;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");h=i.getContextAttributes().alpha}else h=a;const p=new Uint32Array(4),_=new Int32Array(4);let v=null,m=null;const d=[],x=[];this.domElement=n,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=en,this.toneMapping=lr,this.toneMappingExposure=1;const y=this;let M=!1,P=0,C=0,A=null,b=-1,z=null;const S=new Ct,w=new Ct;let N=null;const k=new Ce(0);let j=0,q=n.width,W=n.height,ie=1,I=null,ee=null;const ne=new Ct(0,0,q,W),le=new Ct(0,0,q,W);let Te=!1;const ze=new Af;let X=!1,Y=!1;const ue=new ht,de=new ht,Ie=new L,De=new Ct,qe={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Je=!1;function je(){return A===null?ie:1}let D=i;function Re(T,F){return n.getContext(T,F)}try{const T={alpha:!0,depth:r,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:f};if("setAttribute"in n&&n.setAttribute("data-engine",`three.js r${gf}`),n.addEventListener("webglcontextlost",K,!1),n.addEventListener("webglcontextrestored",me,!1),n.addEventListener("webglcontextcreationerror",ge,!1),D===null){const F="webgl2";if(D=Re(F,T),D===null)throw Re(F)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(T){throw console.error("THREE.WebGLRenderer: "+T.message),T}let Xe,Ze,Le,et,Ue,R,E,H,Q,se,Z,Me,fe,ve,Ke,oe,$,J,te,re,Pe,we,$e,U;function pe(){Xe=new b1(D),Xe.init(),we=new hA(D,Xe),Ze=new S1(D,Xe,e,we),Le=new cA(D),Ze.reverseDepthBuffer&&Le.buffers.depth.setReversed(!0),et=new P1(D),Ue=new YT,R=new dA(D,Xe,Le,Ue,Ze,we,et),E=new E1(y),H=new A1(y),Q=new FM(D),$e=new x1(D,Q),se=new C1(D,Q,et,$e),Z=new L1(D,se,Q,et),te=new N1(D,Ze,R),oe=new M1(Ue),Me=new $T(y,E,H,Xe,Ze,$e,oe),fe=new yA(y,Ue),ve=new KT,Ke=new nA(Xe),J=new v1(y,E,H,Le,Z,h,l),$=new oA(y,Z,Ze),U=new SA(D,et,Ze,Le),re=new y1(D,Xe,et),Pe=new R1(D,Xe,et),et.programs=Me.programs,y.capabilities=Ze,y.extensions=Xe,y.properties=Ue,y.renderLists=ve,y.shadowMap=$,y.state=Le,y.info=et}pe();const B=new vA(y,D);this.xr=B,this.getContext=function(){return D},this.getContextAttributes=function(){return D.getContextAttributes()},this.forceContextLoss=function(){const T=Xe.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){const T=Xe.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return ie},this.setPixelRatio=function(T){T!==void 0&&(ie=T,this.setSize(q,W,!1))},this.getSize=function(T){return T.set(q,W)},this.setSize=function(T,F,G=!0){if(B.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}q=T,W=F,n.width=Math.floor(T*ie),n.height=Math.floor(F*ie),G===!0&&(n.style.width=T+"px",n.style.height=F+"px"),this.setViewport(0,0,T,F)},this.getDrawingBufferSize=function(T){return T.set(q*ie,W*ie).floor()},this.setDrawingBufferSize=function(T,F,G){q=T,W=F,ie=G,n.width=Math.floor(T*G),n.height=Math.floor(F*G),this.setViewport(0,0,T,F)},this.getCurrentViewport=function(T){return T.copy(S)},this.getViewport=function(T){return T.copy(ne)},this.setViewport=function(T,F,G,V){T.isVector4?ne.set(T.x,T.y,T.z,T.w):ne.set(T,F,G,V),Le.viewport(S.copy(ne).multiplyScalar(ie).round())},this.getScissor=function(T){return T.copy(le)},this.setScissor=function(T,F,G,V){T.isVector4?le.set(T.x,T.y,T.z,T.w):le.set(T,F,G,V),Le.scissor(w.copy(le).multiplyScalar(ie).round())},this.getScissorTest=function(){return Te},this.setScissorTest=function(T){Le.setScissorTest(Te=T)},this.setOpaqueSort=function(T){I=T},this.setTransparentSort=function(T){ee=T},this.getClearColor=function(T){return T.copy(J.getClearColor())},this.setClearColor=function(){J.setClearColor.apply(J,arguments)},this.getClearAlpha=function(){return J.getClearAlpha()},this.setClearAlpha=function(){J.setClearAlpha.apply(J,arguments)},this.clear=function(T=!0,F=!0,G=!0){let V=0;if(T){let O=!1;if(A!==null){const ce=A.texture.format;O=ce===Mf||ce===Sf||ce===yf}if(O){const ce=A.texture.type,_e=ce===Di||ce===Vr||ce===Ja||ce===Xs||ce===vf||ce===xf,Se=J.getClearColor(),Ee=J.getClearAlpha(),ke=Se.r,Fe=Se.g,Ae=Se.b;_e?(p[0]=ke,p[1]=Fe,p[2]=Ae,p[3]=Ee,D.clearBufferuiv(D.COLOR,0,p)):(_[0]=ke,_[1]=Fe,_[2]=Ae,_[3]=Ee,D.clearBufferiv(D.COLOR,0,_))}else V|=D.COLOR_BUFFER_BIT}F&&(V|=D.DEPTH_BUFFER_BIT,D.clearDepth(this.capabilities.reverseDepthBuffer?0:1)),G&&(V|=D.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),D.clear(V)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){n.removeEventListener("webglcontextlost",K,!1),n.removeEventListener("webglcontextrestored",me,!1),n.removeEventListener("webglcontextcreationerror",ge,!1),ve.dispose(),Ke.dispose(),Ue.dispose(),E.dispose(),H.dispose(),Z.dispose(),$e.dispose(),U.dispose(),Me.dispose(),B.dispose(),B.removeEventListener("sessionstart",_r),B.removeEventListener("sessionend",ho),Nn.stop()};function K(T){T.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),M=!0}function me(){console.log("THREE.WebGLRenderer: Context Restored."),M=!1;const T=et.autoReset,F=$.enabled,G=$.autoUpdate,V=$.needsUpdate,O=$.type;pe(),et.autoReset=T,$.enabled=F,$.autoUpdate=G,$.needsUpdate=V,$.type=O}function ge(T){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function Be(T){const F=T.target;F.removeEventListener("dispose",Be),rt(F)}function rt(T){Tt(T),Ue.remove(T)}function Tt(T){const F=Ue.get(T).programs;F!==void 0&&(F.forEach(function(G){Me.releaseProgram(G)}),T.isShaderMaterial&&Me.releaseShaderCache(T))}this.renderBufferDirect=function(T,F,G,V,O,ce){F===null&&(F=qe);const _e=O.isMesh&&O.matrixWorld.determinant()<0,Se=A0(T,F,G,V,O);Le.setMaterial(V,_e);let Ee=G.index,ke=1;if(V.wireframe===!0){if(Ee=se.getWireframeAttribute(G),Ee===void 0)return;ke=2}const Fe=G.drawRange,Ae=G.attributes.position;let st=Fe.start*ke,pt=(Fe.start+Fe.count)*ke;ce!==null&&(st=Math.max(st,ce.start*ke),pt=Math.min(pt,(ce.start+ce.count)*ke)),Ee!==null?(st=Math.max(st,0),pt=Math.min(pt,Ee.count)):Ae!=null&&(st=Math.max(st,0),pt=Math.min(pt,Ae.count));const At=pt-st;if(At<0||At===1/0)return;$e.setup(O,V,Se,G,Ee);let xn,tt=re;if(Ee!==null&&(xn=Q.get(Ee),tt=Pe,tt.setIndex(xn)),O.isMesh)V.wireframe===!0?(Le.setLineWidth(V.wireframeLinewidth*je()),tt.setMode(D.LINES)):tt.setMode(D.TRIANGLES);else if(O.isLine){let be=V.linewidth;be===void 0&&(be=1),Le.setLineWidth(be*je()),O.isLineSegments?tt.setMode(D.LINES):O.isLineLoop?tt.setMode(D.LINE_LOOP):tt.setMode(D.LINE_STRIP)}else O.isPoints?tt.setMode(D.POINTS):O.isSprite&&tt.setMode(D.TRIANGLES);if(O.isBatchedMesh)if(O._multiDrawInstances!==null)tt.renderMultiDrawInstances(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount,O._multiDrawInstances);else if(Xe.get("WEBGL_multi_draw"))tt.renderMultiDraw(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount);else{const be=O._multiDrawStarts,Vt=O._multiDrawCounts,nt=O._multiDrawCount,Wn=Ee?Q.get(Ee).bytesPerElement:1,Yr=Ue.get(V).currentProgram.getUniforms();for(let yn=0;yn<nt;yn++)Yr.setValue(D,"_gl_DrawID",yn),tt.render(be[yn]/Wn,Vt[yn])}else if(O.isInstancedMesh)tt.renderInstances(st,At,O.count);else if(G.isInstancedBufferGeometry){const be=G._maxInstanceCount!==void 0?G._maxInstanceCount:1/0,Vt=Math.min(G.instanceCount,be);tt.renderInstances(st,At,Vt)}else tt.render(st,At)};function We(T,F,G){T.transparent===!0&&T.side===lt&&T.forceSinglePass===!1?(T.side=Yt,T.needsUpdate=!0,po(T,F,G),T.side=dr,T.needsUpdate=!0,po(T,F,G),T.side=lt):po(T,F,G)}this.compile=function(T,F,G=null){G===null&&(G=T),m=Ke.get(G),m.init(F),x.push(m),G.traverseVisible(function(O){O.isLight&&O.layers.test(F.layers)&&(m.pushLight(O),O.castShadow&&m.pushShadow(O))}),T!==G&&T.traverseVisible(function(O){O.isLight&&O.layers.test(F.layers)&&(m.pushLight(O),O.castShadow&&m.pushShadow(O))}),m.setupLights();const V=new Set;return T.traverse(function(O){if(!(O.isMesh||O.isPoints||O.isLine||O.isSprite))return;const ce=O.material;if(ce)if(Array.isArray(ce))for(let _e=0;_e<ce.length;_e++){const Se=ce[_e];We(Se,G,O),V.add(Se)}else We(ce,G,O),V.add(ce)}),x.pop(),m=null,V},this.compileAsync=function(T,F,G=null){const V=this.compile(T,F,G);return new Promise(O=>{function ce(){if(V.forEach(function(_e){Ue.get(_e).currentProgram.isReady()&&V.delete(_e)}),V.size===0){O(T);return}setTimeout(ce,10)}Xe.get("KHR_parallel_shader_compile")!==null?ce():setTimeout(ce,10)})};let ut=null;function zt(T){ut&&ut(T)}function _r(){Nn.stop()}function ho(){Nn.start()}const Nn=new Zv;Nn.setAnimationLoop(zt),typeof self<"u"&&Nn.setContext(self),this.setAnimationLoop=function(T){ut=T,B.setAnimationLoop(T),T===null?Nn.stop():Nn.start()},B.addEventListener("sessionstart",_r),B.addEventListener("sessionend",ho),this.render=function(T,F){if(F!==void 0&&F.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(M===!0)return;if(T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),B.enabled===!0&&B.isPresenting===!0&&(B.cameraAutoUpdate===!0&&B.updateCamera(F),F=B.getCamera()),T.isScene===!0&&T.onBeforeRender(y,T,F,A),m=Ke.get(T,x.length),m.init(F),x.push(m),de.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),ze.setFromProjectionMatrix(de),Y=this.localClippingEnabled,X=oe.init(this.clippingPlanes,Y),v=ve.get(T,d.length),v.init(),d.push(v),B.enabled===!0&&B.isPresenting===!0){const ce=y.xr.getDepthSensingMesh();ce!==null&&jn(ce,F,-1/0,y.sortObjects)}jn(T,F,0,y.sortObjects),v.finish(),y.sortObjects===!0&&v.sort(I,ee),Je=B.enabled===!1||B.isPresenting===!1||B.hasDepthSensing()===!1,Je&&J.addToRenderList(v,T),this.info.render.frame++,X===!0&&oe.beginShadows();const G=m.state.shadowsArray;$.render(G,T,F),X===!0&&oe.endShadows(),this.info.autoReset===!0&&this.info.reset();const V=v.opaque,O=v.transmissive;if(m.setupLights(),F.isArrayCamera){const ce=F.cameras;if(O.length>0)for(let _e=0,Se=ce.length;_e<Se;_e++){const Ee=ce[_e];Df(V,O,T,Ee)}Je&&J.render(T);for(let _e=0,Se=ce.length;_e<Se;_e++){const Ee=ce[_e];Lf(v,T,Ee,Ee.viewport)}}else O.length>0&&Df(V,O,T,F),Je&&J.render(T),Lf(v,T,F);A!==null&&(R.updateMultisampleRenderTarget(A),R.updateRenderTargetMipmap(A)),T.isScene===!0&&T.onAfterRender(y,T,F),$e.resetDefaultState(),b=-1,z=null,x.pop(),x.length>0?(m=x[x.length-1],X===!0&&oe.setGlobalState(y.clippingPlanes,m.state.camera)):m=null,d.pop(),d.length>0?v=d[d.length-1]:v=null};function jn(T,F,G,V){if(T.visible===!1)return;if(T.layers.test(F.layers)){if(T.isGroup)G=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(F);else if(T.isLight)m.pushLight(T),T.castShadow&&m.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||ze.intersectsSprite(T)){V&&De.setFromMatrixPosition(T.matrixWorld).applyMatrix4(de);const _e=Z.update(T),Se=T.material;Se.visible&&v.push(T,_e,Se,G,De.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||ze.intersectsObject(T))){const _e=Z.update(T),Se=T.material;if(V&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),De.copy(T.boundingSphere.center)):(_e.boundingSphere===null&&_e.computeBoundingSphere(),De.copy(_e.boundingSphere.center)),De.applyMatrix4(T.matrixWorld).applyMatrix4(de)),Array.isArray(Se)){const Ee=_e.groups;for(let ke=0,Fe=Ee.length;ke<Fe;ke++){const Ae=Ee[ke],st=Se[Ae.materialIndex];st&&st.visible&&v.push(T,_e,st,G,De.z,Ae)}}else Se.visible&&v.push(T,_e,Se,G,De.z,null)}}const ce=T.children;for(let _e=0,Se=ce.length;_e<Se;_e++)jn(ce[_e],F,G,V)}function Lf(T,F,G,V){const O=T.opaque,ce=T.transmissive,_e=T.transparent;m.setupLightsView(G),X===!0&&oe.setGlobalState(y.clippingPlanes,G),V&&Le.viewport(S.copy(V)),O.length>0&&fo(O,F,G),ce.length>0&&fo(ce,F,G),_e.length>0&&fo(_e,F,G),Le.buffers.depth.setTest(!0),Le.buffers.depth.setMask(!0),Le.buffers.color.setMask(!0),Le.setPolygonOffset(!1)}function Df(T,F,G,V){if((G.isScene===!0?G.overrideMaterial:null)!==null)return;m.state.transmissionRenderTarget[V.id]===void 0&&(m.state.transmissionRenderTarget[V.id]=new jr(1,1,{generateMipmaps:!0,type:Xe.has("EXT_color_buffer_half_float")||Xe.has("EXT_color_buffer_float")?oo:Di,minFilter:Zi,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:it.workingColorSpace}));const ce=m.state.transmissionRenderTarget[V.id],_e=V.viewport||S;ce.setSize(_e.z,_e.w);const Se=y.getRenderTarget();y.setRenderTarget(ce),y.getClearColor(k),j=y.getClearAlpha(),j<1&&y.setClearColor(16777215,.5),y.clear(),Je&&J.render(G);const Ee=y.toneMapping;y.toneMapping=lr;const ke=V.viewport;if(V.viewport!==void 0&&(V.viewport=void 0),m.setupLightsView(V),X===!0&&oe.setGlobalState(y.clippingPlanes,V),fo(T,G,V),R.updateMultisampleRenderTarget(ce),R.updateRenderTargetMipmap(ce),Xe.has("WEBGL_multisampled_render_to_texture")===!1){let Fe=!1;for(let Ae=0,st=F.length;Ae<st;Ae++){const pt=F[Ae],At=pt.object,xn=pt.geometry,tt=pt.material,be=pt.group;if(tt.side===lt&&At.layers.test(V.layers)){const Vt=tt.side;tt.side=Yt,tt.needsUpdate=!0,If(At,G,V,xn,tt,be),tt.side=Vt,tt.needsUpdate=!0,Fe=!0}}Fe===!0&&(R.updateMultisampleRenderTarget(ce),R.updateRenderTargetMipmap(ce))}y.setRenderTarget(Se),y.setClearColor(k,j),ke!==void 0&&(V.viewport=ke),y.toneMapping=Ee}function fo(T,F,G){const V=F.isScene===!0?F.overrideMaterial:null;for(let O=0,ce=T.length;O<ce;O++){const _e=T[O],Se=_e.object,Ee=_e.geometry,ke=V===null?_e.material:V,Fe=_e.group;Se.layers.test(G.layers)&&If(Se,F,G,Ee,ke,Fe)}}function If(T,F,G,V,O,ce){T.onBeforeRender(y,F,G,V,O,ce),T.modelViewMatrix.multiplyMatrices(G.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),O.onBeforeRender(y,F,G,V,T,ce),O.transparent===!0&&O.side===lt&&O.forceSinglePass===!1?(O.side=Yt,O.needsUpdate=!0,y.renderBufferDirect(G,F,V,O,T,ce),O.side=dr,O.needsUpdate=!0,y.renderBufferDirect(G,F,V,O,T,ce),O.side=lt):y.renderBufferDirect(G,F,V,O,T,ce),T.onAfterRender(y,F,G,V,O,ce)}function po(T,F,G){F.isScene!==!0&&(F=qe);const V=Ue.get(T),O=m.state.lights,ce=m.state.shadowsArray,_e=O.state.version,Se=Me.getParameters(T,O.state,ce,F,G),Ee=Me.getProgramCacheKey(Se);let ke=V.programs;V.environment=T.isMeshStandardMaterial?F.environment:null,V.fog=F.fog,V.envMap=(T.isMeshStandardMaterial?H:E).get(T.envMap||V.environment),V.envMapRotation=V.environment!==null&&T.envMap===null?F.environmentRotation:T.envMapRotation,ke===void 0&&(T.addEventListener("dispose",Be),ke=new Map,V.programs=ke);let Fe=ke.get(Ee);if(Fe!==void 0){if(V.currentProgram===Fe&&V.lightsStateVersion===_e)return kf(T,Se),Fe}else Se.uniforms=Me.getUniforms(T),T.onBeforeCompile(Se,y),Fe=Me.acquireProgram(Se,Ee),ke.set(Ee,Fe),V.uniforms=Se.uniforms;const Ae=V.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(Ae.clippingPlanes=oe.uniform),kf(T,Se),V.needsLights=C0(T),V.lightsStateVersion=_e,V.needsLights&&(Ae.ambientLightColor.value=O.state.ambient,Ae.lightProbe.value=O.state.probe,Ae.directionalLights.value=O.state.directional,Ae.directionalLightShadows.value=O.state.directionalShadow,Ae.spotLights.value=O.state.spot,Ae.spotLightShadows.value=O.state.spotShadow,Ae.rectAreaLights.value=O.state.rectArea,Ae.ltc_1.value=O.state.rectAreaLTC1,Ae.ltc_2.value=O.state.rectAreaLTC2,Ae.pointLights.value=O.state.point,Ae.pointLightShadows.value=O.state.pointShadow,Ae.hemisphereLights.value=O.state.hemi,Ae.directionalShadowMap.value=O.state.directionalShadowMap,Ae.directionalShadowMatrix.value=O.state.directionalShadowMatrix,Ae.spotShadowMap.value=O.state.spotShadowMap,Ae.spotLightMatrix.value=O.state.spotLightMatrix,Ae.spotLightMap.value=O.state.spotLightMap,Ae.pointShadowMap.value=O.state.pointShadowMap,Ae.pointShadowMatrix.value=O.state.pointShadowMatrix),V.currentProgram=Fe,V.uniformsList=null,Fe}function Uf(T){if(T.uniformsList===null){const F=T.currentProgram.getUniforms();T.uniformsList=Cl.seqWithValue(F.seq,T.uniforms)}return T.uniformsList}function kf(T,F){const G=Ue.get(T);G.outputColorSpace=F.outputColorSpace,G.batching=F.batching,G.batchingColor=F.batchingColor,G.instancing=F.instancing,G.instancingColor=F.instancingColor,G.instancingMorph=F.instancingMorph,G.skinning=F.skinning,G.morphTargets=F.morphTargets,G.morphNormals=F.morphNormals,G.morphColors=F.morphColors,G.morphTargetsCount=F.morphTargetsCount,G.numClippingPlanes=F.numClippingPlanes,G.numIntersection=F.numClipIntersection,G.vertexAlphas=F.vertexAlphas,G.vertexTangents=F.vertexTangents,G.toneMapping=F.toneMapping}function A0(T,F,G,V,O){F.isScene!==!0&&(F=qe),R.resetTextureUnits();const ce=F.fog,_e=V.isMeshStandardMaterial?F.environment:null,Se=A===null?y.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:mr,Ee=(V.isMeshStandardMaterial?H:E).get(V.envMap||_e),ke=V.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,Fe=!!G.attributes.tangent&&(!!V.normalMap||V.anisotropy>0),Ae=!!G.morphAttributes.position,st=!!G.morphAttributes.normal,pt=!!G.morphAttributes.color;let At=lr;V.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(At=y.toneMapping);const xn=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,tt=xn!==void 0?xn.length:0,be=Ue.get(V),Vt=m.state.lights;if(X===!0&&(Y===!0||T!==z)){const Ln=T===z&&V.id===b;oe.setState(V,T,Ln)}let nt=!1;V.version===be.__version?(be.needsLights&&be.lightsStateVersion!==Vt.state.version||be.outputColorSpace!==Se||O.isBatchedMesh&&be.batching===!1||!O.isBatchedMesh&&be.batching===!0||O.isBatchedMesh&&be.batchingColor===!0&&O.colorTexture===null||O.isBatchedMesh&&be.batchingColor===!1&&O.colorTexture!==null||O.isInstancedMesh&&be.instancing===!1||!O.isInstancedMesh&&be.instancing===!0||O.isSkinnedMesh&&be.skinning===!1||!O.isSkinnedMesh&&be.skinning===!0||O.isInstancedMesh&&be.instancingColor===!0&&O.instanceColor===null||O.isInstancedMesh&&be.instancingColor===!1&&O.instanceColor!==null||O.isInstancedMesh&&be.instancingMorph===!0&&O.morphTexture===null||O.isInstancedMesh&&be.instancingMorph===!1&&O.morphTexture!==null||be.envMap!==Ee||V.fog===!0&&be.fog!==ce||be.numClippingPlanes!==void 0&&(be.numClippingPlanes!==oe.numPlanes||be.numIntersection!==oe.numIntersection)||be.vertexAlphas!==ke||be.vertexTangents!==Fe||be.morphTargets!==Ae||be.morphNormals!==st||be.morphColors!==pt||be.toneMapping!==At||be.morphTargetsCount!==tt)&&(nt=!0):(nt=!0,be.__version=V.version);let Wn=be.currentProgram;nt===!0&&(Wn=po(V,F,O));let Yr=!1,yn=!1,Cc=!1;const Rt=Wn.getUniforms(),Ui=be.uniforms;if(Le.useProgram(Wn.program)&&(Yr=!0,yn=!0,Cc=!0),V.id!==b&&(b=V.id,yn=!0),Yr||z!==T){Ze.reverseDepthBuffer?(ue.copy(T.projectionMatrix),dM(ue),hM(ue),Rt.setValue(D,"projectionMatrix",ue)):Rt.setValue(D,"projectionMatrix",T.projectionMatrix),Rt.setValue(D,"viewMatrix",T.matrixWorldInverse);const Ln=Rt.map.cameraPosition;Ln!==void 0&&Ln.setValue(D,Ie.setFromMatrixPosition(T.matrixWorld)),Ze.logarithmicDepthBuffer&&Rt.setValue(D,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(V.isMeshPhongMaterial||V.isMeshToonMaterial||V.isMeshLambertMaterial||V.isMeshBasicMaterial||V.isMeshStandardMaterial||V.isShaderMaterial)&&Rt.setValue(D,"isOrthographic",T.isOrthographicCamera===!0),z!==T&&(z=T,yn=!0,Cc=!0)}if(O.isSkinnedMesh){Rt.setOptional(D,O,"bindMatrix"),Rt.setOptional(D,O,"bindMatrixInverse");const Ln=O.skeleton;Ln&&(Ln.boneTexture===null&&Ln.computeBoneTexture(),Rt.setValue(D,"boneTexture",Ln.boneTexture,R))}O.isBatchedMesh&&(Rt.setOptional(D,O,"batchingTexture"),Rt.setValue(D,"batchingTexture",O._matricesTexture,R),Rt.setOptional(D,O,"batchingIdTexture"),Rt.setValue(D,"batchingIdTexture",O._indirectTexture,R),Rt.setOptional(D,O,"batchingColorTexture"),O._colorsTexture!==null&&Rt.setValue(D,"batchingColorTexture",O._colorsTexture,R));const Rc=G.morphAttributes;if((Rc.position!==void 0||Rc.normal!==void 0||Rc.color!==void 0)&&te.update(O,G,Wn),(yn||be.receiveShadow!==O.receiveShadow)&&(be.receiveShadow=O.receiveShadow,Rt.setValue(D,"receiveShadow",O.receiveShadow)),V.isMeshGouraudMaterial&&V.envMap!==null&&(Ui.envMap.value=Ee,Ui.flipEnvMap.value=Ee.isCubeTexture&&Ee.isRenderTargetTexture===!1?-1:1),V.isMeshStandardMaterial&&V.envMap===null&&F.environment!==null&&(Ui.envMapIntensity.value=F.environmentIntensity),yn&&(Rt.setValue(D,"toneMappingExposure",y.toneMappingExposure),be.needsLights&&b0(Ui,Cc),ce&&V.fog===!0&&fe.refreshFogUniforms(Ui,ce),fe.refreshMaterialUniforms(Ui,V,ie,W,m.state.transmissionRenderTarget[T.id]),Cl.upload(D,Uf(be),Ui,R)),V.isShaderMaterial&&V.uniformsNeedUpdate===!0&&(Cl.upload(D,Uf(be),Ui,R),V.uniformsNeedUpdate=!1),V.isSpriteMaterial&&Rt.setValue(D,"center",O.center),Rt.setValue(D,"modelViewMatrix",O.modelViewMatrix),Rt.setValue(D,"normalMatrix",O.normalMatrix),Rt.setValue(D,"modelMatrix",O.matrixWorld),V.isShaderMaterial||V.isRawShaderMaterial){const Ln=V.uniformsGroups;for(let Pc=0,R0=Ln.length;Pc<R0;Pc++){const Ff=Ln[Pc];U.update(Ff,Wn),U.bind(Ff,Wn)}}return Wn}function b0(T,F){T.ambientLightColor.needsUpdate=F,T.lightProbe.needsUpdate=F,T.directionalLights.needsUpdate=F,T.directionalLightShadows.needsUpdate=F,T.pointLights.needsUpdate=F,T.pointLightShadows.needsUpdate=F,T.spotLights.needsUpdate=F,T.spotLightShadows.needsUpdate=F,T.rectAreaLights.needsUpdate=F,T.hemisphereLights.needsUpdate=F}function C0(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return P},this.getActiveMipmapLevel=function(){return C},this.getRenderTarget=function(){return A},this.setRenderTargetTextures=function(T,F,G){Ue.get(T.texture).__webglTexture=F,Ue.get(T.depthTexture).__webglTexture=G;const V=Ue.get(T);V.__hasExternalTextures=!0,V.__autoAllocateDepthBuffer=G===void 0,V.__autoAllocateDepthBuffer||Xe.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),V.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(T,F){const G=Ue.get(T);G.__webglFramebuffer=F,G.__useDefaultFramebuffer=F===void 0},this.setRenderTarget=function(T,F=0,G=0){A=T,P=F,C=G;let V=!0,O=null,ce=!1,_e=!1;if(T){const Ee=Ue.get(T);if(Ee.__useDefaultFramebuffer!==void 0)Le.bindFramebuffer(D.FRAMEBUFFER,null),V=!1;else if(Ee.__webglFramebuffer===void 0)R.setupRenderTarget(T);else if(Ee.__hasExternalTextures)R.rebindTextures(T,Ue.get(T.texture).__webglTexture,Ue.get(T.depthTexture).__webglTexture);else if(T.depthBuffer){const Ae=T.depthTexture;if(Ee.__boundDepthTexture!==Ae){if(Ae!==null&&Ue.has(Ae)&&(T.width!==Ae.image.width||T.height!==Ae.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");R.setupDepthRenderbuffer(T)}}const ke=T.texture;(ke.isData3DTexture||ke.isDataArrayTexture||ke.isCompressedArrayTexture)&&(_e=!0);const Fe=Ue.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(Fe[F])?O=Fe[F][G]:O=Fe[F],ce=!0):T.samples>0&&R.useMultisampledRTT(T)===!1?O=Ue.get(T).__webglMultisampledFramebuffer:Array.isArray(Fe)?O=Fe[G]:O=Fe,S.copy(T.viewport),w.copy(T.scissor),N=T.scissorTest}else S.copy(ne).multiplyScalar(ie).floor(),w.copy(le).multiplyScalar(ie).floor(),N=Te;if(Le.bindFramebuffer(D.FRAMEBUFFER,O)&&V&&Le.drawBuffers(T,O),Le.viewport(S),Le.scissor(w),Le.setScissorTest(N),ce){const Ee=Ue.get(T.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_CUBE_MAP_POSITIVE_X+F,Ee.__webglTexture,G)}else if(_e){const Ee=Ue.get(T.texture),ke=F||0;D.framebufferTextureLayer(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,Ee.__webglTexture,G||0,ke)}b=-1},this.readRenderTargetPixels=function(T,F,G,V,O,ce,_e){if(!(T&&T.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Se=Ue.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&_e!==void 0&&(Se=Se[_e]),Se){Le.bindFramebuffer(D.FRAMEBUFFER,Se);try{const Ee=T.texture,ke=Ee.format,Fe=Ee.type;if(!Ze.textureFormatReadable(ke)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Ze.textureTypeReadable(Fe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=T.width-V&&G>=0&&G<=T.height-O&&D.readPixels(F,G,V,O,we.convert(ke),we.convert(Fe),ce)}finally{const Ee=A!==null?Ue.get(A).__webglFramebuffer:null;Le.bindFramebuffer(D.FRAMEBUFFER,Ee)}}},this.readRenderTargetPixelsAsync=async function(T,F,G,V,O,ce,_e){if(!(T&&T.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Se=Ue.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&_e!==void 0&&(Se=Se[_e]),Se){const Ee=T.texture,ke=Ee.format,Fe=Ee.type;if(!Ze.textureFormatReadable(ke))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Ze.textureTypeReadable(Fe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(F>=0&&F<=T.width-V&&G>=0&&G<=T.height-O){Le.bindFramebuffer(D.FRAMEBUFFER,Se);const Ae=D.createBuffer();D.bindBuffer(D.PIXEL_PACK_BUFFER,Ae),D.bufferData(D.PIXEL_PACK_BUFFER,ce.byteLength,D.STREAM_READ),D.readPixels(F,G,V,O,we.convert(ke),we.convert(Fe),0);const st=A!==null?Ue.get(A).__webglFramebuffer:null;Le.bindFramebuffer(D.FRAMEBUFFER,st);const pt=D.fenceSync(D.SYNC_GPU_COMMANDS_COMPLETE,0);return D.flush(),await uM(D,pt,4),D.bindBuffer(D.PIXEL_PACK_BUFFER,Ae),D.getBufferSubData(D.PIXEL_PACK_BUFFER,0,ce),D.deleteBuffer(Ae),D.deleteSync(pt),ce}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(T,F=null,G=0){T.isTexture!==!0&&(bl("WebGLRenderer: copyFramebufferToTexture function signature has changed."),F=arguments[0]||null,T=arguments[1]);const V=Math.pow(2,-G),O=Math.floor(T.image.width*V),ce=Math.floor(T.image.height*V),_e=F!==null?F.x:0,Se=F!==null?F.y:0;R.setTexture2D(T,0),D.copyTexSubImage2D(D.TEXTURE_2D,G,0,0,_e,Se,O,ce),Le.unbindTexture()},this.copyTextureToTexture=function(T,F,G=null,V=null,O=0){T.isTexture!==!0&&(bl("WebGLRenderer: copyTextureToTexture function signature has changed."),V=arguments[0]||null,T=arguments[1],F=arguments[2],O=arguments[3]||0,G=null);let ce,_e,Se,Ee,ke,Fe;G!==null?(ce=G.max.x-G.min.x,_e=G.max.y-G.min.y,Se=G.min.x,Ee=G.min.y):(ce=T.image.width,_e=T.image.height,Se=0,Ee=0),V!==null?(ke=V.x,Fe=V.y):(ke=0,Fe=0);const Ae=we.convert(F.format),st=we.convert(F.type);R.setTexture2D(F,0),D.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,F.flipY),D.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),D.pixelStorei(D.UNPACK_ALIGNMENT,F.unpackAlignment);const pt=D.getParameter(D.UNPACK_ROW_LENGTH),At=D.getParameter(D.UNPACK_IMAGE_HEIGHT),xn=D.getParameter(D.UNPACK_SKIP_PIXELS),tt=D.getParameter(D.UNPACK_SKIP_ROWS),be=D.getParameter(D.UNPACK_SKIP_IMAGES),Vt=T.isCompressedTexture?T.mipmaps[O]:T.image;D.pixelStorei(D.UNPACK_ROW_LENGTH,Vt.width),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,Vt.height),D.pixelStorei(D.UNPACK_SKIP_PIXELS,Se),D.pixelStorei(D.UNPACK_SKIP_ROWS,Ee),T.isDataTexture?D.texSubImage2D(D.TEXTURE_2D,O,ke,Fe,ce,_e,Ae,st,Vt.data):T.isCompressedTexture?D.compressedTexSubImage2D(D.TEXTURE_2D,O,ke,Fe,Vt.width,Vt.height,Ae,Vt.data):D.texSubImage2D(D.TEXTURE_2D,O,ke,Fe,ce,_e,Ae,st,Vt),D.pixelStorei(D.UNPACK_ROW_LENGTH,pt),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,At),D.pixelStorei(D.UNPACK_SKIP_PIXELS,xn),D.pixelStorei(D.UNPACK_SKIP_ROWS,tt),D.pixelStorei(D.UNPACK_SKIP_IMAGES,be),O===0&&F.generateMipmaps&&D.generateMipmap(D.TEXTURE_2D),Le.unbindTexture()},this.copyTextureToTexture3D=function(T,F,G=null,V=null,O=0){T.isTexture!==!0&&(bl("WebGLRenderer: copyTextureToTexture3D function signature has changed."),G=arguments[0]||null,V=arguments[1]||null,T=arguments[2],F=arguments[3],O=arguments[4]||0);let ce,_e,Se,Ee,ke,Fe,Ae,st,pt;const At=T.isCompressedTexture?T.mipmaps[O]:T.image;G!==null?(ce=G.max.x-G.min.x,_e=G.max.y-G.min.y,Se=G.max.z-G.min.z,Ee=G.min.x,ke=G.min.y,Fe=G.min.z):(ce=At.width,_e=At.height,Se=At.depth,Ee=0,ke=0,Fe=0),V!==null?(Ae=V.x,st=V.y,pt=V.z):(Ae=0,st=0,pt=0);const xn=we.convert(F.format),tt=we.convert(F.type);let be;if(F.isData3DTexture)R.setTexture3D(F,0),be=D.TEXTURE_3D;else if(F.isDataArrayTexture||F.isCompressedArrayTexture)R.setTexture2DArray(F,0),be=D.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}D.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,F.flipY),D.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),D.pixelStorei(D.UNPACK_ALIGNMENT,F.unpackAlignment);const Vt=D.getParameter(D.UNPACK_ROW_LENGTH),nt=D.getParameter(D.UNPACK_IMAGE_HEIGHT),Wn=D.getParameter(D.UNPACK_SKIP_PIXELS),Yr=D.getParameter(D.UNPACK_SKIP_ROWS),yn=D.getParameter(D.UNPACK_SKIP_IMAGES);D.pixelStorei(D.UNPACK_ROW_LENGTH,At.width),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,At.height),D.pixelStorei(D.UNPACK_SKIP_PIXELS,Ee),D.pixelStorei(D.UNPACK_SKIP_ROWS,ke),D.pixelStorei(D.UNPACK_SKIP_IMAGES,Fe),T.isDataTexture||T.isData3DTexture?D.texSubImage3D(be,O,Ae,st,pt,ce,_e,Se,xn,tt,At.data):F.isCompressedArrayTexture?D.compressedTexSubImage3D(be,O,Ae,st,pt,ce,_e,Se,xn,At.data):D.texSubImage3D(be,O,Ae,st,pt,ce,_e,Se,xn,tt,At),D.pixelStorei(D.UNPACK_ROW_LENGTH,Vt),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,nt),D.pixelStorei(D.UNPACK_SKIP_PIXELS,Wn),D.pixelStorei(D.UNPACK_SKIP_ROWS,Yr),D.pixelStorei(D.UNPACK_SKIP_IMAGES,yn),O===0&&F.generateMipmaps&&D.generateMipmap(be),Le.unbindTexture()},this.initRenderTarget=function(T){Ue.get(T).__webglFramebuffer===void 0&&R.setupRenderTarget(T)},this.initTexture=function(T){T.isCubeTexture?R.setTextureCube(T,0):T.isData3DTexture?R.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?R.setTexture2DArray(T,0):R.setTexture2D(T,0),Le.unbindTexture()},this.resetState=function(){P=0,C=0,A=null,Le.reset(),$e.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ai}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const n=this.getContext();n.drawingBufferColorSpace=e===Ef?"display-p3":"srgb",n.unpackColorSpace=it.workingColorSpace===wc?"display-p3":"srgb"}}class s0 extends Dt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new pi,this.environmentIntensity=1,this.environmentRotation=new pi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,n){return super.copy(e,n),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const n=super.toJSON(e);return this.fog!==null&&(n.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(n.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(n.object.backgroundIntensity=this.backgroundIntensity),n.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(n.object.environmentIntensity=this.environmentIntensity),n.object.environmentRotation=this.environmentRotation.toArray(),n}}class MA{constructor(e,n){this.isInterleavedBuffer=!0,this.array=e,this.stride=n,this.count=e!==void 0?e.length/n:0,this.usage=_h,this.updateRanges=[],this.version=0,this.uuid=Ci()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,n,i){e*=this.stride,i*=n.stride;for(let r=0,s=this.stride;r<s;r++)this.array[e+r]=n.array[i+r];return this}set(e,n=0){return this.array.set(e,n),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Ci()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const n=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(n,this.stride);return i.setUsage(this.usage),i}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Ci()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const sn=new L;class rc{constructor(e,n,i,r=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=n,this.offset=i,this.normalized=r}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let n=0,i=this.data.count;n<i;n++)sn.fromBufferAttribute(this,n),sn.applyMatrix4(e),this.setXYZ(n,sn.x,sn.y,sn.z);return this}applyNormalMatrix(e){for(let n=0,i=this.count;n<i;n++)sn.fromBufferAttribute(this,n),sn.applyNormalMatrix(e),this.setXYZ(n,sn.x,sn.y,sn.z);return this}transformDirection(e){for(let n=0,i=this.count;n<i;n++)sn.fromBufferAttribute(this,n),sn.transformDirection(e),this.setXYZ(n,sn.x,sn.y,sn.z);return this}getComponent(e,n){let i=this.array[e*this.data.stride+this.offset+n];return this.normalized&&(i=ti(i,this.array)),i}setComponent(e,n,i){return this.normalized&&(i=at(i,this.array)),this.data.array[e*this.data.stride+this.offset+n]=i,this}setX(e,n){return this.normalized&&(n=at(n,this.array)),this.data.array[e*this.data.stride+this.offset]=n,this}setY(e,n){return this.normalized&&(n=at(n,this.array)),this.data.array[e*this.data.stride+this.offset+1]=n,this}setZ(e,n){return this.normalized&&(n=at(n,this.array)),this.data.array[e*this.data.stride+this.offset+2]=n,this}setW(e,n){return this.normalized&&(n=at(n,this.array)),this.data.array[e*this.data.stride+this.offset+3]=n,this}getX(e){let n=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(n=ti(n,this.array)),n}getY(e){let n=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(n=ti(n,this.array)),n}getZ(e){let n=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(n=ti(n,this.array)),n}getW(e){let n=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(n=ti(n,this.array)),n}setXY(e,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(n=at(n,this.array),i=at(i,this.array)),this.data.array[e+0]=n,this.data.array[e+1]=i,this}setXYZ(e,n,i,r){return e=e*this.data.stride+this.offset,this.normalized&&(n=at(n,this.array),i=at(i,this.array),r=at(r,this.array)),this.data.array[e+0]=n,this.data.array[e+1]=i,this.data.array[e+2]=r,this}setXYZW(e,n,i,r,s){return e=e*this.data.stride+this.offset,this.normalized&&(n=at(n,this.array),i=at(i,this.array),r=at(r,this.array),s=at(s,this.array)),this.data.array[e+0]=n,this.data.array[e+1]=i,this.data.array[e+2]=r,this.data.array[e+3]=s,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const n=[];for(let i=0;i<this.count;i++){const r=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)n.push(this.data.array[r+s])}return new vn(new this.array.constructor(n),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new rc(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const n=[];for(let i=0;i<this.count;i++){const r=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)n.push(this.data.array[r+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:n,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class a0 extends gr{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Ce(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let us;const pa=new L,ds=new L,hs=new L,fs=new He,ma=new He,o0=new ht,Jo=new L,ga=new L,el=new L,Hm=new He,Lu=new He,Gm=new He;class EA extends Dt{constructor(e=new a0){if(super(),this.isSprite=!0,this.type="Sprite",us===void 0){us=new ct;const n=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new MA(n,5);us.setIndex([0,1,2,0,2,3]),us.setAttribute("position",new rc(i,3,0,!1)),us.setAttribute("uv",new rc(i,2,3,!1))}this.geometry=us,this.material=e,this.center=new He(.5,.5)}raycast(e,n){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),ds.setFromMatrixScale(this.matrixWorld),o0.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),hs.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&ds.multiplyScalar(-hs.z);const i=this.material.rotation;let r,s;i!==0&&(s=Math.cos(i),r=Math.sin(i));const a=this.center;tl(Jo.set(-.5,-.5,0),hs,a,ds,r,s),tl(ga.set(.5,-.5,0),hs,a,ds,r,s),tl(el.set(.5,.5,0),hs,a,ds,r,s),Hm.set(0,0),Lu.set(1,0),Gm.set(1,1);let o=e.ray.intersectTriangle(Jo,ga,el,!1,pa);if(o===null&&(tl(ga.set(-.5,.5,0),hs,a,ds,r,s),Lu.set(0,1),o=e.ray.intersectTriangle(Jo,el,ga,!1,pa),o===null))return;const l=e.ray.origin.distanceTo(pa);l<e.near||l>e.far||n.push({distance:l,point:pa.clone(),uv:kn.getInterpolation(pa,Jo,ga,el,Hm,Lu,Gm,new He),face:null,object:this})}copy(e,n){return super.copy(e,n),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function tl(t,e,n,i,r,s){fs.subVectors(t,n).addScalar(.5).multiply(i),r!==void 0?(ma.x=s*fs.x-r*fs.y,ma.y=r*fs.x+s*fs.y):ma.copy(fs),t.copy(e),t.x+=ma.x,t.y+=ma.y,t.applyMatrix4(o0)}class Ir extends gr{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ce(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const sc=new L,ac=new L,Vm=new ht,_a=new Tc,nl=new uo,Du=new L,jm=new L;class Ur extends Dt{constructor(e=new ct,n=new Ir){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=n,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const n=e.attributes.position,i=[0];for(let r=1,s=n.count;r<s;r++)sc.fromBufferAttribute(n,r-1),ac.fromBufferAttribute(n,r),i[r]=i[r-1],i[r]+=sc.distanceTo(ac);e.setAttribute("lineDistance",new ft(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,n){const i=this.geometry,r=this.matrixWorld,s=e.params.Line.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),nl.copy(i.boundingSphere),nl.applyMatrix4(r),nl.radius+=s,e.ray.intersectsSphere(nl)===!1)return;Vm.copy(r).invert(),_a.copy(e.ray).applyMatrix4(Vm);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,u=i.index,h=i.attributes.position;if(u!==null){const p=Math.max(0,a.start),_=Math.min(u.count,a.start+a.count);for(let v=p,m=_-1;v<m;v+=c){const d=u.getX(v),x=u.getX(v+1),y=il(this,e,_a,l,d,x);y&&n.push(y)}if(this.isLineLoop){const v=u.getX(_-1),m=u.getX(p),d=il(this,e,_a,l,v,m);d&&n.push(d)}}else{const p=Math.max(0,a.start),_=Math.min(h.count,a.start+a.count);for(let v=p,m=_-1;v<m;v+=c){const d=il(this,e,_a,l,v,v+1);d&&n.push(d)}if(this.isLineLoop){const v=il(this,e,_a,l,_-1,p);v&&n.push(v)}}}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function il(t,e,n,i,r,s){const a=t.geometry.attributes.position;if(sc.fromBufferAttribute(a,r),ac.fromBufferAttribute(a,s),n.distanceSqToSegment(sc,ac,Du,jm)>i)return;Du.applyMatrix4(t.matrixWorld);const l=e.ray.origin.distanceTo(Du);if(!(l<e.near||l>e.far))return{distance:l,point:jm.clone().applyMatrix4(t.matrixWorld),index:r,face:null,faceIndex:null,barycoord:null,object:t}}const Wm=new L,Xm=new L;class Iu extends Ur{constructor(e,n){super(e,n),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const n=e.attributes.position,i=[];for(let r=0,s=n.count;r<s;r+=2)Wm.fromBufferAttribute(n,r),Xm.fromBufferAttribute(n,r+1),i[r]=r===0?0:i[r-1],i[r+1]=i[r]+Wm.distanceTo(Xm);e.setAttribute("lineDistance",new ft(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class $m extends Ur{constructor(e,n){super(e,n),this.isLineLoop=!0,this.type="LineLoop"}}class l0 extends gr{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Ce(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Ym=new ht,xh=new Tc,rl=new uo,sl=new L;class wA extends Dt{constructor(e=new ct,n=new l0){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=n,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,n){const i=this.geometry,r=this.matrixWorld,s=e.params.Points.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),rl.copy(i.boundingSphere),rl.applyMatrix4(r),rl.radius+=s,e.ray.intersectsSphere(rl)===!1)return;Ym.copy(r).invert(),xh.copy(e.ray).applyMatrix4(Ym);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=i.index,f=i.attributes.position;if(c!==null){const h=Math.max(0,a.start),p=Math.min(c.count,a.start+a.count);for(let _=h,v=p;_<v;_++){const m=c.getX(_);sl.fromBufferAttribute(f,m),qm(sl,m,l,r,e,n,this)}}else{const h=Math.max(0,a.start),p=Math.min(f.count,a.start+a.count);for(let _=h,v=p;_<v;_++)sl.fromBufferAttribute(f,_),qm(sl,_,l,r,e,n,this)}}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function qm(t,e,n,i,r,s,a){const o=xh.distanceSqToPoint(t);if(o<n){const l=new L;xh.closestPointToPoint(t,l),l.applyMatrix4(i);const c=r.ray.origin.distanceTo(l);if(c<r.near||c>r.far)return;s.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class TA extends nn{constructor(e,n,i,r,s,a,o,l,c){super(e,n,i,r,s,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class bc extends ct{constructor(e=1,n=32,i=0,r=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:n,thetaStart:i,thetaLength:r},n=Math.max(3,n);const s=[],a=[],o=[],l=[],c=new L,u=new He;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let f=0,h=3;f<=n;f++,h+=3){const p=i+f/n*r;c.x=e*Math.cos(p),c.y=e*Math.sin(p),a.push(c.x,c.y,c.z),o.push(0,0,1),u.x=(a[h]/e+1)/2,u.y=(a[h+1]/e+1)/2,l.push(u.x,u.y)}for(let f=1;f<=n;f++)s.push(f,f+1,0);this.setIndex(s),this.setAttribute("position",new ft(a,3)),this.setAttribute("normal",new ft(o,3)),this.setAttribute("uv",new ft(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new bc(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class Fn extends ct{constructor(e=1,n=1,i=1,r=32,s=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:n,height:i,radialSegments:r,heightSegments:s,openEnded:a,thetaStart:o,thetaLength:l};const c=this;r=Math.floor(r),s=Math.floor(s);const u=[],f=[],h=[],p=[];let _=0;const v=[],m=i/2;let d=0;x(),a===!1&&(e>0&&y(!0),n>0&&y(!1)),this.setIndex(u),this.setAttribute("position",new ft(f,3)),this.setAttribute("normal",new ft(h,3)),this.setAttribute("uv",new ft(p,2));function x(){const M=new L,P=new L;let C=0;const A=(n-e)/i;for(let b=0;b<=s;b++){const z=[],S=b/s,w=S*(n-e)+e;for(let N=0;N<=r;N++){const k=N/r,j=k*l+o,q=Math.sin(j),W=Math.cos(j);P.x=w*q,P.y=-S*i+m,P.z=w*W,f.push(P.x,P.y,P.z),M.set(q,A,W).normalize(),h.push(M.x,M.y,M.z),p.push(k,1-S),z.push(_++)}v.push(z)}for(let b=0;b<r;b++)for(let z=0;z<s;z++){const S=v[z][b],w=v[z+1][b],N=v[z+1][b+1],k=v[z][b+1];e>0&&(u.push(S,w,k),C+=3),n>0&&(u.push(w,N,k),C+=3)}c.addGroup(d,C,0),d+=C}function y(M){const P=_,C=new He,A=new L;let b=0;const z=M===!0?e:n,S=M===!0?1:-1;for(let N=1;N<=r;N++)f.push(0,m*S,0),h.push(0,S,0),p.push(.5,.5),_++;const w=_;for(let N=0;N<=r;N++){const j=N/r*l+o,q=Math.cos(j),W=Math.sin(j);A.x=z*W,A.y=m*S,A.z=z*q,f.push(A.x,A.y,A.z),h.push(0,S,0),C.x=q*.5+.5,C.y=W*.5*S+.5,p.push(C.x,C.y),_++}for(let N=0;N<r;N++){const k=P+N,j=w+N;M===!0?u.push(j,j+1,k):u.push(j+1,j,k),b+=3}c.addGroup(d,b,M===!0?1:2),d+=b}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Fn(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Pr extends ct{constructor(e=.5,n=1,i=32,r=1,s=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:n,thetaSegments:i,phiSegments:r,thetaStart:s,thetaLength:a},i=Math.max(3,i),r=Math.max(1,r);const o=[],l=[],c=[],u=[];let f=e;const h=(n-e)/r,p=new L,_=new He;for(let v=0;v<=r;v++){for(let m=0;m<=i;m++){const d=s+m/i*a;p.x=f*Math.cos(d),p.y=f*Math.sin(d),l.push(p.x,p.y,p.z),c.push(0,0,1),_.x=(p.x/n+1)/2,_.y=(p.y/n+1)/2,u.push(_.x,_.y)}f+=h}for(let v=0;v<r;v++){const m=v*(i+1);for(let d=0;d<i;d++){const x=d+m,y=x,M=x+i+1,P=x+i+2,C=x+1;o.push(y,M,C),o.push(M,P,C)}}this.setIndex(o),this.setAttribute("position",new ft(l,3)),this.setAttribute("normal",new ft(c,3)),this.setAttribute("uv",new ft(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Pr(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class An extends ct{constructor(e=1,n=32,i=16,r=0,s=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:n,heightSegments:i,phiStart:r,phiLength:s,thetaStart:a,thetaLength:o},n=Math.max(3,Math.floor(n)),i=Math.max(2,Math.floor(i));const l=Math.min(a+o,Math.PI);let c=0;const u=[],f=new L,h=new L,p=[],_=[],v=[],m=[];for(let d=0;d<=i;d++){const x=[],y=d/i;let M=0;d===0&&a===0?M=.5/n:d===i&&l===Math.PI&&(M=-.5/n);for(let P=0;P<=n;P++){const C=P/n;f.x=-e*Math.cos(r+C*s)*Math.sin(a+y*o),f.y=e*Math.cos(a+y*o),f.z=e*Math.sin(r+C*s)*Math.sin(a+y*o),_.push(f.x,f.y,f.z),h.copy(f).normalize(),v.push(h.x,h.y,h.z),m.push(C+M,1-y),x.push(c++)}u.push(x)}for(let d=0;d<i;d++)for(let x=0;x<n;x++){const y=u[d][x+1],M=u[d][x],P=u[d+1][x],C=u[d+1][x+1];(d!==0||a>0)&&p.push(y,M,C),(d!==i-1||l<Math.PI)&&p.push(M,P,C)}this.setIndex(p),this.setAttribute("position",new ft(_,3)),this.setAttribute("normal",new ft(v,3)),this.setAttribute("uv",new ft(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new An(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class ui extends gr{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new Ce(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ce(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Bv,this.normalScale=new He(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new pi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class al extends Ir{constructor(e){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(e)}copy(e){return super.copy(e),this.scale=e.scale,this.dashSize=e.dashSize,this.gapSize=e.gapSize,this}}const Km={enabled:!1,files:{},add:function(t,e){this.enabled!==!1&&(this.files[t]=e)},get:function(t){if(this.enabled!==!1)return this.files[t]},remove:function(t){delete this.files[t]},clear:function(){this.files={}}};class AA{constructor(e,n,i){const r=this;let s=!1,a=0,o=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=n,this.onError=i,this.itemStart=function(u){o++,s===!1&&r.onStart!==void 0&&r.onStart(u,a,o),s=!0},this.itemEnd=function(u){a++,r.onProgress!==void 0&&r.onProgress(u,a,o),a===o&&(s=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(u){r.onError!==void 0&&r.onError(u)},this.resolveURL=function(u){return l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,f){return c.push(u,f),this},this.removeHandler=function(u){const f=c.indexOf(u);return f!==-1&&c.splice(f,2),this},this.getHandler=function(u){for(let f=0,h=c.length;f<h;f+=2){const p=c[f],_=c[f+1];if(p.global&&(p.lastIndex=0),p.test(u))return _}return null}}}const bA=new AA;class Cf{constructor(e){this.manager=e!==void 0?e:bA,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,n){const i=this;return new Promise(function(r,s){i.load(e,r,n,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}}Cf.DEFAULT_MATERIAL_NAME="__DEFAULT";class CA extends Cf{constructor(e){super(e)}load(e,n,i,r){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,a=Km.get(e);if(a!==void 0)return s.manager.itemStart(e),setTimeout(function(){n&&n(a),s.manager.itemEnd(e)},0),a;const o=to("img");function l(){u(),Km.add(e,this),n&&n(this),s.manager.itemEnd(e)}function c(f){u(),r&&r(f),s.manager.itemError(e),s.manager.itemEnd(e)}function u(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),s.manager.itemStart(e),o.src=e,o}}class c0 extends Cf{constructor(e){super(e)}load(e,n,i,r){const s=new nn,a=new CA(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){s.image=o,s.needsUpdate=!0,n!==void 0&&n(s)},i,r),s}}class Rf extends Dt{constructor(e,n=1){super(),this.isLight=!0,this.type="Light",this.color=new Ce(e),this.intensity=n}dispose(){}copy(e,n){return super.copy(e,n),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const n=super.toJSON(e);return n.object.color=this.color.getHex(),n.object.intensity=this.intensity,this.groundColor!==void 0&&(n.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(n.object.distance=this.distance),this.angle!==void 0&&(n.object.angle=this.angle),this.decay!==void 0&&(n.object.decay=this.decay),this.penumbra!==void 0&&(n.object.penumbra=this.penumbra),this.shadow!==void 0&&(n.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(n.object.target=this.target.uuid),n}}class RA extends Rf{constructor(e,n,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Dt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ce(n)}copy(e,n){return super.copy(e,n),this.groundColor.copy(e.groundColor),this}}const Uu=new ht,Zm=new L,Qm=new L;class PA{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new He(512,512),this.map=null,this.mapPass=null,this.matrix=new ht,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Af,this._frameExtents=new He(1,1),this._viewportCount=1,this._viewports=[new Ct(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const n=this.camera,i=this.matrix;Zm.setFromMatrixPosition(e.matrixWorld),n.position.copy(Zm),Qm.setFromMatrixPosition(e.target.matrixWorld),n.lookAt(Qm),n.updateMatrixWorld(),Uu.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Uu),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Uu)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class NA extends PA{constructor(){super(new Qv(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class u0 extends Rf{constructor(e,n){super(e,n),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Dt.DEFAULT_UP),this.updateMatrix(),this.target=new Dt,this.shadow=new NA}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class LA extends Rf{constructor(e,n){super(e,n),this.isAmbientLight=!0,this.type="AmbientLight"}}class d0{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=Jm(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const n=Jm();e=(n-this.oldTime)/1e3,this.oldTime=n,this.elapsedTime+=e}return e}}function Jm(){return performance.now()}const eg=new ht;class h0{constructor(e,n,i=0,r=1/0){this.ray=new Tc(e,n),this.near=i,this.far=r,this.camera=null,this.layers=new Tf,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,n){this.ray.set(e,n)}setFromCamera(e,n){n.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(n.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(n).sub(this.ray.origin).normalize(),this.camera=n):n.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(n.near+n.far)/(n.near-n.far)).unproject(n),this.ray.direction.set(0,0,-1).transformDirection(n.matrixWorld),this.camera=n):console.error("THREE.Raycaster: Unsupported camera type: "+n.type)}setFromXRController(e){return eg.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(eg),this}intersectObject(e,n=!0,i=[]){return yh(e,this,i,n),i.sort(tg),i}intersectObjects(e,n=!0,i=[]){for(let r=0,s=e.length;r<s;r++)yh(e[r],this,i,n);return i.sort(tg),i}}function tg(t,e){return t.distance-e.distance}function yh(t,e,n,i){let r=!0;if(t.layers.test(e.layers)&&t.raycast(e,n)===!1&&(r=!1),r===!0&&i===!0){const s=t.children;for(let a=0,o=s.length;a<o;a++)yh(s[a],e,n,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:gf}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=gf);function f0(t){const e=atob(t.data),n=new Uint8Array(e.length);for(let c=0;c<e.length;c++)n[c]=e.charCodeAt(c);const i=new Uint16Array(n.buffer),{quantise_min_m:r,quantise_max_m:s,resolution:a}=t,o=(s-r)/65535,l=new Float32Array(i.length);for(let c=0;c<i.length;c++)l[c]=r+i[c]*o;return{heights:l,resolution:a,sizeM:t.size_m,minM:r,maxM:s}}function qs(t,e,n){const{heights:i,resolution:r,sizeM:s}=t,a=s/(r-1),o=Math.min(Math.max(e/a,0),r-1.001),l=Math.min(Math.max(n/a,0),r-1.001),c=Math.floor(o),u=Math.floor(l),f=o-c,h=l-u,p=i[u*r+c],_=i[u*r+c+1],v=i[(u+1)*r+c],m=i[(u+1)*r+c+1];return(p*(1-f)+_*f)*(1-h)+(v*(1-f)+m*f)*h}const DA=`
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
`,IA=`
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
`;function p0({minM:t,maxM:e,snowLine:n,sizeM:i,originX:r=0,originZ:s=0,inner:a=0}){return new Vn({vertexShader:DA,fragmentShader:IA,uniforms:{uSunDirection:{value:Pf.clone()},uSunColor:{value:new Ce(16774112).multiplyScalar(1.15)},uSkyColor:{value:new Ce(12375792)},uGroundColor:{value:new Ce(7037527)},uFogColor:{value:Nf.clone()},uFogDensity:{value:1/16e3},uSnowLine:{value:n},uValleyFloor:{value:t},uPeak:{value:e},uCameraPos:{value:new L},uImagery:{value:null},uHasImagery:{value:0},uSize:{value:i},uOrigin:{value:new He(r,s)},uInner:{value:a}}})}function ng(t,e,n){e&&new c0().load(`data:image/jpeg;base64,${e}`,i=>{i.colorSpace=en,i.anisotropy=n.capabilities.getMaxAnisotropy(),i.wrapS=i.wrapT=Ki,i.generateMipmaps=!0,i.minFilter=Zi,t.uniforms.uImagery.value=i,t.uniforms.uHasImagery.value=1})}function UA(t,e,{snowLine:n=1350}={}){const i=f0({data:t.data,quantise_min_m:t.quantise_min_m,quantise_max_m:t.quantise_max_m,resolution:t.resolution,size_m:t.size_m}),r=t.size_m,s=t.origin_m,a=t.resolution-1,o=new $r(r,r,a,a);o.rotateX(-Math.PI/2);const l=o.attributes.position;for(let f=0;f<l.count;f++){const h=l.getX(f)+r/2,p=l.getZ(f)+r/2;l.setY(f,qs(i,h,p)-1)}o.computeVertexNormals();const c=p0({minM:e.minM,maxM:e.maxM,snowLine:n,sizeM:r,originX:s,originZ:s,inner:e.sizeM}),u=new Ne(o,c);return u.position.set(s+r/2,0,s+r/2),u.frustumCulled=!1,u.name="terrain-context",u.userData.decoded=i,u.userData.origin=s,u}function kA(t,e,n=180,i=512){const{sizeM:r}=t,s=[],a=u=>{for(let f=0;f<i;f++){const[h,p]=u(f/i),[_,v]=u((f+1)/i),m=qs(t,h,p),d=qs(t,_,v);s.push(h,m,p,_,d,v,h,m-n,p,_,d,v,_,d-n,v,h,m-n,p)}};a(u=>[u*r,0]),a(u=>[r,u*r]),a(u=>[r-u*r,r]),a(u=>[0,r-u*r]);const o=new ct;o.setAttribute("position",new ft(s,3)),o.computeVertexNormals();const l=e.clone();l.side=lt,l.uniforms=e.uniforms;const c=new Ne(o,l);return c.frustumCulled=!1,c.name="terrain-skirt",c}function FA(t,{segments:e=640,snowLine:n=1350,imagery:i=null}={}){const{sizeM:r,minM:s,maxM:a}=t,o=new $r(r,r,e,e);o.rotateX(-Math.PI/2);const l=o.attributes.position;for(let f=0;f<l.count;f++){const h=l.getX(f)+r/2,p=l.getZ(f)+r/2;l.setY(f,qs(t,h,p))}o.computeVertexNormals(),o.computeBoundingSphere();const c=p0({minM:s,maxM:a,snowLine:n,sizeM:r});i&&(c.uniforms.uImagery.value=i,c.uniforms.uHasImagery.value=1);const u=new Ne(o,c);return u.position.set(r/2,0,r/2),u.receiveShadow=!0,u.frustumCulled=!1,u.name="terrain",u}const Pf=new L(.52,.62,.58).normalize(),Nf=new Ce(13226973);function OA(t=6e4){const e=new An(t,48,32),n=new Vn({side:Yt,depthWrite:!1,uniforms:{uZenith:{value:new Ce(3104150)},uMid:{value:new Ce(8037327)},uHorizon:{value:Nf.clone()},uSunDirection:{value:Pf.clone()},uSunColor:{value:new Ce(16774368)}},vertexShader:`
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
    `}),i=new Ne(e,n);return i.frustumCulled=!1,i.name="sky",i}const ku={SCOUT:748491,RELAY:1018463,GCS_RELAY:8540383,STANDBY:7041664,KILLED:12131356};function ol(t,e){return e==="KILLED"?ku.KILLED:ku[t]??ku.STANDBY}const gt={};function zA(){if(gt.glow)return gt.glow;const t=128,e=document.createElement("canvas");e.width=e.height=t;const n=e.getContext("2d"),i=n.createRadialGradient(t/2,t/2,0,t/2,t/2,t/2);return i.addColorStop(0,"rgba(255,255,255,1)"),i.addColorStop(.18,"rgba(255,255,255,0.85)"),i.addColorStop(.42,"rgba(255,255,255,0.22)"),i.addColorStop(1,"rgba(255,255,255,0)"),n.fillStyle=i,n.fillRect(0,0,t,t),gt.glow=new TA(e),gt.glow.colorSpace=en,gt.glow}function BA(){return gt.initialised||(gt.bodyGeo=new fi(1.5,.42,2),gt.canopyGeo=new An(.52,16,12,0,Math.PI*2,0,Math.PI*.55),gt.armGeo=new Fn(.1,.13,2.5,8),gt.motorGeo=new Fn(.2,.24,.36,12),gt.hubGeo=new Fn(.07,.07,.16,8),gt.bladeGeo=new fi(2.05,.035,.17),gt.discGeo=new bc(1.05,28),gt.gimbalGeo=new An(.27,14,12),gt.lensGeo=new Fn(.11,.13,.12,12),gt.legGeo=new Fn(.045,.045,.72,6),gt.skidGeo=new fi(.09,.07,1.5),gt.navGeo=new An(.1,8,8),gt.carbon=new ui({color:2303790,roughness:.55,metalness:.35}),gt.darkPlastic=new ui({color:1316636,roughness:.8,metalness:.1}),gt.metal=new ui({color:9080985,roughness:.32,metalness:.85}),gt.glass=new ui({color:1054239,roughness:.12,metalness:.5}),gt.initialised=!0),gt}function HA(t="SCOUT",e=""){const n=BA(),i=new Xt;i.name=`drone-${e}`;const r=new ui({color:ol(t,"ACTIVE"),roughness:.4,metalness:.25,emissive:new Ce(ol(t,"ACTIVE")),emissiveIntensity:.22}),s=new Ne(n.bodyGeo,n.carbon);s.castShadow=!0,i.add(s);const a=new Ne(n.canopyGeo,r);a.position.set(0,.2,.25),a.castShadow=!0,i.add(a);const o=[];[[1,1],[-1,1],[-1,-1],[1,-1]].forEach(([_,v],m)=>{const d=new Ne(n.armGeo,n.carbon);d.position.set(_*.82,.02,v*.82),d.rotation.set(Math.PI/2,0,_*v>0?-Math.PI/4:Math.PI/4),d.castShadow=!0,i.add(d);const x=new Ne(n.motorGeo,n.metal);x.position.set(_*1.55,.14,v*1.55),x.castShadow=!0,i.add(x);const y=new Ne(n.hubGeo,n.darkPlastic);y.position.set(_*1.55,.38,v*1.55),i.add(y);const M=new Xt;M.position.set(_*1.55,.44,v*1.55);const P=new Ne(n.bladeGeo,n.darkPlastic),C=new Ne(n.bladeGeo,n.darkPlastic);C.rotation.y=Math.PI/2,M.add(P,C);const A=new Ne(n.discGeo,new yt({color:14673646,transparent:!0,opacity:0,side:lt,depthWrite:!1}));A.rotation.x=-Math.PI/2,A.position.y=.01,M.add(A),M.userData.direction=m%2===0?1:-1,M.userData.disc=A,M.userData.blades=[P,C],i.add(M),o.push(M)});const c=new Ne(n.gimbalGeo,n.darkPlastic);c.position.set(0,-.32,.52),i.add(c);const u=new Ne(n.lensGeo,n.glass);u.position.set(0,-.42,.72),u.rotation.x=Math.PI/2.2,i.add(u),[-1,1].forEach(_=>{const v=new Ne(n.legGeo,n.carbon);v.position.set(_*.55,-.5,0),v.rotation.z=_*.22,i.add(v);const m=new Ne(n.skidGeo,n.carbon);m.position.set(_*.68,-.85,0),i.add(m)});const f=[];[{color:16723245,pos:[-1.62,.2,1.62]},{color:2293610,pos:[1.62,.2,1.62]},{color:16777215,pos:[0,.3,-1.05]}].forEach(({color:_,pos:v})=>{const m=new Ne(n.navGeo,new yt({color:_,transparent:!0,opacity:.95}));m.position.set(...v),i.add(m),f.push(m)});const p=new EA(new a0({map:zA(),color:ol(t,"ACTIVE"),transparent:!0,opacity:.9,depthWrite:!1,blending:Jl}));return p.scale.set(4,4,1),i.add(p),i.userData={rotors:o,navLights:f,strobe:p,accent:r,role:t,id:e,strobePhase:Math.random()*Math.PI*2,spin:0},i.update=(_,v={},m=1)=>{const d=i.userData,x=v.status==="KILLED",y=x||["CHARGING","READY","LANDED"].includes(v.status),M=1.9*9.81,P=y?0:Math.min((v.thrust??M)/M,2),C=y?0:55+P*45;d.spin+=(C-d.spin)*Math.min(_*3,1),d.rotors.forEach(z=>{z.rotation.y+=z.userData.direction*d.spin*_;const S=Math.min(d.spin/40,1);z.userData.disc.material.opacity=S*.3,z.userData.blades.forEach(w=>{w.material=w.material,w.visible=S<.92})}),d.strobePhase+=_*7.5;const A=x?0:Math.max(0,Math.sin(d.strobePhase))**6;d.strobe.material.opacity=.25+A*.75,d.strobe.scale.setScalar(3+A*3);const b=ol(v.role??d.role,v.status);d.strobe.material.color.setHex(b),d.accent.color.setHex(b),d.accent.emissive.setHex(b),d.accent.emissiveIntensity=x?0:.22,d.navLights.forEach(z=>{z.material.opacity=x?.15:.95}),i.scale.setScalar(m)},i}const ig=["establishing","chase","low_orbit","ridge_pass","formation","top_down"];function Ua(t,e,n,i){return t+(e-t)*(1-Math.exp(-n*i))}function ll(t,e,n,i){return t.x=Ua(t.x,e.x,n,i),t.y=Ua(t.y,e.y,n,i),t.z=Ua(t.z,e.z,n,i),t}class GA{constructor(e,n){this.camera=e,this.terrain=n,this.enabled=!0,this.shotIndex=0,this.shotName="establishing",this.shotElapsed=0,this.shotDuration=12,this.orbitAngle=Math.random()*Math.PI*2,this.position=new L(600,1200,1800),this.lookAt=new L(1200,750,2200),this.targetPosition=this.position.clone(),this.targetLookAt=this.lookAt.clone(),this.fov=55,this.targetFov=55,this.subjectId=null,this._lastSubject=new L(1200,750,2200),this.manual=!1,this.manualOrbit={theta:.7,phi:1,radius:900},this.manualTarget=new L(1200,750,2200)}cutTo(e,n=null,i=null){this.shotName=e,this.subjectId=n,this.shotElapsed=0,this.shotDuration=i??this._defaultDuration(e),this.orbitAngle=Math.random()*Math.PI*2}_defaultDuration(e){return{establishing:13,chase:11,low_orbit:10,ridge_pass:11,formation:9,top_down:8}[e]??10}onEvent(e){var i,r,s;if(!this.enabled||this.manual)return;const n=e.type||"";n==="KILL_NODE"||n.includes("NODE")?this.cutTo("low_orbit",((i=e.params)==null?void 0:i.drone_id)??null,9):n.includes("JAMMING")?this.cutTo("establishing",null,8):n.includes("INTERVENTION_EXECUTED")?this.cutTo("chase",e.drone_id??null,8):n==="HANDOVER"||n==="LAUNCH"?this.cutTo("chase",((r=e.params)==null?void 0:r.drone)??((s=e.params)==null?void 0:s.uav)??null,8):n==="NEW_TASK"?this.cutTo("establishing",null,8):n==="SURVEY_COMPLETE"&&this.cutTo("top_down",e.drone??null,7)}beginManual(e){this.manual=!0,this.enabled=!1,e&&this.manualTarget.copy(e);const n=this.position.clone().sub(this.manualTarget);this.manualOrbit.radius=Math.max(n.length(),60),this.manualOrbit.theta=Math.atan2(n.x,n.z),this.manualOrbit.phi=Math.acos(St.clamp(n.y/this.manualOrbit.radius,-1,1))}orbit(e,n){this.manualOrbit.theta-=e*.005,this.manualOrbit.phi=St.clamp(this.manualOrbit.phi-n*.005,.08,Math.PI*.495)}zoom(e){this.manualOrbit.radius=St.clamp(this.manualOrbit.radius*(1+e*.0012),40,6e3)}resume(){this.manual=!1,this.enabled=!0,this.cutTo("establishing")}update(e,n,i,r){if(this.manual){this._updateManual(e);return}if(!this.enabled)return;this.shotElapsed+=e,this.shotElapsed>this.shotDuration&&(this.shotIndex=(this.shotIndex+1)%ig.length,this.cutTo(ig[this.shotIndex]));const s=this._resolveSubject(n),a=this._swarmCentroid(n),o=this.shotElapsed;let l=new L,c=s.clone(),u=52;switch(this.shotName){case"establishing":{const v=this.orbitAngle+o*.045,m=1500-o*22;l.set(a.x+Math.cos(v)*m,a.y+620-o*12,a.z+Math.sin(v)*m),c=a.clone(),u=46;break}case"chase":{const v=this._subjectVelocity(n),m=v.lengthSq()>1?v.clone().normalize().multiplyScalar(-46):new L(-46,0,0);l.copy(s).add(m).add(new L(0,17,0)),c=s.clone().add(v.clone().multiplyScalar(1.6)),u=58;break}case"low_orbit":{const v=this.orbitAngle+o*.42,m=34;l.set(s.x+Math.cos(v)*m,s.y+7+Math.sin(o*.5)*4,s.z+Math.sin(v)*m),u=50;break}case"ridge_pass":{const v=this._nearbyHighGround(a);l.copy(v),c=a.clone(),u=40;break}case"formation":{const v=this.orbitAngle+o*.12,m=150;l.set(a.x+Math.cos(v)*m,a.y+40,a.z+Math.sin(v)*m),c=a.clone(),u=55;break}case"top_down":{l.set(s.x+18,s.y+145,s.z+18),c=s.clone(),u=48;break}default:l.copy(a).add(new L(200,120,200))}const f=this.terrain?this.terrain.heightAt(l.x,l.z):0;l.y=Math.max(l.y,f+22),this._clearSightLine(l,c),this.targetPosition.copy(l),this.targetLookAt.copy(c),this.targetFov=u;const h=St.clamp(this.shotElapsed/1.6,0,1),p=St.lerp(6.5,1.5,h),_=St.lerp(7.5,2.6,h);ll(this.position,this.targetPosition,p,e),ll(this.lookAt,this.targetLookAt,_,e),this.fov=Ua(this.fov,this.targetFov,2,e),this._apply()}_updateManual(e){const{theta:n,phi:i,radius:r}=this.manualOrbit,s=new L(this.manualTarget.x+r*Math.sin(i)*Math.sin(n),this.manualTarget.y+r*Math.cos(i),this.manualTarget.z+r*Math.sin(i)*Math.cos(n));if(s.y=Math.max(s.y,this._floorAt(s.x,s.z)),this.terrain){const a=this.manualTarget.clone();a.y=Math.max(a.y,this.terrain.heightAt(a.x,a.z))+25,this._clearSightLine(s,a,6)}ll(this.position,s,9,e),ll(this.lookAt,this.manualTarget,9,e),this.fov=Ua(this.fov,55,5,e),this._apply()}_apply(){this.terrain&&(this.position.y=Math.max(this.position.y,this._floorAt(this.position.x,this.position.z))),this.camera.position.copy(this.position),this.camera.lookAt(this.lookAt),Math.abs(this.camera.fov-this.fov)>.01&&(this.camera.fov=this.fov,this.camera.updateProjectionMatrix())}_floorAt(e,n,i=14){if(!this.terrain)return-1/0;const r=25;return Math.max(this.terrain.heightAt(e,n),this.terrain.heightAt(e+r,n),this.terrain.heightAt(e-r,n),this.terrain.heightAt(e,n+r),this.terrain.heightAt(e,n-r))+i}_clearSightLine(e,n,i=12){if(!this.terrain)return;const r=24;for(let s=0;s<6;s++){let a=0;for(let o=1;o<r;o++){const l=o/r,c=e.x+(n.x-e.x)*l,u=e.z+(n.z-e.z)*l,f=e.y+(n.y-e.y)*l,h=this.terrain.heightAt(c,u)+i-f;h>0&&(a=Math.max(a,h/Math.max(1-l,.08)))}if(a<=0)return;e.y+=Math.min(a,400)}}_resolveSubject(e){var s,a;const n=Object.entries(e||{});if(!n.length)return this._lastSubject.clone();let i=null;this.subjectId&&e[this.subjectId]?i=e[this.subjectId]:i=((s=n.find(([,o])=>o.role==="SCOUT"&&o.status!=="KILLED"))==null?void 0:s[1])??((a=n.find(([,o])=>o.status!=="KILLED"))==null?void 0:a[1])??n[0][1];const r=i.position;return this._lastSubject.set(r[0],r[2],r[1]),this._lastSubject.clone()}_subjectVelocity(e){var s,a;const n=Object.entries(e||{}),i=this.subjectId&&e[this.subjectId]||((s=n.find(([,o])=>o.role==="SCOUT"&&o.status!=="KILLED"))==null?void 0:s[1])||((a=n[0])==null?void 0:a[1]);if(!(i!=null&&i.velocity))return new L;const r=i.velocity;return new L(r[0],r[2],r[1])}_swarmCentroid(e){const n=Object.values(e||{}).filter(r=>r.status!=="KILLED");if(!n.length)return this._lastSubject.clone();const i=n.reduce((r,s)=>(r.x+=s.position[0],r.y+=s.position[2],r.z+=s.position[1],r),{x:0,y:0,z:0});return new L(i.x/n.length,i.y/n.length,i.z/n.length)}_nearbyHighGround(e){if(!this.terrain)return e.clone().add(new L(300,300,300));let n=null,i=-1/0;for(let r=0;r<12;r++){const s=r/12*Math.PI*2,a=420,o=e.x+Math.cos(s)*a,l=e.z+Math.sin(s)*a,c=this.terrain.heightAt(o,l);c>i&&(i=c,n=new L(o,c+45,l))}return n??e.clone().add(new L(300,300,300))}getStatus(){return{shot:this.shotName,manual:this.manual,subject:this.subjectId,remaining:Math.max(0,this.shotDuration-this.shotElapsed)}}}function Kn(t){return new L(t[0],t[2],t[1])}const VA=new Ce(1018463),jA=new Ce(14251782),WA=new Ce(14427686);class XA{constructor(e){Of(this,"_animate",()=>{var a;if(this.disposed)return;this._frame=requestAnimationFrame(this._animate);const e=Math.min(this.clock.getDelta(),.1),n=this.telemetry;for(const[,o]of this.drones){const l=o.model,c=1-Math.exp(-9*e);if(l.position.lerp(o.target,c),o.targetYaw!==void 0){let p=o.targetYaw-l.rotation.y;for(;p>Math.PI;)p-=Math.PI*2;for(;p<-Math.PI;)p+=Math.PI*2;l.rotation.y+=p*c}const u=(a=o.state)==null?void 0:a.velocity;if(u){const p=Math.hypot(u[0],u[1]),_=Math.min(p/22,1)*.34,v=l.rotation.y,m=u[0]*Math.cos(v)-u[1]*Math.sin(v),d=u[0]*Math.sin(v)+u[1]*Math.cos(v),x=Math.max(Math.hypot(m,d),.001);l.rotation.x+=(d/x*_-l.rotation.x)*c,l.rotation.z+=(-m/x*_-l.rotation.z)*c}const f=this.camera.position.distanceTo(l.position),h=St.clamp(f/220,1,9);l.update(e,o.state||{},h)}const i={...(n==null?void 0:n.drones)||{}};for(const[,o]of this.stormCells){const l=o.group.userData.streaks;l&&(l.position.y=(l.position.y-e*26+1400)%1400-700)}if(this._updateRain(e),this._setCloudDeck(this._cloudBase),this._updateEffects(e),this.director&&this.director.update(e,i,(n==null?void 0:n.pois)||[],null),this.terrainMesh){const o=this.director?this.director.lookAt:this.camera.position;this.sun.position.copy(o).add(this.sunDirection.clone().multiplyScalar(2200)),this.sun.target.position.copy(o),this.sun.target.updateMatrixWorld(),this.terrainMesh.material.uniforms.uCameraPos.value.copy(this.camera.position),this.contextMesh&&this.contextMesh.material.uniforms.uCameraPos.value.copy(this.camera.position)}this.jammingDome.visible&&(this.jammingDome.material.uniforms.uTime.value+=e);for(const[,o]of this.jammers)o.dome.material.uniforms.uTime.value+=e,o.head.scale.setScalar(1+.25*Math.sin(performance.now()/180));const r=this.selectedId&&this.drones.get(this.selectedId);if(this.halo.visible=!!r,r){const o=r.model.scale.x;this.halo.position.copy(r.model.position),this.halo.scale.setScalar(o*(1+.08*Math.sin(performance.now()/220)))}const s=this.scene.getObjectByName("sky");s&&s.position.copy(this.camera.position),this.renderer.render(this.scene,this.camera)});this.container=e,this.ready=!1,this.disposed=!1,this.drones=new Map,this.links=new Map,this.poiMarkers=new Map,this.labels=new Map,this.telemetry=null,this.lastEventCount=0,this.clock=new d0,this._initRenderer(),this._initScene(),this._initInteraction()}_initRenderer(){this.renderer=new r0({antialias:!0,powerPreference:"high-performance"}),this.renderer.setSize(this.container.clientWidth,this.container.clientHeight),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=bv,this.renderer.outputColorSpace=en,this.container.appendChild(this.renderer.domElement)}_initScene(){this.scene=new s0,this.scene.background=Nf.clone(),this.camera=new wn(52,this.container.clientWidth/this.container.clientHeight,2,9e4),this.sunDirection=Pf.clone(),this.sun=new u0(16774112,2.1),this.sun.position.copy(this.sunDirection).multiplyScalar(3e3),this.sun.castShadow=!0,this.sun.shadow.mapSize.set(2048,2048),this.sun.shadow.camera.near=100,this.sun.shadow.camera.far=6e3;const e=900;Object.assign(this.sun.shadow.camera,{left:-e,right:e,top:e,bottom:-e}),this.sun.shadow.bias=-8e-4,this.scene.add(this.sun),this.scene.add(this.sun.target),this.scene.add(new RA(12375792,7037527,.75)),this.scene.add(OA()),this.linkGroup=new Xt,this.poiGroup=new Xt,this.droneGroup=new Xt,this.scene.add(this.linkGroup,this.poiGroup,this.droneGroup),this._initJammingDome(),this.cursor=new Ne(new Pr(14,19,40),new yt({color:1395145,transparent:!0,opacity:.85,side:lt,depthTest:!1})),this.cursor.rotation.x=-Math.PI/2,this.cursor.renderOrder=10,this.cursor.visible=!1,this.scene.add(this.cursor),this.halo=new Ne(new Pr(3.2,3.9,40),new yt({color:16096779,transparent:!0,opacity:.95,side:lt,depthTest:!1})),this.halo.rotation.x=-Math.PI/2,this.halo.renderOrder=11,this.halo.visible=!1,this.scene.add(this.halo),this.jammers=new Map,this.stormCells=new Map,this.denialZones=new Map,this.rain=null,this.effects=[],this.targets=new Map,this.gcsModel=null,this.geofenceLine=null,this._geofenceKey=null}_initJammingDome(){const e=new An(1,28,20),n=new Vn({transparent:!0,depthWrite:!1,side:Yt,blending:Jl,uniforms:{uTime:{value:0},uColor:{value:new Ce(14427686)},uOpacity:{value:0}},vertexShader:`
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
      `});this.jammingDome=new Ne(e,n),this.jammingDome.visible=!1,this.jammingDome.frustumCulled=!1,this.scene.add(this.jammingDome)}_initInteraction(){const e=this.renderer.domElement;let n=!1,i=!1,r=0,s=0,a=0,o=0;e.addEventListener("pointerdown",c=>{n=!0,i=!1,r=a=c.clientX,s=o=c.clientY,e.setPointerCapture(c.pointerId)}),e.addEventListener("pointermove",c=>{if(n){!i&&Math.hypot(c.clientX-r,c.clientY-s)>5&&(i=!0,this.director&&!this.director.manual&&(this.director.beginManual(this.director.lookAt.clone()),this._notifyCamera())),i&&this.director&&this.director.orbit(c.clientX-a,c.clientY-o),a=c.clientX,o=c.clientY;return}this._updateHover(c)});const l=c=>{n&&!i&&this._handleClick(c),n=!1,i=!1;try{e.releasePointerCapture(c.pointerId)}catch{}};e.addEventListener("pointerup",l),e.addEventListener("pointercancel",()=>{n=!1,i=!1}),e.addEventListener("pointerleave",()=>{this.cursor&&(this.cursor.visible=!1)}),e.addEventListener("wheel",c=>{this.director&&(c.preventDefault(),this.director.manual||(this.director.beginManual(this.director.lookAt.clone()),this._notifyCamera()),this.director.zoom(c.deltaY))},{passive:!1}),this._resizeObserver=new ResizeObserver(()=>this.resize()),this._resizeObserver.observe(this.container)}_ndc(e){const n=this.renderer.domElement.getBoundingClientRect();return{x:(e.clientX-n.left)/n.width*2-1,y:-((e.clientY-n.top)/n.height)*2+1,px:e.clientX-n.left,py:e.clientY-n.top,w:n.width,h:n.height}}_terrainHit(e){if(!this.terrainLookup)return null;const n=this._ndc(e),i=new h0;i.setFromCamera({x:n.x,y:n.y},this.camera);const r=i.ray.origin,s=i.ray.direction,a=this.terrainData.sizeM;let o=0;const l=6;for(let c=l;c<9e3;c+=l){const u=r.x+s.x*c,f=r.z+s.z*c,h=r.y+s.y*c;if(u<0||f<0||u>a||f>a){if(c>200&&(u<-500||f<-500||u>a+500||f>a+500))break;o=c;continue}if(h<=this.terrainLookup.heightAt(u,f)){let p=o,_=c;for(let d=0;d<10;d++){const x=(p+_)/2,y=r.x+s.x*x,M=r.z+s.z*x;r.y+s.y*x<=this.terrainLookup.heightAt(y,M)?_=x:p=x}const v=r.x+s.x*_,m=r.z+s.z*_;return new L(v,this.terrainLookup.heightAt(v,m),m)}o=c}return null}_screenPick(e){const n=this._ndc(e),i=[],r=s=>{const a=s.clone().project(this.camera);return a.z>1?null:{x:(a.x+1)/2*n.w,y:(1-a.y)/2*n.h}};for(const[s,a]of this.drones){const o=r(a.model.position);o&&i.push({kind:"drone",id:s,d:Math.hypot(o.x-n.px,o.y-n.py)})}for(const[s,a]of this.jammers){const o=r(a.mast.position);o&&i.push({kind:"jammer",id:s,d:Math.hypot(o.x-n.px,o.y-n.py)})}for(const[s,a]of this.poiMarkers){const o=r(a.group.position);o&&i.push({kind:"poi",id:s,d:Math.hypot(o.x-n.px,o.y-n.py)})}return i.sort((s,a)=>s.d-a.d),i.length&&i[0].d<28?i[0]:null}_handleClick(e){var s,a;const n=this.tool||"select";if(!(n!=="select")||n==="goto"){const o=this._screenPick(e);if(o&&n==="select"){(s=this.onPick)==null||s.call(this,o);return}}const r=this._terrainHit(e);r&&((a=this.onGroundClick)==null||a.call(this,{x:r.x,y:r.z,z:r.y},n))}_updateHover(e){if(!this.cursor)return;if((this.tool||"select")==="select"){this.cursor.visible=!1,this.renderer.domElement.style.cursor=this._screenPick(e)?"pointer":"grab";return}const i=this._terrainHit(e);if(this.renderer.domElement.style.cursor="crosshair",!i){this.cursor.visible=!1;return}this.cursor.visible=!0,this.cursor.position.set(i.x,i.y+2,i.z)}setTool(e){if(this.tool=e,!this.cursor)return;const n={add_scout:748491,add_relay:1018463,add_poi:14427686,add_jammer:9647082,add_interference:9647082,goto:8141549};this.cursor.material.color.setHex(n[e]??1395145);const i=e==="add_jammer"||e==="add_interference"?3.2:1;this.cursor.scale.setScalar(i),e==="select"&&(this.cursor.visible=!1)}setSelected(e){this.selectedId=e}northScreenAngle(){var s;const n=(((s=this.theatre)==null?void 0:s.rotation_k)??0)===1?new L(1,0,0):new L(0,0,1),i=new L;if(this.camera.getWorldDirection(i),i.y=0,i.lengthSq()<1e-6)return 0;i.normalize();const r=new L(-i.z,0,i.x);return Math.atan2(n.dot(r),n.dot(i))}_notifyCamera(){this.onCameraChange&&this.onCameraChange(this.director.getStatus())}_chooseTerrainDetail(){const e=this.renderer.getContext(),n=e.getExtension("WEBGL_debug_renderer_info"),i=String(n?e.getParameter(n.UNMASKED_RENDERER_WEBGL):e.getParameter(e.RENDERER));return/swiftshader|software|llvmpipe|angle \(software/i.test(i)?(console.warn("[cdawn] software rendering detected — reducing terrain detail"),192):1024}_clearWorld(){var e,n,i,r;for(const s of[this.contextMesh,this.skirtMesh])s&&(this.scene.remove(s),s.geometry.dispose(),s===this.contextMesh&&((n=(e=s.material.uniforms.uImagery.value)==null?void 0:e.dispose)==null||n.call(e),s.material.dispose()));this.contextMesh=null,this.skirtMesh=null,this.terrainMesh&&(this.scene.remove(this.terrainMesh),this.terrainMesh.geometry.dispose(),(r=(i=this.terrainMesh.material.uniforms.uImagery.value)==null?void 0:i.dispose)==null||r.call(i),this.terrainMesh.material.dispose(),this.terrainMesh=null);for(const[,s]of this.drones)this.droneGroup.remove(s.model);this.drones.clear();for(const[,s]of this.links)this.linkGroup.remove(s.line),s.geometry.dispose(),s.material.dispose();this.links.clear();for(const[,s]of this.poiMarkers)this.poiGroup.remove(s.group);this.poiMarkers.clear();for(const[,s]of this.jammers)this.scene.remove(s.dome,s.mast);this.jammers.clear();for(const[,s]of this.ewMarkers||[])this.scene.remove(s.group);this.ewMarkers=new Map,this.ewMarker=null,this.cloudDeck&&(this.scene.remove(this.cloudDeck),this.cloudDeck=null);for(const[,s]of this.stormCells)this.scene.remove(s.group);this.stormCells.clear();for(const[,s]of this.denialZones)this.scene.remove(s.group);this.denialZones.clear(),this.gcsModel&&(this.scene.remove(this.gcsModel),this.gcsModel=null),this.geofenceLine&&(this.scene.remove(this.geofenceLine),this.geofenceLine=null),this._geofenceKey=null,this.effects.forEach(s=>this.scene.remove(s.flash,s.smoke,s.light)),this.effects=[];for(const[,s]of this.targets)this.scene.remove(s.line,s.marker);this.targets.clear()}loadTerrain(e){var l,c;this.ready=!1,this._clearWorld();const n=f0(e);this.terrainData=n,this.terrainChecksum=e.checksum,this.theatre=e.theatre||null;const i=e.snow_line_m??1350;this.terrainMesh=FA(n,{segments:Math.min(this._chooseTerrainDetail(),n.resolution-1),snowLine:i}),this.scene.add(this.terrainMesh),ng(this.terrainMesh.material,e.imagery_jpeg_b64,this.renderer),this.skirtMesh=kA(n,this.terrainMesh.material),this.scene.add(this.skirtMesh),e.context&&(this.contextMesh=UA(e.context,n,{snowLine:i}),this.scene.add(this.contextMesh),ng(this.contextMesh.material,e.context.imagery_jpeg_b64,this.renderer));const r=n.sizeM,s=(l=this.contextMesh)==null?void 0:l.userData.decoded,a=((c=this.contextMesh)==null?void 0:c.userData.origin)??0,o={heightAt:(u,f)=>!s||u>=0&&f>=0&&u<=r&&f<=r?qs(n,u,f):qs(s,u-a,f-a)};this.terrainLookup=o,this.director=new GA(this.camera,o),this.director.position.set(r*.12,n.maxM+500,r*.5),this.director.lookAt.set(r*.5,n.minM,r*.5),this.director.cutTo("establishing"),this.ready=!0,this.start()}setTelemetry(e){this.telemetry=e,!(!this.ready||!e)&&(this._syncGcs(e.gcs),this._syncGeofence(e.geofence),this._syncDrones(e.drones||{},e.gcs),this._syncPois(e.pois||[]),this._syncTargets(e.drones||{}),this._syncJamming(e),this._syncInjects(e.injects||{}),this._checkEvents(e.events||[]))}_syncGcs(e){if(!e||this.gcsModel)return;const n=new Xt,i=Kn(e.position),r=e.mast_m||10,s=i.clone().setY(i.y-r),a=new Ne(new fi(9,4,6),new ui({color:15262936,roughness:.7}));a.position.copy(s).add(new L(-8,2,0));const o=new Ne(new fi(9.6,.5,6.6),new ui({color:1920728,roughness:.6}));o.position.copy(a.position).add(new L(0,2.2,0));const l=new Ne(new Fn(.35,.5,r,8),new ui({color:10265519,metalness:.5,roughness:.4}));l.position.copy(s).add(new L(0,r/2,0));const c=new Ne(new An(1.4,16,12),new yt({color:1920728}));c.position.copy(i);const u=new Ne(new Fn(2.2,2.2,140,10,1,!0),new yt({color:1920728,transparent:!0,opacity:.16,depthWrite:!1,side:lt}));u.position.copy(i).add(new L(0,70,0)),n.add(a,o,l,c,u),(e.pads||[]).forEach(f=>{const h=new Ne(new bc(3.2,24),new yt({color:2042167,side:lt}));h.rotation.x=-Math.PI/2,h.position.copy(Kn(f)).add(new L(0,.15,0));const p=new Ne(new Pr(2.4,2.9,24),new yt({color:16436245,side:lt}));p.rotation.x=-Math.PI/2,p.position.copy(h.position).add(new L(0,.05,0)),n.add(h,p)}),this.gcsModel=n,this.gcsAntenna=i,this.scene.add(n)}_syncGeofence(e){var a;if(!((a=e==null?void 0:e.polygon)!=null&&a.length)||!this.terrainLookup)return;const n=JSON.stringify(e.polygon);if(n===this._geofenceKey)return;this._geofenceKey=n,this.geofenceLine&&this.scene.remove(this.geofenceLine);const i=[],r=e.polygon;for(let o=0;o<r.length;o+=1){const[l,c]=r[o],[u,f]=r[(o+1)%r.length],h=Math.max(1,Math.ceil(Math.hypot(u-l,f-c)/40));for(let p=0;p<h;p+=1){const _=l+(u-l)*p/h,v=c+(f-c)*p/h;i.push(new L(_,this.terrainLookup.heightAt(_,v)+12,v))}}i.push(i[0].clone());const s=new Ur(new ct().setFromPoints(i),new al({color:16347926,dashSize:28,gapSize:16,transparent:!0,opacity:.9}));s.computeLineDistances(),s.frustumCulled=!1,this.geofenceLine=s,this.scene.add(s)}_syncInjects(e){this._setRain(e.rain_mm_h||0),this._cloudBase=e.cloud_base_agl||0,this._syncZones(this.stormCells,e.cells||[],n=>this._makeStormCell(n)),this._syncZones(this.denialZones,e.gps_denial||[],n=>this._makeDenialZone(n))}_syncZones(e,n,i){const r=new Set;n.forEach(s=>{r.add(s.id);let a=e.get(s.id);a||(a=i(s),this.scene.add(a.group),e.set(s.id,a));const o=this.terrainLookup?this.terrainLookup.heightAt(s.x,s.y):0;a.group.position.set(s.x,o,s.y),a.zone=s});for(const[s,a]of e)r.has(s)||(this.scene.remove(a.group),e.delete(s))}_makeStormCell(e){const n=new Xt,i=e.radius_m,r=new Ne(new Fn(i*1.05,i*.8,1500,32,1,!0),new yt({color:3094852,transparent:!0,opacity:.17,side:lt,depthWrite:!1}));r.position.y=750;const s=[];for(let o=0;o<280;o++){const l=Math.random()*Math.PI*2,c=Math.sqrt(Math.random())*i,u=Math.cos(l)*c,f=Math.sin(l)*c,h=Math.random()*1400;s.push(u,h,f,u,h-90,f)}const a=new Iu(new ct().setAttribute("position",new ft(s,3)),new Ir({color:9413560,transparent:!0,opacity:.45}));return n.add(r,a),n.userData.streaks=a,{group:n}}_makeDenialZone(e){const n=new Xt,i=e.radius_m,r=new Ne(new An(i,32,16,0,Math.PI*2,0,Math.PI/2),new yt({color:16096779,transparent:!0,opacity:.05,side:lt,depthWrite:!1})),s=[];for(let o=0;o<=128;o++){const l=o/128*Math.PI*2,c=Math.cos(l)*i,u=Math.sin(l)*i,f=this.terrainLookup?this.terrainLookup.heightAt(e.x+c,e.y+u)-this.terrainLookup.heightAt(e.x,e.y):0;s.push(new L(c,f+5,u))}const a=new $m(new ct().setFromPoints(s),new al({color:16096779,dashSize:40,gapSize:26,transparent:!0,opacity:.8,depthTest:!1}));return a.computeLineDistances(),a.renderOrder=8,n.add(r,a),{group:n}}_setCloudDeck(e){if(!e||!this.terrainMesh){this.cloudDeck&&(this.cloudDeck.visible=!1);return}if(!this.cloudDeck){const r=(this.terrainMesh.geometry.boundingBox,26e3),s=new Ne(new $r(r,r,1,1),new yt({color:10134704,transparent:!0,opacity:.34,side:lt,depthWrite:!1}));s.rotation.x=-Math.PI/2,s.renderOrder=1,s.frustumCulled=!1,this.scene.add(s),this.cloudDeck=s}this.cloudDeck.visible=!0;const n=this.camera.position,i=this.terrainLookup?this.terrainLookup.heightAt(n.x,n.z):0;this.cloudDeck.position.set(n.x,i+e,n.z)}_setRain(e){const n=Math.min(e,60)/60;if(n<=0){this.rain&&(this.rain.points.visible=!1,this.rain.rate=0),this._setWeatherTone(0);return}if(!this.rain){const r=new Float32Array(54e3),s=new ct;s.setAttribute("position",new vn(r,3));const a=new Iu(s,new Ir({color:12570848,transparent:!0,opacity:.42}));a.frustumCulled=!1,this.scene.add(a);const o=420,l=[];for(let c=0;c<9e3;c++)l.push([(Math.random()-.5)*o,Math.random()*o,(Math.random()-.5)*o]);this.rain={points:a,seeds:l,box:o,rate:0}}this.rain.points.visible=!0,this.rain.rate=n,this.rain.points.material.opacity=.25+.4*n,this._setWeatherTone(n)}_setWeatherTone(e){var o;const n=new Ce(13226973),i=new Ce(7041658),r=n.clone().lerp(i,e);for(const l of[this.terrainMesh,this.contextMesh])l&&(l.material.uniforms.uFogColor.value.copy(r),l.material.uniforms.uFogDensity.value=1/16e3*(1+2.6*e));const s=this.scene.getObjectByName("sky"),a=(o=s==null?void 0:s.material)==null?void 0:o.uniforms;a&&(a.uHorizon.value.copy(r),a.uZenith.value.copy(new Ce(3104150).lerp(new Ce(3817801),e)),a.uMid.value.copy(new Ce(8037327).lerp(new Ce(5923436),e)),a.uSunColor&&a.uSunColor.value.copy(new Ce(16774368).lerp(new Ce(10133930),e))),this.sun&&(this.sun.intensity=1.35*(1-.55*e))}_updateRain(e){var u,f;if(!this.rain||!this.rain.rate)return;const{seeds:n,box:i,points:r}=this.rain,s=this.camera.position,a=((f=(u=this.telemetry)==null?void 0:u.wind)==null?void 0:f.velocity)||[0,0,0],o=11+6*this.rain.rate,l=r.geometry.attributes.position.array,c=Math.floor(n.length*(.25+.75*this.rain.rate));for(let h=0;h<n.length;h++){const p=n[h];if(h>=c){l[h*6]=l[h*6+3]=s.x,l[h*6+1]=l[h*6+4]=s.y-4e3,l[h*6+2]=l[h*6+5]=s.z;continue}p[1]-=o*e,p[0]+=a[0]*e*.35,p[2]+=a[1]*e*.35,p[1]<-i/2&&(p[1]=i/2,p[0]=(Math.random()-.5)*i,p[2]=(Math.random()-.5)*i),Math.abs(p[0])>i/2&&(p[0]-=Math.sign(p[0])*i),Math.abs(p[2])>i/2&&(p[2]-=Math.sign(p[2])*i);const _=s.x+p[0],v=s.y+p[1]-i/4,m=s.z+p[2];l[h*6]=_,l[h*6+1]=v,l[h*6+2]=m,l[h*6+3]=_+a[0]*.12,l[h*6+4]=v-3.2-1.6*this.rain.rate,l[h*6+5]=m+a[1]*.12}r.geometry.attributes.position.needsUpdate=!0}_updateEffects(e){this.effects=this.effects.filter(n=>{n.age+=e;const i=n.age;return n.flash.scale.setScalar(4+70*Math.min(i/.6,1)),n.flash.material.opacity=Math.max(1-i/.9,0),n.flash.visible=n.flash.material.opacity>0,n.light.intensity=Math.max(40*(1-i/.7),0),n.smoke.scale.setScalar(10+38*Math.min(i/3,1)),n.smoke.position.y+=e*6,n.smoke.material.opacity=.55*Math.max(1-i/7,0),i>7?(this.scene.remove(n.flash,n.smoke,n.light),n.flash.geometry.dispose(),n.smoke.geometry.dispose(),!1):!0})}_syncDrones(e,n){const i=new Set;Object.entries(e).forEach(([r,s])=>{i.add(r);let a=this.drones.get(r);if(!a){const o=HA(s.role,r);this.droneGroup.add(o),a={model:o,state:s,target:Kn(s.position)},this.drones.set(r,a),o.position.copy(a.target)}a.state=s,a.target=Kn(s.position),a.targetYaw=-(s.heading??0)});for(const[r,s]of this.drones)i.has(r)||(this.droneGroup.remove(s.model),this.drones.delete(r));this._syncLinks(e,n)}_syncLinks(e,n){const i=new Set,r=s=>s&&!["KILLED","CHARGING","READY","LANDED"].includes(s.status);Object.entries(e).forEach(([s,a])=>{if(!r(a))return;const o=Object.entries(a.neighbors||{});n&&a.gcs_link>0&&o.push([n.id||"GCS",a.gcs_link]),o.forEach(([l,c])=>{const u=n&&l===(n.id||"GCS");if(!u&&s>=l)return;const f=u?{position:n.position}:e[l];if(!u&&!r(f)||c<.04)return;const h=`${s}|${l}`;i.add(h);let p=this.links.get(h);if(!p){const x=new ct;x.setAttribute("position",new vn(new Float32Array(6),3));const y=new Ir({transparent:!0,depthWrite:!1}),M=new Ur(x,y);M.frustumCulled=!1,this.linkGroup.add(M),p={line:M,geometry:x,material:y},this.links.set(h,p)}const _=Kn(a.position),v=Kn(f.position),m=p.geometry.attributes.position.array;m[0]=_.x,m[1]=_.y,m[2]=_.z,m[3]=v.x,m[4]=v.y,m[5]=v.z,p.geometry.attributes.position.needsUpdate=!0;const d=c>.85?VA:c>.5?jA:WA;p.material.color.copy(d),p.material.opacity=(u?.35:.22)+c*.62})});for(const[s,a]of this.links)i.has(s)||(this.linkGroup.remove(a.line),a.geometry.dispose(),a.material.dispose(),this.links.delete(s))}_syncPois(e){const n=new Set(e.map(i=>i.id));for(const[i,r]of this.poiMarkers)n.has(i)||(this.poiGroup.remove(r.group),this.poiMarkers.delete(i));e.forEach(i=>{let r=this.poiMarkers.get(i.id);if(!r){const l=new Xt,c=new Ne(new Pr(9,12,32),new yt({color:11817737,transparent:!0,opacity:.85,side:lt,depthWrite:!1}));c.rotation.x=-Math.PI/2,l.add(c);const u=new Ne(new Fn(1.1,1.1,90,8,1,!0),new yt({color:11817737,transparent:!0,opacity:.28,depthWrite:!1,side:lt}));u.position.y=45,l.add(u),l.position.copy(Kn(i.position)),this.poiGroup.add(l),r={group:l,ring:c,beam:u},this.poiMarkers.set(i.id,r)}const s={1:14427686,2:14251782,3:13273604}[i.priority]??14251782,a=i.delivered?1018463:i.surveyed?2450411:s;r.ring.material.color.setHex(a),r.beam.material.color.setHex(a),r.beam.material.opacity=i.delivered?.08:i.surveyed?.16:.3;const o=i.emergent&&!i.surveyed;r.ring.scale.setScalar(o?1+.25*Math.sin(performance.now()/160):1)})}_syncJamming(e){var s,a,o,l,c,u,f,h;this._syncJammers(((s=e.rf)==null?void 0:s.jammers)||[]),this._syncEwEstimates(((o=(a=e.rf)==null?void 0:a.ew)==null?void 0:o.estimates)||((c=(l=e.rf)==null?void 0:l.ew)!=null&&c.estimate?[e.rf.ew.estimate]:[]));const n=((u=e.rf)==null?void 0:u.global_jamming)??((f=e.rf)==null?void 0:f.jamming_active);if(this.jammingDome.visible=!!n&&!(((h=e.rf)==null?void 0:h.jammers)||[]).length,!this.jammingDome.visible)return;const i=Object.values(e.drones||{}).filter(p=>p.status!=="KILLED");if(!i.length)return;const r=i.reduce((p,_)=>(p[0]+=_.position[0]/i.length,p[1]+=_.position[1]/i.length,p[2]+=_.position[2]/i.length,p),[0,0,0]);this.jammingDome.position.copy(Kn(r)),this.jammingDome.scale.setScalar(680),this.jammingDome.material.uniforms.uOpacity.value=.9}_syncJammers(e){const n=new Set;e.forEach(i=>{n.add(i.id);let r=this.jammers.get(i.id);if(!r){const a=new Ne(this.jammingDome.geometry,this.jammingDome.material.clone());a.frustumCulled=!1,a.material.uniforms.uOpacity.value=.9;const o=new Xt,l=new Ne(new Fn(1.4,2.4,34,10),new ui({color:8330525,roughness:.6}));l.position.y=17;const c=new Ne(new An(4.5,16,12),new yt({color:15680580}));c.position.y=36,o.add(l,c),this.scene.add(a,o),r={dome:a,mast:o,head:c},this.jammers.set(i.id,r)}const s=Kn(i.position);r.mast.position.copy(s),r.dome.position.copy(s),r.dome.scale.setScalar(Math.max(i.radius_m,60))});for(const[i,r]of this.jammers)n.has(i)||(this.scene.remove(r.dome,r.mast),r.dome.material.dispose(),this.jammers.delete(i))}_syncEwEstimates(e){this.ewMarkers||(this.ewMarkers=new Map);const n=new Set;e.forEach(i=>{n.add(i.id||"EMIT"),this._syncEwEstimate(i,i.id||"EMIT")});for(const[i,r]of this.ewMarkers)n.has(i)||(this.scene.remove(r.group),this.ewMarkers.delete(i))}_syncEwEstimate(e,n){if(this.ewMarkers||(this.ewMarkers=new Map),!e||!this.terrainLookup)return;if(this.ewMarker=this.ewMarkers.get(n),!this.ewMarker){const c=()=>new al({color:16096779,dashSize:14,gapSize:9,depthTest:!1,transparent:!0,opacity:.95}),u=new $m(new ct,c()),f=new Iu(new ct,new Ir({color:16096779,depthTest:!1})),h=new Ur(new ct,c());[u,f,h].forEach(_=>{_.renderOrder=9,_.frustumCulled=!1});const p=new Xt;p.add(u,f,h),this.scene.add(p),this.ewMarker={group:p,ring:u,cross:f,mast:h,key:""},this.ewMarkers.set(n,this.ewMarker)}const i=this.ewMarker;i.group.visible=!0;const r=`${e.x.toFixed(0)}|${e.y.toFixed(0)}|${e.radius_m.toFixed(0)}`;if(r===i.key)return;i.key=r;const s=(c,u)=>this.terrainLookup.heightAt(c,u)+4,a=[];for(let c=0;c<120;c++){const u=c/120*Math.PI*2,f=e.x+Math.cos(u)*e.radius_m,h=e.y+Math.sin(u)*e.radius_m;a.push(new L(f,s(f,h),h))}i.ring.geometry.setFromPoints(a),i.ring.computeLineDistances();const o=40,l=s(e.x,e.y);i.cross.geometry.setFromPoints([new L(e.x-o,s(e.x-o,e.y),e.y),new L(e.x+o,s(e.x+o,e.y),e.y),new L(e.x,s(e.x,e.y-o),e.y-o),new L(e.x,s(e.x,e.y+o),e.y+o)]),i.mast.geometry.setFromPoints([new L(e.x,l,e.y),new L(e.x,l+160,e.y)]),i.mast.computeLineDistances()}_syncTargets(e){const n=new Set;Object.entries(e).forEach(([i,r])=>{if(!r.manual_target||r.status==="KILLED")return;n.add(i);let s=this.targets.get(i);if(!s){const u=new ct;u.setAttribute("position",new vn(new Float32Array(6),3));const f=new Ur(u,new al({color:8141549,dashSize:14,gapSize:9,transparent:!0,opacity:.9}));f.frustumCulled=!1;const h=new Ne(new Pr(10,14,32),new yt({color:8141549,transparent:!0,opacity:.9,side:lt,depthTest:!1}));h.rotation.x=-Math.PI/2,this.scene.add(f,h),s={line:f,marker:h},this.targets.set(i,s)}const a=Kn(r.position),o=Kn(r.manual_target),l=s.line.geometry.attributes.position.array;l[0]=a.x,l[1]=a.y,l[2]=a.z,l[3]=o.x,l[4]=o.y,l[5]=o.z,s.line.geometry.attributes.position.needsUpdate=!0,s.line.computeLineDistances();const c=this.terrainLookup?this.terrainLookup.heightAt(o.x,o.z):o.y;s.marker.position.set(o.x,c+2,o.z)});for(const[i,r]of this.targets)n.has(i)||(this.scene.remove(r.line,r.marker),this.targets.delete(i))}_checkEvents(e){if(!e.length||!this.director)return;const n=e[e.length-1],i=`${n.time}-${n.type}`;i!==this._lastEventSignature&&(this._lastEventSignature=i,this.director.onEvent(n),this._notifyCamera())}setShot(e,n=null){this.director&&(this.director.manual=!1,this.director.enabled=!0,this.director.cutTo(e,n),this._notifyCamera())}resumeAuto(){this.director&&(this.director.resume(),this._notifyCamera())}focusDrone(e){this.director&&(this.director.manual=!1,this.director.enabled=!0,this.director.cutTo("low_orbit",e,14),this._notifyCamera())}start(){this._running||(this._running=!0,this.clock.start(),this._animate())}resize(){if(!this.container)return;const e=this.container.clientWidth,n=this.container.clientHeight;!e||!n||(this.camera.aspect=e/n,this.camera.updateProjectionMatrix(),this.renderer.setSize(e,n))}dispose(){this.disposed=!0,this._running=!1,this._frame&&cancelAnimationFrame(this._frame),this._resizeObserver&&this._resizeObserver.disconnect(),this.scene.traverse(e=>{e.geometry&&e.geometry.dispose(),e.material&&(Array.isArray(e.material)?e.material:[e.material]).forEach(i=>i.dispose())}),this.renderer.dispose(),this.renderer.domElement.parentNode===this.container&&this.container.removeChild(this.renderer.domElement)}}const $A=[{id:"establishing",label:"Establishing"},{id:"chase",label:"Chase"},{id:"low_orbit",label:"Close Orbit"},{id:"ridge_pass",label:"Ridge"},{id:"formation",label:"Formation"},{id:"top_down",label:"Overhead"}];function YA({telemetry:t,focusDrone:e,onFocusHandled:n,tool:i="select",selectedId:r=null,onGroundClick:s,onPick:a}){var z,S,w;const o=ye.useRef(null),l=ye.useRef(null),[c,u]=ye.useState("loading"),[f,h]=ye.useState({shot:"establishing",manual:!1}),[p,_]=ye.useState(0);ye.useEffect(()=>{const N=setInterval(()=>{const k=l.current;k&&k.ready&&_(k.northScreenAngle())},100);return()=>clearInterval(N)},[]),ye.useEffect(()=>{if(!o.current)return;const N=new XA(o.current);l.current=N,N.onCameraChange=h,typeof window<"u"&&(window.__cdawnScene=N);let k=!1;return(async()=>{try{const j=await fetch("/api/terrain",{cache:"no-store"});if(!j.ok)throw new Error(`terrain ${j.status}`);const q=await j.json();if(k)return;N.loadTerrain(q),u("ready")}catch(j){console.error("[viewport] terrain load failed",j),k||u("error")}})(),()=>{k=!0,N.dispose(),l.current=null}},[]);const v=ye.useRef(s),m=ye.useRef(a);v.current=s,m.current=a,ye.useEffect(()=>{const N=l.current;N&&(N.onGroundClick=(k,j)=>{var q;return(q=v.current)==null?void 0:q.call(v,k,j)},N.onPick=k=>{var j;return(j=m.current)==null?void 0:j.call(m,k)})},[]),ye.useEffect(()=>{var N;(N=l.current)==null||N.setTool(i)},[i,c]),ye.useEffect(()=>{var N;(N=l.current)==null||N.setSelected(r)},[r]);const d=(z=t==null?void 0:t.demo)==null?void 0:z.terrain_checksum,x=ye.useRef(null);ye.useEffect(()=>{const N=l.current;!N||!d||c==="loading"||N.terrainChecksum&&N.terrainChecksum!==d&&x.current!==d&&(x.current=d,u("loading"),fetch(`/api/terrain?c=${d}`,{cache:"no-store"}).then(k=>k.json()).then(k=>{N.loadTerrain(k),u("ready")}).catch(()=>{x.current=null,u("error")}))},[d,c]),ye.useEffect(()=>{l.current&&t&&l.current.setTelemetry(t)},[t]),ye.useEffect(()=>{e&&l.current&&(l.current.focusDrone(e),n==null||n())},[e,n]);const y=N=>{var k;return(k=l.current)==null?void 0:k.setShot(N)},M=()=>{var N;return(N=l.current)==null?void 0:N.resumeAuto()},C=((t==null?void 0:t.rf)||{}).jamming_active,[A,b]=ye.useState(()=>window.innerHeight>1150);return g.jsxs("div",{className:"viewport",children:[g.jsx("div",{ref:o,className:"viewport__canvas"}),c!=="ready"&&g.jsx("div",{className:"viewport__loading",children:g.jsx("div",{children:c==="error"?g.jsxs(g.Fragment,{children:[g.jsx("div",{style:{fontWeight:700,marginBottom:6},children:"Terrain unavailable"}),g.jsx("div",{children:"The simulation node is not reachable."})]}):g.jsxs(g.Fragment,{children:[g.jsx("div",{className:"spinner"}),g.jsx("div",{style:{fontWeight:600},children:"Loading terrain model"}),g.jsxs("div",{style:{fontSize:11,color:"var(--ink-3)",marginTop:4},children:[((w=(S=t==null?void 0:t.demo)==null?void 0:S.theatre)==null?void 0:w.name)||"Elevation model"," · 513 × 513 grid"]})]})})}),g.jsx("div",{className:"overlay overlay--compass",title:"True north",children:g.jsx("div",{className:"compass",children:g.jsx("div",{className:"compass__needle",style:{transform:`rotate(${p}rad)`},children:g.jsx("span",{className:"compass__n",children:"N"})})})}),g.jsx("div",{className:"overlay overlay--bl",children:g.jsxs("div",{className:"camstrip",children:[g.jsx("button",{className:`camstrip__btn ${!f.manual&&f.shot?"on":""}`,onClick:M,title:"Hand the camera back to the automatic director",children:"● AUTO"}),$A.map(N=>g.jsx("button",{className:`camstrip__btn ${!f.manual&&f.shot===N.id?"on":""}`,onClick:()=>y(N.id),children:N.label},N.id)),f.manual&&g.jsx("span",{className:"camstrip__btn on",style:{cursor:"default"},title:"Drag to orbit, scroll to zoom",children:"MANUAL"})]})}),g.jsx("div",{className:"overlay overlay--br",children:A?g.jsxs("div",{className:"legend",children:[g.jsx("button",{className:"legend__toggle",onClick:()=>b(!1),children:"▾ Legend"}),g.jsx("div",{className:"legend__title",style:{marginTop:6},children:"Link quality"}),g.jsxs("div",{className:"legend__row",children:[g.jsx("i",{className:"legend__swatch",style:{background:"#0f8a5f"}}),g.jsx("span",{children:"Good > 85%"})]}),g.jsxs("div",{className:"legend__row",children:[g.jsx("i",{className:"legend__swatch",style:{background:"#d97706"}}),g.jsx("span",{children:"Marginal 50–85%"})]}),g.jsxs("div",{className:"legend__row",children:[g.jsx("i",{className:"legend__swatch",style:{background:"#dc2626"}}),g.jsx("span",{children:"Degraded < 50%"})]}),g.jsx("div",{className:"legend__title",style:{marginTop:9},children:"Aircraft"}),g.jsxs("div",{className:"legend__row",children:[g.jsx("i",{className:"legend__dot",style:{background:"#0b6bcb"}}),g.jsx("span",{children:"Scout"})]}),g.jsxs("div",{className:"legend__row",children:[g.jsx("i",{className:"legend__dot",style:{background:"#0f8a5f"}}),g.jsx("span",{children:"Relay"})]}),g.jsxs("div",{className:"legend__row",children:[g.jsx("i",{className:"legend__dot",style:{background:"#6b7280"}}),g.jsx("span",{children:"Returning / on pad"})]}),g.jsxs("div",{className:"legend__row",children:[g.jsx("i",{className:"legend__dot",style:{background:"#1d4ed8"}}),g.jsx("span",{children:"Ground control station"})]}),g.jsx("div",{className:"legend__title",style:{marginTop:9},children:"Survey tasks"}),g.jsxs("div",{className:"legend__row",children:[g.jsx("i",{className:"legend__dot",style:{background:"#dc2626"}}),g.jsx("span",{children:"Priority 1 · 2 · 3 (red · amber · yellow)"})]}),g.jsxs("div",{className:"legend__row",children:[g.jsx("i",{className:"legend__dot",style:{background:"#2563eb"}}),g.jsx("span",{children:"Surveyed, data in transit"})]}),g.jsxs("div",{className:"legend__row",children:[g.jsx("i",{className:"legend__dot",style:{background:"#0f8a5f"}}),g.jsx("span",{children:"Data delivered to GCS"})]}),g.jsxs("div",{className:"legend__row",children:[g.jsx("i",{className:"legend__dot",style:{background:"transparent",border:"1.5px dashed #f97316"}}),g.jsx("span",{children:"Geofence"})]}),C&&g.jsxs(g.Fragment,{children:[g.jsx("div",{className:"legend__title",style:{marginTop:9},children:"Communication outage"}),g.jsxs("div",{className:"legend__row",children:[g.jsx("i",{className:"legend__dot",style:{background:"#dc2626"}}),g.jsx("span",{children:"Interference zone"})]}),g.jsxs("div",{className:"legend__row",children:[g.jsx("i",{className:"legend__dot",style:{background:"transparent",border:"1.5px dashed #f59e0b"}}),g.jsx("span",{children:"Source (swarm estimate)"})]})]}),g.jsx("div",{style:{marginTop:9,paddingTop:7,borderTop:"1px solid var(--border)",fontSize:10,color:"var(--ink-3)",lineHeight:1.45},children:"Drag to orbit · scroll to zoom"})]}):g.jsx("div",{className:"legend",children:g.jsx("button",{className:"legend__toggle",onClick:()=>b(!0),children:"▸ Legend"})})})]})}const rg=[{id:"select",label:"Select",hint:"Click an aircraft, task or interference source to select it. Drag to orbit."},{id:"add_poi",label:"+ Emergency",hint:"Click the terrain to report a new priority-1 emergency. The swarm re-plans for it at once."},{id:"add_interference",label:"+ Interference",hint:"Click the terrain to open a communication-outage zone (RF interference). Ridges between it and an aircraft block it."},{id:"add_scout",label:"+ UAV",hint:"Click the terrain to deploy an extra scout there (testing aid; the fleet itself launches from the GCS pads)."}],qA=t=>10**((t+3+82-31.53)/20),jt=(t,e=0)=>t==null||Number.isNaN(t)?"—":Number(t).toFixed(e),sg=t=>{const e=Math.max(0,Math.floor(t||0));return`${Math.floor(e/60)}:${String(e%60).padStart(2,"0")}`},KA=[["uav_failure","Fail relay","A relay UAV drops out of the sky",{target:"relay"}],["uav_failure","Fail scout","A scout UAV drops out of the sky",{target:"scout"}],["comm_outage","Radio out","A scout's radio fails for 40 s",{target:"scout",duration:40}],["comm_outage","GCS outage","The GCS receiver is down for 20 s",{gcs:!0,duration:20}],["packet_loss","Packet loss","30% loss on every link for 45 s",{rate:.3,duration:45}],["battery_fault","Battery fault","A relay's power draw jumps",{target:"relay"}],["heavy_rain","Heavy rain","Monsoon rain: turbulence, low cloud, wet antennas",{}],["storm_cell","Downdraught","A drifting mountain-wave cell with a 9 m/s sink",{}],["gps_denial","GNSS degraded","Valley multipath: the navigation solution drifts",{}]];function ZA({telemetry:t,tool:e,setTool:n,selected:i,setSelected:r,run:s,jammerPower:a,setJammerPower:o,wind:l,setWind:c,onFrame:u}){var I,ee,ne,le,Te,ze,X;const f=(t==null?void 0:t.drones)||{},h=(t==null?void 0:t.rf)||{},p=(t==null?void 0:t.pois)||[],_=(t==null?void 0:t.demo)||{},v=(i==null?void 0:i.kind)==="drone"?f[i.id]:null,m=(i==null?void 0:i.kind)==="jammer"?(h.jammers||[]).find(Y=>Y.id===i.id):null,d=(i==null?void 0:i.kind)==="poi"?p.find(Y=>Y.id===i.id):null,x=e==="goto"?{hint:`Click the terrain to send ${i==null?void 0:i.id} there. Esc to cancel.`}:rg.find(Y=>Y.id===e),y=h.ew||{},M=y.estimates||(y.estimate?[y.estimate]:[]),P=(t==null?void 0:t.mission)||_.mission||{},C=(t==null?void 0:t.injects)||{},A=P.phase==="LIVE",b=P.phase==="PLANNING",z=v==null?void 0:v.status,S=z==="KILLED",w=z==="CHARGING"||z==="READY",N=v&&!S&&!w&&z!=="LANDED",k=_.mode==="scripted",[j,q]=ye.useState(!1),[W,ie]=ye.useState(!1);return j?g.jsx("button",{className:"operator operator--min",onClick:()=>q(!1),children:"▸ Operator Control"}):g.jsxs("div",{className:"operator",children:[g.jsxs("div",{className:"operator__head",children:[g.jsx("span",{className:"operator__title",children:"Operator Control"}),g.jsx("span",{className:`operator__mode ${k?"scripted":""}`,children:k?"SCRIPTED":"LIVE"}),g.jsx("button",{className:"operator__x",title:"Minimise",onClick:()=>q(!0),children:"–"})]}),g.jsx("div",{className:"operator__tools",children:rg.map(Y=>g.jsx("button",{className:`tool tool--${Y.id} ${e===Y.id?"on":""}`,onClick:()=>n(Y.id),children:Y.label},Y.id))}),g.jsx("div",{className:"operator__hint",children:x==null?void 0:x.hint}),(e==="add_interference"||m)&&g.jsxs("div",{className:"operator__row",children:[g.jsxs("label",{children:["Interference power ",g.jsxs("b",{children:[jt(m?m.power_dbm:a)," dBm"]}),g.jsxs("span",{className:"operator__sub",children:[" ","· reach ≈ ",jt(qA(m?m.power_dbm:a))," m in open air"]})]}),g.jsx("input",{type:"range",min:"-10",max:"25",step:"1",value:m?m.power_dbm:a,onChange:Y=>{const ue=Number(Y.target.value);m?s("set_jammer_power",{jammer_id:m.id,power_dbm:ue}):o(ue)}})]}),v&&g.jsxs("div",{className:"operator__card",children:[g.jsxs("div",{className:"operator__card-head",children:[g.jsx("b",{children:v.id}),g.jsx("span",{className:`pill ${S?"bad":w?"warn":"ok"}`,children:S?"FAILED":z})]}),g.jsxs("div",{className:"operator__stats",children:[g.jsx("span",{children:v.role.replace("_"," ")}),N&&g.jsxs("span",{children:[jt(v.agl)," m AGL"]}),g.jsxs("span",{children:[jt(v.battery),"% batt"]}),N&&g.jsx("span",{children:v.radio_ok?v.connected?`${v.hops} hop(s) to GCS`:"NO LINK":"RADIO OUT"}),N&&g.jsx("span",{children:v.ew_hold?"WITHDRAWN":v.manual_target?"OPERATOR ORDER":"AUTONOMOUS"})]}),g.jsxs("div",{className:"operator__actions",children:[N&&g.jsx("button",{className:"btn",onClick:()=>n("goto"),children:"Send to…"}),N&&v.manual_target&&g.jsx("button",{className:"btn",onClick:()=>s("release",{drone_id:v.id}),children:"Release to autonomy"}),N&&v.role!=="STANDBY"&&g.jsxs("button",{className:"btn",onClick:()=>s("set_role",{drone_id:v.id,role:v.role==="SCOUT"?"RELAY":"SCOUT"}),children:["Make ",v.role==="SCOUT"?"relay":"scout"]}),N&&g.jsx("button",{className:"btn",onClick:()=>s("rth",{drone_id:v.id}),children:"Return home"}),z==="READY"&&A&&g.jsx("button",{className:"btn",onClick:()=>s("launch",{drone_id:v.id,role:"SCOUT"}),children:"Launch as scout"}),g.jsx("button",{className:"btn",onClick:()=>u(v.id),children:"Frame camera"}),S&&g.jsx("button",{className:"btn primary",onClick:()=>s("revive",{drone_id:v.id}),children:"Return to service"}),N&&g.jsx("button",{className:"btn danger",onClick:()=>s("kill",{drone_id:v.id}),children:"Fail UAV"})]})]}),m&&g.jsxs("div",{className:"operator__card",children:[g.jsxs("div",{className:"operator__card-head",children:[g.jsx("b",{children:m.id}),g.jsx("span",{className:"pill bad",children:"INTERFERENCE"})]}),((ee=(I=h.ew)==null?void 0:I.estimate)==null?void 0:ee.true_id)===m.id&&g.jsxs("div",{className:"operator__stats",children:[g.jsxs("span",{children:["Localised by swarm ± ",jt(h.ew.estimate.radius_m)," m"]}),g.jsxs("span",{children:["estimate ",jt(h.ew.estimate.error_m)," m off"]}),g.jsxs("span",{children:["≈",jt(h.ew.estimate.power_dbm)," dBm est."]})]}),g.jsx("div",{className:"operator__actions",children:g.jsx("button",{className:"btn",onClick:()=>{s("remove_jammer",{jammer_id:m.id}),r(null)},children:"Switch off (ground team)"})})]}),d&&g.jsxs("div",{className:"operator__card",children:[g.jsxs("div",{className:"operator__card-head",children:[g.jsx("b",{children:d.id}),g.jsx("span",{className:`pill ${d.delivered?"ok":d.surveyed?"warn":"bad"}`,children:d.delivered?"DATA AT GCS":d.surveyed?"SURVEYED":"PENDING"})]}),g.jsxs("div",{className:"operator__stats",children:[g.jsx("span",{children:d.category.replace(/_/g," ")}),g.jsxs("span",{children:["priority ",d.priority]}),d.emergent&&g.jsxs("span",{children:["reported T+",jt(d.release_time)," s"]}),d.surveyed_by&&g.jsxs("span",{children:["by ",d.surveyed_by]})]}),g.jsx("div",{className:"operator__actions",children:g.jsx("button",{className:"btn",onClick:()=>{s("remove_poi",{poi_id:d.id}),r(null)},children:"Cancel task"})})]}),g.jsxs("div",{className:`operator__card mission-card ${A?"mission-card--live":""}`,children:[g.jsxs("div",{className:"operator__card-head",children:[g.jsx("b",{children:A?`MISSION ${P.mission_id||""}`:b?"MISSION PLANNING":`MISSION ${P.phase||""}`}),g.jsx("span",{className:`pill ${A?"bad":"ok"}`,children:A?`${sg(P.remaining_s)} LEFT`:b?"ON PADS":"DONE"})]}),((ne=P.scenario)==null?void 0:ne.name)&&g.jsx("div",{className:"operator__sub",children:P.scenario.name}),b&&g.jsxs(g.Fragment,{children:[g.jsxs("div",{className:"operator__sub",children:[((le=P.tasks)==null?void 0:le.released)??0," task(s) known, ",P.time_limit_s?`${sg(P.time_limit_s)} allotted`:"no time limit",". The fleet launches in sequence from the GCS pads; relays take stations as the terrain requires."]}),g.jsx("div",{className:"operator__actions",children:g.jsx("button",{className:"btn primary",onClick:()=>s("launch_mission"),children:"Launch mission ▸"})})]}),A&&g.jsxs(g.Fragment,{children:[g.jsxs("div",{className:"operator__stats",children:[g.jsxs("span",{children:[((Te=P.tasks)==null?void 0:Te.delivered)??0,"/",((ze=P.tasks)==null?void 0:ze.released)??0," delivered"]}),g.jsxs("span",{children:["priority score ",jt((P.priority_score??0)*100),"%"]}),g.jsxs("span",{children:[((X=P.roles)==null?void 0:X.relays_needed)??0," relay(s) needed"]}),P.pending_disturbances>0&&g.jsxs("span",{children:[P.pending_disturbances," scenario events to come"]})]}),g.jsx("div",{className:"operator__section",children:"Inject a disturbance"}),g.jsx("div",{className:"inject-tools",children:KA.map(([Y,ue,de,Ie])=>g.jsx("button",{className:"tool",title:de,onClick:()=>s("inject",{kind:Y,...Ie}),children:ue},`${Y}-${ue}`))}),g.jsxs("div",{className:"operator__stats",children:[C.rain_mm_h>0&&g.jsxs("span",{children:["rain ",jt(C.rain_mm_h)," mm/h"]}),C.cloud_base_agl&&g.jsxs("span",{children:["cloud base ",jt(C.cloud_base_agl)," m AGL"]}),C.nav_fallback&&g.jsx("span",{children:"terrain-relative nav"}),(C.cells||[]).length>0&&g.jsxs("span",{children:[C.cells.length," cell(s)"]}),Object.keys(C.faults||{}).length>0&&g.jsxs("span",{children:[Object.keys(C.faults).join(", ")," degraded"]})]}),g.jsxs("div",{className:"operator__actions",children:[g.jsx("button",{className:"btn",onClick:()=>s("clear_injects"),children:"Clear weather"}),g.jsx("button",{className:"btn",onClick:()=>s("end_mission"),children:"End mission"})]})]}),!A&&!b&&g.jsx("div",{className:"operator__actions",children:g.jsx("button",{className:"btn primary",onClick:()=>s("reset_mission"),children:"Back to planning"})})]}),M.length>0&&!m&&g.jsxs("div",{className:"operator__card operator__card--alert",children:[g.jsxs("div",{className:"operator__card-head",children:[g.jsx("b",{children:M.length>1?`${M.length} interference sources localised`:"Interference source localised"}),g.jsx("span",{className:"pill bad",children:"COMMS"})]}),M.map(Y=>g.jsxs("div",{className:"operator__sub",style:{marginTop:4},children:[g.jsx("b",{children:Y.id})," grid (",jt(Y.x),", ",jt(Y.y),") · ± ",jt(Y.radius_m)," m · ≈",jt(Y.power_dbm)," dBm",Y.sensors?` · ${Y.sensors}-aircraft cross-fix`:""]},Y.id)),g.jsx("div",{className:"operator__sub",style:{marginTop:4},children:"Scouts inside it withdraw to regain the link; the relay planner routes around it."})]}),g.jsx("button",{className:"operator__more",onClick:()=>ie(!W),children:W?"▾ Hide weather & reports":"▸ Weather & reports"}),W&&g.jsxs(g.Fragment,{children:[g.jsx("div",{className:"operator__section",children:"Weather"}),g.jsxs("div",{className:"operator__row",children:[g.jsxs("label",{children:["Wind ",g.jsxs("b",{children:[jt(l.speed)," m/s"]})," toward ",g.jsxs("b",{children:[jt(l.heading),"°"]})]}),g.jsx("input",{type:"range",min:"0",max:"18",step:"1",value:l.speed,onChange:Y=>c({...l,speed:Number(Y.target.value)}),onMouseUp:()=>s("set_wind",{speed:l.speed,heading_deg:l.heading}),onTouchEnd:()=>s("set_wind",{speed:l.speed,heading_deg:l.heading})}),g.jsx("input",{type:"range",min:"0",max:"355",step:"5",value:l.heading,onChange:Y=>c({...l,heading:Number(Y.target.value)}),onMouseUp:()=>s("set_wind",{speed:l.speed,heading_deg:l.heading}),onTouchEnd:()=>s("set_wind",{speed:l.speed,heading_deg:l.heading})})]}),g.jsxs("div",{className:"operator__actions",children:[g.jsx("button",{className:"btn",onClick:()=>s("gust",{magnitude:13}),children:"Trigger gust"}),(h.jammers||[]).length>0&&g.jsx("button",{className:"btn",onClick:()=>s("clear_jammers"),children:"Clear interference"})]}),g.jsx("div",{className:"operator__section",children:"Reports"}),g.jsxs("div",{className:"operator__actions",children:[g.jsx("button",{className:"btn",onClick:()=>s("sitrep"),children:"Generate SITREP"}),g.jsx("a",{className:"btn",href:"/api/summary",target:"_blank",rel:"noreferrer",children:"Mission metrics (JSON)"}),k?g.jsx("button",{className:"btn",onClick:()=>s("stop_scenario"),children:"Stop scripted demo"}):g.jsx("button",{className:"btn",onClick:()=>s("run_scenario"),children:"Run scripted demo"})]})]})]})}const hn=1,QA=.0016,JA=3.2,Fu=.05,eb=.0058;function Qi(t,e,n=hn){const i=(e+180)/360*Math.PI*2,r=(90-t)/180*Math.PI;return new L(-n*Math.cos(i)*Math.sin(r),n*Math.cos(r),n*Math.sin(i)*Math.sin(r))}const ag=4,tb=14,nb=.9,og=420,lg=40075016,cg=(t,e)=>St.radToDeg(Math.atan(Math.sinh(Math.PI*(1-2*t/2**e)))),ib=(t,e,n)=>[cg(n+1,t),cg(n,t),e/2**t*360-180,(e+1)/2**t*360-180];function rb(t,e,n){const i=2**n,r=St.degToRad(St.clamp(t,-85,85));return{x:(e+180)/360*i,y:(1-Math.log(Math.tan(r)+1/Math.cos(r))/Math.PI)/2*i}}function sb(t){const e=t.length(),n=90-St.radToDeg(Math.acos(t.y/e)),i=St.radToDeg(Math.atan2(t.z,-t.x))-180;return{lat:n,lon:(i+540)%360-180}}const Ou=t=>Math.log(Math.tan(Math.PI/4+St.degToRad(t)/2));function va(t,e,n=48){const[i,r,s,a]=t,o=[],l=[],c=[],u=Ou(i),f=Ou(r);for(let p=0;p<=n;p++){const _=i+(r-i)*(p/n);for(let v=0;v<=n;v++){const m=s+(a-s)*(v/n),d=Qi(_,m,e);o.push(d.x,d.y,d.z),l.push(v/n,(Ou(_)-u)/(f-u))}}for(let p=0;p<n;p++)for(let _=0;_<n;_++){const v=p*(n+1)+_,m=v+1,d=v+n+1,x=d+1;c.push(v,m,d,m,x,d)}const h=new ct;return h.setAttribute("position",new ft(o,3)),h.setAttribute("uv",new ft(l,2)),h.setIndex(c),h.computeVertexNormals(),h}function ug(t,e,n,i=1){const[r,s,a,o]=t,l=[],c=24;for(let f=0;f<=c;f++)l.push(Qi(r,a+(o-a)*f/c,e));for(let f=0;f<=c;f++)l.push(Qi(r+(s-r)*f/c,o,e));for(let f=0;f<=c;f++)l.push(Qi(s,o-(o-a)*f/c,e));for(let f=0;f<=c;f++)l.push(Qi(s-(s-r)*f/c,a,e));const u=new Ur(new ct().setFromPoints(l),new Ir({color:n,transparent:!0,opacity:i,depthTest:!1}));return u.renderOrder=5,u}function dg(t,e){const n=Qi(t,e);return{spin:-Math.atan2(n.x,n.z),tilt:St.degToRad(t)}}function ab(t,e=30,n=170){const i=[];return[...t].sort((r,s)=>r.y-s.y).forEach(r=>{let s=r.y;for(const a of i)Math.abs(a.x-r.x)<n&&Math.abs(a.ly-s)<e&&(s=a.ly+e);i.push({...r,ly:s})}),i}const ob=(t,e)=>t==null?"—":`${Math.abs(t).toFixed(3)}°${t>=0?"N":"S"}  ${Math.abs(e).toFixed(3)}°${e>=0?"E":"W"}`;function lb({open:t,onClose:e,currentId:n,canClose:i}){const r=ye.useRef(null),s=ye.useRef({}),[a,o]=ye.useState([]),[l,c]=ye.useState(null),[u,f]=ye.useState(null),[h,p]=ye.useState(null),[_,v]=ye.useState(null),[m,d]=ye.useState([]),[x,y]=ye.useState(null);ye.useEffect(()=>{t&&fetch("/api/theatres",{cache:"no-store"}).then(b=>b.json()).then(b=>o(b.theatres||[])).catch(()=>v("Simulation node unreachable"))},[t]),ye.useEffect(()=>{if(!t||!r.current)return;const b=r.current,z=new r0({antialias:!0});z.setPixelRatio(Math.min(window.devicePixelRatio,2)),z.setSize(b.clientWidth,b.clientHeight),z.outputColorSpace=en,z.setClearColor(329482),b.appendChild(z.domElement);const S=new s0,w=new wn(32,b.clientWidth/b.clientHeight,2e-4,50),N=new Xt,k=new Xt;N.add(k),S.add(N);const j=new c0,q=z.capabilities.getMaxAnisotropy(),W=($,J)=>j.load($,te=>{te.colorSpace=en,te.anisotropy=q,J==null||J(te)}),ie=new ui({roughness:.92,metalness:0});W("/earth_hd.jpg",$=>{ie.map=$,ie.needsUpdate=!0});const I=new Ne(new An(hn,256,160),ie);k.add(I);const ee=[];for(let $=0;$<1800;$++){const J=new L().randomDirection().multiplyScalar(30+Math.random()*10);ee.push(J.x,J.y,J.z)}const ne=new wA(new ct().setAttribute("position",new ft(ee,3)),new l0({color:12109012,size:.05,sizeAttenuation:!0}));S.add(ne);const le=new Ne(new An(hn*1.035,96,64),new Vn({side:Yt,transparent:!0,depthWrite:!1,vertexShader:"varying vec3 vN; void main(){ vN = normalize(normalMatrix*normal); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }",fragmentShader:"varying vec3 vN; void main(){ float i = pow(clamp(0.75 - dot(vN, vec3(0,0,1.0)), 0.0, 1.0), 3.2); gl_FragColor = vec4(0.45,0.66,0.98,1.0) * i * 1.4; }"}));S.add(le),S.add(new LA(16777215,1.25));const Te=new u0(16777215,1.35);Te.position.set(2.5,1.5,4),S.add(Te);const ze=[];fetch("/himalaya.json").then($=>$.json()).then($=>{const J=new yt({transparent:!0,opacity:0,depthTest:!1,side:lt});W("/himalaya.jpg",re=>{J.map=re,J.needsUpdate=!0});const te=new Ne(va([$.south,$.north,$.west,$.east],hn,96),J);te.renderOrder=1,k.add(te),ze.push(te)}).catch(()=>{});const X=new Map,Y=[];let ue=0,de=new Set,Ie=0;const De=()=>{for(Y.sort(($,J)=>$.z-J.z||$.dist-J.dist);ue<8&&Y.length;){const $=Y.shift();if(!de.has($.key)){X.delete($.key);continue}ue+=1,$.state="loading",j.load(`/api/tiles/${$.key}.jpg`,J=>{ue-=1,J.colorSpace=en,J.anisotropy=q,J.generateMipmaps=!0,$.mat=new yt({map:J,transparent:!0,opacity:0,depthTest:!1,side:lt});const[te,re,Pe]=$.key.split("/").map(Number);$.mesh=new Ne(va(ib(te,re,Pe),hn,te<=6?16:6),$.mat),$.mesh.renderOrder=2.2+te*.01,$.mesh.visible=!1,k.add($.mesh),$.state="ready",De()},void 0,()=>{ue-=1,$.state="failed",De()})}},qe=$=>{var J;$.mesh&&(k.remove($.mesh),$.mesh.geometry.dispose(),(J=$.mat.map)==null||J.dispose(),$.mat.dispose()),X.delete($.key)},Je=$=>{Ie=(Ie+1)%4;const J=St.clamp((nb-Re.alt)/.3,0,1);if(!Ie){const te=new Set;if(J>0){N.updateMatrixWorld(!0);const{lat:re,lon:Pe}=sb(k.worldToLocal(new L(0,0,hn))),we=2*Re.alt*6371e3*Math.tan(St.degToRad(w.fov/2)),$e=we/b.clientHeight/Math.min(window.devicePixelRatio,1.5),U=Math.max(Math.cos(St.degToRad(re)),.05),pe=St.clamp(Math.round(Math.log2(lg*U/(256*$e))),ag,tb);for(let B=pe;B>=Math.max(ag,pe-2);B--){const K=2**B,me=lg*U/K,ge=Math.min(we*w.aspect/2/me*1.15,5),Be=Math.min(we/2/me*1.15,4),rt=rb(re,Pe,B);for(let Tt=Math.floor(rt.y-Be);Tt<=Math.floor(rt.y+Be);Tt++){const We=Tt,ut=Tt-Math.floor(rt.y);if(!(We<0||We>=K))for(let zt=Math.floor(rt.x-ge);zt<=Math.floor(rt.x+ge);zt++){const _r=zt-Math.floor(rt.x),ho=(zt%K+K)%K,Nn=`${B}/${ho}/${We}`;te.add(Nn);let jn=X.get(Nn);jn||(jn={key:Nn,z:B,state:"queued",opacity:0,used:0,dist:_r*_r+ut*ut},X.set(Nn,jn),Y.push(jn)),jn.used=performance.now(),jn.state==="queued"&&(jn.dist=_r*_r+ut*ut)}}}}de=te;for(let re=Y.length-1;re>=0;re--)te.has(Y[re].key)||(X.delete(Y[re].key),Y.splice(re,1));De(),X.size>og&&[...X.values()].filter(re=>!te.has(re.key)&&re.state!=="loading").sort((re,Pe)=>re.used-Pe.used).slice(0,X.size-og).forEach(qe)}X.forEach(te=>{if(te.state!=="ready")return;const re=de.has(te.key)?J:0;te.opacity+=(re-te.opacity)*$,te.mat.opacity=te.opacity,te.mesh.visible=te.opacity>.01})},je=new Map,D=$=>{$.filter(J=>J.lat!=null&&J.inner_bounds).forEach(J=>{if(je.has(J.id))return;const te={theatre:J,loaded:!1,midLoaded:!1};J.has_mid&&J.mid_bounds&&(te.midMat=new yt({transparent:!0,opacity:0,depthTest:!1,side:lt}),te.mid=new Ne(va(J.mid_bounds,hn,48),te.midMat),te.mid.renderOrder=2,k.add(te.mid)),J.has_patch&&J.context_bounds&&(te.patchMat=new yt({transparent:!0,opacity:0,depthTest:!1,side:lt}),te.patch=new Ne(va(J.context_bounds,hn,48),te.patchMat),te.patch.renderOrder=3,k.add(te.patch),te.ring=ug(J.context_bounds,hn,16777215,.25),k.add(te.ring)),te.fill=new Ne(va(J.inner_bounds,hn,8),new yt({color:16756768,transparent:!0,opacity:.12,depthTest:!1,side:lt})),te.fill.renderOrder=4,te.fill.userData.id=J.id,k.add(te.fill),te.box=ug(J.inner_bounds,hn,16756768,1),k.add(te.box),te.hit=new Ne(new An(.02,10,8),new yt({visible:!1})),te.hit.position.copy(Qi(J.lat,J.lon,hn)),te.hit.userData.id=J.id,k.add(te.hit),je.set(J.id,te)})},Re={spin:0,tilt:0,alt:2.6,tSpin:0,tTilt:0,tAlt:2.6},Xe=dg(29,82);Re.spin=Re.tSpin=Xe.spin,Re.tilt=Re.tTilt=Xe.tilt;const Ze=($,J,te)=>{const re=dg($,J);let Pe=re.spin-Re.tSpin;Pe=((Pe+Math.PI)%(Math.PI*2)+Math.PI*2)%(Math.PI*2)-Math.PI,Re.tSpin+=Pe,Re.tTilt=re.tilt,te!=null&&(Re.tAlt=te)},Le=z.domElement;let et=!1,Ue=!1,R=0,E=0;const H=new h0,Q=$=>{const J=Le.getBoundingClientRect(),te={x:($.clientX-J.left)/J.width*2-1,y:-(($.clientY-J.top)/J.height)*2+1};H.setFromCamera(te,w);const re=[];je.forEach(U=>{re.push(U.fill),Re.alt>Fu&&re.push(U.hit)});const Pe=H.intersectObjects(re,!1),we=H.intersectObject(I,!1)[0],$e=Pe.find(U=>!we||U.distance<=we.distance+.001);return $e?$e.object.userData.id:null};Le.addEventListener("pointerdown",$=>{et=!0,Ue=!1,R=$.clientX,E=$.clientY});const se=$=>{var J,te;if(et){const re=$.clientX-R,Pe=$.clientY-E;Math.abs(re)+Math.abs(Pe)>2&&(Ue=!0);const we=.0022*Math.min(Re.alt,2.2)+1e-5;Re.tSpin+=re*we,Re.tTilt=St.clamp(Re.tTilt+Pe*we,-1.3,1.3),R=$.clientX,E=$.clientY}else{const re=Q($);Le.style.cursor=re?"pointer":"grab",(te=(J=s.current).onHover)==null||te.call(J,re)}},Z=$=>{var J,te;if(et&&!Ue){const re=Q($);re&&((te=(J=s.current).onAreaClick)==null||te.call(J,re,Re.alt))}et=!1};window.addEventListener("pointermove",se),window.addEventListener("pointerup",Z),Le.addEventListener("wheel",$=>{$.preventDefault(),Re.tAlt=St.clamp(Re.tAlt*Math.exp($.deltaY*.0016),QA,JA)},{passive:!1});let Me;const fe=new d0;let ve=0;const Ke=()=>{var U,pe;Me=requestAnimationFrame(Ke);const $=Math.min(fe.getDelta(),.05),J=1-Math.exp(-4.5*$);Re.spin+=(Re.tSpin-Re.spin)*J,Re.tilt+=(Re.tTilt-Re.tilt)*J,Re.alt=Math.exp(Math.log(Re.alt)+(Math.log(Re.tAlt)-Math.log(Re.alt))*J),k.rotation.y=Re.spin,N.rotation.x=Re.tilt,w.position.set(0,0,hn+Re.alt),w.lookAt(0,0,0),Je(1-Math.exp(-6*$));const te=St.clamp((1.4-Re.alt)/.9,0,1);ze.forEach(B=>{B.material.opacity=te,B.visible=te>.01});const re=w.position.clone().normalize(),Pe=b.clientWidth,we=b.clientHeight,$e=[];je.forEach((B,K)=>{const ge=Qi(B.theatre.lat,B.theatre.lon,hn).clone().applyMatrix4(k.matrixWorld),Be=ge.clone().normalize().dot(re)>.2;if(B.mid){const ut=St.clamp((.16-Re.alt)/.1,0,1)*(Be?1:0);B.midMat.opacity=ut,B.mid.visible=ut>.01,!B.midLoaded&&Re.alt<.4&&(B.midLoaded=!0,W(`/api/theatre/${K}/patch.jpg?level=mid`,zt=>{B.midMat.map=zt,B.midMat.needsUpdate=!0}))}if(B.patch){const ut=St.clamp((.03-Re.alt)/.02,0,1)*(Be?1:0);B.patchMat.opacity=ut,B.patch.visible=ut>.01,B.ring.visible=ut>.05,!B.loaded&&Re.alt<.1&&(B.loaded=!0,W(`/api/theatre/${K}/patch.jpg`,zt=>{B.patchMat.map=zt,B.patchMat.needsUpdate=!0}))}const rt=s.current.hoverId===K||s.current.focusId===K,Tt=Be&&Re.alt<.12;B.fill.material.opacity=Tt?rt?.32:.12:0,B.box.visible=Tt,B.box.material.color.setHex(K===s.current.currentId?8315560:16756768);const We=ge.clone().project(w);$e.push({id:K,x:(We.x+1)/2*Pe,y:(1-We.y)/2*we,visible:Be&&We.z<1})}),ve=(ve+1)%3,ve||(pe=(U=s.current).pushFrame)==null||pe.call(U,$e,Re.alt),z.render(S,w)};Ke();const oe=()=>{w.aspect=b.clientWidth/b.clientHeight,w.updateProjectionMatrix(),z.setSize(b.clientWidth,b.clientHeight)};return window.addEventListener("resize",oe),s.current={...s.current,flyTo:Ze,buildAreas:D,view:Re},window.__cdawnGlobe={areas:je,view:Re,regional:ze,rim:le,earth:I,stars:ne,camera:w,renderer:z,tiles:X},()=>{cancelAnimationFrame(Me),window.removeEventListener("resize",oe),window.removeEventListener("pointermove",se),window.removeEventListener("pointerup",Z),S.traverse($=>{var J,te,re,Pe,we,$e;(te=(J=$.geometry)==null?void 0:J.dispose)==null||te.call(J),$.material&&((Pe=(re=$.material.map)==null?void 0:re.dispose)==null||Pe.call(re),($e=(we=$.material).dispose)==null||$e.call(we))}),z.dispose(),Le.parentNode===b&&b.removeChild(Le)}},[t]),ye.useEffect(()=>{var b,z;(z=(b=s.current).buildAreas)==null||z.call(b,a)},[a,t]),ye.useEffect(()=>{s.current.currentId=n,s.current.hoverId=l,s.current.focusId=u},[n,l,u]);const M=async b=>{if(!(h||!b)){v(null),p(b.id);try{const S=await(await fetch(`/api/theatre/${b.id}`,{method:"POST"})).json();if(!S.ok)throw new Error(S.error||"Could not load theatre");setTimeout(()=>{p(null),e()},600)}catch(z){p(null),v(String(z.message||z))}}},P=b=>{var z,S;f(b.id),b.lat!=null&&((S=(z=s.current).flyTo)==null||S.call(z,b.lat,b.lon,eb))};if(s.current.onHover=b=>c(b),s.current.onAreaClick=(b,z)=>{const S=a.find(w=>w.id===b);S&&(z<=Fu?M(S):P(S))},s.current.pushFrame=(b,z)=>{d(b),y(z*6371)},!t)return null;const C=a.find(b=>b.id===(l||u||n)),A=x!=null&&x/6371<=Fu;return g.jsxs("div",{className:"theatre",children:[g.jsxs("div",{className:"theatre__globe",ref:r,children:[ab(m.filter(b=>b.visible)).map(b=>{const z=a.find(S=>S.id===b.id);return z?g.jsxs("div",{className:`globe-tag ${A?"near":"far"} ${b.id===n?"current":""} ${b.id===l?"hover":""}`,style:{left:b.x,top:b.ly},children:[g.jsx("span",{className:"globe-tag__name",children:z.name}),A&&g.jsx("span",{className:"globe-tag__hint",children:h===z.id?"deploying…":"click area to deploy"})]},b.id):null}),g.jsxs("div",{className:"globe-hud",children:[g.jsxs("span",{children:["ALT ",x==null?"—":x>=1e3?`${(x/1e3).toFixed(1)}k`:x.toFixed(0)," km"]}),g.jsx("span",{children:A?"Click an outlined area to deploy":"Scroll to zoom · drag to rotate · click an area to fly in"})]}),g.jsx("div",{className:"theatre__credit",children:"Globe: NASA Blue Marble · Satellite tiles: Sentinel-2 cloudless 2016 (EOX, CC BY 4.0) · Site imagery: Esri World Imagery (local cache) · Terrain: SRTM/Copernicus via AWS Open Data"})]}),g.jsxs("div",{className:"theatre__panel",children:[g.jsxs("div",{className:"theatre__head",children:[g.jsxs("div",{children:[g.jsx("div",{className:"theatre__kicker",children:"C-DAWN · UAV-X mission planning"}),g.jsx("div",{className:"theatre__title",children:"Select the disaster site"})]}),i&&g.jsx("button",{className:"theatre__close",onClick:e,children:"Close ✕"})]}),g.jsx("div",{className:"theatre__list",children:a.map(b=>g.jsxs("button",{className:`theatre__item ${b.id===n?"current":""} ${b.id===(l||u)?"hover":""}`,onMouseEnter:()=>c(b.id),onMouseLeave:()=>c(null),onClick:()=>P(b),disabled:!!h,children:[g.jsxs("div",{className:"theatre__item-top",children:[g.jsx("span",{className:"theatre__name",children:b.name}),g.jsx("span",{className:"theatre__tag",children:h===b.id?"LOADING…":b.id===n?"ACTIVE":b.synthetic?"TRAINING MODEL":"REAL TERRAIN"})]}),g.jsx("div",{className:"theatre__region",children:b.region}),g.jsxs("div",{className:"theatre__coords",children:[ob(b.lat,b.lon),b.min_height_m!=null&&` · ${Math.round(b.min_height_m)}–${Math.round(b.max_height_m)} m`]})]},b.id))}),C&&g.jsxs("div",{className:"theatre__detail",children:[g.jsx("div",{className:"theatre__detail-name",children:C.name}),g.jsx("p",{children:C.description}),C.use_case&&g.jsxs("p",{children:[g.jsx("b",{children:"Use case:"})," ",C.use_case]}),C.size_m&&g.jsxs("p",{children:[g.jsx("b",{children:"Area:"})," ",(C.size_m/1e3).toFixed(1)," × ",(C.size_m/1e3).toFixed(1)," km"]}),g.jsx("button",{className:"btn primary",style:{marginTop:10,width:"100%"},disabled:!!h,onClick:()=>M(C),children:h===C.id?"Deploying…":C.id===n?"Re-deploy here":`Deploy to ${C.name}`})]}),_&&g.jsx("div",{className:"theatre__error",children:_})]})]})}const Oe=(t,e=1,n="—")=>t==null||Number.isNaN(t)?n:Number(t).toFixed(e);function cb({telemetry:t}){var p,_,v,m,d;const e=t==null?void 0:t.demo,n=(t==null?void 0:t.metrics)||{},i=t==null?void 0:t.causal,r=(t==null?void 0:t.rf)||{};n.current_phase;const s=r.jamming_active,a=(n.backhaul_pdr??1)*100,o=(t==null?void 0:t.mission)||(e==null?void 0:e.mission)||{};let l="info";s||a<60?l="alert":a<90&&(l="caution");let c="All links nominal. Relays holding assigned stations.";const u=(p=i==null?void 0:i.interventions)==null?void 0:p.latest,f=r.ew,h=Object.entries(((_=o.roles)==null?void 0:_.handovers)||{});if(o.phase==="PLANNING")c=`Fleet on the pads. Relay chain planned for ${((v=o.roles)==null?void 0:v.relays_needed)??"—"} relay(s); launch the mission to begin.`;else if(f!=null&&f.active&&f.summary)c=`Interference response — ${f.summary}`;else if(h.length){const[x,y]=h[0];c=`Relay handover: ${y.to} is flying out to take ${x}'s station before ${x} returns to recharge — the chain stays closed throughout.`}else if(u&&u.phase==="complete")u.confounded?c=`Causal test ${u.id} on ${u.link_id} was inconclusive — the conditions moved during the measurement, so no cause is being claimed.`:u.attribution==="terrain_occlusion"?c=`Diagnosed ${u.link_id} as TERRAIN occlusion by direct test — climbing ${Oe(u.achieved_dz,0)} m cut packet loss ${Oe(u.causal_effect*100,0)} points. Holding the new altitude.`:u.attribution==="not_terrain"?c=`Ruled OUT terrain on ${u.link_id}: altitude made no difference, so the loss is interference or range. Rerouting instead of climbing.`:u.attribution==="partial_terrain"&&(c=`Terrain is a partial cause on ${u.link_id}. Requesting relay repositioning rather than altitude alone.`);else if(((m=i==null?void 0:i.interventions)==null?void 0:m.active_count)>0){const x=(d=i.interventions.active)==null?void 0:d[0];c=`Running a controlled altitude test on ${(x==null?void 0:x.link_id)??"a degraded link"} to establish whether the cause is terrain or interference.`}return g.jsxs("div",{className:`situation ${l}`,children:[g.jsxs("div",{className:"situation__head",children:[g.jsx("span",{className:"situation__tag",children:o.phase==="LIVE"?o.remaining_s!=null?`${Math.max(0,Math.floor(o.remaining_s/60))}:${String(Math.max(0,Math.floor(o.remaining_s%60))).padStart(2,"0")} left`:"Live":o.phase||"Standby"}),g.jsx("span",{className:"situation__title",children:(e==null?void 0:e.phase_name)||"Awaiting mission start"})]}),g.jsx("div",{className:"situation__body",children:(e==null?void 0:e.phase_brief)||"System initialising."}),g.jsxs("div",{className:"situation__action",children:[g.jsx("b",{children:"System action:"})," ",c]})]})}function m0({telemetry:t,onSelect:e,run:n,selectedId:i}){var h,p;const r=Object.values((t==null?void 0:t.drones)||{}),s=["KILLED","CHARGING","READY","LANDED"],a=r.filter(_=>!s.includes(_.status)).length,o=r.filter(_=>["CHARGING","READY"].includes(_.status)).length,l=_=>_.status==="KILLED"?"dead":_.role==="SCOUT"?"scout":_.role==="RELAY"?"relay":"gcs",c=_=>_.status==="CHARGING"?"CHG":_.status==="READY"?"RDY":{SCOUT:"SCT",RELAY:"RLY",STANDBY:_.status==="RETURNING"?"RTH":"STB"}[_.role]??"—",u=new Set(((p=(h=t==null?void 0:t.mission)==null?void 0:h.awareness)==null?void 0:p.suspected)||[]),f=_=>{if(_.status==="KILLED")return u.has(_.id)?"FAILED · swarm: not heard":"FAILED";if(u.has(_.id)&&!s.includes(_.status))return"NOT HEARD by the swarm (radio out?)";if(_.status==="CHARGING")return`on pad · recharging ${Oe(_.battery,0)}%`;if(_.status==="READY")return"on pad · charged, ready to launch";const v=_.radio_ok?_.connected?`${_.hops} hop${_.hops===1?"":"s"} to GCS`:"NO LINK":"radio out",m=_.status==="RETURNING"?"returning to GCS":_.handover_to?`handing station to ${_.handover_to}`:_.ew_hold?"withdrawn to regain link":_.manual_target?"operator order":_.role==="RELAY"?"relay station":_.assigned_poi||"standing by",d=_.data_backlog?` · ${_.data_backlog} chunks queued`:"";return`${m} · ${v}${d}`};return g.jsxs("div",{className:"panel",children:[g.jsxs("div",{className:"panel__head",children:[g.jsx("span",{className:"panel__title",children:"Swarm"}),g.jsxs("span",{className:`panel__badge ${a===r.length?"ok":"bad"}`,children:[a," UP · ",o," ON PAD"]})]}),g.jsxs("div",{className:"panel__body tight",children:[r.length===0&&g.jsx("div",{className:"empty",children:"Awaiting telemetry from the simulation node."}),r.map(_=>{const v=_.battery??0,m=v>50?"hi":v>22?"mid":"lo";return g.jsxs("div",{className:`aircraft ${s.includes(_.status)?"dead":""} ${_.id===i?"selected":""}`,onClick:()=>e==null?void 0:e(_.id),title:"Click to select this aircraft and frame it in the 3D view",children:[g.jsx("div",{className:`aircraft__badge ${l(_)}`,children:c(_)}),g.jsxs("div",{children:[g.jsx("div",{className:"aircraft__id",children:_.id}),g.jsx("div",{className:`aircraft__meta ${!s.includes(_.status)&&!_.connected?"bad-text":""}`,children:f(_)}),(_.status==="KILLED"||!s.includes(_.status))&&g.jsx("button",{className:`mini ${_.status==="KILLED"?"revive":"kill"}`,onClick:d=>{d.stopPropagation(),n==null||n(_.status==="KILLED"?"revive":"kill",{drone_id:_.id})},children:_.status==="KILLED"?"Return to service":"Fail UAV"})]}),g.jsxs("div",{className:"aircraft__right",children:[g.jsxs("div",{className:"aircraft__alt",children:[Oe(_.agl,0)," m AGL"]}),g.jsxs("div",{style:{color:"var(--ink-3)",fontSize:10},children:[Oe(v,0),"%"]}),g.jsx("div",{className:"bat",children:g.jsx("div",{className:`bat__fill ${m}`,style:{width:`${Math.max(v,0)}%`}})})]})]},_.id)})]})]})}const hg=[{key:"β_T",symbol:"T",label:"Terrain",color:"#a45a06"},{key:"β_D",symbol:"D",label:"Distance",color:"#1549c9"},{key:"β_J",symbol:"J",label:"Interference",color:"#c1201b"},{key:"β_W",symbol:"W",label:"Weather",color:"#0e7490"},{key:"β_θ",symbol:"θ",label:"Antenna",color:"#6d28d9"}];function g0({telemetry:t}){const e=t==null?void 0:t.causal,n=e==null?void 0:e.scm,i=e==null?void 0:e.interventions;if(!(n!=null&&n.dag))return g.jsxs("div",{className:"panel",children:[g.jsx("div",{className:"panel__head",children:g.jsx("span",{className:"panel__title",children:"Causal Diagnostics"})}),g.jsx("div",{className:"panel__body",children:g.jsx("div",{className:"empty",children:"Collecting link observations…"})})]});const r=n.dag.coefficients||{},s=Math.max(...hg.map(p=>Math.abs(r[p.key]??0)),1),a=i==null?void 0:i.latest;let o="unknown",l="No completed test yet",c="The engine runs a controlled altitude change on a degraded link and measures the result, rather than inferring cause from correlation.";a&&a.phase==="complete"&&(a.confounded?(o="unknown",l="Inconclusive — not identified",c=`Test ${a.id} on ${a.link_id} measured ${Oe(a.causal_effect*100,1)} points of change, but the no-confounding assumption failed, so this is descriptive only.`):a.attribution==="terrain_occlusion"?(o="terrain",l="Cause: terrain occlusion",c=`${a.id}: climbing ${Oe(a.achieved_dz,0)} m reduced packet loss by ${Oe(a.causal_effect*100,1)} points (confidence ${Oe(a.confidence*100,0)}%). Altitude retained.`):a.attribution==="not_terrain"?(o="jam",l="Cause: NOT terrain",c=`${a.id}: altitude produced no improvement, so terrain is excluded. Consistent with interference or range. Rerouting.`):(o="unknown",l="Cause: partially terrain",c=`${a.id}: altitude helped by ${Oe(a.causal_effect*100,1)} points — contributing but not dominant.`));const u=(i==null?void 0:i.identified_count)??0,f=(i==null?void 0:i.confounded_count)??0,h=(i==null?void 0:i.completed_count)??0;return g.jsxs("div",{className:"panel",children:[g.jsxs("div",{className:"panel__head",children:[g.jsx("span",{className:"panel__title",children:"Causal Diagnostics (SCM)"}),g.jsx("span",{className:`panel__badge ${i!=null&&i.active_count?"warn":""}`,children:i!=null&&i.active_count?"TEST RUNNING":`${h} TESTS`})]}),g.jsxs("div",{className:"panel__body",children:[g.jsx("div",{className:"scm-eq",children:"L = σ(β₀ + β_T·T + β_D·D + β_J·J + β_W·W + β_θ·θ)"}),hg.map(p=>{const _=r[p.key]??0;return g.jsxs("div",{className:"coef",children:[g.jsxs("span",{className:"coef__name",children:[g.jsx("span",{className:"coef__sym",style:{background:`${p.color}1a`,color:p.color},children:p.symbol}),p.label]}),g.jsx("span",{className:"coef__bar",children:g.jsx("span",{className:"coef__fill",style:{width:`${Math.abs(_)/s*100}%`,background:p.color}})}),g.jsx("span",{className:"coef__val",children:Oe(_,2)})]},p.key)}),g.jsxs("div",{style:{fontSize:10,color:"var(--ink-3)",marginTop:8},children:["Coefficients updated online by recursive least squares from"," ",n.total_observations??0," link observations."]}),g.jsxs("div",{className:`verdict ${o}`,children:[g.jsx("div",{className:"verdict__head",children:l}),g.jsx("div",{children:c}),(a==null?void 0:a.confounded)&&(a==null?void 0:a.confound_reason)&&g.jsxs("div",{className:"confound",children:[g.jsx("b",{children:"Why it does not identify:"})," ",a.confound_reason,"."]})]}),g.jsxs("div",{style:{marginTop:9},children:[g.jsxs("div",{className:"kv",children:[g.jsx("span",{className:"kv__k",children:"Tests with a clean identification"}),g.jsx("span",{className:"kv__v",children:u})]}),g.jsxs("div",{className:"kv",children:[g.jsx("span",{className:"kv__k",children:"Tests rejected as confounded"}),g.jsx("span",{className:"kv__v",children:f})]}),g.jsxs("div",{className:"kv",children:[g.jsx("span",{className:"kv__k",children:"Intervention magnitude"}),g.jsxs("span",{className:"kv__v",children:["do(Δz = +",Oe(i==null?void 0:i.delta_z,0)," m)"]})]})]})]})]})}function _0({telemetry:t}){const e=t==null?void 0:t.gnn;if(!e)return null;const n=e.connectivity_before??0,i=e.connectivity_after??0,r=e.connectivity_gnn_only??0,s=i-n;return g.jsxs("div",{className:"panel",children:[g.jsxs("div",{className:"panel__head",children:[g.jsx("span",{className:"panel__title",children:"Relay Topology — E(3) GNN"}),g.jsx("span",{className:`panel__badge ${e.model_trained?"ok":"bad"}`,children:e.model_trained?"TRAINED":"UNTRAINED"})]}),g.jsxs("div",{className:"panel__body",children:[g.jsxs("div",{className:"kv",children:[g.jsx("span",{className:"kv__k",children:"Backhaul connectivity, before"}),g.jsxs("span",{className:"kv__v",children:[Oe(n*100,1),"%"]})]}),g.jsxs("div",{className:"kv",children:[g.jsx("span",{className:"kv__k",children:"After GNN proposal"}),g.jsxs("span",{className:"kv__v",children:[Oe(r*100,1),"%"]})]}),g.jsxs("div",{className:"kv",children:[g.jsx("span",{className:"kv__k",children:"After gradient refinement"}),g.jsxs("span",{className:"kv__v",style:{color:s>.001?"var(--nominal)":"inherit"},children:[Oe(i*100,1),"%"]})]}),g.jsxs("div",{className:"kv",children:[g.jsx("span",{className:"kv__k",children:"Solve time (propose + refine)"}),g.jsxs("span",{className:"kv__v",children:[Oe(e.propose_ms,1)," + ",Oe(e.refine_ms,1)," ms"]})]}),g.jsxs("div",{className:"kv",children:[g.jsx("span",{className:"kv__k",children:"Optimisations run"}),g.jsx("span",{className:"kv__v",children:e.optimization_count??0})]}),g.jsx("div",{style:{fontSize:10.5,color:"var(--ink-3)",marginTop:9,lineHeight:1.5},children:"The network proposes relay positions in one equivariant forward pass; a short gradient refinement then polishes them against the terrain actually under the swarm. Both figures are shown so the contribution of each is visible."})]})]})}function v0({telemetry:t}){var a;const e=(t==null?void 0:t.metrics)||{},n=(t==null?void 0:t.demo)||{},i=((a=t==null?void 0:t.charts)==null?void 0:a.control)||[],r=n.controller||"—",s=n.shadow||(/LTC/i.test(r)?"PID":"LTC");return g.jsxs("div",{className:"panel",children:[g.jsxs("div",{className:"panel__head",children:[g.jsx("span",{className:"panel__title",children:"Flight Control"}),g.jsx("span",{className:"panel__badge ok",children:r})]}),g.jsxs("div",{className:"panel__body",children:[g.jsx(x0,{series:i,keys:[{key:"active",color:"#1549c9"},{key:"shadow",color:"#a45a06"}]}),g.jsxs("div",{className:"chart-legend",children:[g.jsxs("span",{children:[g.jsx("i",{style:{background:"#1549c9"}}),r," tracking error (m)"]}),g.jsxs("span",{children:[g.jsx("i",{style:{background:"#a45a06"}}),s," divergence (m/s²)"]})]}),g.jsxs("div",{style:{marginTop:9},children:[g.jsxs("div",{className:"kv",children:[g.jsx("span",{className:"kv__k",children:"Tracking error (live)"}),g.jsxs("span",{className:"kv__v",children:[Oe(e.tracking_error_m,2)," m"]})]}),g.jsxs("div",{className:"kv",children:[g.jsxs("span",{className:"kv__k",children:[s," shadow divergence"]}),g.jsxs("span",{className:"kv__v",children:[Oe(e.shadow_divergence_ms2,2)," m/s²"]})]})]}),g.jsxs("div",{style:{marginTop:10,padding:9,borderRadius:6,background:"var(--caution-bg)",border:"1px solid #f4dcbb",fontSize:10.5,color:"#7d4405",lineHeight:1.5},children:[g.jsx("b",{style:{display:"block",marginBottom:3},children:"Benchmark result: PID selected over LTC"}),"The Liquid Time-Constant controller is implemented and trained (12.8k params), but on paired gust trials the cascaded PID held track closer — 0.18 m vs 0.62 m cross-track RMS in distribution, and 1.55 m vs 1.99 m on gusts beyond the LTC's training envelope — at under half the control effort. The system therefore flies PID by default. Run ",g.jsx("code",{children:"--controller ltc"})," to fly the LTC instead; whichever is not flying runs in shadow on the identical gust."]})]})]})}function x0({series:t,keys:e,height:n=76,yMax:i=null}){if(!t||t.length<2)return g.jsx("div",{className:"empty",style:{height:n},children:"Collecting data…"});const r=360,s=4,a=t.flatMap(c=>e.map(u=>c[u.key]??0)),o=i??Math.max(...a,.001)*1.15,l=c=>t.map((u,f)=>{const h=s+f/(t.length-1)*(r-s*2),p=n-s-(u[c]??0)/o*(n-s*2);return`${f===0?"M":"L"}${h.toFixed(1)},${p.toFixed(1)}`}).join(" ");return g.jsxs("svg",{className:"chart",viewBox:`0 0 ${r} ${n}`,preserveAspectRatio:"none",children:[[.25,.5,.75].map(c=>g.jsx("line",{x1:s,x2:r-s,y1:n*c,y2:n*c,stroke:"var(--border)",strokeWidth:"1"},c)),e.map(c=>g.jsx("path",{d:l(c.key),fill:"none",stroke:c.color,strokeWidth:"1.8",strokeLinejoin:"round",vectorEffect:"non-scaling-stroke"},c.key))]})}function y0({telemetry:t}){const e=(t==null?void 0:t.charts)||{},i=(((t==null?void 0:t.metrics)||{}).backhaul_pdr??0)*100,r=(e.backhaul||[]).map((s,a)=>{var o,l;return{backhaul:s.value,swarm:((l=(o=e.pdr)==null?void 0:o[a])==null?void 0:l.value)??0}});return g.jsxs("div",{className:"panel",children:[g.jsxs("div",{className:"panel__head",children:[g.jsx("span",{className:"panel__title",children:"Link Health"}),g.jsxs("span",{className:`panel__badge ${i>92?"ok":i>70?"warn":"bad"}`,children:[Oe(i,1),"% BACKHAUL"]})]}),g.jsxs("div",{className:"panel__body",children:[g.jsx(x0,{series:r,keys:[{key:"backhaul",color:"#0b7a52"},{key:"swarm",color:"#7b8aa1"}],yMax:1.05}),g.jsxs("div",{className:"chart-legend",children:[g.jsxs("span",{children:[g.jsx("i",{style:{background:"#0b7a52"}}),"Scout → ground station"]}),g.jsxs("span",{children:[g.jsx("i",{style:{background:"#7b8aa1"}}),"Mean of all links"]})]}),g.jsx("div",{style:{fontSize:10.5,color:"var(--ink-3)",marginTop:8,lineHeight:1.5},children:"Backhaul is the operational number: whether each scout's data can actually reach the ground station over the best multi-hop path. A healthy all-links average can still hide one cut-off scout."})]})]})}function S0({telemetry:t}){var a;const e=t==null?void 0:t.cluster;if(!(e!=null&&e.self))return null;const n=[e.self,...e.peers||[]],i=((a=t==null?void 0:t.served_by)==null?void 0:a.node_id)??e.self.node_id,r=e.ownership||{},s={gnn_topology:"Relay optimisation",scm_causal:"Causal diagnostics",rag_sitrep:"SITREP synthesis"};return g.jsxs("div",{className:"panel",children:[g.jsxs("div",{className:"panel__head",children:[g.jsx("span",{className:"panel__title",children:"Cluster"}),g.jsxs("span",{className:"panel__badge",children:[n.length," NODE",n.length===1?"":"S"]})]}),g.jsxs("div",{className:"panel__body tight",children:[n.map(o=>g.jsxs("div",{className:`node ${o.node_id===i?"self":""} ${o.online?"":"offline"}`,children:[g.jsx("span",{className:"node__dot"}),g.jsxs("div",{children:[g.jsxs("div",{className:"node__call",children:[o.callsign,o.node_id===i&&g.jsx("span",{style:{color:"var(--ink-3)",fontWeight:500},children:" · this screen"})]}),g.jsx("div",{className:"node__desc",children:o.description||o.role})]}),g.jsx("div",{className:"node__addr",children:o.address})]},o.node_id)),g.jsx("div",{style:{marginTop:9},children:Object.entries(r).map(([o,l])=>g.jsxs("div",{className:"kv",children:[g.jsx("span",{className:"kv__k",children:s[o]||o}),g.jsx("span",{className:"kv__v",children:l.callsign})]},o))}),g.jsx("div",{style:{fontSize:10,color:"var(--ink-3)",marginTop:8,lineHeight:1.5},children:"Open any node's address on this network to see the same mission. If an edge node drops, its work returns to the simulation host automatically."})]})]})}const ub=(t="")=>/KILL|JAM|FAULT|DEGRADE|ALERT|OUTAGE|PACKET_LOSS|LINK_FAILURE|NEW_TASK|DATA_LOST/i.test(t)?"alert":/COMPLETE|RESTORE|ELECTION|SURVEY|LANDED|DELIVERED|READY|HANDOVER/i.test(t)?"ok":/INTERVENTION|RTH|REASSIGN|PREEMPT|REALLOCATION|INTERFERENCE/i.test(t)?"warn":"info";function M0({telemetry:t}){const e=[...(t==null?void 0:t.events)||[]].reverse();return g.jsxs("div",{className:"panel",children:[g.jsxs("div",{className:"panel__head",children:[g.jsx("span",{className:"panel__title",children:"Mission Log"}),g.jsx("span",{className:"panel__badge",children:e.length})]}),g.jsx("div",{className:"panel__body tight",children:g.jsxs("div",{className:"log",children:[e.length===0&&g.jsx("div",{className:"empty",children:"No events yet."}),e.map((n,i)=>g.jsxs("div",{className:"log__row",children:[g.jsxs("span",{className:"log__time",children:["T+",Oe(n.time,0)]}),g.jsxs("span",{className:"log__msg",children:[g.jsx("span",{className:`log__type ${ub(n.type)}`,children:(n.type||"info").replace(/_/g," ")}),n.message]})]},`${n.time}-${i}`))]})})]})}function db(t){const e=(t.citations||[]).map(a=>`  [${a.index}] ${String(a.class).toUpperCase()} — ${(a.confidence*100).toFixed(0)}% confidence, ${a.drone_id}, T+${Number(a.timestamp).toFixed(1)}s`).join(`
`),n=`${t.text}

EVIDENCE LOG
${e||"  (none)"}
`,i=new Blob([n],{type:"text/plain"}),r=URL.createObjectURL(i),s=document.createElement("a");s.href=r,s.download=`${t.sitrep_id||"SITREP"}.txt`,document.body.appendChild(s),s.click(),s.remove(),setTimeout(()=>URL.revokeObjectURL(r),1e3)}function E0({telemetry:t}){const e=t==null?void 0:t.sitrep,n=e==null?void 0:e.latest;return g.jsxs("div",{className:"panel",children:[g.jsxs("div",{className:"panel__head",children:[g.jsx("span",{className:"panel__title",children:"Situation Report"}),g.jsx("span",{className:"panel__badge",children:n?`${Oe(n.generation_time_ms,0)} ms`:"PENDING"})]}),g.jsx("div",{className:"panel__body",children:n?g.jsxs(g.Fragment,{children:[g.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7,fontSize:11},children:[g.jsx("b",{style:{fontFamily:"var(--mono)"},children:n.sitrep_id}),g.jsx("button",{className:"btn",style:{padding:"4px 10px",fontSize:10.5},onClick:()=>db(n),children:"Download"})]}),g.jsx("div",{className:"sitrep",children:n.text})]}):g.jsxs("div",{className:"empty",children:["No report yet. Press ",g.jsx("b",{children:"Generate SITREP"})," (Operator Control → Weather & mission) to synthesise one from on-board detections."]})})]})}function hb({run:t,onReset:e}){const n=(i,r={})=>t("inject",{kind:i,...r});return g.jsxs("div",{className:"panel",children:[g.jsx("div",{className:"panel__head",children:g.jsx("span",{className:"panel__title",children:"Disturbances"})}),g.jsxs("div",{className:"panel__body",children:[g.jsxs("div",{className:"controls",children:[g.jsx("button",{className:"btn danger",onClick:()=>n("uav_failure",{target:"relay"}),children:"Fail a relay"}),g.jsx("button",{className:"btn danger",onClick:()=>n("comm_outage",{target:"scout",duration:40}),children:"Scout radio out"}),g.jsx("button",{className:"btn danger",onClick:()=>n("comm_outage",{gcs:!0,duration:20}),children:"GCS outage 20 s"}),g.jsx("button",{className:"btn danger",onClick:()=>n("packet_loss",{rate:.3,duration:45}),children:"Packet loss 30%"}),g.jsx("button",{className:"btn danger",onClick:()=>n("comm_outage",{scope:"global",noise_db:14,duration:30}),children:"Degrade RF (area)"}),g.jsx("button",{className:"btn danger",onClick:()=>n("battery_fault",{target:"relay"}),children:"Relay battery fault"}),g.jsx("button",{className:"btn",onClick:()=>t("gust",{magnitude:14}),children:"Wind gust"}),g.jsx("button",{className:"btn",onClick:()=>t("inject",{kind:"restore"}),children:"Restore RF"}),g.jsx("button",{className:"btn primary wide",onClick:e,children:"Reset mission to planning"})]}),g.jsxs("div",{style:{fontSize:10.5,color:"var(--ink-3)",marginTop:8,lineHeight:1.5},children:["These are the Stage 2 disturbance types. For placed ones use Operator Control on the 3D view: ",g.jsx("b",{children:"+ Emergency"})," reports a new priority task, ",g.jsx("b",{children:"+ Interference"})," opens a communication-outage zone, and any aircraft can be failed from its card."]})]})]})}function w0({telemetry:t}){var c;const e=(t==null?void 0:t.comms)||{},i=((t==null?void 0:t.mission)||((c=t==null?void 0:t.demo)==null?void 0:c.mission)||{}).roles||{},s=Object.values((t==null?void 0:t.drones)||{}).filter(u=>u.role==="RELAY"&&u.status==="ACTIVE").length,a=u=>u==null?"—":`${Oe(u*100,1)}%`,o=[...i.recent||[]].reverse().slice(0,4),l=[["Relays flying / needed",`${s} / ${i.relays_needed??"—"}`,"terrain-aware chain from the GCS"],["Packet delivery",a(e.pdr),`telemetry ${a(e.pdr_telemetry)} · survey ${a(e.pdr_survey)}`],["Latency",`${Oe(e.latency_ms_mean,1)} ms`,`p95 ${Oe(e.latency_ms_p95,1)} ms, end to end`],["Connectivity",a(e.connectivity_availability),"airborne time with a path to the GCS"],["Downtime",`${Oe(e.downtime_s_total,1)} s`,`${e.outage_count??0} outages · longest ${Oe(e.downtime_s_longest,1)} s`],["Relay reallocations",String(e.relay_reallocations??0),`${i.flaps??0} undone within 30 s`],["Recovery time",e.recovery_time_s_mean==null?"—":`${Oe(e.recovery_time_s_mean,1)} s`,`mean over ${e.disruptions??0} disruptions`],["Data waiting in the air",String(e.backlog_chunks??0),"survey chunks in store-and-forward"]];return g.jsxs("div",{className:"panel",children:[g.jsxs("div",{className:"panel__head",children:[g.jsx("span",{className:"panel__title",children:"Communication & Roles"}),g.jsxs("span",{className:`panel__badge ${(e.connectivity_availability??1)>.95?"ok":"bad"}`,children:[a(e.connectivity_availability)," LINKED"]})]}),g.jsxs("div",{className:"panel__body",children:[l.map(([u,f,h])=>g.jsxs("div",{className:"kv",children:[g.jsxs("span",{className:"kv__k",children:[u,g.jsx("span",{style:{display:"block",fontSize:9.5,color:"var(--ink-3)",opacity:.8},children:h})]}),g.jsx("span",{className:"kv__v",style:{alignSelf:"center"},children:f})]},u)),o.length>0&&g.jsxs("div",{style:{marginTop:8,fontSize:10.5,lineHeight:1.5},children:[g.jsx("b",{children:"Recent role changes"}),o.map(u=>g.jsxs("div",{style:{color:"var(--ink-2)"},children:["T+",Oe(u.time,0)," ",u.uav,": ",u.from.toLowerCase()," → ",u.to.toLowerCase()," — ",u.reason]},`${u.time}-${u.uav}`))]})]})]})}function T0({telemetry:t}){var h;const e=(t==null?void 0:t.metrics)||{},n=(t==null?void 0:t.comms)||{},i=(t==null?void 0:t.mission)||((h=t==null?void 0:t.demo)==null?void 0:h.mission)||{},r=i.tasks||{},s=p=>p==null?"—":Oe(p*100,1),a=i.remaining_s,o=a==null?"—":`${Math.max(0,Math.floor(a/60))}:${String(Math.max(0,Math.floor(a%60))).padStart(2,"0")}`,l=e.min_separation_ever_m??999,c=e.collisions??0,u=c+(n.geofence_violations??0)+(n.battery_depleted??0),f=[{label:"Mission clock",value:o,unit:"",tone:i.phase!=="LIVE"?"neutral":a>120?"ok":"warn",sub:i.phase==="LIVE"?"remaining of allotted time":(i.phase||"").toLowerCase()},{label:"Tasks delivered",value:`${r.delivered??0}/${r.released??0}`,unit:"",tone:r.released&&r.delivered===r.released?"ok":"info",sub:`priority-weighted ${s(i.priority_score)}%`},{label:"Packet delivery",value:s(n.pdr),unit:"%",tone:n.pdr==null?"neutral":n.pdr>.95?"ok":n.pdr>.85?"warn":"bad",sub:`latency ${Oe(n.latency_ms_mean,1)} ms`},{label:"Connectivity",value:s(n.connectivity_availability),unit:"%",tone:n.connectivity_availability==null?"neutral":n.connectivity_availability>.95?"ok":n.connectivity_availability>.85?"warn":"bad",sub:`downtime ${Oe(n.downtime_s_total,0)} s`},{label:"Recovery",value:n.recovery_time_s_mean==null?"—":Oe(n.recovery_time_s_mean,1),unit:"s",tone:n.recovery_time_s_mean==null?"neutral":n.recovery_time_s_mean<10?"ok":"warn",sub:`${n.relay_reallocations??0} relay reallocations`},{label:"Closest approach",value:l>900?"—":Oe(l,0),unit:"m",tone:l>15?"ok":l>5?"warn":"bad",sub:`${c} collisions`},{label:"Safety",value:u===0?"OK":String(u),unit:"",tone:u===0?"ok":"bad",sub:`geofence ${n.geofence_violations??0} · flat battery ${n.battery_depleted??0}`}];return g.jsx("div",{className:"metrics",children:f.map(p=>g.jsxs("div",{className:"metric",children:[g.jsx("span",{className:"metric__label",children:p.label}),g.jsxs("span",{className:`metric__value ${p.tone}`,children:[p.value,p.unit&&g.jsx("span",{className:"metric__unit",children:p.unit})]}),g.jsx("span",{className:"metric__sub",children:p.sub})]},p.label))})}function fb(){var p;const[t,e]=ye.useState(null),[n,i]=ye.useState(null);ye.useEffect(()=>{let _=!1;return fetch("/api/benchmarks").then(v=>v.json()).then(v=>{_||e(v)}).catch(()=>{_||e({available:!1})}),fetch("/api/uavx_benchmarks").then(v=>v.json()).then(v=>{_||i(v)}).catch(()=>{_||i({available:!1})}),()=>{_=!0}},[]);const r=(_,v=1,m=1,d="")=>_&&_.n?`${Oe(_.mean*v,m)} ± ${Oe(_.std*v,m)}${d}`:"—";if(!t)return null;if(!t.available)return g.jsxs("div",{className:"panel",children:[g.jsx("div",{className:"panel__head",children:g.jsx("span",{className:"panel__title",children:"Logged Evidence"})}),g.jsx("div",{className:"panel__body",children:g.jsxs("div",{className:"empty",children:["No benchmark results yet.",g.jsx("br",{}),"Run ",g.jsx("code",{children:"python -m bench.run_benchmarks"}),"."]})})]});const s=t.missions||{},a=t.topology||{},o=t.causal||{},l=t.control||{},c=s.self_heal_latency_ms||s.election_time_ms,u=n!=null&&n.available?n.aggregate||{}:null,f=(_,v=100,m=1,d="%")=>{const x=u==null?void 0:u[_];return x&&x.n?`${Oe(x.mean*v,m)} ± ${Oe(x.std*v,m)}${d}`:"—"},h=[...u?[["Mission completion",f("completion_rate"),`${n.runs??0} scenario runs`],["Priority-weighted score",f("priority_weighted_score"),"P1 = 3, P2 = 2, P3 = 1"],["Packet delivery ratio",f("packet_delivery_ratio"),"all traffic, end to end"],["Connectivity availability",f("connectivity_availability"),"airborne time linked to GCS"],["Recovery time",f("recovery_time_s_mean",1,1," s"),"per disruption"],["Collisions",f("collisions",1,1,""),"per mission"]]:[],["Self-heal, end-to-end",r(c,1,0," ms"),"relay failover · target < 300 ms"],["Relay gain over naive",r(a.improvement_over_naive,100,1," pts"),"GNN placement, held-out terrain"],["Causal: interference ruled out",o.jamming_recall!=null?`${Oe(o.jamming_recall*100,0)}%`:"—",'no false "terrain"'],["Causal: terrain confirmed",o.terrain_recall!=null?`${Oe(o.terrain_recall*100,0)}%`:"—","single-node probe"]];return g.jsxs("div",{className:"panel",children:[g.jsxs("div",{className:"panel__head",children:[g.jsx("span",{className:"panel__title",children:"Logged Evidence"}),g.jsx("span",{className:"panel__badge",children:t.quick_mode?"QUICK RUN":"FULL RUN"})]}),g.jsxs("div",{className:"panel__body",children:[h.map(([_,v,m])=>g.jsxs("div",{className:"kv",children:[g.jsxs("span",{className:"kv__k",children:[_,g.jsx("span",{style:{display:"block",fontSize:9.5,color:"var(--ink-3)",opacity:.8},children:m})]}),g.jsx("span",{className:"kv__v",style:{alignSelf:"center"},children:v})]},_)),l.LTC&&g.jsxs("div",{className:"kv",children:[g.jsxs("span",{className:"kv__k",children:["Cross-track RMS, LTC vs PID",g.jsxs("span",{style:{display:"block",fontSize:9.5,color:"var(--ink-3)"},children:["paired gusts · LTC better in ",(p=l.paired_improvement)==null?void 0:p.rms_ltc_better_in,"/",l.trials]})]}),g.jsxs("span",{className:"kv__v",style:{alignSelf:"center"},children:[Oe(l.LTC.cross_track_rms_m_mean,2)," / ",Oe(l.PID.cross_track_rms_m_mean,2)," m"]})]}),g.jsxs("div",{style:{fontSize:10,color:"var(--ink-3)",marginTop:8,lineHeight:1.5},children:["Mean ± standard deviation over repeated randomised runs. Mission figures:"," ",g.jsx("code",{children:"python -m bench.uavx_suite"})," (",(n==null?void 0:n.generated_at)||"not run","); component figures: ",g.jsx("code",{children:"models/benchmarks.json"}),"."]})]})]})}const It=(t,e=0)=>t==null||Number.isNaN(t)?"—":Number(t).toFixed(e),cl=(t,e=0)=>t==null?"—":`${It(t*100,e)}%`,pb=t=>{const e=Math.max(0,Math.floor(t||0));return`${String(Math.floor(e/60)).padStart(2,"0")}:${String(e%60).padStart(2,"0")}`};function mb({telemetry:t,run:e}){var f,h,p,_,v,m,d,x;const n=(t==null?void 0:t.mission)||((f=t==null?void 0:t.demo)==null?void 0:f.mission)||{},i=(t==null?void 0:t.comms)||{},r=(t==null?void 0:t.metrics)||{},s=n.phase==="LIVE",a=n.phase==="PLANNING",o=n.phase==="COMPLETE"||n.phase==="ABORTED",l=(h=t==null?void 0:t.demo)==null?void 0:h.theatre,c=n.tasks||{},u=n.summary;return g.jsxs("section",{className:`base-card base-mission ${s?"live":""}`,children:[g.jsxs("div",{className:"base-card__head",children:[g.jsxs("div",{children:[g.jsx("div",{className:"base-card__kicker",children:"Mission control"}),g.jsx("div",{className:"base-card__title",children:s?`LIVE · ${n.mission_id||""}`:o?`${n.phase} · ${n.mission_id||""}`:"Mission planning"})]}),g.jsx("span",{className:`base-pill ${s?"bad":o?"":"ok"}`,children:s?`${pb(n.remaining_s)} LEFT`:o?"RECOVERED":"ON PADS"})]}),g.jsxs("div",{className:"base-card__body",children:[((p=n.scenario)==null?void 0:p.name)&&g.jsx("p",{children:g.jsx("b",{children:n.scenario.name})}),a&&g.jsxs(g.Fragment,{children:[g.jsxs("p",{children:["The fleet is on its pads at the GCS outside the affected area over"," ",g.jsx("b",{children:(l==null?void 0:l.name)||"—"}),". ",c.released??0," survey task(s) are known; the relay chain needs ",g.jsx("b",{children:((_=n.roles)==null?void 0:_.relays_needed)??"—"})," relay(s) to reach them. Aircraft launch in sequence once the mission starts."]}),g.jsx("button",{className:"base-launch",onClick:()=>e("launch_mission"),children:"Launch mission ▸"})]}),(s||o)&&g.jsxs(g.Fragment,{children:[g.jsx("div",{className:"base-card__kicker",children:"Mission"}),g.jsxs("div",{className:"base-grid",children:[g.jsxs("div",{children:[g.jsx("span",{children:"Delivered"}),g.jsxs("b",{children:[c.delivered??0,"/",c.released??0]})]}),g.jsxs("div",{children:[g.jsx("span",{children:"Priority score"}),g.jsx("b",{children:cl(n.priority_score)})]}),g.jsxs("div",{children:[g.jsx("span",{children:"Airborne"}),g.jsx("b",{children:r.active_nodes??0})]}),g.jsxs("div",{children:[g.jsx("span",{children:"On pads"}),g.jsx("b",{children:r.on_pad??0})]})]}),g.jsx("div",{className:"base-card__kicker",children:"Communication"}),g.jsxs("div",{className:"base-grid",children:[g.jsxs("div",{children:[g.jsx("span",{children:"PDR"}),g.jsx("b",{children:cl(i.pdr,1)})]}),g.jsxs("div",{children:[g.jsx("span",{children:"Latency"}),g.jsxs("b",{children:[It(i.latency_ms_mean,1)," ms"]})]}),g.jsxs("div",{children:[g.jsx("span",{children:"Linked"}),g.jsx("b",{children:cl(i.connectivity_availability,1)})]}),g.jsxs("div",{children:[g.jsx("span",{children:"Downtime"}),g.jsxs("b",{children:[It(i.downtime_s_total,0)," s"]})]})]}),g.jsx("div",{className:"base-card__kicker",children:"Autonomy & safety"}),g.jsxs("div",{className:"base-grid",children:[g.jsxs("div",{children:[g.jsx("span",{children:"Reallocations"}),g.jsx("b",{children:i.relay_reallocations??0})]}),g.jsxs("div",{children:[g.jsx("span",{children:"Recovery"}),g.jsx("b",{children:i.recovery_time_s_mean==null?"—":`${It(i.recovery_time_s_mean,1)} s`})]}),g.jsxs("div",{children:[g.jsx("span",{children:"Collisions"}),g.jsx("b",{children:r.collisions??0})]}),g.jsxs("div",{children:[g.jsx("span",{children:"Geofence"}),g.jsx("b",{children:i.geofence_violations??0})]})]}),s&&g.jsx("button",{className:"base-launch base-launch--end",onClick:()=>e("end_mission"),children:"End mission and recall"})]}),o&&g.jsxs(g.Fragment,{children:[u&&g.jsxs("p",{style:{fontSize:12},children:["Completion ",cl((v=u.mission)==null?void 0:v.completion_rate)," · completion time"," ",((m=u.mission)==null?void 0:m.completion_time_s)!=null?`${It(u.mission.completion_time_s)} s`:"—"," · min separation ",It((d=u.safety)==null?void 0:d.min_separation_m,1)," m · min battery"," ",It((x=u.safety)==null?void 0:x.min_battery_pct,0),"%."]}),g.jsx("a",{className:"base-launch",href:"/api/summary",target:"_blank",rel:"noreferrer",children:"Full mission metrics (JSON)"}),g.jsx("button",{className:"base-launch",onClick:()=>e("reset_mission"),children:"Reset for another run"})]})]})]})}function gb({telemetry:t}){var c,u,f;const e=(t==null?void 0:t.injects)||{},n=((c=t==null?void 0:t.rf)==null?void 0:c.ew)||{},i=((f=(u=t==null?void 0:t.mission)==null?void 0:u.disturbances)==null?void 0:f.active)||[],r=e.cells||[],s=e.gps_denial||[],a=Object.keys(e.faults||{}),o=!e.rain_mm_h&&!r.length&&!s.length&&!a.length&&!n.active&&!i.length,l={radio:"radio failure",loss:"packet loss",global:"area-wide RF degradation",jammer:"interference zone"};return g.jsxs("section",{className:"base-card",children:[g.jsxs("div",{className:"base-card__head",children:[g.jsx("div",{className:"base-card__title",children:"Field conditions"}),g.jsx("span",{className:`base-pill ${o?"ok":"bad"}`,children:o?"NOMINAL":"DEGRADED"})]}),g.jsxs("div",{className:"base-card__body",children:[o&&g.jsx("p",{children:"No weather, interference or communication faults reported by the field."}),g.jsxs("ul",{className:"base-list",children:[i.map(h=>g.jsxs("li",{children:[g.jsx("b",{children:l[h.effect]||h.effect})," — ",h.on==="*"?"all links":h.on," ","until T+",It(h.until)]},`${h.effect}-${h.on}`)),e.rain_mm_h>0&&g.jsxs("li",{children:[g.jsxs("b",{children:["Rainfall ",It(e.rain_mm_h)," mm/h"]})," — cloud base"," ",It(e.cloud_base_agl)," m AGL, swarm flying under it · wet-antenna loss"," ",It(e.antenna_loss_db,1)," dB/aircraft, power draw"," ","+",It((e.power_factor-1)*100),"%"]}),r.map(h=>g.jsxs("li",{children:[g.jsx("b",{children:h.id})," — downdraught cell ",It(h.downdraught_ms)," m/s,"," ",It(h.radius_m)," m across"]},h.id)),s.map(h=>g.jsxs("li",{children:[g.jsx("b",{children:h.id})," — GNSS degradation, ",It(h.radius_m)," m radius",e.nav_fallback?" · swarm on terrain-relative navigation":" · solution drifting"]},h.id)),a.map(h=>g.jsxs("li",{children:[g.jsx("b",{children:h})," — equipment fault, degraded thrust"]},h)),(n.estimates||[]).map(h=>g.jsxs("li",{children:[g.jsx("b",{children:h.id})," — interference source localised at"," ","(",It(h.x),", ",It(h.y),") ± ",It(h.radius_m)," m, ≈",It(h.power_dbm)," dBm"]},h.id))]})]})]})}function _b({telemetry:t,run:e,onReset:n,onSwitch:i}){var a,o,l;const r=(t==null?void 0:t.mission)||((a=t==null?void 0:t.demo)==null?void 0:a.mission)||{},s=r.phase==="LIVE";return g.jsxs("div",{className:"base",children:[g.jsxs("header",{className:"base-bar",children:[g.jsxs("div",{children:[g.jsx("div",{className:"base-bar__title",children:"C-DAWN · GROUND CONTROL STATION"}),g.jsx("div",{className:"base-bar__sub",children:"UAV-X disaster response · swarm reporting over the mesh"})]}),g.jsxs("div",{className:"base-bar__status",children:[g.jsx("span",{className:`base-pill ${s?"bad":"ok"}`,children:s?"MISSION IN PROGRESS":r.phase||"PLANNING"}),g.jsx("span",{className:"base-bar__theatre",children:((l=(o=t==null?void 0:t.demo)==null?void 0:o.theatre)==null?void 0:l.name)||"—"}),g.jsx("button",{className:"base-reset",onClick:i,title:"Switch this screen to the operations view",children:"Operations view ▸"}),g.jsx("button",{className:"base-reset",onClick:n,children:"Reset"})]})]}),g.jsxs("div",{className:"base-body",children:[g.jsxs("div",{className:"base-col",children:[g.jsx(mb,{telemetry:t,run:e}),g.jsx(gb,{telemetry:t}),g.jsx(w0,{telemetry:t}),g.jsx(E0,{telemetry:t})]}),g.jsxs("div",{className:"base-col",children:[g.jsx("div",{className:"base-card base-card--flush",children:g.jsx(M0,{telemetry:t})}),g.jsx(m0,{telemetry:t,run:e,onSelect:()=>{},selectedId:null}),g.jsx(g0,{telemetry:t}),g.jsx(y0,{telemetry:t}),g.jsx(_0,{telemetry:t}),g.jsx(v0,{telemetry:t}),g.jsx(S0,{telemetry:t})]})]}),g.jsx(T0,{telemetry:t})]})}const fg=[{id:1,label:"Launch & Survey"},{id:2,label:"Comms Degraded"},{id:3,label:"UAV Failure"},{id:4,label:"Emergency Task"},{id:5,label:"Recharge & Handover"}];function vb({connected:t,telemetry:e,onTheatre:n,onSwitch:i}){var u,f,h,p,_,v,m,d,x;const r=((u=e==null?void 0:e.mission)==null?void 0:u.phase)==="LIVE"?((f=e==null?void 0:e.mission)==null?void 0:f.elapsed)??0:(e==null?void 0:e.sim_time)??0,s=((h=e==null?void 0:e.metrics)==null?void 0:h.current_phase)??0,a=e==null?void 0:e.cluster,o=(e==null?void 0:e.served_by)||(a==null?void 0:a.self),l=String(Math.floor(r/60)).padStart(2,"0"),c=String(Math.floor(r%60)).padStart(2,"0");return g.jsxs("header",{className:"cmdbar",children:[g.jsx("div",{className:"brand",children:g.jsxs("div",{children:[g.jsx("div",{className:"brand__name",children:"C-DAWN"}),g.jsx("div",{className:"brand__sub",children:"UAV-X · Simulation"})]})}),g.jsx("div",{className:"phases",children:fg.map((y,M)=>g.jsxs("div",{style:{display:"flex",alignItems:"center"},children:[g.jsxs("div",{className:`phase ${s>y.id?"done":s===y.id?"active":""}`,children:[g.jsx("span",{className:"phase__dot"}),g.jsx("span",{className:"phase__label",children:y.label})]}),M<fg.length-1&&g.jsx("span",{className:"phase__sep"})]},y.id))}),g.jsxs("button",{className:"theatre-btn",onClick:n,title:"Change the disaster site",children:[g.jsx("span",{className:"theatre-btn__label",children:"Disaster site"}),g.jsx("span",{className:"theatre-btn__name",children:((_=(p=e==null?void 0:e.demo)==null?void 0:p.theatre)==null?void 0:_.name)||"—"}),((m=(v=e==null?void 0:e.demo)==null?void 0:v.theatre)==null?void 0:m.lat)!=null&&g.jsxs("span",{className:"theatre-btn__coords",children:[e.demo.theatre.lat.toFixed(3),"°N ",e.demo.theatre.lon.toFixed(3),"°E"]}),g.jsx("span",{className:"theatre-btn__chev",children:"▾"})]}),g.jsxs("div",{className:"cmdbar__right",children:[g.jsx("button",{className:"view-switch",onClick:i,title:"Switch this screen to the ground base console",children:"Ground base ▸"}),o&&g.jsxs("div",{className:"cmdbar__viewing",style:{textAlign:"right"},children:[g.jsxs("div",{className:"clock__label",children:["Viewing from",o.upstream?` · sim on ${o.upstream}`:""]}),g.jsxs("div",{style:{fontSize:12,fontWeight:700},children:[o.callsign,g.jsx("span",{style:{color:"var(--ink-3)",fontWeight:500,fontFamily:"var(--mono)",fontSize:11,marginLeft:6},children:o.address})]})]}),g.jsxs("div",{style:{textAlign:"right"},children:[g.jsx("div",{className:"clock__label",children:((d=e==null?void 0:e.mission)==null?void 0:d.phase)==="LIVE"?"Mission time":((x=e==null?void 0:e.mission)==null?void 0:x.phase)||"Sim time"}),g.jsxs("div",{className:"clock",children:["T+",l,":",c]})]}),g.jsxs("div",{className:`linkstate ${t?"up":"down"}`,children:[g.jsx("span",{className:"linkstate__dot"}),t?"LIVE":"NO LINK"]})]})]})}function xb(){var z,S,w;const{data:t,connected:e,runCommand:n,lastResult:i}=aS(),[r,s]=ye.useState(null),[a,o]=ye.useState("select"),[l,c]=ye.useState(null),[u,f]=ye.useState(5),[h,p]=ye.useState({speed:7,heading:15}),[_,v]=ye.useState(null),[m,d]=ye.useState(()=>new URLSearchParams(window.location.search).get("globe")!=="0"),[x,y]=ye.useState(()=>{const N=new URLSearchParams(window.location.search).get("view");return N==="base"||N==="field"?N:localStorage.getItem("cdawn.view")||null});ye.useEffect(()=>{x&&localStorage.setItem("cdawn.view",x)},[x]),ye.useEffect(()=>{var k;if(x)return;const N=(k=t==null?void 0:t.served_by)==null?void 0:k.role;N&&y(N==="gcs"?"base":"field")},[x,(z=t==null?void 0:t.served_by)==null?void 0:z.role]);const M=ye.useCallback(N=>s(N),[]),P=ye.useCallback(()=>s(null),[]);ye.useEffect(()=>{const N=k=>{k.key==="Escape"&&o("select")};return window.addEventListener("keydown",N),()=>window.removeEventListener("keydown",N)},[]),ye.useEffect(()=>{if(!i)return;const N=i.result||{};if(!N.ok)v({bad:!0,text:N.error||"Command failed"});else if(N.drone_id&&i.name==="add_drone")v({text:`${N.drone_id} deployed`});else if(N.jammer_id&&i.name==="add_interference")v({text:`Interference ${N.jammer_id} switched on`});else if(N.poi_id&&i.name==="add_poi")v({text:`${N.poi_id} reported — priority 1`});else if(i.name==="launch_mission")v({text:"Mission launched"});else return;const k=setTimeout(()=>v(null),2600);return()=>clearTimeout(k)},[i]);const C=ye.useCallback((N,k)=>{const{x:j,y:q}=N;switch(k){case"add_scout":n("add_drone",{role:"SCOUT",x:j,y:q});break;case"add_poi":n("add_poi",{x:j,y:q,category:"trapped_survivors",priority:1});break;case"add_interference":n("add_interference",{x:j,y:q,power_dbm:u});break;case"goto":(l==null?void 0:l.kind)==="drone"&&n("goto",{drone_id:l.id,x:j,y:q}),o("select");break;default:c(null)}},[n,u,l]),A=ye.useCallback(N=>c(N),[]),b=ye.useCallback(()=>{c(null),o("select"),n("reset_mission")},[n]);return x==="base"?g.jsx(_b,{telemetry:t,run:n,onReset:b,onSwitch:()=>y("field")}):g.jsxs("div",{className:"app",children:[g.jsx(vb,{connected:e,telemetry:t,onTheatre:()=>d(!0),onSwitch:()=>y("base")}),g.jsx(lb,{open:m,onClose:()=>{d(!1),c(null)},currentId:(w=(S=t==null?void 0:t.demo)==null?void 0:S.theatre)==null?void 0:w.id,canClose:!!t}),g.jsxs("div",{className:"workspace",children:[g.jsxs("div",{className:"stage",children:[g.jsx(YA,{telemetry:t,focusDrone:r,onFocusHandled:P,tool:a,selectedId:(l==null?void 0:l.kind)==="drone"?l.id:null,onGroundClick:C,onPick:A}),g.jsx("div",{className:"overlay overlay--tl",children:g.jsx(cb,{telemetry:t})}),g.jsx("div",{className:"overlay overlay--tr",children:g.jsx(ZA,{telemetry:t,tool:a,setTool:o,selected:l,setSelected:c,run:n,jammerPower:u,setJammerPower:f,wind:h,setWind:p,onFrame:M})}),_&&g.jsx("div",{className:`toast ${_.bad?"bad":""}`,children:_.text})]}),g.jsxs("div",{className:"sidebar",children:[g.jsx(m0,{telemetry:t,selectedId:(l==null?void 0:l.kind)==="drone"?l.id:null,onSelect:N=>{c({kind:"drone",id:N}),M(N)},run:n}),g.jsx(w0,{telemetry:t}),g.jsx(g0,{telemetry:t}),g.jsx(y0,{telemetry:t}),g.jsx(_0,{telemetry:t}),g.jsx(v0,{telemetry:t}),g.jsx(S0,{telemetry:t}),g.jsx(fb,{}),g.jsx(E0,{telemetry:t}),g.jsx(M0,{telemetry:t}),g.jsx(hb,{run:n,onReset:b})]})]}),g.jsx(T0,{telemetry:t})]})}zu.createRoot(document.getElementById("root")).render(g.jsx(Y0.StrictMode,{children:g.jsx(xb,{})}));
