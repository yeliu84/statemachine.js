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
    });
})(this);
