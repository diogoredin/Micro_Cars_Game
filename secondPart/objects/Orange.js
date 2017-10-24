class Orange extends MovingObject {

    constructor(initialPosition, initialVelocity, directionOfMovement, size) {

        /* Invokes constructor of parent class */
        super(initialPosition, initialVelocity, directionOfMovement, 60);

        this.rotationAxis = new THREE.Vector3().crossVectors(directionOfMovement, new THREE.Vector3(0,1,0));

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
        var angle = - this.velocity * deltaT / (this.size[0]);
        var quaternion = new THREE.Quaternion().setFromAxisAngle(this.rotationAxis, angle);
        this.object.rotateOnAxis(this.rotationAxis, angle)
    }

    update(deltaT) {
        this.turn(deltaT);
        this.move(deltaT)
    }

    /* Collision handler */
    collision() {
        console.log('collision!');
    }

    /*************************************************************************
    *
    *    Falling off table handler
    *
    *************************************************************************/

    fallOffTable() {

        /* Prevent it from firing more than one timeout */
        if (this.object.visible) {

            /* Store orange so we dont lose context */
            var orange = this;

            /* Removes orange and re-adds at random time */
            orange.object.visible = false;
            var random_time = Math.random() * (3000 - 100) + 100; // Math.random() * (max - min) + min;

            /* The time until an orange appears again must be random */
            setTimeout(function () {

                /* Oranges that fall off must be placed randomly again on the table */
                let table_size = 650 / 3,
                    random_x = Math.random() * (table_size - (-table_size)) - table_size,
                    random_z = Math.random() * (table_size - (-table_size)) - table_size;

                let position = new THREE.Vector3(random_x, 15, random_z);
                orange.setPosition(position);

                /* Oranges that fall off must have a random new velocity */
                let random_increase = Math.random() * (2 - 1) + 1;
                orange.setVelocity(orange.velocity + 0.5 * random_increase);
            
                orange.setDirectionOfMovement(new THREE.Vector3(Math.random(), 0, Math.random()));

                /* Re-adds it */
                orange.object.visible = true;



            }, random_time);
        
        }    

    }

    setDirectionOfMovement(directionOfMovement) {
        this.rotationAxis = new THREE.Vector3().crossVectors(directionOfMovement, new THREE.Vector3(0, 1, 0));
        super.setDirectionOfMovement(directionOfMovement);
    }

}