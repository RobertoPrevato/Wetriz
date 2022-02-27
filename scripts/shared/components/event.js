//
// Event utilities
//
R("event", [], function () {

  return {

    stopDefault: function (e, noBubbles) {
      e = e || w.e;

      if (e.preDefault) {
        e.preDefault();
      } else {
        e.returnValue = false;
      }

      if (noBubbles) {
        if (e.stopPropagation) {
          e.stopPropagation();
        } else {
          e.cancelBubble = true;
        }
      }
    },

    getMousePosition: function (e) {
      return {
        x: this.getMouseX(e),
        y: this.getMouseY(e)
      };
    },

    getMouseClickAbsolutePosition: function (e) {
      return {
        x: e.pageX,
        y: e.pageY
      };
    },

    getMouseClickRelativePosition: function (e) {
      var parentOffset = $(e.target).parent().offset();
      //or $(this).offset(); if you really just want the current element's offset
      return {
        x: e.pageX - parentOffset.left,
        y: e.pageY - parentOffset.top
      };
    },

    getMouseX: function (e) {
      if (e.pageX) return e.pageX;
      else if (e.clientX)
        return e.clientX + (document.documentElement.scrollLeft ?
                     document.documentElement.scrollLeft :
                     document.body.scrollLeft);
      else return 0;
    },

    getMouseY: function (e) {
      if (e.pageY) return e.pageY;
      else if (e.clientY)
        return e.clientY + (document.documentElement.scrollTop ?
                     document.documentElement.scrollTop :
                     document.body.scrollTop);
      else return 0;
    },

    getEventKeyCode: function (e) {
      return e.keyCode ? e.keyCode : e.charCode;
    },

    enterWasClicked: function (e) {
      return this.getEventKeyCode(e) == this.key.enter;
    },

    key: {
      tab: 9,
      enter: 13,
      shift: 16,
      ctrl: 17,
      alt: 18,
      capsLock: 20,
      escape: 27,
      esc: 27,
      pageUp: 33,
      pageDown: 34,
      end: 35,
      beginning: 36,
      left: 37,
      top: 38,
      right: 39,
      down: 40,
      windows: 91
    }

  };
});