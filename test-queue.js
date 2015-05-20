'use strict';

var test = require('tape').test;
var queue = require('./queue');

test('queue', function (t) {
    var add;

    t.is(typeof queue(), 'function');

    queue(function f1(val, next, undef) {
        t.is(val, undefined);
        t.is(typeof next, 'function');
        t.is(typeof undef, 'function');
    });

    add = queue('expected',
          function f2(val) {
              t.is(val, 'expected');
              return 'synchronous';
          },
          function f3(val, next) {
              t.is(val, 'synchronous');
              setTimeout(function () {
                  next('delayed');
              }, 1);
          });

    add(function f4(val) {
        t.is(val, 'delayed');
        return 'immediate';
    });

    add(function f5(val, next) {
        t.is(val, 'immediate');
        next('immediate too');
        next('ignored 1');
        next('ignored 2');
        next('ignored 3');
    });

    add(function f6(val, next) {
        t.is(val, 'immediate too');
    });

    add(function f7(val, next) {
        t.fail('should never be called');
    });

    t.end();
});
