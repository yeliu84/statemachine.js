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
    });
})(this);
