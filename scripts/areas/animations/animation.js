//
//  Animation definition
//
R("animation", ["extend", "events"], function (Extend, Events) {

  // NB: optimized animation cycle

  var Animation = function(options) {
    this.initialize(options);
  }

  Animation.extend = Extend;

  _.extend(Animation.prototype, Events, {

    defaults: {
      freq: 20,
      length: 600,
      auto: true
    },

    initialize: function (options) {
      var self = this, o = _.defaults(options || {}, self.defaults);
      _.extend(self, o);
      return self.auto ? self.start() : self;
    },

    step: function () {
      console.log("step", this.now());
    },

    stopper: function () {
      var self = this;
      return self.iteration >= self.iterations;
    },

    now: function () {
      return new Date().getTime();
    },

    start: function () {
      var self = this, freq = self.freq, length = self.length;
      self.iterations = length / freq;
      self.startTime = self.now();
      self.iteration = 0;

      self.interval = setInterval(function () {
        if (self.stopper(self)) {
          return self.stop();
        }
        var i = self.iteration++;

        self.step(i);
      }, freq);
      self.trigger("start").onStart();
      return self;
    },

    stop: function () {
      var self = this;
      clearInterval(self.interval);
      self.endTime = self.now();
      return self.trigger("stop").onStop();
    },

    onStart: function () {},

    onStop: function () {}

  });

  return Animation;
});
