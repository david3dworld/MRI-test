import { SphereGeometry, MeshBasicMaterial, Mesh } from "three";

export const createSphere = () => {
  const geometry = new SphereGeometry(0.05, 32, 16);
  const material = new MeshBasicMaterial({ color: 0x0000ff });
  const sphere = new Mesh(geometry, material);
  // sphere.visible =
  return sphere;
};
