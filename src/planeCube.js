import {
  Group,
  PlaneGeometry,
  MeshBasicMaterial,
  DoubleSide,
  Mesh,
  Plane,
  Vector3
} from "three";

export const createPlaneCube = (dist = 1) => {
  const group = new Group();
  const geometry = new PlaneGeometry(dist, dist);

  const material = new MeshBasicMaterial({
    color: 0xffff00,
    side: DoubleSide,
    transparent: true,
    opacity: 0.7
  });
  const plane = new Mesh(geometry, material);

  const topPlane = plane.clone();
  topPlane.position.set(0, dist / 2, 0);
  topPlane.rotateX(Math.PI / 2);

  const bottomPlane = plane.clone();
  bottomPlane.position.set(0, -dist / 2, 0);
  bottomPlane.rotateX(Math.PI / 2);

  const leftPlane = plane.clone();
  leftPlane.position.set(-dist / 2, 0, 0);
  leftPlane.rotateY(Math.PI / 2);

  const rightPlane = plane.clone();
  rightPlane.position.set(dist / 2, 0, 0);
  rightPlane.rotateY(Math.PI / 2);

  const frontPlane = plane.clone();
  frontPlane.position.set(0, 0, dist / 2);

  const backPlane = plane.clone();
  backPlane.position.set(0, 0, -dist / 2);

  function createPlane(plane) {
    group.updateMatrixWorld(true);

    const normal = new Vector3();
    const point = new Vector3();
    const newPlane = new Plane();
    normal.set(0, 0, 1).applyQuaternion(plane.quaternion);
    point.copy(plane.position.clone().add(group.position.clone()));
    newPlane.setFromNormalAndCoplanarPoint(normal, point);
    return newPlane;
  }

  const planes = [
    createPlane(topPlane),
    createPlane(bottomPlane),
    createPlane(leftPlane),
    createPlane(rightPlane),
    createPlane(frontPlane),
    createPlane(backPlane)
  ];
  group.planes = planes;

  function updatePlanes() {
    const planes = [];
    for (const p of group.children) {
      planes.push(createPlane(p));
    }
    group.planes = planes;
  }

  group.updatePlanes = () => {
    group.updateMatrixWorld(true);
    updatePlanes();
  };

  geometry.dispose();
  group.add(
    topPlane,
    bottomPlane,
    leftPlane,
    rightPlane,
    frontPlane,
    backPlane
  );

  return group;
};
