StateMachineJS
===============

Implementation of State Machine Pattern in JavaScript.

Get Started
-----------

1. Define states in host object

    ```javascript
    var app = {                     // host object for state machine
        states: [{                  // states definition
            name: 'STATE_A',        // state name
            entry: 'stateAEntry',   // state entry function
            exit: 'stateAExit',     // state exit function
            transitions: [{         // transitions definition
                trigger: 'event1',  // transition trigger
                dest: 'STATE_B',    // transition destination
                action: 'action1',  // transition action function
                guard: 'guard1'     // transition guard function
            }]
        }, {
            name: 'STATE_B'         // minimal state definition
        }],

        // host object is used as the context (`this`) of all state functions

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
    ```

2. Initialize host object

    ```javascript
    StateMachine.init(app);
    ```

3. Check current state

    ```javascript
    app.getCurrentStateName();          // => 'STATE_A', app is now in the first state
    ```

4. Trigger state transition

    ```javascript
    app.handleStateTrigger('event1')
    ```

5. Check current state again

    ```javascript
    app.getCurrentStateName();          // => 'STATE_B', app is now in the STATE_B state
    ```

API Document
------------

TODO
