/*******************************************************************

1. THREE.JS INIT

*******************************************************************/

'use strict'
var scene, camera, renderer;
var previousFrameTime = Date.now();
var keyPressed = {};
var car;
var tableSize = 600;

function init() {

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	createScene();
	createCamera();

	window.addEventListener('resize', onResize);
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
	car = new Car(new THREE.Vector3(-50, 8, -10), 0, new THREE.Vector3(1,0,0));
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

function createCamera() {
	var aspect = window.innerWidth / window.innerHeight;

	if (aspect > 1) {
		camera = new THREE.OrthographicCamera(-tableSize * aspect * 0.5, tableSize * aspect * 0.5, tableSize * 0.5, -tableSize * 0.5, 1, 601);
	} else {
		camera = new THREE.OrthographicCamera(-tableSize * 0.5, tableSize * 0.5, tableSize * 0.5 / aspect, -tableSize * 0.5 / aspect, 1, 601);
	}
	camera.position.set(0, 500, 0);
	camera.aspect = aspect;
	camera.lookAt(scene.position);
}

function animate() {
	checkKeysPressed();
	var thisFrameTime = Date.now();
	var deltaT = thisFrameTime - previousFrameTime;
	car.update(deltaT / 1000);
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
			camera.left = -tableSize * aspect * 0.5;
			camera.right = tableSize * aspect * 0.5;
			camera.top = tableSize * 0.5;
			camera.bottom = -tableSize * 0.5;
		} else {
			camera.left = -tableSize  * 0.5;
			camera.right = tableSize * 0.5;
			camera.top = tableSize * 0.5 / aspect;
			camera.bottom = -tableSize * 0.5 / aspect;
		}
		camera.aspect = aspect;
		camera.updateProjectionMatrix();
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

	if (keyPressed['ArrowUp']) {
		car.setAccelerationBit(1);
	} else if (keyPressed['ArrowDown'] ){
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