(function() {
    var editorApp = StateMachine.init({}, [{
        name: 'VIEWING',
        entry: 'setViewerContent',
        transitions: [{
            trigger: 'editclicked',
            dest: 'EDITING'
        }]
    }, {
        name: 'EDITING',
        entry: 'setEditorContent',
        innerStates: [{
            name: 'CLEAN',
            transitions: {
                trigger: 'contentchanged',
                dest: 'DIRTY'
            }
        }, {
            name: 'DIRTY',
            transitions: {
                trigger: 'contentchanged',
                guard: 'isOriginalContent'
                dest: 'CLEAN'
            }
        }]
    }]);

    window.onload = function() {
    };
})();
