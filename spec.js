(function(global) {
    global.STATEMACHINE_EXPORT_EXTRA = true;

    describe('StateMachine', function() {
        it('is defined in global namespace', function() {
            expect(StateMachine).toBeDefined();
        });

        it('contains all extra functions', function() {
            expect(StateMachine.isString).toBeDefined();
            expect(StateMachine.isNumber).toBeDefined();
            expect(StateMachine.isFunction).toBeDefined();
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

        describe('isFunction', function() {
            it('returns true is value is function', function() {
                expect(StateMachine.isFunction(function() {})).toBe(true);
            });

            it('returns false is value is not function', function() {
                expect(StateMachine.isFunction('123')).toBe(false);
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
    });
})(this);
