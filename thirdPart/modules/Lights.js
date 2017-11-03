class DirectionalLight {

    constructor(color, x, y, z) {
        
        this.light = new THREE.DirectionalLight(color);
        this.light.position.set(x, y, z);
        this.status = true;

        this.light.self = this;
        scene.add(this.light);
    }

    turnOnOff() {
        if ( this.status ) {
            this.light.intensity = 0;
            this.status = false;
        } else {
            this.light.intensity = 1;
            this.status = true;
        }
    }
}

class PointLight {

    constructor(color, position) {

        this.light = new THREE.PointLight(color, 1, 100);
        this.light.position.set(0, 0, 0);
        this.light.position.add(position);
        this.status = true;

        this.light.self = this;
        scene.add(this.light);
    }

    turnOnOff() {
        if (this.status) {
            this.light.intensity = 0;
            this.status = false;
        } else {
            this.light.intensity = 1;
            this.status = true;
        }
    }
}