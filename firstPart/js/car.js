class Car extends MovingObject {
	
	constructor(initialPosition, initialVelocity, directionOfMovement) {

		initialPosition.setY(3.4);
		super(initialPosition, initialVelocity, directionOfMovement);

		this.maxVelocity = 10;
		this.minVelocity = -10;
		
		this.acceleration = 2;
		this.accelerationBit = 0;

		this.angle = 0;
		this.angleDiffSecond = 2 * Math.PI;
		this.angleBit = 0;

		this._buildCar();
		scene.add(this.object);
	}

	_buildCar() {
		var carMaterial = new THREE.MeshLambertMaterial({ color: 0xb23320, wireframe: false });

		//THE BOTTOM
		var bottom = new THREE.Object3D();
		bottom.position.set(0, -0.5, 0);

		this._addCarRectMesh(2, 1, 8, -6, 0, 0, bottom, carMaterial);
		this._addCarRectMesh(2, 1, 6, -4, 0, 0, bottom, carMaterial);
		this._addCarRectMesh(5, 1, 8, -0.5, 0, 0, bottom, carMaterial);
		this._addCarRectMesh(2, 1, 6, 3, 0, 0, bottom, carMaterial);
		this._addCarRectMesh(3, 1, 8, 5.5, 0, 0, bottom, carMaterial);
		
		//THE MIDDLE
		var middle = new THREE.Object3D();
		middle.position.set(0, 0.5, 0);

		this._addCarRectMesh(9, 1, 8, 2.5, 0, 0, middle, carMaterial);

		//THE TOP
		var top = new THREE.Object3D();
		top.position.set(0, 2, 0);

		this._addCarRectMesh(4, 2, 8, 0, 0, 0, top, carMaterial);

		//THE BOX
		var box = new THREE.Object3D();
		box.position.set(0, 0.75, 0);

		this._addCarRectMesh(5, 1.5, 0.1, -4.5, 0, 3.95, box, carMaterial);
		this._addCarRectMesh(5, 1.5, 0.1, -4.5, 0, -3.95, box, carMaterial);
		this._addCarRectMesh(0.1, 1.5, 8, -6.95, 0, 0, box, carMaterial);
		this._addCarRectMesh(5, 0.1, 8, -4.5, -0.7, 0, box, carMaterial);
		
		//THE WHEELS
		var wheels = new THREE.Object3D();
		wheels.position.set(0, -1, 0);

		this._addCarWheelMesh(0.7, 0.25, 3, 0, 3.5, wheels, carMaterial);
		this._addCarWheelMesh(0.7, 0.25, 3, 0, -3.5, wheels, carMaterial);
		this._addCarWheelMesh(0.7, 0.25, -4, 0, 3.5, wheels, carMaterial);
		this._addCarWheelMesh(0.7, 0.25, -4, 0, -3.5, wheels, carMaterial);

		this.object.add(bottom);
		this.object.add(middle);
		this.object.add(top);
		this.object.add(box);
		this.object.add(wheels);
	}

	_addCarRectMesh(sizeX, sizeY, sizeZ, posX, posY, posZ, obj, material) {
		var rectGeometry = new THREE.CubeGeometry(sizeX, sizeY, sizeZ);
		var rectMesh =  new THREE.Mesh(rectGeometry, material);
		rectMesh.position.set(posX, posY, posZ);
		obj.add(rectMesh);
	}

	_addCarWheelMesh(radius, tube, posX, posY, posZ, obj, material) {
		var wheelGeometry = new THREE.TorusBufferGeometry(radius, tube, 30, 30);
		var wheelMesh = new THREE.Mesh(wheelGeometry, material);
		wheelMesh.position.set(posX, posY, posZ);
		obj.add(wheelMesh);
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
		var turningAngle = deltaT * this.angleDiffSecond * this.angleBit * (this.velocity / this.maxVelocity);
		this.object.rotateY(turningAngle);
		this.directionOfMovement.applyAxisAngle(new THREE.Vector3(0, 1, 0), turningAngle);
	}

	update(deltaT) {
		this.accelerate(deltaT);
		this.turn(deltaT);
		this.move()

		this.setAccelerationBit(0);
		this.setAngleBit(0);
	}

}