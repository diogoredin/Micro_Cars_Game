class Floor extends StaticObject {

    constructor(initialPosition) {

        super(initialPosition);

        this._buildFloor();
        scene.add(this.object);
    }

    _buildFloor() {

        var texture = new THREE.TextureLoader().load('./tiles/floor.png');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(40, 40);

        var floor = new THREE.CubeGeometry(3000, 1, 3000),
            floorMaterial = new THREE.MeshPhongMaterial({ map: texture, color: '#EEEEEE' });

        var plane = new THREE.Mesh(floor, floorMaterial);

        this.object.add(plane);

    }

}