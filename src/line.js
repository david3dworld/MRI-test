import { LineBasicMaterial, Vector3, BufferGeometry, Line } from "three";

export const createLine = (
  start = new Vector3(-1, 0, 0),
  end = new Vector3(1, 0, 0)
) => {
  const material = new LineBasicMaterial({ color: 0x0000ff });

  const geometry = new BufferGeometry().setFromPoints([start, end]);
  return new Line(geometry, material);
};
