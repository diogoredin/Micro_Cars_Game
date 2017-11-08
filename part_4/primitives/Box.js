class Box extends THREE.Geometry {
	constructor(X, Y, Z) {
		super();

		var self = this;

		var vArray = [
			new THREE.Vector3(-X / 2, -Y / 2, -Z / 2),
			new THREE.Vector3(-X / 2, -Y / 2, Z / 2),
			new THREE.Vector3(-X / 2, Y / 2, -Z / 2),
			new THREE.Vector3(-X / 2, Y / 2, Z / 2),
			new THREE.Vector3(X / 2, -Y / 2, -Z / 2),
			new THREE.Vector3(X / 2, -Y / 2, Z / 2),
			new THREE.Vector3(X / 2, Y / 2, -Z / 2),
			new THREE.Vector3(X / 2, Y / 2, Z / 2)
		];

		vArray.forEach(function (vertix) {
			self.vertices.push(vertix);
		});

		self.faces.push(new THREE.Face3(0, 1, 2));
		self.faces.push(new THREE.Face3(1, 3, 2));
		self.faces.push(new THREE.Face3(6, 5, 4));
		self.faces.push(new THREE.Face3(6, 7, 5));

		self.faces.push(new THREE.Face3(2, 4, 0));
		self.faces.push(new THREE.Face3(6, 4, 2));
		self.faces.push(new THREE.Face3(1, 5, 3));
		self.faces.push(new THREE.Face3(3, 5, 7));

		self.faces.push(new THREE.Face3(4, 1, 0));
		self.faces.push(new THREE.Face3(1, 4, 5));
		self.faces.push(new THREE.Face3(2, 3, 6));
		self.faces.push(new THREE.Face3(7, 6, 3));

		self.computeFaceNormals();
	}
}