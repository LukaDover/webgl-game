import {glContext, shaderProgram, pMatrix} from '../common/common';
let mat3 = require('gl-matrix').mat3;

export class ShaderLoader {
    constructor() {
        this.shaders = [];
    }

    initShaders() {
        let fragmentShader = this.getShader(glContext, "shader-fs");
        let vertexShader = this.getShader(glContext, "shader-vs");
        
        glContext.attachShader(shaderProgram, vertexShader);
        glContext.attachShader(shaderProgram, fragmentShader);
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

        // turn on vertex position attribute at specified position
        glContext.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
        glContext.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

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

        this.shaders.push(vertexShader);
        this.shaders.push(fragmentShader);
    }

    getShader(gl, id) {

        let shaderScript = document.getElementById(id);

        // Didn't find an element with the specified ID; abort.
        if (!shaderScript) {
            return null;
        }

        // Walk through the source element's children, building the
        // shader source string.
        let shaderSource = "";
        let currentChild = shaderScript.firstChild;
        while (currentChild) {
            if (currentChild.nodeType === 3) {
                shaderSource += currentChild.textContent;
            }
            currentChild = currentChild.nextSibling;
        }

        // Now figure out what type of shader script we have,
        // based on its MIME type.
        let shader;
        if (shaderScript.type === "x-shader/x-fragment") {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (shaderScript.type === "x-shader/x-vertex") {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            return null;  // Unknown shader type
        }

        // Send the source to the shader object
        gl.shaderSource(shader, shaderSource);

        // Compile the shader program
        gl.compileShader(shader);

        // See if it compiled successfully
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
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

