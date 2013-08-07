(function() {
    'use strict';

    var editor;
    var viewer;
    var message;

    var editorApp = StateMachine.init({}, [{
        name: 'VIEWING',
        entry: 'showViewer',
        exit: 'hideViewer',
        transitions: [{
            trigger: 'editclicked',
            dest: 'EDITING'
        }]
    }, {
        name: 'EDITING',
        entry: 'showEditor',
        exit: 'hideEditor',
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

    function hasClass(elem, cls) {
        var classes = elem.className.split(' ');

        for (var i = 0, len = classes.length; i < len; i++) {
            if (classes[i] === cls) {
                return true;
            }
        }

        return false;
    }

    function addClass(elem, cls) {
        if (!hasClass(elem, cls)) {
            elem.className += ' ' + cls;
        }

        return elem;
    }

    function removeClass(elem, cls) {
        var classes = [];

        elem.className.split(' ').forEach(function(c) {
            if (c !== cls) {
                classes.push(c);
            }
        });
        elem.className = classes.join(' ');

        return elem;
    }

    window.onload = function() {
    };
})();
