class AmbientLight {

    constructor(color) {
        var light = new THREE.AmbientLight(color);
        scene.add(light);
    }

}

class FocusLight {

    constructor(color, x, y, z) {
        var light = new THREE.DirectionalLight('#999999');
        light.position.set(x, y, z).normalize();
        scene.add(light);
    }

}
