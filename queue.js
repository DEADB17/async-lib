'use strict';

var slice = Array.prototype.slice;

function NONE() {}

module.exports = function (/*listeners*/) {
    var pending = slice.call(arguments);
    var value;

    function next(caller, val) {
        if (caller === pending[0]) {
            if (arguments.length > 1) {
                value = val;
            }
            pending.shift();
            set(value);
        }
    }

    function set(val) {
        var newVal;
        value = val;
        if (pending.length > 0) {
            newVal = pending[0];
            if (typeof newVal === 'function') {
                newVal = newVal(value, next.bind(null, newVal), NONE);
                if (newVal === undefined) {
                    return;
                } else if (newVal === NONE) {
                    newVal = undefined;
                }
            }
            pending.shift();
            set(newVal);
        }
    }

    function add(/*listeners*/) {
        var isSettled;
        if (arguments.length > 0) {
            isSettled = pending.length < 1;
            pending.push.apply(pending, slice.call(arguments));
            if (isSettled) {
                set(value);
            }
        }
        return add;
    }

    if (pending.length > 0) {
        set(value);
    }
    return add;
};
