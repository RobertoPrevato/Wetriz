//
// Grid cell class
//
R("grid-cell", ["extend", "events"], function (Extend, Events) {

  var Cell = function (params) {
    this.initialize(params);
  };

  Cell.extend = Extend;

  _.extend(Cell.prototype, Events, {

    //by default, every cell is instantiated in free state
    free: true,

    defaults: {
      h: 28,
      w: 28
    },

    initialize: function (params) {
      var self = this;
      _.defaults(self, params, self.defaults);
      return self;
    },

    occupy: function () {
      return this.state(false, "occupy");
    },

    release: function () {
      return this.state(true, "release");
    },

    state: function (free, ev) {
      var self = this;
      self.free = free;
      self.trigger(ev);
      return self;
    }
  });

  return Cell;
});
