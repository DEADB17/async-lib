'use strict';

function parallel(producers, collect) {
    var isArray = Array.isArray(producers);
    var result = isArray ? [] : {};
    var keys = Object.keys(producers);
    var pending = keys.length;
    var hasCollect = typeof collect === 'function';
    var producer;
    keys.forEach(function (key) {
        producer = producers[key];
        if (typeof producer === 'function') {
            producer(function (val) {
                result[key] = val;
                pending -= 1;
                if (hasCollect && pending === 0) {
                    collect(result);
                }
            }, result, pending, isArray ? +key : key);
        } else {
            result[key] = producer;
            pending -= 1;
            if (hasCollect && pending === 0) {
                collect(result);
            }
        }
    });
}

module.exports = parallel;
