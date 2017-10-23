class Orange extends MovingObject {

    constructor(initialPosition, initialVelocity, directionOfMovement, size) {

        super(initialPosition, initialVelocity, directionOfMovement);

        this.size = size;

        this._buildOrange();
        this.object.name = 'orange';
        scene.add(this.object);
    }

    _buildOrange() {

        var texture = new THREE.TextureLoader().load('./tiles/orange.png');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(2, 2);

        var orange = new THREE.Object3D(),
            orangeMaterial = new THREE.MeshPhongMaterial({ map: texture, specular: 0x555555, shininess: 10, wireframe: false });

        var geometry = new THREE.SphereGeometry(this.size, 20, 20);
        var orangeBody = new THREE.Mesh(geometry, orangeMaterial);

        orange.add(orangeBody);
        this.object.add(orange);
    }

    increaseVelocity(increase) {
        var newVelocity = this.velocity + increase;
        this.setVelocity(newVelocity);
    }

    turn() {
        var angle = -Math.PI/10;
        this.object.rotateZ(angle);
    }

    update(deltaT) {
        this.turn();
        this.move()
    }

}