/*
  Title: Bird (Time-Tracking Window Scene)
  Author: Lu Yao
  Date: 2025-10-19

  Instructions:
  - White birds appear every second.
  - Black birds appear every minute.
  - Background changes based on real-world time.

  Description:
  A window scene inspired by moments at my workbench. I often lose track of 
  time until a bird passes by the window. White birds represent seconds and 
  black birds represent minutes.

  Acknowledgements:
  - p5.js reference: https://p5js.org/reference/
*/

let W = 800, H = 500;
let windowX, windowY, windowW, windowH;

let lastSecond = -1;
let lastMinute = -1;

let birds = [];

let WHITE_SPEED = 2.4;
let BLACK_SPEED = 1.2;
let FLAP_STEP = 0.25;

function setup() {
  createCanvas(W, H);

  windowW = width * 0.6;
  windowH = height * 0.55;
  windowX = (width - windowW) / 2;
  windowY = (height - windowH) / 2;

  lastSecond = second();
  lastMinute = minute();
}

function draw() {
  background(238, 236, 232);

  let hr = hour();
  let mn = minute();
  let sc = second();
  let isDay = (hr >= 6 && hr < 18);

  // draw sky color
  noStroke();
  fill(isDay ? color(180, 210, 255) : color(40, 60, 100));
  rect(windowX, windowY, windowW, windowH);

  // sun / moon position
  let tDay = hr + mn / 60 + sc / 3600;
  let sunX = map(tDay, 0, 24, windowX, windowX + windowW);
  let sunY = windowY + windowH * 0.10;

  if (isDay) {
    fill(255, 230, 120);
    ellipse(sunX, sunY, 36, 36);
  } else {
    fill(240);
    ellipse(sunX, sunY, 26, 26);
    fill(40, 60, 100);
    ellipse(sunX + 6, sunY - 2, 26, 26);
  }

  // spawn birds based on time change
  if (sc !== lastSecond) {
    spawnBird(false);
    lastSecond = sc;
  }
  if (mn !== lastMinute) {
    spawnBird(true);
    lastMinute = mn;
  }

  // update and draw birds
  for (let b of birds) {
    b.x += b.v;         // horizontal movement
    b.flap += FLAP_STEP; // wing animation
    drawSimpleBird(b.x, b.y, b.isBlack, b.flap);
  }

  // remove birds off-screen
  birds = birds.filter(b => b.x < windowX + windowW + 100);

  drawBasicWindow();
  drawStaticCurtains();
}

function spawnBird(isBlack) {
  let by = windowY + random(windowH * 0.3, windowH * 0.65);
  let v = isBlack ? BLACK_SPEED : WHITE_SPEED;

  birds.push({
    x: windowX - 50,
    y: by,
    v: v,
    isBlack: isBlack,
    flap: 0
  });
}

function drawSimpleBird(x, y, isBlack, flapT) {
  push();
  translate(x, y);
  noStroke();
  fill(isBlack ? 30 : 255);

  let flap = sin(flapT) * 4;

  rect(-10, -3, 20, 6);         // body
  rect(-4, -8 + flap, 6, 6);    // upper wing
  rect(-4,  2 - flap, 6, 6);    // lower wing

  pop();
}

function drawBasicWindow() {
  stroke(60);
  strokeWeight(3);
  noFill();
  rect(windowX, windowY, windowW, windowH);

  noStroke();
  fill(200);
  rect(windowX - 10, windowY + windowH, windowW + 20, 15);
}

function drawStaticCurtains() {
  noStroke();
  fill(255);

  let curtainW = windowW * 0.25;
  let startY = windowY - 10;
  let curtainH = height - startY;

  rect(windowX - curtainW, startY, curtainW, curtainH);
  rect(windowX + windowW, startY, curtainW, curtainH);
}
