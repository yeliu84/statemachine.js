(function() {
    'use strict';

    var editor;
    var viewer;
    var message;
    var state;

    var rendered = false;
    var hiddenCls = 'hidden';

    var editorApp = {
        /* ----- States Definition ----- */
        states: [{
            name: 'VIEWING',
            entry: 'viewingEntry',
            transitions: [{
                trigger: 'editclicked',
                dest: 'EDITING'
            }]
        }, {
            name: 'EDITING',
            entry: 'editingEntry',
            innerStates: [{
                name: 'CLEAN',
                entry: 'cleanEntry',
                transitions: [{
                    trigger: 'contentchanged',
                    dest: 'DIRTY'
                }, {
                    trigger: 'saveclicked',
                    dest: 'VIEWING'
                }, {
                    trigger: 'cancelclicked',
                    dest: 'VIEWING'
                }]
            }, {
                name: 'DIRTY',
                entry: function() { // functions can be used here
                    setState('EDITING.' + this.getCurrentStateName());
                },
                transitions: [{
                    trigger: 'contentchanged',
                    guard: function() {
                        return getEditorContent() === this.originalContent;
                    },
                    dest: 'CLEAN'
                }, {
                    trigger: 'saveclicked',
                    dest: 'VIEWING',
                    action: function() {
                        setViewerContent(getEditorContent());
                    }
                }, {
                    trigger: 'cancelclicked',
                    dest: 'VIEWING',
                    action: function() {
                        setViewerContent(this.originalContent);
                    }
                }]
            }]
        }],

        /* ----- Object Members ----- */
        originalContent: '',

        viewingEntry: function() {
            showViewer();
            setState(this.getCurrentStateName()); // `this` is the host object
            setMessage('You are in view mode. Click "Edit" to edit the message.');
        },

        editingEntry: function() {
            showEditor();
            editor.focus();
            setState(this.getCurrentStateName());
            setMessage('You are in edit mode. Click "Save" to save, "Cancel" to discard changes.');
        },

        cleanEntry: function() {
            this.originalContent = getViewerContent();
            setEditorContent(this.originalContent);
            setState('EDITING.' + this.getCurrentStateName());
        }
    };

    window.onload = function() {
        rendered = true;

        editor = document.getElementById('editor');
        viewer = document.getElementById('viewer');
        message = document.getElementById('message');
        state = document.getElementById('state');

        editor.addEventListener('keyup', function(e) {
            editorApp.handleStateTrigger('contentchanged');
        });

        document.getElementById('edit-link').addEventListener('click', function(e) {
            editorApp.handleStateTrigger('editclicked');
            e.preventDefault();
        }, false);
        document.getElementById('save-link').addEventListener('click', function(e) {
            editorApp.handleStateTrigger('saveclicked');
            e.preventDefault();
        }, false);
        document.getElementById('cancel-link').addEventListener('click', function(e) {
            editorApp.handleStateTrigger('cancelclicked');
            e.preventDefault();
        }, false);

        StateMachine.init(editorApp);
    };

    function showViewer() {
        if (rendered) {
            viewer.parentElement.classList.remove(hiddenCls);
            editor.parentElement.classList.add(hiddenCls);
        }
    }

    function showEditor() {
        if (rendered) {
            editor.parentElement.classList.remove(hiddenCls);
            viewer.parentElement.classList.add(hiddenCls);
        }
    }

    function getEditorContent() {
        return getHtml(editor);
    }

    function setEditorContent(text) {
        return setHtml(editor, text);
    }

    function getViewerContent() {
        return getHtml(viewer);
    }

    function setViewerContent(text) {
        return setHtml(viewer, text);
    }

    function setMessage(msg) {
        return setHtml(message, msg);
    }

    function setState(name) {
        return setHtml(state, name);
    }

    function getHtml(elem) {
        if (elem) {
            return elem.innerHTML;
        }
    }

    function setHtml(elem, html) {
        if (elem) {
            elem.innerHTML = html;
        }

        return elem;
    }
})();
