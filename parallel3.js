/*eslint curly:0, complexity:0, callback-return:0, no-plusplus:0*/

module.exports = function parallel(producers, doneCallback, updateCallback) {
    'use strict';

    var results, done, hasUpdate, calledBack, did, len, keys, producer, key, i;

    if (Object.prototype.toString.call(producers) === '[object Array]') {
        len = producers.length;
        results = new Array(len);
    } else {
        len = 0;
        keys = [];
        for (key in producers) {
            if (producers.hasOwnProperty(key)) {
                keys[len++] = key;
            }
        }
        results = {};
    }

    function isFn(obj) { return typeof obj === 'function'; }

    done = isFn(doneCallback) ? doneCallback : function () {};

    if (len < 1) { return done(results); }

    calledBack = {};
    did = 0;
    hasUpdate = isFn(updateCallback);

    function mkUpd(value, key, results, did, total) {
        return {value: value, key: key, results: results, done: did, total: total};
    }

    function makeCallback(key) {
        return function cb(val /*arguments*/) {
            var value;
            if (!(key in calledBack)) {
                value = arguments.length > 1 ? Array.prototype.slice.call(arguments) : val;
                results[key] = value;
                calledBack[key] = ++did;
                if (hasUpdate) { updateCallback(mkUpd(value, key, results, did, len)); }
                if (did >= len) { done(results); }
            }
        };
    }

    for (i = 0; i < len; i++) {
        key = keys ? keys[i] : i;
        producer = producers[key];
        if (isFn(producer)) {
            producer(makeCallback(key));
        } else {
            results[key] = producer;
            if (hasUpdate) { updateCallback(mkUpd(producer, key, results, ++did, len)); }
        }
    }

    if (did >= len) { done(results); }
};
