class BoundingSphere {

	constructor(radius, center, object) {
		this.radius = radius;
		this.volume = new THREE.Mesh(new THREE.SphereGeometry(radius, 3, 3), new THREE.BasicMaterial({wireframe: true}));
		this.volume.position.set(center);
		this.object = object;
	}

	// Consider bounds of a squared map centered at (0, someY, 0)
	checkOutOfBounds(sideSize) {
		return (this.volume.position.x > sideSize / 2 || this.volume.position.x < -sideSize / 2 ||
			this.volume.position.z > sideSize / 2 || this.volume.position.z < -sideSize / 2)
	}

	hasColision(otherSphere) {
		var distance = this.volume.position.clone().sub(otherSphere.volume.position).lenght();
		var radiiSum = this.radius + otherSphere.radius;

		return distance <= radiiSum;
	}

	findApproxIntersection(otherSphere) {
		var auxThisPos = this.volume.position.clone();
		var auxOtherPos = other.volume.position.clone();
		var radiiSum = this.radius + otherSphere.radius;

		var timeIntervals = 10;

		for (i = 0; i < timeIntervals; i++) {
			auxThisPos.addScaledVector(this.object.directionOfMovement, this.object.velocity / timeIntervals);
			auxOtherPos.addScaledVector(otherSphere.object.directionOfMovement, otherSphere.object.velocity / timeIntervals);
			var distance = auxThisPos.clone().sub(auxOtherPos).lenght();
			if (distance <= radiiSum) {
				return {thisCollPos: auxThisPos, otherCollPos: auxOtherPos};
			}
		}
	}
}