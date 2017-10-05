class movingObject {

	constructor(initialPosition, initialVelocity, directionOfMovement) {
		if (!initialPosition instanceof Array) {
			console.error('Parameter position is not an array');
			return undefined;
		}

		if (NaN(initialVelocity)) {
			console.error('Parameter initialVelocity is not a number');
		}

		if (!directionOfMovement instanceof Array) {
			console.error('Parameter directionOfMovement is not an array');
			return undefined;
		}

		if (initialPosition.length != directionOfMovement.length) {
			console.error('initialVelocity and directionOfMovement don\'t have the same dimensions');
			return undefined;
		}

		var directionModulus = 0;
		var directionDimension = directionOfMovement.length;

		for (var i = 0; i < directionDimension; i++) {
			directionModulus += i * i;
		}

		directionModulus = Math.sqrt(directionModulus);

		if (directionModulus != 1) {
			console.error('directionOfMovement doesn\'t represent a unit vector');
			return undefined;
		}
		
		this.position = initialPosition;
		this.velocity = initialVelocity;
		this.directionOfMovement = directionOfMovement;
	}

	get position() {
		return this.position;
	}

	get velocity() {
		return this.velocity;
	}

	get directionOfMovement() {
		return this.directionOfMovement;
	}

	set position(position) {
		if (!position instanceof Array) {
			console.error('Parameter position is not an array');
		} else if (position.length != this.position.length) {
			console.error('position has diferent dimensions that the object')
		} else {
			this.position = position;
		}
	}

	set velocity(velocity) {
		if (isNaN(velocity)) {
			console.error('Parameter velocity is not a number');
		} else {
			this.velocity = velocity;
		}
	}

	set directionOfMovement(directionOfMovement) {
		if (!directionOfMovement instanceof Array) {
			console.error('Parameter directionOfMovement is not an array');
		} else if (directionOfMovement.length != this.directionOfMovement.length) {
			console.error('directionOfMovement has diferent dimensions that the object')
		} else {
			this.directionOfMovement = directionOfMovement;
		}
	}
	
	move() {
		var dimension = this.directionOfMovement.length;

		for (var i = 0; i < dimension; i++) {
			this.position[i] += this.directionOfMovement[i] * velocity;
		}

		return this.position;
	}
}