'use strict';

const assert = require('assert');
const ClassHelper = require('../index');
const container = {};

class Human extends ClassHelper {
    constructor(container, name) {
        super();
        this.private.name = name;
    }
    get name() { return this.private.name; }
    set name(name) { this.private.name = name; }
}

describe('Test - Singleton check', () => {

    function doCheck() {
        let oJone = Human.getInstance(container, 'Jone');
        let oSteve = Human.getInstance(container, 'Steve');
        let oSteve2 = Human.getInstance(container, 'Steve');

        it('instance check', () => {
            assert.equal(oJone.name, 'Jone');
            assert.equal(oSteve.name, 'Steve');
            assert.equal(oSteve2.name, 'Steve');
        });

        it('instance reference check', () => {
            assert.equal(oSteve.name, oSteve2.name);
            oSteve2.name = 'Jack';
            assert.equal(oSteve.name, 'Jack');
            oSteve.name = 'Steve';
            assert.equal(oSteve2.name, 'Steve');
        });
    }

    describe('MD5', () => {
        ClassHelper.changeHashAlgorithm('md5');
        doCheck();
    });

    describe('xxHash - 32bit', () => {
        ClassHelper.changeHashAlgorithm('xxhash32');
        doCheck();
    });

    describe('xxHash - 64bit', () => {
        ClassHelper.changeHashAlgorithm('xxhash64');
        doCheck();
    });

});

describe('Benchmark - Singleton arguments key generation', () => {

    function doLoop(done) {
        for (let i = 0; i < 10000; i++) {
            let oJone = Human.getInstance(container, 'Jone');
            assert.equal(oJone.name, 'Jone');
        }
        done();
    }

    it('MD5', done => {
        ClassHelper.changeHashAlgorithm('md5');
        doLoop(done);
    });

    it('xxHash - 32bit', done => {
        ClassHelper.changeHashAlgorithm('xxhash32');
        doLoop(done);
    });

    it('xxHash - 64bit', done => {
        ClassHelper.changeHashAlgorithm('xxhash64');
        doLoop(done);
    });

});