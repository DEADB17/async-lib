'use strict';

var slice = Array.prototype.slice;

function NONE () {}

function set(q, val) {
    var listener, next, ret;
    if (arguments.length > 1) { q.value = val; }
    if (q.listeners.length > 0 && q.value !== NONE) {
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
    listeners.push.apply(listeners, slice.call(arguments, 1));
    q = set(q, q.value);
    return q;
}

function create(/*listeners*/) {
    return Object.seal({
        listeners: arguments.length ? slice.call(arguments) : [],
        value: NONE,
    });
}

module.exports = {
    create: create,
    get: get,
    set: set,
};
