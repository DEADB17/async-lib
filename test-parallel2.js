/*eslint func-names:0*/

'use strict';

var test = require('tape').test;
var para = require('./parallel2');

test('as an array', function (t) {
    var a = [
        function (cb) { return cb(1); },
        function (cb) { return cb(2); }
    ];
    para(a, function (val) { t.same(val, [1, 2]); });

    t.end();
});

test('as a dict', function (t) {
    var d = {
        one: function (cb) { return cb(1); },
        two: function (cb) { return cb(2); }
    };
    para(d, function (val) { t.same(val, {one: 1, two: 2}); });

    t.end();
});

test('with multiple callback values', function (t) {
    var a = [
        function (cb) { return cb(1); },
        function (cb) { return cb(2, 3, 4); }
    ];
    para(a, function (val) { t.same(val, [1, [2, 3, 4]]); });

    t.end();
});

test('callback called multiple times', function (t) {
    var a = [
        function (cb) { cb(1); cb(2); cb(3); }
    ];
    para(a, function (val) { t.same(val, [1]); });

    t.end();
});

test('non functions', function (t) {
    para([1, 2], function (val) { t.same(val, [1, 2]); });
    para({one: 1, two: 2}, function (val) { t.same(val, {one: 1, two: 2}); });

    t.end();
});

test('empty and invalid objects', function (t) {
    t.is(para(), undefined);
    para(undefined, function (val) { t.same(val, {}); });
    para(null, function (val) { t.same(val, {}); });
    para(true, function (val) { t.same(val, {}); });
    para(1, function (val) { t.same(val, {}); });
    para('one', function (val) { t.same(val, ['o', 'n', 'e']); });
    para({}, function (val) { t.same(val, {}); });
    para([], function (val) { t.same(val, []); });

    t.end();
});
