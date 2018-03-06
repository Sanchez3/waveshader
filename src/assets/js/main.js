/**
 * Created by sanchez 
 */
'use strict';

var container, stats;
var camera, scene, renderer;
var shaderMaterial;
var manager;
var constWork = {};
var params = {};

//o69
function o69(e, t) {
    e.exports = "precision highp float;\nuniform float opacity;\nvoid main(void) {\n gl_FragColor = vec4(0.0, 0.0, 0.0, opacity);\n}\n"
}//o70
function o70(e, t) {
    e.exports = "precision highp float;\n#define PRECISION 0.000001\nattribute vec3 position;\nattribute vec3 position2;\nuniform vec4 size;\nuniform vec4 time;\nuniform vec2 center;\nuniform vec4 progress;\nuniform vec4 corners;\nuniform mat4 modelMatrix;\nuniform mat4 viewMatrix;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform vec3 cameraPosition;\nvoid main(void) {\n vec2 _uv = position2.xy + 0.5;\n vec2 _corners = (mix(mix(corners.z, corners.w, _uv.x), mix(corners.x, corners.y, _uv.x), _uv.y) * 0.5 + 0.5) * size.xy;\n vec2 _center = mix(center, vec2(0.0), progress.x);\n vec2 _circle = position.xy * mix(vec2(158.0), _corners, progress.z);\n vec2 _rect = position2.xy * mix(vec2(158.0) * vec2(size.z, 1.0), _corners, progress.z);\n vec2 _shape = mix(_circle, _rect, progress.y);\n float _nonzero = float(position.x != 0.0);\n vec2 _pos = mix(vec2(PRECISION), position.xy, _nonzero);\n float rad = atan(_pos.y, _pos.x);\n float s = time.x * 20.0 + rad * 3.0;\n float v = sin(s) * 0.5 + 0.5;\n _shape *= 1.0 + v * 0.2 * progress.w;\n _shape += _center;\n gl_Position = projectionMatrix * viewMatrix * vec4(_shape, 0.0, 1.0);\n}"
}//o71
function o71(e, t) {
    e.exports = "precision highp float;\nfloat mirrored(float v) {\n float m = mod(v, 2.0);\n return mix(m, 2.0 - m, step(1.0, m));\n}\nvec2 mirrored(vec2 v) {\n vec2 m = mod(v, 2.0);\n return mix(m, 2.0 - m, step(1.0, m));\n}\nvec3 mirrored(vec3 v) {\n vec3 m = mod(v, 2.0);\n return mix(m, 2.0 - m, step(1.0, m));\n}\nvec4 mirrored(vec4 v) {\n vec4 m = mod(v, 2.0);\n return mix(m, 2.0 - m, step(1.0, m));\n}\nfloat tri(float v) {\n return mix(v, 1.0 - v, step(0.5, v)) * 2.0;\n}\nvec2 tri(vec2 v) {\n return mix(v, 1.0 - v, step(0.5, v)) * 2.0;\n}\nvec3 tri(vec3 v) {\n return mix(v, 1.0 - v, step(0.5, v)) * 2.0;\n}\nvec4 tri(vec4 v) {\n return mix(v, 1.0 - v, step(0.5, v)) * 2.0;\n}\n#define PI_2 6.283185307179586\nfloat exponentialOut(float t) {\n return t == 1.0 ? t : 1.0 - pow(2.0, -10.0 * t);\n}\nvarying vec4 vUv;\nuniform vec4 time;\nuniform float progress;\nuniform vec4 translateDelay;\nuniform vec2 accel;\nuniform vec4 waveAmpFreq;\nuniform vec4 waveSpeedBlend;\nuniform vec3 pixels;\nuniform sampler2D texture;\nvoid main(void) {\n vec2 uv = gl_FragCoord.xy / pixels.xy;\n float delayY = translateDelay.w + sin(time.y * 2.0 + uv.x * PI_2) * 0.2;\n float progressValue = 1.0 - progress;\n \n float delayValue = progressValue * (1.0 + translateDelay.z + delayY) - uv.y * delayY - (1.0 - uv.x) * translateDelay.z;\n delayValue = clamp(delayValue, 0.0, 1.0);\n \n vec2 translateValue = progressValue + delayValue * accel;\n vec2 translateValue1 = translateDelay.xy * translateValue;\n vec2 w = sin(time.y * waveSpeedBlend.xy + vUv.wz * waveAmpFreq.zw) * waveAmpFreq.xy;\n vec2 xy = (tri(progressValue) * waveSpeedBlend.z + tri(delayValue) * waveSpeedBlend.w) * w;\n vec2 uv1 = vUv.xy + translateValue1 + xy;\n vec4 rgba1 = texture2D(texture, mirrored(uv1));\n vec4 rgba2 = vec4(vec3(1.0), exponentialOut(1.0 - delayValue));\n vec4 rgba = mix(rgba1, rgba2, delayValue);\n rgba.rgb *= 0.7;\n gl_FragColor = rgba;\n \n}\n"
}
//o72
function o72(e, t) {
    e.exports = "precision highp float;\nmat2 rotate(float rad) {\n float c = cos(rad);\n float s = sin(rad);\n return mat2(\n c, s,\n -s, c\n );\n}\n#define PI_H 1.5707963267948966\nattribute vec3 position;\nattribute vec2 uv;\nvarying vec4 vUv;\nuniform vec4 uvRate;\nuniform mat4 modelMatrix;\nuniform mat4 viewMatrix;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform vec3 cameraPosition;\nuniform float rotation;\nvoid main(void) {\n vec2 _uv = uv - 0.5;\n vec2 _uv1 = _uv;\n _uv1 *= uvRate.xy;\n _uv1 += 0.5;\n vec2 _uv2 = _uv;\n _uv2 *= uvRate.zw;\n _uv2 = rotate(PI_H) * _uv2;\n _uv2 += 0.5;\n vUv.xy = mix(_uv1, _uv2, rotation);\n _uv = rotate(PI_H * rotation) * _uv;\n _uv += 0.5;\n vUv.zw = _uv;\n vec4 posWorld = modelMatrix * vec4(position, 1.0);\n gl_Position = projectionMatrix * viewMatrix * posWorld;\n}"
}
//o73
function o73(e, t) {
    e.exports = "precision highp float;\nfloat mirrored(float v) {\n float m = mod(v, 2.0);\n return mix(m, 2.0 - m, step(1.0, m));\n}\nvec2 mirrored(vec2 v) {\n vec2 m = mod(v, 2.0);\n return mix(m, 2.0 - m, step(1.0, m));\n}\nvec3 mirrored(vec3 v) {\n vec3 m = mod(v, 2.0);\n return mix(m, 2.0 - m, step(1.0, m));\n}\nvec4 mirrored(vec4 v) {\n vec4 m = mod(v, 2.0);\n return mix(m, 2.0 - m, step(1.0, m));\n}\nfloat linear(float t) {\n return t;\n}\nfloat tri(float v) {\n return mix(v, 1.0 - v, step(0.5, v)) * 2.0;\n}\nvec2 tri(vec2 v) {\n return mix(v, 1.0 - v, step(0.5, v)) * 2.0;\n}\nvec3 tri(vec3 v) {\n return mix(v, 1.0 - v, step(0.5, v)) * 2.0;\n}\nvec4 tri(vec4 v) {\n return mix(v, 1.0 - v, step(0.5, v)) * 2.0;\n}\nvarying vec2 vUv;\nvarying float vDark;\nuniform vec4 time;\nuniform float progress;\nuniform vec2 translate;\nuniform vec2 delay;\nuniform vec2 accel;\nuniform float edge;\nuniform vec4 waveAmpFreq;\nuniform vec4 waveSpeedPhase;\nuniform vec2 waveBlend;\nuniform float opacity;\nuniform sampler2D texture1;\nuniform sampler2D texture2;\nvoid main(void) {\n vec2 uv = vUv;\n \n float delayValue = progress * (1.0 + delay.x + delay.y) - uv.y * delay.y - (1.0 - uv.x) * delay.x;\n delayValue = linear(clamp(delayValue, 0.0, 1.0));\n \n float progressValue = linear(progress);\n vec2 translateValue = progressValue + delayValue * accel.xy;\n vec2 translateValue1 = translate * translateValue;\n vec2 translateValue2 = translate * (translateValue - 1.0 - accel.xy);\n vec2 w = sin(time.y * waveSpeedPhase.xy + uv.yx * waveAmpFreq.zw + waveSpeedPhase.zw) * waveAmpFreq.xy;\n vec2 xy = (tri(progress) * waveBlend.x + tri(delayValue) * waveBlend.y) * w;\n vec2 uv1 = vUv + translateValue1 + xy;\n vec2 uv2 = vUv + translateValue2 + xy;\n vec4 rgba1 = texture2D(texture1, mirrored(uv1));\n vec4 rgba2 = texture2D(texture2, mirrored(uv2));\n float threshold = step(1.0 - uv.x, delayValue);\n vec4 rgba = mix(rgba1, rgba2, mix(delayValue, threshold, edge));\n rgba *= vec4(vec3(vDark), opacity);\n gl_FragColor = rgba;\n}"
}
//o74
function o74(e, t) {
    e.exports = "precision highp float;\n#define PI_H 1.5707963267948966\nattribute vec3 position;\nattribute vec2 uv;\nvarying float vDark;\nvarying vec2 vUv;\nuniform vec3 textureSize;\nuniform vec3 hover;\nuniform vec4 corners;\nuniform float sway;\nuniform float zoomScale;\nuniform vec4 time;\nuniform mat4 modelMatrix;\nuniform mat4 viewMatrix;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform vec3 cameraPosition;\nconst float AREA1 = 300.0;\nconst float AREA2 = 700.0;\nvoid main(void) {\n vUv = uv;\n float _corners = mix(mix(corners.z, corners.w, uv.x), mix(corners.x, corners.y, uv.x), uv.y);\n \n vec3 _position = position;\n vec4 _slide = vec4(_position, 1.0);\n _slide.z += zoomScale;\n \n vec4 _list = modelMatrix * vec4(position, 1.0);\n \n float _len1 = length((uv - hover.xy) * textureSize.xy);\n float _str1 = max(0.0, (1.0 - _len1 / AREA1));\n float _len2 = length(_list.xy);\n float _str2 = clamp(1.0 - _len2 / AREA2, 0.25, 1.0);\n float _sway1 = (\n sin(time.y * 1.0 + _len2 / 256.0) * 128.0 +\n sin(time.y * 2.0 + _len2 / 32.0) * 64.0\n ) * sway;\n float _sway2 = sin(time.y * 1.0 + _len1 / 32.0) * 24.0 * _str1 * _str2 * hover.z;\n _list.z += _sway1 + _sway2;\n _slide.z += _sway1;\n vDark = mix(1.0, 0.7, _corners);\n gl_Position = projectionMatrix * viewMatrix * mix(_list, _slide, _corners);\n}"
}
//o75
function o75(e, t) {
    e.exports = "precision highp float;\nfloat mirrored(float v) {\n float m = mod(v, 2.0);\n return mix(m, 2.0 - m, step(1.0, m));\n}\nvec2 mirrored(vec2 v) {\n vec2 m = mod(v, 2.0);\n return mix(m, 2.0 - m, step(1.0, m));\n}\nvec3 mirrored(vec3 v) {\n vec3 m = mod(v, 2.0);\n return mix(m, 2.0 - m, step(1.0, m));\n}\nvec4 mirrored(vec4 v) {\n vec4 m = mod(v, 2.0);\n return mix(m, 2.0 - m, step(1.0, m));\n}\nfloat tri(float v) {\n return mix(v, 1.0 - v, step(0.5, v)) * 2.0;\n}\nvec2 tri(vec2 v) {\n return mix(v, 1.0 - v, step(0.5, v)) * 2.0;\n}\nvec3 tri(vec3 v) {\n return mix(v, 1.0 - v, step(0.5, v)) * 2.0;\n}\nvec4 tri(vec4 v) {\n return mix(v, 1.0 - v, step(0.5, v)) * 2.0;\n}\n#define PI_2 6.283185307179586\n#define PI_H 1.5707963267948966\nvarying vec2 vUv;\nvarying vec2 vUv1;\nvarying vec2 vUv2;\nuniform vec4 time;\nuniform float progress;\nuniform vec3 mask;\nuniform float rotation;\nuniform vec4 translateDelay;\nuniform vec2 accel;\nuniform vec4 waveAmpFreq;\nuniform vec4 waveSpeedBlend;\nuniform vec4 pixels;\nuniform sampler2D texture1;\nuniform sampler2D texture2;\nvoid main(void) {\n vec2 uv = gl_FragCoord.xy / pixels.xy;\n float p = fract(progress + mask.z);\n \n float delayValue = p * (1.0 + translateDelay.z + translateDelay.w) - uv.y * translateDelay.w - (1.0 - uv.x) * translateDelay.z;\n delayValue = clamp(delayValue, 0.0, 1.0);\n \n vec2 translateValue = p + delayValue * accel;\n vec2 translateValue1 = translateDelay.xy * translateValue;\n vec2 translateValue2 = translateDelay.xy * (translateValue - 1.0 - accel);\n vec2 w = sin(time.y * waveSpeedBlend.xy + vUv.yx * waveAmpFreq.zw) * waveAmpFreq.xy;\n vec2 xy = (tri(p) * waveSpeedBlend.z + tri(delayValue) * waveSpeedBlend.w) * w;\n vec2 uv1 = vUv1 + translateValue1 + xy;\n vec2 uv2 = vUv2 + translateValue2 + xy;\n vec4 rgba1 = texture2D(texture1, mirrored(uv1));\n vec4 rgba2 = texture2D(texture2, mirrored(uv2));\n vec4 rgba = mix(rgba1, rgba2, delayValue);\n rgba = mix(vec4(0.0, 0.0, 0.0, 1.0), rgba, mask.y);\n rgba = mix(vec4(0.0), rgba, float(abs(uv.y * 2.0 - 1.0) <= mask.x));\n rgba.rgb *= 0.7;\n gl_FragColor = rgba;\n \n}"
}
//o76
function o76(e, t) {
    e.exports = "precision highp float;\nattribute vec3 position;\nattribute vec2 uv;\nvarying vec2 vUv;\nvarying vec2 vUv1;\nvarying vec2 vUv2;\nuniform vec4 uvRate1;\nuniform vec4 uvRate2;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nvoid main(void) {\n vec2 _uv = uv - 0.5;\n vUv1 = _uv;\n vUv1 *= uvRate1.xy;\n vUv1 += 0.5;\n vUv2 = _uv;\n vUv2 *= uvRate2.xy;\n vUv2 += 0.5;\n _uv += 0.5;\n vUv = _uv;\n gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}"
}


// this.texture1 = new THREE.Texture(null, null, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.LinearFilter, THREE.LinearFilter);
// this.texture2 = new THREE.Texture(null, null, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.LinearFilter, THREE.LinearFilter);



function initLoad() {
    manager = new THREE.LoadingManager();
    manager.onStart = function(url, itemsLoaded, itemsTotal) {
        console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
    };

    manager.onLoad = function() {
        console.log('Loading complete!');
        loadResCallBack();
    };


    manager.onProgress = function(url, itemsLoaded, itemsTotal) {

        console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');

    };

    manager.onError = function(url) {
        console.log('There was an error loading ' + url);
    };
}

function loadResCallBack() {
    console.log('init');

    var geo = new THREE.PlaneBufferGeometry(constWork.width, constWork.height, Math.round(constWork.width / 10), Math.round(constWork.height / 10));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3, 1e6);
    // this.texture = new THREE.Texture(null, null, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.LinearFilter, THREE.LinearFilter);
    var e = {
        time: {
            value: 300
        },
        texture1: {
            value: null
        },
        texture2: {
            value: null
        },
        textureSize: {
            value: new THREE.Vector4(constWork.width, constWork.height, constWork.width / constWork.height)
        },
        opacity: {
            value: 1
        },
        hover: {
            value: new THREE.Vector3(.5, .5, 0)
        },
        corners: {
            value: new THREE.Vector4(0, 0, 0, 0)
        },
        sway: {
            value: 0
        },
        zoomScale: {
            value: 0
        },
        rotation: {
            value: 0
        },
        progress: {
            value: 0
        },
        translate: {
            value: new THREE.Vector2(-.2, .4)
        },
        delay: {
            value: new THREE.Vector2(1, 1)
        },
        edge: {
            value: 0
        },
        accel: {
            value: new THREE.Vector2(2, 2)
        },
        waveAmpFreq: {
            value: new THREE.Vector4(0, .5, 0, 4)
        },
        waveSpeedPhase: {
            value: new THREE.Vector4(0, .3, 0, 0)
        },
        waveBlend: {
            value: new THREE.Vector2(.2, .8)
        }
    };

    // var e = {
    //     time: {
    //         value: 1
    //     },
    //     pixels: {
    //         value: 1
    //     },
    //     texture1: {
    //         value: new THREE.Texture(null, null, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.LinearFilter, THREE.LinearFilter)
    //     },
    //     texture2: {
    //         value: new THREE.Texture(null, null, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.LinearFilter, THREE.LinearFilter)
    //     },
    //     uvRate1: {
    //         value: new THREE.Vector4(1, 1, 1, 1)
    //     },
    //     uvRate2: {
    //         value: new THREE.Vector4(1, 1, 1, 1)
    //     },
    //     progress: {
    //         value: 0
    //     },
    //     mask: {
    //         value: new THREE.Vector3(1, 1, 0)
    //     },
    //     translateDelay: {
    //         value: new THREE.Vector4(-.5, 1, 1, 2)
    //     },
    //     accel: {
    //         value: new THREE.Vector2(.5, 2)
    //     },
    //     waveAmpFreq: {
    //         value: new THREE.Vector4(0, .5, 0, 4)
    //     },
    //     waveSpeedBlend: {
    //         value: new THREE.Vector4(0, .3, .5, .5)
    //     }
    // };

    var texture1 = new THREE.Texture(null, null, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.LinearFilter, THREE.LinearFilter),
        texture2 = new THREE.Texture(null, null, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.LinearFilter, THREE.LinearFilter);
    e.texture1 = params.texture;
    e.texture2 = params.texture;
    // e.texture1=texture1;
    // e.texture2=texture2;

    var shaderMaterial = new THREE.RawShaderMaterial({
        blending: THREE.NormalBlending,
                side: THREE.FrontSide,
                transparent: !0,
        vertexShader: document.getElementById('waveVertexShader').textContent,
        fragmentShader: document.getElementById('waveFragmentShader').textContent,
        uniforms: e
    });

    var wave = new THREE.Mesh(geo, shaderMaterial);
    wave.position.set(0, 0, 0);
    scene.add(wave);
}

function initThree() {
    var wh = window.innerHeight;
    var ww = window.innerWidth;
    constWork.height = wh;
    constWork.width = ww;


    // CAMERAS

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 80;

    // SCENE

    scene = new THREE.Scene();

    // uniform float progress;
    // uniform float burnEffect;

    // uniform float isDepth;
    // uniform float cameraNear;
    // uniform float cameraFar;

    // Textures

    var textureLoader = new THREE.TextureLoader(manager);
    params.texture = textureLoader.load('./assets/img/cat.jpg');

    //renderer
    var container = document.getElementById('container');
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

}

function initEvent() {
    document.addEventListener('touchstart', function(e) {}, false);
    document.addEventListener('touchmove', function(e) {
        e.preventDefault();
    }, false);
    window.addEventListener('resize', onWindowResize, false);
}


function init() {
    //loadingManager
    initLoad();

    //init Three
    initThree();
    //event
    initEvent();

    animate();

}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    renderer.render(scene, camera);
}


window.onload = function() {
    init();
};





function showStats() {
    var stats = new Stats();
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    var fs = document.createElement('div');
    fs.style.position = 'absolute';
    fs.style.left = 0;
    fs.style.top = 0;
    fs.style.zIndex = 999;
    fs.appendChild(stats.domElement);
    document.body.appendChild(fs);

    function animate() {
        stats.begin();
        // monitored code goes here
        stats.end();
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
}
showStats();