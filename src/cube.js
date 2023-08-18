import { BoxGeometry, MeshBasicMaterial, Mesh } from "three";

export const createCube = () => {
  const geometry = new BoxGeometry(1, 1, 1);
  const material = new MeshBasicMaterial({ color: 0x00ff00 });
  return new Mesh(geometry, material);
};
