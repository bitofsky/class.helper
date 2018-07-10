'use strict';

import * as Crypto from 'crypto';
import { NOTINITIALIZED } from 'dns';

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

function __getInstance<T>(cls: { new(...args: any[]): T }, withoutContainer: boolean, container: object, ...args: any[]) {

    const key = getHashKey(args);

    container[sInstance] = container[sInstance] || {};
    container[sInstance][cls.name] = container[sInstance][cls.name] || {};

    const instance = container[sInstance][cls.name][key] = <T>container[sInstance][cls.name][key] ||
        (
            withoutContainer ?
                new cls(...args) :
                new cls(container, ...args)
        );

    return instance;

}

function __clearInstance<T>(cls: { new(...args: any[]): T }, container: object, ...args: any[]) {

    const key = getHashKey(args);

    container[sInstance] = container[sInstance] || {};
    container[sInstance][cls.name] = container[sInstance][cls.name] || {};

    delete container[sInstance][cls.name][key];

    return true;

}

class ClassHelper {

    static getInstance<T>(this: { new(...args: any[]): T }, container: object, ...args: any[]) {
        return __getInstance(this, false, container, ...args)
    }

    static getInstanceWC<T>(container: object, ...args: any[]) {
        return __getInstance(this, true, container || {}, ...args);
    }

    static getInstanceGlobal<T>(...args: any[]) {
        return __getInstance(this, true, globalContainer, ...args);
    }

    static clearInstance<T>(container: object, ...args: any[]) {
        return __clearInstance(this, container, ...args);
    }

    static changeHashAlgorithm(hash: string) {
        HashAlgorithm = HashList[String(hash).toLowerCase()] || HashList.md5;
    }

    get private() {
        return this[sPrivate] = <object>this[sPrivate] || {};
    }

}

export = ClassHelper;
