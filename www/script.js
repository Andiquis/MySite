const roles = [
    "Full-Stack Web Developer",
    "Egresado en Ing. de Software",
    "Backend NestJS",
    "Systems Architecture",
    "Amante de CyberSeguridad"
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;
let endDelay = 2000;
const typingEl = document.getElementById("typing-text");

function type() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
        typingEl.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50;
    } else {
        typingEl.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 100;
    }

    if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        typeSpeed = endDelay;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 300;
    }

    setTimeout(type, typeSpeed);
}

// Preloader Logic
const preloader = document.getElementById('preloader');
const loaderFill = document.querySelector('.loader-fill');
const loaderPerc = document.querySelector('.loader-percentage');

document.addEventListener("DOMContentLoaded", () => {
    let loadIdx = 0;
    const loaderInterval = setInterval(() => {
        loadIdx += Math.floor(Math.random() * 20) + 5;
        if(loadIdx >= 100) {
            loadIdx = 100;
            clearInterval(loaderInterval);
            setTimeout(() => {
                document.querySelector('.terminal-loader').classList.add('glitch-out');
                setTimeout(() => {
                    preloader.classList.add('preloader-exit');
                    if(typingEl) setTimeout(type, 500); // Inicia validación una vez desaparece
                }, 260);
            }, 300);
        }
        if(loaderFill) loaderFill.style.width = `${loadIdx}%`;
        if(loaderPerc) loaderPerc.textContent = `${loadIdx}%`;
    }, 150);
});

const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-fade');

const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const revealOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal-active');
            observer.unobserve(entry.target);
        }
    });
}, revealOptions);

revealElements.forEach(el => {
    if(!el.classList.contains('section-title')) {
        revealOnScroll.observe(el);
    }
});

const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});

const navToggle = document.querySelector(".nav-toggle");
const navPanel = document.getElementById("nav-panel");

if(navToggle && navPanel && navbar) {
    navToggle.addEventListener("click", () => {
        const isOpen = navbar.classList.toggle("menu-open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
        navToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
        navToggle.innerHTML = isOpen ? '<i class="fas fa-xmark"></i>' : '<i class="fas fa-bars"></i>';
    });

    navPanel.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navbar.classList.remove("menu-open");
            navToggle.setAttribute("aria-expanded", "false");
            navToggle.setAttribute("aria-label", "Abrir menú");
            navToggle.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
}

// Mouse Tracking for Card Glow Effect
document.addEventListener("mousemove", e => {
    document.querySelectorAll(".card-glow").forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
    });
});

const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let properties = {
    bgColor: '#0a0a0e',
    particleColor: 'rgba(0, 210, 255, 0.5)',
    particleRadius: 1.5,
    particleCount: 60,
    particleMaxCount: 100,
    lineLength: 150,
    particleSpeed: 0.5,
    mouseRadius: 120
};

let mouse = { x: null, y: null };
window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});
window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

window.addEventListener('resize', resizeCanvas);

function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    properties.particleCount = (canvas.width > 768) ? properties.particleMaxCount : 40;
    initParticles();
}

class Particle {
    constructor(){
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.velocityX = Math.random() * (properties.particleSpeed * 2) - properties.particleSpeed;
        this.velocityY = Math.random() * (properties.particleSpeed * 2) - properties.particleSpeed;
        this.life = Math.random() * 60 + 60;
    }
    position(){
        if(mouse.x != null && mouse.y != null){
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if(distance < properties.mouseRadius){
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (properties.mouseRadius - distance) / properties.mouseRadius;
                this.velocityX -= forceDirectionX * force * 0.1;
                this.velocityY -= forceDirectionY * force * 0.1;
            }
        }
        
        // Max speed limit
        if(this.velocityX > properties.particleSpeed*2) this.velocityX = properties.particleSpeed*2;
        if(this.velocityX < -properties.particleSpeed*2) this.velocityX = -properties.particleSpeed*2;
        if(this.velocityY > properties.particleSpeed*2) this.velocityY = properties.particleSpeed*2;
        if(this.velocityY < -properties.particleSpeed*2) this.velocityY = -properties.particleSpeed*2;

        (this.x + this.velocityX > canvas.width && this.velocityX > 0) || (this.x + this.velocityX < 0 && this.velocityX < 0) ? this.velocityX *= -1 : this.velocityX;
        (this.y + this.velocityY > canvas.height && this.velocityY > 0) || (this.y + this.velocityY < 0 && this.velocityY < 0) ? this.velocityY *= -1 : this.velocityY;
        this.x += this.velocityX;
        this.y += this.velocityY;
    }
    reDraw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, properties.particleRadius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = properties.particleColor;
        ctx.fill();
    }
}

function initParticles(){
    particles = [];
    for(let i = 0; i < properties.particleCount; i++){
        particles.push(new Particle());
    }
}

function drawLines(){
    let x1, y1, x2, y2, length, opacity;
    for(let i in particles){
        for(let j in particles){
            x1 = particles[i].x;
            y1 = particles[i].y;
            x2 = particles[j].x;
            y2 = particles[j].y;
            length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            if(length < properties.lineLength){
                opacity = 1 - length/properties.lineLength;
                ctx.lineWidth = '0.5';
                ctx.strokeStyle = `rgba(0, 210, 255, ${opacity * 0.3})`;
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.closePath();
                ctx.stroke();
            }
        }
        
        // Lines to mouse
        if(mouse.x != null && mouse.y != null){
            length = Math.sqrt(Math.pow(mouse.x - particles[i].x, 2) + Math.pow(mouse.y - particles[i].y, 2));
            if(length < properties.mouseRadius){
                opacity = 1 - length/properties.mouseRadius;
                ctx.lineWidth = '0.8';
                ctx.strokeStyle = `rgba(255, 87, 51, ${opacity * 0.5})`; // Naranja para conexión del mouse
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.closePath();
                ctx.stroke();
            }
        }
    }
}

function reDrawBackground(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function loop(){
    reDrawBackground();
    for(let i in particles){
        particles[i].position();
        particles[i].reDraw();
    }
    drawLines();
    requestAnimationFrame(loop);
}

resizeCanvas();
loop();

// Parallax Hero Effect
const heroContent = document.querySelector('.hero-content');
const heroImage = document.querySelector('.hero-image');

document.addEventListener("mousemove", (e) => {
    // Solo aplicar si estamos en la vista superior (hero)
    if(window.scrollY > window.innerHeight) return;
    
    // Calcular el desplazamiento relativo al centro
    const xAxis = (window.innerWidth / 2 - e.pageX) / 35;
    const yAxis = (window.innerHeight / 2 - e.pageY) / 35;
    
    if(heroContent) heroContent.style.transform = `translate(${xAxis}px, ${yAxis}px)`;
    if(heroImage) heroImage.style.transform = `translate(${xAxis * -1.2}px, ${yAxis * -1.2}px)`;
});

// Magnetic Buttons Effect
const magBtns = document.querySelectorAll('.mag-btn, .social-icon');
magBtns.forEach(btn => {
    btn.addEventListener('mousemove', function(e){
        const position = btn.getBoundingClientRect();
        const x = e.clientX - position.left - position.width / 2;
        const y = e.clientY - position.top - position.height / 2;
        
        btn.style.transition = 'none';
        btn.style.transform = `translate(${x * 0.4}px, ${y * 0.4}px) scale(1.05)`;
    });
    
    btn.addEventListener('mouseout', function(e){
        btn.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        btn.style.transform = `translate(0px, 0px) scale(1)`;
    });
});

// Random Glitch Trigger for H1
const glitchEl = document.querySelector('.glitch');
if(glitchEl) {
    setInterval(() => {
        glitchEl.style.textShadow = `
            ${Math.random() * 6 - 3}px ${Math.random() * 6 - 3}px 0px rgba(0, 210, 255, 0.5),
            ${Math.random() * -6 + 3}px ${Math.random() * -6 + 3}px 0px rgba(255, 87, 51, 0.5)
        `;
        setTimeout(() => {
            glitchEl.style.textShadow = 'none';
        }, 150);
    }, 3000);
}

// -----------------------------------------
// Custom Cursor Logic
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
let cursorX = 0, cursorY = 0, outlineX = 0, outlineY = 0;

if(cursorDot && cursorOutline) {
    document.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;
        cursorDot.style.left = `${cursorX}px`;
        cursorDot.style.top = `${cursorY}px`;
    });

    function animateCursor() {
        let distX = cursorX - outlineX;
        let distY = cursorY - outlineY;
        outlineX += distX * 0.3;
        outlineY += distY * 0.3;
        cursorOutline.style.left = `${outlineX}px`;
        cursorOutline.style.top = `${outlineY}px`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    document.querySelectorAll('a, button, .mag-btn, .social-icon, .skill-tags span').forEach(el => {
        el.addEventListener('mouseover', () => cursorOutline.classList.add('hover-active'));
        el.addEventListener('mouseout', () => cursorOutline.classList.remove('hover-active'));
    });
}

// -----------------------------------------
// Timeline Scroll Draw Logic
const timelineContainer = document.getElementById('timeline-container');
const timelineProgress = document.getElementById('timeline-progress');

window.addEventListener('scroll', () => {
    if(!timelineContainer || !timelineProgress) return;
    const rect = timelineContainer.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // We want the line to draw when the timeline is entering the view
    let scrolled = windowHeight / 2 - rect.top;
    if(scrolled < 0) scrolled = 0;
    
    let heightPerc = (scrolled / rect.height) * 100;
    if(heightPerc > 100) heightPerc = 100;
    timelineProgress.style.height = `${heightPerc}%`;
});


// -----------------------------------------
// Text Scramble on Reveal
class SectionTitleDecoder {
    constructor(el) {
        this.el = el;
        this.originalHtml = el.innerHTML;
        this.prefix = el.querySelector('span')?.outerHTML || '';
        this.target = (el.dataset.text || el.textContent).replace(/^\d+\.\s*/, '');
        this.chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&*+-/?';
        this.tickDelay = 42;
        this.frame = 0;
        this.update = this.update.bind(this);
    }

    start() {
        this.queue = Array.from(this.target).map((char, index) => ({
            char,
            start: Math.floor(Math.random() * 7) + index * 3,
            end: Math.floor(Math.random() * 22) + index * 3 + 30,
            current: this.randomChar()
        }));

        clearTimeout(this.frameTimer);
        this.frame = 0;
        this.update();
    }

    update() {
        let done = 0;
        const output = this.queue.map((item) => {
            if (item.char === ' ') {
                done++;
                return ' ';
            }

            if (this.frame >= item.end) {
                done++;
                return this.escapeHtml(item.char);
            }

            if (this.frame >= item.start) {
                item.current = this.randomChar();
            }

            return `<span class="decoder-char">${this.escapeHtml(item.current)}</span>`;
        }).join('');

        this.el.innerHTML = `${this.prefix} ${output}`;

        if (done === this.queue.length) {
            this.el.innerHTML = this.originalHtml;
            return;
        }

        this.frame++;
        this.frameTimer = setTimeout(this.update, this.tickDelay);
    }

    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }

    escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }
}

// Use Intersection Observer for Scrambling Headers
const scrambleObserver = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal-active');
            if(entry.target.hasAttribute('data-text')) {
                new SectionTitleDecoder(entry.target).start();
            }
            observer.unobserve(entry.target);
        }
    });
}, revealOptions);

document.querySelectorAll('.section-title').forEach(el => {
    scrambleObserver.observe(el);
});
