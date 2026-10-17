import * as THREE from 'three';
import { MATERIALS } from '../materials';

export interface DioramaEnvironment extends THREE.Group {
  updateEnvironment: (sunlight: number, windSpeed: number, delta: number) => void;
  setHouseLit: (lit: boolean) => void;
}

export function createBaseDiorama(): DioramaEnvironment {
  const group = new THREE.Group() as DioramaEnvironment;
  group.name = 'diorama_environment';

  // Floating Island Base Dimensions
  const width = 8.5;
  const depth = 8.5;
  const radius = 1.0;

  // 1. Create rounded base shape
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

  // Upper Grass Layer
  const grassExtrude = {
    depth: 0.35,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.15,
    bevelThickness: 0.15,
  };
  const grassGeo = new THREE.ExtrudeGeometry(shape, grassExtrude);
  const grassMesh = new THREE.Mesh(grassGeo, MATERIALS.grassGround);
  grassMesh.rotation.x = Math.PI / 2;
  grassMesh.position.y = 0;
  grassMesh.receiveShadow = true;
  group.add(grassMesh);

  // Lower Soil Layer (Dark earth underneath)
  const soilExtrude = {
    depth: 0.8,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.1,
    bevelThickness: 0.15,
  };
  const soilGeo = new THREE.ExtrudeGeometry(shape, soilExtrude);
  const soilMesh = new THREE.Mesh(soilGeo, MATERIALS.soilBase);
  soilMesh.rotation.x = Math.PI / 2;
  soilMesh.position.y = -0.45;
  soilMesh.receiveShadow = true;
  group.add(soilMesh);

  // 2. Cute STEM Laboratory House (matching the uploaded image!)
  const houseGroup = new THREE.Group();
  houseGroup.position.set(0.6, 0.35, 1.2);

  // House Main Body (White stucco)
  const houseBodyGeo = new THREE.BoxGeometry(1.6, 1.1, 1.5);
  const houseBodyMesh = new THREE.Mesh(houseBodyGeo, MATERIALS.plasticWhite);
  houseBodyMesh.position.y = 0.55;
  houseBodyMesh.castShadow = true;
  houseBodyMesh.receiveShadow = true;
  houseGroup.add(houseBodyMesh);

  // Gabled Roof
  const roofGeo = new THREE.ConeGeometry(1.4, 0.75, 4);
  roofGeo.rotateY(Math.PI / 4);
  const roofMesh = new THREE.Mesh(roofGeo, MATERIALS.plasticOrange);
  roofMesh.position.y = 1.45;
  roofMesh.castShadow = true;
  houseGroup.add(roofMesh);

  // Solar Panel Roof Tiles (Blue Photovoltaic tiles on roof slope)
  const roofSolarGeo = new THREE.PlaneGeometry(1.0, 0.7);
  const roofSolarMesh = new THREE.Mesh(roofSolarGeo, MATERIALS.solarCell);
  roofSolarMesh.rotation.x = -Math.PI / 3.8;
  roofSolarMesh.position.set(0, 1.35, 0.52);
  houseGroup.add(roofSolarMesh);

  // Yellow Wooden Door
  const doorGeo = new THREE.BoxGeometry(0.35, 0.65, 0.05);
  const doorMesh = new THREE.Mesh(doorGeo, MATERIALS.woodTrim);
  doorMesh.position.set(-0.35, 0.35, 0.76);
  houseGroup.add(doorMesh);

  // Door knob
  const knobGeo = new THREE.SphereGeometry(0.03, 12, 12);
  const knobMesh = new THREE.Mesh(knobGeo, MATERIALS.metalBrass);
  knobMesh.position.set(-0.25, 0.35, 0.8);
  houseGroup.add(knobMesh);

  // Front Window with Warm Interior Glow
  const winGeo = new THREE.BoxGeometry(0.45, 0.45, 0.05);
  const winMat = new THREE.MeshStandardMaterial({
    color: 0xfef08a,
    emissive: 0xfbbf24,
    emissiveIntensity: 0.6,
  });
  const winMesh = new THREE.Mesh(winGeo, winMat);
  winMesh.position.set(0.35, 0.6, 0.76);
  houseGroup.add(winMesh);

  // House interior light
  const houseLight = new THREE.PointLight(0xffb703, 0.8, 4);
  houseLight.position.set(0, 0.7, 0.5);
  houseGroup.add(houseLight);

  group.add(houseGroup);

  // 3. Cute Puffy Miniature Trees (segmented spheres, as in reference image)
  const treePositions = [
    [-2.8, 0.35, -1.0, 0.85],
    [-3.2, 0.35, 0.4, 1.0],
    [-2.6, 0.35, 1.6, 0.75],
    [-1.2, 0.35, -2.8, 0.9],
  ];

  treePositions.forEach(([tx, ty, tz, scale]) => {
    const treeGroup = new THREE.Group();
    treeGroup.position.set(tx, ty, tz);
    treeGroup.scale.set(scale, scale, scale);

    // Trunk
    const trunkGeo = new THREE.CylinderGeometry(0.1, 0.14, 0.7, 16);
    const trunkMesh = new THREE.Mesh(trunkGeo, MATERIALS.treeTrunk);
    trunkMesh.position.y = 0.35;
    trunkMesh.castShadow = true;
    treeGroup.add(trunkMesh);

    // Segmented round leaves crown (3 rounded spheres clustered together)
    const crown1 = new THREE.Mesh(new THREE.SphereGeometry(0.42, 16, 16), MATERIALS.treeLeaves);
    crown1.position.set(0, 0.95, 0);
    crown1.castShadow = true;
    treeGroup.add(crown1);

    const crown2 = new THREE.Mesh(new THREE.SphereGeometry(0.34, 16, 16), MATERIALS.treeLeaves);
    crown2.position.set(-0.2, 0.85, 0.15);
    crown2.castShadow = true;
    treeGroup.add(crown2);

    const crown3 = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 16), MATERIALS.treeLeaves);
    crown3.position.set(0.2, 0.85, -0.15);
    crown3.castShadow = true;
    treeGroup.add(crown3);

    group.add(treeGroup);
  });

  // 4. Subtle grid lines on the grass for easy circuit alignment
  const gridHelper = new THREE.GridHelper(7.0, 14, 0x16a34a, 0x22c55e);
  gridHelper.position.y = 0.36;
  (gridHelper.material as THREE.Material).opacity = 0.25;
  (gridHelper.material as THREE.Material).transparent = true;
  group.add(gridHelper);

  group.updateEnvironment = (sunlight: number, _windSpeed: number, _delta: number) => {
    // Dynamic house window glow based on sunlight or power
    winMat.emissiveIntensity = THREE.MathUtils.lerp(winMat.emissiveIntensity, sunlight > 0.3 ? 0.9 : 0.2, 0.1);
    houseLight.intensity = THREE.MathUtils.lerp(houseLight.intensity, sunlight > 0.3 ? 1.2 : 0.1, 0.1);
  };

  group.setHouseLit = (lit: boolean) => {
    winMat.emissiveIntensity = lit ? 1.5 : 0.1;
    houseLight.intensity = lit ? 2.0 : 0.1;
  };

  return group;
}
