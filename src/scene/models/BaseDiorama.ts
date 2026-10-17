import * as THREE from 'three';
import { MATERIALS } from '../materials';

export interface DioramaEnvironment extends THREE.Group {
  updateEnvironment: (sunlight: number, windSpeed: number, delta: number) => void;
  setHouseLit: (lit: boolean) => void;
}

export function createBaseDiorama(): DioramaEnvironment {
  const group = new THREE.Group() as DioramaEnvironment;
  group.name = 'diorama_environment';

  // Spacious Laboratory Workbench Dimensions
  const width = 9.2;
  const depth = 7.5;
  const radius = 0.8;

  // 1. Create rounded workbench tabletop shape
  const shape = new THREE.Shape();
  const x = -width / 2;
  const z = -depth / 2;
  const w = width;
  const d = depth;

  shape.moveTo(x + radius, z);
  shape.lineTo(x + w - radius, z);
  shape.quadraticCurveTo(x + w, z, x + w, z + radius);
  shape.lineTo(x + w, z + d - radius);
  shape.quadraticCurveTo(x + w, z + d, x + w - radius, z + d);
  shape.lineTo(x + radius, z + d);
  shape.quadraticCurveTo(x, z + d, x, z + d - radius);
  shape.lineTo(x, z + radius);
  shape.quadraticCurveTo(x, z, x + radius, z);

  // Clean, modern Lab Work Surface Material (Bright light cyan/slate with smooth matte finish)
  const benchTopMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    roughness: 0.35,
    metalness: 0.05,
  });

  const benchExtrude = {
    depth: 0.25,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.12,
    bevelThickness: 0.1,
  };

  const benchGeo = new THREE.ExtrudeGeometry(shape, benchExtrude);
  const benchMesh = new THREE.Mesh(benchGeo, benchTopMat);
  benchMesh.rotation.x = Math.PI / 2;
  benchMesh.position.y = 0;
  benchMesh.receiveShadow = true;
  group.add(benchMesh);

  // Lower Trim Base (Sleek dark blue/slate edge)
  const trimMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    roughness: 0.4,
    metalness: 0.2,
  });

  const trimExtrude = {
    depth: 0.4,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.08,
    bevelThickness: 0.08,
  };
  const trimGeo = new THREE.ExtrudeGeometry(shape, trimExtrude);
  const trimMesh = new THREE.Mesh(trimGeo, trimMat);
  trimMesh.rotation.x = Math.PI / 2;
  trimMesh.position.y = -0.22;
  trimMesh.receiveShadow = true;
  group.add(trimMesh);

  // Subtle clean grid helper resting directly on the work surface (no floating!)
  const gridHelper = new THREE.GridHelper(8.0, 16, 0x0284c7, 0xcbd5e1);
  gridHelper.position.y = 0.003;
  (gridHelper.material as THREE.Material).opacity = 0.35;
  (gridHelper.material as THREE.Material).transparent = true;
  group.add(gridHelper);

  // Corner Accent Markers resting on table surface
  const cornerGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.02, 16);
  const cornerMat = MATERIALS.plasticLightBlue;
  const corners = [
    [-3.8, 0.01, -3.0],
    [3.8, 0.01, -3.0],
    [-3.8, 0.01, 3.0],
    [3.8, 0.01, 3.0],
  ];
  corners.forEach(([cx, cy, cz]) => {
    const pad = new THREE.Mesh(cornerGeo, cornerMat);
    pad.position.set(cx, cy, cz);
    group.add(pad);
  });

  group.updateEnvironment = (_sunlight: number, _windSpeed: number, _delta: number) => {
    // Clean environment without blocking objects
  };

  group.setHouseLit = (_lit: boolean) => {
    // No-op since house is removed for max circuit clarity
  };

  return group;
}
