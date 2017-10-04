function createOrange(pos_x, pos_y, pos_z) {

    var texture = new THREE.TextureLoader().load('./img/orange.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);

    var radius = 20;

    var orange = new THREE.Object3D(),
        orangeMaterial = new THREE.MeshPhongMaterial({ map: texture, specular: 0x555555, shininess: 10, wireframe: false });
    
    var geometry = new THREE.SphereGeometry(radius, 32, 32);
    var orangeBody = new THREE.Mesh(geometry, orangeMaterial);
    orange.add(orangeBody);

    orange.position.set(pos_x, pos_y + radius, pos_z);
    scene.add(orange);

}