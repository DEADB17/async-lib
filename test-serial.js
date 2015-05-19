'use strict';

var test = require('tape').test;
var serial = require('./serial');

test('throws if first argument is not Array nor String', function (t) {
    t.throws(function () { serial(undefined); }, TypeError);
    t.throws(function () { serial(null); }, TypeError);
    t.throws(function () { serial(true); }, RangeError);
    t.throws(function () { serial({}); }, RangeError);
    t.throws(function () { serial(1); }, RangeError);
    t.end();
});

test('serial string', function (t) {
    t.plan(1);
    var prods = 'abc';
    var coll = function (result) {
        t.same(result, ['a', 'b', 'c']);
    };
    serial(prods, coll);
});

test('serial array', function (t) {
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
    serial(prods, coll);
});

test('serial array. no collector', function (t) {
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
    serial(prods);
});
