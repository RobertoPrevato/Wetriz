//
// Keyboard controls interface
//
R("keyboard-controls", ["extend", "events", "event"], function (Extend, Events, Ev) {

  var KeyboardControls = function (params, props) {
    this.initialize(params, props);
  };

  KeyboardControls.extend = Extend;

  _.extend(KeyboardControls.prototype, Events, {

    defaults: {
      ev: "keydown",
      ns: "",
      keys: {}
    },

    initialize: function (params, props) {
      var self = this;
      self.active = true;
      self.options = _.defaults(params, self.defaults);
      _.extend(self, props);
      return self;
    },

    bindEvents: function () {
      var self = this, o = self.options;
      self.unbindEvents();
      $(document).on(o.ev + "." + o.ns, self.setControls.bind(self));
    },

    unbindEvents: function () {
      var o = this.options;
      $(document).off(o.ev + "." + o.ns);
      return this;
    },

    setControls: function (e) {
      var code = Ev.getEventKeyCode(e);
      this.keysControls(e, code);
    },

    keyMatch: function (key, e, code) {
      if (key === code) return true;
      if (typeof key.code == "number") {
        if (key.code !== code) return false;
        if ((key.shift && !e.shiftKey) || (key.ctrl && !e.ctrlKey) || (key.alt && !e.altKey)|| (key.meta && !e.metaKey)) return false;
        if (key.if && !key.if.call(e)) return false;
        if (key.ifnot && key.ifnot.call(e)) return false;
        return true;
      }
      return false;
    },

    keysControls: function (e, code) {
      var self = this, o = self.options, x;
      if (self.debug) console.log(code);
      if (self.active) {
        var keys = o.keys;
        for (x in keys) {
          if (self.keyMatch(keys[x], e, code)) {
            e.preventDefault();
            self
              .trigger("key", x)
              .trigger(x);
          }
        }
      }
      return true;
    }

  });

  return KeyboardControls;
});
