import * as THREE from 'three';
import { MATERIALS } from '../materials';
import { CircuitComponent } from '../../types';

export interface WindTurbineObject extends THREE.Group {
  updateTurbineState: (comp: CircuitComponent, windSpeed: number, delta: number) => void;
}

export function createWindTurbineMesh(comp: CircuitComponent): WindTurbineObject {
  const group = new THREE.Group() as WindTurbineObject;
  group.name = comp.id;
  group.position.set(...comp.position);

  // Base circular foundation ring (like in the user's reference image with yellow/wood rim)
  const baseRimGeo = new THREE.CylinderGeometry(0.5, 0.55, 0.12, 24);
  const baseRimMesh = new THREE.Mesh(baseRimGeo, MATERIALS.plasticYellow);
  baseRimMesh.position.y = 0.06;
  baseRimMesh.castShadow = true;
  baseRimMesh.receiveShadow = true;
  group.add(baseRimMesh);

  // Tapered tall tower mast
  const towerHeight = 2.4;
  const towerGeo = new THREE.CylinderGeometry(0.12, 0.22, towerHeight, 24);
  const towerMesh = new THREE.Mesh(towerGeo, MATERIALS.plasticWhite);
  towerMesh.position.y = towerHeight / 2 + 0.12;
  towerMesh.castShadow = true;
  group.add(towerMesh);

  // Blue nacelle (generator pod) at top of tower
  const nacelleGroup = new THREE.Group();
  nacelleGroup.position.set(0, towerHeight + 0.12, 0);

  const nacelleGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.55, 20);
  const nacelleMesh = new THREE.Mesh(nacelleGeo, MATERIALS.plasticLightBlue);
  nacelleMesh.rotation.x = Math.PI / 2;
  nacelleMesh.position.z = -0.12;
  nacelleMesh.castShadow = true;
  nacelleGroup.add(nacelleMesh);

  // Back cap of nacelle
  const backCapGeo = new THREE.SphereGeometry(0.18, 16, 16);
  const backCapMesh = new THREE.Mesh(backCapGeo, MATERIALS.plasticBlue);
  backCapMesh.position.set(0, 0, -0.38);
  nacelleGroup.add(backCapMesh);

  // Rotating Hub and Blades Group
  const rotorGroup = new THREE.Group();
  rotorGroup.position.set(0, 0, 0.18);

  // Center blue nose cone spinner
  const spinnerGeo = new THREE.ConeGeometry(0.16, 0.28, 20);
  const spinnerMesh = new THREE.Mesh(spinnerGeo, MATERIALS.plasticBlue);
  spinnerMesh.rotation.x = Math.PI / 2;
  spinnerMesh.position.z = 0.12;
  rotorGroup.add(spinnerMesh);

  // 3 Aerodynamic tapered white blades
  for (let i = 0; i < 3; i++) {
    const angle = (i * Math.PI * 2) / 3;
    const bladeArm = new THREE.Group();
    bladeArm.rotation.z = angle;

    // Tapered airfoil blade shape
    const bladeShape = new THREE.Shape();
    bladeShape.moveTo(0, 0.1);
    bladeShape.quadraticCurveTo(0.1, 0.5, 0.08, 1.2);
    bladeShape.lineTo(-0.02, 1.25);
    bladeShape.quadraticCurveTo(-0.06, 0.5, 0, 0.1);

    const extrudeSettings = {
      depth: 0.025,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.01,
      bevelThickness: 0.01,
    };

    const bladeGeo = new THREE.ExtrudeGeometry(bladeShape, extrudeSettings);
    const bladeMesh = new THREE.Mesh(bladeGeo, MATERIALS.plasticWhite);
    bladeMesh.rotation.x = 0.22; // Aerodynamic pitch angle
    bladeMesh.castShadow = true;
    bladeArm.add(bladeMesh);

    rotorGroup.add(bladeArm);
  }

  nacelleGroup.add(rotorGroup);
  group.add(nacelleGroup);

  // Terminal connection posts on the base
  comp.terminals.forEach((term) => {
    const postGroup = new THREE.Group();
    postGroup.name = `terminal::${comp.id}::${term.id}`;
    postGroup.position.set(...term.relativePosition);

    const pGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.16, 16);
    const pMat = term.polarity === 'positive' ? MATERIALS.terminalPositive : MATERIALS.terminalNegative;
    const pMesh = new THREE.Mesh(pGeo, pMat);
    pMesh.castShadow = true;
    postGroup.add(pMesh);

    const capGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.05, 16);
    const capMesh = new THREE.Mesh(capGeo, MATERIALS.metalSilver);
    capMesh.position.y = 0.09;
    postGroup.add(capMesh);

    const haloGeo = new THREE.RingGeometry(0.12, 0.18, 16);
    const haloMesh = new THREE.Mesh(haloGeo, MATERIALS.terminalHighlight);
    haloMesh.rotation.x = -Math.PI / 2;
    haloMesh.position.y = 0.12;
    haloMesh.visible = false;
    haloMesh.name = `halo::${comp.id}::${term.id}`;
    postGroup.add(haloMesh);

    group.add(postGroup);
  });

  let currentRotSpeed = 0;

  group.updateTurbineState = (_currentComp: CircuitComponent, windSpeed: number, delta: number) => {
    // Rotation speed proportional to wind speed level (0 to 5)
    const targetRotSpeed = windSpeed * 2.2;
    currentRotSpeed = THREE.MathUtils.lerp(currentRotSpeed, targetRotSpeed, 0.04);
    rotorGroup.rotation.z += currentRotSpeed * delta;
  };

  return group;
}
