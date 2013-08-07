(function() {
    'use strict';

    var editor;
    var viewer;
    var message;

    var rendered = false;
    var hiddenCls = 'hidden';

    var editorApp = {
        showViewer: function() {
            if (rendered) {
                viewer.parentElement.classList.remove(hiddenCls);
                editor.parentElement.classList.add(hiddenCls);
            }
        },

        showEditor: function() {
            if (rendered) {
                editor.parentElement.classList.remove(hiddenCls);
                viewer.parentElement.classList.add(hiddenCls);
            }
        }
    };

    var states = [{
        name: 'VIEWING',
        entry: 'showViewer',
        transitions: [{
            trigger: 'editclicked',
            dest: 'EDITING'
        }]
    }, {
        name: 'EDITING',
        entry: 'showEditor',
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
                guard: 'isOriginalContent',
                dest: 'CLEAN'
            }
        }]
    }];

    window.onload = function() {
        rendered = true;

        editor = document.getElementById('editor');
        viewer = document.getElementById('viewer');
        message = document.getElementById('message');

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

        StateMachine.init(editorApp, states);

        setMessage('App started: ' + editorApp.getCurrentStateName());
    };

    function getEditorContent() {
        if (editor) {
            return editor.value;
        }
    }

    function setEditorContent(text) {
        if (editor) {
            editor.value = text;
        }

        return editor;
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
