import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { MATERIALS } from '../materials';
import { CircuitComponent } from '../../types';

export interface BuzzerObject extends THREE.Group {
  updateBuzzerState: (comp: CircuitComponent, delta: number) => void;
}

export function createBuzzerMesh(comp: CircuitComponent): BuzzerObject {
  const group = new THREE.Group() as BuzzerObject;
  group.name = comp.id;
  group.position.set(...comp.position);

  // Insulated base platform with soft rounded corners
  const baseGeo = new RoundedBoxGeometry(1.2, 0.12, 1.0, 4, 0.06);
  const baseMesh = new THREE.Mesh(baseGeo, MATERIALS.plasticLightBlue);
  baseMesh.position.y = 0.06;
  baseMesh.castShadow = true;
  baseMesh.receiveShadow = true;
  group.add(baseMesh);

  // Cylindrical Piezo Buzzer Can (Black plastic housing)
  const canGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.45, 24);
  const canMesh = new THREE.Mesh(canGeo, MATERIALS.plasticDark);
  canMesh.position.y = 0.32;
  canMesh.castShadow = true;
  group.add(canMesh);

  // Center top sound aperture hole (Small dark inset hole)
  const holeGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.06, 16);
  const holeMat = new THREE.MeshBasicMaterial({ color: 0x09090b });
  const holeMesh = new THREE.Mesh(holeGeo, holeMat);
  holeMesh.position.y = 0.54;
  group.add(holeMesh);

  // Top speaker diaphragm grill ring
  const grillGeo = new THREE.TorusGeometry(0.24, 0.02, 8, 20);
  const grillMat = MATERIALS.metalSilver;
  const grillMesh = new THREE.Mesh(grillGeo, grillMat);
  grillMesh.rotation.x = Math.PI / 2;
  grillMesh.position.y = 0.54;
  group.add(grillMesh);

  // Animated Sound Wave Halos (Expand when buzzer is sounding)
  const waveMat = new THREE.MeshBasicMaterial({
    color: 0x06b6d4,
    transparent: true,
    opacity: 0.0,
    side: THREE.DoubleSide,
  });
  const wave1 = new THREE.Mesh(new THREE.RingGeometry(0.18, 0.28, 24), waveMat);
  wave1.rotation.x = -Math.PI / 2;
  wave1.position.y = 0.6;
  group.add(wave1);

  const wave2 = new THREE.Mesh(new THREE.RingGeometry(0.32, 0.42, 24), waveMat.clone());
  wave2.rotation.x = -Math.PI / 2;
  wave2.position.y = 0.72;
  group.add(wave2);

  // Terminal connection posts
  comp.terminals.forEach((term) => {
    const postGroup = new THREE.Group();
    postGroup.name = `terminal::${comp.id}::${term.id}`;
    postGroup.position.set(...term.relativePosition);

    const isPos = term.polarity === 'positive' || term.id === 'pos';
    const baseColor = isPos ? MATERIALS.plasticRed : MATERIALS.plasticDark;

    const postBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.09, 0.1, 16),
      baseColor
    );
    postBase.position.y = 0.05;
    postGroup.add(postBase);

    const postTop = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 16, 12),
      MATERIALS.metalBrass
    );
    postTop.position.y = 0.14;
    postGroup.add(postTop);

    // Glowing selection halo
    const haloGeo = new THREE.TorusGeometry(0.16, 0.03, 8, 20);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.9,
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    haloMesh.rotation.x = Math.PI / 2;
    haloMesh.position.y = 0.14;
    haloMesh.name = `halo::${comp.id}::${term.id}`;
    haloMesh.visible = false;
    postGroup.add(haloMesh);

    group.add(postGroup);
  });

  let waveTimer = 0;
  group.updateBuzzerState = (updatedComp: CircuitComponent, delta: number) => {
    const isBeeping = !!updatedComp.state.isBeeping;
    if (isBeeping) {
      waveTimer += delta * 6.0;
      const pulse1 = (Math.sin(waveTimer) + 1) * 0.5;
      const pulse2 = (Math.sin(waveTimer + Math.PI / 2) + 1) * 0.5;

      (wave1.material as THREE.MeshBasicMaterial).opacity = pulse1 * 0.75;
      (wave2.material as THREE.MeshBasicMaterial).opacity = pulse2 * 0.55;
      wave1.scale.setScalar(1 + pulse1 * 0.25);
      wave2.scale.setScalar(1 + pulse2 * 0.35);
    } else {
      (wave1.material as THREE.MeshBasicMaterial).opacity = 0;
      (wave2.material as THREE.MeshBasicMaterial).opacity = 0;
    }
  };

  return group;
}
