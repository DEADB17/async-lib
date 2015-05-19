'use strict';

var slice = Array.prototype.slice;

function create(/*listeners*/) {
    var listeners = slice.call(arguments);
    var value;

    function next(val) {
        if (arguments.length > 0) { value = val; }
        listeners.shift();
        set(value);
    }

    function set(val) {
        var newVal;
        value = val;
        if (listeners.length > 0) {
            newVal = listeners[0];
            if (typeof newVal === 'function') {
                newVal = newVal(value, next);
                if (newVal === next) {
                    return;
                }
            }
            listeners.shift();
            set(newVal);
        }
    }

    function add(/*listeners*/) {
        var isSettled;
        if (arguments.length > 0) {
            isSettled = listeners.length < 1;
            listeners.push.apply(listeners, slice.call(arguments));
            if (isSettled) { set(value); }
        }
        return add;
    }

    if (listeners.length > 0) { set(value); }
    return add;
}

module.exports = create;
