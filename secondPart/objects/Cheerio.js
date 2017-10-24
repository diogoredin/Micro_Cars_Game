class Cheerio extends MovingObject {

    constructor(initialPosition, initialVelocity, directionOfMovement, size) {

        /* Invokes constructor of parent class */
        super(initialPosition, initialVelocity, directionOfMovement);

        /* Collision box definitions */
        this.size = [size, size, size];

        /* Models the orange in 3d */
        this._buildCheerio();

        /* Saves reference to itself */
        this.object.self = this;

        /* Adds object to the scene */
        scene.add(this.object);

    }

    _buildCheerio() {

        let texture = new THREE.TextureLoader().load('./tiles/cheerio.png');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(4, 4);

        let geometry = new THREE.TorusGeometry(this.size[0], 1, 8, 30),
            material = new THREE.MeshPhongMaterial({ map: texture, specular: 0x555555, shininess: 10, wireframe: false }),
            torus = new THREE.Mesh(geometry, material);

        torus.size = this.size[0];
        torus.rotation.x = 1 / 2 * Math.PI;

        this.object.add(torus);
    }

    turn(deltaT) {
        var angle = - this.velocity * deltaT / (this.size[0]);
        this.object.rotateZ(angle);
    }

    update(deltaT) {
        this.turn(deltaT);
        this.move(deltaT)
    }

    /* Collision handler */
    collision(element) {

        if (element instanceof Car) {
            console.log('collision of car with cheerio!');
        }

    }

    /*************************************************************************
    *
    *    Falling off table handler
    *
    *************************************************************************/

    fallOffTable() {
        this.object.visible = false;
    }

}