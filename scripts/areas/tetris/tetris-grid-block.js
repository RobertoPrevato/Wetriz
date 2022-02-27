//
// Tetris grid block
//
R("tetris-block", ["grid-block"], function (Block) {

  var TetrisBlock = Block.extend({

    smash: function () {
      var self = this,
        coords = self.coords,
        destinationY = coords[1];
      while (self.hasRoom(coords[0], destinationY + 1)) {
        destinationY++;
      }
      coords[1] = destinationY;
      return self.collide();
    },

    collide: function () {
      var self = this;
      self.inactive = true;
      return self.u().trigger("collide", self);
    },

    canMoveDown: function () {
      var self = this, coords = self.coords;
      return self.hasRoom(coords[0], coords[1] + 1);
    },

    //tetris blocks cannot moveup
    moveUp: undefined
  });

  return TetrisBlock;
});
