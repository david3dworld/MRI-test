<template>
  <div class="container">
    <div class="canvas-container" id="parentCanvasId">
      <canvas ref="canvas" />
    </div>
    <div class="title-label">Form inputs</div>
    <div class="selection" style="display: flex">
      <div class="left-selection">
        <div class="input-title">Cube (Center cube):</div>
        <div class="input-flex">
          X:
          <input v-model="cubePos.x" type="number" class="input" step="0.1" />
        </div>
        <div class="input-flex">
          Y:
          <input v-model="cubePos.y" type="number" class="input" step="0.1" />
        </div>
        <div class="input-flex">
          Z:
          <input v-model="cubePos.z" type="number" class="input" step="0.1" />
        </div>
        <div class="title-label">Line Segments</div>
        <div class="selection">
          <div class="left-selection">
            <div class="input-title">Start vector3:</div>
            <div class="input-flex">
              X:
              <input
                v-model="startLine.x"
                type="number"
                class="input"
                step="0.1"
              />
            </div>
            <div class="input-flex">
              Y:
              <input
                v-model="startLine.y"
                type="number"
                class="input"
                step="0.1"
              />
            </div>
            <div class="input-flex">
              Z:
              <input
                v-model="startLine.z"
                type="number"
                class="input"
                step="0.1"
              />
            </div>
          </div>
          <div class="input-title">End vector3:</div>
          <div class="input-flex">
            X:
            <input v-model="endLine.x" type="number" class="input" step="0.1" />
          </div>
          <div class="input-flex">
            Y:
            <input v-model="endLine.y" type="number" class="input" step="0.1" />
          </div>
          <div class="input-flex">
            Z:
            <input v-model="endLine.z" type="number" class="input" step="0.1" />
          </div>
        </div>
      </div>
      <div class="right-selection">
        <div class="input-title">Output:</div>
        <div v-if="sphere1 && sphere1.visible">
          <div class="input-title">Intersection Vector3::</div>
          <div class="input-flex">X: {{ +sphere1.position.x.toFixed(3) }}</div>
          <div class="input-flex">Y: {{ +sphere1.position.y.toFixed(3) }}</div>
          <div class="input-flex">Z: {{ +sphere1.position.z.toFixed(3) }}</div>
        </div>
        <div v-if="sphere2 && sphere2.visible">
          <div class="input-title">Intersection Vector3::</div>
          <div class="input-flex">X: {{ +sphere2.position.x.toFixed(3) }}</div>
          <div class="input-flex">Y: {{ +sphere2.position.y.toFixed(3) }}</div>
          <div class="input-flex">Z: {{ +sphere2.position.z.toFixed(3) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watchEffect, watch } from "vue";
import { Box3, BufferGeometry, Line3, Scene, Vector3 } from "three";
import { initRenderer, updateRenderer } from "./renderer";
import { initCamera, updateCamera } from "./camera";
import { createPlaneCube } from "./planeCube";
import { createSphere } from "./sphere";
import { createLine } from "./line";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const canvas = ref(null);
const scene = new Scene();
let renderer = null;
let camera = null;
let controls = null;
const cubePos = ref(new Vector3(0, 0, 0));

const startLine = ref(new Vector3(1, 0, 0));
const endLine = ref(new Vector3(-1, 0, 0));

const cube = createPlaneCube(1);
const line = createLine(startLine.value, endLine.value);
const sphere1 = createSphere();
const sphere2 = createSphere();

camera = initCamera();

scene.add(camera);
scene.add(cube);
scene.add(line);
scene.add(sphere1);
scene.add(sphere2);

function getIntersectCube() {
  if (cube && cube.planes) {
    if (cube.updatePlanes) {
      cube.updatePlanes();
    }

    const line3 = new Line3(startLine.value, endLine.value);
    let count = 0;

    const box = new Box3();
    box.expandByObject(cube);

    sphere1.visible = false;
    sphere2.visible = false;

    for (const p of cube.planes) {
      const point = p.intersectLine(line3, new Vector3());
      if (point) {
        if (count === 0 && box.containsPoint(point)) {
          sphere1.position.copy(point);
          sphere1.visible = true;
          count++;
        } else if (box.containsPoint(point)) {
          sphere2.position.copy(point);
          sphere2.visible = true;
          count++;
        }
      }
    }
  }
}

watch(
  () => cubePos,
  (newValue, oldValue) => {
    if (cube) {
      cube.position.copy(newValue.value);
      renderer.render(scene, camera);
      getIntersectCube();
    }
  },
  { deep: true }
);

watch(
  () => startLine,
  (newValue, oldValue) => {
    const geo = new BufferGeometry().setFromPoints([
      startLine.value,
      endLine.value,
    ]);
    line.geometry = geo;
    renderer.render(scene, camera);
    geo.dispose();
    getIntersectCube();
  },
  { deep: true }
);

watch(
  () => endLine,
  (newValue, oldValue) => {
    const geo = new BufferGeometry().setFromPoints([
      startLine.value,
      endLine.value,
    ]);
    line.geometry = geo;
    renderer.render(scene, camera);
    geo.dispose();
    getIntersectCube();
  },
  { deep: true }
);

watchEffect(() => {
  const parentCanvas = document.getElementById("parentCanvasId");
  if (parentCanvas) {
    updateRenderer(
      renderer,
      parentCanvas.clientWidth,
      parentCanvas.clientHeight
    );
    updateCamera(camera, parentCanvas.clientWidth / parentCanvas.clientHeight);
  }
});

onMounted(() => {
  renderer = initRenderer(canvas.value);
  controls = new OrbitControls(camera, renderer.domElement);
  const parentCanvas = document.getElementById("parentCanvasId");

  if (parentCanvas) {
    updateRenderer(
      renderer,
      parentCanvas.clientWidth,
      parentCanvas.clientHeight
    );
    updateCamera(camera, parentCanvas.clientWidth / parentCanvas.clientHeight);
  }

  const tick = () => {
    //render
    renderer.render(scene, camera);
    controls.update();
    window.requestAnimationFrame(tick);
  };
  tick();
});

// cube.rotation.y = Math.PI / 3;
// cube.rotation.x = (Math.PI / 180) * 35;
// cube.rotation.x += 0.01;

window.addEventListener("resize", function () {
  const parentCanvas = document.getElementById("parentCanvasId");
  if (parentCanvas) {
    updateRenderer(
      renderer,
      parentCanvas.clientWidth,
      parentCanvas.clientHeight
    );
    updateCamera(camera, parentCanvas.clientWidth / parentCanvas.clientHeight);
    renderer.render(scene, camera);
  }
});
getIntersectCube();
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#app {
  width: 100vw;
  height: 100vh;
}
canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  touch-action: none;
  background: white;
  border: 1px solid black;
}
.container {
  width: 100%;
  height: 100%;
  padding: 15px;
  box-sizing: border-box;
  overflow-x: hidden;
}

.canvas-container {
  width: 100%;
  height: 50%;
  position: relative;
}

.title-label {
  margin-top: 40px;
  margin-bottom: 10px;
}

.selection {
  width: 100%;
}

.left-selection {
  width: 50%;
}
.right-selection {
  flex-grow: 1;
}

.input-title {
  padding-left: 20px;
  margin-bottom: 5px;
}

.input-flex {
  padding-left: 40px;
  display: flex;
  margin-bottom: 5px;
}

.input {
  padding-left: 10px;
}
</style>
