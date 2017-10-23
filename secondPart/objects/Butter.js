class Butter extends StaticObject {

    constructor(initialPosition) {

        /* Invokes constructor of parent class */
        super(initialPosition);

        /* Butter Sizes */
        this.base = 40,
        this.length = 20,
        this.height = 20,
        this.border = 6;
        
        /* Collision box definitions */
        this.size = [this.base, this.length, this.height];

        /* Models the car in 3d */
        this._buildButter();

        /* Saves reference to itself */
        this.object.self = this;

        /* Adds object to the scene */
        scene.add(this.object);
    }

    _buildButter() {
        var texture = new THREE.TextureLoader().load('./tiles/butter.png'),
            butter = new THREE.Object3D();

        var geometry = new THREE.CubeGeometry(this.base, this.height, this.length),
            butterBodyMaterial = new THREE.MeshPhongMaterial({ map: texture, color: '#FFFFFF', shininess: 10, wireframe: false }),
            butterBody = new THREE.Mesh(geometry, butterBodyMaterial);

        butterBody.position.set(this.base / 2, this.height / 2, this.length / 2);
        butter.add(butterBody);

        addborder(this.height, this.border, this.length, null, this.base);
        addborder(this.height, this.border, this.length, Math.PI, -this.base);
        addTop(this.height, this.length, this.base + this.border * 2, this.border);

        function addborder(height, border, length, rotation, relative_pos) {

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
                border = new THREE.Mesh(geometry, material);

            if (rotation != null) {
                border.position.set(0, 0, -relative_pos / 2);
                border.rotation.y = rotation;
            } else {
                border.position.set(relative_pos, 0, 0);
            }

            butter.add(border);
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

    /* Collision handler */
    collision() {
        console.log('collision!');
    }

}