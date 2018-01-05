import {glContext, shaderProgram, pMatrix} from '../common/common';
import {FragmentShader, VertexShader} from "./shader";
let mat3 = require('gl-matrix').mat3;

export class ShaderLoader {
    constructor() {
        this.shaders = [];
    }

    initShaders() {
        let fragmentShader = new FragmentShader(ShaderLoader.getShaderSource('./shader/fragment-shader.glsl'));
        let vertexShader = new VertexShader(ShaderLoader.getShaderSource('./shader/vertex-shader.glsl'));
        
        glContext.attachShader(shaderProgram, vertexShader.shader);
        glContext.attachShader(shaderProgram, fragmentShader.shader);
        glContext.linkProgram(shaderProgram);  // links  webgl context to the shaderProgram

        // If creating the shader program failed, alert
        if (!glContext.getProgramParameter(shaderProgram, glContext.LINK_STATUS)) {
            alert("Unable to initialize the shader program.");
        }

        // start using shading program for rendering
        glContext.useProgram(shaderProgram);

        // store location of aVertexPosition variable defined in shader
        shaderProgram.vertexPositionAttribute = glContext.getAttribLocation(shaderProgram, "aVertexPosition");
        shaderProgram.vertexNormalAttribute = glContext.getAttribLocation(shaderProgram, "aVertexNormal");
        shaderProgram.vertexTextureAttribute = glContext.getAttribLocation(shaderProgram, "aTextureCoordinate");

        // turn on vertex position attribute at specified position
        glContext.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
        glContext.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);
        glContext.enableVertexAttribArray(shaderProgram.vertexTextureAttribute);

        // store location of uPMatrix variable defined in shader - projection matrix
        shaderProgram.projectionMatrixUniform = glContext.getUniformLocation(shaderProgram, "uProjectionMatrix");
        // store location of uMVMatrix variable defined in shader - model-view matrix
        shaderProgram.modelMatrixUniform = glContext.getUniformLocation(shaderProgram, "uModelMatrix");

        shaderProgram.viewMatrixUniform = glContext.getUniformLocation(shaderProgram, "uViewMatrix");

        // store location of uNMatrix variable defined in shader - normal matrix
        shaderProgram.normalMatrixUniform = glContext.getUniformLocation(shaderProgram, "uNormalMatrix");

        // store location of uAmbientColor variable defined in shader
        shaderProgram.ambientColorUniform = glContext.getUniformLocation(shaderProgram, "uAmbientColor");

        // store location of uLightingDirection variable defined in shader
        shaderProgram.lightingDirectionUniform = glContext.getUniformLocation(shaderProgram, "uLightingDirection");

        // store location of uDirectionalColor variable defined in shader
        shaderProgram.directionalColorUniform = glContext.getUniformLocation(shaderProgram, "uDirectionalColor");

        shaderProgram.useTextureUniform = glContext.getUniformLocation(shaderProgram, "uUseTexture");

        // store location of uSampler variable defined in shader
        shaderProgram.samplerUniform = glContext.getUniformLocation(shaderProgram, "uSampler");

        this.shaders.push(vertexShader);
        this.shaders.push(fragmentShader);
    }

    static getShaderSource(path) {
        let request = new XMLHttpRequest();
        request.open("GET", path, false);
        request.send(null);

        if (request.status === 200) {
            return request.responseText;
        } else {
            throw new Error('Shader Script failed to load');
        }
    }

    static setMatrixUniforms(mvMatrix) {
        glContext.uniformMatrix4fv(shaderProgram.projectionMatrixUniform, false, pMatrix);
        glContext.uniformMatrix4fv(shaderProgram.modelMatrixUniform, false, mvMatrix);

        let normalMatrix = mat3.create();
        mat3.normalFromMat4(normalMatrix, mvMatrix);

        glContext.uniformMatrix3fv(shaderProgram.normalMatrixUniform, false, normalMatrix);


    }

    static setViewMatrixUniform(viewMatrix) {
        glContext.uniformMatrix4fv(shaderProgram.viewMatrixUniform, false, viewMatrix);
    }
}

