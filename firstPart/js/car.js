function createCar(x, y, z) {
	'use strict'

	var car = new THREE.Object3D();
	car.userData = {velocity: 0,}
	var carMaterial = new THREE.MeshLambertMaterial({ color: 0xb23320, wireframe: false });

	// THE MIDDLE
	var middleCarGeometry = new THREE.CubeGeometry(44, 3, 18);
	var middleCarMesh = new THREE.Mesh(middleCarGeometry, carMaterial);
	middleCarMesh.position.set(0, -2, 0);
	car.add(middleCarMesh);

	// THE BOTTOM
	var frontBottomGeometry = new THREE.CubeGeometry(7, 4, 18);
	var middleBottomGeometry = new THREE.CubeGeometry(18, 4, 18);
	var backBottomGeometry = new THREE.CubeGeometry(1, 4, 18);

	var frontBottomMesh = new THREE.Mesh(frontBottomGeometry, carMaterial);
	var middleBottomMesh = new THREE.Mesh(middleBottomGeometry, carMaterial);
	var backBottomMesh = new THREE.Mesh(backBottomGeometry, carMaterial);

	frontBottomMesh.position.set(-18.5, -5.5, 0);
	middleBottomMesh.position.set(4, -5.5, 0);
	backBottomMesh.position.set(21.5, -5.5, 0);

	car.add(frontBottomMesh);
	car.add(middleBottomMesh);
	car.add(backBottomMesh);

	// THE TOP
	var topCarGeometry = new THREE.CubeGeometry(27, 8, 18);
	var topCarMesh = new THREE.Mesh(topCarGeometry, carMaterial);
	topCarMesh.position.set(8.5, 2, 0);

	car.position.set(x, y, z);
	car.add(topCarMesh);

	scene.add(car);
}

function updateCarVelocity(car) {
	if (car.userData.state == 'accelerating') {
		car.userData.velocity += 10;
	} else if (car.userData.state == 'stopping') {
		car.userData.velocity -= 12;
	} else {
		car.userData.velocity 
	}
}