// Main loop of the game
import {glContext, initGL, initShaderProgram, pMatrix} from "./common/common";
import {ChildObject, MovingObject, StationaryObject} from "./model/game-object";
import {ShaderLoader} from "./shader/shader-loader";
import {Renderer} from "./render/renderer";
import {Vehicle} from "./model/vehicle/vehicle";
import {Handler} from "./interface/keyboard-handler";
import {initKeyboard} from "./interface/keyboard-handler";
import {Camera, MovingCamera} from "./model/camera/camera";
import {MouseHandler} from "./interface/mouse-handler";
import {Scene} from "./scene/scene";

var CANNON = require('cannon');



function simulation() {
    // Setup our world
    let world = new CANNON.World();
    world.gravity.set(0, 0, -9.82); // m/s²
    world.defaultContactMaterial.friction = 0;


    let vehicle = new Vehicle('./blender/vehicle/vehicle.obj');
    vehicle.initializeBuffers();
    vehicle.initializeVehicle();
    //vehicle.getTexture('./blender/textures/wood.jpg');

// Create a plane
    let ground = new StationaryObject('./blender/scene/ground.obj');
    ground.getTexture('./blender/textures/asphalt.jpg');
    ground.initializeBuffers();
    let groundBody = new CANNON.Body({
        mass: 0, // mass == 0 makes the body static
        position: new CANNON.Vec3(0, 0, -20),
        material:  new CANNON.Material("groundMaterial")
});
    let groundShape = new CANNON.Plane();
    groundBody.addShape(groundShape);
    ground.body = groundBody;
    ground.setPosition();
    world.add(groundBody);

    // Contact material
    let wheelGroundContactMaterial = new CANNON.ContactMaterial(
        vehicle.wheelMaterial,
        groundBody.material,
        {
            friction: 0.3,
            restitution: 0,
            contactEquationStiffness: 1000
        }
    );

    world.addContactMaterial(wheelGroundContactMaterial);

    vehicle.vehicle.addToWorld(world);

    let update = vehicle.update.bind(vehicle);
    world.addEventListener('postStep', update);
    let keyboardHandler = new Handler(vehicle.vehicle);
    initKeyboard(keyboardHandler);

    // Create a camera
    let camera = new MovingCamera(vehicle);

    let mouseHandler = new MouseHandler(camera);
    let handleEvent = mouseHandler.handleEvent.bind(mouseHandler);
    let handleScroll = mouseHandler.handleScroll.bind(mouseHandler);
    document.onmousemove = handleEvent;
    document.onwheel = handleScroll;

    let fixedTimeStep = 1.0 / 60.0; // seconds
    let maxSubSteps = 3;

    //Scene
    let scene = new Scene();
    scene.initScene(world);

// Start the simulation loop
    let lastTime;
    (function simloop(time){
        requestAnimationFrame(simloop);
        if(lastTime !== undefined){
            let dt = (time - lastTime) / 1000;
            world.step(fixedTimeStep, dt, maxSubSteps);
        }

        lastTime = time;
        vehicle.transform();
        if(vehicle.chassisBody.position.x > 290 && vehicle.chassisBody.position.x > -300){
            alert("Bravo, konec igre!");
        }else if(vehicle.chassisBody.position.x < -300){
            alert("Napačna smer!")
        }
        Renderer.drawScene();
        camera.setUniforms();
        ground.render();
        scene.render();
        vehicle.render();
    })();
}

function start() {

    initGL();
    initShaderProgram();

    let shaderLoader = new ShaderLoader();
    shaderLoader.initShaders();

    simulation();
}

window.onload=start;