import {glContext} from "../common/common";

class Shader {
    constructor(shaderSource, shaderType) {
        this.shader = glContext.createShader(shaderType);
        glContext.shaderSource(this.shader, shaderSource);

        glContext.compileShader(this.shader);

        if (!glContext.getShaderParameter(this.shader, glContext.COMPILE_STATUS)) {
            alert(glContext.getShaderInfoLog(this.shader));
        }
    }
}

export class VertexShader extends Shader {
    constructor(shaderSource) {
        super(shaderSource, glContext.VERTEX_SHADER)
    }
}

export class FragmentShader extends Shader {
    constructor(shaderSource) {
        super(shaderSource, glContext.FRAGMENT_SHADER);
    }
}


