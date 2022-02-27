R("array", [], function () {

  return {
    contains: function (a, o) {
      return _.indexOf(a, o) > -1;
    },

    //executes a deep clone of the array, works also with matrix
    clone: function (a) {
      var c = [];
      for (var i = 0; i < a.length; i++) {
        if (a[i] instanceof Array) {
          c.push(this.clone(a[i]));
        } else {
          c.push(_.clone(a[i]));
        }
      }
      return c;
    },

    pick: function (a) {
      return a[Math.floor(Math.random() * (a.length))];
    },

    pickDistinct: function (a, b) {
      var o = this.pick(a);
      while (_.contains(b, o)) {
        o = this.pick(a);
      }
      return o;
    },

    pickArray: function (arr, k) {
      if (k > arr.length) { throw 'going to stack overflow'; }
      var r = [], o;
      while (k) {
        if (o = this.pick(arr), !_.contains(r, o)) {
          r.push(o);
          k--;
        }
      }
      return r;
    },

    remove: function (a, from, to) {
      if (!a instanceof Array) throw '[X.Array.Remove] - argument is not an array.';
      var rest = a.slice((to || from) + 1 || a.length);
      a.length = from < 0 ? a.length + from : from;
      return a.push.apply(a, rest);
    },

    getObjectsByValues: function (a, o, unique) {
      if (!a instanceof Array) throw '[X.Extensions.GetObjectsByValues] - argument[0] is not an array.';
      if (typeof o != 'object') throw '[X.Extensions.GetObjectsByValues] - argument[1] is not an object.';

      var prop = X.Object.CountProperties(o);
      if (!prop) throw '[X.Extensions.GetObjectsByValues] - argument[1] is an empty object.';

      var results = [];
      for (var i = 0; i < a.length; i++) {
        var match = 0;

        for (x in o) {
          if (a[i][x] === o[x]) {
            match++
          }
        }

        if (match == prop) {
          results.push(a[i]);
          if (unique) {
            break;
          }
        }
      }

      return results;
    },

    //Sorts an array of object, by the property name
    sortByProperty: function (arr, property, order) {
      arr.sort(function (a, b) {

        var c = a[property], d = b[property];

        if (typeof a[property] == 'string' && typeof b[property] == 'string') {
          c = a[property].toLowerCase();
          d = b[property].toLowerCase();
        }

        if (order.toLowerCase() == 'ascending' || order.toLowerCase() == 'asc') {
          if (c < d) return -1;
          if (c > d) return 1;
        } else {
          if (c < d) return 1;
          if (c > d) return -1;
        }
        return 0;
      });
    },

    sortNumericArray: function (arr) {
      arr.sort(function (a, b) {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
      });
      return arr;
    },

    valuesToString: function (a) {
      if (!a) return [];
      var b = [];
      for (var i = 0; i < a.length; i++) {
        b.push(a[i].toString());
      }
      return b;
    },

    getDictionaryValues: function (o) {
      if (!_.isObject(o)) throw '[X.Array.GetDictionaryValues] argument is not an object.';
      var a = [];
      for (x in o) {
        a.push(o[x]);
      }
      return a;
    },

    dictionaryToPairs: function (o, orderByValue) {
      if (!_.isObject(o)) throw '[X.Array.GetDictionaryValues] argument is not an object.';
      if (!_.isBoolean(orderByValue)) orderByValue = true;
      var a = [];
      for (x in o) {
        a.push({
          key: x,
          value: o[x]
        });
      }
      if (orderByValue) {
        X.Array.SortByProperty(a, 'value', 'asc');
      }
      return a;
    },

    getValues: function (name, a) {
      var b = [];
      for (var i = 0; i < a.length; i++) {
        if (a[i][name]) {
          b.push(a[i][name]);
        }
      }
      return b;
    },

    // Receives an array of objects and a dictionary of filters
    filter: function (a, f) {
      var b = [];
      for (var i = 0; i < a.length; i++) {
        for (x in f) {
          if (_.isArray(f[x])) {
            if (f[x].indexOf(a[i][x]) != -1) {
              b.push(a[i]);
            }
          }
          if (_.isFunction(f[x])) {
            if (f[x](a[i])) {
              b.push(a[i]);
            }
          }
        }
      }
      return b;
    },

    getMinimumTickIndex: function (a, val) {
      a = this.SortNumericArray(a);
      if (val > a[a.length - 1]) return a.length - 1;
      var i = 0;
      while (i < (a.length - 1) && val >= a[i]) {
        i++;
      }
      return i;
    },

    // Selects elements from an array that pass a function
    select: function (a, fn) {
      var b = [];
      for (var i = 0; i < a.length; i++) {
        if (fn(a[i], i)) {
          b.push(a[i]);
        }
      }
      return b;
    },

    makeUnique: function (a, keyField, keyValue, flagField, flagValue) {
      if (!_.isBoolean(flagValue)) {
        flagValue = true;
      }
      return _.map(a, function (o) {
        if (o[keyField] === keyValue) {
          o[flagField] = flagValue;
        } else {
          o[flagField] = !flagValue;
        }
        return o;
      });
    }
  };
});