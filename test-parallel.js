'use strict';

var test = require('tape').test;
var parallel = require('./parallel');

test('throws if first argument is not Array nor Obj', function (t) {
    t.throws(function () { parallel(undefined); }, TypeError);
    t.throws(function () { parallel(null); }, TypeError);
    t.throws(function () { parallel(true); }, TypeError);
    t.throws(function () { parallel(1); }, TypeError);
    t.throws(function () { parallel('one'); }, TypeError);
    t.end();
});

test('parallel Obj', function (t) {
    t.plan(4);
    var prods = {
        first: function (next, result, pending, key) {
            t.same(result, {});
            t.is(pending, 3);
            t.is(key, 'first');
            next(1);
        },
        second: 2,
        third: 3,
    };
    var coll = function (result) {
        t.same(result, {first: 1, second: 2, third: 3});
    };
    parallel(prods, coll);
});

test('parallel array', function (t) {
    t.plan(4);
    var prods = [
        function (next, result, pending, key) {
            t.same(result, []);
            t.is(pending, 3);
            t.is(key, 0);
            next(1);
        },
        2,
        3,
    ];
    var coll = function (result) {
        t.same(result, [1,2,3]);
    };
    parallel(prods, coll);
});

test('parallel array. no collector', function (t) {
    t.plan(3);
    var prods = [
        1,
        2,
        function (next, result, pending, key) {
            t.same(result, [1, 2]);
            t.is(pending, 1);
            t.is(key, 2);
            next();
        },
    ];
    parallel(prods);
});
