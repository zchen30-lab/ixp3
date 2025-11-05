// Get DOM elements
const canvas = document.getElementById('screen');
const ctx = canvas.getContext('2d');
const powerButton = document.getElementById('power');
const caption = document.getElementById('caption');
const tvElement = document.getElementById('tv');

// Game state
let channel = 0;
let animationId = null;
let frameCount = 0;

// Animation objects
let boxers = {
    red: { x: 150, y: 200, direction: 1, punching: false },
    blue: { x: 450, y: 200, direction: -1, punching: false }
};

let moviePerson = { x: 50, y: 280, direction: 1 };
let explosionParticles = [];
let explosionFrame = 0;

// Button click handler
powerButton.addEventListener('click', () => {
    if (channel >= 3) return; // Already exploded

    channel++;

    // Flash effect
    flashScreen();

    // Update caption based on channel
    updateCaption();

    // Start appropriate channel animation
    if (animationId) {
        cancelAnimationFrame(animationId);
    }

    if (channel === 1) {
        startChannel1(); // Boxing
    } else if (channel === 2) {
        startChannel2(); // Movie
    } else if (channel === 3) {
        startChannel3(); // Explosion
    }
});

// Update caption text
function updateCaption() {
    const captions = [
        'Click the button to turn on the TV',
        'Channel 1: Pixel Boxing Championship',
        'Channel 2: Old Movie',
        'The TV has exploded.'
    ];
    caption.textContent = captions[channel];
}

// Flash screen effect
function flashScreen() {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    setTimeout(() => {
        if (channel < 3) {
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    }, 100);
}

// ============================================
// CHANNEL 0: TV OFF (with static noise)
// ============================================
function drawChannel0() {
    // Dark screen with noise
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Random static noise
    for (let i = 0; i < 200; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const brightness = Math.floor(Math.random() * 100);
        ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
        ctx.fillRect(x, y, 2, 2);
    }

    // Message
    ctx.fillStyle = '#444';
    ctx.font = '12px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('TV OFF', canvas.width / 2, canvas.height / 2);
}

// ============================================
// CHANNEL 1: PIXEL BOXING
// ============================================
function startChannel1() {
    animateChannel1();
}

function animateChannel1() {
    frameCount++;

    // Clear screen
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw boxing ring
    drawBoxingRing();

    // Draw "LIVE SPORTS" text with flicker
    if (Math.random() > 0.1) {
        ctx.fillStyle = '#ff4d4d';
        ctx.font = '16px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('LIVE SPORTS', canvas.width / 2, 40);
    }

    // Update and draw boxers
    updateBoxers();
    drawBoxer(boxers.red, '#ff4d4d', 'RED');
    drawBoxer(boxers.blue, '#4d8fff', 'BLU');

    animationId = requestAnimationFrame(animateChannel1);
}

function drawBoxingRing() {
    // Ring floor
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(100, 280, 400, 100);

    // Ring ropes
    for (let i = 0; i < 3; i++) {
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(100, 200 + i * 30);
        ctx.lineTo(500, 200 + i * 30);
        ctx.stroke();
    }

    // Corner posts
    ctx.fillStyle = '#888';
    ctx.fillRect(95, 180, 10, 120);
    ctx.fillRect(495, 180, 10, 120);
}

function updateBoxers() {
    // Red boxer movement
    boxers.red.x += boxers.red.direction * 2;
    if (boxers.red.x > 250 || boxers.red.x < 120) {
        boxers.red.direction *= -1;
    }

    // Blue boxer movement
    boxers.blue.x += boxers.blue.direction * 2;
    if (boxers.blue.x < 350 || boxers.blue.x > 480) {
        boxers.blue.direction *= -1;
    }

    // Random punching
    if (frameCount % 30 === 0) {
        boxers.red.punching = Math.random() > 0.5;
        boxers.blue.punching = Math.random() > 0.5;
    }
}

function drawBoxer(boxer, color, label) {
    // Head
    ctx.fillStyle = color;
    ctx.fillRect(boxer.x - 15, boxer.y - 60, 30, 30);

    // Body
    ctx.fillRect(boxer.x - 20, boxer.y - 30, 40, 50);

    // Arms
    const armExtension = boxer.punching ? 20 : 0;
    ctx.fillRect(boxer.x - 40, boxer.y - 20, 20 + armExtension, 10);
    ctx.fillRect(boxer.x + 20 - armExtension, boxer.y - 10, 20 + armExtension, 10);

    // Legs (bouncing effect)
    const bounce = Math.sin(frameCount * 0.1) * 3;
    ctx.fillRect(boxer.x - 15, boxer.y + 20 + bounce, 12, 30);
    ctx.fillRect(boxer.x + 3, boxer.y + 20 + bounce, 12, 30);

    // Label
    ctx.fillStyle = '#fff';
    ctx.font = '10px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(label, boxer.x, boxer.y - 70);
}

// ============================================
// CHANNEL 2: BLACK AND WHITE MOVIE
// ============================================
function startChannel2() {
    animateChannel2();
}

function animateChannel2() {
    frameCount++;

    // Clear screen with gray
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Film grain effect
    drawFilmGrain();

    // Moon/background
    ctx.fillStyle = '#4a4a4a';
    ctx.beginPath();
    ctx.arc(500, 80, 40, 0, Math.PI * 2);
    ctx.fill();

    // Ground
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(0, 300, canvas.width, 100);

    // Update and draw walking person
    updateMoviePerson();
    drawMoviePerson();

    // Film scratches (random vertical lines)
    if (Math.random() > 0.7) {
        const x = Math.random() * canvas.width;
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    // "Classic Cinema" label (flickering)
    if (Math.random() > 0.2) {
        ctx.fillStyle = '#888';
        ctx.font = '10px "Press Start 2P", monospace';
        ctx.textAlign = 'left';
        ctx.fillText('Classic Cinema', 20, 30);
    }

    // Film border (rounded corners vignette)
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 20;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    animationId = requestAnimationFrame(animateChannel2);
}

function drawFilmGrain() {
    ctx.fillStyle = 'rgba(150, 150, 150, 0.03)';
    for (let i = 0; i < 300; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        ctx.fillRect(x, y, 1, 1);
    }
}

function updateMoviePerson() {
    // Walk across screen
    moviePerson.x += moviePerson.direction * 1.5;

    // Reset when off screen
    if (moviePerson.x > canvas.width + 50) {
        moviePerson.x = -50;
    }
}

function drawMoviePerson() {
    const x = moviePerson.x;
    const y = moviePerson.y;
    const walkCycle = Math.sin(frameCount * 0.15);

    ctx.fillStyle = '#0a0a0a';

    // Head (with hat)
    ctx.fillRect(x - 10, y - 60, 20, 20);
    ctx.fillRect(x - 15, y - 65, 30, 5); // Hat brim
    ctx.fillRect(x - 8, y - 75, 16, 10); // Hat top

    // Body
    ctx.fillRect(x - 12, y - 40, 24, 35);

    // Arms (swinging)
    ctx.fillRect(x - 25, y - 30 + walkCycle * 10, 12, 30);
    ctx.fillRect(x + 13, y - 30 - walkCycle * 10, 12, 30);

    // Legs (walking)
    ctx.fillRect(x - 10 + walkCycle * 5, y - 5, 8, 25);
    ctx.fillRect(x + 2 - walkCycle * 5, y - 5, 8, 25);
}

// ============================================
// CHANNEL 3: EXPLOSION
// ============================================
function startChannel3() {
    explosionFrame = 0;
    explosionParticles = [];

    // Create explosion particles
    for (let i = 0; i < 50; i++) {
        explosionParticles.push({
            x: canvas.width / 2,
            y: canvas.height / 2,
            vx: (Math.random() - 0.5) * 15,
            vy: (Math.random() - 0.5) * 15,
            size: Math.random() * 20 + 5,
            color: ['#ffb347', '#ff5c33', '#fff7b0', '#ff3b3b'][Math.floor(Math.random() * 4)],
            life: 1.0
        });
    }

    // Shake and scale TV
    tvElement.classList.add('tv-shake');
    tvElement.classList.add('tv-explode');

    // Disable button
    powerButton.disabled = true;

    animateExplosion();
}

function animateExplosion() {
    explosionFrame++;

    // Rapid flashing for first few frames
    if (explosionFrame < 10) {
        const colors = ['#fff', '#ff5c33', '#ffb347', '#fff'];
        ctx.fillStyle = colors[explosionFrame % colors.length];
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
        // Draw explosion
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Update and draw particles
        explosionParticles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.3; // Gravity
            particle.life -= 0.015;
            particle.size *= 0.98;

            if (particle.life > 0) {
                ctx.globalAlpha = particle.life;
                ctx.fillStyle = particle.color;
                ctx.fillRect(particle.x - particle.size / 2, particle.y - particle.size / 2, particle.size, particle.size);
            }
        });

        ctx.globalAlpha = 1.0;

        // Draw smoke clouds after explosion
        if (explosionFrame > 30) {
            ctx.fillStyle = `rgba(80, 80, 80, ${Math.max(0, 0.8 - explosionFrame * 0.01)})`;
            for (let i = 0; i < 5; i++) {
                const smokeX = canvas.width / 2 + (Math.random() - 0.5) * 100;
                const smokeY = canvas.height / 2 + (Math.random() - 0.5) * 100 - explosionFrame * 2;
                const smokeSize = 40 + Math.random() * 40;
                ctx.beginPath();
                ctx.arc(smokeX, smokeY, smokeSize, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    // Continue animation for a while
    if (explosionFrame < 120) {
        animationId = requestAnimationFrame(animateExplosion);
    } else {
        // Final black screen with smoke remnants
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Faint smoke
        ctx.fillStyle = 'rgba(60, 60, 60, 0.3)';
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2 - 50, 80, 0, Math.PI * 2);
        ctx.fill();

        // "BOOM" text fading
        ctx.fillStyle = 'rgba(200, 200, 200, 0.2)';
        ctx.font = '48px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('BOOM', canvas.width / 2, canvas.height / 2);
    }
}

// ============================================
// INITIALIZATION
// ============================================
function init() {
    // Draw initial TV off state
    drawChannel0();

    // Start subtle static animation
    setInterval(() => {
        if (channel === 0) {
            drawChannel0();
        }
    }, 100);
}

// Start the app
init();
