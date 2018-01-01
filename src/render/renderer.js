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

        let lighting = LightingManager.instance;
        lighting.setLighting();
    }

    static drawObject(object) {


        setPerspective(45, 0.1, 100);

        // bind vertex buffer
        glContext.bindBuffer(glContext.ARRAY_BUFFER, object.mesh.vertexBuffer);
        glContext.vertexAttribPointer(shaderProgram.vertexPositionAttribute, object.mesh.vertexBuffer.itemSize, glContext.FLOAT, false, 0, 0);

        // bind normal buffer
        glContext.bindBuffer(glContext.ARRAY_BUFFER, object.mesh.normalBuffer);
        glContext.vertexAttribPointer(shaderProgram.vertexNormalAttribute, object.mesh.normalBuffer.itemSize, glContext.FLOAT, false, 0, 0);

        // bind texture buffer
        if (object.usesTexture()) {
            glContext.enableVertexAttribArray(shaderProgram.vertexTextureAttribute);
            glContext.bindBuffer(glContext.ARRAY_BUFFER, object.mesh.textureBuffer);
            glContext.vertexAttribPointer(shaderProgram.vertexTextureAttribute, object.mesh.textureBuffer.itemSize, glContext.FLOAT, false, 0, 0);
        } else {
            glContext.disableVertexAttribArray(shaderProgram.vertexTextureAttribute);
        }

        // bind index buffer
        glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, object.mesh.indexBuffer);

        glContext.drawElements(glContext.TRIANGLES, object.mesh.indexBuffer.numItems, glContext.UNSIGNED_SHORT, 0);
    }
}
