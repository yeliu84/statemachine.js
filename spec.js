(function(global) {
    global.STATEMACHINE_EXPORT_EXTRA = true;

    describe('StateMachine JS', function() {
        it('defines a global StateMachine object', function() {
            expect(StateMachine).toBeDefined();
        });
    });
})(this);
