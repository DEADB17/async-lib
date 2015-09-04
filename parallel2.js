/*eslint curly:0, complexity:0, callback-return:0, no-plusplus:0*/

module.exports = function parallel(producers, doneCallback) {
    'use strict';

    var results = producers && producers.constructor ? new producers.constructor() : {};
    var done = typeof doneCallback === 'function' ? doneCallback : function () {};
    var calledBack = {};
    var pending = 1; // start at 1 instead of 0 to iterate the whole collection once
    var producer, key;

    function makeCallback(key2) {
        return function cb(val /*arguments*/) {
            if (!(key2 in calledBack)) {
                results[key2] = arguments.length > 1 ? Array.prototype.slice.call(arguments) : val;
                calledBack[key2] = --pending;
                if (!pending) {
                    done(results);
                }
            }
        };
    }

    for (key in producers) {
        if (producers.hasOwnProperty(key)) {
            producer = producers[key];
            if (typeof producer === 'function') {
                ++pending;
                producer(makeCallback(key));
            } else {
                results[key] = producer;
            }
        }
    }

    if (!--pending) { done(results); }
};
