/*******************************************************************

1. THREE.JS INIT

*******************************************************************/

'use strict'
var scene, camera, renderer;

function init() {

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    createScene();
    createCamera();

    window.addEventListener('resize', onResize);
    window.addEventListener('keydown', onKeyDown);
}

function render() {
    renderer.render(scene, camera);
}

function createScene() {
    scene = new THREE.Scene();

    addAmbientLight();
    addFocusLight();

    createFloor();
    createTable(0, 0, 0);

    scene.add(new THREE.AxisHelper(100));
}

function addAmbientLight() {
    var light = new THREE.AmbientLight('#666666');

    scene.add(light);
}

function addFocusLight() {
    var light = new THREE.DirectionalLight('#999999');

    light.position.set(0, 1, 1).normalize();
    scene.add(light);
}

function createFloor() {
    
    var texture = new THREE.TextureLoader().load('./img/floor.png');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(30, 30);

    var floor = new THREE.PlaneGeometry(3000, 3000),
        floorMaterial = new THREE.MeshPhongMaterial({ map: texture, specular: 0x555555, shininess: 5 });

    var plane = new THREE.Mesh(floor, floorMaterial);
        plane.material.side = THREE.DoubleSide;
        plane.rotation.x = Math.PI / 2;
        plane.position.set(0, -100, 0);
    
    scene.add(plane);
}

function createCamera() {

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 4000);
    camera.position.set(50, 20, 50);
    camera.lookAt(scene.position);

    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', render);
    controls.minDistance = 20;
    controls.maxDistance = 500;
    controls.enablePan = false;
}

function animate() {

    render();
    requestAnimationFrame(animate);
}

/*******************************************************************

2. USER INPUT

*******************************************************************/

/* 2.1. Repositions animation on the window after resizing */
function onResize() {

    renderer.setSize(window.innerWidth, window.innerHeight);
    if (window.innerWidth > 0 && window.innerHeight > 0) {
        camera.aspect = renderer.getSize().width / renderer.getSize().height;
        camera.updateProjectionMatrix();
    }
}

/* 2.2. Allows keyboard interaction with the game */
function onKeyDown(e) {

    switch (e.key) {
        case 'a':
        case 'A':
            scene.traverse(function (node) {
                if (node instanceof (THREE.Mesh)) {
                    node.material.wireframe = !node.material.wireframe;
                }
            });
            break;
    }
}