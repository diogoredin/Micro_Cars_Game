/*******************************************************************

0. THREE.JS INIT

*******************************************************************/

'use strict'

var scene, camera, renderer;
var previousFrameTime = Date.now();

var keyStates = {};

var oranges = [];
var car;

function init() {

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	createScene();
	createChaseCamera();
	createOrthographicTopCamera();
	createPerspectiveTopCamera();

	window.addEventListener('resize', onResize);
	window.addEventListener('keydown', function(e) { keyStates[e.key] = true; } );
	window.addEventListener('keyup', function(e) { keyStates[e.key] = false; } );

}

function render() {
	if (cameraIndex == 1) { renderer.render(scene, orthographicTopCamera); }
	else if (cameraIndex == 2) { renderer.render(scene, perspectiveTopCamera); }
	else { renderer.render(scene, chaseCamera) }
}

/*******************************************************************

1. SCENE

*******************************************************************/

function createScene() {

	/* Creates the scene */
	scene = new THREE.Scene();

	/* Adds light to the scene */
	new AmbientLight('#666666');
	new FocusLight('#999999', 0, 1, 1);

	/* Creates a floor and table */
	new Floor( new THREE.Vector3(0, -100, 0) );
	new Table( new THREE.Vector3(0, 0, 0) );

	/* Adds a car on height 8 because of the height of the table top. Second vector defines initial direction */
	car = new Car( new THREE.Vector3(-50, 8, -10), 0, new THREE.Vector3(1, 0, 0) );

	/* Adds 5 butters to our table on height 5.5 because of the height of the table top. */
	var butter_positions = [new THREE.Vector3(100, 5.5, 200),
							new THREE.Vector3(-140, 5.5, 200 ),
							new THREE.Vector3(-100, 5.5, 100 ),
							new THREE.Vector3(-200, 5.5, -60 ),
							new THREE.Vector3(-200, 5.5, -160)];

	for ( var i = 0; i < 5; i++ ) {
		new Butter(butter_positions[i]);
	}

	/* Adds 3 oranges to our table on height 5.5 because of the height of the table top. */
	var orange_positions = [new THREE.Vector3( 100, 15, 0 ),
							new THREE.Vector3( 80, 15, 100 ),
							new THREE.Vector3( -200, 15, 200 )];
			
	for ( var i = 0; i < 3; i++ ) {
		oranges[i] = new Orange(orange_positions[i], 0.5, new THREE.Vector3(1, 0, 0), 10);
	}

	/* Increase velocity every 5s */
	setInterval(function () {
		oranges.forEach(function (orange) {
			orange.increaseVelocity(1);
		});
	}, 5000);

	/* Adds an axis helper to visualize axis */
	scene.add(new THREE.AxisHelper(100));

}

function animate() {

	/* Activates any functionality requested */
	processKeys();

	/* Calculates the time difference */
	var currentFrameTime = Date.now(),
		deltaT = currentFrameTime - previousFrameTime;

	/* Updates the position of our car */
	car.update(deltaT / 1000);
	
	/* Updates the position of oranges */
	oranges.forEach(function(orange) {
		orange.update(deltaT / 1000);
	});

	/* Makes Camera Look at the Car */
	var relativeCameraOffset = new THREE.Vector3(-50, 30, 0),
		cameraOffset = relativeCameraOffset.applyMatrix4(car.object.matrixWorld);

	chaseCamera.position.x = cameraOffset.x;
	chaseCamera.position.y = cameraOffset.y;
	chaseCamera.position.z = cameraOffset.z;
	chaseCamera.lookAt(car.object.position);

	/* Renders the new frame */
	render();

	/* Queues the next frame rendering */
	setTimeout(function() {
		requestAnimationFrame(animate);
	}, 1000 / 60);

	/* Stores this frame for later reference */
	previousFrameTime = currentFrameTime;

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

/* 2.2. Processes the events to trigger on click */
function processKeys() {

	/* Wireframe View */
	if ( keyStates['a'] || keyStates['A'] ) {

		scene.traverse(function(node) {

			if (node instanceof (THREE.Mesh)) {
				if (node.material instanceof Array) {
					node.material.forEach(function (el) {
						el.wireframe = !el.wireframe
					});
				}
				node.material.wireframe = !node.material.wireframe;
			}

		});

		keyStates['a'] = false;
		keyStates['A'] = false;
	}

	/* Camera Controls */
	if ( keyStates['1'] ) { cameraIndex = 1 }
	else if ( keyStates['2'] ) { cameraIndex = 2 }
	else if ( keyStates['3'] ) { cameraIndex = 3 }

	/* Car Controls */
	if (keyStates['ArrowUp']) {
		car.setAccelerationBit(1);
	} else if (keyStates['ArrowDown'] ){
		car.setAccelerationBit(-1);
	} else {
		car.setAccelerationBit(0);
	}

	if (keyStates['ArrowRight']) {
		car.setAngleBit(-1);
	} else if (keyStates['ArrowLeft']) {
		car.setAngleBit(1);
	} else {
		car.setAngleBit(0);
	}

}