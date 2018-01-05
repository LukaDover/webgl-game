import {ShaderLoader} from "../../shader/shader-loader";
import {degToRad} from "../../common/common";

let mat4 = require('gl-matrix').mat4;

export class Camera {
    constructor() {
        this.cameraMatrix = mat4.identity(mat4.create());
        this.viewMatrixUniform =  mat4.identity(mat4.create());
    }

    getViewMatrix() {
        this.viewMatrixUniform =  mat4.identity(mat4.create());
        mat4.invert(this.viewMatrixUniform, this.cameraMatrix);
        return this.viewMatrixUniform;
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


export class MovingCamera extends Camera {
    constructor(movingObject) {
        super();
            this.movingObject = movingObject;
            this.zoomMatrix = mat4.identity(mat4.create()); // translational matrix
            this.rotationMatrix = mat4.identity(mat4.create());
            this.rotate(degToRad(-90), [0,0,1]);
            this.rotate(degToRad(30), [1, 0, 0]);
            this.translate([-12,0,6]);
            this.rotate(degToRad(45), [1,0,0]);
    }

    translate(vector3) {
        if (!(this.zoomMatrix[14] > 12 && vector3[2] > 0) && !(this.zoomMatrix[14] < 3 && vector3[2] < 0)) {
            mat4.translate(this.zoomMatrix, this.zoomMatrix, vector3);
        }
    }

    rotate(rad, vector3) {
        mat4.rotate(this.rotationMatrix, this.rotationMatrix, rad, vector3);
    }

    transform() {
        // zoom perseveres, rotation perseveres, object translation + rotation changes

        let cmm = mat4.create();
        mat4.multiply(cmm, this.zoomMatrix, this.rotationMatrix);

        mat4.multiply(this.cameraMatrix, this.movingObject.mvMatrix, cmm);
    }

    getViewMatrix() {
        this.transform();
        this.viewMatrixUniform =  mat4.identity(mat4.create());
        mat4.invert(this.viewMatrixUniform, this.cameraMatrix);
        return this.viewMatrixUniform;
    }
}