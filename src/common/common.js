let mat4 = require('gl-matrix').mat4;

export var canvas;
export var glContext;
export var shaderProgram;

export var pMatrix = mat4.create();


export function setPerspective(angle, near, far) {
    mat4.perspective(pMatrix, degToRad(angle), glContext.viewportWidth / glContext.viewportHeight, near, far);
}

export function isPowerOf2(value) {
    return (value & (value - 1)) === 0;
}

export function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

export function initGL() {
    canvas = document.getElementById("glcanvas");
    let gl = null;
    try {
        // Try to grab the standard context. If it fails, fallback to experimental.
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch(e) {
        console.log(e);
    }

    // If we don't have a GL context, give up now
    if (!gl) {
        alert("Unable to initialize WebGL. Your browser may not support it.");
    }

    glContext = gl;

    if (glContext) {
        glContext.clearColor(0.0, 0.0, 0.0, 1.0);                      // Set clear color to black, fully opaque
        glContext.clearDepth(1.0);                                     // Clear everything
        glContext.enable(glContext.DEPTH_TEST);                               // Enable depth testing
        glContext.depthFunc(glContext.LEQUAL);
    }
}

export function initShaderProgram() {
    shaderProgram = glContext.createProgram();
}


