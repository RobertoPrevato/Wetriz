//
// Grid canvas renderer
//
R("grid-canvas", [], function () {

  var colors = ["darkblue", "darkgreen", "steelblue", "darkred", "darkgreen", "darkblue", "aqua", "aliceblue", "pink", "violet", "goldenrod", "cadetblue"];
  var pick = function (a) { return a[Math.floor(Math.random() * (a.length))]; };

  function getPoints(grid) {
    var points = grid.points;
    if (_.isFunction(points)) points = points.call(grid);
    return points;
  };

  function getOptions(o, defaults) {
    return _.defaults(o || {}, defaults);
  };

  function unwrap(o) {
    var v = o;
    while (_.isFunction(v)) v = v();
    return v;
  };

  return {

    drawGrid: function (canvas, grid) {
      var c = canvas.getContext("2d");
      var o = grid.options, 
        cols = o.columns, 
        rows = o.rows,
        cellWidth = o.cellWidth;
        cellHeight = o.cellHeight,
        allHeight = rows * cellHeight,
        allWidth = cols * cellWidth;
        
      //var scale = 20;
      //var xMult = canvas.width / scale;
      //var yMult = canvas.height / scale;
      //c.scale(xMult, yMult);
      c.lineWidth = 1;// / scale
      c.font = '1pt Calibri';
      c.lineCap = 'square';
      c.strokeStyle = '#ff0000';
      
      c.beginPath();
      var margin = 0;
      
      for (var i = 0; i <= cols; i++) {
        var j = cellWidth * i;
        c.moveTo(j, margin);
        c.lineTo(j, allHeight);
      }
      for (var i = 0; i <= rows; i++) {
        var j = cellHeight * i;
        c.moveTo(margin, j);
        c.lineTo(allWidth, j);
      }
      c.stroke();
    },
    
    skeleton: function (canvas, grid, options) {
      var c = canvas.getContext("2d");
      var points = getPoints(grid),
        o = getOptions(options, {
          color: "red"
        });
      for (var i = 0, m = points.length; i < m; i++) {
        var p = points[i];
        if (!p) continue;
        var color = unwrap(o.color);
        c.strokeStyle = color;
        c.strokeRect(p.x, p.y, p.w, p.h);
      }
    },

    squares: function (canvas, grid, options) {
      var c = canvas.getContext("2d");
      var points = getPoints(grid),
        o = getOptions(options, {
          color: function () {
            return pick(colors);
          }
        }), color = unwrap(o.color);;
      for (var i = 0, m = points.length; i < m; i++) {
        var p = points[i];
        if (!p || p.hidden) continue;
        if (!p.color) p.color = color;
        c.fillStyle = p.color;
        c.fillRect(p.x, p.y, p.w, p.h);
      }
    },

    images: function (canvas, grid) {
      var c = canvas.getContext("2d");
      var points = getPoints(grid),
        o = grid.options,
        image = o ? o.image : null;
      for (var i = 0, m = points.length; i < m; i++) {
        var p = points[i];
        if (!p || p.hidden) continue;
        c.drawImage(image || p.image, p.x, p.y, p.w, p.h);
      }
    }
  };
});
