//Estructura canvas
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
// Jugador1
const player1 = "images/PrincesaLeiaPantalon.png";
// Jugador2 o Boot
const boot1 = "images/C3PO.png";
// Aliados
const ally1 = "images/R2D2.png";
const ally2 = "images/Chewbacca.png"
// Armas
const shooting1 = "images/disparo1.png";
const shooting2 = "images/disparo2.png.png"
// Fondo
const bg = "images/FondoNaves.png";
const lose = "images/GameOver.png";
const won = "images/You Win.png"

let interval;
const allies = [];
const shoots = [];
let frames = 0;

//Clases
class Board {
    constructor(img) {
        this.img = new Image();
        this.img.src = img;
        this.img.onload = () => {
            ctx.drawImage(this.img, 0, 0, canvas.width, canvas.height);
        };
    }
    draw() {
        ctx.drawImage(this.img, 0, 0, canvas.width, canvas.height);
    }
}

class Player {
    constructor() {
        this.width = 60;
        this.height = 76;
        this.hp = 250;
        this.x = 0;
        this.y = canvas.height - this.height - 40;
        this.img = new Image();
        this.img.src = player1;
        this.img.onload = () => {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        };
    }
    draw() {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
    damage() {
        this.hp = this.hp - 10
    }
    moveUp() {
        this.y -= 10;
    }
    moveDown() {
        this.y += 10;
    }
    moveLeft() {
        this.x -= 10;
    }
    moveRight() {
        this.x += 10;
    }
    touchBoot(boot) {
        return (
            this.x < boot.x + boot.width &&
            this.x + this.width > boot.x &&
            this.y < boot.y + boot.height &&
            this.y + this.height > boot.y
        );
    }
    shoot() {
        const w = new Shooter(this.x + this.width, this.y + this.height / 2 - 12);
        shoots.push(w);
    }
}

class Shooter {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 70;
        this.height = 15;
        this.img = new Image();
        this.img.src = shooting1;
    }
    draw() {
        this.x += 10;
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
}

class Boot {
    constructor() {
        this.width = 80;
        this.height = 110;
        this.hp = 250;
        this.x = canvas.width - (this.width * 2);
        this.y = canvas.height - this.height - 40;
        this.img = new Image();
        this.img.src = boot1;
        this.img.onload = () => {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        };
    }
    draw() {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
    damage() {
        this.hp = this.hp - 10;
    }
    moveUp() {
        this.y -= 10;
    }
    moveDown() {
        this.y += 10;
    }
    moveLeft() {
        this.x -= 10;
    }
    moveRight() {
        this.x += 10;
    }
    touchBoot(shooter) {
        return (
            this.x < shooter.x + shooter.width &&
            this.x + this.width > shooter.x &&
            this.y < shooter.y + shooter.height &&
            this.y + this.height > shooter.y
        );
    }
    shoot() {
        const w2 = new Shooter2(this.x + this.width, this.y + this.height / 1.5);
        shoots.push(w2);
    }
}

class Shooter2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = -70;
        this.height = -15;
        this.img = new Image();
        this.img.src = shooting1;
    }
    draw() {
        this.x -= 10;
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
}

class Ally {
    constructor(x, y) {
        this.width = 20;
        this.height = 40;
        this.x = x;
        this.y = y;
        this.img = new Image();
        this.img.src = ally1;
        this.img.onload = () => {
            this.draw();
        };
    }
    draw() {
        this.x--;
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
}

class Ally2 {
    constructor(x, y) {
        this.width = 20;
        this.height = 40;
        this.x = x;
        this.y = y;
        this.img = new Image();
        this.img.src = ally1;
        this.img.onload = () => {
            this.draw();
        };
    }
    draw() {
        this.x--;
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
}

// Declaraciones
const board = new Board(bg);
const player = new Player();
const boot = new Boot();
const ally = new Ally(0, 0);

//Juego
function update() {
    frames++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    board.draw();
    player.draw();
    boot.draw();
    generateAllies();
    drawAllies();
    checkCollition();
    drawShoots();
    drawLife();
}
//Inicio de juego
function start() {
    interval = setInterval(update, 1000 / 60);
}

function gameOver() {
    clearInterval(interval);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const overBackgrund = new Board(lose);
    overBackgrund.draw()
}
//Ganaste!!!
function win() {
    clearInterval(interval);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const winBackgrund = new Board(won);
    winBackgrund.draw()
}
// Crear allies
function generateAllies() {
    if (frames % 50 === 0) {
        const max = canvas.height - 40;
        const min = canvas.height / 2;
        const randomHeight = Math.floor(Math.random() * max) + min;
        const ally = new Ally(boot.x, randomHeight);
        allies.push(ally);
    }
}

function drawAllies() {
    allies.forEach(ally => ally.draw());
}

function drawShoots() {
    shoots.forEach(shoot => shoot.draw());
}

function checkCollition() {
    allies.forEach(ally => {
        if (player.touchBoot(ally)) {
            gameOver();
        }
    });
    shoots.forEach((shoot, index) => {
        if (boot.touchBoot(shoot)) {
            shoots.splice(index, 1);
            boot.damage();
        }
    });
    if (boot.hp === 0) {
        win();
    }
}

function checkCollition2() {
    allies.forEach(ally => {
        if (player.touchBoot(ally)) {
            gameOver();
        }
    });
    shoots.forEach((shoot, index) => {
        if (boot.touchBoot(shoot)) {
            shoots.splice(index, 1);
            boot.damage();
        }
    });
    if (boot.hp === 0) {
        win();
    }
}

function drawLife() {
    // ctx.shadowColor = 'red';
    // ctx.shadowOffsetX = 10;
    // ctx.shadowOffsetY = 10;
    // ctx.shadowColor = 'transparent';
    ctx.fillStyle = 'white'
    ctx.fillRect(25, 25, 350, 40);
    ctx.fillRect(canvas.width - 375, 25, 350, 40);
    // ctx.drawImage()
    ctx.fillStyle = 'red'
    ctx.fillRect(30, 30, (340 * player.hp) / 250, 30);
    ctx.fillRect(canvas.width - 370, 30, (340 * boot.hp) / 250, 30);
}

start();

addEventListener("keypress", function (e) {
    if (e.keyCode === 119) {
        player.moveUp();
    } else if (e.keyCode === 115) {
        player.moveDown();
    }
});
addEventListener("keyup", function (e) {
    if (e.keyCode === 32) {
        player.shoot();
    }
});
addEventListener("keypress", function (e) {
    if (e.keyCode === 38) {
        boot.moveUp();
    } else if (e.keyCode === 40) {
        boot.moveDown();
    }
});
addEventListener("keyup", function (e) {
    if (e.keyCode === 37) {
        boot.shoot();
    }
});