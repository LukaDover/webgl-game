// Global variable definition
var canvas;
var gl;
var shaderProgram;

var currentlyPressedKeys = {};

// Object .obj
var meshes;


// Buffers
var cubeVertexPositionBuffer;
var cubeVertexNormalBuffer;
var cubeVertexIndexBuffer;
var cubeVertexTextureBuffer;

var cubeForce = new CANNON.Vec3(0, 0, 0);

var treeVertexIndexBuffer;
var treeVertexPositionBuffer;
var treeVertexNormalBuffer;
var treeVertexTextureBuffer;


// Model-View and Projection matrices
var mvMatrix = mat4.create();
var pMatrix = mat4.create();
var mvMatrix = mat4.create();

var r = 0;
function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

//
// initGL
//
// Initialize WebGL, returning the GL context or null if
// WebGL isn't available or could not be initialized.
//
function initGL(canvas) {
    var gl = null;
    try {
        // Try to grab the standard context. If it fails, fallback to experimental.
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch(e) {}

    // If we don't have a GL context, give up now
    if (!gl) {
        alert("Unable to initialize WebGL. Your browser may not support it.");
    }
    return gl;
}

//
// getShader
//
// Loads a shader program by scouring the current document,
// looking for a script with the specified ID.
//
function getShader(gl, id) {
    var shaderScript = document.getElementById(id);

    // Didn't find an element with the specified ID; abort.
    if (!shaderScript) {
        return null;
    }

    // Walk through the source element's children, building the
    // shader source string.
    var shaderSource = "";
    var currentChild = shaderScript.firstChild;
    while (currentChild) {
        if (currentChild.nodeType == 3) {
            shaderSource += currentChild.textContent;
        }
        currentChild = currentChild.nextSibling;
    }

    // Now figure out what type of shader script we have,
    // based on its MIME type.
    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
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

//
// initShaders
//
// Initialize the shaders, so WebGL knows how to light our scene.
//
function initShaders() {
    var fragmentShader = getShader(gl, "shader-fs");
    var vertexShader = getShader(gl, "shader-vs");

    // Create the shader program
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);  // links  webgl context to the shaderProgram

    // If creating the shader program failed, alert
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Unable to initialize the shader program.");
    }

    // start using shading program for rendering
    gl.useProgram(shaderProgram);

    // store location of aVertexPosition variable defined in shader
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");

    // turn on vertex position attribute at specified position
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
    gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

    // store location of uPMatrix variable defined in shader - projection matrix
    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    // store location of uMVMatrix variable defined in shader - model-view matrix
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    // store location of uNMatrix variable defined in shader - normal matrix
    shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");

    // store location of uAmbientColor variable defined in shader
    shaderProgram.ambientColorUniform = gl.getUniformLocation(shaderProgram, "uAmbientColor");

    // store location of uLightingDirection variable defined in shader
    shaderProgram.lightingDirectionUniform = gl.getUniformLocation(shaderProgram, "uLightingDirection");

    // store location of uDirectionalColor variable defined in shader
    shaderProgram.directionalColorUniform = gl.getUniformLocation(shaderProgram, "uDirectionalColor");
}

//
// setMatrixUniforms
//
// Set the uniform values in shaders for model-view and projection matrix.
//
function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);

    var normalMatrix = mat3.create();
    mat4.toInverseMat3(mvMatrix, normalMatrix);
    mat3.transpose(normalMatrix);
    gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);
}

//
// initBuffers
//
// Initialize the buffers we'll need. For this demo, we just have
// two objects -- a simple two-dimensional triangle and square.
//
function initBuffers() {

    // Create Buffers for Imported Cube
    cubeVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(meshes.cube.vertices), gl.STATIC_DRAW);
    cubeVertexPositionBuffer.itemSize = 3;
    cubeVertexPositionBuffer.numItems = meshes.cube.vertices.length / 3;

    cubeVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);

    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(meshes.cube.indices), gl.STATIC_DRAW);
    cubeVertexIndexBuffer.itemSize = 1;
    cubeVertexIndexBuffer.numItems = meshes.cube.indices.length;

    // Cube normals
    cubeVertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexNormalBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(meshes.cube.vertexNormals), gl.STATIC_DRAW);
    cubeVertexNormalBuffer.itemSize = 3;
    cubeVertexNormalBuffer.numItems = meshes.cube.vertexNormals.length / 3;

    // Create buffers for tree

    treeVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, treeVertexPositionBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(meshes.tree.vertices), gl.STATIC_DRAW);
    treeVertexPositionBuffer.itemSize = 3;
    treeVertexPositionBuffer.numItems = meshes.tree.vertices.length / 3;

    treeVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, treeVertexIndexBuffer);

    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(meshes.tree.indices), gl.STATIC_DRAW);
    treeVertexIndexBuffer.itemSize = 1;
    treeVertexIndexBuffer.numItems = meshes.tree.indices.length;

    // Tree normals
    treeVertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, treeVertexNormalBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(meshes.tree.vertexNormals), gl.STATIC_DRAW);
    treeVertexNormalBuffer.itemSize = 3;
    treeVertexNormalBuffer.numItems = meshes.tree.vertexNormals.length / 3;
}

//
// drawScene
//
// Draw the scene.
//
function setLighting() {
    // set uniforms for lights as defined in the document
    gl.uniform3f(
        shaderProgram.ambientColorUniform,
        0.2,
        0.2,
        0.2
    );

    var lightingDirection = [
        -0.25,
        -0.25,
        -1.0
    ];
    var adjustedLD = vec3.create();
    vec3.normalize(lightingDirection, adjustedLD);
    vec3.scale(adjustedLD, -1);
    gl.uniform3fv(shaderProgram.lightingDirectionUniform, adjustedLD);

    gl.uniform3f(
        shaderProgram.directionalColorUniform,
        0.8,
        0.8,
        0.8
    );
}
function drawScene() {
    // set the rendering environment to full canvas size
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

    // Clear the canvas before we start drawing on it.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Establish the perspective with which we want to view the
    // scene. Our field of view is 45 degrees, with a width/height
    // ratio, and we only want to see objects between 0.1 units
    // and 100 units away from the camera.
    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

    // Set the drawing position to the "identity" point, which is
    // the center of the scene.
    mat4.identity(mvMatrix);

    mat4.translate(mvMatrix, [-1.5, 0.0, -15.0]);

    mat4.translate(mvMatrix, [meshes.cube.cubeBody.position.x, meshes.cube.cubeBody.position.y, meshes.cube.cubeBody.position.z]);

    setLighting();

    // IMPORTED CUBE
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // bind normal buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, cubeVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // Draw the cube.
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

    // Draw tree
    //
    // gl.bindBuffer(gl.ARRAY_BUFFER, treeVertexPositionBuffer);
    // gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, treeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    //
    // // bind normal buffer
    // gl.bindBuffer(gl.ARRAY_BUFFER, treeVertexNormalBuffer);
    // gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, treeVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
    //
    // // Draw the cube.
    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, treeVertexIndexBuffer);
    // setMatrixUniforms();
    // gl.drawElements(gl.TRIANGLES, treeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

function downloadMeshes() {
    // var request = new XMLHttpRequest();
    // request.open("GET", "./assets/cube.obj");
    // request.onreadystatechange = function () {
    //     if (request.readyState == 4) {
    //         initObjects(request.responseText);
    //     }
    // }
    $(document).ready(function() {
        obj_utils.downloadMeshes(
            {
                'cube': './assets/cube.obj',
                'tree': './assets/Tree.obj'
            },
            initObjects
        );
    });

}

function initObjects(objMeshes) {
    meshes = objMeshes;
    // mesh = new obj_loader.Mesh( document.getElementById( 'mesh' ).innerHTML );

    initBuffers();
    simulation();


}

function handleKeyDown(event) {
    console.log(event);
    currentlyPressedKeys[event.keyCode] = true;
}

function handleKeyUp(event) {
    currentlyPressedKeys[event.keyCode] = false;
}

function handleKeys() {
    cubeForce = new CANNON.Vec3(0, 0, 0);
    // if (currentlyPressedKeys[33]) positionCubeZ -= 0.05; // Page up
    // if (currentlyPressedKeys[34]) positionCubeZ += 0.05; // Page Down

    if (currentlyPressedKeys[37]) cubeForce.x -= 100; // Left
    if (currentlyPressedKeys[39]) cubeForce.x += 100; // Right
    if (currentlyPressedKeys[38]) cubeForce.z -= 100; // Up
    if (currentlyPressedKeys[40]) cubeForce.z += 100; // Down

    console.log("Set cube force to:");
    console.log(cubeForce.x, cubeForce.y, cubeForce.z);
}

function simulation() {
    // Setup our world
    var world = new CANNON.World();
    world.gravity.set(0, 0, -9.82); // m/s²

// Create a cube
    var cubeBody = new CANNON.Body({
        mass: 5, // kg
        position: new CANNON.Vec3(0, 0, 10), // m
        shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1))
    });
    world.add(cubeBody);

    meshes.cube.cubeBody = cubeBody;

// Create a plane
    var groundBody = new CANNON.Body({
        mass: 0 // mass == 0 makes the body static
    });
    var groundShape = new CANNON.Plane();
    groundBody.addShape(groundShape);
    world.add(groundBody);

    var fixedTimeStep = 1.0 / 60.0; // seconds
    var maxSubSteps = 3;

// Start the simulation loop
    var lastTime;
    (function simloop(time){
        requestAnimationFrame(simloop);
        if(lastTime !== undefined){
            var dt = (time - lastTime) / 1000;
            world.step(fixedTimeStep, dt, maxSubSteps);
        }
        handleKeys();
        cubeBody.applyForce(cubeForce, cubeBody.position);
        cubeForce = new CANNON.Vec3(0, 0, 0); // RESET
        lastTime = time;
        drawScene();
    })();
}

//
// start
//
// Called when the canvas is created to get the ball rolling.
// Figuratively, that is. There's nothing moving in this demo.
//
function start() {
    canvas = document.getElementById("glcanvas");


    gl = initGL(canvas);      // Initialize the GL context

    // Only continue if WebGL is available and working
    if (gl) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);                      // Set clear color to black, fully opaque
        gl.clearDepth(1.0);                                     // Clear everything
        gl.enable(gl.DEPTH_TEST);                               // Enable depth testing
        gl.depthFunc(gl.LEQUAL);                                // Near things obscure far things

        document.onkeydown = handleKeyDown;
        document.onkeyup = handleKeyUp;

        // Initialize the shaders; this is where all the lighting for the
        // vertices and so forth is established.
        initShaders();

        downloadMeshes();
    }
}