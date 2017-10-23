class StaticObject {

	constructor(position) {
		if (!position instanceof THREE.Vector3) {
			console.error('Parameter position is not a THREE.Vector3');
			return undefined;
		}

		this.object = new THREE.Object3D();
		this.object.position.set(0, 0, 0);
		this.object.position.add(position);
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