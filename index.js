'use strict';

const globalContainer = {};
const sInstance = Symbol.for('class.helper instance');
const sPrivate = Symbol.for('class.helper private');

class ClassHelper {

    static getInstance(container, ...args) { return this._makeInstance(true, container, ...args); }
    static getInstanceWC(container, ...args) { return this._makeInstance(false, container, ...args); }

    static callInstance(container, ...args) {

        return (method, ...callArgs) => Promise.resolve(this.getInstance(container, ...args))
            .then(o => {
                if (typeof o[method] !== 'function')
                    throw new Error(`class.helper.callInstance : undefined method (${this.name}.${method})`);
                return o[method](...callArgs);
            });

    }

    static callInstanceWC(container, ...args) {

        return (method, ...callArgs) => Promise.resolve(this.getInstanceWC(container, ...args))
            .then(o => {
                if (typeof o[method] !== 'function')
                    throw new Error(`class.helper.callInstanceWC : undefined method (${this.name}.${method})`);
                return o[method](...callArgs);
            });

    }

    static getInstanceGlobal(...args) {

        return this.getInstanceWC(globalContainer, ...args);

    }

    static callInstanceGlobal(...args) {

        return this.callInstanceWC(globalContainer, ...args);

    }

    get private() {
        return this[sPrivate] = this[sPrivate] || {};
    }

    static _makeInstance(withContainer, container, ...args) {

        let key = args[0];

        try { key = require('crypto').createHash('md5').update(JSON.stringify(args)).digest('hex'); } catch (e) { }

        container[sInstance] = container[sInstance] || {};
        container[sInstance][this.name] = container[sInstance][this.name] || {};

        return container[sInstance][this.name][key] = container[sInstance][this.name][key] ||
            (
                withContainer ?
                    new this(container, ...args) :
                    new this(...args)
            );

    }

}

module.exports = ClassHelper;
