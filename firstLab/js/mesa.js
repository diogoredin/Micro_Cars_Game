/* global THREE */

// Declaration of basic WebGL vars
var scene, camera, renderer;
// Declaration of table material
var tableMaterial;
// Declaration of ball
var ball;


function init() {
	'use strict'

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	createScene();
	createCamera();

	window.addEventListener('resize', onResize);
	window.addEventListener('keydown', onKeyDown);
}

function render() {
	'use strict'

	renderer.render(scene, camera);
}

function createScene() {
	'use strict'

	scene = new THREE.Scene();
	scene.add(new THREE.AxisHelper(10));
	createTable(0, 0, 0);
	createBall(0, 0, 15);
}

function createCamera() {
	'use strict'

	camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.set(50, 50, 50);
	camera.lookAt(scene.position);
}

function createTable(x, y, z) {
	'use strict'

	var table = new THREE.Object3D();
	tableMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

	addTableTop(table, 0, 7, 0);
	addTableLeg(table, -25, 3, -8);
	addTableLeg(table, 25, 3, -8);
	addTableLeg(table, -25, 3, 8);
	addTableLeg(table, 25, 3, 8);

	scene.add(table);
	table.position.set(x, y, z);
}

function addTableTop(obj, x, y, z) {
	'use strict'

	var tableTopGeometry = new THREE.CubeGeometry(60, 2, 20);
	var tableTopMesh = new THREE.Mesh(tableTopGeometry, tableMaterial);
	tableTopMesh.position.set(x, y, z);

	obj.add(tableTopMesh);
}

function addTableLeg(obj, x, y, z) {
	'use strict'

	var tableLegGeometry = new THREE.CubeGeometry(2, 6, 2);
	var tableLegMesh = new THREE.Mesh(tableLegGeometry, tableMaterial);
	tableLegMesh.position.set(x, y, z);

	obj.add(tableLegMesh);
}

function createBall(x, y, z) {
	'use strict'

	ball = new THREE.Object3D();
	ball.userData = { jumping: true, step: 0 };

	var ballMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
	var ballGeometry = new THREE.SphereGeometry(4, 10, 10);
	var ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);

	ball.add(ballMesh);
	ball.position.set(x, y, z);
	scene.add(ball);
}

function onResize() {
	'use strict'

	renderer.setSize(window.innerWidth, window.innerHeight);
	if (window.innerWidth > 0 && window.innerHeight > 0) {
		camera.aspect = renderer.getSize().width / renderer.getSize().height;
		camera.updateProjectionMatrix();
	}
}

function onKeyDown(e) {
	'use strict'

	switch (e.key) {
		case 'a':
		case 'A':
			scene.traverse(function (node) {
				if (node instanceof (THREE.Mesh)) {
					node.material.wireframe = !node.material.wireframe;
				}
			});
			break;

		case 's':
		case 'S':
			ball.userData.jumping = !ball.userData.jumping;
			break;
	}
}

function animate() {
	'use strict'

	if (ball.userData.jumping) {
		ball.userData.step += 0.04;
		ball.position.y = Math.abs(30 * (Math.sin(ball.userData.step)));
		ball.position.z = 15 * (Math.cos(ball.userData.step));
	}

	render();

	requestAnimationFrame(animate);
}