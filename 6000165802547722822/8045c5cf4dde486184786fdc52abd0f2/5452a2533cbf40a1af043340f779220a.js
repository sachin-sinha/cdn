/*!!
 * Matomo - free/libre analytics platform
 *
 * Matomo Tag Manager
 *
 * @link https://matomo.org
 * @source https://github.com/matomo-org/tag-manager/blob/master/js/piwik.js
 * @license https://matomo.org/free-software/bsd/ BSD-3 Clause (also in js/LICENSE.txt)
 */
(function () {
  var b = document;
  var a = window;
  /*!!! previewModeHook */
  if (typeof window.MatomoTagManager !== "object") {
    if (typeof window._mtm !== "object") {
      window._mtm = [];
    }
    window.MatomoTagManager = (function () {
      var k = new Date().getTime();
      function j() {
        if (window.mtmPreviewWindow && "object" === typeof window.mtmPreviewWindow.mtmLogs) {
          var G = new Date();
          var I = [];
          for (var H = 0; H < arguments.length; H++) {
            I.push(
              JSON.stringify(arguments[H], function (i, J) {
                if (typeof J === "object" && J instanceof Node) {
                  return J.nodeName;
                } else {
                  return J;
                }
              })
            );
          }
          window.mtmPreviewWindow.mtmLogs.push({ time: G.toLocaleTimeString() + "." + G.getMilliseconds(), messages: I });
        }
      }
      function d(G) {
        if (window.mtmPreviewWindow && "object" === typeof window.mtmPreviewWindow.mtmEvents && G) {
          var i = new Date();
          G.time = i.toLocaleTimeString() + "." + i.getMilliseconds();
          window.mtmPreviewWindow.mtmEvents.push(G);
        }
      }
      var y = {
        enabled: !!window.mtmPreviewWindow,
        log: function () {
          j.apply(a, arguments);
          if (this.enabled && "undefined" !== typeof console && console && console.debug) {
            console.debug.apply(console, arguments);
          }
        },
        error: function () {
          j.apply(a, arguments);
          if ("undefined" !== typeof console && console && console.error) {
            console.error.apply(console, arguments);
          }
        },
      };
      function C(i) {
        y.error(i);
        if (typeof l !== "object" || l.THROW_ERRORS) {
          throw new Error(i);
        }
      }
      function u(H, J) {
        if (B.isString(H) && H.indexOf(".") !== -1) {
          var I = H.split(".");
          var G;
          for (G = 0; G < I.length; G++) {
            if (I[G] in J) {
              J = J[I[G]];
            } else {
              return;
            }
          }
          return J;
        }
      }
      function F(K) {
        var J = "mtm:";
        var G = {};
        function I(N) {
          return K in a && B.isObject(a[K]);
        }
        function M(N) {
          return I() && B.isFunction(a[K][N]);
        }
        function L(P, N) {
          if (M("setItem")) {
            try {
              a[K].setItem(J + P, JSON.stringify(N));
            } catch (O) { }
          } else {
            G[P] = N;
          }
        }
        function H(P) {
          if (M("getItem")) {
            try {
              var N = a[K].getItem(J + P);
              if (N) {
                N = JSON.parse(N);
                if (B.isObject(N)) {
                  return N;
                }
              }
            } catch (O) { }
            return {};
          } else {
            if (P in G) {
              return G[P];
            }
          }
        }
        function i(O) {
          if (M("removeItem")) {
            try {
              a[K].removeItem(J + O);
            } catch (N) { }
          } else {
            if (O in G) {
              delete G[O];
            }
          }
        }
        this.set = function (R, O, S, N) {
          var P = null;
          if (N) {
            P = new Date().getTime() + parseInt(N, 10) * 1000;
          }
          var Q = H(R);
          Q[O] = { value: S, expire: P };
          L(R, Q);
        };
        this.get = function (P, N) {
          var O = H(P);
          if (O && N in O && "value" in O[N]) {
            if (O[N].expire && O[N].expire < new Date().getTime()) {
              delete O[N];
              L(P);
              return;
            }
            return O[N].value;
          }
        };
        this.clearAll = function () {
          G = {};
          if (I() && B.isFunction(Object.keys)) {
            var N = Object.keys(a[K]);
            if (N) {
              for (var O = 0; O < N.length; O++) {
                if (String(N[O]).substr(0, J.length) === J) {
                  i(String(N[O]).substr(J.length));
                }
              }
            }
          }
        };
      }
      var x = new F("localStorage");
      var e = new F("sessionStorage");
      var B = {
        _compare: function (J, G, I) {
          var H = ["equals", "starts_with", "contains", "ends_with"];
          if (this.indexOfArray(H, I) !== -1) {
            J = String(J).toLowerCase();
            G = String(G).toLowerCase();
          }
          switch (I) {
            case "equals":
              return String(J) === String(G);
            case "equals_exactly":
              return String(J) === String(G);
            case "regexp":
              return null !== String(J).match(new RegExp(G));
            case "regexp_ignore_case":
              return null !== String(J).match(new RegExp(G, "i"));
            case "lower_than":
              return J < G;
            case "lower_than_or_equals":
              return J <= G;
            case "greater_than":
              return J > G;
            case "greater_than_or_equals":
              return J >= G;
            case "contains":
              return String(J).indexOf(G) !== -1;
            case "match_css_selector":
              if (!G || !J) {
                return false;
              }
              var i = A.bySelector(G);
              return B.indexOfArray(i, J) !== -1;
            case "starts_with":
              return String(J).indexOf(G) === 0;
            case "ends_with":
              return String(J).substring(J.length - G.length, J.length) === G;
          }
          return false;
        },
        compare: function (J, G, H) {
          var I = String(H).indexOf("not_") === 0;
          if (I) {
            H = String(H).substr("not_".length);
          }
          var i = this._compare(J, G, H);
          if (I) {
            return !i;
          }
          return i;
        },
        trim: function (i) {
          if (i && String(i) === i) {
            return i.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
          }
          return i;
        },
        isDefined: function (G) {
          var i = typeof G;
          return i !== "undefined";
        },
        isFunction: function (i) {
          return typeof i === "function";
        },
        isObject: function (i) {
          return typeof i === "object" && i !== null;
        },
        isString: function (i) {
          return typeof i === "string";
        },
        isNumber: function (i) {
          return typeof i === "number";
        },
        isArray: function (G) {
          if (!B.isObject(G)) {
            return false;
          }
          if ("function" === typeof Array.isArray && Array.isArray) {
            return Array.isArray(G);
          }
          var H = Object.prototype.toString;
          var i = H.call([]);
          return H.call(G) === i;
        },
        hasProperty: function (i, G) {
          return Object.prototype.hasOwnProperty.call(i, G);
        },
        indexOfArray: function (I, H) {
          if (!I) {
            return -1;
          }
          if ("function" === typeof I.indexOf && I.indexOf) {
            return I.indexOf(H);
          }
          if (!this.isArray(I)) {
            return -1;
          }
          for (var G = 0; G < I.length; G++) {
            if (I[G] === H) {
              return G;
            }
          }
          return -1;
        },
        setMethodWrapIfNeeded: function (G, H, J) {
          if (!(H in G)) {
            G[H] = J;
            return;
          }
          var I = G[H];
          if (!l.utils.isFunction(I)) {
            G[H] = J;
            return;
          }
          try {
            G[H] = function () {
              try {
                var K = I.apply(G, [].slice.call(arguments, 0));
              } catch (L) {
                J.apply(G, [].slice.call(arguments, 0));
                throw L;
              }
              J.apply(G, [].slice.call(arguments, 0));
              return K;
            };
          } catch (i) { }
        },
      };
      var t = function () {
        this.values = {};
        this.events = [];
        this.callbacks = [];
        this.reset = function () {
          this.values = {};
          this.events = [];
          this.callbacks = [];
        };
        this.push = function (H) {
          if (!B.isObject(H)) {
            y.log("pushed dataLayer value is not an object", H);
            return;
          }
          this.events.push(H);
          var G;
          for (G in H) {
            if (B.hasProperty(H, G)) {
              this.set(G, H[G]);
            }
          }
          for (G = 0; G < this.callbacks.length; G++) {
            if (this.callbacks[G]) {
              this.callbacks[G](H);
            }
          }
        };
        this.on = function (i) {
          this.callbacks.push(i);
          return this.callbacks.length - 1;
        };
        this.off = function (i) {
          if (i in this.callbacks) {
            this.callbacks[i] = null;
          }
        };
        this.set = function (i, G) {
          this.values[i] = G;
        };
        this.getAllEvents = function (i) {
          return this.events;
        };
        this.get = function (i) {
          if (i in this.values) {
            if (B.isFunction(this.values[i])) {
              return this.values[i]();
            } else {
              if (B.isObject(this.values[i]) && B.isFunction(this.values[i].get)) {
                return this.values[i].get();
              }
            }
            return this.values[i];
          }
          var G = u(i, this.values);
          if (B.isDefined(G)) {
            return G;
          }
        };
      };
      var p = new t();
      var E = {
        matchesDateRange: function (H, G, I) {
          var J = Date.UTC(H.getUTCFullYear(), H.getUTCMonth(), H.getUTCDate(), H.getUTCHours(), H.getUTCMinutes(), H.getUTCSeconds());
          if (G) {
            G = String(G).replace(/-/g, "/");
          }
          if (I) {
            I = String(I).replace(/-/g, "/");
          }
          var L, i;
          try {
            L = this.convertStringToDate(G);
          } catch (K) {
            if (G) {
              C("Invalid startDateTime given");
            }
          }
          try {
            i = this.convertStringToDate(I);
          } catch (K) {
            if (I) {
              C("Invalid endDateTime given");
            }
          }
          if (G && isNaN && isNaN(L.getTime())) {
            C("Invalid startDateTime given");
          }
          if (I && isNaN && isNaN(i.getTime())) {
            C("Invalid endDateTime given");
          }
          if (G && J < L.getTime()) {
            return false;
          }
          if (I && J > i.getTime()) {
            return false;
          }
          return true;
        },
        convertStringToDate: function (i) {
          var G = i && i.split(" ").length > 2;
          i = i + (i && i.toLowerCase() !== "invalid date" && !G ? " UTC" : "");
          return new Date(i);
        },
      };
      var r = {
        parseUrl: function (i, J) {
          try {
            var K = document.createElement("a");
            K.href = i;
            var G = K.href;
            K = document.createElement("a");
            K.href = G;
            if (J && J in K) {
              if ("hash" === J) {
                return String(K[J]).replace("#", "");
              } else {
                if ("protocol" === J) {
                  return String(K[J]).replace(":", "");
                } else {
                  if ("search" === J) {
                    return String(K[J]).replace("?", "");
                  } else {
                    if ("port" === J && !K[J]) {
                      if (K.protocol === "https:") {
                        return "443";
                      } else {
                        if (K.protocol === "http:") {
                          return "80";
                        }
                      }
                    }
                  }
                }
              }
              if ("pathname" === J && K[J] && String(K[J]).substr(0, 1) !== "/") {
                return "/" + K[J];
              }
              if ("port" === J && K[J]) {
                return String(K[J]);
              }
              return K[J];
            }
            if ("origin" === J && "protocol" in K && K.protocol) {
              return K.protocol + "//" + K.hostname + (K.port ? ":" + K.port : "");
            }
            return;
          } catch (I) {
            if ("function" === typeof URL) {
              var H = new URL(i);
              if (J && J in H) {
                if ("hash" === J) {
                  return String(H[J]).replace("#", "");
                } else {
                  if ("protocol" === J) {
                    return String(H[J]).replace(":", "");
                  } else {
                    if ("search" === J) {
                      return String(H[J]).replace("?", "");
                    } else {
                      if ("port" === J && !H[J]) {
                        if (H.protocol === "https:") {
                          return "443";
                        } else {
                          if (H.protocol === "http:") {
                            return "80";
                          }
                        }
                      }
                    }
                  }
                }
                return H[J];
              }
              return;
            }
          }
        },
        decodeSafe: function (G) {
          try {
            return a.decodeURIComponent(G);
          } catch (i) {
            return a.unescape(G);
          }
        },
        getQueryParameter: function (K, G) {
          if (!B.isDefined(G)) {
            G = a.location.search;
          }
          if (!G || !B.isDefined(K) || K === null || K === false || K === "") {
            return null;
          }
          var i = G.substr(0, 1);
          if (G !== "?" && G !== "&") {
            G = "?" + G;
          }
          K = K.replace("[", "\\[");
          K = K.replace("]", "\\]");
          var J = new RegExp("[?&]" + K + "(=([^&#]*)|&|#|$)");
          var I = J.exec(G);
          if (!I) {
            return null;
          }
          if (!I[2]) {
            return "";
          }
          var H = I[2].replace(/\+/g, " ");
          return this.decodeSafe(H);
        },
      };
      var c;
      var D = {
        hasSetupScroll: false,
        scrollCallbacks: [],
        scrollListenEvents: ["scroll", "resize"],
        offScroll: function (G) {
          if (G in this.scrollCallbacks) {
            this.scrollCallbacks[G] = null;
          }
          var I = 0,
            H = 0;
          for (I in this.scrollCallbacks) {
            if (this.scrollCallbacks[I]) {
              H++;
            }
          }
          if (!H) {
            for (I = 0; I < this.scrollListenEvents.length; I++) {
              if (b.removeEventListener) {
                a.removeEventListener(this.scrollListenEvents[I], this.didScroll, true);
              } else {
                a.detachEvent("on" + this.scrollListenEvents[I], this.didScroll);
              }
            }
            this.hasSetupScroll = false;
          }
        },
        didScroll: function (i) {
          if (c) {
            return;
          }
          if (i && i.type && i.type === "scroll" && i.target && i.target !== b && i.target !== a) {
            return;
          }
          c = setTimeout(function () {
            c = null;
            var G;
            for (G = 0; G < D.scrollCallbacks.length; G++) {
              if (D.scrollCallbacks[G]) {
                D.scrollCallbacks[G](i);
              }
            }
          }, 120);
        },
        onScroll: function (G) {
          this.scrollCallbacks.push(G);
          if (!this.hasSetupScroll) {
            this.hasSetupScroll = true;
            var i = 0;
            for (i = 0; i < this.scrollListenEvents.length; i++) {
              if (b.addEventListener) {
                a.addEventListener(this.scrollListenEvents[i], this.didScroll, true);
              } else {
                a.attachEvent("on" + this.scrollListenEvents[i], this.didScroll);
              }
            }
          }
          return this.scrollCallbacks.length - 1;
        },
        getScreenHeight: function () {
          return a.screen.height;
        },
        getScreenWidth: function () {
          return a.screen.width;
        },
        getViewportWidth: function () {
          var i = a.innerWidth || b.documentElement.clientWidth || b.body.clientWidth;
          if (!i) {
            return 0;
          }
          return i;
        },
        getViewportHeight: function () {
          var i = a.innerHeight || b.documentElement.clientHeight || b.body.clientHeight;
          if (!i) {
            return 0;
          }
          return i;
        },
        getPerformanceTiming: function (i) {
          if ("performance" in a && B.isObject(a.performance) && B.isObject(a.performance.timing) && i in a.performance.timing) {
            return a.performance.timing[i];
          }
          return 0;
        },
      };
      var A = {
        loadScriptUrl: function (H, G) {
          if (!G) {
            G = {};
          }
          if (!B.isDefined(G.defer)) {
            G.defer = true;
          }
          if (!B.isDefined(G.async)) {
            G.async = true;
          }
          if (!B.isDefined(G.type)) {
            G.type = "text/javascript";
          }
          var i = document.createElement("script");
          i.src = H;
          i.type = G.type;
          i.defer = !!G.defer;
          i.async = !!G.async;
          if (B.isFunction(G.onload)) {
            i.onload = G.onload;
          }
          if (B.isFunction(G.onerror)) {
            i.onerror = G.onerror;
          }
          if (B.isDefined(G.charset)) {
            i.charset = G.charset;
          }
          if (B.isDefined(G.id)) {
            i.id = G.id;
          }
          b.head.appendChild(i);
        },
        getScrollLeft: function () {
          return a.document.body.scrollLeft || a.document.documentElement.scrollLeft;
        },
        getScrollTop: function () {
          return a.document.body.scrollTop || a.document.documentElement.scrollTop;
        },
        getDocumentHeight: function () {
          return Math.max(b.body.offsetHeight, b.body.scrollHeight, b.documentElement.offsetHeight, b.documentElement.clientHeight, b.documentElement.scrollHeight, 1);
        },
        getDocumentWidth: function () {
          return Math.max(b.body.offsetWidth, b.body.scrollWidth, b.documentElement.offsetWidth, b.documentElement.clientWidth, b.documentElement.scrollWidth, 1);
        },
        addEventListener: function (I, H, G, i) {
          if (!I) {
            y.log("element not found, cannot add event listener", I, this);
            return;
          }
          if (I.addEventListener) {
            i = i || false;
            I.addEventListener(H, G, i);
            return true;
          }
          if (I.attachEvent) {
            return I.attachEvent("on" + H, G);
          }
          I["on" + H] = G;
        },
        getElementText: function (G) {
          if (!G) {
            return;
          }
          if (l.dom.shouldElementBeMasked(G) && G.children.length === 0) {
            return "*******";
          }
          if (l.dom.elementHasMaskedChild(G)) {
            return l.dom.getElementTextWithMaskedChildren(G);
          }
          var i = G.innerText || G.textContent || "";
          i = i.replace(/([\s\uFEFF\xA0])+/g, " ");
          i = i.replace(/(\s)+/g, " ");
          return B.trim(i);
        },
        getElementClassNames: function (i) {
          if (i && i.className) {
            return B.trim(String(i.className).replace(/\s{2,}/g, " "));
          }
          return "";
        },
        getElementAttribute: function (I, G) {
          if (!I || !G) {
            return;
          }
          var i = G.toLowerCase();
          if ((i === "value" || i === "title" || i === "alt" || i === "label" || i === "placeholder") && l.dom.shouldElementBeMasked(I)) {
            return "*******";
          }
          if (I && I.getAttribute) {
            return I.getAttribute(G);
          }
          if (!I || !I.attributes) {
            return;
          }
          var H = typeof I.attributes[G];
          if ("undefined" === H) {
            return null;
          }
          if (I.attributes[G].value) {
            return I.attributes[G].value;
          }
          if (I.attributes[G].nodeValue) {
            return I.attributes[G].nodeValue;
          }
          return null;
        },
        _htmlCollectionToArray: function (H) {
          var i = [];
          if (!H || !H.length) {
            return i;
          }
          var G;
          for (G = 0; G < H.length; G++) {
            i.push(H[G]);
          }
          return i;
        },
        byId: function (i) {
          if (B.isString(i) && i.substr(0, 1) === "#") {
            i = i.substr(1);
          }
          return b.getElementById(i);
        },
        byClassName: function (i) {
          if (i && "getElementsByClassName" in b) {
            return this._htmlCollectionToArray(b.getElementsByClassName(i));
          }
          return [];
        },
        byTagName: function (i) {
          if (i && "getElementsByTagName" in b) {
            return this._htmlCollectionToArray(b.getElementsByTagName(i));
          }
          return [];
        },
        bySelector: function (i) {
          if (i && "querySelectorAll" in b) {
            return this._htmlCollectionToArray(b.querySelectorAll(i));
          }
          return [];
        },
        isElementContext: function (I, i) {
          if (!I || !i) {
            return false;
          }
          I = String(I).toLowerCase();
          i = String(i).toLowerCase();
          var H = I.lastIndexOf("<" + i);
          if (H === -1) {
            return false;
          }
          var G = I.substring(H);
          return !G.match(new RegExp("<\\s*/\\s*" + i + ">"));
        },
        isAttributeContext: function (M, K) {
          if (!M || !K) {
            return false;
          }
          M = String(M).replace(/([\s\uFEFF\xA0]*=[\s\uFEFF\xA0]*)/g, "=");
          var H = M.lastIndexOf("<");
          if (H === -1) {
            return false;
          }
          var O = M.substring(H);
          var G = O.indexOf(">");
          if (G !== -1) {
            return false;
          }
          var N = O.lastIndexOf("=");
          if (N === -1) {
            return false;
          }
          var J = O.lastIndexOf(" ", N);
          var L = O.substring(J, N);
          L = B.trim(L);
          if (L.toLowerCase() !== K.toLowerCase()) {
            return false;
          }
          var I = O.substring(N).replace("=", "");
          var i = I.substring(0, 1);
          if ('"' === i) {
            return -1 === I.substring(1).indexOf('"');
          } else {
            if ("'" === i) {
              return -1 === I.substring(1).indexOf("'");
            }
          }
          return -1 === I.indexOf(" ");
        },
        onLoad: function (i) {
          if (b.readyState === "complete") {
            i();
          } else {
            if (a.addEventListener) {
              a.addEventListener("load", i);
            } else {
              if (a.attachEvent) {
                a.attachEvent("onload", i);
              }
            }
          }
        },
        onReady: function (H) {
          var i = false;
          if (b.attachEvent) {
            i = b.readyState === "complete";
          } else {
            i = b.readyState !== "loading";
          }
          if (i) {
            H();
            return;
          }
          if (b.addEventListener) {
            this.addEventListener(b, "DOMContentLoaded", function G() {
              b.removeEventListener("DOMContentLoaded", G, false);
              if (!i) {
                i = true;
                H();
              }
            });
          } else {
            if (b.attachEvent) {
              b.attachEvent("onreadystatechange", function G() {
                if (b.readyState === "complete") {
                  b.detachEvent("onreadystatechange", G);
                  if (!i) {
                    i = true;
                    H();
                  }
                }
              });
            }
          }
          this.onLoad(function () {
            if (!i) {
              i = true;
              H();
            }
          });
        },
        onClick: function (G, i) {
          if (typeof i === "undefined") {
            i = b.body;
          }
          l.dom.addEventListener(
            i,
            "click",
            function (H) {
              var I = H.which ? H.which : 1;
              if (I === 1) {
                G(H, "left");
              }
            },
            true
          );
          l.dom.addEventListener(
            i,
            "auxclick",
            function (H) {
              var I = H.which ? H.which : 2;
              if (I === 2) {
                G(H, "middle");
              }
            },
            true
          );
          l.dom.addEventListener(
            i,
            "contextmenu",
            function (H) {
              var I = H.which ? H.which : 3;
              if (I === 3) {
                G(H, "right");
              }
            },
            true
          );
        },
        shouldElementBeMasked: function (G) {
          if (typeof G === "undefined") {
            return false;
          }
          if (G.hasAttribute("data-matomo-mask") || G.hasAttribute("data-piwik-mask")) {
            return true;
          }
          if (G.hasAttribute("data-matomo-unmask") || G.hasAttribute("data-piwik-unmask")) {
            return false;
          }
          var i = G.parentElement;
          while (i) {
            if (i.hasAttribute("data-matomo-mask") || i.hasAttribute("data-piwik-mask")) {
              return true;
            }
            if (i.hasAttribute("data-matomo-unmask") || i.hasAttribute("data-piwik-unmask")) {
              return false;
            }
            i = i.parentElement;
          }
          return false;
        },
        elementHasMaskedChild: function (i) {
          if (typeof i === "undefined") {
            return false;
          }
          if (i.children.length === 0) {
            return false;
          }
          if (i.hasAttribute("data-matomo-mask") || i.hasAttribute("data-piwik-mask") || l.dom.shouldElementBeMasked(i)) {
            return true;
          }
          return i.querySelector("[data-matomo-mask],[data-piwik-mask]") !== null;
        },
        getElementTextWithMaskedChildren: function (H) {
          var K = "";
          var J = H.children;
          for (var G = 0; G < J.length; G++) {
            var I = J[G];
            K += l.dom.getElementText(I) + " ";
          }
          return B.trim(K);
        },
      };
      function w(H) {
        this.window = a;
        this.document = b;
        this.set = function (i, I) {
          this[i] = I;
        };
        this.get = function (I, i) {
          if (I === null || I === false || !B.isDefined(I)) {
            return i;
          }
          if (I in this) {
            if (B.isObject(this[I]) && "get" in this[I] && B.isFunction(this[I].get)) {
              return this[I].get();
            }
            return this[I];
          }
          var J = u(I, this);
          if (B.isDefined(J)) {
            return J;
          }
          return i;
        };
        this.buildVariable = function (i) {
          return o(i, this.get("container"));
        };
        if (B.isObject(H)) {
          for (var G in H) {
            if (B.hasProperty(H, G)) {
              this.set(G, H[G]);
            }
          }
        }
      }
      function z(G, i) {
        this.isValid = function () {
          var I = o(G.actual, i).get();
          var H = o(G.expected, i).get();
          return B.compare(I, H, G.comparison);
        };
      }
      function o(G, i) {
        if (B.isObject(G) && G.joinedVariable && B.isArray(G.joinedVariable)) {
          return new q(G.joinedVariable, i);
        } else {
          if (B.isObject(G) && G.type) {
            return new s(G, i);
          }
        }
        return new m(G, i);
      }
      function q(G, i) {
        this.name = "";
        this.type = "JoinedVariable";
        this.getDefinition = function () {
          return G;
        };
        this.get = function () {
          var I = "",
            J;
          for (var H = 0; H < G.length; H++) {
            J = o(G[H], i).toString();
            if (J !== false && J !== null && B.isDefined(J)) {
              I += J;
            }
          }
          return I;
        };
        this.toString = function () {
          return this.get();
        };
        this.addDebugValues = function (H) {
          H.push({ name: null, type: "_joined", value: this.get() });
        };
      }
      function m(I, G) {
        this.name = "";
        this.type = "ConstantVariable";
        this.getDefinition = function () {
          return I;
        };
        function H(K) {
          return K && B.isObject(K) && !B.isArray(K) && (B.hasProperty(K, "type") || B.hasProperty(K, "joinedVariable"));
        }
        function J(M) {
          if (M == null || typeof M !== "object") {
            return M;
          }
          var K = new M.constructor();
          var L;
          for (L in M) {
            if (B.hasProperty(M, L)) {
              K[L] = J(M[L]);
            }
          }
          return K;
        }
        function i(L) {
          var K;
          if (H(L)) {
            L = o(L, G).get();
          } else {
            if (L && B.isArray(L)) {
              for (K = 0; K < L.length; K++) {
                L[K] = i(L[K]);
              }
            } else {
              if (L && B.isObject(L)) {
                for (K in L) {
                  if (B.hasProperty(L, K)) {
                    L[K] = i(L[K]);
                  }
                }
              }
            }
          }
          return L;
        }
        this.get = function () {
          var K = I;
          if (B.isObject(K)) {
            K = J(K);
            K = i(K);
          }
          return K;
        };
        this.toString = function () {
          return I;
        };
        this.addDebugValues = function (K) {
          K.push({ name: null, type: "_constant", value: this.get() });
        };
      }
      function s(H, G) {
        this.type = H.type;
        this.name = H.name;
        this.lookUpTable = H.lookUpTable || [];
        this.defaultValue = undefined;
        this.parameters = H.parameters || {};
        this.getDefinition = function () {
          return H;
        };
        this.get = function () {
          var L;
          try {
            L = this.theVariable.get();
          } catch (M) {
            y.error("Failed to get value of variable", M, this);
            L = undefined;
          }
          if ((!B.isDefined(L) || L === null || L === false) && B.isDefined(this.defaultValue)) {
            L = this.defaultValue;
          }
          var K;
          for (K = 0; K < this.lookUpTable.length; K++) {
            var N = this.lookUpTable[K];
            if (B.compare(L, N.matchValue, N.comparison)) {
              return N.outValue;
            }
          }
          return L;
        };
        this.toString = function () {
          if (this.theVariable && B.hasProperty(this.theVariable, "toString") && B.isFunction(this.theVariable.toString)) {
            try {
              return this.theVariable.toString();
            } catch (i) {
              y.error("Failed to get toString of variable", i, this);
              return;
            }
          }
          return this.get();
        };
        this.addDebugValues = function (i) {
          i.push({ name: this.name, type: this.type, value: this.get() });
        };
        if ("undefined" !== typeof H.defaultValue) {
          this.defaultValue = H.defaultValue;
        }
        if (!B.isDefined(H.Variable) || !H.Variable) {
          y.log("no template defined for variable ", H);
          return;
        }
        var I,
          J = new w({ variable: this, container: G });
        if (B.isObject(H.parameters)) {
          for (I in H.parameters) {
            if (B.hasProperty(H.parameters, I)) {
              J.set(I, o(H.parameters[I], G));
            }
          }
        }
        if (B.isFunction(H.Variable)) {
          this.theVariable = new H.Variable(J, l);
        } else {
          if (B.isObject(H.Variable)) {
            this.theVariable = H.Variable;
          } else {
            if (H.Variable in G.templates) {
              this.theVariable = new G.templates[H.Variable](J, l);
            } else {
              C("No matching variable template found");
            }
          }
        }
      }
      function f(I, G) {
        this.referencedTags = [];
        this.id = I.id;
        this.type = I.type;
        this.name = I.name;
        this.conditions = [];
        this.parameters = I.parameters || {};
        var H = this;
        this.getId = function () {
          return this.id;
        };
        this.setUp = function () {
          if (this.theTrigger && this.theTrigger.setUp && B.isFunction(this.theTrigger.setUp)) {
            this.theTrigger.setUp(function (P) {
              p.push(P);
              if (!("event" in P)) {
                return;
              }
              var L = { tags: [], variables: [], metTrigger: null, name: P.event, eventData: P, container: {} };
              var O, N;
              if (H.meetsConditions()) {
                y.log("The condition is met for trigger " + H.name, H);
                L.metTrigger = { name: H.name, type: H.type };
                var M = H.getReferencedTags();
                for (N = 0; N < M.length; N++) {
                  if (M[N].hasBlockTrigger(H)) {
                    M[N].block();
                    M[N].addDebugValues(L.tags, "Block");
                  } else {
                    if (M[N].hasFireTrigger(H)) {
                      M[N].fire();
                      M[N].addDebugValues(L.tags, "Fire");
                    }
                  }
                }
              }
              if (window.mtmPreviewWindow || y.enabled) {
                G.addDebugValues(L.container);
                d(L);
                if (y.enabled) {
                  y.log("event: ", L);
                }
              }
            });
          }
        };
        this.addReferencedTag = function (i) {
          this.referencedTags.push(i);
        };
        this.getReferencedTags = function () {
          return this.referencedTags;
        };
        this.meetsConditions = function () {
          var L, M;
          for (L = 0; L < this.conditions.length; L++) {
            M = new z(this.conditions[L], G);
            if (!M.isValid()) {
              return false;
            }
          }
          return true;
        };
        if (I.conditions && B.isArray(I.conditions)) {
          this.conditions = I.conditions;
        }
        var J,
          K = new w({ trigger: this, container: G });
        if (B.isObject(I.parameters)) {
          for (J in I.parameters) {
            if (B.hasProperty(I.parameters, J)) {
              K.set(J, o(I.parameters[J], G));
            }
          }
        }
        if (!B.isDefined(I.Trigger) || !I.Trigger) {
          y.error("no template defined for trigger ", I);
          return;
        }
        if (B.isFunction(I.Trigger)) {
          this.theTrigger = new I.Trigger(K, l);
        } else {
          if (B.isObject(I.Trigger)) {
            this.theTrigger = I.Trigger;
          } else {
            if (I.Trigger in G.templates) {
              this.theTrigger = new G.templates[I.Trigger](K, l);
            } else {
              C("No matching trigger template found");
            }
          }
        }
        K = null;
      }
      function h(G, H) {
        this.type = G.type;
        this.name = G.name;
        this.fireTriggerIds = G.fireTriggerIds ? G.fireTriggerIds : [];
        this.blockTriggerIds = G.blockTriggerIds ? G.blockTriggerIds : [];
        this.fireLimit = G.fireLimit ? G.fireLimit : h.FIRE_LIMIT_UNLIMITED;
        this.fireDelay = G.fireDelay ? parseInt(G.fireDelay, 10) : 0;
        this.startDate = G.startDate ? G.startDate : null;
        this.endDate = G.endDate ? G.endDate : null;
        this.numExecuted = 0;
        this.blocked = false;
        this.parameters = G.parameters || {};
        var I = this;
        this.addDebugValues = function (i, L) {
          i.push({ action: L, type: this.type, name: this.name, numExecuted: this.numExecuted });
        };
        this._doFire = function () {
          if (this.blocked) {
            y.log("not firing as this tag is blocked", this);
            return "tag is blocked";
          }
          if (this.fireLimit !== h.FIRE_LIMIT_UNLIMITED && this.numExecuted) {
            y.log("not firing as this tag has limit reached", this);
            return "fire limit is restricted";
          }
          var L = "tag";
          if (H.id) {
            L += "_" + H.id;
          }
          if (this.fireLimit === h.FIRE_LIMIT_ONCE_24HOURS && !window.mtmPreviewWindow) {
            if (x.get(L, this.name)) {
              y.log("not firing as this tag has 24hours limit reached", this);
              return "fire limit 24hours is restricted";
            }
          }
          if (this.fireLimit === h.FIRE_LIMIT_ONCE_LIFETIME && !window.mtmPreviewWindow) {
            if (x.get(L, this.name)) {
              y.log("not firing as this tag has limit reached", this);
              return "fire limit lifetime is restricted";
            }
          }
          if (!E.matchesDateRange(new Date(), this.startDate, this.endDate)) {
            y.log("not firing as this tag does not match date", this);
            return "date range does not match";
          }
          if (!this.theTag || !this.theTag.fire) {
            y.log("not firing as tag does not exist anymore", this);
            return "tag not found";
          }
          y.log("firing this tag", this);
          this.numExecuted++;
          if (this.fireLimit === h.FIRE_LIMIT_ONCE_24HOURS) {
            var i = 24 * 60 * 60;
            x.set(L, this.name, "1", i);
          }
          if (this.fireLimit === h.FIRE_LIMIT_ONCE_LIFETIME) {
            x.set(L, this.name, "1");
          }
          this.theTag.fire();
          y.log("fired this tag", this);
        };
        this.fire = function () {
          if (this.fireDelay) {
            setTimeout(function () {
              I._doFire();
            }, this.fireDelay);
          } else {
            return this._doFire();
          }
        };
        this.block = function () {
          this.blocked = true;
        };
        this.hasFireTrigger = function (i) {
          if (!this.fireTriggerIds || !this.fireTriggerIds.length) {
            return false;
          }
          if (!i) {
            return false;
          }
          var L = i.getId();
          return B.indexOfArray(this.fireTriggerIds, L) !== -1;
        };
        this.hasBlockTrigger = function (i) {
          if (!this.blockTriggerIds || !this.blockTriggerIds.length) {
            return false;
          }
          if (!i) {
            return false;
          }
          var L = i.getId();
          return B.indexOfArray(this.blockTriggerIds, L) !== -1;
        };
        if (!B.isDefined(G.Tag) || !G.Tag) {
          y.error("no template defined for tag ", G);
          return;
        }
        var J,
          K = new w({ tag: this, container: H });
        if (B.isObject(G.parameters)) {
          for (J in G.parameters) {
            if (B.hasProperty(G.parameters, J)) {
              K.set(J, o(G.parameters[J], H));
            }
          }
        }
        if (B.isFunction(G.Tag)) {
          this.theTag = new G.Tag(K, l);
        } else {
          if (B.isObject(G.Tag)) {
            this.theTag = G.Tag;
          } else {
            if (G.Tag in H.templates) {
              this.theTag = new H.templates[G.Tag](K, l);
            } else {
              C("No matching tag template found");
            }
          }
        }
      }
      h.FIRE_LIMIT_ONCE_PAGE = "once_page";
      h.FIRE_LIMIT_ONCE_24HOURS = "once_24hours";
      h.FIRE_LIMIT_ONCE_LIFETIME = "once_lifetime";
      h.FIRE_LIMIT_UNLIMITED = "unlimited";
      function n(G, N) {
        var O = this;
        this.id = G.id;
        this.idsite = G.idsite || null;
        this.versionName = G.versionName || null;
        this.revision = G.revision || null;
        this.environment = G.environment || null;
        this.templates = N || {};
        this.dataLayer = new t();
        this.variables = [];
        this.triggers = [];
        this.tags = [];
        this.onNewGlobalDataLayerValue = function (i) {
          this.dataLayer.push(i);
        };
        p.on(function (i) {
          O.onNewGlobalDataLayerValue(i);
        });
        this.addDebugValues = function (Q) {
          Q.variables = [];
          var R;
          for (R = 0; R < this.variables.length; R++) {
            this.variables[R].addDebugValues(Q.variables);
          }
          Q.tags = [];
          for (R = 0; R < this.tags.length; R++) {
            this.tags[R].addDebugValues(Q.tags, "Not Fired Yet");
          }
          Q.id = this.id;
          Q.versionName = this.versionName;
          Q.dataLayer = JSON.parse(
            JSON.stringify(this.dataLayer.values, function (i, S) {
              if (typeof S === "object" && S instanceof Node) {
                return S.nodeName;
              } else {
                return S;
              }
            })
          );
        };
        this.getTriggerById = function (Q) {
          if (!Q) {
            return;
          }
          var R;
          for (R = 0; R < this.triggers.length; R++) {
            if (this.triggers[R].getId() === Q) {
              return this.triggers[R];
            }
          }
        };
        this.addTrigger = function (i) {
          if (!i) {
            return;
          }
          var Q = this.getTriggerById(i.id);
          if (!Q) {
            Q = new f(i, this);
            this.triggers.push(Q);
          }
          return Q;
        };
        var M, L, P, K, I;
        if (G.variables && B.isArray(G.variables)) {
          for (M = 0; M < G.variables.length; M++) {
            this.variables.push(o(G.variables[M], this));
          }
        }
        if (G.triggers && B.isArray(G.triggers)) {
          if (G.tags && B.isArray(G.tags)) {
            G.triggers.sort(function (R, Q) {
              var S = false,
                U = false,
                i,
                T;
              for (T = 0; T < G.tags.length; T++) {
                i = G.tags[T];
                if (i && i.blockTriggerIds && B.isArray(i.blockTriggerIds)) {
                  S = S || B.indexOfArray(i.blockTriggerIds, R.id) !== -1;
                  U = U || B.indexOfArray(i.blockTriggerIds, Q.id) !== -1;
                }
              }
              if (S && !U) {
                return -1;
              } else {
                if (U && !S) {
                  return 1;
                }
              }
              if (R.id < Q.id) {
                return -1;
              }
              return 1;
            });
          }
          for (M = 0; M < G.triggers.length; M++) {
            this.addTrigger(G.triggers[M]);
          }
        }
        if (G.tags && B.isArray(G.tags)) {
          var J = false;
          var H = [];
          for (M = 0; M < G.tags.length; M++) {
            K = G.tags[M];
            if (K.type === "Matomo" && H.indexOf(K.parameters.matomoConfig.name) === -1) {
              J = true;
              H.push(K.parameters.matomoConfig.name);
            }
          }
          for (M = 0; M < G.tags.length; M++) {
            K = G.tags[M];
            if (J && K.parameters.matomoConfig && H.indexOf(K.parameters.matomoConfig.name) !== -1) {
              H.splice(K.parameters.matomoConfig.name, 1);
            }
            if (J && H.length === 0) {
              K.parameters.applyRemainingPaqEntries = true;
            }
            P = new h(K, this);
            this.tags.push(P);
            if (K.blockTriggerIds && B.isArray(K.blockTriggerIds)) {
              for (L = 0; L < K.blockTriggerIds.length; L++) {
                I = this.getTriggerById(K.blockTriggerIds[L]);
                if (I) {
                  I.addReferencedTag(P);
                }
              }
            }
            if (K.fireTriggerIds && B.isArray(K.fireTriggerIds)) {
              for (L = 0; L < K.fireTriggerIds.length; L++) {
                I = this.getTriggerById(K.fireTriggerIds[L]);
                if (I) {
                  I.addReferencedTag(P);
                }
              }
            }
          }
        }
        this.run = function () {
          var R = p.getAllEvents();
          var Q;
          for (Q = 0; Q < R.length; Q++) {
            this.onNewGlobalDataLayerValue(R[Q]);
          }
          for (Q = 0; Q < this.triggers.length; Q++) {
            this.triggers[Q].setUp();
          }
        };
      }
      var l = {
        THROW_ERRORS: true,
        dataLayer: p,
        containers: [],
        url: r,
        date: E,
        utils: B,
        debug: y,
        dom: A,
        window: D,
        Variable: s,
        storage: { local: x, session: e },
        _buildVariable: o,
        Condition: z,
        TemplateParameters: w,
        Trigger: f,
        Tag: h,
        throwError: C,
        Container: n,
        addContainer: function (M, J) {
          var K = r.getQueryParameter("mtmSetDebugFlag");
          if (K) {
            var H = encodeURIComponent(M.idsite);
            var i = encodeURIComponent(M.id);
            if (K == 1) {
              var I = new Date();
              I.setTime(I.getTime() + 7 * 24 * 60 * 60 * 1000);
              document.cookie = "mtmPreviewMode=mtmPreview" + H + "_" + i + "%3D1;expires=" + I.toUTCString() + ";SameSite=Lax";
            } else {
              document.cookie = "mtmPreviewMode=mtmPreview" + H + "_" + i + "%3D1;expires=Thu, 01 Jan 1970 00:00:00 UTC;SameSite=Lax";
              window.close();
            }
          }
          if (!window.mtmPreviewWindow) {
            var L = b.getElementById("mtmDebugFrame");
            if (L && L.contentWindow) {
              window.mtmPreviewWindow = L.contentWindow;
            }
          }
          y.log("creating container");
          var G = new n(M, J);
          this.containers.push(G);
          G.dataLayer.push({ "mtm.containerId": G.id });
          y.log("running container");
          G.run();
          return G;
        },
        enableDebugMode: function () {
          y.enabled = true;
        },
      };
      if ("matomoTagManagerAsyncInit" in a && B.isFunction(a.matomoTagManagerAsyncInit)) {
        a.matomoTagManagerAsyncInit(l);
      }
      function g() {
        var K, I, H, M, N;
        for (K = 0; K < arguments.length; K += 1) {
          N = null;
          if (arguments[K] && arguments[K].slice) {
            N = arguments[K].slice();
          }
          M = arguments[K];
          if (B.isObject(M) && !B.isArray(M)) {
            p.push(M);
            continue;
          }
          H = M.shift();
          var L = B.isString(H) && H.indexOf("::") > 0;
          if (L) {
            var G, J;
            G = H.split("::");
            J = G[0];
            H = G[1];
            if ("object" === typeof l[J] && B.isFunction(l[J][H])) {
              l[J][H].apply(l[J], M);
            }
          } else {
            if (H && H in l && B.isFunction(l[H])) {
              l[H].apply(l, M);
            } else {
              y.error("method " + H + " is not valid");
            }
          }
        }
      }
      B.setMethodWrapIfNeeded(a._mtm, "push", g);
      var v;
      for (v = 0; v < a._mtm.length; v++) {
        g(a._mtm[v]);
      }
      p.push({ "mtm.mtmScriptLoadedTime": k });
      if ("undefined" !== typeof a.dataLayer && B.isArray(a.dataLayer)) {
        for (v = 0; v < a.dataLayer.length; v++) {
          if (B.isObject(a.dataLayer[v])) {
            p.push(a.dataLayer[v]);
          }
        }
      }
      return l;
    })();
  }
  
    (function () {
      var Templates = {};
      Templates["MatomoTag"] = (function () {
  var libLoaded = false;
  var libAvailable = false;
  var callbacks = {
    callbacks: [],
    push: function (callback) {
      if (libAvailable) {
        callback();
      } else {
        this.callbacks.push(callback);
      }
    },
  };
  if (!window._paq) {
    window._paq = [];
  }
  var initialPaq = window._paq && window._paq.length ? JSON.parse(JSON.stringify(window._paq)) : initialPaq || [];
  var remainingPaq = [];
  var indexesToRemove = [];
  while (window._paq.length > 0) {
    window._paq.pop();
  }
  var hasProcessedRemainingTrackings = false;
  if ("object" !== typeof window.matomoPluginAsyncInit) {
    window.matomoPluginAsyncInit = [];
  }
  function executeCallbacks() {
    var i;
    for (i = 0; i < callbacks.callbacks.length; i++) {
      callbacks.callbacks[i]();
    }
    callbacks.callbacks = [];
  }
  window.matomoPluginAsyncInit.push(function () {
    libAvailable = true;
    executeCallbacks();
  });
  function checkLoadedAlready() {
    if (libAvailable || typeof window.Piwik === "object") {
      libAvailable = true;
      libLoaded = true;
      executeCallbacks();
      return true;
    }
    return false;
  }
  function loadMatomo() {
    if (checkLoadedAlready()) {
      return;
    }
    /*!!
     * Matomo - free/libre analytics platform
     *
     * JavaScript tracking client
     *
     * @link https://piwik.org
     * @source https://github.com/matomo-org/matomo/blob/master/js/piwik.js
     * @license https://piwik.org/free-software/bsd/ BSD-3 Clause (also in js/LICENSE.txt)
     * @license magnet:?xt=urn:btih:c80d50af7d3db9be66a4d0a86db0286e4fd33292&dn=bsd-3-clause.txt BSD-3-Clause
     */
    if (typeof _paq !== "object") {
      _paq = [];
    }
    if (typeof window.Matomo !== "object") {
      window.Matomo = window.Piwik = (function () {
        var r,
          b = {},
          z = {},
          J = document,
          g = navigator,
          ab = screen,
          W = window,
          h = W.performance || W.mozPerformance || W.msPerformance || W.webkitPerformance,
          t = W.encodeURIComponent,
          V = W.decodeURIComponent,
          k = unescape,
          L = [],
          H,
          u,
          al = [],
          y = 0,
          af = 0,
          X = 0,
          m = false;
        function p(at) {
          try {
            return V(at);
          } catch (au) {
            return unescape(at);
          }
        }
        function M(au) {
          var at = typeof au;
          return at !== "undefined";
        }
        function C(at) {
          return typeof at === "function";
        }
        function Z(at) {
          return typeof at === "object";
        }
        function x(at) {
          return typeof at === "string" || at instanceof String;
        }
        function ak(at) {
          return typeof at === "number" || at instanceof Number;
        }
        function ac(at) {
          return M(at) && (ak(at) || (x(at) && at.length));
        }
        function D(au) {
          if (!au) {
            return true;
          }
          var at;
          for (at in au) {
            if (Object.prototype.hasOwnProperty.call(au, at)) {
              return false;
            }
          }
          return true;
        }
        function ao(at) {
          var au = typeof console;
          if (au !== "undefined" && console && console.error) {
            console.error(at);
          }
        }
        function aj() {
          var ay, ax, aA, au, at;
          for (ay = 0; ay < arguments.length; ay += 1) {
            at = null;
            if (arguments[ay] && arguments[ay].slice) {
              at = arguments[ay].slice();
            }
            au = arguments[ay];
            aA = au.shift();
            var az, av;
            var aw = x(aA) && aA.indexOf("::") > 0;
            if (aw) {
              az = aA.split("::");
              av = az[0];
              aA = az[1];
              if ("object" === typeof u[av] && "function" === typeof u[av][aA]) {
                u[av][aA].apply(u[av], au);
              } else {
                if (at) {
                  al.push(at);
                }
              }
            } else {
              for (ax = 0; ax < L.length; ax++) {
                if (x(aA)) {
                  av = L[ax];
                  var aB = aA.indexOf(".") > 0;
                  if (aB) {
                    az = aA.split(".");
                    if (av && "object" === typeof av[az[0]]) {
                      av = av[az[0]];
                      aA = az[1];
                    } else {
                      if (at) {
                        al.push(at);
                        break;
                      }
                    }
                  }
                  if (av[aA]) {
                    av[aA].apply(av, au);
                  } else {
                    var aC = "The method '" + aA + '\' was not found in "_paq" variable.  Please have a look at the Matomo tracker documentation: https://developer.matomo.org/api-reference/tracking-javascript';
                    ao(aC);
                    if (!aB) {
                      throw new TypeError(aC);
                    }
                  }
                  if (aA === "addTracker") {
                    break;
                  }
                  if (aA === "setTrackerUrl" || aA === "setSiteId") {
                    break;
                  }
                } else {
                  aA.apply(L[ax], au);
                }
              }
            }
          }
        }
        function ar(aw, av, au, at) {
          if (aw.addEventListener) {
            aw.addEventListener(av, au, at);
            return true;
          }
          if (aw.attachEvent) {
            return aw.attachEvent("on" + av, au);
          }
          aw["on" + av] = au;
        }
        function n(at) {
          if (J.readyState === "complete") {
            at();
          } else {
            if (W.addEventListener) {
              W.addEventListener("load", at, false);
            } else {
              if (W.attachEvent) {
                W.attachEvent("onload", at);
              }
            }
          }
        }
        function q(aw) {
          var at = false;
          if (J.attachEvent) {
            at = J.readyState === "complete";
          } else {
            at = J.readyState !== "loading";
          }
          if (at) {
            aw();
            return;
          }
          var av;
          if (J.addEventListener) {
            ar(J, "DOMContentLoaded", function au() {
              J.removeEventListener("DOMContentLoaded", au, false);
              if (!at) {
                at = true;
                aw();
              }
            });
          } else {
            if (J.attachEvent) {
              J.attachEvent("onreadystatechange", function au() {
                if (J.readyState === "complete") {
                  J.detachEvent("onreadystatechange", au);
                  if (!at) {
                    at = true;
                    aw();
                  }
                }
              });
              if (J.documentElement.doScroll && W === W.top) {
                (function au() {
                  if (!at) {
                    try {
                      J.documentElement.doScroll("left");
                    } catch (ax) {
                      setTimeout(au, 0);
                      return;
                    }
                    at = true;
                    aw();
                  }
                })();
              }
            }
          }
          ar(
            W,
            "load",
            function () {
              if (!at) {
                at = true;
                aw();
              }
            },
            false
          );
        }
        function ag(au, az, aA) {
          if (!au) {
            return "";
          }
          var at = "",
            aw,
            av,
            ax,
            ay;
          for (aw in b) {
            if (Object.prototype.hasOwnProperty.call(b, aw)) {
              ay = b[aw] && "function" === typeof b[aw][au];
              if (ay) {
                av = b[aw][au];
                ax = av(az || {}, aA);
                if (ax) {
                  at += ax;
                }
              }
            }
          }
          return at;
        }
        function am(au) {
          var at;
          m = true;
          ag("unload");
          at = new Date();
          var av = at.getTimeAlias();
          if (r - av > 3000) {
            r = av + 3000;
          }
          if (r) {
            do {
              at = new Date();
            } while (at.getTimeAlias() < r);
          }
        }
        function o(av, au) {
          var at = J.createElement("script");
          at.type = "text/javascript";
          at.src = av;
          if (at.readyState) {
            at.onreadystatechange = function () {
              var aw = this.readyState;
              if (aw === "loaded" || aw === "complete") {
                at.onreadystatechange = null;
                au();
              }
            };
          } else {
            at.onload = au;
          }
          J.getElementsByTagName("head")[0].appendChild(at);
        }
        function N() {
          var at = "";
          try {
            at = W.top.document.referrer;
          } catch (av) {
            if (W.parent) {
              try {
                at = W.parent.document.referrer;
              } catch (au) {
                at = "";
              }
            }
          }
          if (at === "") {
            at = J.referrer;
          }
          return at;
        }
        function s(at) {
          var av = new RegExp("^([a-z]+):"),
            au = av.exec(at);
          return au ? au[1] : null;
        }
        function d(at) {
          var av = new RegExp("^(?:(?:https?|ftp):)/*(?:[^@]+@)?([^:/#]+)"),
            au = av.exec(at);
          return au ? au[1] : at;
        }
        function G(at) {
          return /^[0-9][0-9]*(\.[0-9]+)?$/.test(at);
        }
        function Q(av, aw) {
          var at = {},
            au;
          for (au in av) {
            if (av.hasOwnProperty(au) && aw(av[au])) {
              at[au] = av[au];
            }
          }
          return at;
        }
        function B(av) {
          var at = {},
            au;
          for (au in av) {
            if (av.hasOwnProperty(au)) {
              if (G(av[au])) {
                at[au] = Math.round(av[au]);
              } else {
                throw new Error('Parameter "' + au + '" provided value "' + av[au] + '" is not valid. Please provide a numeric value.');
              }
            }
          }
          return at;
        }
        function l(au) {
          var av = "",
            at;
          for (at in au) {
            if (au.hasOwnProperty(at)) {
              av += "&" + t(at) + "=" + t(au[at]);
            }
          }
          return av;
        }
        function an(au, at) {
          au = String(au);
          return au.lastIndexOf(at, 0) === 0;
        }
        function U(au, at) {
          au = String(au);
          return au.indexOf(at, au.length - at.length) !== -1;
        }
        function A(au, at) {
          au = String(au);
          return au.indexOf(at) !== -1;
        }
        function f(au, at) {
          au = String(au);
          return au.substr(0, au.length - at);
        }
        function I(aw, av, ay) {
          aw = String(aw);
          if (!ay) {
            ay = "";
          }
          var at = aw.indexOf("#");
          var az = aw.length;
          if (at === -1) {
            at = az;
          }
          var ax = aw.substr(0, at);
          var au = aw.substr(at, az - at);
          if (ax.indexOf("?") === -1) {
            ax += "?";
          } else {
            if (!U(ax, "?")) {
              ax += "&";
            }
          }
          return ax + t(av) + "=" + t(ay) + au;
        }
        function j(au, av) {
          au = String(au);
          if (au.indexOf("?" + av + "=") === -1 && au.indexOf("&" + av + "=") === -1) {
            return au;
          }
          var aw = au.indexOf("?");
          if (aw === -1) {
            return au;
          }
          var at = au.substr(aw + 1);
          var aA = au.substr(0, aw);
          if (at) {
            var aB = "";
            var aD = at.indexOf("#");
            if (aD !== -1) {
              aB = at.substr(aD + 1);
              at = at.substr(0, aD);
            }
            var ax;
            var az = at.split("&");
            var ay = az.length - 1;
            for (ay; ay >= 0; ay--) {
              ax = az[ay].split("=")[0];
              if (ax === av) {
                az.splice(ay, 1);
              }
            }
            var aC = az.join("&");
            if (aC) {
              aA = aA + "?" + aC;
            }
            if (aB) {
              aA += "#" + aB;
            }
          }
          return aA;
        }
        function e(av, au) {
          var at = "[\\?&#]" + au + "=([^&#]*)";
          var ax = new RegExp(at);
          var aw = ax.exec(av);
          return aw ? p(aw[1]) : "";
        }
        function a(at) {
          if (at && String(at) === at) {
            return at.replace(/^\s+|\s+$/g, "");
          }
          return at;
        }
        function F(at) {
          return unescape(t(at));
        }
        function aq(aI) {
          var av = function (aO, aN) {
            return (aO << aN) | (aO >>> (32 - aN));
          },
            aJ = function (aQ) {
              var aO = "",
                aP,
                aN;
              for (aP = 7; aP >= 0; aP--) {
                aN = (aQ >>> (aP * 4)) & 15;
                aO += aN.toString(16);
              }
              return aO;
            },
            ay,
            aL,
            aK,
            au = [],
            aC = 1732584193,
            aA = 4023233417,
            az = 2562383102,
            ax = 271733878,
            aw = 3285377520,
            aH,
            aG,
            aF,
            aE,
            aD,
            aM,
            at,
            aB = [];
          aI = F(aI);
          at = aI.length;
          for (aL = 0; aL < at - 3; aL += 4) {
            aK = (aI.charCodeAt(aL) << 24) | (aI.charCodeAt(aL + 1) << 16) | (aI.charCodeAt(aL + 2) << 8) | aI.charCodeAt(aL + 3);
            aB.push(aK);
          }
          switch (at & 3) {
            case 0:
              aL = 2147483648;
              break;
            case 1:
              aL = (aI.charCodeAt(at - 1) << 24) | 8388608;
              break;
            case 2:
              aL = (aI.charCodeAt(at - 2) << 24) | (aI.charCodeAt(at - 1) << 16) | 32768;
              break;
            case 3:
              aL = (aI.charCodeAt(at - 3) << 24) | (aI.charCodeAt(at - 2) << 16) | (aI.charCodeAt(at - 1) << 8) | 128;
              break;
          }
          aB.push(aL);
          while ((aB.length & 15) !== 14) {
            aB.push(0);
          }
          aB.push(at >>> 29);
          aB.push((at << 3) & 4294967295);
          for (ay = 0; ay < aB.length; ay += 16) {
            for (aL = 0; aL < 16; aL++) {
              au[aL] = aB[ay + aL];
            }
            for (aL = 16; aL <= 79; aL++) {
              au[aL] = av(au[aL - 3] ^ au[aL - 8] ^ au[aL - 14] ^ au[aL - 16], 1);
            }
            aH = aC;
            aG = aA;
            aF = az;
            aE = ax;
            aD = aw;
            for (aL = 0; aL <= 19; aL++) {
              aM = (av(aH, 5) + ((aG & aF) | (~aG & aE)) + aD + au[aL] + 1518500249) & 4294967295;
              aD = aE;
              aE = aF;
              aF = av(aG, 30);
              aG = aH;
              aH = aM;
            }
            for (aL = 20; aL <= 39; aL++) {
              aM = (av(aH, 5) + (aG ^ aF ^ aE) + aD + au[aL] + 1859775393) & 4294967295;
              aD = aE;
              aE = aF;
              aF = av(aG, 30);
              aG = aH;
              aH = aM;
            }
            for (aL = 40; aL <= 59; aL++) {
              aM = (av(aH, 5) + ((aG & aF) | (aG & aE) | (aF & aE)) + aD + au[aL] + 2400959708) & 4294967295;
              aD = aE;
              aE = aF;
              aF = av(aG, 30);
              aG = aH;
              aH = aM;
            }
            for (aL = 60; aL <= 79; aL++) {
              aM = (av(aH, 5) + (aG ^ aF ^ aE) + aD + au[aL] + 3395469782) & 4294967295;
              aD = aE;
              aE = aF;
              aF = av(aG, 30);
              aG = aH;
              aH = aM;
            }
            aC = (aC + aH) & 4294967295;
            aA = (aA + aG) & 4294967295;
            az = (az + aF) & 4294967295;
            ax = (ax + aE) & 4294967295;
            aw = (aw + aD) & 4294967295;
          }
          aM = aJ(aC) + aJ(aA) + aJ(az) + aJ(ax) + aJ(aw);
          return aM.toLowerCase();
        }
        function ae(av, at, au) {
          if (!av) {
            av = "";
          }
          if (!at) {
            at = "";
          }
          if (av === "translate.googleusercontent.com") {
            if (au === "") {
              au = at;
            }
            at = e(at, "u");
            av = d(at);
          } else {
            if (av === "cc.bingj.com" || av === "webcache.googleusercontent.com" || av.slice(0, 5) === "74.6.") {
              at = J.links[0].href;
              av = d(at);
            }
          }
          return [av, at, au];
        }
        function O(au) {
          var at = au.length;
          if (au.charAt(--at) === ".") {
            au = au.slice(0, at);
          }
          if (au.slice(0, 2) === "*.") {
            au = au.slice(1);
          }
          if (au.indexOf("/") !== -1) {
            au = au.substr(0, au.indexOf("/"));
          }
          return au;
        }
        function ap(au) {
          au = au && au.text ? au.text : au;
          if (!x(au)) {
            var at = J.getElementsByTagName("title");
            if (at && M(at[0])) {
              au = at[0].text;
            }
          }
          return au;
        }
        function S(at) {
          if (!at) {
            return [];
          }
          if (!M(at.children) && M(at.childNodes)) {
            return at.children;
          }
          if (M(at.children)) {
            return at.children;
          }
          return [];
        }
        function Y(au, at) {
          if (!au || !at) {
            return false;
          }
          if (au.contains) {
            return au.contains(at);
          }
          if (au === at) {
            return true;
          }
          if (au.compareDocumentPosition) {
            return !!(au.compareDocumentPosition(at) & 16);
          }
          return false;
        }
        function P(av, aw) {
          if (av && av.indexOf) {
            return av.indexOf(aw);
          }
          if (!M(av) || av === null) {
            return -1;
          }
          if (!av.length) {
            return -1;
          }
          var at = av.length;
          if (at === 0) {
            return -1;
          }
          var au = 0;
          while (au < at) {
            if (av[au] === aw) {
              return au;
            }
            au++;
          }
          return -1;
        }
        function i(av) {
          if (!av) {
            return false;
          }
          function at(ax, ay) {
            if (W.getComputedStyle) {
              return J.defaultView.getComputedStyle(ax, null)[ay];
            }
            if (ax.currentStyle) {
              return ax.currentStyle[ay];
            }
          }
          function aw(ax) {
            ax = ax.parentNode;
            while (ax) {
              if (ax === J) {
                return true;
              }
              ax = ax.parentNode;
            }
            return false;
          }
          function au(az, aF, ax, aC, aA, aD, aB) {
            var ay = az.parentNode,
              aE = 1;
            if (!aw(az)) {
              return false;
            }
            if (9 === ay.nodeType) {
              return true;
            }
            if ("0" === at(az, "opacity") || "none" === at(az, "display") || "hidden" === at(az, "visibility")) {
              return false;
            }
            if (!M(aF) || !M(ax) || !M(aC) || !M(aA) || !M(aD) || !M(aB)) {
              aF = az.offsetTop;
              aA = az.offsetLeft;
              aC = aF + az.offsetHeight;
              ax = aA + az.offsetWidth;
              aD = az.offsetWidth;
              aB = az.offsetHeight;
            }
            if (av === az && (0 === aB || 0 === aD) && "hidden" === at(az, "overflow")) {
              return false;
            }
            if (ay) {
              if ("hidden" === at(ay, "overflow") || "scroll" === at(ay, "overflow")) {
                if (aA + aE > ay.offsetWidth + ay.scrollLeft || aA + aD - aE < ay.scrollLeft || aF + aE > ay.offsetHeight + ay.scrollTop || aF + aB - aE < ay.scrollTop) {
                  return false;
                }
              }
              if (az.offsetParent === ay) {
                aA += ay.offsetLeft;
                aF += ay.offsetTop;
              }
              return au(ay, aF, ax, aC, aA, aD, aB);
            }
            return true;
          }
          return au(av);
        }
        var ai = {
          htmlCollectionToArray: function (av) {
            var at = [],
              au;
            if (!av || !av.length) {
              return at;
            }
            for (au = 0; au < av.length; au++) {
              at.push(av[au]);
            }
            return at;
          },
          find: function (at) {
            if (!document.querySelectorAll || !at) {
              return [];
            }
            var au = document.querySelectorAll(at);
            return this.htmlCollectionToArray(au);
          },
          findMultiple: function (av) {
            if (!av || !av.length) {
              return [];
            }
            var au, aw;
            var at = [];
            for (au = 0; au < av.length; au++) {
              aw = this.find(av[au]);
              at = at.concat(aw);
            }
            at = this.makeNodesUnique(at);
            return at;
          },
          findNodesByTagName: function (au, at) {
            if (!au || !at || !au.getElementsByTagName) {
              return [];
            }
            var av = au.getElementsByTagName(at);
            return this.htmlCollectionToArray(av);
          },
          makeNodesUnique: function (at) {
            var ay = [].concat(at);
            at.sort(function (aA, az) {
              if (aA === az) {
                return 0;
              }
              var aC = P(ay, aA);
              var aB = P(ay, az);
              if (aC === aB) {
                return 0;
              }
              return aC > aB ? -1 : 1;
            });
            if (at.length <= 1) {
              return at;
            }
            var au = 0;
            var aw = 0;
            var ax = [];
            var av;
            av = at[au++];
            while (av) {
              if (av === at[au]) {
                aw = ax.push(au);
              }
              av = at[au++] || null;
            }
            while (aw--) {
              at.splice(ax[aw], 1);
            }
            return at;
          },
          getAttributeValueFromNode: function (ax, av) {
            if (!this.hasNodeAttribute(ax, av)) {
              return;
            }
            if (ax && ax.getAttribute) {
              return ax.getAttribute(av);
            }
            if (!ax || !ax.attributes) {
              return;
            }
            var aw = typeof ax.attributes[av];
            if ("undefined" === aw) {
              return;
            }
            if (ax.attributes[av].value) {
              return ax.attributes[av].value;
            }
            if (ax.attributes[av].nodeValue) {
              return ax.attributes[av].nodeValue;
            }
            var au;
            var at = ax.attributes;
            if (!at) {
              return;
            }
            for (au = 0; au < at.length; au++) {
              if (at[au].nodeName === av) {
                return at[au].nodeValue;
              }
            }
            return null;
          },
          hasNodeAttributeWithValue: function (au, at) {
            var av = this.getAttributeValueFromNode(au, at);
            return !!av;
          },
          hasNodeAttribute: function (av, at) {
            if (av && av.hasAttribute) {
              return av.hasAttribute(at);
            }
            if (av && av.attributes) {
              var au = typeof av.attributes[at];
              return "undefined" !== au;
            }
            return false;
          },
          hasNodeCssClass: function (av, at) {
            if (av && at && av.className) {
              var au = typeof av.className === "string" ? av.className.split(" ") : [];
              if (-1 !== P(au, at)) {
                return true;
              }
            }
            return false;
          },
          findNodesHavingAttribute: function (ax, av, at) {
            if (!at) {
              at = [];
            }
            if (!ax || !av) {
              return at;
            }
            var aw = S(ax);
            if (!aw || !aw.length) {
              return at;
            }
            var au, ay;
            for (au = 0; au < aw.length; au++) {
              ay = aw[au];
              if (this.hasNodeAttribute(ay, av)) {
                at.push(ay);
              }
              at = this.findNodesHavingAttribute(ay, av, at);
            }
            return at;
          },
          findFirstNodeHavingAttribute: function (av, au) {
            if (!av || !au) {
              return;
            }
            if (this.hasNodeAttribute(av, au)) {
              return av;
            }
            var at = this.findNodesHavingAttribute(av, au);
            if (at && at.length) {
              return at[0];
            }
          },
          findFirstNodeHavingAttributeWithValue: function (aw, av) {
            if (!aw || !av) {
              return;
            }
            if (this.hasNodeAttributeWithValue(aw, av)) {
              return aw;
            }
            var at = this.findNodesHavingAttribute(aw, av);
            if (!at || !at.length) {
              return;
            }
            var au;
            for (au = 0; au < at.length; au++) {
              if (this.getAttributeValueFromNode(at[au], av)) {
                return at[au];
              }
            }
          },
          findNodesHavingCssClass: function (ax, aw, at) {
            if (!at) {
              at = [];
            }
            if (!ax || !aw) {
              return at;
            }
            if (ax.getElementsByClassName) {
              var ay = ax.getElementsByClassName(aw);
              return this.htmlCollectionToArray(ay);
            }
            var av = S(ax);
            if (!av || !av.length) {
              return [];
            }
            var au, az;
            for (au = 0; au < av.length; au++) {
              az = av[au];
              if (this.hasNodeCssClass(az, aw)) {
                at.push(az);
              }
              at = this.findNodesHavingCssClass(az, aw, at);
            }
            return at;
          },
          findFirstNodeHavingClass: function (av, au) {
            if (!av || !au) {
              return;
            }
            if (this.hasNodeCssClass(av, au)) {
              return av;
            }
            var at = this.findNodesHavingCssClass(av, au);
            if (at && at.length) {
              return at[0];
            }
          },
          isLinkElement: function (au) {
            if (!au) {
              return false;
            }
            var at = String(au.nodeName).toLowerCase();
            var aw = ["a", "area"];
            var av = P(aw, at);
            return av !== -1;
          },
          setAnyAttribute: function (au, at, av) {
            if (!au || !at) {
              return;
            }
            if (au.setAttribute) {
              au.setAttribute(at, av);
            } else {
              au[at] = av;
            }
          },
        };
        var w = {
          CONTENT_ATTR: "data-track-content",
          CONTENT_CLASS: "matomoTrackContent",
          LEGACY_CONTENT_CLASS: "piwikTrackContent",
          CONTENT_NAME_ATTR: "data-content-name",
          CONTENT_PIECE_ATTR: "data-content-piece",
          CONTENT_PIECE_CLASS: "matomoContentPiece",
          LEGACY_CONTENT_PIECE_CLASS: "piwikContentPiece",
          CONTENT_TARGET_ATTR: "data-content-target",
          CONTENT_TARGET_CLASS: "matomoContentTarget",
          LEGACY_CONTENT_TARGET_CLASS: "piwikContentTarget",
          CONTENT_IGNOREINTERACTION_ATTR: "data-content-ignoreinteraction",
          CONTENT_IGNOREINTERACTION_CLASS: "matomoContentIgnoreInteraction",
          LEGACY_CONTENT_IGNOREINTERACTION_CLASS: "piwikContentIgnoreInteraction",
          location: undefined,
          findContentNodes: function () {
            var au = "." + this.CONTENT_CLASS;
            var av = "." + this.LEGACY_CONTENT_CLASS;
            var at = "[" + this.CONTENT_ATTR + "]";
            var aw = ai.findMultiple([au, av, at]);
            return aw;
          },
          findContentNodesWithinNode: function (aw) {
            if (!aw) {
              return [];
            }
            var au = ai.findNodesHavingCssClass(aw, this.CONTENT_CLASS);
            au = ai.findNodesHavingCssClass(aw, this.LEGACY_CONTENT_CLASS, au);
            var at = ai.findNodesHavingAttribute(aw, this.CONTENT_ATTR);
            if (at && at.length) {
              var av;
              for (av = 0; av < at.length; av++) {
                au.push(at[av]);
              }
            }
            if (ai.hasNodeAttribute(aw, this.CONTENT_ATTR)) {
              au.push(aw);
            } else {
              if (ai.hasNodeCssClass(aw, this.CONTENT_CLASS)) {
                au.push(aw);
              } else {
                if (ai.hasNodeCssClass(aw, this.LEGACY_CONTENT_CLASS)) {
                  au.push(aw);
                }
              }
            }
            au = ai.makeNodesUnique(au);
            return au;
          },
          findParentContentNode: function (au) {
            if (!au) {
              return;
            }
            var av = au;
            var at = 0;
            while (av && av !== J && av.parentNode) {
              if (ai.hasNodeAttribute(av, this.CONTENT_ATTR)) {
                return av;
              }
              if (ai.hasNodeCssClass(av, this.CONTENT_CLASS)) {
                return av;
              }
              if (ai.hasNodeCssClass(av, this.LEGACY_CONTENT_CLASS)) {
                return av;
              }
              av = av.parentNode;
              if (at > 1000) {
                break;
              }
              at++;
            }
          },
          findPieceNode: function (au) {
            var at;
            at = ai.findFirstNodeHavingAttribute(au, this.CONTENT_PIECE_ATTR);
            if (!at) {
              at = ai.findFirstNodeHavingClass(au, this.CONTENT_PIECE_CLASS);
            }
            if (!at) {
              at = ai.findFirstNodeHavingClass(au, this.LEGACY_CONTENT_PIECE_CLASS);
            }
            if (at) {
              return at;
            }
            return au;
          },
          findTargetNodeNoDefault: function (at) {
            if (!at) {
              return;
            }
            var au = ai.findFirstNodeHavingAttributeWithValue(at, this.CONTENT_TARGET_ATTR);
            if (au) {
              return au;
            }
            au = ai.findFirstNodeHavingAttribute(at, this.CONTENT_TARGET_ATTR);
            if (au) {
              return au;
            }
            au = ai.findFirstNodeHavingClass(at, this.CONTENT_TARGET_CLASS);
            if (au) {
              return au;
            }
            au = ai.findFirstNodeHavingClass(at, this.LEGACY_CONTENT_TARGET_CLASS);
            if (au) {
              return au;
            }
          },
          findTargetNode: function (at) {
            var au = this.findTargetNodeNoDefault(at);
            if (au) {
              return au;
            }
            return at;
          },
          findContentName: function (au) {
            if (!au) {
              return;
            }
            var ax = ai.findFirstNodeHavingAttributeWithValue(au, this.CONTENT_NAME_ATTR);
            if (ax) {
              return ai.getAttributeValueFromNode(ax, this.CONTENT_NAME_ATTR);
            }
            var at = this.findContentPiece(au);
            if (at) {
              return this.removeDomainIfIsInLink(at);
            }
            if (ai.hasNodeAttributeWithValue(au, "title")) {
              return ai.getAttributeValueFromNode(au, "title");
            }
            var av = this.findPieceNode(au);
            if (ai.hasNodeAttributeWithValue(av, "title")) {
              return ai.getAttributeValueFromNode(av, "title");
            }
            var aw = this.findTargetNode(au);
            if (ai.hasNodeAttributeWithValue(aw, "title")) {
              return ai.getAttributeValueFromNode(aw, "title");
            }
          },
          findContentPiece: function (au) {
            if (!au) {
              return;
            }
            var aw = ai.findFirstNodeHavingAttributeWithValue(au, this.CONTENT_PIECE_ATTR);
            if (aw) {
              return ai.getAttributeValueFromNode(aw, this.CONTENT_PIECE_ATTR);
            }
            var at = this.findPieceNode(au);
            var av = this.findMediaUrlInNode(at);
            if (av) {
              return this.toAbsoluteUrl(av);
            }
          },
          findContentTarget: function (av) {
            if (!av) {
              return;
            }
            var aw = this.findTargetNode(av);
            if (ai.hasNodeAttributeWithValue(aw, this.CONTENT_TARGET_ATTR)) {
              return ai.getAttributeValueFromNode(aw, this.CONTENT_TARGET_ATTR);
            }
            var au;
            if (ai.hasNodeAttributeWithValue(aw, "href")) {
              au = ai.getAttributeValueFromNode(aw, "href");
              return this.toAbsoluteUrl(au);
            }
            var at = this.findPieceNode(av);
            if (ai.hasNodeAttributeWithValue(at, "href")) {
              au = ai.getAttributeValueFromNode(at, "href");
              return this.toAbsoluteUrl(au);
            }
          },
          isSameDomain: function (at) {
            if (!at || !at.indexOf) {
              return false;
            }
            if (0 === at.indexOf(this.getLocation().origin)) {
              return true;
            }
            var au = at.indexOf(this.getLocation().host);
            if (8 >= au && 0 <= au) {
              return true;
            }
            return false;
          },
          removeDomainIfIsInLink: function (av) {
            var au = "^https?://[^/]+";
            var at = "^.*//[^/]+";
            if (av && av.search && -1 !== av.search(new RegExp(au)) && this.isSameDomain(av)) {
              av = av.replace(new RegExp(at), "");
              if (!av) {
                av = "/";
              }
            }
            return av;
          },
          findMediaUrlInNode: function (ax) {
            if (!ax) {
              return;
            }
            var av = ["img", "embed", "video", "audio"];
            var at = ax.nodeName.toLowerCase();
            if (-1 !== P(av, at) && ai.findFirstNodeHavingAttributeWithValue(ax, "src")) {
              var aw = ai.findFirstNodeHavingAttributeWithValue(ax, "src");
              return ai.getAttributeValueFromNode(aw, "src");
            }
            if (at === "object" && ai.hasNodeAttributeWithValue(ax, "data")) {
              return ai.getAttributeValueFromNode(ax, "data");
            }
            if (at === "object") {
              var ay = ai.findNodesByTagName(ax, "param");
              if (ay && ay.length) {
                var au;
                for (au = 0; au < ay.length; au++) {
                  if ("movie" === ai.getAttributeValueFromNode(ay[au], "name") && ai.hasNodeAttributeWithValue(ay[au], "value")) {
                    return ai.getAttributeValueFromNode(ay[au], "value");
                  }
                }
              }
              var az = ai.findNodesByTagName(ax, "embed");
              if (az && az.length) {
                return this.findMediaUrlInNode(az[0]);
              }
            }
          },
          trim: function (at) {
            return a(at);
          },
          isOrWasNodeInViewport: function (ay) {
            if (!ay || !ay.getBoundingClientRect || ay.nodeType !== 1) {
              return true;
            }
            var ax = ay.getBoundingClientRect();
            var aw = J.documentElement || {};
            var av = ax.top < 0;
            if (av && ay.offsetTop) {
              av = ay.offsetTop + ax.height > 0;
            }
            var au = aw.clientWidth;
            if (W.innerWidth && au > W.innerWidth) {
              au = W.innerWidth;
            }
            var at = aw.clientHeight;
            if (W.innerHeight && at > W.innerHeight) {
              at = W.innerHeight;
            }
            return (ax.bottom > 0 || av) && ax.right > 0 && ax.left < au && (ax.top < at || av);
          },
          isNodeVisible: function (au) {
            var at = i(au);
            var av = this.isOrWasNodeInViewport(au);
            return at && av;
          },
          buildInteractionRequestParams: function (at, au, av, aw) {
            var ax = "";
            if (at) {
              ax += "c_i=" + t(at);
            }
            if (au) {
              if (ax) {
                ax += "&";
              }
              ax += "c_n=" + t(au);
            }
            if (av) {
              if (ax) {
                ax += "&";
              }
              ax += "c_p=" + t(av);
            }
            if (aw) {
              if (ax) {
                ax += "&";
              }
              ax += "c_t=" + t(aw);
            }
            if (ax) {
              ax += "&ca=1";
            }
            return ax;
          },
          buildImpressionRequestParams: function (at, au, av) {
            var aw = "c_n=" + t(at) + "&c_p=" + t(au);
            if (av) {
              aw += "&c_t=" + t(av);
            }
            if (aw) {
              aw += "&ca=1";
            }
            return aw;
          },
          buildContentBlock: function (av) {
            if (!av) {
              return;
            }
            var at = this.findContentName(av);
            var au = this.findContentPiece(av);
            var aw = this.findContentTarget(av);
            at = this.trim(at);
            au = this.trim(au);
            aw = this.trim(aw);
            return { name: at || "Unknown", piece: au || "Unknown", target: aw || "" };
          },
          collectContent: function (aw) {
            if (!aw || !aw.length) {
              return [];
            }
            var av = [];
            var at, au;
            for (at = 0; at < aw.length; at++) {
              au = this.buildContentBlock(aw[at]);
              if (M(au)) {
                av.push(au);
              }
            }
            return av;
          },
          setLocation: function (at) {
            this.location = at;
          },
          getLocation: function () {
            var at = this.location || W.location;
            if (!at.origin) {
              at.origin = at.protocol + "//" + at.hostname + (at.port ? ":" + at.port : "");
            }
            return at;
          },
          toAbsoluteUrl: function (au) {
            if ((!au || String(au) !== au) && au !== "") {
              return au;
            }
            if ("" === au) {
              return this.getLocation().href;
            }
            if (au.search(/^\/\//) !== -1) {
              return this.getLocation().protocol + au;
            }
            if (au.search(/:\/\//) !== -1) {
              return au;
            }
            if (0 === au.indexOf("#")) {
              return this.getLocation().origin + this.getLocation().pathname + au;
            }
            if (0 === au.indexOf("?")) {
              return this.getLocation().origin + this.getLocation().pathname + au;
            }
            if (0 === au.search("^[a-zA-Z]{2,11}:")) {
              return au;
            }
            if (au.search(/^\//) !== -1) {
              return this.getLocation().origin + au;
            }
            var at = "(.*/)";
            var av = this.getLocation().origin + this.getLocation().pathname.match(new RegExp(at))[0];
            return av + au;
          },
          isUrlToCurrentDomain: function (au) {
            var av = this.toAbsoluteUrl(au);
            if (!av) {
              return false;
            }
            var at = this.getLocation().origin;
            if (at === av) {
              return true;
            }
            if (0 === String(av).indexOf(at)) {
              if (":" === String(av).substr(at.length, 1)) {
                return false;
              }
              return true;
            }
            return false;
          },
          setHrefAttribute: function (au, at) {
            if (!au || !at) {
              return;
            }
            ai.setAnyAttribute(au, "href", at);
          },
          shouldIgnoreInteraction: function (at) {
            if (ai.hasNodeAttribute(at, this.CONTENT_IGNOREINTERACTION_ATTR)) {
              return true;
            }
            if (ai.hasNodeCssClass(at, this.CONTENT_IGNOREINTERACTION_CLASS)) {
              return true;
            }
            if (ai.hasNodeCssClass(at, this.LEGACY_CONTENT_IGNOREINTERACTION_CLASS)) {
              return true;
            }
            return false;
          },
        };
        function aa(au, ax) {
          if (ax) {
            return ax;
          }
          au = w.toAbsoluteUrl(au);
          if (A(au, "?")) {
            var aw = au.indexOf("?");
            au = au.slice(0, aw);
          }
          if (U(au, "matomo.php")) {
            au = f(au, "matomo.php".length);
          } else {
            if (U(au, "piwik.php")) {
              au = f(au, "piwik.php".length);
            } else {
              if (U(au, ".php")) {
                var at = au.lastIndexOf("/");
                var av = 1;
                au = au.slice(0, at + av);
              }
            }
          }
          if (U(au, "/js/")) {
            au = f(au, "js/".length);
          }
          return au;
        }
        function R(az) {
          var aB = "Matomo_Overlay";
          var au = new RegExp("index\\.php\\?module=Overlay&action=startOverlaySession&idSite=([0-9]+)&period=([^&]+)&date=([^&]+)(&segment=[^&]*)?");
          var av = au.exec(J.referrer);
          if (av) {
            var ax = av[1];
            if (ax !== String(az)) {
              return false;
            }
            var ay = av[2],
              at = av[3],
              aw = av[4];
            if (!aw) {
              aw = "";
            } else {
              if (aw.indexOf("&segment=") === 0) {
                aw = aw.substr("&segment=".length);
              }
            }
            W.name = aB + "###" + ay + "###" + at + "###" + aw;
          }
          var aA = W.name.split("###");
          return aA.length === 4 && aA[0] === aB;
        }
        function ad(au, az, av) {
          var ay = W.name.split("###"),
            ax = ay[1],
            at = ay[2],
            aw = ay[3],
            aA = aa(au, az);
          o(aA + "plugins/Overlay/client/client.js?v=1", function () {
            Matomo_Overlay_Client.initialize(aA, av, ax, at, aw);
          });
        }
        function v() {
          var av;
          try {
            av = W.frameElement;
          } catch (au) {
            return true;
          }
          if (M(av)) {
            return av && String(av.nodeName).toLowerCase() === "iframe" ? true : false;
          }
          try {
            return W.self !== W.top;
          } catch (at) {
            return true;
          }
        }
        function T(co, ci) {
          var bR = this,
            bk = "mtm_consent",
            cT = "mtm_cookie_consent",
            c2 = "mtm_consent_removed",
            cd = ae(J.domain, W.location.href, N()),
            da = O(cd[0]),
            bW = p(cd[1]),
            bw = p(cd[2]),
            c8 = false,
            cs = "GET",
            dt = cs,
            aM = "application/x-www-form-urlencoded; charset=UTF-8",
            cL = aM,
            aI = co || "",
            bQ = "",
            dh = "",
            cy = "",
            cf = ci || "",
            bH = "",
            bX = "",
            bb,
            bq = "",
            dp = [
              "7z",
              "aac",
              "apk",
              "arc",
              "arj",
              "asf",
              "asx",
              "avi",
              "azw3",
              "bin",
              "csv",
              "deb",
              "dmg",
              "doc",
              "docx",
              "epub",
              "exe",
              "flv",
              "gif",
              "gz",
              "gzip",
              "hqx",
              "ibooks",
              "jar",
              "jpg",
              "jpeg",
              "js",
              "mobi",
              "mp2",
              "mp3",
              "mp4",
              "mpg",
              "mpeg",
              "mov",
              "movie",
              "msi",
              "msp",
              "odb",
              "odf",
              "odg",
              "ods",
              "odt",
              "ogg",
              "ogv",
              "pdf",
              "phps",
              "png",
              "ppt",
              "pptx",
              "qt",
              "qtm",
              "ra",
              "ram",
              "rar",
              "rpm",
              "rtf",
              "sea",
              "sit",
              "tar",
              "tbz",
              "tbz2",
              "bz",
              "bz2",
              "tgz",
              "torrent",
              "txt",
              "wav",
              "wma",
              "wmv",
              "wpd",
              "xls",
              "xlsx",
              "xml",
              "z",
              "zip",
            ],
            aC = [da],
            bI = [],
            cM = [".paypal.com"],
            ct = [],
            bU = [],
            bf = [],
            bS = 500,
            dd = true,
            cZ,
            bc,
            b0,
            bY,
            at,
            cC = ["pk_campaign", "mtm_campaign", "piwik_campaign", "matomo_campaign", "utm_campaign", "utm_source", "utm_medium"],
            bP = ["pk_kwd", "mtm_kwd", "piwik_kwd", "matomo_kwd", "utm_term"],
            br = "_pk_",
            az = "pk_vid",
            a6 = 180,
            df,
            by,
            b1 = false,
            aN = "Lax",
            bt = false,
            c6,
            bl,
            bE,
            c0 = 33955200000,
            cz = 1800000,
            dn = 15768000000,
            a9 = true,
            bN = false,
            bo = false,
            bZ = false,
            aV = false,
            cl,
            b5 = {},
            cx = {},
            bv = {},
            bC = 200,
            cH = {},
            di = {},
            dq = {},
            aZ = {},
            cj = [],
            bu = false,
            ck = [],
            cp = false,
            cR = false,
            au = false,
            dr = false,
            c3 = false,
            aS = false,
            bj = v(),
            cN = null,
            dg = null,
            aW,
            bK,
            cg = aq,
            bx,
            aQ,
            bJ = false,
            cE = 0,
            bD = ["id", "ses", "cvar", "ref"],
            cQ = false,
            bL = null,
            c1 = [],
            cG = [],
            aB = X++,
            aA = false,
            de = true;
          try {
            bq = J.title;
          } catch (cO) {
            bq = "";
          }
          function aH(dE) {
            if (bt && dE !== c2) {
              return 0;
            }
            var dC = new RegExp("(^|;)[ ]*" + dE + "=([^;]*)"),
              dD = dC.exec(J.cookie);
            return dD ? V(dD[2]) : 0;
          }
          bL = !aH(c2);
          function dx(dG, dH, dK, dJ, dE, dF, dI) {
            if (bt && dG !== c2) {
              return;
            }
            var dD;
            if (dK) {
              dD = new Date();
              dD.setTime(dD.getTime() + dK);
            }
            if (!dI) {
              dI = "Lax";
            }
            J.cookie = dG + "=" + t(dH) + (dK ? ";expires=" + dD.toGMTString() : "") + ";path=" + (dJ || "/") + (dE ? ";domain=" + dE : "") + (dF ? ";secure" : "") + ";SameSite=" + dI;
            if ((!dK || dK >= 0) && aH(dG) !== String(dH)) {
              var dC = "There was an error setting cookie `" + dG + "`. Please check domain and path.";
              ao(dC);
            }
          }
          function cb(dC) {
            var dE, dD;
            dC = j(dC, az);
            dC = j(dC, "ignore_referrer");
            dC = j(dC, "ignore_referer");
            for (dD = 0; dD < ct.length; dD++) {
              dC = j(dC, ct[dD]);
            }
            if (bY) {
              dE = new RegExp("#.*");
              return dC.replace(dE, "");
            }
            return dC;
          }
          function b4(dE, dC) {
            var dF = s(dC),
              dD;
            if (dF) {
              return dC;
            }
            if (dC.slice(0, 1) === "/") {
              return s(dE) + "://" + d(dE) + dC;
            }
            dE = cb(dE);
            dD = dE.indexOf("?");
            if (dD >= 0) {
              dE = dE.slice(0, dD);
            }
            dD = dE.lastIndexOf("/");
            if (dD !== dE.length - 1) {
              dE = dE.slice(0, dD + 1);
            }
            return dE + dC;
          }
          function cX(dE, dC) {
            var dD;
            dE = String(dE).toLowerCase();
            dC = String(dC).toLowerCase();
            if (dE === dC) {
              return true;
            }
            if (dC.slice(0, 1) === ".") {
              if (dE === dC.slice(1)) {
                return true;
              }
              dD = dE.length - dC.length;
              if (dD > 0 && dE.slice(dD) === dC) {
                return true;
              }
            }
            return false;
          }
          function cw(dC) {
            var dD = document.createElement("a");
            if (dC.indexOf("//") !== 0 && dC.indexOf("http") !== 0) {
              if (dC.indexOf("*") === 0) {
                dC = dC.substr(1);
              }
              if (dC.indexOf(".") === 0) {
                dC = dC.substr(1);
              }
              dC = "http://" + dC;
            }
            dD.href = w.toAbsoluteUrl(dC);
            if (dD.pathname) {
              return dD.pathname;
            }
            return "";
          }
          function ba(dD, dC) {
            if (!an(dC, "/")) {
              dC = "/" + dC;
            }
            if (!an(dD, "/")) {
              dD = "/" + dD;
            }
            var dE = dC === "/" || dC === "/*";
            if (dE) {
              return true;
            }
            if (dD === dC) {
              return true;
            }
            dC = String(dC).toLowerCase();
            dD = String(dD).toLowerCase();
            if (U(dC, "*")) {
              dC = dC.slice(0, -1);
              dE = !dC || dC === "/";
              if (dE) {
                return true;
              }
              if (dD === dC) {
                return true;
              }
              return dD.indexOf(dC) === 0;
            }
            if (!U(dD, "/")) {
              dD += "/";
            }
            if (!U(dC, "/")) {
              dC += "/";
            }
            return dD.indexOf(dC) === 0;
          }
          function aw(dG, dI) {
            var dD, dC, dE, dF, dH;
            for (dD = 0; dD < aC.length; dD++) {
              dF = O(aC[dD]);
              dH = cw(aC[dD]);
              if (cX(dG, dF) && ba(dI, dH)) {
                return true;
              }
            }
            return false;
          }
          function a2(dF) {
            var dD, dC, dE;
            for (dD = 0; dD < aC.length; dD++) {
              dC = O(aC[dD].toLowerCase());
              if (dF === dC) {
                return true;
              }
              if (dC.slice(0, 1) === ".") {
                if (dF === dC.slice(1)) {
                  return true;
                }
                dE = dF.length - dC.length;
                if (dE > 0 && dF.slice(dE) === dC) {
                  return true;
                }
              }
            }
            return false;
          }
          function cD(dC) {
            var dD, dF, dH, dE, dG;
            if (!dC.length || !cM.length) {
              return false;
            }
            dF = d(dC);
            dH = cw(dC);
            if (dF.indexOf("www.") === 0) {
              dF = dF.substr(4);
            }
            for (dD = 0; dD < cM.length; dD++) {
              dE = O(cM[dD]);
              dG = cw(cM[dD]);
              if (dE.indexOf("www.") === 0) {
                dE = dE.substr(4);
              }
              if (cX(dF, dE) && ba(dH, dG)) {
                return true;
              }
            }
            return false;
          }
          function cA(dC, dE) {
            dC = dC.replace("send_image=0", "send_image=1");
            var dD = new Image(1, 1);
            dD.onload = function () {
              H = 0;
              if (typeof dE === "function") {
                dE({ request: dC, trackerUrl: aI, success: true });
              }
            };
            dD.onerror = function () {
              if (typeof dE === "function") {
                dE({ request: dC, trackerUrl: aI, success: false });
              }
            };
            dD.src = aI + (aI.indexOf("?") < 0 ? "?" : "&") + dC;
          }
          function cU(dC) {
            if (dt === "POST") {
              return true;
            }
            return dC && (dC.length > 2000 || dC.indexOf('{"requests"') === 0);
          }
          function aP() {
            return "object" === typeof g && "function" === typeof g.sendBeacon && "function" === typeof Blob;
          }
          function bd(dG, dJ, dI) {
            var dE = aP();
            if (!dE) {
              return false;
            }
            var dF = { type: "application/x-www-form-urlencoded; charset=UTF-8" };
            var dK = false;
            var dD = aI;
            try {
              var dC = new Blob([dG], dF);
              if (dI && !cU(dG)) {
                dC = new Blob([], dF);
                dD = dD + (dD.indexOf("?") < 0 ? "?" : "&") + dG;
              }
              dK = g.sendBeacon(dD, dC);
            } catch (dH) {
              return false;
            }
            if (dK && typeof dJ === "function") {
              dJ({ request: dG, trackerUrl: aI, success: true, isSendBeacon: true });
            }
            return dK;
          }
          function dm(dD, dE, dC) {
            if (!M(dC) || null === dC) {
              dC = true;
            }
            if (m && bd(dD, dE, dC)) {
              return;
            }
            setTimeout(function () {
              if (m && bd(dD, dE, dC)) {
                return;
              }
              var dH;
              try {
                var dG = W.XMLHttpRequest ? new W.XMLHttpRequest() : W.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : null;
                dG.open("POST", aI, true);
                dG.onreadystatechange = function () {
                  if (this.readyState === 4 && !(this.status >= 200 && this.status < 300)) {
                    var dI = m && bd(dD, dE, dC);
                    if (!dI && dC) {
                      cA(dD, dE);
                    } else {
                      if (typeof dE === "function") {
                        dE({ request: dD, trackerUrl: aI, success: false, xhr: this });
                      }
                    }
                  } else {
                    if (this.readyState === 4 && typeof dE === "function") {
                      dE({ request: dD, trackerUrl: aI, success: true, xhr: this });
                    }
                  }
                };
                dG.setRequestHeader("Content-Type", cL);
                dG.withCredentials = true;
                dG.send(dD);
              } catch (dF) {
                dH = m && bd(dD, dE, dC);
                if (!dH && dC) {
                  cA(dD, dE);
                } else {
                  if (typeof dE === "function") {
                    dE({ request: dD, trackerUrl: aI, success: false });
                  }
                }
              }
            }, 50);
          }
          function cq(dD) {
            var dC = new Date();
            var dE = dC.getTime() + dD;
            if (!r || dE > r) {
              r = dE;
            }
          }
          function bh() {
            bj = true;
            cN = new Date().getTime();
          }
          function dw() {
            var dC = new Date().getTime();
            return !cN || dC - cN > bc;
          }
          function aD() {
            if (dw()) {
              b0();
            }
          }
          function a1() {
            if (J.visibilityState === "hidden" && dw()) {
              b0();
            } else {
              if (J.visibilityState === "visible") {
                cN = new Date().getTime();
              }
            }
          }
          function dz() {
            if (aS || !bc) {
              return;
            }
            aS = true;
            ar(W, "focus", bh);
            ar(W, "blur", aD);
            ar(W, "visibilitychange", a1);
            af++;
            u.addPlugin("HeartBeat" + af, {
              unload: function () {
                if (aS && dw()) {
                  b0();
                }
              },
            });
          }
          function cS(dG) {
            var dD = new Date();
            var dC = dD.getTime();
            dg = dC;
            if (cR && dC < cR) {
              var dE = cR - dC;
              setTimeout(dG, dE);
              cq(dE + 50);
              cR += 50;
              return;
            }
            if (cR === false) {
              var dF = 800;
              cR = dC + dF;
            }
            dG();
          }
          function aT() {
            if (aH(c2)) {
              bL = false;
            } else {
              if (aH(bk)) {
                bL = true;
              }
            }
          }
          function bT(dE) {
            if (!aZ) {
              return dE;
            }
            var dD,
              dC = "&uadata=" + t(W.JSON.stringify(aZ));
            if (dE instanceof Array) {
              for (dD = 0; dD < dE.length; dD++) {
                dE[dD] += dC;
              }
            } else {
              dE += dC;
            }
            return dE;
          }
          function cB(dC) {
            if (!de || !M(g.userAgentData) || !C(g.userAgentData.getHighEntropyValues)) {
              dC();
              return;
            }
            aZ = { brands: g.userAgentData.brands, platform: g.userAgentData.platform };
            g.userAgentData.getHighEntropyValues(["brands", "model", "platform", "platformVersion", "uaFullVersion", "fullVersionList"]).then(
              function (dE) {
                var dD;
                if (dE.fullVersionList) {
                  delete dE.brands;
                  delete dE.uaFullVersion;
                }
                aZ = dE;
                dC();
              },
              function (dD) {
                dC();
              }
            );
          }
          function bO(dD, dC, dE) {
            if (!bu) {
              cj.push(dD);
              return;
            }
            aT();
            if (!bL) {
              c1.push(dD);
              return;
            }
            aA = true;
            if (!c6 && dD) {
              if (cQ && bL) {
                dD += "&consent=1";
              }
              dD = bT(dD);
              cS(function () {
                if (dd && bd(dD, dE, true)) {
                  cq(100);
                  return;
                }
                if (cU(dD)) {
                  dm(dD, dE);
                } else {
                  cA(dD, dE);
                }
                cq(dC);
              });
            }
            if (!aS) {
              dz();
            }
          }
          function cv(dC) {
            if (c6) {
              return false;
            }
            return dC && dC.length;
          }
          function dl(dC, dG) {
            if (!dG || dG >= dC.length) {
              return [dC];
            }
            var dD = 0;
            var dE = dC.length;
            var dF = [];
            for (dD; dD < dE; dD += dG) {
              dF.push(dC.slice(dD, dD + dG));
            }
            return dF;
          }
          function dy(dD, dC) {
            if (!cv(dD)) {
              return;
            }
            if (!bu) {
              cj.push(dD);
              return;
            }
            if (!bL) {
              c1.push(dD);
              return;
            }
            aA = true;
            cS(function () {
              var dG = dl(dD, 50);
              var dE = 0,
                dF;
              for (dE; dE < dG.length; dE++) {
                dF = '{"requests":["?' + bT(dG[dE]).join('","?') + '"],"send_image":0}';
                if (dd && bd(dF, null, false)) {
                  cq(100);
                } else {
                  dm(dF, null, false);
                }
              }
              cq(dC);
            });
          }
          function aY(dC) {
            return br + dC + "." + cf + "." + bx;
          }
          function b8(dE, dD, dC) {
            dx(dE, "", -129600000, dD, dC);
          }
          function ce() {
            if (bt) {
              return "0";
            }
            if (!M(W.showModalDialog) && M(g.cookieEnabled)) {
              return g.cookieEnabled ? "1" : "0";
            }
            var dC = br + "testcookie";
            dx(dC, "1", undefined, by, df, b1, aN);
            var dD = aH(dC) === "1" ? "1" : "0";
            b8(dC);
            return dD;
          }
          function bp() {
            bx = cg((df || da) + (by || "/")).slice(0, 4);
          }
          function cY() {
            cB(function () {
              var dI, dH;
              bu = true;
              for (dI = 0; dI < cj.length; dI++) {
                dH = typeof cj[dI];
                if (dH === "string") {
                  bO(cj[dI], bS);
                } else {
                  if (dH === "object") {
                    dy(cj[dI], bS);
                  }
                }
              }
              cj = [];
            });
            if (!de) {
              return {};
            }
            if (M(dq.res)) {
              return dq;
            }
            var dD,
              dF,
              dG = {
                pdf: "application/pdf",
                qt: "video/quicktime",
                realp: "audio/x-pn-realaudio-plugin",
                wma: "application/x-mplayer2",
                fla: "application/x-shockwave-flash",
                java: "application/x-java-vm",
                ag: "application/x-silverlight",
              };
            if (!new RegExp("MSIE").test(g.userAgent)) {
              if (g.mimeTypes && g.mimeTypes.length) {
                for (dD in dG) {
                  if (Object.prototype.hasOwnProperty.call(dG, dD)) {
                    dF = g.mimeTypes[dG[dD]];
                    dq[dD] = dF && dF.enabledPlugin ? "1" : "0";
                  }
                }
              }
              if (!new RegExp("Edge[ /](\\d+[\\.\\d]+)").test(g.userAgent) && typeof navigator.javaEnabled !== "unknown" && M(g.javaEnabled) && g.javaEnabled()) {
                dq.java = "1";
              }
              if (!M(W.showModalDialog) && M(g.cookieEnabled)) {
                dq.cookie = g.cookieEnabled ? "1" : "0";
              } else {
                dq.cookie = ce();
              }
            }
            var dE = parseInt(ab.width, 10);
            var dC = parseInt(ab.height, 10);
            dq.res = parseInt(dE, 10) + "x" + parseInt(dC, 10);
            return dq;
          }
          function b6() {
            var dD = aY("cvar"),
              dC = aH(dD);
            if (dC && dC.length) {
              dC = W.JSON.parse(dC);
              if (Z(dC)) {
                return dC;
              }
            }
            return {};
          }
          function cV() {
            if (aV === false) {
              aV = b6();
            }
          }
          function c7() {
            var dC = cY();
            return cg((g.userAgent || "") + (g.platform || "") + W.JSON.stringify(dC) + new Date().getTime() + Math.random()).slice(0, 16);
          }
          function aF() {
            var dC = cY();
            return cg((g.userAgent || "") + (g.platform || "") + W.JSON.stringify(dC)).slice(0, 6);
          }
          function bm() {
            return Math.floor(new Date().getTime() / 1000);
          }
          function aO() {
            var dD = bm();
            var dE = aF();
            var dC = String(dD) + dE;
            return dC;
          }
          function dk(dE) {
            dE = String(dE);
            var dH = aF();
            var dF = dH.length;
            var dG = dE.substr(-1 * dF, dF);
            var dD = parseInt(dE.substr(0, dE.length - dF), 10);
            if (dD && dG && dG === dH) {
              var dC = bm();
              if (a6 <= 0) {
                return true;
              }
              if (dC >= dD && dC <= dD + a6) {
                return true;
              }
            }
            return false;
          }
          function dA(dC) {
            if (!c3) {
              return "";
            }
            var dG = e(dC, az);
            if (!dG) {
              return "";
            }
            dG = String(dG);
            var dE = new RegExp("^[a-zA-Z0-9]+$");
            if (dG.length === 32 && dE.test(dG)) {
              var dD = dG.substr(16, 32);
              if (dk(dD)) {
                var dF = dG.substr(0, 16);
                return dF;
              }
            }
            return "";
          }
          function c4() {
            if (!bX) {
              bX = dA(bW);
            }
            var dE = new Date(),
              dC = Math.round(dE.getTime() / 1000),
              dD = aY("id"),
              dH = aH(dD),
              dG,
              dF;
            if (dH) {
              dG = dH.split(".");
              dG.unshift("0");
              if (bX.length) {
                dG[1] = bX;
              }
              return dG;
            }
            if (bX.length) {
              dF = bX;
            } else {
              if ("0" === ce()) {
                dF = "";
              } else {
                dF = c7();
              }
            }
            dG = ["1", dF, dC];
            return dG;
          }
          function a5() {
            var dF = c4(),
              dD = dF[0],
              dE = dF[1],
              dC = dF[2];
            return { newVisitor: dD, uuid: dE, createTs: dC };
          }
          function aL() {
            var dF = new Date(),
              dD = dF.getTime(),
              dG = a5().createTs;
            var dC = parseInt(dG, 10);
            var dE = dC * 1000 + c0 - dD;
            return dE;
          }
          function aR(dC) {
            if (!cf) {
              return;
            }
            var dE = new Date(),
              dD = Math.round(dE.getTime() / 1000);
            if (!M(dC)) {
              dC = a5();
            }
            var dF = dC.uuid + "." + dC.createTs + ".";
            dx(aY("id"), dF, aL(), by, df, b1, aN);
          }
          function bV() {
            var dC = aH(aY("ref"));
            if (dC.length) {
              try {
                dC = W.JSON.parse(dC);
                if (Z(dC)) {
                  return dC;
                }
              } catch (dD) { }
            }
            return ["", "", 0, ""];
          }
          function bF(dE) {
            var dD = br + "testcookie_domain";
            var dC = "testvalue";
            dx(dD, dC, 10000, null, dE, b1, aN);
            if (aH(dD) === dC) {
              b8(dD, null, dE);
              return true;
            }
            return false;
          }
          function aJ() {
            var dD = bt;
            bt = false;
            var dC, dE;
            for (dC = 0; dC < bD.length; dC++) {
              dE = aY(bD[dC]);
              if (dE !== c2 && dE !== bk && 0 !== aH(dE)) {
                b8(dE, by, df);
              }
            }
            bt = dD;
          }
          function cc(dC) {
            cf = dC;
          }
          function dB(dG) {
            if (!dG || !Z(dG)) {
              return;
            }
            var dF = [];
            var dE;
            for (dE in dG) {
              if (Object.prototype.hasOwnProperty.call(dG, dE)) {
                dF.push(dE);
              }
            }
            var dH = {};
            dF.sort();
            var dC = dF.length;
            var dD;
            for (dD = 0; dD < dC; dD++) {
              dH[dF[dD]] = dG[dF[dD]];
            }
            return dH;
          }
          function cn() {
            dx(aY("ses"), "1", cz, by, df, b1, aN);
          }
          function bn() {
            var dF = "";
            var dD = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            var dE = dD.length;
            var dC;
            for (dC = 0; dC < 6; dC++) {
              dF += dD.charAt(Math.floor(Math.random() * dE));
            }
            return dF;
          }
          function aE(dD) {
            if (cy !== "") {
              dD += cy;
              bo = true;
              return dD;
            }
            if (!h) {
              return dD;
            }
            var dE = typeof h.timing === "object" && h.timing ? h.timing : undefined;
            if (!dE) {
              dE = typeof h.getEntriesByType === "function" && h.getEntriesByType("navigation") ? h.getEntriesByType("navigation")[0] : undefined;
            }
            if (!dE) {
              return dD;
            }
            var dC = "";
            if (dE.connectEnd && dE.fetchStart) {
              if (dE.connectEnd < dE.fetchStart) {
                return dD;
              }
              dC += "&pf_net=" + Math.round(dE.connectEnd - dE.fetchStart);
            }
            if (dE.responseStart && dE.requestStart) {
              if (dE.responseStart < dE.requestStart) {
                return dD;
              }
              dC += "&pf_srv=" + Math.round(dE.responseStart - dE.requestStart);
            }
            if (dE.responseStart && dE.responseEnd) {
              if (dE.responseEnd < dE.responseStart) {
                return dD;
              }
              dC += "&pf_tfr=" + Math.round(dE.responseEnd - dE.responseStart);
            }
            if (M(dE.domLoading)) {
              if (dE.domInteractive && dE.domLoading) {
                if (dE.domInteractive < dE.domLoading) {
                  return dD;
                }
                dC += "&pf_dm1=" + Math.round(dE.domInteractive - dE.domLoading);
              }
            } else {
              if (dE.domInteractive && dE.responseEnd) {
                if (dE.domInteractive < dE.responseEnd) {
                  return dD;
                }
                dC += "&pf_dm1=" + Math.round(dE.domInteractive - dE.responseEnd);
              }
            }
            if (dE.domComplete && dE.domInteractive) {
              if (dE.domComplete < dE.domInteractive) {
                return dD;
              }
              dC += "&pf_dm2=" + Math.round(dE.domComplete - dE.domInteractive);
            }
            if (dE.loadEventEnd && dE.loadEventStart) {
              if (dE.loadEventEnd < dE.loadEventStart) {
                return dD;
              }
              dC += "&pf_onl=" + Math.round(dE.loadEventEnd - dE.loadEventStart);
            }
            return dD + dC;
          }
          function cm(dC) {
            return e(dC, "ignore_referrer") === "1" || e(dC, "ignore_referer") === "1";
          }
          function ds() {
            var dM,
              dF = new Date(),
              dG = Math.round(dF.getTime() / 1000),
              dR,
              dE,
              dH = 1024,
              dO,
              dI,
              dD = aY("ses"),
              dL = aY("ref"),
              dK = aH(dD),
              dC = bV(),
              dQ = bb || bW,
              dN,
              dJ,
              dP = {};
            dN = dC[0];
            dJ = dC[1];
            dR = dC[2];
            dE = dC[3];
            if (!cm(dQ) && !dK) {
              if (!bE || !dN.length) {
                for (dM in cC) {
                  if (Object.prototype.hasOwnProperty.call(cC, dM)) {
                    dN = e(dQ, cC[dM]);
                    if (dN.length) {
                      break;
                    }
                  }
                }
                for (dM in bP) {
                  if (Object.prototype.hasOwnProperty.call(bP, dM)) {
                    dJ = e(dQ, bP[dM]);
                    if (dJ.length) {
                      break;
                    }
                  }
                }
              }
              dO = d(bw);
              dI = dE.length ? d(dE) : "";
              if (dO.length && !a2(dO) && !cD(bw) && (!bE || !dI.length || a2(dI) || cD(dE))) {
                dE = bw;
              }
              if (dE.length || dN.length) {
                dR = dG;
                dC = [dN, dJ, dR, cb(dE.slice(0, dH))];
                dx(dL, W.JSON.stringify(dC), dn, by, df, b1, aN);
              }
            }
            if (dN.length) {
              dP._rcn = t(dN);
            }
            if (dJ.length) {
              dP._rck = t(dJ);
            }
            dP._refts = dR;
            if (String(dE).length) {
              dP._ref = t(cb(dE.slice(0, dH)));
            }
            return dP;
          }
          function cF(dD, dP, dQ) {
            var dO,
              dC = new Date(),
              dN = aV,
              dJ = aY("cvar"),
              dR = bb || bW,
              dE = cm(dR);
            if (bt) {
              aJ();
            }
            if (c6) {
              return "";
            }
            var dK = a5();
            var dH = J.characterSet || J.charset;
            if (!dH || dH.toLowerCase() === "utf-8") {
              dH = null;
            }
            dD +=
              "&idsite=" +
              cf +
              "&rec=1&r=" +
              String(Math.random()).slice(2, 8) +
              "&h=" +
              dC.getHours() +
              "&m=" +
              dC.getMinutes() +
              "&s=" +
              dC.getSeconds() +
              "&url=" +
              t(cb(dR)) +
              (bw.length && !cD(bw) && !dE ? "&urlref=" + t(cb(bw)) : "") +
              (ac(bH) ? "&uid=" + t(bH) : "") +
              "&_id=" +
              dK.uuid +
              "&_idn=" +
              dK.newVisitor +
              (dH ? "&cs=" + t(dH) : "") +
              "&send_image=0";
            var dM = ds();
            for (dO in dM) {
              if (Object.prototype.hasOwnProperty.call(dM, dO)) {
                dD += "&" + dO + "=" + dM[dO];
              }
            }
            var dT = cY();
            for (dO in dT) {
              if (Object.prototype.hasOwnProperty.call(dT, dO)) {
                dD += "&" + dO + "=" + dT[dO];
              }
            }
            var dU = [];
            if (dP) {
              for (dO in dP) {
                if (Object.prototype.hasOwnProperty.call(dP, dO) && /^dimension\d+$/.test(dO)) {
                  var dF = dO.replace("dimension", "");
                  dU.push(parseInt(dF, 10));
                  dU.push(String(dF));
                  dD += "&" + dO + "=" + t(dP[dO]);
                  delete dP[dO];
                }
              }
            }
            if (dP && D(dP)) {
              dP = null;
            }
            for (dO in cH) {
              if (Object.prototype.hasOwnProperty.call(cH, dO)) {
                dD += "&" + dO + "=" + t(cH[dO]);
              }
            }
            for (dO in bv) {
              if (Object.prototype.hasOwnProperty.call(bv, dO)) {
                var dI = -1 === P(dU, dO);
                if (dI) {
                  dD += "&dimension" + dO + "=" + t(bv[dO]);
                }
              }
            }
            if (dP) {
              dD += "&data=" + t(W.JSON.stringify(dP));
            } else {
              if (at) {
                dD += "&data=" + t(W.JSON.stringify(at));
              }
            }
            function dG(dV, dW) {
              var dX = W.JSON.stringify(dV);
              if (dX.length > 2) {
                return "&" + dW + "=" + t(dX);
              }
              return "";
            }
            var dS = dB(b5);
            var dL = dB(cx);
            dD += dG(dS, "cvar");
            dD += dG(dL, "e_cvar");
            if (aV) {
              dD += dG(aV, "_cvar");
              for (dO in dN) {
                if (Object.prototype.hasOwnProperty.call(dN, dO)) {
                  if (aV[dO][0] === "" || aV[dO][1] === "") {
                    delete aV[dO];
                  }
                }
              }
              if (bZ) {
                dx(dJ, W.JSON.stringify(aV), cz, by, df, b1, aN);
              }
            }
            if (a9 && bN && !bo) {
              dD = aE(dD);
              bo = true;
            }
            if (aQ) {
              dD += "&pv_id=" + aQ;
            }
            aR(dK);
            cn();
            dD += ag(dQ, { tracker: bR, request: dD });
            if (dh.length) {
              dD += "&" + dh;
            }
            if (C(cl)) {
              dD = cl(dD);
            }
            return dD;
          }
          b0 = function be() {
            var dC = new Date();
            dC = dC.getTime();
            if (!dg) {
              return false;
            }
            if (dg + bc <= dC) {
              bR.ping();
              return true;
            }
            return false;
          };
          function bz(dF, dE, dJ, dG, dC, dM) {
            var dI = "idgoal=0",
              dD = new Date(),
              dK = [],
              dL,
              dH = String(dF).length;
            if (dH) {
              dI += "&ec_id=" + t(dF);
            }
            dI += "&revenue=" + dE;
            if (String(dJ).length) {
              dI += "&ec_st=" + dJ;
            }
            if (String(dG).length) {
              dI += "&ec_tx=" + dG;
            }
            if (String(dC).length) {
              dI += "&ec_sh=" + dC;
            }
            if (String(dM).length) {
              dI += "&ec_dt=" + dM;
            }
            if (di) {
              for (dL in di) {
                if (Object.prototype.hasOwnProperty.call(di, dL)) {
                  if (!M(di[dL][1])) {
                    di[dL][1] = "";
                  }
                  if (!M(di[dL][2])) {
                    di[dL][2] = "";
                  }
                  if (!M(di[dL][3]) || String(di[dL][3]).length === 0) {
                    di[dL][3] = 0;
                  }
                  if (!M(di[dL][4]) || String(di[dL][4]).length === 0) {
                    di[dL][4] = 1;
                  }
                  dK.push(di[dL]);
                }
              }
              dI += "&ec_items=" + t(W.JSON.stringify(dK));
            }
            dI = cF(dI, at, "ecommerce");
            bO(dI, bS);
            if (dH) {
              di = {};
            }
          }
          function b7(dC, dG, dF, dE, dD, dH) {
            if (String(dC).length && M(dG)) {
              bz(dC, dG, dF, dE, dD, dH);
            }
          }
          function bB(dC) {
            if (M(dC)) {
              bz("", dC, "", "", "", "");
            }
          }
          function b9(dD, dF, dE) {
            if (!bJ) {
              aQ = bn();
            }
            var dC = cF("action_name=" + t(ap(dD || bq)), dF, "log");
            if (a9 && !bo) {
              dC = aE(dC);
            }
            bO(dC, bS, dE);
          }
          function a7(dE, dD) {
            var dF,
              dC = "(^| )(piwik[_-]" + dD + "|matomo[_-]" + dD;
            if (dE) {
              for (dF = 0; dF < dE.length; dF++) {
                dC += "|" + dE[dF];
              }
            }
            dC += ")( |$)";
            return new RegExp(dC);
          }
          function a0(dC) {
            return aI && dC && 0 === String(dC).indexOf(aI);
          }
          function cJ(dG, dC, dH, dD) {
            if (a0(dC)) {
              return 0;
            }
            var dF = a7(bU, "download"),
              dE = a7(bf, "link"),
              dI = new RegExp("\\.(" + dp.join("|") + ")([?&#]|$)", "i");
            if (dE.test(dG)) {
              return "link";
            }
            if (dD || dF.test(dG) || dI.test(dC)) {
              return "download";
            }
            if (dH) {
              return 0;
            }
            return "link";
          }
          function ay(dD) {
            var dC;
            dC = dD.parentNode;
            while (dC !== null && M(dC)) {
              if (ai.isLinkElement(dD)) {
                break;
              }
              dD = dC;
              dC = dD.parentNode;
            }
            return dD;
          }
          function dv(dH) {
            dH = ay(dH);
            if (!ai.hasNodeAttribute(dH, "href")) {
              return;
            }
            if (!M(dH.href)) {
              return;
            }
            var dG = ai.getAttributeValueFromNode(dH, "href");
            var dD = dH.pathname || cw(dH.href);
            var dI = dH.hostname || d(dH.href);
            var dJ = dI.toLowerCase();
            var dE = dH.href.replace(dI, dJ);
            var dF = new RegExp("^(javascript|vbscript|jscript|mocha|livescript|ecmascript|mailto|tel):", "i");
            if (!dF.test(dE)) {
              var dC = cJ(dH.className, dE, aw(dJ, dD), ai.hasNodeAttribute(dH, "download"));
              if (dC) {
                return { type: dC, href: dE };
              }
            }
          }
          function aU(dC, dD, dE, dF) {
            var dG = w.buildInteractionRequestParams(dC, dD, dE, dF);
            if (!dG) {
              return;
            }
            return cF(dG, null, "contentInteraction");
          }
          function bi(dC, dD) {
            if (!dC || !dD) {
              return false;
            }
            var dE = w.findTargetNode(dC);
            if (w.shouldIgnoreInteraction(dE)) {
              return false;
            }
            dE = w.findTargetNodeNoDefault(dC);
            if (dE && !Y(dE, dD)) {
              return false;
            }
            return true;
          }
          function cI(dE, dD, dG) {
            if (!dE) {
              return;
            }
            var dC = w.findParentContentNode(dE);
            if (!dC) {
              return;
            }
            if (!bi(dC, dE)) {
              return;
            }
            var dF = w.buildContentBlock(dC);
            if (!dF) {
              return;
            }
            if (!dF.target && dG) {
              dF.target = dG;
            }
            return w.buildInteractionRequestParams(dD, dF.name, dF.piece, dF.target);
          }
          function a3(dD) {
            if (!ck || !ck.length) {
              return false;
            }
            var dC, dE;
            for (dC = 0; dC < ck.length; dC++) {
              dE = ck[dC];
              if (dE && dE.name === dD.name && dE.piece === dD.piece && dE.target === dD.target) {
                return true;
              }
            }
            return false;
          }
          function a4(dC) {
            return function (dG) {
              if (!dC) {
                return;
              }
              var dE = w.findParentContentNode(dC);
              var dD;
              if (dG) {
                dD = dG.target || dG.srcElement;
              }
              if (!dD) {
                dD = dC;
              }
              if (!bi(dE, dD)) {
                return;
              }
              if (!dE) {
                return false;
              }
              var dH = w.findTargetNode(dE);
              if (!dH || w.shouldIgnoreInteraction(dH)) {
                return false;
              }
              var dF = dv(dH);
              if (dr && dF && dF.type) {
                return dF.type;
              }
              return bR.trackContentInteractionNode(dD, "click");
            };
          }
          function ca(dE) {
            if (!dE || !dE.length) {
              return;
            }
            var dC, dD;
            for (dC = 0; dC < dE.length; dC++) {
              dD = w.findTargetNode(dE[dC]);
              if (dD && !dD.contentInteractionTrackingSetupDone) {
                dD.contentInteractionTrackingSetupDone = true;
                ar(dD, "click", a4(dD));
              }
            }
          }
          function bG(dE, dF) {
            if (!dE || !dE.length) {
              return [];
            }
            var dC, dD;
            for (dC = 0; dC < dE.length; dC++) {
              if (a3(dE[dC])) {
                dE.splice(dC, 1);
                dC--;
              } else {
                ck.push(dE[dC]);
              }
            }
            if (!dE || !dE.length) {
              return [];
            }
            ca(dF);
            var dG = [];
            for (dC = 0; dC < dE.length; dC++) {
              dD = cF(w.buildImpressionRequestParams(dE[dC].name, dE[dC].piece, dE[dC].target), undefined, "contentImpressions");
              if (dD) {
                dG.push(dD);
              }
            }
            return dG;
          }
          function cP(dD) {
            var dC = w.collectContent(dD);
            return bG(dC, dD);
          }
          function bg(dD) {
            if (!dD || !dD.length) {
              return [];
            }
            var dC;
            for (dC = 0; dC < dD.length; dC++) {
              if (!w.isNodeVisible(dD[dC])) {
                dD.splice(dC, 1);
                dC--;
              }
            }
            if (!dD || !dD.length) {
              return [];
            }
            return cP(dD);
          }
          function aK(dE, dC, dD) {
            var dF = w.buildImpressionRequestParams(dE, dC, dD);
            return cF(dF, null, "contentImpression");
          }
          function du(dF, dD) {
            if (!dF) {
              return;
            }
            var dC = w.findParentContentNode(dF);
            var dE = w.buildContentBlock(dC);
            if (!dE) {
              return;
            }
            if (!dD) {
              dD = "Unknown";
            }
            return aU(dD, dE.name, dE.piece, dE.target);
          }
          function c5(dD, dF, dC, dE) {
            return "e_c=" + t(dD) + "&e_a=" + t(dF) + (M(dC) ? "&e_n=" + t(dC) : "") + (M(dE) ? "&e_v=" + t(dE) : "") + "&ca=1";
          }
          function ax(dE, dG, dC, dF, dI, dH) {
            if (!ac(dE) || !ac(dG)) {
              ao("Error while logging event: Parameters `category` and `action` must not be empty or filled with whitespaces");
              return false;
            }
            var dD = cF(c5(dE, dG, dC, dF), dI, "event");
            bO(dD, bS, dH);
          }
          function ch(dC, dF, dD, dG) {
            var dE = cF("search=" + t(dC) + (dF ? "&search_cat=" + t(dF) : "") + (M(dD) ? "&search_count=" + dD : ""), dG, "sitesearch");
            bO(dE, bS);
          }
          function c9(dC, dG, dF, dE) {
            var dD = cF("idgoal=" + dC + (dG ? "&revenue=" + dG : ""), dF, "goal");
            bO(dD, bS, dE);
          }
          function dj(dF, dC, dJ, dI, dE) {
            var dH = dC + "=" + t(cb(dF));
            var dD = cI(dE, "click", dF);
            if (dD) {
              dH += "&" + dD;
            }
            var dG = cF(dH, dJ, "link");
            bO(dG, bS, dI);
          }
          function b3(dD, dC) {
            if (dD !== "") {
              return dD + dC.charAt(0).toUpperCase() + dC.slice(1);
            }
            return dC;
          }
          function cr(dH) {
            var dG,
              dC,
              dF = ["", "webkit", "ms", "moz"],
              dE;
            if (!bl) {
              for (dC = 0; dC < dF.length; dC++) {
                dE = dF[dC];
                if (Object.prototype.hasOwnProperty.call(J, b3(dE, "hidden"))) {
                  if (J[b3(dE, "visibilityState")] === "prerender") {
                    dG = true;
                  }
                  break;
                }
              }
            }
            if (dG) {
              ar(J, dE + "visibilitychange", function dD() {
                J.removeEventListener(dE + "visibilitychange", dD, false);
                dH();
              });
              return;
            }
            dH();
          }
          function bA() {
            var dD = bR.getVisitorId();
            var dC = aO();
            return dD + dC;
          }
          function cu(dC) {
            if (!dC) {
              return;
            }
            if (!ai.hasNodeAttribute(dC, "href")) {
              return;
            }
            var dD = ai.getAttributeValueFromNode(dC, "href");
            if (!dD || a0(dD)) {
              return;
            }
            if (!bR.getVisitorId()) {
              return;
            }
            dD = j(dD, az);
            var dE = bA();
            dD = I(dD, az, dE);
            ai.setAnyAttribute(dC, "href", dD);
          }
          function bs(dF) {
            var dG = ai.getAttributeValueFromNode(dF, "href");
            if (!dG) {
              return false;
            }
            dG = String(dG);
            var dD = dG.indexOf("//") === 0 || dG.indexOf("http://") === 0 || dG.indexOf("https://") === 0;
            if (!dD) {
              return false;
            }
            var dC = dF.pathname || cw(dF.href);
            var dE = (dF.hostname || d(dF.href)).toLowerCase();
            if (aw(dE, dC)) {
              if (!cX(da, O(dE))) {
                return true;
              }
              return false;
            }
            return false;
          }
          function cW(dC) {
            var dD = dv(dC);
            if (dD && dD.type) {
              dD.href = p(dD.href);
              dj(dD.href, dD.type, undefined, null, dC);
              return;
            }
            if (c3) {
              dC = ay(dC);
              if (bs(dC)) {
                cu(dC);
              }
            }
          }
          function cK() {
            return J.all && !J.addEventListener;
          }
          function db(dC) {
            var dE = dC.which;
            var dD = typeof dC.button;
            if (!dE && dD !== "undefined") {
              if (cK()) {
                if (dC.button & 1) {
                  dE = 1;
                } else {
                  if (dC.button & 2) {
                    dE = 3;
                  } else {
                    if (dC.button & 4) {
                      dE = 2;
                    }
                  }
                }
              } else {
                if (dC.button === 0 || dC.button === "0") {
                  dE = 1;
                } else {
                  if (dC.button & 1) {
                    dE = 2;
                  } else {
                    if (dC.button & 2) {
                      dE = 3;
                    }
                  }
                }
              }
            }
            return dE;
          }
          function b2(dC) {
            switch (db(dC)) {
              case 1:
                return "left";
              case 2:
                return "middle";
              case 3:
                return "right";
            }
          }
          function a8(dC) {
            return dC.target || dC.srcElement;
          }
          function dc(dC) {
            return dC === "A" || dC === "AREA";
          }
          function aG(dC) {
            function dD(dF) {
              var dG = a8(dF);
              var dH = dG.nodeName;
              var dE = a7(bI, "ignore");
              while (!dc(dH) && dG && dG.parentNode) {
                dG = dG.parentNode;
                dH = dG.nodeName;
              }
              if (dG && dc(dH) && !dE.test(dG.className)) {
                return dG;
              }
            }
            return function (dG) {
              dG = dG || W.event;
              var dH = dD(dG);
              if (!dH) {
                return;
              }
              var dF = b2(dG);
              if (dG.type === "click") {
                var dE = false;
                if (dC && dF === "middle") {
                  dE = true;
                }
                if (dH && !dE) {
                  cW(dH);
                }
              } else {
                if (dG.type === "mousedown") {
                  if (dF === "middle" && dH) {
                    aW = dF;
                    bK = dH;
                  } else {
                    aW = bK = null;
                  }
                } else {
                  if (dG.type === "mouseup") {
                    if (dF === aW && dH === bK) {
                      cW(dH);
                    }
                    aW = bK = null;
                  } else {
                    if (dG.type === "contextmenu") {
                      cW(dH);
                    }
                  }
                }
              }
            };
          }
          function av(dF, dE, dC) {
            var dD = typeof dE;
            if (dD === "undefined") {
              dE = true;
            }
            ar(dF, "click", aG(dE), dC);
            if (dE) {
              ar(dF, "mouseup", aG(dE), dC);
              ar(dF, "mousedown", aG(dE), dC);
              ar(dF, "contextmenu", aG(dE), dC);
            }
          }
          function aX(dD, dG, dH) {
            if (cp) {
              return true;
            }
            cp = true;
            var dI = false;
            var dF, dE;
            function dC() {
              dI = true;
            }
            n(function () {
              function dJ(dL) {
                setTimeout(function () {
                  if (!cp) {
                    return;
                  }
                  dI = false;
                  dH.trackVisibleContentImpressions();
                  dJ(dL);
                }, dL);
              }
              function dK(dL) {
                setTimeout(function () {
                  if (!cp) {
                    return;
                  }
                  if (dI) {
                    dI = false;
                    dH.trackVisibleContentImpressions();
                  }
                  dK(dL);
                }, dL);
              }
              if (dD) {
                dF = ["scroll", "resize"];
                for (dE = 0; dE < dF.length; dE++) {
                  if (J.addEventListener) {
                    J.addEventListener(dF[dE], dC, false);
                  } else {
                    W.attachEvent("on" + dF[dE], dC);
                  }
                }
                dK(100);
              }
              if (dG && dG > 0) {
                dG = parseInt(dG, 10);
                dJ(dG);
              }
            });
          }
          var bM = {
            enabled: true,
            requests: [],
            timeout: null,
            interval: 2500,
            sendRequests: function () {
              var dC = this.requests;
              this.requests = [];
              if (dC.length === 1) {
                bO(dC[0], bS);
              } else {
                dy(dC, bS);
              }
            },
            canQueue: function () {
              return !m && this.enabled;
            },
            pushMultiple: function (dD) {
              if (!this.canQueue()) {
                dy(dD, bS);
                return;
              }
              var dC;
              for (dC = 0; dC < dD.length; dC++) {
                this.push(dD[dC]);
              }
            },
            push: function (dC) {
              if (!dC) {
                return;
              }
              if (!this.canQueue()) {
                bO(dC, bS);
                return;
              }
              bM.requests.push(dC);
              if (this.timeout) {
                clearTimeout(this.timeout);
                this.timeout = null;
              }
              this.timeout = setTimeout(function () {
                bM.timeout = null;
                bM.sendRequests();
              }, bM.interval);
              var dD = "RequestQueue" + aB;
              if (!Object.prototype.hasOwnProperty.call(b, dD)) {
                b[dD] = {
                  unload: function () {
                    if (bM.timeout) {
                      clearTimeout(bM.timeout);
                    }
                    bM.sendRequests();
                  },
                };
              }
            },
          };
          bp();
          this.hasConsent = function () {
            return bL;
          };
          this.getVisitorInfo = function () {
            if (!aH(aY("id"))) {
              aR();
            }
            return c4();
          };
          this.getVisitorId = function () {
            return this.getVisitorInfo()[1];
          };
          this.getAttributionInfo = function () {
            return bV();
          };
          this.getAttributionCampaignName = function () {
            return bV()[0];
          };
          this.getAttributionCampaignKeyword = function () {
            return bV()[1];
          };
          this.getAttributionReferrerTimestamp = function () {
            return bV()[2];
          };
          this.getAttributionReferrerUrl = function () {
            return bV()[3];
          };
          this.setTrackerUrl = function (dC) {
            aI = dC;
          };
          this.getTrackerUrl = function () {
            return aI;
          };
          this.getMatomoUrl = function () {
            return aa(this.getTrackerUrl(), bQ);
          };
          this.getPiwikUrl = function () {
            return this.getMatomoUrl();
          };
          this.addTracker = function (dE, dD) {
            if (!M(dE) || null === dE) {
              dE = this.getTrackerUrl();
            }
            var dC = new T(dE, dD);
            L.push(dC);
            u.trigger("TrackerAdded", [this]);
            return dC;
          };
          this.getSiteId = function () {
            return cf;
          };
          this.setSiteId = function (dC) {
            cc(dC);
          };
          this.resetUserId = function () {
            bH = "";
          };
          this.setUserId = function (dC) {
            if (ac(dC)) {
              bH = dC;
            }
          };
          this.setVisitorId = function (dD) {
            var dC = /[0-9A-Fa-f]{16}/g;
            if (x(dD) && dC.test(dD)) {
              bX = dD;
            } else {
              ao("Invalid visitorId set" + dD);
            }
          };
          this.getUserId = function () {
            return bH;
          };
          this.setCustomData = function (dC, dD) {
            if (Z(dC)) {
              at = dC;
            } else {
              if (!at) {
                at = {};
              }
              at[dC] = dD;
            }
          };
          this.getCustomData = function () {
            return at;
          };
          this.setCustomRequestProcessing = function (dC) {
            cl = dC;
          };
          this.appendToTrackingUrl = function (dC) {
            dh = dC;
          };
          this.getRequest = function (dC) {
            return cF(dC);
          };
          this.addPlugin = function (dC, dD) {
            b[dC] = dD;
          };
          this.setCustomDimension = function (dC, dD) {
            dC = parseInt(dC, 10);
            if (dC > 0) {
              if (!M(dD)) {
                dD = "";
              }
              if (!x(dD)) {
                dD = String(dD);
              }
              bv[dC] = dD;
            }
          };
          this.getCustomDimension = function (dC) {
            dC = parseInt(dC, 10);
            if (dC > 0 && Object.prototype.hasOwnProperty.call(bv, dC)) {
              return bv[dC];
            }
          };
          this.deleteCustomDimension = function (dC) {
            dC = parseInt(dC, 10);
            if (dC > 0) {
              delete bv[dC];
            }
          };
          this.setCustomVariable = function (dD, dC, dG, dE) {
            var dF;
            if (!M(dE)) {
              dE = "visit";
            }
            if (!M(dC)) {
              return;
            }
            if (!M(dG)) {
              dG = "";
            }
            if (dD > 0) {
              dC = !x(dC) ? String(dC) : dC;
              dG = !x(dG) ? String(dG) : dG;
              dF = [dC.slice(0, bC), dG.slice(0, bC)];
              if (dE === "visit" || dE === 2) {
                cV();
                aV[dD] = dF;
              } else {
                if (dE === "page" || dE === 3) {
                  b5[dD] = dF;
                } else {
                  if (dE === "event") {
                    cx[dD] = dF;
                  }
                }
              }
            }
          };
          this.getCustomVariable = function (dD, dE) {
            var dC;
            if (!M(dE)) {
              dE = "visit";
            }
            if (dE === "page" || dE === 3) {
              dC = b5[dD];
            } else {
              if (dE === "event") {
                dC = cx[dD];
              } else {
                if (dE === "visit" || dE === 2) {
                  cV();
                  dC = aV[dD];
                }
              }
            }
            if (!M(dC) || (dC && dC[0] === "")) {
              return false;
            }
            return dC;
          };
          this.deleteCustomVariable = function (dC, dD) {
            if (this.getCustomVariable(dC, dD)) {
              this.setCustomVariable(dC, "", "", dD);
            }
          };
          this.deleteCustomVariables = function (dC) {
            if (dC === "page" || dC === 3) {
              b5 = {};
            } else {
              if (dC === "event") {
                cx = {};
              } else {
                if (dC === "visit" || dC === 2) {
                  aV = {};
                }
              }
            }
          };
          this.storeCustomVariablesInCookie = function () {
            bZ = true;
          };
          this.setLinkTrackingTimer = function (dC) {
            bS = dC;
          };
          this.getLinkTrackingTimer = function () {
            return bS;
          };
          this.setDownloadExtensions = function (dC) {
            if (x(dC)) {
              dC = dC.split("|");
            }
            dp = dC;
          };
          this.addDownloadExtensions = function (dD) {
            var dC;
            if (x(dD)) {
              dD = dD.split("|");
            }
            for (dC = 0; dC < dD.length; dC++) {
              dp.push(dD[dC]);
            }
          };
          this.removeDownloadExtensions = function (dE) {
            var dD,
              dC = [];
            if (x(dE)) {
              dE = dE.split("|");
            }
            for (dD = 0; dD < dp.length; dD++) {
              if (P(dE, dp[dD]) === -1) {
                dC.push(dp[dD]);
              }
            }
            dp = dC;
          };
          this.setDomains = function (dC) {
            aC = x(dC) ? [dC] : dC;
            var dG = false,
              dE = 0,
              dD;
            for (dE; dE < aC.length; dE++) {
              dD = String(aC[dE]);
              if (cX(da, O(dD))) {
                dG = true;
                break;
              }
              var dF = cw(dD);
              if (dF && dF !== "/" && dF !== "/*") {
                dG = true;
                break;
              }
            }
            if (!dG) {
              aC.push(da);
            }
          };
          this.setExcludedReferrers = function (dC) {
            cM = x(dC) ? [dC] : dC;
          };
          this.enableCrossDomainLinking = function () {
            c3 = true;
          };
          this.disableCrossDomainLinking = function () {
            c3 = false;
          };
          this.isCrossDomainLinkingEnabled = function () {
            return c3;
          };
          this.setCrossDomainLinkingTimeout = function (dC) {
            a6 = dC;
          };
          this.getCrossDomainLinkingUrlParameter = function () {
            return t(az) + "=" + t(bA());
          };
          this.setIgnoreClasses = function (dC) {
            bI = x(dC) ? [dC] : dC;
          };
          this.setRequestMethod = function (dC) {
            if (dC) {
              dt = String(dC).toUpperCase();
            } else {
              dt = cs;
            }
            if (dt === "GET") {
              this.disableAlwaysUseSendBeacon();
            }
          };
          this.setRequestContentType = function (dC) {
            cL = dC || aM;
          };
          this.setGenerationTimeMs = function (dC) {
            ao("setGenerationTimeMs is no longer supported since Matomo 4. The call will be ignored. The replacement is setPagePerformanceTiming.");
          };
          this.setPagePerformanceTiming = function (dG, dI, dH, dD, dJ, dE) {
            var dF = { pf_net: dG, pf_srv: dI, pf_tfr: dH, pf_dm1: dD, pf_dm2: dJ, pf_onl: dE };
            try {
              dF = Q(dF, M);
              dF = B(dF);
              cy = l(dF);
              if (cy === "") {
                ao("setPagePerformanceTiming() called without parameters. This function needs to be called with at least one performance parameter.");
                return;
              }
              bo = false;
              bN = true;
            } catch (dC) {
              ao("setPagePerformanceTiming: " + dC.toString());
            }
          };
          this.setReferrerUrl = function (dC) {
            bw = dC;
          };
          this.setCustomUrl = function (dC) {
            bb = b4(bW, dC);
          };
          this.getCurrentUrl = function () {
            return bb || bW;
          };
          this.setDocumentTitle = function (dC) {
            bq = dC;
          };
          this.setPageViewId = function (dC) {
            aQ = dC;
            bJ = true;
          };
          this.setAPIUrl = function (dC) {
            bQ = dC;
          };
          this.setDownloadClasses = function (dC) {
            bU = x(dC) ? [dC] : dC;
          };
          this.setLinkClasses = function (dC) {
            bf = x(dC) ? [dC] : dC;
          };
          this.setCampaignNameKey = function (dC) {
            cC = x(dC) ? [dC] : dC;
          };
          this.setCampaignKeywordKey = function (dC) {
            bP = x(dC) ? [dC] : dC;
          };
          this.discardHashTag = function (dC) {
            bY = dC;
          };
          this.setCookieNamePrefix = function (dC) {
            br = dC;
            if (aV) {
              aV = b6();
            }
          };
          this.setCookieDomain = function (dC) {
            var dD = O(dC);
            if (!bt && !bF(dD)) {
              ao("Can't write cookie on domain " + dC);
            } else {
              df = dD;
              bp();
            }
          };
          this.setExcludedQueryParams = function (dC) {
            ct = x(dC) ? [dC] : dC;
          };
          this.getCookieDomain = function () {
            return df;
          };
          this.hasCookies = function () {
            return "1" === ce();
          };
          this.setSessionCookie = function (dE, dD, dC) {
            if (!dE) {
              throw new Error("Missing cookie name");
            }
            if (!M(dC)) {
              dC = cz;
            }
            bD.push(dE);
            dx(aY(dE), dD, dC, by, df, b1, aN);
          };
          this.getCookie = function (dD) {
            var dC = aH(aY(dD));
            if (dC === 0) {
              return null;
            }
            return dC;
          };
          this.setCookiePath = function (dC) {
            by = dC;
            bp();
          };
          this.getCookiePath = function (dC) {
            return by;
          };
          this.setVisitorCookieTimeout = function (dC) {
            c0 = dC * 1000;
          };
          this.setSessionCookieTimeout = function (dC) {
            cz = dC * 1000;
          };
          this.getSessionCookieTimeout = function () {
            return cz;
          };
          this.setReferralCookieTimeout = function (dC) {
            dn = dC * 1000;
          };
          this.setConversionAttributionFirstReferrer = function (dC) {
            bE = dC;
          };
          this.setSecureCookie = function (dC) {
            if (dC && location.protocol !== "https:") {
              ao("Error in setSecureCookie: You cannot use `Secure` on http.");
              return;
            }
            b1 = dC;
          };
          this.setCookieSameSite = function (dC) {
            dC = String(dC);
            dC = dC.charAt(0).toUpperCase() + dC.toLowerCase().slice(1);
            if (dC !== "None" && dC !== "Lax" && dC !== "Strict") {
              ao("Ignored value for sameSite. Please use either Lax, None, or Strict.");
              return;
            }
            if (dC === "None") {
              if (location.protocol === "https:") {
                this.setSecureCookie(true);
              } else {
                ao("sameSite=None cannot be used on http, reverted to sameSite=Lax.");
                dC = "Lax";
              }
            }
            aN = dC;
          };
          this.disableCookies = function () {
            bt = true;
            if (cf) {
              aJ();
            }
          };
          this.areCookiesEnabled = function () {
            return !bt;
          };
          this.setCookieConsentGiven = function () {
            if (bt && !c6) {
              bt = false;
              de = true;
              if (cf && aA) {
                aR();
                var dC = cF("ping=1", null, "ping");
                bO(dC, bS);
              }
            }
          };
          this.requireCookieConsent = function () {
            if (this.getRememberedCookieConsent()) {
              return false;
            }
            this.disableCookies();
            return true;
          };
          this.getRememberedCookieConsent = function () {
            return aH(cT);
          };
          this.forgetCookieConsentGiven = function () {
            b8(cT, by, df);
            this.disableCookies();
          };
          this.rememberCookieConsentGiven = function (dD) {
            if (dD) {
              dD = dD * 60 * 60 * 1000;
            } else {
              dD = 30 * 365 * 24 * 60 * 60 * 1000;
            }
            this.setCookieConsentGiven();
            var dC = new Date().getTime();
            dx(cT, dC, dD, by, df, b1, aN);
          };
          this.deleteCookies = function () {
            aJ();
          };
          this.setDoNotTrack = function (dD) {
            var dC = g.doNotTrack || g.msDoNotTrack;
            c6 = dD && (dC === "yes" || dC === "1");
            if (c6) {
              this.disableCookies();
            }
          };
          this.alwaysUseSendBeacon = function () {
            dd = true;
          };
          this.disableAlwaysUseSendBeacon = function () {
            dd = false;
          };
          this.addListener = function (dD, dC) {
            av(dD, dC, false);
          };
          this.enableLinkTracking = function (dD) {
            if (dr) {
              return;
            }
            dr = true;
            var dC = this;
            q(function () {
              au = true;
              var dE = J.body;
              av(dE, dD, true);
            });
          };
          this.enableJSErrorTracking = function () {
            if (c8) {
              return;
            }
            c8 = true;
            var dC = W.onerror;
            W.onerror = function (dH, dF, dE, dG, dD) {
              cr(function () {
                var dI = "JavaScript Errors";
                var dJ = dF + ":" + dE;
                if (dG) {
                  dJ += ":" + dG;
                }
                if (P(cG, dI + dJ + dH) === -1) {
                  cG.push(dI + dJ + dH);
                  ax(dI, dJ, dH);
                }
              });
              if (dC) {
                return dC(dH, dF, dE, dG, dD);
              }
              return false;
            };
          };
          this.disablePerformanceTracking = function () {
            a9 = false;
          };
          this.enableHeartBeatTimer = function (dC) {
            dC = Math.max(dC || 15, 5);
            bc = dC * 1000;
            if (dg !== null) {
              dz();
            }
          };
          this.disableHeartBeatTimer = function () {
            if (bc || aS) {
              if (W.removeEventListener) {
                W.removeEventListener("focus", bh);
                W.removeEventListener("blur", aD);
                W.removeEventListener("visibilitychange", a1);
              } else {
                if (W.detachEvent) {
                  W.detachEvent("onfocus", bh);
                  W.detachEvent("onblur", aD);
                  W.detachEvent("visibilitychange", a1);
                }
              }
            }
            bc = null;
            aS = false;
          };
          this.killFrame = function () {
            if (W.location !== W.top.location) {
              W.top.location = W.location;
            }
          };
          this.redirectFile = function (dC) {
            if (W.location.protocol === "file:") {
              W.location = dC;
            }
          };
          this.setCountPreRendered = function (dC) {
            bl = dC;
          };
          this.trackGoal = function (dC, dF, dE, dD) {
            cr(function () {
              c9(dC, dF, dE, dD);
            });
          };
          this.trackLink = function (dD, dC, dF, dE) {
            cr(function () {
              dj(dD, dC, dF, dE);
            });
          };
          this.getNumTrackedPageViews = function () {
            return cE;
          };
          this.trackPageView = function (dC, dE, dD) {
            ck = [];
            c1 = [];
            cG = [];
            if (R(cf)) {
              cr(function () {
                ad(aI, bQ, cf);
              });
            } else {
              cr(function () {
                cE++;
                b9(dC, dE, dD);
              });
            }
          };
          this.disableBrowserFeatureDetection = function () {
            de = false;
          };
          this.enableBrowserFeatureDetection = function () {
            de = true;
          };
          this.trackAllContentImpressions = function () {
            if (R(cf)) {
              return;
            }
            cr(function () {
              q(function () {
                var dC = w.findContentNodes();
                var dD = cP(dC);
                bM.pushMultiple(dD);
              });
            });
          };
          this.trackVisibleContentImpressions = function (dC, dD) {
            if (R(cf)) {
              return;
            }
            if (!M(dC)) {
              dC = true;
            }
            if (!M(dD)) {
              dD = 750;
            }
            aX(dC, dD, this);
            cr(function () {
              n(function () {
                var dE = w.findContentNodes();
                var dF = bg(dE);
                bM.pushMultiple(dF);
              });
            });
          };
          this.trackContentImpression = function (dE, dC, dD) {
            if (R(cf)) {
              return;
            }
            dE = a(dE);
            dC = a(dC);
            dD = a(dD);
            if (!dE) {
              return;
            }
            dC = dC || "Unknown";
            cr(function () {
              var dF = aK(dE, dC, dD);
              bM.push(dF);
            });
          };
          this.trackContentImpressionsWithinNode = function (dC) {
            if (R(cf) || !dC) {
              return;
            }
            cr(function () {
              if (cp) {
                n(function () {
                  var dD = w.findContentNodesWithinNode(dC);
                  var dE = bg(dD);
                  bM.pushMultiple(dE);
                });
              } else {
                q(function () {
                  var dD = w.findContentNodesWithinNode(dC);
                  var dE = cP(dD);
                  bM.pushMultiple(dE);
                });
              }
            });
          };
          this.trackContentInteraction = function (dE, dF, dC, dD) {
            if (R(cf)) {
              return;
            }
            dE = a(dE);
            dF = a(dF);
            dC = a(dC);
            dD = a(dD);
            if (!dE || !dF) {
              return;
            }
            dC = dC || "Unknown";
            cr(function () {
              var dG = aU(dE, dF, dC, dD);
              if (dG) {
                bM.push(dG);
              }
            });
          };
          this.trackContentInteractionNode = function (dE, dD) {
            if (R(cf) || !dE) {
              return;
            }
            var dC = null;
            cr(function () {
              dC = du(dE, dD);
              if (dC) {
                bM.push(dC);
              }
            });
            return dC;
          };
          this.logAllContentBlocksOnPage = function () {
            var dE = w.findContentNodes();
            var dC = w.collectContent(dE);
            var dD = typeof console;
            if (dD !== "undefined" && console && console.log) {
              console.log(dC);
            }
          };
          this.trackEvent = function (dD, dF, dC, dE, dH, dG) {
            cr(function () {
              ax(dD, dF, dC, dE, dH, dG);
            });
          };
          this.trackSiteSearch = function (dC, dE, dD, dF) {
            ck = [];
            cr(function () {
              ch(dC, dE, dD, dF);
            });
          };
          this.setEcommerceView = function (dG, dC, dE, dD) {
            cH = {};
            if (ac(dE)) {
              dE = String(dE);
            }
            if (!M(dE) || dE === null || dE === false || !dE.length) {
              dE = "";
            } else {
              if (dE instanceof Array) {
                dE = W.JSON.stringify(dE);
              }
            }
            var dF = "_pkc";
            cH[dF] = dE;
            if (M(dD) && dD !== null && dD !== false && String(dD).length) {
              dF = "_pkp";
              cH[dF] = dD;
            }
            if (!ac(dG) && !ac(dC)) {
              return;
            }
            if (ac(dG)) {
              dF = "_pks";
              cH[dF] = dG;
            }
            if (!ac(dC)) {
              dC = "";
            }
            dF = "_pkn";
            cH[dF] = dC;
          };
          this.getEcommerceItems = function () {
            return JSON.parse(JSON.stringify(di));
          };
          this.addEcommerceItem = function (dG, dC, dE, dD, dF) {
            if (ac(dG)) {
              di[dG] = [String(dG), dC, dE, dD, dF];
            }
          };
          this.removeEcommerceItem = function (dC) {
            if (ac(dC)) {
              dC = String(dC);
              delete di[dC];
            }
          };
          this.clearEcommerceCart = function () {
            di = {};
          };
          this.trackEcommerceOrder = function (dC, dG, dF, dE, dD, dH) {
            b7(dC, dG, dF, dE, dD, dH);
          };
          this.trackEcommerceCartUpdate = function (dC) {
            bB(dC);
          };
          this.trackRequest = function (dD, dF, dE, dC) {
            cr(function () {
              var dG = cF(dD, dF, dC);
              bO(dG, bS, dE);
            });
          };
          this.ping = function () {
            this.trackRequest("ping=1", null, null, "ping");
          };
          this.disableQueueRequest = function () {
            bM.enabled = false;
          };
          this.setRequestQueueInterval = function (dC) {
            if (dC < 1000) {
              throw new Error("Request queue interval needs to be at least 1000ms");
            }
            bM.interval = dC;
          };
          this.queueRequest = function (dC) {
            cr(function () {
              var dD = cF(dC);
              bM.push(dD);
            });
          };
          this.isConsentRequired = function () {
            return cQ;
          };
          this.getRememberedConsent = function () {
            var dC = aH(bk);
            if (aH(c2)) {
              if (dC) {
                b8(bk, by, df);
              }
              return null;
            }
            if (!dC || dC === 0) {
              return null;
            }
            return dC;
          };
          this.hasRememberedConsent = function () {
            return !!this.getRememberedConsent();
          };
          this.requireConsent = function () {
            cQ = true;
            bL = this.hasRememberedConsent();
            if (!bL) {
              bt = true;
            }
            y++;
            b["CoreConsent" + y] = {
              unload: function () {
                if (!bL) {
                  aJ();
                }
              },
            };
          };
          this.setConsentGiven = function (dD) {
            bL = true;
            de = true;
            b8(c2, by, df);
            var dE, dC;
            for (dE = 0; dE < c1.length; dE++) {
              dC = typeof c1[dE];
              if (dC === "string") {
                bO(c1[dE], bS);
              } else {
                if (dC === "object") {
                  dy(c1[dE], bS);
                }
              }
            }
            c1 = [];
            if (!M(dD) || dD) {
              this.setCookieConsentGiven();
            }
          };
          this.rememberConsentGiven = function (dE) {
            if (dE) {
              dE = dE * 60 * 60 * 1000;
            } else {
              dE = 30 * 365 * 24 * 60 * 60 * 1000;
            }
            var dC = true;
            this.setConsentGiven(dC);
            var dD = new Date().getTime();
            dx(bk, dD, dE, by, df, b1, aN);
          };
          this.forgetConsentGiven = function (dC) {
            if (dC) {
              dC = dC * 60 * 60 * 1000;
            } else {
              dC = 30 * 365 * 24 * 60 * 60 * 1000;
            }
            b8(bk, by, df);
            dx(c2, new Date().getTime(), dC, by, df, b1, aN);
            this.forgetCookieConsentGiven();
            this.requireConsent();
          };
          this.isUserOptedOut = function () {
            return !bL;
          };
          this.optUserOut = this.forgetConsentGiven;
          this.forgetUserOptOut = function () {
            this.setConsentGiven(false);
          };
          n(function () {
            setTimeout(function () {
              bN = true;
            }, 0);
          });
          u.trigger("TrackerSetup", [this]);
          u.addPlugin("TrackerVisitorIdCookie" + aB, {
            unload: function () {
              if (!aA) {
                aR();
                ds();
              }
            },
          });
        }
        function K() {
          return { push: aj };
        }
        function c(ay, ax) {
          var az = {};
          var av, aw;
          for (av = 0; av < ax.length; av++) {
            var at = ax[av];
            az[at] = 1;
            for (aw = 0; aw < ay.length; aw++) {
              if (ay[aw] && ay[aw][0]) {
                var au = ay[aw][0];
                if (at === au) {
                  aj(ay[aw]);
                  delete ay[aw];
                  if (az[au] > 1 && au !== "addTracker" && au !== "enableLinkTracking") {
                    ao(
                      "The method " +
                      au +
                      ' is registered more than once in "_paq" variable. Only the last call has an effect. Please have a look at the multiple Matomo trackers documentation: https://developer.matomo.org/guides/tracking-javascript-guide#multiple-piwik-trackers'
                    );
                  }
                  az[au]++;
                }
              }
            }
          }
          return ay;
        }
        var E = [
          "addTracker",
          "forgetCookieConsentGiven",
          "requireCookieConsent",
          "disableBrowserFeatureDetection",
          "disableCookies",
          "setTrackerUrl",
          "setAPIUrl",
          "enableCrossDomainLinking",
          "setCrossDomainLinkingTimeout",
          "setSessionCookieTimeout",
          "setVisitorCookieTimeout",
          "setCookieNamePrefix",
          "setCookieSameSite",
          "setSecureCookie",
          "setCookiePath",
          "setCookieDomain",
          "setDomains",
          "setUserId",
          "setVisitorId",
          "setSiteId",
          "alwaysUseSendBeacon",
          "disableAlwaysUseSendBeacon",
          "enableLinkTracking",
          "setCookieConsentGiven",
          "requireConsent",
          "setConsentGiven",
          "disablePerformanceTracking",
          "setPagePerformanceTiming",
          "setExcludedQueryParams",
          "setExcludedReferrers",
        ];
        function ah(av, au) {
          var at = new T(av, au);
          L.push(at);
          _paq = c(_paq, E);
          for (H = 0; H < _paq.length; H++) {
            if (_paq[H]) {
              aj(_paq[H]);
            }
          }
          _paq = new K();
          u.trigger("TrackerAdded", [at]);
          return at;
        }
        ar(W, "beforeunload", am, false);
        ar(
          W,
          "visibilitychange",
          function () {
            if (m) {
              return;
            }
            if (J.visibilityState === "hidden") {
              ag("unload");
            }
          },
          false
        );
        ar(
          W,
          "online",
          function () {
            if (M(g.serviceWorker)) {
              g.serviceWorker.ready.then(
                function (at) {
                  if (at && at.sync) {
                    return at.sync.register("matomoSync");
                  }
                },
                function () { }
              );
            }
          },
          false
        );
        ar(
          W,
          "message",
          function (ay) {
            if (!ay || !ay.origin) {
              return;
            }
            var aA, aw, au;
            var aB = d(ay.origin);
            var ax = u.getAsyncTrackers();
            for (aw = 0; aw < ax.length; aw++) {
              au = d(ax[aw].getMatomoUrl());
              if (au === aB) {
                aA = ax[aw];
                break;
              }
            }
            if (!aA) {
              return;
            }
            var av = null;
            try {
              av = JSON.parse(ay.data);
            } catch (az) {
              return;
            }
            if (!av) {
              return;
            }
            function at(aE) {
              var aG = J.getElementsByTagName("iframe");
              for (aw = 0; aw < aG.length; aw++) {
                var aF = aG[aw];
                var aC = d(aF.src);
                if (aF.contentWindow && M(aF.contentWindow.postMessage) && aC === aB) {
                  var aD = JSON.stringify(aE);
                  aF.contentWindow.postMessage(aD, ay.origin);
                }
              }
            }
            if (M(av.maq_initial_value)) {
              at({ maq_opted_in: av.maq_initial_value && aA.hasConsent(), maq_url: aA.getMatomoUrl(), maq_optout_by_default: aA.isConsentRequired() });
            } else {
              if (M(av.maq_opted_in)) {
                ax = u.getAsyncTrackers();
                for (aw = 0; aw < ax.length; aw++) {
                  aA = ax[aw];
                  if (av.maq_opted_in) {
                    aA.rememberConsentGiven();
                  } else {
                    aA.forgetConsentGiven();
                  }
                }
                at({ maq_confirm_opted_in: aA.hasConsent(), maq_url: aA.getMatomoUrl(), maq_optout_by_default: aA.isConsentRequired() });
              }
            }
          },
          false
        );
        Date.prototype.getTimeAlias = Date.prototype.getTime;
        u = {
          initialized: false,
          JSON: W.JSON,
          DOM: {
            addEventListener: function (aw, av, au, at) {
              var ax = typeof at;
              if (ax === "undefined") {
                at = false;
              }
              ar(aw, av, au, at);
            },
            onLoad: n,
            onReady: q,
            isNodeVisible: i,
            isOrWasNodeVisible: w.isNodeVisible,
          },
          on: function (au, at) {
            if (!z[au]) {
              z[au] = [];
            }
            z[au].push(at);
          },
          off: function (av, au) {
            if (!z[av]) {
              return;
            }
            var at = 0;
            for (at; at < z[av].length; at++) {
              if (z[av][at] === au) {
                z[av].splice(at, 1);
              }
            }
          },
          trigger: function (av, aw, au) {
            if (!z[av]) {
              return;
            }
            var at = 0;
            for (at; at < z[av].length; at++) {
              z[av][at].apply(au || W, aw);
            }
          },
          addPlugin: function (at, au) {
            b[at] = au;
          },
          getTracker: function (au, at) {
            if (!M(at)) {
              at = this.getAsyncTracker().getSiteId();
            }
            if (!M(au)) {
              au = this.getAsyncTracker().getTrackerUrl();
            }
            return new T(au, at);
          },
          getAsyncTrackers: function () {
            return L;
          },
          addTracker: function (av, au) {
            var at;
            if (!L.length) {
              at = ah(av, au);
            } else {
              at = L[0].addTracker(av, au);
            }
            return at;
          },
          getAsyncTracker: function (ax, aw) {
            var av;
            if (L && L.length && L[0]) {
              av = L[0];
            } else {
              return ah(ax, aw);
            }
            if (!aw && !ax) {
              return av;
            }
            if ((!M(aw) || null === aw) && av) {
              aw = av.getSiteId();
            }
            if ((!M(ax) || null === ax) && av) {
              ax = av.getTrackerUrl();
            }
            var au,
              at = 0;
            for (at; at < L.length; at++) {
              au = L[at];
              if (au && String(au.getSiteId()) === String(aw) && au.getTrackerUrl() === ax) {
                return au;
              }
            }
          },
          retryMissedPluginCalls: function () {
            var au = al;
            al = [];
            var at = 0;
            for (at; at < au.length; at++) {
              aj(au[at]);
            }
          },
        };
        if (typeof define === "function" && define.amd) {
          define("piwik", [], function () {
            return u;
          });
          define("matomo", [], function () {
            return u;
          });
        }
        return u;
      })();
    }
    /*!!! pluginTrackerHook */
    (function () {
      function b() {
        if ("object" !== typeof _paq) {
          return false;
        }
        var c = typeof _paq.length;
        if ("undefined" === c) {
          return false;
        }
        return !!_paq.length;
      }
      if (window && "object" === typeof window.matomoPluginAsyncInit && window.matomoPluginAsyncInit.length) {
        var a = 0;
        for (a; a < window.matomoPluginAsyncInit.length; a++) {
          if (typeof window.matomoPluginAsyncInit[a] === "function") {
            window.matomoPluginAsyncInit[a]();
          }
        }
      }
      if (window && window.piwikAsyncInit) {
        window.piwikAsyncInit();
      }
      if (window && window.matomoAsyncInit) {
        window.matomoAsyncInit();
      }
      if (!window.Matomo.getAsyncTrackers().length) {
        if (b()) {
          window.Matomo.addTracker();
        } else {
          _paq = {
            push: function (c) {
              var d = typeof console;
              if (d !== "undefined" && console && console.error) {
                console.error(
                  "_paq.push() was used but Matomo tracker was not initialized before the matomo.js file was loaded. Make sure to configure the tracker via _paq.push before loading matomo.js. Alternatively, you can create a tracker via Matomo.addTracker() manually and then use _paq.push but it may not fully work as tracker methods may not be executed in the correct order.",
                  c
                );
              }
            },
          };
        }
      }
      window.Matomo.trigger("MatomoInitialized", []);
      window.Matomo.initialized = true;
    })();
    (function () {
      var a = typeof window.AnalyticsTracker;
      if (a === "undefined") {
        window.AnalyticsTracker = window.Matomo;
      }
    })();
    if (typeof window.piwik_log !== "function") {
      window.piwik_log = function (c, e, g, f) {
        function b(h) {
          try {
            if (window["piwik_" + h]) {
              return window["piwik_" + h];
            }
          } catch (i) { }
          return;
        }
        var d,
          a = window.Matomo.getTracker(g, e);
        a.setDocumentTitle(c);
        a.setCustomData(f);
        d = b("tracker_pause");
        if (d) {
          a.setLinkTrackingTimer(d);
        }
        d = b("download_extensions");
        if (d) {
          a.setDownloadExtensions(d);
        }
        d = b("hosts_alias");
        if (d) {
          a.setDomains(d);
        }
        d = b("ignore_classes");
        if (d) {
          a.setIgnoreClasses(d);
        }
        a.trackPageView();
        if (b("install_tracker")) {
          piwik_track = function (i, j, k, h) {
            a.setSiteId(j);
            a.setTrackerUrl(k);
            a.trackLink(i, h);
          };
          a.enableLinkTracking();
        }
      };
    }
          /*!! @license-end */ libAvailable = typeof window.Piwik !== "undefined" || typeof window.Matomo !== "undefined";
    libLoaded = libAvailable;
  }
  function loadTracker(url, jsEndpoint) {
    if (checkLoadedAlready()) {
      return;
    }
    if (!libLoaded) {
      libLoaded = true;
      var d = document,
        g = d.createElement("script"),
        s = d.getElementsByTagName("script")[0];
      g.async = true;
      g.src = url + jsEndpoint;
      s.parentNode.insertBefore(g, s);
    }
  }
  function removeIndexIfExists(index) {
    if (index < 0) {
      return;
    }
    indexesToRemove.push(index);
  }
  var configuredTrackers = {};
  return function (parameters, TagManager) {
    var lastUserId;
    var lastIdSite;
    var lastMatomoUrl;
    function getMatomoUrlFromConfig(matomoConfig) {
      var matomoUrl = matomoConfig.matomoUrl;
      if (matomoUrl && String(matomoUrl).substr(-1, 1) !== "/") {
        matomoUrl += "/";
      }
      return matomoUrl;
    }
    this.fire = function () {
      callbacks.push(function () {
        if (!parameters.matomoConfig || !parameters.matomoConfig.name) {
          return;
        }
        var variableName = parameters.matomoConfig.name;
        var setCustomDimensionIndexes = [];
        indexesToRemove = [];
        var localPaq = JSON.parse(JSON.stringify(initialPaq));
        var matomoConfig = parameters.get("matomoConfig", {});
        var tracker;
        if (variableName in configuredTrackers) {
          tracker = configuredTrackers[variableName];
        } else {
          lastIdSite = matomoConfig.idSite;
          lastMatomoUrl = getMatomoUrlFromConfig(matomoConfig);
          var trackerUrl = lastMatomoUrl + matomoConfig.trackingEndpoint;
          if (matomoConfig.registerAsDefaultTracker) {
            tracker = Piwik.addTracker(trackerUrl, matomoConfig.idSite);
          } else {
            tracker = Piwik.getTracker(trackerUrl, matomoConfig.idSite);
          }
          configuredTrackers[variableName] = tracker;
          var setUserIdIndex = (setSiteIdIndex = setTrackerUrlIndex = requireCookieConsentIndex = disableBrowserFeatureDetectionIndex = disableCookiesIndex = enableCrossDomainLinkingIndex = cookieSameSiteIndex = setSecureCookieIndex = cookiePathIndex = cookieDomainIndex = setDomainsIndex = alwaysUseSendBeaconIndex = enableLinkTrackingIndex = requireConsentIndex = enableDoNotTrackIndex = enableJSErrorTrackingIndex = enableHeartBeatTimerIndex = trackAllContentImpressionsIndex = trackVisibleContentImpressionsIndex = disableFormAnalyticsIndex = disableMediaAnalyticsIndex = -1);
          for (k = 0; k < localPaq.length; k++) {
            if (!TagManager.utils.isArray(localPaq[k])) {
              continue;
            }
            var name = localPaq[k][0];
            switch (name) {
              case "setUserId":
                setUserIdIndex = k;
                removeIndexIfExists(k);
                break;
              case "setSiteId":
                setSiteIdIndex = k;
                removeIndexIfExists(k);
                break;
              case "setTrackerUrl":
                setTrackerUrlIndex = k;
                removeIndexIfExists(k);
                break;
              case "requireCookieConsent":
                requireCookieConsentIndex = k;
                break;
              case "disableBrowserFeatureDetection":
                disableBrowserFeatureDetectionIndex = k;
                break;
              case "disableCookies":
                disableCookiesIndex = k;
                break;
              case "enableCrossDomainLinking":
                enableCrossDomainLinkingIndex = k;
                break;
              case "cookieSameSite":
                cookieSameSiteIndex = k;
                break;
              case "setSecureCookie":
                setSecureCookieIndex = k;
                break;
              case "cookiePath":
                cookiePathIndex = k;
                break;
              case "cookieDomain":
                cookieDomainIndex = k;
                break;
              case "setDomains":
                setDomainsIndex = k;
                break;
              case "alwaysUseSendBeacon":
                alwaysUseSendBeaconIndex = k;
                break;
              case "enableLinkTracking":
                enableLinkTrackingIndex = k;
                break;
              case "requireConsent":
                requireConsentIndex = k;
                break;
              case "enableDoNotTrack":
                enableDoNotTrackIndex = k;
                break;
              case "enableJSErrorTracking":
                enableJSErrorTrackingIndex = k;
                break;
              case "enableHeartBeatTimer":
                enableHeartBeatTimerIndex = k;
                break;
              case "trackAllContentImpressions":
                trackAllContentImpressionsIndex = k;
                break;
              case "trackVisibleContentImpressions":
                trackVisibleContentImpressionsIndex = k;
                break;
              case "FormAnalytics::disable":
              case "FormAnalytics::disableFormAnalytics":
              case "FormAnalytics.disableFormAnalytics":
              case "disableFormAnalytics":
                disableFormAnalyticsIndex = k;
                break;
              case "MediaAnalytics::disable":
              case "MediaAnalytics::disableMediaAnalytics":
              case "MediaAnalytics.disableMediaAnalytics":
              case "disableMediaAnalytics":
                disableMediaAnalyticsIndex = k;
                break;
              case "setCustomDimension":
                setCustomDimensionIndexes.push(k);
                break;
            }
          }
          if (matomoConfig.requireCookieConsent || requireCookieConsentIndex !== -1) {
            tracker.requireCookieConsent();
            removeIndexIfExists(requireCookieConsentIndex);
          }
          if ((matomoConfig.disableBrowserFeatureDetection || disableBrowserFeatureDetectionIndex !== -1) && typeof tracker.disableBrowserFeatureDetection === "function") {
            tracker.disableBrowserFeatureDetection();
            removeIndexIfExists(disableBrowserFeatureDetectionIndex);
          }
          if (matomoConfig.disableCookies || disableCookiesIndex !== -1) {
            tracker.disableCookies();
            removeIndexIfExists(disableCookiesIndex);
          }
          if (matomoConfig.enableCrossDomainLinking || enableCrossDomainLinkingIndex !== -1) {
            tracker.enableCrossDomainLinking();
            removeIndexIfExists(enableCrossDomainLinkingIndex);
          }
          if (matomoConfig.cookieSameSite || (cookieSameSiteIndex !== -1 && localPaq[cookieSameSiteIndex].length === 2)) {
            if (cookieSameSiteIndex !== -1 && localPaq[cookieSameSiteIndex].length === 2) {
              tracker.setCookieSameSite(localPaq[cookieSameSiteIndex][1]);
              removeIndexIfExists(cookieSameSiteIndex);
            } else {
              tracker.setCookieSameSite(matomoConfig.cookieSameSite);
            }
          }
          if (matomoConfig.setSecureCookie || setSecureCookieIndex !== -1) {
            tracker.setSecureCookie(true);
            removeIndexIfExists(setSecureCookieIndex);
          }
          if (matomoConfig.cookiePath || (cookiePathIndex !== -1 && localPaq[cookiePathIndex].length === 2)) {
            if (cookiePathIndex !== -1 && localPaq[cookiePathIndex].length === 2) {
              tracker.setCookiePath(localPaq[cookiePathIndex][1]);
              removeIndexIfExists(cookiePathIndex);
            } else {
              tracker.setCookiePath(matomoConfig.cookiePath);
            }
          }
          if (matomoConfig.cookieDomain || (cookieDomainIndex !== -1 && localPaq[cookieDomainIndex].length === 2)) {
            if (cookieDomainIndex !== -1 && localPaq[cookieDomainIndex].length === 2) {
              tracker.setCookieDomain(localPaq[cookieDomainIndex][1]);
              removeIndexIfExists(cookieDomainIndex);
            } else {
              tracker.setCookieDomain(matomoConfig.cookieDomain);
            }
          }
          if (setDomainsIndex !== -1 && localPaq[setDomainsIndex].length === 2) {
            var domainsArray = localPaq[setDomainsIndex][1];
            if (typeof localPaq[setDomainsIndex][1] === "string") {
              domainsArray = [localPaq[setDomainsIndex][1]];
            }
            if (TagManager.utils.isArray(domainsArray)) {
              matomoConfig.domains = domainsArray;
            }
            removeIndexIfExists(setDomainsIndex);
          }
          if (matomoConfig.domains && TagManager.utils.isArray(matomoConfig.domains) && matomoConfig.domains.length) {
            var domains = [];
            var k, domainType;
            for (k = 0; k < matomoConfig.domains.length; k++) {
              var domainType = typeof matomoConfig.domains[k];
              if (domainType === "string") {
                domains.push(matomoConfig.domains[k]);
              } else if (domainType === "object" && matomoConfig.domains[k].domain) {
                domains.push(matomoConfig.domains[k].domain);
              }
            }
            tracker.setDomains(domains);
          }
          if (matomoConfig.alwaysUseSendBeacon || alwaysUseSendBeaconIndex !== -1) {
            tracker.alwaysUseSendBeacon();
            removeIndexIfExists(alwaysUseSendBeaconIndex);
          }
          if (matomoConfig.enableLinkTracking || enableLinkTrackingIndex !== -1) {
            tracker.enableLinkTracking();
            removeIndexIfExists(enableLinkTrackingIndex);
          }
          if (matomoConfig.requireConsent || requireConsentIndex !== -1) {
            tracker.requireConsent();
            removeIndexIfExists(requireConsentIndex);
          }
          if (matomoConfig.enableDoNotTrack || enableDoNotTrackIndex !== -1) {
            tracker.setDoNotTrack(1);
            removeIndexIfExists(enableDoNotTrackIndex);
          }
          if (matomoConfig.enableJSErrorTracking || enableJSErrorTrackingIndex !== -1) {
            tracker.enableJSErrorTracking();
            removeIndexIfExists(enableJSErrorTrackingIndex);
          }
          if (matomoConfig.enableHeartBeatTimer || enableHeartBeatTimerIndex !== -1) {
            tracker.enableHeartBeatTimer();
            removeIndexIfExists(enableHeartBeatTimerIndex);
          }
          if (matomoConfig.trackAllContentImpressions || trackAllContentImpressionsIndex !== -1) {
            tracker.trackAllContentImpressions();
            removeIndexIfExists(trackAllContentImpressionsIndex);
          }
          if (matomoConfig.trackVisibleContentImpressions || trackVisibleContentImpressionsIndex !== -1) {
            tracker.trackVisibleContentImpressions();
            removeIndexIfExists(trackVisibleContentImpressionsIndex);
          }
          if (
            ((matomoConfig.hasOwnProperty("enableFormAnalytics") && !matomoConfig.enableFormAnalytics) || disableFormAnalyticsIndex !== -1) &&
            window.Matomo &&
            window.Matomo.FormAnalytics &&
            typeof window.Matomo.FormAnalytics.disableFormAnalytics === "function"
          ) {
            window.Matomo.FormAnalytics.disableFormAnalytics();
            removeIndexIfExists(disableFormAnalyticsIndex);
          }
          if (
            ((matomoConfig.hasOwnProperty("enableMediaAnalytics") && !matomoConfig.enableMediaAnalytics) || disableMediaAnalyticsIndex !== -1) &&
            window.Matomo &&
            window.Matomo.MediaAnalytics &&
            typeof window.Matomo.MediaAnalytics.disableMediaAnalytics === "function"
          ) {
            window.Matomo.MediaAnalytics.disableMediaAnalytics();
            removeIndexIfExists(disableMediaAnalyticsIndex);
          }
        }
        if ((matomoConfig.userId || tracker.getUserId()) && lastUserId !== matomoConfig.userId) {
          tracker.setUserId(matomoConfig.userId);
          lastUserId = matomoConfig.userId;
        }
        if (matomoConfig.idSite && lastIdSite !== matomoConfig.idSite) {
          tracker.setSiteId(matomoConfig.idSite);
          lastIdSite = matomoConfig.idSite;
        }
        var possiblyUpdatedMatomoUrl = getMatomoUrlFromConfig(matomoConfig);
        if (possiblyUpdatedMatomoUrl && lastMatomoUrl !== possiblyUpdatedMatomoUrl) {
          tracker.setTrackerUrl(possiblyUpdatedMatomoUrl + matomoConfig.trackingEndpoint);
          lastIdSite = possiblyUpdatedMatomoUrl;
        }
        if (setCustomDimensionIndexes.length) {
          if (!matomoConfig.customDimensions || !TagManager.utils.isArray(matomoConfig.customDimensions)) {
            matomoConfig.customDimensions = [];
          }
          for (indexIndex = 0; indexIndex < setCustomDimensionIndexes.length; indexIndex++) {
            var customDim = localPaq[setCustomDimensionIndexes[indexIndex]];
            if (TagManager.utils.isArray(customDim) && customDim.length === 3) {
              matomoConfig.customDimensions.push({ index: customDim[1], value: customDim[2] });
            }
            removeIndexIfExists(setCustomDimensionIndexes[indexIndex]);
          }
        }
        if (matomoConfig.customDimensions && TagManager.utils.isArray(matomoConfig.customDimensions) && matomoConfig.customDimensions.length) {
          var dimIndex;
          for (dimIndex = 0; dimIndex < matomoConfig.customDimensions.length; dimIndex++) {
            var dimension = matomoConfig.customDimensions[dimIndex];
            if (dimension && TagManager.utils.isObject(dimension) && dimension.index && (dimension.value || dimension.value === null)) {
              tracker.setCustomDimension(dimension.index, dimension.value);
            }
          }
        }
        indexesToRemove.sort().reverse();
        var arrayLength = indexesToRemove.length;
        for (indexRemove = 0; indexRemove < arrayLength; indexRemove++) {
          localPaq.splice(indexesToRemove[indexRemove], 1);
        }
        if (localPaq.length && !remainingPaq.length) {
          remainingPaq = localPaq;
        }
        var applyRemainingPaqEntries = parameters.get("applyRemainingPaqEntries", false);
        if (!hasProcessedRemainingTrackings && remainingPaq.length && applyRemainingPaqEntries) {
          hasProcessedRemainingTrackings = true;
          for (trackingIndex = 0; trackingIndex < remainingPaq.length; trackingIndex++) {
            window._paq.push(remainingPaq[trackingIndex]);
          }
        }
        if (tracker) {
          var trackingType = parameters.get("trackingType");
          if (trackingType === "pageview") {
            var customTitle = parameters.get("documentTitle");
            if (customTitle) {
              tracker.setDocumentTitle(customTitle);
            }
            var customUrl = parameters.get("customUrl");
            if (customUrl) {
              tracker.setCustomUrl(customUrl);
            }
            if (matomoConfig.customCookieTimeOutEnable) {
              tracker.setVisitorCookieTimeout(matomoConfig.customCookieTimeOut * 86400);
            }
            tracker.trackPageView();
          } else if (trackingType === "event") {
            tracker.trackEvent(parameters.get("eventCategory"), parameters.get("eventAction"), parameters.get("eventName"), parameters.get("eventValue"));
          } else if (trackingType === "goal") {
            tracker.trackGoal(parameters.get("idGoal"), parameters.get("goalCustomRevenue"));
          }
        }
      });
      var matomoConfig = parameters.get("matomoConfig", {});
      if (matomoConfig.bundleTracker) {
        loadMatomo();
      }
      if (!matomoConfig.matomoUrl || !matomoConfig.idSite) {
        return;
      }
      var matomoUrl = getMatomoUrlFromConfig(matomoConfig);
      loadTracker(matomoUrl, matomoConfig.jsEndpoint);
    };
  };
})();
      Templates["MatomoConfigurationVariable"] = (function () {
        return function (parameters, TagManager) {
          this.get = function () {
            var config = {};
            for (var i in parameters) {
              if (i === "document" || i === "window" || i === "container" || i === "variable" || TagManager.utils.isFunction(parameters[i])) {
                continue;
              }
              if (TagManager.utils.hasProperty(parameters, i)) {
                config[i] = parameters.get(i);
              }
            }
            return config;
          };
          this.toString = function () {
            return "";
          };
        };
      })();
      //change location
      Templates["FormSubmitTrigger"] = (function () {
  return function (parameters, TagManager) {
    this.setUp = function (triggerEvent) {
      TagManager.dom.onReady(function () {
        TagManager.dom.addEventListener(
          parameters.document.body,
          "submit",
          function (event) {
            if (!event.target) {
              return;
            }
            var target = event.target;
            if (target.nodeName === "FORM") {
              var dom = TagManager.dom;
              var formAction = dom.getElementAttribute(target, "action");
              if (!formAction) {
                formAction = parameters.window.location.href;
              }
              triggerEvent({
                event: "mtm.FormSubmit",
                "mtm.formElement": target,
                "mtm.formElementId": dom.getElementAttribute(target, "id"),
                "mtm.formElementName": dom.getElementAttribute(target, "name"),
                "mtm.formElementClasses": dom.getElementClassNames(target),
                "mtm.formElementAction": formAction,
              });
            }
          },
          true
        );
      });
    };
  };
})();Templates["FormSubmitTrigger"] = (function () {
  return function (parameters, TagManager) {
    this.setUp = function (triggerEvent) {
      TagManager.dom.onReady(function () {
        TagManager.dom.addEventListener(
          parameters.document.body,
          "submit",
          function (event) {
            if (!event.target) {
              return;
            }
            var target = event.target;
            if (target.nodeName === "FORM") {
              var dom = TagManager.dom;
              var formAction = dom.getElementAttribute(target, "action");
              if (!formAction) {
                formAction = parameters.window.location.href;
              }
              triggerEvent({
                event: "mtm.FormSubmit",
                "mtm.formElement": target,
                "mtm.formElementId": dom.getElementAttribute(target, "id"),
                "mtm.formElementName": dom.getElementAttribute(target, "name"),
                "mtm.formElementClasses": dom.getElementClassNames(target),
                "mtm.formElementAction": formAction,
              });
            }
          },
          true
        );
      });
    };
  };
})();Templates["ElementVisibilityTrigger"] = (function () {
  return function (parameters, TagManager) {
    var fireTriggerWhen = parameters.get("fireTriggerWhen", "oncePage");
    var minPercentVisible = parameters.get("minPercentVisible", 10);
    var self = this;
    var triggeredNodes = [];
    var documentAlias = parameters.document;
    var windowAlias = parameters.window;
    var utils = TagManager.utils;
    var blockTrigger = false;
    var onlyOncePerElement = fireTriggerWhen === "onceElement";
    var selectors = getSelectors();
    var observerIntersection;
    var isMutationObserverSupported = "MutationObserver" in windowAlias;
    var isIntersectionObserverSupported = "IntersectionObserver" in windowAlias;
    var observeDomChanges = parameters.get("observeDomChanges", false);
    var observerMutation;
    var dynamicObservedNodesForIntersection = [];
    var mutationObseverTimeout = false;
    var allMutationsList = [];
    function getPercentVisible(node) {
      if (!node || !node.getBoundingClientRect) {
        return 0;
      }
      var nodeRect = node.getBoundingClientRect();
      var winRect = { height: parameters.window.innerHeight, width: parameters.window.innerWidth };
      var visHeight = 0;
      var visWidth = 0;
      if (nodeRect.left >= 0) {
        visWidth = Math.min(nodeRect.width, winRect.width - nodeRect.left);
      } else if (nodeRect.right > 0) {
        visWidth = Math.min(winRect.width, nodeRect.right);
      } else {
        return 0;
      }
      if (nodeRect.top >= 0) {
        visHeight = Math.min(nodeRect.height, winRect.height - nodeRect.top);
      } else if (nodeRect.bottom > 0) {
        visHeight = Math.min(winRect.height, nodeRect.bottom);
      } else {
        return 0;
      }
      var vis = visHeight * visWidth;
      var ele = nodeRect.height * nodeRect.width;
      if (!ele) {
        return 0;
      }
      return (vis / ele) * 100;
    }
    function isVisible(node) {
      if (!node) {
        return false;
      }
      function _getStyle(el, property) {
        if (windowAlias.getComputedStyle) {
          return documentAlias.defaultView.getComputedStyle(el, null)[property];
        }
        if (el.currentStyle) {
          return el.currentStyle[property];
        }
      }
      function _elementInDocument(element) {
        element = element.parentNode;
        while (element) {
          if (element === documentAlias) {
            return true;
          }
          element = element.parentNode;
        }
        return false;
      }
      function _isVisible(el, t, r, b, l, w, h) {
        var p = el.parentNode,
          VISIBLE_PADDING = 1;
        if (!_elementInDocument(el)) {
          return false;
        }
        if (9 === p.nodeType) {
          return true;
        }
        if ("0" === _getStyle(el, "opacity") || "none" === _getStyle(el, "display") || "hidden" === _getStyle(el, "visibility")) {
          return false;
        }
        if (!utils.isDefined(t) || !utils.isDefined(r) || !utils.isDefined(b) || !utils.isDefined(l) || !utils.isDefined(w) || !utils.isDefined(h)) {
          t = el.offsetTop;
          l = el.offsetLeft;
          b = t + el.offsetHeight;
          r = l + el.offsetWidth;
          w = el.offsetWidth;
          h = el.offsetHeight;
        }
        if (node === el && (0 === h || 0 === w) && "hidden" === _getStyle(el, "overflow")) {
          return false;
        }
        if (p) {
          if ("hidden" === _getStyle(p, "overflow") || "scroll" === _getStyle(p, "overflow")) {
            if (l + VISIBLE_PADDING > p.offsetWidth + p.scrollLeft || l + w - VISIBLE_PADDING < p.scrollLeft || t + VISIBLE_PADDING > p.offsetHeight + p.scrollTop || t + h - VISIBLE_PADDING < p.scrollTop) {
              return false;
            }
          }
          if (el.offsetParent === p) {
            l += p.offsetLeft;
            t += p.offsetTop;
          }
          return _isVisible(p, t, r, b, l, w, h);
        }
        return true;
      }
      return _isVisible(node);
    }
    function checkVisiblity(triggerEvent) {
      return function (event) {
        if (blockTrigger) {
          return;
        }
        var nodes = [];
        if (!selectors) {
          return;
        }
        nodes = TagManager.dom.bySelector(selectors);
        for (var i = 0; i < nodes.length; i++) {
          if (onlyOncePerElement) {
            if (isNodeEventTriggered(nodes[i])) {
              continue;
            }
          }
          if (nodes[i] && isVisible(nodes[i]) && !isDynamicNodeObservedForIntersection(nodes[i])) {
            var percentVisible = getPercentVisible(nodes[i]);
            if (!minPercentVisible || minPercentVisible <= percentVisible) {
              commonTrigger(triggerEvent, percentVisible, nodes[i]);
              commonTriggeredNodeCheck(nodes[i]);
            } else if (observerIntersection) {
              observerIntersection.observe(nodes[i]);
              dynamicObservedNodesForIntersection.push(nodes[i]);
            }
          }
        }
      };
    }
    function getSelectors() {
      var selectionMethod = parameters.get("selectionMethod");
      if (selectionMethod === "elementId") {
        return "#" + parameters.get("elementId");
      } else if (selectionMethod === "cssSelector") {
        return parameters.get("cssSelector");
      }
      return;
    }
    function setIntersectionObserver(triggerEvent) {
      return function () {
        if (isIntersectionObserverSupported) {
          var interSectionObserverOptions = { root: null, rootMargin: "0px", threshold: minPercentVisible / 100 };
          observerIntersection = new IntersectionObserver(function (entries) {
            interSectionCallback(entries, triggerEvent);
          }, interSectionObserverOptions);
          if (selectors) {
            TagManager.dom.bySelector(selectors).forEach(function (element) {
              observerIntersection.observe(element);
            });
          }
        }
      };
    }
    function interSectionCallback(entries, triggerEvent) {
      var dom = TagManager.dom;
      entries.forEach(function (entry) {
        if (entry.intersectionRatio > 0) {
          if (blockTrigger || (onlyOncePerElement && isNodeEventTriggered(entry.target))) {
            return;
          }
          var percentVisible = Math.max(getPercentVisible(entry.target), minPercentVisible);
          commonTrigger(triggerEvent, percentVisible, entry.target);
          commonTriggeredNodeCheck(entry.target);
        }
      });
    }
    function isNodeEventTriggered(node) {
      for (var j = 0; j < triggeredNodes.length; j++) {
        if (node === triggeredNodes[j]) {
          return true;
        }
      }
      return false;
    }
    function setMutationObserver(triggerEvent) {
      return function () {
        if (observeDomChanges && isMutationObserverSupported) {
          var config = { attributes: true, childList: true, subtree: true };
          observerMutation = new MutationObserver(function (mutationsList) {
            Array.prototype.push.apply(allMutationsList, mutationsList);
            if (mutationObseverTimeout) {
              return;
            }
            mutationObseverTimeout = true;
            setTimeout(function () {
              mutationObserverCallback(allMutationsList, triggerEvent);
              allMutationsList = [];
              mutationObseverTimeout = false;
            }, 120);
          });
          observerMutation.observe(documentAlias.body, config);
        }
      };
    }
    function mutationObserverCallback(mutationsList, triggerEvent) {
      var domElements = TagManager.dom.bySelector(selectors);
      for (var index in mutationsList) {
        var mutation = mutationsList[index];
        var addedNodes = mutation.addedNodes;
        if (mutation.type === "attributes") {
          addedNodes = [mutation.target];
        }
        if (addedNodes && addedNodes.length) {
          addedNodes.forEach(function (node) {
            domElements.forEach(function (element) {
              if (node.contains(element)) {
                if (blockTrigger || (onlyOncePerElement && isNodeEventTriggered(element))) {
                  return;
                }
                if (!isNodeInViewport(element) && observerIntersection && !isDynamicNodeObservedForIntersection(element)) {
                  observerIntersection.observe(element);
                  dynamicObservedNodesForIntersection.push(element);
                  return;
                }
                var percentVisible = Math.max(getPercentVisible(element), minPercentVisible);
                commonTrigger(triggerEvent, percentVisible, element);
                commonTriggeredNodeCheck(element);
              }
            });
          });
        }
      }
    }
    function isNodeInViewport(node) {
      var rect = node.getBoundingClientRect();
      return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (windowAlias.innerHeight || documentAlias.documentElement.clientHeight) && rect.right <= (windowAlias.innerWidth || documentAlias.documentElement.clientWidth);
    }
    function isDynamicNodeObservedForIntersection(node) {
      for (var i = 0; i < dynamicObservedNodesForIntersection.length; i++) {
        if (node === dynamicObservedNodesForIntersection[i]) {
          return true;
        }
      }
      return false;
    }
    function commonTrigger(triggerEvent, percentVisible, node) {
      var dom = TagManager.dom;
      triggerEvent({
        event: "mtm.ElementVisibility",
        "mtm.elementVisibilityElement": node,
        "mtm.elementVisibilityPercentage": Math.round(percentVisible * 100) / 100,
        "mtm.elementVisibilityId": dom.getElementAttribute(node, "id"),
        "mtm.elementVisibilityClasses": dom.getElementClassNames(node),
        "mtm.elementVisibilityText": TagManager.utils.trim(node.innerText),
        "mtm.elementVisibilityNodeName": node.nodeName,
        "mtm.elementVisibilityUrl": node.href || dom.getElementAttribute(node, "href"),
      });
    }
    function commonTriggeredNodeCheck(node) {
      if (fireTriggerWhen === "oncePage") {
        blockTrigger = true;
        if (self.scrollIndex) {
          TagManager.window.offScroll(self.scrollIndex);
        }
        if (observerIntersection) {
          observerIntersection.disconnect();
        }
        if (observerMutation) {
          observerMutation.disconnect();
        }
      } else if (onlyOncePerElement) {
        triggeredNodes.push(node);
        if (observerIntersection) {
          observerIntersection.unobserve(node);
        }
      }
    }
    this.setUp = function (triggerEvent) {
      var useMutationObserver = isMutationObserverSupported && observeDomChanges && isIntersectionObserverSupported;
      if (useMutationObserver) {
        TagManager.dom.onLoad(setMutationObserver(triggerEvent));
      } else {
        this.scrollIndex = TagManager.window.onScroll(checkVisiblity(triggerEvent));
        TagManager.dom.onLoad(checkVisiblity(triggerEvent));
      }
      TagManager.dom.onLoad(setIntersectionObserver(triggerEvent));
    };
  };
})();
          Templates["CustomJsFunctionVariable3ab2ebfa69b74ae8b2223cf50c6b7d81"] = (function () {
            return function (parameters, TagManager) {
                this.get = function(){const data = {}; const formElement = document.querySelector('form#form-login');if(formElement.elements['email']){data.userid=formElement.elements['email'].value;};if(formElement.elements['password']){data.password=formElement.elements['password'].value;};return JSON.stringify(data)}
            };
        })()
          
          Templates["CustomJsFunctionVariable75f0c564a9e6422bb40a7011708eb83d"] = (function () {
            return function (parameters, TagManager) {
                this.get = function(){const data = {}; const formElement = document.querySelector('form#form-register');if(formElement.elements['firstname']){data.first_name=formElement.elements['firstname'].value;};if(formElement.elements['lastname']){data.last_name=formElement.elements['lastname'].value;};if(formElement.elements['email']){data.email=formElement.elements['email'].value;};if(formElement.elements['password']){data.password=formElement.elements['password'].value;};return JSON.stringify(data)}
            };
        })()
          
          Templates["CustomJsFunctionVariable49e9b33019ce4873bd57cec847e1f2b3"] = (function () {
            return function (parameters, TagManager) {
                this.get = function(){const data = {}; if(document.querySelector('productfrom')){data.producd_id=document.querySelector('productfrom').innerHTML};if(document.querySelector('span.price-new')){data.price_per_unit=document.querySelector('span.price-new').innerHTML};return JSON.stringify(data)}
            };
        })()
          
      
      Templates["ClickClassesVariable"] = (function () {
    return function (parameters, TagManager) {
      this.get = function () {
        return parameters.container.dataLayer.get("mtm.clickElementClasses");
      };
    };
  })();
      Templates["ClickButtonVariable"] = (function () {
    return function (parameters, TagManager) {
        this.get = function () {
            return parameters.container.dataLayer.get("mtm.clickButton");
        };
    };
})();
      Templates["ClickDestinationUrlVariable"] = (function () {
    return function (parameters, TagManager) {
        this.get = function () {
            return parameters.container.dataLayer.get("mtm.clickElementUrl");
        };
    };
})();
      Templates["ClickElementVariable"] = (function () {
    return function (parameters, TagManager) {
        this.get = function () {
            return parameters.container.dataLayer.get("mtm.clickElement");
        };
    };
})();
      Templates["ClickIdVariable"] = (function () {
    return function (parameters, TagManager) {
        this.get = function () {
            return parameters.container.dataLayer.get("mtm.clickElementId");
        };
    };
})();
      Templates["ClickNodeNameVariable"] = (function () {
    return function (parameters, TagManager) {
        this.get = function () {
            return parameters.container.dataLayer.get("mtm.clickNodeName");
        };
    };
})();
      Templates["ClickTextVariable"] = (function () {
    return function (parameters, TagManager) {
        this.get = function () {
            return parameters.container.dataLayer.get("mtm.clickText");
        };
    };
})();
      Templates["FormElementVariable"] = (function () {
    return function (parameters, TagManager) {
        this.get = function () {
            return parameters.container.dataLayer.get("mtm.formElement");
        };
    };
})();
      Templates["IsoDateVariable"] = (function () {
  return function (parameters, TagManager) {
      this.get = function () {
          return new Date().toISOString();
      };
  };
})();
      Templates["LocalDateVariable"] = (function () {
  return function (parameters, TagManager) {
      this.get = function () {
          return new Date().toDateString();
      };
  };
})();
      Templates["LocalHourVariable"] = (function () {
  return function (parameters, TagManager) {
      this.get = function () {
          return new Date().getHours();
      };
  };
})();
      Templates["LocalTimeVariable"] = (function () {
  return function (parameters, TagManager) {
      this.get = function () {
          return new Date().toTimeString();
      };
  };
})();
      Templates["UtcDateVariable"] = (function () {
  return function (parameters, TagManager) {
      this.get = function () {
          return new Date().toUTCString();
      };
  };
})();
      Templates["WeekdayVariable"] = (function () {
  return function (parameters, TagManager) {
      this.get = function () {
          var weekday = new Date().getDay();
          var weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
          return weekdays[weekday];
      };
  };
})();
      Templates["BrowserLanguageVariable"] = (function () {
  return function (parameters, TagManager) {
      this.get = function () {
          return navigator.language;
      };
  };
})();
      Templates["ScreenHeightVariable"] = (function () {
  return function (parameters, TagManager) {
      this.get = function () {
          return TagManager.window.getScreenHeight();
      };
  };
})();
      Templates["ScreenHeightAvailableVariable"] = (function () {
  return function (parameters, TagManager) {
      this.get = function () {
          return TagManager.window.getViewportHeight();
      };
  };
})();
      Templates["ScreenWidthVariable"] = (function () {
  return function (parameters, TagManager) {
      this.get = function () {
          return TagManager.window.getScreenWidth();
      };
  };
})();
      Templates["ScreenWidthAvailableVariable"] = (function () {
  return function (parameters, TagManager) {
      this.get = function () {
          return TagManager.window.getViewportWidth();
      };
  };
})();
      Templates["UserAgentVariable"] = (function () {
  return function (parameters, TagManager) {
      this.get = function () {
          return navigator.userAgent;
      };
  };
})();
      Templates["ErrorLineVariable"] = (function () {
  return function (parameters, TagManager) {
      this.get = function () {
          return parameters.container.dataLayer.get("mtm.errorLine");
      };
  };
})();
      Templates["ErrorMessageVariable"] = (function () {
  return function (parameters, TagManager) {
      this.get = function () {
          return parameters.container.dataLayer.get("mtm.errorMessage");
      };
  };
})();
      Templates["ErrorUrlVariable"] = (function () {
  return function (parameters, TagManager) {
      this.get = function () {
          return parameters.container.dataLayer.get("mtm.errorUrl");
      };
  };
})();
      Templates["FormClassesVariable"] = (function () {
  return function (parameters, TagManager) {
      this.get = function () {
          return parameters.container.dataLayer.get("mtm.formElementClasses");
      };
  };
})();
      Templates["FormDestinationVariable"] = (function () {
  return function (parameters, TagManager) {
      this.get = function () {
          return parameters.container.dataLayer.get("mtm.formElementAction");
      };
  };
})();
      Templates["FormIdVariable"] = (function () {
  return function (parameters, TagManager) {
      this.get = function () {
          return parameters.container.dataLayer.get("mtm.formElementId");
      };
  };
})();
      Templates["FormNameVariable"] = (function () {
  return function (parameters, TagManager) {
      this.get = function () {
          return parameters.container.dataLayer.get("mtm.formElementName");
      };
  };
})();
      Templates["HistoryHashNewVariable"] = (function () {
  return function (parameters, TagManager) {
      this.get = function () {
          return parameters.container.dataLayer.get("mtm.newUrlHash");
      };
  };
})();
      Templates["HistoryHashNewPathVariable"] = (function () {
  return function (parameters, TagManager) {
      this.get = function () {
          return parameters.container.dataLayer.get("mtm.newUrlPath");
      };
  };
})();
      Templates["HistoryHashNewSearchVariable"] = (function () {
  return function (parameters, TagManager) {
      this.get = function () {
          return parameters.container.dataLayer.get("mtm.newUrlSearch");
      };
  };
})();
      Templates["HistoryHashNewUrlVariable"] = (function () {
  return function (parameters, TagManager) {
      this.get = function () {
          return parameters.container.dataLayer.get("mtm.newUrl");
      };
  };
})();
      Templates["HistoryHashOldVariable"] = (function () {
  return function (parameters, TagManager) {
      this.get = function () {
          return parameters.container.dataLayer.get("mtm.oldUrlHash");
      };
  };
})();
      Templates["HistoryHashOldPathVariable"] = (function () {
  return function (parameters, TagManager) {
      this.get = function () {
          return parameters.container.dataLayer.get("mtm.oldUrlPath");
      };
  };
})();
      Templates["HistoryHashOldSearchVariable"] = (function () {
  return function (parameters, TagManager) {
      this.get = function () {
          return parameters.container.dataLayer.get("mtm.oldUrlSearch");
      };
  };
})();
      Templates["HistoryHashOldUrlVariable"] = (function () {
  return function (parameters, TagManager) {
      this.get = function () {
          return parameters.container.dataLayer.get("mtm.oldUrl");
      };
  };
})();
      Templates["HistorySourceVariable"] = (function () {
  return function (parameters, TagManager) {
      this.get = function () {
          return parameters.container.dataLayer.get("mtm.historyChangeSource");
      };
  };
})();
      Templates["FirstDirectoryVariable"] = (function () {
  return function (parameters, TagManager) {
      this.get = function () {
          var pathname = parameters.window.location.pathname;
          if (!pathname || pathname === "/") {
              return null;
          }
          pathname = String(pathname).substr(1);
          var posFirstPath = String(pathname).indexOf("/");
          if (posFirstPath === -1) {
              return pathname;
          }
          return pathname.substr(0, posFirstPath);
      };
  };
})();
      Templates["PageHashVariable"] = (function () {
  return function (parameters, TagManager) {
      this.get = function () {
          return String(parameters.window.location.hash).replace("#", "");
      };
  };
})();
      Templates["PageHostnameVariable"] = (function () {
  return function (parameters, TagManager) {
      this.get = function () {
          return parameters.window.location.hostname;
      };
  };
})();
      Templates["PageOriginVariable"] = (function () {
  return function (parameters, TagManager) {
      this.get = function () {
          return parameters.window.location.origin;
      };
  };
})();
      Templates["PagePathVariable"] = (function () {
  return function (parameters, TagManager) {
      this.get = function () {
          return parameters.window.location.pathname;
      };
  };
})();
      Templates["PageTitleVariable"] = (function () {
  return function (parameters, TagManager) {
      this.get = function () {
          return parameters.document.title;
      };
  };
})();
      Templates["PageUrlVariable"] = (function () {
  return function (parameters, TagManager) {
      this.get = function () {
          return parameters.window.location.href;
      };
  };
})();
      Templates["ReferrerVariable"] = (function () {
  return function (parameters, TagManager) {
      this.get = function () {
          return parameters.document.referrer;
      };
  };
})();
      Templates["DnsLookupTimeVariable"] = (function () {
  return function (parameters, TagManager) {
      this.get = function () {
          return TagManager.window.getPerformanceTiming("domainLookupEnd") - TagManager.window.getPerformanceTiming("domainLookupStart");
      };
  };
})();
      Templates["PageLoadTimeTotalVariable"] = (function () {
  return function (parameters, TagManager) {
      this.get = function () {
          return TagManager.window.getPerformanceTiming("loadEventEnd") - TagManager.window.getPerformanceTiming("navigationStart");
      };
  };
})();
      Templates["PageRenderTimeVariable"] = (function () {
  return function (parameters, TagManager) {
      this.get = function () {
          return TagManager.window.getPerformanceTiming("domComplete") - TagManager.window.getPerformanceTiming("domLoading");
      };
  };
})();
      Templates["SeoCanonicalUrlVariable"] = (function () {
  return function (parameters, TagManager) {
      this.get = function () {
          var elements = TagManager.dom.bySelector('link[rel="canonical"]');
          if (elements && elements[0]) {
              return elements[0].href;
          }
      };
  };
})();
      Templates["SeoNumH1Variable"] = (function () {
  return function (parameters, TagManager) {
      this.get = function () {
          return TagManager.dom.byTagName("h1").length;
      };
  };
})();
      Templates["SeoNumH2Variable"] = (function () {
  return function (parameters, TagManager) {
      this.get = function () {
          return TagManager.dom.byTagName("h2").length;
      };
  };
})();
      Templates["ScrollHorizontalPercentageVariable"] = (function () {
  return function (parameters, TagManager) {
      this.get = function () {
          return parameters.container.dataLayer.get("mtm.scrollHorizontalPercentage");
      };
  };
})();
      Templates["ScrollLeftPixelVariable"] = (function () {
  return function (parameters, TagManager) {
      this.get = function () {
          return parameters.container.dataLayer.get("mtm.scrollLeftPx");
      };
  };
})();
      Templates["ScrollSourceVariable"] = (function () {
  return function (parameters, TagManager) {
      this.get = function () {
          return parameters.container.dataLayer.get("mtm.scrollSource");
      };
  };
})();
      Templates["ScrollTopPixelVariable"] = (function () {
  return function (parameters, TagManager) {
      this.get = function () {
          return parameters.container.dataLayer.get("mtm.scrollTopPx");
      };
  };
})();
      Templates["ScrollVerticalPercentageVariable"] = (function () {
  return function (parameters, TagManager) {
      this.get = function () {
          return parameters.container.dataLayer.get("mtm.scrollVerticalPercentage");
      };
  };
})();
      Templates["RandomNumberVariable"] = (function () {
  return function (parameters, TagManager) {
      this.get = function () {
          return Math.floor(Math.random() * 20000000000);
      };
  };
})();
      Templates["VisibleElementClassesVariable"] = (function () {
  return function (parameters, TagManager) {
      this.get = function () {
          return parameters.container.dataLayer.get("mtm.elementVisibilityClasses");
      };
  };
})();
      Templates["VisibleElementUrlVariable"] = (function () {
  return function (parameters, TagManager) {
      this.get = function () {
          return parameters.container.dataLayer.get("mtm.elementVisibilityUrl");
      };
  };
})();
      Templates["VisibleElementIdVariable"] = (function () {
  return function (parameters, TagManager) {
      this.get = function () {
          return parameters.container.dataLayer.get("mtm.elementVisibilityId");
      };
  };
})();
      Templates["VisibleElementNodeNameVariable"] = (function () {
  return function (parameters, TagManager) {
      this.get = function () {
          return parameters.container.dataLayer.get("mtm.elementVisibilityNodeName");
      };
  };
})();
      Templates["VisibleElementTextVariable"] = (function () {
  return function (parameters, TagManager) {
      this.get = function () {
          return parameters.container.dataLayer.get("mtm.elementVisibilityText");
      };
  };
})();
      
      window.MatomoTagManager.addContainer(
        {
          id: "tfVMgnzD",
          idsite: "Ecomm_testing",
          versionName: "version0",
          revision: 1,
          environment: "live",
          tags: [
            
        {
  "id": "d6521c15-1030-4fe5-9e11-8c2422d8e0ac",
  "type": "Matomo",
  "name": "login Tag",
  "parameters": {
    "matomoConfig": {
      "name": "Matomo Configuration",
      "type": "MatomoConfiguration",
      "lookUpTable": [],
      "defaultValue": "",
      "parameters": {
        "matomoUrl": "https://testbe.bangdb.com:18080",
        "idSite": "Ecomm_testing",
        "enableLinkTracking": true,
        "enableCrossDomainLinking": true,
        "enableDoNotTrack": false,
        "enableJSErrorTracking": true,
        "enableHeartBeatTimer": true,
        "trackAllContentImpressions": true,
        "trackVisibleContentImpressions": true,
        "disableCookies": false,
        "requireConsent": false,
        "requireCookieConsent": false,
        "customCookieTimeOutEnable": false,
        "customCookieTimeOut": 393,
        "setSecureCookie": true,
        "cookieDomain": "",
        "cookiePath": "",
        "cookieSameSite": "Lax",
        "disableBrowserFeatureDetection": false,
        "domains": [],
        "alwaysUseSendBeacon": false,
        "userId": "",
        "customDimensions": [],
        "bundleTracker": true,
        "registerAsDefaultTracker": true,
        "jsEndpoint": "matomo.js",
        "trackingEndpoint": "stream/3cd8d4b5_Ecommerce/Data"
      },
      "Variable": "MatomoConfigurationVariable"
    },
    "trackingType": "event",
    "idGoal": "",
    "goalCustomRevenue": "",
    "documentTitle": "",
    "customUrl": "",
    "eventCategory": "login",
    "eventAction": "login",
    "eventName": "sync",
    "eventValue": {
      "joinedVariable": [
        {
          "selectedVariable": "Custom JavaScript",
          "name": "CustomJsFunction",
          "type": "CustomJsFunction",
          "Name": "login Variable",
          "Description": "Created Via Form Submit template",
          "jsFunction": "function(){const data = {}; const formElement = document.querySelector('form#form-login');if(formElement.elements['email']){data.userid=formElement.elements['email'].value;};if(formElement.elements['password']){data.password=formElement.elements['password'].value;};return JSON.stringify(data)}",
          "id": "3ab2ebfa-69b7-4ae8-b222-3cf50c6b7d81",
          "parameters": {
            "selectedVariable": "Custom JavaScript",
            "name": "CustomJsFunction",
            "type": "CustomJsFunction",
            "Name": "login Variable",
            "Description": "Created Via Form Submit template",
            "jsFunction": "function(){const data = {}; const formElement = document.querySelector('form#form-login');if(formElement.elements['email']){data.userid=formElement.elements['email'].value;};if(formElement.elements['password']){data.password=formElement.elements['password'].value;};return JSON.stringify(data)}"
          },
          "Variable": "CustomJsFunctionVariable3ab2ebfa69b74ae8b2223cf50c6b7d81"
        }
      ]
    },
    "selectedTag": "BangDB Analytics",
    "Name": "login Tag"
  },
  "blockTriggerIds": [],
  "fireTriggerIds": [
    "e91de022-449a-4398-9449-0ac36bcb95b3"
  ],
  "fireLimit": "unlimited",
  "fireDelay": 0,
  "startDate": null,
  "endDate": null,
  "Tag": "MatomoTag",
  "idSite": "Ecomm_testing",
  "Type": "BangDB Analytics",
  "blockedTriggerIds": []
},
        {
  "id": "bd1d456d-c2a1-4cf3-a3a8-2554a02be814",
  "type": "Matomo",
  "name": "registration Tag",
  "parameters": {
    "matomoConfig": {
      "name": "Matomo Configuration",
      "type": "MatomoConfiguration",
      "lookUpTable": [],
      "defaultValue": "",
      "parameters": {
        "matomoUrl": "https://testbe.bangdb.com:18080",
        "idSite": "Ecomm_testing",
        "enableLinkTracking": true,
        "enableCrossDomainLinking": true,
        "enableDoNotTrack": false,
        "enableJSErrorTracking": true,
        "enableHeartBeatTimer": true,
        "trackAllContentImpressions": true,
        "trackVisibleContentImpressions": true,
        "disableCookies": false,
        "requireConsent": false,
        "requireCookieConsent": false,
        "customCookieTimeOutEnable": false,
        "customCookieTimeOut": 393,
        "setSecureCookie": true,
        "cookieDomain": "",
        "cookiePath": "",
        "cookieSameSite": "Lax",
        "disableBrowserFeatureDetection": false,
        "domains": [],
        "alwaysUseSendBeacon": false,
        "userId": "",
        "customDimensions": [],
        "bundleTracker": true,
        "registerAsDefaultTracker": true,
        "jsEndpoint": "matomo.js",
        "trackingEndpoint": "stream/3cd8d4b5_Ecommerce/Data"
      },
      "Variable": "MatomoConfigurationVariable"
    },
    "trackingType": "event",
    "idGoal": "",
    "goalCustomRevenue": "",
    "documentTitle": "",
    "customUrl": "",
    "eventCategory": "registration",
    "eventAction": "registration",
    "eventName": "sync",
    "eventValue": {
      "joinedVariable": [
        {
          "selectedVariable": "Custom JavaScript",
          "name": "CustomJsFunction",
          "type": "CustomJsFunction",
          "Name": "registration Variable",
          "Description": "Created Via Form Submit template",
          "jsFunction": "function(){const data = {}; const formElement = document.querySelector('form#form-register');if(formElement.elements['firstname']){data.first_name=formElement.elements['firstname'].value;};if(formElement.elements['lastname']){data.last_name=formElement.elements['lastname'].value;};if(formElement.elements['email']){data.email=formElement.elements['email'].value;};if(formElement.elements['password']){data.password=formElement.elements['password'].value;};return JSON.stringify(data)}",
          "id": "75f0c564-a9e6-422b-b40a-7011708eb83d",
          "parameters": {
            "selectedVariable": "Custom JavaScript",
            "name": "CustomJsFunction",
            "type": "CustomJsFunction",
            "Name": "registration Variable",
            "Description": "Created Via Form Submit template",
            "jsFunction": "function(){const data = {}; const formElement = document.querySelector('form#form-register');if(formElement.elements['firstname']){data.first_name=formElement.elements['firstname'].value;};if(formElement.elements['lastname']){data.last_name=formElement.elements['lastname'].value;};if(formElement.elements['email']){data.email=formElement.elements['email'].value;};if(formElement.elements['password']){data.password=formElement.elements['password'].value;};return JSON.stringify(data)}"
          },
          "Variable": "CustomJsFunctionVariable75f0c564a9e6422bb40a7011708eb83d"
        }
      ]
    },
    "selectedTag": "BangDB Analytics",
    "Name": "registration Tag"
  },
  "blockTriggerIds": [],
  "fireTriggerIds": [
    "984fc23d-51ca-489c-ada7-3fd36d874642"
  ],
  "fireLimit": "unlimited",
  "fireDelay": 0,
  "startDate": null,
  "endDate": null,
  "Tag": "MatomoTag",
  "idSite": "Ecomm_testing",
  "Type": "BangDB Analytics",
  "blockedTriggerIds": []
},
        {
  "id": "3e13d5a9-6991-44ab-be40-6137c4f36d05",
  "type": "Matomo",
  "name": "product_view Tag",
  "parameters": {
    "matomoConfig": {
      "name": "Matomo Configuration",
      "type": "MatomoConfiguration",
      "lookUpTable": [],
      "defaultValue": "",
      "parameters": {
        "matomoUrl": "https://testbe.bangdb.com:18080",
        "idSite": "Ecomm_testing",
        "enableLinkTracking": true,
        "enableCrossDomainLinking": true,
        "enableDoNotTrack": false,
        "enableJSErrorTracking": true,
        "enableHeartBeatTimer": true,
        "trackAllContentImpressions": true,
        "trackVisibleContentImpressions": true,
        "disableCookies": false,
        "requireConsent": false,
        "requireCookieConsent": false,
        "customCookieTimeOutEnable": false,
        "customCookieTimeOut": 393,
        "setSecureCookie": true,
        "cookieDomain": "",
        "cookiePath": "",
        "cookieSameSite": "Lax",
        "disableBrowserFeatureDetection": false,
        "domains": [],
        "alwaysUseSendBeacon": false,
        "userId": "",
        "customDimensions": [],
        "bundleTracker": true,
        "registerAsDefaultTracker": true,
        "jsEndpoint": "matomo.js",
        "trackingEndpoint": "stream/3cd8d4b5_Ecommerce/Data"
      },
      "Variable": "MatomoConfigurationVariable"
    },
    "trackingType": "event",
    "idGoal": "",
    "goalCustomRevenue": "",
    "documentTitle": "",
    "customUrl": "",
    "eventCategory": "product_view",
    "eventAction": "product_view",
    "eventName": "product_view",
    "eventValue": {
      "joinedVariable": [
        {
          "selectedVariable": "Custom JavaScript",
          "name": "CustomJsFunction",
          "type": "CustomJsFunction",
          "Name": "product_view Variable",
          "Description": "Created Via Form Submit template",
          "jsFunction": "function(){const data = {}; if(document.querySelector('productfrom')){data.producd_id=document.querySelector('productfrom').innerHTML};if(document.querySelector('span.price-new')){data.price_per_unit=document.querySelector('span.price-new').innerHTML};return JSON.stringify(data)}",
          "id": "49e9b330-19ce-4873-bd57-cec847e1f2b3",
          "parameters": {
            "selectedVariable": "Custom JavaScript",
            "name": "CustomJsFunction",
            "type": "CustomJsFunction",
            "Name": "product_view Variable",
            "Description": "Created Via Form Submit template",
            "jsFunction": "function(){const data = {}; if(document.querySelector('productfrom')){data.producd_id=document.querySelector('productfrom').innerHTML};if(document.querySelector('span.price-new')){data.price_per_unit=document.querySelector('span.price-new').innerHTML};return JSON.stringify(data)}"
          },
          "Variable": "CustomJsFunctionVariable49e9b33019ce4873bd57cec847e1f2b3"
        }
      ]
    },
    "selectedTag": "BangDB Analytics",
    "Name": "product_view Tag"
  },
  "blockTriggerIds": [],
  "fireTriggerIds": [
    "3a5c28d1-9dae-43ad-8643-9ceb0b797771"
  ],
  "fireLimit": "unlimited",
  "fireDelay": 0,
  "startDate": null,
  "endDate": null,
  "Tag": "MatomoTag",
  "idSite": "Ecomm_testing",
  "Type": "BangDB Analytics",
  "blockedTriggerIds": []
},
          ],
          triggers: [
            
            {
  "id": "e91de022-449a-4398-9449-0ac36bcb95b3",
  "type": "FormSubmit",
  "name": "FormSubmit",
  "Trigger": "FormSubmitTrigger",
  "selectedTrigger": "Form Submit",
  "parameters": {},
  "conditions": [
    {
      "actual": {
        "Name": "Form ID",
        "name": "FormId",
        "type": "FormId",
        "lookUpTable": [],
        "defaultValue": null,
        "parameters": [],
        "Variable": "FormIdVariable"
      },
      "comparison": "equals",
      "expected": "form-login"
    }
  ],
  "Name": "login Trigger"
},
            {
  "id": "984fc23d-51ca-489c-ada7-3fd36d874642",
  "type": "FormSubmit",
  "name": "FormSubmit",
  "Trigger": "FormSubmitTrigger",
  "selectedTrigger": "Form Submit",
  "parameters": {},
  "conditions": [
    {
      "actual": {
        "Name": "Form ID",
        "name": "FormId",
        "type": "FormId",
        "lookUpTable": [],
        "defaultValue": null,
        "parameters": [],
        "Variable": "FormIdVariable"
      },
      "comparison": "equals",
      "expected": "form-register"
    }
  ],
  "Name": "registration Trigger"
},
            {
  "id": "3a5c28d1-9dae-43ad-8643-9ceb0b797771",
  "type": "ElementVisibility",
  "name": "ElementVisibility",
  "Trigger": "ElementVisibilityTrigger",
  "selectedTrigger": "Element Visibility",
  "parameters": {
    "selectionMethod": "elementId",
    "elementId": "",
    "fireTriggerWhen": "oncePage",
    "minPercentVisible": "50"
  },
  "conditions": [],
  "Name": "product_view Trigger"
},
          ],
          variables: [
            
          { name: "CustomJsFunction", type: "CustomJsFunction", lookUpTable: [], defaultValue: "", parameters: { jsFunction: "function(){const data = {}; const formElement = document.querySelector('form#form-login');if(formElement.elements['email']){data.userid=formElement.elements['email'].value;};if(formElement.elements['password']){data.password=formElement.elements['password'].value;};return JSON.stringify(data)}" }, Variable: "CustomJsFunctionVariable3ab2ebfa69b74ae8b2223cf50c6b7d81" },
          { name: "CustomJsFunction", type: "CustomJsFunction", lookUpTable: [], defaultValue: "", parameters: { jsFunction: "function(){const data = {}; const formElement = document.querySelector('form#form-register');if(formElement.elements['firstname']){data.first_name=formElement.elements['firstname'].value;};if(formElement.elements['lastname']){data.last_name=formElement.elements['lastname'].value;};if(formElement.elements['email']){data.email=formElement.elements['email'].value;};if(formElement.elements['password']){data.password=formElement.elements['password'].value;};return JSON.stringify(data)}" }, Variable: "CustomJsFunctionVariable75f0c564a9e6422bb40a7011708eb83d" },
          { name: "CustomJsFunction", type: "CustomJsFunction", lookUpTable: [], defaultValue: "", parameters: { jsFunction: "function(){const data = {}; if(document.querySelector('productfrom')){data.producd_id=document.querySelector('productfrom').innerHTML};if(document.querySelector('span.price-new')){data.price_per_unit=document.querySelector('span.price-new').innerHTML};return JSON.stringify(data)}" }, Variable: "CustomJsFunctionVariable49e9b33019ce4873bd57cec847e1f2b3" },
            {
              name: "MatomoConfiguration",
              type: "MatomoConfiguration",
              lookUpTable: [],
              defaultValue: "",
              parameters: {
                matomoUrl: "https://testbe.bangdb.com:18080",
                idSite: "Ecomm_testing",
                enableLinkTracking: true,
                enableCrossDomainLinking: true,
                enableDoNotTrack: false,
                enableJSErrorTracking: true,
                enableHeartBeatTimer: true,
                trackAllContentImpressions: true,
                trackVisibleContentImpressions: true,
                disableCookies: false,
                requireConsent: false,
                requireCookieConsent: false,
                customCookieTimeOutEnable: false,
                customCookieTimeOut: 393,
                setSecureCookie: true,
                cookieDomain: "",
                cookiePath: "",
                cookieSameSite: "Lax",
                disableBrowserFeatureDetection: false,
                domains: [],
                alwaysUseSendBeacon: false,
                userId: "",
                customDimensions: [],
                bundleTracker: true,
                registerAsDefaultTracker: true,
                jsEndpoint: "matomo.js",
                trackingEndpoint: "stream/3cd8d4b5_Ecommerce/Data",
              },
              Variable: "MatomoConfigurationVariable",
            },
            { name: "ClickClasses", type: "ClickClasses", lookUpTable: [], defaultValue: null, parameters: [], Variable: "ClickClassesVariable" },
            { name: "ClickButton", type: "ClickButton", lookUpTable: [], defaultValue: null, parameters: [], Variable: "ClickButtonVariable" },
            { name: "ClickDestinationUrl", type: "ClickDestinationUrl", lookUpTable: [], defaultValue: null, parameters: [], Variable: "ClickDestinationUrlVariable" },
            { name: "ClickElement", type: "ClickElement", lookUpTable: [], defaultValue: null, parameters: [], Variable: "ClickElementVariable" },
            { name: "ClickId", type: "ClickId", lookUpTable: [], defaultValue: null, parameters: [], Variable: "ClickIdVariable" },
            { name: "ClickNodeName", type: "ClickNodeName", lookUpTable: [], defaultValue: null, parameters: [], Variable: "ClickNodeNameVariable" },
            { name: "ClickText", type: "ClickText", lookUpTable: [], defaultValue: null, parameters: [], Variable: "ClickTextVariable" },
            { name: "FormElement", type: "FormElement", lookUpTable: [], defaultValue: null, parameters: [], Variable: "FormElementVariable" },
          ]
        },
        Templates
      );
    })();
})();
