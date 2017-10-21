/*******************************************************************

1. THREE.JS INIT

*******************************************************************/

'use strict'
var scene, renderer;
var orthographicTopCamera, perspectiveTopCamera, chaseCamera, cameraIndex = 1;
var previousFrameTime = Date.now();
var keyPressed = {};
var car;
var tableSize = 600;

function init() {

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	createScene();
	createChaseCamera();
	createOrthographicTopCamera();
	createPerspectiveTopCamera();

	window.addEventListener('resize', onResize);
}

function render() {
	if (cameraIndex == 1) { renderer.render(scene, orthographicTopCamera); }
	else if (cameraIndex == 2) { renderer.render(scene, perspectiveTopCamera); }
	else { renderer.render(scene, chaseCamera) }
}

function createScene() {
	scene = new THREE.Scene();

	addAmbientLight();
	addFocusLight();

	createFloor();
	createTable(0, 0, 0);
	car = new Car(new THREE.Vector3(-50, 8, -10), 0, new THREE.Vector3(1, 0, 0));
	createButter(100, 5.5, 200);
	createButter(-140, 5.5, 200);
	createButter(-140, 5.5, 200);
	createOrange(100, 5.5, 0);
	createOrange(80, 5.5, 100);
	createOrange(-200, 5.5, 200);
	createButter(-100, 5.5, 100);
	createButter(-200, 5.5, -60);
	createButter(-200, 5.5, -160);

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

	var texture = new THREE.TextureLoader().load('./img/floor.jpg');
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set(40, 40);

	var floor = new THREE.PlaneGeometry(3000, 3000),
		floorMaterial = new THREE.MeshPhongMaterial({ map: texture, specular: 0x555555, shininess: 5 });

	var plane = new THREE.Mesh(floor, floorMaterial);
	plane.material.side = THREE.DoubleSide;
	plane.rotation.x = Math.PI / 2;
	plane.position.set(0, -100, 0);

	scene.add(plane);
}

function createOrthographicTopCamera() {
	var aspect = window.innerWidth / window.innerHeight;

	if (aspect > 1) {
		orthographicTopCamera = new THREE.OrthographicCamera(-tableSize * aspect * 0.5, tableSize * aspect * 0.5, tableSize * 0.5, -tableSize * 0.5, 1, 601);
	} else {
		orthographicTopCamera = new THREE.OrthographicCamera(-tableSize * 0.5, tableSize * 0.5, tableSize * 0.5 / aspect, -tableSize * 0.5 / aspect, 1, 601);
	}
	orthographicTopCamera.position.set(0, 500, 0);
	orthographicTopCamera.aspect = aspect;
	orthographicTopCamera.lookAt(scene.position);
}

function createPerspectiveTopCamera() {
	'use strict'

	perspectiveTopCamera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 1, 1000);
	perspectiveTopCamera.position.set(0, 500, 0);
	perspectiveTopCamera.lookAt(scene.position);
}

function createChaseCamera() {
	'use strict'

	chaseCamera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 1, 1000);
}

function animate() {
	checkKeysPressed();
	var thisFrameTime = Date.now();
	var deltaT = thisFrameTime - previousFrameTime;
	car.update(deltaT / 1000);

	var relativeCameraOffset = new THREE.Vector3(-50, 30, 0);
	var cameraOffset = relativeCameraOffset.applyMatrix4(car.object.matrixWorld);
	chaseCamera.position.x = cameraOffset.x;
	chaseCamera.position.y = cameraOffset.y;
	chaseCamera.position.z = cameraOffset.z;
	chaseCamera.lookAt(car.object.position);


	render();


	setTimeout(function () {

		requestAnimationFrame(animate);

	}, 1000 / 60);

	previousFrameTime = thisFrameTime;
}

/*******************************************************************

2. USER INPUT

*******************************************************************/

/* 2.1. Repositions animation on the window after resizing */
function onResize() {

	if (window.innerWidth > 0 && window.innerHeight > 0) {
		var aspect = window.innerWidth / window.innerHeight;
		renderer.setSize(window.innerWidth, window.innerHeight);
		if (aspect > 1) {
			orthographicTopCamera.left = -tableSize * aspect * 0.5;
			orthographicTopCamera.right = tableSize * aspect * 0.5;
			orthographicTopCamera.top = tableSize * 0.5;
			orthographicTopCamera.bottom = -tableSize * 0.5;
		} else {
			orthographicTopCamera.left = -tableSize * 0.5;
			orthographicTopCamera.right = tableSize * 0.5;
			orthographicTopCamera.top = tableSize * 0.5 / aspect;
			orthographicTopCamera.bottom = -tableSize * 0.5 / aspect;
		}

		orthographicTopCamera.aspect = aspect;
		orthographicTopCamera.updateProjectionMatrix();
		perspectiveTopCamera.aspect = aspect;
		perspectiveTopCamera.updateProjectionMatrix();
		chaseCamera.aspect = aspect;
		chaseCamera.updateProjectionMatrix();
	}
}

document.addEventListener('keydown', function (e) {
	keyPressed[e.key] = true;
}, false);
document.addEventListener('keyup', function (e) {
	keyPressed[e.key] = false;
}, false);

function checkKeysPressed() {
	if (keyPressed['a'] || keyPressed['A']) {
		scene.traverse(function (node) {
			if (node instanceof (THREE.Mesh)) {
				if (node.material instanceof Array) {
					node.material.forEach(function (el) {
						el.wireframe = !el.wireframe
					});
				}
				node.material.wireframe = !node.material.wireframe;
			}
		});

		keyPressed['a'] = false;
		keyPressed['A'] = false;
	}

	if (keyPressed['1']) { cameraIndex = 1 }
	else if (keyPressed['2']) { cameraIndex = 2 }
	else if (keyPressed['3']) { cameraIndex = 3 }

	if (keyPressed['ArrowUp']) {
		car.setAccelerationBit(1);
	} else if (keyPressed['ArrowDown']) {
		car.setAccelerationBit(-1);
	} else {
		car.setAccelerationBit(0);
	}

	if (keyPressed['ArrowRight']) {
		car.setAngleBit(-1);
	} else if (keyPressed['ArrowLeft']) {
		car.setAngleBit(1);
	} else {
		car.setAngleBit(0);
	}
}