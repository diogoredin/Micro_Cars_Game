class Table extends StaticObject {

    constructor(initialPosition) {

        super(initialPosition);
    
        var texture = new THREE.TextureLoader().load('./tiles/wood.png');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 5);

        var width = 650,
            height = 100;

        var table = new THREE.Object3D(),
            tableMaterial = new THREE.MeshPhongMaterial({ map: texture, specular: 0x555555, shininess: 10, wireframe: false });

        addTableTop(table, 0, 0, 0);
        addTableLeg(table, -(width / 2) + 10, -height / 2, -(width / 2) + 10);
        addTableLeg(table, (width / 2) - 10, -height / 2, -(width / 2) + 10);
        addTableLeg(table, -(width / 2) + 10, -height / 2, (width / 2) - 10);
        addTableLeg(table, (width / 2) - 10, -height / 2, (width / 2) - 10);

        addRoad(table, 0, 5.5, 0);
        this.object.add(table);
        scene.add(this.object);

        function addTableTop(obj, pos_x, pos_y, pos_z) {

            var tableTopGeometry = new THREE.CubeGeometry(width, 10, width);
            var tableTopMesh = new THREE.Mesh(tableTopGeometry, tableMaterial);
            tableTopMesh.position.set(pos_x, pos_y, pos_z);

            obj.add(tableTopMesh);
        }

        function addTableLeg(obj, pos_x, pos_y, pos_z) {

            var tableLegGeometry = new THREE.CubeGeometry(10, 100, 10);
            var tableLegMesh = new THREE.Mesh(tableLegGeometry, tableMaterial);
            tableLegMesh.position.set(pos_x, pos_y, pos_z);

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

            addCheerios(obj, closedSpline, 1, pos_y);
            addCheerios(obj, closedSpline, -1, pos_y);

            var sqLength = 30,
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
            var roadMaterial = new THREE.MeshPhongMaterial({ map: texture, specular: 0x555555, shininess: 10, wireframe: false });
            var road = new THREE.Mesh(roadGeometry, roadMaterial);

            road.position.set(pos_x, pos_y, pos_z);
            obj.add(road);
        }

        function addCheerios(obj, closedSpline, normalY, pos_y) {

            var newcheerios = new THREE.Object3D(),
                prev = new THREE.Vector3();

            for (var i = 0; i < 1; i += 1 / 150) {

                var pos = closedSpline.getPoint(i),
                    tan = closedSpline.getTangent(i);

                var normal = new THREE.Vector3(0, normalY, 0),
                    aux = new THREE.Vector3().crossVectors(normal, tan);

                aux.multiplyScalar(1 + 15 / aux.length());

                var current = new THREE.Vector3(pos.x + aux.x, 2, pos.z + aux.z);
                if (prev.distanceTo(current) > 20) {
                    
                    let position = new THREE.Vector3(pos.x + aux.x, pos_y + 0.5, pos.z + aux.z),
                        cheerio = new Cheerio(position, 0, new THREE.Vector3(1, 0, 0), 3);
                    
                    newcheerios.add(cheerio.object);
                    prev = current;

                }
            }

            obj.add(newcheerios);
        }
    
    }    

}