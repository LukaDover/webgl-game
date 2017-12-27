import {Mesh} from '../model/mesh';
let $ = require('jquery');

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
       /*
            With the given elementID or string of the OBJ, this parses the
            OBJ and creates the mesh.
        */

        let vertices = [];
        let vertexNormals = [];
        let textures = [];

        // unpacking stuff
        let packed = {};
        packed.vertices = [];
        packed.norms = [];
        packed.textures = [];
        packed.hashindices = {};
        packed.indices = [];
        packed.index = 0;

        // array of lines separated by the newline
        let lines = objectData.split( '\n' );
        for( let i=0; i<lines.length; i++ ){
            // if this is a vertex
            let line;
            let face;
            if( lines[ i ].startsWith( 'v ' ) ){
                line = lines[ i ].slice( 2 ).split( " " );
                vertices.push( line[ 0 ] );
                vertices.push( line[ 1 ] );
                vertices.push( line[ 2 ] );
            }
            // if this is a vertex normal
            else if( lines[ i ].startsWith( 'vn' ) ){
                line = lines[ i ].slice( 3 ).split( " " );
                vertexNormals.push( line[ 0 ] );
                vertexNormals.push( line[ 1 ] );
                vertexNormals.push( line[ 2 ] );
            }
            // if this is a texture
            else if( lines[ i ].startsWith( 'vt' ) ){
                line = lines[ i ].slice( 3 ).split( " " );
                textures.push( line[ 0 ] );
                textures.push( line[ 1 ] );
            }
            // if this is a face
            else if( lines[ i ].startsWith( 'f ' ) ){
                line = lines[ i ].slice( 2 ).split( " " );
                let quad = false;
                for (let j = 0; j < line.length; j++){
                    // Triangulating quads
                    // quad: 'f v0/t0/vn0 v1/t1/vn1 v2/t2/vn2 v3/t3/vn3/'
                    // corresponding triangles:
                    //      'f v0/t0/vn0 v1/t1/vn1 v2/t2/vn2'
                    //      'f v2/t2/vn2 v3/t3/vn3 v0/t0/vn0'
                    if(j === 3 && !quad) {
                        // add v2/t2/vn2 in again before continuing to 3
                        j = 2;
                        quad = true;
                    }

                    if( line[ j ] in packed.hashindices ){
                        packed.indices.push( packed.hashindices[ line[ j ] ] );
                    }
                    else{
                        face = line[ j ].split( '/' );
                        // vertex position
                        packed.vertices.push( vertices[ (face[ 0 ] - 1) * 3  ] );
                        packed.vertices.push( vertices[ (face[ 0 ] - 1) * 3 + 1 ] );
                        packed.vertices.push( vertices[ (face[ 0 ] - 1) * 3 + 2 ] );
                        // vertex textures
                        packed.textures.push( textures[ (face[ 1 ] - 1) * 2  ] );
                        packed.textures.push( textures[ (face[ 1 ] - 1) * 2 + 1 ] );
                        // vertex normals
                        packed.norms.push( vertexNormals[ (face[ 2 ] - 1) * 3  ] );
                        packed.norms.push( vertexNormals[ (face[ 2 ] - 1) * 3 + 1 ] );
                        packed.norms.push( vertexNormals[ (face[ 2 ] - 1) * 3 + 2 ] );
                        // add the newly created vertex to the list of indices
                        packed.hashindices[ line[ j ] ] = packed.index;
                        packed.indices.push( packed.index );
                        // increment the counter
                        packed.index += 1;
                    }

                    if(j === 3 && quad) {
                        // add v0/t0/vn0 onto the second triangle
                        packed.indices.push( packed.hashindices[ line[ 0 ] ] );
                    }
                }
            }
        }
        this.vertices = packed.vertices;
        this.vertexNormals = packed.norms;
        this.textures = packed.textures;
        this.indices = packed.indices;
        
        return new Mesh(packed.vertices, packed.norms,  packed.textures, packed.indices);
    }
}