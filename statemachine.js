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

    /* ----- StateMachine Functions ----- */

    StateMachine.init = function(obj, states,
            callEntryIfTransitBack, callExitIfTransitBack) {
        var fsm;
        obj = obj || {};

        fsm = initFsm(arrayFrom(states));
        fsm.scope = obj;

        obj.handleStateEvent = handleStateEventFactory();
        return obj;
    };

    var initFsm = function(states) {
        var statesMap = {};

        for (var i = 0, len = states.length; i < len; i++) {
            initState(statesMap, states[i]);
        }

        return {
            statesMap: statesMap
        };
    };

    var initState = function(statesMap, config, outerState) {
    };

    var handleStateEventFactory = function() {
        return function handleStateEvent(trigger, actionArgs, guardArgs) {
        };
    };

    /* ----- Helpers ----- */

    var isString = function(value) {
        return toString.call(value) === '[object String]';
    };

    var isNumber = function(value) {
        return toString.call(value) === '[object Number]';
    };

    var isFunction = function(value) {
        return toString.call(value) === '[object Function]';
    };

    var isArray = Array.isArray || function (value) {
        return toString.call(value) === '[object Array]';
    };

    var isIterable = function(value) {
        return isNumber(value.length) && !isString(value) && !isFunction(value);
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

    var toString = Object.prototype.toString;

    /* ----- Export Extra Functions ----- */

    if (global.STATEMACHINE_EXPORT_EXTRA) {
        StateMachine.isString = isString;
        StateMachine.isNumber = isNumber;
        StateMachine.isFunction = isFunction;
        StateMachine.isArray = isArray;
        StateMachine.isIterable = isIterable;
        StateMachine.arrayFrom = arrayFrom;
    }
})(this);
