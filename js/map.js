function trl(text, values) {
    if (values == null) {
        return text;
    } else {
        if (typeof (values) == 'string' || typeof (values) == 'number') {
            var temp = values;
            values = new Array();
            values.push(temp);
        }
        var cnt = 0;
        values.each(function (value) {
            text = text.replace(new RegExp('\\{(' + cnt + ')\\}', 'g'), value);
            cnt++;
        });
        return text;
    }
}

function trlp(single, plural, values) {
    if (values == null) {
        return '';
    } else {
        if (typeof (values) == 'string' || typeof (values) == 'number') {
            var temp = values;
            values = new Array();
            values.push(temp);
        }
        if (values[0] == 1) {
            text = single;
        } else {
            text = plural;
        }
        var cnt = 0;
        values.each(function (value) {
            text = text.replace(new RegExp('\\{(' + cnt + ')\\}', 'g'), value);
            cnt++;
        });
        return text;
    }
}
Ext = {
    version: '2.3.0'
};
// for old browsers
window["undefined"] = window["undefined"];
Ext.apply = function (o, c, defaults) {
    if (defaults) {
        // no "this" reference for friendly out of scope calls
        Ext.apply(o, defaults);
    }
    if (o && c && typeof c == 'object') {
        for (var p in c) {
            o[p] = c[p];
        }
    }
    return o;
};
(function () {
    var idSeed = 0;
    var ua = navigator.userAgent.toLowerCase(),
        check = function (r) {
            return r.test(ua);
        },
        isStrict = document.compatMode == "CSS1Compat",
        isOpera = check(/opera/),
        isChrome = check(/chrome/),
        isWebKit = check(/webkit/),
        isSafari = !isChrome && check(/safari/),
        isSafari2 = isSafari && check(/applewebkit\/4/), // unique to Safari 2
        isSafari3 = isSafari && check(/version\/3/),
        isSafari4 = isSafari && check(/version\/4/),
        isIE = !isOpera && check(/msie/),
        isIE7 = isIE && check(/msie 7/),
        isIE8 = isIE && check(/msie 8/),
        isIE9 = isIE && check(/msie 9/),
        isIE10 = isIE && check(/msie 10/),
        isIE11 = isIE && check(/msie 11/),
        isIE6 = isIE && !isIE7 && !isIE8 && !isIE9 && !isIE10 && !isIE11,
        isGecko = !isWebKit && check(/gecko/),
        isGecko2 = isGecko && check(/rv:1\.8/),
        isGecko3 = isGecko && check(/rv:1\.9/),
        isBorderBox = isIE && !isStrict,
        isWindows = check(/windows|win32/),
        isMac = check(/macintosh|mac os x/),
        isAir = check(/adobeair/),
        isLinux = check(/linux/),
        isSecure = /^https/i.test(window.location.protocol);
    // remove css image flicker
    if (isIE6) {
        try {
            document.execCommand("BackgroundImageCache", false, true);
        } catch (e) {}
    }
    Ext.apply(Ext, {

        isStrict: isStrict,

        isSecure: isSecure,

        isReady: false,

        enableGarbageCollector: true,

        enableListenerCollection: false,

        SSL_SECURE_URL: "javascript:false",

        BLANK_IMAGE_URL: "http:/" + "/extjs.com/s.gif",

        emptyFn: function () {},

        applyIf: function (o, c) {
            if (o && c) {
                for (var p in c) {
                    if (typeof o[p] == "undefined") {
                        o[p] = c[p];
                    }
                }
            }
            return o;
        },

        addBehaviors: function (o) {
            if (!Ext.isReady) {
                Ext.onReady(function () {
                    Ext.addBehaviors(o);
                });
                return;
            }
            var cache = {}; // simple cache for applying multiple behaviors to same selector does query multiple times
            for (var b in o) {
                var parts = b.split('@');
                if (parts[1]) { // for Object prototype breakers
                    var s = parts[0];
                    if (!cache[s]) {
                        cache[s] = Ext.select(s);
                    }
                    cache[s].on(parts[1], o[b]);
                }
            }
            cache = null;
        },

        id: function (el, prefix) {
            prefix = prefix || "ext-gen";
            el = Ext.getDom(el);
            var id = prefix + (++idSeed);
            return el ? (el.id ? el.id : (el.id = id)) : id;
        },

        extend: function () {
            // inline overrides
            var io = function (o) {
                for (var m in o) {
                    this[m] = o[m];
                }
            };
            var oc = Object.prototype.constructor;
            return function (sb, sp, overrides) {
                if (typeof sp == 'object') {
                    overrides = sp;
                    sp = sb;
                    sb = overrides.constructor != oc ? overrides.constructor : function () {
                        sp.apply(this, arguments);
                    };
                }
                var F = function () {},
                    sbp, spp = sp.prototype;
                F.prototype = spp;
                sbp = sb.prototype = new F();
                sbp.constructor = sb;
                sb.superclass = spp;
                if (spp.constructor == oc) {
                    spp.constructor = sp;
                }
                sb.override = function (o) {
                    Ext.override(sb, o);
                };
                sbp.override = io;
                Ext.override(sb, overrides);
                sb.extend = function (o) {
                    Ext.extend(sb, o);
                };
                return sb;
            };
        }(),

        override: function (origclass, overrides) {
            if (overrides) {
                var p = origclass.prototype;
                for (var method in overrides) {
                    p[method] = overrides[method];
                }
                if (Ext.isIE && overrides.toString != origclass.toString) {
                    p.toString = overrides.toString;
                }
            }
        },

        namespace: function () {
            var a = arguments,
                o = null,
                i, j, d, rt;
            for (i = 0; i < a.length; ++i) {
                d = a[i].split(".");
                rt = d[0];
                eval('if (typeof ' + rt + ' == "undefined"){' + rt + ' = {};} o = ' + rt + ';');
                for (j = 1; j < d.length; ++j) {
                    o[d[j]] = o[d[j]] || {};
                    o = o[d[j]];
                }
            }
        },

        urlEncode: function (o) {
            if (!o) {
                return "";
            }
            var buf = [];
            for (var key in o) {
                var ov = o[key],
                    k = encodeURIComponent(key);
                var type = typeof ov;
                if (type == 'undefined') {
                    buf.push(k, "=&");
                } else if (type != "function" && type != "object") {
                    buf.push(k, "=", encodeURIComponent(ov), "&");
                } else if (Ext.isDate(ov)) {
                    var s = Ext.encode(ov).replace(/"/g, '');
                    buf.push(k, "=", s, "&");
                } else if (Ext.isArray(ov)) {
                    if (ov.length) {
                        for (var i = 0, len = ov.length; i < len; i++) {
                            buf.push(k, "=", encodeURIComponent(ov[i] === undefined ? '' : ov[i]), "&");
                        }
                    } else {
                        buf.push(k, "=&");
                    }
                }
            }
            buf.pop();
            return buf.join("");
        },

        urlDecode: function (string, overwrite) {
            if (!string || !string.length) {
                return {};
            }
            var obj = {};
            var pairs = string.split('&');
            var pair, name, value;
            for (var i = 0, len = pairs.length; i < len; i++) {
                pair = pairs[i].split('=');
                name = decodeURIComponent(pair[0]);
                value = decodeURIComponent(pair[1]);
                if (overwrite !== true) {
                    if (typeof obj[name] == "undefined") {
                        obj[name] = value;
                    } else if (typeof obj[name] == "string") {
                        obj[name] = [obj[name]];
                        obj[name].push(value);
                    } else {
                        obj[name].push(value);
                    }
                } else {
                    obj[name] = value;
                }
            }
            return obj;
        },

        each: function (array, fn, scope) {
            if (typeof array.length == "undefined" || typeof array == "string") {
                array = [array];
            }
            for (var i = 0, len = array.length; i < len; i++) {
                if (fn.call(scope || array[i], array[i], i, array) === false) {
                    return i;
                };
            }
        },
        // deprecated
        combine: function () {
            var as = arguments,
                l = as.length,
                r = [];
            for (var i = 0; i < l; i++) {
                var a = as[i];
                if (Ext.isArray(a)) {
                    r = r.concat(a);
                } else if (a.length !== undefined && !a.substr) {
                    r = r.concat(Array.prototype.slice.call(a, 0));
                } else {
                    r.push(a);
                }
            }
            return r;
        },

        escapeRe: function (s) {
            return s.replace(/([.*+?^${}()|[\]\/\\])/g, "\\$1");
        },
        // internal
        callback: function (cb, scope, args, delay) {
            if (typeof cb == "function") {
                if (delay) {
                    cb.defer(delay, scope, args || []);
                } else {
                    cb.apply(scope, args || []);
                }
            }
        },

        getDom: function (el) {
            if (!el || !document) {
                return null;
            }
            return el.dom ? el.dom : (typeof el == 'string' ? document.getElementById(el) : el);
        },

        getDoc: function () {
            return Ext.get(document);
        },

        getBody: function () {
            return Ext.get(document.body || document.documentElement);
        },

        getCmp: function (id) {
            return Ext.ComponentMgr.get(id);
        },

        num: function (v, defaultValue) {
            v = Number(v == null || typeof v == 'boolean' ? NaN : v);
            return isNaN(v) ? defaultValue : v;
        },

        destroy: function () {
            for (var i = 0, a = arguments, len = a.length; i < len; i++) {
                var as = a[i];
                if (as) {
                    if (typeof as.destroy == 'function') {
                        as.destroy();
                    } else if (as.dom) {
                        as.removeAllListeners();
                        as.remove();
                    }
                }
            }
        },

        removeNode: isIE ? function () {
            var d;
            return function (n) {
                if (n && n.tagName != 'BODY') {
                    d = d || document.createElement('div');
                    d.appendChild(n);
                    d.innerHTML = '';
                }
            }
        }() : function (n) {
            if (n && n.parentNode && n.tagName != 'BODY') {
                n.parentNode.removeChild(n);
            }
        },
        // inpired by a similar function in mootools library

        type: function (o) {
            if (o === undefined || o === null) {
                return false;
            }
            if (o.htmlElement) {
                return 'element';
            }
            var t = typeof o;
            if (t == 'object' && o.nodeName) {
                switch (o.nodeType) {
                case 1:
                    return 'element';
                case 3:
                    return (/\S/).test(o.nodeValue) ? 'textnode' : 'whitespace';
                }
            }
            if (t == 'object' || t == 'function') {
                switch (o.constructor) {
                case Array:
                    return 'array';
                case RegExp:
                    return 'regexp';
                case Date:
                    return 'date';
                }
                if (typeof o.length == 'number' && typeof o.item == 'function') {
                    return 'nodelist';
                }
            }
            return t;
        },

        isEmpty: function (v, allowBlank) {
            return v === null || v === undefined || (!allowBlank ? v === '' : false);
        },

        value: function (v, defaultValue, allowBlank) {
            return Ext.isEmpty(v, allowBlank) ? defaultValue : v;
        },

        isArray: function (v) {
            return v && typeof v.length == 'number' && typeof v.splice == 'function';
        },

        isDate: function (v) {
            return v && typeof v.getFullYear == 'function';
        },

        isOpera: isOpera,

        isWebKit: isWebKit,

        isChrome: isChrome,

        isSafari: isSafari,

        isSafari4: isSafari4,

        isSafari3: isSafari3,

        isSafari2: isSafari2,

        isIE: isIE,

        isIE6: isIE6,

        isIE7: isIE7,

        isIE8: isIE8,

        isIE9: isIE9,

        isIE10: isIE10,

        isIE11: isIE11,

        isGecko: isGecko,

        isGecko2: isGecko2,

        isGecko3: isGecko3,

        isBorderBox: isBorderBox,

        isLinux: isLinux,

        isWindows: isWindows,

        isMac: isMac,

        isAir: isAir,

        useShims: ((isIE && !(isIE7 || isIE8)) || (isMac && isGecko && !isGecko3))
    });
    // in intellij using keyword "namespace" causes parsing errors
    Ext.ns = Ext.namespace;
})();
Ext.ns("Ext", "Ext.util", "Ext.grid", "Ext.dd", "Ext.tree", "Ext.data",
    "Ext.form", "Ext.menu", "Ext.state", "Ext.lib", "Ext.layout", "Ext.app", "Ext.ux");
Ext.apply(Function.prototype, {

    createCallback: function () {
        // make args available, in function below
        var args = arguments;
        var method = this;
        return function () {
            return method.apply(window, args);
        };
    },

    createDelegate: function (obj, args, appendArgs) {
        var method = this;
        return function () {
            var callArgs = args || arguments;
            if (appendArgs === true) {
                callArgs = Array.prototype.slice.call(arguments, 0);
                callArgs = callArgs.concat(args);
            } else if (typeof appendArgs == "number") {
                callArgs = Array.prototype.slice.call(arguments, 0); // copy arguments first
                var applyArgs = [appendArgs, 0].concat(args); // create method call params
                Array.prototype.splice.apply(callArgs, applyArgs); // splice them in
            }
            return method.apply(obj || window, callArgs);
        };
    },

    defer: function (millis, obj, args, appendArgs) {
        var fn = this.createDelegate(obj, args, appendArgs);
        if (millis) {
            return setTimeout(fn, millis);
        }
        fn();
        return 0;
    },

    createSequence: function (fcn, scope) {
        if (typeof fcn != "function") {
            return this;
        }
        var method = this;
        return function () {
            var retval = method.apply(this || window, arguments);
            fcn.apply(scope || this || window, arguments);
            return retval;
        };
    },

    createInterceptor: function (fcn, scope) {
        if (typeof fcn != "function") {
            return this;
        }
        var method = this;
        return function () {
            fcn.target = this;
            fcn.method = method;
            if (fcn.apply(scope || this || window, arguments) === false) {
                return;
            }
            return method.apply(this || window, arguments);
        };
    }
});
Ext.applyIf(String, {

    escape: function (string) {
        return string.replace(/('|\\)/g, "\\$1");
    },

    leftPad: function (val, size, ch) {
        var result = new String(val);
        if (!ch) {
            ch = " ";
        }
        while (result.length < size) {
            result = ch + result;
        }
        return result.toString();
    },

    format: function (format) {
        var args = Array.prototype.slice.call(arguments, 1);
        return format.replace(/\{(\d+)\}/g, function (m, i) {
            return args[i];
        });
    }
});
String.prototype.toggle = function (value, other) {
    return this == value ? other : value;
};
String.prototype.trim = function () {
    var re = /^\s+|\s+$/g;
    return function () {
        return this.replace(re, "");
    };
}();
Ext.applyIf(Number.prototype, {

    constrain: function (min, max) {
        return Math.min(Math.max(this, min), max);
    }
});
Ext.applyIf(Array.prototype, {

    indexOf: function (o) {
        for (var i = 0, len = this.length; i < len; i++) {
            if (this[i] == o) return i;
        }
        return -1;
    },

    remove: function (o) {
        var index = this.indexOf(o);
        if (index != -1) {
            this.splice(index, 1);
        }
        return this;
    }
});
Date.prototype.getElapsed = function (date) {
    return Math.abs((date || new Date()).getTime() - this.getTime());
};
(function () {
    var libFlyweight;
    Ext.lib.Dom = {
        getViewWidth: function (full) {
            return full ? this.getDocumentWidth() : this.getViewportWidth();
        },
        getViewHeight: function (full) {
            return full ? this.getDocumentHeight() : this.getViewportHeight();
        },
        getDocumentHeight: function () {
            var scrollHeight = (document.compatMode != "CSS1Compat") ? document.body.scrollHeight : document.documentElement.scrollHeight;
            return Math.max(scrollHeight, this.getViewportHeight());
        },
        getDocumentWidth: function () {
            var scrollWidth = (document.compatMode != "CSS1Compat") ? document.body.scrollWidth : document.documentElement.scrollWidth;
            return Math.max(scrollWidth, this.getViewportWidth());
        },
        getViewportHeight: function () {
            if (Ext.isIE) {
                return Ext.isStrict ? document.documentElement.clientHeight :
                    document.body.clientHeight;
            } else {
                return self.innerHeight;
            }
        },
        getViewportWidth: function () {
            if (Ext.isIE) {
                return Ext.isStrict ? document.documentElement.clientWidth :
                    document.body.clientWidth;
            } else {
                return self.innerWidth;
            }
        },
        isAncestor: function (p, c) {
            p = Ext.getDom(p);
            c = Ext.getDom(c);
            if (!p || !c) {
                return false;
            }
            if (p.contains && !Ext.isWebKit) {
                return p.contains(c);
            } else if (p.compareDocumentPosition) {
                return !!(p.compareDocumentPosition(c) & 16);
            } else {
                var parent = c.parentNode;
                while (parent) {
                    if (parent == p) {
                        return true;
                    } else if (!parent.tagName || parent.tagName.toUpperCase() == "HTML") {
                        return false;
                    }
                    parent = parent.parentNode;
                }
                return false;
            }
        },
        getRegion: function (el) {
            return Ext.lib.Region.getRegion(el);
        },
        getY: function (el) {
            return this.getXY(el)[1];
        },
        getX: function (el) {
            return this.getXY(el)[0];
        },
        getXY: function (el) {
            var p, pe, b, scroll, bd = (document.body || document.documentElement);
            el = Ext.getDom(el);
            if (el == bd) {
                return [0, 0];
            }
            if (el.getBoundingClientRect) {
                b = el.getBoundingClientRect();
                scroll = fly(document).getScroll();
                return [b.left + scroll.left, b.top + scroll.top];
            }
            var x = 0,
                y = 0;
            p = el;
            var hasAbsolute = fly(el).getStyle("position") == "absolute";
            while (p) {
                x += p.offsetLeft;
                y += p.offsetTop;
                if (!hasAbsolute && fly(p).getStyle("position") == "absolute") {
                    hasAbsolute = true;
                }
                if (Ext.isGecko) {
                    pe = fly(p);
                    var bt = parseInt(pe.getStyle("borderTopWidth"), 10) || 0;
                    var bl = parseInt(pe.getStyle("borderLeftWidth"), 10) || 0;
                    x += bl;
                    y += bt;
                    if (p != el && pe.getStyle('overflow') != 'visible') {
                        x += bl;
                        y += bt;
                    }
                }
                p = p.offsetParent;
            }
            if (Ext.isWebKit && hasAbsolute) {
                x -= bd.offsetLeft;
                y -= bd.offsetTop;
            }
            if (Ext.isGecko && !hasAbsolute) {
                var dbd = fly(bd);
                x += parseInt(dbd.getStyle("borderLeftWidth"), 10) || 0;
                y += parseInt(dbd.getStyle("borderTopWidth"), 10) || 0;
            }
            p = el.parentNode;
            while (p && p != bd) {
                if (!Ext.isOpera || (p.tagName != 'TR' && fly(p).getStyle("display") != "inline")) {
                    x -= p.scrollLeft;
                    y -= p.scrollTop;
                }
                p = p.parentNode;
            }
            return [x, y];
        },
        setXY: function (el, xy) {
            el = Ext.fly(el, '_setXY');
            el.position();
            var pts = el.translatePoints(xy);
            if (xy[0] !== false) {
                el.dom.style.left = pts.left + "px";
            }
            if (xy[1] !== false) {
                el.dom.style.top = pts.top + "px";
            }
        },
        setX: function (el, x) {
            this.setXY(el, [x, false]);
        },
        setY: function (el, y) {
            this.setXY(el, [false, y]);
        }
    };
    Ext.lib.Event = function () {
        var loadComplete = false;
        var listeners = [];
        var unloadListeners = [];
        var retryCount = 0;
        var onAvailStack = [];
        var counter = 0;
        var lastError = null;
        return {
            POLL_RETRYS: 200,
            POLL_INTERVAL: 20,
            EL: 0,
            TYPE: 1,
            FN: 2,
            WFN: 3,
            OBJ: 3,
            ADJ_SCOPE: 4,
            _interval: null,
            startInterval: function () {
                if (!this._interval) {
                    var self = this;
                    var callback = function () {
                        self._tryPreloadAttach();
                    };
                    this._interval = setInterval(callback, this.POLL_INTERVAL);
                }
            },
            onAvailable: function (p_id, p_fn, p_obj, p_override) {
                onAvailStack.push({
                    id: p_id,
                    fn: p_fn,
                    obj: p_obj,
                    override: p_override,
                    checkReady: false
                });
                retryCount = this.POLL_RETRYS;
                this.startInterval();
            },
            addListener: function (el, eventName, fn) {
                el = Ext.getDom(el);
                if (!el || !fn) {
                    return false;
                }
                if ("unload" == eventName) {
                    unloadListeners[unloadListeners.length] =
                        [el, eventName, fn];
                    return true;
                }
                // prevent unload errors with simple check
                var wrappedFn = function (e) {
                    return typeof Ext != 'undefined' ? fn(Ext.lib.Event.getEvent(e)) : false;
                };
                var li = [el, eventName, fn, wrappedFn];
                var index = listeners.length;
                listeners[index] = li;
                this.doAdd(el, eventName, wrappedFn, false);
                return true;
            },
            removeListener: function (el, eventName, fn) {
                var i, len;
                el = Ext.getDom(el);
                if (!fn) {
                    return this.purgeElement(el, false, eventName);
                }
                if ("unload" == eventName) {
                    for (i = 0, len = unloadListeners.length; i < len; i++) {
                        var li = unloadListeners[i];
                        if (li &&
                            li[0] == el &&
                            li[1] == eventName &&
                            li[2] == fn) {
                            unloadListeners.splice(i, 1);
                            return true;
                        }
                    }
                    return false;
                }
                var cacheItem = null;
                var index = arguments[3];
                if ("undefined" == typeof index) {
                    index = this._getCacheIndex(el, eventName, fn);
                }
                if (index >= 0) {
                    cacheItem = listeners[index];
                }
                if (!el || !cacheItem) {
                    return false;
                }
                this.doRemove(el, eventName, cacheItem[this.WFN], false);
                delete listeners[index][this.WFN];
                delete listeners[index][this.FN];
                listeners.splice(index, 1);
                return true;
            },
            getTarget: function (ev, resolveTextNode) {
                ev = ev.browserEvent || ev;
                var t = ev.target || ev.srcElement;
                return this.resolveTextNode(t);
            },
            resolveTextNode: function (node) {
                if (Ext.isWebKit && node && 3 == node.nodeType) {
                    return node.parentNode;
                } else {
                    return node;
                }
            },
            getPageX: function (ev) {
                ev = ev.browserEvent || ev;
                var x = ev.pageX;
                if (!x && 0 !== x) {
                    x = ev.clientX || 0;
                    if (Ext.isIE) {
                        x += this.getScroll()[1];
                    }
                }
                return x;
            },
            getPageY: function (ev) {
                ev = ev.browserEvent || ev;
                var y = ev.pageY;
                if (!y && 0 !== y) {
                    y = ev.clientY || 0;
                    if (Ext.isIE) {
                        y += this.getScroll()[0];
                    }
                }
                return y;
            },
            getXY: function (ev) {
                ev = ev.browserEvent || ev;
                return [this.getPageX(ev), this.getPageY(ev)];
            },
            getRelatedTarget: function (ev) {
                ev = ev.browserEvent || ev;
                var t = ev.relatedTarget;
                if (!t) {
                    if (ev.type == "mouseout") {
                        t = ev.toElement;
                    } else if (ev.type == "mouseover") {
                        t = ev.fromElement;
                    }
                }
                return this.resolveTextNode(t);
            },
            getTime: function (ev) {
                ev = ev.browserEvent || ev;
                if (!ev.time) {
                    var t = new Date().getTime();
                    try {
                        ev.time = t;
                    } catch (ex) {
                        this.lastError = ex;
                        return t;
                    }
                }
                return ev.time;
            },
            stopEvent: function (ev) {
                this.stopPropagation(ev);
                this.preventDefault(ev);
            },
            stopPropagation: function (ev) {
                ev = ev.browserEvent || ev;
                if (ev.stopPropagation) {
                    ev.stopPropagation();
                } else {
                    ev.cancelBubble = true;
                }
            },
            preventDefault: function (ev) {
                ev = ev.browserEvent || ev;
                if (ev.preventDefault) {
                    ev.preventDefault();
                } else {
                    ev.returnValue = false;
                }
            },
            getEvent: function (e) {
                var ev = e || window.event;
                if (!ev) {
                    var c = this.getEvent.caller;
                    while (c) {
                        ev = c.arguments[0];
                        if (ev && Event == ev.constructor) {
                            break;
                        }
                        c = c.caller;
                    }
                }
                return ev;
            },
            getCharCode: function (ev) {
                ev = ev.browserEvent || ev;
                return ev.charCode || ev.keyCode || 0;
            },
            _getCacheIndex: function (el, eventName, fn) {
                for (var i = 0, len = listeners.length; i < len; ++i) {
                    var li = listeners[i];
                    if (li &&
                        li[this.FN] == fn &&
                        li[this.EL] == el &&
                        li[this.TYPE] == eventName) {
                        return i;
                    }
                }
                return -1;
            },
            elCache: {},
            getEl: function (id) {
                return document.getElementById(id);
            },
            clearCache: function () {},
            _load: function (e) {
                loadComplete = true;
                var EU = Ext.lib.Event;
                if (Ext.isIE) {
                    EU.doRemove(window, "load", EU._load);
                }
            },
            _tryPreloadAttach: function () {
                if (this.locked) {
                    return false;
                }
                this.locked = true;
                var tryAgain = !loadComplete;
                if (!tryAgain) {
                    tryAgain = (retryCount > 0);
                }
                var notAvail = [];
                for (var i = 0, len = onAvailStack.length; i < len; ++i) {
                    var item = onAvailStack[i];
                    if (item) {
                        var el = this.getEl(item.id);
                        if (el) {
                            if (!item.checkReady ||
                                loadComplete ||
                                el.nextSibling ||
                                (document && document.body)) {
                                var scope = el;
                                if (item.override) {
                                    if (item.override === true) {
                                        scope = item.obj;
                                    } else {
                                        scope = item.override;
                                    }
                                }
                                item.fn.call(scope, item.obj);
                                onAvailStack[i] = null;
                            }
                        } else {
                            notAvail.push(item);
                        }
                    }
                }
                retryCount = (notAvail.length === 0) ? 0 : retryCount - 1;
                if (tryAgain) {
                    this.startInterval();
                } else {
                    clearInterval(this._interval);
                    this._interval = null;
                }
                this.locked = false;
                return true;
            },
            purgeElement: function (el, recurse, eventName) {
                var elListeners = this.getListeners(el, eventName);
                if (elListeners) {
                    for (var i = 0, len = elListeners.length; i < len; ++i) {
                        var l = elListeners[i];
                        this.removeListener(el, l.type, l.fn);
                    }
                }
                if (recurse && el && el.childNodes) {
                    for (i = 0, len = el.childNodes.length; i < len; ++i) {
                        this.purgeElement(el.childNodes[i], recurse, eventName);
                    }
                }
            },
            getListeners: function (el, eventName) {
                var results = [],
                    searchLists;
                if (!eventName) {
                    searchLists = [listeners, unloadListeners];
                } else if (eventName == "unload") {
                    searchLists = [unloadListeners];
                } else {
                    searchLists = [listeners];
                }
                for (var j = 0; j < searchLists.length; ++j) {
                    var searchList = searchLists[j];
                    if (searchList && searchList.length > 0) {
                        for (var i = 0, len = searchList.length; i < len; ++i) {
                            var l = searchList[i];
                            if (l && l[this.EL] === el &&
                                (!eventName || eventName === l[this.TYPE])) {
                                results.push({
                                    type: l[this.TYPE],
                                    fn: l[this.FN],
                                    obj: l[this.OBJ],
                                    adjust: l[this.ADJ_SCOPE],
                                    index: i
                                });
                            }
                        }
                    }
                }
                return (results.length) ? results : null;
            },
            _unload: function (e) {
                var EU = Ext.lib.Event,
                    i, j, l, len, index;
                for (i = 0, len = unloadListeners.length; i < len; ++i) {
                    l = unloadListeners[i];
                    if (l) {
                        var scope = window;
                        if (l[EU.ADJ_SCOPE]) {
                            if (l[EU.ADJ_SCOPE] === true) {
                                scope = l[EU.OBJ];
                            } else {
                                scope = l[EU.ADJ_SCOPE];
                            }
                        }
                        l[EU.FN].call(scope, EU.getEvent(e), l[EU.OBJ]);
                        unloadListeners[i] = null;
                        l = null;
                        scope = null;
                    }
                }
                unloadListeners = null;
                if (listeners && listeners.length > 0) {
                    j = listeners.length;
                    while (j) {
                        index = j - 1;
                        l = listeners[index];
                        if (l) {
                            EU.removeListener(l[EU.EL], l[EU.TYPE],
                                l[EU.FN], index);
                        }
                        j = j - 1;
                    }
                    l = null;
                    EU.clearCache();
                }
                EU.doRemove(window, "unload", EU._unload);
            },
            getScroll: function () {
                var dd = document.documentElement,
                    db = document.body;
                if (dd && (dd.scrollTop || dd.scrollLeft)) {
                    return [dd.scrollTop, dd.scrollLeft];
                } else if (db) {
                    return [db.scrollTop, db.scrollLeft];
                } else {
                    return [0, 0];
                }
            },
            doAdd: function () {
                if (window.addEventListener) {
                    return function (el, eventName, fn, capture) {
                        el.addEventListener(eventName, fn, (capture));
                    };
                } else if (window.attachEvent) {
                    return function (el, eventName, fn, capture) {
                        el.attachEvent("on" + eventName, fn);
                    };
                } else {
                    return function () {};
                }
            }(),
            doRemove: function () {
                if (window.removeEventListener) {
                    return function (el, eventName, fn, capture) {
                        el.removeEventListener(eventName, fn, (capture));
                    };
                } else if (window.detachEvent) {
                    return function (el, eventName, fn) {
                        el.detachEvent("on" + eventName, fn);
                    };
                } else {
                    return function () {};
                }
            }()
        };
    }();
    var E = Ext.lib.Event;
    E.on = E.addListener;
    E.un = E.removeListener;
    if (document && document.body) {
        E._load();
    } else {
        E.doAdd(window, "load", E._load);
    }
    E.doAdd(window, "unload", E._unload);
    E._tryPreloadAttach();
    Ext.lib.Ajax = {
        request: function (method, uri, cb, data, options) {
            if (options) {
                var hs = options.headers;
                if (hs) {
                    for (var h in hs) {
                        if (hs.hasOwnProperty(h)) {
                            this.initHeader(h, hs[h], false);
                        }
                    }
                }
                if (options.xmlData) {
                    if (!hs || !hs['Content-Type']) {
                        this.initHeader('Content-Type', 'text/xml', false);
                    }
                    method = (method ? method : (options.method ? options.method : 'POST'));
                    data = options.xmlData;
                } else if (options.jsonData) {
                    if (!hs || !hs['Content-Type']) {
                        this.initHeader('Content-Type', 'application/json', false);
                    }
                    method = (method ? method : (options.method ? options.method : 'POST'));
                    data = typeof options.jsonData == 'object' ? Ext.encode(options.jsonData) : options.jsonData;
                }
            }
            return this.asyncRequest(method, uri, cb, data);
        },
        serializeForm: function (form) {
            if (typeof form == 'string') {
                form = (document.getElementById(form) || document.forms[form]);
            }
            var el, name, val, disabled, data = '',
                hasSubmit = false;
            for (var i = 0; i < form.elements.length; i++) {
                el = form.elements[i];
                disabled = form.elements[i].disabled;
                name = form.elements[i].name;
                val = form.elements[i].value;
                if (!disabled && name) {
                    switch (el.type) {
                    case 'select-one':
                    case 'select-multiple':
                        for (var j = 0; j < el.options.length; j++) {
                            if (el.options[j].selected) {
                                var opt = el.options[j],
                                    sel = (opt.hasAttribute ? opt.hasAttribute('value') : opt.getAttributeNode('value').specified) ? opt.value : opt.text;
                                data += encodeURIComponent(name) + '=' + encodeURIComponent(sel) + '&';
                            }
                        }
                        break;
                    case 'radio':
                    case 'checkbox':
                        if (el.checked) {
                            data += encodeURIComponent(name) + '=' + encodeURIComponent(val) + '&';
                        }
                        break;
                    case 'file':
                    case undefined:
                    case 'reset':
                    case 'button':
                        break;
                    case 'submit':
                        if (hasSubmit == false) {
                            data += encodeURIComponent(name) + '=' + encodeURIComponent(val) + '&';
                            hasSubmit = true;
                        }
                        break;
                    default:
                        data += encodeURIComponent(name) + '=' + encodeURIComponent(val) + '&';
                        break;
                    }
                }
            }
            data = data.substr(0, data.length - 1);
            return data;
        },
        headers: {},
        hasHeaders: false,
        useDefaultHeader: true,
        defaultPostHeader: 'application/x-www-form-urlencoded; charset=UTF-8',
        useDefaultXhrHeader: true,
        defaultXhrHeader: 'XMLHttpRequest',
        hasDefaultHeaders: true,
        defaultHeaders: {},
        poll: {},
        timeout: {},
        pollInterval: 50,
        transactionId: 0,
        setProgId: function (id) {
            this.activeX.unshift(id);
        },
        setDefaultPostHeader: function (b) {
            this.useDefaultHeader = b;
        },
        setDefaultXhrHeader: function (b) {
            this.useDefaultXhrHeader = b;
        },
        setPollingInterval: function (i) {
            if (typeof i == 'number' && isFinite(i)) {
                this.pollInterval = i;
            }
        },
        createXhrObject: function (transactionId) {
            var obj, http;
            try {
                http = new XMLHttpRequest();
                obj = {
                    conn: http,
                    tId: transactionId
                };
            } catch (e) {
                for (var i = 0; i < this.activeX.length; ++i) {
                    try {
                        http = new ActiveXObject(this.activeX[i]);
                        obj = {
                            conn: http,
                            tId: transactionId
                        };
                        break;
                    } catch (e) {}
                }
            } finally {
                return obj;
            }
        },
        getConnectionObject: function () {
            var o;
            var tId = this.transactionId;
            try {
                o = this.createXhrObject(tId);
                if (o) {
                    this.transactionId++;
                }
            } catch (e) {} finally {
                return o;
            }
        },
        asyncRequest: function (method, uri, callback, postData) {
            var o = this.getConnectionObject();
            if (!o) {
                return null;
            } else {
                o.conn.open(method, uri, true);
                if (this.useDefaultXhrHeader) {
                    if (!this.defaultHeaders['X-Requested-With']) {
                        this.initHeader('X-Requested-With', this.defaultXhrHeader, true);
                    }
                }
                if (postData && this.useDefaultHeader && (!this.hasHeaders || !this.headers['Content-Type'])) {
                    this.initHeader('Content-Type', this.defaultPostHeader);
                }
                if (this.hasDefaultHeaders || this.hasHeaders) {
                    this.setHeader(o);
                }
                this.handleReadyState(o, callback);
                o.conn.send(postData || null);
                return o;
            }
        },
        handleReadyState: function (o, callback) {
            var oConn = this;
            if (callback && callback.timeout) {
                this.timeout[o.tId] = window.setTimeout(function () {
                    oConn.abort(o, callback, true);
                }, callback.timeout);
            }
            this.poll[o.tId] = window.setInterval(
                function () {
                    if (o.conn && o.conn.readyState == 4) {
                        window.clearInterval(oConn.poll[o.tId]);
                        delete oConn.poll[o.tId];
                        if (callback && callback.timeout) {
                            window.clearTimeout(oConn.timeout[o.tId]);
                            delete oConn.timeout[o.tId];
                        }
                        oConn.handleTransactionResponse(o, callback);
                    }
                }, this.pollInterval);
        },
        handleTransactionResponse: function (o, callback, isAbort) {
            if (!callback) {
                this.releaseObject(o);
                return;
            }
            var httpStatus, responseObject;
            try {
                if (o.conn.status !== undefined && o.conn.status != 0) {
                    httpStatus = o.conn.status;
                } else {
                    httpStatus = 13030;
                }
            } catch (e) {
                httpStatus = 13030;
            }
            if ((httpStatus >= 200 && httpStatus < 300) || (Ext.isIE && httpStatus == 1223)) {
                responseObject = this.createResponseObject(o, callback.argument);
                if (callback.success) {
                    if (!callback.scope) {
                        callback.success(responseObject);
                    } else {
                        callback.success.apply(callback.scope, [responseObject]);
                    }
                }
            } else {
                switch (httpStatus) {
                case 12002:
                case 12029:
                case 12030:
                case 12031:
                case 12152:
                case 13030:
                    responseObject = this.createExceptionObject(o.tId, callback.argument, (isAbort ? isAbort : false));
                    if (callback.failure) {
                        if (!callback.scope) {
                            callback.failure(responseObject);
                        } else {
                            callback.failure.apply(callback.scope, [responseObject]);
                        }
                    }
                    break;
                default:
                    responseObject = this.createResponseObject(o, callback.argument);
                    if (callback.failure) {
                        if (!callback.scope) {
                            callback.failure(responseObject);
                        } else {
                            callback.failure.apply(callback.scope, [responseObject]);
                        }
                    }
                }
            }
            this.releaseObject(o);
            responseObject = null;
        },
        createResponseObject: function (o, callbackArg) {
            var obj = {};
            var headerObj = {};
            try {
                var headerStr = o.conn.getAllResponseHeaders();
                var header = headerStr.split('\n');
                for (var i = 0; i < header.length; i++) {
                    var delimitPos = header[i].indexOf(':');
                    if (delimitPos != -1) {
                        headerObj[header[i].substring(0, delimitPos)] = header[i].substring(delimitPos + 2);
                    }
                }
            } catch (e) {}
            obj.tId = o.tId;
            obj.status = o.conn.status;
            obj.statusText = o.conn.statusText;
            obj.getResponseHeader = function (header) {
                return headerObj[header];
            };
            obj.getAllResponseHeaders = function () {
                return headerStr
            };
            obj.responseText = o.conn.responseText;
            obj.responseXML = o.conn.responseXML;
            if (typeof callbackArg !== undefined) {
                obj.argument = callbackArg;
            }
            return obj;
        },
        createExceptionObject: function (tId, callbackArg, isAbort) {
            var COMM_CODE = 0;
            var COMM_ERROR = 'communication failure';
            var ABORT_CODE = -1;
            var ABORT_ERROR = 'transaction aborted';
            var obj = {};
            obj.tId = tId;
            if (isAbort) {
                obj.status = ABORT_CODE;
                obj.statusText = ABORT_ERROR;
            } else {
                obj.status = COMM_CODE;
                obj.statusText = COMM_ERROR;
            }
            if (callbackArg) {
                obj.argument = callbackArg;
            }
            return obj;
        },
        initHeader: function (label, value, isDefault) {
            var headerObj = (isDefault) ? this.defaultHeaders : this.headers;
            if (headerObj[label] === undefined) {
                headerObj[label] = value;
            } else {
                headerObj[label] = value + "," + headerObj[label];
            }
            if (isDefault) {
                this.hasDefaultHeaders = true;
            } else {
                this.hasHeaders = true;
            }
        },
        setHeader: function (o) {
            if (this.hasDefaultHeaders) {
                for (var prop in this.defaultHeaders) {
                    if (this.defaultHeaders.hasOwnProperty(prop)) {
                        o.conn.setRequestHeader(prop, this.defaultHeaders[prop]);
                    }
                }
            }
            if (this.hasHeaders) {
                for (var prop in this.headers) {
                    if (this.headers.hasOwnProperty(prop)) {
                        o.conn.setRequestHeader(prop, this.headers[prop]);
                    }
                }
                this.headers = {};
                this.hasHeaders = false;
            }
        },
        resetDefaultHeaders: function () {
            delete this.defaultHeaders;
            this.defaultHeaders = {};
            this.hasDefaultHeaders = false;
        },
        abort: function (o, callback, isTimeout) {
            if (this.isCallInProgress(o)) {
                o.conn.abort();
                window.clearInterval(this.poll[o.tId]);
                delete this.poll[o.tId];
                if (isTimeout) {
                    delete this.timeout[o.tId];
                }
                this.handleTransactionResponse(o, callback, true);
                return true;
            } else {
                return false;
            }
        },
        isCallInProgress: function (o) {
            if (o.conn) {
                return o.conn.readyState != 4 && o.conn.readyState != 0;
            } else {
                return false;
            }
        },
        releaseObject: function (o) {
            o.conn = null;
            o = null;
        },
        activeX: [
            'MSXML2.XMLHTTP.3.0',
            'MSXML2.XMLHTTP',
            'Microsoft.XMLHTTP'
        ]
    };
    Ext.lib.Region = function (t, r, b, l) {
        this.top = t;
        this[1] = t;
        this.right = r;
        this.bottom = b;
        this.left = l;
        this[0] = l;
    };
    Ext.lib.Region.prototype = {
        contains: function (region) {
            return (region.left >= this.left &&
                region.right <= this.right &&
                region.top >= this.top &&
                region.bottom <= this.bottom);
        },
        getArea: function () {
            return ((this.bottom - this.top) * (this.right - this.left));
        },
        intersect: function (region) {
            var t = Math.max(this.top, region.top);
            var r = Math.min(this.right, region.right);
            var b = Math.min(this.bottom, region.bottom);
            var l = Math.max(this.left, region.left);
            if (b >= t && r >= l) {
                return new Ext.lib.Region(t, r, b, l);
            } else {
                return null;
            }
        },
        union: function (region) {
            var t = Math.min(this.top, region.top);
            var r = Math.max(this.right, region.right);
            var b = Math.max(this.bottom, region.bottom);
            var l = Math.min(this.left, region.left);
            return new Ext.lib.Region(t, r, b, l);
        },
        constrainTo: function (r) {
            this.top = this.top.constrain(r.top, r.bottom);
            this.bottom = this.bottom.constrain(r.top, r.bottom);
            this.left = this.left.constrain(r.left, r.right);
            this.right = this.right.constrain(r.left, r.right);
            return this;
        },
        adjust: function (t, l, b, r) {
            this.top += t;
            this.left += l;
            this.right += r;
            this.bottom += b;
            return this;
        }
    };
    Ext.lib.Region.getRegion = function (el) {
        var p = Ext.lib.Dom.getXY(el);
        var t = p[1];
        var r = p[0] + el.offsetWidth;
        var b = p[1] + el.offsetHeight;
        var l = p[0];
        return new Ext.lib.Region(t, r, b, l);
    };
    Ext.lib.Point = function (x, y) {
        if (Ext.isArray(x)) {
            y = x[1];
            x = x[0];
        }
        this.x = this.right = this.left = this[0] = x;
        this.y = this.top = this.bottom = this[1] = y;
    };
    Ext.lib.Point.prototype = new Ext.lib.Region();
    Ext.lib.Anim = {
        scroll: function (el, args, duration, easing, cb, scope) {
            return this.run(el, args, duration, easing, cb, scope, Ext.lib.Scroll);
        },
        motion: function (el, args, duration, easing, cb, scope) {
            return this.run(el, args, duration, easing, cb, scope, Ext.lib.Motion);
        },
        color: function (el, args, duration, easing, cb, scope) {
            return this.run(el, args, duration, easing, cb, scope, Ext.lib.ColorAnim);
        },
        run: function (el, args, duration, easing, cb, scope, type) {
            type = type || Ext.lib.AnimBase;
            if (typeof easing == "string") {
                easing = Ext.lib.Easing[easing];
            }
            var anim = new type(el, args, duration, easing);
            anim.animateX(function () {
                Ext.callback(cb, scope);
            });
            return anim;
        }
    };

    function fly(el) {
        if (!libFlyweight) {
            libFlyweight = new Ext.Element.Flyweight();
        }
        libFlyweight.dom = el;
        return libFlyweight;
    }
    if (Ext.isIE) {
        function fnCleanUp() {
            var p = Function.prototype;
            delete p.createSequence;
            delete p.defer;
            delete p.createDelegate;
            delete p.createCallback;
            delete p.createInterceptor;
            window.detachEvent("onunload", fnCleanUp);
        }
        window.attachEvent("onunload", fnCleanUp);
    }
    Ext.lib.AnimBase = function (el, attributes, duration, method) {
        if (el) {
            this.init(el, attributes, duration, method);
        }
    };
    Ext.lib.AnimBase.prototype = {
        toString: function () {
            var el = this.getEl();
            var id = el.id || el.tagName;
            return ("Anim " + id);
        },
        patterns: {
            noNegatives: /width|height|opacity|padding/i,
            offsetAttribute: /^((width|height)|(top|left))$/,
            defaultUnit: /width|height|top$|bottom$|left$|right$/i,
            offsetUnit: /\d+(em|%|en|ex|pt|in|cm|mm|pc)$/i
        },
        doMethod: function (attr, start, end) {
            return this.method(this.currentFrame, start, end - start, this.totalFrames);
        },
        setAttribute: function (attr, val, unit) {
            if (this.patterns.noNegatives.test(attr)) {
                val = (val > 0) ? val : 0;
            }
            Ext.fly(this.getEl(), '_anim').setStyle(attr, val + unit);
        },
        getAttribute: function (attr) {
            var el = this.getEl();
            var val = fly(el).getStyle(attr);
            if (val !== 'auto' && !this.patterns.offsetUnit.test(val)) {
                return parseFloat(val);
            }
            var a = this.patterns.offsetAttribute.exec(attr) || [];
            var pos = !!(a[3]);
            var box = !!(a[2]);
            if (box || (fly(el).getStyle('position') == 'absolute' && pos)) {
                val = el['offset' + a[0].charAt(0).toUpperCase() + a[0].substr(1)];
            } else {
                val = 0;
            }
            return val;
        },
        getDefaultUnit: function (attr) {
            if (this.patterns.defaultUnit.test(attr)) {
                return 'px';
            }
            return '';
        },
        animateX: function (callback, scope) {
            var f = function () {
                this.onComplete.removeListener(f);
                if (typeof callback == "function") {
                    callback.call(scope || this, this);
                }
            };
            this.onComplete.addListener(f, this);
            this.animate();
        },
        setRuntimeAttribute: function (attr) {
            var start;
            var end;
            var attributes = this.attributes;
            this.runtimeAttributes[attr] = {};
            var isset = function (prop) {
                return (typeof prop !== 'undefined');
            };
            if (!isset(attributes[attr]['to']) && !isset(attributes[attr]['by'])) {
                return false;
            }
            start = (isset(attributes[attr]['from'])) ? attributes[attr]['from'] : this.getAttribute(attr);
            if (isset(attributes[attr]['to'])) {
                end = attributes[attr]['to'];
            } else if (isset(attributes[attr]['by'])) {
                if (start.constructor == Array) {
                    end = [];
                    for (var i = 0, len = start.length; i < len; ++i) {
                        end[i] = start[i] + attributes[attr]['by'][i];
                    }
                } else {
                    end = start + attributes[attr]['by'];
                }
            }
            this.runtimeAttributes[attr].start = start;
            this.runtimeAttributes[attr].end = end;
            this.runtimeAttributes[attr].unit = (isset(attributes[attr].unit)) ? attributes[attr]['unit'] : this.getDefaultUnit(attr);
        },
        init: function (el, attributes, duration, method) {
            var isAnimated = false;
            var startTime = null;
            var actualFrames = 0;
            el = Ext.getDom(el);
            this.attributes = attributes || {};
            this.duration = duration || 1;
            this.method = method || Ext.lib.Easing.easeNone;
            this.useSeconds = true;
            this.currentFrame = 0;
            this.totalFrames = Ext.lib.AnimMgr.fps;
            this.getEl = function () {
                return el;
            };
            this.isAnimated = function () {
                return isAnimated;
            };
            this.getStartTime = function () {
                return startTime;
            };
            this.runtimeAttributes = {};
            this.animate = function () {
                if (this.isAnimated()) {
                    return false;
                }
                this.currentFrame = 0;
                this.totalFrames = (this.useSeconds) ? Math.ceil(Ext.lib.AnimMgr.fps * this.duration) : this.duration;
                Ext.lib.AnimMgr.registerElement(this);
            };
            this.stop = function (finish) {
                if (finish) {
                    this.currentFrame = this.totalFrames;
                    this._onTween.fire();
                }
                Ext.lib.AnimMgr.stop(this);
            };
            var onStart = function () {
                this.onStart.fire();
                this.runtimeAttributes = {};
                for (var attr in this.attributes) {
                    this.setRuntimeAttribute(attr);
                }
                isAnimated = true;
                actualFrames = 0;
                startTime = new Date();
            };
            var onTween = function () {
                var data = {
                    duration: new Date() - this.getStartTime(),
                    currentFrame: this.currentFrame
                };
                data.toString = function () {
                    return (
                        'duration: ' + data.duration +
                        ', currentFrame: ' + data.currentFrame
                    );
                };
                this.onTween.fire(data);
                var runtimeAttributes = this.runtimeAttributes;
                for (var attr in runtimeAttributes) {
                    this.setAttribute(attr, this.doMethod(attr, runtimeAttributes[attr].start, runtimeAttributes[attr].end), runtimeAttributes[attr].unit);
                }
                actualFrames += 1;
            };
            var onComplete = function () {
                var actual_duration = (new Date() - startTime) / 1000;
                var data = {
                    duration: actual_duration,
                    frames: actualFrames,
                    fps: actualFrames / actual_duration
                };
                data.toString = function () {
                    return (
                        'duration: ' + data.duration +
                        ', frames: ' + data.frames +
                        ', fps: ' + data.fps
                    );
                };
                isAnimated = false;
                actualFrames = 0;
                this.onComplete.fire(data);
            };
            this._onStart = new Ext.util.Event(this);
            this.onStart = new Ext.util.Event(this);
            this.onTween = new Ext.util.Event(this);
            this._onTween = new Ext.util.Event(this);
            this.onComplete = new Ext.util.Event(this);
            this._onComplete = new Ext.util.Event(this);
            this._onStart.addListener(onStart);
            this._onTween.addListener(onTween);
            this._onComplete.addListener(onComplete);
        }
    };
    Ext.lib.AnimMgr = new function () {
        var thread = null;
        var queue = [];
        var tweenCount = 0;
        this.fps = 1000;
        this.delay = 1;
        this.registerElement = function (tween) {
            queue[queue.length] = tween;
            tweenCount += 1;
            tween._onStart.fire();
            this.start();
        };
        this.unRegister = function (tween, index) {
            tween._onComplete.fire();
            index = index || getIndex(tween);
            if (index != -1) {
                queue.splice(index, 1);
            }
            tweenCount -= 1;
            if (tweenCount <= 0) {
                this.stop();
            }
        };
        this.start = function () {
            if (thread === null) {
                thread = setInterval(this.run, this.delay);
            }
        };
        this.stop = function (tween) {
            if (!tween) {
                clearInterval(thread);
                for (var i = 0, len = queue.length; i < len; ++i) {
                    if (queue[0].isAnimated()) {
                        this.unRegister(queue[0], 0);
                    }
                }
                queue = [];
                thread = null;
                tweenCount = 0;
            } else {
                this.unRegister(tween);
            }
        };
        this.run = function () {
            for (var i = 0, len = queue.length; i < len; ++i) {
                var tween = queue[i];
                if (!tween || !tween.isAnimated()) {
                    continue;
                }
                if (tween.currentFrame < tween.totalFrames || tween.totalFrames === null) {
                    tween.currentFrame += 1;
                    if (tween.useSeconds) {
                        correctFrame(tween);
                    }
                    tween._onTween.fire();
                } else {
                    Ext.lib.AnimMgr.stop(tween, i);
                }
            }
        };
        var getIndex = function (anim) {
            for (var i = 0, len = queue.length; i < len; ++i) {
                if (queue[i] == anim) {
                    return i;
                }
            }
            return -1;
        };
        var correctFrame = function (tween) {
            var frames = tween.totalFrames;
            var frame = tween.currentFrame;
            var expected = (tween.currentFrame * tween.duration * 1000 / tween.totalFrames);
            var elapsed = (new Date() - tween.getStartTime());
            var tweak = 0;
            if (elapsed < tween.duration * 1000) {
                tweak = Math.round((elapsed / expected - 1) * tween.currentFrame);
            } else {
                tweak = frames - (frame + 1);
            }
            if (tweak > 0 && isFinite(tweak)) {
                if (tween.currentFrame + tweak >= frames) {
                    tweak = frames - (frame + 1);
                }
                tween.currentFrame += tweak;
            }
        };
    };
    Ext.lib.Bezier = new function () {
        this.getPosition = function (points, t) {
            var n = points.length;
            var tmp = [];
            for (var i = 0; i < n; ++i) {
                tmp[i] = [points[i][0], points[i][1]];
            }
            for (var j = 1; j < n; ++j) {
                for (i = 0; i < n - j; ++i) {
                    tmp[i][0] = (1 - t) * tmp[i][0] + t * tmp[parseInt(i + 1, 10)][0];
                    tmp[i][1] = (1 - t) * tmp[i][1] + t * tmp[parseInt(i + 1, 10)][1];
                }
            }
            return [tmp[0][0], tmp[0][1]];
        };
    };
    (function () {
        Ext.lib.ColorAnim = function (el, attributes, duration, method) {
            Ext.lib.ColorAnim.superclass.constructor.call(this, el, attributes, duration, method);
        };
        Ext.extend(Ext.lib.ColorAnim, Ext.lib.AnimBase);
        var Y = Ext.lib;
        var superclass = Y.ColorAnim.superclass;
        var proto = Y.ColorAnim.prototype;
        proto.toString = function () {
            var el = this.getEl();
            var id = el.id || el.tagName;
            return ("ColorAnim " + id);
        };
        proto.patterns.color = /color$/i;
        proto.patterns.rgb = /^rgb\(([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\)$/i;
        proto.patterns.hex = /^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i;
        proto.patterns.hex3 = /^#?([0-9A-F]{1})([0-9A-F]{1})([0-9A-F]{1})$/i;
        proto.patterns.transparent = /^transparent|rgba\(0, 0, 0, 0\)$/;
        proto.parseColor = function (s) {
            if (s.length == 3) {
                return s;
            }
            var c = this.patterns.hex.exec(s);
            if (c && c.length == 4) {
                return [parseInt(c[1], 16), parseInt(c[2], 16), parseInt(c[3], 16)];
            }
            c = this.patterns.rgb.exec(s);
            if (c && c.length == 4) {
                return [parseInt(c[1], 10), parseInt(c[2], 10), parseInt(c[3], 10)];
            }
            c = this.patterns.hex3.exec(s);
            if (c && c.length == 4) {
                return [parseInt(c[1] + c[1], 16), parseInt(c[2] + c[2], 16), parseInt(c[3] + c[3], 16)];
            }
            return null;
        };
        proto.getAttribute = function (attr) {
            var el = this.getEl();
            if (this.patterns.color.test(attr)) {
                var val = fly(el).getStyle(attr);
                if (this.patterns.transparent.test(val)) {
                    var parent = el.parentNode;
                    val = fly(parent).getStyle(attr);
                    while (parent && this.patterns.transparent.test(val)) {
                        parent = parent.parentNode;
                        val = fly(parent).getStyle(attr);
                        if (parent.tagName.toUpperCase() == 'HTML') {
                            val = '#fff';
                        }
                    }
                }
            } else {
                val = superclass.getAttribute.call(this, attr);
            }
            return val;
        };
        proto.doMethod = function (attr, start, end) {
            var val;
            if (this.patterns.color.test(attr)) {
                val = [];
                for (var i = 0, len = start.length; i < len; ++i) {
                    val[i] = superclass.doMethod.call(this, attr, start[i], end[i]);
                }
                val = 'rgb(' + Math.floor(val[0]) + ',' + Math.floor(val[1]) + ',' + Math.floor(val[2]) + ')';
            } else {
                val = superclass.doMethod.call(this, attr, start, end);
            }
            return val;
        };
        proto.setRuntimeAttribute = function (attr) {
            superclass.setRuntimeAttribute.call(this, attr);
            if (this.patterns.color.test(attr)) {
                var attributes = this.attributes;
                var start = this.parseColor(this.runtimeAttributes[attr].start);
                var end = this.parseColor(this.runtimeAttributes[attr].end);
                if (typeof attributes[attr]['to'] === 'undefined' && typeof attributes[attr]['by'] !== 'undefined') {
                    end = this.parseColor(attributes[attr].by);
                    for (var i = 0, len = start.length; i < len; ++i) {
                        end[i] = start[i] + end[i];
                    }
                }
                this.runtimeAttributes[attr].start = start;
                this.runtimeAttributes[attr].end = end;
            }
        };
    })();
    Ext.lib.Easing = {
        easeNone: function (t, b, c, d) {
            return c * t / d + b;
        },
        easeIn: function (t, b, c, d) {
            return c * (t /= d) * t + b;
        },
        easeOut: function (t, b, c, d) {
            return -c * (t /= d) * (t - 2) + b;
        },
        easeBoth: function (t, b, c, d) {
            if ((t /= d / 2) < 1) {
                return c / 2 * t * t + b;
            }
            return -c / 2 * ((--t) * (t - 2) - 1) + b;
        },
        easeInStrong: function (t, b, c, d) {
            return c * (t /= d) * t * t * t + b;
        },
        easeOutStrong: function (t, b, c, d) {
            return -c * ((t = t / d - 1) * t * t * t - 1) + b;
        },
        easeBothStrong: function (t, b, c, d) {
            if ((t /= d / 2) < 1) {
                return c / 2 * t * t * t * t + b;
            }
            return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
        },
        elasticIn: function (t, b, c, d, a, p) {
            if (t == 0) {
                return b;
            }
            if ((t /= d) == 1) {
                return b + c;
            }
            if (!p) {
                p = d * .3;
            }
            if (!a || a < Math.abs(c)) {
                a = c;
                var s = p / 4;
            } else {
                var s = p / (2 * Math.PI) * Math.asin(c / a);
            }
            return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        },
        elasticOut: function (t, b, c, d, a, p) {
            if (t == 0) {
                return b;
            }
            if ((t /= d) == 1) {
                return b + c;
            }
            if (!p) {
                p = d * .3;
            }
            if (!a || a < Math.abs(c)) {
                a = c;
                var s = p / 4;
            } else {
                var s = p / (2 * Math.PI) * Math.asin(c / a);
            }
            return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
        },
        elasticBoth: function (t, b, c, d, a, p) {
            if (t == 0) {
                return b;
            }
            if ((t /= d / 2) == 2) {
                return b + c;
            }
            if (!p) {
                p = d * (.3 * 1.5);
            }
            if (!a || a < Math.abs(c)) {
                a = c;
                var s = p / 4;
            } else {
                var s = p / (2 * Math.PI) * Math.asin(c / a);
            }
            if (t < 1) {
                return -.5 * (a * Math.pow(2, 10 * (t -= 1)) *
                    Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            }
            return a * Math.pow(2, -10 * (t -= 1)) *
                Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
        },
        backIn: function (t, b, c, d, s) {
            if (typeof s == 'undefined') {
                s = 1.70158;
            }
            return c * (t /= d) * t * ((s + 1) * t - s) + b;
        },
        backOut: function (t, b, c, d, s) {
            if (typeof s == 'undefined') {
                s = 1.70158;
            }
            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
        },
        backBoth: function (t, b, c, d, s) {
            if (typeof s == 'undefined') {
                s = 1.70158;
            }
            if ((t /= d / 2) < 1) {
                return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
            }
            return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
        },
        bounceIn: function (t, b, c, d) {
            return c - Ext.lib.Easing.bounceOut(d - t, 0, c, d) + b;
        },
        bounceOut: function (t, b, c, d) {
            if ((t /= d) < (1 / 2.75)) {
                return c * (7.5625 * t * t) + b;
            } else if (t < (2 / 2.75)) {
                return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
            } else if (t < (2.5 / 2.75)) {
                return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
            }
            return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
        },
        bounceBoth: function (t, b, c, d) {
            if (t < d / 2) {
                return Ext.lib.Easing.bounceIn(t * 2, 0, c, d) * .5 + b;
            }
            return Ext.lib.Easing.bounceOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
        }
    };
    (function () {
        Ext.lib.Motion = function (el, attributes, duration, method) {
            if (el) {
                Ext.lib.Motion.superclass.constructor.call(this, el, attributes, duration, method);
            }
        };
        Ext.extend(Ext.lib.Motion, Ext.lib.ColorAnim);
        var Y = Ext.lib;
        var superclass = Y.Motion.superclass;
        var proto = Y.Motion.prototype;
        proto.toString = function () {
            var el = this.getEl();
            var id = el.id || el.tagName;
            return ("Motion " + id);
        };
        proto.patterns.points = /^points$/i;
        proto.setAttribute = function (attr, val, unit) {
            if (this.patterns.points.test(attr)) {
                unit = unit || 'px';
                superclass.setAttribute.call(this, 'left', val[0], unit);
                superclass.setAttribute.call(this, 'top', val[1], unit);
            } else {
                superclass.setAttribute.call(this, attr, val, unit);
            }
        };
        proto.getAttribute = function (attr) {
            if (this.patterns.points.test(attr)) {
                var val = [
                    superclass.getAttribute.call(this, 'left'),
                    superclass.getAttribute.call(this, 'top')
                ];
            } else {
                val = superclass.getAttribute.call(this, attr);
            }
            return val;
        };
        proto.doMethod = function (attr, start, end) {
            var val = null;
            if (this.patterns.points.test(attr)) {
                var t = this.method(this.currentFrame, 0, 100, this.totalFrames) / 100;
                val = Y.Bezier.getPosition(this.runtimeAttributes[attr], t);
            } else {
                val = superclass.doMethod.call(this, attr, start, end);
            }
            return val;
        };
        proto.setRuntimeAttribute = function (attr) {
            if (this.patterns.points.test(attr)) {
                var el = this.getEl();
                var attributes = this.attributes;
                var start;
                var control = attributes['points']['control'] || [];
                var end;
                var i, len;
                if (control.length > 0 && !Ext.isArray(control[0])) {
                    control = [control];
                } else {
                    var tmp = [];
                    for (i = 0, len = control.length; i < len; ++i) {
                        tmp[i] = control[i];
                    }
                    control = tmp;
                }
                Ext.fly(el, '_anim').position();
                if (isset(attributes['points']['from'])) {
                    Ext.lib.Dom.setXY(el, attributes['points']['from']);
                } else {
                    Ext.lib.Dom.setXY(el, Ext.lib.Dom.getXY(el));
                }
                start = this.getAttribute('points');
                if (isset(attributes['points']['to'])) {
                    end = translateValues.call(this, attributes['points']['to'], start);
                    var pageXY = Ext.lib.Dom.getXY(this.getEl());
                    for (i = 0, len = control.length; i < len; ++i) {
                        control[i] = translateValues.call(this, control[i], start);
                    }
                } else if (isset(attributes['points']['by'])) {
                    end = [start[0] + attributes['points']['by'][0], start[1] + attributes['points']['by'][1]];
                    for (i = 0, len = control.length; i < len; ++i) {
                        control[i] = [start[0] + control[i][0], start[1] + control[i][1]];
                    }
                }
                this.runtimeAttributes[attr] = [start];
                if (control.length > 0) {
                    this.runtimeAttributes[attr] = this.runtimeAttributes[attr].concat(control);
                }
                this.runtimeAttributes[attr][this.runtimeAttributes[attr].length] = end;
            } else {
                superclass.setRuntimeAttribute.call(this, attr);
            }
        };
        var translateValues = function (val, start) {
            var pageXY = Ext.lib.Dom.getXY(this.getEl());
            val = [val[0] - pageXY[0] + start[0], val[1] - pageXY[1] + start[1]];
            return val;
        };
        var isset = function (prop) {
            return (typeof prop !== 'undefined');
        };
    })();
    (function () {
        Ext.lib.Scroll = function (el, attributes, duration, method) {
            if (el) {
                Ext.lib.Scroll.superclass.constructor.call(this, el, attributes, duration, method);
            }
        };
        Ext.extend(Ext.lib.Scroll, Ext.lib.ColorAnim);
        var Y = Ext.lib;
        var superclass = Y.Scroll.superclass;
        var proto = Y.Scroll.prototype;
        proto.toString = function () {
            var el = this.getEl();
            var id = el.id || el.tagName;
            return ("Scroll " + id);
        };
        proto.doMethod = function (attr, start, end) {
            var val = null;
            if (attr == 'scroll') {
                val = [
                    this.method(this.currentFrame, start[0], end[0] - start[0], this.totalFrames),
                    this.method(this.currentFrame, start[1], end[1] - start[1], this.totalFrames)
                ];
            } else {
                val = superclass.doMethod.call(this, attr, start, end);
            }
            return val;
        };
        proto.getAttribute = function (attr) {
            var val = null;
            var el = this.getEl();
            if (attr == 'scroll') {
                val = [el.scrollLeft, el.scrollTop];
            } else {
                val = superclass.getAttribute.call(this, attr);
            }
            return val;
        };
        proto.setAttribute = function (attr, val, unit) {
            var el = this.getEl();
            if (attr == 'scroll') {
                el.scrollLeft = val[0];
                el.scrollTop = val[1];
            } else {
                superclass.setAttribute.call(this, attr, val, unit);
            }
        };
    })();
})();
Ext.util.Observable = function () {

    if (this.listeners) {
        this.on(this.listeners);
        delete this.listeners;
    }
};
Ext.util.Observable.prototype = {

    fireEvent: function () {
        if (this.eventsSuspended !== true) {
            var ce = this.events[arguments[0].toLowerCase()];
            if (typeof ce == "object") {
                return ce.fire.apply(ce, Array.prototype.slice.call(arguments, 1));
            }
        }
        return true;
    },
    // private
    filterOptRe: /^(?:scope|delay|buffer|single)$/,

    addListener: function (eventName, fn, scope, o) {
        if (typeof eventName == "object") {
            o = eventName;
            for (var e in o) {
                if (this.filterOptRe.test(e)) {
                    continue;
                }
                if (typeof o[e] == "function") {
                    // shared options
                    this.addListener(e, o[e], o.scope, o);
                } else {
                    // individual options
                    this.addListener(e, o[e].fn, o[e].scope, o[e]);
                }
            }
            return;
        }
        o = (!o || typeof o == "boolean") ? {} : o;
        eventName = eventName.toLowerCase();
        var ce = this.events[eventName] || true;
        if (typeof ce == "boolean") {
            ce = new Ext.util.Event(this, eventName);
            this.events[eventName] = ce;
        }
        ce.addListener(fn, scope, o);
    },

    removeListener: function (eventName, fn, scope) {
        var ce = this.events[eventName.toLowerCase()];
        if (typeof ce == "object") {
            ce.removeListener(fn, scope);
        }
    },

    purgeListeners: function () {
        for (var evt in this.events) {
            if (typeof this.events[evt] == "object") {
                this.events[evt].clearListeners();
            }
        }
    },

    relayEvents: function (o, events) {
        var createHandler = function (ename) {
            return function () {
                return this.fireEvent.apply(this, Ext.combine(ename, Array.prototype.slice.call(arguments, 0)));
            };
        };
        for (var i = 0, len = events.length; i < len; i++) {
            var ename = events[i];
            if (!this.events[ename]) {
                this.events[ename] = true;
            };
            o.on(ename, createHandler(ename), this);
        }
    },

    addEvents: function (o) {
        if (!this.events) {
            this.events = {};
        }
        if (typeof o == 'string') {
            for (var i = 0, a = arguments, v; v = a[i]; i++) {
                if (!this.events[a[i]]) {
                    this.events[a[i]] = true;
                }
            }
        } else {
            Ext.applyIf(this.events, o);
        }
    },

    hasListener: function (eventName) {
        var e = this.events[eventName];
        return typeof e == "object" && e.listeners.length > 0;
    },

    suspendEvents: function () {
        this.eventsSuspended = true;
    },

    resumeEvents: function () {
        this.eventsSuspended = false;
    },
    // these are considered experimental
    // allows for easier interceptor and sequences, including cancelling and overwriting the return value of the call
    // private
    getMethodEvent: function (method) {
        if (!this.methodEvents) {
            this.methodEvents = {};
        }
        var e = this.methodEvents[method];
        if (!e) {
            e = {};
            this.methodEvents[method] = e;
            e.originalFn = this[method];
            e.methodName = method;
            e.before = [];
            e.after = [];
            var returnValue, v, cancel;
            var obj = this;
            var makeCall = function (fn, scope, args) {
                if ((v = fn.apply(scope || obj, args)) !== undefined) {
                    if (typeof v === 'object') {
                        if (v.returnValue !== undefined) {
                            returnValue = v.returnValue;
                        } else {
                            returnValue = v;
                        }
                        if (v.cancel === true) {
                            cancel = true;
                        }
                    } else if (v === false) {
                        cancel = true;
                    } else {
                        returnValue = v;
                    }
                }
            }
            this[method] = function () {
                returnValue = v = undefined;
                cancel = false;
                var args = Array.prototype.slice.call(arguments, 0);
                for (var i = 0, len = e.before.length; i < len; i++) {
                    makeCall(e.before[i].fn, e.before[i].scope, args);
                    if (cancel) {
                        return returnValue;
                    }
                }
                if ((v = e.originalFn.apply(obj, args)) !== undefined) {
                    returnValue = v;
                }
                for (var i = 0, len = e.after.length; i < len; i++) {
                    makeCall(e.after[i].fn, e.after[i].scope, args);
                    if (cancel) {
                        return returnValue;
                    }
                }
                return returnValue;
            };
        }
        return e;
    },
    // adds an "interceptor" called before the original method
    beforeMethod: function (method, fn, scope) {
        var e = this.getMethodEvent(method);
        e.before.push({
            fn: fn,
            scope: scope
        });
    },
    // adds a "sequence" called after the original method
    afterMethod: function (method, fn, scope) {
        var e = this.getMethodEvent(method);
        e.after.push({
            fn: fn,
            scope: scope
        });
    },
    removeMethodListener: function (method, fn, scope) {
        var e = this.getMethodEvent(method);
        for (var i = 0, len = e.before.length; i < len; i++) {
            if (e.before[i].fn == fn && e.before[i].scope == scope) {
                e.before.splice(i, 1);
                return;
            }
        }
        for (var i = 0, len = e.after.length; i < len; i++) {
            if (e.after[i].fn == fn && e.after[i].scope == scope) {
                e.after.splice(i, 1);
                return;
            }
        }
    }
};
Ext.util.Observable.prototype.on = Ext.util.Observable.prototype.addListener;
Ext.util.Observable.prototype.un = Ext.util.Observable.prototype.removeListener;
Ext.util.Observable.capture = function (o, fn, scope) {
    o.fireEvent = o.fireEvent.createInterceptor(fn, scope);
};
Ext.util.Observable.releaseCapture = function (o) {
    o.fireEvent = Ext.util.Observable.prototype.fireEvent;
};
(function () {
    var createBuffered = function (h, o, scope) {
        var task = new Ext.util.DelayedTask();
        return function () {
            task.delay(o.buffer, h, scope, Array.prototype.slice.call(arguments, 0));
        };
    };
    var createSingle = function (h, e, fn, scope) {
        return function () {
            e.removeListener(fn, scope);
            return h.apply(scope, arguments);
        };
    };
    var createDelayed = function (h, o, scope) {
        return function () {
            var args = Array.prototype.slice.call(arguments, 0);
            setTimeout(function () {
                h.apply(scope, args);
            }, o.delay || 10);
        };
    };
    Ext.util.Event = function (obj, name) {
        this.name = name;
        this.obj = obj;
        this.listeners = [];
    };
    Ext.util.Event.prototype = {
        addListener: function (fn, scope, options) {
            scope = scope || this.obj;
            if (!this.isListening(fn, scope)) {
                var l = this.createListener(fn, scope, options);
                if (!this.firing) {
                    this.listeners.push(l);
                } else { // if we are currently firing this event, don't disturb the listener loop
                    this.listeners = this.listeners.slice(0);
                    this.listeners.push(l);
                }
            }
        },
        createListener: function (fn, scope, o) {
            o = o || {};
            scope = scope || this.obj;
            var l = {
                fn: fn,
                scope: scope,
                options: o
            };
            var h = fn;
            if (o.delay) {
                h = createDelayed(h, o, scope);
            }
            if (o.single) {
                h = createSingle(h, this, fn, scope);
            }
            if (o.buffer) {
                h = createBuffered(h, o, scope);
            }
            l.fireFn = h;
            return l;
        },
        findListener: function (fn, scope) {
            scope = scope || this.obj;
            var ls = this.listeners;
            for (var i = 0, len = ls.length; i < len; i++) {
                var l = ls[i];
                if (l.fn == fn && l.scope == scope) {
                    return i;
                }
            }
            return -1;
        },
        isListening: function (fn, scope) {
            return this.findListener(fn, scope) != -1;
        },
        removeListener: function (fn, scope) {
            var index;
            if ((index = this.findListener(fn, scope)) != -1) {
                if (!this.firing) {
                    this.listeners.splice(index, 1);
                } else {
                    this.listeners = this.listeners.slice(0);
                    this.listeners.splice(index, 1);
                }
                return true;
            }
            return false;
        },
        clearListeners: function () {
            this.listeners = [];
        },
        fire: function () {
            var ls = this.listeners,
                scope, len = ls.length;
            if (len > 0) {
                this.firing = true;
                var args = Array.prototype.slice.call(arguments, 0);
                for (var i = 0; i < len; i++) {
                    var l = ls[i];
                    if (l.fireFn.apply(l.scope || this.obj || window, arguments) === false) {
                        this.firing = false;
                        return false;
                    }
                }
                this.firing = false;
            }
            return true;
        }
    };
})();
Ext.EventManager = function () {
    var docReadyEvent, docReadyProcId, docReadyState = false;
    var resizeEvent, resizeTask, textEvent, textSize;
    var E = Ext.lib.Event;
    var D = Ext.lib.Dom;
    // fix parser confusion
    var xname = 'Ex' + 't';
    var elHash = {};
    var addListener = function (el, ename, fn, wrap, scope) {
        var id = Ext.id(el);
        if (!elHash[id]) {
            elHash[id] = {};
        }
        var es = elHash[id];
        if (!es[ename]) {
            es[ename] = [];
        }
        var ls = es[ename];
        ls.push({
            id: id,
            ename: ename,
            fn: fn,
            wrap: wrap,
            scope: scope
        });
        E.on(el, ename, wrap);
        if (ename == "mousewheel" && el.addEventListener) { // workaround for jQuery
            el.addEventListener("DOMMouseScroll", wrap, false);
            E.on(window, 'unload', function () {
                el.removeEventListener("DOMMouseScroll", wrap, false);
            });
        }
        if (ename == "mousedown" && el == document) { // fix stopped mousedowns on the document
            Ext.EventManager.stoppedMouseDownEvent.addListener(wrap);
        }
    }
    var removeListener = function (el, ename, fn, scope) {
        el = Ext.getDom(el);
        var id = Ext.id(el),
            es = elHash[id],
            wrap;
        if (es) {
            var ls = es[ename],
                l;
            if (ls) {
                for (var i = 0, len = ls.length; i < len; i++) {
                    l = ls[i];
                    if (l.fn == fn && (!scope || l.scope == scope)) {
                        wrap = l.wrap;
                        E.un(el, ename, wrap);
                        ls.splice(i, 1);
                        break;
                    }
                }
            }
        }
        if (ename == "mousewheel" && el.addEventListener && wrap) {
            el.removeEventListener("DOMMouseScroll", wrap, false);
        }
        if (ename == "mousedown" && el == document && wrap) { // fix stopped mousedowns on the document
            Ext.EventManager.stoppedMouseDownEvent.removeListener(wrap);
        }
    }
    var removeAll = function (el) {
        el = Ext.getDom(el);
        var id = Ext.id(el),
            es = elHash[id],
            ls;
        if (es) {
            for (var ename in es) {
                if (es.hasOwnProperty(ename)) {
                    ls = es[ename];
                    for (var i = 0, len = ls.length; i < len; i++) {
                        E.un(el, ename, ls[i].wrap);
                        ls[i] = null;
                    }
                }
                es[ename] = null;
            }
            delete elHash[id];
        }
    }
    var fireDocReady = function () {
        if (!docReadyState) {
            docReadyState = true;
            Ext.isReady = true;
            if (docReadyProcId) {
                clearInterval(docReadyProcId);
            }
            if (Ext.isGecko || Ext.isOpera) {
                document.removeEventListener("DOMContentLoaded", fireDocReady, false);
            }
            if (Ext.isIE) {
                var defer = document.getElementById("ie-deferred-loader");
                if (defer) {
                    defer.onreadystatechange = null;
                    defer.parentNode.removeChild(defer);
                }
            }
            if (docReadyEvent) {
                docReadyEvent.fire();
                docReadyEvent.clearListeners();
            }
        }
    };
    var initDocReady = function () {
        docReadyEvent = new Ext.util.Event();
        if (Ext.isGecko || Ext.isOpera) {
            document.addEventListener("DOMContentLoaded", fireDocReady, false);
        } else if (Ext.isIE) {
            document.write("<s" + 'cript id="ie-deferred-loader" defer="defer" src="/' + '/:"></s' + "cript>");
            var defer = document.getElementById("ie-deferred-loader");
            defer.onreadystatechange = function () {
                if (this.readyState == "complete") {
                    fireDocReady();
                }
            };
        } else if (Ext.isWebKit) {
            docReadyProcId = setInterval(function () {
                var rs = document.readyState;
                if (rs == "complete") {
                    fireDocReady();
                }
            }, 10);
        }
        // no matter what, make sure it fires on load
        E.on(window, "load", fireDocReady);
    };
    var createBuffered = function (h, o) {
        var task = new Ext.util.DelayedTask(h);
        return function (e) {
            // create new event object impl so new events don't wipe out properties
            e = new Ext.EventObjectImpl(e);
            task.delay(o.buffer, h, null, [e]);
        };
    };
    var createSingle = function (h, el, ename, fn, scope) {
        return function (e) {
            Ext.EventManager.removeListener(el, ename, fn, scope);
            h(e);
        };
    };
    var createDelayed = function (h, o) {
        return function (e) {
            // create new event object impl so new events don't wipe out properties
            e = new Ext.EventObjectImpl(e);
            setTimeout(function () {
                h(e);
            }, o.delay || 10);
        };
    };
    var listen = function (element, ename, opt, fn, scope) {
        var o = (!opt || typeof opt == "boolean") ? {} : opt;
        fn = fn || o.fn;
        scope = scope || o.scope;
        var el = Ext.getDom(element);
        if (!el) {
            throw "Error listening for \"" + ename + '\". Element "' + element + '" doesn\'t exist.';
        }
        var h = function (e) {
            // prevent errors while unload occurring
            if (!window[xname]) {
                return;
            }
            e = Ext.EventObject.setEvent(e);
            var t;
            if (o.delegate) {
                t = e.getTarget(o.delegate, el);
                if (!t) {
                    return;
                }
            } else {
                t = e.target;
            }
            if (o.stopEvent === true) {
                e.stopEvent();
            }
            if (o.preventDefault === true) {
                e.preventDefault();
            }
            if (o.stopPropagation === true) {
                e.stopPropagation();
            }
            if (o.normalized === false) {
                e = e.browserEvent;
            }
            fn.call(scope || el, e, t, o);
        };
        if (o.delay) {
            h = createDelayed(h, o);
        }
        if (o.single) {
            h = createSingle(h, el, ename, fn, scope);
        }
        if (o.buffer) {
            h = createBuffered(h, o);
        }
        addListener(el, ename, fn, h, scope);
        return h;
    };
    var propRe = /^(?:scope|delay|buffer|single|stopEvent|preventDefault|stopPropagation|normalized|args|delegate)$/,
        curWidth = 0,
        curHeight = 0;
    var pub = {

        addListener: function (element, eventName, fn, scope, options) {
            if (typeof eventName == "object") {
                var o = eventName;
                for (var e in o) {
                    if (propRe.test(e)) {
                        continue;
                    }
                    if (typeof o[e] == "function") {
                        // shared options
                        listen(element, e, o, o[e], o.scope);
                    } else {
                        // individual options
                        listen(element, e, o[e]);
                    }
                }
                return;
            }
            return listen(element, eventName, options, fn, scope);
        },

        removeListener: function (element, eventName, fn, scope) {
            return removeListener(element, eventName, fn, scope);
        },

        removeAll: function (element) {
            return removeAll(element);
        },

        onDocumentReady: function (fn, scope, options) {
            if (docReadyState) { // if it already fired
                docReadyEvent.addListener(fn, scope, options);
                docReadyEvent.fire();
                docReadyEvent.clearListeners();
                return;
            }
            if (!docReadyEvent) {
                initDocReady();
            }
            options = options || {};
            if (!options.delay) {
                options.delay = 1;
            }
            docReadyEvent.addListener(fn, scope, options);
        },

        // private
        doResizeEvent: function () {
            var h = D.getViewHeight(),
                w = D.getViewWidth();

            //whacky problem in IE where the resize event will fire even though the w/h are the same.
            if (curHeight != h || curWidth != w) {
                resizeEvent.fire(curWidth = w, curHeight = h);
            }
        },

        onWindowResize: function (fn, scope, options) {
            if (!resizeEvent) {
                resizeEvent = new Ext.util.Event();
                resizeTask = new Ext.util.DelayedTask(this.doResizeEvent);
                E.on(window, "resize", this.fireWindowResize, this);
            }
            resizeEvent.addListener(fn, scope, options);
        },
        // exposed only to allow manual firing
        fireWindowResize: function () {
            if (resizeEvent) {
                if ((Ext.isIE || Ext.isAir) && resizeTask) {
                    resizeTask.delay(50);
                } else {
                    resizeEvent.fire(D.getViewWidth(), D.getViewHeight());
                }
            }
        },

        onTextResize: function (fn, scope, options) {
            if (!textEvent) {
                textEvent = new Ext.util.Event();
                var textEl = new Ext.Element(document.createElement('div'));
                textEl.dom.className = 'x-text-resize';
                textEl.dom.innerHTML = 'X';
                textEl.appendTo(document.body);
                textSize = textEl.dom.offsetHeight;
                setInterval(function () {
                    if (textEl.dom.offsetHeight != textSize) {
                        textEvent.fire(textSize, textSize = textEl.dom.offsetHeight);
                    }
                }, this.textResizeInterval);
            }
            textEvent.addListener(fn, scope, options);
        },

        removeResizeListener: function (fn, scope) {
            if (resizeEvent) {
                resizeEvent.removeListener(fn, scope);
            }
        },
        // private
        fireResize: function () {
            if (resizeEvent) {
                resizeEvent.fire(D.getViewWidth(), D.getViewHeight());
            }
        },

        ieDeferSrc: false,

        textResizeInterval: 50
    };

    pub.on = pub.addListener;

    pub.un = pub.removeListener;
    pub.stoppedMouseDownEvent = new Ext.util.Event();
    return pub;
}();
Ext.onReady = Ext.EventManager.onDocumentReady;
// Initialize doc classes
(function () {
    var initExtCss = function () {
        // find the body element
        var bd = document.body || document.getElementsByTagName('body')[0];
        if (!bd) {
            return false;
        }
        var cls = [' ',
            Ext.isIE ? "ext-ie " + (Ext.isIE6 ? 'ext-ie6' : (Ext.isIE7 ? 'ext-ie7' : (Ext.isIE8 ? 'ext-ie8' : 'ext-ie9'))) : Ext.isGecko ? "ext-gecko " + (Ext.isGecko2 ? 'ext-gecko2' : 'ext-gecko3') : Ext.isOpera ? "ext-opera" : Ext.isSafari ? "ext-safari" : Ext.isChrome ? "ext-chrome" : ""
        ];
        if (Ext.isMac) {
            cls.push("ext-mac");
        }
        if (Ext.isLinux) {
            cls.push("ext-linux");
        }
        if (Ext.isStrict || Ext.isBorderBox) { // add to the parent to allow for selectors like ".ext-strict .ext-ie"
            var p = bd.parentNode;
            if (p) {
                p.className += Ext.isStrict ? ' ext-strict' : ' ext-border-box';
            }
        }
        bd.className += cls.join(' ');
        return true;
    }
    if (!initExtCss()) {
        Ext.onReady(initExtCss);
    }
})();
Ext.EventObject = function () {
    var E = Ext.lib.Event;
    // safari keypress events for special keys return bad keycodes
    var safariKeys = {
        3: 13, // enter
        63234: 37, // left
        63235: 39, // right
        63232: 38, // up
        63233: 40, // down
        63276: 33, // page up
        63277: 34, // page down
        63272: 46, // delete
        63273: 36, // home
        63275: 35 // end
    };
    // normalize button clicks
    var btnMap = Ext.isIE ? {
            1: 0,
            4: 1,
            2: 2
        } :
        (Ext.isWebKit ? {
            1: 0,
            2: 1,
            3: 2
        } : {
            0: 0,
            1: 1,
            2: 2
        });
    Ext.EventObjectImpl = function (e) {
        if (e) {
            this.setEvent(e.browserEvent || e);
        }
    };
    Ext.EventObjectImpl.prototype = {

        browserEvent: null,

        button: -1,

        shiftKey: false,

        ctrlKey: false,

        altKey: false,

        BACKSPACE: 8,

        TAB: 9,

        NUM_CENTER: 12,

        ENTER: 13,

        RETURN: 13,

        SHIFT: 16,

        CTRL: 17,
        CONTROL: 17, // legacy

        ALT: 18,

        PAUSE: 19,

        CAPS_LOCK: 20,

        ESC: 27,

        SPACE: 32,

        PAGE_UP: 33,
        PAGEUP: 33, // legacy

        PAGE_DOWN: 34,
        PAGEDOWN: 34, // legacy

        END: 35,

        HOME: 36,

        LEFT: 37,

        UP: 38,

        RIGHT: 39,

        DOWN: 40,

        PRINT_SCREEN: 44,

        INSERT: 45,

        DELETE: 46,

        ZERO: 48,

        ONE: 49,

        TWO: 50,

        THREE: 51,

        FOUR: 52,

        FIVE: 53,

        SIX: 54,

        SEVEN: 55,

        EIGHT: 56,

        NINE: 57,

        A: 65,

        B: 66,

        C: 67,

        D: 68,

        E: 69,

        F: 70,

        G: 71,

        H: 72,

        I: 73,

        J: 74,

        K: 75,

        L: 76,

        M: 77,

        N: 78,

        O: 79,

        P: 80,

        Q: 81,

        R: 82,

        S: 83,

        T: 84,

        U: 85,

        V: 86,

        W: 87,

        X: 88,

        Y: 89,

        Z: 90,

        CONTEXT_MENU: 93,

        NUM_ZERO: 96,

        NUM_ONE: 97,

        NUM_TWO: 98,

        NUM_THREE: 99,

        NUM_FOUR: 100,

        NUM_FIVE: 101,

        NUM_SIX: 102,

        NUM_SEVEN: 103,

        NUM_EIGHT: 104,

        NUM_NINE: 105,

        NUM_MULTIPLY: 106,

        NUM_PLUS: 107,

        NUM_MINUS: 109,

        NUM_PERIOD: 110,

        NUM_DIVISION: 111,

        F1: 112,

        F2: 113,

        F3: 114,

        F4: 115,

        F5: 116,

        F6: 117,

        F7: 118,

        F8: 119,

        F9: 120,

        F10: 121,

        F11: 122,

        F12: 123,

        setEvent: function (e) {
            if (e == this || (e && e.browserEvent)) { // already wrapped
                return e;
            }
            this.browserEvent = e;
            if (e) {
                // normalize buttons
                this.button = e.button ? btnMap[e.button] : (e.which ? e.which - 1 : -1);
                if (e.type == 'click' && this.button == -1) {
                    this.button = 0;
                }
                this.type = e.type;
                this.shiftKey = e.shiftKey;
                // mac metaKey behaves like ctrlKey
                this.ctrlKey = e.ctrlKey || e.metaKey;
                this.altKey = e.altKey;
                // in getKey these will be normalized for the mac
                this.keyCode = e.keyCode;
                this.charCode = e.charCode;
                // cache the target for the delayed and or buffered events
                this.target = E.getTarget(e);
                // same for XY
                this.xy = E.getXY(e);
            } else {
                this.button = -1;
                this.shiftKey = false;
                this.ctrlKey = false;
                this.altKey = false;
                this.keyCode = 0;
                this.charCode = 0;
                this.target = null;
                this.xy = [0, 0];
            }
            return this;
        },

        stopEvent: function () {
            if (this.browserEvent) {
                if (this.browserEvent.type == 'mousedown') {
                    Ext.EventManager.stoppedMouseDownEvent.fire(this);
                }
                E.stopEvent(this.browserEvent);
            }
        },

        preventDefault: function () {
            if (this.browserEvent) {
                E.preventDefault(this.browserEvent);
            }
        },

        isNavKeyPress: function () {
            var k = this.keyCode;
            k = Ext.isSafari ? (safariKeys[k] || k) : k;
            return (k >= 33 && k <= 40) || k == this.RETURN || k == this.TAB || k == this.ESC;
        },
        isSpecialKey: function () {
            var k = this.keyCode;
            k = Ext.isSafari ? (safariKeys[k] || k) : k;
            return (this.type == 'keypress' && this.ctrlKey) ||
                this.isNavKeyPress() ||
                (k == this.BACKSPACE) || // Backspace
                (k >= 16 && k <= 20) || // Shift, Ctrl, Alt, Pause, Caps Lock
                (k >= 44 && k <= 45); // Print Screen, Insert
        },

        stopPropagation: function () {
            if (this.browserEvent) {
                if (this.browserEvent.type == 'mousedown') {
                    Ext.EventManager.stoppedMouseDownEvent.fire(this);
                }
                E.stopPropagation(this.browserEvent);
            }
        },

        getCharCode: function () {
            return this.charCode || this.keyCode;
        },

        getKey: function () {
            var k = this.keyCode || this.charCode;
            return Ext.isSafari ? (safariKeys[k] || k) : k;
        },

        getPageX: function () {
            return this.xy[0];
        },

        getPageY: function () {
            return this.xy[1];
        },

        getTime: function () {
            if (this.browserEvent) {
                return E.getTime(this.browserEvent);
            }
            return null;
        },

        getXY: function () {
            return this.xy;
        },

        getTarget: function (selector, maxDepth, returnEl) {
            return selector ? Ext.fly(this.target).findParent(selector, maxDepth, returnEl) : (returnEl ? Ext.get(this.target) : this.target);
        },

        getRelatedTarget: function () {
            if (this.browserEvent) {
                return E.getRelatedTarget(this.browserEvent);
            }
            return null;
        },

        getWheelDelta: function () {
            var e = this.browserEvent;
            var delta = 0;
            if (e.wheelDelta) {
                delta = e.wheelDelta / 120;
            } else if (e.detail) {
                delta = -e.detail / 3;
            }
            return delta;
        },

        hasModifier: function () {
            return ((this.ctrlKey || this.altKey) || this.shiftKey) ? true : false;
        },

        within: function (el, related, allowEl) {
            var t = this[related ? "getRelatedTarget" : "getTarget"]();
            return t && ((allowEl ? (t === Ext.getDom(el)) : false) || Ext.fly(el).contains(t));
        },
        getPoint: function () {
            return new Ext.lib.Point(this.xy[0], this.xy[1]);
        }
    };
    return new Ext.EventObjectImpl();
}();
Ext.BLANK_IMAGE_URL = '/assets/ext/resources/images/default/s.gif';
Ext.namespace(
    'Vps', 'Vpc',
    'Vps.Component',
    'Vps.User.Login',
    'Vps.Auto',
    'Vps.Form',
    'Vps.Binding',
    'Vpc.Advanced',
    'Vps.Debug',
    'Vps.Switch',
    'Vps.Basic.LinkTag.Extern',
    'Vps.Layout',
    'Vps.Utils'
);
Ext.applyIf(Array.prototype, {
    //deprecated! -> forEach (ist auch ein JS-Standard!)
    each: function (fn, scope) {
        Ext.each(this, fn, scope);
    },
    //to use array.forEach directly
    forEach: function (fn, scope) {
        Ext.each(this, fn, scope);
    },
    //add is alias for push
    add: function () {
        this.push.apply(this, arguments);
    },
    //+ Jonas Raoni Soares Silva
    //@ http://jsfromhell.com/array/shuffle [rev. #1]
    shuffle: function () {
        for (var j, x, i = this.length; i; j = parseInt(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);
        return this;
    }
});
Ext.applyIf(Function.prototype, {
    interceptResult: function (fcn, scope) {
        if (typeof fcn != "function") {
            return this;
        }
        var method = this;
        var interception = function () {
            var retval = method.apply(this || window, arguments);
            var callArgs = Array.prototype.slice.call(arguments, 0);
            var args = [retval].concat(callArgs);
            var newRetval = fcn.apply(scope || this || window, args);
            return newRetval;
        };
        if (this.prototype) {
            Ext.apply(interception.prototype, this.prototype);
            if (this.superclass) {
                interception.superclass = this.superclass;
            }
            if (this.override) {
                interception.override = this.override;
            }
        }
        return interception;
    }
});
//http://extjs.com/forum/showthread.php?t=26644
Vps.clone = function (o) {
    if ('object' !== typeof o || o === null) {
        return o;
    }
    var c = 'function' === typeof o.pop ? [] : {};
    var p, v;
    for (p in o) {
        if (o.hasOwnProperty(p)) {
            v = o[p];
            if ('object' === typeof v && v !== null) {
                c[p] = Vps.clone(v);
            } else {
                c[p] = v;
            }
        }
    }
    return c;
};
Ext.onReady(function () {
    // Ext.state.Manager.setProvider(new Ext.state.CookieProvider());
    if (Ext.QuickTips) {
        Ext.QuickTips.init();
    }
    if (Ext.isIE6) {
        Ext.each(Ext.DomQuery.select('.addHover'), function (el) {
            var extEl = Ext.fly(el);
            extEl.hover(
                function () {
                    this.addClass('hover');
                },
                function () {
                    this.removeClass('hover');
                },
                extEl
            );
        });
    }
});
Vps.application = {
    maxAssetsMTime: '1389802575'
};
//log das auch ohne irgendwelche abh�nigkeiten funktioniert (zB im Selenium)
Vps.log = function (msg) {
    if (!Vps.debugDiv) {
        Vps.debugDiv = document.createElement('div');
        document.body.appendChild(Vps.debugDiv);
        Vps.debugDiv.style.position = 'absolute';
        Vps.debugDiv.style.zIndex = '300';
        Vps.debugDiv.style.top = 0;
        Vps.debugDiv.style.right = 0;
        Vps.debugDiv.style.backgroundColor = 'white';
        Vps.debugDiv.style.fontSize = '10px';
    }
    Vps.debugDiv.innerHTML += msg + '<br />';
};
//wird gesetzt in Vps.Connection
Vps.requestSentSinceLastKeepAlive = false;
Vps.keepAlive = function () {
    if (!Vps.requestSentSinceLastKeepAlive) {
        Ext.Ajax.request({
            url: '/vps/user/login/json-keep-alive',
            ignoreErrors: true
        });
    } else {
        Vps.requestSentSinceLastKeepAlive = false;
    }
    Vps.keepAlive.defer(1000 * 60 * 5);
};
Vps.keepAliveActivated = false;
Vps.activateKeepAlive = function () {
    if (Vps.keepAliveActivated) return;
    Vps.keepAliveActivated = true;
    Vps.keepAlive.defer(1000 * 60 * 5);
};
if (Vps.isApp) {
    Vps.activateKeepAlive();
}
Vps.contentReadyHandlers = [];
Vps.onContentReady = function (fn, scope) {
    // Handler merken, damit zB in ComponentSwitch das Ganz nochmal ausgeführt
    // werden kann
    Vps.contentReadyHandlers.push({
        fn: fn,
        scope: scope
    });
    //in einer Ext-Anwendung mit Vps.main den contentReadHandler
    //nicht gleich ausführen, das paragraphs-panel führt es dafür aus
    if (!Vps.isApp) {
        //normales Frontend
        Ext.onReady(fn, scope);
    }
};
Vps.callOnContentReady = function () {
    Ext.each(Vps.contentReadyHandlers, function (i) {
        i.fn.call(i.scope | window);
    }, this);
};
Vps.include = function (url, restart) {
    if (url.substr(-4) == '.css') {
        var s = document.createElement('link');
        s.setAttribute('type', 'text/css');
        s.setAttribute('href', url + '?' + Math.random());
        s.setAttribute('rel', 'stylesheet');
    } else {
        var s = document.createElement('script');
        s.setAttribute('type', 'text/javascript');
        s.setAttribute('src', url + '?' + Math.random());
    }
    s.onload = function () {
        if (restart) Vps.restart();
    };
    document.getElementsByTagName("head")[0].appendChild(s);
};
Vps.restart = function () {
    Ext.getBody().unmask();
    if (Vps.currentViewport) {
        Vps.currentViewport.onDestroy();
        delete Vps.currentViewport;
    }
    Vps.main();
};
var restart = Vps.restart;
var include = Vps.include;
(function () {
    var D = Ext.lib.Dom;
    var E = Ext.lib.Event;
    var A = Ext.lib.Anim;
    // local style camelizing for speed
    var propCache = {};
    var camelRe = /(-[a-z])/gi;
    var camelFn = function (m, a) {
        return a.charAt(1).toUpperCase();
    };
    var view = document.defaultView;
    Ext.Element = function (element, forceNew) {
        var dom = typeof element == "string" ?
            document.getElementById(element) : element;
        if (!dom) { // invalid id/element
            return null;
        }
        var id = dom.id;
        if (forceNew !== true && id && Ext.Element.cache[id]) { // element object already exists
            return Ext.Element.cache[id];
        }

        this.dom = dom;

        this.id = id || Ext.id(dom);
    };
    var El = Ext.Element;
    El.prototype = {
        // Mouse events



        // Keyboard events



        // HTML frame/object events



        // Form events



        // User Interface events



        // DOM Mutation events



        originalDisplay: "",
        visibilityMode: 1,

        defaultUnit: "px",

        setVisibilityMode: function (visMode) {
            this.visibilityMode = visMode;
            return this;
        },

        enableDisplayMode: function (display) {
            this.setVisibilityMode(El.DISPLAY);
            if (typeof display != "undefined") this.originalDisplay = display;
            return this;
        },

        findParent: function (simpleSelector, maxDepth, returnEl) {
            var p = this.dom,
                b = document.body,
                depth = 0,
                dq = Ext.DomQuery,
                stopEl;
            maxDepth = maxDepth || 50;
            if (typeof maxDepth != "number") {
                stopEl = Ext.getDom(maxDepth);
                maxDepth = Number.MAX_VALUE;
            }
            while (p && p.nodeType == 1 && depth < maxDepth && p != b && p != stopEl) {
                if (dq.is(p, simpleSelector)) {
                    return returnEl ? Ext.get(p) : p;
                }
                depth++;
                p = p.parentNode;
            }
            return null;
        },

        findParentNode: function (simpleSelector, maxDepth, returnEl) {
            var p = Ext.fly(this.dom.parentNode, '_internal');
            return p ? p.findParent(simpleSelector, maxDepth, returnEl) : null;
        },

        up: function (simpleSelector, maxDepth) {
            return this.findParentNode(simpleSelector, maxDepth, true);
        },

        is: function (simpleSelector) {
            return Ext.DomQuery.is(this.dom, simpleSelector);
        },

        animate: function (args, duration, onComplete, easing, animType) {
            this.anim(args, {
                duration: duration,
                callback: onComplete,
                easing: easing
            }, animType);
            return this;
        },

        anim: function (args, opt, animType, defaultDur, defaultEase, cb) {
            animType = animType || 'run';
            opt = opt || {};
            var anim = Ext.lib.Anim[animType](
                this.dom, args, (opt.duration || defaultDur) || .35, (opt.easing || defaultEase) || 'easeOut',
                function () {
                    Ext.callback(cb, this);
                    Ext.callback(opt.callback, opt.scope || this, [this, opt]);
                },
                this
            );
            opt.anim = anim;
            return anim;
        },
        // private legacy anim prep
        preanim: function (a, i) {
            return !a[i] ? false : (typeof a[i] == "object" ? a[i] : {
                duration: a[i + 1],
                callback: a[i + 2],
                easing: a[i + 3]
            });
        },

        clean: function (forceReclean) {
            if (this.isCleaned && forceReclean !== true) {
                return this;
            }
            var ns = /\S/;
            var d = this.dom,
                n = d.firstChild,
                ni = -1;
            while (n) {
                var nx = n.nextSibling;
                if (n.nodeType == 3 && !ns.test(n.nodeValue)) {
                    d.removeChild(n);
                } else {
                    n.nodeIndex = ++ni;
                }
                n = nx;
            }
            this.isCleaned = true;
            return this;
        },

        scrollIntoView: function (container, hscroll) {
            var c = Ext.getDom(container) || Ext.getBody().dom;
            var el = this.dom;
            var o = this.getOffsetsTo(c),
                l = o[0] + c.scrollLeft,
                t = o[1] + c.scrollTop,
                b = t + el.offsetHeight,
                r = l + el.offsetWidth;
            var ch = c.clientHeight;
            var ct = parseInt(c.scrollTop, 10);
            var cl = parseInt(c.scrollLeft, 10);
            var cb = ct + ch;
            var cr = cl + c.clientWidth;
            if (el.offsetHeight > ch || t < ct) {
                c.scrollTop = t;
            } else if (b > cb) {
                c.scrollTop = b - ch;
            }
            c.scrollTop = c.scrollTop; // corrects IE, other browsers will ignore
            if (hscroll !== false) {
                if (el.offsetWidth > c.clientWidth || l < cl) {
                    c.scrollLeft = l;
                } else if (r > cr) {
                    c.scrollLeft = r - c.clientWidth;
                }
                c.scrollLeft = c.scrollLeft;
            }
            return this;
        },
        // private
        scrollChildIntoView: function (child, hscroll) {
            Ext.fly(child, '_scrollChildIntoView').scrollIntoView(this, hscroll);
        },

        autoHeight: function (animate, duration, onComplete, easing) {
            var oldHeight = this.getHeight();
            this.clip();
            this.setHeight(1); // force clipping
            setTimeout(function () {
                var height = parseInt(this.dom.scrollHeight, 10); // parseInt for Safari
                if (!animate) {
                    this.setHeight(height);
                    this.unclip();
                    if (typeof onComplete == "function") {
                        onComplete();
                    }
                } else {
                    this.setHeight(oldHeight); // restore original height
                    this.setHeight(height, animate, duration, function () {
                        this.unclip();
                        if (typeof onComplete == "function") onComplete();
                    }.createDelegate(this), easing);
                }
            }.createDelegate(this), 0);
            return this;
        },

        contains: function (el) {
            if (!el) {
                return false;
            }
            return D.isAncestor(this.dom, el.dom ? el.dom : el);
        },

        isVisible: function (deep) {
            var vis = !(this.getStyle("visibility") == "hidden" || this.getStyle("display") == "none");
            if (deep !== true || !vis) {
                return vis;
            }
            var p = this.dom.parentNode;
            while (p && p.tagName.toLowerCase() != "body") {
                if (!Ext.fly(p, '_isVisible').isVisible()) {
                    return false;
                }
                p = p.parentNode;
            }
            return true;
        },

        select: function (selector, unique) {
            return El.select(selector, unique, this.dom);
        },

        query: function (selector) {
            return Ext.DomQuery.select(selector, this.dom);
        },

        child: function (selector, returnDom) {
            var n = Ext.DomQuery.selectNode(selector, this.dom);
            return returnDom ? n : Ext.get(n);
        },

        down: function (selector, returnDom) {
            var n = Ext.DomQuery.selectNode(" > " + selector, this.dom);
            return returnDom ? n : Ext.get(n);
        },

        initDD: function (group, config, overrides) {
            var dd = new Ext.dd.DD(Ext.id(this.dom), group, config);
            return Ext.apply(dd, overrides);
        },

        initDDProxy: function (group, config, overrides) {
            var dd = new Ext.dd.DDProxy(Ext.id(this.dom), group, config);
            return Ext.apply(dd, overrides);
        },

        initDDTarget: function (group, config, overrides) {
            var dd = new Ext.dd.DDTarget(Ext.id(this.dom), group, config);
            return Ext.apply(dd, overrides);
        },

        setVisible: function (visible, animate) {
            if (!animate || !A) {
                if (this.visibilityMode == El.DISPLAY) {
                    this.setDisplayed(visible);
                } else {
                    this.fixDisplay();
                    this.dom.style.visibility = visible ? "visible" : "hidden";
                }
            } else {
                // closure for composites
                var dom = this.dom;
                var visMode = this.visibilityMode;
                if (visible) {
                    this.setOpacity(.01);
                    this.setVisible(true);
                }
                this.anim({
                        opacity: {
                            to: (visible ? 1 : 0)
                        }
                    },
                    this.preanim(arguments, 1),
                    null, .35, 'easeIn',
                    function () {
                        if (!visible) {
                            if (visMode == El.DISPLAY) {
                                dom.style.display = "none";
                            } else {
                                dom.style.visibility = "hidden";
                            }
                            Ext.get(dom).setOpacity(1);
                        }
                    });
            }
            return this;
        },

        isDisplayed: function () {
            return this.getStyle("display") != "none";
        },

        toggle: function (animate) {
            this.setVisible(!this.isVisible(), this.preanim(arguments, 0));
            return this;
        },

        setDisplayed: function (value) {
            if (typeof value == "boolean") {
                value = value ? this.originalDisplay : "none";
            }
            this.setStyle("display", value);
            return this;
        },

        focus: function () {
            try {
                this.dom.focus();
            } catch (e) {}
            return this;
        },

        blur: function () {
            try {
                this.dom.blur();
            } catch (e) {}
            return this;
        },

        addClass: function (className) {
            if (Ext.isArray(className)) {
                for (var i = 0, len = className.length; i < len; i++) {
                    this.addClass(className[i]);
                }
            } else {
                if (className && !this.hasClass(className)) {
                    this.dom.className = this.dom.className + " " + className;
                }
            }
            return this;
        },

        radioClass: function (className) {
            var siblings = this.dom.parentNode.childNodes;
            for (var i = 0; i < siblings.length; i++) {
                var s = siblings[i];
                if (s.nodeType == 1) {
                    Ext.get(s).removeClass(className);
                }
            }
            this.addClass(className);
            return this;
        },

        removeClass: function (className) {
            if (!className || !this.dom.className) {
                return this;
            }
            if (Ext.isArray(className)) {
                for (var i = 0, len = className.length; i < len; i++) {
                    this.removeClass(className[i]);
                }
            } else {
                if (this.hasClass(className)) {
                    var re = this.classReCache[className];
                    if (!re) {
                        re = new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)', "g");
                        this.classReCache[className] = re;
                    }
                    this.dom.className =
                        this.dom.className.replace(re, " ");
                }
            }
            return this;
        },
        // private
        classReCache: {},

        toggleClass: function (className) {
            if (this.hasClass(className)) {
                this.removeClass(className);
            } else {
                this.addClass(className);
            }
            return this;
        },

        hasClass: function (className) {
            return className && (' ' + this.dom.className + ' ').indexOf(' ' + className + ' ') != -1;
        },

        replaceClass: function (oldClassName, newClassName) {
            this.removeClass(oldClassName);
            this.addClass(newClassName);
            return this;
        },

        getStyles: function () {
            var a = arguments,
                len = a.length,
                r = {};
            for (var i = 0; i < len; i++) {
                r[a[i]] = this.getStyle(a[i]);
            }
            return r;
        },

        getStyle: function () {
            return view && view.getComputedStyle ?
                function (prop) {
                    var el = this.dom,
                        v, cs, camel;
                    if (prop == 'float') {
                        prop = "cssFloat";
                    }
                    if (v = el.style[prop]) {
                        return v;
                    }
                    if (cs = view.getComputedStyle(el, "")) {
                        if (!(camel = propCache[prop])) {
                            camel = propCache[prop] = prop.replace(camelRe, camelFn);
                        }
                        return cs[camel];
                    }
                    return null;
                } :
                function (prop) {
                    var el = this.dom,
                        v, cs, camel;
                    if (prop == 'opacity') {
                        if (typeof el.style.filter == 'string') {
                            var m = el.style.filter.match(/alpha\(opacity=(.*)\)/i);
                            if (m) {
                                var fv = parseFloat(m[1]);
                                if (!isNaN(fv)) {
                                    return fv ? fv / 100 : 0;
                                }
                            }
                        }
                        return 1;
                    } else if (prop == 'float') {
                        prop = "styleFloat";
                    }
                    if (!(camel = propCache[prop])) {
                        camel = propCache[prop] = prop.replace(camelRe, camelFn);
                    }
                    if (v = el.style[camel]) {
                        return v;
                    }
                    if (cs = el.currentStyle) {
                        return cs[camel];
                    }
                    return null;
                };
        }(),

        setStyle: function (prop, value) {
            if (typeof prop == "string") {
                var camel;
                if (!(camel = propCache[prop])) {
                    camel = propCache[prop] = prop.replace(camelRe, camelFn);
                }
                if (camel == 'opacity') {
                    this.setOpacity(value);
                } else {
                    this.dom.style[camel] = value;
                }
            } else {
                for (var style in prop) {
                    if (typeof prop[style] != "function") {
                        this.setStyle(style, prop[style]);
                    }
                }
            }
            return this;
        },

        applyStyles: function (style) {
            Ext.DomHelper.applyStyles(this.dom, style);
            return this;
        },

        getX: function () {
            return D.getX(this.dom);
        },

        getY: function () {
            return D.getY(this.dom);
        },

        getXY: function () {
            return D.getXY(this.dom);
        },

        getOffsetsTo: function (el) {
            var o = this.getXY();
            var e = Ext.fly(el, '_internal').getXY();
            return [o[0] - e[0], o[1] - e[1]];
        },

        setX: function (x, animate) {
            if (!animate || !A) {
                D.setX(this.dom, x);
            } else {
                this.setXY([x, this.getY()], this.preanim(arguments, 1));
            }
            return this;
        },

        setY: function (y, animate) {
            if (!animate || !A) {
                D.setY(this.dom, y);
            } else {
                this.setXY([this.getX(), y], this.preanim(arguments, 1));
            }
            return this;
        },

        setLeft: function (left) {
            this.setStyle("left", this.addUnits(left));
            return this;
        },

        setTop: function (top) {
            this.setStyle("top", this.addUnits(top));
            return this;
        },

        setRight: function (right) {
            this.setStyle("right", this.addUnits(right));
            return this;
        },

        setBottom: function (bottom) {
            this.setStyle("bottom", this.addUnits(bottom));
            return this;
        },

        setXY: function (pos, animate) {
            if (!animate || !A) {
                D.setXY(this.dom, pos);
            } else {
                this.anim({
                    points: {
                        to: pos
                    }
                }, this.preanim(arguments, 1), 'motion');
            }
            return this;
        },

        setLocation: function (x, y, animate) {
            this.setXY([x, y], this.preanim(arguments, 2));
            return this;
        },

        moveTo: function (x, y, animate) {
            this.setXY([x, y], this.preanim(arguments, 2));
            return this;
        },

        getRegion: function () {
            return D.getRegion(this.dom);
        },

        getHeight: function (contentHeight) {
            var h = Math.max(this.dom.offsetHeight, this.dom.clientHeight) || 0;
            h = contentHeight !== true ? h : h - this.getBorderWidth("tb") - this.getPadding("tb");
            return h < 0 ? 0 : h;
        },

        getWidth: function (contentWidth) {
            var w = Math.max(this.dom.offsetWidth, this.dom.clientWidth) || 0;
            w = contentWidth !== true ? w : w - this.getBorderWidth("lr") - this.getPadding("lr");
            return w < 0 ? 0 : w;
        },

        getComputedHeight: function () {
            var h = Math.max(this.dom.offsetHeight, this.dom.clientHeight);
            if (!h) {
                h = parseInt(this.getStyle('height'), 10) || 0;
                if (!this.isBorderBox()) {
                    h += this.getFrameWidth('tb');
                }
            }
            return h;
        },

        getComputedWidth: function () {
            var w = Math.max(this.dom.offsetWidth, this.dom.clientWidth);
            if (!w) {
                w = parseInt(this.getStyle('width'), 10) || 0;
                if (!this.isBorderBox()) {
                    w += this.getFrameWidth('lr');
                }
            }
            return w;
        },

        getSize: function (contentSize) {
            return {
                width: this.getWidth(contentSize),
                height: this.getHeight(contentSize)
            };
        },
        getStyleSize: function () {
            var w, h, d = this.dom,
                s = d.style;
            if (s.width && s.width != 'auto') {
                w = parseInt(s.width, 10);
                if (Ext.isBorderBox) {
                    w -= this.getFrameWidth('lr');
                }
            }
            if (s.height && s.height != 'auto') {
                h = parseInt(s.height, 10);
                if (Ext.isBorderBox) {
                    h -= this.getFrameWidth('tb');
                }
            }
            return {
                width: w || this.getWidth(true),
                height: h || this.getHeight(true)
            };
        },

        getViewSize: function () {
            var d = this.dom,
                doc = document,
                aw = 0,
                ah = 0;
            if (d == doc || d == doc.body) {
                return {
                    width: D.getViewWidth(),
                    height: D.getViewHeight()
                };
            } else {
                return {
                    width: d.clientWidth,
                    height: d.clientHeight
                };
            }
        },

        getValue: function (asNumber) {
            return asNumber ? parseInt(this.dom.value, 10) : this.dom.value;
        },
        // private
        adjustWidth: function (width) {
            if (typeof width == "number") {
                if (this.autoBoxAdjust && !this.isBorderBox()) {
                    width -= (this.getBorderWidth("lr") + this.getPadding("lr"));
                }
                if (width < 0) {
                    width = 0;
                }
            }
            return width;
        },
        // private
        adjustHeight: function (height) {
            if (typeof height == "number") {
                if (this.autoBoxAdjust && !this.isBorderBox()) {
                    height -= (this.getBorderWidth("tb") + this.getPadding("tb"));
                }
                if (height < 0) {
                    height = 0;
                }
            }
            return height;
        },

        setWidth: function (width, animate) {
            width = this.adjustWidth(width);
            if (!animate || !A) {
                this.dom.style.width = this.addUnits(width);
            } else {
                this.anim({
                    width: {
                        to: width
                    }
                }, this.preanim(arguments, 1));
            }
            return this;
        },

        setHeight: function (height, animate) {
            height = this.adjustHeight(height);
            if (!animate || !A) {
                this.dom.style.height = this.addUnits(height);
            } else {
                this.anim({
                    height: {
                        to: height
                    }
                }, this.preanim(arguments, 1));
            }
            return this;
        },

        setSize: function (width, height, animate) {
            if (typeof width == "object") { // in case of object from getSize()
                height = width.height;
                width = width.width;
            }
            width = this.adjustWidth(width);
            height = this.adjustHeight(height);
            if (!animate || !A) {
                this.dom.style.width = this.addUnits(width);
                this.dom.style.height = this.addUnits(height);
            } else {
                this.anim({
                    width: {
                        to: width
                    },
                    height: {
                        to: height
                    }
                }, this.preanim(arguments, 2));
            }
            return this;
        },

        setBounds: function (x, y, width, height, animate) {
            if (!animate || !A) {
                this.setSize(width, height);
                this.setLocation(x, y);
            } else {
                width = this.adjustWidth(width);
                height = this.adjustHeight(height);
                this.anim({
                        points: {
                            to: [x, y]
                        },
                        width: {
                            to: width
                        },
                        height: {
                            to: height
                        }
                    },
                    this.preanim(arguments, 4), 'motion');
            }
            return this;
        },

        setRegion: function (region, animate) {
            this.setBounds(region.left, region.top, region.right - region.left, region.bottom - region.top, this.preanim(arguments, 1));
            return this;
        },

        addListener: function (eventName, fn, scope, options) {
            Ext.EventManager.on(this.dom, eventName, fn, scope || this, options);
        },

        removeListener: function (eventName, fn, scope) {
            Ext.EventManager.removeListener(this.dom, eventName, fn, scope || this);
            return this;
        },

        removeAllListeners: function () {
            Ext.EventManager.removeAll(this.dom);
            return this;
        },

        relayEvent: function (eventName, observable) {
            this.on(eventName, function (e) {
                observable.fireEvent(eventName, e);
            });
        },

        setOpacity: function (opacity, animate) {
            if (!animate || !A) {
                var s = this.dom.style;
                if (Ext.isIE) {
                    s.zoom = 1;
                    s.filter = (s.filter || '').replace(/alpha\([^\)]*\)/gi, "") +
                        (opacity == 1 ? "" : " alpha(opacity=" + opacity * 100 + ")");
                } else {
                    s.opacity = opacity;
                }
            } else {
                this.anim({
                    opacity: {
                        to: opacity
                    }
                }, this.preanim(arguments, 1), null, .35, 'easeIn');
            }
            return this;
        },

        getLeft: function (local) {
            if (!local) {
                return this.getX();
            } else {
                return parseInt(this.getStyle("left"), 10) || 0;
            }
        },

        getRight: function (local) {
            if (!local) {
                return this.getX() + this.getWidth();
            } else {
                return (this.getLeft(true) + this.getWidth()) || 0;
            }
        },

        getTop: function (local) {
            if (!local) {
                return this.getY();
            } else {
                return parseInt(this.getStyle("top"), 10) || 0;
            }
        },

        getBottom: function (local) {
            if (!local) {
                return this.getY() + this.getHeight();
            } else {
                return (this.getTop(true) + this.getHeight()) || 0;
            }
        },

        position: function (pos, zIndex, x, y) {
            if (!pos) {
                if (this.getStyle('position') == 'static') {
                    this.setStyle('position', 'relative');
                }
            } else {
                this.setStyle("position", pos);
            }
            if (zIndex) {
                this.setStyle("z-index", zIndex);
            }
            if (x !== undefined && y !== undefined) {
                this.setXY([x, y]);
            } else if (x !== undefined) {
                this.setX(x);
            } else if (y !== undefined) {
                this.setY(y);
            }
        },

        clearPositioning: function (value) {
            value = value || '';
            this.setStyle({
                "left": value,
                "right": value,
                "top": value,
                "bottom": value,
                "z-index": "",
                "position": "static"
            });
            return this;
        },

        getPositioning: function () {
            var l = this.getStyle("left");
            var t = this.getStyle("top");
            return {
                "position": this.getStyle("position"),
                "left": l,
                "right": l ? "" : this.getStyle("right"),
                "top": t,
                "bottom": t ? "" : this.getStyle("bottom"),
                "z-index": this.getStyle("z-index")
            };
        },

        getBorderWidth: function (side) {
            return this.addStyles(side, El.borders);
        },

        getPadding: function (side) {
            return this.addStyles(side, El.paddings);
        },

        setPositioning: function (pc) {
            this.applyStyles(pc);
            if (pc.right == "auto") {
                this.dom.style.right = "";
            }
            if (pc.bottom == "auto") {
                this.dom.style.bottom = "";
            }
            return this;
        },
        // private
        fixDisplay: function () {
            if (this.getStyle("display") == "none") {
                this.setStyle("visibility", "hidden");
                this.setStyle("display", this.originalDisplay); // first try reverting to default
                if (this.getStyle("display") == "none") { // if that fails, default to block
                    this.setStyle("display", "block");
                }
            }
        },
        // private
        setOverflow: function (v) {
            if (v == 'auto' && Ext.isMac && Ext.isGecko2) { // work around stupid FF 2.0/Mac scroll bar bug
                this.dom.style.overflow = 'hidden';
                (function () {
                    this.dom.style.overflow = 'auto';
                }).defer(1, this);
            } else {
                this.dom.style.overflow = v;
            }
        },

        setLeftTop: function (left, top) {
            this.dom.style.left = this.addUnits(left);
            this.dom.style.top = this.addUnits(top);
            return this;
        },

        move: function (direction, distance, animate) {
            var xy = this.getXY();
            direction = direction.toLowerCase();
            switch (direction) {
            case "l":
            case "left":
                this.moveTo(xy[0] - distance, xy[1], this.preanim(arguments, 2));
                break;
            case "r":
            case "right":
                this.moveTo(xy[0] + distance, xy[1], this.preanim(arguments, 2));
                break;
            case "t":
            case "top":
            case "up":
                this.moveTo(xy[0], xy[1] - distance, this.preanim(arguments, 2));
                break;
            case "b":
            case "bottom":
            case "down":
                this.moveTo(xy[0], xy[1] + distance, this.preanim(arguments, 2));
                break;
            }
            return this;
        },

        clip: function () {
            if (!this.isClipped) {
                this.isClipped = true;
                this.originalClip = {
                    "o": this.getStyle("overflow"),
                    "x": this.getStyle("overflow-x"),
                    "y": this.getStyle("overflow-y")
                };
                this.setStyle("overflow", "hidden");
                this.setStyle("overflow-x", "hidden");
                this.setStyle("overflow-y", "hidden");
            }
            return this;
        },

        unclip: function () {
            if (this.isClipped) {
                this.isClipped = false;
                var o = this.originalClip;
                if (o.o) {
                    this.setStyle("overflow", o.o);
                }
                if (o.x) {
                    this.setStyle("overflow-x", o.x);
                }
                if (o.y) {
                    this.setStyle("overflow-y", o.y);
                }
            }
            return this;
        },

        getAnchorXY: function (anchor, local, s) {
            //Passing a different size is useful for pre-calculating anchors,
            //especially for anchored animations that change the el size.
            var w, h, vp = false;
            if (!s) {
                var d = this.dom;
                if (d == document.body || d == document) {
                    vp = true;
                    w = D.getViewWidth();
                    h = D.getViewHeight();
                } else {
                    w = this.getWidth();
                    h = this.getHeight();
                }
            } else {
                w = s.width;
                h = s.height;
            }
            var x = 0,
                y = 0,
                r = Math.round;
            switch ((anchor || "tl").toLowerCase()) {
            case "c":
                x = r(w * .5);
                y = r(h * .5);
                break;
            case "t":
                x = r(w * .5);
                y = 0;
                break;
            case "l":
                x = 0;
                y = r(h * .5);
                break;
            case "r":
                x = w;
                y = r(h * .5);
                break;
            case "b":
                x = r(w * .5);
                y = h;
                break;
            case "tl":
                x = 0;
                y = 0;
                break;
            case "bl":
                x = 0;
                y = h;
                break;
            case "br":
                x = w;
                y = h;
                break;
            case "tr":
                x = w;
                y = 0;
                break;
            }
            if (local === true) {
                return [x, y];
            }
            if (vp) {
                var sc = this.getScroll();
                return [x + sc.left, y + sc.top];
            }
            //Add the element's offset xy
            var o = this.getXY();
            return [x + o[0], y + o[1]];
        },

        getAlignToXY: function (el, p, o) {
            el = Ext.get(el);
            if (!el || !el.dom) {
                throw "Element.alignToXY with an element that doesn't exist";
            }
            var d = this.dom;
            var c = false; //constrain to viewport
            var p1 = "",
                p2 = "";
            o = o || [0, 0];
            if (!p) {
                p = "tl-bl";
            } else if (p == "?") {
                p = "tl-bl?";
            } else if (p.indexOf("-") == -1) {
                p = "tl-" + p;
            }
            p = p.toLowerCase();
            var m = p.match(/^([a-z]+)-([a-z]+)(\?)?$/);
            if (!m) {
                throw "Element.alignTo with an invalid alignment " + p;
            }
            p1 = m[1];
            p2 = m[2];
            c = !!m[3];
            //Subtract the aligned el's internal xy from the target's offset xy
            //plus custom offset to get the aligned el's new offset xy
            var a1 = this.getAnchorXY(p1, true);
            var a2 = el.getAnchorXY(p2, false);
            var x = a2[0] - a1[0] + o[0];
            var y = a2[1] - a1[1] + o[1];
            if (c) {
                //constrain the aligned el to viewport if necessary
                var w = this.getWidth(),
                    h = this.getHeight(),
                    r = el.getRegion();
                // 5px of margin for ie
                var dw = D.getViewWidth() - 5,
                    dh = D.getViewHeight() - 5;
                //If we are at a viewport boundary and the aligned el is anchored on a target border that is
                //perpendicular to the vp border, allow the aligned el to slide on that border,
                //otherwise swap the aligned el to the opposite border of the target.
                var p1y = p1.charAt(0),
                    p1x = p1.charAt(p1.length - 1);
                var p2y = p2.charAt(0),
                    p2x = p2.charAt(p2.length - 1);
                var swapY = ((p1y == "t" && p2y == "b") || (p1y == "b" && p2y == "t"));
                var swapX = ((p1x == "r" && p2x == "l") || (p1x == "l" && p2x == "r"));
                var doc = document;
                var scrollX = (doc.documentElement.scrollLeft || doc.body.scrollLeft || 0) + 5;
                var scrollY = (doc.documentElement.scrollTop || doc.body.scrollTop || 0) + 5;
                if ((x + w) > dw + scrollX) {
                    x = swapX ? r.left - w : dw + scrollX - w;
                }
                if (x < scrollX) {
                    x = swapX ? r.right : scrollX;
                }
                if ((y + h) > dh + scrollY) {
                    y = swapY ? r.top - h : dh + scrollY - h;
                }
                if (y < scrollY) {
                    y = swapY ? r.bottom : scrollY;
                }
            }
            return [x, y];
        },
        // private
        getConstrainToXY: function () {
            var os = {
                top: 0,
                left: 0,
                bottom: 0,
                right: 0
            };
            return function (el, local, offsets, proposedXY) {
                el = Ext.get(el);
                offsets = offsets ? Ext.applyIf(offsets, os) : os;
                var vw, vh, vx = 0,
                    vy = 0;
                if (el.dom == document.body || el.dom == document) {
                    vw = Ext.lib.Dom.getViewWidth();
                    vh = Ext.lib.Dom.getViewHeight();
                } else {
                    vw = el.dom.clientWidth;
                    vh = el.dom.clientHeight;
                    if (!local) {
                        var vxy = el.getXY();
                        vx = vxy[0];
                        vy = vxy[1];
                    }
                }
                var s = el.getScroll();
                vx += offsets.left + s.left;
                vy += offsets.top + s.top;
                vw -= offsets.right;
                vh -= offsets.bottom;
                var vr = vx + vw;
                var vb = vy + vh;
                var xy = proposedXY || (!local ? this.getXY() : [this.getLeft(true), this.getTop(true)]);
                var x = xy[0],
                    y = xy[1];
                var w = this.dom.offsetWidth,
                    h = this.dom.offsetHeight;
                // only move it if it needs it
                var moved = false;
                // first validate right/bottom
                if ((x + w) > vr) {
                    x = vr - w;
                    moved = true;
                }
                if ((y + h) > vb) {
                    y = vb - h;
                    moved = true;
                }
                // then make sure top/left isn't negative
                if (x < vx) {
                    x = vx;
                    moved = true;
                }
                if (y < vy) {
                    y = vy;
                    moved = true;
                }
                return moved ? [x, y] : false;
            };
        }(),
        // private
        adjustForConstraints: function (xy, parent, offsets) {
            return this.getConstrainToXY(parent || document, false, offsets, xy) || xy;
        },

        alignTo: function (element, position, offsets, animate) {
            var xy = this.getAlignToXY(element, position, offsets);
            this.setXY(xy, this.preanim(arguments, 3));
            return this;
        },

        anchorTo: function (el, alignment, offsets, animate, monitorScroll, callback) {
            var action = function () {
                this.alignTo(el, alignment, offsets, animate);
                Ext.callback(callback, this);
            };
            Ext.EventManager.onWindowResize(action, this);
            var tm = typeof monitorScroll;
            if (tm != 'undefined') {
                Ext.EventManager.on(window, 'scroll', action, this, {
                    buffer: tm == 'number' ? monitorScroll : 50
                });
            }
            action.call(this); // align immediately
            return this;
        },

        clearOpacity: function () {
            if (window.ActiveXObject) {
                if (typeof this.dom.style.filter == 'string' && (/alpha/i).test(this.dom.style.filter)) {
                    this.dom.style.filter = "";
                }
            } else {
                this.dom.style.opacity = "";
                this.dom.style["-moz-opacity"] = "";
                this.dom.style["-khtml-opacity"] = "";
            }
            return this;
        },

        hide: function (animate) {
            this.setVisible(false, this.preanim(arguments, 0));
            return this;
        },

        show: function (animate) {
            this.setVisible(true, this.preanim(arguments, 0));
            return this;
        },

        addUnits: function (size) {
            return Ext.Element.addUnits(size, this.defaultUnit);
        },

        update: function (html, loadScripts, callback) {
            if (typeof html == "undefined") {
                html = "";
            }
            if (loadScripts !== true) {
                this.dom.innerHTML = html;
                if (typeof callback == "function") {
                    callback();
                }
                return this;
            }
            var id = Ext.id();
            var dom = this.dom;
            html += '<span id="' + id + '"></span>';
            E.onAvailable(id, function () {
                var hd = document.getElementsByTagName("head")[0];
                var re = /(?:<script([^>]*)?>)((\n|\r|.)*?)(?:<\/script>)/ig;
                var srcRe = /\ssrc=([\'\"])(.*?)\1/i;
                var typeRe = /\stype=([\'\"])(.*?)\1/i;
                var match;
                while (match = re.exec(html)) {
                    var attrs = match[1];
                    var srcMatch = attrs ? attrs.match(srcRe) : false;
                    if (srcMatch && srcMatch[2]) {
                        var s = document.createElement("script");
                        s.src = srcMatch[2];
                        var typeMatch = attrs.match(typeRe);
                        if (typeMatch && typeMatch[2]) {
                            s.type = typeMatch[2];
                        }
                        hd.appendChild(s);
                    } else if (match[2] && match[2].length > 0) {
                        if (window.execScript) {
                            window.execScript(match[2]);
                        } else {
                            window.eval(match[2]);
                        }
                    }
                }
                var el = document.getElementById(id);
                if (el) {
                    Ext.removeNode(el);
                }
                if (typeof callback == "function") {
                    callback();
                }
            });
            dom.innerHTML = html.replace(/(?:<script.*?>)((\n|\r|.)*?)(?:<\/script>)/ig, "");
            return this;
        },

        load: function () {
            var um = this.getUpdater();
            um.update.apply(um, arguments);
            return this;
        },

        getUpdater: function () {
            if (!this.updateManager) {
                this.updateManager = new Ext.Updater(this);
            }
            return this.updateManager;
        },

        unselectable: function () {
            this.dom.unselectable = "on";
            this.swallowEvent("selectstart", true);
            this.applyStyles("-moz-user-select:none;-khtml-user-select:none;");
            this.addClass("x-unselectable");
            return this;
        },

        getCenterXY: function () {
            return this.getAlignToXY(document, 'c-c');
        },

        center: function (centerIn) {
            this.alignTo(centerIn || document, 'c-c');
            return this;
        },

        isBorderBox: function () {
            return noBoxAdjust[this.dom.tagName.toLowerCase()] || Ext.isBorderBox;
        },

        getBox: function (contentBox, local) {
            var xy;
            if (!local) {
                xy = this.getXY();
            } else {
                var left = parseInt(this.getStyle("left"), 10) || 0;
                var top = parseInt(this.getStyle("top"), 10) || 0;
                xy = [left, top];
            }
            var el = this.dom,
                w = el.offsetWidth,
                h = el.offsetHeight,
                bx;
            if (!contentBox) {
                bx = {
                    x: xy[0],
                    y: xy[1],
                    0: xy[0],
                    1: xy[1],
                    width: w,
                    height: h
                };
            } else {
                var l = this.getBorderWidth("l") + this.getPadding("l");
                var r = this.getBorderWidth("r") + this.getPadding("r");
                var t = this.getBorderWidth("t") + this.getPadding("t");
                var b = this.getBorderWidth("b") + this.getPadding("b");
                bx = {
                    x: xy[0] + l,
                    y: xy[1] + t,
                    0: xy[0] + l,
                    1: xy[1] + t,
                    width: w - (l + r),
                    height: h - (t + b)
                };
            }
            bx.right = bx.x + bx.width;
            bx.bottom = bx.y + bx.height;
            return bx;
        },

        getFrameWidth: function (sides, onlyContentBox) {
            return onlyContentBox && Ext.isBorderBox ? 0 : (this.getPadding(sides) + this.getBorderWidth(sides));
        },

        setBox: function (box, adjust, animate) {
            var w = box.width,
                h = box.height;
            if ((adjust && !this.autoBoxAdjust) && !this.isBorderBox()) {
                w -= (this.getBorderWidth("lr") + this.getPadding("lr"));
                h -= (this.getBorderWidth("tb") + this.getPadding("tb"));
            }
            this.setBounds(box.x, box.y, w, h, this.preanim(arguments, 2));
            return this;
        },

        repaint: function () {
            var dom = this.dom;
            this.addClass("x-repaint");
            setTimeout(function () {
                Ext.get(dom).removeClass("x-repaint");
            }, 1);
            return this;
        },

        getMargins: function (side) {
            if (!side) {
                return {
                    top: parseInt(this.getStyle("margin-top"), 10) || 0,
                    left: parseInt(this.getStyle("margin-left"), 10) || 0,
                    bottom: parseInt(this.getStyle("margin-bottom"), 10) || 0,
                    right: parseInt(this.getStyle("margin-right"), 10) || 0
                };
            } else {
                return this.addStyles(side, El.margins);
            }
        },
        // private
        addStyles: function (sides, styles) {
            var val = 0,
                v, w;
            for (var i = 0, len = sides.length; i < len; i++) {
                v = this.getStyle(styles[sides.charAt(i)]);
                if (v) {
                    w = parseInt(v, 10);
                    if (w) {
                        val += (w >= 0 ? w : -1 * w);
                    }
                }
            }
            return val;
        },

        createProxy: function (config, renderTo, matchBox) {
            config = typeof config == "object" ?
                config : {
                    tag: "div",
                    cls: config
                };
            var proxy;
            if (renderTo) {
                proxy = Ext.DomHelper.append(renderTo, config, true);
            } else {
                proxy = Ext.DomHelper.insertBefore(this.dom, config, true);
            }
            if (matchBox) {
                proxy.setBox(this.getBox());
            }
            return proxy;
        },

        mask: function (msg, msgCls) {
            if (this.getStyle("position") == "static") {
                this.addClass("x-masked-relative");
            }
            if (this._maskMsg) {
                this._maskMsg.remove();
            }
            if (this._mask) {
                this._mask.remove();
            }
            this._mask = Ext.DomHelper.append(this.dom, {
                cls: "ext-el-mask"
            }, true);
            this.addClass("x-masked");
            this._mask.setDisplayed(true);
            if (typeof msg == 'string') {
                this._maskMsg = Ext.DomHelper.append(this.dom, {
                    cls: "ext-el-mask-msg",
                    cn: {
                        tag: 'div'
                    }
                }, true);
                var mm = this._maskMsg;
                mm.dom.className = msgCls ? "ext-el-mask-msg " + msgCls : "ext-el-mask-msg";
                mm.dom.firstChild.innerHTML = msg;
                mm.setDisplayed(true);
                mm.center(this);
            }
            if (Ext.isIE && !(Ext.isIE7 && Ext.isStrict) && this.getStyle('height') == 'auto') { // ie will not expand full height automatically
                this._mask.setSize(this.getWidth(), this.getHeight());
            }
            return this._mask;
        },

        unmask: function () {
            if (this._mask) {
                if (this._maskMsg) {
                    this._maskMsg.remove();
                    delete this._maskMsg;
                }
                this._mask.remove();
                delete this._mask;
            }
            this.removeClass(["x-masked", "x-masked-relative"]);
        },

        isMasked: function () {
            return this._mask && this._mask.isVisible();
        },

        createShim: function () {
            var el = document.createElement('iframe');
            el.frameBorder = '0';
            el.className = 'ext-shim';
            if (Ext.isIE && Ext.isSecure) {
                el.src = Ext.SSL_SECURE_URL;
            }
            var shim = Ext.get(this.dom.parentNode.insertBefore(el, this.dom));
            shim.autoBoxAdjust = false;
            return shim;
        },

        remove: function () {
            Ext.removeNode(this.dom);
            delete El.cache[this.dom.id];
        },

        hover: function (overFn, outFn, scope) {
            var preOverFn = function (e) {
                if (!e.within(this, true)) {
                    overFn.apply(scope || this, arguments);
                }
            };
            var preOutFn = function (e) {
                if (!e.within(this, true)) {
                    outFn.apply(scope || this, arguments);
                }
            };
            this.on("mouseover", preOverFn, this.dom);
            this.on("mouseout", preOutFn, this.dom);
            return this;
        },

        addClassOnOver: function (className) {
            this.hover(
                function () {
                    Ext.fly(this, '_internal').addClass(className);
                },
                function () {
                    Ext.fly(this, '_internal').removeClass(className);
                }
            );
            return this;
        },

        addClassOnFocus: function (className) {
            this.on("focus", function () {
                Ext.fly(this, '_internal').addClass(className);
            }, this.dom);
            this.on("blur", function () {
                Ext.fly(this, '_internal').removeClass(className);
            }, this.dom);
            return this;
        },

        addClassOnClick: function (className) {
            var dom = this.dom;
            this.on("mousedown", function () {
                Ext.fly(dom, '_internal').addClass(className);
                var d = Ext.getDoc();
                var fn = function () {
                    Ext.fly(dom, '_internal').removeClass(className);
                    d.removeListener("mouseup", fn);
                };
                d.on("mouseup", fn);
            });
            return this;
        },

        swallowEvent: function (eventName, preventDefault) {
            var fn = function (e) {
                e.stopPropagation();
                if (preventDefault) {
                    e.preventDefault();
                }
            };
            if (Ext.isArray(eventName)) {
                for (var i = 0, len = eventName.length; i < len; i++) {
                    this.on(eventName[i], fn);
                }
                return this;
            }
            this.on(eventName, fn);
            return this;
        },

        parent: function (selector, returnDom) {
            return this.matchNode('parentNode', 'parentNode', selector, returnDom);
        },

        next: function (selector, returnDom) {
            return this.matchNode('nextSibling', 'nextSibling', selector, returnDom);
        },

        prev: function (selector, returnDom) {
            return this.matchNode('previousSibling', 'previousSibling', selector, returnDom);
        },

        first: function (selector, returnDom) {
            return this.matchNode('nextSibling', 'firstChild', selector, returnDom);
        },

        last: function (selector, returnDom) {
            return this.matchNode('previousSibling', 'lastChild', selector, returnDom);
        },
        matchNode: function (dir, start, selector, returnDom) {
            var n = this.dom[start];
            while (n) {
                if (n.nodeType == 1 && (!selector || Ext.DomQuery.is(n, selector))) {
                    return !returnDom ? Ext.get(n) : n;
                }
                n = n[dir];
            }
            return null;
        },

        appendChild: function (el) {
            el = Ext.get(el);
            el.appendTo(this);
            return this;
        },

        createChild: function (config, insertBefore, returnDom) {
            config = config || {
                tag: 'div'
            };
            if (insertBefore) {
                return Ext.DomHelper.insertBefore(insertBefore, config, returnDom !== true);
            }
            return Ext.DomHelper[!this.dom.firstChild ? 'overwrite' : 'append'](this.dom, config, returnDom !== true);
        },

        appendTo: function (el) {
            el = Ext.getDom(el);
            el.appendChild(this.dom);
            return this;
        },

        insertBefore: function (el) {
            el = Ext.getDom(el);
            el.parentNode.insertBefore(this.dom, el);
            return this;
        },

        insertAfter: function (el) {
            el = Ext.getDom(el);
            el.parentNode.insertBefore(this.dom, el.nextSibling);
            return this;
        },

        insertFirst: function (el, returnDom) {
            el = el || {};
            if (el.nodeType || el.dom) { // dh config
                el = Ext.getDom(el);
                this.dom.insertBefore(el, this.dom.firstChild);
                return !returnDom ? Ext.get(el) : el;
            } else {
                return this.createChild(el, this.dom.firstChild, returnDom);
            }
        },

        insertSibling: function (el, where, returnDom) {
            var rt;
            if (Ext.isArray(el)) {
                for (var i = 0, len = el.length; i < len; i++) {
                    rt = this.insertSibling(el[i], where, returnDom);
                }
                return rt;
            }
            where = where ? where.toLowerCase() : 'before';
            el = el || {};
            var refNode = where == 'before' ? this.dom : this.dom.nextSibling;
            if (el.nodeType || el.dom) { // dh config
                rt = this.dom.parentNode.insertBefore(Ext.getDom(el), refNode);
                if (!returnDom) {
                    rt = Ext.get(rt);
                }
            } else {
                if (where == 'after' && !this.dom.nextSibling) {
                    rt = Ext.DomHelper.append(this.dom.parentNode, el, !returnDom);
                } else {
                    rt = Ext.DomHelper[where == 'after' ? 'insertAfter' : 'insertBefore'](this.dom, el, !returnDom);
                }
            }
            return rt;
        },

        wrap: function (config, returnDom) {
            if (!config) {
                config = {
                    tag: "div"
                };
            }
            var newEl = Ext.DomHelper.insertBefore(this.dom, config, !returnDom);
            newEl.dom ? newEl.dom.appendChild(this.dom) : newEl.appendChild(this.dom);
            return newEl;
        },

        replace: function (el) {
            el = Ext.get(el);
            this.insertBefore(el);
            el.remove();
            return this;
        },

        replaceWith: function (el) {
            if (el.nodeType || el.dom) { // dh config
                el = Ext.getDom(el);
                this.dom.parentNode.insertBefore(el, this.dom);
            } else {
                el = this.insertSibling(el, 'before');
            }
            El.uncache(this.id);
            Ext.removeNode(this.dom);
            this.dom = el;
            this.id = Ext.id(el);
            El.cache[this.id] = this;
            return this;
        },

        insertHtml: function (where, html, returnEl) {
            var el = Ext.DomHelper.insertHtml(where, this.dom, html);
            return returnEl ? Ext.get(el) : el;
        },

        set: function (o, useSet) {
            var el = this.dom;
            useSet = typeof useSet == 'undefined' ? (el.setAttribute ? true : false) : useSet;
            for (var attr in o) {
                if (attr == "style" || typeof o[attr] == "function") continue;
                if (attr == "cls") {
                    el.className = o["cls"];
                } else if (o.hasOwnProperty(attr)) {
                    if (useSet) el.setAttribute(attr, o[attr]);
                    else el[attr] = o[attr];
                }
            }
            if (o.style) {
                Ext.DomHelper.applyStyles(el, o.style);
            }
            return this;
        },

        addKeyListener: function (key, fn, scope) {
            var config;
            if (typeof key != "object" || Ext.isArray(key)) {
                config = {
                    key: key,
                    fn: fn,
                    scope: scope
                };
            } else {
                config = {
                    key: key.key,
                    shift: key.shift,
                    ctrl: key.ctrl,
                    alt: key.alt,
                    fn: fn,
                    scope: scope
                };
            }
            return new Ext.KeyMap(this, config);
        },

        addKeyMap: function (config) {
            return new Ext.KeyMap(this, config);
        },

        isScrollable: function () {
            var dom = this.dom;
            return dom.scrollHeight > dom.clientHeight || dom.scrollWidth > dom.clientWidth;
        },

        scrollTo: function (side, value, animate) {
            var prop = side.toLowerCase() == "left" ? "scrollLeft" : "scrollTop";
            if (!animate || !A) {
                this.dom[prop] = value;
            } else {
                var to = prop == "scrollLeft" ? [value, this.dom.scrollTop] : [this.dom.scrollLeft, value];
                this.anim({
                    scroll: {
                        "to": to
                    }
                }, this.preanim(arguments, 2), 'scroll');
            }
            return this;
        },

        scroll: function (direction, distance, animate) {
            if (!this.isScrollable()) {
                return;
            }
            var el = this.dom;
            var l = el.scrollLeft,
                t = el.scrollTop;
            var w = el.scrollWidth,
                h = el.scrollHeight;
            var cw = el.clientWidth,
                ch = el.clientHeight;
            direction = direction.toLowerCase();
            var scrolled = false;
            var a = this.preanim(arguments, 2);
            switch (direction) {
            case "l":
            case "left":
                if (w - l > cw) {
                    var v = Math.min(l + distance, w - cw);
                    this.scrollTo("left", v, a);
                    scrolled = true;
                }
                break;
            case "r":
            case "right":
                if (l > 0) {
                    var v = Math.max(l - distance, 0);
                    this.scrollTo("left", v, a);
                    scrolled = true;
                }
                break;
            case "t":
            case "top":
            case "up":
                if (t > 0) {
                    var v = Math.max(t - distance, 0);
                    this.scrollTo("top", v, a);
                    scrolled = true;
                }
                break;
            case "b":
            case "bottom":
            case "down":
                if (h - t > ch) {
                    var v = Math.min(t + distance, h - ch);
                    this.scrollTo("top", v, a);
                    scrolled = true;
                }
                break;
            }
            return scrolled;
        },

        translatePoints: function (x, y) {
            if (typeof x == 'object' || Ext.isArray(x)) {
                y = x[1];
                x = x[0];
            }
            var p = this.getStyle('position');
            var o = this.getXY();
            var l = parseInt(this.getStyle('left'), 10);
            var t = parseInt(this.getStyle('top'), 10);
            if (isNaN(l)) {
                l = (p == "relative") ? 0 : this.dom.offsetLeft;
            }
            if (isNaN(t)) {
                t = (p == "relative") ? 0 : this.dom.offsetTop;
            }
            return {
                left: (x - o[0] + l),
                top: (y - o[1] + t)
            };
        },

        getScroll: function () {
            var d = this.dom,
                doc = document;
            if (d == doc || d == doc.body) {
                var l, t;
                if (Ext.isIE && Ext.isStrict) {
                    l = doc.documentElement.scrollLeft || (doc.body.scrollLeft || 0);
                    t = doc.documentElement.scrollTop || (doc.body.scrollTop || 0);
                } else {
                    l = window.pageXOffset || (doc.body.scrollLeft || 0);
                    t = window.pageYOffset || (doc.body.scrollTop || 0);
                }
                return {
                    left: l,
                    top: t
                };
            } else {
                return {
                    left: d.scrollLeft,
                    top: d.scrollTop
                };
            }
        },

        getColor: function (attr, defaultValue, prefix) {
            var v = this.getStyle(attr);
            if (!v || v == "transparent" || v == "inherit") {
                return defaultValue;
            }
            var color = typeof prefix == "undefined" ? "#" : prefix;
            if (v.substr(0, 4) == "rgb(") {
                var rvs = v.slice(4, v.length - 1).split(",");
                for (var i = 0; i < 3; i++) {
                    var h = parseInt(rvs[i]);
                    var s = h.toString(16);
                    if (h < 16) {
                        s = "0" + s;
                    }
                    color += s;
                }
            } else {
                if (v.substr(0, 1) == "#") {
                    if (v.length == 4) {
                        for (var i = 1; i < 4; i++) {
                            var c = v.charAt(i);
                            color += c + c;
                        }
                    } else if (v.length == 7) {
                        color += v.substr(1);
                    }
                }
            }
            return (color.length > 5 ? color.toLowerCase() : defaultValue);
        },

        boxWrap: function (cls) {
            cls = cls || 'x-box';
            var el = Ext.get(this.insertHtml('beforeBegin', String.format('<div class="{0}">' + El.boxMarkup + '</div>', cls)));
            el.child('.' + cls + '-mc').dom.appendChild(this.dom);
            return el;
        },

        getAttributeNS: Ext.isIE ? function (ns, name) {
            var d = this.dom;
            var type = 'undefined';
            try {
                type = typeof d[ns + ":" + name];
            } catch (e) {}
            if (type != 'undefined' && type != 'unknown') {
                return d[ns + ":" + name];
            }
            return d[name];
        } : function (ns, name) {
            var d = this.dom;
            return d.getAttributeNS(ns, name) || d.getAttribute(ns + ":" + name) || d.getAttribute(name) || d[name];
        },

        getTextWidth: function (text, min, max) {
            return (Ext.util.TextMetrics.measure(this.dom, Ext.value(text, this.dom.innerHTML, true)).width).constrain(min || 0, max || 1000000);
        }
    };
    var ep = El.prototype;
    ep.on = ep.addListener;
    // backwards compat
    ep.mon = ep.addListener;
    ep.getUpdateManager = ep.getUpdater;
    ep.un = ep.removeListener;
    ep.autoBoxAdjust = true;
    // private
    El.unitPattern = /\d+(px|em|%|en|ex|pt|in|cm|mm|pc)$/i;
    // private
    El.addUnits = function (v, defaultUnit) {
        if (v === "" || v == "auto") {
            return v;
        }
        if (v === undefined) {
            return '';
        }
        if (typeof v == "number" || !El.unitPattern.test(v)) {
            return v + (defaultUnit || 'px');
        }
        return v;
    };
    // special markup used throughout Ext when box wrapping elements
    El.boxMarkup = '<div class="{0}-tl"><div class="{0}-tr"><div class="{0}-tc"></div></div></div><div class="{0}-ml"><div class="{0}-mr"><div class="{0}-mc"></div></div></div><div class="{0}-bl"><div class="{0}-br"><div class="{0}-bc"></div></div></div>';
    El.VISIBILITY = 1;
    El.DISPLAY = 2;
    El.borders = {
        l: "border-left-width",
        r: "border-right-width",
        t: "border-top-width",
        b: "border-bottom-width"
    };
    El.paddings = {
        l: "padding-left",
        r: "padding-right",
        t: "padding-top",
        b: "padding-bottom"
    };
    El.margins = {
        l: "margin-left",
        r: "margin-right",
        t: "margin-top",
        b: "margin-bottom"
    };
    El.cache = {};
    var docEl;
    El.get = function (el) {
        var ex, elm, id;
        if (!el) {
            return null;
        }
        if (typeof el == "string") { // element id
            if (!(elm = document.getElementById(el))) {
                return null;
            }
            if (ex = El.cache[el]) {
                ex.dom = elm;
            } else {
                ex = El.cache[el] = new El(elm);
            }
            return ex;
        } else if (el.tagName) { // dom element
            if (!(id = el.id)) {
                id = Ext.id(el);
            }
            if (ex = El.cache[id]) {
                ex.dom = el;
            } else {
                ex = El.cache[id] = new El(el);
            }
            return ex;
        } else if (el instanceof El) {
            if (el != docEl) {
                el.dom = document.getElementById(el.id) || el.dom; // refresh dom element in case no longer valid,
                // catch case where it hasn't been appended
                El.cache[el.id] = el; // in case it was created directly with Element(), let's cache it
            }
            return el;
        } else if (el.isComposite) {
            return el;
        } else if (Ext.isArray(el)) {
            return El.select(el);
        } else if (el == document) {
            // create a bogus element object representing the document object
            if (!docEl) {
                var f = function () {};
                f.prototype = El.prototype;
                docEl = new f();
                docEl.dom = document;
            }
            return docEl;
        }
        return null;
    };
    // private
    El.uncache = function (el) {
        for (var i = 0, a = arguments, len = a.length; i < len; i++) {
            if (a[i]) {
                delete El.cache[a[i].id || a[i]];
            }
        }
    };
    // private
    // Garbage collection - uncache elements/purge listeners on orphaned elements
    // so we don't hold a reference and cause the browser to retain them
    El.garbageCollect = function () {
        if (!Ext.enableGarbageCollector) {
            clearInterval(El.collectorThread);
            return;
        }
        for (var eid in El.cache) {
            var el = El.cache[eid],
                d = el.dom;
            // -------------------------------------------------------
            // Determining what is garbage:
            // -------------------------------------------------------
            // !d
            // dom node is null, definitely garbage
            // -------------------------------------------------------
            // !d.parentNode
            // no parentNode == direct orphan, definitely garbage
            // -------------------------------------------------------
            // !d.offsetParent && !document.getElementById(eid)
            // display none elements have no offsetParent so we will
            // also try to look it up by it's id. However, check
            // offsetParent first so we don't do unneeded lookups.
            // This enables collection of elements that are not orphans
            // directly, but somewhere up the line they have an orphan
            // parent.
            // -------------------------------------------------------
            if (!d || !d.parentNode || (!d.offsetParent && !document.getElementById(eid))) {
                delete El.cache[eid];
                if (d && Ext.enableListenerCollection) {
                    Ext.EventManager.removeAll(d);
                }
            }
        }
    }
    El.collectorThreadId = setInterval(El.garbageCollect, 30000);
    var flyFn = function () {};
    flyFn.prototype = El.prototype;
    var _cls = new flyFn();
    // dom is optional
    El.Flyweight = function (dom) {
        this.dom = dom;
    };
    El.Flyweight.prototype = _cls;
    El.Flyweight.prototype.isFlyweight = true;
    El._flyweights = {};
    El.fly = function (el, named) {
        named = named || '_global';
        el = Ext.getDom(el);
        if (!el) {
            return null;
        }
        if (!El._flyweights[named]) {
            El._flyweights[named] = new El.Flyweight();
        }
        El._flyweights[named].dom = el;
        return El._flyweights[named];
    };
    Ext.get = El.get;
    Ext.fly = El.fly;
    // speedy lookup for elements never to box adjust
    var noBoxAdjust = Ext.isStrict ? {
        select: 1
    } : {
        input: 1,
        select: 1,
        textarea: 1
    };
    if (Ext.isIE || Ext.isGecko) {
        noBoxAdjust['button'] = 1;
    }
    Ext.EventManager.on(window, 'unload', function () {
        delete El.cache;
        delete El._flyweights;
    });
})();
//workaround für Permission denied to access property 'dom' from non-chrome context
//siehe http://www.extjs.com/forum/showthread.php?t=74765
//fixed in Ext 3
Ext.Element.prototype.contains = function (el) {
    try {
        return !el ? false : Ext.lib.Dom.isAncestor(this.dom, el.dom ? el.dom : el);
    } catch (e) {
        return false;
    }
};
Ext.DomQuery = function () {
    var cache = {},
        simpleCache = {},
        valueCache = {};
    var nonSpace = /\S/;
    var trimRe = /^\s+|\s+$/g;
    var tplRe = /\{(\d+)\}/g;
    var modeRe = /^(\s?[\/>+~]\s?|\s|$)/;
    var tagTokenRe = /^(#)?([\w-\*]+)/;
    var nthRe = /(\d*)n\+?(\d*)/,
        nthRe2 = /\D/;
    var opera = Ext.isOpera;

    function child(p, index) {
        var i = 0;
        var n = p.firstChild;
        while (n) {
            if (n.nodeType == 1) {
                if (++i == index) {
                    return n;
                }
            }
            n = n.nextSibling;
        }
        return null;
    };

    function next(n) {
        while ((n = n.nextSibling) && n.nodeType != 1);
        return n;
    };

    function prev(n) {
        while ((n = n.previousSibling) && n.nodeType != 1);
        return n;
    };

    function children(d) {
        var n = d.firstChild,
            ni = -1;
        while (n) {
            var nx = n.nextSibling;
            if (n.nodeType == 3 && !nonSpace.test(n.nodeValue)) {
                d.removeChild(n);
            } else {
                n.nodeIndex = ++ni;
            }
            n = nx;
        }
        return this;
    };

    function byClassName(c, a, v) {
        if (!v) {
            return c;
        }
        var r = [],
            ri = -1,
            cn;
        for (var i = 0, ci; ci = c[i]; i++) {
            if ((' ' + ci.className + ' ').indexOf(v) != -1) {
                r[++ri] = ci;
            }
        }
        return r;
    };

    function attrValue(n, attr) {
        if (!n.tagName && typeof n.length != "undefined") {
            n = n[0];
        }
        if (!n) {
            return null;
        }
        if (attr == "for") {
            return n.htmlFor;
        }
        if (attr == "class" || attr == "className") {
            return n.className;
        }
        return n.getAttribute(attr) || n[attr];
    };

    function getNodes(ns, mode, tagName) {
        var result = [],
            ri = -1,
            cs;
        if (!ns) {
            return result;
        }
        tagName = tagName || "*";
        if (typeof ns.getElementsByTagName != "undefined") {
            ns = [ns];
        }
        if (!mode) {
            for (var i = 0, ni; ni = ns[i]; i++) {
                cs = ni.getElementsByTagName(tagName);
                for (var j = 0, ci; ci = cs[j]; j++) {
                    result[++ri] = ci;
                }
            }
        } else if (mode == "/" || mode == ">") {
            var utag = tagName.toUpperCase();
            for (var i = 0, ni, cn; ni = ns[i]; i++) {
                cn = opera ? ni.childNodes : (ni.children || ni.childNodes);
                for (var j = 0, cj; cj = cn[j]; j++) {
                    if (cj.nodeName == utag || cj.nodeName == tagName || tagName == '*') {
                        result[++ri] = cj;
                    }
                }
            }
        } else if (mode == "+") {
            var utag = tagName.toUpperCase();
            for (var i = 0, n; n = ns[i]; i++) {
                while ((n = n.nextSibling) && n.nodeType != 1);
                if (n && (n.nodeName == utag || n.nodeName == tagName || tagName == '*')) {
                    result[++ri] = n;
                }
            }
        } else if (mode == "~") {
            var utag = tagName.toUpperCase();
            for (var i = 0, n; n = ns[i]; i++) {
                while ((n = n.nextSibling)) {
                    if (n.nodeName == utag || n.nodeName == tagName || tagName == '*') {
                        result[++ri] = n;
                    }
                }
            }
        }
        return result;
    };

    function concat(a, b) {
        if (b.slice) {
            return a.concat(b);
        }
        for (var i = 0, l = b.length; i < l; i++) {
            a[a.length] = b[i];
        }
        return a;
    }

    function byTag(cs, tagName) {
        if (cs.tagName || cs == document) {
            cs = [cs];
        }
        if (!tagName) {
            return cs;
        }
        var r = [],
            ri = -1;
        tagName = tagName.toLowerCase();
        for (var i = 0, ci; ci = cs[i]; i++) {
            if (ci.nodeType == 1 && ci.tagName.toLowerCase() == tagName) {
                r[++ri] = ci;
            }
        }
        return r;
    };

    function byId(cs, attr, id) {
        if (cs.tagName || cs == document) {
            cs = [cs];
        }
        if (!id) {
            return cs;
        }
        var r = [],
            ri = -1;
        for (var i = 0, ci; ci = cs[i]; i++) {
            if (ci && ci.id == id) {
                r[++ri] = ci;
                return r;
            }
        }
        return r;
    };

    function byAttribute(cs, attr, value, op, custom) {
        var r = [],
            ri = -1,
            st = custom == "{";
        var f = Ext.DomQuery.operators[op];
        for (var i = 0, ci; ci = cs[i]; i++) {
            if (ci.nodeType != 1) {
                continue;
            }
            var a;
            if (st) {
                a = Ext.DomQuery.getStyle(ci, attr);
            } else if (attr == "class" || attr == "className") {
                a = ci.className;
            } else if (attr == "for") {
                a = ci.htmlFor;
            } else if (attr == "href") {
                a = ci.getAttribute("href", 2);
            } else {
                a = ci.getAttribute(attr);
            }
            if ((f && f(a, value)) || (!f && a)) {
                r[++ri] = ci;
            }
        }
        return r;
    };

    function byPseudo(cs, name, value) {
        return Ext.DomQuery.pseudos[name](cs, value);
    };
    // This is for IE MSXML which does not support expandos.
    // IE runs the same speed using setAttribute, however FF slows way down
    // and Safari completely fails so they need to continue to use expandos.
    var isIE = window.ActiveXObject ? true : false;
    // this eval is stop the compressor from
    // renaming the variable to something shorter
    eval("var batch = 30803;");
    var key = 30803;

    function nodupIEXml(cs) {
        var d = ++key;
        cs[0].setAttribute("_nodup", d);
        var r = [cs[0]];
        for (var i = 1, len = cs.length; i < len; i++) {
            var c = cs[i];
            if (!c.getAttribute("_nodup") != d) {
                c.setAttribute("_nodup", d);
                r[r.length] = c;
            }
        }
        for (var i = 0, len = cs.length; i < len; i++) {
            cs[i].removeAttribute("_nodup");
        }
        return r;
    }

    function nodup(cs) {
        if (!cs) {
            return [];
        }
        var len = cs.length,
            c, i, r = cs,
            cj, ri = -1;
        if (!len || typeof cs.nodeType != "undefined" || len == 1) {
            return cs;
        }
        if (isIE && typeof cs[0].selectSingleNode != "undefined") {
            return nodupIEXml(cs);
        }
        var d = ++key;
        cs[0]._nodup = d;
        for (i = 1; c = cs[i]; i++) {
            if (c._nodup != d) {
                c._nodup = d;
            } else {
                r = [];
                for (var j = 0; j < i; j++) {
                    r[++ri] = cs[j];
                }
                for (j = i + 1; cj = cs[j]; j++) {
                    if (cj._nodup != d) {
                        cj._nodup = d;
                        r[++ri] = cj;
                    }
                }
                return r;
            }
        }
        return r;
    }

    function quickDiffIEXml(c1, c2) {
        var d = ++key;
        for (var i = 0, len = c1.length; i < len; i++) {
            c1[i].setAttribute("_qdiff", d);
        }
        var r = [];
        for (var i = 0, len = c2.length; i < len; i++) {
            if (c2[i].getAttribute("_qdiff") != d) {
                r[r.length] = c2[i];
            }
        }
        for (var i = 0, len = c1.length; i < len; i++) {
            c1[i].removeAttribute("_qdiff");
        }
        return r;
    }

    function quickDiff(c1, c2) {
        var len1 = c1.length;
        if (!len1) {
            return c2;
        }
        if (isIE && c1[0].selectSingleNode) {
            return quickDiffIEXml(c1, c2);
        }
        var d = ++key;
        for (var i = 0; i < len1; i++) {
            c1[i]._qdiff = d;
        }
        var r = [];
        for (var i = 0, len = c2.length; i < len; i++) {
            if (c2[i]._qdiff != d) {
                r[r.length] = c2[i];
            }
        }
        return r;
    }

    function quickId(ns, mode, root, id) {
        if (ns == root) {
            var d = root.ownerDocument || root;
            return d.getElementById(id);
        }
        ns = getNodes(ns, mode, "*");
        return byId(ns, null, id);
    }
    return {
        getStyle: function (el, name) {
            return Ext.fly(el).getStyle(name);
        },

        compile: function (path, type) {
            type = type || "select";
            var fn = ["var f = function(root){\n var mode; ++batch; var n = root || document;\n"];
            var q = path,
                mode, lq;
            var tk = Ext.DomQuery.matchers;
            var tklen = tk.length;
            var mm;
            // accept leading mode switch
            var lmode = q.match(modeRe);
            if (lmode && lmode[1]) {
                fn[fn.length] = 'mode="' + lmode[1].replace(trimRe, "") + '";';
                q = q.replace(lmode[1], "");
            }
            // strip leading slashes
            while (path.substr(0, 1) == "/") {
                path = path.substr(1);
            }
            while (q && lq != q) {
                lq = q;
                var tm = q.match(tagTokenRe);
                if (type == "select") {
                    if (tm) {
                        if (tm[1] == "#") {
                            fn[fn.length] = 'n = quickId(n, mode, root, "' + tm[2] + '");';
                        } else {
                            fn[fn.length] = 'n = getNodes(n, mode, "' + tm[2] + '");';
                        }
                        q = q.replace(tm[0], "");
                    } else if (q.substr(0, 1) != '@') {
                        fn[fn.length] = 'n = getNodes(n, mode, "*");';
                    }
                } else {
                    if (tm) {
                        if (tm[1] == "#") {
                            fn[fn.length] = 'n = byId(n, null, "' + tm[2] + '");';
                        } else {
                            fn[fn.length] = 'n = byTag(n, "' + tm[2] + '");';
                        }
                        q = q.replace(tm[0], "");
                    }
                }
                while (!(mm = q.match(modeRe))) {
                    var matched = false;
                    for (var j = 0; j < tklen; j++) {
                        var t = tk[j];
                        var m = q.match(t.re);
                        if (m) {
                            fn[fn.length] = t.select.replace(tplRe, function (x, i) {
                                return m[i];
                            });
                            q = q.replace(m[0], "");
                            matched = true;
                            break;
                        }
                    }
                    // prevent infinite loop on bad selector
                    if (!matched) {
                        throw 'Error parsing selector, parsing failed at "' + q + '"';
                    }
                }
                if (mm[1]) {
                    fn[fn.length] = 'mode="' + mm[1].replace(trimRe, "") + '";';
                    q = q.replace(mm[1], "");
                }
            }
            fn[fn.length] = "return nodup(n);\n}";
            eval(fn.join(""));
            return f;
        },

        select: function (path, root, type) {
            if (!root || root == document) {
                root = document;
            }
            if (typeof root == "string") {
                root = document.getElementById(root);
            }
            var paths = path.split(",");
            var results = [];
            for (var i = 0, len = paths.length; i < len; i++) {
                var p = paths[i].replace(trimRe, "");
                if (!cache[p]) {
                    cache[p] = Ext.DomQuery.compile(p);
                    if (!cache[p]) {
                        throw p + " is not a valid selector";
                    }
                }
                var result = cache[p](root);
                if (result && result != document) {
                    results = results.concat(result);
                }
            }
            if (paths.length > 1) {
                return nodup(results);
            }
            return results;
        },

        selectNode: function (path, root) {
            return Ext.DomQuery.select(path, root)[0];
        },

        selectValue: function (path, root, defaultValue) {
            path = path.replace(trimRe, "");
            if (!valueCache[path]) {
                valueCache[path] = Ext.DomQuery.compile(path, "select");
            }
            var n = valueCache[path](root);
            n = n[0] ? n[0] : n;
            var v = (n && n.firstChild ? n.firstChild.nodeValue : null);
            return ((v === null || v === undefined || v === '') ? defaultValue : v);
        },

        selectNumber: function (path, root, defaultValue) {
            var v = Ext.DomQuery.selectValue(path, root, defaultValue || 0);
            return parseFloat(v);
        },

        is: function (el, ss) {
            if (typeof el == "string") {
                el = document.getElementById(el);
            }
            var isArray = Ext.isArray(el);
            var result = Ext.DomQuery.filter(isArray ? el : [el], ss);
            return isArray ? (result.length == el.length) : (result.length > 0);
        },

        filter: function (els, ss, nonMatches) {
            ss = ss.replace(trimRe, "");
            if (!simpleCache[ss]) {
                simpleCache[ss] = Ext.DomQuery.compile(ss, "simple");
            }
            var result = simpleCache[ss](els);
            return nonMatches ? quickDiff(result, els) : result;
        },

        matchers: [{
            re: /^\.([\w-]+)/,
            select: 'n = byClassName(n, null, " {1} ");'
        }, {
            re: /^\:([\w-]+)(?:\(((?:[^\s>\/]*|.*?))\))?/,
            select: 'n = byPseudo(n, "{1}", "{2}");'
        }, {
            re: /^(?:([\[\{])(?:@)?([\w-]+)\s?(?:(=|.=)\s?['"]?(.*?)["']?)?[\]\}])/,
            select: 'n = byAttribute(n, "{2}", "{4}", "{3}", "{1}");'
        }, {
            re: /^#([\w-]+)/,
            select: 'n = byId(n, null, "{1}");'
        }, {
            re: /^@([\w-]+)/,
            select: 'return {firstChild:{nodeValue:attrValue(n, "{1}")}};'
        }],

        operators: {
            "=": function (a, v) {
                return a == v;
            },
            "!=": function (a, v) {
                return a != v;
            },
            "^=": function (a, v) {
                return a && a.substr(0, v.length) == v;
            },
            "$=": function (a, v) {
                return a && a.substr(a.length - v.length) == v;
            },
            "*=": function (a, v) {
                return a && a.indexOf(v) !== -1;
            },
            "%=": function (a, v) {
                return (a % v) == 0;
            },
            "|=": function (a, v) {
                return a && (a == v || a.substr(0, v.length + 1) == v + '-');
            },
            "~=": function (a, v) {
                return a && (' ' + a + ' ').indexOf(' ' + v + ' ') != -1;
            }
        },

        pseudos: {
            "first-child": function (c) {
                var r = [],
                    ri = -1,
                    n;
                for (var i = 0, ci; ci = n = c[i]; i++) {
                    while ((n = n.previousSibling) && n.nodeType != 1);
                    if (!n) {
                        r[++ri] = ci;
                    }
                }
                return r;
            },
            "last-child": function (c) {
                var r = [],
                    ri = -1,
                    n;
                for (var i = 0, ci; ci = n = c[i]; i++) {
                    while ((n = n.nextSibling) && n.nodeType != 1);
                    if (!n) {
                        r[++ri] = ci;
                    }
                }
                return r;
            },
            "nth-child": function (c, a) {
                var r = [],
                    ri = -1;
                var m = nthRe.exec(a == "even" && "2n" || a == "odd" && "2n+1" || !nthRe2.test(a) && "n+" + a || a);
                var f = (m[1] || 1) - 0,
                    l = m[2] - 0;
                for (var i = 0, n; n = c[i]; i++) {
                    var pn = n.parentNode;
                    if (batch != pn._batch) {
                        var j = 0;
                        for (var cn = pn.firstChild; cn; cn = cn.nextSibling) {
                            if (cn.nodeType == 1) {
                                cn.nodeIndex = ++j;
                            }
                        }
                        pn._batch = batch;
                    }
                    if (f == 1) {
                        if (l == 0 || n.nodeIndex == l) {
                            r[++ri] = n;
                        }
                    } else if ((n.nodeIndex + l) % f == 0) {
                        r[++ri] = n;
                    }
                }
                return r;
            },
            "only-child": function (c) {
                var r = [],
                    ri = -1;;
                for (var i = 0, ci; ci = c[i]; i++) {
                    if (!prev(ci) && !next(ci)) {
                        r[++ri] = ci;
                    }
                }
                return r;
            },
            "empty": function (c) {
                var r = [],
                    ri = -1;
                for (var i = 0, ci; ci = c[i]; i++) {
                    var cns = ci.childNodes,
                        j = 0,
                        cn, empty = true;
                    while (cn = cns[j]) {
                        ++j;
                        if (cn.nodeType == 1 || cn.nodeType == 3) {
                            empty = false;
                            break;
                        }
                    }
                    if (empty) {
                        r[++ri] = ci;
                    }
                }
                return r;
            },
            "contains": function (c, v) {
                var r = [],
                    ri = -1;
                for (var i = 0, ci; ci = c[i]; i++) {
                    if ((ci.textContent || ci.innerText || '').indexOf(v) != -1) {
                        r[++ri] = ci;
                    }
                }
                return r;
            },
            "nodeValue": function (c, v) {
                var r = [],
                    ri = -1;
                for (var i = 0, ci; ci = c[i]; i++) {
                    if (ci.firstChild && ci.firstChild.nodeValue == v) {
                        r[++ri] = ci;
                    }
                }
                return r;
            },
            "checked": function (c) {
                var r = [],
                    ri = -1;
                for (var i = 0, ci; ci = c[i]; i++) {
                    if (ci.checked == true) {
                        r[++ri] = ci;
                    }
                }
                return r;
            },
            "not": function (c, ss) {
                return Ext.DomQuery.filter(c, ss, true);
            },
            "any": function (c, selectors) {
                var ss = selectors.split('|');
                var r = [],
                    ri = -1,
                    s;
                for (var i = 0, ci; ci = c[i]; i++) {
                    for (var j = 0; s = ss[j]; j++) {
                        if (Ext.DomQuery.is(ci, s)) {
                            r[++ri] = ci;
                            break;
                        }
                    }
                }
                return r;
            },
            "odd": function (c) {
                return this["nth-child"](c, "odd");
            },
            "even": function (c) {
                return this["nth-child"](c, "even");
            },
            "nth": function (c, a) {
                return c[a - 1] || [];
            },
            "first": function (c) {
                return c[0] || [];
            },
            "last": function (c) {
                return c[c.length - 1] || [];
            },
            "has": function (c, ss) {
                var s = Ext.DomQuery.select;
                var r = [],
                    ri = -1;
                for (var i = 0, ci; ci = c[i]; i++) {
                    if (s(ss, ci).length > 0) {
                        r[++ri] = ci;
                    }
                }
                return r;
            },
            "next": function (c, ss) {
                var is = Ext.DomQuery.is;
                var r = [],
                    ri = -1;
                for (var i = 0, ci; ci = c[i]; i++) {
                    var n = next(ci);
                    if (n && is(n, ss)) {
                        r[++ri] = ci;
                    }
                }
                return r;
            },
            "prev": function (c, ss) {
                var is = Ext.DomQuery.is;
                var r = [],
                    ri = -1;
                for (var i = 0, ci; ci = c[i]; i++) {
                    var n = prev(ci);
                    if (n && is(n, ss)) {
                        r[++ri] = ci;
                    }
                }
                return r;
            }
        }
    };
}();
Ext.query = Ext.DomQuery.select;
Vps.onContentReady(function () {
    var atDecoding = '(vpsat)';
    var dotDecoding = '(vpsdot)';
    var els = Ext.query('a');
    els.forEach(function (el) {
        if (el.href && el.href.match(/^mailto:/)) {
            el.href = el.href.replace(atDecoding, '@');
            el.href = el.href.replace(dotDecoding, '.');
        }
    });
    var els = Ext.query('span.vpsEncodedMail');
    els.forEach(function (el) {
        var txt = el.innerHTML;
        txt = txt.replace(atDecoding, '@');
        el.innerHTML = txt.replace(dotDecoding, '.');
    });
});
Vps.onContentReady(function () {
    Vps.Basic.LinkTag.Extern.processLinks();
});
Vps.Basic.LinkTag.Extern.processLinks = function (root) {
    // links holen und durchgehen
    var lnks = Ext.query('a', root || document);
    Ext.each(lnks, function (lnk) {
        // rels von link durchgehen
        lnk = Ext.get(lnk);
        if (lnk.hasClass('webLinkPopup')) return; // nur einmal machen
        var rels = lnk.dom.rel.split(' ');
        Ext.each(rels, function (rel) {
            if (rel.match(/^popup/)) {
                var relProperties = rel.split('_');
                lnk.addClass('webLinkPopup');
                lnk.on('click', function (e) {
                    e.stopEvent();
                    if (relProperties[1] == 'blank') {
                        window.open(lnk.dom.href, '_blank');
                    } else {
                        window.open(lnk.dom.href, '_blank', relProperties[1]);
                    }
                });
            }
        });
    });
};
Ext.DomHelper = function () {
    var tempTableEl = null;
    var emptyTags = /^(?:br|frame|hr|img|input|link|meta|range|spacer|wbr|area|param|col)$/i;
    var tableRe = /^table|tbody|tr|td$/i;
    // build as innerHTML where available
    var createHtml = function (o) {
        if (typeof o == 'string') {
            return o;
        }
        var b = "";
        if (Ext.isArray(o)) {
            for (var i = 0, l = o.length; i < l; i++) {
                b += createHtml(o[i]);
            }
            return b;
        }
        if (!o.tag) {
            o.tag = "div";
        }
        b += "<" + o.tag;
        for (var attr in o) {
            if (attr == "tag" || attr == "children" || attr == "cn" || attr == "html" || typeof o[attr] == "function") continue;
            if (attr == "style") {
                var s = o["style"];
                if (typeof s == "function") {
                    s = s.call();
                }
                if (typeof s == "string") {
                    b += ' style="' + s + '"';
                } else if (typeof s == "object") {
                    b += ' style="';
                    for (var key in s) {
                        if (typeof s[key] != "function") {
                            b += key + ":" + s[key] + ";";
                        }
                    }
                    b += '"';
                }
            } else {
                if (attr == "cls") {
                    b += ' class="' + o["cls"] + '"';
                } else if (attr == "htmlFor") {
                    b += ' for="' + o["htmlFor"] + '"';
                } else {
                    b += " " + attr + '="' + o[attr] + '"';
                }
            }
        }
        if (emptyTags.test(o.tag)) {
            b += "/>";
        } else {
            b += ">";
            var cn = o.children || o.cn;
            if (cn) {
                b += createHtml(cn);
            } else if (o.html) {
                b += o.html;
            }
            b += "</" + o.tag + ">";
        }
        return b;
    };
    // build as dom

    var createDom = function (o, parentNode) {
        var el;
        if (Ext.isArray(o)) { // Allow Arrays of siblings to be inserted
            el = document.createDocumentFragment(); // in one shot using a DocumentFragment
            for (var i = 0, l = o.length; i < l; i++) {
                createDom(o[i], el);
            }
        } else if (typeof o == "string") { // Allow a string as a child spec.
            el = document.createTextNode(o);
        } else {
            el = document.createElement(o.tag || 'div');
            var useSet = !!el.setAttribute; // In IE some elements don't have setAttribute
            for (var attr in o) {
                if (attr == "tag" || attr == "children" || attr == "cn" || attr == "html" || attr == "style" || typeof o[attr] == "function") continue;
                if (attr == "cls") {
                    el.className = o["cls"];
                } else {
                    if (useSet) el.setAttribute(attr, o[attr]);
                    else el[attr] = o[attr];
                }
            }
            Ext.DomHelper.applyStyles(el, o.style);
            var cn = o.children || o.cn;
            if (cn) {
                createDom(cn, el);
            } else if (o.html) {
                el.innerHTML = o.html;
            }
        }
        if (parentNode) {
            parentNode.appendChild(el);
        }
        return el;
    };
    var ieTable = function (depth, s, h, e) {
        tempTableEl.innerHTML = [s, h, e].join('');
        var i = -1,
            el = tempTableEl;
        while (++i < depth) {
            el = el.firstChild;
        }
        return el;
    };
    // kill repeat to save bytes
    var ts = '<table>',
        te = '</table>',
        tbs = ts + '<tbody>',
        tbe = '</tbody>' + te,
        trs = tbs + '<tr>',
        tre = '</tr>' + tbe;

    var insertIntoTable = function (tag, where, el, html) {
        if (!tempTableEl) {
            tempTableEl = document.createElement('div');
        }
        var node;
        var before = null;
        if (tag == 'td') {
            if (where == 'afterbegin' || where == 'beforeend') { // INTO a TD
                return;
            }
            if (where == 'beforebegin') {
                before = el;
                el = el.parentNode;
            } else {
                before = el.nextSibling;
                el = el.parentNode;
            }
            node = ieTable(4, trs, html, tre);
        } else if (tag == 'tr') {
            if (where == 'beforebegin') {
                before = el;
                el = el.parentNode;
                node = ieTable(3, tbs, html, tbe);
            } else if (where == 'afterend') {
                before = el.nextSibling;
                el = el.parentNode;
                node = ieTable(3, tbs, html, tbe);
            } else { // INTO a TR
                if (where == 'afterbegin') {
                    before = el.firstChild;
                }
                node = ieTable(4, trs, html, tre);
            }
        } else if (tag == 'tbody') {
            if (where == 'beforebegin') {
                before = el;
                el = el.parentNode;
                node = ieTable(2, ts, html, te);
            } else if (where == 'afterend') {
                before = el.nextSibling;
                el = el.parentNode;
                node = ieTable(2, ts, html, te);
            } else {
                if (where == 'afterbegin') {
                    before = el.firstChild;
                }
                node = ieTable(3, tbs, html, tbe);
            }
        } else { // TABLE
            if (where == 'beforebegin' || where == 'afterend') { // OUTSIDE the table
                return;
            }
            if (where == 'afterbegin') {
                before = el.firstChild;
            }
            node = ieTable(2, ts, html, te);
        }
        el.insertBefore(node, before);
        return node;
    };
    return {

        useDom: false,

        markup: function (o) {
            return createHtml(o);
        },

        applyStyles: function (el, styles) {
            if (styles) {
                el = Ext.fly(el);
                if (typeof styles == "string") {
                    var re = /\s?([a-z\-]*)\:\s?([^;]*);?/gi;
                    var matches;
                    while ((matches = re.exec(styles)) != null) {
                        el.setStyle(matches[1], matches[2]);
                    }
                } else if (typeof styles == "object") {
                    for (var style in styles) {
                        el.setStyle(style, styles[style]);
                    }
                } else if (typeof styles == "function") {
                    Ext.DomHelper.applyStyles(el, styles.call());
                }
            }
        },

        insertHtml: function (where, el, html) {
            where = where.toLowerCase();
            if (el.insertAdjacentHTML) {
                if (tableRe.test(el.tagName)) {
                    var rs;
                    if (rs = insertIntoTable(el.tagName.toLowerCase(), where, el, html)) {
                        return rs;
                    }
                }
                switch (where) {
                case "beforebegin":
                    el.insertAdjacentHTML('BeforeBegin', html);
                    return el.previousSibling;
                case "afterbegin":
                    el.insertAdjacentHTML('AfterBegin', html);
                    return el.firstChild;
                case "beforeend":
                    el.insertAdjacentHTML('BeforeEnd', html);
                    return el.lastChild;
                case "afterend":
                    el.insertAdjacentHTML('AfterEnd', html);
                    return el.nextSibling;
                }
                throw 'Illegal insertion point -> "' + where + '"';
            }
            var range = el.ownerDocument.createRange();
            var frag;
            switch (where) {
            case "beforebegin":
                range.setStartBefore(el);
                frag = range.createContextualFragment(html);
                el.parentNode.insertBefore(frag, el);
                return el.previousSibling;
            case "afterbegin":
                if (el.firstChild) {
                    range.setStartBefore(el.firstChild);
                    frag = range.createContextualFragment(html);
                    el.insertBefore(frag, el.firstChild);
                    return el.firstChild;
                } else {
                    el.innerHTML = html;
                    return el.firstChild;
                }
            case "beforeend":
                if (el.lastChild) {
                    range.setStartAfter(el.lastChild);
                    frag = range.createContextualFragment(html);
                    el.appendChild(frag);
                    return el.lastChild;
                } else {
                    el.innerHTML = html;
                    return el.lastChild;
                }
            case "afterend":
                range.setStartAfter(el);
                frag = range.createContextualFragment(html);
                el.parentNode.insertBefore(frag, el.nextSibling);
                return el.nextSibling;
            }
            throw 'Illegal insertion point -> "' + where + '"';
        },

        insertBefore: function (el, o, returnElement) {
            return this.doInsert(el, o, returnElement, "beforeBegin");
        },

        insertAfter: function (el, o, returnElement) {
            return this.doInsert(el, o, returnElement, "afterEnd", "nextSibling");
        },

        insertFirst: function (el, o, returnElement) {
            return this.doInsert(el, o, returnElement, "afterBegin", "firstChild");
        },
        // private
        doInsert: function (el, o, returnElement, pos, sibling) {
            el = Ext.getDom(el);
            var newNode;
            if (this.useDom) {
                newNode = createDom(o, null);
                (sibling === "firstChild" ? el : el.parentNode).insertBefore(newNode, sibling ? el[sibling] : el);
            } else {
                var html = createHtml(o);
                newNode = this.insertHtml(pos, el, html);
            }
            return returnElement ? Ext.get(newNode, true) : newNode;
        },

        append: function (el, o, returnElement) {
            el = Ext.getDom(el);
            var newNode;
            if (this.useDom) {
                newNode = createDom(o, null);
                el.appendChild(newNode);
            } else {
                var html = createHtml(o);
                newNode = this.insertHtml("beforeEnd", el, html);
            }
            return returnElement ? Ext.get(newNode, true) : newNode;
        },

        overwrite: function (el, o, returnElement) {
            el = Ext.getDom(el);
            el.innerHTML = createHtml(o);
            return returnElement ? Ext.get(el.firstChild, true) : el.firstChild;
        },

        createTemplate: function (o) {
            var html = createHtml(o);
            return new Ext.Template(html);
        }
    };
}();
Ext.util.Format = function () {
    var trimRe = /^\s+|\s+$/g;
    return {

        ellipsis: function (value, len) {
            if (value && value.length > len) {
                return value.substr(0, len - 3) + "...";
            }
            return value;
        },

        undef: function (value) {
            return value !== undefined ? value : "";
        },

        defaultValue: function (value, defaultValue) {
            return value !== undefined && value !== '' ? value : defaultValue;
        },

        htmlEncode: function (value) {
            return !value ? value : String(value).replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
        },

        htmlDecode: function (value) {
            return !value ? value : String(value).replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, '"').replace(/&amp;/g, "&");
        },

        trim: function (value) {
            return String(value).replace(trimRe, "");
        },

        substr: function (value, start, length) {
            return String(value).substr(start, length);
        },

        lowercase: function (value) {
            return String(value).toLowerCase();
        },

        uppercase: function (value) {
            return String(value).toUpperCase();
        },

        capitalize: function (value) {
            return !value ? value : value.charAt(0).toUpperCase() + value.substr(1).toLowerCase();
        },
        // private
        call: function (value, fn) {
            if (arguments.length > 2) {
                var args = Array.prototype.slice.call(arguments, 2);
                args.unshift(value);
                return eval(fn).apply(window, args);
            } else {
                return eval(fn).call(window, value);
            }
        },

        usMoney: function (v) {
            v = (Math.round((v - 0) * 100)) / 100;
            v = (v == Math.floor(v)) ? v + ".00" : ((v * 10 == Math.floor(v * 10)) ? v + "0" : v);
            v = String(v);
            var ps = v.split('.');
            var whole = ps[0];
            var sub = ps[1] ? '.' + ps[1] : '.00';
            var r = /(\d+)(\d{3})/;
            while (r.test(whole)) {
                whole = whole.replace(r, '$1' + ',' + '$2');
            }
            v = whole + sub;
            if (v.charAt(0) == '-') {
                return '-$' + v.substr(1);
            }
            return "$" + v;
        },

        date: function (v, format) {
            if (!v) {
                return "";
            }
            if (!Ext.isDate(v)) {
                v = new Date(Date.parse(v));
            }
            return v.dateFormat(format || "m/d/Y");
        },

        dateRenderer: function (format) {
            return function (v) {
                return Ext.util.Format.date(v, format);
            };
        },
        // private
        stripTagsRE: /<\/?[^>]+>/gi,


        stripTags: function (v) {
            return !v ? v : String(v).replace(this.stripTagsRE, "");
        },
        // private
        stripScriptsRe: /(?:<script.*?>)((\n|\r|.)*?)(?:<\/script>)/ig,

        stripScripts: function (v) {
            return !v ? v : String(v).replace(this.stripScriptsRe, "");
        },

        fileSize: function (size) {
            if (size < 1024) {
                return size + " bytes";
            } else if (size < 1048576) {
                return (Math.round(((size * 10) / 1024)) / 10) + " KB";
            } else {
                return (Math.round(((size * 10) / 1048576)) / 10) + " MB";
            }
        },
        math: function () {
            var fns = {};
            return function (v, a) {
                if (!fns[a]) {
                    fns[a] = new Function('v', 'return v ' + a + ';');
                }
                return fns[a](v);
            }
        }(),

        nl2br: function (v) {
            return v === undefined || v === null ? '' : v.replace(/\n/g, '<br/>');
        }
    };
}();
Ext.Template = function (html) {
    var a = arguments;
    if (Ext.isArray(html)) {
        html = html.join("");
    } else if (a.length > 1) {
        var buf = [];
        for (var i = 0, len = a.length; i < len; i++) {
            if (typeof a[i] == 'object') {
                Ext.apply(this, a[i]);
            } else {
                buf[buf.length] = a[i];
            }
        }
        html = buf.join('');
    }

    this.html = html;
    if (this.compiled) {
        this.compile();
    }
};
Ext.Template.prototype = {

    applyTemplate: function (values) {
        if (this.compiled) {
            return this.compiled(values);
        }
        var useF = this.disableFormats !== true;
        var fm = Ext.util.Format,
            tpl = this;
        var fn = function (m, name, format, args) {
            if (format && useF) {
                if (format.substr(0, 5) == "this.") {
                    return tpl.call(format.substr(5), values[name], values);
                } else {
                    if (args) {
                        // quoted values are required for strings in compiled templates,
                        // but for non compiled we need to strip them
                        // quoted reversed for jsmin
                        var re = /^\s*['"](.*)["']\s*$/;
                        args = args.split(',');
                        for (var i = 0, len = args.length; i < len; i++) {
                            args[i] = args[i].replace(re, "$1");
                        }
                        args = [values[name]].concat(args);
                    } else {
                        args = [values[name]];
                    }
                    return fm[format].apply(fm, args);
                }
            } else {
                return values[name] !== undefined ? values[name] : "";
            }
        };
        return this.html.replace(this.re, fn);
    },

    set: function (html, compile) {
        this.html = html;
        this.compiled = null;
        if (compile) {
            this.compile();
        }
        return this;
    },

    disableFormats: false,

    re: /\{([\w-]+)(?:\:([\w\.]*)(?:\((.*?)?\))?)?\}/g,

    compile: function () {
        var fm = Ext.util.Format;
        var useF = this.disableFormats !== true;
        var sep = Ext.isGecko ? "+" : ",";
        var fn = function (m, name, format, args) {
            if (format && useF) {
                args = args ? ',' + args : "";
                if (format.substr(0, 5) != "this.") {
                    format = "fm." + format + '(';
                } else {
                    format = 'this.call("' + format.substr(5) + '", ';
                    args = ", values";
                }
            } else {
                args = '';
                format = "(values['" + name + "'] == undefined ? '' : ";
            }
            return "'" + sep + format + "values['" + name + "']" + args + ")" + sep + "'";
        };
        var body;
        // branched to use + in gecko and [].join() in others
        if (Ext.isGecko) {
            body = "this.compiled = function(values){ return '" +
                this.html.replace(/\\/g, '\\\\').replace(/(\r\n|\n)/g, '\\n').replace(/'/g, "\\'").replace(this.re, fn) +
                "';};";
        } else {
            body = ["this.compiled = function(values){ return ['"];
            body.push(this.html.replace(/\\/g, '\\\\').replace(/(\r\n|\n)/g, '\\n').replace(/'/g, "\\'").replace(this.re, fn));
            body.push("'].join('');};");
            body = body.join('');
        }
        eval(body);
        return this;
    },
    // private function used to call members
    call: function (fnName, value, allValues) {
        return this[fnName](value, allValues);
    },

    insertFirst: function (el, values, returnElement) {
        return this.doInsert('afterBegin', el, values, returnElement);
    },

    insertBefore: function (el, values, returnElement) {
        return this.doInsert('beforeBegin', el, values, returnElement);
    },

    insertAfter: function (el, values, returnElement) {
        return this.doInsert('afterEnd', el, values, returnElement);
    },

    append: function (el, values, returnElement) {
        return this.doInsert('beforeEnd', el, values, returnElement);
    },
    doInsert: function (where, el, values, returnEl) {
        el = Ext.getDom(el);
        var newNode = Ext.DomHelper.insertHtml(where, el, this.applyTemplate(values));
        return returnEl ? Ext.get(newNode, true) : newNode;
    },

    overwrite: function (el, values, returnElement) {
        el = Ext.getDom(el);
        el.innerHTML = this.applyTemplate(values);
        return returnElement ? Ext.get(el.firstChild, true) : el.firstChild;
    }
};
Ext.Template.prototype.apply = Ext.Template.prototype.applyTemplate;
// backwards compat
Ext.DomHelper.Template = Ext.Template;
Ext.Template.from = function (el, config) {
    el = Ext.getDom(el);
    return new Ext.Template(el.value || el.innerHTML, config || '');
};
Ext.XTemplate = function () {
    Ext.XTemplate.superclass.constructor.apply(this, arguments);
    var s = this.html;
    s = ['<tpl>', s, '</tpl>'].join('');
    var re = /<tpl\b[^>]*>((?:(?=([^<]+))\2|<(?!tpl\b[^>]*>))*?)<\/tpl>/;
    var nameRe = /^<tpl\b[^>]*?for="(.*?)"/;
    var ifRe = /^<tpl\b[^>]*?if="(.*?)"/;
    var execRe = /^<tpl\b[^>]*?exec="(.*?)"/;
    var m, id = 0;
    var tpls = [];
    while (m = s.match(re)) {
        var m2 = m[0].match(nameRe);
        var m3 = m[0].match(ifRe);
        var m4 = m[0].match(execRe);
        var exp = null,
            fn = null,
            exec = null;
        var name = m2 && m2[1] ? m2[1] : '';
        if (m3) {
            exp = m3 && m3[1] ? m3[1] : null;
            if (exp) {
                fn = new Function('values', 'parent', 'xindex', 'xcount', 'with(values){ return ' + (Ext.util.Format.htmlDecode(exp)) + '; }');
            }
        }
        if (m4) {
            exp = m4 && m4[1] ? m4[1] : null;
            if (exp) {
                exec = new Function('values', 'parent', 'xindex', 'xcount', 'with(values){ ' + (Ext.util.Format.htmlDecode(exp)) + '; }');
            }
        }
        if (name) {
            switch (name) {
            case '.':
                name = new Function('values', 'parent', 'with(values){ return values; }');
                break;
            case '..':
                name = new Function('values', 'parent', 'with(values){ return parent; }');
                break;
            default:
                name = new Function('values', 'parent', 'with(values){ return ' + name + '; }');
            }
        }
        tpls.push({
            id: id,
            target: name,
            exec: exec,
            test: fn,
            body: m[1] || ''
        });
        s = s.replace(m[0], '{xtpl' + id + '}');
        ++id;
    }
    for (var i = tpls.length - 1; i >= 0; --i) {
        this.compileTpl(tpls[i]);
    }
    this.master = tpls[tpls.length - 1];
    this.tpls = tpls;
};
Ext.extend(Ext.XTemplate, Ext.Template, {
    // private
    re: /\{([\w-\.\#]+)(?:\:([\w\.]*)(?:\((.*?)?\))?)?(\s?[\+\-\*\\]\s?[\d\.\+\-\*\\\(\)]+)?\}/g,
    // private
    codeRe: /\{\[((?:\\\]|.|\n)*?)\]\}/g,
    // private
    applySubTemplate: function (id, values, parent, xindex, xcount) {
        var t = this.tpls[id];
        if (t.test && !t.test.call(this, values, parent, xindex, xcount)) {
            return '';
        }
        if (t.exec && t.exec.call(this, values, parent, xindex, xcount)) {
            return '';
        }
        var vs = t.target ? t.target.call(this, values, parent) : values;
        parent = t.target ? values : parent;
        if (t.target && Ext.isArray(vs)) {
            var buf = [];
            for (var i = 0, len = vs.length; i < len; i++) {
                buf[buf.length] = t.compiled.call(this, vs[i], parent, i + 1, len);
            }
            return buf.join('');
        }
        return t.compiled.call(this, vs, parent, xindex, xcount);
    },
    // private
    compileTpl: function (tpl) {
        var fm = Ext.util.Format;
        var useF = this.disableFormats !== true;
        var sep = Ext.isGecko ? "+" : ",";
        var fn = function (m, name, format, args, math) {
            if (name.substr(0, 4) == 'xtpl') {
                return "'" + sep + 'this.applySubTemplate(' + name.substr(4) + ', values, parent, xindex, xcount)' + sep + "'";
            }
            var v;
            if (name === '.') {
                v = 'values';
            } else if (name === '#') {
                v = 'xindex';
            } else if (name.indexOf('.') != -1) {
                v = name;
            } else {
                v = "values['" + name + "']";
            }
            if (math) {
                v = '(' + v + math + ')';
            }
            if (format && useF) {
                args = args ? ',' + args : "";
                if (format.substr(0, 5) != "this.") {
                    format = "fm." + format + '(';
                } else {
                    format = 'this.call("' + format.substr(5) + '", ';
                    args = ", values";
                }
            } else {
                args = '';
                format = "(" + v + " === undefined ? '' : ";
            }
            return "'" + sep + format + v + args + ")" + sep + "'";
        };
        var codeFn = function (m, code) {
            return "'" + sep + '(' + code + ')' + sep + "'";
        };
        var body;
        // branched to use + in gecko and [].join() in others
        if (Ext.isGecko) {
            body = "tpl.compiled = function(values, parent, xindex, xcount){ return '" +
                tpl.body.replace(/(\r\n|\n)/g, '\\n').replace(/'/g, "\\'").replace(this.re, fn).replace(this.codeRe, codeFn) +
                "';};";
        } else {
            body = ["tpl.compiled = function(values, parent, xindex, xcount){ return ['"];
            body.push(tpl.body.replace(/(\r\n|\n)/g, '\\n').replace(/'/g, "\\'").replace(this.re, fn).replace(this.codeRe, codeFn));
            body.push("'].join('');};");
            body = body.join('');
        }
        eval(body);
        return this;
    },

    applyTemplate: function (values) {
        return this.master.compiled.call(this, values, {}, 1, 1);
    },

    compile: function () {
        return this;
    }



});
Ext.XTemplate.prototype.apply = Ext.XTemplate.prototype.applyTemplate;
Ext.XTemplate.from = function (el) {
    el = Ext.getDom(el);
    return new Ext.XTemplate(el.value || el.innerHTML);
};
Ext.util.JSON = new(function () {
    var useHasOwn = !!{}.hasOwnProperty;
    // crashes Safari in some instances
    //var validRE = /^("(\\.|[^"\\\n\r])*?"|[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t])+?$/;
    var pad = function (n) {
        return n < 10 ? "0" + n : n;
    };
    var m = {
        "\b": '\\b',
        "\t": '\\t',
        "\n": '\\n',
        "\f": '\\f',
        "\r": '\\r',
        '"': '\\"',
        "\\": '\\\\'
    };
    var encodeString = function (s) {
        if (/["\\\x00-\x1f]/.test(s)) {
            return '"' + s.replace(/([\x00-\x1f\\"])/g, function (a, b) {
                var c = m[b];
                if (c) {
                    return c;
                }
                c = b.charCodeAt();
                return "\\u00" +
                    Math.floor(c / 16).toString(16) +
                    (c % 16).toString(16);
            }) + '"';
        }
        return '"' + s + '"';
    };
    var encodeArray = function (o) {
        var a = ["["],
            b, i, l = o.length,
            v;
        for (i = 0; i < l; i += 1) {
            v = o[i];
            switch (typeof v) {
            case "undefined":
            case "function":
            case "unknown":
                break;
            default:
                if (b) {
                    a.push(',');
                }
                a.push(v === null ? "null" : Ext.util.JSON.encode(v));
                b = true;
            }
        }
        a.push("]");
        return a.join("");
    };
    this.encodeDate = function (o) {
        return '"' + o.getFullYear() + "-" +
            pad(o.getMonth() + 1) + "-" +
            pad(o.getDate()) + "T" +
            pad(o.getHours()) + ":" +
            pad(o.getMinutes()) + ":" +
            pad(o.getSeconds()) + '"';
    };

    this.encode = function (o) {
        if (typeof o == "undefined" || o === null) {
            return "null";
        } else if (Ext.isArray(o)) {
            return encodeArray(o);
        } else if (Ext.isDate(o)) {
            return Ext.util.JSON.encodeDate(o);
        } else if (typeof o == "string") {
            return encodeString(o);
        } else if (typeof o == "number") {
            return isFinite(o) ? String(o) : "null";
        } else if (typeof o == "boolean") {
            return String(o);
        } else {
            var a = ["{"],
                b, i, v;
            for (i in o) {
                if (!useHasOwn || o.hasOwnProperty(i)) {
                    v = o[i];
                    switch (typeof v) {
                    case "undefined":
                    case "function":
                    case "unknown":
                        break;
                    default:
                        if (b) {
                            a.push(',');
                        }
                        a.push(this.encode(i), ":",
                            v === null ? "null" : this.encode(v));
                        b = true;
                    }
                }
            }
            a.push("}");
            return a.join("");
        }
    };

    this.decode = function (json) {
        return eval("(" + json + ')');
    };
})();
Ext.encode = Ext.util.JSON.encode;
Ext.decode = Ext.util.JSON.decode;
//Notifies Element that fx methods are available
Ext.enableFx = true;
Ext.Fx = {

    slideIn: function (anchor, o) {
        var el = this.getFxEl();
        o = o || {};
        el.queueFx(o, function () {
            anchor = anchor || "t";
            // fix display to visibility
            this.fixDisplay();
            // restore values after effect
            var r = this.getFxRestore();
            var b = this.getBox();
            // fixed size for slide
            this.setSize(b);
            // wrap if needed
            var wrap = this.fxWrap(r.pos, o, "hidden");
            var st = this.dom.style;
            st.visibility = "visible";
            st.position = "absolute";
            // clear out temp styles after slide and unwrap
            var after = function () {
                el.fxUnwrap(wrap, r.pos, o);
                st.width = r.width;
                st.height = r.height;
                el.afterFx(o);
            };
            // time to calc the positions
            var a, pt = {
                    to: [b.x, b.y]
                },
                bw = {
                    to: b.width
                },
                bh = {
                    to: b.height
                };
            switch (anchor.toLowerCase()) {
            case "t":
                wrap.setSize(b.width, 0);
                st.left = st.bottom = "0";
                a = {
                    height: bh
                };
                break;
            case "l":
                wrap.setSize(0, b.height);
                st.right = st.top = "0";
                a = {
                    width: bw
                };
                break;
            case "r":
                wrap.setSize(0, b.height);
                wrap.setX(b.right);
                st.left = st.top = "0";
                a = {
                    width: bw,
                    points: pt
                };
                break;
            case "b":
                wrap.setSize(b.width, 0);
                wrap.setY(b.bottom);
                st.left = st.top = "0";
                a = {
                    height: bh,
                    points: pt
                };
                break;
            case "tl":
                wrap.setSize(0, 0);
                st.right = st.bottom = "0";
                a = {
                    width: bw,
                    height: bh
                };
                break;
            case "bl":
                wrap.setSize(0, 0);
                wrap.setY(b.y + b.height);
                st.right = st.top = "0";
                a = {
                    width: bw,
                    height: bh,
                    points: pt
                };
                break;
            case "br":
                wrap.setSize(0, 0);
                wrap.setXY([b.right, b.bottom]);
                st.left = st.top = "0";
                a = {
                    width: bw,
                    height: bh,
                    points: pt
                };
                break;
            case "tr":
                wrap.setSize(0, 0);
                wrap.setX(b.x + b.width);
                st.left = st.bottom = "0";
                a = {
                    width: bw,
                    height: bh,
                    points: pt
                };
                break;
            }
            this.dom.style.visibility = "visible";
            wrap.show();
            arguments.callee.anim = wrap.fxanim(a,
                o,
                'motion',
                .5,
                'easeOut', after);
        });
        return this;
    },


    slideOut: function (anchor, o) {
        var el = this.getFxEl();
        o = o || {};
        el.queueFx(o, function () {
            anchor = anchor || "t";
            // restore values after effect
            var r = this.getFxRestore();

            var b = this.getBox();
            // fixed size for slide
            this.setSize(b);
            // wrap if needed
            var wrap = this.fxWrap(r.pos, o, "visible");
            var st = this.dom.style;
            st.visibility = "visible";
            st.position = "absolute";
            wrap.setSize(b);
            var after = function () {
                if (o.useDisplay) {
                    el.setDisplayed(false);
                } else {
                    el.hide();
                }
                el.fxUnwrap(wrap, r.pos, o);
                st.width = r.width;
                st.height = r.height;
                el.afterFx(o);
            };
            var a, zero = {
                to: 0
            };
            switch (anchor.toLowerCase()) {
            case "t":
                st.left = st.bottom = "0";
                a = {
                    height: zero
                };
                break;
            case "l":
                st.right = st.top = "0";
                a = {
                    width: zero
                };
                break;
            case "r":
                st.left = st.top = "0";
                a = {
                    width: zero,
                    points: {
                        to: [b.right, b.y]
                    }
                };
                break;
            case "b":
                st.left = st.top = "0";
                a = {
                    height: zero,
                    points: {
                        to: [b.x, b.bottom]
                    }
                };
                break;
            case "tl":
                st.right = st.bottom = "0";
                a = {
                    width: zero,
                    height: zero
                };
                break;
            case "bl":
                st.right = st.top = "0";
                a = {
                    width: zero,
                    height: zero,
                    points: {
                        to: [b.x, b.bottom]
                    }
                };
                break;
            case "br":
                st.left = st.top = "0";
                a = {
                    width: zero,
                    height: zero,
                    points: {
                        to: [b.x + b.width, b.bottom]
                    }
                };
                break;
            case "tr":
                st.left = st.bottom = "0";
                a = {
                    width: zero,
                    height: zero,
                    points: {
                        to: [b.right, b.y]
                    }
                };
                break;
            }
            arguments.callee.anim = wrap.fxanim(a,
                o,
                'motion',
                .5,
                "easeOut", after);
        });
        return this;
    },

    puff: function (o) {
        var el = this.getFxEl();
        o = o || {};
        el.queueFx(o, function () {
            this.clearOpacity();
            this.show();
            // restore values after effect
            var r = this.getFxRestore();
            var st = this.dom.style;
            var after = function () {
                if (o.useDisplay) {
                    el.setDisplayed(false);
                } else {
                    el.hide();
                }
                el.clearOpacity();
                el.setPositioning(r.pos);
                st.width = r.width;
                st.height = r.height;
                st.fontSize = '';
                el.afterFx(o);
            };
            var width = this.getWidth();
            var height = this.getHeight();
            arguments.callee.anim = this.fxanim({
                    width: {
                        to: this.adjustWidth(width * 2)
                    },
                    height: {
                        to: this.adjustHeight(height * 2)
                    },
                    points: {
                        by: [-(width * .5), -(height * .5)]
                    },
                    opacity: {
                        to: 0
                    },
                    fontSize: {
                        to: 200,
                        unit: "%"
                    }
                },
                o,
                'motion',
                .5,
                "easeOut", after);
        });
        return this;
    },

    switchOff: function (o) {
        var el = this.getFxEl();
        o = o || {};
        el.queueFx(o, function () {
            this.clearOpacity();
            this.clip();
            // restore values after effect
            var r = this.getFxRestore();
            var st = this.dom.style;
            var after = function () {
                if (o.useDisplay) {
                    el.setDisplayed(false);
                } else {
                    el.hide();
                }
                el.clearOpacity();
                el.setPositioning(r.pos);
                st.width = r.width;
                st.height = r.height;
                el.afterFx(o);
            };
            this.fxanim({
                opacity: {
                    to: 0.3
                }
            }, null, null, .1, null, function () {
                this.clearOpacity();
                (function () {
                    this.fxanim({
                        height: {
                            to: 1
                        },
                        points: {
                            by: [0, this.getHeight() * .5]
                        }
                    }, o, 'motion', 0.3, 'easeIn', after);
                }).defer(100, this);
            });
        });
        return this;
    },

    highlight: function (color, o) {
        var el = this.getFxEl();
        o = o || {};
        el.queueFx(o, function () {
            color = color || "ffff9c";
            var attr = o.attr || "backgroundColor";
            this.clearOpacity();
            this.show();
            var origColor = this.getColor(attr);
            var restoreColor = this.dom.style[attr];
            var endColor = (o.endColor || origColor) || "ffffff";
            var after = function () {
                el.dom.style[attr] = restoreColor;
                el.afterFx(o);
            };
            var a = {};
            a[attr] = {
                from: color,
                to: endColor
            };
            arguments.callee.anim = this.fxanim(a,
                o,
                'color',
                1,
                'easeIn', after);
        });
        return this;
    },

    frame: function (color, count, o) {
        var el = this.getFxEl(),
            proxy,
            active;

        o = o || {};
        el.queueFx(o, function () {
            color = color || "#C3DAF9"
            if (color.length == 6) {
                color = "#" + color;
            }
            count = count || 1;
            this.show();
            var xy = this.getXY(),
                dom = this.dom,
                b = {
                    x: xy[0],
                    y: xy[1],
                    0: xy[0],
                    1: xy[1],
                    width: dom.offsetWidth,
                    height: dom.offsetHeight
                },
                proxy,
                queue = function () {
                    proxy = Ext.get(document.body || document.documentElement).createChild({
                        style: {
                            visbility: 'hidden',
                            position: 'absolute',
                            "z-index": 35000, // yee haw
                            border: "0px solid " + color
                        }
                    });
                    return proxy.queueFx({}, animFn);
                };


            arguments.callee.anim = {
                isAnimated: function () {
                    return true;
                },
                stop: function () {
                    count = 0;
                    proxy.stopFx();
                }
            };

            function animFn() {
                var scale = Ext.isBorderBox ? 2 : 1;
                active = proxy.anim({
                    top: {
                        from: b.y,
                        to: b.y - 20
                    },
                    left: {
                        from: b.x,
                        to: b.x - 20
                    },
                    borderWidth: {
                        from: 0,
                        to: 10
                    },
                    opacity: {
                        from: 1,
                        to: 0
                    },
                    height: {
                        from: b.height,
                        to: b.height + 20 * scale
                    },
                    width: {
                        from: b.width,
                        to: b.width + 20 * scale
                    }
                }, {
                    duration: o.duration || 1,
                    callback: function () {
                        proxy.remove();
                        --count > 0 ? queue() : el.afterFx(o);
                    }
                });
                arguments.callee.anim = {
                    isAnimated: function () {
                        return true;
                    },
                    stop: function () {
                        active.stop();
                    }
                };
            };
            queue();
        });
        return this;
    },

    pause: function (seconds) {
        var el = this.getFxEl(),
            t;
        el.queueFx({}, function () {
            t = setTimeout(function () {
                el.afterFx({});
            }, seconds * 1000);
            arguments.callee.anim = {
                isAnimated: function () {
                    return true;
                },
                stop: function () {
                    clearTimeout(t);
                    el.afterFx({});
                }
            };
        });
        return this;
    },

    fadeIn: function (o) {
        var el = this.getFxEl();
        o = o || {};
        el.queueFx(o, function () {
            this.setOpacity(0);
            this.fixDisplay();
            this.dom.style.visibility = 'visible';
            var to = o.endOpacity || 1;
            arguments.callee.anim = this.fxanim({
                    opacity: {
                        to: to
                    }
                },
                o, null, .5, "easeOut",
                function () {
                    if (to == 1) {
                        this.clearOpacity();
                    }
                    el.afterFx(o);
                });
        });
        return this;
    },

    fadeOut: function (o) {
        var el = this.getFxEl();
        o = o || {};
        el.queueFx(o, function () {
            var to = o.endOpacity || 0;
            arguments.callee.anim = this.fxanim({
                    opacity: {
                        to: to
                    }
                },
                o, null, .5, "easeOut",
                function () {
                    if (to === 0) {
                        if (this.visibilityMode == Ext.Element.DISPLAY || o.useDisplay) {
                            this.dom.style.display = "none";
                        } else {
                            this.dom.style.visibility = "hidden";
                        }
                        this.clearOpacity();
                    }
                    el.afterFx(o);
                });
        });
        return this;
    },

    scale: function (w, h, o) {
        this.shift(Ext.apply({}, o, {
            width: w,
            height: h
        }));
        return this;
    },

    shift: function (o) {
        var el = this.getFxEl();
        o = o || {};
        el.queueFx(o, function () {
            var a = {},
                w = o.width,
                h = o.height,
                x = o.x,
                y = o.y,
                op = o.opacity;
            if (w !== undefined) {
                a.width = {
                    to: this.adjustWidth(w)
                };
            }
            if (h !== undefined) {
                a.height = {
                    to: this.adjustHeight(h)
                };
            }
            if (o.left !== undefined) {
                a.left = {
                    to: o.left
                };
            }
            if (o.top !== undefined) {
                a.top = {
                    to: o.top
                };
            }
            if (o.right !== undefined) {
                a.right = {
                    to: o.right
                };
            }
            if (o.bottom !== undefined) {
                a.bottom = {
                    to: o.bottom
                };
            }
            if (x !== undefined || y !== undefined) {
                a.points = {
                    to: [
                        x !== undefined ? x : this.getX(),
                        y !== undefined ? y : this.getY()
                    ]
                };
            }
            if (op !== undefined) {
                a.opacity = {
                    to: op
                };
            }
            if (o.xy !== undefined) {
                a.points = {
                    to: o.xy
                };
            }
            arguments.callee.anim = this.fxanim(a,
                o, 'motion', .35, "easeOut",
                function () {
                    el.afterFx(o);
                });
        });
        return this;
    },

    ghost: function (anchor, o) {
        var el = this.getFxEl();
        o = o || {};
        el.queueFx(o, function () {
            anchor = anchor || "b";
            // restore values after effect
            var r = this.getFxRestore();
            var w = this.getWidth(),
                h = this.getHeight();
            var st = this.dom.style;
            var after = function () {
                if (o.useDisplay) {
                    el.setDisplayed(false);
                } else {
                    el.hide();
                }
                el.clearOpacity();
                el.setPositioning(r.pos);
                st.width = r.width;
                st.height = r.height;
                el.afterFx(o);
            };
            var a = {
                    opacity: {
                        to: 0
                    },
                    points: {}
                },
                pt = a.points;
            switch (anchor.toLowerCase()) {
            case "t":
                pt.by = [0, -h];
                break;
            case "l":
                pt.by = [-w, 0];
                break;
            case "r":
                pt.by = [w, 0];
                break;
            case "b":
                pt.by = [0, h];
                break;
            case "tl":
                pt.by = [-w, -h];
                break;
            case "bl":
                pt.by = [-w, h];
                break;
            case "br":
                pt.by = [w, h];
                break;
            case "tr":
                pt.by = [w, -h];
                break;
            }
            arguments.callee.anim = this.fxanim(a,
                o,
                'motion',
                .5,
                "easeOut", after);
        });
        return this;
    },

    syncFx: function () {
        this.fxDefaults = Ext.apply(this.fxDefaults || {}, {
            block: false,
            concurrent: true,
            stopFx: false
        });
        return this;
    },

    sequenceFx: function () {
        this.fxDefaults = Ext.apply(this.fxDefaults || {}, {
            block: false,
            concurrent: false,
            stopFx: false
        });
        return this;
    },

    nextFx: function () {
        var ef = this.fxQueue[0];
        if (ef) {
            ef.call(this);
        }
    },

    hasActiveFx: function () {
        return this.fxQueue && this.fxQueue[0];
    },

    stopFx: function () {
        if (this.hasActiveFx()) {
            var cur = this.fxQueue[0];
            if (cur && cur.anim && cur.anim.isAnimated()) {
                this.fxQueue = [cur]; // clear out others
                cur.anim.stop(true);
            }
        }
        return this;
    },

    beforeFx: function (o) {
        if (this.hasActiveFx() && !o.concurrent) {
            if (o.stopFx) {
                this.stopFx();
                return true;
            }
            return false;
        }
        return true;
    },

    hasFxBlock: function () {
        var q = this.fxQueue;
        return q && q[0] && q[0].block;
    },

    queueFx: function (o, fn) {
        if (!this.fxQueue) {
            this.fxQueue = [];
        }
        if (!this.hasFxBlock()) {
            Ext.applyIf(o, this.fxDefaults);
            if (!o.concurrent) {
                var run = this.beforeFx(o);
                fn.block = o.block;
                this.fxQueue.push(fn);
                if (run) {
                    this.nextFx();
                }
            } else {
                fn.call(this);
            }
        }
        return this;
    },

    fxWrap: function (pos, o, vis) {
        var wrap;
        if (!o.wrap || !(wrap = Ext.get(o.wrap))) {
            var wrapXY;
            if (o.fixPosition) {
                wrapXY = this.getXY();
            }
            var div = document.createElement("div");
            div.style.visibility = vis;
            wrap = Ext.get(this.dom.parentNode.insertBefore(div, this.dom));
            wrap.setPositioning(pos);
            if (wrap.getStyle("position") == "static") {
                wrap.position("relative");
            }
            this.clearPositioning('auto');
            wrap.clip();
            wrap.dom.appendChild(this.dom);
            if (wrapXY) {
                wrap.setXY(wrapXY);
            }
        }
        return wrap;
    },

    fxUnwrap: function (wrap, pos, o) {
        this.clearPositioning();
        this.setPositioning(pos);
        if (!o.wrap) {
            wrap.dom.parentNode.insertBefore(this.dom, wrap.dom);
            wrap.remove();
        }
    },

    getFxRestore: function () {
        var st = this.dom.style;
        return {
            pos: this.getPositioning(),
            width: st.width,
            height: st.height
        };
    },

    afterFx: function (o) {
        if (o.afterStyle) {
            this.applyStyles(o.afterStyle);
        }
        if (o.afterCls) {
            this.addClass(o.afterCls);
        }
        if (o.remove === true) {
            this.remove();
        }
        if (!o.concurrent) {
            this.fxQueue.shift();
        }
        Ext.callback(o.callback, o.scope, [this]);
        if (!o.concurrent) {
            this.nextFx();
        }
    },

    getFxEl: function () { // support for composite element fx
        return Ext.get(this.dom);
    },

    fxanim: function (args, opt, animType, defaultDur, defaultEase, cb) {
        animType = animType || 'run';
        opt = opt || {};
        var anim = Ext.lib.Anim[animType](
            this.dom, args, (opt.duration || defaultDur) || .35, (opt.easing || defaultEase) || 'easeOut',
            function () {
                Ext.callback(cb, this);
            },
            this
        );
        opt.anim = anim;
        return anim;
    }
};
// backwords compat
Ext.Fx.resize = Ext.Fx.scale;
//When included, Ext.Fx is automatically applied to Element so that all basic
//effects are available directly via the Element API
Ext.apply(Ext.Element.prototype, Ext.Fx);
Vps.onContentReady(function () {
    // wenn schon eine lightbox vorhanden, keine mehr erstellen
    if (Ext.query('.webLightbox').length == 0) {
        var lightbox = new Vpc.Basic.ImageEnlarge();
    }
    var els = document.getElementsByTagName('a');
    for (var i = 0; i < els.length; i++) {
        if (els[i].rel.match(/processedEnlarge/)) continue;
        if (els[i].rel.match(/enlarge_[0-9]+_[0-9]+/)) {
            Ext.EventManager.addListener(els[i], 'click', function (e) {
                lightbox.show(Ext.get(this), e);
                e.stopEvent();
            }, els[i], {
                stopEvent: true
            });
            els[i].rel = els[i].rel + ' processedEnlarge';
        }
        if (els[i].className.match(/vpcEnlargeTag/)) {
            Ext.DomHelper.append(els[i], {
                tag: 'span',
                cls: 'webZoom'
            });
        }
    }
});
Ext.namespace("Vpc.Basic");
Vpc.Basic.ImageEnlarge = function () {
    this.lightbox = Ext.get(
        Ext.DomHelper.append(Ext.getBody(), {
            tag: 'div',
            cls: 'lightbox webLightbox webStandard'
        })
    );
};
Vpc.Basic.ImageEnlarge.tpl = new Ext.XTemplate(
    '<div class="lightboxHeader">{header}</div>',
    '<div class="lightboxBody">{body}</div>',
    '<div class="lightboxFooter">{footer}</div>'
);
Vpc.Basic.ImageEnlarge.tplHeader = new Ext.XTemplate(
    '<a class="closeButton" href="#">',
    '<img src="/assets/vps/Vpc/Basic/ImageEnlarge/EnlargeTag/close.png" width="42" height="42" alt="" />',
    '</a>'
);
Vpc.Basic.ImageEnlarge.tplBody = new Ext.XTemplate(
    '<div class="prevBtn">{previousImageButton}</div>',
    '<div class="nextBtn">{nextImageButton}</div>',

    '<div class="loading"><img src="/assets/vps/Vpc/Basic/ImageEnlarge/EnlargeTag/loading.gif" width="66" height="66" class="preloadImage" /></div>',
    '<div class="image" style="width:{values.image.width}px; height:{values.image.height}px"><img class="centerImage" /></div>'

);
Vpc.Basic.ImageEnlarge.tplFooter = new Ext.XTemplate(
    '<tpl if="imageCaption"><p class="imageCaption<tpl if="title">Title</tpl>"><strong>{imageCaption}</strong></p></tpl>',
    '<tpl if="title"><p class="title">{title}</p></tpl>',
    '<tpl if="fullSizeLink"><p class="fullSizeLink">{fullSizeLink}</p></tpl>'
);
Vpc.Basic.ImageEnlarge.tplSwitchButton = new Ext.XTemplate(
    '<a class="switchButton {type}SwitchButton" href="#">&nbsp;</a>'
);
Vpc.Basic.ImageEnlarge.prototype = {
    hide: function (e) {
        if (e) e.stopEvent();
        this.lightbox.applyStyles('display: none;');
        this.unmask();
    },
    // May be overwritten
    alignBox: function () {
        this.lightbox.center();
    },
    show: function (linkEl) {
        this.mask();
        this.lightbox.applyStyles('display: block;');
        var m = linkEl.dom.rel.match(/enlarge_([0-9]+)_([0-9]+)/);
        var data = {};
        data.title = linkEl.dom.title ? linkEl.dom.title : false;
        linkEl.query('> .vpsEnlargeTagData').each(function (i) {
            var name = i.className.replace('vpsEnlargeTagData', '').trim();
            data[name] = i.innerHTML;
        }, this);
        var dataEl = linkEl.prev('.vpsEnlargeTagData');
        if (dataEl) {
            dataEl.query('> *').each(function (i) {
                if (i.className) {
                    var name = i.className.trim();
                    data[name] = i.innerHTML;
                }
            }, this);
        }
        var options = linkEl.down(".options", true);
        if (options && options.value) {
            options = Ext.decode(options.value);
        } else {
            options = {};
        }
        for (var i in options) {
            if (i == 'title') {
                if (options.title && !data.title) {
                    data.title = options.title;
                }
            } else if (i == 'fullSizeUrl') {
                if (options.fullSizeUrl) {
                    data.fullSizeLink = '<a href="' + options.fullSizeUrl + '" class="fullSizeLink" title="' + trl('Originalbild herunterladen') + '">' + trl('Originalbild herunterladen') + '</a> ';
                } else {
                    data.fullSizeLink = '';
                }
            } else {
                data[i] = options[i];
            }
        }
        data.image = {
            src: linkEl.dom.href,
            width: parseInt(m[1]),
            height: parseInt(m[2])
        };
        if (linkEl.nextImage) {
            data.nextImage = {
                src: linkEl.nextImage.child('img').dom.src,
                title: linkEl.nextImage.dom.title,
                type: 'next',
                text: trl('weiter')
            };
        }
        if (linkEl.previousImage) {
            data.previousImage = {
                src: linkEl.previousImage.child('img').dom.src,
                title: linkEl.previousImage.dom.title,
                type: 'previous',
                text: trl('zurück')
            };
        }
        var tpls = Vpc.Basic.ImageEnlarge;
        if (data.nextImage) {
            data.nextImageButton = tpls.tplSwitchButton.apply(data.nextImage);
        } else {
            data.nextImageButton = data.showInactiveSwitchLinks ? '<img class="nextImgBtn" src="/assets/vps/Vpc/Basic/ImageEnlarge/EnlargeTag/nextInactive.png" width="44" height="50" alt="" />' : '&nbsp;';
        }
        if (data.previousImage) {
            data.previousImageButton = tpls.tplSwitchButton.apply(data.previousImage);
        } else {
            data.previousImageButton = data.showInactiveSwitchLinks ? '<img class="previousImgBtn" src="/assets/vps/Vpc/Basic/ImageEnlarge/EnlargeTag/previousInactive.png" width="44" height="50" alt="" />' : '&nbsp;';
        }
        if (!data.title) data.title = '';
        if (!data.imageCaption) data.imageCaption = '';
        if (!data.fullSizeLink) data.fullSizeLink = '';
        data.header = tpls.tplHeader.apply(data);
        data.body = tpls.tplBody.apply(data);
        data.footer = tpls.tplFooter.apply(data);
        tpls.tpl.overwrite(this.lightbox, data);
        var image = new Image();
        image.onload = (function () {
            if (this.lightbox.child('.image')) {
                this.lightbox.child('.loading').hide();
                this.lightbox.child('.centerImage').dom.src = linkEl.dom.href;
                this.lightbox.child('.image').fadeIn();
            }
        }).createDelegate(this);
        image.src = linkEl.dom.href;
        this.lightbox.child('.lightboxFooter').setWidth(m[1]);
        var applyNextPreviousEvents = function (imageLink, type) {
            // preload next image
            var tmpNextImage = new Image();
            tmpNextImage.src = imageLink.dom.href;
            // next small button
            this.lightbox.query('.' + type + 'SwitchButton').each(function (el) {
                el = Ext.fly(el);
                if (type == 'next') {
                    el.setStyle('background-position', 'right ' + Math.floor(m[2] * 0.2) + 'px');
                } else {
                    el.setStyle('background-position', 'left ' + Math.floor(m[2] * 0.2) + 'px');
                }
                el.on('click', function (e) {
                    if (this.lightbox.lightbox.child('.image')) {
                        this.lightbox.lightbox.child('.image').fadeOut({
                            callback: this.lightbox.show(this.imageLink),
                            scope: this
                        });
                    } else {
                        this.lightbox.show(this.imageLink);
                    }
                }, {
                    lightbox: this,
                    imageLink: imageLink
                }, {
                    stopEvent: true
                });
            }, this);
        };
        if (linkEl.nextImage) {
            applyNextPreviousEvents.call(this, linkEl.nextImage, 'next');
        }
        if (linkEl.previousImage) {
            applyNextPreviousEvents.call(this, linkEl.previousImage, 'previous');
        }
        this.lightbox.query('.closeButton').each(function (el) {
            el = Ext.fly(el);
            el.on('click', this.hide, this, {
                stopEvent: true
            });
        }, this);
        if (Vps.Basic.LinkTag.Extern.processLinks) {
            Vps.Basic.LinkTag.Extern.processLinks(this.lightbox.dom);
        }
        this.alignBox();
    },
    mask: function () {
        var maskEl = Ext.getBody().mask();
        Ext.getBody().removeClass('x-masked');
        maskEl.addClass('lightboxMask');
        maskEl.applyStyles('height:' + this.getPageSize()[1] + 'px;');
        maskEl.on('click', this.hide, this);
    },
    unmask: function () {
        Ext.getBody().unmask();
        Ext.getBody().removeClass('lightboxShowOverflow');
    },
    getPageSize: function () {
        var xScroll, yScroll;
        if (window.innerHeight && window.scrollMaxY) {
            xScroll = window.innerWidth + window.scrollMaxX;
            yScroll = window.innerHeight + window.scrollMaxY;
        } else if (document.body.scrollHeight > document.body.offsetHeight) { // all but Explorer Mac
            xScroll = document.body.scrollWidth;
            yScroll = document.body.scrollHeight;
        } else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
            xScroll = document.body.offsetWidth;
            yScroll = document.body.offsetHeight;
        }
        var windowWidth, windowHeight;
        if (self.innerHeight) { // all except Explorer
            if (document.documentElement.clientWidth) {
                windowWidth = document.documentElement.clientWidth;
            } else {
                windowWidth = self.innerWidth;
            }
            windowHeight = self.innerHeight;
        } else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
            windowWidth = document.documentElement.clientWidth;
            windowHeight = document.documentElement.clientHeight;
        } else if (document.body) { // other Explorers
            windowWidth = document.body.clientWidth;
            windowHeight = document.body.clientHeight;
        }
        // for small pages with total height less then height of the viewport
        if (yScroll < windowHeight) {
            pageHeight = windowHeight;
        } else {
            pageHeight = yScroll;
        }
        // for small pages with total width less then width of the viewport
        if (xScroll < windowWidth) {
            pageWidth = xScroll;
        } else {
            pageWidth = windowWidth;
        }
        arrayPageSize = new Array(pageWidth, pageHeight, windowWidth, windowHeight);
        return arrayPageSize;
    }
};
Vps.onContentReady(function () {
    var galleries = Ext.query('.vpsEnlargeNextPrevious');
    Ext.each(galleries, function (gallery) {
        var galleryEls = [];
        var els = Ext.query('a', gallery);
        Ext.each(els, function (el) {
            if (el && el.rel.match(/enlarge_[0-9]+_[0-9]+/)) {
                galleryEls.push(Ext.get(el));
            }
        });
        for (var i = 0; i < galleryEls.length; i++) {
            // gibts ein vorheriges image?
            if (galleryEls[i - 1]) {
                galleryEls[i].previousImage = galleryEls[i - 1];
            }
            // gibts ein nächstes image?
            if (galleryEls[i + 1]) {
                galleryEls[i].nextImage = galleryEls[i + 1];
            }
        }
    });
});
Vps.onContentReady(function () {
    // alle multicheckboxes holen
    var multiCheckboxes = Ext.query('.vpsFormFieldMultiCheckbox');
    Ext.each(multiCheckboxes, function (mc) {
        mc = Ext.get(mc);
        var checkAll = mc.child('a.vpsMultiCheckboxCheckAll');
        var checkNone = mc.child('a.vpsMultiCheckboxCheckNone');
        if (checkAll) {
            checkAll.on('click', function (ev) {
                ev.stopEvent();
                var allInputs = this.query('input');
                for (var i = 0; i < allInputs.length; i++) {
                    if (allInputs[i].type == 'checkbox') {
                        allInputs[i].checked = true;
                    }
                }
            }, mc);
        }
        if (checkNone) {
            checkNone.on('click', function (ev) {
                ev.stopEvent();
                var allInputs = this.query('input');
                for (var i = 0; i < allInputs.length; i++) {
                    if (allInputs[i].type == 'checkbox') {
                        allInputs[i].checked = false;
                    }
                }
            }, mc);
        }
    });
});
Vps.onContentReady(function () {
    var clicked = [];
    var btns = Ext.query('form button.submit', document);
    Ext.each(btns, function (btn) {
        btn = Ext.get(btn);
        btn.on('click', function (e) {
            for (var i = 0; i < clicked.length; i++) {
                if (clicked[i] == this) {
                    e.stopEvent();
                    return;
                }
            }
            clicked.push(this);
        });
    });
});
Vps.onContentReady(function () {
    var checkboxes = Ext.query('div.vpsFormContainerFieldSet fieldset legend input');
    Ext.each(checkboxes, function (c) {
        c = Ext.get(c);
        c.on('click', function () {
            if (this.dom.checked) {
                this.up('fieldset').removeClass('vpsFormContainerFieldSetCollapsed');
            } else {
                this.up('fieldset').addClass('vpsFormContainerFieldSetCollapsed');
            }
        }, c);
    });
});
Vps.onContentReady(function () {
    var Event = Ext.EventManager;
    var els = Ext.query('input.vpsClearOnFocus');
    els.forEach(function (el) {
        if (!el || el.value == '') return;
        var xel = Ext.get(el);
        var initText = el.value;
        xel.addClass('vpsClearOnFocusBlurred');
        Event.on(el, 'focus', function () {
            if (el.value == '' || el.value == initText) {
                xel.removeClass('vpsClearOnFocusBlurred');
                el.value = '';
            }
        });
        Event.on(el, 'blur', function () {
            if (el.value == '') {
                el.value = initText;
                xel.addClass('vpsClearOnFocusBlurred');
            }
        });
        // form ermitteln und clearOnFocus value nicht mitsenden
        var elForm = el.parentNode;
        while (elForm.tagName != 'FORM') {
            if (elForm.tagName == 'BODY') {
                elForm = false;
                break;
            }
            elForm = elForm.parentNode;
        }
        if (elForm != false && elForm.tagName == 'FORM') {
            Event.on(elForm, 'submit', function () {
                if (el.value == initText) el.value = '';
            });
        }
    });
});
Ext.namespace('Vps.GoogleMap');
Vps.GoogleMap.isLoaded = false;
Vps.GoogleMap.isCallbackCalled = false;
Vps.GoogleMap.callbacks = [];
Vps.GoogleMap.load = function (callback, scope) {
    if (Vps.GoogleMap.isCallbackCalled) {
        callback.call(scope || window);
        return;
    }
    Vps.GoogleMap.callbacks.push({
        callback: callback,
        scope: scope
    });
    if (Vps.GoogleMap.isLoaded) return;
    Vps.GoogleMap.isLoaded = true;
    var url = 'http:/' + '/maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&libraries=places&async=2&language=' + trl('de');
    url += '&callback=Vps.GoogleMap._loaded';
    var s = document.createElement('script');
    s.setAttribute('type', 'text/javascript');
    s.setAttribute('src', url);
    document.getElementsByTagName("head")[0].appendChild(s);
};
Vps.GoogleMap._loaded = function () {
    Vps.GoogleMap.isCallbackCalled = true;
    Vps.GoogleMap.callbacks.forEach(function (i) {
        i.callback.call(i.scope || window);
    });
};
Vps.GoogleMap.maps = [];
Vps.GoogleMap.Map = function (config) {
    if (!config.mapContainer) throw new Error('config value mapContainer not set');
    this.addEvents({
        'show': true,
        'useFrom': true
    });
    this.mapContainer = Ext.get(config.mapContainer);
    this.config = config;
    if (typeof this.config.width == 'undefined') this.config.width = 350;
    if (typeof this.config.height == 'undefined') this.config.height = 300;
    if (typeof this.config.satelite == 'undefined') this.config.satelite = 1;
    if (typeof this.config.scale == 'undefined') this.config.scale = 1;
    if (typeof this.config.zoom_properties == 'undefined') this.config.zoom_properties = 0;
    if (typeof this.config.overview == 'undefined') this.config.overview = 1;
    if (typeof this.config.zoom == 'undefined') this.config.zoom = 13;
    if (typeof this.config.markerSrc == 'undefined') this.config.markerSrc = null;
    if (typeof this.config.lightMarkerSrc == 'undefined') this.config.lightMarkerSrc = '/assets/vps/images/googlemap/markerBlue.png';
    if (!this.config.markers) this.config.markers = [];
    if (typeof this.config.markers[0] == 'undefined' &&
        (this.config.markers.longitude || this.config.markers.coordinates)
    ) {
        this.config.markers = [this.config.markers];
    }
    for (var i = 0; i < this.config.markers.length; i++) {
        if (this.config.markers[i] && typeof this.config.markers[i].coordinates != 'undefined') {
            if (typeof this.config.markers[i].latitude == 'undefined') {
                var splits = this.config.markers[i].coordinates.split(',');
                this.config.markers[i].latitude = splits[0];
            }
            if (typeof this.config.markers[i].longitude == 'undefined') {
                var splits = this.config.markers[i].coordinates.split(',');
                this.config.markers[i].longitude = splits[1];
            }
        }
    }
    if (!this.config.lightMarkers) this.config.lightMarkers = [];
    if (typeof this.config.lightMarkers[0] == 'undefined' &&
        (this.config.lightMarkers.longitude || this.config.lightMarkers.coordinates)
    ) {
        this.config.lightMarkers = [this.config.lightMarkers];
    }
    for (var i = 0; i < this.config.lightMarkers.length; i++) {
        if (this.config.lightMarkers[i].coordinates) {
            if (typeof this.config.lightMarkers[i].latitude == 'undefined') {
                var splits = this.config.lightMarkers[i].coordinates.split(',');
                this.config.lightMarkers[i].latitude = splits[0];
            }
            if (typeof this.config.lightMarkers[i].longitude == 'undefined') {
                var splits = this.config.lightMarkers[i].coordinates.split(',');
                this.config.lightMarkers[i].longitude = splits[1];
            }
        }
    }
    if (typeof this.config.coordinates != 'undefined') {
        if (typeof this.config.latitude == 'undefined') {
            var splits = this.config.coordinates.split(',');
            this.config.latitude = splits[0];
        }
        if (typeof this.config.longitude == 'undefined') {
            var splits = this.config.coordinates.split(',');
            this.config.longitude = splits[1];
        }
    }
    if (!this.config.longitude) throw new Error('Either longitude or coordinates must be set in config');
    if (!this.config.latitude) throw new Error('Either latitude or coordinates must be set in config');
    var fromEl = this.mapContainer.down("form.fromAddress");
    if (fromEl) {
        var input = this.mapContainer.down("form.fromAddress input");
        fromEl.on('submit', function (e) {
            this.setMapDir(input.getValue());
            e.stopEvent();
        }, this);
    }
    if (typeof this.config.markers == 'string') {
        if (typeof Vps.Connection == 'undefined') {
            alert('Dependency ExtConnection (that includes Vps.Connection object) must be set when you wish to reload markers in an google map');
        }
        this.ajax = new Vps.Connection({
            autoAbort: true
        });
    }
    var container = this.mapContainer.down(".container");
    container.setWidth(parseInt(this.config.width));
    container.setHeight(parseInt(this.config.height));
};
Ext.extend(Vps.GoogleMap.Map, Ext.util.Observable, {
    markers: [],
    show: function () {
        this.directionsService = new google.maps.DirectionsService();
        this.directionsDisplay = new google.maps.DirectionsRenderer();
        //CONTROLLS
        if (parseInt(this.config.satelite)) {
            this.config.mapType = true;
        } else {
            this.config.mapType = false;
        }
        var mapOptions = {
            center: new google.maps.LatLng(parseFloat(this.config.latitude), parseFloat(this.config.longitude)),
            zoom: parseInt(this.config.zoom),
            zoomControl: this.config.zoom_properties,
            scaleControl: this.config.scale,
            mapTypeControl: this.config.mapType,
            overviewMapControl: this.config.overview
        };
        this.gmap = new google.maps.Map(this.mapContainer.down(".container").dom,
            mapOptions);
        this.directionsDisplay.setMap(this.gmap);
        this.directionsDisplay.setPanel(this.mapContainer.down(".mapDir").dom);
        this.infoWindow = new google.maps.InfoWindow();
        if (this.config.map_type == 'satellite') {
            this.gmap.setMapTypeId(google.maps.MapTypeId.SATELLITE);
        } else if (this.config.map_type == 'hybrid') {
            this.gmap.setMapTypeId(google.maps.MapTypeId.HYBRID);
        }
        if (typeof this.config.zoom == 'object' && this.config.zoom[0] && this.config.zoom[1] && this.config.zoom[2] && this.config.zoom[3]) {
            this.config.zoom = this.gmap.getBoundsZoomLevel(new google.maps.LatLngBounds(
                new google.maps.LatLng(this.config.zoom[2], this.config.zoom[3]),
                new google.maps.LatLng(this.config.zoom[0], this.config.zoom[1])
            ));
            if (this.config.maximumInitialResolution < this.config.zoom)
                this.config.zoom = this.config.maximumInitialResolution;
        }
        if (typeof this.config.markers == 'string') {
            google.maps.event.addListener(this.gmap, "moveend", this._reloadMarkers.createDelegate(
                this, []
            ));
            this._reloadMarkers();
        } else {
            this.config.markers.each(function (marker) {
                this.addMarker(marker);
            }, this);
        }
        // Opens the first InfoWindow. Must be deferred, because there were
        // problems opening InfoWindows in multiple maps on one site
        var showNextWindow = function () {
            var map = Vps.GoogleMap.maps.shift();
            if (!map) return;
            map.markers.each(function (m) {
                if (m.vpsConfig.autoOpenInfoWindow) this.showWindow(m);
            }, map);
            if (Vps.GoogleMap.maps.length) {
                showNextWindow.defer(1500, this);
            }
        };
        if (Vps.GoogleMap.maps.length == 0) {
            showNextWindow.defer(1, this);
        }
        Vps.GoogleMap.maps.push(this);
        this.fireEvent('show', this);
    },
    _reloadMarkers: function () {
        var bounds = this.gmap.getBounds();
        var params = {};
        params.lowestLng = bounds.getSouthWest().lng();
        params.lowestLat = bounds.getSouthWest().lat();
        params.highestLng = bounds.getNorthEast().lng();
        params.highestLat = bounds.getNorthEast().lat();
        if (!this.gmapLoader) {
            this.gmapLoader = Ext.getBody().createChild({
                tag: 'div',
                id: 'gmapLoader'
            });
            this.gmapLoader.dom.innerHTML = trl('Laden...');
            this.gmapLoader.alignTo(this.mapContainer, 'tr-tr', [-10, 50]);
        }
        this.gmapLoader.show();
        this.lastReloadMarkersRequestId = this.ajax.request({
            url: this.config.markers,
            success: function (response, options) {
                var ret = Ext.decode(response.responseText);
                ret.markers.each(function (m) {
                    var doAdd = true;
                    for (var i = 0; i < this.markers.length; i++) {
                        if (this.markers[i].vpsConfig.latitude == m.latitude && this.markers[i].vpsConfig.longitude == m.longitude) {
                            doAdd = false;
                            break;
                        }
                    }
                    if (doAdd) this.addMarker(m);
                }, this);
                this.gmapLoader.hide();
            },
            params: params,
            scope: this
        });
    },
    addMarker: function (markerConfig) {
        var marker = this.createMarker(markerConfig);
        marker.vpsConfig = markerConfig;
        this.markers.push(marker);
        marker.setMap(this.gmap);
        if (markerConfig.infoHtml) {
            google.maps.event.addListener(marker, 'click', this.showWindow.createDelegate(
                this, [marker]
            ));
        }
    },
    createMarker: function (markerConfig) {
        var gmarkCfg = {
            draggable: false
        };
        if (markerConfig.draggable) gmarkCfg.draggable = true;
        var image = this.getMarkerIcon(markerConfig);
        var myLatLng = new google.maps.LatLng(parseFloat(markerConfig.latitude), parseFloat(markerConfig.longitude));
        return new google.maps.Marker({
            position: myLatLng,
            icon: image
        });
    },
    getMarkerIcon: function (markerConfig) {
        var image = '';
        if (this._isLightMarker(markerConfig.latitude, markerConfig.longitude) && this.config.lightMarkerSrc) {
            image = this.config.lightMarkerSrc;
        } else if (this.config.markerSrc) {
            image = this.config.markerSrc;
        }
        return image;
    },
    _isLightMarker: function (lat, lng) {
        for (var i = 0; i < this.config.lightMarkers.length; i++) {
            var m = this.config.lightMarkers[i];
            if (m.latitude == lat && m.longitude == lng) {
                return true;
            }
        }
        return false;
    },

    showWindow: function (marker) {
        if (marker.vpsConfig.infoHtml && marker.vpsConfig.infoHtml != "" && "<br />" != marker.vpsConfig.infoHtml.toLowerCase()) {
            this.infoWindow.setContent(marker.vpsConfig.infoHtml);
            this.infoWindow.open(this.gmap, marker);
        }
    },
    setMapDir: function (fromAddress) {
        var end = new google.maps.LatLng(parseFloat(this.config.latitude), parseFloat(this.config.longitude));
        var request = {
            origin: fromAddress,
            destination: end,
            travelMode: google.maps.TravelMode.DRIVING
        };
        this.directionsService.route(request, this._directionsCallback.createDelegate(
            this
        ));
    },
    _directionsCallback: function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            this.directionsDisplay.setDirections(response);
        } else {
            alert(trl('Eingetragener Ort konnte nicht gefunden werden!'));
        }
    }
});
Ext.namespace('Vpc.Advanced.GoogleMap');
Vpc.Advanced.GoogleMap.renderedMaps = [];
Vpc.Advanced.GoogleMap.renderMap = function (map) {
    if (Vpc.Advanced.GoogleMap.renderedMaps.indexOf(map) != -1) return;
    Vpc.Advanced.GoogleMap.renderedMaps.push(map);
    var mapContainer = new Ext.Element(map);
    var cfg = mapContainer.down(".options", true);
    if (!cfg) return;
    cfg = Ext.decode(cfg.value);
    var text = mapContainer.down("div.text");
    cfg.mapContainer = mapContainer;
    if (!cfg.markers) {
        cfg.markers = {
            longitude: cfg.longitude,
            latitude: cfg.latitude,
            autoOpenInfoWindow: true
        };
        if (text) cfg.markers.infoHtml = text.dom.innerHTML;
    }
    var myMap = new Vps.GoogleMap.Map(cfg);
    Vps.GoogleMap.load(function () {
        this.show();
    }, myMap);
    return myMap;
};
Vps.onContentReady(function () {
    var maps = Ext.DomQuery.select('div.vpcAdvancedGoogleMapView');
    Ext.each(maps, function (map) {
        // wenn in vpsSwitchDisplay (Klappbox)
        var switchDisplayUp = Ext.get(map).up('div.vpsSwitchDisplay');
        // wenn in vpsTabs
        var tabsContentUp = Ext.get(map).up('div.vpsTabsContent');
        // TODO: wenn da noch mehr so ausnahmen kommen, könnte man sich eine generelle
        // lösung mit einer 'vpsGmapDelayedRender' cssClass o.Ä. überlegen
        if (switchDisplayUp) {
            (function (switchDisplayUp, map) {
                Ext.get(switchDisplayUp).switchDisplayObject.on('opened', function () {
                    map.gmapObject = Vpc.Advanced.GoogleMap.renderMap(map);
                });
            }).defer(1, this, [switchDisplayUp, map]);
        } else if (tabsContentUp && !tabsContentUp.hasClass('vpsTabsContentActive')) {
            (function (tabsContentUp, map) {
                var tabsUp = Ext.get(tabsContentUp).up('div.vpsTabs');
                Ext.get(tabsUp).tabsObject.on('tabActivate', function (tabs, newIdx, oldIdx) {
                    if (tabsContentUp.dom === tabs.getContentElByIdx(newIdx)) {
                        map.gmapObject = Vpc.Advanced.GoogleMap.renderMap(map);
                    }
                }, Ext.get(tabsUp).tabsObject);
            }).defer(1, this, [tabsContentUp, map]);
        } else {
            map.gmapObject = Vpc.Advanced.GoogleMap.renderMap(map);
        }
    });
});
Ext.CompositeElement = function (els) {
    this.elements = [];
    this.addElements(els);
};
Ext.CompositeElement.prototype = {
    isComposite: true,
    addElements: function (els) {
        if (!els) return this;
        if (typeof els == "string") {
            els = Ext.Element.selectorFunction(els);
        }
        var yels = this.elements;
        var index = yels.length - 1;
        for (var i = 0, len = els.length; i < len; i++) {
            yels[++index] = Ext.get(els[i]);
        }
        return this;
    },

    fill: function (els) {
        this.elements = [];
        this.add(els);
        return this;
    },

    filter: function (selector) {
        var els = [];
        this.each(function (el) {
            if (el.is(selector)) {
                els[els.length] = el.dom;
            }
        });
        this.fill(els);
        return this;
    },
    invoke: function (fn, args) {
        var els = this.elements;
        for (var i = 0, len = els.length; i < len; i++) {
            Ext.Element.prototype[fn].apply(els[i], args);
        }
        return this;
    },

    add: function (els) {
        if (typeof els == "string") {
            this.addElements(Ext.Element.selectorFunction(els));
        } else if (els.length !== undefined) {
            this.addElements(els);
        } else {
            this.addElements([els]);
        }
        return this;
    },

    each: function (fn, scope) {
        var els = this.elements;
        for (var i = 0, len = els.length; i < len; i++) {
            if (fn.call(scope || els[i], els[i], this, i) === false) {
                break;
            }
        }
        return this;
    },

    item: function (index) {
        return this.elements[index] || null;
    },

    first: function () {
        return this.item(0);
    },

    last: function () {
        return this.item(this.elements.length - 1);
    },

    getCount: function () {
        return this.elements.length;
    },

    contains: function (el) {
        return this.indexOf(el) !== -1;
    },

    indexOf: function (el) {
        return this.elements.indexOf(Ext.get(el));
    },

    removeElement: function (el, removeDom) {
        if (Ext.isArray(el)) {
            for (var i = 0, len = el.length; i < len; i++) {
                this.removeElement(el[i]);
            }
            return this;
        }
        var index = typeof el == 'number' ? el : this.indexOf(el);
        if (index !== -1 && this.elements[index]) {
            if (removeDom) {
                var d = this.elements[index];
                if (d.dom) {
                    d.remove();
                } else {
                    Ext.removeNode(d);
                }
            }
            this.elements.splice(index, 1);
        }
        return this;
    },

    replaceElement: function (el, replacement, domReplace) {
        var index = typeof el == 'number' ? el : this.indexOf(el);
        if (index !== -1) {
            if (domReplace) {
                this.elements[index].replaceWith(replacement);
            } else {
                this.elements.splice(index, 1, Ext.get(replacement))
            }
        }
        return this;
    },

    clear: function () {
        this.elements = [];
    }
};
(function () {
    Ext.CompositeElement.createCall = function (proto, fnName) {
        if (!proto[fnName]) {
            proto[fnName] = function () {
                return this.invoke(fnName, arguments);
            };
        }
    };
    for (var fnName in Ext.Element.prototype) {
        if (typeof Ext.Element.prototype[fnName] == "function") {
            Ext.CompositeElement.createCall(Ext.CompositeElement.prototype, fnName);
        }
    };
})();
Ext.CompositeElementLite = function (els) {
    Ext.CompositeElementLite.superclass.constructor.call(this, els);
    this.el = new Ext.Element.Flyweight();
};
Ext.extend(Ext.CompositeElementLite, Ext.CompositeElement, {
    addElements: function (els) {
        if (els) {
            if (Ext.isArray(els)) {
                this.elements = this.elements.concat(els);
            } else {
                var yels = this.elements;
                var index = yels.length - 1;
                for (var i = 0, len = els.length; i < len; i++) {
                    yels[++index] = els[i];
                }
            }
        }
        return this;
    },
    invoke: function (fn, args) {
        var els = this.elements;
        var el = this.el;
        for (var i = 0, len = els.length; i < len; i++) {
            el.dom = els[i];
            Ext.Element.prototype[fn].apply(el, args);
        }
        return this;
    },

    item: function (index) {
        if (!this.elements[index]) {
            return null;
        }
        this.el.dom = this.elements[index];
        return this.el;
    },
    // fixes scope with flyweight
    addListener: function (eventName, handler, scope, opt) {
        var els = this.elements;
        for (var i = 0, len = els.length; i < len; i++) {
            Ext.EventManager.on(els[i], eventName, handler, scope || els[i], opt);
        }
        return this;
    },

    each: function (fn, scope) {
        var els = this.elements;
        var el = this.el;
        for (var i = 0, len = els.length; i < len; i++) {
            el.dom = els[i];
            if (fn.call(scope || el, el, this, i) === false) {
                break;
            }
        }
        return this;
    },
    indexOf: function (el) {
        return this.elements.indexOf(Ext.getDom(el));
    },
    replaceElement: function (el, replacement, domReplace) {
        var index = typeof el == 'number' ? el : this.indexOf(el);
        if (index !== -1) {
            replacement = Ext.getDom(replacement);
            if (domReplace) {
                var d = this.elements[index];
                d.parentNode.insertBefore(replacement, d);
                Ext.removeNode(d);
            }
            this.elements.splice(index, 1, replacement);
        }
        return this;
    }
});
Ext.CompositeElementLite.prototype.on = Ext.CompositeElementLite.prototype.addListener;
if (Ext.DomQuery) {
    Ext.Element.selectorFunction = Ext.DomQuery.select;
}
Ext.Element.select = function (selector, unique, root) {
    var els;
    if (typeof selector == "string") {
        els = Ext.Element.selectorFunction(selector, root);
    } else if (selector.length !== undefined) {
        els = selector;
    } else {
        throw "Invalid selector";
    }
    if (unique === true) {
        return new Ext.CompositeElement(els);
    } else {
        return new Ext.CompositeElementLite(els);
    }
};
Ext.select = Ext.Element.select;
Ext.ns("Ext.ux");
Ext.ux.ErrorHandler = Ext.extend(Ext.util.Observable, (function () {
    return {

        constructor: function () {
            Ext.ux.ErrorHandler.superclass.constructor.call(this);
            this.addEvents(

                "error"
            );
        },

        init: function () {
            // window.onerror is the browser's hook for unhandled exceptions (IE and Firefox only)
            // if another developer is already using window.onerror, let's be respectful
            window.onerror = !window.onerror ? Ext.ux.ErrorHandler.handleError : window.onerror.createSequence(Ext.ux.ErrorHandler.handleError);
            Ext.select("img").each(function (el, list, index) {
                el.on("error", Ext.ux.ErrorHandler.handleError);
            });
        },

        handleError: function () {
            // the arguments collection is not a true Array, so we'll make one
            var args = [];
            for (var x = 0; x < arguments.length; x++) {
                args[x] = arguments[x];
            }
            if (args.length > 0) {
                var ex = {
                    raw: null,
                    isError: false,
                    isUnhandledException: false,
                    isImageLoadingError: false,
                    isScriptLoadingError: false, // Firefox only
                    name: null,
                    message: null,
                    url: null, // Safari and Firefox only
                    lineNumber: null, // Safari and Firefox only
                    stack: null // Firefox and Opera only
                };
                ex.raw = args;
                ex.isError = args[0] instanceof Error; // Error object thrown in try...catch
                // Check the signature for a match with an unhandled exception
                ex.isUnhandledException = (args.length === 3) && (typeof args[2] === "number");
                ex.isImageLoadingError = !!args[0].browserEvent && args[1] && args[1].tagName == "IMG";
                if (ex.isError) {
                    var err = args[0];
                    ex.name = err.name || "Error"; // Safari is inconsistent
                    ex.message = err.message || err.type; // Chrome is inconsistent
                    ex.lineNumber = err.line || err.lineNumber; // Safari and Firefox
                    ex.url = err.sourceURL || err.fileName; // Safari and Firefox
                    ex.stack = err.stack || err.stacktrace; // Firefox and Opera
                } else if (ex.isUnhandledException) {
                    ex.name = "ERR_UNHANDLED";
                    ex.message = args[0];
                    ex.url = args[1];
                    ex.lineNumber = args[2];
                    if (ex.message == "Error loading script") {
                        ex.isScriptLoadingError = true;
                        ex.name = "ERR_LOAD_SCRIPT";
                    }
                } else if (ex.isImageLoadingError) {
                    ex.name = "ERR_LOAD_IMG";
                    ex.message = "Error loading image";
                    ex.url = args[1].src;
                } else {
                    ex.name = "ERR_UNKNOWN";
                    ex.message = Ext.encode(args[0]);
                }
                // rebuild the stack (ignore Firefox and Opera)
                // arguments.callee // the handleError method
                // arguments.callee.caller // delegate for handleError
                // arguments.callee.caller.caller // the beginning of the stack
                if (arguments.callee && arguments.callee.caller && arguments.callee.caller.caller) {
                    var a = [];
                    getStack(a, arguments.callee.caller.caller);
                    ex.stack = a;
                }
                try {
                    this.fireEvent("error", ex);
                } catch (e) {
                    if (!ex.isUnhandledException) {
                        throw e;
                    }
                    // if the errorHandler is broken, let the user see the browser's error handler
                    return false;
                }
            }
            return true;
        }
    };

    function getStack(a, func) {
        if (func.caller) {
            getStack(a, func.caller);
        }
        var args = [];
        for (var x = 0; x < func.arguments.length; x++) {
            args[x] = func.arguments[x];
        }
        a.unshift({
            args: args,
            func: func
        });
    }
})());
// the following line makes this a singleton class
Ext.ux.ErrorHandler = new Ext.ux.ErrorHandler();
// the following line ensures that the handleError method always executes in the scope of ErrorHandler
Ext.ux.ErrorHandler.handleError = Ext.ux.ErrorHandler.handleError.createDelegate(Ext.ux.ErrorHandler);
Ext.ux.ErrorHandler.on('error', function (ex) {
    // zeitweise kommt aus ein fehler von chrome://skype_ff_toolbar_win/content/injection_graph_func.js:1
    // der hier ignoriert wird. (falsche / nicht mehr verfügbare toolbar?)
    // gefunden bei 2F Stargate
    if (ex.url && ex.url.substr(0, 9) == 'chrome:/' + '/') {
        return;
    }
    if (Vps.Debug.displayErrors) {
        throw ex;
    }
    Ext.Ajax.request({
        url: '/vps/error/error/json-mail',
        ignoreErrors: true,
        params: {
            url: ex.url,
            lineNumber: ex.lineNumber,
            stack: Ext.encode(ex.stack),
            message: ex.message,
            location: location.href,
            referrer: document.referrer
        }
    });
});
if (!Vps.Debug.displayErrors) {
    Ext.ux.ErrorHandler.init();
}
Vps.handleError = function (error) {
    if (typeof error == 'string') error = {
        message: error
    };
    if (arguments[1]) error.title = arguments[1];
    if (arguments[2]) error.mail = arguments[2];
    if (!error.url) error.url = '';
    if ((error.checkRetry || Vps.Debug.displayErrors) && error.retry) {
        if (Vps.Debug.displayErrors) {
            title = error.title;
            msg = error.message;
        } else if (error.errorText) {
            title = error.errorText;
            msg = error.errorText;
        } else {
            title = (trl('Fehler'));
            msg = trl("Ein Server Fehler ist aufgetreten.");
            if (error.mail || (typeof error.mail == 'undefined')) {
                Ext.Ajax.request({
                    url: '/vps/error/error/json-mail',
                    params: {
                        url: error.url,
                        message: error.message,
                        location: location.href,
                        referrer: document.referrer
                    },
                    ignoreErrors: true
                });
            }
        }
        var win = new Ext.Window({
            autoCreate: true,
            title: title,
            resizable: true,
            constrain: true,
            constrainHeader: true,
            minimizable: false,
            maximizable: false,
            stateful: false,
            modal: false,
            shim: true,
            buttonAlign: "center",
            width: 400,
            minHeight: 300,
            plain: true,
            footer: true,
            closable: false,
            html: msg,
            buttons: [{
                text: trl('Wiederholen'),
                handler: function () {
                    error.retry.call(error.scope || window);
                    win.close();
                }
            }, {
                text: trl('Abbrechen'),
                handler: function () {
                    error.abort.call(error.scope || window);
                    win.close();
                }
            }]
        });
        win.show();
    } else if (Vps.Debug.displayErrors) {
        Ext.Msg.show({
            title: error.title,
            msg: error.message,
            buttons: Ext.Msg.OK,
            modal: true,
            width: 800
        });
    } else {
        Ext.Msg.alert(trl('Fehler'), trl("Ein Server Fehler ist aufgetreten."));
        if (error.mail || (typeof error.mail == 'undefined')) {
            Ext.Ajax.request({
                url: '/vps/error/error/json-mail',
                params: {
                    url: error.url,
                    message: error.message,
                    location: location.href,
                    referrer: document.referrer
                }
            });
        }
    }
};
Ext.data.Connection = function (config) {
    Ext.apply(this, config);
    this.addEvents(

        "beforerequest",

        "requestcomplete",

        "requestexception"
    );
    Ext.data.Connection.superclass.constructor.call(this);
};
Ext.extend(Ext.data.Connection, Ext.util.Observable, {



    timeout: 30000,

    autoAbort: false,

    disableCaching: true,


    disableCachingParam: '_dc',


    request: function (o) {
        if (this.fireEvent("beforerequest", this, o) !== false) {
            var p = o.params;
            if (typeof p == "function") {
                p = p.call(o.scope || window, o);
            }
            if (typeof p == "object") {
                p = Ext.urlEncode(p);
            }
            if (this.extraParams) {
                var extras = Ext.urlEncode(this.extraParams);
                p = p ? (p + '&' + extras) : extras;
            }
            var url = o.url || this.url;
            if (typeof url == 'function') {
                url = url.call(o.scope || window, o);
            }
            if (o.form) {
                var form = Ext.getDom(o.form);
                url = url || form.action;
                var enctype = form.getAttribute("enctype");
                if (o.isUpload || (enctype && enctype.toLowerCase() == 'multipart/form-data')) {
                    return this.doFormUpload(o, p, url);
                }
                var f = Ext.lib.Ajax.serializeForm(form);
                p = p ? (p + '&' + f) : f;
            }
            var hs = o.headers;
            if (this.defaultHeaders) {
                hs = Ext.apply(hs || {}, this.defaultHeaders);
                if (!o.headers) {
                    o.headers = hs;
                }
            }
            var cb = {
                success: this.handleResponse,
                failure: this.handleFailure,
                scope: this,
                argument: {
                    options: o
                },
                timeout: o.timeout || this.timeout
            };
            var method = o.method || this.method || ((p || o.xmlData || o.jsonData) ? "POST" : "GET");
            if (method == 'GET' && (this.disableCaching && o.disableCaching !== false) || o.disableCaching === true) {
                var dcp = o.disableCachingParam || this.disableCachingParam;
                url += (url.indexOf('?') != -1 ? '&' : '?') + dcp + '=' + (new Date().getTime());
            }
            if (typeof o.autoAbort == 'boolean') { // options gets top priority
                if (o.autoAbort) {
                    this.abort();
                }
            } else if (this.autoAbort !== false) {
                this.abort();
            }
            if ((method == 'GET' || o.xmlData || o.jsonData) && p) {
                url += (url.indexOf('?') != -1 ? '&' : '?') + p;
                p = '';
            }
            this.transId = Ext.lib.Ajax.request(method, url, cb, p, o);
            return this.transId;
        } else {
            Ext.callback(o.callback, o.scope, [o, null, null]);
            return null;
        }
    },

    isLoading: function (transId) {
        if (transId) {
            return Ext.lib.Ajax.isCallInProgress(transId);
        } else {
            return this.transId ? true : false;
        }
    },

    abort: function (transId) {
        if (transId || this.isLoading()) {
            Ext.lib.Ajax.abort(transId || this.transId);
        }
    },
    // private
    handleResponse: function (response) {
        this.transId = false;
        var options = response.argument.options;
        response.argument = options ? options.argument : null;
        this.fireEvent("requestcomplete", this, response, options);
        Ext.callback(options.success, options.scope, [response, options]);
        Ext.callback(options.callback, options.scope, [options, true, response]);
    },
    // private
    handleFailure: function (response, e) {
        this.transId = false;
        var options = response.argument.options;
        response.argument = options ? options.argument : null;
        this.fireEvent("requestexception", this, response, options, e);
        Ext.callback(options.failure, options.scope, [response, options]);
        Ext.callback(options.callback, options.scope, [options, false, response]);
    },
    // private
    doFormUpload: function (o, ps, url) {
        var id = Ext.id();
        var frame = document.createElement('iframe');
        frame.id = id;
        frame.name = id;
        frame.className = 'x-hidden';
        if (Ext.isIE) {
            frame.src = Ext.SSL_SECURE_URL;
        }
        document.body.appendChild(frame);
        if (Ext.isIE) {
            document.frames[id].name = id;
        }
        var form = Ext.getDom(o.form),
            buf = {
                target: form.target,
                method: form.method,
                encoding: form.encoding,
                enctype: form.enctype,
                action: form.action
            };
        form.target = id;
        form.method = 'POST';
        form.enctype = form.encoding = 'multipart/form-data';
        if (url) {
            form.action = url;
        }
        var hiddens, hd;
        if (ps) { // add dynamic params
            hiddens = [];
            ps = Ext.urlDecode(ps, false);
            for (var k in ps) {
                if (ps.hasOwnProperty(k)) {
                    hd = document.createElement('input');
                    hd.type = 'hidden';
                    hd.name = k;
                    hd.value = ps[k];
                    form.appendChild(hd);
                    hiddens.push(hd);
                }
            }
        }

        function cb() {
            var r = { // bogus response object
                responseText: '',
                responseXML: null
            };
            r.argument = o ? o.argument : null;
            try { //
                var doc;
                if (Ext.isIE) {
                    doc = frame.contentWindow.document;
                } else {
                    doc = (frame.contentDocument || window.frames[id].document);
                }
                if (doc && doc.body) {
                    r.responseText = doc.body.innerHTML;
                }
                if (doc && doc.XMLDocument) {
                    r.responseXML = doc.XMLDocument;
                } else {
                    r.responseXML = doc;
                }
            } catch (e) {
                // ignore
            }
            Ext.EventManager.removeListener(frame, 'load', cb, this);
            this.fireEvent("requestcomplete", this, r, o);
            Ext.callback(o.success, o.scope, [r, o]);
            Ext.callback(o.callback, o.scope, [o, true, r]);
            setTimeout(function () {
                Ext.removeNode(frame);
            }, 100);
        }
        Ext.EventManager.on(frame, 'load', cb, this);
        form.submit();
        form.target = buf.target;
        form.method = buf.method;
        form.enctype = buf.enctype;
        form.encoding = buf.encoding;
        form.action = buf.action;

        if (hiddens) { // remove dynamic params
            for (var i = 0, len = hiddens.length; i < len; i++) {
                Ext.removeNode(hiddens[i]);
            }
        }
    }
});
Ext.Ajax = new Ext.data.Connection({



    autoAbort: false,

    serializeForm: function (form) {
        return Ext.lib.Ajax.serializeForm(form);
    }
});
Vps.Connection = Ext.extend(Ext.data.Connection, {
    _progressData: {},

    request: function (options) {
        Vps.requestSentSinceLastKeepAlive = true;
        Vps.Connection.runningRequests++;
        if (options.mask) {
            if (options.mask instanceof Ext.Element) {
                options.mask.mask(options.maskText || trl('Laden...'));
            } else {
                if (Vps.Connection.masks == 0) {
                    if (Ext.get('loading')) {
                        Ext.getBody().mask();
                    } else {
                        Ext.getBody().mask(options.maskText || trl('Laden...'));
                    }
                }
                Vps.Connection.masks++;
            }
        }
        if (options.url.match(/[\/a-zA-Z0-9]*\/json[a-zA-Z0-9\-]+(\/|\?|)/)) {
            options.vpsCallback = {
                success: options.success,
                failure: options.failure,
                callback: options.callback,
                scope: options.scope
            };
            options.success = this.vpsJsonSuccess;
            options.failure = this.vpsJsonFailure;
            options.callback = this.vpsCallback;
            options.scope = this;
        } else {
            options.vpsCallback = {
                success: options.success,
                failure: options.failure,
                callback: options.callback,
                scope: options.scope
            };
            options.success = this.vpsNoJsonSuccess;
            options.failure = this.vpsNoJsonFailure;
            options.callback = this.vpsCallback;
            options.scope = this;
        }
        if (!options.params) options.params = {};
        options.params.application_max_assets_mtime = Vps.application.maxAssetsMTime;
        if (!options.url.match(':\/\/')) {
            //absolute url incl. http:// erstellen
            //wird benötigt wenn fkt über mozrepl aufgerufen wird
            var u = location.protocol + '/' + '/' + location.host;
            if (options.url.substr(0, 1) == '/') {
                options.url = u + options.url;
            } else {
                options.url = u + '/' + options.url;
            }
        }
        if (options.progress) {
            var progressNum = Math.floor(Math.random() * 1000000000) + 1;
            options.params.progressNum = progressNum;
        }
        var ret = Vps.Connection.superclass.request.call(this, options);
        if (options.progress) {
            this._showProgress(options);
        }
        return ret;
    },
    _showProgress: function (options) {
        var progressNum = options.params.progressNum;
        this._progressData[progressNum] = {
            progressBar: this._createProgressDialog({
                title: options.progressTitle || trl('Progress'),
                transId: this.transId,
                requestOptions: options
            }),
            breakStatusRequests: false
        };
        this._progressData[progressNum].progressBar.updateProgress(0, '0%', '');
        this._doProgressStatusRequest.defer(1500, this, [progressNum]);
    },
    _doProgressStatusRequest: function (progressNum) {
        this.request({
            url: '/vps/json-progress-status',
            params: {
                progressNum: progressNum
            },
            success: function (response, options, r) {
                var progressNum = options.params.progressNum;
                if (!this._progressData[progressNum]) return;
                if (typeof r.finished != 'undefined') {
                    if (r.finished) {
                        this._progressData[progressNum].progressBar.updateProgress(
                            1, '100%', trl('Finished')
                        );
                        return;
                    }
                    this._progressData[progressNum].progressBar.updateProgress(
                        r.percent / 100,
                        Math.floor(r.percent) + '%',
                        r.text ? r.text : ''
                    );
                }
                if (!this._progressData[progressNum].breakStatusRequests) {
                    // recursing
                    this._doProgressStatusRequest.defer(500, this, [progressNum]);
                }
            },
            scope: this
        });
    },
    _createProgressDialog: function (cfg) {
        var progressBar = new Ext.ProgressBar({
            text: '0%',
            animate: true
        });
        cfg = Ext.applyIf(cfg, {
            title: trl('Progress'),
            autoCreate: true,
            resizable: false,
            constrain: true,
            constrainHeader: true,
            minimizable: false,
            maximizable: false,
            stateful: false,
            modal: true,
            shim: true,
            buttonAlign: "center",
            width: 400,
            plain: true,
            footer: true,
            closable: false
        });
        var dlg = new Ext.Window(cfg);
        if (typeof cfg.showCancel == 'undefined' || cfg.showCancel) {
            dlg.addButton({
                text: trl('Abbrechen')
            }, (function (dialog) {
                Ext.Ajax.abort(dialog.transId);
                var responseObject = Ext.lib.Ajax.createExceptionObject(
                    dialog.transId, null, true
                );
                Ext.callback(
                    dialog.requestOptions.vpsCallback.failure,
                    dialog.requestOptions.vpsCallback.scope, [responseObject, dialog.requestOptions]
                );
                dialog.requestOptions.callback.call(
                    this,
                    dialog.requestOptions,
                    false,
                    responseObject
                );
            }).createDelegate(this, [dlg]));
        }
        dlg.render(document.body);
        dlg.myEls = {};
        dlg.myEls.bodyEl = dlg.body.createChild({
            html: '<div class="vps-progress-content"><span class="vps-progress-text"></span><br /></div>'
        });
        dlg.myEls.bodyEl.addClass('vps-progress-window');
        dlg.myEls.msgEl = Ext.get(dlg.myEls.bodyEl.dom.childNodes[0].firstChild);
        dlg.progressBar = new Ext.ProgressBar({
            renderTo: dlg.myEls.bodyEl,
            text: '0%',
            animate: true
        });
        dlg.myEls.bodyEl.createChild({
            cls: 'x-clear'
        });
        dlg.updateProgress = function (num, progressBarText, text) {
            this.progressBar.updateProgress(num, progressBarText, true);
            this.myEls.msgEl.update(text || '&#160;');
        };
        dlg.show();
        return dlg;
    },
    repeatRequest: function (options) {
        Vps.Connection.runningRequests++;
        delete options.vpsIsSuccess;
        Vps.Connection.superclass.request.call(this, options);
        if (options.progress) {
            this._showProgress(options);
        }
    },
    vpsJsonSuccess: function (response, options) {
        if (!options.ignoreErrors) {
            options.vpsIsSuccess = false;
            options.vpsLogin = false;
            var errorMsg = false;
            var encParams;
            if (typeof options.params == "string") {
                encParams = options.params;
            } else {
                encParams = Ext.urlEncode(options.params);
            }
            try {
                if (!response.responseText) {
                    errorMsg = 'response is empty';
                } else {
                    var r = Ext.decode(response.responseText);
                }
            } catch (e) {
                errorMsg = e.toString() + ': <br />' + response.responseText;
                var errorMsgTitle = 'Javascript Parse Exception';
            }
            if (Vps.Debug.querylog && r && r.requestNum) {
                var rm = location.protocol + '/' + '/' + location.host;
                var url = options.url;
                if (url.substr(0, rm.length) == rm) {
                    url = url.substr(rm.length);
                }
                var data = [
                    [new Date(), url, encParams, r.requestNum]
                ];
                Vps.Debug.requestsStore.loadData(data, true);
            }
            if (!errorMsg && r.exception) {
                var p;
                if (typeof options.params == "string") {
                    p = options.params;
                } else {
                    p = Ext.urlEncode(options.params);
                }
                errorMsg = '<pre>' + r.exception + '</pre>';
                var errorMsgTitle = 'PHP Exception';
            }
            if (errorMsg && !options.ignoreErrors) {
                errorMsg = '<a href="' + options.url + '?' + encParams + '">request-url</a><br />' + errorMsg;
                var sendMail = !r || !r.exception;
                if (options.errorText) {
                    errorText = options.errorText;
                } else {
                    errorText = null;
                }
                Vps.handleError({
                    url: options.url,
                    message: errorMsg,
                    title: errorMsgTitle,
                    mail: sendMail,
                    errorText: errorText,
                    checkRetry: false,
                    retry: function () {
                        this.connection.repeatRequest(this.options);
                    },
                    abort: function () {
                        Ext.callback(this.options.vpsCallback.failure, this.options.vpsCallback.scope, [this.response, this.options]);
                    },
                    scope: {
                        connection: this,
                        options: options,
                        response: response
                    }
                });
                return;
            }
            if (!r.success && !options.ignoreErrors) {
                if (r.wrongversion) {
                    Ext.Msg.alert(trl('Fehler - falsche Version.'),
                        trl('Aufgrund eines Updates muss die Anwendung neu geladen werden.'),
                        function () {
                            location.reload();
                        });
                    Ext.callback(options.vpsCallback.failure, options.vpsCallback.scope, [response, options]);
                    return;
                }
                if (r.login) {
                    options.vpsLogin = true;
                    var dlg = new Vps.User.Login.Dialog({
                        message: r.message,
                        success: function () {
                            //redo action...
                            this.repeatRequest(options);
                        },
                        scope: this
                    });
                    Ext.getBody().unmask();
                    dlg.showLogin();
                    return;
                }
                if (r.error) {
                    Ext.Msg.alert(trl('Fehler'), r.error);
                } else {
                    Ext.Msg.alert(trl('Fehler'), trl("Ein Server Fehler ist aufgetreten."));
                }
                Ext.callback(options.vpsCallback.failure, options.vpsCallback.scope, [response, options]);
                return;
            }
            options.vpsIsSuccess = true;
            if (options.vpsCallback.success) {
                options.vpsCallback.success.call(options.vpsCallback.scope, response, options, r);
            }
        }
    },
    vpsNoJsonSuccess: function (response, options) {
        options.vpsIsSuccess = true;
        if (options.vpsCallback.success) {
            options.vpsCallback.success.call(options.vpsCallback.scope, response, options);
        }
    },
    vpsNoJsonFailure: function (response, options) {
        options.vpsIsSuccess = false;
        if (options.vpsCallback.failure) {
            options.vpsCallback.failure.call(options.vpsCallback.scope, response, options);
        }
    },
    vpsJsonFailure: function (response, options) {
        if (!options.ignoreErrors) {
            options.vpsIsSuccess = false;
            errorMsgTitle = trl('Fehler');
            if (options.errorText) {
                errorText = options.errorText;
                errorMsg = options.errorText;
            } else {
                errorMsg = trl("Ein Verbindungsfehler ist aufgetreten.");
                errorText = null;
            }
            if (!options.ignoreErrors) {
                Vps.handleError({
                    url: options.url,
                    message: errorMsg,
                    title: errorMsgTitle,
                    errorText: errorText,
                    mail: false,
                    checkRetry: true,
                    retry: function () {
                        this.repeatRequest(options);
                    },
                    abort: function () {
                        Ext.callback(options.vpsCallback.failure, options.vpsCallback.scope, [response, options]);
                    },
                    scope: this
                });
                Ext.callback(options.vpsCallback.failure, options.vpsCallback.scope, [response, options]);
            }
            return;
        }
    },
    vpsCallback: function (options, success, response) {
        //wenn login-fenster angezeigt wird keinen callback aufrufen - weil der request
        //wird ja erneut gesendet und da dann der callback aufgerufen.
        if (options.vpsLogin) return;
        if (options.mask) {
            if (options.mask instanceof Ext.Element) {
                options.mask.unmask();
            } else {
                Vps.Connection.masks--;
                if (Vps.Connection.masks == 0) {
                    Ext.getBody().unmask();
                    if (Ext.get('loading')) {
                        Ext.get('loading').fadeOut({
                            remove: true
                        });
                    }
                }
            }
        }
        if (options.progress) {
            this._progressData[options.params.progressNum].progressBar.hide();
            delete this._progressData[options.params.progressNum];
        }
        if (success && !options.vpsIsSuccess) {
            success = false;
        }
        Ext.callback(options.vpsCallback.callback, options.vpsCallback.scope, [options, success, response]);
        Vps.Connection.runningRequests--;
    }
});
Vps.Connection.masks = 0; //static var that hols number of masked requests
Vps.Connection.runningRequests = 0;
Ext.Ajax = new Vps.Connection({

    autoAbort: false,

    serializeForm: function (form) {
        return Ext.lib.Ajax.serializeForm(form);
    }
});
Vps.GoogleMap.MapCoords = Ext.extend(Vps.GoogleMap.Map, {
    useFrom: function (Placemark, rewriteInput) {
        if (typeof Placemark != 'object') {
            Placemark = this.suggestPlacemarks[Placemark];
        }
        var point = new GLatLng(Placemark.Point.coordinates[1], Placemark.Point.coordinates[0]);
        this.gmap.setCenter(point, 13);
        this.markers[0].setPoint(point);
        Vpc.Advanced.GoogleMapCoords.showLatLng(this.markers[0]);
    }
});
Ext.namespace('Vpc.Advanced.GoogleMapCoords');
Vpc.Advanced.GoogleMapCoords.renderedMaps = [];
Vpc.Advanced.GoogleMapCoords.showLatLng = function (marker) {
    var pnt = marker.getPosition();
    pnt.y = Math.round(pnt.lat() * 100000000) / 100000000;
    pnt.x = Math.round(pnt.lng() * 100000000) / 100000000;
    marker.infoWindow = new google.maps.InfoWindow();
    marker.infoWindow.setContent(
        '<div class="infoWindow"><p>' + '<strong>' + marker.language.moveInfo + '</strong>' + '<br />' + marker.language.lat + ': <input class="inputLat" type="text" value="' + pnt.y + '"/>' + '<br />' + marker.language.lng + ': <input class="inputLng" type="text" value="' + pnt.x + '"/>' + '<br />' + marker.language.seaHeight + ': <input class="seaHeight" type="text" name="seaHeight" id="seaHeight" value="48 m"/></p></div>' //hardcodiert auf New York
    );
    marker.infoWindow.open(marker.map, marker);
    var positionalRequest = {
        locations: [pnt]
    }
    marker.elevator.getElevationForLocations(positionalRequest, function (results, status) {
        if (status == google.maps.ElevationStatus.OK) {
            this.seaHeightText = '';
            if (results[0]) {
                this.seaHeightText = Math.round(results[0].elevation) + ' m';
            }
            var seaHeightEl = Ext.get('seaHeight');
            if (seaHeightEl) {
                seaHeightEl.set({
                    value: this.seaHeightText
                });
            }
        }
    });
};
Vpc.Advanced.GoogleMapCoords.hideLatLng = function (marker) {
    marker.infoWindow.close();
};
Vpc.Advanced.GoogleMapCoords.renderMap = function (map) {
    if (Vpc.Advanced.GoogleMapCoords.renderedMaps.indexOf(map) != -1) return;
    Vpc.Advanced.GoogleMapCoords.renderedMaps.push(map);
    var mapContainer = new Ext.Element(map);
    var cfg = mapContainer.down(".options", true);
    if (!cfg) return;
    cfg = Ext.decode(cfg.value);
    cfg.mapContainer = mapContainer;
    var myMap = new Vps.GoogleMap.MapCoords(cfg);
    Vps.GoogleMap.load(function () {
        this.show();
        var geocoder = new google.maps.Geocoder();
        // Create the search box and link it to the UI element.
        var input = (
            document.getElementById('pac-input'));
        this.gmap.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        var searchBox = new google.maps.places.SearchBox(
            (input));
        // Listen for the event fired when the user selects an item from the
        // pick list. Retrieve the matching places for that item.
        var _placesChanged = function (searchBox) {
            var places = searchBox.getPlaces();
            // debugger;
            for (var i = 0, place; place = places[i]; i++) {
                var image = {
                    url: place.icon,
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(25, 25)
                };
                marker.infoWindow.close();
                marker.setPosition(place.geometry.location);
                this.gmap.setCenter(place.geometry.location);
                Vpc.Advanced.GoogleMapCoords.showLatLng(marker);
                break;
            }
        }
        google.maps.event.addListener(searchBox, 'places_changed', _placesChanged.createDelegate(
            this, [searchBox]
        ));
        var marker = this.markers[0];
        marker.setDraggable(true);
        marker.setAnimation(google.maps.Animation.DROP);
        marker.language = this.config.language;
        marker.elevator = new google.maps.ElevationService();
        google.maps.event.addListener(marker, 'dragstart', function () {
            this.seaHeightText = '';
            Vpc.Advanced.GoogleMapCoords.hideLatLng(this);
        });
        google.maps.event.addListener(marker, 'dragend', function () {
            Vpc.Advanced.GoogleMapCoords.showLatLng(this);
        });
        google.maps.event.addListener(this.gmap, 'click', function (response) {
            Vpc.Advanced.GoogleMapCoords.hideLatLng(marker);
            var clickedPosition = new google.maps.LatLng(parseFloat(response.latLng.lat()), parseFloat(response.latLng.lng()));
            marker.setPosition(clickedPosition);
            document.getElementById('map-zb').value = clickedPosition;
            Vpc.Advanced.GoogleMapCoords.showLatLng(marker);
        });
        Vpc.Advanced.GoogleMapCoords.showLatLng(marker);
    }, myMap);
    return myMap;
};
Vps.onContentReady(function () {
    var maps = Ext.DomQuery.select('div.vpcMapCoordinatesAdvancedGoogleMapCoords');
    Ext.each(maps, function (map) {
        Vpc.Advanced.GoogleMapCoords.renderMap(map);
    });
});
// um flackern zu unterbinden
document.write('<style type="text/css"> div.vpsSwitchDisplay div.switchContent { display: none; } </style>');
Vps.onContentReady(function () {
    var els = Ext.query('div.vpsSwitchDisplay');
    els.forEach(function (el) {
        if (!el.switchDisplayObject) {
            el = Ext.get(el);
            el.switchDisplayObject = new Vps.Switch.Display(el);
        }
    });
});
Vps.Switch.Display = function (el) {
    this.addEvents({
        'beforeOpen': true,
        'beforeClose': true,
        'opened': true,
        'closed': true
    });
    this._lockAnimation = false;
    this.el = el;
    this.switchLink = Ext.get(Ext.query('.switchLink', this.el.dom)[0]);
    this.switchContent = Ext.get(Ext.query('.switchContent', this.el.dom)[0]);
    this.vpsSwitchCloseLink = Ext.query('.switchCloseLink', this.el.dom);
    if (this.vpsSwitchCloseLink.length) {
        this.vpsSwitchCloseLink = Ext.get(this.vpsSwitchCloseLink[0]);
    } else {
        this.vpsSwitchCloseLink = false;
    }
    // durch unterbinden von flackern (ganz oben) muss das auf block
    // gesetzt werden, damit die hoehe gemessen werden kann
    this.switchContent.setStyle('display', 'block');
    this.switchContent.scaleHeight = this.switchContent.getHeight();
    this.switchContent.setHeight(0);
    // und schnell wieder auf 'none' bevors wer merkt :)
    this.switchContent.setStyle('display', 'none');
    // if it is important, show on startup
    if (this.switchContent.child('.vpsImportant')) {
        this.switchContent.setStyle('display', 'block');
        this.switchContent.setStyle('height', 'auto');
        this.switchLink.addClass('switchLinkOpened');
        if (Ext.isIE6) {
            this.switchContent.setWidth(this.switchContent.getWidth());
        }
    }
    if (this.switchLink && this.switchContent) {
        Ext.EventManager.addListener(this.switchLink, 'click', function (e) {
            if (this.switchLink.hasClass('switchLinkOpened')) {
                this.doClose();
            } else {
                this.doOpen();
            }
        }, this, {
            stopEvent: true
        });
    }
    if (this.vpsSwitchCloseLink) {
        Ext.EventManager.addListener(this.vpsSwitchCloseLink, 'click', function (e) {
            this.doClose();
        }, this, {
            stopEvent: true
        });
    }
};
Ext.extend(Vps.Switch.Display, Ext.util.Observable, {
    doClose: function () {
        if (this._lockAnimation) return;
        this._lockAnimation = true;
        this.fireEvent('beforeClose', this);
        this.switchContent.scaleHeight = this.switchContent.getHeight();
        this.switchContent.scale(undefined, 0, {
            easing: 'easeOut',
            duration: .5,
            afterStyle: "display:none;",
            callback: function () {
                this.fireEvent('closed', this);
                this._lockAnimation = false;
            },
            scope: this
        });
        this.switchLink.removeClass('switchLinkOpened');
    },
    doOpen: function () {
        if (this._lockAnimation) return;
        this._lockAnimation = true;
        this.fireEvent('beforeOpen', this);
        this.switchContent.setStyle('display', 'block');
        this.switchContent.scale(undefined, this.switchContent.scaleHeight, {
            easing: 'easeOut',
            duration: .5,
            afterStyle: "display:block;height:auto;",
            callback: function () {
                this.fireEvent('opened', this);
                if (Ext.isIE6) {
                    this.switchContent.setWidth(this.switchContent.getWidth());
                }
                this._lockAnimation = false;
            },
            scope: this
        });
        this.switchLink.addClass('switchLinkOpened');
    }
});
if (Ext && Ext.UpdateManager && Ext.UpdateManager.defaults) {
    Ext.UpdateManager.defaults.indicatorText = '<div class="loading-indicator">' + trl('Laden...') + '</div>';
}
if (Ext && Ext.View) {
    Ext.View.prototype.emptyText = "";
}
if (Ext && Ext.grid.Grid) {
    Ext.grid.Grid.prototype.ddText = trl("{0} markierte Zeile(n)");
}
if (Ext && Ext.TabPanelItem) {
    Ext.TabPanelItem.prototype.closeText = trl("Schließt diesen tab");
}
if (Ext && Ext.form.Field) {
    Ext.form.Field.prototype.invalidText = trl("Wert in diesem Feld ist ungültig");
}
if (Ext && Ext.LoadMask) {
    Ext.LoadMask.prototype.msg = trl("Laden...");
}
Date.monthNames = [
    trl("Jänner"),
    trl("Februar"),
    trl("März"),
    trl("April"),
    trl("Mai"),
    trl("Juni"),
    trl("Juli"),
    trl("August"),
    trl("September"),
    trl("Oktober"),
    trl("November"),
    trl("Dezember")
];
Date.getShortMonthName = function (month) {
    return Date.monthNames[month].substring(0, 3);
};
Date.monthNumbers = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11
};
Date.getMonthNumber = function (name) {
    return Date.monthNumbers[name.substring(0, 1).toUpperCase() + name.substring(1, 3).toLowerCase()];
};
Date.dayNames = [
    trl("Sonntag"),
    trl("Montag"),
    trl("Dienstag"),
    trl("Mittwoch"),
    trl("Donnerstag"),
    trl("Freitag"),
    "Saturday"
];
Date.getShortDayName = function (day) {
    return Date.dayNames[day].substring(0, 3);
};
if (Ext && Ext.MessageBox) {
    Ext.MessageBox.buttonText = {
        ok: trl("OK"),
        cancel: trl("Abbrechen"),
        yes: trl("Ja"),
        no: trl("Nein")
    };
}
//Auskommentiert da es beim Datum Probleme gegeben hat
if (Ext && Ext.DatePicker) {
    Ext.apply(Ext.DatePicker.prototype, {
        todayText: trl("Heute"),
        minText: trl("Dieses Datum ist vor dem Mindestdatum"),
        maxText: trl("Dieses Datum ist nach dem Maximaldatum"),
        disabledDaysText: "",
        disabledDatesText: "",
        monthNames: Date.monthNames,
        dayNames: Date.dayNames,
        nextText: trl('nächstes Monat (Control + ➝)'),
        prevText: trl('letztes Monat (Control + ←)'),
        monthYearText: trl('Wählen Sie ein Monat (Control + ↑/↓ um Jahre zu bewegen)'),
        todayTip: trl("{0} (Leertaste)"),
        format: trl("m/t/j"),
        okText: "&#160;" + trl('OK') + "&#160;",
        cancelText: trl("Abbrechen"),
        startDay: 0
    });
}
if (Ext && Ext.PagingToolbar) {
    Ext.apply(Ext.PagingToolbar.prototype, {
        beforePageText: trl("Seite"),
        afterPageText: trl("von {0}"),
        firstText: trl("Erste Seite"),
        prevText: trl("Vorige Seite"),
        nextText: trl("Nächste Seite"),
        lastText: trl("Letzte Seite"),
        refreshText: trl("Neu laden"),
        displayMsg: trl("Zeige {0} - {1} von {2}"),
        emptyMsg: trl('Keine Daten zur Anzeige vorhanden')
    });
}
if (Ext && Ext.form.TextField) {
    Ext.apply(Ext.form.TextField.prototype, {
        minLengthText: trl("Die Mindestlänge für dieses Feld ist {0}"),
        maxLengthText: trl("Die Maximallänge für dieses Feld ist {0}"),
        blankText: trl("Dieses Feld ist erforderlich"),
        regexText: "",
        emptyText: null
    });
}
if (Ext && Ext.form.NumberField) {
    Ext.apply(Ext.form.NumberField.prototype, {
        minText: trl("Der Mindestwert für dieses Feld ist {0}"),
        maxText: trl("Der Maximalwert für dieses Feld ist {0}"),
        nanText: trl("{0} ist keine gültige Nummer.")
    });
}
if (Ext && Ext.form.DateField) {
    Ext.apply(Ext.form.DateField.prototype, {
        disabledDaysText: trl("Ausgeblendet"),
        disabledDatesText: trl("Ausgeblendet"),
        minText: trl("Das Datum in diesem Feld muss nach dem {0} sein"),
        maxText: trl("Das Datum in diesem Feld muss vor dem {0} sein"),
        invalidText: trl("{0} ist kein gültiges Datum - es muss im Format {1} sein"),
        format: trl("m/t/j"),
        altFormats: "m/d/Y|m-d-y|m-d-Y|m/d|m-d|md|mdy|mdY|d|Y-m-d"
    });
}
if (Ext && Ext.form.ComboBox) {
    Ext.apply(Ext.form.ComboBox.prototype, {
        loadingText: trl("Laden..."),
        valueNotFoundText: undefined
    });
}
if (Ext && Ext.form.VTypes) {
    Ext.apply(Ext.form.VTypes, {
        emailText: trl('Dieses Feld sollte eine E-Mail Adresse im Format "user@domain.com" enthalten.'),
        urlText: trl('Diese Feld sollte eine Url im Format "http:/' + '/www.domain.com"'),
        alphaText: trl('Dieses Feld sollte nur Zeichen und _ enthalten'),
        alphanumText: trl('Dieses Feld sollte nur Zeichen, Zahlen und _ enthalten')
    });
}
if (Ext && Ext.form.HtmlEditor) {
    Ext.apply(Ext.form.HtmlEditor.prototype, {
        createLinkText: trl('Bitte geben Sie die Webadresse für den Link ein:'),
        buttonTips: {
            bold: {
                title: trl('Fett (Ctrl+B)'),
                text: trl('Schreibt den markierten Text fett.'),
                cls: 'x-html-editor-tip'
            },
            italic: {
                title: trl('Kursiv (Ctrl+I)'),
                text: trl('Schreibt den markierten Text kursiv.'),
                cls: 'x-html-editor-tip'
            },
            underline: {
                title: trl('Unterstreichen (Ctrl+U)'),
                text: trl('Unterstreicht den markierten Text.'),
                cls: 'x-html-editor-tip'
            },
            increasefontsize: {
                title: trl('Text vergrößern.'),
                text: trl('Die Schriftgröße wird vergrößert.'),
                cls: 'x-html-editor-tip'
            },
            decreasefontsize: {
                title: trl('Text verkleinern.'),
                text: trl('Die Schriftgröße wird verkleinern.'),
                cls: 'x-html-editor-tip'
            },
            backcolor: {
                title: trl('Text-Hervorheben Farbe.'),
                text: trl('Wechselt die Hintergund-Farbe des markierten Textes.'),
                cls: 'x-html-editor-tip'
            },
            forecolor: {
                title: trl('Schrift Farbe'),
                text: trl('Wechselt die Farbe des markierten Textes.'),
                cls: 'x-html-editor-tip'
            },
            justifyleft: {
                title: trl('Text links ausrichten.'),
                text: trl('Richtet den Text linksbündig aus.'),
                cls: 'x-html-editor-tip'
            },
            justifycenter: {
                title: trl('Text zentrieren.'),
                text: trl('Richtet den Text zentriert aus.'),
                cls: 'x-html-editor-tip'
            },
            justifyright: {
                title: trl('Text rechts ausrichten.'),
                text: trl('Richtet den Text rechtsbündig aus.'),
                cls: 'x-html-editor-tip'
            },
            insertunorderedlist: {
                title: trl('Aufzählungsliste'),
                text: trl('Eine Nummerierte Liste'),
                cls: 'x-html-editor-tip'
            },
            insertorderedlist: {
                title: trl('Nummerierte Liste'),
                text: trl('Eine Aufzählungsliste beginnen.'),
                cls: 'x-html-editor-tip'
            },
            createlink: {
                title: trl('Hyperlink'),
                text: trl('Erzeugt aus dem markierten Text einen Hyperlink.'),
                cls: 'x-html-editor-tip'
            },
            sourceedit: {
                title: trl('Quellcode editieren'),
                text: trl('Schaltet in den Quellcode-Editier Modus.'),
                cls: 'x-html-editor-tip'
            }
        }
    });
}
if (Ext && Ext.grid.GridView) {
    Ext.apply(Ext.grid.GridView.prototype, {
        sortAscText: trl("Aufsteigend sortieren"),
        sortDescText: trl("Absteigend sortieren"),
        lockText: trl("Spalten sperren"),
        unlockText: trl("Spalten freigeben"),
        columnsText: trl("Spalten")
    });
}
if (Ext && Ext.grid.GroupingView) {
    Ext.apply(Ext.grid.GroupingView.prototype, {
        emptyGroupText: trl('(Keine)'),
        groupByText: trl('Mit diesem Feld gruppieren'),
        showGroupsText: trl('Gruppiert anzeigen')
    });
}
if (Ext && Ext.grid.PropertyColumnModel) {
    Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
        nameText: trl("Name"),
        valueText: trl("Wert"),
        dateFormat: "m/j/Y"
    });
}
if (Ext && Ext.layout && Ext.layout.BorderLayout && Ext.layout.BorderLayout.SplitRegion) {
    Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
        splitTip: trl("Ziehen um die Größe zu verändern."),
        collapsibleSplitTip: trl("Ziehen um die Größe zu verändern. Doppelt klicken um unsichtabr zu machen.")
    });
}