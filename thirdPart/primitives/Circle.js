class Circle extends Shape {
	
	constructor(radius, segments) {

		super();

		this.object = new THREE.Object3D();

		this.radius = radius;
		this.segments = segments;

		this._build();
		scene.add(this.object);
	}

	_build() {
		
		/* Number of segments is the number of triangles that compose the circle */
		var perimeter = 2 * Math.PI * this.radius,
			triangleBase = Math.ceil( perimeter / this.segments );

		/* Builds a triangle / segment */
		for ( var i = 0; i <= this.segments; i++) {

			/* Calculates angle to position triangle */
			let angle = Math.PI / i;

			/* Adds segment with a set angle */
			this.addTriangle(angle);

			/* We added a new one so we can decrease so our angle calculations end up right */
			perimeter = perimeter - triangleBase;

		}

	}

	addTriangle(angle) {

		/* Number of segments is the number of triangles that compose the circle */
		var perimeter = 2 * Math.PI * this.radius;
		var triangleBase = Math.ceil( perimeter / this.segments );
		var triangleHeight = this.radius;

		var geom = new THREE.Geometry();
		var mat = new THREE.MeshBasicMaterial({ color: '#fff', wireframe: true });

		var v1 = new THREE.Vector3(0,0,0);
		var v2 = new THREE.Vector3(triangleBase,0,0);
		var v3 = new THREE.Vector3(triangleBase,triangleHeight,0);

		geom.vertices.push(v1);
		geom.vertices.push(v2);
		geom.vertices.push(v3);

		geom.faces.push( new THREE.Face3( 0, 1, 2 ) );
		geom.computeFaceNormals();
		
		var mesh = new THREE.Mesh( geom, mat );

		/* Applies the approriate angle */
		//mesh.rotation.y = angle;

		this.object.add(mesh);
	}

}