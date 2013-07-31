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

    StateMachine.init = function(scope, states,
            callEntryIfTransitBack, callExitIfTransitBack) {
        var fsm;
        scope = scope || {};

        fsm = initFsm(scope, arrayFrom(states));

        scope.handleStateEvent = handleStateEventFactory();
        scope.fsm = fsm;

        return scope;
    };

    var initFsm = function(scope, states) {
        var fsm = {
            scope: scope,
            statesMap: {}
        };
        var state;

        for (var i = 0, len = states.length; i < len; i++) {
            state = initState(states[i]);
            fsm.statesMap[state.fqn] = state;
        }

        return fsm;
    };

    var initState = function initState(config, outerState) {
        var state = {};
        var trans;

        state.name = config.name;
        state.entry = config.entry;
        state.exit = config.exit;

        if (outerState) {
            state.fqn = outerState.fqn + '.' + state.name;
            state.outerState = outerState;
        } else {
            state.fqn = state.name;
        }

        config.transitions = arrayFrom(config.transitions);
        state.transitions = [];
        for (var i = 0, len = config.transitions.length; i < len; i++) {
            trans = config.transitions[i];
            state.transitions[i] = {
                trigger: trans.trigger,
                dest: trans.dest,
                action: trans.action,
                guard: trans.guard
            };
        }

        config.innerStates = arrayFrom(config.innerStates);
        state.innerStates = [];
        for (var i = 0, len = config.innerStates.length; i < len; i++) {
            state.innerStates[i] = initState(config.innerStates[i], state);
        }

        return state;
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

    var functionFrom = function(scope, fn) {
        if (isFunction(fn)) {
            return fn;
        } else if (isString(fn) && isFunction(scope[fn])) {
            return scope[fn];
        }
        return noop;
    };

    var toString = Object.prototype.toString;

    var noop = function() {};

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
