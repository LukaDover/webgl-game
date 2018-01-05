import {glContext} from "../common/common";
let OBJ = require('webgl-obj-loader');

export class BufferManager {

    constructor(mesh) {
        if (mesh.constructor.name !== OBJ.Mesh.name) {
            throw "Invalid object type. Expecting Mesh instance"; // TODO: create exception
        }

        this.mesh = mesh;
    }

    initializeMeshBuffers() {
        OBJ.initMeshBuffers(glContext, this.mesh);
    }
}