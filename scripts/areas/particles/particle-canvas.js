//
// Particles canvas renderer
//
R("particle-canvas", ["particle"], function (Particle) {

  function randomFloat (min, max) {
    return min + Math.random()*(max-min);
  };

  return {

    drawParticle: function (context2D, particle) {
      var scale = particle.scale;
      // translating the 2D context to the particle coordinates
      context2D.save();
      context2D.translate(particle.x, particle.y);
      context2D.scale(scale, scale);

      // drawing a filled circle in the particle's local space
      context2D.beginPath();
      context2D.arc(0, 0, particle.radius, 0, Math.PI*2, true);
      context2D.closePath();

      context2D.fillStyle = particle.color;
      context2D.fill();
      context2D.restore();
      return particle;
    },

    createBasicExplosion: function (x, y) {
      // creating 4 particles that scatter at 0, 90, 180 and 270 degrees
      for (var angle = 0; angle < 360; angle += 90)
      {
        var particle = new Particle();

        // particle will start at explosion center
        particle.x = x;
        particle.y = y;

        particle.color = "#FF0000";

        var speed = 50.0;

        // velocity is rotated by "angle"
        particle.velocityX = speed * Math.cos(angle * Math.PI / 180.0);
        particle.velocityY = speed * Math.sin(angle * Math.PI / 180.0);

        // adding the newly created particle to the "particles" array
        particles.push(particle);
      }
    },

    createExplosion: function (x, y, color) {
      var minSize = 2;
      var maxSize = 10;
      var count = 10;
      var minSpeed = 60.0;
      var maxSpeed = 200.0;
      var minScaleSpeed = 1.0;
      var maxScaleSpeed = 4.0;
      var particles = [];
      for (var angle = 0; angle < 360; angle += Math.round( 360 / count))
      {
        var particle = new Particle();
        particle.x = x;
        particle.y = y;

        particle.radius = randomFloat(minSize, maxSize);

        particle.color = color;

        particle.scaleSpeed = randomFloat(minScaleSpeed, maxScaleSpeed);

        var speed = randomFloat(minSpeed, maxSpeed);

        particle.velocityX = speed * Math.cos(angle * Math.PI / 180.0);
        particle.velocityY = speed * Math.sin(angle * Math.PI / 180.0);

        particles.push(particle);
      }
      return particles;
    },

    update: function (context2D, frameDelay) {
      // update and draw particles
      for (var i = 0; i < particles.length; i++) {
        var particle = particles[i];
        particle.update(frameDelay);
        this.drawParticle(context2D, particle);
      }
    }

  };

});