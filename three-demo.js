// three-demo.js - Refined Three.js Showcase Engine with Custom 3D Models

class Toy3DShowcase {
    constructor(containerId, colorPanelContainerId) {
        this.container = document.getElementById(containerId);
        this.colorPanel = document.getElementById(colorPanelContainerId);
        if (!this.container) return;

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.currentModelGroup = null;
        this.activeModelId = null;
        this.animationFrameId = null;
        this.isIdle = true;
        this.idleTimer = null;
        this.customColors = {}; // Custom colors store
        this.textureLoader = new THREE.TextureLoader();
        this.galleryPlanes = [];

        this.init();
    }

    // Build an image gallery using provided image URLs (mapped to textured planes)
    loadImageGallery(imageUrls = []) {
        this.activeModelId = 'gallery';

        if (this.currentModelGroup) {
            this.scene.remove(this.currentModelGroup);
        }

        this.currentModelGroup = new THREE.Group();
        this.scene.add(this.currentModelGroup);

        // Create several planes with textures and staggered positions
        const gap = 2.2;
        const startX = -((imageUrls.length - 1) * gap) / 2;

        imageUrls.forEach((url, i) => {
            const geometry = new THREE.PlaneGeometry(1.6, 1.6);
            const mat = new THREE.MeshBasicMaterial({ color: 0xffffff });
            mat.side = THREE.DoubleSide;

            const plane = new THREE.Mesh(geometry, mat);
            plane.position.set(startX + i * gap, 0.2 + (i % 2 === 0 ? 0.08 : -0.08), -Math.abs(i - imageUrls.length/2) * 0.15);
            plane.rotation.y = (i - imageUrls.length/2) * 0.06;
            plane.castShadow = true;

            // Load texture (use CORS-friendly loader)
            this.textureLoader.setCrossOrigin('anonymous');
            this.textureLoader.load(url, (tex) => {
                tex.encoding = THREE.sRGBEncoding;
                plane.material.map = tex;
                plane.material.needsUpdate = true;
            }, undefined, () => {
                // On error, use a neutral color so plane isn't blank
                plane.material.color.setHex(0xdddddd);
            });

            this.currentModelGroup.add(plane);
            this.galleryPlanes.push(plane);
        });

        // Slightly reposition camera for gallery view
        this.camera.position.set(0, 1.8, 6.5);
        this.controls.target.set(0, 0.2, 0);
        this.controls.update();
    }

    init() {
        this.container.innerHTML = '';

        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0c0d1b);
        this.scene.fog = new THREE.FogExp2(0x0c0d1b, 0.08);

        // Camera
        this.camera = new THREE.PerspectiveCamera(45, this.container.clientWidth / this.container.clientHeight, 0.1, 100);
        this.camera.position.set(0, 3.5, 7.5);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.1;
        this.container.appendChild(this.renderer.domElement);

        // Controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.maxPolarAngle = Math.PI / 2 + 0.05;
        this.controls.minDistance = 3.5;
        this.controls.maxDistance = 12;
        this.controls.addEventListener('start', () => {
            this.isIdle = false;
            clearTimeout(this.idleTimer);
        });
        this.controls.addEventListener('end', () => {
            this.idleTimer = setTimeout(() => { this.isIdle = true; }, 3000);
        });

        this.addLighting();
        this.addFloor();
        this.animate();

        window.addEventListener('resize', this.onWindowResize.bind(this));
    }

    addLighting() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
        this.scene.add(ambientLight);

        // Bright Warm Key Light
        const dirLight1 = new THREE.DirectionalLight(0xffe9d2, 1.3);
        dirLight1.position.set(6, 8, 4);
        dirLight1.castShadow = true;
        dirLight1.shadow.mapSize.width = 1024;
        dirLight1.shadow.mapSize.height = 1024;
        dirLight1.shadow.bias = -0.001;
        this.scene.add(dirLight1);

        // Soft Cool Fill Light
        const dirLight2 = new THREE.DirectionalLight(0xa5c4ff, 0.7);
        dirLight2.position.set(-6, 3, -4);
        this.scene.add(dirLight2);

        // Sparkle point light
        const pointLight = new THREE.PointLight(0xffffff, 0.8, 15);
        pointLight.position.set(0, 4, 2);
        this.scene.add(pointLight);
    }

    addFloor() {
        const floorGeo = new THREE.PlaneGeometry(30, 30);
        const floorMat = new THREE.MeshStandardMaterial({
            color: 0x070811,
            roughness: 0.85,
            metalness: 0.1
        });
        const floor = new THREE.Mesh(floorGeo, floorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -1.4;
        floor.receiveShadow = true;
        this.scene.add(floor);

        const gridHelper = new THREE.GridHelper(20, 20, 0x242849, 0x111327);
        gridHelper.position.y = -1.39;
        this.scene.add(gridHelper);
    }

    loadModel(modelId) {
        this.activeModelId = modelId;
        
        if (this.currentModelGroup) {
            this.scene.remove(this.currentModelGroup);
        }

        this.currentModelGroup = new THREE.Group();
        this.scene.add(this.currentModelGroup);

        this.camera.position.set(0, 3, 7);
        this.controls.target.set(0, 0, 0);
        this.controls.update();

        if (modelId === "rc_car") {
            this.buildRcCar();
        } else if (modelId === "kick_scooter") {
            this.buildKickScooter();
        } else {
            // "royal_elephant" as the core model representing traditional art rocking horse
            this.buildRoyalElephant();
        }

        this.renderColorCustomizer(modelId);
    }

    // --- 1. REMOTE CONTROL SPORTS CAR ---
    buildRcCar() {
        const group = new THREE.Group();
        
        const colors = this.customColors["rc_car"] || {
            body: 0xd63031,      // Sporty Red
            spoiler: 0x2d3436,   // Charcoal Black
            wheels: 0x1e272e,    // Tire Dark Grey
            rims: 0xffd700,      // Chrome Gold
            headlights: 0xffff00 // Neon Yellow
        };
        this.customColors["rc_car"] = colors;

        const bodyMat = new THREE.MeshStandardMaterial({ color: colors.body, roughness: 0.1, metalness: 0.8 });
        const spoilerMat = new THREE.MeshStandardMaterial({ color: colors.spoiler, roughness: 0.4, metalness: 0.4 });
        const tireMat = new THREE.MeshStandardMaterial({ color: colors.wheels, roughness: 0.8, metalness: 0.1 });
        const rimMat = new THREE.MeshStandardMaterial({ color: colors.rims, roughness: 0.1, metalness: 0.9 });
        const glassMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.1, metalness: 0.9, transparent: true, opacity: 0.7 });
        const lightMat = new THREE.MeshBasicMaterial({ color: colors.headlights });

        // Chassis base plate
        const chassis = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.15, 1.4), spoilerMat);
        chassis.position.y = -0.4;
        chassis.castShadow = true;
        group.add(chassis);

        // Car main cabin
        const bodyGeo = new THREE.BoxGeometry(2.2, 0.5, 1.3);
        const carBody = new THREE.Mesh(bodyGeo, bodyMat);
        carBody.position.y = -0.1;
        carBody.castShadow = true;
        group.add(carBody);

        // Aerodynamic hood (front)
        const hoodGeo = new THREE.BoxGeometry(0.8, 0.35, 1.3);
        const hood = new THREE.Mesh(hoodGeo, bodyMat);
        hood.position.set(-1.1, -0.175, 0);
        hood.castShadow = true;
        group.add(hood);

        // Cabin windshield
        const windGeo = new THREE.BoxGeometry(1.0, 0.45, 1.1);
        const wind = new THREE.Mesh(windGeo, glassMat);
        wind.position.set(0.2, 0.3, 0);
        wind.rotation.z = -Math.PI / 8;
        wind.castShadow = true;
        group.add(wind);

        // Rear Spoiler (Wing)
        const spoilerStandL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.4, 0.1), spoilerMat);
        spoilerStandL.position.set(1.2, 0.2, 0.4);
        group.add(spoilerStandL);

        const spoilerStandR = spoilerStandL.clone();
        spoilerStandR.position.z = -0.4;
        group.add(spoilerStandR);

        const wing = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.08, 1.6), bodyMat);
        wing.position.set(1.2, 0.4, 0);
        wing.rotation.z = Math.PI / 24;
        wing.castShadow = true;
        group.add(wing);

        // LED Headlights
        const headL = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), lightMat);
        headL.position.set(-1.5, -0.1, 0.45);
        group.add(headL);

        const headR = headL.clone();
        headR.position.z = -0.45;
        group.add(headR);

        // Antenna
        const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.8, 8), spoilerMat);
        ant.position.set(0.9, 0.5, 0);
        ant.rotation.z = -Math.PI / 16;
        group.add(ant);

        const antTip = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
        antTip.position.set(0.98, 0.9, 0);
        group.add(antTip);

        // Wheels
        const wheelGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.35, 16);
        wheelGeo.rotateX(Math.PI / 2);

        const rimGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.38, 12);
        rimGeo.rotateX(Math.PI / 2);

        this.wheels = [];
        const wheelOffsets = [
            [-0.9, -0.4, 0.8],  // Front Left
            [-0.9, -0.4, -0.8], // Front Right
            [0.9, -0.4, 0.8],   // Back Left
            [0.9, -0.4, -0.8]   // Back Right
        ];

        wheelOffsets.forEach(offset => {
            const wGroup = new THREE.Group();
            wGroup.position.set(offset[0], offset[1], offset[2]);

            const tire = new THREE.Mesh(wheelGeo, tireMat);
            tire.castShadow = true;
            wGroup.add(tire);

            const rim = new THREE.Mesh(rimGeo, rimMat);
            wGroup.add(rim);

            group.add(wGroup);
            this.wheels.push(wGroup);
        });

        group.position.y = -0.3;
        this.currentModelGroup.add(group);
    }

    // --- 2. 3-WHEEL KICK SCOOTER ---
    buildKickScooter() {
        const group = new THREE.Group();

        const colors = this.customColors["kick_scooter"] || {
            deck: 0xff7f50,      // Coral Orange
            stem: 0xbdc5d8,      // Matte Silver
            handles: 0x1f2937,   // Charcoal Grey
            wheels: 0x00ffcc,    // Glowing Neon Aqua
            leds: 0xff00ff       // Pulse LED Color
        };
        this.customColors["kick_scooter"] = colors;

        const deckMat = new THREE.MeshStandardMaterial({ color: colors.deck, roughness: 0.3, metalness: 0.2 });
        const stemMat = new THREE.MeshStandardMaterial({ color: colors.stem, roughness: 0.2, metalness: 0.8 });
        const handleMat = new THREE.MeshStandardMaterial({ color: colors.handles, roughness: 0.6 });
        const wheelMat = new THREE.MeshStandardMaterial({ color: colors.wheels, roughness: 0.2, metalness: 0.5 });
        const ledMat = new THREE.MeshBasicMaterial({ color: colors.leds });

        // 1. Deck
        const deck = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.15, 0.65), deckMat);
        deck.position.set(0.2, -0.8, 0);
        deck.castShadow = true;
        deck.receiveShadow = true;
        group.add(deck);

        // Deck tail brake
        const brake = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.2, 0.4), handleMat);
        brake.position.set(1.3, -0.65, 0);
        brake.castShadow = true;
        group.add(brake);

        // 2. Stem Column (Adjustable Height T-bar)
        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.2, 12), stemMat);
        stem.position.set(-0.9, 0.3, 0);
        stem.rotation.z = -Math.PI / 32;
        stem.castShadow = true;
        group.add(stem);

        const stemCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.15, 12), handleMat);
        stemCollar.position.set(-0.9, 0.8, 0);
        group.add(stemCollar);

        // Handlebar
        const handlebar = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.2, 12), stemMat);
        handlebar.rotation.x = Math.PI / 2;
        handlebar.position.set(-0.93, 1.4, 0);
        handlebar.castShadow = true;
        group.add(handlebar);

        // Rubber Grips
        const gripL = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.35, 12), handleMat);
        gripL.rotation.x = Math.PI / 2;
        gripL.position.set(-0.93, 1.4, 0.42);
        group.add(gripL);

        const gripR = gripL.clone();
        gripR.position.z = -0.42;
        group.add(gripR);

        // 3. Three LED Wheels
        const wheelGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.12, 16);
        wheelGeo.rotateX(Math.PI / 2);

        this.scooterWheels = [];
        this.ledLights = [];

        // Axle details for front wheels
        const frontAxle = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.9, 8), stemMat);
        frontAxle.rotation.x = Math.PI / 2;
        frontAxle.position.set(-0.9, -0.85, 0);
        group.add(frontAxle);

        // Wheel offsets: [X, Y, Z]
        const wheelData = [
            [-0.9, -0.85, 0.45],  // Front Left
            [-0.9, -0.85, -0.45], // Front Right
            [1.2, -0.85, 0]       // Back Center
        ];

        wheelData.forEach((offset, idx) => {
            const wGroup = new THREE.Group();
            wGroup.position.set(offset[0], offset[1], offset[2]);

            const wheel = new THREE.Mesh(wheelGeo, wheelMat);
            wheel.castShadow = true;
            wGroup.add(wheel);

            // Glowing LED Ring details around wheel rims
            if (idx < 2) { // Front wheels get glowing LED hubs
                const ledRing = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.03, 8, 12), ledMat);
                ledRing.rotation.y = Math.PI / 2;
                wGroup.add(ledRing);
                this.ledLights.push(ledRing);
            }

            group.add(wGroup);
            this.scooterWheels.push(wGroup);
        });

        group.position.y = -0.2;
        this.currentModelGroup.add(group);
    }

    // --- 3. ROYAL ELEPHANT (MAPPED TO THE CHANNAPATNA TRADITIONAL HORSE) ---
    buildRoyalElephant() {
        const group = new THREE.Group();

        const colors = this.customColors["royal_elephant"] || {
            body: 0x555c68,    // Soft Slate Slate Grey
            saddle: 0xb33939,  // Rich Velvet Crimson
            gold: 0xd4af37,    // Polished Amber Gold
            howdah: 0xff9f43,  // Indian Saffron Orange
            tusks: 0xffffff    // Ivory White
        };
        this.customColors["royal_elephant"] = colors;

        const bodyMat = new THREE.MeshStandardMaterial({ color: colors.body, roughness: 0.6, metalness: 0.1 });
        const saddleMat = new THREE.MeshStandardMaterial({ color: colors.saddle, roughness: 0.5, metalness: 0.2 });
        const goldMat = new THREE.MeshStandardMaterial({ color: colors.gold, roughness: 0.15, metalness: 0.9 });
        const howdahMat = new THREE.MeshStandardMaterial({ color: colors.howdah, roughness: 0.3, metalness: 0.4 });
        const ivoryMat = new THREE.MeshStandardMaterial({ color: colors.tusks, roughness: 0.3 });

        // Elephant Body
        const bodyGeo = new THREE.SphereGeometry(1.2, 24, 24);
        bodyGeo.scale(1.4, 1.0, 1.0);
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.y = 0.3;
        body.castShadow = true;
        group.add(body);

        // Head
        const head = new THREE.Group();
        head.position.set(-1.4, 0.7, 0);
        
        const headGeo = new THREE.SphereGeometry(0.85, 20, 20);
        headGeo.scale(1.0, 1.1, 1.0);
        const headMesh = new THREE.Mesh(headGeo, bodyMat);
        headMesh.castShadow = true;
        head.add(headMesh);

        // Large Ears
        const earGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.06, 16);
        earGeo.scale(1.0, 0.8, 1.0);
        earGeo.rotateX(Math.PI / 2);
        earGeo.rotateZ(Math.PI / 6);
        
        const leftEar = new THREE.Mesh(earGeo, bodyMat);
        leftEar.position.set(0.4, 0.1, 0.75);
        leftEar.castShadow = true;
        head.add(leftEar);

        const earJewel = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.04, 8, 16), goldMat);
        earJewel.rotation.y = Math.PI / 2;
        earJewel.position.set(0.4, -0.2, 0.82);
        head.add(earJewel);

        const rightEar = new THREE.Mesh(earGeo, bodyMat);
        rightEar.position.set(0.4, 0.1, -0.75);
        rightEar.castShadow = true;
        head.add(rightEar);

        const earJewelR = earJewel.clone();
        earJewelR.position.z = -0.82;
        head.add(earJewelR);

        // Curved Trunk
        this.trunkSegments = [];
        const trunkStart = new THREE.Vector3(-0.6, -0.3, 0);
        let currentPos = trunkStart.clone();
        
        for (let i = 0; i < 6; i++) {
            const segRadius = 0.2 - (i * 0.02);
            const segGeo = new THREE.CylinderGeometry(segRadius + 0.02, segRadius, 0.35, 12);
            const angle = (i / 5) * (Math.PI / 1.5);
            const seg = new THREE.Mesh(segGeo, bodyMat);
            seg.position.set(
                -0.65 - Math.sin(angle) * 0.5,
                -0.3 - Math.cos(angle) * 0.6,
                0
            );
            seg.rotation.z = angle - Math.PI / 3;
            seg.castShadow = true;
            head.add(seg);
            this.trunkSegments.push(seg);
        }

        // Tusks
        const tuskGeo = new THREE.CylinderGeometry(0.07, 0.02, 0.55, 8);
        tuskGeo.rotateZ(-Math.PI / 4);
        
        const leftTusk = new THREE.Mesh(tuskGeo, ivoryMat);
        leftTusk.position.set(-0.7, -0.4, 0.28);
        head.add(leftTusk);

        const rightTusk = new THREE.Mesh(tuskGeo, ivoryMat);
        rightTusk.position.set(-0.7, -0.4, -0.28);
        head.add(rightTusk);

        // Eyes
        const eyeGeo = new THREE.SphereGeometry(0.06, 8, 8);
        const eyeL = new THREE.Mesh(eyeGeo, new THREE.MeshBasicMaterial({ color: 0x111111 }));
        eyeL.position.set(-0.6, 0.2, 0.48);
        const eyeR = new THREE.Mesh(eyeGeo, new THREE.MeshBasicMaterial({ color: 0x111111 }));
        eyeR.position.set(-0.6, 0.2, -0.48);
        head.add(eyeL);
        head.add(eyeR);

        group.add(head);
        this.elephantHead = head;

        // Saddle blanket (Jhool)
        const jhool = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.2, 2.5), saddleMat);
        jhool.position.set(0.1, 0.45, 0);
        jhool.castShadow = true;
        group.add(jhool);

        const border = new THREE.Mesh(new THREE.BoxGeometry(1.66, 0.14, 2.56), goldMat);
        border.position.set(0.1, -0.1, 0);
        group.add(border);

        // Canopy Howdah
        const baseHowdah = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.35, 1.1), goldMat);
        baseHowdah.position.set(0.1, 1.2, 0);
        baseHowdah.castShadow = true;
        group.add(baseHowdah);

        const seatHowdah = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.4, 0.9), howdahMat);
        seatHowdah.position.set(0.1, 1.4, 0);
        group.add(seatHowdah);

        const postGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.8, 8);
        const postOffsets = [
            [-0.32, -0.32],
            [-0.32, 0.32],
            [0.32, -0.32],
            [0.32, 0.32]
        ];
        postOffsets.forEach(offset => {
            const post = new THREE.Mesh(postGeo, goldMat);
            post.position.set(0.1 + offset[0], 1.7, offset[1]);
            group.add(post);
        });

        const dome = new THREE.Mesh(new THREE.ConeGeometry(0.75, 0.35, 4), howdahMat);
        dome.rotation.y = Math.PI / 4;
        dome.position.set(0.1, 2.2, 0);
        dome.castShadow = true;
        group.add(dome);

        const domeSpire = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.05, 0.2, 8), goldMat);
        domeSpire.position.set(0.1, 2.45, 0);
        group.add(domeSpire);

        // Legs
        const legGeo = new THREE.CylinderGeometry(0.26, 0.21, 1.4, 12);
        this.legs = [];
        const legOffsets = [
            [-0.8, 0.55],
            [-0.8, -0.55],
            [0.8, 0.55],
            [0.8, -0.55]
        ];

        legOffsets.forEach(offset => {
            const leg = new THREE.Mesh(legGeo, bodyMat);
            leg.position.set(offset[0], -0.8, offset[1]);
            leg.castShadow = true;
            group.add(leg);

            const anklet = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.04, 8, 12), goldMat);
            anklet.rotation.x = Math.PI / 2;
            anklet.position.y = -0.5;
            leg.add(anklet);

            this.legs.push(leg);
        });

        // Tail
        const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.03, 0.8, 8), bodyMat);
        tail.position.set(1.4, 0.1, 0);
        tail.rotation.z = -Math.PI / 6;
        group.add(tail);

        const tassel = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), goldMat);
        tassel.position.set(1.6, -0.3, 0);
        group.add(tassel);

        group.position.y = 0.3;
        this.currentModelGroup.add(group);
    }

    renderColorCustomizer(modelId) {
        if (!this.colorPanel) return;
        this.colorPanel.innerHTML = '';

        const colors = this.customColors[modelId];
        if (!colors) return;

        const header = document.createElement('h4');
        header.textContent = "Customize Colors";
        header.style.margin = "0 0 10px 0";
        header.style.fontSize = "0.85rem";
        header.style.color = "#ffffff";
        this.colorPanel.appendChild(header);

        const grid = document.createElement('div');
        grid.style.display = "grid";
        grid.style.gridTemplateColumns = "repeat(auto-fit, minmax(75px, 1fr))";
        grid.style.gap = "8px";

        Object.keys(colors).forEach(key => {
            const wrapper = document.createElement('div');
            wrapper.style.display = "flex";
            wrapper.style.flexDirection = "column";
            wrapper.style.alignItems = "center";
            wrapper.style.gap = "4px";

            const label = document.createElement('span');
            label.textContent = key.charAt(0).toUpperCase() + key.slice(1);
            label.style.fontSize = "0.7rem";
            label.style.color = "#a0aec0";

            const colorInput = document.createElement('input');
            colorInput.type = "color";
            
            const hexString = "#" + colors[key].toString(16).padStart(6, '0');
            colorInput.value = hexString;
            colorInput.style.border = "none";
            colorInput.style.width = "34px";
            colorInput.style.height = "22px";
            colorInput.style.cursor = "pointer";
            colorInput.style.background = "transparent";

            colorInput.addEventListener('input', (e) => {
                const newHex = parseInt(e.target.value.substring(1), 16);
                this.updateModelColor(modelId, key, newHex);
            });

            wrapper.appendChild(colorInput);
            wrapper.appendChild(label);
            grid.appendChild(wrapper);
        });

        this.colorPanel.appendChild(grid);
    }

    updateModelColor(modelId, colorKey, newHex) {
        if (this.customColors[modelId]) {
            this.customColors[modelId][colorKey] = newHex;
            this.loadModel(modelId);
        }
    }

    animate() {
        this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
        const time = Date.now() * 0.0015;

        if (this.currentModelGroup) {
            if (this.isIdle) {
                this.currentModelGroup.rotation.y += 0.005;
            }

            // --- ANIMATIONS ---
            if (this.activeModelId === 'gallery' && this.galleryPlanes && this.galleryPlanes.length) {
                // Gallery gentle float and rotate
                this.galleryPlanes.forEach((p, idx) => {
                    p.rotation.y += 0.002 + (idx * 0.0006);
                    p.position.y = 0.2 + Math.sin(time * 1.2 + idx * 0.6) * 0.12;
                    p.position.z = -Math.abs(idx - this.galleryPlanes.length / 2) * 0.12 + Math.sin(time * 0.6 + idx) * 0.02;
                });
            } else if (this.activeModelId === "rc_car" && this.wheels) {
                // Rock back and forth slightly
                const movement = Math.sin(time * 2) * 0.3;
                this.currentModelGroup.position.x = movement;
                // Spin wheels relative to movement
                this.wheels.forEach(wheel => {
                    wheel.rotation.z += 0.05 * Math.sign(Math.cos(time * 2));
                });
            } else if (this.activeModelId === "kick_scooter" && this.scooterWheels) {
                // Gentle tilt side-to-side
                this.currentModelGroup.rotation.z = Math.sin(time) * 0.08;
                
                // Spin scooter wheels
                this.scooterWheels.forEach(w => {
                    w.rotation.z += 0.04;
                });

                // LED brightness pulse
                if (this.ledLights) {
                    const intensity = 0.5 + Math.sin(time * 6) * 0.5;
                    this.ledLights.forEach(led => {
                        led.material.color.setHex(intensity > 0.5 ? 0xff00ff : 0x00ffff);
                    });
                }
            } else if (this.activeModelId === "royal_elephant") {
                const sway = Math.sin(time * 1.5) * 0.06;
                this.currentModelGroup.position.y = 0.3 + Math.abs(sway);
                this.currentModelGroup.rotation.z = sway * 0.4;
                
                if (this.elephantHead) {
                    this.elephantHead.rotation.x = Math.sin(time) * 0.08;
                }

                if (this.trunkSegments) {
                    this.trunkSegments.forEach((seg, i) => {
                        seg.rotation.z = (i * 0.05) + Math.sin(time * 2 + i * 0.3) * 0.08;
                    });
                }

                if (this.legs) {
                    this.legs[0].rotation.x = Math.sin(time * 2) * 0.2;
                    this.legs[1].rotation.x = -Math.sin(time * 2) * 0.2;
                    this.legs[2].rotation.x = -Math.sin(time * 2) * 0.2;
                    this.legs[3].rotation.x = Math.sin(time * 2) * 0.2;
                }
            }
        }

        if (this.controls) {
            this.controls.update();
        }

        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    onWindowResize() {
        if (!this.container || !this.camera || !this.renderer) return;
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    destroy() {
        cancelAnimationFrame(this.animationFrameId);
        window.removeEventListener('resize', this.onWindowResize.bind(this));
        if (this.renderer) {
            this.container.removeChild(this.renderer.domElement);
            this.renderer.dispose();
        }
    }
}

window.Toy3DShowcase = Toy3DShowcase;
