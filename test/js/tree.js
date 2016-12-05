define([
    'loglevel',
    'jquery',
    "jstree",
], function (log, $) {

    'use strict';

    var s = {
            TREE_CONTAINER: "#tree"
        },
        data = [
            {
                "id": "root_1",
                "text": "Root 1",
                "parent": "#"
            },
            {
                "id": "root_2",
                "text": "Root 2",
                "parent": "#"
            },
            {
                "id": "child",
                "text": "Child",
                "parent": "root_1"
            },
            {
                "id": "child",
                "text": "Child",
                "parent": "root_2"
            }
        ];

    function Test() {
    }

    Test.prototype.start = function () {

        log.trace("Test started");

        $(s.TREE_CONTAINER).jstree({
            core: {
                data: data,
            },
            plugins: ['wholerow', 'checkbox']
        });


    };

    return new Test();

});

$(s.TREE_CONTAINER).jstree({
    core: {
        data: [
            {
                "id": "root_1",
                "text": "Root 1",
                "parent": "#"
            },
            {
                "id": "root_2",
                "text": "Root 2",
                "parent": "#"
            },
            {
                "id": "child",
                "text": "Child",
                "parent": "root_1"
            },
            {
                "id": "child",
                "text": "Child",
                "parent": "root_2"
            }
        ],
    },
    plugins: ['wholerow', 'checkbox']
});