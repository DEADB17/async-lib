'use strict';

var test = require('tape').test;
var queue = require('./queue');
var create = queue.create;
var get = queue.get;
var set = queue.set;

function noop() {}
function noop2() {}

test('create', function (t) {
    t.same(create().listeners, []);
    t.same(create(1).listeners, [1]);
    t.same(create(noop, noop2, '3').listeners, [noop, noop2, '3']);
    t.end();
});

test('get when NONE', function (t) {
    t.same(get(create()).listeners, []);
    t.same(get(create(), 1).listeners, [1]);
    t.same(get(create(), noop, noop2, '3').listeners, [noop, noop2, '3']);
    t.end();
});

test('set sync', function (t) {
    t.same(set(create()).listeners,
           [],
           'no listeners. no value');
    t.same(set(create(noop, noop2)).listeners,
           [noop, noop2],
           'listeners. no value');
    t.same(set(create(1,2,3), 'value'),
           {listeners: [], value: 3},
           'listeners. value');
    t.same(set(create(noop, 'done'), 'value'),
           {listeners: [], value: 'done'},
           'listeners. value');
    t.end();
});

test('set async', function (t) {
    t.plan(9);

    function op1(val, next) {
        t.fail('Should not be called');
        return next;
    }
    t.same(set(create(op1)).listeners,
           [op1],
           'no value');

    function op2(val, next) {
        t.is(val, 'value');
        return next;
    }
    t.same(set(create(op2), 'value'),
           {listeners: [], value: 'value'},
           'with value');
    t.same(set(create(op2, 1), 'value'),
           {listeners: [1], value: 'value'},
           'with value. delayed');

    function op4(val) {
        t.is(val, 'async', 'op4');
        return 'done';
    }
    function op3(val, next, q) {
        setTimeout(function() {
            next('async');
            t.same(q,
                   {listeners: [], value: 'done'},
                   'after delay');
        }, 0);
        t.same(q,
               {listeners: [op4], value: 'value'},
               'op3');
        return next;
    }
    t.same(set(create(op3, op4), 'value'),
           {listeners: [op4], value: 'value'},
           'op3 & op4 delayed');
});
