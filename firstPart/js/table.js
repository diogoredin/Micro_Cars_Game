function createTable(x, y, z) {

    var texture = new THREE.TextureLoader().load('./img/wood.png');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(4, 4);

    var width = 400,
        height = 200;

    var table = new THREE.Object3D(),
        tableMaterial = new THREE.MeshPhongMaterial({ map: texture, specular: 0x555555, shininess: 10 });
    
    addTableTop(table, 0, 0, 0);
    addTableLeg(table, -(height / 2) + 3, -(height / 4) + 3, -(width / 2) + 3);
    addTableLeg(table, (height / 2) - 3, -(height / 4) + 3, -(width / 2) + 3);
    addTableLeg(table, -(height / 2) + 3, -(height / 4) + 3, (width / 2) - 3);
    addTableLeg(table, (height / 2) - 3, -(height / 4) + 3, (width / 2) - 3);

    addRoad(table, 0, 1.5, 0);

    scene.add(table);
    table.position.set(x, y, z);

    function addTableTop(obj, pos_x, pos_y, pos_z) {

        var tableTopGeometry = new THREE.CubeGeometry(height, 2, width);
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
            new THREE.Vector3(-60, 0, -100),
            new THREE.Vector3(-60, 0, 20),
            new THREE.Vector3(-60, 0, 120),
            new THREE.Vector3(60, 0, 20),
            new THREE.Vector3(60, 0, -100)
        ]);

        closedSpline.type = 'catmullrom';
        closedSpline.closed = true;

        var extrudeSettings = {
            steps: 200,
            bevelEnabled: false,
            extrudePath: closedSpline
        };

        var squareShape = new THREE.Shape();

        var sqLength = 20;
        var sqHeight = 0.1;

        squareShape.moveTo(0, 0);
        squareShape.lineTo(0, sqLength);
        squareShape.lineTo(sqHeight, sqLength);
        squareShape.lineTo(sqHeight, 0);
        squareShape.lineTo(0, 0);

        var roadGeometry = new THREE.ExtrudeGeometry(squareShape, extrudeSettings);
        var roadMaterial = new THREE.MeshBasicMaterial({ color: '#444444', wireframe: false });
        var road = new THREE.Mesh(roadGeometry, roadMaterial);

        road.position.set(pos_x, pos_y, pos_z);
        obj.add(road);
    }

}