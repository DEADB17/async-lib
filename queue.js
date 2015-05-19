'use strict';

var slice = Array.prototype.slice;

function create(/*listeners*/) {
    var listeners = slice.call(arguments);
    var value;

    function set(val) {
        var listener, ret;
        if (arguments.length > 0) { value = val; }
        if (listeners.length > 0) {
            listener = listeners.shift();
            if (typeof listener === 'function') {
                ret = listener(value, set);
                if (ret !== set) {
                    set(ret);
                }
            } else {
                set(listener);
            }
        }
    }

    return function add(/*listeners*/) {
        var isSettled;
        if (arguments.length > 0) {
            isSettled = listeners.length < 1;
            listeners.push.apply(listeners, slice.call(arguments));
            if (isSettled) { set(value); }
        }
        return add;
    };
}

module.exports = create;
