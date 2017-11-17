var orthographicTopCamera, perspectiveTopCamera, chaseCamera, helpCamera, controls, cameraIndex = 1;

function createOrthographicTopCamera() {
    var tableSize = 600;
    var aspect = window.innerWidth / window.innerHeight;

    if (aspect > 1) {
        orthographicTopCamera = new THREE.OrthographicCamera(-tableSize * aspect * 0.5, tableSize * aspect * 0.5, tableSize * 0.5, -tableSize * 0.5, 1, 601);
    } else {
        orthographicTopCamera = new THREE.OrthographicCamera(-tableSize * 0.5, tableSize * 0.5, tableSize * 0.5 / aspect, -tableSize * 0.5 / aspect, 1, 601);
    }

    orthographicTopCamera.position.set(0, 500, 0);
    orthographicTopCamera.aspect = aspect;
    orthographicTopCamera.lookAt(scene.position);
    scene.add(orthographicTopCamera);
    putTextBox(orthographicTopCamera);
}

function createPerspectiveTopCamera() {
    perspectiveTopCamera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 1, 1000);
    perspectiveTopCamera.position.set(0, 500, 0);
    perspectiveTopCamera.lookAt(scene.position);
    scene.add(perspectiveTopCamera);
    putTextBox(perspectiveTopCamera);
}

function createChaseCamera() {
    chaseCamera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 1, 1000);
    scene.add(chaseCamera);
    putTextBox(chaseCamera);
}

function createHelpCamera() {
    helpCamera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 10000);
    helpCamera.position.y = 500;
  
    controls = new THREE.OrbitControls( helpCamera );
    controls.addEventListener( 'change', render );
}


function putTextBox(camera) {

    if (camera instanceof THREE.OrthographicCamera) {
        var boxG = new THREE.CubeGeometry(650, 650 / 3, 1);
    } else {
        var boxG = new THREE.CubeGeometry(650 / (495), 650 / (495 * 3), 1)
    }
    
    var boxT = new THREE.TextureLoader().load('./tiles/GameOver.png');
    var boxM = new THREE.MeshBasicMaterial({ map: boxT, color: '#FFFFFF', wireframe: false, visible: false});
    var box = new THREE.Mesh(boxG, boxM);

    var vector = new THREE.Vector3(0, 0, - 1);
    box.position.set(0, 0, -1).multiplyScalar(1.5);
    var rotationVector = new THREE.Vector3().crossVectors(vector.normalize(), camera.up).normalize();

    camera.box = box;
    camera.add(box);
}