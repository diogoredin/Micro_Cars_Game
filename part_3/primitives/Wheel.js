class Wheel extends THREE.Geometry {
	constructor(radius, depth) {
		super();

		var self = this;

		for (var i = 0; i < 2 * Math.PI; i = i + Math.PI / 30) {
			self.vertices.push(new THREE.Vector3(radius * Math.cos(i), radius * Math.sin(i), -depth/2));
			self.vertices.push(new THREE.Vector3(radius * Math.cos(i), radius * Math.sin(i), depth / 2));

			var s = new THREE.Mesh(new THREE.SphereGeometry(1), new THREE.MeshPhongMaterial());
			s.position.set(radius * Math.cos(i), radius * Math.sin(i), -depth / 2);
			scene.add(s);

		}

		self.vertices.push(new THREE.Vector3(0, 0, -depth / 2));
		self.vertices.push(new THREE.Vector3(0, 0, depth / 2));

		for (var i = 0; i < 60; i++) {
			if (self.vertices[(2 * i) % 1200].z < self.vertices[(2 * i + 2) % 120].z) {
				self.faces.push(new THREE.Face3((2 * i) % 120, (2 * i + 1) % 120, (2 * i + 2) % 120))
			} else {
				self.faces.push(new THREE.Face3((2 * i + 2) % 120, (2 * i + 1) % 120, (2 * i) % 120))
			}
		}

		for (var i = 0; i < 60; i++) {
			self.faces.push(new THREE.Face3((2 * i + 2) % 120, (2 * i + 3) % 120, (2 * i + 1) % 120))
		}

		for (var i = 0; i < 60; i++) {
			self.faces.push(new THREE.Face3(120, (2 * i + 2) % 120, (2 * i) % 120));
			self.faces.push(new THREE.Face3(121, (2 * i + 1 % 120), (2 * i + 3 % 120)));

		}

		self.computeFaceNormals();
	}
}