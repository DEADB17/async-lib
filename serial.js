'use strict';

function next(producers, result, pending, index) {
    var producer;
    if (pending === 0) {
        return result;
    } else {
        producer = producers[index];
        if (typeof producer === 'function') {
            producer(function (val) {
                if (!result.hasOwnProperty(index)) {
                    result[index] = val;
                    next(producers, result, pending -= 1, index += 1);
                }
            }, result, pending, index);
        } else {
            result[index] = producer;
            next(producers, result, pending -= 1, index += 1);
        }
        return result; // not reachable
    }
}

function serial(producers, collect) {
    var result = next(producers, [], producers.length, 0);
    if (typeof collect === 'function') { collect(result); }
}

module.exports = serial;
