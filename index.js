'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const Crypto = require("crypto");
const globalContainer = {};
const sInstance = Symbol.for('class.helper instance');
const sPrivate = Symbol.for('class.helper private');
const HashList = {
    'md5': (str) => Crypto.createHash('md5').update(str).digest('hex'),
    'xxhash32': (str) => require('xxhashjs').h32(str, 0xABCD).toString(16),
    'xxhash64': (str) => require('xxhashjs').h64(str, 0xABCD).toString(16)
};
let HashAlgorithm = HashList.md5; // default
function getHashKey(args) {
    let key = args.join('\n');
    try {
        key = HashAlgorithm(JSON.stringify(args));
    }
    catch (e) { }
    return key;
}
function __getInstance(cls, withoutContainer, container, ...args) {
    const key = getHashKey(args);
    container[sInstance] = container[sInstance] || {};
    container[sInstance][cls.name] = container[sInstance][cls.name] || {};
    const instance = container[sInstance][cls.name][key] = container[sInstance][cls.name][key] ||
        (withoutContainer ?
            new cls(...args) :
            new cls(container, ...args));
    return instance;
}
function __clearInstance(cls, container, ...args) {
    const key = getHashKey(args);
    container[sInstance] = container[sInstance] || {};
    container[sInstance][cls.name] = container[sInstance][cls.name] || {};
    delete container[sInstance][cls.name][key];
    return true;
}
class ClassHelper {
    static getInstance(container, ...args) {
        return __getInstance(this, false, container, ...args);
    }
    static getAsync(container, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            return __getInstance(this, false, container, ...args);
        });
    }
    static getInstanceWC(container, ...args) {
        return __getInstance(this, true, container || {}, ...args);
    }
    static getInstanceGlobal(...args) {
        return __getInstance(this, true, globalContainer, ...args);
    }
    static clearInstance(container, ...args) {
        return __clearInstance(this, container, ...args);
    }
    static changeHashAlgorithm(hash) {
        HashAlgorithm = HashList[String(hash).toLowerCase()] || HashList.md5;
    }
    get private() {
        return this[sPrivate] = this[sPrivate] || {};
    }
}
module.exports = ClassHelper;
//# sourceMappingURL=index.js.map