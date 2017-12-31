import {DUMMYDATA, DUMMYMESH, DUMMYPATH} from "../common/path";
import {downloadModels} from "webgl-obj-loader";

let OBJ = require('webgl-obj-loader');

export class ObjectLoader {

    static getObjectData(path) {
        if (path === DUMMYPATH) {
            console.log("WARN: Using DUMMYPATH when constructing an object");
            return DUMMYDATA;
        }
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
        if (objectData === DUMMYDATA) {
            console.log("WARN: Using DUMMYDATA when constructing an object");
            return DUMMYMESH;
        }
       return new OBJ.Mesh(objectData);
    }
}