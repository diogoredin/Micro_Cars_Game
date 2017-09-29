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

    addRoad(table, 0, 1, 0);

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

        addMargin(1);
        addMargin(1.5);

        function addMargin(road_size) {

            var closedSpline = new THREE.CatmullRomCurve3([
                new THREE.Vector3(scaleRoad(-60), 0, scaleRoad(-100)),
                new THREE.Vector3(scaleRoad(-60), 0, scaleRoad(20)),
                new THREE.Vector3(scaleRoad(-60), 0, scaleRoad(120)),
                new THREE.Vector3(scaleRoad(60), 0, scaleRoad(20)),
                new THREE.Vector3(scaleRoad(60), 0, scaleRoad(-100))
            ]);

            closedSpline.type = 'catmullrom';
            closedSpline.closed = true;

            var geometry = new THREE.Geometry();
            geometry.vertices = closedSpline.getPoints(50);

            var material = new THREE.LineBasicMaterial({ color: '#000000', linewidth: 20 });
            var road = new THREE.Line(geometry, material);
            road.position.set(pos_x, pos_y, pos_z);

            obj.add(road);

            function scaleRoad(coordinate) {
                return Math.floor(coordinate / road_size);
            }

        }

        function addCheerios() {
        }
    }

}