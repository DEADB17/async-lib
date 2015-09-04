/*eslint curly:0, complexity:0, callback-return:0, no-plusplus:0*/

var owns = Object.prototype.hasOwnProperty;
var slice = Array.prototype.slice;

function isFn(ob) { return typeof ob === 'function'; }

function isArray(ob) { return Object.prototype.toString.call(ob) === '[object Array]'; }

function isDone(state) { return state.enumed && state.did === state.total; }

function pubState(st) {
    return {
        collection: st.col, key: st.key, results: st.results,
        done: st.did, total: st.enumed ? st.total : undefined
    };
}

function mkCb(state, doneCallback, updateCallback) {
    return function cb(val /*arguments*/) {
        var calledBack = state.calledBack;
        var key = state.key;
        var value;
        if (!(key in calledBack)) {
            calledBack[key] = true;
            value = arguments.length > 1 ? slice.call(arguments) : val;
            state.results[key] = value;
            state.did++;
            if (isFn(updateCallback)) {
                updateCallback(pubState(state));
            }
            if (isDone(state) && isFn(doneCallback)) {
                doneCallback(state.results);
            }
        }
    };
}

module.exports = function parallel(collection, doneCallback, updateCallback) {
    var state = {col: collection, key: undefined, did: 0, calledBack: {}};
    var hasDoneCb = isFn(doneCallback);
    var hasUpdateCb = isFn(updateCallback);
    var len, item, key;

    if (isArray(collection)) {
        len = collection.length;
        state.enumed = true;
        state.results = new Array(len);
        state.total = len;
        if (len < 1) {
            if (hasDoneCb) {
                doneCallback(state.results);
            }
            return;
        }
    } else {
        state.enumed = false;
        state.results = {};
        state.total = 0;
    }

    for (key in collection) {
        if (owns.call(collection, key)) {
            item = collection[key];
            state.key = key;
            if (!state.enumed) { state.total++; }
            if (isFn(item)) {
                item(mkCb(state, doneCallback, updateCallback));
            } else {
                state.results[key] = item;
                state.did++;
                if (hasUpdateCb) {
                    updateCallback(pubState(state));
                }
            }
        }
    }

    state.enumed = true;

    if (isDone(state) && hasDoneCb) {
        doneCallback(state.results);
    }
};
