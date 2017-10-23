/*******************************************************************

COLLISIONS
1. Detect Collisions
2. Process Collisions

*******************************************************************/

/********************************************************************

Collision Detection

*******************************************************************/

/* Fires an event when a collision is detected on the scene */
function detectCollisions() {

    /* Runs throught the scene to test colisions between objects */
    /* Different tests are applied depending on the objects */
    /* This test is O(n^2) as it traversers our scene twice */
    scene.traverse( function(a) {

        /* Return if it isn't an object */
        if ( a.type != 'Object3D' || a.self == undefined ) { return; }

        /* Now we test it against every other object */
        scene.traverse( function(b) {

            /* Return if it isn't an object */
            if ( b.type != 'Object3D' || b.self == undefined ) { return; }

            /* It can't collide with itself */
            if ( a.id != b.id ) {

                /* If it doesn't collide with a larger sphere we can discard it */
                if (intersectSphereSphere(a.self, b.self)) {
                    
                    /* For debugging purposes */
                    console.log('Passed Sphere on Sphere collision test');

                    /* SPHERE/SPHERE COLLISION BOX */
                    if (a.self.size.length == 1 && b.self.size.length == 1) {
                        //intersectSphereSphere(a.self, b.self);
                    }

                    /* BOX/BOX AXIS ALIGNED COLLISION BOX */
                    else if (a.self.size.length == 3 && b.self.size.length == 3) {
                        //intersectCubeCube(a.self, b.self);
                    }

                    /* SPHERE/BOX AXIS ALIGNED COLLISION BOX */
                    else if (a.self.size.length == 1 && b.self.size.length == 3) {
                        //intersectCubeSphere(b.self, a.self);
                    }

                    /* BOX/SPHERE AXIS ALIGNED COLLISION BOX */
                    else if (a.self.size.length == 3 && b.self.size.length == 1) {
                        //intersectCubeSphere(a.self, b.self);
                    }
                
                }   

            }

        });

    });

}

/* Intersect Sphere with another Sphere */
function intersectSphereSphere(a, b) {
    let a_radius, a_cx, a_cy, a_cz,
        b_radius, b_cx, b_cy, b_cz;

    /* Get attributes or force it to be a sphere if needed */
    if (a.size.length == 1) {
        a_radius = a.size[0];
        a_cx = a.object.position.x; a_cy = a.object.position.y; a_cz = a.object.position.z;

    } else if (a.size.length == 3) {
        a_radius = Math.max(a.size[0], a.size[1], a.size[2]);
        a_cx = a.object.position.x; a_cy = a.object.position.y; a_cz = a.object.position.z;
    }

    /* Get attributes or force it to be a sphere if needed */
    if (b.size.length == 1) {
        b_radius = b.size[0];
        b_cx = b.object.position.x; b_cy = b.object.position.y; b_cz = b.object.position.z;

    } else if (b.size.length == 3) {
        b_radius = Math.max(b.size[0], b.size[1], b.size[2]);
        b_cx = b.object.position.x; b_cy = b.object.position.y; b_cz = b.object.position.z;
    }

    /* MATH EXPLANATION */
    /* Pitagoras theorem applied to all three axis */
    
    /* (ra + rb)^2 => (cax - cbx)^2 + (cax - cbx)^2 */
    let square = (a_radius + b_radius) * (a_radius + b_radius);
    let square_sum = (a_cx - b_cx) * (a_cx - b_cx) + (a_cx - b_cx) * (a_cx - b_cx);
    let test_x = (square == square_sum || square > square_sum);

    /* (ra + rb)^2 => (cay - cby)^2 + (cay - cby)^2 */
    square_sum = (a_cy - b_cy) * (a_cy - b_cy) + (a_cy - b_cy) * (a_cy - b_cy);
    let test_y = (square == square_sum || square > square_sum);

    /* (ra + rb)^2 => (caz - cbz)^2 + (caz - cbz)^2 */
    square_sum = (a_cz - b_cz) * (a_cz - b_cz) + (a_cz - b_cz) * (a_cz - b_cz);
    let test_z = (square == square_sum || square > square_sum);

    return (test_x && test_y && test_z);
}

/* Intersect Cube with another Sphere */
function intersectCubeSphere(a,b) {

    /* MATH EXPLANATION */
    /* A cube intersects with a sphere if their axis all overlap at some point. Otherwise they might just be on top or side. */
    /* Imagine these values projected onto the axis and overlapped with each other */
    
    return (false);
}

/* Intersect Cube with another Cube */
function intersectCubeCube(a,b) {

    /* MATH EXPLANATION */
    /* Two cubes intersect only if their axis all overlap at some point. Otherwise they might just be on top or side. */
    /* Imagine these values projected onto the axis and overlapped with each other */

    return (false);
}