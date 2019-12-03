const progressBar = document.querySelector("progress");

function randomColor() {
  const red = Math.floor(Math.random() * 255);
  const green = Math.floor(Math.random() * 255);
  const blue = Math.floor(Math.random() * 255);
  return `rgba(${red},${green},${blue},0.5)`;
}

class Sprite {
  constructor(x, y, color, diameter) {
    Object.assign(this, { x, y, color, diameter });
  }
  get radius() {
    return this.diameter/2;
  }
}

class Player extends Sprite {
  constructor() {
    super(0, 0, "white", 20);
    this.health = 100;
  }
  render() {
    fill(this.color);
    circle((this.x = mouseX), (this.y = mouseY), this.diameter);
  }
  takeHit() {
    player.health -= 1;
    console.log();
    progressBar.value = player.health;
  }
}

class Enemy extends Sprite {
  constructor(x, y, speed) {
    super(x, y, randomColor(), 50);
    this.speed = speed;
  }
  render() {
    fill(this.color);
    circle(this.x, this.y, this.diameter);
  }
  move() {
    this.x += this.speed * (mouseX - this.x);
    this.y += this.speed * (mouseY - this.y);
  }
}

function collided(sprite1, sprite2) {
  const distanceBetween = Math.hypot(
    sprite1.x - sprite2.x,
    sprite1.y - sprite2.y
  );
  const sumOfRadii = sprite1.diameter / 2 + sprite2.diameter / 2;
  return distanceBetween < sumOfRadii;
}

function randomPointOnCanvas() {
  return [
    Math.floor(Math.random() * width),
    Math.floor(Math.random() * height)
  ];
}

let width = 500;
let height = 400;
let player = new Player();
let enemies = [
  new Enemy(...randomPointOnCanvas(), 0.05),
  new Enemy(...randomPointOnCanvas(), 0.002),
  new Enemy(...randomPointOnCanvas(), 0.01)
];

function setup() {
  createCanvas(width, height);
}

function draw() {
  background("lightgreen");
  player.render();
  enemies.forEach(enemy => {
    enemy.render();
    checkForDamage(enemy, player);
    enemy.move();
  });
  adjustSprites();
}

function checkForDamage(enemy, player) {
  if (collided(player, enemy)) {
    player.takeHit();
  }
}

function adjustSprites() {
  const characters = [player, ...enemies];
  for (let i = 0; i < characters.length; i++) {
    for (let j = i + 1; j < characters.length; j++) {
      pushOff(characters[i], characters[j]);
    }
  }
}

function pushOff(c1, c2) {
  let [dx, dy] = [c2.x - c1.x, c2.y - c1.y];
  const distance = Math.hypot(dx, dy);
  let overlap = c1.radius + c2.radius - distance;
  if (overlap > 0) {
    const adjustX = overlap / 2 * (dx / distance);
    const adjustY = overlap / 2 * (dy / distance);
    c1.x -= adjustX;
    c1.y -= adjustY;
    c2.x += adjustX;
    c2.y += adjustY;
  }
}

