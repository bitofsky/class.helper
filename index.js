'use strict';
var Crypto = require("crypto");
var globalContainer = {};
var sInstance = Symbol.for('class.helper instance');
var sPrivate = Symbol.for('class.helper private');
var HashList = {
    'md5': function (str) { return Crypto.createHash('md5').update(str).digest('hex'); },
    'xxhash32': function (str) { return require('xxhashjs').h32(str, 0xABCD).toString(16); },
    'xxhash64': function (str) { return require('xxhashjs').h64(str, 0xABCD).toString(16); }
};
var HashAlgorithm = HashList.md5; // default
function getHashKey(args) {
    var key = args.join('\n');
    try {
        key = HashAlgorithm(JSON.stringify(args));
    }
    catch (e) { }
    return key;
}
function __getInstance(cls, withoutContainer, container) {
    var args = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        args[_i - 3] = arguments[_i];
    }
    var key = getHashKey(args);
    container[sInstance] = container[sInstance] || {};
    container[sInstance][cls.name] = container[sInstance][cls.name] || {};
    return container[sInstance][cls.name][key] = container[sInstance][cls.name][key] ||
        (withoutContainer ? new (cls.bind.apply(cls, [void 0].concat(args)))() : new (cls.bind.apply(cls, [void 0, container].concat(args)))());
}
function __clearInstance(cls, container) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    var key = getHashKey(args);
    container[sInstance] = container[sInstance] || {};
    container[sInstance][cls.name] = container[sInstance][cls.name] || {};
    delete container[sInstance][cls.name][key];
    return true;
}
var ClassHelper = /** @class */ (function () {
    function ClassHelper() {
    }
    ClassHelper.getInstance = function (container) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return __getInstance.apply(void 0, [this, false, container].concat(args));
    };
    ClassHelper.getInstanceWC = function (container) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return __getInstance.apply(void 0, [this, true, container || {}].concat(args));
    };
    ClassHelper.getInstanceGlobal = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return __getInstance.apply(void 0, [this, true, globalContainer].concat(args));
    };
    ClassHelper.clearInstance = function (container) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return __clearInstance.apply(void 0, [this, container].concat(args));
    };
    ClassHelper.changeHashAlgorithm = function (hash) {
        HashAlgorithm = HashList[String(hash).toLowerCase()] || HashList.md5;
    };
    Object.defineProperty(ClassHelper.prototype, "private", {
        get: function () {
            return this[sPrivate] = this[sPrivate] || {};
        },
        enumerable: true,
        configurable: true
    });
    return ClassHelper;
}());
module.exports = ClassHelper;
//# sourceMappingURL=index.js.map