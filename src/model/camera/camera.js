import {ShaderLoader} from "../../shader/shader-loader";

let mat4 = require('gl-matrix').mat4;

export class Camera {
    constructor() {
        this.cameraMatrix = mat4.identity(mat4.create());
        this.viewMatrix =  mat4.identity(mat4.create());
    }

    computeCameraMatrix() {

    }

    getViewMatrix() {
        this.viewMatrix =  mat4.identity(mat4.create());
        mat4.invert(this.viewMatrix, this.cameraMatrix);
        return this.viewMatrix;
    }

    translate(vector3) {
        mat4.translate(this.cameraMatrix, this.cameraMatrix, vector3);
    }

    rotate(rad, vector3) {
        mat4.rotate(this.cameraMatrix, this.cameraMatrix, rad, vector3);
    }

    setUniforms() {
        let viewMatrix = this.getViewMatrix();
        ShaderLoader.setViewMatrixUniform(viewMatrix);
    }
}