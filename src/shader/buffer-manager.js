import {Mesh} from '../model/mesh';


export class BufferManager {

    constructor(mesh) {
        if (mesh.constructor.name === Mesh.name) {
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
        let buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.mesh.vertices), gl.STATIC_DRAW);
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
        let buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.mesh.textures), gl.STATIC_DRAW);
        buffer.itemSize = 2;
        buffer.numItems = this.mesh.textures.length / 2;
    }
}

export class NormalBufferManager extends VertexBufferManager {
    constructor(mesh){
        super(mesh);
    }

    initializeMeshBuffer() {
        return super.initializeMeshBuffer();
    }
}

export class IndexBufferManager extends BufferManager {
    constructor(mesh){
        super(mesh);
    }

    initializeMeshBuffer() {
        let buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.mesh.indices), gl.STATIC_DRAW);
        buffer = 1;
        buffer = this.mesh.indices.length;

        return buffer;
    }
}