import {glContext} from "../common/common";
let OBJ = require('webgl-obj-loader');

export class BufferManager {

    constructor(mesh) {
        if (mesh.constructor.name !== OBJ.Mesh.name) {
            throw "Invalid object type. Expecting Mesh instance"; // TODO: create exception
        }

        this.mesh = mesh;
    }

    initializeMeshBuffer() {
        throw "This method should be implemented in a subclass";
    }
}

export class VertexBufferManager extends BufferManager {
    constructor(mesh){
        super(mesh);
    }

    initializeMeshBuffer() {
        let buffer = glContext.createBuffer();
        glContext.bindBuffer(glContext.ARRAY_BUFFER, buffer);
        glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(this.mesh.vertices), glContext.STATIC_DRAW);
        buffer.itemSize = 3;
        buffer.numItems = this.mesh.vertices.length / 3;

        return buffer;
    }
}

export class TextureBufferManager extends BufferManager {
    constructor(mesh){
        super(mesh);
    }

    initializeMeshBuffer() {
        let buffer = glContext.createBuffer();
        glContext.bindBuffer(glContext.ARRAY_BUFFER, buffer);
        glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(this.mesh.textures), glContext.STATIC_DRAW);
        buffer.itemSize = 2;
        buffer.numItems = this.mesh.textures.length / 2;

        return buffer;
    }
}

export class NormalBufferManager extends BufferManager {
    constructor(mesh){
        super(mesh);
    }

    initializeMeshBuffer() {
        let buffer = glContext.createBuffer();
        glContext.bindBuffer(glContext.ARRAY_BUFFER, buffer);
        glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(this.mesh.vertexNormals), glContext.STATIC_DRAW);
        buffer.itemSize = 3;
        buffer.numItems = this.mesh.vertexNormals.length / 3;

        return buffer;
    }
}

export class IndexBufferManager extends BufferManager {
    constructor(mesh){
        super(mesh);
    }

    initializeMeshBuffer() {
        let buffer = glContext.createBuffer();
        glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, buffer);
        glContext.bufferData(glContext.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.mesh.indices), glContext.STATIC_DRAW);
        buffer.itemSize = 1;
        buffer.numItems = this.mesh.indices.length;

        return buffer;
    }
}