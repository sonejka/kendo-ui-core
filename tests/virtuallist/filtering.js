(function() {
    var container,
        asyncDataSource,
        virtualList,
        VirtualList = kendo.ui.VirtualList,
        CONTAINER_HEIGHT = 200,

        SELECTED = "k-state-selected";

    function scroll(element, height) {
        element.scrollTop(height);
        element.trigger("scroll");
    }

    var data = [
        { id: 0, value: 0, text: "Item 0", letter: "a" },
        { id: 1, value: 1, text: "Item 1", letter: "b" },
        { id: 2, value: 2, text: "Item 2", letter: "a" },
        { id: 3, value: 3, text: "Item 3", letter: "b" },
        { id: 4, value: 4, text: "Item 4", letter: "b" },
        { id: 5, value: 5, text: "Item 5", letter: "a" },
        { id: 6, value: 6, text: "Item 6", letter: "b" },
        { id: 7, value: 7, text: "Item 7", letter: "b" },
        { id: 8, value: 8, text: "Item 8", letter: "b" },
        { id: 9, value: 9, text: "Item 9", letter: "b" },
        { id: 10, value: 10, text: "Item 10", letter: "b" },
        { id: 11, value: 11, text: "Item 11", letter: "b" },
        { id: 12, value: 12, text: "Item 12", letter: "b" },
        { id: 13, value: 13, text: "Item 13", letter: "b" },
        { id: 14, value: 14, text: "Item 14", letter: "a" },
        { id: 15, value: 15, text: "Item 15", letter: "a" },
        { id: 16, value: 16, text: "Item 16", letter: "a" },
        { id: 17, value: 17, text: "Item 17", letter: "b" },
        { id: 18, value: 18, text: "Item 18", letter: "b" },
        { id: 19, value: 19, text: "Item 19", letter: "a" },
        { id: 20, value: 20, text: "Item 20", letter: "a" },
        { id: 21, value: 21, text: "Item 21", letter: "b" },
        { id: 22, value: 22, text: "Item 22", letter: "b" },
        { id: 23, value: 23, text: "Item 23", letter: "b" },
        { id: 24, value: 24, text: "Item 24", letter: "b" },
        { id: 25, value: 25, text: "Item 25", letter: "b" },
        { id: 26, value: 26, text: "Item 26", letter: "b" },
        { id: 27, value: 27, text: "Item 27", letter: "b" },
        { id: 28, value: 28, text: "Item 28", letter: "b" },
        { id: 29, value: 29, text: "Item 29", letter: "b" },
        { id: 30, value: 30, text: "Item 30", letter: "a" }
    ];

    module("VirtualList Filtering: ", {
        setup: function() {
            container = $("<div id='container' style='height: " + CONTAINER_HEIGHT + "px;'></div>").appendTo(QUnit.fixture);

            asyncDataSource = new kendo.data.DataSource({
                transport: {
                    read: function(options) {
                        setTimeout(function() {
                            var filter = options.data.filter,
                                myData;

                            if (filter) {
                                var filterValue = options.data.filter.filters[0].value;
                                myData = data.filter(function(item) {
                                    return item.letter === filterValue;
                                });
                            } else {
                                myData = data;
                            }

                            options.success({ data: myData.slice(options.data.skip, options.data.skip + options.data.take), total: myData.length });
                        }, 0);
                    }
                },
                serverPaging: true,
                serverFiltering: true,
                pageSize: 40,
                schema: {
                    data: "data",
                    total: "total"
                }
            });

            virtualList = new VirtualList(container, {
                dataSource: asyncDataSource,
                template: "#=text# #=letter#",
                dataValueField: "value",
                itemHeight: 50,
                selectable: true,
                valueMapper: function(o) {
                    o.success(o.value);
                }
            });
        },

        teardown: function() {
            if (container.data("kendoVirtualList")) {
                container.data("kendoVirtualList").destroy();
            }

            QUnit.fixture.empty();
        }
    });

    //rendering

    asyncTest("items are rendered after data is filtered", 1, function() {
        setTimeout(function() {
            asyncDataSource.filter({ field: "letter", operator: "eq", value: "b" });

            setTimeout(function() {
                start();
                equal(virtualList.items().first().text(), "Item 1 b");
            }, 300);
        }, 100);
    });

    asyncTest("itemCount changes after filtering", 2, function() {
        setTimeout(function() {
            equal(virtualList.itemCount, 16);
            asyncDataSource.filter({ field: "letter", operator: "eq", value: "a" });

            setTimeout(function() {
                start();
                equal(virtualList.itemCount, 9);
            }, 300);
        }, 100);
    });

    asyncTest("itemCount changes after filtering", 2, function() {
        setTimeout(function() {
            equal(virtualList.itemCount, 16);
            asyncDataSource.filter({ field: "letter", operator: "eq", value: "a" });

            setTimeout(function() {
                start();
                equal(virtualList.itemCount, 9);
            }, 300);
        }, 100);
    });

    asyncTest("list renders only the required amount of item placeholders after filtering", 2, function() {
        setTimeout(function() {
            equal(virtualList.items().length, 16);
            asyncDataSource.filter({ field: "letter", operator: "eq", value: "a" });

            setTimeout(function() {
                start();
                equal(virtualList.items().length, 9);
            }, 300);
        }, 100);
    });

    asyncTest("works if the dataSource is filtered before list is created", 2, function() {
        asyncDataSource.filter({ field: "letter", operator: "eq", value: "a" });

        setTimeout(function() {
            start();
            equal(virtualList.items().length, 9);
            equal(virtualList.items().first().text(), "Item 0 a");
        }, 100);
    });

    asyncTest("sets the correct container height after filtering", 1, function() {
        setTimeout(function() {
            asyncDataSource.filter({ field: "letter", operator: "eq", value: "a" });

            setTimeout(function() {
                start();
                equal(virtualList.heightContainer.offsetHeight, 9 * 50);
            }, 300);
        }, 100);
    });

    asyncTest("can be scrolled after dataSource is filtered", 1, function() {
        setTimeout(function() {
            asyncDataSource.filter({ field: "letter", operator: "eq", value: "b" });

            setTimeout(function() {
                start();
                scroll(container, 4 * CONTAINER_HEIGHT);
                equal(virtualList.items().last().text(), "Item 29 b");
            }, 300);
        }, 100);
    });

    asyncTest("does not clear the values after filtering", 1, function() {
        setTimeout(function() {
            virtualList.value([0]);
            asyncDataSource.filter({ field: "letter", operator: "eq", value: "b" });

            setTimeout(function() {
                start();
                equal(virtualList.value()[0], 0);
            }, 300);
        }, 100);
    });

    asyncTest("keeps selection after filtering", 1, function() {
        setTimeout(function() {
            virtualList.items().first().trigger("click");
            asyncDataSource.filter({ field: "letter", operator: "eq", value: "a" });

            setTimeout(function() {
                start();
                ok(virtualList.items().first().hasClass(SELECTED), "item is selected");
            }, 300);
        }, 100);
    });

})();