precision highp float;

#define PI_H 1.5707963267948966

attribute vec3 position;
attribute vec2 uv;
varying float vDark;
varying vec2 vUv;
uniform vec3 textureSize;
uniform vec3 hover;
uniform vec4 corners;
uniform float sway;
uniform float zoomScale;
uniform vec4 time;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform vec3 cameraPosition;
const float AREA1 = 300.0;
const float AREA2 = 700.0;
void main(void) {
 vUv = uv;
 float _corners = mix(mix(corners.z, corners.w, uv.x), mix(corners.x, corners.y, uv.x), uv.y);

 vec3 _position = position;
 vec4 _slide = vec4(_position, 1.0);
 _slide.z += zoomScale;

 vec4 _list = modelMatrix * vec4(position, 1.0);

 float _len1 = length((uv - hover.xy) * textureSize.xy);
 float _str1 = max(0.0, (1.0 - _len1 / AREA1));
 float _len2 = length(_list.xy);
 float _str2 = clamp(1.0 - _len2 / AREA2, 0.25, 1.0);
 float _sway1 = (
 sin(time.y * 1.0 + _len2 / 256.0) * 128.0 +
 sin(time.y * 2.0 + _len2 / 32.0) * 64.0
 ) * sway;
 float _sway2 = sin(time.y * 1.0 + _len1 / 32.0) * 24.0 * _str1 * _str2 * hover.z;
 _list.z += _sway1 + _sway2;
 _slide.z += _sway1;
 vDark = mix(1.0, 0.7, _corners);
 gl_Position = projectionMatrix * viewMatrix * mix(_list, _slide, _corners);
}