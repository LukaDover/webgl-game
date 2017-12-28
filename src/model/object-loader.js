let OBJ = require('webgl-obj-loader');

export class ObjectLoader {

    static getObjectData(path) {
        let request = new XMLHttpRequest();
        request.open("GET", path, false);
        request.send(null);

        if (request.status === 200) {
            return request.responseText;
        } else {
            throw new Error('Object failed to load');
        }
    }

    static getMesh(objectData) {
       return new OBJ.Mesh(objectData);
    }
}