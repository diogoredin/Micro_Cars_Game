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
}

function createPerspectiveTopCamera() {
    perspectiveTopCamera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 1, 1000);
    perspectiveTopCamera.position.set(0, 500, 0);
    perspectiveTopCamera.lookAt(scene.position);
}

function createChaseCamera() {
    chaseCamera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 1, 1000);
}

function createHelpCamera() {
    helpCamera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
    helpCamera.position.z = 500;
  
    controls = new THREE.OrbitControls( helpCamera );
    controls.addEventListener( 'change', render );
}