//
// Tetris grid class
//
R("tetris-grid", ["grid-base",
  "grid-cell",
  "tetris-block",
  "array",
  "anivalue"], function (Grid, Cell, TetrisBlock, ArrayUtils, AniValue) {

  var pick = ArrayUtils.pick;

  var colors = ["darkblue", "darkgreen", "steelblue", "darkred", "darkgreen", "darkblue", "aqua", "aliceblue", "pink", "violet", "goldenrod", "cadetblue"];

  var images = _.map([
      ["images/wi-0-0-0.png", "#9d9d9d"],
      ["images/wi-0-1-0.png", "#3ccd1f"],
      ["images/wi-0-2-0.png", "#86d8d8"],
      ["images/wi-0-3-0.png", "#8170d1"],
      ["images/wi-0-4-0.png", "#d7d926"],
      ["images/wi-0-5-0.png", "#ffa94d"],
      ["images/wi-0-6-0.png", "#d12622"],
      ["images/wi-0-7-0.png", "#df2b8d"],
      ["images/wi-0-8-0.png", "#9b17c8"],
      ["images/wi-0-9-0.png", "#151515"]/* // GLOBES!
      ["images/wi-1-0-0.png", "#9d9d9d"],
      ["images/wi-1-1-0.png", "#3ccd1f"],
      ["images/wi-1-2-0.png", "#86d8d8"],
      ["images/wi-1-3-0.png", "#8170d1"],
      ["images/wi-1-4-0.png", "#d7d926"],
      ["images/wi-1-5-0.png", "#ffa94d"],
      ["images/wi-1-6-0.png", "#d12622"],
      ["images/wi-1-7-0.png", "#df2b8d"],
      ["images/wi-1-8-0.png", "#9b17c8"],
      ["images/wi-1-9-0.png", "#151515"]*/
    ], function (p) {
    var image = new Image();
    image.src = p[0];
    image.clr = p[1];
    return image;
  });

  var TetrisGrid = Grid.extend({

    defaults: _.extend({}, Grid.prototype.defaults, {
      startingCoords: [3, 0],
      nextBlockCoords: [12, 0],
      animate: true
    }),

    pieces: {
      o: [
        [1, 1],
        [1, 1]
      ],
      t: [
        [1, 0],
        [1, 1],
        [1, 0]
      ],
      i: [
        [1, 1, 1, 1]
      ],
      l: [
        [1, 1, 1],
        [0, 0, 1]
      ],
      j: [
        [0, 0, 1],
        [1, 1, 1]
      ],
      s: [
        [0, 1],
        [1, 1],
        [1, 0]
      ],
      z: [
        [1, 0],
        [1, 1],
        [0, 1]
      ]
    },

    images: images,
    colors: colors,

    initialize: function (params, props) {
      var self = this;
      self.options = _.defaults(params, self.defaults);
      _.extend(self, props);
      self.debris = [];
      return self
        .setMatrix()
        .initializeBlocksModels();
    },

    start: function () {
      var self = this,
        o = self.options,
        startBlock = self.activeBlock = self.pickBlock(_.clone(o.startingCoords)),
        nextBlock = self.nextBlock = self.pickBlock(_.clone(o.nextBlockCoords));
      self
        .trigger("start")
        .setActiveBlockListeners(startBlock);
      return self;
    },

    setActiveBlockListeners: function (block) {
      var self = this,
        o = self.options;
      self.listenTo(block, "collide", function (block) {
        //merge and stop listening
        self.merge(block).stopListening(block);
        //remove reference to grid
        delete block.grid;
        //make next block current active block, and start listening to it
        var a = self.activeBlock = self.nextBlock;
        self.setActiveBlockListeners(a);
        a.coords = self.getStartingCoords();
        a.setMatrix();
        self.nextBlock = self.pickBlock(_.clone(o.nextBlockCoords));
        self.checkRows().trigger("block:collides");
      });
      return self;
    },

    /**
     * Merges a block inside the grid structure.
     * @param block
     * @returns {TetrisGrid}
     */
    merge: function (block) {
      var self = this,
        o = block.options,
        structure = block.structure,
        cols = structure.length,
        rows = structure[0].length,
        coords = block.coords,
        x = coords[0],
        y = coords[1];
      for (var i = 0; i < cols; i++) {
        for (var k = 0; k < rows; k++) {
          if (structure[i][k]) {
            self.occupy(x + i, y + k);
            //create a debris
            self.debris.push(self.createCell(x + i, y + k, _.pick(o, "color", "image")));
          }
        }
      }
      return self;
    },

    //checks if rows are completed, it releases them and move rows above
    checkRows: function () {
      var self = this,
        completedRows = self.occupiedRows();
      if (completedRows.length) {
        var debris = self.debris, debrisToDelete = [];
        for (var i = 0, len = completedRows.length; i < len; i++) {
          //free these cells logically
          var y = completedRows[i];
          self.releaseRow(y).trigger("row:released", y);
          //delete debris from this row
          debrisToDelete.push(_.filter(debris, function (o) {
            return o.my === y;
          }));
        }
        debrisToDelete = _.flatten(debrisToDelete);
        self.trigger("deleting", debrisToDelete);
        //remove deleted debris
        self.debris = _.reject(debris, function (o) {
          return _.contains(debrisToDelete, o);
        });
        //move selections logically
        self.fallRows().trigger("row:deletion", completedRows);
      }
      return self;
    },

    getStartingCoords: function () {
      return _.clone(this.options.startingCoords);
    },

    //transfers the rows cells occupied state to lower rows
    fallRows: function () {
      var self = this,
        o = self.options;
      //starts from the second last row to the bottom
      for (var y = o.rows - 1; y > -1; y--) {
        //no need to move free rows
        if (self.isRowFree(y)) { continue; }

        var destinationY = y;
        while (destinationY < o.rows - 1 && self.isRowFree(destinationY + 1)) {
          destinationY++;
        }
        if (destinationY != y) {
          self
            .moveRowSelection(y, destinationY)
            .moveDebris(y, destinationY);
        }
      }
      return self;
    },

    //moves a row selection from one coordinate to another
    moveDebris: function (y, destinationY) {
      var self = this, debris = self.debris, toMove = [];
      for (var i = 0, l = debris.length; i < l; i++) {
        var d = debris[i];
        if (d.my === y) {
          toMove.push(d);
        }
      }
      if (toMove.length) {
        var o = self.options, ch = o.cellHeight;
        // move with animation (?)
        if (o.animate || true) {
          new AniValue({
            length: 100,
            from: y * ch,
            to: destinationY * ch,
            fn: function (v) {
              _.each(toMove, function (d) {
                d.y = v;
              });
              window.draw();
            },
            onStop: function () {
              _.each(toMove, function (d) {
                d.my = destinationY;
              });
              window.draw();
            }
          });
        } else {
          _.each(toMove, function (d) {
            d.y = destinationY * ch;
            d.my = destinationY;
          });
        }
      }
      return self;
    },

    //initializes the blocks models
    initializeBlocksModels: function () {
      var self = this,
        options = self.options,
        models = self.blockModels = [],
        x,
        pickedColors = [];
      for (x in self.pieces) {
        models.push(TetrisBlock.extend({
          grid: self,
          structure: self.pieces[x],
          type: x
        }));
      }
      return self;
    },

    pickBlock: function (coords) {
      var self = this,
        i = pick(self.images),
        b = new (pick(self.blockModels))({
          grid: self,
          image: i,
          color: i.clr
        }, {
          coords: coords
        });
      b.structure = ArrayUtils.clone(self.pieces[b.type]);
      return b;
    },

    //needed for reference
    smashBlock: function () {
      this.activeBlock.smash();
    },

    rotateActiveBlock: function () {
      this.activeBlock.rotate();
    }
  });

  return TetrisGrid;
});
