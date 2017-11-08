class MovingObject {

	/********************************************************************

	Moving Object - An object that moves has a position, velocity, a
	direction in which it moves and mass. This class supports collision
	detection and has methods to invoke elastic and inelastic beahivour.

	*******************************************************************/

	constructor(initialPosition, initialVelocity, directionOfMovement, mass) {

		/* Error check */
		if (!initialPosition instanceof THREE.Vector3) {
			//console.error('Parameter position is not a THREE.Vector3');
			return undefined;
		}

		/* Error check */
		if (isNaN(initialVelocity)) {
			//console.error('Parameter initialVelocity is not a number');
		}

		/* Error check */
		if (!directionOfMovement instanceof THREE.Vector3) {
			//console.error('Parameter directionOfMovement is not a THREE.Vector3');
			return undefined;
		}

		/* Object Properties */
		this.object = new THREE.Object3D();
		this.object.position.set(0, 0, 0);
		this.object.position.add(initialPosition);

		/* Moving Object Properties */
		this.velocity = initialVelocity;
		this.directionOfMovement = directionOfMovement;
		this.mass = mass;

		/* Bounding Box Properties */
		this.nextX = this.object.position.x;
		this.nextY = this.object.position.y;
		this.nextZ = this.object.position.z;

		/* Saves reference to itself */
		this.object.self = this;
		this.id = this.object.id;
	}

	/* Saves an object */
	setObject(object) {
		if (!object instanceof THREE.Object3D) {
			//console.error('Parameter object is not an Object3D');
		} else {
			this.object = object;
		}
	}

	/* Allows for object composition */
	addObject(object) {
		this.object.add(object);
	}

	/* Defines the position of an object */
	setPosition(position) {
		if (!position instanceof THREE.Vector3) {
			//console.error('Parameter position is not a THREE.Vector3');
		} else {
			this.object.position.set(0, 0, 0);
			this.object.position.add(position);
		}
	}

	/* Defines the velocity of an object */
	setVelocity(velocity) {
		if (isNaN(velocity)) {
			//console.error('Parameter velocity is not a number');
		} else {
			this.velocity = velocity;
		}
	}

	/* Sets thes direction in which the object moves */
	setDirectionOfMovement(directionOfMovement) {
		if (!directionOfMovement instanceof THREE.Vector3) {
			//console.error('Parameter directionOfMovement is not a THREE.Vector3');
		} else {
			this.directionOfMovement = directionOfMovement;
		}
	}
	
	/* Tests if the object will collide and moves it */
	move(deltaT) {
		
		/* Calculates new params */
		this.calculateCollision(deltaT);

		/* Tests the collision of the bounding box */
		if ( !this.testCollision() ) {
			this.directionOfMovement.normalize();
			this.object.position.addScaledVector(this.directionOfMovement, this.velocity * deltaT);
			return this.object.position;
		}

	}

	/********************************************************************

	Collision Behaviour

	*******************************************************************/

	/* Defines the behaviour of an elastic collision */
	elasticColision(other) {
		this.directionOfMovement.normalize();
		other.directionOfMovement.normalize();

		var collisionNormal = new THREE.Vector2(this.object.position.x - other.object.position.x,
			this.object.position.z - other.object.position.z).normalize();
		var collisionTangent = new THREE.Vector2(-collisionNormal.y, collisionNormal.x);
		var v1 = this.directionOfMovement.clone().multiplyScalar(this.velocity);
		var v2 = other.directionOfMovement.clone().multiplyScalar(other.velocity);

		v1 = new THREE.Vector2(v1.x, v1.z);
		v2 = new THREE.Vector2(v2.x, v2.z);

		var v1n = v1.clone().dot(collisionNormal);
		var v1t = v1.clone().dot(collisionTangent);
		var v2n = v2.clone().dot(collisionNormal);
		var v2t = v2.clone().dot(collisionTangent);

		var v1nPrime = (v1n * (this.mass - other.mass) + 2 * other.mass * v2n) / (this.mass + other.mass);
		var v2nPrime = (v1n * (other.mass - this.mass) + 2 * this.mass * v1n) / (this.mass + other.mass);

		var vectorV1nPrime = collisionNormal.clone().multiplyScalar(v1nPrime);
		var vectorV1tPrime = collisionTangent.clone().multiplyScalar(v1t);
		var vectorV2nPrime = collisionNormal.clone().multiplyScalar(v2nPrime);
		var vectorV2tPrime = collisionTangent.clone().multiplyScalar(v2t);

		var vectorV1Prime = new THREE.Vector2().addVectors(vectorV1nPrime, vectorV1tPrime);
		var vectorV2Prime = new THREE.Vector2().addVectors(vectorV2nPrime, vectorV2tPrime);

		if (this.velocity < 0) {
			vectorV1Prime.multiplyScalar(-1);
		}

		if (other.velocity < 0) {
			vectorV2Prime.multiplyScalar(-1);
		}

		this.velocity = vectorV1nPrime.length();
		other.velocity = vectorV2Prime.length();

		this.directionOfMovement = new THREE.Vector3(vectorV1Prime.x, 0, vectorV1Prime.y).normalize();
		other.directionOfMovement = new THREE.Vector3(vectorV2Prime.x, 0, vectorV2Prime.y).normalize();

		var pos1 = new THREE.Vector3().addVectors(this.object.position, this.directionOfMovement.clone().cross(new THREE.Vector3(0,1,0)));
		var pos2 = new THREE.Vector3().addVectors(other.object.position, other.directionOfMovement.clone().cross(new THREE.Vector3(0, 1, 0)));
		this.object.lookAt(pos1);
		other.object.lookAt(pos2);
	}

	/********************************************************************

	Collision Tests

	*******************************************************************/

	/* Calculates the next position of an object */
	calculateCollision(deltaT) {

		let position = new THREE.Vector3(0, 0, 0),
			direction_movement = new THREE.Vector3(0, 0, 0);

		/* Simulates the movement we are about to make */
		direction_movement.add(this.directionOfMovement);
		position.add(this.object.position);

		direction_movement.normalize();
		position.addScaledVector(direction_movement, this.velocity * deltaT);

		/* Updates - used on the test */
		this.nextX = position.x;
		this.nextY = position.y;
		this.nextZ = position.z;

	}

	/* Runs through the scene and tests colisions with this bounding box */
	testCollision() {

		/* Stores the object for later reference */
		var a = this;

		/* Now we test it against every other object */
		scene.traverse(function(b) {

			/* Return if it isn't a moving object */
			if (b.type != 'Object3D' || b.self == undefined) { return; }

			/* It can't collide with itself */
			if (a.id != b.id) {
				
				/* If it doesn't collide with a larger sphere we can discard it */
				if (a.intersectSphereSphere(b.self)) {

					/* For debugging purposes */
					//console.log('Passed Sphere on Sphere collision test.');

					/* SPHERE/SPHERE COLLISION BOX */
					if (a.size.length == 1 && b.self.size.length == 1) {
						if (a.intersectSphereSphere(b.self)) {

							/* For debugging purposes */
							//console.log('Passed Sphere on Sphere second collision test.');

							/* Processes collision */
							a.collision(b.self);

							/* Informs that we collide (only allows for one collision ...) */
							return true;

						}
					}

					/* BOX/BOX AXIS ALIGNED COLLISION BOX */
					else if (a.size.length == 3 && b.self.size.length == 3) {
						if (a.intersectCubeCube(b.self)) {

							/* For debugging purposes */
							//console.log('Passed Box on Box collision test.');

							/* Processes collision */
							a.collision(b.self);

							/* Informs that we collide (only allows for one collision ...) */
							return true;
						}
					}

					/* SPHERE/BOX AXIS ALIGNED COLLISION BOX */
					else if ( a.size.length == 1 && b.self.size.length == 3 ||
							  a.size.length == 3 && b.self.size.length == 1) {
					
						if (a.intersectCubeSphere(b.self)) {

							/* For debugging purposes */
							//console.log('Passed Sphere on Box collision test.');

							/* Processes collision */
							a.collision(b.self);

							/* Informs that we collide (only allows for one collision ...) */
							return true;
						}
					}

				}

				/* PLANES COLLISION BOX */
				else if (b.self.size.length == 2) {
					if (a.intersectObjectPlane(b.self)) {

						/* For debugging purposes */
						//console.log('Passed Object on Plane collision test.');

						/* Processes collision */
						a.fallOffTable();

						/* Informs that we collide (only allows for one collision ...) */
						return true;

					}
				}

			}

		});

		/* We didn't collide if we get this far */
		return false;

	}

	/* Intersect Sphere with another Sphere */
	intersectSphereSphere(b) {

		/* Stores the object for later reference */
		var a = this;

		/* Properties */
		let a_radius, a_cx, a_cy, a_cz,
			b_radius, b_cx, b_cy, b_cz;

		/* Get attributes or force it to be a sphere if needed */
		if (a.size.length == 1) {
			a_radius = a.size[0];
			a_cx = a.nextX; a_cy = a.nextY; a_cz = a.nextZ;

		} else if (a.size.length == 3) {
			a_radius = Math.max(a.size[0], a.size[1], a.size[2]);
			a_cx = a.nextX; a_cy = a.nextY; a_cz = a.nextZ;
		}

		/* Get attributes or force it to be a sphere if needed */
		if (b.size.length == 1) {
			b_radius = b.size[0];
			b_cx = b.object.position.x; b_cy = b.object.position.y; b_cz = b.object.position.z;

		} else if (b.size.length == 3) {
			b_radius = Math.max(b.size[0], b.size[1], b.size[2]);
			b_cx = b.object.position.x; b_cy = b.object.position.y; b_cz = b.object.position.z;
		}

		/* MATH EXPLANATION */
		/* Pitagoras theorem applied to all three axis */

		/* (ra + rb)^2 => (cax - cbx)^2 + (cax - cbx)^2 */
		let square = (a_radius + b_radius) * (a_radius + b_radius);
		let square_sum = (a_cx - b_cx) * (a_cx - b_cx) + (a_cx - b_cx) * (a_cx - b_cx);
		let test_x = (square == square_sum || square > square_sum);

		/* (ra + rb)^2 => (cay - cby)^2 + (cay - cby)^2 */
		square_sum = (a_cy - b_cy) * (a_cy - b_cy) + (a_cy - b_cy) * (a_cy - b_cy);
		let test_y = (square == square_sum || square > square_sum);

		/* (ra + rb)^2 => (caz - cbz)^2 + (caz - cbz)^2 */
		square_sum = (a_cz - b_cz) * (a_cz - b_cz) + (a_cz - b_cz) * (a_cz - b_cz);
		let test_z = (square == square_sum || square > square_sum);

		return (test_x && test_y && test_z);
	}

	/* Intersect Cube with another Sphere */
	intersectCubeSphere(b) {

		/* Stores the object for later reference */
		if ( b.size.length == 3 ) { var a = b; b = this; }
		else { var a = this; }
		
		/* Cube Properties */
		let a_width = a.size[0] / 2,
			a_length = a.size[1] / 2,
			a_height = a.size[2] / 2;

		let a_max_x = a.nextX + a_width,
			a_max_y = a.nextY + a_height,
			a_max_z = a.nextZ + a_length;

		let a_min_x = a.nextX - a_width,
			a_min_y = a.nextY - a_height,
			a_min_z = a.nextZ - a_length;

		/* Sphere Properties */
		/* Width here it's actually the radius of the sphere */

		let b_width = b.size[0];

		let b_max_x = b.object.position.x + b_width,
			b_max_y = b.object.position.y + b_width,
			b_max_z = b.object.position.z + b_width;

		let b_min_x = b.object.position.x - b_width,
			b_min_y = b.object.position.y - b_width,
			b_min_z = b.object.position.z - b_width;

		/* MATH EXPLANATION */
		/* Bounding box extreme points comparison */
		/* Adapated from cube to cube to fit comparison between sphere and cube */

		let test_x = (a_max_x > b_min_x && a_min_x < b_max_x);
		let test_y = (a_max_y > b_min_y && a_min_y < b_max_y);
		let test_z = (a_max_z > b_min_z && a_min_z < b_max_z);

		return (test_x && test_y && test_z);
	}

	/* Intersect Cube with another Cube */
	intersectCubeCube(b) {

		/* Stores the object for later reference */
		var a = this;

		/* Cube Properties */
		let a_width = a.size[0] / 2,
			a_length = a.size[1] / 2,
			a_height = a.size[2] / 2;

		let a_max_x = a.nextX + a_width,
			a_max_y = a.nextY + a_height,
			a_max_z = a.nextZ + a_length;

		let a_min_x = a.nextX - a_width,
			a_min_y = a.nextY - a_height,
			a_min_z = a.nextZ - a_length;

		/* Cube Properties */
		let b_width = b.size[0] / 2,
			b_length = b.size[1] / 2,
			b_height = b.size[2] / 2;

		let b_max_x = b.object.position.x + b_width,
			b_max_y = b.object.position.y + b_height,
			b_max_z = b.object.position.z + b_length;

		let b_min_x = b.object.position.x - b_width,
			b_min_y = b.object.position.y - b_height,
			b_min_z = b.object.position.z - b_length;

		/* MATH EXPLANATION */
		/* Bounding box extreme points comparison */

		let test_x = (a_max_x > b_min_x && a_min_x < b_max_x);
		let test_y = (a_max_y > b_min_y && a_min_y < b_max_y);
		let test_z = (a_max_z > b_min_z && a_min_z < b_max_z);

		return (test_x && test_y && test_z);
	}

	/* Intersect Object with a Plane */
	intersectObjectPlane(b) {

		/* Current pos */
		let x = this.nextX,
			z = this.nextZ;

		/* Checks x, y and z */
		let test_x = (x < b.size[0]/2 && x > -b.size[0]/2),
			test_z = (z < b.size[0]/2 && z > -b.size[0]/2);

		return (!(test_x && test_z));
	}	

}