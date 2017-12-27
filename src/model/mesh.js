export class Mesh {
    constructor(vertexPositions, vertexNormals, vertexTextures, indices) {
        if (vertexPositions === null) {
            throw new Error('Vertex Positions attribute cannot be null');
        }
        if (vertexNormals === null) {
            throw new Error('Vertex normals attribute cannot be null');
        }
        if (vertexTextures === null) {
            console.log('WARN: Vertex textures attribute is null');
        }
        if (indices === null) {
            console.log('WARN: Vertex indices attribute is null');
        }

        this.vertexPositions = vertexPositions;
        this.vertexTextures = vertexTextures;
        this.vertexNormals = vertexNormals;
        this.indices = indices;
    }
}