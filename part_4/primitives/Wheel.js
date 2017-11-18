class Wheel extends THREE.Geometry {
	constructor(radius, depth) {
		super();

		var self = this;

		var numberOfSegments = 10;

		for (var i = 0; i < 2 * Math.PI; i = i + Math.PI / numberOfSegments) {
			self.vertices.push(new THREE.Vector3(radius * Math.cos(i), radius * Math.sin(i), -depth/2));
			self.vertices.push(new THREE.Vector3(radius * Math.cos(i), radius * Math.sin(i), depth / 2));
		}

		self.vertices.push(new THREE.Vector3(0, 0, -depth / 2));
		self.vertices.push(new THREE.Vector3(0, 0, depth / 2));

		for (var i = 0; i < numberOfSegments * 2; i++) {
			if (self.vertices[(2 * i) % (numberOfSegments * 4)].z < self.vertices[(2 * i + 2) % (numberOfSegments * 4)].z) {
				self.faces.push(new THREE.Face3((2 * i) % (numberOfSegments * 4), (2 * i + 1) % (numberOfSegments * 4), (2 * i + 2) % (numberOfSegments * 4)))
			} else {
				self.faces.push(new THREE.Face3((2 * i + 2) % (numberOfSegments * 4), (2 * i + 1) % (numberOfSegments * 4), (2 * i) % (numberOfSegments * 4)))
			}
		}

		for (var i = 0; i < numberOfSegments * 2; i++) {
			self.faces.push(new THREE.Face3((2 * i + 2) % (numberOfSegments * 4), (2 * i + 3) % (numberOfSegments * 4), (2 * i + 1) % (numberOfSegments * 4)))
		}

		for (var i = 0; i < numberOfSegments * 2; i++) {
			self.faces.push(new THREE.Face3((numberOfSegments * 4), (2 * i + 2) % (numberOfSegments * 4), (2 * i) % (numberOfSegments * 4)));
			self.faces.push(new THREE.Face3(1 + numberOfSegments * 4, (2 * i + 1 % (numberOfSegments * 4)), (2 * i + 3 % (numberOfSegments * 4))));

		}

		self.computeFaceNormals();
	}
}