class Butter extends StaticObject {

    constructor(initialPosition) {

        /* Invokes constructor of parent class */
        super(initialPosition);

        /* Butter Sizes */
        this.base = 40,
        this.length = 20,
        this.height = 25,
        this.border = 6;
        
        /* Collision box definitions */
        this.size = [this.base+this.border*2, this.length, this.height];

        /* Models the butter in 3d */
        this._buildButter();

        /* Saves reference to itself */
        this.object.self = this;

        /* Adds object to the scene */
        scene.add(this.object);
    }

    _buildButter() {

        var texture = new THREE.TextureLoader().load('./tiles/butter.png'),
            butter = new THREE.Object3D();

        var geometry = new THREE.CubeGeometry(this.base, this.height/2, this.length),
            butterBodyMaterial = new THREE.MeshPhongMaterial({ map: texture, color: '#FFFFFF', wireframe: false }),
            butterBody = new THREE.Mesh(geometry, butterBodyMaterial);

        butterBody.position.set(0, 6, 0);
        butter.add(butterBody);

        addborder(this.height, this.border, this.length, null, this.base);
        addborder(this.height, this.border, this.length, Math.PI, this.base);

        function addborder(height, border, length, rotation, relative_pos) {

            var shape = new THREE.Shape();
            shape.moveTo(0, 0);
            shape.lineTo(0, height/2 - 0.2);
            shape.lineTo(border, height/2 - 0.2);

            var extrudeSettings = {
                steps: 2,
                amount: length,
                bevelEnabled: false,
                bevelThickness: 0,
                bevelSize: 0,
                bevelSegments: 0
            };

            var geometry = new THREE.ExtrudeBufferGeometry(shape, extrudeSettings),
                material = new THREE.MeshPhongMaterial({ color: '#EEEEEE', wireframe: false }),
                border = new THREE.Mesh(geometry, material);

            if (rotation != null) {
                border.position.set(-relative_pos / 2, 0, length/2);
                border.rotation.y = rotation;
            } else {
                border.position.set(relative_pos / 2, 0, -length/2);
            }

            butter.add(border);
        }

        this.object.add(butter);
    }

}