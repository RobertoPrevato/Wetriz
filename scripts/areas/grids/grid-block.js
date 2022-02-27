//
// Grid block class
//
R("grid-block", ["grid-base"], function (Grid) {

  var Block = Grid.extend({

    defaults: {
      cellWidth: 28,
      cellHeight: 28
    },

    //returns true if this block has room at the given coordinates relatively to the given grid
    hasRoom: function (x, y, grid, structure) {
      var self = this,
        und = undefined,
        coords = self.coords;
      if (!grid)
        grid = self.grid;
      if (!structure)
        structure = self.structure;
      if (!coords || !grid || !structure) throw "missing parameter";
      if (x == und)
        x = coords[0];
      if (y == und)
        y = coords[1];

      var cols = structure.length, rows = structure[0].length;
      for (var i = 0; i < cols; i++) {
        for (var k = 0; k < rows; k++) {
          if (structure[i][k] && !grid.isFree(x + i, y + k)) {
            return false;
          }
        }
      }
      return true;
    },

    canMove: function (x, y, grid) {
      var self = this, coords = self.coords;
      return self.hasRoom(coords[0] + x, coords[1] + y, grid);
    },

    //rotates clockwise
    rotate: function () {
      var self = this,
        rotatedStructure = self.rotateMatrixCounterClockwise(self.structure);

      if (self.coords && self.grid) {
        //block placed inside a grid, check if it has space to rotate
        if (!self.hasRoom(self.coords[0], self.coords[1], self.grid, rotatedStructure)) {
          //block cannot rotate because of missing space
          return;
        }
      }

      self.structure = rotatedStructure;
      self
        .u()
        .trigger("rotate");
      return self;
    },

    moveLeft: function () {
      var self = this, coords = self.coords;
      if (self.hasRoom(coords[0] - 1, coords[1])) {
        coords[0]--;
      }
      return self.u();
    },

    moveRight: function () {
      var self = this, coords = self.coords;
      if (self.hasRoom(coords[0] + 1, coords[1])) {
        coords[0]++;
      }
      return self.u();
    },

    moveDown: function () {
      var self = this, coords = self.coords;
      if (self.hasRoom(coords[0], coords[1] + 1)) {
        self.coords[1]++;
      }
      return self.u();
    },

    moveUp: function () {
      var self = this;
      if (self.hasRoom(self.coords[0], self.coords[1] - 1)) {
        self.coords[1]--;
      }
      return self.u();
    },

    u: function () {
      //update shortcut
      return this.setMatrix();
    },

    setMatrix: function () {
      var self = this,
        structure = self.structure,
        o = self.options;
      o.columns = structure.length;
      o.rows = structure[0].length;

      var m = self.matrix = [];
      for (var x = 0; x < o.columns; x++) {
        var column = [];
        for (var y = 0; y < o.rows; y++) {
          if (structure[x][y]) {
            column.push(self.createCell(x, y));
          } else {
            column.push(0);
          }
        }
        m.push(column);
      }
      return self;
    },

    width: function () {
      var o = this.options;
      return o.columns * o.cellWidth;
    },

    height: function () {
      var o = this.options;
      return o.rows * o.cellHeight;
    }

  });

  return Block;
});
