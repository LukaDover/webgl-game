import {ObjectLoader} from "./object-loader";
import {Collider} from "../collider/collider";
import {BufferManager} from "../shader/buffer-manager";
import {Renderer} from "../render/renderer";
import {ShaderLoader} from "../shader/shader-loader";
import {downloadModels} from "webgl-obj-loader";
import {glContext, isPowerOf2, shaderProgram} from "../common/common";

let CANNON = require('cannon');
let mat4 = require('gl-matrix').mat4;


export class GameObject {
    constructor(dataPath) {
        this.dataPath = dataPath;
        this.mesh = ObjectLoader.getMesh(ObjectLoader.getObjectData(this.dataPath));
        this.mvMatrix = mat4.identity(mat4.create());
        this.texture = null;
        this.textureIsLoaded = false;
    }

    render() {
        this.setMatrixUniforms();
        Renderer.drawObject(this);
    }

    setMatrixUniforms() {
        this.setTexture();
        glContext.uniform1i(shaderProgram.useTextureUniform, this.usesTexture());  // Affects the flow in shader programs
        ShaderLoader.setMatrixUniforms(this.mvMatrix);
    }

    setTexture() {
        if (this.usesTexture()) {
            glContext.activeTexture(glContext.TEXTURE0);
            glContext.bindTexture(glContext.TEXTURE_2D, this.texture);
            glContext.uniform1i(shaderProgram.samplerUniform, 0);
        }
    }

    initializeBuffers() {
        this.bufferManager = new BufferManager(this.mesh);
        this.bufferManager.initializeMeshBuffers();
    }

    /**
     *
     * @param t - translation matrix
     * @param r - rotation matrix
     * @param s - scaling matrix
     */
    setInitialPosition(t, r, s) {
        mat4.translate(this.mvMatrix, this.mvMatrix, t);
    }

     getTexture(path) {
        let thisObject = this;
        thisObject.texture = glContext.createTexture();
        thisObject.texture.image = new Image();

        thisObject.texture.image.onload = function() {
            thisObject.handleLoadedTexture();
        };
        thisObject.texture.image.src = path;
    }

    handleLoadedTexture() {
        glContext.pixelStorei(glContext.UNPACK_FLIP_Y_WEBGL, true);

        // Third texture usus Linear interpolation approximation with nearest Mipmap selection
        glContext.bindTexture(glContext.TEXTURE_2D, this.texture);
        glContext.texImage2D(glContext.TEXTURE_2D, 0, glContext.RGBA, glContext.RGBA, glContext.UNSIGNED_BYTE, this.texture.image);

        if (isPowerOf2(this.texture.image.height) && isPowerOf2(this.texture.image.width)) {
            glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MAG_FILTER, glContext.LINEAR);
            glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MIN_FILTER, glContext.LINEAR_MIPMAP_NEAREST);
            glContext.generateMipmap(glContext.TEXTURE_2D);
        } else {
            glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_WRAP_S, glContext.CLAMP_TO_EDGE);
            glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_WRAP_T, glContext.CLAMP_TO_EDGE);
            glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MIN_FILTER, glContext.LINEAR);
        }

        glContext.bindTexture(glContext.TEXTURE_2D, null);

        this.textureIsLoaded = true;
    }

    usesTexture() {
        return this.texture != null && this.texture.image.complete && this.textureIsLoaded;
    }
}

export class MovingObject extends GameObject{
    constructor(dataPath) {
        super(dataPath);
        this.body = Collider.getMovingBodyFromMesh(this.mesh);  // CANNON.Body
        this.translationMatrix = mat4.identity(mat4.create());
        this.rotationMatrix = mat4.identity(mat4.create());
        this.mvMatrix = mat4.identity(mat4.create());
        this.children = [];
    }

    _translate() {
        //mat4.translate(this.mvMatrix, this.mvMatrix, [this.body.position.x, this.body.position.y, this.body.position.z]);
        mat4.fromTranslation(this.translationMatrix, [this.body.position.x, this.body.position.y, this.body.position.z])
    }

    _rotate() {
        let q = this.body.quaternion;
        mat4.fromQuat(this.rotationMatrix, [q.x, q.y, q.z, q.w]);
    }

    _scale() {

    }

    transform() {
        this.mvMatrix = this._getIdentityMatrix();
        this._translate();
        this._rotate();
        this._scale();

        mat4.multiply(this.mvMatrix, this.translationMatrix, this.rotationMatrix);

        if (this.hasChildren()) {
            this.children.forEach(function(child) {
                child.transform();
            })
        }
    }

    _getIdentityMatrix() {
        return mat4.identity(mat4.create());
    }


    hasChildren() {
        return this.children.length > 0;
    }
}

export class ChildObject extends MovingObject {
    constructor(dataPath) {
        super(dataPath);
    }
}

export class StationaryObject extends GameObject {
    // without transformations
    constructor(dataPath) {
        super(dataPath);
        this.body = Collider.getStaticBodyFromMesh(this.mesh);
    }

    setPosition() {
        mat4.translate(this.mvMatrix, this.mvMatrix, [this.body.position.x, this.body.position.y, this.body.position.z]);
    }
}