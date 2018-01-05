//#version 120

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoordinate;

uniform mat4 uModelMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;
uniform mat4 uViewMatrix;

uniform vec3 uAmbientColor;	// ambient color uniform
uniform vec3 uDirectionalColor;		// light color
uniform vec3 uLightingDirection;	// light direction uniform

uniform bool uUseTexture;

varying vec3 vLightWeighting;
varying vec2 vTextureCoordinate;


void main(void) {
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);
    if (uUseTexture) {
        vTextureCoordinate = aTextureCoordinate;
    }

    vec3 transformedNormal = uNormalMatrix * aVertexNormal;

    // calculate weight for directional light
    float directionalLightWeighting = max(dot(transformedNormal, uLightingDirection), 0.0);

    // calculate lighting
    vLightWeighting = uAmbientColor + uDirectionalColor * directionalLightWeighting;
}
