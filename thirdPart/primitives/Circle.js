class Circle extends Shape {
	
	constructor(radius, segments) {

		super();

		/* Circle */
		this.object = new THREE.Object3D();

		/* Circle Properties */
		this.radius = radius;
		this.segments = segments;

		/* Builds and adds to scene */
		this._build();
		scene.add(this.object);
	}

	/* Circle */
	_build() {
		
		/* Number of segments is the number of triangles that compose the circle */
		var angle = 0;

		/* Builds a triangle / segment */
		for (var i = 0; i <= this.segments; i++) {

			/* Calculates angle to position triangle */
			angle = angle + 2 * Math.PI / this.segments;

			/* Adds segment with a set angle */
			this.addTriangle(angle);

		}

	}

	/* Builds Triangles that compose the circle */
	addTriangle(angle) {

		/* Number of segments is the number of triangles that compose the circle */
		var perimeter = 2 * Math.PI * this.radius,
			triangleBase = 1/2 * ( perimeter / this.segments ),
			triangleHeight = this.radius;

		/* Geometry and Material */
		var geom = new THREE.Geometry(),
			mat = new THREE.MeshPhongMaterial({ color: '#fff', wireframe: false });

		/* Allows being seen from two sides */
		mat.side = THREE.DoubleSide;
			
		/* Vertices of the triangle - Bottom is draw first */
		var v1 = new THREE.Vector3(-triangleBase,triangleHeight,0),
			v2 = new THREE.Vector3(triangleBase,triangleHeight,0),
			v3 = new THREE.Vector3(0,0,0);

		geom.vertices.push(v1);
		geom.vertices.push(v2);
		geom.vertices.push(v3);

		/* Computes normal of the triangle */
		geom.faces.push( new THREE.Face3( 0, 1, 2 ) );
		geom.computeFaceNormals();

		/* Creates Mesh */
		var mesh = new THREE.Mesh( geom, mat );

		/* Rotates it so it is 'flat' */
		mesh.rotation.y = 1/2 * Math.PI;

		/* Applies the approriate angle */	
		mesh.rotation.x = angle;

		/* Positions it where we can see it */
		mesh.position.set(20, 40, 20);
		this.object.add(mesh);
	}

}