class Orange extends MovingObject {

    constructor(initialPosition, initialVelocity, directionOfMovement, size) {

        /* Invokes constructor of parent class */
        super(initialPosition, initialVelocity, directionOfMovement);

        /* Collision box definitions */
        this.size = [size];

        /* Models the orange in 3d */
        this._buildOrange();

        /* Saves reference to itself */
        this.object.self = this;

        /* Adds object to the scene */
        scene.add(this.object);

    }

    _buildOrange() {

        var texture = new THREE.TextureLoader().load('./tiles/orange.png');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(2, 2);

        var orange = new THREE.Object3D(),
            orangeMaterial = new THREE.MeshPhongMaterial({ map: texture, specular: 0x555555, shininess: 10, wireframe: false });

        var geometry = new THREE.SphereGeometry(this.size[0], 20, 20);
        var orangeBody = new THREE.Mesh(geometry, orangeMaterial);

        orange.add(orangeBody);
        this.object.add(orange);
    }

    increaseVelocity(increase) {
        var newVelocity = this.velocity + increase;
        this.setVelocity(newVelocity);
    }

    turn(deltaT) {
        var angle = - this.velocity * deltaT / (this.size);
        this.object.rotateZ(angle);
    }

    update(deltaT) {
        this.turn(deltaT);
        this.move(deltaT)
    }

    /* Collision handler */
    collision() {
        console.log('collision!');
    }

    /* Falling off table handler */
    fallOffTable() {
        console.log('fall off!');
    }

}