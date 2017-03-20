if (document.readyState != 'loading') {
    onDocumentReady();
} else {
    document.addEventListener('DOMContentLoaded', onDocumentReady);
}

function onDocumentReady() {
  // Document ready
}





function Particle(x, y, maxAge) {
  this.pos = createVector(x, y);
  this.prevPos = this.pos.copy();
  this.vel = createVector(0, 0);
  this.acc = createVector(0, 0);
  this.age = 0;
  this.maxAge = maxAge;
  this.color = color('hsl('+floor(random(360))+', 75%, 75%)');

  this.applyForce = function(force) {
    this.acc.add(force);
  };

  this.update = function() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  };

  this.render = function() {
    stroke(this.color);
    line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
    this.prevPos = this.pos.copy();
  };
}

var particles = [];
var gravity;
var maxForce;
var minForce;
var frequency;
var splosion;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  background(33);
  gravity = createVector(0, 0.2);

  maxForce = floor(height * gravity.y) / -10;
  minForce = random(maxForce, -2);

  var p = new Particle(random(width), height, 0);
  p.applyForce(createVector(0, random(maxForce, minForce)));
  particles.push(p);

  frequency = createSlider(0.01, 0.1, 0.03, 0.01);
  frequency.position(10, 35);
  var frequencyLabel = createP('Frequency');
  frequencyLabel.style('color', '#fff');
  frequencyLabel.position(10, 0);

  splosion = createSlider(10, 100, 30, 1);
  splosion.position(10, 80);
  var splosionLabel = createP('Explosion');
  splosionLabel.style('color', '#fff');
  splosionLabel.position(10, 45);
}

function draw() {
  var del = [], i, j, p, prtcls = [], r;
  background(33, 75);
  for (i = 0; i < particles.length; i++) {
    particles[i].applyForce(gravity);
    particles[i].update();
    particles[i].render();
    if (particles[i].maxAge === 0 && particles[i].vel.y >= 0) {
      del.push(i);
    } else if (particles[i].maxAge) {
      particles[i].age++;
      if (particles[i].age > particles[i].maxAge) {
        del.push(i);
      }
    }
  }

  for(i = 0; i < particles.length; i++) {
    if (particles[i].maxAge === 0 && del.includes(i)) {
      for (j = 0; j < floor(random(splosion.value(), splosion.value() + 30)); j++) {
        p = new Particle(particles[i].pos.x, particles[i].pos.y, floor(random(30 ,60)));
        r = p5.Vector.random2D();
        r.mult(2);
        p.applyForce(r);
        p.applyForce(createVector(0, random(-6, -2)));
        prtcls.push(p);
      }
    } else if (!del.includes(i)) {
      prtcls.push(particles[i]);
    }
  }

  particles = Array.prototype.slice.call(prtcls, 0);

  if (random(1) < frequency.value()) {
    var p = new Particle(random(width), height, 0);
    p.applyForce(createVector(0, random(maxForce, minForce)));
    particles.push(p);
  }
}
