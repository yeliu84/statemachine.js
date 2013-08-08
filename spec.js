(function(global) {
    global.STATEMACHINE_EXPORT_EXTRA = true;

    describe('StateMachine', function() {
        it('is defined in global namespace', function() {
            expect(StateMachine).toBeDefined();
        });

        it('contains all extra functions', function() {
            expect(StateMachine.isObject).toBeDefined();
            expect(StateMachine.isFunction).toBeDefined();
            expect(StateMachine.isString).toBeDefined();
            expect(StateMachine.isNumber).toBeDefined();
            expect(StateMachine.isBoolean).toBeDefined();
            expect(StateMachine.isArray).toBeDefined();
            expect(StateMachine.isArrayLike).toBeDefined();
            expect(StateMachine.arrayFrom).toBeDefined();
            expect(StateMachine.functionFrom).toBeDefined();
            expect(StateMachine.functionApply).toBeDefined();
            expect(StateMachine.nop).toBeDefined();

            expect(StateMachine.initFsm).toBeDefined();
            expect(StateMachine.initState).toBeDefined();
            expect(StateMachine.handleStateTriggerFactory).toBeDefined();
            expect(StateMachine.getTransitions).toBeDefined();
            expect(StateMachine.getState).toBeDefined();
            expect(StateMachine.pushCurrentState).toBeDefined();
            expect(StateMachine.popCurrentState).toBeDefined();
            expect(StateMachine.changeState).toBeDefined();
            expect(StateMachine.doEntryAction).toBeDefined();
            expect(StateMachine.doExitAction).toBeDefined();
        });

        /* ----- Helpers ----- */

        describe('isObject', function() {
            it('returns true is value is object', function() {
                expect(StateMachine.isObject({})).toBe(true);
            });

            it('returns false is value is not object', function() {
                expect(StateMachine.isObject('123')).toBe(false);
            });

            it('returns false is value is null', function() {
                expect(StateMachine.isObject(null)).toBe(false);
            });
        });

        describe('isFunction', function() {
            it('returns true is value is function', function() {
                expect(StateMachine.isFunction(function() {})).toBe(true);
            });

            it('returns false is value is not function', function() {
                expect(StateMachine.isFunction('123')).toBe(false);
            });
        });

        describe('isString', function() {
            it('returns true is value is string', function() {
                expect(StateMachine.isString('123')).toBe(true);
            });

            it('returns false is value is not string', function() {
                expect(StateMachine.isString(123)).toBe(false);
            });
        });

        describe('isNumber', function() {
            it('returns true is value is number', function() {
                expect(StateMachine.isNumber(123)).toBe(true);
            });

            it('returns false is value is not number', function() {
                expect(StateMachine.isNumber('123')).toBe(false);
            });
        });

        describe('isBoolean', function() {
            it('returns true is value is boolean', function() {
                expect(StateMachine.isBoolean(false)).toBe(true);
            });

            it('returns false is value is not boolean', function() {
                expect(StateMachine.isBoolean('false')).toBe(false);
            });
        });

        describe('isArray', function() {
            it('returns true is value is array', function() {
                expect(StateMachine.isArray([1, 2, 3])).toBe(true);
            });

            it('returns false is value is not array', function() {
                expect(StateMachine.isArray(123)).toBe(false);
            });
        });

        describe('isArrayLike', function() {
            it('returns true is value is array', function() {
                expect(StateMachine.isArrayLike([1, 2, 3])).toBe(true);
            });

            it('returns true is value is arguments', function() {
                expect(StateMachine.isArrayLike(arguments)).toBe(true);
            });

            it('returns false is value is not array', function() {
                expect(StateMachine.isArrayLike(123)).toBe(false);
            });

            it('returns false is value is object', function() {
                expect(StateMachine.isArrayLike({length: 1})).toBe(false);
            });
        });

        describe('arrayFrom', function() {
            it('returns an empty array if value is undefined or null', function() {
                expect(StateMachine.arrayFrom(undefined)).toEqual([]);
                expect(StateMachine.arrayFrom(null)).toEqual([]);
            });

            it('returns the value if value is array', function() {
                var a = [1, 2, 3];
                expect(StateMachine.arrayFrom(a)).toBe(a);
            });

            it('returns an array if value is array-like', function() {
                (function() {
                    expect(StateMachine.arrayFrom(arguments)).toEqual([1, 2, 3]);
                })(1, 2, 3);
            });
        });

        describe('functionFrom', function() {
            it('returns the same function if value is function', function() {
                var func = function() {
                    return true;
                };
                expect(StateMachine.functionFrom(func)).toBe(func);
            });

            it('returns the function if value is the name of a function of scope', function() {
                var scope = {
                    func: function() {
                        return true;
                    }
                };
                expect(StateMachine.functionFrom('func', scope)).toBe(scope.func);
            });

            it('returns nop if value is not the name of a function in scope', function() {
                var scope = {
                    func: function() {
                        return true;
                    }
                };
                expect(StateMachine.functionFrom('xfunc', scope)).toBe(StateMachine.nop);
            });

            it('returns nop if value is the name of a non-function property in scope', function() {
                var scope = {
                    func: function() {
                        return true;
                    },
                    xfunc: 123
                };
                expect(StateMachine.functionFrom('xfunc', scope)).toBe(StateMachine.nop);
            });

            it('returns nop if value is not a name of any property in scope', function() {
                var scope = {
                    func: function() {
                        return true;
                    },
                    xfunc: 123
                };
                expect(StateMachine.functionFrom('xfuncx', scope)).toBe(StateMachine.nop);
            });

            it('returns nop if value is string but scope is not an object', function() {
                expect(StateMachine.functionFrom('func', 123)).toBe(StateMachine.nop);
            });

            it('returns nop if value is not string or function', function() {
                expect(StateMachine.functionFrom(123)).toBe(StateMachine.nop);
            });
        });

        describe('functionApply', function() {
            it('calls the function and returns the result produced by the function', function() {
                var obj = {
                    func: function() {
                        return 123;
                    }
                };
                var ret;

                spyOn(obj, 'func').andCallThrough();

                ret = StateMachine.functionApply(obj.func);

                expect(obj.func).toHaveBeenCalled();
                expect(ret).toEqual(123);
            });

            it('calls the function with supplied scope', function() {
                var scope = {};
                var func = function() {
                    return this;
                };
                expect(StateMachine.functionApply(func, scope)).toBe(scope);
            });

            it('calls the function with supplied arguments', function() {
                var obj = {
                    func: function() {}
                };

                spyOn(obj, 'func');
                StateMachine.functionApply(obj.func, obj, [123, '123']);

                expect(obj.func).toHaveBeenCalledWith(123, '123');
            });

            it('calls the function with supplied scope and arguments', function() {
                var scope = {};
                var obj = {
                    func: function() {
                        return this;
                    }
                };

                spyOn(obj, 'func').andCallThrough();

                expect(StateMachine.functionApply(obj.func, scope, [123, '123'])).toBe(scope);
                expect(obj.func).toHaveBeenCalledWith(123, '123');
            });

        });

        /* ----- StateMachine Functions ----- */

        describe('initFsm', function() {
            it('creates fsm object from full configuration', function() {
                var host = {};
                var states = [{
                    name: 'A',
                    innerStates: [{
                        name: 'D'
                    }, {
                        name: 'E'
                    }]
                }, {
                    name: 'B'
                }, {
                    name: 'C',
                    innerStates: [{
                        name: 'F'
                    }]
                }];
                var fsm = StateMachine.initFsm(host, states);

                expect(fsm).toBeDefined();
                expect(fsm.host).toBe(host);
                expect(fsm.statesMap instanceof Object).toBe(true);
                expect(fsm.currentState).toBeNull();
                expect(fsm.currentStateStack).toEqual([]);
            });

            it('creates fsm object with correct statesMap', function() {
                var host = {};
                var states = [{
                    name: 'A',
                    innerStates: [{
                        name: 'D'
                    }, {
                        name: 'E'
                    }]
                }, {
                    name: 'B'
                }, {
                    name: 'C',
                    innerStates: [{
                        name: 'F'
                    }]
                }];
                var statesFqns = ['A', 'A.D', 'A.E', 'B', 'C', 'C.F'];
                var fsm = StateMachine.initFsm(host, states);

                for (var i = 0, len = statesFqns.length; i < len; i++) {
                    expect(statesFqns[i] in fsm.statesMap).toBe(true);
                }
            });

            it('creates fsm object from nothing', function() {
                var fsm = StateMachine.initFsm();

                expect(fsm).toBeDefined();
                expect(fsm.host).toBe(undefined);
                expect(fsm.statesMap).toEqual({});
                expect(fsm.currentState).toBeNull();
                expect(fsm.currentStateStack).toEqual([]);
            });
        });

        describe('initState', function() {
            var statesMap;

            beforeEach(function() {
                statesMap = {};
            });

            it('creates a state from full configuration', function() {
                var config = {
                    name: 'SimpleState',
                    entry: 'entryFn',
                    exit: 'exitFn',
                    transitions: [{
                        trigger: 'someEvent',
                        dest: 'SimpleDestination',
                        action: 'toSimpleDestinationAction',
                        guard: 'toSimpleDestinationGuard'
                    }, {
                        trigger: 'anotherEvent',
                        dest: 'AnotherSimpleDestination',
                        action: 'toAnotherSimpleDestinationAction',
                        guard: 'toAnotherSimpleDestinationGuard'
                    }]
                };
                var state = StateMachine.initState(statesMap, config);

                expect(state).toBeDefined();
                expect(state.name).toEqual(config.name);
                expect(state.fqn).toEqual(config.name);
                expect(state.entry).toEqual(config.entry);
                expect(state.exit).toEqual(config.exit);
                expect(state.outerState).toBeNull();
                expect(state.innerStates).toEqual([]);
                expect(state.transitions.length).toBe(2);
                for (var i = 0, len = state.transitions.length; i < len; i++) {
                    expect(state.transitions[i]).not.toBe(config.transitions[i]);
                    expect(state.transitions[i]).toEqual(config.transitions[i]);
                }

                expect(statesMap[state.fqn]).toBe(state);
            });

            it('creates a state from no configuration', function() {
                var state = StateMachine.initState(statesMap);

                expect(state).toBeDefined();
                expect(state.name).toEqual('UnnamedState');
                expect(state.fqn).toEqual('UnnamedState');
                expect(state.entry).not.toBeDefined()
                expect(state.exit).not.toBeDefined();
                expect(state.outerState).toBeNull();
                expect(state.innerStates).toEqual([]);
                expect(state.transitions.length).toBe(0);
            });

            it('creates a state if a string is provided instead of configuration object', function() {
                var state = StateMachine.initState(statesMap, 'SimpleState');

                expect(state).toBeDefined();
                expect(state.name).toEqual('SimpleState');
                expect(state.fqn).toEqual('SimpleState');
                expect(state.entry).not.toBeDefined()
                expect(state.exit).not.toBeDefined();
                expect(state.outerState).toBeNull();
                expect(state.innerStates).toEqual([]);
                expect(state.transitions.length).toBe(0);
            });

            it('creates an inner state if outer state is provided', function() {
                var outer = StateMachine.initState(statesMap, 'Outer');
                var inner = StateMachine.initState(statesMap, 'Inner', outer);

                expect(inner).toBeDefined();
                expect(inner.name).toEqual('Inner');
                expect(inner.fqn).toEqual('Outer.Inner');
                expect(inner.outerState).toBe(outer);
            });

            it('creates a state with inner states', function() {
                var state = StateMachine.initState(statesMap, {
                    name: 'A',
                    innerStates: [{
                        name: 'B'
                    }, {
                        name: 'C'
                    }, {
                        name: 'D'
                    }]
                });

                expect(state).toBeDefined();
                expect(state.innerStates.length).toBe(3);
                expect(state.innerStates[0].fqn).toEqual('A.B');
                expect(state.innerStates[1].fqn).toEqual('A.C');
                expect(state.innerStates[2].fqn).toEqual('A.D');
            });
        });

        describe('handleStateTriggerFactory', function() {
            it('creates a function', function() {
                var func = StateMachine.handleStateTriggerFactory({});
                expect(typeof func).toEqual('function');
            });
        });

        describe('getTransitions', function() {
            it('returns empty array if state is falsy', function() {
                var ret = StateMachine.getTransitions();
                expect(ret).toEqual([]);
            });

            it('returns empty array if state has no transitions', function() {
                var state = {
                    transitions: []
                };
                var ret = StateMachine.getTransitions(state, 'anyEvent');
                expect(ret).toEqual([]);
            });

            it('returns empty array if state has no transitions with given trigger name', function() {
                var state = {
                    transitions: [{
                        trigger: 'event1'
                    }, {
                        trigger: 'event2'
                    }, {
                        trigger: 'event3'
                    }]
                };

                var ret = StateMachine.getTransitions(state, 'otherEvent');
                expect(ret).toEqual([]);
            });

            it('returns an array of transitions with given trigger name', function() {
                var trans1 = {
                    trigger: 'event1'
                };
                var trans2 = {
                    trigger: 'event2'
                };
                var trans3 = {
                    trigger: 'event1'
                };
                var state = {
                    transitions: [trans1, trans2, trans3]
                };

                var ret = StateMachine.getTransitions(state, 'event1');
                expect(ret).toEqual([trans1, trans3]);
            });
        });

        describe('getState', function() {
            var fsm;
            var stateA = {
                name: 'A',
                fqn: 'A'
            };
            var stateB = {
                name: 'B',
                fqn: 'B'
            };
            var stateC = {
                name: 'C',
                fqn: 'A.C',
                outerState: stateA
            };
            var stateD = {
                name: 'D',
                fqn: 'A.C.D',
                outerState: stateC
            };
            var stateE = {
                name: 'E',
                fqn: 'A.C.E',
                outerState: stateC
            };
            var stateF = {
                name: 'F',
                fqn: 'B.F',
                outerState: stateB
            };

            beforeEach(function() {
                fsm = {
                    statesMap: {
                        'A': stateA,
                        'B': stateB,
                        'A.C': stateC,
                        'A.C.D': stateD,
                        'A.C.E': stateE,
                        'B.F': stateF
                    },
                    currentStateStack: []
                };
            });

            it('returns the state object with provided name', function() {
                var state = StateMachine.getState(fsm, 'A');
                expect(state).toBe(stateA);
            });

            it('returns a falsy value if no states has the given name', function() {
                var state = StateMachine.getState(fsm, 'OtherState');
                expect(state).toBeFalsy();
            });

            it('returns the state object with the provided name, which is in the same outer state as the current state', function() {
                fsm.currentState = stateD;

                var state = StateMachine.getState(fsm, 'E');
                expect(state).toBe(stateE);
            });

            it('returns the outer state object with the provided name if an inner state is looking for it', function() {
                fsm.currentState = stateE;

                var state = StateMachine.getState(fsm, 'C');
                expect(state).toBe(stateC);
            });

            it('returns the ascendant state object with the provided name if a ascendant state is looking for it', function() {
                fsm.currentState = stateD;

                var state = StateMachine.getState(fsm, 'A');
                expect(state).toBe(stateA);
            });

            it('returns the other root state object with the provided name if an inner state is looking for it', function() {
                fsm.currentState = stateE;

                var state = StateMachine.getState(fsm, 'B');
                expect(state).toBe(stateB);
            });

            it('returns a falsy value if a state is looking for another state from different family', function() {
                fsm.currentState = stateD;

                var state = StateMachine.getState(fsm, 'F');
                expect(state).toBeFalsy();
            });
        });

        describe('pushCurrentState', function() {
            var fsm;
            var stateA = {
                name: 'A'
            };
            var stateB = {
                name: 'B'
            };

            beforeEach(function() {
                fsm = {
                    currentStateStack: [],
                    currentState: stateA
                };
            });

            it('pushes current state onto stack', function() {
                StateMachine.pushCurrentState(fsm);
                expect(fsm.currentStateStack.length).toBe(1);
                expect(fsm.currentStateStack[0]).toBe(stateA);
            });

            it('changes current state to provided state', function() {
                StateMachine.pushCurrentState(fsm, stateB);
                expect(fsm.currentState).toBe(stateB);
            });
        });

        describe('popCurrentState', function() {
            var fsm;
            var stateA = {
                name: 'A'
            };
            var stateB = {
                name: 'B'
            };

            beforeEach(function() {
                fsm = {
                    currentStateStack: [stateA],
                    currentState: stateB
                };
            });

            it('pops the current state stack', function() {
                StateMachine.popCurrentState(fsm);
                expect(fsm.currentStateStack.length).toBe(0);
            });

            it('changes current state to the removed state', function() {
                StateMachine.popCurrentState(fsm);
                expect(fsm.currentState).toBe(stateA);
            });
        });

        describe('changeState', function() {
            var fsm;
            var stateA = {
                name: 'A'
            };
            var stateB = {
                name: 'B'
            };

            beforeEach(function() {
                fsm = {};
            });

            it('changes current and previous states', function() {
                StateMachine.changeState(fsm, stateA, stateB);
                expect(fsm.currentState).toBe(stateB);
                expect(fsm.previousState).toBe(stateA);
            });
        });

        describe('doEntryAction', function() {
            var fsm;

            beforeEach(function() {
                fsm = {
                    host: {
                        func: function() {},
                        handleStateTrigger: function() {}
                    },
                    currentState: {
                        entry: 'func'
                    }
                };
            });

            it('calls the entry function', function() {
                spyOn(fsm.host, 'func');

                StateMachine.doEntryAction(fsm);
                expect(fsm.host.func).toHaveBeenCalled();
            });

            it('calls the handleStateTrigger with auto trigger', function() {
                spyOn(fsm.host, 'handleStateTrigger');

                StateMachine.doEntryAction(fsm);
                expect(fsm.host.handleStateTrigger).toHaveBeenCalledWith('.');
            });
        });

        describe('doExitAction', function() {
            var fsm;
            var stateA = {
                exit: 'exitFnA'
            };
            var stateB = {
                exit: 'exitFnB',
                outerState: stateA
            };
            var stateC = {
                exit: 'exitFnC',
                outerState: stateB
            };
            var stateD = {
                exit: 'exitFnD',
                outerState: stateB
            };
            var stateE = {
                exit: 'exitFnE'
            };

            beforeEach(function() {
                fsm = {
                    host: {
                        exitFnA: function() {},
                        exitFnB: function() {},
                        exitFnC: function() {},
                        exitFnD: function() {},
                        exitFnE: function() {}
                    }
                };
            });

            it('calls the exit function', function() {
                spyOn(fsm.host, 'exitFnA');

                StateMachine.doExitAction(fsm, stateA, stateB);
                expect(fsm.host.exitFnA).toHaveBeenCalled();
            });

            it('calls the exit functions all the way up if next state is not in the family', function() {
                spyOn(fsm.host, 'exitFnA');
                spyOn(fsm.host, 'exitFnB');
                spyOn(fsm.host, 'exitFnC');

                StateMachine.doExitAction(fsm, stateC, stateE);
                expect(fsm.host.exitFnC).toHaveBeenCalled();
                expect(fsm.host.exitFnB).toHaveBeenCalled();
                expect(fsm.host.exitFnA).toHaveBeenCalled();
            });

            it('calls the exit functions only up to where next state is if next state is in the same family', function() {
                spyOn(fsm.host, 'exitFnA');
                spyOn(fsm.host, 'exitFnB');
                spyOn(fsm.host, 'exitFnC');

                StateMachine.doExitAction(fsm, stateC, stateA);
                expect(fsm.host.exitFnC).toHaveBeenCalled();
                expect(fsm.host.exitFnB).toHaveBeenCalled();
                expect(fsm.host.exitFnA).not.toHaveBeenCalled();
            });

            it('calls the state\'s own exit function if next state shares the same outer state', function() {
                spyOn(fsm.host, 'exitFnA');
                spyOn(fsm.host, 'exitFnB');
                spyOn(fsm.host, 'exitFnC');

                StateMachine.doExitAction(fsm, stateC, stateD);
                expect(fsm.host.exitFnC).toHaveBeenCalled();
                expect(fsm.host.exitFnB).not.toHaveBeenCalled();
                expect(fsm.host.exitFnA).not.toHaveBeenCalled();
            });
        });

        describe('init', function() {
            it('attaches fsm object and various functions to host object', function() {
                var host = {};
                StateMachine.init(host, [], true, true);
                expect(host.fsm).toBeDefined();
                expect(host.handleStateTrigger).toBeDefined();
                expect(host.getCurrentStateName).toBeDefined();
                expect(host.getPreviousStateName).toBeDefined();
            });

            it('assigns true as default values to callEntryIfTransitBack and callExitIfTransitBack', function() {
                var host = {};
                StateMachine.init(host, []);
                expect(host.fsm.callEntryIfTransitBack).toBe(true);
                expect(host.fsm.callExitIfTransitBack).toBe(true);
            });

            it('moves the state machine to the first state', function() {
                var host = {};
                StateMachine.init(host, [{
                    name: 'A'
                }]);
                expect(host.getCurrentStateName()).toEqual('A');
            });

            it('uses states definition from host object', function() {
                var host = {
                    states: [{
                        name: 'A'
                    }]
                };
                StateMachine.init(host);
                expect(host.getCurrentStateName()).toEqual('A');
            });
        });

        describe('handleStateTrigger', function() {
            var host;
            var states = [{
                name: 'A',
                entry: 'stateAEntry',
                exit: 'stateAExit',
                transitions: [{
                    trigger: 'stateAToBEvent',
                    dest: 'B',
                    action: 'stateAToBAction',
                    guard: 'stateAToBGuard',
                }, {
                    trigger: 'stateAToNotExistEvent',
                    dest: 'NotExist'
                }, {
                    trigger: 'stateADupEvent',
                    dest: 'C',
                    guard: function() { return false; }
                }, {
                    trigger: 'stateADupEvent',
                    dest: 'D',
                    guard: function() { return true; }
                }, {
                    trigger: 'stateAToEEvent',
                    dest: 'E',
                }]
            }, {
                name: 'B',
                entry: 'stateBEntry',
                exit: 'stateBExit'
            }, {
                name: 'C'
            }, {
                name: 'D'
            }, {
                name: 'E',
                entry: 'stateEEntry',
                exit: 'stateEExit',
                innerStates: [{
                    name: 'F',
                    entry: 'stateFEntry',
                    exit: 'stateFExit',
                    transitions: [{
                        trigger: 'stateFToBEvent',
                        dest: 'B'
                    }]
                }, {
                    name: 'G',
                    entry: 'stateGEntry',
                    exit: 'stateGExit'
                }]
            }];

            beforeEach(function() {
                host = {
                    stateAEntry: function() {},
                    stateAExit: function() {},
                    stateAToBAction: function() {},
                    stateAToBGuard: function() {},
                    stateBEntry: function() {},
                    stateBExit: function() {},
                    stateEEntry: function() {},
                    stateEExit: function() {},
                    stateFEntry: function() {},
                    stateFExit: function() {},
                    stateGEntry: function() {},
                    stateGExit: function() {},
                };

                StateMachine.init(host, states);
            });

            it('changes state if a transition can be found with the given trigger', function() {
                spyOn(host, 'stateAExit');
                spyOn(host, 'stateBEntry');
                expect(host.getCurrentStateName()).toEqual('A');
                host.handleStateTrigger('stateAToBEvent');
                expect(host.getCurrentStateName()).toEqual('B');
                expect(host.getPreviousStateName()).toEqual('A');
                expect(host.stateAExit).toHaveBeenCalled();
                expect(host.stateBEntry).toHaveBeenCalled();
            });

            it('does not change state if a transition can not be found with the given trigger', function() {
                spyOn(host, 'stateAExit');
                expect(host.getCurrentStateName()).toEqual('A');
                host.handleStateTrigger('eventNotExist');
                expect(host.getCurrentStateName()).toEqual('A');
                expect(host.stateAExit).not.toHaveBeenCalled();
            });

            it('calls action function if a transition can be found with the given trigger', function() {
                spyOn(host, 'stateAToBAction');
                host.handleStateTrigger('stateAToBEvent', [123, '123']);
                expect(host.stateAToBAction).toHaveBeenCalledWith(123, '123');
            });

            it('calls guard function if a transition can be found with the given trigger', function() {
                spyOn(host, 'stateAToBGuard');
                host.handleStateTrigger('stateAToBEvent', [], [123, '123']);
                expect(host.stateAToBGuard).toHaveBeenCalledWith(123, '123');
            });

            it('does not change state if guard function returns false', function() {
                spyOn(host, 'stateAExit');
                spyOn(host, 'stateAToBGuard').andReturn(false);
                host.handleStateTrigger('stateAToBEvent', [], [123, '123']);
                expect(host.stateAToBGuard).toHaveBeenCalledWith(123, '123');
                expect(host.getCurrentStateName()).toBe('A');
                expect(host.stateAExit).not.toHaveBeenCalled();
            });

            it('does not change state if destination does not exist', function() {
                spyOn(host, 'stateAExit');
                host.handleStateTrigger('stateAToNotExistEvent');
                expect(host.getCurrentStateName()).toBe('A');
                expect(host.stateAExit).not.toHaveBeenCalled();
            });

            it('chooses the correct destination based on the return value of guard function', function() {
                host.handleStateTrigger('stateADupEvent');
                expect(host.getCurrentStateName()).toBe('D');
            });

            it('changes state to first inner state automatically', function() {
                spyOn(host, 'stateAExit');
                spyOn(host, 'stateEEntry');
                spyOn(host, 'stateFEntry');
                host.handleStateTrigger('stateAToEEvent');
                expect(host.getCurrentStateName()).toBe('F');
                expect(host.stateAExit).toHaveBeenCalled();
                expect(host.stateEEntry).toHaveBeenCalled();
                expect(host.stateFEntry).toHaveBeenCalled();
            });

            it('changes state from inner state to outside', function() {
                spyOn(host, 'stateEExit');
                spyOn(host, 'stateFExit');
                spyOn(host, 'stateBEntry');
                host.handleStateTrigger('stateAToEEvent');
                host.handleStateTrigger('stateFToBEvent');
                expect(host.getCurrentStateName()).toBe('B');
                expect(host.stateFExit).toHaveBeenCalled();
                expect(host.stateEExit).toHaveBeenCalled();
                expect(host.stateBEntry).toHaveBeenCalled();
            });
        });

        describe('callEntryIfTransitBack', function() {
            var host;
            var states = [{
                name: 'A',
                entry: 'stateAEntry',
                transitions: {
                    trigger: 'toSelf',
                    dest: 'A'
                } 
            }];

            beforeEach(function() {
                host = {
                    stateAEntry: function() {}
                };
            });

            it('is set to true, entry function will be called if transiting back', function() {
                StateMachine.init(host, states, true);

                expect(host.getCurrentStateName()).toEqual('A');
                spyOn(host, 'stateAEntry');
                host.handleStateTrigger('toSelf');
                expect(host.stateAEntry).toHaveBeenCalled();
            });

            it('is set to false, entry function will not be called if transiting back', function() {
                StateMachine.init(host, states, false);

                expect(host.getCurrentStateName()).toEqual('A');
                spyOn(host, 'stateAEntry');
                host.handleStateTrigger('toSelf');
                expect(host.stateAEntry).not.toHaveBeenCalled();
            });
        });

        describe('callExitIfTransitBack', function() {
            var host;
            var states = [{
                name: 'A',
                exit: 'stateAExit',
                transitions: {
                    trigger: 'toSelf',
                    dest: 'A'
                } 
            }];

            beforeEach(function() {
                host = {
                    stateAExit: function() {}
                };
            });

            it('is set to true, exit function will be called if transiting back', function() {
                StateMachine.init(host, states, true, true);

                expect(host.getCurrentStateName()).toEqual('A');
                spyOn(host, 'stateAExit');
                host.handleStateTrigger('toSelf');
                expect(host.stateAExit).toHaveBeenCalled();
            });

            it('is set to false, entry function will not be called if transiting back', function() {
                StateMachine.init(host, states, true, false);

                expect(host.getCurrentStateName()).toEqual('A');
                spyOn(host, 'stateAExit');
                host.handleStateTrigger('toSelf');
                expect(host.stateAExit).not.toHaveBeenCalled();
            });
        });
    });
})(this);
