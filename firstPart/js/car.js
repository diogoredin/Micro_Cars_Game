class Car extends MovingObject {
	
	constructor(initialPosition, initialVelocity, directionOfMovement) {

		super(initialPosition, initialVelocity, directionOfMovement);

		this.maxVelocity = 10;
		this.minVelocity = 0;
		
		this.acceleration = 1;
		this.accelerationBit = 0;

		this.angle = 0;
		this.angleDiffSecond = 180 * Math.PI / 180;
		this.angleBit = 0;

		this._addToScene();
	}

	_addToScene() {
		var carMaterial = new THREE.MeshLambertMaterial({ color: 0xb23320, wireframe: false });
		// THE MIDDLE
		var middleCarGeometry = new THREE.CubeGeometry(44, 3, 18);
		var middleCarMesh = new THREE.Mesh(middleCarGeometry, carMaterial);
		middleCarMesh.position.set(0, -2, 0);


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

		// THE TOP
		var topCarGeometry = new THREE.CubeGeometry(27, 8, 18);
		var topCarMesh = new THREE.Mesh(topCarGeometry, carMaterial);
		topCarMesh.position.set(8.5, 2, 0);


		this.addObject(middleCarMesh);
		this.addObject(frontBottomMesh);
		this.addObject(middleBottomMesh);
		this.addObject(backBottomMesh);
		this.addObject(topCarMesh);

		scene.add(this.object);
	}

	setAccelerationBit(bit) {
		this.accelerationBit = bit;
	}

	setAngleBit(bit) {
		this.angleBit = bit;
	}

	accelerate(deltaT) {
		var newVelocity = this.velocity + this.acceleration * deltaT * this.accelerationBit;

		if (newVelocity > this.maxVelocity) {
			newVelocity = this.maxVelocity;
		} else if (newVelocity < this.minVelocity) {
			newVelocity = this.minVelocity;
		}
		this.setVelocity(newVelocity);
	}

	turn(deltaT) {
		this.object.rotateY(deltaT * this.angleDiffSecond * this.angleBit);
		this.directionOfMovement.applyAxisAngle(new THREE.Vector3(0, 1, 0), deltaT * this.angleDiffSecond * this.angleBit);
	}

	update(deltaT) {
		this.accelerate(deltaT);
		this.turn(deltaT);
		this.move()

		this.setAccelerationBit(0);
		this.setAngleBit(0);
	}

}