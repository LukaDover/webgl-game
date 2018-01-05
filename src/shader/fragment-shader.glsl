//#version 120

precision mediump float;

varying vec3 vLightWeighting;
varying vec2 vTextureCoordinate;

uniform bool uUseTexture;
uniform vec4 uColorDiffuse;

uniform sampler2D uSampler;

void main(void) {
    vec4 color;
    if (uUseTexture) {
        color = texture2D(uSampler, vec2(vTextureCoordinate.s, vTextureCoordinate.t));
    } else {
        color = uColorDiffuse;
    }

    gl_FragColor = vec4(color.rgb * vLightWeighting, 1.0);
}
