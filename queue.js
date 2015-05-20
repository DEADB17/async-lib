'use strict';

var slice = Array.prototype.slice;

function NONE() {}

module.exports = function (/*listeners*/) {
    var pending = slice.call(arguments);
    var value;

    function set(val) {
        var newVal, caller;
        value = val;
        if (pending.length > 0) {
            newVal = pending[0];
            if (typeof newVal === 'function') {
                caller = newVal;
                newVal = newVal(value, function (val) {
                    if (caller === pending[0]) {
                        if (arguments.length > 0) {
                            value = val;
                        }
                        pending.shift();
                        set(value);
                    }
                }, NONE);
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
