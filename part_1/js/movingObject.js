class MovingObject {

	constructor(initialPosition, initialVelocity, directionOfMovement) {
		if (!initialPosition instanceof THREE.Vector3) {
			console.error('Parameter position is not a THREE.Vector3');
			return undefined;
		}

		if (isNaN(initialVelocity)) {
			console.error('Parameter initialVelocity is not a number');
		}

		if (!directionOfMovement instanceof THREE.Vector3) {
			console.error('Parameter directionOfMovement is not a THREE.Vector3');
			return undefined;
		}
		
		this.object = new THREE.Object3D();
		this.object.position.set(0, 0, 0);
		this.object.position.add(initialPosition);
		this.velocity = initialVelocity;
		this.directionOfMovement = directionOfMovement;
	}

	setObject(object) {
		if (!object instanceof THREE.Object3D) {
			console.error('Parameter object is not an Object3D');
		} else {
			this.object = object;
		}
	}

	setPosition(position) {
		if (!position instanceof THREE.Vector3) {
			console.error('Parameter position is not a THREE.Vector3');
		} else {
			this.object.position.set(0, 0, 0);
			this.object.position.add(position);
		}
	}

	setVelocity(velocity) {
		if (isNaN(velocity)) {
			console.error('Parameter velocity is not a number');
		} else {
			this.velocity = velocity;
		}
	}

	setDirectionOfMovement(directionOfMovement) {
		if (!directionOfMovement instanceof THREE.Vector3) {
			console.error('Parameter directionOfMovement is not a THREE.Vector3');
		} else {
			this.directionOfMovement = directionOfMovement;
		}
	}
	
	move() {

		this.directionOfMovement.normalize();
		this.object.position.addScaledVector(this.directionOfMovement, this.velocity);

		return this.object.position;
	}

	addObject(object) {
		this.object.add(object);
	}

}