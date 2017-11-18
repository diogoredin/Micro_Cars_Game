class Table extends StaticObject {

    constructor(initialPosition) {

        super(initialPosition);

        /* Table Properties */
        this.width = 650;
        this.height = 100;

        /* Collision box definitions */
        this.size = [this.width, this.width];

        /* Material */
        var texture = new THREE.TextureLoader().load('./tiles/wood.png');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 5);
        this.tableMaterial = new THREE.MeshPhongMaterial({ map: texture, wireframe: false });

        /* Models the butter in 3d */
        this._buildTable();

        /* Saves reference to itself */
        this.object.self = this;

        /* Adds object to the scene */
        scene.add(this.object);

    }

    _buildTable() {

        var table = new THREE.Object3D();

        this.addTowel(table, 0, 5.5, 0);
        this.addTop(table, 0, 0, 0);

        this.addLeg(table, -(this.width / 2) + 10, -this.height / 2, -(this.width / 2) + 10);
        this.addLeg(table, (this.width / 2) - 10, -this.height / 2, -(this.width / 2) + 10);
        this.addLeg(table, -(this.width / 2) + 10, -this.height / 2, (this.width / 2) - 10);
        this.addLeg(table, (this.width / 2) - 10, -this.height / 2, (this.width / 2) - 10);

        this.addRoad(table, 0, 5.7, 0);

        this.object.add(table);
    }

    addTop(obj, pos_x, pos_y, pos_z) {

        var tableTopGeometry = new THREE.CubeGeometry(this.width, 10, this.width);
        var tableTopMesh = new THREE.Mesh(tableTopGeometry, this.tableMaterial);
        tableTopMesh.position.set(pos_x, pos_y, pos_z);

        obj.add(tableTopMesh);
    }

    /* Adds a towel to the table at a relative position to the table */
    addTowel(obj, pos_x, pos_y, pos_z) {

        /* Properties of the towel */
        var bordersRelation = 4.85,
            topRelation = 1.85,
            relativeHeight = 0,
            towelHeight = 80,
            offset = 0.1;

        /* Material */
        var towelTexture = new THREE.TextureLoader().load('./tiles/towel.png');
        towelTexture.wrapS = THREE.RepeatWrapping;
        towelTexture.wrapT = THREE.RepeatWrapping;
        towelTexture.repeat.set(150, 150);

        /* Creates the top of the towel */
        var towelGeometry = new THREE.CircleGeometry( this.width / topRelation, 8 ), 
            towelMaterial = new THREE.MeshPhongMaterial({ color: '#FFFFFF', map: towelTexture, wireframe: false, side: THREE.DoubleSide }), 
            towel = new THREE.Mesh(towelGeometry, towelMaterial);

        towel.rotation.z = 1 / 8 * Math.PI;
        towel.rotation.x = 1 / 2 * Math.PI;
        towel.position.set(pos_x, pos_y + relativeHeight, pos_z);

        /* Creates a triangle to be used for the borders of the towel */
        var borderGeometry = new THREE.Geometry(),
            v1 = new THREE.Vector3( -this.width / bordersRelation, 0, 0),
            v2 = new THREE.Vector3( this.width / bordersRelation, 0, 0),
            v3 = new THREE.Vector3(0, -towelHeight, 0);

        borderGeometry.vertices.push(v1);
        borderGeometry.vertices.push(v2);
        borderGeometry.vertices.push(v3);

        borderGeometry.faces.push( new THREE.Face3( 0, 1, 2 ) );
        borderGeometry.computeFaceNormals();

        /* Creates and positions borders based on their positions */
        var borderTop = new THREE.Mesh(borderGeometry, towelMaterial);
        borderTop.position.set(pos_x, pos_y + relativeHeight, pos_z + (this.width / 2) + offset );

        var borderBottom = new THREE.Mesh(borderGeometry, towelMaterial);
        borderBottom.position.set(pos_x, pos_y + relativeHeight, pos_z - (this.width / 2) - offset );

        var borderLeft = new THREE.Mesh(borderGeometry, towelMaterial);
        borderLeft.position.set(pos_x - (this.width / 2) - offset, pos_y + relativeHeight, pos_z );
        borderLeft.rotation.y = 1 / 2 * Math.PI;

        var borderRight = new THREE.Mesh(borderGeometry, towelMaterial);
        borderRight.position.set(pos_x + (this.width / 2) + offset, pos_y + relativeHeight, pos_z );
        borderRight.rotation.y = 1 / 2 * Math.PI;

        /* Adds towel components to the table */
        //obj.add(borderTop);
        //obj.add(borderBottom);
        //obj.add(borderLeft);
        //obj.add(borderRight);
        obj.add(towel);
    }

    addLeg(obj, pos_x, pos_y, pos_z) {

        var tableLegGeometry = new THREE.CubeGeometry(10, 100, 10);
        var tableLegMesh = new THREE.Mesh(tableLegGeometry, this.tableMaterial);
        tableLegMesh.position.set(pos_x, pos_y, pos_z);

        obj.add(tableLegMesh);
    }

    addRoad(obj, pos_x, pos_y, pos_z) {

        var closedSpline = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(-100, 0, 0),
            new THREE.Vector3(-130, 0, -80),
            new THREE.Vector3(0, 0, -80),
            new THREE.Vector3(20, 0, -150),
            new THREE.Vector3(-240, 0, -260),
            new THREE.Vector3(-240, 0, 0),
            new THREE.Vector3(-180, 0, 60),
            new THREE.Vector3(-180, 0, 100),
            new THREE.Vector3(-240, 0, 140),
            new THREE.Vector3(-240, 0, 250),
            new THREE.Vector3(240, 0, 230),
            new THREE.Vector3(240, 0, -200),
            new THREE.Vector3(130, 0, -260),
            new THREE.Vector3(130, 0, -100),
            new THREE.Vector3(200, 0, 0),
            new THREE.Vector3(200, 0, 150),
            new THREE.Vector3(0, 0, 170)
        ]);

        closedSpline.type = 'catmullrom';
        closedSpline.closed = true;

        var geometry = new THREE.Geometry();

        this.addCheerios(obj, closedSpline, 1, pos_y + 0.4);
        this.addCheerios(obj, closedSpline, -1, pos_y + 0.4);

        var sqLength = 40,
            sqHeight = 0.1,
            squareShape = new THREE.Shape();

        squareShape.moveTo(0, -sqLength / 2);
        squareShape.lineTo(0, 0);
        squareShape.lineTo(0, sqLength / 2);
        squareShape.lineTo(sqHeight, sqLength / 2);
        squareShape.lineTo(sqHeight, 0);
        squareShape.lineTo(sqHeight, -sqLength / 2);
        squareShape.lineTo(0, -sqLength / 2);

        var extrudeSettings = {
            steps: 400,
            bevelEnabled: false,
            extrudePath: closedSpline
        };

        var texture = new THREE.TextureLoader().load('./tiles/road.png');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(0.3, 0.3);

        var roadGeometry = new THREE.ExtrudeGeometry(squareShape, extrudeSettings);
        var roadMaterial = new THREE.MeshPhongMaterial({ map: texture, wireframe: false });
        var road = new THREE.Mesh(roadGeometry, roadMaterial);

        road.position.set(pos_x, pos_y, pos_z);
        obj.add(road);
    }

    addCheerios(obj, closedSpline, normalY, pos_y) {

        var newcheerios = new THREE.Object3D(),
            prev = new THREE.Vector3();

        for (var i = 0; i < 1; i += 1 / 150) {

            var pos = closedSpline.getPoint(i),
                tan = closedSpline.getTangent(i);

            var normal = new THREE.Vector3(0, normalY, 0),
                aux = new THREE.Vector3().crossVectors(normal, tan);

            aux.multiplyScalar(1 + 20 / aux.length());

            var current = new THREE.Vector3(pos.x + aux.x, 2, pos.z + aux.z);
            if (prev.distanceTo(current) > 20) {

                let position = new THREE.Vector3(pos.x + aux.x, pos_y + 0.5, pos.z + aux.z),
                    cheerio = new Cheerio(position, 0, new THREE.Vector3(1, 0, 0), 6);

                newcheerios.add(cheerio.object);
                prev = current;

            }
        }

        obj.add(newcheerios);
    }

}