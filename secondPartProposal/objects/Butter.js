class Butter extends StaticObject {

    constructor(initialPosition) {

        super(initialPosition);

        this.size = 40;

        this._buildButter();
        scene.add(this.object);
    }

    _buildButter() {
        var texture = new THREE.TextureLoader().load('./tiles/butter.png'),
            butter = new THREE.Object3D();

        var base = 40,
            length = 20,
            height = 20,
            border = 6;

        var geometry = new THREE.CubeGeometry(base, height, length),
            butterBodyMaterial = new THREE.MeshPhongMaterial({ map: texture, color: '#FFFFFF', shininess: 10, wireframe: false }),
            butterBody = new THREE.Mesh(geometry, butterBodyMaterial);

        butterBody.position.set(base / 2, height / 2, length / 2);
        butter.add(butterBody);

        addBorder(height, border, length, null, base);
        addBorder(height, border, length, Math.PI, -base);
        addTop(height, length, base + border * 2, border);

        function addBorder(height, border, length, rotation, relative_pos) {

            var shape = new THREE.Shape();
            shape.moveTo(0, 0);
            shape.lineTo(0, height);
            shape.lineTo(border, height);

            var extrudeSettings = {
                steps: 2,
                amount: length,
                bevelEnabled: false,
                bevelThickness: 0,
                bevelSize: 0,
                bevelSegments: 0
            };

            var geometry = new THREE.ExtrudeBufferGeometry(shape, extrudeSettings),
                material = new THREE.MeshPhongMaterial({ color: '#EEEEEE', shininess: 10, wireframe: false }),
                butterBorder = new THREE.Mesh(geometry, material);

            if (rotation != null) {
                butterBorder.position.set(0, 0, -relative_pos / 2);
                butterBorder.rotation.y = rotation;
            } else {
                butterBorder.position.set(relative_pos, 0, 0);
            }

            butter.add(butterBorder);
        }

        function addTop(height, length, base, border) {

            var materials = [new THREE.MeshPhongMaterial({ color: '#EEEEEE', shininess: 10, wireframe: false }),
            new THREE.MeshPhongMaterial({ color: '#EEEEEE', shininess: 10, wireframe: false }),
            new THREE.MeshPhongMaterial({ color: '#EEEEEE', map: texture, shininess: 10, wireframe: false }),
            new THREE.MeshPhongMaterial({ color: '#EEEEEE', shininess: 10, wireframe: false }),
            new THREE.MeshPhongMaterial({ color: '#EEEEEE', shininess: 10, wireframe: false }),
            new THREE.MeshPhongMaterial({ color: '#EEEEEE', shininess: 10, wireframe: false })];
    
            var butterTopGeometry = new THREE.CubeGeometry(base, 2, length),
                butterTop = new THREE.Mesh(butterTopGeometry, materials);
        
            butterTop.position.set((base / 2) - border, height + 1, length / 2);
            butter.add(butterTop);
        }

        this.object.add(butter);
    }

}