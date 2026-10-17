import * as THREE from 'three';
import { MATERIALS } from '../materials';
import { CircuitComponent } from '../../types';

export interface MotorFanObject extends THREE.Group {
  updateMotorState: (comp: CircuitComponent, delta: number) => void;
}

export function createMotorFanMesh(comp: CircuitComponent): MotorFanObject {
  const group = new THREE.Group() as MotorFanObject;
  group.name = comp.id;
  group.position.set(...comp.position);

  const isFan = comp.type === 'fan';

  // Base mounting bracket
  const baseGeo = new THREE.BoxGeometry(1.2, 0.12, 0.8);
  const baseMesh = new THREE.Mesh(baseGeo, MATERIALS.plasticLightBlue);
  baseMesh.position.y = 0.06;
  baseMesh.castShadow = true;
  baseMesh.receiveShadow = true;
  group.add(baseMesh);

  // Motor cylindrical body (DC Can)
  const motorCanGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.65, 24);
  const motorCanMesh = new THREE.Mesh(motorCanGeo, MATERIALS.metalSilver);
  motorCanMesh.rotation.x = Math.PI / 2;
  motorCanMesh.position.set(0, 0.38, -0.05);
  motorCanMesh.castShadow = true;
  group.add(motorCanMesh);

  // Motor front plate (Plastic cap)
  const capGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.08, 24);
  const capMesh = new THREE.Mesh(capGeo, MATERIALS.plasticBlue);
  capMesh.rotation.x = Math.PI / 2;
  capMesh.position.set(0, 0.38, 0.28);
  group.add(capMesh);

  // Rotating Shaft Group
  const rotorGroup = new THREE.Group();
  rotorGroup.position.set(0, 0.38, 0.32);

  // Steel output axle shaft
  const shaftGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.25, 12);
  const shaftMesh = new THREE.Mesh(shaftGeo, MATERIALS.metalBrass);
  shaftMesh.rotation.x = Math.PI / 2;
  shaftMesh.position.z = 0.08;
  rotorGroup.add(shaftMesh);

  if (isFan) {
    // Center spinner nose cone
    const noseGeo = new THREE.ConeGeometry(0.12, 0.18, 16);
    const noseMesh = new THREE.Mesh(noseGeo, MATERIALS.plasticYellow);
    noseMesh.rotation.x = Math.PI / 2;
    noseMesh.position.z = 0.22;
    rotorGroup.add(noseMesh);

    // 3 Aerodynamic curved fan blades
    for (let i = 0; i < 3; i++) {
      const bladeAngle = (i * Math.PI * 2) / 3;
      const bladeArm = new THREE.Group();
      bladeArm.rotation.z = bladeAngle;

      // Blade geometry: tapered tear-drop shape
      const bladeShape = new THREE.Shape();
      bladeShape.moveTo(0, 0.08);
      bladeShape.quadraticCurveTo(0.12, 0.28, 0.16, 0.52);
      bladeShape.quadraticCurveTo(0, 0.65, -0.16, 0.52);
      bladeShape.quadraticCurveTo(-0.12, 0.28, 0, 0.08);

      const extrudeSettings = {
        depth: 0.02,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 1,
        bevelSize: 0.01,
        bevelThickness: 0.01,
      };

      const bladeGeo = new THREE.ExtrudeGeometry(bladeShape, extrudeSettings);
      const bladeMat = i % 2 === 0 ? MATERIALS.plasticLightBlue : MATERIALS.plasticGreen;
      const bladeMesh = new THREE.Mesh(bladeGeo, bladeMat);
      bladeMesh.rotation.x = 0.25; // Aerodynamic pitch angle!
      bladeMesh.position.z = 0.16;
      bladeMesh.castShadow = true;
      bladeArm.add(bladeMesh);

      rotorGroup.add(bladeArm);
    }
  } else {
    // For pure motor without fan: indicator wheel with colored notch
    const wheelGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.06, 16);
    const wheelMesh = new THREE.Mesh(wheelGeo, MATERIALS.plasticYellow);
    wheelMesh.rotation.x = Math.PI / 2;
    wheelMesh.position.z = 0.2;
    rotorGroup.add(wheelMesh);

    const notchGeo = new THREE.BoxGeometry(0.06, 0.16, 0.08);
    const notchMesh = new THREE.Mesh(notchGeo, MATERIALS.plasticRed);
    notchMesh.position.set(0.08, 0.08, 0.2);
    rotorGroup.add(notchMesh);
  }

  group.add(rotorGroup);

  // Terminal connection posts
  comp.terminals.forEach((term) => {
    const postGroup = new THREE.Group();
    postGroup.name = `terminal::${comp.id}::${term.id}`;
    postGroup.position.set(...term.relativePosition);

    const pGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.18, 16);
    const pMesh = new THREE.Mesh(pGeo, MATERIALS.metalBrass);
    pMesh.castShadow = true;
    postGroup.add(pMesh);

    const capGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.05, 16);
    const capMesh = new THREE.Mesh(capGeo, MATERIALS.plasticDark);
    capMesh.position.y = 0.1;
    postGroup.add(capMesh);

    const haloGeo = new THREE.RingGeometry(0.12, 0.18, 16);
    const haloMesh = new THREE.Mesh(haloGeo, MATERIALS.terminalHighlight);
    haloMesh.rotation.x = -Math.PI / 2;
    haloMesh.position.y = 0.13;
    haloMesh.visible = false;
    haloMesh.name = `halo::${comp.id}::${term.id}`;
    postGroup.add(haloMesh);

    group.add(postGroup);
  });

  let currentSpeed = 0;

  group.updateMotorState = (currentComp: CircuitComponent, delta: number) => {
    const isSpinning = currentComp.state.isSpinning ?? false;
    const targetSpeed = isSpinning ? (currentComp.state.speed ?? 1.0) * 18 : 0;

    // Smooth inertia acceleration & deceleration
    currentSpeed = THREE.MathUtils.lerp(currentSpeed, targetSpeed, 0.08);
    rotorGroup.rotation.z += currentSpeed * delta;
  };

  return group;
}
