/* eslint-env browser */
/* eslint no-console: off, strict: off*/
/* global THREE, Stats*/

'use strict';

/* Tool Function */
function getCSSValue(element, property) {
  if (!(element instanceof HTMLElement)) {
    throw new TypeError(`${element} is not HTMLElement`);
  }
  if (typeof property !== 'string') {
    throw new TypeError(`${property} is not String`);
  }

  const valueStr = window.getComputedStyle(element, null)[property];
  return (parseInt(valueStr, 10));
}

/* Stats Function */
const stats = new Stats();
(() => {
  document.body.appendChild(stats.domElement);
})();

/* Global Values */
let canvasElement;
let renderer;
let scene;
let camera;
let mesh;

let topWall;
let frontWall;
let leftWall;
let backWall;
let rightWall;
let downWall;

let isdetection = false;

const leftArray = [];
const topArray = [];
const rightArray = [];
const allCubes = [];

const speed = 1;
const colors = [0xff3b30, 0xff9500, 0xffcc00, 0x4cd964, 0x5ac8fa, 0x007AFF, 0x5856D6, 0xFF2C55];

/* Cube Operation */
function changePivot(x, y, z, obj) {
  const _wrapper = new THREE.Object3D();
  _wrapper.position.set(x, y, z);
  _wrapper.add(obj);
  obj.position.set(-x, -y, -z);
  return _wrapper;
}

/* init Three.js */
function initThree() {
  canvasElement = document.querySelector('.main-canvas');
  renderer = new THREE.WebGLRenderer({
    antialiasing: true,
    canvas: canvasElement,
  });
  renderer.setSize(800, 700);
  renderer.setClearColor(0x000000);
  renderer.setPixelRatio(window.devicePixelRatio);
}

function initScene() {
  scene = new THREE.Scene();
}

function initCamera() {
  camera = new THREE.PerspectiveCamera(45, 8 / 7, 1, 50);
  camera.position.set(-6, 12, 16);
  // camera.position.set(12, -12, 16);
  camera.lookAt({ x: 3, y: 3, z: 3 });
  scene.add(camera);
}

function initLight() {
  const lights = [];
  lights[0] = new THREE.PointLight(0xffffff, 1, 0);
  lights[1] = new THREE.PointLight(0xffffff, 1, 0);
  lights[2] = new THREE.PointLight(0xffffff, 1, 0);

  lights[0].position.set(0, 200, 0);
  lights[1].position.set(100, 200, 100);
  lights[2].position.set(-100, -200, -100);

  scene.add(lights[0]);
  scene.add(lights[1]);
  scene.add(lights[2]);
}

function initObject() {
  mesh = new THREE.Object3D();
  const geometryCube = new THREE.CubeGeometry(2, 2, 2, 2, 2, 2);
  const materialCube = new THREE.MeshPhongMaterial({
    color: 0x156289,
    emissive: 0x072534,
    // wireframe: true,
  });

  for (let x = 1; x <= 5; x += 2) {
    for (let y = 1; y <= 5; y += 2) {
      for (let z = 1; z <= 5; z += 2) {
        const cube = new THREE.Mesh(geometryCube, materialCube.clone());
        cube.position.set(x, y, z);
        mesh.add(cube);
        allCubes.push(cube);
      }
    }
  }

  // const materialTemp = new THREE.MeshPhongMaterial({
  //   color: 0x156289,
  // });
  // mesh.children[24].material = materialTemp;

  // 碰撞检测面
  const geometryWall = new THREE.CubeGeometry(6, 1, 6, 1, 1, 1);
  const materialWall = new THREE.MeshPhongMaterial({
    color: colors[0],
    emissive: 0x072534,
    wireframe: true,
    side: THREE.DoubleSide,
    visible: true,
  });

  // topWall.position.set(3, 6, 3);
  // topWall.rotation.x = Math.PI;

  // frontWall.position.set(3, 3, 6);
  // frontWall.rotation.x = Math.PI * 0.5;

  // leftWall.position.set(0, 3, 3);
  // leftWall.rotation.z = Math.PI * 0.5;

  // backWall.position.set(3, 3, 0);
  // backWall.rotation.x = Math.PI * 0.5;

  // rightWall.position.set(6, 3, 3);
  // rightWall.rotation.z = Math.PI * 0.5;

  // downWall.position.set(3, 0, 3);
  // downWall.rotation.x = Math.PI;

  topWall = new THREE.Mesh(geometryWall, materialWall);
  topWall.position.set(3, 6, 3);
  topWall.rotation.x = Math.PI;
  topWall.name = 'topWall';
  topWall.rotation.x = Math.PI;
  scene.add(topWall);

  scene.add(mesh);
}

function markUp(_obj) {
  _obj.material.color = new THREE.Color(0xFFFF00);
}

function detection(dectWall) {
  // 谁碰到我，谁变白
  const originPoint = dectWall.position.clone();
  for (let i = 0; i < dectWall.geometry.vertices.length; i += 1) {
    const localVertex = dectWall.geometry.vertices[i].clone();
    const globalVertex = localVertex.applyMatrix4(dectWall.matrix);
    const directionVector = globalVertex.sub(dectWall.position);
    const ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
    const collisionResults = ray.intersectObjects(allCubes, false);
    if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
      for (let j = 0; j < collisionResults.length; j += 1) {
        markUp(collisionResults[j].object);
      }
    }
    // crash = false;
  }
}

function render() {
  stats.begin();
  requestAnimationFrame(render);
  if (isdetection) {
    detection(topWall);
  }
  stats.end();
  // mesh.rotation.x += Math.PI / 180 * speed;
  // mesh.rotation.y += Math.PI / 180 * speed;
  // mesh.rotation.z += Math.PI / 180 * speed;
  renderer.render(scene, camera);
}

function startThree() {
  initThree();
  initScene();
  initCamera();
  initLight();
  initObject();
  renderer.clear();
  render();
}

startThree();

let wall = topWall;
document.addEventListener('keydown', (event) => {
  const keyName = event.key || event.keyIdentifier;
  // console.log(keyName);
  if (keyName === 'ArrowLeft' || keyName === 'Left') {
    event.preventDefault();
    wall.position.x -= 0.2;
    // allCubes[1].position.x -= 0.2;
  }
  if (keyName === 'ArrowRight' || keyName === 'Right') {
    event.preventDefault();
    wall.position.x += 0.2;
    // allCubes[1].position.x += 0.2;
  }
  if (keyName === 'ArrowUp' || keyName === 'Up') {
    event.preventDefault();
    wall.position.y += 0.2;
  }
  if (keyName === 'ArrowDown' || keyName === 'Down') {
    event.preventDefault();
    wall.position.y -= 0.2;
  }
  if (keyName === '[') {
    event.preventDefault();
    wall.position.z -= 0.2;
  }
  if (keyName === ']') {
    event.preventDefault();
    wall.position.z += 0.2;
  }
  if (keyName === 'd') {
    event.preventDefault();
    isdetection = !isdetection;
  }
}, false);
