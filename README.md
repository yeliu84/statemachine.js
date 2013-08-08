StateMachineJS
===============

Implementation of State Machine Pattern in JavaScript.

## How to use StateMachineJS?

```javascrip
var app = {                     // host object for state machine
    states: [{                  // states definition
        name: 'STATE_A'         // state name
        entry: 'stateAEntry'    // state entry function
        exit: 'stateAExit'      // state exit function
        transitions: [{         // transitions definition
            trigger: 'event1'   // transition trigger
            dest: 'STATE_B'     // transition destination
            action: 'action1'   // transition action function
            guard: 'guard1'     // transition guard function
        }]
    }, {
        name: 'STATE_B'         // minimal state definition
    }],

    stateAEntry: function() {
        // this function will be called when entering STATE_A
    },

    stateAExit: function() {
        // this function will be called when leaving STATE_A
    },

    action1: function() {
        // this function will be called when "event1" transition is taking place
    },

    guard1: function() {
        // this function returns `false` to prevent "event1" transition from
        // happening
    }
};

StateMachine.init(app);             // initialize host object

app.getCurrentStateName();          // => 'STATE_A', app is now in the first state
app.handleStateTrigger('event1')    // trigger state transition
app.getCurrentStateName();          // => 'STATE_B', app is now in the STATE_B state
```
