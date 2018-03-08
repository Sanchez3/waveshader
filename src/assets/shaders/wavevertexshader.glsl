precision highp float;
float mirrored(float v) {
 float m = mod(v, 2.0);
 return mix(m, 2.0 - m, step(1.0, m));
}
vec2 mirrored(vec2 v) {
 vec2 m = mod(v, 2.0);
 return mix(m, 2.0 - m, step(1.0, m));
}
vec3 mirrored(vec3 v) {
 vec3 m = mod(v, 2.0);
 return mix(m, 2.0 - m, step(1.0, m));
}
vec4 mirrored(vec4 v) {
 vec4 m = mod(v, 2.0);
 return mix(m, 2.0 - m, step(1.0, m));
}
float linear(float t) {
 return t;
}
float tri(float v) {
 return mix(v, 1.0 - v, step(0.5, v)) * 2.0;
}
vec2 tri(vec2 v) {
 return mix(v, 1.0 - v, step(0.5, v)) * 2.0;
}
vec3 tri(vec3 v) {
 return mix(v, 1.0 - v, step(0.5, v)) * 2.0;
}
vec4 tri(vec4 v) {
 return mix(v, 1.0 - v, step(0.5, v)) * 2.0;
}
varying vec2 vUv;
varying float vDark;
uniform vec4 time;
uniform float progress;
uniform vec2 translate;
uniform vec2 delay;
uniform vec2 accel;
uniform float edge;
uniform vec4 waveAmpFreq;
uniform vec4 waveSpeedPhase;
uniform vec2 waveBlend;
uniform float opacity;
uniform sampler2D texture1;
uniform sampler2D texture2;
void main(void) {
 vec2 uv = vUv;
 
 float delayValue = progress * (1.0 + delay.x + delay.y) - uv.y * delay.y - (1.0 - uv.x) * delay.x;
 delayValue = linear(clamp(delayValue, 0.0, 1.0));
 
 float progressValue = linear(progress);
 vec2 translateValue = progressValue + delayValue * accel.xy;
 vec2 translateValue1 = translate * translateValue;
 vec2 translateValue2 = translate * (translateValue - 1.0 - accel.xy);
 vec2 w = sin(time.y * waveSpeedPhase.xy + uv.yx * waveAmpFreq.zw + waveSpeedPhase.zw) * waveAmpFreq.xy;
 vec2 xy = (tri(progress) * waveBlend.x + tri(delayValue) * waveBlend.y) * w;
 vec2 uv1 = vUv + translateValue1 + xy;
 vec2 uv2 = vUv + translateValue2 + xy;
 vec4 rgba1 = texture2D(texture1, mirrored(uv1));
 vec4 rgba2 = texture2D(texture2, mirrored(uv2));
 float threshold = step(1.0 - uv.x, delayValue);
 vec4 rgba = mix(rgba1, rgba2, mix(delayValue, threshold, edge));
 rgba *= vec4(vec3(vDark), opacity);
 gl_FragColor = rgba;
}
