(function(global) {
    'use strict';

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

    StateMachine.init = function(host, states,
            callEntryIfTransitBack, callExitIfTransitBack) {
        var fsm;
        host = host || {};

        fsm = initFsm(host, arrayFrom(states));
        fsm.callEntryIfTransitBack = callEntryIfTransitBack;
        fsm.callExitIfTransitBack = callExitIfTransitBack;

        host.handleStateTrigger = handleStateTriggerFactory(fsm);
        host.fsm = fsm;

        return host;
    };

    var initFsm = function(host, states) {
        var fsm = {
            host: host,
            statesMap: {},
            currentState: null,
            currentStateStack: []
        };
        var state;

        for (var i = 0, len = states.length; i < len; i++) {
            state = initState(states[i]);
            fsm.statesMap[state.fqn] = state;
        }

        return fsm;
    };

    var initState = function initState(config, outerState) {
        var state = {
            name: config.name,
            fqn: config.name,
            entry: config.entry,
            exit: config.exit,
            transitions: [],
            outerState: null,
            innerStates: [],
        };
        var trans;

        if (outerState) {
            state.fqn = outerState.fqn + '.' + state.name;
            state.outerState = outerState;
        }

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
        for (var i = 0, len = config.innerStates.length; i < len; i++) {
            state.innerStates[i] = initState(config.innerStates[i], state);
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
                        if (next !== cur || fsm.callExitIfTransitBack) {
                            doExitAction(fsm, cur, next);
                        }
                        (function doChangeState(cur, next) {
                            changeState(fsm, cur, next);
                            if (next !== cur || fsm.callEntryIfTransitBack()) {
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

    var doEntryAction = function(fsm) {
        var host = fsm.host;

        functionApply(fsm.currentState.entry, host);
        host.handleStateTrigger('.');
    };

    var doExitAction = function doExitAction(fsm, cur, next) {
        var host = fsm.host;

        functionApply(cur.exit, host);

        if (cur.outerState && cur.outerState !== next.outerState) {
            doExitAction(fsm, cur.outerState, next);
        }
    };

    var changeState = function(fsm, cur, next) {
        fsm.previousState = cur;
        fsm.currentState = next;
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

    var functionFrom = function(fn, scope) {
        scope = scope || global;
        if (isFunction(fn)) {
            return fn;
        } else if (isString(fn) && isFunction(scope[fn])) {
            return scope[fn];
        }
        return noop;
    };

    var functionApply = function(fn, scope, args) {
        return functionFrom(fn, scope).apply(scope, arrayFrom(args));
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
