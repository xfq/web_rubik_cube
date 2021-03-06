/* eslint-env browser */
/* eslint no-console: off, strict: off, no-param-reassign: off*/
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

function addKeydownEventsFor(_obj) {
  document.addEventListener('keydown', (event) => {
    const keyName = event.key || event.keyIdentifier;
    // console.log(keyName);
    if (keyName === 'ArrowLeft' || keyName === 'Left') {
      event.preventDefault();
      _obj.position.x -= 0.2;
    }
    if (keyName === 'ArrowRight' || keyName === 'Right') {
      event.preventDefault();
      _obj.position.x += 0.2;
    }
    if (keyName === 'ArrowUp' || keyName === 'Up') {
      event.preventDefault();
      _obj.position.y += 0.2;
    }
    if (keyName === 'ArrowDown' || keyName === 'Down') {
      event.preventDefault();
      _obj.position.y -= 0.2;
    }
    if (keyName === '[' || keyName === 'U+005B') {
      event.preventDefault();
      _obj.position.z -= 0.2;
    }
    if (keyName === ']' || keyName === 'U+005D') {
      event.preventDefault();
      _obj.position.z += 0.2;
    }
    if (keyName === 'x') {
      event.preventDefault();
      _obj.rotation.x += Math.PI / 180;
    }
    if (keyName === 'y') {
      event.preventDefault();
      _obj.rotation.y += Math.PI / 180;
    }
    if (keyName === 'z') {
      event.preventDefault();
      _obj.rotation.z += Math.PI / 180;
    }
  }, false);
}

function faces(faceCode) {
  let color = 'rgb(0, 0, 0)';
  switch (faceCode) {
    case 'U':
      color = 'rgb(255, 255, 255)';
      break;
    case 'F':
      color = 'rgb(0, 157, 84)';
      break;
    case 'R':
      color = 'rgb(220, 66, 47)';
      break;
    case 'D':
      color = 'rgb(253, 204, 9)';
      break;
    case 'L':
      color = 'rgb(255, 108, 0)';
      break;
    case 'B':
      color = 'rgb(61, 129, 246)';
      break;
    default:
      break;
  }
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'rgba(0,0,0,1)';
  ctx.fillRect(0, 0, 512, 512);
  ctx.rect(71, 71, 370, 370);
  ctx.lineJoin = 'round';
  ctx.lineWidth = 100;
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.stroke();
  ctx.fill();
  // Add Text Label
  ctx.fillStyle = 'black';
  ctx.font = 'Italic 300px Times New Roman';
  ctx.fillText(faceCode, 160, 364);
  return canvas;
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
let currentWall;

let hasWall = false;

const currentArray = [];
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

function addWalls() {
  if (!hasWall) {
    const geometryWall = new THREE.CubeGeometry(6, 1, 6, 0, 0, 0);
    const materialWall = new THREE.MeshPhongMaterial({
      color: colors[0],
      emissive: 0x072534,
      // wireframe: true,
      side: THREE.DoubleSide,
      visible: false,
    });
    topWall = new THREE.Mesh(geometryWall, materialWall);
    topWall.position.set(3, 6, 3);
    topWall.rotation.x = Math.PI;
    topWall.name = 'topWall';

    frontWall = new THREE.Mesh(geometryWall, materialWall);
    frontWall.position.set(3, 3, 6);
    frontWall.rotation.x = Math.PI * 0.5;
    frontWall.name = 'frontWall';

    leftWall = new THREE.Mesh(geometryWall, materialWall);
    leftWall.position.set(0, 3, 3);
    leftWall.rotation.z = Math.PI * 0.5;
    leftWall.name = 'leftWall';

    backWall = new THREE.Mesh(geometryWall, materialWall);
    backWall.position.set(3, 3, 0);
    backWall.rotation.x = Math.PI * 0.5;
    backWall.name = 'backWall';

    rightWall = new THREE.Mesh(geometryWall, materialWall);
    rightWall.position.set(6, 3, 3);
    rightWall.rotation.z = Math.PI * 0.5;
    rightWall.name = 'rightWall';

    downWall = new THREE.Mesh(geometryWall, materialWall);
    downWall.position.set(3, 0, 3);
    downWall.rotation.x = Math.PI;
    downWall.name = 'downWall';

    // 需要将碰撞墙加在 scene 中，加入 mesh 会特别诡异
    scene.add(topWall);
    scene.add(frontWall);
    scene.add(leftWall);
    scene.add(backWall);
    scene.add(rightWall);
    scene.add(downWall);
    hasWall = true;
  }
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
  const materials = [];
  const myFaces = [];
  myFaces.push(faces('U'));
  myFaces.push(faces('F'));
  myFaces.push(faces('R'));
  myFaces.push(faces('D'));
  myFaces.push(faces('L'));
  myFaces.push(faces('B'));

  for (let k = 0; k < 6; k += 1) {
    var texture = new THREE.Texture(myFaces[k]);
    texture.needsUpdate = true;
    materials.push(new THREE.MeshBasicMaterial({
      map: texture,
    }));
  }

  const cubemat = new THREE.MultiMaterial(materials);
  allCubes[2].material = cubemat;
  // for (var k = 0; k < 6; k++) {
  //   var texture = new THREE.Texture(myFaces[k]);
  //   texture.needsUpdate = true;
  //   materials.push(new THREE.MeshLambertMaterial({
  //     map: texture
  //   }));
  // }
  // var cubemat = new THREE.MeshFaceMaterial(materials);








  addWalls();
  scene.add(mesh);
}

function markUp(_obj) {
  _obj.material.color = new THREE.Color(0xFFFF00);
}

function detection(dectWall) {
  const originPoint = dectWall.position.clone();
  for (let i = 0; i < dectWall.geometry.vertices.length; i += 1) {
    const localVertex = dectWall.geometry.vertices[i].clone();
    const globalVertex = localVertex.applyMatrix4(dectWall.matrix);
    const directionVector = globalVertex.sub(dectWall.position);
    const ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
    const collisionResults = ray.intersectObjects(allCubes, false);
    if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
      console.log(collisionResults.length);
      for (let j = 0; j < collisionResults.length; j += 1) {
        // TODO: 加入到不重复的数组 currentArray
        markUp(collisionResults[j].object);
      }
    }
  }
}

function command(str) {
  switch (str) {
    case 'T':
      currentWall = topWall;
      break;
    case 'F':
      currentWall = frontWall;
      break;
    case 'L':
      currentWall = leftWall;
      break;
    case 'B':
      currentWall = backWall;
      break;
    case 'R':
      currentWall = rightWall;
      break;
    case 'D':
      currentWall = downWall;
      break;
    default:
      break;
  }
  detection(currentWall);
}

function temp() {
  // console.log(currentArray.length);
  // console.log(currentArray);
  for (let _obj of currentArray) {
    markUp(_obj);
  }
}

function render() {
  stats.begin();
  requestAnimationFrame(render);
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
addKeydownEventsFor(allCubes[2]);
