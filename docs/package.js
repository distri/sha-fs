(function(pkg) {
  (function() {
  var annotateSourceURL, cacheFor, circularGuard, defaultEntryPoint, fileSeparator, generateRequireFn, global, isPackage, loadModule, loadPackage, loadPath, normalizePath, rootModule, startsWith,
    __slice = [].slice;

  fileSeparator = '/';

  global = window;

  defaultEntryPoint = "main";

  circularGuard = {};

  rootModule = {
    path: ""
  };

  loadPath = function(parentModule, pkg, path) {
    var cache, localPath, module, normalizedPath;
    if (startsWith(path, '/')) {
      localPath = [];
    } else {
      localPath = parentModule.path.split(fileSeparator);
    }
    normalizedPath = normalizePath(path, localPath);
    cache = cacheFor(pkg);
    if (module = cache[normalizedPath]) {
      if (module === circularGuard) {
        throw "Circular dependency detected when requiring " + normalizedPath;
      }
    } else {
      cache[normalizedPath] = circularGuard;
      try {
        cache[normalizedPath] = module = loadModule(pkg, normalizedPath);
      } finally {
        if (cache[normalizedPath] === circularGuard) {
          delete cache[normalizedPath];
        }
      }
    }
    return module.exports;
  };

  normalizePath = function(path, base) {
    var piece, result;
    if (base == null) {
      base = [];
    }
    base = base.concat(path.split(fileSeparator));
    result = [];
    while (base.length) {
      switch (piece = base.shift()) {
        case "..":
          result.pop();
          break;
        case "":
        case ".":
          break;
        default:
          result.push(piece);
      }
    }
    return result.join(fileSeparator);
  };

  loadPackage = function(pkg) {
    var path;
    path = pkg.entryPoint || defaultEntryPoint;
    return loadPath(rootModule, pkg, path);
  };

  loadModule = function(pkg, path) {
    var args, context, dirname, file, module, program, values;
    if (!(file = pkg.distribution[path])) {
      throw "Could not find file at " + path + " in " + pkg.name;
    }
    program = annotateSourceURL(file.content, pkg, path);
    dirname = path.split(fileSeparator).slice(0, -1).join(fileSeparator);
    module = {
      path: dirname,
      exports: {}
    };
    context = {
      require: generateRequireFn(pkg, module),
      global: global,
      module: module,
      exports: module.exports,
      PACKAGE: pkg,
      __filename: path,
      __dirname: dirname
    };
    args = Object.keys(context);
    values = args.map(function(name) {
      return context[name];
    });
    Function.apply(null, __slice.call(args).concat([program])).apply(module, values);
    return module;
  };

  isPackage = function(path) {
    if (!(startsWith(path, fileSeparator) || startsWith(path, "." + fileSeparator) || startsWith(path, ".." + fileSeparator))) {
      return path.split(fileSeparator)[0];
    } else {
      return false;
    }
  };

  generateRequireFn = function(pkg, module) {
    if (module == null) {
      module = rootModule;
    }
    if (pkg.name == null) {
      pkg.name = "ROOT";
    }
    if (pkg.scopedName == null) {
      pkg.scopedName = "ROOT";
    }
    return function(path) {
      var otherPackage;
      if (isPackage(path)) {
        if (!(otherPackage = pkg.dependencies[path])) {
          throw "Package: " + path + " not found.";
        }
        if (otherPackage.name == null) {
          otherPackage.name = path;
        }
        if (otherPackage.scopedName == null) {
          otherPackage.scopedName = "" + pkg.scopedName + ":" + path;
        }
        return loadPackage(otherPackage);
      } else {
        return loadPath(module, pkg, path);
      }
    };
  };

  if (typeof exports !== "undefined" && exports !== null) {
    exports.generateFor = generateRequireFn;
  } else {
    global.Require = {
      generateFor: generateRequireFn
    };
  }

  startsWith = function(string, prefix) {
    return string.lastIndexOf(prefix, 0) === 0;
  };

  cacheFor = function(pkg) {
    if (pkg.cache) {
      return pkg.cache;
    }
    Object.defineProperty(pkg, "cache", {
      value: {}
    });
    return pkg.cache;
  };

  annotateSourceURL = function(program, pkg, path) {
    return "" + program + "\n//# sourceURL=" + pkg.scopedName + "/" + path;
  };

}).call(this);

//# sourceURL=main.coffee
  window.require = Require.generateFor(pkg);
})({
  "source": {
    "LICENSE": {
      "path": "LICENSE",
      "content": "The MIT License (MIT)\n\nCopyright (c) 2014 \n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n\n",
      "mode": "100644",
      "type": "blob"
    },
    "README.md": {
      "path": "README.md",
      "content": "sha-fs\n======\n\nSimple content addressed storage for data\n",
      "mode": "100644",
      "type": "blob"
    },
    "main.coffee.md": {
      "path": "main.coffee.md",
      "content": "SHA FS\n======\n\n    Q = require \"./lib/q\"\n    SHA1 = require \"sha1\"\n\nContet addressed filesystem.\n\nMemory Store\n------------\n\n    ObjectStore = (storage) ->\n      store: (data) ->\n        deferred = Q.defer()\n\n        SHA1 data, (sha) ->\n          storage[sha] ?= data\n\n          deferred.resolve(sha)\n\n        deferred.promise\n\n      retrieve: (sha) ->\n        if (data = storage[sha])?\n          Q(data)\n        else\n          Q.reject(\"#{sha} not found\")\n\n    MemoryStore = ->\n      ObjectStore({})\n\n    LocalStorageBackedStore = ->\n      ObjectStore(localStorage)\n\n    S3BackedStore = ->\n\n    module.exports = LocalStorageBackedStore\n\n    Interface =\n\nStore the given data returning a promise that is fulfilled by the content \naddress when the data has been persisted to the backing store.\n\n      store: (data) ->\n        \n\nReturn a promise that will be fulfilled with the data if it exits or rejected if\nnot found.\n\n      retrieve: (sha) ->\n\nWe want to be able to support multiple kinds of content addressed filesystem:\n\n- Volatile in memory store\n- LocalStorage backed store\n- S3 Backed Store\n",
      "mode": "100644"
    },
    "pixie.cson": {
      "path": "pixie.cson",
      "content": "dependencies:\n  sha1: \"distri/sha1:v0.2.0\"\n",
      "mode": "100644"
    },
    "lib/q.js": {
      "path": "lib/q.js",
      "content": "/*!\n *\n * Copyright 2009-2012 Kris Kowal under the terms of the MIT\n * license found at http://github.com/kriskowal/q/raw/master/LICENSE\n *\n * With parts by Tyler Close\n * Copyright 2007-2009 Tyler Close under the terms of the MIT X license found\n * at http://www.opensource.org/licenses/mit-license.html\n * Forked at ref_send.js version: 2009-05-11\n *\n * With parts by Mark Miller\n * Copyright (C) 2011 Google Inc.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n * http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n *\n */\n(function(a){if(typeof bootstrap===\"function\"){bootstrap(\"promise\",a)}else{if(typeof exports===\"object\"){module.exports=a()}else{if(typeof define===\"function\"&&define.amd){define(a)}else{if(typeof ses!==\"undefined\"){if(!ses.ok()){return}else{ses.makeQ=a}}else{Q=a()}}}}})(function(){var E=false;try{throw new Error()}catch(ah){E=!!ah.stack}var u=W();var j;var ad=function(){};var ai=(function(){var ap={task:void 0,next:null};var ao=ap;var ar=false;var al=void 0;var an=false;function e(){while(ap.next){ap=ap.next;var at=ap.task;ap.task=void 0;var au=ap.domain;if(au){ap.domain=void 0;au.enter()}try{at()}catch(av){if(an){if(au){au.exit()}setTimeout(e,0);if(au){au.enter()}throw av}else{setTimeout(function(){throw av},0)}}if(au){au.exit()}}ar=false}ai=function(at){ao=ao.next={task:at,domain:an&&process.domain,next:null};if(!ar){ar=true;al()}};if(typeof process!==\"undefined\"&&process.nextTick){an=true;al=function(){process.nextTick(e)}}else{if(typeof setImmediate===\"function\"){if(typeof window!==\"undefined\"){al=setImmediate.bind(window,e)}else{al=function(){setImmediate(e)}}}else{if(typeof MessageChannel!==\"undefined\"){var aq=new MessageChannel();aq.port1.onmessage=function(){al=am;aq.port1.onmessage=e;e()};var am=function(){aq.port2.postMessage(0)};al=function(){setTimeout(e,0);am()}}else{al=function(){setTimeout(e,0)}}}}return ai})();var a=Function.call;function p(e){return function(){return a.apply(e,arguments)}}var ab=p(Array.prototype.slice);var c=p(Array.prototype.reduce||function(an,am){var e=0,al=this.length;if(arguments.length===1){do{if(e in this){am=this[e++];break}if(++e>=al){throw new TypeError()}}while(1)}for(;e<al;e++){if(e in this){am=an(am,this[e],e)}}return am});var R=p(Array.prototype.indexOf||function(al){for(var e=0;e<this.length;e++){if(this[e]===al){return e}}return -1});var b=p(Array.prototype.map||function(an,al){var e=this;var am=[];c(e,function(aq,ap,ao){am.push(an.call(al,ap,ao,e))},void 0);return am});var H=Object.create||function(al){function e(){}e.prototype=al;return new e()};var A=p(Object.prototype.hasOwnProperty);var G=Object.keys||function(e){var am=[];for(var al in e){if(A(e,al)){am.push(al)}}return am};var ak=p(Object.prototype.toString);function V(e){return e===Object(e)}function w(e){return(ak(e)===\"[object StopIteration]\"||e instanceof I)}var I;if(typeof ReturnValue!==\"undefined\"){I=ReturnValue}else{I=function(e){this.value=e}}var Y=\"From previous event:\";function m(e,ao){if(E&&ao.stack&&typeof e===\"object\"&&e!==null&&e.stack&&e.stack.indexOf(Y)===-1){var am=[];for(var an=ao;!!an;an=an.source){if(an.stack){am.unshift(an.stack)}}am.unshift(e.stack);var al=am.join(\"\\n\"+Y+\"\\n\");e.stack=K(al)}}function K(an){var al=an.split(\"\\n\");var ao=[];for(var am=0;am<al.length;++am){var e=al[am];if(!g(e)&&!Z(e)&&e){ao.push(e)}}return ao.join(\"\\n\")}function Z(e){return e.indexOf(\"(module.js:\")!==-1||e.indexOf(\"(node.js:\")!==-1}function af(e){var an=/at .+ \\((.+):(\\d+):(?:\\d+)\\)$/.exec(e);if(an){return[an[1],Number(an[2])]}var am=/at ([^ ]+):(\\d+):(?:\\d+)$/.exec(e);if(am){return[am[1],Number(am[2])]}var al=/.*@(.+):(\\d+)$/.exec(e);if(al){return[al[1],Number(al[2])]}}function g(al){var am=af(al);if(!am){return false}var an=am[0];var e=am[1];return an===j&&e>=u&&e<=s}function W(){if(!E){return}try{throw new Error()}catch(ao){var al=ao.stack.split(\"\\n\");var am=al[0].indexOf(\"@\")>0?al[1]:al[2];var an=af(am);if(!an){return}j=an[0];return an[1]}}function C(am,e,al){return function(){if(typeof console!==\"undefined\"&&typeof console.warn===\"function\"){console.warn(e+\" is deprecated, use \"+al+\" instead.\",new Error(\"\").stack)}return am.apply(am,arguments)}}function l(e){if(y(e)){return e}if(M(e)){return L(e)}else{return z(e)}}l.resolve=l;l.nextTick=ai;l.longStackSupport=false;l.defer=h;function h(){var an=[],ap=[],ao;var al=H(h.prototype);var ar=H(N.prototype);ar.promiseDispatch=function(au,av,at){var e=ab(arguments);if(an){an.push(e);if(av===\"when\"&&at[1]){ap.push(at[1])}}else{ai(function(){ao.promiseDispatch.apply(ao,e)})}};ar.valueOf=function(){if(an){return ar}var e=J(ao);if(y(e)){ao=e}return e};ar.inspect=function(){if(!ao){return{state:\"pending\"}}return ao.inspect()};if(l.longStackSupport&&E){try{throw new Error()}catch(aq){ar.stack=aq.stack.substring(aq.stack.indexOf(\"\\n\")+1)}}function am(e){ao=e;ar.source=e;c(an,function(au,at){ai(function(){e.promiseDispatch.apply(e,at)})},void 0);an=void 0;ap=void 0}al.promise=ar;al.resolve=function(e){if(ao){return}am(l(e))};al.fulfill=function(e){if(ao){return}am(z(e))};al.reject=function(e){if(ao){return}am(D(e))};al.notify=function(e){if(ao){return}c(ap,function(au,at){ai(function(){at(e)})},void 0)};return al}h.prototype.makeNodeResolver=function(){var e=this;return function(al,am){if(al){e.reject(al)}else{if(arguments.length>2){e.resolve(ab(arguments,1))}else{e.resolve(am)}}}};l.Promise=T;l.promise=T;function T(am){if(typeof am!==\"function\"){throw new TypeError(\"resolver must be a function.\")}var e=h();try{am(e.resolve,e.reject,e.notify)}catch(al){e.reject(al)}return e.promise}T.race=n;T.all=x;T.reject=D;T.resolve=l;l.passByCopy=function(e){return e};N.prototype.passByCopy=function(){return this};l.join=function(e,al){return l(e).join(al)};N.prototype.join=function(e){return l([this,e]).spread(function(al,am){if(al===am){return al}else{throw new Error(\"Can't join: not the same: \"+al+\" \"+am)}})};l.race=n;function n(e){return T(function(ao,an){for(var am=0,al=e.length;am<al;am++){l(e[am]).then(ao,an)}})}N.prototype.race=function(){return this.then(l.race)};l.makePromise=N;function N(al,ao,an){if(ao===void 0){ao=function(ap){return D(new Error(\"Promise does not support operation: \"+ap))}}if(an===void 0){an=function(){return{state:\"unknown\"}}}var am=H(N.prototype);am.promiseDispatch=function(at,au,aq){var ap;try{if(al[au]){ap=al[au].apply(am,aq)}else{ap=ao.call(am,au,aq)}}catch(ar){ap=D(ar)}if(at){at(ap)}};am.inspect=an;if(an){var e=an();if(e.state===\"rejected\"){am.exception=e.reason}am.valueOf=function(){var ap=an();if(ap.state===\"pending\"||ap.state===\"rejected\"){return am}return ap.value}}return am}N.prototype.toString=function(){return\"[object Promise]\"};N.prototype.then=function(ao,ap,al){var aq=this;var ar=h();var am=false;function an(av){try{return typeof ao===\"function\"?ao(av):av}catch(au){return D(au)}}function at(au){if(typeof ap===\"function\"){m(au,aq);try{return ap(au)}catch(av){return D(av)}}return D(au)}function e(au){return typeof al===\"function\"?al(au):au}ai(function(){aq.promiseDispatch(function(au){if(am){return}am=true;ar.resolve(an(au))},\"when\",[function(au){if(am){return}am=true;ar.resolve(at(au))}])});aq.promiseDispatch(void 0,\"when\",[void 0,function(au){var aw;var ax=false;try{aw=e(au)}catch(av){ax=true;if(l.onerror){l.onerror(av)}else{throw av}}if(!ax){ar.notify(aw)}}]);return ar.promise};l.when=O;function O(am,e,al,an){return l(am).then(e,al,an)}N.prototype.thenResolve=function(e){return this.then(function(){return e})};l.thenResolve=function(al,e){return l(al).thenResolve(e)};N.prototype.thenReject=function(e){return this.then(function(){throw e})};l.thenReject=function(al,e){return l(al).thenReject(e)};l.nearer=J;function J(al){if(y(al)){var e=al.inspect();if(e.state===\"fulfilled\"){return e.value}}return al}l.isPromise=y;function y(e){return V(e)&&typeof e.promiseDispatch===\"function\"&&typeof e.inspect===\"function\"}l.isPromiseAlike=M;function M(e){return V(e)&&typeof e.then===\"function\"}l.isPending=ac;function ac(e){return y(e)&&e.inspect().state===\"pending\"}N.prototype.isPending=function(){return this.inspect().state===\"pending\"};l.isFulfilled=P;function P(e){return !y(e)||e.inspect().state===\"fulfilled\"}N.prototype.isFulfilled=function(){return this.inspect().state===\"fulfilled\"};l.isRejected=U;function U(e){return y(e)&&e.inspect().state===\"rejected\"}N.prototype.isRejected=function(){return this.inspect().state===\"rejected\"};var aa=[];var aj=[];var o=true;function ag(){aa.length=0;aj.length=0;if(!o){o=true}}function B(al,e){if(!o){return}aj.push(al);if(e&&typeof e.stack!==\"undefined\"){aa.push(e.stack)}else{aa.push(\"(no stack) \"+e)}}function k(al){if(!o){return}var e=R(aj,al);if(e!==-1){aj.splice(e,1);aa.splice(e,1)}}l.resetUnhandledRejections=ag;l.getUnhandledReasons=function(){return aa.slice()};l.stopUnhandledRejectionTracking=function(){ag();o=false};ag();l.reject=D;function D(al){var e=N({when:function(ao){if(ao){k(this)}return ao?ao(al):this}},function an(){return this},function am(){return{state:\"rejected\",reason:al}});B(e,al);return e}l.fulfill=z;function z(e){return N({when:function(){return e},get:function(am){return e[am]},set:function(am,an){e[am]=an},\"delete\":function(am){delete e[am]},post:function(an,am){if(an===null||an===void 0){return e.apply(void 0,am)}else{return e[an].apply(e,am)}},apply:function(an,am){return e.apply(an,am)},keys:function(){return G(e)}},void 0,function al(){return{state:\"fulfilled\",value:e}})}function L(al){var e=h();ai(function(){try{al.then(e.resolve,e.reject,e.notify)}catch(am){e.reject(am)}});return e.promise}l.master=v;function v(e){return N({isDef:function(){}},function al(an,am){return X(e,an,am)},function(){return l(e).inspect()})}l.spread=f;function f(am,e,al){return l(am).spread(e,al)}N.prototype.spread=function(e,al){return this.all().then(function(am){return e.apply(void 0,am)},al)};l.async=S;function S(e){return function(){function am(at,aq){var ap;if(typeof StopIteration===\"undefined\"){try{ap=an[at](aq)}catch(ar){return D(ar)}if(ap.done){return ap.value}else{return O(ap.value,ao,al)}}else{try{ap=an[at](aq)}catch(ar){if(w(ar)){return ar.value}else{return D(ar)}}return O(ap,ao,al)}}var an=e.apply(this,arguments);var ao=am.bind(am,\"next\");var al=am.bind(am,\"throw\");return ao()}}l.spawn=r;function r(e){l.done(l.async(e)())}l[\"return\"]=i;function i(e){throw new I(e)}l.promised=q;function q(e){return function(){return f([this,x(arguments)],function(al,am){return e.apply(al,am)})}}l.dispatch=X;function X(al,am,e){return l(al).dispatch(am,e)}N.prototype.dispatch=function(an,am){var al=this;var e=h();ai(function(){al.promiseDispatch(e.resolve,an,am)});return e.promise};l.get=function(e,al){return l(e).dispatch(\"get\",[al])};N.prototype.get=function(e){return this.dispatch(\"get\",[e])};l.set=function(e,al,am){return l(e).dispatch(\"set\",[al,am])};N.prototype.set=function(e,al){return this.dispatch(\"set\",[e,al])};l.del=l[\"delete\"]=function(e,al){return l(e).dispatch(\"delete\",[al])};N.prototype.del=N.prototype[\"delete\"]=function(e){return this.dispatch(\"delete\",[e])};l.mapply=l.post=function(am,al,e){return l(am).dispatch(\"post\",[al,e])};N.prototype.mapply=N.prototype.post=function(al,e){return this.dispatch(\"post\",[al,e])};l.send=l.mcall=l.invoke=function(al,e){return l(al).dispatch(\"post\",[e,ab(arguments,2)])};N.prototype.send=N.prototype.mcall=N.prototype.invoke=function(e){return this.dispatch(\"post\",[e,ab(arguments,1)])};l.fapply=function(al,e){return l(al).dispatch(\"apply\",[void 0,e])};N.prototype.fapply=function(e){return this.dispatch(\"apply\",[void 0,e])};l[\"try\"]=l.fcall=function(e){return l(e).dispatch(\"apply\",[void 0,ab(arguments,1)])};N.prototype.fcall=function(){return this.dispatch(\"apply\",[void 0,ab(arguments)])};l.fbind=function(al){var an=l(al);var e=ab(arguments,1);return function am(){return an.dispatch(\"apply\",[this,e.concat(ab(arguments))])}};N.prototype.fbind=function(){var am=this;var e=ab(arguments);return function al(){return am.dispatch(\"apply\",[this,e.concat(ab(arguments))])}};l.keys=function(e){return l(e).dispatch(\"keys\",[])};N.prototype.keys=function(){return this.dispatch(\"keys\",[])};l.all=x;function x(e){return O(e,function(an){var am=0;var al=h();c(an,function(ar,aq,ap){var ao;if(y(aq)&&(ao=aq.inspect()).state===\"fulfilled\"){an[ap]=ao.value}else{++am;O(aq,function(at){an[ap]=at;if(--am===0){al.resolve(an)}},al.reject,function(at){al.notify({index:ap,value:at})})}},void 0);if(am===0){al.resolve(an)}return al.promise})}N.prototype.all=function(){return x(this)};l.allResolved=C(d,\"allResolved\",\"allSettled\");function d(e){return O(e,function(al){al=b(al,l);return O(x(b(al,function(am){return O(am,ad,ad)})),function(){return al})})}N.prototype.allResolved=function(){return d(this)};l.allSettled=t;function t(e){return l(e).allSettled()}N.prototype.allSettled=function(){return this.then(function(e){return x(b(e,function(am){am=l(am);function al(){return am.inspect()}return am.then(al,al)}))})};l.fail=l[\"catch\"]=function(e,al){return l(e).then(void 0,al)};N.prototype.fail=N.prototype[\"catch\"]=function(e){return this.then(void 0,e)};l.progress=F;function F(e,al){return l(e).then(void 0,void 0,al)}N.prototype.progress=function(e){return this.then(void 0,void 0,e)};l.fin=l[\"finally\"]=function(e,al){return l(e)[\"finally\"](al)};N.prototype.fin=N.prototype[\"finally\"]=function(e){e=l(e);return this.then(function(al){return e.fcall().then(function(){return al})},function(al){return e.fcall().then(function(){throw al})})};l.done=function(am,e,an,al){return l(am).done(e,an,al)};N.prototype.done=function(e,an,am){var al=function(ap){ai(function(){m(ap,ao);if(l.onerror){l.onerror(ap)}else{throw ap}})};var ao=e||an||am?this.then(e,an,am):this;if(typeof process===\"object\"&&process&&process.domain){al=process.domain.bind(al)}ao.then(void 0,al)};l.timeout=function(al,e,am){return l(al).timeout(e,am)};N.prototype.timeout=function(al,am){var e=h();var an=setTimeout(function(){e.reject(new Error(am||\"Timed out after \"+al+\" ms\"))},al);this.then(function(ao){clearTimeout(an);e.resolve(ao)},function(ao){clearTimeout(an);e.reject(ao)},e.notify);return e.promise};l.delay=function(e,al){if(al===void 0){al=e;e=void 0}return l(e).delay(al)};N.prototype.delay=function(e){return this.then(function(am){var al=h();setTimeout(function(){al.resolve(am)},e);return al.promise})};l.nfapply=function(al,e){return l(al).nfapply(e)};N.prototype.nfapply=function(al){var e=h();var am=ab(al);am.push(e.makeNodeResolver());this.fapply(am).fail(e.reject);return e.promise};l.nfcall=function(al){var e=ab(arguments,1);return l(al).nfapply(e)};N.prototype.nfcall=function(){var al=ab(arguments);var e=h();al.push(e.makeNodeResolver());this.fapply(al).fail(e.reject);return e.promise};l.nfbind=l.denodeify=function(al){var e=ab(arguments,1);return function(){var an=e.concat(ab(arguments));var am=h();an.push(am.makeNodeResolver());l(al).fapply(an).fail(am.reject);return am.promise}};N.prototype.nfbind=N.prototype.denodeify=function(){var e=ab(arguments);e.unshift(this);return l.denodeify.apply(void 0,e)};l.nbind=function(am,e){var al=ab(arguments,2);return function(){var ap=al.concat(ab(arguments));var an=h();ap.push(an.makeNodeResolver());function ao(){return am.apply(e,arguments)}l(ao).fapply(ap).fail(an.reject);return an.promise}};N.prototype.nbind=function(){var e=ab(arguments,0);e.unshift(this);return l.nbind.apply(void 0,e)};l.nmapply=l.npost=function(am,al,e){return l(am).npost(al,e)};N.prototype.nmapply=N.prototype.npost=function(am,al){var an=ab(al||[]);var e=h();an.push(e.makeNodeResolver());this.dispatch(\"post\",[am,an]).fail(e.reject);return e.promise};l.nsend=l.nmcall=l.ninvoke=function(am,al){var an=ab(arguments,2);var e=h();an.push(e.makeNodeResolver());l(am).dispatch(\"post\",[al,an]).fail(e.reject);return e.promise};N.prototype.nsend=N.prototype.nmcall=N.prototype.ninvoke=function(al){var am=ab(arguments,1);var e=h();am.push(e.makeNodeResolver());this.dispatch(\"post\",[al,am]).fail(e.reject);return e.promise};l.nodeify=ae;function ae(al,e){return l(al).nodeify(e)}N.prototype.nodeify=function(e){if(e){this.then(function(al){ai(function(){e(null,al)})},function(al){ai(function(){e(al)})})}else{return this}};var s=W();return l});",
      "mode": "100644"
    },
    "test/test.coffee": {
      "path": "test/test.coffee",
      "content": "SHAFS = require \"../main\"\n\ndescribe \"FS\", ->\n  it \"Should store and retrieve\", (done) ->\n    fs = SHAFS()\n\n    fs.store(\"hello\").then (sha) ->\n      fs.retrieve(sha).then (data) ->\n        assert.equal data, \"hello\"\n        done()\n\n  it \"should not find data that is not present\", (done) ->\n    fs = SHAFS()\n    \n    fs.retrieve(\"doot\").catch (message) ->\n      done()\n",
      "mode": "100644"
    }
  },
  "distribution": {
    "main": {
      "path": "main",
      "content": "(function() {\n  var Interface, LocalStorageBackedStore, MemoryStore, ObjectStore, Q, S3BackedStore, SHA1;\n\n  Q = require(\"./lib/q\");\n\n  SHA1 = require(\"sha1\");\n\n  ObjectStore = function(storage) {\n    return {\n      store: function(data) {\n        var deferred;\n        deferred = Q.defer();\n        SHA1(data, function(sha) {\n          if (storage[sha] == null) {\n            storage[sha] = data;\n          }\n          return deferred.resolve(sha);\n        });\n        return deferred.promise;\n      },\n      retrieve: function(sha) {\n        var data;\n        if ((data = storage[sha]) != null) {\n          return Q(data);\n        } else {\n          return Q.reject(\"\" + sha + \" not found\");\n        }\n      }\n    };\n  };\n\n  MemoryStore = function() {\n    return ObjectStore({});\n  };\n\n  LocalStorageBackedStore = function() {\n    return ObjectStore(localStorage);\n  };\n\n  S3BackedStore = function() {};\n\n  module.exports = LocalStorageBackedStore;\n\n  Interface = {\n    store: function(data) {},\n    retrieve: function(sha) {}\n  };\n\n}).call(this);\n",
      "type": "blob"
    },
    "pixie": {
      "path": "pixie",
      "content": "module.exports = {\"dependencies\":{\"sha1\":\"distri/sha1:v0.2.0\"}};",
      "type": "blob"
    },
    "lib/q": {
      "path": "lib/q",
      "content": "/*!\n *\n * Copyright 2009-2012 Kris Kowal under the terms of the MIT\n * license found at http://github.com/kriskowal/q/raw/master/LICENSE\n *\n * With parts by Tyler Close\n * Copyright 2007-2009 Tyler Close under the terms of the MIT X license found\n * at http://www.opensource.org/licenses/mit-license.html\n * Forked at ref_send.js version: 2009-05-11\n *\n * With parts by Mark Miller\n * Copyright (C) 2011 Google Inc.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n * http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n *\n */\n(function(a){if(typeof bootstrap===\"function\"){bootstrap(\"promise\",a)}else{if(typeof exports===\"object\"){module.exports=a()}else{if(typeof define===\"function\"&&define.amd){define(a)}else{if(typeof ses!==\"undefined\"){if(!ses.ok()){return}else{ses.makeQ=a}}else{Q=a()}}}}})(function(){var E=false;try{throw new Error()}catch(ah){E=!!ah.stack}var u=W();var j;var ad=function(){};var ai=(function(){var ap={task:void 0,next:null};var ao=ap;var ar=false;var al=void 0;var an=false;function e(){while(ap.next){ap=ap.next;var at=ap.task;ap.task=void 0;var au=ap.domain;if(au){ap.domain=void 0;au.enter()}try{at()}catch(av){if(an){if(au){au.exit()}setTimeout(e,0);if(au){au.enter()}throw av}else{setTimeout(function(){throw av},0)}}if(au){au.exit()}}ar=false}ai=function(at){ao=ao.next={task:at,domain:an&&process.domain,next:null};if(!ar){ar=true;al()}};if(typeof process!==\"undefined\"&&process.nextTick){an=true;al=function(){process.nextTick(e)}}else{if(typeof setImmediate===\"function\"){if(typeof window!==\"undefined\"){al=setImmediate.bind(window,e)}else{al=function(){setImmediate(e)}}}else{if(typeof MessageChannel!==\"undefined\"){var aq=new MessageChannel();aq.port1.onmessage=function(){al=am;aq.port1.onmessage=e;e()};var am=function(){aq.port2.postMessage(0)};al=function(){setTimeout(e,0);am()}}else{al=function(){setTimeout(e,0)}}}}return ai})();var a=Function.call;function p(e){return function(){return a.apply(e,arguments)}}var ab=p(Array.prototype.slice);var c=p(Array.prototype.reduce||function(an,am){var e=0,al=this.length;if(arguments.length===1){do{if(e in this){am=this[e++];break}if(++e>=al){throw new TypeError()}}while(1)}for(;e<al;e++){if(e in this){am=an(am,this[e],e)}}return am});var R=p(Array.prototype.indexOf||function(al){for(var e=0;e<this.length;e++){if(this[e]===al){return e}}return -1});var b=p(Array.prototype.map||function(an,al){var e=this;var am=[];c(e,function(aq,ap,ao){am.push(an.call(al,ap,ao,e))},void 0);return am});var H=Object.create||function(al){function e(){}e.prototype=al;return new e()};var A=p(Object.prototype.hasOwnProperty);var G=Object.keys||function(e){var am=[];for(var al in e){if(A(e,al)){am.push(al)}}return am};var ak=p(Object.prototype.toString);function V(e){return e===Object(e)}function w(e){return(ak(e)===\"[object StopIteration]\"||e instanceof I)}var I;if(typeof ReturnValue!==\"undefined\"){I=ReturnValue}else{I=function(e){this.value=e}}var Y=\"From previous event:\";function m(e,ao){if(E&&ao.stack&&typeof e===\"object\"&&e!==null&&e.stack&&e.stack.indexOf(Y)===-1){var am=[];for(var an=ao;!!an;an=an.source){if(an.stack){am.unshift(an.stack)}}am.unshift(e.stack);var al=am.join(\"\\n\"+Y+\"\\n\");e.stack=K(al)}}function K(an){var al=an.split(\"\\n\");var ao=[];for(var am=0;am<al.length;++am){var e=al[am];if(!g(e)&&!Z(e)&&e){ao.push(e)}}return ao.join(\"\\n\")}function Z(e){return e.indexOf(\"(module.js:\")!==-1||e.indexOf(\"(node.js:\")!==-1}function af(e){var an=/at .+ \\((.+):(\\d+):(?:\\d+)\\)$/.exec(e);if(an){return[an[1],Number(an[2])]}var am=/at ([^ ]+):(\\d+):(?:\\d+)$/.exec(e);if(am){return[am[1],Number(am[2])]}var al=/.*@(.+):(\\d+)$/.exec(e);if(al){return[al[1],Number(al[2])]}}function g(al){var am=af(al);if(!am){return false}var an=am[0];var e=am[1];return an===j&&e>=u&&e<=s}function W(){if(!E){return}try{throw new Error()}catch(ao){var al=ao.stack.split(\"\\n\");var am=al[0].indexOf(\"@\")>0?al[1]:al[2];var an=af(am);if(!an){return}j=an[0];return an[1]}}function C(am,e,al){return function(){if(typeof console!==\"undefined\"&&typeof console.warn===\"function\"){console.warn(e+\" is deprecated, use \"+al+\" instead.\",new Error(\"\").stack)}return am.apply(am,arguments)}}function l(e){if(y(e)){return e}if(M(e)){return L(e)}else{return z(e)}}l.resolve=l;l.nextTick=ai;l.longStackSupport=false;l.defer=h;function h(){var an=[],ap=[],ao;var al=H(h.prototype);var ar=H(N.prototype);ar.promiseDispatch=function(au,av,at){var e=ab(arguments);if(an){an.push(e);if(av===\"when\"&&at[1]){ap.push(at[1])}}else{ai(function(){ao.promiseDispatch.apply(ao,e)})}};ar.valueOf=function(){if(an){return ar}var e=J(ao);if(y(e)){ao=e}return e};ar.inspect=function(){if(!ao){return{state:\"pending\"}}return ao.inspect()};if(l.longStackSupport&&E){try{throw new Error()}catch(aq){ar.stack=aq.stack.substring(aq.stack.indexOf(\"\\n\")+1)}}function am(e){ao=e;ar.source=e;c(an,function(au,at){ai(function(){e.promiseDispatch.apply(e,at)})},void 0);an=void 0;ap=void 0}al.promise=ar;al.resolve=function(e){if(ao){return}am(l(e))};al.fulfill=function(e){if(ao){return}am(z(e))};al.reject=function(e){if(ao){return}am(D(e))};al.notify=function(e){if(ao){return}c(ap,function(au,at){ai(function(){at(e)})},void 0)};return al}h.prototype.makeNodeResolver=function(){var e=this;return function(al,am){if(al){e.reject(al)}else{if(arguments.length>2){e.resolve(ab(arguments,1))}else{e.resolve(am)}}}};l.Promise=T;l.promise=T;function T(am){if(typeof am!==\"function\"){throw new TypeError(\"resolver must be a function.\")}var e=h();try{am(e.resolve,e.reject,e.notify)}catch(al){e.reject(al)}return e.promise}T.race=n;T.all=x;T.reject=D;T.resolve=l;l.passByCopy=function(e){return e};N.prototype.passByCopy=function(){return this};l.join=function(e,al){return l(e).join(al)};N.prototype.join=function(e){return l([this,e]).spread(function(al,am){if(al===am){return al}else{throw new Error(\"Can't join: not the same: \"+al+\" \"+am)}})};l.race=n;function n(e){return T(function(ao,an){for(var am=0,al=e.length;am<al;am++){l(e[am]).then(ao,an)}})}N.prototype.race=function(){return this.then(l.race)};l.makePromise=N;function N(al,ao,an){if(ao===void 0){ao=function(ap){return D(new Error(\"Promise does not support operation: \"+ap))}}if(an===void 0){an=function(){return{state:\"unknown\"}}}var am=H(N.prototype);am.promiseDispatch=function(at,au,aq){var ap;try{if(al[au]){ap=al[au].apply(am,aq)}else{ap=ao.call(am,au,aq)}}catch(ar){ap=D(ar)}if(at){at(ap)}};am.inspect=an;if(an){var e=an();if(e.state===\"rejected\"){am.exception=e.reason}am.valueOf=function(){var ap=an();if(ap.state===\"pending\"||ap.state===\"rejected\"){return am}return ap.value}}return am}N.prototype.toString=function(){return\"[object Promise]\"};N.prototype.then=function(ao,ap,al){var aq=this;var ar=h();var am=false;function an(av){try{return typeof ao===\"function\"?ao(av):av}catch(au){return D(au)}}function at(au){if(typeof ap===\"function\"){m(au,aq);try{return ap(au)}catch(av){return D(av)}}return D(au)}function e(au){return typeof al===\"function\"?al(au):au}ai(function(){aq.promiseDispatch(function(au){if(am){return}am=true;ar.resolve(an(au))},\"when\",[function(au){if(am){return}am=true;ar.resolve(at(au))}])});aq.promiseDispatch(void 0,\"when\",[void 0,function(au){var aw;var ax=false;try{aw=e(au)}catch(av){ax=true;if(l.onerror){l.onerror(av)}else{throw av}}if(!ax){ar.notify(aw)}}]);return ar.promise};l.when=O;function O(am,e,al,an){return l(am).then(e,al,an)}N.prototype.thenResolve=function(e){return this.then(function(){return e})};l.thenResolve=function(al,e){return l(al).thenResolve(e)};N.prototype.thenReject=function(e){return this.then(function(){throw e})};l.thenReject=function(al,e){return l(al).thenReject(e)};l.nearer=J;function J(al){if(y(al)){var e=al.inspect();if(e.state===\"fulfilled\"){return e.value}}return al}l.isPromise=y;function y(e){return V(e)&&typeof e.promiseDispatch===\"function\"&&typeof e.inspect===\"function\"}l.isPromiseAlike=M;function M(e){return V(e)&&typeof e.then===\"function\"}l.isPending=ac;function ac(e){return y(e)&&e.inspect().state===\"pending\"}N.prototype.isPending=function(){return this.inspect().state===\"pending\"};l.isFulfilled=P;function P(e){return !y(e)||e.inspect().state===\"fulfilled\"}N.prototype.isFulfilled=function(){return this.inspect().state===\"fulfilled\"};l.isRejected=U;function U(e){return y(e)&&e.inspect().state===\"rejected\"}N.prototype.isRejected=function(){return this.inspect().state===\"rejected\"};var aa=[];var aj=[];var o=true;function ag(){aa.length=0;aj.length=0;if(!o){o=true}}function B(al,e){if(!o){return}aj.push(al);if(e&&typeof e.stack!==\"undefined\"){aa.push(e.stack)}else{aa.push(\"(no stack) \"+e)}}function k(al){if(!o){return}var e=R(aj,al);if(e!==-1){aj.splice(e,1);aa.splice(e,1)}}l.resetUnhandledRejections=ag;l.getUnhandledReasons=function(){return aa.slice()};l.stopUnhandledRejectionTracking=function(){ag();o=false};ag();l.reject=D;function D(al){var e=N({when:function(ao){if(ao){k(this)}return ao?ao(al):this}},function an(){return this},function am(){return{state:\"rejected\",reason:al}});B(e,al);return e}l.fulfill=z;function z(e){return N({when:function(){return e},get:function(am){return e[am]},set:function(am,an){e[am]=an},\"delete\":function(am){delete e[am]},post:function(an,am){if(an===null||an===void 0){return e.apply(void 0,am)}else{return e[an].apply(e,am)}},apply:function(an,am){return e.apply(an,am)},keys:function(){return G(e)}},void 0,function al(){return{state:\"fulfilled\",value:e}})}function L(al){var e=h();ai(function(){try{al.then(e.resolve,e.reject,e.notify)}catch(am){e.reject(am)}});return e.promise}l.master=v;function v(e){return N({isDef:function(){}},function al(an,am){return X(e,an,am)},function(){return l(e).inspect()})}l.spread=f;function f(am,e,al){return l(am).spread(e,al)}N.prototype.spread=function(e,al){return this.all().then(function(am){return e.apply(void 0,am)},al)};l.async=S;function S(e){return function(){function am(at,aq){var ap;if(typeof StopIteration===\"undefined\"){try{ap=an[at](aq)}catch(ar){return D(ar)}if(ap.done){return ap.value}else{return O(ap.value,ao,al)}}else{try{ap=an[at](aq)}catch(ar){if(w(ar)){return ar.value}else{return D(ar)}}return O(ap,ao,al)}}var an=e.apply(this,arguments);var ao=am.bind(am,\"next\");var al=am.bind(am,\"throw\");return ao()}}l.spawn=r;function r(e){l.done(l.async(e)())}l[\"return\"]=i;function i(e){throw new I(e)}l.promised=q;function q(e){return function(){return f([this,x(arguments)],function(al,am){return e.apply(al,am)})}}l.dispatch=X;function X(al,am,e){return l(al).dispatch(am,e)}N.prototype.dispatch=function(an,am){var al=this;var e=h();ai(function(){al.promiseDispatch(e.resolve,an,am)});return e.promise};l.get=function(e,al){return l(e).dispatch(\"get\",[al])};N.prototype.get=function(e){return this.dispatch(\"get\",[e])};l.set=function(e,al,am){return l(e).dispatch(\"set\",[al,am])};N.prototype.set=function(e,al){return this.dispatch(\"set\",[e,al])};l.del=l[\"delete\"]=function(e,al){return l(e).dispatch(\"delete\",[al])};N.prototype.del=N.prototype[\"delete\"]=function(e){return this.dispatch(\"delete\",[e])};l.mapply=l.post=function(am,al,e){return l(am).dispatch(\"post\",[al,e])};N.prototype.mapply=N.prototype.post=function(al,e){return this.dispatch(\"post\",[al,e])};l.send=l.mcall=l.invoke=function(al,e){return l(al).dispatch(\"post\",[e,ab(arguments,2)])};N.prototype.send=N.prototype.mcall=N.prototype.invoke=function(e){return this.dispatch(\"post\",[e,ab(arguments,1)])};l.fapply=function(al,e){return l(al).dispatch(\"apply\",[void 0,e])};N.prototype.fapply=function(e){return this.dispatch(\"apply\",[void 0,e])};l[\"try\"]=l.fcall=function(e){return l(e).dispatch(\"apply\",[void 0,ab(arguments,1)])};N.prototype.fcall=function(){return this.dispatch(\"apply\",[void 0,ab(arguments)])};l.fbind=function(al){var an=l(al);var e=ab(arguments,1);return function am(){return an.dispatch(\"apply\",[this,e.concat(ab(arguments))])}};N.prototype.fbind=function(){var am=this;var e=ab(arguments);return function al(){return am.dispatch(\"apply\",[this,e.concat(ab(arguments))])}};l.keys=function(e){return l(e).dispatch(\"keys\",[])};N.prototype.keys=function(){return this.dispatch(\"keys\",[])};l.all=x;function x(e){return O(e,function(an){var am=0;var al=h();c(an,function(ar,aq,ap){var ao;if(y(aq)&&(ao=aq.inspect()).state===\"fulfilled\"){an[ap]=ao.value}else{++am;O(aq,function(at){an[ap]=at;if(--am===0){al.resolve(an)}},al.reject,function(at){al.notify({index:ap,value:at})})}},void 0);if(am===0){al.resolve(an)}return al.promise})}N.prototype.all=function(){return x(this)};l.allResolved=C(d,\"allResolved\",\"allSettled\");function d(e){return O(e,function(al){al=b(al,l);return O(x(b(al,function(am){return O(am,ad,ad)})),function(){return al})})}N.prototype.allResolved=function(){return d(this)};l.allSettled=t;function t(e){return l(e).allSettled()}N.prototype.allSettled=function(){return this.then(function(e){return x(b(e,function(am){am=l(am);function al(){return am.inspect()}return am.then(al,al)}))})};l.fail=l[\"catch\"]=function(e,al){return l(e).then(void 0,al)};N.prototype.fail=N.prototype[\"catch\"]=function(e){return this.then(void 0,e)};l.progress=F;function F(e,al){return l(e).then(void 0,void 0,al)}N.prototype.progress=function(e){return this.then(void 0,void 0,e)};l.fin=l[\"finally\"]=function(e,al){return l(e)[\"finally\"](al)};N.prototype.fin=N.prototype[\"finally\"]=function(e){e=l(e);return this.then(function(al){return e.fcall().then(function(){return al})},function(al){return e.fcall().then(function(){throw al})})};l.done=function(am,e,an,al){return l(am).done(e,an,al)};N.prototype.done=function(e,an,am){var al=function(ap){ai(function(){m(ap,ao);if(l.onerror){l.onerror(ap)}else{throw ap}})};var ao=e||an||am?this.then(e,an,am):this;if(typeof process===\"object\"&&process&&process.domain){al=process.domain.bind(al)}ao.then(void 0,al)};l.timeout=function(al,e,am){return l(al).timeout(e,am)};N.prototype.timeout=function(al,am){var e=h();var an=setTimeout(function(){e.reject(new Error(am||\"Timed out after \"+al+\" ms\"))},al);this.then(function(ao){clearTimeout(an);e.resolve(ao)},function(ao){clearTimeout(an);e.reject(ao)},e.notify);return e.promise};l.delay=function(e,al){if(al===void 0){al=e;e=void 0}return l(e).delay(al)};N.prototype.delay=function(e){return this.then(function(am){var al=h();setTimeout(function(){al.resolve(am)},e);return al.promise})};l.nfapply=function(al,e){return l(al).nfapply(e)};N.prototype.nfapply=function(al){var e=h();var am=ab(al);am.push(e.makeNodeResolver());this.fapply(am).fail(e.reject);return e.promise};l.nfcall=function(al){var e=ab(arguments,1);return l(al).nfapply(e)};N.prototype.nfcall=function(){var al=ab(arguments);var e=h();al.push(e.makeNodeResolver());this.fapply(al).fail(e.reject);return e.promise};l.nfbind=l.denodeify=function(al){var e=ab(arguments,1);return function(){var an=e.concat(ab(arguments));var am=h();an.push(am.makeNodeResolver());l(al).fapply(an).fail(am.reject);return am.promise}};N.prototype.nfbind=N.prototype.denodeify=function(){var e=ab(arguments);e.unshift(this);return l.denodeify.apply(void 0,e)};l.nbind=function(am,e){var al=ab(arguments,2);return function(){var ap=al.concat(ab(arguments));var an=h();ap.push(an.makeNodeResolver());function ao(){return am.apply(e,arguments)}l(ao).fapply(ap).fail(an.reject);return an.promise}};N.prototype.nbind=function(){var e=ab(arguments,0);e.unshift(this);return l.nbind.apply(void 0,e)};l.nmapply=l.npost=function(am,al,e){return l(am).npost(al,e)};N.prototype.nmapply=N.prototype.npost=function(am,al){var an=ab(al||[]);var e=h();an.push(e.makeNodeResolver());this.dispatch(\"post\",[am,an]).fail(e.reject);return e.promise};l.nsend=l.nmcall=l.ninvoke=function(am,al){var an=ab(arguments,2);var e=h();an.push(e.makeNodeResolver());l(am).dispatch(\"post\",[al,an]).fail(e.reject);return e.promise};N.prototype.nsend=N.prototype.nmcall=N.prototype.ninvoke=function(al){var am=ab(arguments,1);var e=h();am.push(e.makeNodeResolver());this.dispatch(\"post\",[al,am]).fail(e.reject);return e.promise};l.nodeify=ae;function ae(al,e){return l(al).nodeify(e)}N.prototype.nodeify=function(e){if(e){this.then(function(al){ai(function(){e(null,al)})},function(al){ai(function(){e(al)})})}else{return this}};var s=W();return l});",
      "type": "blob"
    },
    "test/test": {
      "path": "test/test",
      "content": "(function() {\n  var SHAFS;\n\n  SHAFS = require(\"../main\");\n\n  describe(\"FS\", function() {\n    it(\"Should store and retrieve\", function(done) {\n      var fs;\n      fs = SHAFS();\n      return fs.store(\"hello\").then(function(sha) {\n        return fs.retrieve(sha).then(function(data) {\n          assert.equal(data, \"hello\");\n          return done();\n        });\n      });\n    });\n    return it(\"should not find data that is not present\", function(done) {\n      var fs;\n      fs = SHAFS();\n      return fs.retrieve(\"doot\")[\"catch\"](function(message) {\n        return done();\n      });\n    });\n  });\n\n}).call(this);\n",
      "type": "blob"
    }
  },
  "progenitor": {
    "url": "http://www.danielx.net/editor/"
  },
  "entryPoint": "main",
  "repository": {
    "branch": "master",
    "default_branch": "master",
    "full_name": "distri/sha-fs",
    "homepage": null,
    "description": "Simple content addressed storage for data",
    "html_url": "https://github.com/distri/sha-fs",
    "url": "https://api.github.com/repos/distri/sha-fs",
    "publishBranch": "gh-pages"
  },
  "dependencies": {
    "sha1": {
      "source": {
        "LICENSE": {
          "path": "LICENSE",
          "content": "The MIT License (MIT)\n\nCopyright (c) 2014 \n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.",
          "mode": "100644",
          "type": "blob"
        },
        "README.md": {
          "path": "README.md",
          "content": "sha1\n====\n\nSHA1 JS implementation. Currently wrapping CryptoJS with a more uniform API.\n\nUsage\n-----\n\nStrings\n\n    string = \"\"\n\n    SHA1 string, (sha) ->\n      sha # \"da39a3ee5e6b4b0d3255bfef95601890afd80709\"\n\nBlobs\n\n    blob = new Blob\n\n    SHA1 blob, (sha) ->\n      sha # \"da39a3ee5e6b4b0d3255bfef95601890afd80709\"\n\nArray buffers\n\n    arrayBuffer = new ArrayBuffer\n\n    SHA1 arrayBuffer, (sha) ->\n      sha # \"da39a3ee5e6b4b0d3255bfef95601890afd80709\"\n",
          "mode": "100644",
          "type": "blob"
        },
        "lib/crypto.js": {
          "path": "lib/crypto.js",
          "content": "/*\nCryptoJS v3.1.2\ncode.google.com/p/crypto-js\n(c) 2009-2013 by Jeff Mott. All rights reserved.\ncode.google.com/p/crypto-js/wiki/License\n*/\nvar CryptoJS=CryptoJS||function(e,m){var p={},j=p.lib={},l=function(){},f=j.Base={extend:function(a){l.prototype=this;var c=new l;a&&c.mixIn(a);c.hasOwnProperty(\"init\")||(c.init=function(){c.$super.init.apply(this,arguments)});c.init.prototype=c;c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty(\"toString\")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},\nn=j.WordArray=f.extend({init:function(a,c){a=this.words=a||[];this.sigBytes=c!=m?c:4*a.length},toString:function(a){return(a||h).stringify(this)},concat:function(a){var c=this.words,q=a.words,d=this.sigBytes;a=a.sigBytes;this.clamp();if(d%4)for(var b=0;b<a;b++)c[d+b>>>2]|=(q[b>>>2]>>>24-8*(b%4)&255)<<24-8*((d+b)%4);else if(65535<q.length)for(b=0;b<a;b+=4)c[d+b>>>2]=q[b>>>2];else c.push.apply(c,q);this.sigBytes+=a;return this},clamp:function(){var a=this.words,c=this.sigBytes;a[c>>>2]&=4294967295<<\n32-8*(c%4);a.length=e.ceil(c/4)},clone:function(){var a=f.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var c=[],b=0;b<a;b+=4)c.push(4294967296*e.random()|0);return new n.init(c,a)}}),b=p.enc={},h=b.Hex={stringify:function(a){var c=a.words;a=a.sigBytes;for(var b=[],d=0;d<a;d++){var f=c[d>>>2]>>>24-8*(d%4)&255;b.push((f>>>4).toString(16));b.push((f&15).toString(16))}return b.join(\"\")},parse:function(a){for(var c=a.length,b=[],d=0;d<c;d+=2)b[d>>>3]|=parseInt(a.substr(d,\n2),16)<<24-4*(d%8);return new n.init(b,c/2)}},g=b.Latin1={stringify:function(a){var c=a.words;a=a.sigBytes;for(var b=[],d=0;d<a;d++)b.push(String.fromCharCode(c[d>>>2]>>>24-8*(d%4)&255));return b.join(\"\")},parse:function(a){for(var c=a.length,b=[],d=0;d<c;d++)b[d>>>2]|=(a.charCodeAt(d)&255)<<24-8*(d%4);return new n.init(b,c)}},r=b.Utf8={stringify:function(a){try{return decodeURIComponent(escape(g.stringify(a)))}catch(c){throw Error(\"Malformed UTF-8 data\");}},parse:function(a){return g.parse(unescape(encodeURIComponent(a)))}},\nk=j.BufferedBlockAlgorithm=f.extend({reset:function(){this._data=new n.init;this._nDataBytes=0},_append:function(a){\"string\"==typeof a&&(a=r.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var c=this._data,b=c.words,d=c.sigBytes,f=this.blockSize,h=d/(4*f),h=a?e.ceil(h):e.max((h|0)-this._minBufferSize,0);a=h*f;d=e.min(4*a,d);if(a){for(var g=0;g<a;g+=f)this._doProcessBlock(b,g);g=b.splice(0,a);c.sigBytes-=d}return new n.init(g,d)},clone:function(){var a=f.clone.call(this);\na._data=this._data.clone();return a},_minBufferSize:0});j.Hasher=k.extend({cfg:f.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){k.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(c,b){return(new a.init(b)).finalize(c)}},_createHmacHelper:function(a){return function(b,f){return(new s.HMAC.init(a,\nf)).finalize(b)}}});var s=p.algo={};return p}(Math);\n(function(){var e=CryptoJS,m=e.lib,p=m.WordArray,j=m.Hasher,l=[],m=e.algo.SHA1=j.extend({_doReset:function(){this._hash=new p.init([1732584193,4023233417,2562383102,271733878,3285377520])},_doProcessBlock:function(f,n){for(var b=this._hash.words,h=b[0],g=b[1],e=b[2],k=b[3],j=b[4],a=0;80>a;a++){if(16>a)l[a]=f[n+a]|0;else{var c=l[a-3]^l[a-8]^l[a-14]^l[a-16];l[a]=c<<1|c>>>31}c=(h<<5|h>>>27)+j+l[a];c=20>a?c+((g&e|~g&k)+1518500249):40>a?c+((g^e^k)+1859775393):60>a?c+((g&e|g&k|e&k)-1894007588):c+((g^e^\nk)-899497514);j=k;k=e;e=g<<30|g>>>2;g=h;h=c}b[0]=b[0]+h|0;b[1]=b[1]+g|0;b[2]=b[2]+e|0;b[3]=b[3]+k|0;b[4]=b[4]+j|0},_doFinalize:function(){var f=this._data,e=f.words,b=8*this._nDataBytes,h=8*f.sigBytes;e[h>>>5]|=128<<24-h%32;e[(h+64>>>9<<4)+14]=Math.floor(b/4294967296);e[(h+64>>>9<<4)+15]=b;f.sigBytes=4*e.length;this._process();return this._hash},clone:function(){var e=j.clone.call(this);e._hash=this._hash.clone();return e}});e.SHA1=j._createHelper(m);e.HmacSHA1=j._createHmacHelper(m)})();\n\n/*\nCryptoJS v3.1.2\ncode.google.com/p/crypto-js\n(c) 2009-2013 by Jeff Mott. All rights reserved.\ncode.google.com/p/crypto-js/wiki/License\n*/\n(function(){if(\"function\"==typeof ArrayBuffer){var b=CryptoJS.lib.WordArray,e=b.init;(b.init=function(a){a instanceof ArrayBuffer&&(a=new Uint8Array(a));if(a instanceof Int8Array||a instanceof Uint8ClampedArray||a instanceof Int16Array||a instanceof Uint16Array||a instanceof Int32Array||a instanceof Uint32Array||a instanceof Float32Array||a instanceof Float64Array)a=new Uint8Array(a.buffer,a.byteOffset,a.byteLength);if(a instanceof Uint8Array){for(var b=a.byteLength,d=[],c=0;c<b;c++)d[c>>>2]|=a[c]<<\n24-8*(c%4);e.call(this,d,b)}else e.apply(this,arguments)}).prototype=b}})();\n\nmodule.exports = CryptoJS;\n",
          "mode": "100644",
          "type": "blob"
        },
        "main.coffee.md": {
          "path": "main.coffee.md",
          "content": "SHA1\n====\n\nWrapping up CryptoJS SHA1 implementation to be a little nicer.\n\n    {SHA1} = CryptoJS = require(\"./lib/crypto\")\n\n    module.exports = (data, fn) ->\n      if data instanceof Blob\n        blobTypedArray data, (arrayBuffer) ->\n          fn(shaArrayBuffer(arrayBuffer))\n      else if data instanceof ArrayBuffer\n        defer ->\n          fn(shaArrayBuffer(data))\n      else\n        defer ->\n          fn(SHA1(data).toString())\n\nHelpers\n-------\n\n    defer = (fn) ->\n      setTimeout fn, 0\n\n    shaArrayBuffer = (arrayBuffer) ->\n      SHA1(CryptoJS.lib.WordArray.create(arrayBuffer)).toString()\n\n    blobTypedArray = (blob, fn) ->\n      reader = new FileReader()\n    \n      reader.onloadend = ->\n        fn(reader.result)\n    \n      reader.readAsArrayBuffer(blob)\n",
          "mode": "100644",
          "type": "blob"
        },
        "pixie.cson": {
          "path": "pixie.cson",
          "content": "version: \"0.2.0\"\n",
          "mode": "100644",
          "type": "blob"
        },
        "test/sha1.coffee": {
          "path": "test/sha1.coffee",
          "content": "SHA1 = require \"../main\"\n\ndescribe \"SHA1\", ->\n  it \"should hash stuff\", (done) ->\n    SHA1 \"\", (sha) ->\n      assert.equal sha, \"da39a3ee5e6b4b0d3255bfef95601890afd80709\"\n      done()\n\n  it \"should hash blobs\", (done) ->\n    blob = new Blob\n\n    SHA1 blob, (sha) ->\n      assert.equal sha, \"da39a3ee5e6b4b0d3255bfef95601890afd80709\"\n      done()\n\n  it \"should hash array buffers\", (done) ->\n    arrayBuffer = new ArrayBuffer\n\n    SHA1 arrayBuffer, (sha) ->\n      assert.equal sha, \"da39a3ee5e6b4b0d3255bfef95601890afd80709\"\n      done()\n",
          "mode": "100644",
          "type": "blob"
        }
      },
      "distribution": {
        "lib/crypto": {
          "path": "lib/crypto",
          "content": "/*\nCryptoJS v3.1.2\ncode.google.com/p/crypto-js\n(c) 2009-2013 by Jeff Mott. All rights reserved.\ncode.google.com/p/crypto-js/wiki/License\n*/\nvar CryptoJS=CryptoJS||function(e,m){var p={},j=p.lib={},l=function(){},f=j.Base={extend:function(a){l.prototype=this;var c=new l;a&&c.mixIn(a);c.hasOwnProperty(\"init\")||(c.init=function(){c.$super.init.apply(this,arguments)});c.init.prototype=c;c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty(\"toString\")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},\nn=j.WordArray=f.extend({init:function(a,c){a=this.words=a||[];this.sigBytes=c!=m?c:4*a.length},toString:function(a){return(a||h).stringify(this)},concat:function(a){var c=this.words,q=a.words,d=this.sigBytes;a=a.sigBytes;this.clamp();if(d%4)for(var b=0;b<a;b++)c[d+b>>>2]|=(q[b>>>2]>>>24-8*(b%4)&255)<<24-8*((d+b)%4);else if(65535<q.length)for(b=0;b<a;b+=4)c[d+b>>>2]=q[b>>>2];else c.push.apply(c,q);this.sigBytes+=a;return this},clamp:function(){var a=this.words,c=this.sigBytes;a[c>>>2]&=4294967295<<\n32-8*(c%4);a.length=e.ceil(c/4)},clone:function(){var a=f.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var c=[],b=0;b<a;b+=4)c.push(4294967296*e.random()|0);return new n.init(c,a)}}),b=p.enc={},h=b.Hex={stringify:function(a){var c=a.words;a=a.sigBytes;for(var b=[],d=0;d<a;d++){var f=c[d>>>2]>>>24-8*(d%4)&255;b.push((f>>>4).toString(16));b.push((f&15).toString(16))}return b.join(\"\")},parse:function(a){for(var c=a.length,b=[],d=0;d<c;d+=2)b[d>>>3]|=parseInt(a.substr(d,\n2),16)<<24-4*(d%8);return new n.init(b,c/2)}},g=b.Latin1={stringify:function(a){var c=a.words;a=a.sigBytes;for(var b=[],d=0;d<a;d++)b.push(String.fromCharCode(c[d>>>2]>>>24-8*(d%4)&255));return b.join(\"\")},parse:function(a){for(var c=a.length,b=[],d=0;d<c;d++)b[d>>>2]|=(a.charCodeAt(d)&255)<<24-8*(d%4);return new n.init(b,c)}},r=b.Utf8={stringify:function(a){try{return decodeURIComponent(escape(g.stringify(a)))}catch(c){throw Error(\"Malformed UTF-8 data\");}},parse:function(a){return g.parse(unescape(encodeURIComponent(a)))}},\nk=j.BufferedBlockAlgorithm=f.extend({reset:function(){this._data=new n.init;this._nDataBytes=0},_append:function(a){\"string\"==typeof a&&(a=r.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var c=this._data,b=c.words,d=c.sigBytes,f=this.blockSize,h=d/(4*f),h=a?e.ceil(h):e.max((h|0)-this._minBufferSize,0);a=h*f;d=e.min(4*a,d);if(a){for(var g=0;g<a;g+=f)this._doProcessBlock(b,g);g=b.splice(0,a);c.sigBytes-=d}return new n.init(g,d)},clone:function(){var a=f.clone.call(this);\na._data=this._data.clone();return a},_minBufferSize:0});j.Hasher=k.extend({cfg:f.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){k.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(c,b){return(new a.init(b)).finalize(c)}},_createHmacHelper:function(a){return function(b,f){return(new s.HMAC.init(a,\nf)).finalize(b)}}});var s=p.algo={};return p}(Math);\n(function(){var e=CryptoJS,m=e.lib,p=m.WordArray,j=m.Hasher,l=[],m=e.algo.SHA1=j.extend({_doReset:function(){this._hash=new p.init([1732584193,4023233417,2562383102,271733878,3285377520])},_doProcessBlock:function(f,n){for(var b=this._hash.words,h=b[0],g=b[1],e=b[2],k=b[3],j=b[4],a=0;80>a;a++){if(16>a)l[a]=f[n+a]|0;else{var c=l[a-3]^l[a-8]^l[a-14]^l[a-16];l[a]=c<<1|c>>>31}c=(h<<5|h>>>27)+j+l[a];c=20>a?c+((g&e|~g&k)+1518500249):40>a?c+((g^e^k)+1859775393):60>a?c+((g&e|g&k|e&k)-1894007588):c+((g^e^\nk)-899497514);j=k;k=e;e=g<<30|g>>>2;g=h;h=c}b[0]=b[0]+h|0;b[1]=b[1]+g|0;b[2]=b[2]+e|0;b[3]=b[3]+k|0;b[4]=b[4]+j|0},_doFinalize:function(){var f=this._data,e=f.words,b=8*this._nDataBytes,h=8*f.sigBytes;e[h>>>5]|=128<<24-h%32;e[(h+64>>>9<<4)+14]=Math.floor(b/4294967296);e[(h+64>>>9<<4)+15]=b;f.sigBytes=4*e.length;this._process();return this._hash},clone:function(){var e=j.clone.call(this);e._hash=this._hash.clone();return e}});e.SHA1=j._createHelper(m);e.HmacSHA1=j._createHmacHelper(m)})();\n\n/*\nCryptoJS v3.1.2\ncode.google.com/p/crypto-js\n(c) 2009-2013 by Jeff Mott. All rights reserved.\ncode.google.com/p/crypto-js/wiki/License\n*/\n(function(){if(\"function\"==typeof ArrayBuffer){var b=CryptoJS.lib.WordArray,e=b.init;(b.init=function(a){a instanceof ArrayBuffer&&(a=new Uint8Array(a));if(a instanceof Int8Array||a instanceof Uint8ClampedArray||a instanceof Int16Array||a instanceof Uint16Array||a instanceof Int32Array||a instanceof Uint32Array||a instanceof Float32Array||a instanceof Float64Array)a=new Uint8Array(a.buffer,a.byteOffset,a.byteLength);if(a instanceof Uint8Array){for(var b=a.byteLength,d=[],c=0;c<b;c++)d[c>>>2]|=a[c]<<\n24-8*(c%4);e.call(this,d,b)}else e.apply(this,arguments)}).prototype=b}})();\n\nmodule.exports = CryptoJS;\n",
          "type": "blob"
        },
        "main": {
          "path": "main",
          "content": "(function() {\n  var CryptoJS, SHA1, blobTypedArray, defer, shaArrayBuffer;\n\n  SHA1 = (CryptoJS = require(\"./lib/crypto\")).SHA1;\n\n  module.exports = function(data, fn) {\n    if (data instanceof Blob) {\n      return blobTypedArray(data, function(arrayBuffer) {\n        return fn(shaArrayBuffer(arrayBuffer));\n      });\n    } else if (data instanceof ArrayBuffer) {\n      return defer(function() {\n        return fn(shaArrayBuffer(data));\n      });\n    } else {\n      return defer(function() {\n        return fn(SHA1(data).toString());\n      });\n    }\n  };\n\n  defer = function(fn) {\n    return setTimeout(fn, 0);\n  };\n\n  shaArrayBuffer = function(arrayBuffer) {\n    return SHA1(CryptoJS.lib.WordArray.create(arrayBuffer)).toString();\n  };\n\n  blobTypedArray = function(blob, fn) {\n    var reader;\n    reader = new FileReader();\n    reader.onloadend = function() {\n      return fn(reader.result);\n    };\n    return reader.readAsArrayBuffer(blob);\n  };\n\n}).call(this);\n",
          "type": "blob"
        },
        "pixie": {
          "path": "pixie",
          "content": "module.exports = {\"version\":\"0.2.0\"};",
          "type": "blob"
        },
        "test/sha1": {
          "path": "test/sha1",
          "content": "(function() {\n  var SHA1;\n\n  SHA1 = require(\"../main\");\n\n  describe(\"SHA1\", function() {\n    it(\"should hash stuff\", function(done) {\n      return SHA1(\"\", function(sha) {\n        assert.equal(sha, \"da39a3ee5e6b4b0d3255bfef95601890afd80709\");\n        return done();\n      });\n    });\n    it(\"should hash blobs\", function(done) {\n      var blob;\n      blob = new Blob;\n      return SHA1(blob, function(sha) {\n        assert.equal(sha, \"da39a3ee5e6b4b0d3255bfef95601890afd80709\");\n        return done();\n      });\n    });\n    return it(\"should hash array buffers\", function(done) {\n      var arrayBuffer;\n      arrayBuffer = new ArrayBuffer;\n      return SHA1(arrayBuffer, function(sha) {\n        assert.equal(sha, \"da39a3ee5e6b4b0d3255bfef95601890afd80709\");\n        return done();\n      });\n    });\n  });\n\n}).call(this);\n",
          "type": "blob"
        }
      },
      "progenitor": {
        "url": "http://www.danielx.net/editor/"
      },
      "version": "0.2.0",
      "entryPoint": "main",
      "repository": {
        "branch": "v0.2.0",
        "default_branch": "master",
        "full_name": "distri/sha1",
        "homepage": null,
        "description": "SHA1 JS implementation",
        "html_url": "https://github.com/distri/sha1",
        "url": "https://api.github.com/repos/distri/sha1",
        "publishBranch": "gh-pages"
      },
      "dependencies": {}
    }
  }
});