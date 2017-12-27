import {shaderProgram, glContext} from "../common/common";
let vec3 = require('gl-matrix').vec3;

let _singleton = Symbol();

export class LightingManager {

    constructor(singletonToken) {
        if (_singleton !== singletonToken)
            throw new Error('Cannot instantiate directly.');
    }

    static get instance() {
        if(!this[_singleton])
            this[_singleton] = new LightingManager(_singleton);

        return this[_singleton]
    }

    setLighting() {
        // set uniforms for lights as defined in the document
        glContext.uniform3f(
            shaderProgram.ambientColorUniform,
            0.2,
            0.2,
            0.2
        );

        let lightingDirection = [
            -0.25,
            -0.25,
            -1.0
        ];
        let adjustedLD = vec3.create();
        vec3.normalize(lightingDirection, adjustedLD);
        vec3.scale(adjustedLD, adjustedLD, -1);
        glContext.uniform3fv(shaderProgram.lightingDirectionUniform, adjustedLD);

        glContext.uniform3f(
            shaderProgram.directionalColorUniform,
            0.8,
            0.8,
            0.8
        );
    }
}

