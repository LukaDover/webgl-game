import {glContext, setPerspective} from "../common/common";
import {LightingManager} from "../lighting/lighting-manager";
import {ShaderLoader} from "../shader/shader-loader";
import {shaderProgram} from "../common/common";

export class Renderer {
    constructor() {
        
    }

    static drawScene() {
        glContext.viewport(0, 0, glContext.viewportWidth, glContext.viewportHeight);

        // Clear the canvas before we start drawing on it.
        glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);
    }

    static drawObject(mesh) {


        setPerspective(45, 0.1, 100);

        // // Set the drawing position to the "identity" point, which is
        // // the center of the scene.
        // mat4.identity(mvMatrix);
        //
        // mat4.translate(mvMatrix, [-1.5, 0.0, -15.0]);
        //
        // mat4.translate(mvMatrix, [meshes.cube.cubeBody.position.x, meshes.cube.cubeBody.position.y, meshes.cube.cubeBody.position.z]);

        let lighting = LightingManager.instance;
        lighting.setLighting();

        // IMPORTED MESH
        glContext.bindBuffer(glContext.ARRAY_BUFFER, mesh.vertexBuffer);
        glContext.vertexAttribPointer(shaderProgram.vertexPositionAttribute, mesh.vertexBuffer.itemSize, glContext.FLOAT, false, 0, 0);

        // bind normal buffer
        glContext.bindBuffer(glContext.ARRAY_BUFFER, mesh.normalBuffer);
        glContext.vertexAttribPointer(shaderProgram.vertexNormalAttribute, mesh.normalBuffer.itemSize, glContext.FLOAT, false, 0, 0);

        // bind index buffer
        glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);

        glContext.drawElements(glContext.TRIANGLES, mesh.indexBuffer.numItems, glContext.UNSIGNED_SHORT, 0);
    }
}
