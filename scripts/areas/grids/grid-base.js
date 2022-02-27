//
// Base grid
//
R("grid-base", ["grid-cell", "extend", "events"], function (Cell, Extend, Events) {

  var Grid = function (params, props) {
    this.initialize(params, props);
  };

  Grid.extend = Extend;

  _.extend(Grid.prototype, Events, {

    defaults: {
      columns: 10,
      rows: 20,
      cellWidth: 28,
      cellHeight: 28
    },

    initialize: function (params, props) {
      var self = this;
      self.options = _.defaults(params, self.defaults);
      _.extend(self, props);
      return self.setMatrix();
    },

    //marks a cell of the grid occupied
    occupy: function (x, y) {
      var self = this;
      self.matrix[x][y].occupy();
      return self;
    },

    occupyRow: function (y) {
      var self = this;
      for (var x = 0, len = self.columns; x < len; x++) {
        self.occupy(x, y);
      }
      return self;
    },

    occupyColumn: function (x) {
      var self = this;
      for (var y = 0, len = self.rows; y < len; y++) {
        self.occupy(x, y);
      }
      return self;
    },

    release: function (x, y) {
      var self = this;
      self.matrix[x][y].release();
      return self;
    },

    releaseRow: function (y) {
      var self = this;
      for (var x = 0, len = self.options.columns; x < len; x++) {
        self.release(x, y);
      }
      return self;
    },

    releaseColumn: function (x) {
      var self = this;
      for (var y = 0, len = self.options.rows; y < len; y++) {
        self.release(x, y);
      }
      return self;
    },

    isFree: function (x, y) {
      var self = this;
      if (self.matrix[x] == undefined || self.matrix[x][y] == undefined) {
        return false;
      }
      return self.matrix[x][y].free === true;
    },

    isRowFree: function (y) {
      var self = this;
      for (var x = 0, len = self.options.columns; x < len; x++) {
        if (!self.matrix[x][y].free) {
          return false;
        }
      }
      return true;
    },

    isColumnFree: function (x) {
      var self = this;
      for (var y = 0, len = self.options.rows; y < len; y++) {
        if (!self.matrix[x][y].free) {
          return false;
        }
      }
      return true;
    },

    //gets the selected cells x from the row at given y
    getRowSelection: function (y) {
      var self = this, a = [];
      for (var x = 0, len = self.columns; x < len; x++) {
        a.push(self.matrix[x][y].free ? 0 : 1);
      }
      return a;
    },

    //gets the selected cells y from the column at given x
    getColumnSelection: function (x) {
      var self = this, a = [];
      for (var y = 0, len = self.rows; y < len; y++) {
        a.push(self.matrix[x][y].free ? 0 : 1);
      }
      return a;
    },

    //moves a row selection from one coordinate to another
    moveRowSelection: function (y, destinationY) {
      var self = this;
      for (var x = 0, len = self.options.columns; x < len; x++) {
        if (self.matrix[x][y].free) {
          self.release(x, destinationY);
        } else {
          self.occupy(x, destinationY);
        }
        //release the current cell
        self.release(x, y);
      }
      return self;
    },

    //moves a column selection from one coordinate to another
    moveColumnSelection: function (x, destinationX) {
      var self = this;
      for (var y = 0, len = self.options.rows; y < len; y++) {
        if (self.matrix[x][y].free) {
          self.release(destinationX, y);
        } else {
          self.occupy(destinationX, y);
        }
        self.release(x, y);
      }
      return self;
    },

    occupiedColumns: function () {
      var self = this, a = [], i = 0;
      for (var x = 0; x < self.columns; x++) {
        var add = true;
        for (var y = 0; y < self.rows; y++) {
          if (self.matrix[x][y].free) {
            //this row contains at least one free cell
            add = false;
            break;
          }
        }
        if (add) {
          a.push(i);
        }
        i++
      }
      return a;
    },

    occupiedRows: function () {
      var self = this, a = [], i = 0, o = self.options;
      for (var y = 0; y < o.rows; y++) {
        var add = true;
        for (var x = 0; x < o.columns; x++) {
          if (self.matrix[x][y].free) {
            //this row contains at least one free cell
            add = false;
            break;
          }
        }
        if (add) {
          a.push(i);
        }
        i++
      }
      return a;
    },

    eachCell: function (fn) {
      var self = this, o = self.options;
      for (var x = 0, i = o.columns; x < i; x++) {
        for (var y = 0, j = o.rows; y < j; y++) {
          fn.call(self, self.matrix[x][y]);
        }
      }
      return self;
    },

    occupiedCells: function () {
      var self = this, a = [], o = self.options;
      for (var y = 0; y < o.rows; y++) {
        for (var x = 0; x < o.columns; x++) {
          var cell = self.matrix[x][y];
          if (!cell.free) {
            a.push(cell);
          }
        }
      }
      return a;
    },

    setMatrix: function () {
      var self = this,
        o = self.options,
        m = self.matrix = [];
      for (var x = 0; x < o.columns; x++) {
        var column = [];
        for (var y = 0; y < o.rows; y++) {
          column.push(self.createCell(x, y));
        }
        m.push(column);
      }
      self.explicitRowsAndColumns();
      return self;
    },

    createCell: function (x, y, options) {
      var self = this,
        coords = self.coords,
        o = self.options,
        ch = o.cellHeight,
        cw = o.cellWidth;
      if (coords)
        x = x + coords[0], y = y + coords[1];
      return new Cell(_.extend({
        x: x * cw,
        y: y * ch,
        mx: x,
        my: y,
        coords: [x, y],
        h: ch,
        w: cw
      }, options));
    },

    points: function () {
      return _.flatten(this.matrix);
    },

    explicitRowsAndColumns: function () {
      var self = this, rows = [], o = self.options;
      self.columns = self.matrix;
      for (var y = 0; y < o.rows; y++) {
        var row = [];
        for (var x = 0; x < o.columns; x++) {
          row.push(self.matrix[x][y]);
        }
        rows.push(row);
      }
      self.rows = rows;
      return self;
    },

    //rotates the grid
    rotate: function () {
      var self = this;
      self.trigger("rotate");
      return self;
    },

    //rotates a matrix clockwise
    rotateMatrixClockwise: function (matrix) {
      var a = [], cols = matrix.length, rows = matrix[0].length;
      for (var y = rows - 1; y > -1; y--) {
        var c = [];
        for (var x = 0; x < cols; x++) {
          c.push(matrix[x][y]);
        }
        a.push(c);
      }
      return a;
    },

    //rotates a matrix counter clockwise
    rotateMatrixCounterClockwise: function (matrix) {
      var a = [], cols = matrix.length, rows = matrix[0].length;
      for (var y = 0; y < rows; y++) {
        var c = [];
        for (var x = cols - 1; x > -1; x--) {
          c.push(matrix[x][y]);
        }
        a.push(c);
      }
      return a;
    },

    build: function () {
      return this.setMatrix().trigger("build");
    },

    destroyCell: function (x, y) {
      var self = this;
      delete self.matrix[x][y];
      self.trigger("destroy", [x, y]);
      if (self.structure) {
        self.structure[x][y] = 0;
      }
      return self;
    },

    serializeSelection: function () {
      var a = [], self = this;;
      for (var x = 0; x < self.columns; x++) {
        var column = [];
        for (var y = 0; y < self.rows; y++) {
          column.push(self.matrix[x][y].free ? 0 : 1);
        }
        a.push(column);
      }
      return a;
    },

    deserializeSelection: function (a) {
      var self = this;
      for (var x = 0, c = a.length; x < c; x++) {
        for (var y = 0, d = a[x].length; y < d; y++) {
          if (a[x][y] == 1) {
            self.occupy(x, y);
          } else {
            self.release(x, y);
          }
        }
      }
      return self;
    }

  });

  return Grid;
});
