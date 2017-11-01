function changeMaterial(id, order) {

    /* The object can either be just one or a composition */
    if ( scene.getObjectById(id).material instanceof Array ) {

        var material = scene.getObjectById(id).material[order];

        if ( order == null ) {
            changeMaterial(id, 0);
        } else {
            changeMaterial(id, order++);
        }

    } else {
        var material = scene.getObjectById(id).material;
    }

    console.log(material);
}