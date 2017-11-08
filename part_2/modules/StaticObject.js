class StaticObject {

	constructor(position) {
		if (!position instanceof THREE.Vector3) {
			console.error('Parameter position is not a THREE.Vector3');
			return undefined;
		}

		/* Object properties */
		this.object = new THREE.Object3D();
		this.object.position.set(0, 0, 0);
		this.object.position.add(position);

		/* Bounding Box Properties */
		this.nextX = this.object.position.x;
		this.nextY = this.object.position.y;
		this.nextZ = this.object.position.z;
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

	addObject(object) {
		this.object.add(object);
	}

}