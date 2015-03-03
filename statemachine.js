(function(global) {
    'use strict';

    var prevStateMachine = global.StateMachine;

    var StateMachine = {
        __version__: '0.1.2',
        __license__: 'MIT',
        __author__: 'Ye Liu',
        __contact__: 'yeliu@instast.com',
        __copyright__: 'Copyright (c) 2015 Ye Liu'
    };

    StateMachine.noConflict = function() {
        global.StateMachine = prevStateMachine;
        return this;
    };

    /* ----- StateMachine Functions ----- */

    StateMachine.init = function(host, states,
            callEntryIfTransitBack, callExitIfTransitBack) {
        var fsm;

        switch (arguments.length) {
        case 0:
            host = {};
            states = [];
            break;
        case 1:
            host = host || {};
            /* fall through */
        case 2:
            states = arrayFrom(states || host.states);
            break;
        default:
            break;
        }

        fsm = initFsm(host, states);
        fsm.callEntryIfTransitBack = isBoolean(callEntryIfTransitBack) ?
            callEntryIfTransitBack : true;
        fsm.callExitIfTransitBack = isBoolean(callExitIfTransitBack) ?
            callExitIfTransitBack : true;

        host.fsm = fsm;
        host.handleStateTrigger = handleStateTriggerFactory(fsm);
        host.getCurrentStateName = function() {
            if (fsm.currentState) {
                return fsm.currentState.name;
            }
            return null;
        };
        host.getPreviousStateName = function() {
            if (fsm.previousState) {
                return fsm.previousState.name;
            }
            return null;
        };

        if (states.length > 0) {
            fsm.currentState = getState(fsm, states[0].name);
            doEntryAction(fsm);
        }

        return host;
    };

    var initFsm = function(host, states) {
        var fsm = {
            host: host,
            statesMap: {},
            currentState: null,
            currentStateStack: []
        };

        states = arrayFrom(states);

        for (var i = 0, len = states.length; i < len; i++) {
            initState(fsm.statesMap, states[i]);
        }

        return fsm;
    };

    var initState = function initState(statesMap, config, outerState) {
        if (isString(config)) {
            config = {name: config};
        } else if (!config) {
            config = {};
        }

        if (!isString(config.name)) {
            config.name = 'UnnamedState';
        }

        var state = {
            name: config.name,
            fqn: config.name,
            entry: config.entry,
            exit: config.exit,
            transitions: [],
            outerState: null,
            innerStates: []
        };
        var trans;

        if (outerState) {
            state.fqn = outerState.fqn + '.' + state.name;
            state.outerState = outerState;
        }

        statesMap[state.fqn] = state;

        config.transitions = arrayFrom(config.transitions);
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
        for (i = 0, len = config.innerStates.length; i < len; i++) {
            state.innerStates[i] = initState(statesMap,
                config.innerStates[i], state);
        }

        return state;
    };

    var handleStateTriggerFactory = function(fsm) {
        var host = fsm.host;

        return function handleStateTrigger(trigger, actionArgs, guardArgs) {
            var cur = fsm.currentState;
            var transitions = getTransitions(cur, trigger);
            var trans;
            var next;

            for (var i = 0, len = transitions.length; i < len; i++) {
                trans = transitions[i];
                if (functionApply(trans.guard, host, guardArgs) !== false) {
                    next = getState(fsm, trans.dest);
                    if (next) {
                        functionApply(trans.action, host, actionArgs);
                        if ((next !== cur && next.outerState !== cur) ||
                                (next === cur && fsm.callExitIfTransitBack)) {
                            doExitAction(fsm, cur, next);
                        }
                        (function doChangeState(cur, next) {
                            changeState(fsm, cur, next);
                            if (next !== cur || fsm.callEntryIfTransitBack) {
                                doEntryAction(fsm);
                            }
                            if (next.innerStates.length > 0) {
                                doChangeState(next, next.innerStates[0]);
                            }
                        })(cur, next);
                        break;
                    }
                }
            }
        };
    };

    var getTransitions = function(state, trigger) {
        var result = [];
        var trans;

        if (state) {
            for (var i = 0, len = state.transitions.length; i < len; i++) {
                trans = state.transitions[i];
                if (trans.trigger === trigger) {
                    result.push(trans);
                }
            }
        }

        return result;
    };

    var getState = function getState(fsm, stateName) {
        var state;
        var outer = fsm.currentState ? fsm.currentState.outerState : null;

        if (outer) {
            state = fsm.statesMap[outer.fqn + '.' + stateName];
            if (!state) {
                pushCurrentState(fsm, outer);
                state = getState(fsm, stateName);
                popCurrentState(fsm);
            }
        } else {
            state = fsm.statesMap[stateName];
        }

        return state;
    };

    var pushCurrentState = function(fsm, newCur) {
        fsm.currentStateStack.push(fsm.currentState);
        fsm.currentState = newCur;
    };

    var popCurrentState = function(fsm) {
        fsm.currentState = fsm.currentStateStack.pop();
    };

    var changeState = function(fsm, cur, next) {
        fsm.previousState = cur;
        fsm.currentState = next;
    };

    var doEntryAction = function(fsm) {
        var host = fsm.host;
        var cur = fsm.currentState;

        if (cur) {
            functionApply(cur.entry, host);
            host.handleStateTrigger('.');
        }
    };

    var doExitAction = function doExitAction(fsm, cur, next) {
        var host = fsm.host;
        var outer = cur.outerState;

        functionApply(cur.exit, host);

        if (outer && outer !== next && outer !== next.outerState) {
            doExitAction(fsm, cur.outerState, next);
        }
    };

    /* ----- Helpers ----- */

    var isObject = function(value) {
        return value !== undefined &&
            value !== null &&
            toString.call(value) === '[object Object]';
    };

    var isFunction = function(value) {
        return toString.call(value) === '[object Function]';
    };

    var isString = function(value) {
        return toString.call(value) === '[object String]';
    };

    var isNumber = function(value) {
        return toString.call(value) === '[object Number]';
    };

    var isBoolean = function(value) {
        return toString.call(value) === '[object Boolean]';
    };

    var isArray = Array.isArray || function(value) {
        return toString.call(value) === '[object Array]';
    };

    var isArrayLike = function(value) {
        return isNumber(value.length) &&
            !isObject(value) &&
            !isString(value) &&
            !isFunction(value);
    };

    var arrayFrom = function(value) {
        if (value === undefined || value === null) {
            return [];
        } else if (isArray(value)) {
            return value;
        } else if (isArrayLike(value)) {
            return Array.prototype.slice.call(value, 0);
        }
        return [value];
    };

    var functionFrom = function(fn, scope) {
        if (isFunction(fn)) {
            return fn;
        } else if (isString(fn) && isObject(scope) && isFunction(scope[fn])) {
            return scope[fn];
        }
        return nop;
    };

    var functionApply = function(fn, scope, args) {
        return functionFrom(fn, scope).apply(scope, arrayFrom(args));
    };

    var toString = Object.prototype.toString;

    var nop = function() {};

    /* ----- Export Extra Functions ----- */

    if (global.STATEMACHINE_EXPORT_EXTRA) {
        StateMachine.isObject = isObject;
        StateMachine.isFunction = isFunction;
        StateMachine.isString = isString;
        StateMachine.isNumber = isNumber;
        StateMachine.isBoolean = isBoolean;
        StateMachine.isArray = isArray;
        StateMachine.isArrayLike = isArrayLike;
        StateMachine.arrayFrom = arrayFrom;
        StateMachine.functionFrom = functionFrom;
        StateMachine.functionApply = functionApply;
        StateMachine.nop = nop;

        StateMachine.initFsm = initFsm;
        StateMachine.initState = initState;
        StateMachine.handleStateTriggerFactory = handleStateTriggerFactory;
        StateMachine.getTransitions = getTransitions;
        StateMachine.getState = getState;
        StateMachine.pushCurrentState = pushCurrentState;
        StateMachine.popCurrentState = popCurrentState;
        StateMachine.changeState = changeState;
        StateMachine.doEntryAction = doEntryAction;
        StateMachine.doExitAction = doExitAction;
    }

    /* ----- Export to Global Object ----- */

    if (typeof module !== 'undefined') {            // nodejs
        for (var p in StateMachine) {
            if (StateMachine.hasOwnProperty(p)) {
                exports[p] = StateMachine[p];
            }
        }
    } else if (typeof define !== 'undefined') {     // requirejs
        define(StateMachine);
    } else {
        global.StateMachine = StateMachine;         // browser
    }
})(this);
