class Car extends MovingObject {
	
	constructor(initialPosition, initialVelocity, directionOfMovement) {

		/* Invokes constructor of parent class */
		super(initialPosition, initialVelocity, directionOfMovement, 300);

		this.maxVelocity = 100;
		this.minVelocity = -100;
		
		this.acceleration = 100;
		this.accelerationBit = 0;

		this.angle = 0;
		this.angleDiffSecond = Math.PI;
		this.angleBit = 0;

		/* Stores lights of the car and their status */
		this.lights = [];
		this.lightsStatus = true;
		this.maxStatus = false;

		/* Collision box definitions */
		this.size = [8,14,8];

		/* Models the car in 3d */
		this._buildCar();

		/* Adds object to the scene */
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
		//new CarTop(10, 20, 5, 10, new THREE.Vector3(20, 20, 20));
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

		this._addCarWheelMesh(0.7, 0.30, 3.5, 0, 3, wheels, carMaterial);
		this._addCarWheelMesh(0.7, 0.30, 3.5, 0, -4, wheels, carMaterial);
		this._addCarWheelMesh(0.7, 0.30, -3.5, 0, 3, wheels, carMaterial);
		this._addCarWheelMesh(0.7, 0.30, -3.5, 0, -4, wheels, carMaterial);

		/* Car Lights */
		/* The car has four lights: two in the front and too in the back. These are spot lights that need a direction.
		Since the car can move they need to always be in the direction of movement. To do so four helper objects are created,
		to which the each light points. Both front and rear lights pairs are separated by four units like in real life */

		/* Front facing lights with white color and intensity of 2 */
		var frontRightLamp = new THREE.SpotLight( 0xfffff0, 2, 100 ),
			frontLeftLamp = new THREE.SpotLight( 0xfffff0, 2, 100 );

		/* Rear facing lights with red color and intensity of 0.5 */
		var rearRightLamp = new THREE.SpotLight( 0xff0000, 0.5, 30 ),
			rearLeftLamp = new THREE.SpotLight( 0xff0000, 0.5, 30 );

		/* Helper Guides */
		var frontRightLightDirectionHelper= new THREE.Object3D(),
			frontLeftLightDirectionHelper = new THREE.Object3D();

		var rearRightLightDirectionHelper = new THREE.Object3D(),
			rearLeftLightDirectionHelper = new THREE.Object3D();

		/* Front facing Helper Guides position */
		frontRightLightDirectionHelper.position.set( 5, 3, 2 );
		frontLeftLightDirectionHelper.position.set( 5, 3, -2 );

		/* Rear facing Helper Guides position */
		rearRightLightDirectionHelper.position.set( -6, 3, 2 );
		rearLeftLightDirectionHelper.position.set( -6, 3, -2 );

		/* Front lights positions */
		frontRightLamp.position.set( 4, 3, 2 );
		frontLeftLamp.position.set( 4, 3, -2 );

		/* Rear lights positions */
		rearRightLamp.position.set( -5, 4, 2 );
		rearLeftLamp.position.set( -5, 4, -2 );

		/* Defines the helper object of each light */
		frontRightLamp.target = frontRightLightDirectionHelper;
		frontLeftLamp.target = frontLeftLightDirectionHelper;

		rearRightLamp.target = rearRightLightDirectionHelper;
		rearLeftLamp.target = rearLeftLightDirectionHelper;

		/* Adds to the car the front facing lights and helper guides */
		this.object.add(frontRightLightDirectionHelper);
		this.object.add(frontLeftLightDirectionHelper);
		this.object.add(frontRightLamp);
		this.object.add(frontLeftLamp);

		/* Adds to the car the rear facing lights and helper guides */
		this.object.add(rearRightLightDirectionHelper);
		this.object.add(rearLeftLightDirectionHelper);
		this.object.add(rearRightLamp);
		this.object.add(rearLeftLamp);

		/* Stores for later use (on/off etc.) */
		this.lights.push(frontRightLamp);
		this.lights.push(frontLeftLamp);
		this.lights.push(rearRightLamp);
		this.lights.push(rearLeftLamp);

		/* Car parts */
		this.object.add(bottom);
		this.object.add(middle);
		this.object.add(top);
		this.object.add(box);
		this.object.add(wheels);
	}

	_addCarRectMesh(sizeX, sizeY, sizeZ, posX, posY, posZ, obj, material) {
		var rectGeometry = new Box(sizeX, sizeY, sizeZ);
		var rectMesh = new THREE.Mesh(rectGeometry, material);
		rectMesh.position.set(posX, posY, posZ);
		obj.add(rectMesh);
	}

	_addCarWheelMesh(radius, tube, posX, posY, posZ, obj, material) {
		new Circle(radius, 20, obj, posX, posY, posZ);
	}

	setAccelerationBit(bit) {
		this.accelerationBit = bit;
	}

	setAngleBit(bit) {
		this.angleBit = bit;
	}

	accelerate(deltaT) {

		if (this.accelerationBit == - 1) {
			var newVelocity = this.velocity + this.acceleration * deltaT * this.accelerationBit * 5;
		}
		else {
			var newVelocity = this.velocity + this.acceleration * deltaT * this.accelerationBit;
		}

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
	
	/* This method turns the lights of the car on and off */
	changeLights() {

		/* Grabs the current status and changes it (on/off) */
		var lightValue = this.lightsStatus;
		this.lightsStatus = !this.lightsStatus;

		/* Turns on or off each light */
		this.lights.forEach(function(light, index) {
			if ( lightValue ) {
				light.intensity = 0;
			} else {

				/* Different Value for front and rear */
				if (index <= 2) light.intensity = 2;
				else light.intensity = 0.5;

			}
		});

	}

	/* This method turns on the maximus lights for fog */
	maximumsLight() {
		
		/* Grabs the current status and changes it */
		var maxValue = this.maxStatus;
		this.maxStatus = !this.maxStatus;

		/* Turns on or off each light */
		this.lights.forEach(function(light, index) {
			if ( maxValue ) {

				/* Different Value for front and rear */
				if (index <= 2) {
					light.intensity = 2;
					light.distance = 100; 
				} else { 
					light.intensity = 0.5; 
					light.distance = 30;
				}

			} else {

				/* Different Value for front and rear */
				if (index <= 2) {
					light.intensity = 4;
					light.distance = 200; 
				} else { 
					light.intensity = 1; 
					light.distance = 60;
				}

			}
		});

	}

	update(deltaT) {
		this.accelerate(deltaT);
		this.turn(deltaT);
		this.move(deltaT)

		this.setAccelerationBit(0);
		this.setAngleBit(0);
	}

	/* Collision handler */
	collision(element) {
		
		/* Store car so we dont lose context */
		var car = this;

		/* When colliding with an orange goes to start */
		if (element instanceof Orange) {

			/* Removes car and re-adds initial position */
			let position = new THREE.Vector3(-50, 8, -10);
			car.setPosition(position);

			/* Re-sets velocity */
			car.setVelocity(0);

		}

		/* When colliding with butter stops */
		if (element instanceof Butter) {

			/* Re-sets velocity */
			car.setVelocity(0);

		}

		/* When colliding with cheerio stops */
		if (element instanceof Cheerio) {
			this.elasticColision(element);
		}

	}

	/*************************************************************************
    *
    *    Falling off table handler
    *
    *************************************************************************/

	fallOffTable() {

		/* Store car so we dont lose context */
		var car = this;

		/* Removes orange and re-adds at random time */
		let position = new THREE.Vector3(-50, 8, -10);
		car.setPosition(position);

		/* Re-sets velocity */
		car.setVelocity(0);

	}

}