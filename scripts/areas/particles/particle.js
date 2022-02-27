//
// A particle object that can be drawn by a canvas
//
R("particle", ["extend", "events"], function (Extend, Events) {

  var Particle = function (options) {
    this.initialize(options);
  };

  Particle.extend = Extend;

  _.extend(Particle.prototype, Events, {

    defaults: {
      scale: 1,
      x: 0,
      y: 1,
      radius: 20,
      color: "#000",
      velocityX: 0,
      velocityY: 0,
      scaleSpeed: 0.5
    },

    initialize: function (options) {
      var self = this, o = _.defaults({}, self.defaults, options);
      _.extend(self, o);
      return self;
    },

    update: function (ms) {
      var self = this;
      // shrinking
      self.scale -= self.scaleSpeed * ms / 1000.0;

      if (self.scale <= 0)
      {
        self.scale = 0;
      }
      // moving away from explosion center
      self.x += self.velocityX * ms / 1000.0;
      self.y += self.velocityY * ms / 1000.0;
      return self;
    }

  });

  return Particle;
});
