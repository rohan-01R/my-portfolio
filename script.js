// --- 1. CREATE DANCING NAME ANIMATION ---
function createDancingText() {
    const container = document.getElementById('dancing-name');
    const firstName = "ROHAN";
    const lastName = "NAYAK";
    
    const createLetter = (char, index) => {
        const span = document.createElement('span');
        span.innerText = char;
        span.className = 'dance-char';
        span.style.animationDelay = `${index * 0.1}s`;
        return span;
    };

    firstName.split('').forEach((char, i) => {
        container.appendChild(createLetter(char, i));
    });

    const space = document.createElement('span');
    space.className = 'space-char';
    container.appendChild(space);

    lastName.split('').forEach((char, i) => {
        container.appendChild(createLetter(char, i + firstName.length));
    });
}

window.addEventListener('load', () => {
    createDancingText();
    gsap.from("#home button", { opacity: 0, y: 50, duration: 1, delay: 1 });
    
    // Start Clock
    setInterval(updateClock, 1000);
    updateClock(); // Initial call
});

// --- 2. LOCATION ZOOM ANIMATION (UPDATED) ---
function updateClock() {
    const clockEl = document.getElementById('ist-clock');
    if(clockEl) {
        const options = { timeZone: 'Asia/Kolkata', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
        const timeString = new Date().toLocaleTimeString('en-US', options);
        clockEl.innerText = timeString;
    }
}

function playMapZoomAnimation() {
    const flagVideo = document.getElementById('bg-flag');
    const mapContainer = document.getElementById('map-container');
    const mapImage = document.getElementById('zoom-map');

    // 1. Fade out flag, fade in map
    flagVideo.style.opacity = '0';
    mapContainer.style.opacity = '1';

    // 2. GSAP Zoom Sequence
    // Reset scale first
    gsap.set(mapImage, { scale: 1, transformOrigin: "center center" });

    const tl = gsap.timeline();

    // Step 1: Zoom roughly into India (coordinates approx 68% 45% on standard world map)
    tl.to(mapImage, {
        scale: 3.5,
        transformOrigin: "68% 42%", 
        duration: 2.5,
        ease: "power2.inOut"
    })
    // Step 2: Zoom deeper specifically into Odisha (slightly lower right from center India)
    .to(mapImage, {
        scale: 12, // Deep zoom
        transformOrigin: "70% 46%", // Coordinates tuned for Odisha
        duration: 3,
        ease: "power2.inOut",
        delay: 0.2
    });

    // Reset after animation finishes (8s total) to allow re-watching or seeing flag again
    setTimeout(() => {
        gsap.to(mapImage, { scale: 1, duration: 1.5, ease: "power2.out" });
        setTimeout(() => {
            mapContainer.style.opacity = '0';
            flagVideo.style.opacity = '1';
        }, 1500);
    }, 8000);
}

// --- 3. THREE.JS PARTICLES ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

const geometry = new THREE.BufferGeometry();
const count = 1000;
const positions = new Float32Array(count * 3);
for(let i=0; i<count*3; i++) {
    positions[i] = (Math.random() - 0.5) * 50; 
}
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const material = new THREE.PointsMaterial({ size: 0.05, color: 0xffffff, transparent: true, opacity: 0.5 });
const particles = new THREE.Points(geometry, material);
scene.add(particles);
camera.position.z = 10;

function animate3D() {
    requestAnimationFrame(animate3D);
    particles.rotation.y += 0.0005; 
    renderer.render(scene, camera);
}
animate3D();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- 4. PAGE NAVIGATION ---
function goToSection(id) {
    const activeSection = document.querySelector('.section.active');
    const targetSection = document.getElementById(id);
    if(activeSection === targetSection) return;

    gsap.to(activeSection, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
            activeSection.classList.remove('active');
            targetSection.classList.add('active');
            gsap.fromTo(targetSection, { opacity: 0 }, { opacity: 1, duration: 0.6 });

            if(id === 'services') {
                const listView = document.getElementById('services-list-view');
                const detailView = document.getElementById('service-detail-view');
                listView.classList.remove('hidden');
                listView.style.opacity = 1;
                listView.style.transform = 'none';
                detailView.classList.add('hidden');
            }
        }
    });
}

// --- 5. PROJECTS VIDEO POPUP ---
const projectsData = [
    { title: "Tech Video", category: "Gadget Review", video: "v5.mp4" },
    { title: "Documentary Video", category: "Storytelling", video: "v10.mp4" },
    { title: "YouTube Video Editing", category: "Vlog / Lifestyle", video: "v3.mp4" },
    { title: "Cinematic Editing", category: "Travel / B-Roll", video: "v6.mp4" },
    { title: "Social Media Videos", category: "Reels / Shorts", video: "v4.mp4" },
    { title: "Color Grading", category: "Cinematic Look", video: "v7.mp4" }
];

function openProjectVideo(index) {
    const data = projectsData[index];
    const overlay = document.getElementById('project-video-overlay');
    const player = document.getElementById('main-project-player');
    const title = document.getElementById('overlay-title');
    const desc = document.getElementById('overlay-desc');

    player.src = data.video;
    title.innerText = data.title;
    desc.innerText = data.category;

    overlay.classList.remove('hidden');
    setTimeout(() => {
        overlay.classList.remove('opacity-0');
        player.play();
    }, 50);
}

function closeProjectVideo() {
    const overlay = document.getElementById('project-video-overlay');
    const player = document.getElementById('main-project-player');
    
    overlay.classList.add('opacity-0');
    setTimeout(() => {
        overlay.classList.add('hidden');
        player.pause();
        player.src = "";
    }, 500);
}

// --- 6. SERVICES & CALLING ---
const servicesData = [
    {
        title: "01. Video Editing",
        desc: "Transforming raw clips into cohesive stories. Pacing, rhythm, and flow are my specialties.",
        features: ["4K Editing", "Multi-cam Sync", "Narrative Structure"],
        img: "im3.png" 
    },
    {
        title: "02. Motion Graphics",
        desc: "Dynamic text and visual effects to keep your audience engaged and boost retention.",
        features: ["Text Animation", "Logo Reveals", "Lower Thirds"],
        img: "im1.png"
    },
    {
        title: "03. Color Grading",
        desc: "Professional color correction to give your footage a cinematic, polished look.",
        features: ["Color Correction", "LUTS & Looks", "Mood Styling"],
        img: "im2.png"
    },
    {
        title: "04. Sound Design",
        desc: " immersive audio engineering to ensure your video sounds as good as it looks.",
        features: ["SFX Design", "Audio Mixing", "Music Sync"],
        img: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80"
    }
];

function openServiceDetail(index) {
    const data = servicesData[index];
    const listView = document.getElementById('services-list-view');
    const detailView = document.getElementById('service-detail-view');
    document.getElementById('detail-title').innerText = data.title;
    document.getElementById('detail-desc').innerText = data.desc;
    document.getElementById('detail-img').src = data.img;
    const featuresList = document.getElementById('detail-features');
    featuresList.innerHTML = '';
    data.features.forEach(feat => {
        featuresList.innerHTML += `<li class="flex items-center gap-2"><i class="fas fa-check text-accent text-xs"></i> ${feat}</li>`;
    });
    listView.style.opacity = '0';
    listView.style.transform = 'translateX(-50px)';
    setTimeout(() => {
        listView.classList.add('hidden');
        detailView.classList.remove('hidden');
        requestAnimationFrame(() => {
            detailView.style.opacity = '1';
            detailView.style.transform = 'translateX(0)';
        });
    }, 400);
}

function closeServiceDetail() {
    const listView = document.getElementById('services-list-view');
    const detailView = document.getElementById('service-detail-view');
    detailView.style.opacity = '0';
    detailView.style.transform = 'translateX(50px)';
    setTimeout(() => {
        detailView.classList.add('hidden');
        listView.classList.remove('hidden');
        requestAnimationFrame(() => {
            listView.style.opacity = '1';
            listView.style.transform = 'translateX(0)';
        });
    }, 400);
}

function openCallingOverlay() {
    const overlay = document.getElementById('calling-overlay');
    overlay.classList.remove('hidden');
}

function closeCallingOverlay() {
    const overlay = document.getElementById('calling-overlay');
    overlay.classList.add('hidden');
// --- 1. CREATE DANCING NAME ANIMATION ---
function createDancingText() {
    const container = document.getElementById('dancing-name');
    const firstName = "ROHAN";
    const lastName = "NAYAK";
    
    const createLetter = (char, index) => {
        const span = document.createElement('span');
        span.innerText = char;
        span.className = 'dance-char';
        span.style.animationDelay = `${index * 0.1}s`;
        return span;
    };

    firstName.split('').forEach((char, i) => {
        container.appendChild(createLetter(char, i));
    });

    const space = document.createElement('span');
    space.className = 'space-char';
    container.appendChild(space);

    lastName.split('').forEach((char, i) => {
        container.appendChild(createLetter(char, i + firstName.length));
    });
}

window.addEventListener('load', () => {
    createDancingText();
    gsap.from("#home button", { opacity: 0, y: 50, duration: 1, delay: 1 });
    
    // Start Clock
    setInterval(updateClock, 1000);
    updateClock(); // Initial call
});

// --- 2. LOCATION ZOOM ANIMATION (UPDATED) ---
function updateClock() {
    const clockEl = document.getElementById('ist-clock');
    if(clockEl) {
        const options = { timeZone: 'Asia/Kolkata', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
        const timeString = new Date().toLocaleTimeString('en-US', options);
        clockEl.innerText = timeString;
    }
}

function playMapZoomAnimation() {
    const flagVideo = document.getElementById('bg-flag');
    const mapContainer = document.getElementById('map-container');
    const mapImage = document.getElementById('zoom-map');

    // 1. Fade out flag, fade in map
    flagVideo.style.opacity = '0';
    mapContainer.style.opacity = '1';

    // 2. GSAP Zoom Sequence
    // Reset scale first
    gsap.set(mapImage, { scale: 1, transformOrigin: "center center" });

    const tl = gsap.timeline();

    // Step 1: Zoom roughly into India (coordinates approx 68% 45% on standard world map)
    tl.to(mapImage, {
        scale: 3.5,
        transformOrigin: "68% 42%", 
        duration: 2.5,
        ease: "power2.inOut"
    })
    // Step 2: Zoom deeper specifically into Odisha (slightly lower right from center India)
    .to(mapImage, {
        scale: 12, // Deep zoom
        transformOrigin: "70% 46%", // Coordinates tuned for Odisha
        duration: 3,
        ease: "power2.inOut",
        delay: 0.2
    });

    // Reset after animation finishes (8s total) to allow re-watching or seeing flag again
    setTimeout(() => {
        gsap.to(mapImage, { scale: 1, duration: 1.5, ease: "power2.out" });
        setTimeout(() => {
            mapContainer.style.opacity = '0';
            flagVideo.style.opacity = '1';
        }, 1500);
    }, 8000);
}

// --- 3. THREE.JS PARTICLES ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

const geometry = new THREE.BufferGeometry();
const count = 1000;
const positions = new Float32Array(count * 3);
for(let i=0; i<count*3; i++) {
    positions[i] = (Math.random() - 0.5) * 50; 
}
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const material = new THREE.PointsMaterial({ size: 0.05, color: 0xffffff, transparent: true, opacity: 0.5 });
const particles = new THREE.Points(geometry, material);
scene.add(particles);
camera.position.z = 10;

function animate3D() {
    requestAnimationFrame(animate3D);
    particles.rotation.y += 0.0005; 
    renderer.render(scene, camera);
}
animate3D();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- 4. PAGE NAVIGATION ---
function goToSection(id) {
    const activeSection = document.querySelector('.section.active');
    const targetSection = document.getElementById(id);
    if(activeSection === targetSection) return;

    gsap.to(activeSection, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
            activeSection.classList.remove('active');
            targetSection.classList.add('active');
            gsap.fromTo(targetSection, { opacity: 0 }, { opacity: 1, duration: 0.6 });

            if(id === 'services') {
                const listView = document.getElementById('services-list-view');
                const detailView = document.getElementById('service-detail-view');
                listView.classList.remove('hidden');
                listView.style.opacity = 1;
                listView.style.transform = 'none';
                detailView.classList.add('hidden');
            }
        }
    });
}

// --- 5. PROJECTS VIDEO POPUP ---
const projectsData = [
    { title: "Tech Video", category: "Gadget Review", video: "v5.mp4" },
    { title: "Documentary Video", category: "Storytelling", video: "v2.mp4" },
    { title: "YouTube Video Editing", category: "Vlog / Lifestyle", video: "v3.mp4" },
    { title: "Cinematic Editing", category: "Travel / B-Roll", video: "v6.mp4" },
    { title: "Social Media Videos", category: "Reels / Shorts", video: "v4.mp4" },
    { title: "Color Grading", category: "Cinematic Look", video: "v7.mp4" }
];

function openProjectVideo(index) {
    const data = projectsData[index];
    const overlay = document.getElementById('project-video-overlay');
    const player = document.getElementById('main-project-player');
    const title = document.getElementById('overlay-title');
    const desc = document.getElementById('overlay-desc');

    player.src = data.video;
    title.innerText = data.title;
    desc.innerText = data.category;

    overlay.classList.remove('hidden');
    setTimeout(() => {
        overlay.classList.remove('opacity-0');
        player.play();
    }, 50);
}

function closeProjectVideo() {
    const overlay = document.getElementById('project-video-overlay');
    const player = document.getElementById('main-project-player');
    
    overlay.classList.add('opacity-0');
    setTimeout(() => {
        overlay.classList.add('hidden');
        player.pause();
        player.src = "";
    }, 500);
}

// --- 6. SERVICES & CALLING ---
const servicesData = [
    {
        title: "01. Video Editing",
        desc: "Transforming raw clips into cohesive stories. Pacing, rhythm, and flow are my specialties.",
        features: ["4K Editing", "Multi-cam Sync", "Narrative Structure"],
        img: "im3.png" 
    },
    {
        title: "02. Motion Graphics",
        desc: "Dynamic text and visual effects to keep your audience engaged and boost retention.",
        features: ["Text Animation", "Logo Reveals", "Lower Thirds"],
        img: "im1.png"
    },
    {
        title: "03. Color Grading",
        desc: "Professional color correction to give your footage a cinematic, polished look.",
        features: ["Color Correction", "LUTS & Looks", "Mood Styling"],
        img: "im2.png"
    },
    {
        title: "04. Sound Design",
        desc: " immersive audio engineering to ensure your video sounds as good as it looks.",
        features: ["SFX Design", "Audio Mixing", "Music Sync"],
        img: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80"
    }
];

function openServiceDetail(index) {
    const data = servicesData[index];
    const listView = document.getElementById('services-list-view');
    const detailView = document.getElementById('service-detail-view');
    document.getElementById('detail-title').innerText = data.title;
    document.getElementById('detail-desc').innerText = data.desc;
    document.getElementById('detail-img').src = data.img;
    const featuresList = document.getElementById('detail-features');
    featuresList.innerHTML = '';
    data.features.forEach(feat => {
        featuresList.innerHTML += `<li class="flex items-center gap-2"><i class="fas fa-check text-accent text-xs"></i> ${feat}</li>`;
    });
    listView.style.opacity = '0';
    listView.style.transform = 'translateX(-50px)';
    setTimeout(() => {
        listView.classList.add('hidden');
        detailView.classList.remove('hidden');
        requestAnimationFrame(() => {
            detailView.style.opacity = '1';
            detailView.style.transform = 'translateX(0)';
        });
    }, 400);
}

function closeServiceDetail() {
    const listView = document.getElementById('services-list-view');
    const detailView = document.getElementById('service-detail-view');
    detailView.style.opacity = '0';
    detailView.style.transform = 'translateX(50px)';
    setTimeout(() => {
        detailView.classList.add('hidden');
        listView.classList.remove('hidden');
        requestAnimationFrame(() => {
            listView.style.opacity = '1';
            listView.style.transform = 'translateX(0)';
        });
    }, 400);
}

function openCallingOverlay() {
    const overlay = document.getElementById('calling-overlay');
    overlay.classList.remove('hidden');
}

function closeCallingOverlay() {
    const overlay = document.getElementById('calling-overlay');
    overlay.classList.add('hidden');
}
}