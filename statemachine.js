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

    StateMachine.init = function(obj, states,
            callEntryIfTransitBack, callExitIfTransitBack) {
        obj = obj || {};
        return obj;
    };
})(this);
