//
//  Value animation definition
//
R("anivalue", ["animation"], function (Animation) {

  return Animation.extend({

    defaults: {
      fn: function () { },
      from: 0,
      to: 100,
      freq: 25,
      length: 600,
      auto: true
    },

    step: function (i) {
      var self = this,
        to = self.to,
        from = self.from,
        j = self.jump,
        v = self.v += (to > from ? j : -j);
      self.fn(v);
    },

    onStart: function () {
      var self = this, to = self.to, from = self.from;
      self.v = from;
      self.jump = Math.abs(from - to) / self.iterations;
    },

    onStop: function () {
      var self = this,
        v = self.v = self.to;
      self.fn(v);
    }

  });
});