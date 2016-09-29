'use strict';

const globalContainer = {};
const sInstance = Symbol.for('class.helper instance');
const sPrivate = Symbol.for('class.helper private');

function getInstance(withoutContainer, container, ...args) {

    let key = args[0];

    try { key = require('crypto').createHash('md5').update(JSON.stringify(args)).digest('hex'); } catch (e) { }

    container[sInstance] = container[sInstance] || {};
    container[sInstance][this.name] = container[sInstance][this.name] || {};

    return container[sInstance][this.name][key] = container[sInstance][this.name][key] ||
        (
            withoutContainer ?
                new this(...args) :
                new this(container, ...args)
        );

}

function callInstance(withoutContainer, container, ...args) {
    return (method, ...callArgs) => Promise.resolve(
        getInstance.call(this, withoutContainer, container, ...args)
    ).then(o => {
        if (typeof o[method] !== 'function')
            throw new Error(`class.helper.callInstance : undefined method (${this.name}.${method})`);
        return o[method](...callArgs);
    });
}

class ClassHelper {

    static getInstance(container, ...args) { return getInstance.call(this, false, container, ...args); }
    static callInstance(container, ...args) { return callInstance.call(this, false, container, ...args); }
    static getInstanceWC(container, ...args) { return getInstance.call(this, true, container, ...args); }
    static callInstanceWC(container, ...args) { return callInstance.call(this, true, container, ...args); }
    static getInstanceGlobal(...args) { return getInstance.call(this, true, globalContainer, ...args); }
    static callInstanceGlobal(...args) { return callInstance.call(this, true, globalContainer, ...args); }
    get private() { return this[sPrivate] = this[sPrivate] || {}; }

}

module.exports = ClassHelper;
