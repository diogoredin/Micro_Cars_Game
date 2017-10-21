function createButter(pos_x, pos_y, pos_z) {

    var butter = new THREE.Object3D(),
        butterMaterial = new THREE.MeshLambertMaterial({ color: '#FFFFFF', wireframe: false });

    var width = 40;
        height = 30;
        length = 70;

    var shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0, width);
    shape.lineTo(height, width);
    shape.lineTo(height, 0);
    shape.lineTo(0, 0);

    var extrudeSettings = {
        steps: 2,
        amount: 16,
        bevelEnabled: true,
        bevelThickness: 1,
        bevelSize: 1,
        bevelSegments: 1
    };

    var geometry = new THREE.ExtrudeBufferGeometry(shape, extrudeSettings);
    var butterBody = new THREE.Mesh(geometry, butterMaterial);
    butter.add(butterBody);

    butter.position.set(pos_x, pos_y, pos_z);
    scene.add(butter);
}