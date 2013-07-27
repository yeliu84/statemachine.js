(function(global) {
    var prevStateMachine = global.StateMachine;

    var StateMachine = global.StateMachine = {
        __version__: '0.0.1',
        __license__: 'MIT',
        __author__: 'Ye Liu',
        __contact__: 'yeliu@instast.com',
        __copyright__: 'Copyright (c) 2013 Ye Liu'
    };

    StateMachine.noConflict = function() {
        global.StateMachine = prevStateMachine;
        return this;
    };

    /* ----- Helpers ----- */

    var isString = function(value) {
        return Object.prototype.toString.call(value) === '[object String]';
    };

    var isFunction = function(value) {
        return Object.prototype.toString.call(value) === '[object Function]';
    };

    var isArray = Array.isArray || function isArray(value) {
        return Object.prototype.toString.call(value) === '[object Array]';
    };

    var isIterable = function(value) {
        return value.length !== undefined && !isString(value) && !isFunction(value);
    };

    var arrayFrom = function(value) {
        if (value === undefined || value === null) {
            return [];
        } else if (isIterable(value)) {
            var result = [];
            for (var i = 0, len = value.length; i < len; i++) {
                result.push(value[i]);
            }
            return result;
        } else if (isArray(value)) {
            return value;
        }
        return [value];
    };

    /* ----- StateMachine Functions ----- */

    StateMachine.init = function(obj, states,
            callEntryIfTransitBack, callExitIfTransitBack) {
        obj = obj || {};
        states = arrayFrom(states);
        return obj;
    };

})(this);
