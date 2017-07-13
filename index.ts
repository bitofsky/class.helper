'use strict';

import * as Crypto from 'crypto';

const globalContainer = {};
const sInstance = Symbol.for('class.helper instance');
const sPrivate = Symbol.for('class.helper private');

const HashList = {
    'md5': (str: string) => Crypto.createHash('md5').update(str).digest('hex'),
    'xxhash32': (str: string) => require('xxhashjs').h32(str, 0xABCD).toString(16),
    'xxhash64': (str: string) => require('xxhashjs').h64(str, 0xABCD).toString(16)
};

let HashAlgorithm = HashList.md5; // default

function getHashKey(args: any[]) {

    let key = args.join('\n');

    try { key = HashAlgorithm(JSON.stringify(args)); } catch (e) { }

    return key;

}

function getInstance(withoutContainer: boolean, container: object, ...args: any[]) {

    let key = getHashKey(args);

    container[sInstance] = container[sInstance] || {};
    container[sInstance][this.name] = container[sInstance][this.name] || {};

    return container[sInstance][this.name][key] = container[sInstance][this.name][key] ||
        (
            withoutContainer ?
                new this(...args) :
                new this(container, ...args)
        );

}

function callInstance(withoutContainer: boolean, container: object, ...args: any[]) {
    return (method: string, ...callArgs: any[]) => Promise.resolve(
        getInstance.call(this, withoutContainer, container, ...args)
    ).then(o => {
        if (typeof o[method] !== 'function')
            throw new Error(`class.helper.callInstance : undefined method (${this.name}.${method})`);
        return o[method](...callArgs);
    });
}

function clearInstance(container: object, ...args: any[]) {

    let key = getHashKey(args);

    container[sInstance] = container[sInstance] || {};
    container[sInstance][this.name] = container[sInstance][this.name] || {};

    delete container[sInstance][this.name][key];

    return true;

}

class ClassHelper {

    static getInstance(container: object, ...args: any[]) { return getInstance.call(this, false, container, ...args); }
    static callInstance(container: object, ...args: any[]) { return callInstance.call(this, false, container, ...args); }
    static getInstanceWC(container: object, ...args: any[]) { return getInstance.call(this, true, container || {}, ...args); }
    static callInstanceWC(container: object, ...args: any[]) { return callInstance.call(this, true, container || {}, ...args); }
    static clearInstance(container: object, ...args: any[]) { return clearInstance.call(this, container, ...args); }
    static getInstanceGlobal(...args: any[]) { return getInstance.call(this, true, globalContainer, ...args); }
    static callInstanceGlobal(...args: any[]) { return callInstance.call(this, true, globalContainer, ...args); }
    get private() { return this[sPrivate] = this[sPrivate] || {}; }
    static changeHashAlgorithm(hash: string) { HashAlgorithm = HashList[String(hash).toLowerCase()] || HashList.md5; }

}

module.exports = ClassHelper;
