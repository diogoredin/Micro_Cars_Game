function detectColisions() {
    var sceneObjects = [];

    oranges.forEach( function(orange) {
        sceneObjects.push(orange);
    });

    cheerios.forEach( function(cheerio) {
        sceneObjects.push(cheerio);
    });

    butters.forEach( function(butter) {
        sceneObjects.push(butter);
    });

    sceneObjects.push(car);

    sceneObjects.forEach( function(object) {

        var radius = object.size,
            x = object.object.position.x,
            y = object.object.position.y,
            z = object.object.position.z;

        sceneObjects.forEach(function (testObject) {

            if (testObject.object.id != object.object.id) {

                var ext_radius = testObject.size,
                    ext_x = testObject.object.position.x,
                    ext_y = testObject.object.position.y,
                    ext_z = testObject.object.position.z;

                if (x - radius > ext_x - ext_radius && x + radius < ext_x + ext_radius &&
                    y - radius > ext_y - ext_radius && y + radius < ext_y + ext_radius &&
                    z - radius > ext_z - ext_radius && z + radius < ext_z + ext_radius ) {
                    
                    processColision(object, testObject);
                }
            
            }

        });

    });

}

function processColision(object, testObject) {

    if (object instanceof Car == true) {
        object.setVelocity(0);
    } 
    
    if (object instanceof Orange == true) {
        object.directionOfMovement.applyAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI);
    } 

}