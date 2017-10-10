function createTable(x, y, z) {

    var texture = new THREE.TextureLoader().load('./img/wood.png');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(4, 4);

    var width = 600,
        height = 200;

    var table = new THREE.Object3D(),
        tableMaterial = new THREE.MeshPhongMaterial({ map: texture, specular: 0x555555, shininess: 10, wireframe: false });

    addTableTop(table, 0, 0, 0);
    addTableLeg(table, -(width / 2) + 3, -(height / 4) + 3, -(width / 2) + 3);
    addTableLeg(table, (width / 2) - 3, -(height / 4) + 3, -(width / 2) + 3);
    addTableLeg(table, -(width / 2) + 3, -(height / 4) + 3, (width / 2) - 3);
    addTableLeg(table, (width / 2) - 3, -(height / 4) + 3, (width / 2) - 3);

    addRoad(table, 0, 1.5, 0);

    scene.add(table);
    table.position.set(x, y, z);

    function addTableTop(obj, pos_x, pos_y, pos_z) {

        var tableTopGeometry = new THREE.CubeGeometry(width, 2, width);
        var tableTopMesh = new THREE.Mesh(tableTopGeometry, tableMaterial);
        tableTopMesh.position.set(pos_x, pos_y, pos_z);

        obj.add(tableTopMesh);
    }

    function addTableLeg(obj, pos_x, pos_y, pos_z) {

        var tableLegGeometry = new THREE.CubeGeometry(3, 100, 3);
        var tableLegMesh = new THREE.Mesh(tableLegGeometry, tableMaterial);
        tableLegMesh.position.set(pos_x, pos_y-3, pos_z);

        obj.add(tableLegMesh);
    }

    function addRoad(obj, pos_x, pos_y, pos_z) {

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

        addCheerios(obj, closedSpline, 1);
        addCheerios(obj, closedSpline, -1);

        var sqLength = 30,
            sqHeight = 0.1,
            squareShape = new THREE.Shape();

        squareShape.moveTo(0, -sqLength/2);
        squareShape.lineTo(0, 0);
        squareShape.lineTo(0, sqLength / 2);
        squareShape.lineTo(sqHeight, sqLength/2);
        squareShape.lineTo(sqHeight, 0);
        squareShape.lineTo(sqHeight, -sqLength/2);
        squareShape.lineTo(0, -sqLength/2);

        var extrudeSettings = {
            steps: 200,
            bevelEnabled: false,
            extrudePath: closedSpline
        };

        var texture = new THREE.TextureLoader().load('./img/road.png');
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(0.3, 0.3);

        var roadGeometry = new THREE.ExtrudeGeometry(squareShape, extrudeSettings);
        var roadMaterial = new THREE.MeshPhongMaterial({ map: texture, specular: 0x555555, shininess: 10, wireframe: false });
        var road = new THREE.Mesh(roadGeometry, roadMaterial);

        road.position.set(pos_x, pos_y, pos_z);
        obj.add(road);
    }

    function addCheerios(obj, closedSpline, normalY) {

        var texture = new THREE.TextureLoader().load('./img/cheerio.png');
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(4, 4);

        var cheerios = new THREE.Object3D(),
            prev = new THREE.Vector3();

        for (i = 0; i < 1; i += 1 / 150) {

            var pos = closedSpline.getPoint(i),
                tan = closedSpline.getTangent(i);

            var normal = new THREE.Vector3(0, normalY, 0),
                aux = new THREE.Vector3().crossVectors(normal, tan);

            aux.multiplyScalar(1 + 15 / aux.length());

            var current = new THREE.Vector3(pos.x + aux.x, 2, pos.z + aux.z);

            if (prev.distanceTo(current) > 20) {
    
                var geometry = new THREE.TorusGeometry(3, 1, 8, 30),
                    material = new THREE.MeshPhongMaterial({ map: texture, specular: 0x555555, shininess: 10, wireframe: false });
                    torus = new THREE.Mesh(geometry, material);

                torus.position.set(pos.x + aux.x, 2, pos.z + aux.z);
                torus.rotation.x = 1 / 2 * Math.PI;

                cheerios.add(torus);
                prev = current;
            }
        }

        obj.add(cheerios);
    }

}