/*******************************************************************

0. THREE.JS INIT

*******************************************************************/

'use strict'

var scene, camera, renderer;
var gameOver = false;
var gameOverT= new THREE.TextureLoader().load('./tiles/GameOver.png');
var paused = false;
var pausedT = new THREE.TextureLoader().load('./tiles/GamePaused.png');

var pPressed = false;
var previousFrameTime = Date.now();
var keyStates = {};

var lightCalculation = true;
var materialKind = false;

function init() {

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.autoClear = false;
	document.body.appendChild(renderer.domElement);

	createScene();
	createChaseCamera();
	createOrthographicTopCamera();
	createPerspectiveTopCamera();
	createHelpCamera();
	createLivesCamera();

	window.addEventListener('resize', onResize);
	window.addEventListener('keydown', function(e) { keyStates[e.key] = true; } );
	window.addEventListener('keyup', function(e) { keyStates[e.key] = false; } );

}

function render() {
	renderer.clear();

	renderer.setViewport(0.8 * window.innerWidth, 0.2 * window.innerHeight, 0.1 * window.innerWidth, 0.1 * window.innerHeight);
	renderer.render(scene, livesCamera);

	renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
	if (cameraIndex == 1) { renderer.render(scene, orthographicTopCamera); }
	else if (cameraIndex == 2) { renderer.render(scene, perspectiveTopCamera); }
	else if (cameraIndex == 3) { renderer.render(scene, chaseCamera) }
	else if (cameraIndex == 4) { renderer.render(scene, helpCamera) }
}

/*******************************************************************

1. SCENE

*******************************************************************/

function createScene() {

	/* Creates the scene */
	scene = new THREE.Scene();

	/* Adds light to the scene */
	//new AmbientLight('#555555');
	new DirectionalLight('#ffffff', -1, 6, 1);

	/* Adds candles to the top of the table */
	var candle_positions = [new THREE.Vector3(0, 10, 220),
							new THREE.Vector3(20, 10, 50 ),
							new THREE.Vector3(200, 10, -100 ),
							new THREE.Vector3(-200, 10, -200 ),
							new THREE.Vector3(-100, 10, -100),
							new THREE.Vector3(-200, 10, -30),
						   ]
	
	for (var i = 0; i < candle_positions.length; i++) {
		new PointLight('#ffffff', candle_positions[i]);
	}

	/* Creates a floor and table */
	new Floor( new THREE.Vector3(0, -100, 0) );
	new Table( new THREE.Vector3(0, 0, 0) );

	/* Adds a car on height 8 because of the height of the table top. Second vector defines initial direction */
	new Car( new THREE.Vector3(-50, 7.5, -10), 0, new THREE.Vector3(1, 0, 0) );

	/* Adds 5 butters to our table on height 5.5 because of the height of the table top. */
	var butter_positions = [new THREE.Vector3(100, 5.8, 100),
							new THREE.Vector3(-140, 5.8, 200 ),
							new THREE.Vector3(-100, 5.8, 100 ),
							new THREE.Vector3(-200, 5.8, -60 ),
							new THREE.Vector3(-200, 5.8, -160)];

	for ( var i = 0; i < 5; i++ ) {
		new Butter(butter_positions[i]);
	}

	/* Adds 3 oranges to our table on height 5.5 because of the height of the table top. */
	var orange_positions = [new THREE.Vector3( 200, 15.5, 0 ),
							new THREE.Vector3( -30, 15.5, 100 ),
							new THREE.Vector3( -200, 15.5, 200 )];

	for ( var i = 0; i < 3; i++ ) {
		new Orange(orange_positions[i], 20, new THREE.Vector3(1, 0, 0), 10);
	}

	/* Adds an axis helper to visualize axis */
	//scene.add(new THREE.AxisHelper(100));

}

/*******************************************************************

2. ANIMATE

*******************************************************************/

function animate() {

	/* Activates any functionality requested */
	processKeys();

	/* Calculates the time difference */
	var currentFrameTime = Date.now(),
		deltaT = (paused || gameOver) ? 0 : currentFrameTime - previousFrameTime;
	
	var texture;
	if (paused) {
		texture = pausedT;
	} else if (gameOver) {
		texture = gameOverT;
	} else {
		orthographicTopCamera.box.material.visible = false;
		perspectiveTopCamera.box.material.visible = false;
		chaseCamera.box.material.visible = false;
	}

	if (texture != undefined) {
		if (cameraIndex == 1) {
			orthographicTopCamera.box.material.map = texture;
			orthographicTopCamera.box.material.visible = true;
			perspectiveTopCamera.box.material.visible = false;
			chaseCamera.box.material.visible = false;
		} else if (cameraIndex == 2) {
			perspectiveTopCamera.box.material.map = texture;
			perspectiveTopCamera.box.material.visible = true;
			orthographicTopCamera.box.material.visible = false;
			chaseCamera.box.material.visible = false;
		} else if (cameraIndex == 3) {
			chaseCamera.box.material.map = texture;
			chaseCamera.box.material.visible = true;
			orthographicTopCamera.box.material.visible = false;
			perspectiveTopCamera.box.material.visible = false;
		}
	}

	/* Updates the position of our moving objects */
	scene.traverse( function(object) {

		/* Updates Car */
		if (object.type == 'Object3D' && object.self instanceof Car == true) {
			object.self.update(deltaT / 1000);
		}

		/* Updates Oranges */
		if (object.type == 'Object3D' && object.self instanceof Orange == true) {
			object.self.update(deltaT / 1000);
		}

		/* Updates Oranges */
		if (object.type == 'Object3D' && object.self instanceof Cheerio == true) {
			if (object.self.velocity) {
				object.self.update(deltaT / 1000);
			}
		}

	});

	/* Makes Camera Look at the Car */
	scene.traverse( function(object) {

		/* Updates Car */
		if (object.type == 'Object3D' && object.self instanceof Car == true) {

			var relativeCameraOffset = new THREE.Vector3(-50, 30, 0),
				cameraOffset = relativeCameraOffset.applyMatrix4(object.matrixWorld);

			chaseCamera.position.x = cameraOffset.x;
			chaseCamera.position.y = cameraOffset.y;
			chaseCamera.position.z = cameraOffset.z;

			chaseCamera.lookAt(object.position);
		}

	});

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

3. USER INPUT

*******************************************************************/

/* 3.1. Repositions animation on the window after resizing */
function onResize() {
	var tableSize = 600;
	var livesSize = 50;

	if (window.innerWidth > 0 && window.innerHeight > 0) {

		var aspect = window.innerWidth / window.innerHeight;
		renderer.setSize(window.innerWidth, window.innerHeight);

		if (aspect > 1) {
			orthographicTopCamera.left = -tableSize * aspect * 0.5;
			orthographicTopCamera.right = tableSize * aspect * 0.5;
			orthographicTopCamera.top = tableSize * 0.5;
			orthographicTopCamera.bottom = -tableSize * 0.5;

			livesCamera.left = -livesSize * aspect * 0.5;
			livesCamera.right = livesSize * aspect * 0.5;
			livesCamera.top = livesSize * 0.5;
			livesCamera.bottom = -livesSize * 0.5;
		} else {
			orthographicTopCamera.left = -tableSize * 0.5;
			orthographicTopCamera.right = tableSize * 0.5;
			orthographicTopCamera.top = tableSize * 0.5 / aspect;
			orthographicTopCamera.bottom = -tableSize * 0.5 / aspect;

			livesCamera.left = -livesSize * 0.5;
			livesCamera.right = livesSize * 0.5;
			livesCamera.top = livesSize * 0.5 / aspect;
			livesCamera.bottom = -livesSize * 0.5 / aspect;
		}

		livesCamera.aspect = aspect;
		livesCamera.updateProjectionMatrix();
		orthographicTopCamera.aspect = aspect;
		orthographicTopCamera.updateProjectionMatrix();
		perspectiveTopCamera.aspect = aspect;
		perspectiveTopCamera.updateProjectionMatrix();
		chaseCamera.aspect = aspect;
		chaseCamera.updateProjectionMatrix();
	}

}

/* 3.2. Processes the events to trigger on click */
function processKeys() {

	/* Paused Game */
	if (keyStates['s'] || keyStates['S']) {
		if (!pPressed) {
			pPressed = true;
			paused = !paused;
		}
	} else {
		pPressed = false;
	}

	if (keyStates['r'] || keyStates['R']) {
		restartGame();
	}

	/* Wireframe View */
	if ( keyStates['a'] || keyStates['A'] ) {

		scene.traverse(function(node) {

			if (node instanceof (THREE.Mesh)) {
				if (node.material instanceof Array) {
					node.material.forEach(function (el) {
						el.wireframe = !el.wireframe;
					});
				}
				node.material.wireframe = !node.material.wireframe;
			}

		});

		keyStates['a'] = false;
		keyStates['A'] = false;
	}

	/* Turns on/off Directional or Ambient Light */
	if ( keyStates['n'] || keyStates['N'] ) {

		scene.traverse( function(object) {
			if ( object.self instanceof DirectionalLight == true || object.self instanceof AmbientLight == true) {
				object.self.turnOnOff();
			}
		});

		keyStates['n'] = false;
		keyStates['N'] = false;
	}

	/* Turns on/off Directional Light */
	if (keyStates['c'] || keyStates['C']) {

		scene.traverse(function (object) {
			if (object.self instanceof PointLight == true) {
				object.self.turnOnOff();
			}
		});

		keyStates['c'] = false;
		keyStates['C'] = false;
	}

	/* Turns on/off Car Maximums */
	if ( keyStates['m'] || keyStates['M'] ) {
		
		scene.traverse( function(object) {
			if (object.type == 'Object3D' && object.self instanceof Car == true) {
				object.self.maximumsLight();
			}
		});

		keyStates['m'] = false;
		keyStates['M'] = false;
	}

	/* Turns on/off Car Lights */
	if ( keyStates['h'] || keyStates['H'] ) {
		
		scene.traverse( function(object) {
			if (object.type == 'Object3D' && object.self instanceof Car == true) {
				object.self.changeLights();
			}
		});

		keyStates['h'] = false;
		keyStates['H'] = false;
	}

	/* Changes Light Calculation or Texture Type */
	if ( keyStates['l'] || keyStates['L'] || keyStates['g'] || keyStates['G'] ) {

		/* Changes Light Calculation on/off */
		if ( keyStates['l'] || keyStates['L'] ) {
			lightCalculation = !lightCalculation;

			console.info( 'Light Calculation', lightCalculation ? 'On' : 'Off' );			
		}

		/* Changes Materials Gourad/Phong */
		if ( keyStates['g'] || keyStates['G'] ) {
			materialKind = !materialKind;

			console.info( 'Material', materialKind ? 'Gourad' : 'Phong' );
		}

		/* Goes through the scene and grabs each object to change its material */
		scene.traverse(function(node) {
			if ( node instanceof THREE.Mesh ) {

				/* Grabs existing properties of the object */
				var color, map, side, wireframe;
				if ( node.material.color != undefined ) color = node.material.color; else color = '#FFFFFF';
				if ( node.material.map != undefined ) map = node.material.map; else map = false;
				if ( node.material.wireframe != undefined ) wireframe = node.material.wireframe; else wireframe = false;
			
				/* Checks if light calculation is on or off */
				if ( !lightCalculation ) {
			
					if ( map != false ) {
						node.material = new THREE.MeshBasicMaterial({ color: color, wireframe: wireframe, map: map });
					} else {
						node.material = new THREE.MeshBasicMaterial({ color: color, wireframe: wireframe });				
					}
			
				/* Light calculation is on */
				} else {
			
					/* Diferent calls depending whether texture is defined or not */
					if ( !map ) {

						/* Applies Gourad or Phong */
						if ( materialKind ) {
							node.material = new THREE.MeshLambertMaterial({ color: color, wireframe: wireframe });
			
						} else {
							node.material = new THREE.MeshPhongMaterial({ color: color, wireframe: wireframe });
						}
						
					} else {

						/* Applies Gourad or Phong */
						if ( materialKind ) {
							node.material = new THREE.MeshLambertMaterial({ color: color, wireframe: wireframe, map: map });
			
						} else {
							node.material = new THREE.MeshPhongMaterial({ color: color, wireframe: wireframe, map: map });
						}
			
					}
			
				}

				/* Allows being seen from two sides */
				node.material.side = THREE.DoubleSide;

			}
		});

		if ( keyStates['l'] || keyStates['L'] ) {
			keyStates['l'] = false;
			keyStates['L'] = false;
		}

		if ( keyStates['g'] || keyStates['G'] ) {
			keyStates['g'] = false;
			keyStates['G'] = false;
		}

	}

	/* Camera Controls */
	if ( keyStates['1'] ) { cameraIndex = 1 }
	else if ( keyStates['2'] ) { cameraIndex = 2 }
	else if ( keyStates['3'] ) { cameraIndex = 3 }
	else if ( keyStates['4'] ) { cameraIndex = 4 }

	/* Car Controls */
	scene.traverse( function(object) {

		if (object.type == 'Object3D' && object.self instanceof Car == true) {
			
			var car = object.self;

			if (keyStates['ArrowUp']) {
				car.setAccelerationBit(1);
			} else if (keyStates['ArrowDown']) {
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

	});

}

function restartGame() {
	scene.traverse(function (obj) {
		if (obj.self instanceof Car || obj.self instanceof Cheerio || obj.self instanceof Orange) { 
			obj.self.restart();
		}
	});

	gameOver = false;
}