'use strict';

var slice = Array.prototype.slice;

function set(q, val) {
    var listener, next, ret;
    if (arguments.length > 1) { q.value = val; }
    if (q.listeners.length > 0) {
        listener = q.listeners.shift();
        if (typeof listener === 'function') {
            next = set.bind(null, q);
            ret = listener(q.value, next, q);
            if (ret !== next) {
                set(q, ret);
            }
        } else {
            set(q, listener);
        }
    }
    return q;
}

function get(q /*listeners*/) {
    var listeners = q.listeners;
    var isSettled = listeners.length < 1;
    listeners.push.apply(listeners, slice.call(arguments, 1));
    return isSettled ? set(q, q.value) : q;
}

function create(/*listeners*/) {
    return Object.seal({
        listeners: arguments.length ? slice.call(arguments) : [],
        value: undefined,
    });
}

module.exports = {
    create: create,
    get: get,
    set: set,
};
