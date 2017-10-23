/*******************************************************************

COLLISIONS
1. Detect Collisions
2. Process Collisions

*******************************************************************/

/* Fires an event when a collision is detected on the scene */
function detectColisions() {

    /* Runs throught the scene to test colisions between objects */
    /* Different tests are applied depending on the objects */
    /* This test is O(n^2) as it traversers our scene twice */
    scene.traverse( function(a) {

        /* Return if it isn't an object */
        if ( a.type != 'Object3D' || a.self == undefined ) { return; }

        /* Retrieve the physic object and the Javascript object */
        var self = a.self;
        var obj3D = a.self.object;

        /* SPHERE COLLISION BOX */
        if (self.size.length == 1) {
            var radius = self.size.length[0];
        }

        /* AXIS ALIGNED COLLISION BOX */
        else if (self.size.length == 3) {
            var width = self.size.length[0],
                length = self.size.length[1],
                heigth = self.size.length[2];
        }

        /* Center of the object Coordinates */
        var x = obj3D.position.x,
            y = obj3D.position.y,
            z = obj3D.position.z;

        /* Now we test it against every other object */
        scene.traverse( function(b) {

            /* Return if it isn't an object */
            if (b.type != 'Object3D' || b.self == undefined) { return; }
            
            /* Retrieve the physic object and the Javascript object */
            var self = b.self;
            var obj3D = b.self.object;

            /* It can't collide with itself */
            if (a.self.object.id != b.self.object.id) {

                /* Center of the object Coordinates */
                var ext_x = obj3D.position.x,
                    ext_y = obj3D.position.y,
                    ext_z = obj3D.position.z;

                /* SPHERE COLLISION BOX */
                if (self.size.length == 1) {
                    var ext_radius = self.size.length[0];

                    /* Test against another sphere (e.g. orange and orange) */
                    if (radius != undefined &&
                        intersectSphereSphere(x,y,z,ext_x,ext_y,ext_z,radius,ext_radius) ) {

                        /* Now process the collision! */
                        a.self.collision();
                        b.self.collision();

                    }
                    
                    /* Test against another box (e.g. car and orange) */
                    else if (width != undefined && height != undefined && length != undefined &&
                        intersectCubeSphere(x, y, z, ext_x, ext_y, ext_z, width, height, length, ext_radius) ) {

                        /* Now process the collision! */
                        a.self.collision();
                        b.self.collision();

                    }

                }

                /* AXIS ALIGNED COLLISION BOX */
                else if (self.size.length == 3) {
                    var ext_width = self.size.length[0],
                        ext_length = self.size.length[1],
                        ext_heigth = self.size.length[2];
                    
                    /* Test against another sphere (e.g. car and orange) */
                    if (radius != undefined &&
                        intersectCubeSphere(x, y, z, ext_x, ext_y, ext_z, width, height, length, ext_radius)) {

                        /* Now process the collision! */
                        a.self.collision();
                        b.self.collision();

                    }

                    /* Test against another box (e.g. car and car) */
                    else if (width != undefined && height != undefined && length != undefined &&
                        intersectCubeCube(x, y, z, ext_x, ext_y, ext_z, width, height, length, ext_width, ext_length, ext_heigth)) {

                        /* Now process the collision! */
                        a.self.collision();
                        b.self.collision();

                    }

                }
            
            }

        });

    });

}

/* Intersect Sphere with another Sphere */
function intersectSphereSphere(x, y, z, ext_x, ext_y, ext_z, radius, ext_radius) {
    
    if (x - radius > ext_x - ext_radius && x + radius < ext_x + ext_radius &&
        y - radius > ext_y - ext_radius && y + radius < ext_y + ext_radius &&
        z - radius > ext_z - ext_radius && z + radius < ext_z + ext_radius) {
        return true;
    }

    else {
        return false;
    }

}

/* Intersect Cube with another Sphere */
function intersectCubeSphere(x, y, z, ext_x, ext_y, ext_z, width, height, length, ext_radius) {

    /* MATH EXPLANATION */
    /* ext_x, ext_y, ext_z and ext_radius belongs to the Sphere */
    /* x, y, z, width, height, length belongs to the Cube */
    /* A cube intersects with a sphere if one of its side is between the diameter of the sphere */
    
    if ( x - grl > ext_x - ext_radius && x + radius < ext_x + ext_radius &&
        y - radius > ext_y - ext_radius && y + radius < ext_y + ext_radius &&
        z - radius > ext_z - ext_radius && z + radius < ext_z + ext_radius) {

        return true;
    }

    else {
        return false;
    }

}

/* Intersect Cube with another Sphere */
function intersectCubeCube(x, y, z, ext_x, ext_y, ext_z, width, height, length, ext_width, ext_length, ext_heigth) {

    /* MATH EXPLANATION */
    /* ext_x, ext_y, ext_z and ext_radius belongs to the Sphere */
    /* x, y, z, width, height, length belongs to the Cube */
    /* A cube intersects with a sphere if one of its side is between the diameter of the sphere */

    if (x - grl > ext_x - ext_radius && x + radius < ext_x + ext_radius &&
        y - radius > ext_y - ext_radius && y + radius < ext_y + ext_radius &&
        z - radius > ext_z - ext_radius && z + radius < ext_z + ext_radius) {

        return true;
    }

    else {
        return false;
    }

}