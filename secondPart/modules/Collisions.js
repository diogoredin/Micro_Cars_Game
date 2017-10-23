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
            var radius = self.size[0];
        }

        /* AXIS ALIGNED COLLISION BOX */
        else if (self.size.length == 3) {
            var width = self.size[0],
                length = self.size[1],
                height = self.size[2];
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
                var alt_x = obj3D.position.x,
                    alt_y = obj3D.position.y,
                    alt_z = obj3D.position.z;

                /* SPHERE COLLISION BOX */
                if (self.size.length == 1) {
                    var alt_radius = self.size[0];

                    /* Test against another sphere (e.g. orange and orange) */
                    if (radius != undefined &&
                        intersectSphereSphere(x,y,z,alt_x,alt_y,alt_z,radius,alt_radius) ) {

                        /* Now process the collision! */
                        a.self.collision();
                        b.self.collision();

                    }
                    
                    /* Test against another box (e.g. car and orange) */
                    else if (width != undefined && height != undefined && length != undefined &&
                        intersectCubeSphere(x, y, z, alt_x, alt_y, alt_z, width, height, length, alt_radius)) {

                        /* Now process the collision! */
                        a.self.collision();
                        b.self.collision();

                    }

                }

                /* AXIS ALIGNED COLLISION BOX */
                else if (self.size.length == 3) {
                    var alt_width = self.size[0],
                        alt_length = self.size[1],
                        alt_heigth = self.size[2];
                    
                    /* Test against another sphere (e.g. car and orange) */
                    if (radius != undefined &&
                        intersectCubeSphere(x, y, z, alt_x, alt_y, alt_z, width, height, length, alt_radius)) {

                        /* Now process the collision! */
                        a.self.collision();
                        b.self.collision();

                    }

                    /* Test against another box (e.g. car and car) */
                    else if (width != undefined && height != undefined && length != undefined &&
                        intersectCubeCube(x, y, z, alt_x, alt_y, alt_z, width, height, length, alt_width, alt_length, alt_heigth)) {

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
function intersectSphereSphere(x, y, z, alt_x, alt_y, alt_z, radius, alt_radius) {

    if (x - radius > alt_x - alt_radius && x + radius < alt_x + alt_radius &&
        y - radius > alt_y - alt_radius && y + radius < alt_y + alt_radius &&
        z - radius > alt_z - alt_radius && z + radius < alt_z + alt_radius) {
        return true;
    }

    else {
        return false;
    }

}

/* Intersect Cube with another Sphere */
function intersectCubeSphere(x, y, z, alt_x, alt_y, alt_z, width, height, length, alt_radius) {

    /* MATH EXPLANATION */
    /* alt_x, alt_y, alt_z and alt_radius belongs to the Sphere */
    /* x, y, z, width, height, length belongs to the Cube */
    /* A cube intersects with a sphere if their axis all overlap at some point. Otherwise they might just be on top or side. */
    /* Imagine these values projected onto the axis and overlapped with each other */
    
    if (x - alt_x < width + alt_radius) {

        if (y - alt_y < height + alt_radius) {

            if (z - alt_z < length + alt_radius) {
                return false;
            }

        }

    }

    else {
        return false;
    }

}

/* Intersect Cube with another Cube */
function intersectCubeCube(x, y, z, alt_x, alt_y, alt_z, width, height, length, alt_width, alt_length, alt_heigth) {

    /* MATH EXPLANATION */
    /* alt_x, alt_y, alt_z and alt_radius belongs to the Sphere */
    /* x, y, z, width, height, length belongs to the Cube */
    /* Two cubes intersect only if their axis all overlap at some point. Otherwise they might just be on top or side. */
    /* Imagine these values projected onto the axis and overlapped with each other */

    if ( x - alt_x < width + alt_width ) {
        
        if ( y - alt_y < height + alt_heigth ) {

            if ( z - alt_z < length + alt_length ) {
                return false;
            }
    
        }

    }

    else {
        return false;
    }

}