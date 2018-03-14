module.exports="precision highp float;\n#define PI_H 1.5707963267948966\nattribute vec3 position;\nattribute vec2 uv;\nvarying float vDark;\nvarying vec2 vUv;\nuniform vec3 textureSize;\nuniform vec3 hover;\nuniform vec4 corners;\nuniform float sway;\nuniform float zoomScale;\nuniform vec4 time;\nuniform mat4 modelMatrix;\nuniform mat4 viewMatrix;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform vec3 cameraPosition;\nconst float AREA1 = 300.0;\nconst float AREA2 = 700.0;\nvoid main(void) {\n vUv = uv;\n float _corners = mix(mix(corners.z, corners.w, uv.x), mix(corners.x, corners.y, uv.x), uv.y);\n \n vec3 _position = position;\n vec4 _slide = vec4(_position, 1.0);\n _slide.z += zoomScale;\n \n vec4 _list = modelMatrix * vec4(position, 1.0);\n \n float _len1 = length((uv - hover.xy) * textureSize.xy);\n float _str1 = max(0.0, (1.0 - _len1 / AREA1));\n float _len2 = length(_list.xy);\n float _str2 = clamp(1.0 - _len2 / AREA2, 0.25, 1.0);\n float _sway1 = (\n sin(time.y * 1.0 + _len2 / 256.0) * 128.0 +\n sin(time.y * 2.0 + _len2 / 32.0) * 64.0\n ) * sway;\n float _sway2 = sin(time.y * 1.0 + _len1 / 32.0) * 24.0 * _str1 * _str2 * hover.z;\n _list.z += _sway1 + _sway2;\n _slide.z += _sway1;\n vDark = mix(1.0, 0.7, _corners);\n gl_Position = projectionMatrix * viewMatrix * mix(_list, _slide, _corners);\n};";