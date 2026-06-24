const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let score = 0;
let gameActive = true;
let currentFact = "Maasai Mara: Protect the wildlife!";
const facts = [
    "Elephants are ecosystem engineers, creating paths for other species.",
    "The Mara hosts the Great Migration, involving over 1.5 million wildebeest.",
    "Rhinos are critically endangered due to illegal poaching for their horns.",
    "Cheetahs are the fastest land animals but lose kills to larger predators.",
    "Vultures are nature's cleanup crew, preventing the spread of diseases."
];

const player = { x: 400, y: 300, size: 25, speed: 5, color: '#3498db' };
const animals = [];
const poachers = [];
const keys = {};

window.addEventListener('keydown', e => keys[e.key] = true);
window.addEventListener('keyup', e => keys[e.key] = false);

function spawnWildlife() {
    if (animals.length < 4) {
        animals.push({
            x: Math.random() * (canvas.width - 20),
            y: Math.random() * (canvas.height - 20),
            size: 15,
            color: '#f1c40f'
        });
    }
}

function spawnPoachers() {
    if (poachers.length < 3 + Math.floor(score / 50)) {
        poachers.push({
            x: Math.random() * canvas.width,
            y: -20,
            size: 20,
            speed: 2 + Math.random() * 2,
            color: '#e74c3c'
        });
    }
}

function update() {
    if (!gameActive) return;

    if ((keys.ArrowUp || keys.w) && player.y > 0) player.y -= player.speed;
    if ((keys.ArrowDown || keys.s) && player.y < canvas.height - player.size) player.y += player.speed;
    if ((keys.ArrowLeft || keys.a) && player.x > 0) player.x -= player.speed;
    if ((keys.ArrowRight || keys.d) && player.x < canvas.width - player.size) player.x += player.speed;

    animals.forEach((animal, index) => {
        const dist = Math.hypot(player.x - animal.x, player.y - animal.y);
        if (dist < player.size) {
            animals.splice(index, 1);
            score += 10;
            currentFact = facts[Math.floor(Math.random() * facts.length)];
        }
    });

    poachers.forEach((poacher, index) => {
        poacher.y += poacher.speed;
        if (poacher.y > canvas.height) {
            poachers.splice(index, 1);
        }
        const dist = Math.hypot(player.x - poacher.x, player.y - poacher.y);
        if (dist < player.size) {
            gameActive = false;
        }
    });

    spawnWildlife();
    spawnPoachers();
}

function draw() {
    ctx.fillStyle = '#27ae60';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.size, player.size);

    animals.forEach(a => {
        ctx.fillStyle = a.color;
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.size / 2, 0, Math.PI * 2);
        ctx.fill();
    });

    poachers.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
    });

    ctx.fillStyle = 'white';
    ctx.font = 'bold 20px Arial';
    ctx.fillText(`Conservation Score: ${score}`, 20, 30);
    
    ctx.font = '14px Arial';
    ctx.fillText(currentFact, 20, canvas.height - 20);

    if (!gameActive) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '40px Arial';
        ctx.fillText("GAME OVER", 280, 250);
        ctx.font = '20px Arial';
        ctx.fillText("A poacher caught the ranger!", 270, 300);
        ctx.fillText("Press F5 to restart and protect the Mara.", 220, 340);
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();