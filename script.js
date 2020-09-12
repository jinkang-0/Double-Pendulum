// global variables
var paused = false;
var stepping = false;
var drawing = false;

// variables for measurements
let len1 = 2;
let len2 = 1;
let x1 = 0;
let y1 = 0;
let x2 = 0;
let y2 = 0;
let r1 = Math.PI/4;
let r2 = 0;

// variables to deal with physics
let v1 = 0;
let v2 = 0;
let a1 = 0.1;
let a2 = 0.1;
let m1 = 6;
let m2 = 5;
let g = 9.8 / (60*60);

// setup canvases
var canvas = document.getElementById('main_canvas');
var c = canvas.getContext('2d');

var canvas2 = document.getElementById('sub_canvas');
var c2 = canvas2.getContext('2d');

canvas.width = window.innerWidth - 50;
canvas.height = window.innerHeight;
canvas2.width = window.innerWidth - 50;
canvas2.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth - 50;
  canvas.height = window.innerHeight;
  canvas2.width = window.innerWidth - 50;
  canvas2.height = window.innerHeight;
});

function draw() {

  // set clean canvas
  c.resetTransform();
  c.clearRect(0, 0, canvas.width, canvas.height);
  returnToOrigin();

  // basic setup
  c.strokeStyle = "lightgray";

  c.beginPath();
  c.lineTo(0, 0);
  c.fill();
  c.closePath();

  // store x and y for drawing lines
  let px1 = x1;
  let py1 = y1;
  let px2 = x2;
  let py2 = y2;

  // calculate movement
  if (paused == false || stepping == true) {
    let part1 = -g * (2 * m1 + m2) * Math.sin(r1);
    let part2 = m2 * g * Math.sin(r1 - 2 * r2);
    let part3 = 2 * Math.sin(r1 - r2) * m2;
    let part4 = (v2 * v2 * len2) + v1 * v1 * len1 * Math.cos(r1 - r2);
    let part5 = len1 * (2 * m1 + m2 - m2 * Math.cos(2 * r1 - 2 * r2));
    a1 = (part1 - part2 - part3 * part4) / part5;
  
    part1 = 2 * Math.sin(r1 - r2);
    part2 = v1 * v1 * len1 * (m1 + m2);
    part3 = g * (m1 + m2) * Math.cos(r1);
    part4 = v2 * v2 * len2 * m2 * Math.cos(r1 - r2);
    part5 = len2 * (2 * m1 + m2 - (m2 * Math.cos(2 * r1 - 2 * r2)));
    a2 = (part1 * (part2 + part3 + part4)) / part5;

    v1 += a1;
    v2 += a2;

    v1 *= 0.999;
    v2 *= 0.999;

    r1 += v1;
    r2 += v2;
  }

  // animate & calculate pendulums
  x1 = Math.sin(r1) * (100*len1);
  y1 = Math.cos(r1) * (100*len1);
  x2 = Math.sin(r2) * (100*len2);
  y2 = Math.cos(r2) * (100*len2);

  returnToOrigin();
  c.lineTo(x1, y1);
  c.translate(x1, y1);
  c.lineTo(x2, y2);
  c.stroke();
  c.closePath();

  // draw dots
  returnToOrigin();
  c.fillStyle = "black";

  drawCircle(0, 0, 10);
  drawCircle(x1, y1, m1);
  c.translate(x1, y1);
  drawCircle(x2, y2, m2);

  if (drawing) {
    c2.resetTransform();
    c2.translate(canvas2.width/2, canvas2.height/4);
    c2.translate(px1, py1);
    c2.strokeStyle = "white";
    c2.beginPath();
    c2.moveTo(px2, py2);
    c2.translate(-px1, -py1);
    c2.translate(x1, y1);
    c2.lineTo(x2, y2);
    c2.closePath();
    c2.stroke();
  }

  // loop
  if (stepping) return;
  requestAnimationFrame(draw);
}

draw();

function returnToOrigin() {
  c.resetTransform();
  c.translate(canvas.width/2, canvas.height/4);
}

function drawCircle(x, y, radius) {
  c.beginPath();
  c.arc(x, y, radius, 0 , 360);
  c.closePath();
  c.fill();
}

//
// other stuff
//

var sidebar = 0;

function sidebarHandler() {
  if (sidebar == 0) {
    expandSidebar();
  } else {
    collapseSidebar();
  }
}

function expandSidebar() {
  sidebar = 1;
  document.querySelector(".sidebar").classList.replace('collapsed', 'expanded');
}

function collapseSidebar() {
  sidebar = 0;
  document.querySelector(".sidebar").classList.replace('expanded', 'collapsed');
}

function updateLength(pendulum, length) {
  if (pendulum == 1) {
    len1 = length/100;
    document.getElementById('length1').innerHTML = len1;
  } else {
    len2 = length/100;
    document.getElementById('length2').innerHTML = len2;
  }
}

function updateMass(pendulum, mass) {
  if (pendulum == 1) {
    m1 = mass/100;
    document.getElementById('mass1').innerHTML = m1;
  } else {
    m2 = mass/100;
    document.getElementById('mass2').innerHTML = m2;
  }
}

function updateGrav(gravity) {
  g = gravity/100/(60*60);
  document.getElementById('gravity').innerHTML = gravity/100;
}

function pause() {
  // change icon & change paused variable
  if (paused == true) {
    
    document.querySelector('.fa-play').classList.replace('fa-play', 'fa-pause');
    paused = false;

    if (stepping) {
      stepping = false;
      draw();
    }

  } else {
    document.querySelector('.fa-pause').classList.replace('fa-pause', 'fa-play');
    paused = true;
  }
}

function restart() {

  drawing = false;

  // set variables back to default
  len1 = 2;
  len2 = 1;
  x1 = 0;
  y1 = 0;
  x2 = 0;
  y2 = 0;
  r1 = Math.PI/4;
  r2 = 0;

  v1 = 0;
  v2 = 0;
  a1 = 0.1;
  a2 = 0.1;
  m1 = 6;
  m2 = 5;
  g = 9.8 / (60*60);

  // update sliders
  document.getElementById('slider1').value = 200;
  document.getElementById('slider2').value = 100;
  document.getElementById('slider3').value = 600;
  document.getElementById('slider4').value = 500;
  document.getElementById('slider5').value = 980;

  // update values
  document.getElementById('length1').innerHTML = 2;
  document.getElementById('length2').innerHTML = 3;
  document.getElementById('mass1').innerHTML = 6;
  document.getElementById('mass2').innerHTML = 5;
  document.getElementById('gravity').innerHTML = 9.8;

  // pause if not already
  if (paused == false) {
    pause();
  }
}

function step() {

  // pause if not already
  if (paused == false) {
    pause();
  }

  stepping = true;

  for (var i = 0; i < 10; i++) {
    draw();
  }

}

function plotDot() {
  c2.resetTransform();
  c2.translate(canvas2.width/2, canvas2.height/4);
  c2.translate(x1, y1);
  c2.fillStyle = "white";
  c2.beginPath();
  c2.arc(x2, y2, 3, 0, 360);
  c2.closePath();
  c2.fill();
}

function startDraw() {
  if (drawing == true) {
    drawing = false;
  } else {
    drawing = true;
  }
}

function clearGraph() {
  drawing = false;
  c2.resetTransform();
  c2.clearRect(0, 0, canvas2.width, canvas2.height);
}