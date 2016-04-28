(function () {
    "use strict";

    var CellView = Backbone.View.extend({
        tagName: 'td',
        className: '',
        initialize: function (options) {
            var cell = options.cell.toJSON();
            this.cell = cell;
            this.$el.data('_cellData_', this.cell);
        },
        render: function () {
            this.$el.text(this.cell.name);
            return this;
        }
    });

    var HeaderCellView = CellView.extend({
        tagName: 'th',
        className: '',
        initialize: function (options) {
            var column = options.column.toJSON();
            this.column = column;
        },
        render: function () {
            this.$el.text(this.column.name);
            return this;
        }
    });

    var RowView = Backbone.View.extend({
        tagName: 'tr',
        className: '',
        initialize: function (options) {
            this.rowCells = options.rowCells;
        },
        render: function (){
            var _this = this;
            this.rowCells.each(function (cell) {
                _this.$el.append(new CellView({cell:cell}).render().el);
            });
            return this;
        }
    });

    var HeaderRowView = RowView.extend({
        tagName: 'tr',
        className: '',
        initialize: function (options) {
            this.columns = options.columns;
        },
        render: function () {
            var _this = this;
            this.columns.each(function (column) {
                _this.$el.append(new HeaderCellView({column: column}).render().el);
            });
            return this;
        }
    });

    var TableView = Backbone.View.extend({
        tagName: 'table',
        className:'table table-bordered',
        dataEvents: {
            'add': 'addRowHandler'
        },
        events: {
            'click td': 'tdClickHandler'
        },
        initialize: function (options) {
            this.columns = new ColumnCollection(options.columns);
            this.cells = options.cells;
            $('.content').css({
                "width": ($(window).width())+"px",
                "height": ($(window).height() - 50) + "px"
            })
        },
        render: function () {
            this.$el.empty();
            this.renderHeaderView();
            this.renderRows();
            return this;
        },
        renderHeaderView: function () {
            this.$el.append(new HeaderRowView({
                columns: this.columns
            }).render().el);
            return this;
        },
        renderRows: function(cells){
            var cells = cells || this.cells;
            var columnsNum = this.columns.length;
            var rowsNum = Math.ceil(cells.length / columnsNum);

            for(var rowId=0; rowId<rowsNum; rowId++){
                var rowCells = [];
                for(var cellId=rowId*columnsNum; cellId<(rowId+1)*columnsNum && cellId<cells.length; cellId++){
                    rowCells.push(cells[cellId]);
                }
                this.addRow(new RowCollection(rowCells));
            }
        },
        addRow: function (rowCells) {
            var view = new RowView({
                rowCells: rowCells,
            });
            this.$el.append(view.render().el);
        },
        tdClickHandler: function (e) {
            e.preventDefault();
            e.stopPropagation();
            var target = $(e.currentTarget);
            var cellData = target.data('_cellData_');
            target.css({"background-color":cellData.color});
        }
    });

    window.TableView = TableView;
})();

