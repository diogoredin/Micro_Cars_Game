/*******************************************************************

COLLISIONS
1. Detect Collisions - Traverses the scene to find possible collisions.
2. Test Collisions - Tests to apply to the elements on the scene.
    2.1. Sphere/Sphere
    2.2. Cube/Sphere
    2.3. Cube/Cube
3. Table Bounds

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
        if (a.type != 'Object3D' || a.self == undefined) { return; }
        
        /* Checks if it will fall off the table */
        tableBounds(a.self);

        /* Now we test it against every other object */
        scene.traverse( function(b) {

            /* Return if it isn't an object */
            if ( b.type != 'Object3D' || b.self == undefined ) { return; }

            /* It can't collide with itself */
            if ( a.id != b.id ) {

                /* If it doesn't collide with a larger sphere we can discard it */
                if (intersectSphereSphere(a.self, b.self)) {
                    
                    /* For debugging purposes */
                    console.log('Passed Sphere on Sphere collision test.');

                    /* SPHERE/SPHERE COLLISION BOX */
                    if (a.self.size.length == 1 && b.self.size.length == 1) {
                        if (intersectSphereSphere(a.self, b.self)) {

                            /* For debugging purposes */
                            console.log('Passed Sphere on Sphere second collision test.');

                            a.self.collision(b.self);
                            b.self.collision(a.self);
                        }
                    }

                    /* BOX/BOX AXIS ALIGNED COLLISION BOX */
                    else if (a.self.size.length == 3 && b.self.size.length == 3) {
                        if (intersectCubeCube(a.self, b.self)) {

                            /* For debugging purposes */
                            console.log('Passed Box on Box collision test.');

                            a.self.collision(b.self);
                            b.self.collision(a.self);
                        }
                    }

                    /* SPHERE/BOX AXIS ALIGNED COLLISION BOX */
                    else if (a.self.size.length == 1 && b.self.size.length == 3) {
                        if (intersectCubeSphere(b.self, a.self)) {

                            /* For debugging purposes */
                            console.log('Passed Sphere on Box collision test.');

                            a.self.collision(b.self);
                            b.self.collision(a.self);
                        }
                    }

                    /* BOX/SPHERE AXIS ALIGNED COLLISION BOX */
                    else if (a.self.size.length == 3 && b.self.size.length == 1) {
                        if (intersectCubeSphere(a.self, b.self)) {

                            /* For debugging purposes */
                            console.log('Passed Box on Sphere collision test.');

                            a.self.collision(b.self);
                            b.self.collision(a.self);
                        }
                    }
                
                }   

            }

        });

    });

}

/********************************************************************

Collision Tests

*******************************************************************/

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
function intersectCubeSphere(a, b) {
    
    /* Cube Properties */
    let a_width = a.size[0]/2,
        a_length = a.size[1]/2,
        a_height = a.size[2]/2;

    let a_max_x = a.object.position.x + a_width,
        a_max_y = a.object.position.y + a_height,
        a_max_z = a.object.position.z + a_length;

    let a_min_x = a.object.position.x - a_width,
        a_min_y = a.object.position.y - a_height,
        a_min_z = a.object.position.z - a_length;
    
    /* Sphere Properties */
    /* Width here it's actually the radius of the sphere */

    let b_width = b.size[0];

    let b_max_x = b.object.position.x + b_width,
        b_max_y = b.object.position.y + b_width,
        b_max_z = b.object.position.z + b_width;

    let b_min_x = b.object.position.x - b_width,
        b_min_y = b.object.position.y - b_width,
        b_min_z = b.object.position.z - b_width;

    /* MATH EXPLANATION */
    /* Bounding box extreme points comparison */
    /* Adapated from cube to cube to fit comparison between sphere and cube */
    
    let test_x = (a_max_x > b_min_x && a_min_x < b_max_x);
    let test_y = (a_max_y > b_min_y && a_min_y < b_max_y);
    let test_z = (a_max_z > b_min_z && a_min_z < b_max_z);

    return (test_x && test_y && test_z);
}

/* Intersect Cube with another Cube */
function intersectCubeCube(a,b) {

    /* Cube Properties */
    let a_width = a.size[0]/2,
        a_length = a.size[1]/2,
        a_height = a.size[2]/2;

    let a_max_x = a.object.position.x + a_width,
        a_max_y = a.object.position.y + a_height,
        a_max_z = a.object.position.z + a_length;

    let a_min_x = a.object.position.x - a_width,
        a_min_y = a.object.position.y - a_height,
        a_min_z = a.object.position.z - a_length;

    /* Cube Properties */
    let b_width = b.size[0]/2,
        b_length = b.size[1]/2,
        b_height = b.size[2]/2;

    let b_max_x = b.object.position.x + b_width,
        b_max_y = b.object.position.y + b_height,
        b_max_z = b.object.position.z + b_length;

    let b_min_x = b.object.position.x - b_width,
        b_min_y = b.object.position.y - b_height,
        b_min_z = b.object.position.z - b_length;

    /* MATH EXPLANATION */
    /* Bounding box extreme points comparison */

    let test_x = (a_max_x > b_min_x && a_min_x < b_max_x);
    let test_y = (a_max_y > b_min_y && a_min_y < b_max_y);
    let test_z = (a_max_z > b_min_z && a_min_z < b_max_z);

    return (test_x && test_y && test_z);
}

/********************************************************************

Table Bounds

*******************************************************************/

/* Checks and handles an element that gets out of the table */
function tableBounds( element ) {

    /* Provisory */
    var tableSize = 650/2;

    /* Current pos */
    let x = element.object.position.x,
        y = element.object.position.y,
        z = element.object.position.z;
    
    /* Checks x, y and z */
    let test_x = (x < tableSize && x > -tableSize),
        test_y = (y < tableSize && y > -tableSize),
        test_z = (z < tableSize && z > -tableSize);

    /* Fires the appriate event */
    if (!(test_x && test_y && test_z)) {
        element.fallOffTable();
    }

}