class Floor extends StaticObject {

    constructor(initialPosition) {

        super(initialPosition);

        var texture = new THREE.TextureLoader().load('./tiles/floor.png');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(40, 40);

        var floor = new THREE.PlaneGeometry(3000, 3000),
            floorMaterial = new THREE.MeshPhongMaterial({ map: texture, specular: 0x555555, shininess: 5 });

        var plane = new THREE.Mesh(floor, floorMaterial);
        plane.material.side = THREE.DoubleSide;
        plane.rotation.x = Math.PI / 2;

        this.object.add(plane);
        scene.add(this.object);
    }

}