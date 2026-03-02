// Wait for DOM
document.addEventListener('DOMContentLoaded', () => {
    
    // --- Mobile Navigation ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-item').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // --- Glitch Text Effect ---
    const glitchText = document.querySelector('.glitch-text');
    if (glitchText) {
        setInterval(() => {
            glitchText.style.textShadow = `
                ${Math.random() * 10 - 5}px ${Math.random() * 10 - 5}px 0 rgba(0,243,255,0.8),
                ${Math.random() * -10 + 5}px ${Math.random() * -10 + 5}px 0 rgba(189,0,255,0.8)
            `;
            setTimeout(() => {
                glitchText.style.textShadow = '0 0 20px rgba(255,255,255,0.2)';
            }, 50);
        }, 3000);
    }

    // --- GSAP Animations ---
    gsap.registerPlugin(ScrollTrigger);

    // Fade in sections on scroll
    gsap.utils.toArray('section').forEach(section => {
        const title = section.querySelector('.section-title');
        if(title) {
            gsap.to(title, {
                opacity: 1,
                y: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                }
            });
        }
    });

    // Skill Bars Animation
    gsap.utils.toArray('.skill-card').forEach(card => {
        const fill = card.querySelector('.level-fill');
        if(fill) {
            let width = '0%';
            if(fill.classList.contains('html')) width = '90%';
            if(fill.classList.contains('css')) width = '85%';
            if(fill.classList.contains('js')) width = '80%';
            if(fill.classList.contains('python')) width = '75%';
            if(fill.classList.contains('java')) width = '70%';
            if(fill.classList.contains('sql')) width = '75%';

            ScrollTrigger.create({
                trigger: card,
                start: 'top 90%',
                onEnter: () => {
                    fill.style.width = width;
                }
            });
        }
    });

    // --- Background Three.js Particles ---
    const canvas = document.querySelector('#bg-canvas');
    if(canvas) {
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 30;

        // Particles
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 700;
        const posArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 100;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        const material = new THREE.PointsMaterial({
            size: 0.15,
            color: 0x00f3ff,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        const particlesMesh = new THREE.Points(particlesGeometry, material);
        scene.add(particlesMesh);

        // Mouse Interaction
        let mouseX = 0;
        let mouseY = 0;

        document.addEventListener('mousemove', (event) => {
            mouseX = event.clientX;
            mouseY = event.clientY;
        });

        // Animation Loop
        const clock = new THREE.Clock();

        const tick = () => {
            const elapsedTime = clock.getElapsedTime();
            
            // Rotate particles slowly
            particlesMesh.rotation.y = elapsedTime * 0.05;
            particlesMesh.rotation.x = elapsedTime * 0.02;

            // Interactive movement based on mouse
            particlesMesh.rotation.x += mouseY * 0.00005;
            particlesMesh.rotation.y += mouseX * 0.00005;

            renderer.render(scene, camera);
            requestAnimationFrame(tick);
        };
        tick();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // --- Hologram Cube in About Section ---
    const hologramContainer = document.getElementById('hologram-cube');
    if(hologramContainer) {
        const holoRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        holoRenderer.setSize(hologramContainer.clientWidth, hologramContainer.clientHeight);
        hologramContainer.appendChild(holoRenderer.domElement);

        const holoScene = new THREE.Scene();
        const holoCamera = new THREE.PerspectiveCamera(45, hologramContainer.clientWidth / hologramContainer.clientHeight, 0.1, 100);
        holoCamera.position.z = 5;

        // Icosahedron for futuristic look
        const geometry = new THREE.IcosahedronGeometry(1.5, 1);
        const holoMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xbd00ff, 
            wireframe: true,
            transparent: true,
            opacity: 0.6
        });
        
        const holoMesh = new THREE.Mesh(geometry, holoMaterial);
        holoScene.add(holoMesh);

        // Inner solid core
        const coreGeo = new THREE.IcosahedronGeometry(0.8, 0);
        const coreMat = new THREE.MeshBasicMaterial({ color: 0x00f3ff });
        const coreMesh = new THREE.Mesh(coreGeo, coreMat);
        holoScene.add(coreMesh);

        const holoTick = () => {
            holoMesh.rotation.x += 0.005;
            holoMesh.rotation.y += 0.01;
            coreMesh.rotation.x -= 0.01;
            coreMesh.rotation.y -= 0.005;

            holoRenderer.render(holoScene, holoCamera);
            requestAnimationFrame(holoTick);
        };
        holoTick();

        window.addEventListener('resize', () => {
            holoCamera.aspect = hologramContainer.clientWidth / hologramContainer.clientHeight;
            holoCamera.updateProjectionMatrix();
            holoRenderer.setSize(hologramContainer.clientWidth, hologramContainer.clientHeight);
        });
    }

    // --- 3D Project Showcase (Doctor Booking App) ---
    const projectDemo = document.getElementById('project-3d-scene');
    if(projectDemo) {
        const projRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        projRenderer.setSize(projectDemo.clientWidth, projectDemo.clientHeight);
        projectDemo.appendChild(projRenderer.domElement);

        const projScene = new THREE.Scene();
        const projCamera = new THREE.PerspectiveCamera(50, projectDemo.clientWidth / projectDemo.clientHeight, 0.1, 100);
        projCamera.position.z = 6;

        // Abstract representation: A floating medical cross or complex rotating structure
        const group = new THREE.Group();

        // Medical Cross using two boxes
        const boxGeo1 = new THREE.BoxGeometry(1, 3, 0.5);
        const boxGeo2 = new THREE.BoxGeometry(3, 1, 0.5);
        const projMat = new THREE.MeshPhongMaterial({ 
            color: 0x00f3ff, 
            emissive: 0x002233,
            shininess: 100,
            specular: 0xffffff
        });

        const bar1 = new THREE.Mesh(boxGeo1, projMat);
        const bar2 = new THREE.Mesh(boxGeo2, projMat);
        group.add(bar1);
        group.add(bar2);

        // Orbiting particles around the cross
        const orbitGeo = new THREE.TorusGeometry(3, 0.05, 16, 100);
        const orbitMat = new THREE.MeshBasicMaterial({ color: 0xbd00ff, wireframe: true, transparent: true, opacity: 0.5 });
        const orbitring1 = new THREE.Mesh(orbitGeo, orbitMat);
        orbitring1.rotation.x = Math.PI / 2;
        group.add(orbitring1);

        const orbitring2 = new THREE.Mesh(orbitGeo, orbitMat);
        orbitring2.rotation.y = Math.PI / 2;
        group.add(orbitring2);

        projScene.add(group);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        projScene.add(ambientLight);

        const pointLight = new THREE.PointLight(0x00f3ff, 1);
        pointLight.position.set(5, 5, 5);
        projScene.add(pointLight);

        const projTick = () => {
            group.rotation.y += 0.01;
            group.rotation.x += 0.005;
            orbitring1.rotation.z -= 0.02;
            orbitring2.rotation.z += 0.02;

            projRenderer.render(projScene, projCamera);
            requestAnimationFrame(projTick);
        };
        projTick();

        window.addEventListener('resize', () => {
            projCamera.aspect = projectDemo.clientWidth / projectDemo.clientHeight;
            projCamera.updateProjectionMatrix();
            projRenderer.setSize(projectDemo.clientWidth, projectDemo.clientHeight);
        });
        
        // Interactive Rotation on mouse drag (basic)
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };

        projectDemo.addEventListener('mousedown', () => isDragging = true);
        document.addEventListener('mouseup', () => isDragging = false);

        projectDemo.addEventListener('mousemove', (e) => {
            const deltaMove = {
                x: e.offsetX - previousMousePosition.x,
                y: e.offsetY - previousMousePosition.y
            };

            if (isDragging) {
                const deltaRotationQuaternion = new THREE.Quaternion()
                    .setFromEuler(new THREE.Euler(
                        Math.toRadians(deltaMove.y * 1),
                        Math.toRadians(deltaMove.x * 1),
                        0,
                        'XYZ'
                    ));
                group.quaternion.multiplyQuaternions(deltaRotationQuaternion, group.quaternion);
            }

            previousMousePosition = {
                x: e.offsetX,
                y: e.offsetY
            };
        });

        // Helper
        Math.toRadians = function(degrees) {
            return degrees * Math.PI / 180;
        };
    }
});
